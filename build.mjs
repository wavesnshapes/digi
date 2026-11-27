import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const s=n=>readFileSync(new URL('./src/'+n,import.meta.url),'utf8');
const head='// digi: generated from src/ by build.mjs. Edit the sources, not this file.\n"use strict";\n';
const out=new URL('./plugins/digi/hooks/',import.meta.url);mkdirSync(out,{recursive:true});
writeFileSync(new URL('sprite.js',out),head+[s('data.js'),s('make.js'),s('plays.js'),s('sprite-glue.js'),s('fx.js'),s('att.js'),s('engine.js'),s('sprite-view.js')].join('\n'));
writeFileSync(new URL('register.js',out),head+[s('data.js'),s('make.js'),s('plays.js'),s('sprite-glue.js'),s('fx.js'),s('att.js'),s('engine.js'),s('prompt.js'),s('register-main.js')].join('\n'));
// the OpenCode plugin: a terminal UI part that draws the digi, and a server part that only gives the package an id
const oc=new URL('./opencode/',import.meta.url);mkdirSync(oc,{recursive:true});
const ochead='// digi for OpenCode: generated from src/ by build.mjs. Edit the sources, not this file.\n// @ts-nocheck\nimport { Plugin } from "@opencode/plugin/tui"\nimport { BoxRenderable, RGBA } from "@opentui/core"\n';
writeFileSync(new URL('tui.ts',oc),ochead+[s('data.js'),s('make.js'),s('plays.js'),s('sprite-glue.js'),s('fx.js'),s('att.js'),s('prompt.js'),s('oc-main.js')].join('\n'));
writeFileSync(new URL('index.ts',oc),'// digi for OpenCode: the server part. The digi itself is the terminal UI part in tui.ts.\nimport { Plugin } from "@opencode/plugin"\n\nexport default Plugin.define({ id: "wavesnshapes.digi", setup() {} })\n');
console.log('built');

