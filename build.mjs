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
