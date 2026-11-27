// The digi inside OpenCode Desktop. build.mjs fills in the three constants and the app's own script from src/app.html,
// so the generator, the drawing, the drag, the clicks and the effects are the same code as the desktop app.
const { Plugin, Command, Style, Store } = require("@opencode/plugin/gui");
const { Schema } = require("effect");
const FONT_CSS = /*@FONT@*/"";
const CSS = /*@CSS@*/"";
const HTML = /*@HTML@*/"";

// host: { root, app, load(), save(json), sample(prompt) }
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
  sample = host.sample; syncOptions();
  return {
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
    let api;
    try {
      api = mount({ root, app: root.getElementById("app"), load: () => (store.value && store.value.json) || "", save: json => { try { store.set({ json }) } catch (e) {} }, sample });
    } catch (e) { el.remove(); throw e }
    ctx.add(Command, () => ({ id: "open", title: ctx.t("open"), keywords: "digi companion pet mascot", slash: { name: "digi" }, run: () => api.open() }));
    ctx.add(Command, () => ({ id: "toggle", title: ctx.t("toggle"), keywords: "digi companion pet mascot", run: () => api.toggle() }));
    return () => { api.dispose(); el.remove() };
  }
});
