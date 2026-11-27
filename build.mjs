import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const s=n=>readFileSync(new URL('./src/'+n,import.meta.url),'utf8');
const head='// digi: generated from src/ by build.mjs. Edit the sources, not this file.\n"use strict";\n';
const out=new URL('./plugins/digi/hooks/',import.meta.url);mkdirSync(out,{recursive:true});
writeFileSync(new URL('sprite.js',out),head+[s('data.js'),s('make.js'),s('plays.js'),s('sprite-glue.js'),s('fx.js'),s('att.js'),s('engine.js'),s('sprite-view.js')].join('\n'));
writeFileSync(new URL('register.js',out),head+[s('data.js'),s('make.js'),s('plays.js'),s('sprite-glue.js'),s('fx.js'),s('att.js'),s('engine.js'),s('prompt.js'),s('register-main.js')].join('\n'));
console.log('built');
