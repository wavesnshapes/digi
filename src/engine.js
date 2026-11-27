
/* ================= one digi, frame by frame ================= */
// Shared by the drawing in cells (sprite.js) and the vector drawing the hooks module makes for the desktop widget.
const TICK=50, M=6, GW=BW+M*2, GH=BH+2;
const hex2=v=>{const n=Math.max(0,Math.min(255,Math.round(v)));return (n<16?"0":"")+n.toString(16)};
const hexOf=(r,g,b)=>"#"+hex2(r)+hex2(g)+hex2(b);
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
const wideCh=ch=>{const c=ch.codePointAt(0);return c>=0x1100&&(c<=0x115f||(c>=0x2e80&&c<=0xa4cf)||(c>=0xac00&&c<=0xd7a3)||(c>=0xf900&&c<=0xfaff)||(c>=0xfe30&&c<=0xfe4f)||(c>=0xff00&&c<=0xff60)||(c>=0xffe0&&c<=0xffe6))};
let cache=null;
function digiFor(seed){
  if(!cache||cache.seed!==seed){const d=makeDigi(seed>>>0);d.plays=buildPlays(d);cache={seed,d}}
  return cache.d;
}
function freshState(props){
  return {t:0,n:0,rx:2,by:0,posKey:"",drag:null,mvx:0,vx:0,lean:0,leanV:0,hx:0,hxV:0,gy:6,dizzy:0,
    blinkAt:2,blinkEnd:0,sayId:0,playId:0,speech:null,play:null,queue:[],idle:0,angry:false,angryUntil:-1,fightId:0,look:0,hoverAt:-99,dodgeAt:-99};
}

// Paints one frame into buf and returns {grid, face, bob}: grid is GW by GH color strings, or null where nothing shows
function compose(d,m,still){
  const t=still?1.1:m.t;
  curD=d;
  const play=m.play, pp=play?clampN((m.t-play.t0)/(play.dur/1000),0,1):0, k=play?Math.sin(pp*Math.PI):0, casting=k>.15;
  let face=d.face;
  if(casting||m.angry||(m.speech&&m.speech.loud))face={line:d.face.line,eyes:[">","<"],mouth:"皿",brow:null,cheek:null};
  else if(m.t<m.dizzy)face=Object.assign({},d.face,{eyes:["@","@"],mouth:"~"});
  else if(m.drag&&m.drag.moved)face=Object.assign({},d.face,{eyes:["O","O"],mouth:"o"});
  else if(!still&&m.t<m.blinkEnd)face=Object.assign({},d.face,{eyes:["-","-"]});
  if(d.rar===4&&!still&&Math.random()<.2){const g="#?%&"[Math.floor(Math.random()*4)];face=Object.assign({},face,Math.random()<.5?{mouth:g}:{eyes:[g,face.eyes[1]]})}
  let shift=null;
  if(d.rar===4&&!still&&Math.random()<.15){shift={};const y=3+Math.floor(Math.random()*17),s=Math.random()<.5?-1:1;for(let i=0;i<3;i++)shift[y+i]=s}
  const pulse=still?.3:Math.max(k,(Math.sin(t*4)+1)/4);

  buf.fill(0);
  const is=(kind,key)=>play&&play.kind===kind&&(key===undefined||play.key===key);
  const cast=front=>{
    if(d.rar>=2)d.ups.forEach(a=>{const kk=is("att",a)?k:0;fxAtt(d,a,t,kk,Math.max(.28,kk),front)});
    if(d.rar>=3){const kk=is("aura")?k:0;fx(d,t,kk,Math.max(.28,kk),front)}
    if(d.rar===4&&front)fxGlitch(d,t,is("glitch")?k:0);
    if(play&&(play.kind==="move"||play.kind==="fin"))fxMove(d,play,t,k,pp,front);
  };
  cast(false);
  for(let y=0;y<BH;y++){
    const rs=shift?(shift[y]||0):0;
    for(let x=0;x<BW;x++){
      const id=d.G[y][x];if(!id)continue;
      const c=d.rgb[y][x];let r=c[0],g=c[1],b=c[2];
      if(id===7||(id===3&&d.rar>=3)||(id===6&&d.rar>=2)){const q=pulse*(id===7?1:.55);r+=(255-r)*q;g+=(255-g)*q;b+=(255-b)*q}
      else if(id===11&&!still){r=255;g=110+Math.random()*130;b=30}
      const xx=x+rs;if(xx<0||xx>=BW)continue;
      const i=(y*BW+xx)*4;buf[i]=r;buf[i+1]=g;buf[i+2]=b;buf[i+3]=1;
    }
  }
  cast(true);

  // the swing: every row slides sideways by how far it is from the row it is held by, and the head lags a little more
  const bob=still||m.drag?1:Math.round(1+Math.sin(t*2.2)*.9);
  const shake=m.angry&&!still?(Math.floor(m.t*14)%2?1:-1):0;
  const rowShift=y=>clampN(Math.round(-m.lean*(y-m.gy)+(y<=12?m.hx:0))+shake,-M,M);
  const grid=[];for(let y=0;y<GH;y++)grid.push(new Array(GW).fill(null));
  for(let y=0;y<BH;y++){
    const sx=M+rowShift(y), gy=y+bob;
    for(let x=0;x<BW;x++){
      const i=(y*BW+x)*4;if(buf[i+3]<.34)continue;
      const gx=x+sx;if(gx<0||gx>=GW)continue;
      grid[gy][gx]=hexOf(buf[i],buf[i+1],buf[i+2]);
    }
  }
  const s=d.scr;
  return {grid,face,bob,look:casting||m.angry?0:m.look,scr:{x0:s.x0+M+rowShift(s.y0),x1:s.x1+M+rowShift(s.y0),y0:s.y0+bob,y1:s.y1+bob}};
}

