const rp=a=>a[Math.floor(Math.random()*a.length)];

function fx(d,t,k,I,front){
  const h=d.h, ty=d.ti;
  if(ty===0&&!front){
    for(let n=0;n<3;n++){const rad=(t*7+n*5)%15;ctx.fillStyle=`hsla(${h},100%,75%,${(1-rad/15)*I})`;
      for(let s=0;s<48;s++){const a=s/48*Math.PI*2;P(11.5+Math.cos(a)*rad,2+Math.sin(a)*rad*.85)}}
  }else if(ty===1&&front){
    const cnt=6+Math.floor(44*k), step=Math.floor(t*12);
    for(let i=0;i<cnt;i++){ctx.fillStyle=i%3?`hsla(${h},100%,78%,.8)`:"rgba(255,255,255,.85)";P(hsh(i,step)*23,hsh(i+50,step)*23)}
  }else if(ty===2){
    ctx.font=`${Math.round(CELL*1.5)}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";
    for(let i=0;i<8;i++){const a=t*1.2+i*Math.PI/4, sn=Math.sin(a);if((sn>0)!==front)continue;
      ctx.fillStyle=`hsla(${h},100%,78%,${front?.3+.7*I:.4})`;
      ctx.fillText("01AF#7E9"[(i+Math.floor(k*t*6))%8],OX+(12+Math.cos(a)*(10+k))*CELL,OX+(13+sn*4)*CELL)}
  }else if(ty===3){
    for(let i=0;i<4;i++){const a=t*.9+i*Math.PI/2, sn=Math.sin(a);if((sn>0)!==front)continue;
      const x=11+Math.cos(a)*10.5,y=12+sn*5;ctx.fillStyle=`hsla(${h},90%,${front?62:38}%,${front?.95:.7})`;P(x,y,2,3);
      ctx.fillStyle=`hsla(${h},100%,85%,${.4+.6*I})`;P(x,y,2,1)}
    if(front&&k>.05){ctx.fillStyle=`hsla(${h},100%,80%,${k})`;const st=Math.floor(t*10);
      for(let i=0;i<24;i++)if((i+st)%4<2){P(i,0);P(23-i,23);P(0,23-i);P(23,i)}}
  }else if(ty===4&&front){
    [0,2,20,22].forEach((c,i)=>{const hg=Math.round((2+hsh(i,7)*7)*k);
      if(hg>0){ctx.fillStyle=`hsl(${h},90%,55%)`;P(c,24-hg,2,hg);ctx.fillStyle=`hsl(${h},100%,82%)`;P(c,24-hg,2,1)}
      else{ctx.fillStyle=`hsla(${h},90%,60%,.55)`;P(c,23-((Math.floor(t*5)+i)%2))}});
    if(k>.05){ctx.fillStyle=`hsla(${h},100%,85%,${k})`;P(0,23,24,1)}
  }else if(ty===5){
    const n=k>.1?26:10;
    for(let i=front?0:1;i<n;i+=2){const sp=3+hsh(i,1)*6, y=24-((t*sp+hsh(i,2)*24)%26), x=hsh(i,3)*23+Math.sin(t*2+i);
      ctx.fillStyle=`hsla(${10+hsh(i,4)*40},100%,60%,${(.3+.7*k)*Math.max(.15,y/24)})`;P(x,y)}
  }else if(ty===6&&!front){
    ctx.save();ctx.beginPath();ctx.rect(OX,OX,TS,TS);ctx.clip();
    [-1,1,-2,2].forEach((s,i)=>{if(i>1&&k<.3)return;ctx.globalAlpha=(i>1?.14:.18)+.3*k;ctx.drawImage(off,s*(1+k*3)*CELL,0)});
    ctx.restore();ctx.globalAlpha=1;
  }
}
function fxGlitch(d,t,k){
  const h=d.h, st=Math.floor(t*8);
  for(let b=0;b<3+Math.floor(k*4);b++)if(hsh(b+9,st)<.3+k*.6){ctx.fillStyle=`hsla(${(h+180)%360},100%,60%,.38)`;P(0,hsh(b,st)*23,24,1+Math.floor(hsh(b,3)*2))}
  const n=4+Math.floor(k*26), cols=["#f0f","#0ff","#ff0","#fff"];
  for(let i=0;i<n;i++){ctx.fillStyle=cols[i%4];P(hsh(i,st+3)*22,hsh(i+20,st)*23,2,1)}
}
// Every move and finisher gets its own animation, generated from its name.
// Words in the name choose a pattern family (a storm rains, a wave ripples, a smash stacks blocks);
// names with no known word fall back to a hash. The hash then sets count, direction, shape and tint.
const PATTERNS=["rings","beam","rain","spiral","pillars","slashes","wave","static","stack","grid","dissolve","orbit","zap","sweep","converge","checker","bars","fork","shock"];
const WORDS=[
  [/flood|wave|carrier|hiss|duplex/,"wave"],[/storm|spray|rain|salvo|strike/,"rain"],[/ping|pulse|sound|feedback|loop/,"rings"],
  [/static|panic|white|screen|noise/,"static"],[/rot|decay|leak|dropout|melt|half/,"dissolve"],[/smash|stack|weight|boot|reset/,"stack"],
  [/fork|branch/,"fork"],[/slam|bash|quake|wall/,"shock"],[/claw|bite|slash|cut|shred|scissor|\bedge|clash/,"slashes"],
  [/pointer|cannon|rail|shot|force/,"beam"],[/surge|spike|hit|circuit|overload|short/,"zap"],[/swap|swarm|orbit|dogfight|key/,"orbit"],
  [/hex|overfit|layer|lock|jitter/,"grid"],[/recall|embed|collect|handshake|collapse/,"converge"],[/vector|dream|lucid/,"spiral"],
  [/knowledge|private|clip|out/,"checker"],[/max|bass|warm|rate/,"bars"],[/scan|sweep|kill|switch|total/,"sweep"]
];
function nameHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function patternFor(name,skip){
  const low=name.toLowerCase();
  if(!skip)for(const w of WORDS)if(w[0].test(low))return w[1];
  const pool=PATTERNS.filter(x=>x!==skip);return pool[nameHash(name+"#")%pool.length];
}
function drawPattern(pat,d,hh,t,k,p,front){
  const r=mulberry32(hh), n=4+Math.floor(r()*6), hue=d.h+(Math.floor(r()*3)-1)*28, spin=r()*6.283, alt=r()<.5, v=hh>>>3, st=Math.floor(t*12);
  const cx=11.5, cy=(d.scr.y0+d.scr.y1)/2, col=(l,a)=>`hsla(${hue},100%,${l}%,${Math.max(0,Math.min(1,a))})`, wh=a=>`rgba(255,255,255,${Math.max(0,Math.min(1,a))})`;
  if(front===(pat==="rings"||pat==="spiral"||pat==="grid"))return;
  if(pat==="rings"){
    for(let j=0;j<1+v%3;j++){const rad=((p*1.3+j*.22)%1)*14;ctx.fillStyle=col(75,k);
      if(alt){const q=Math.round(rad);for(let i=-q;i<=q;i++){P(cx+i,cy-q);P(cx+i,cy+q);P(cx-q,cy+i);P(cx+q,cy+i)}}
      else for(let s=0;s<44;s++){const a=s/44*6.283;P(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad)}}
  }else if(pat==="beam"){
    const th=1+v%3,row=d.scr.y0+1+v%2,len=Math.min(24,p*60);
    for(let j=0;j<th;j++)for(let x=0;x<len;x++){ctx.fillStyle=(x+st+j)%3===0?wh(k):col(70,k);if(alt){P(12+x,row+j);P(11-x,row+j)}else P(d.scr.x1+1+x,row+j)}
  }else if(pat==="rain"){
    const slant=alt?0:(v%2?.5:-.5);
    for(let i=0;i<n+7;i++){const x=Math.floor(r()*30)-3,sp=.8+r(),y=((p*sp*30+r()*24)%28)-2;
      ctx.fillStyle=wh(k);P(x+y*slant,y);ctx.fillStyle=col(65,k*.8);P(x+(y-1)*slant,y-1);ctx.fillStyle=col(50,k*.5);P(x+(y-2)*slant,y-2)}
  }else if(pat==="spiral"){
    const arms=2+v%2;
    for(let q=0;q<26;q++){const a=spin+p*6+q*.28,rad=q*.55*Math.min(1,p*2);ctx.fillStyle=col(60+q,k*(q/26+.3));
      for(let m=0;m<arms;m++)P(cx+Math.cos(a+m*6.283/arms)*rad,cy+Math.sin(a+m*6.283/arms)*rad)}
  }else if(pat==="pillars"){
    for(let i=0;i<n;i++){const c=Math.floor(r()*23),hg=Math.round((3+r()*9)*k);if(hg<1)continue;ctx.fillStyle=col(58,1);P(c,24-hg,1,hg);ctx.fillStyle="#fff";P(c,24-hg)}
  }else if(pat==="slashes"){
    const len=Math.min(24,p*44);
    for(let j=0;j<2+v%3;j++){const o=Math.round(r()*14-7),dir=j%2?1:-1;
      for(let q=0;q<len;q++){ctx.fillStyle=q>len-3?wh(k):col(68,k*(q/len));P(12+o+dir*(q-12),q)}}
  }else if(pat==="wave"){
    const m=1+v%3;
    for(let j=0;j<m;j++){const amp=2+r()*3,fr=.3+r()*.4,y0=cy+(j-(m-1)/2)*5;
      for(let x=0;x<Math.min(24,p*40);x++){const xx=alt?x:23-x;ctx.fillStyle=x%4===0?wh(k):col(70,k);P(xx,y0+Math.sin(x*fr+t*8+j)*amp)}}
  }else if(pat==="static"){
    for(let i=0;i<Math.floor(240*k);i++){ctx.fillStyle=i%3?wh(.55*k):col(70,.7*k);P(hsh(i,st)*24,hsh(i+7,st)*24)}
    ctx.fillStyle=wh(.35*k);P(0,(t*14)%24,24,2);
  }else if(pat==="stack"){
    const fade=p>.85?(1-p)/.15:1;
    for(let i=0;i<Math.min(6,n);i++){const c=1+Math.floor(r()*21),hg=2+Math.floor(r()*5);
      for(let j=0;j<hg;j++){const tj=i*.07+j*.09;if(p<tj)continue;const y=Math.min(23-j,(p-tj)*70-2),landed=y===23-j;
        ctx.fillStyle=landed?col(48+j*6,fade):wh(fade);P(c,y,2,1)}}
  }else if(pat==="grid"){
    const step=3+v%3,reach=p*48;
    for(let x=0;x<24;x++)for(let y=0;y<24;y++){const lx=x%step===0,ly=y%step===0;if(!lx&&!ly)continue;if((alt?x+y:Math.max(x,y))>reach)continue;ctx.fillStyle=lx&&ly?wh(k):col(60,k*.75);P(x,y)}
  }else if(pat==="dissolve"){
    const rise=Math.min(1,p*1.5);
    for(let i=0;i<150;i++){const x=Math.floor(hsh(i,hh%97+1)*24),y=23-Math.floor(hsh(i,hh%89+2)*24*rise);ctx.fillStyle=i%4===0?wh(k):i%2?col(30,k):col(62,k);P(x,y)}
    for(let i=0;i<5;i++){const x=Math.floor(r()*24),len=Math.floor(r()*8*k);ctx.fillStyle=col(55,k);P(x,24-len,1,len)}
  }else if(pat==="orbit"){
    const m=2+v%3,ry=4+v%4;
    for(let i=0;i<m;i++)for(let tr=0;tr<5;tr++){const a=spin+t*7*(alt?1:-1)+i*6.283/m-tr*.16*(alt?1:-1);ctx.fillStyle=tr?col(72-tr*8,k*(1-tr*.2)):wh(k);P(cx+Math.cos(a)*10,cy+3+Math.sin(a)*ry,tr?1:2,tr?1:2)}
  }else if(pat==="zap"){
    for(let j=0;j<2+v%2;j++){const x0=3+r()*18;ctx.fillStyle=wh(k);zig(x0,0,0,2,12,st+j*17);ctx.fillStyle=col(70,k);P(x0-2,23,5,1)}
  }else if(pat==="sweep"){
    const x=alt?p*30-3:26-p*30;
    for(let tr=0;tr<6;tr++){ctx.fillStyle=tr?col(75-tr*7,k*(1-tr/6)):wh(k);P(x-(alt?tr:-tr),0,1,24)}
  }else if(pat==="converge"){
    for(let i=0;i<n+4;i++){const a=spin+i*6.283/(n+4);for(let tr=0;tr<3;tr++){const rad=(1-Math.min(1,p*1.25))*15+tr;ctx.fillStyle=tr?col(70-tr*12,k*(1-tr*.3)):wh(k);P(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad*.9)}}
    if(p>.8){const q=Math.round((p-.8)*40);ctx.fillStyle=wh(1-(p-.8)*5);for(let i=-q;i<=q;i++){P(cx+i,cy-q);P(cx+i,cy+q);P(cx-q,cy+i);P(cx+q,cy+i)}}
  }else if(pat==="checker"){
    const edge=p*62;
    for(let x=0;x<24;x++)for(let y=0;y<24;y++){const s2=alt?x+y:x+23-y;if(s2<edge&&s2>edge-12&&(x+y)%2===0){ctx.fillStyle=s2>edge-2?wh(k):col(62,k*.8);P(x,y)}}
  }else if(pat==="bars"){
    for(let i=0;i<12;i++){const hg=Math.round((.25+.75*Math.abs(Math.sin(t*9+i*1.3+spin)))*k*12);if(hg<1)continue;ctx.fillStyle=col(i%2?55:66,.9);P(i*2,24-hg,2,hg);ctx.fillStyle="#fff";P(i*2,24-hg,2,1)}
  }else if(pat==="fork"){
    const pts=[];
    (function grow(x,y,dir,depth){const len=3+Math.floor(r()*3);for(let q=0;q<len;q++){y-=1;x+=dir*.6;pts.push([x,y,depth])}
      if(depth<3&&y>1){grow(x,y,dir-1,depth+1);grow(x,y,dir+1,depth+1)}})(cx,24,0,0);
    const show=Math.floor(Math.min(1,p*1.6)*pts.length);
    for(let i=0;i<show;i++){ctx.fillStyle=i>show-4?wh(k):col(55+pts[i][2]*8,k);P(pts[i][0],pts[i][1])}
  }else if(pat==="shock"){
    const off=p*14;
    [-1,1].forEach(sd=>{for(let q=0;q<4;q++){const x=cx+sd*(off-q*1.3);if(sd*(x-cx)<0)continue;const hg=Math.max(1,4-q);ctx.fillStyle=q?col(65-q*8,k):wh(k);P(x,24-hg,1,hg)}
      for(let i=0;i<5;i++){const x=cx+sd*r()*off;ctx.fillStyle=col(50,k*.7);P(x,22-Math.floor(r()*3*k))}});
    ctx.fillStyle=col(70,k*.6);P(0,23,24,1);
  }
}
function fxMove(d,pl,t,k,p,front){
  const hh=nameHash(pl.name), big=pl.kind==="fin", pat=patternFor(pl.name);
  drawPattern(pat,d,hh,t,k,p,front);
  // finishers layer a second, different pattern over the first
  if(big)drawPattern(patternFor(pl.name,pat),d,hh>>>5,t,k*.8,p,front);
  if(front&&pl.att)fxAtt(d,pl.att,t,k,Math.max(.28,k),true);
  if(front&&big&&k>.8){ctx.fillStyle=`rgba(255,255,255,${(k-.8)*1.6})`;for(let y=0;y<24;y++)for(let x=y%2;x<24;x+=2)P(x,y)}
}


