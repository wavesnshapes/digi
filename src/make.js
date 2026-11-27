
/* cell ids: 1 shell, 2 metal, 3 accent, 5 dark, 6 glow, 7 core, 10 screen, 11 flame */
function makeDigi(seed){
  const r=mulberry32(seed);
  const rf=(a,b)=>a+r()*(b-a), ri=(a,b)=>a+Math.floor(r()*(b-a+1));
  const pick=a=>a[Math.floor(r()*a.length)], chance=p=>r()<p;

  const rr=r(), rar = rr<.55?0 : rr<.82?1 : rr<.94?2 : rr<.99?3 : 4;
  const ti=ri(0,6), type=TYPES[ti], plan=pickFrame(r());

  let G=[];for(let y=0;y<H;y++)G.push(new Uint8Array(24));
  const set=(x,y,c)=>{if(x>=0&&x<24&&y>=0&&y<H)G[y][x]=c};
  const rect=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)set(x+i,y+j,c)};
  const m=(dx,y,w,h,c)=>{if(w<1||h<1)return;rect(12+dx,y,w,h,c);rect(12-dx-w,y,w,h,c)};

  // the set: every digi is a TV with something to carry it
  // the set always ends on row 12, so a shorter set sits lower and every body gets rows 13 to 23
  const hx=pick([5,6,7,8]), hh=ri(8,10), ht=13-hh, hb=12, tt=14, ao=ht-3;

  // upgrades come with rarity
  let pool=["cannon","blade","double blades","shield","speakers","drone","cables"]; const ups=[];
  const nUp = rar===2?1 : rar===3?2 : rar===4?ri(1,2) : 0;
  for(let i=0;i<nUp;i++){
    const u=pool.splice(Math.floor(r()*pool.length),1)[0];ups.push(u);
    // both hands are taken by double blades, and one blade rules out a second pair
    if(u==="double blades")pool=pool.filter(x=>x!=="blade"&&x!=="shield");
    if(u==="blade"||u==="shield")pool=pool.filter(x=>x!=="double blades");
  }

  // body, stamped from its frame
  const F=FRAMES[plan], opt=chance(.5), CH={M:2,S:1,A:3,D:5,G:6,F:11,C:7};
  let reach=0;
  F.t.forEach((row,j)=>{for(let dx=0;dx<12;dx++){const ch=row[dx];if(ch===".")continue;const up=ch.toUpperCase();if(ch!==up&&!opt)continue;m(dx,13+j,1,1,CH[up]);if(j>=1&&j<=3)reach=Math.max(reach,dx+1)}});
  const hand={x:12+F.hand[0],y:13+F.hand[1]};
  // chest detail, only painted onto cells the frame actually has
  const mIf=(dx,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)[12+dx+i,11-dx-i].forEach(x=>{if(G[y+j]&&G[y+j][x])G[y+j][x]=c})};
  const chest=pick(["core","panel","vents","plain"]), cy=13+F.chest, l1=ri(1,2), l2=ri(1,2);
  if(F.chest>=0){
    if(chest==="core")mIf(0,cy,1,2,7);
    else if(chest==="panel"){mIf(0,cy,2,2,5);if(G[cy][12-l1])G[cy][12-l1]=6;if(G[cy+1][11+l2])G[cy+1][11+l2]=6}
    else if(chest==="vents"){mIf(0,cy,2,1,5);mIf(0,cy+2,2,1,5)}
  }
  // speakers bolt on beside the upper hull, wherever its edge is
  if(ups.includes("speakers")){const sx=Math.min(8,reach);m(sx,13,3,4,2);m(sx+1,14,1,1,5);m(sx+1,16,1,1,6)}

  // head
  m(0,ht,hx,hh,1);
  if(chance(.4)){set(12-hx,ht,0);set(11+hx,ht,0);set(12-hx,hb,0);set(11+hx,hb,0)}
  const bz=chance(.4)?2:1, panel=hx>=7&&chance(.45);
  const sx0=12-hx+1, sy0=ht+1, sy1=hb-bz; let sx1=11+hx-1;
  if(panel)sx1-=3;
  rect(sx0,sy0,sx1-sx0+1,sy1-sy0+1,10);
  if(panel){rect(sx1+2,sy0,2,2,3);for(let y=sy0+3;y<=sy1;y++)if((y-sy0)%2)rect(sx1+2,y,2,1,5)}
  if(bz===2){set(sx0,hb-1,6);set(sx1,hb-1,5);set(sx1-1,hb-1,5)}
  const ar=r(), ant = ar<.3?"rabbit ears" : ar<.5?"mast" : ar<.65?"loop" : ar<.8?"handle" : ar<.9?"dish" : "no antenna";
  if(ant==="rabbit ears"){for(let i=0;i<3;i++){set(10-i,ao+2-i,2);set(13+i,ao+2-i,2)}set(8,ao,3);set(15,ao,3)}
  else if(ant==="mast"){m(0,ao+1,1,2,2);m(0,ao,1,1,6)}
  else if(ant==="loop"){m(0,ao,2,1,2);m(1,ao+1,1,1,2);m(0,ao+2,2,1,2)}
  else if(ant==="handle"){m(0,ao+1,3,1,2);m(2,ao+2,1,1,2)}
  else if(ant==="dish"){m(0,ao+2,1,1,2);rect(9,ao+1,6,1,3);set(8,ao,3);set(15,ao,3);m(0,ao,1,1,6)}

  if(ups.includes("cables")){m(hx,hb-2,1,1,6);m(hx,hb-1,1,2,3);m(hx-1,hb+1,1,1,3)}
  if(ups.includes("drone")){set(0,ao+4,3);set(2,ao+4,3);rect(0,ao+5,3,2,2);set(1,ao+5,6);set(1,ao+7,6)}
  if(ups.includes("cannon")){rect(14,hb+1,7,1,3);set(21,hb+1,5);set(22,hb+1,6)}
  if(ups.includes("shield")){const x=23-hand.x-2;rect(x,hand.y-3,3,6,3);rect(x+1,hand.y-2,1,4,6)}
  if(ups.includes("blade")||ups.includes("double blades")){for(let i=0;i<7;i++){set(hand.x+1+i,hand.y-i,6);set(hand.x+2+i,hand.y-i,6)}}
  if(ups.includes("double blades")){for(let i=0;i<7;i++){set(22-hand.x-i,hand.y-i,6);set(21-hand.x-i,hand.y-i,6)}}

  if(rar===4){const k=ri(3,5);for(let i=0;i<k;i++){const y=ri(13,22),sft=pick([-2,-1,1,2]),a=new Uint8Array(24);for(let x=0;x<24;x++){const sx=x-sft;if(sx>=0&&sx<24)a[x]=G[y][sx]}G[y]=a}}

  // colour: casing is anything, the phosphor shows the type
  const th=type.hue+rf(-10,10);
  const neutral=chance(.3), hs=neutral?pick([40,205,20]):rf(0,360), ss=neutral?rf(6,16):rf(45,80);
  const lb=neutral?pick([70,48,24]):56;
  const PAL={1:[hs,ss,[lb,Math.min(92,lb+18),Math.max(8,lb-20)]],
             2:[hs+pick([150,180,210,30,-30]),rf(18,40),[46,64,28]],
             3:[th,90,[60,80,40]]};
  const tl=hsl(hs+pick([180,150,210]),rf(26,38),rf(24,31));
  const empty=(x,y)=>x<0||x>=24||y<0||y>=H||!G[y][x];
  const rgb=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<24;x++){
    const id=G[y][x]; let c=null;
    if(PAL[id]){
      const sh=(empty(x+1,y)||empty(x,y+1))?2:(empty(x-1,y)||empty(x,y-1))?1:0, p=PAL[id];
      c=hsl(p[0]-(sh===2?14:0)+(rar===4&&chance(.07)?180:0),p[1],p[2][sh]);
    }else if(id===5)c=[14,10,26];
    else if(id===6)c=hsl(th,100,80);
    else if(id===7)c=hsl(th,100,66);
    else if(id===10)c=(x===sx0&&y===sy0)?hsl(th,40,17):hsl(th,55,7);
    else if(id===11)c=[255,170,50];
    row.push(c)}rgb.push(row)}

  // face, typed in characters
  const line=chance(.5);
  const face={line,eyes:pick(EYES),mouth:line?pick(MOUTH1):pick(MOUTH1.concat(MOUTHW)),
    brow:chance(.35)?pick(BROWS):null,cheek:chance(.25)?pick(["//","*","#",";"]):null};
  const faceText=line?`(${face.eyes[0]}${face.mouth}${face.eyes[1]})`:`(${face.eyes[0]} ${face.mouth} ${face.eyes[1]})`;

  // sheet
  const setName=hx>=7?"Wide set":hx===6?"Cube set":"Slim set";
  const setBoost=hx>=7?{0:1.15}:hx===6?{2:1.1}:{3:1.15};
  const w=F.bias.map(v=>v*rf(.75,1.25));
  const boosts=[setBoost,ANT_BOOST[ant]].concat(ups.map(u=>ATT[u].boost));
  boosts.forEach(b=>{for(const i in b)w[i]*=b[i]});
  const tot=w.reduce((a,b)=>a+b,0);
  const stats=w.map(v=>Math.max(12,Math.min(99,Math.round(v/tot*BUDGET[rar]))));
  let name=pick(SYL)+(chance(.55)?pick(SYL):"")+pick(END);
  name=name[0].toUpperCase()+name.slice(1);
  const mp=MOVES[type.n].slice(), m1=mp.splice(Math.floor(r()*mp.length),1)[0];
  const m2=chance(.5)?pick(mp):pick(ANY_MOVES);
  const moves=[[m1,ri(8,18)*5],[m2,ri(6,16)*5]];
  const skills=[], combos=[];
  ups.forEach((u,i)=>{
    const a=ATT[u];
    moves.push([a.move,ri(11,19)*5]);
    skills.push({n:(rar===4?"Corrupt ":"")+a.skill[0],d:a.skill[1]});
    combos.push({steps:i===0?[a.move,m1]:[a.move,ATT[ups[0]].move],seq:i===0?`${a.move} then ${m1}`:`${a.move} then ${ATT[ups[0]].move}`,n:a.fin[i?1:0],d:pick(CEFF)});
  });
  if(rar>=3)skills.push({n:SKILL[type.n][0]+" aura",d:SKILL[type.n][1]});
  if(rar===4){
    skills.push({n:"Glitch",d:"one enemy stat is rewritten at random each turn"});
    combos.push({steps:[ATT[ups[0]].move,ATT[ups[0]].move,m1],seq:`${ATT[ups[0]].move}, ${ATT[ups[0]].move}, then ${m1}`,n:"Stack Overflow",d:"copies the enemy's last move"});
  }
  const tag=b=>{const t=Object.keys(b).filter(i=>b[i]>1).map(i=>STATS[i]);return t.length?t.join(", "):null};
  const cap=x=>x[0].toUpperCase()+x.slice(1);
  const frameTag=STATS.filter((x,i)=>F.bias[i]>1).join(", ")||"balanced";
  const traits=[[cap(plan)+" frame",frameTag],[setName,tag(setBoost)],[cap(ant),tag(ANT_BOOST[ant])]]
    .concat(ups.map(u=>[cap(u),tag(ATT[u].boost)])).concat([["Face "+faceText,null]]);

  const tpool=Object.keys(TEND), tend=[];
  const nT=chance(.4)?3:2;
  for(let i=0;i<nT;i++)tend.push(tpool.splice(Math.floor(r()*tpool.length),1)[0]);
  const bank=[];
  tend.forEach(t=>{const ws=TEND[t].w.slice();for(let i=0;i<4;i++)bank.push(ws.splice(Math.floor(r()*ws.length),1)[0])});
  // rolled last so it never disturbs anything above
  const online=r()<MEME.rate;
  if(online){tend.unshift("terminally online");const ws=MEME.w.slice();for(let i=0;i<MEME.take;i++)bank.push(ws.splice(Math.floor(r()*ws.length),1)[0])}

  return {seed,rar,tend,bank,setName,ant,type:type.n,ti,plan,G,rgb,h:th,face,faceText,faceRGB:hsl(th,100,76),
    scr:{x0:sx0,x1:sx1,y0:sy0,y1:sy1},tile:`rgb(${tl[0]},${tl[1]},${tl[2]})`,
    stats,name,moves,skills,combos,traits,ups,geo:{hand,hb,tt,hx,ao},
    beats:TYPES[(ti+1)%7].n, weak:TYPES[(ti+6)%7].n,
    token:String(seed%100000).padStart(5,"0"), hex:seed.toString(16).padStart(8,"0")};
}

// How often each look turns up across all digis, worked out from the generator's own odds