// What is typed on the screen this frame, as [row, col, char] in text cells. cw is cells per pixel across, big is one row per pixel.
function faceCells(d,m,fr,cw,big,still){
  const s=fr.scr, f=fr.face, out=[], W=(s.x1-s.x0+1)*cw, c0=s.x0*cw;
  const rows=[];
  if(big){for(let y=s.y0;y<=s.y1;y++)rows.push(y)}
  else{for(let r=Math.ceil(s.y0/2);r*2+1<=s.y1;r++)rows.push(r);if(!rows.length)rows.push(Math.floor((s.y0+s.y1)/4))}
  const n=rows.length;
  const mouthRow=n>=4?rows[Math.min(n-1,Math.round(n*.72))]:rows[n-1];
  const eyesRow=n>=4?rows[Math.max(0,Math.round(n*.3))]:n>=2?rows[n-2]:rows[0];
  const one=eyesRow===mouthRow;
  const put=(row,col,str)=>{let x=col;for(const ch of Array.from(str)){const w=wideCh(ch)?2:1;if(x>=0&&x+w<=W)out.push([row,c0+x,ch,w]);x+=w}};
  const widthOf=str=>Array.from(str).reduce((a,ch)=>a+(wideCh(ch)?2:1),0);
  const sp=m.speech||null; // what it says is content, so it shows even when motion is reduced
  const ex=Math.max(one?0:1,Math.floor(W*(one?.12:.24)));
  if(!(sp&&one)){
    const lk=W>=7?fr.look*cw:0;put(eyesRow,ex+lk,f.eyes[0]);put(eyesRow,W-ex-widthOf(f.eyes[1])+lk,f.eyes[1]);
    if(f.brow&&n>=3&&!one){const br=rows[rows.indexOf(eyesRow)-1];if(br!==undefined){put(br,ex,f.brow[0]);put(br,W-ex-widthOf(f.brow[1]),f.brow[1])}}
  }
  if(sp){
    const chars=Array.from(sp.text), len=chars.length, el=m.t-sp.t0;
    if(len<=W-2){put(mouthRow,Math.floor((W-len)/2),sp.text);if(el>1.6+.08*len)sp.done=true}
    else{
      const o=Math.floor(el*9);
      for(let c=0;c<W;c++){const i=o-W+1+c;if(i>=0&&i<len&&chars[i]!==" ")out.push([mouthRow,c0+c,chars[i],1])}
      if(o>len+W)sp.done=true;
    }
  }else{
    const mo=m.think?(W>=5?"...":"."):f.mouth;
    put(mouthRow,Math.floor((W-widthOf(mo))/2),mo);
  }
  return out;
}

function advance(m,d,dt,surface){
  m.t+=dt;
  m.angry=m.t<m.angryUntil;
  if(m.play&&m.t-m.play.t0>m.play.dur/1000)m.play=null;
  if(!m.play&&m.queue.length){
    m.play=Object.assign({},m.queue.shift(),{t0:m.t});
    m.speech={text:(m.play.name+"!").toUpperCase(),loud:true,t0:m.t,done:false};
  }
  if(m.speech&&(m.speech.done||m.t-m.speech.t0>40))m.speech=null;
  if(m.t>m.blinkAt){m.blinkEnd=m.t+.15;m.blinkAt=m.t+2.2+Math.random()*3.6}
  // springs, fed by how far the pointer carried it since the last tick
  const ix=m.mvx/dt/BW;m.mvx=0;
  m.vx+=(ix-m.vx)*.5;
  m.leanV+=(170*(clampN(m.vx*.1,-.38,.38)-m.lean)-8*m.leanV)*dt;m.lean+=m.leanV*dt;
  m.hxV+=(110*(clampN(-m.vx*1.1,-3,3)-m.hx)-6.5*m.hxV)*dt;m.hx+=m.hxV*dt;
  if(Math.abs(m.lean)>.3)m.dizzy=m.t+1.3;
}
const lively=m=>!!m.drag||m.angry||!!m.play||!!m.speech||Math.abs(m.lean)>.02||Math.abs(m.leanV)>.1||Math.abs(m.hx)>.3||Math.abs(m.hxV)>1||m.t<m.dizzy;