// OpenCode Desktop: the desktop app's own page (src/app.html), mounted inside the OpenCode window. Every change to the
// app's text is listed here and must apply, so an edit to the app that this no longer fits fails the build.
{
  const page=s('app.html');
  const cut=(a,b)=>{const i=page.indexOf(a),j=page.indexOf(b,i+a.length);if(i<0||j<0)throw new Error('app.html: missing '+a);return page.slice(i+a.length,j)};
  const rep=(t,from,to,n)=>{const parts=t.split(from);if(parts.length-1!==(n||1))throw new Error('app.html: expected '+(n||1)+' of '+JSON.stringify(from.slice(0,60))+', found '+(parts.length-1));return parts.join(to)};
  let css=cut('<style>','</style>'), html=cut('<body>','<script>'), js=cut('<script>\n','</script></body>'.replace('</body>',''));
  // the font goes in the document itself: a font declared inside a shadow tree is ignored
  const fi=css.indexOf('@font-face'), fj=css.indexOf('}',fi)+1;
  const font=css.slice(fi,fj);css=css.slice(0,fi)+css.slice(fj);
  css=rep(css,':root{',':host{');
  css=rep(css,'html,body{height:100%}','');
  css=rep(css,'body{margin:0;background:#150a45;color:var(--ink);font:13px/1.4 Tahoma,Verdana,Geneva,sans-serif;overflow:hidden;user-select:none}',
    '.dgapp{color:var(--ink);font:13px/1.4 Tahoma,Verdana,Geneva,sans-serif;text-align:left;user-select:none;-webkit-user-select:none}');
  css=rep(css,'app-region:drag;-webkit-app-region:drag','',2);
  css+=`
/* inside OpenCode: only the digi's body takes the pointer, the rest of its box lets clicks through */
#pet{z-index:1;pointer-events:none}
#cv{pointer-events:none;cursor:default}
#hit{position:absolute;left:17%;right:17%;top:9%;bottom:6%;cursor:grab;touch-action:none;pointer-events:auto;-webkit-app-region:no-drag}
#hit.drag{cursor:grabbing}
#stage #pet{position:relative;left:0!important;top:0!important}
#stage #hit{cursor:pointer;z-index:7}
#gear{-webkit-app-region:no-drag}
#picker{z-index:10;background:rgba(5,3,12,.72);pointer-events:auto;-webkit-app-region:no-drag}
.modal{pointer-events:auto;-webkit-app-region:no-drag}
`;
  html=rep(html,'<canvas id="cv" width="640" height="640" role="button" tabindex="0" aria-label="Your digi. Press to interact"></canvas>',
    '<canvas id="cv" width="640" height="640" aria-hidden="true"></canvas><div id="hit" role="button" aria-label="Your digi. Press to interact"></div>');
  html=rep(html,'Let Claude speak for it','Let the model speak for it');
  html=rep(html,'<label class="opt"><input type="checkbox" id="oSess">','<label class="opt" hidden><input type="checkbox" id="oSess">');
  html=rep(html,'<label class="opt"><input type="checkbox" id="oTie">','<label class="opt" hidden><input type="checkbox" id="oTie">');
  html=rep(html,'digi.directory - companion','digi.directory - companion for OpenCode');
  html=rep(html,'<label class="opt" hidden><input type="checkbox" id="oSess">','<label class="opt"><input type="checkbox" id="oChat"><span>Let it read my open chat<small id="oChatNote"></small></span></label>\n        <label class="opt" hidden><input type="checkbox" id="oSess">');

  js=rep(js,'const $=id=>document.getElementById(id);','const $=id=>root.getElementById(id);');
  js=rep(js,'const cv=$("cv"), vctx=cv.getContext("2d");','const cv=$("cv"), vctx=cv.getContext("2d"), hit=$("hit");');
  js=rep(js,'cv.addEventListener(','hit.addEventListener(',8);
  js=rep(js,'cv.setPointerCapture(','hit.setPointerCapture(');
  js=rep(js,'cv.classList.','hit.classList.',2);
  js=rep(js,'cv.setAttribute(','hit.setAttribute(');
  // saved through OpenCode's own store for the plugin
  js=rep(js,'JSON.parse(localStorage.getItem(KEY)||"{}")','JSON.parse(host.load()||"{}")');
  js=rep(js,'localStorage.setItem(KEY,JSON.stringify(state))','host.save(JSON.stringify(state))');
  js=rep(js,'sessions:false,size:190,pos:null','sessions:false,size:150,pos:null');
  js=rep(js,'function frame(now){\n  requestAnimationFrame(frame);','function frame(now){\n  if(dead)return;requestAnimationFrame(frame);');
  js=rep(js,'document.body.classList.','app.classList.',3);
  js=rep(js,'document.body.insertBefore(','app.insertBefore(');
  js=rep(js,'document.documentElement.style.setProperty(','app.style.setProperty(');
  js=rep(js,'document.addEventListener("keydown"','onDoc("keydown"');
  js=rep(js,'window.addEventListener("resize"','onWin("resize"');
  js=rep(js,'document.activeElement','root.activeElement');
  // it sits in the bottom right corner, and stays in that corner when the window changes size, until it is dragged somewhere
  js=rep(js,'if(!state.pos)state.pos={x:(W-state.size)/2,y:(Hh-boxH())/2};','if(!state.pos||!state.moved)state.pos={x:W-state.size-6,y:Hh-boxH()-6};');
  js=rep(js,'else{state.pos={x:drag.px+tx,y:drag.py+ty};placePet()}','else{state.moved=true;state.pos={x:drag.px+tx,y:drag.py+ty};placePet()}');
  // no first screen to get through: one hatches, and the generator is a click or /digi away
  js=rep(js,'if(state.seed!==null){setDigi(state.seed);$("pet").hidden=false}else openPicker();',
    'let hatched=false;if(state.seed===null){const s0=newSeed();state.seed=s0;state.hist=[s0];save();hatched=true}\nsetDigi(state.seed);$("pet").hidden=!!state.hidden;if(hatched)sayLine("click me. drag me",false);');
  js=rep(js,'syncOptions();sizeFor("picker");\n}','syncOptions();sizeFor("picker");$("gen").focus({preventScroll:true});\n}');
  js=rep(js,'setDigi(state.seed);sizeFor("pet");\n}','setDigi(state.seed);sizeFor("pet");$("pet").hidden=!!state.hidden;\n}');
  js=rep(js,"WHERE YOU ARE: you live in a small window on your owner's desktop as a companion, not in a battle.","WHERE YOU ARE: you float inside your owner's OpenCode window, the app they write code in with an AI, as a companion, not in a battle.");
  js=rep(js,'"Its lines come from Claude on your account and show on its face. Off: it only uses its stock phrases."','"Its lines are written by the model your session is set to, and that costs what that model costs. Off: it only uses its stock phrases."');
  js=rep(js,'"Here it floats inside this page. Installed as an app, it floats on top of your screen with no window around it."','"It floats inside the OpenCode window. Drag it by its body. Type /digi to come back here."');
  js=rep(js,'let out="WORLD CONTEXT\\nLocal time: "+clock()+".";','let out="WORLD CONTEXT\\nLocal time: "+clock()+".";\n  if(state.chat){const c=chatExcerpt();if(c)out+="\\n\\nTHE CHAT YOUR OWNER HAS OPEN WITH THEIR CODING AI RIGHT NOW (latest messages, trimmed). Talk about what they are doing in it:\\n"+c}\n  if(turnHint){out+="\\n\\n"+turnHint;turnHint=""}');
  // the part that waits for Claude's own app features is replaced by the wrapper's ending
  const tail=js.indexOf('// capabilities arrive later');if(tail<0)throw new Error('app.html: missing the capabilities block');
  js=js.slice(0,tail);
  const q=x=>JSON.stringify(x);
  const gui=s('oc-gui.js').replace('/*@FONT@*/""',()=>q(font)).replace('/*@CSS@*/""',()=>q(css)).replace('/*@HTML@*/""',()=>q(html.trim())).replace('/*@APP@*/',()=>js);
  writeFileSync(new URL('gui-experimental.cjs',oc),'// digi for OpenCode Desktop: generated from src/app.html and src/oc-gui.js by build.mjs. Edit the sources, not this file.\n'+gui);
  console.log('built the OpenCode Desktop part');
}
