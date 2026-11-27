// The digi inside OpenCode Desktop. build.mjs fills in the three constants and the app's own script from src/app.html,
// so the generator, the drawing, the drag, the clicks and the effects are the same code as the desktop app.
const { Plugin, Command, Style, Store, createKeyed } = require("@opencode/plugin/gui");
const { onCleanup } = require("solid-js");
const { Schema } = require("effect");
const FONT_CSS = /*@FONT@*/"";
const CSS = /*@CSS@*/"";
const HTML = /*@HTML@*/"";

// host: { root, app, load(), save(json), sample(prompt), messages() }
function mount(host) {
  const root = host.root, app = host.app, offs = [];
  let dead = false;
  const onDoc = (t, f, o) => { document.addEventListener(t, f, o); offs.push(() => document.removeEventListener(t, f, o)) };
  const onWin = (t, f, o) => { window.addEventListener(t, f, o); offs.push(() => window.removeEventListener(t, f, o)) };
/*@APP@*/
  // ---- only in OpenCode ----
  // clicking it must not take the cursor out of the prompt
  hit.addEventListener("mousedown", e => { if (!studio) e.preventDefault() });
  $("picker").addEventListener("click", e => { if (e.target === $("picker")) closePicker() });
  onDoc("keydown", e => {
    if (e.key !== "Escape" || !studio || !$("ask").hidden || state.seed === null) return;
    e.preventDefault(); e.stopPropagation(); closePicker();
  }, true);
  // Reading the open chat. Off unless the owner turns it on. With it on, the last few messages of the chat on screen,
  // trimmed and with long codes blanked out, go into the request its own lines are written from. Nothing is kept.
  function chatExcerpt() {
    let list = []; try { list = host.messages() || [] } catch (e) {}
    const cutTo = (t, n) => { t = redact(String(t || "")); return t.length > n ? t.slice(0, n - 3) + "..." : t }, out = [];
    for (let i = list.length - 1; i >= 0 && out.length < 6; i--) {
      const m = list[i]; if (!m) continue;
      if (m.type === "user" && m.text) out.push("OWNER: " + cutTo(m.text, 260));
      else if (m.type === "assistant" && Array.isArray(m.content)) {
        const text = m.content.filter(c => c && c.type === "text" && c.text).map(c => c.text).join(" ");
        const tools = m.content.filter(c => c && c.type === "tool"), bad = tools.filter(c => c.state && c.state.status === "error").length;
        const note = tools.length ? " [used " + tools.length + " tool" + (tools.length > 1 ? "s" : "") + (bad ? ", " + bad + " failed" : "") + "]" : "";
        if (text || note) out.push("AI: " + cutTo(text, 260) + note);
      }
    }
    return out.reverse().join("\n").slice(0, 1700);
  }
  let turnHint = "", lastTurn = -1e9;
  const chatCount = () => { try { return (host.messages() || []).filter(m => m && (m.type === "user" || m.type === "assistant")).length } catch (e) { return 0 } };
  const syncChat = () => {
    $("oChat").checked = !!state.chat;
    $("oChatNote").textContent = (state.chat
      ? "On. When it speaks in its own words, the last few messages of the chat you have open go to your model with its request, trimmed. It also speaks up when a turn finishes. "
      : "Off: it knows nothing about your chat. On: the last few messages of the chat you have open go to your model with its request, trimmed, so it can talk about what you are doing. ")
      + "Right now it can see " + chatCount() + " messages in the open chat." + (state.speak ? "" : " Needs the setting above to be on.");
  };
  $("oChat").addEventListener("change", e => { state.chat = e.target.checked; save(); syncChat() });
  $("oSpeak").addEventListener("change", syncChat);
  $("opts").addEventListener("toggle", syncChat);
  sample = host.sample; syncOptions(); syncChat();
  return {
    // a turn of the open chat just ended: with chat reading on, it says something about it, at most once every 45 seconds
    turn(kind) {
      const now = performance.now();
      if (dead || !state.chat || !state.speak || state.hidden || studio || now - lastTurn < 45000) return;
      lastTurn = now;
      // it waits for a move or a line in the making to finish, for up to ten seconds; a line on screen is fine, the new one queues
      let tries = 0;
      const go = () => {
        if (dead || studio || angryUntil > 0) return;
        if (thinking || play || queue.length) { if (++tries < 14) setTimeout(go, 700); return }
        turnHint = kind === "ok" ? "WHAT JUST HAPPENED: the AI just finished a turn in that chat. React to how it went." : "WHAT JUST HAPPENED: the AI's turn in that chat just failed or was stopped. React to that.";
        askClaude();
      };
      setTimeout(go, 1200);
    },
    open() { if (!studio) openPicker() },
    toggle() { state.hidden = !state.hidden; save(); if (!studio) $("pet").hidden = !!state.hidden },
    dispose() { dead = true; clearInterval(coolTimer); clearTimeout(gearT); offs.forEach(f => f()) }
  };
}

module.exports.default = Plugin.define({
  stores: { state: Store.global(Schema.Struct({ json: Schema.String }), { json: "" }) },
  i18n: { en: { open: "Digi: generator and settings", toggle: "Digi: hide or show" } },
  setup(ctx) {
    if (typeof document === "undefined" || !document.body) return;
    ctx.add(Style, FONT_CSS);
    const el = document.createElement("div");
    el.id = "digi-companion";
    el.style.cssText = "all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000";
    const root = el.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style><div class=\"dgapp\" id=\"app\">" + HTML + "</div>";
    document.body.appendChild(el);
    const store = ctx.stores.state;
    // its lines are written by the model the open session is set to; no session is created for them
    const sample = async prompt => {
      const sc = ctx.screen.current(), m = sc && sc.composer && sc.composer.model ? sc.composer.model() : undefined;
      // a model that does not answer in ten seconds is treated as not there, and it uses its own phrases
      const out = await Promise.race([
        ctx.client.experimental.generate.text(m ? { prompt, model: { id: m.modelID, providerID: m.providerID } } : { prompt }),
        new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 10000))
      ]);
      return { text: (out && out.text) || "" };
    };
    // the messages of the chat on screen, as OpenCode already holds them for its own window
    const messages = () => { const s = ctx.sessions.current(); return s ? s.server.data.session.message.list(s.id) : [] };
    let api;
    try {
      api = mount({ root, app: root.getElementById("app"), load: () => (store.value && store.value.json) || "", save: json => { try { store.set({ json }) } catch (e) {} }, sample, messages });
    } catch (e) { el.remove(); throw e }
    ctx.add(Command, () => ({ id: "open", title: ctx.t("open"), keywords: "digi companion pet mascot", slash: { name: "digi" }, run: () => api.open() }));
    ctx.add(Command, () => ({ id: "toggle", title: ctx.t("toggle"), keywords: "digi companion pet mascot", run: () => api.toggle() }));
    // tell it when a turn of the open chat ends
    try {
      createKeyed(() => { const s = ctx.sessions.current(); return s ? s.server.data : undefined }, data => {
        const mine = e => { const s = ctx.sessions.current(); return !!(s && e && e.data && e.data.sessionID === s.id) };
        onCleanup(data.on("session.execution.succeeded", e => { if (mine(e)) api.turn("ok") }));
        onCleanup(data.on("session.execution.failed", e => { if (mine(e)) api.turn("bad") }));
        onCleanup(data.on("session.execution.interrupted", e => { if (mine(e)) api.turn("bad") }));
      });
    } catch (e) {}
    return () => { api.dispose(); el.remove() };
  }
});
