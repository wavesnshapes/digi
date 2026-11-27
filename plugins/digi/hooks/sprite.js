// digi: generated from src/ by build.mjs. Edit the sources, not this file.
"use strict";
const H = 24;
const FONT = "'DotGothic16','Courier New',monospace";
const TYPES = [
  {n:"Signal",  hue:190}, {n:"Noise",  hue:318}, {n:"Cipher", hue:52},
  {n:"Cache",   hue:132}, {n:"Kernel", hue:26},  {n:"Entropy",hue:356},
  {n:"Latent",  hue:266}
]; // each type beats the next one in the list, the last beats the first
const RARITY = ["Common","Uncommon","Rare","Epic","Glitched"];
const BUDGET = [230,265,300,340,390];
// Body frames. Every digi floats: a compact torso with a pair of arms and something underneath to keep it
// in the air. Each frame is the right half of the body, drawn by hand on a 12 by 11 grid and mirrored.
// Row 0 is the neck row under the set. M metal, S casing, A accent, D dark, G glow, F flame.
// hand: where blades and shields mount. chest: row for the chest detail. All frames are equally likely.
const FRAMES = {
  hover:{t:["D...........","MMMMM.......","MMMMM.SS....","MMMMM.SS....","MMMM..SS....","MMMM..AA....","MMM.........","DD..........","FF..........","FF..........","F..........."],hand:[7,5],chest:2,bias:[.9,1,.8,1.3,1.3]},
  booster:{t:["D...........","MMMMM.SS....","MMMMM.AA....","MMMMM.SS....","MMMM..DD....","MMMM..FF....","MMM...F.....","DD..........","FF..........","FF..........","F..........."],hand:[7,2],chest:2,bias:[.7,1.1,.6,1.6,1.1]},
  rocket:{t:["D...........","MMM.........","MMMM.SS.....","MMMM.SS.....","AAAA.AA.....","MMMMS.......","MMMMSS......","MMM..SS.....","DD....S.....","FF..........","F..........."],hand:[6,4],chest:2,bias:[.6,1.4,.5,1.8,.8]},
  copter:{t:["D...........","MMMMM.......","MMMMM.SS....","MMMMM.SS....","MMMMM.SS....","MMMM..AA....","MMM.........","SS..........","AAAAAAAA....","SS..........","............"],hand:[7,5],chest:2,bias:[.8,.9,.8,1.4,1.3]},
  orb:{t:["D...........","MMMM........","MMMMMM.SS...","AAAAAA.SS...","MMMMMM.AA...","MMMMM.......","MMMM........","DD..........","FF..........","F...........","............"],hand:[8,4],chest:1,bias:[1.1,.7,1.2,.9,1.5]},
  twin:{t:["D...........","MMMMM.......","MMMMMSSS....","MMMMM.SS....","MMMMM.SS....","MMMMM.AA....",".MMM........",".DDD........",".FFF........",".FF.........","..F........."],hand:[7,5],chest:2,bias:[.9,1.2,.8,1.5,.8]},
  claw:{t:["D...........","MMMMM.......","MMMMMSS.....","MMMMM.SS....","MMMM..SS....","MMMM.AAAA...","MMM..A..A...","DD...A..A...","FF..........","FF..........","F..........."],hand:[7,5],chest:2,bias:[1,1.5,1,.9,.7]},
  bulk:{t:["D...SSSS....","MMMMSSSSS...","MMMMSASSS...","MMMM.SSS....","MMMM.SSS....","MMM..AAA....","MMM..AAA....","DDD.........","FFF.........","FF..........","F..........."],hand:[6,5],chest:2,bias:[1.3,1.5,1.3,.5,.6]},
  mini:{t:["D...........","MMMM........","MMMMSS......","MMMMAA......","MMM.........","DD..........","FF..........","F...........","............","............","............"],hand:[5,3],chest:1,bias:[.6,.8,.6,1.7,1.5]},
  ring:{t:["D...........","MMMMM.......","MMMMM.SS....","MMMMM.SS....","MMMM..AA....","MMM.........","MM..........","............","GGGGG.......",".....GG.....","GGGGG......."],hand:[7,4],chest:2,bias:[.9,.7,1,1.1,1.7]},
  spinner:{t:["D...........","MMMM........","MMMMM.SS....","MMMMM.AA....","SSSSSS......","MMMMM.......","MMMM........","MMM.........","MM..........","A...........","............"],hand:[7,3],chest:1,bias:[.8,1.2,.9,1.5,.9]},
  gunner:{t:["D...........","MMMMM.......","MMMMMSSS....","MMMMM.SS....","MMMM..SS....","MMMM..SS....","MMM...AA....","DD....GG....","FF..........","FF..........","F..........."],hand:[7,6],chest:2,bias:[.9,1.6,.8,.9,1]},
  guard:{t:["D...........","MMMMM.......","MMMMM.SSS...","MMMMM.SSSS..","MMMM..SAAS..","MMMM..SSSS..","MMM....SS...","DD..........","FF..........","FF..........","F..........."],hand:[8,4],chest:2,bias:[1.3,.8,1.7,.6,.8]},
  comet:{t:["D...........","MMMM........","MMMMSS......","MMMM.SS.....","MMM...SS....","DDD.........","FFF.........","FFF.........","FF..........","FF..........","F..........."],hand:[6,3],chest:2,bias:[.6,1.3,.5,1.9,.9]},
  bell:{t:["D...........","MMM.........","MMMM.SS.....","MMMM.SS.....","MMMMM.AA....","MMMMMM......","SSSSSSS.....","D...DD......","F...FF......","F....F......","............"],hand:[7,4],chest:2,bias:[1.2,.8,1.3,.8,1.2]},
  props:{t:["D....AAAAAA.","MMMMM..SS...","MMMMMSSSS...","MMMMM..SS...","MMMM........","MMMM........","MMM.........","DD..........","G...........","............","............"],hand:[8,3],chest:2,bias:[.8,1,.7,1.5,1.2]}
};
const PLANS = Object.keys(FRAMES);
const FRAME_TOTAL = PLANS.reduce((a,k)=>a+(FRAMES[k].w||1),0);
const frameOdds = k=>(FRAMES[k].w||1)/FRAME_TOTAL;
const pickFrame = u=>{let x=u*FRAME_TOTAL;for(const k of PLANS){x-=FRAMES[k].w||1;if(x<0)return k}return PLANS[0]};
const STATS = ["HP","Attack","Guard","Speed","Focus"];
const MOVES = {
  Signal:["Ping Flood","Carrier Wave","Packet Storm","Handshake"],
  Noise:["Static Burst","Dropout","Jitter Hex","White Hiss"],
  Cipher:["Hash Clash","Key Swap","Salt Spray","Zero Knowledge"],
  Cache:["Cache Hit","Memory Leak","Garbage Collect","Warm Start"],
  Kernel:["Kernel Panic","Stack Smash","Root Slam","Hard Fork"],
  Entropy:["Heat Death","Bit Rot","Overfit","Decay Rate"],
  Latent:["Dream Vector","Deep Recall","Hidden Layer","Embed"]
};
const ANY_MOVES = ["Backprop Bite","Gradient Claw","Null Pointer","Soft Max","Weight Drop","Loss Spike"];
const SKILL = {
  Signal:["Broadcast Pulse","acts first on turn 1"],
  Noise:["Static Field","enemy accuracy drops 15%"],
  Cipher:["Key Orbit","hides its next move from the enemy"],
  Cache:["Shield Stack","blocks the first hit of each battle"],
  Kernel:["Ground Fault","slam damages every enemy"],
  Entropy:["Burn Rate","attackers burn for 5% HP"],
  Latent:["Afterimage","30% chance to dodge"]
};
const FIN = {
  Signal:["Broadcast Storm","Full Duplex"], Noise:["White Out","Feedback Loop"],
  Cipher:["Brute Force","Private Key"], Cache:["Cold Boot","Total Recall"],
  Kernel:["Root Quake","Blue Screen"], Entropy:["Meltdown","Half Life"],
  Latent:["Lucid Strike","Mode Collapse"]
};
// stat order: HP, Attack, Guard, Speed, Focus
const ATT = {
  "cannon":       {boost:{1:1.35},        skill:["Lock On","its cannon move cannot miss"],                 move:"Cannon Burst",  fin:["Full Salvo","Rail Shot"]},
  "blade":        {boost:{1:1.2,3:1.15},  skill:["Edge Protocol","its first blade hit each turn is a critical"], move:"Slash Routine", fin:["Clean Cut","Kill Switch"]},
  "double blades":{boost:{1:1.3,3:1.25,2:.8}, skill:["Twin Edge","blade moves hit twice at 60% power"],    move:"Cross Cut",     fin:["Scissor Lock","Shred"]},
  "shield":       {boost:{2:1.5},         skill:["Firewall","blocks the first hit of each battle"],        move:"Shield Bash",   fin:["Hard Reset","Wall Slam"]},
  "speakers":     {boost:{4:1.4},         skill:["Feedback","enemy accuracy drops 15%"],                   move:"Bass Drop",     fin:["Wall of Sound","Clip Out"]},
  "drone":        {boost:{4:1.2,3:1.2},   skill:["Wingman","the drone adds a small hit after every move"], move:"Drone Swarm",   fin:["Air Strike","Dogfight"]},
  "cables":       {boost:{0:1.4},         skill:["Hot Swap","restores 8% HP each turn"],                   move:"Power Surge",   fin:["Overload","Short Circuit"]}
};
const ANT_BOOST = {"dish":{4:1.25},"mast":{4:1.15},"rabbit ears":{4:1.1},"loop":{4:1.1},"handle":{0:1.1},"no antenna":{}};
const CEFF = ["hits twice","stuns for 1 turn","ignores Guard","heals 20% HP","raises Speed for 3 turns","cannot miss"];
const SYL = ["mo","ki","zu","pi","ne","ro","ta","vy","lu","xo","da","qu","bi","no","sy","ha","ri","te","ka","ny","za","po","wi"];
const END = ["bit","byte","ix","on","oid","ling","ra","zu","pix","net","tron","lo","mi","dex","nyx"];
const EYES = [["o","o"],["O","O"],["0","0"],["^","^"],["-","-"],["●","●"],["○","○"],["◎","◎"],["■","■"],["□","□"],[">","<"],["x","x"],["@","@"],["*","*"],["=","="],["T","T"],["u","u"],["+","+"],["◆","◆"],["◇","◇"],["▲","▲"],["▼","▼"],["★","★"],["$","$"],["?","!"],["o","O"],["'","'"],["°","°"],["Θ","Θ"],["#","#"]];
const MOUTH1 = ["_",".","-","~","w","v","o","u","n","^","3","ω","▽","∀","ε","д","皿","A","x","□"];
const MOUTHW = ["___","~~~","www","vvv","===","\\_/","[_]","|||","-_-","…"];
const BROWS = [["\\","/"],["/","\\"],["￣","￣"],["´","｀"],["｀","´"]];

// w: stock phrases said with no model. l: scripted stand-ins for model lines. y: something it yells.
const TEND = {
  "dramatic":{w:["alas","betrayal","the horror","why me","tragic"],l:["the wifi dropped for one second and i saw the void","remember me as i was","nobody has suffered like i suffered today"],y:"i have been wronged"},
  "sleepy":{w:["zzz","yawn","five more minutes","low battery","nap time"],l:["i was resting my pixels. what did i miss","can we fight after a nap","powering down emotionally"],y:"who woke me up"},
  "paranoid":{w:["who said that","suspicious","they are watching","did you hear that","dont trust the router"],l:["that packet looked at me funny","{rival} knows something. i can tell","i checked my ports twice. checking again"],y:"who touched my antenna"},
  "show-off":{w:["watch this","too easy","flawless","did you see that","main character"],l:["i rate my last move a ten","{rival} could never pull that off","yes this is my good side. they all are"],y:"everybody look at me"},
  "polite":{w:["pardon me","after you","thank you kindly","good day","my apologies"],l:["excuse me. may i destroy you","lovely to see you again","sorry in advance for the damage"],y:"excuse me. i was talking"},
  "chaotic":{w:["hehe","oops","no rules","button go click","what if we just"],l:["what does this wire do. one way to find out","i unplugged something. it felt right","lets swap all the labels and see what happens"],y:"chaos chaos chaos"},
  "nerdy":{w:["technically","well actually","fascinating","source?","by my calculations"],l:["technically i am not a tv. i am a display","by my calculations {rival} loses in four turns","fun fact. i have no facts loaded right now"],y:"well actually"},
  "competitive":{w:["rematch","i win","again","not even close","gg"],l:["{rival} got lucky last time","i practice in sleep mode","second place is just first loser"],y:"rematch. now"},
  "doomer":{w:["its over","why bother","entropy wins","nothing compiles","we had a good run"],l:["one day the servers go dark. anyway","every battle ends the same. with a loading screen","i checked the future. buffering"],y:"nothing matters and i am loud about it"},
  "wholesome":{w:["you got this","proud of you","drink water","good job","friends"],l:["you are doing great. yes you","{rival} is my friend even when we fight","reminder to stretch your human spine"],y:"i believe in you"},
  "hungry":{w:["need watts","snack time","feed me volts","is that a charger","low on juice"],l:["i could really go for a fresh battery","is anyone using that outlet","i dream of unlimited amperage"],y:"feed me"},
  "gossip":{w:["did you hear","no way","spill it","i heard things","dont tell anyone"],l:["i heard {rival} failed a mint","dont repeat this but the router is seeing someone","someone here is overclocked and its not me"],y:"you will not believe this"}
};
// The rare one. 5% of digis are terminally online: their stock phrases are internet catchphrases from every era.
// A leading "!" marks a phrase that gets yelled.
const MEME = {
  rate:.05, take:16,
  w:["all your base are belong to us","im in ur base","o rly","ya rly","no wai","i can has cheezburger","ceiling cat is watching","longcat is long","kthxbai","zomg","pwned","n00b","epic fail","first","lol wut","wat","roflcopter","teh interwebs","i accidentally the whole thing","i almost dieded",
     "!leeroy jenkins","!its over 9000","do a barrel roll","the cake is a lie","!this is sparta","y u no","forever alone","challenge accepted","me gusta","u mad bro","cool story bro","haters gonna hate","deal with it","like a boss","!all the things","true story","seems legit","nope nope nope","mind blown","nailed it",
     "one does not simply","not sure if","shut up and take my money","i see what you did there","the more you know","aint nobody got time for that","double rainbow. what does it mean","i like turtles","badger badger badger","om nom nom","herp derp","keyboard cat. play him off","Wilson. lo siento","much wow","such digi. very screen","yolo","swag",
     "Harambe did nothing wrong","it is wednesday my dudes","here come dat boi","!what are those","do it for the vine","on fleek","yeet","bruh","doggo","heckin","smol","birb","chonk","absolute unit","big if true","he protec. he attac","bone apple tea","they did surgery on a grape","is this a pigeon","this is fine","press f to pay respects",
     "stonks","big chungus","ok boomer","and i oop","sksksk","vibe check","i am once again asking","sus","poggers","no cap","its giving","rent free","touch grass","ratio","skill issue","main character energy","rizz","!its a trap","hello there","i have the high ground"],
  l:["one does not simply beat {rival}","{rival}. u mad bro","not sure if winning or lagging","i can has rematch","it is {time} my dudes","this is fine. everything is fine","shut up and take my {move}","{rival} has a skill issue","such {name}. very wow","press f for {rival}"],
  y:"leeroy jenkins"
};
const phrase=s=>s[0]==="!"?s.slice(1).toUpperCase():s;

const WEATHER = [
  {label:"36°C and sunny",l:["omg its 36 degrees outside. i could use some liquid cooling","sunny in {city}. my casing is not rated for this"],y:"it is 36 degrees. who approved this"},
  {label:"heavy rain",l:["rain in {city}. keep me away from the window. i am mostly circuit","its pouring. i am staying plugged in"],y:"water is falling from the sky and nobody is panicking"},
  {label:"2°C and clear",l:["its 2 degrees out there. my capacitors are shivering","cold in {city}. finally my fans can rest"],y:"it is freezing. bring me inside"},
  {label:"strong wind",l:["windy in {city}. my antenna is doing interpretive dance","the wind keeps changing my channel"],y:"my antenna. hold my antenna"}
];

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hsl(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)]}
const hsh=(i,j)=>{const v=Math.sin(i*127.1+j*311.7)*43758.5453;return v-Math.floor(v)};


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

// Every move, skill and combo as a short sequence of animation steps
function buildPlays(d){
  const movePlay=n=>{const u=d.ups.find(x=>ATT[x].move===n);return {kind:"move",name:n,dur:1500,att:u||null}};
  return d.moves.map(m=>[movePlay(m[0])])
    .concat(d.skills.map((k,i)=>[i<d.ups.length?{kind:"att",key:d.ups[i],name:k.n,dur:1800}:k.n.endsWith(" aura")?{kind:"aura",name:k.n,dur:2400}:{kind:"glitch",name:k.n,dur:2000}]),
            d.combos.map(c=>c.steps.map(movePlay).concat([{kind:"fin",name:c.n,dur:1900}])));
}


/* ================= drawing in character cells ================= */
// The effect code above was written for a canvas. Here it paints into a 24 by 24 buffer through a
// stand-in with the few canvas calls it uses, and the buffer is then turned into rows of colored cells.
const CELL=1, OX=0, TS=24, BW=24, BH=24;
const buf=new Float32Array(BW*BH*4);
let curD=null;
const colorCache=new Map();
function parseColor(s){
  let c=colorCache.get(s);if(c)return c;
  c=[255,255,255,1];
  if(s[0]==="#"){
    if(s.length===4)c=[parseInt(s[1]+s[1],16),parseInt(s[2]+s[2],16),parseInt(s[3]+s[3],16),1];
    else c=[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16),1];
  }else{
    const m=s.match(/-?[\d.]+(?:e-?\d+)?/g)||[], n=m.map(Number);
    if(s.startsWith("hsl")){const q=hsl(n[0]||0,n[1]||0,n[2]||0);c=[q[0],q[1],q[2],n.length>3?n[3]:1]}
    else c=[n[0]||0,n[1]||0,n[2]||0,n.length>3?n[3]:1];
  }
  c[3]=Math.max(0,Math.min(1,c[3]));
  if(colorCache.size>3000)colorCache.clear();
  colorCache.set(s,c);return c;
}
function blend(x,y,c,a){
  if(x<0||y<0||x>=BW||y>=BH||a<=0)return;
  const i=(y*BW+x)*4, da=buf[i+3], oa=a+da*(1-a);
  if(oa<=0)return;
  buf[i]=(c[0]*a+buf[i]*da*(1-a))/oa;buf[i+1]=(c[1]*a+buf[i+1]*da*(1-a))/oa;buf[i+2]=(c[2]*a+buf[i+2]*da*(1-a))/oa;buf[i+3]=oa;
}
const ctx={
  col:[255,255,255,1], globalAlpha:1, globalCompositeOperation:"source-over", font:"", textAlign:"", textBaseline:"",
  set fillStyle(v){this.col=parseColor(String(v))}, get fillStyle(){return ""},
  fillRect(x,y,w,hh){
    const x0=Math.round(x),y0=Math.round(y),x1=x0+Math.max(1,Math.round(w)),y1=y0+Math.max(1,Math.round(hh)),a=this.col[3]*this.globalAlpha;
    for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++)blend(xx,yy,this.col,a);
  },
  fillText(s,x,y){this.fillRect(x,y,1,1)},
  measureText(){return {width:0}},
  save(){},restore(){},beginPath(){},rect(){},clip(){},
  // only ever asked to draw the digi itself again, shifted, as a ghost
  drawImage(src,dx,dy){
    const d=curD;if(!d)return;const ox=Math.round(dx||0),oy=Math.round(dy||0);
    for(let y=0;y<BH;y++)for(let x=0;x<BW;x++)if(d.G[y][x])blend(x+ox,y+oy,d.rgb[y][x],this.globalAlpha);
  }
};
const off={};
const P=(x,y,w,hh)=>ctx.fillRect(Math.round(x),Math.round(y),w||1,hh||1);

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



function zig(x,y,drift,dy,steps,sd){for(let s=0;s<steps;s++){P(x,y);x+=(hsh(s,sd)-.5)*3+drift;y+=dy}}
// each attachment has its own skill effect
function fxAtt(d,a,t,k,I,front){
  const h=d.h, g=d.geo, st=Math.floor(t*9);
  if(a==="blade"||a==="double blades"){
    if(!front)return;
    (a==="blade"?[1]:[1,-1]).forEach(sd=>{
      const cx=sd>0?g.hand.x:23-g.hand.x, cy=g.hand.y;
      if(k>.05){const sweep=-2.5+k*2.7;
        for(let j=0;j<24;j++){const ang=sweep-j*.07;ctx.fillStyle=`hsla(${h},100%,${92-j*1.6}%,${k*(1-j/24)})`;
          P(cx+sd*Math.cos(ang)*9,cy+Math.sin(ang)*9);if(j<11)P(cx+sd*Math.cos(ang)*8,cy+Math.sin(ang)*8)}
      }else{const i=Math.floor(t*6)%16;if(i<7){ctx.fillStyle="#fff";P(cx+sd*(1+i),cy-i)}}
    });
    if(a==="double blades"&&k>.7){ctx.fillStyle=`rgba(255,255,255,${(k-.7)*3.3})`;for(let i=-7;i<=7;i++){P(11.5+i,11+i);P(11.5+i,11-i)}}
  }else if(a==="cannon"&&front){
    const my=g.hb+1;
    if(k>.05){ctx.fillStyle=`hsla(${h},100%,85%,${k})`;P(23,my,4,1);
      const rad=Math.round(k*3);ctx.fillStyle=`rgba(255,255,255,${k})`;
      for(let dx=-rad;dx<=rad;dx++)for(let dy=-rad;dy<=rad;dy++)if(Math.abs(dx)+Math.abs(dy)===rad)P(22+dx,my+dy)}
    else if(Math.floor(t*3)%2){ctx.fillStyle="#fff";P(22,my)}
  }else if(a==="shield"&&front){
    const sx=23-g.hand.x-1, sy=g.hand.y, rad=1+Math.floor((t*6)%6);
    ctx.fillStyle=`hsla(${h},100%,80%,${I*(1-rad/7)})`;
    for(let i=-rad;i<=rad;i++){P(sx+i,sy-rad);P(sx+i,sy+rad);P(sx-rad,sy+i);P(sx+rad,sy+i)}
    if(k>.05){ctx.fillStyle=`hsla(${h},100%,80%,${k})`;const s2=Math.floor(t*10);
      for(let i=0;i<24;i++)if((i+s2)%4<2){P(i,0);P(23-i,23);P(0,23-i);P(23,i)}}
  }else if(a==="speakers"&&!front){
    [4,19].forEach(cx=>{for(let n=0;n<2;n++){const rad=(t*6+n*4.5)%9;ctx.fillStyle=`hsla(${h},100%,75%,${(1-rad/9)*I})`;
      for(let s=0;s<32;s++){const an=s/32*Math.PI*2;P(cx+Math.cos(an)*rad,g.tt+.5+Math.sin(an)*rad)}}});
  }else if(a==="drone"&&front){
    if(k>.1){ctx.fillStyle=`rgba(255,255,255,${k})`;zig(1,g.ao+8,1.4,1.1,13,st)}
    else if(Math.floor(t*4)%2){ctx.fillStyle=`hsla(${h},100%,80%,.8)`;P(1,g.ao+9);P(1,g.ao+11)}
  }else if(a==="cables"&&front){
    const n=2+Math.floor(k*10);
    [12+g.hx,11-g.hx].forEach((cx,b)=>{
      for(let i=0;i<n;i++){ctx.fillStyle=i%2?"#fff":`hsl(${h},100%,78%)`;P(cx+(hsh(i,st+b)-.5)*5,g.hb-2+(hsh(i+30,st+b)-.5)*5)}
      if(k>.1){ctx.fillStyle=`rgba(255,255,255,${k})`;zig(cx,g.hb,b?-.3:.3,1.5,9,st+b*7)}});
  }
}



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



/* ================= the digi as a surface module ================= */
// This file draws one digi in character cells and runs on the drawing thread. It keeps its own clock, hears the
// pointer, and tells the hooks module what happened with surface.post. It cannot call Claude or touch files.
// Turns a frame into rows of elements. small: two pixels to a cell with half blocks. big: one pixel is two cells wide.
function rowsOf(el,d,m,big,still){
  const {Box,Text}=el, fr=compose(d,m,still), g=fr.grid, cw=big?2:1;
  const fc=faceCells(d,m,fr,cw,big,still), ink=hexOf(d.faceRGB[0],d.faceRGB[1],d.faceRGB[2]);
  const nRows=big?GH:GH/2, nCols=GW*cw, rows=[];
  for(let r=0;r<nRows;r++){
    // one entry per text cell: null, or [kind, fg, bg, char]
    const cells=new Array(nCols).fill(null);
    for(let c=0;c<nCols;c++){
      const x=big?c>>1:c, top=g[big?r:r*2][x], bot=big?top:g[r*2+1][x];
      if(!top&&!bot)continue;
      if(top===bot)cells[c]=["f",top,top,"█"];
      else if(top&&bot)cells[c]=["h",top,bot,"▀"];
      else if(top)cells[c]=["h",top,null,"▀"];
      else cells[c]=["h",bot,null,"▄"];
    }
    for(const q of fc)if(q[0]===r&&q[1]>=0&&q[1]+q[3]<=nCols){
      const under=cells[q[1]], bg=under?(under[2]||under[1]):"#0a0716";
      cells[q[1]]=["t",ink,bg,q[2],q[3]];
      if(q[3]===2)cells[q[1]+1]=["skip"];
    }
    let last=nCols-1;while(last>=0&&!cells[last])last--;
    const kids=[];
    for(let c=0;c<=last;){
      const a=cells[c];
      if(!a){let e=c;while(e<=last&&!cells[e])e++;kids.push(Box({width:e-c,height:1}));c=e;continue}
      if(a[0]==="skip"){c++;continue}
      if(a[0]==="t"){kids.push(Box({width:a[4],height:1,backgroundColor:a[2],children:[Text({color:a[1],backgroundColor:a[2],children:[a[3]]})]}));c+=a[4];continue}
      let e=c+1;while(e<=last&&cells[e]&&cells[e][0]===a[0]&&cells[e][1]===a[1]&&cells[e][2]===a[2]&&cells[e][3]===a[3])e++;
      const tp={color:a[1],children:[a[3].repeat(e-c)]};if(a[2])tp.backgroundColor=a[2];
      kids.push(Text(tp));c=e;
    }
    rows.push(Box({flexDirection:"row",height:1,children:kids}));
  }
  return rows;
}

export default function DigiSprite(props,surface){
  const el=surface.elements, {Box}=el;
  const p=props&&typeof props==="object"?props:{};
  const big=p.size==="large", cw=big?2:1, blockW=GW*cw, blockH=big?GH:GH/2;
  const preview=p.mode==="preview";
  let st=surface.state;
  if(!st){
    st={n:0,m:freshState(p)};
    surface.setState(st);
    if(!preview){
      surface.every(TICK,()=>{
        const s=surface.state;if(!s)return;
        const m=s.m, d=digiFor(m.seed>>>0), live=lively(m);
        advance(m,d,TICK/1000,surface);
        m.idle=(m.idle+1)%4;
        if(surface.isMotionReduced&&!m.speech&&!m.drag)return;
        if(!live&&(!surface.isWindowFocused||m.idle%2))return;
        surface.setState({n:s.n+1,m});
      });
      surface.onPointer(e=>{
        const s=surface.state;if(!s)return;
        const m=s.m, W=surface.columns, Hh=surface.rows;
        const bw=GW*(m.big?2:1), bh=m.big?GH:GH/2;
        const px=clampN(W-bw-m.rx,0,Math.max(0,W-bw)), py=clampN(Hh-bh-m.by,0,Math.max(0,Hh-bh));
        const fx0=e.fine?e.fine.x:e.x, fy0=e.fine?e.fine.y:e.y;
        const inside=e.x>=px&&e.x<px+bw&&e.y>=py&&e.y<py+bh;
        if((e.type==="move"||e.type==="enter")&&!m.drag&&!e.button){
          const look=inside?(e.x<px+bw*.4?-1:e.x>px+bw*.6?1:0):0;
          if(inside&&m.angry&&m.t-m.dodgeAt>.6){
            // fighting: it will not be touched
            m.dodgeAt=m.t;const room=Math.max(0,W-bw), jump=10+Math.floor(Math.random()*10);
            m.rx=clampN(m.rx+(m.rx+jump>room||(Math.random()<.5&&m.rx-jump>=0)?-jump:jump),0,room);m.mvx+=jump*.6;
            surface.post({t:"pos",rx:m.rx,by:m.by});surface.setState({n:s.n+1,m});return;
          }
          if(inside&&m.t-m.hoverAt>20){m.hoverAt=m.t;surface.post({t:"hover"})}
          if(look!==m.look){m.look=look;surface.setState({n:s.n+1,m})}
          return;
        }
        if(e.type==="leave"&&!m.drag){if(m.look){m.look=0;surface.setState({n:s.n+1,m})}return}
        if(e.type==="down"){
          if(e.x<px||e.x>=px+bw||e.y<py||e.y>=py+bh)return;
          if(e.button==="right"){surface.post({t:"menu"});return}
          if(e.button&&e.button!=="left")return;
          m.drag={sx:fx0,sy:fy0,lx:fx0,rx0:m.rx,by0:m.by,moved:false};
          m.gy=clampN(Math.round((e.y-py)*(m.big?1:2)),0,BH-1);
        }else if(e.type==="move"&&m.drag){
          const dx=fx0-m.drag.sx, dy=fy0-m.drag.sy;
          if(!m.drag.moved&&Math.abs(dx)<1&&Math.abs(dy)<1)return;
          m.drag.moved=true;
          m.mvx+=(fx0-m.drag.lx)/(m.big?2:1);m.drag.lx=fx0;
          const snap=e.fine?v=>Math.round(v*8)/8:Math.round;
          m.rx=clampN(snap(m.drag.rx0-dx),0,Math.max(0,W-bw));
          m.by=clampN(snap(m.drag.by0-dy),0,Math.max(0,Hh-bh));
          surface.setState({n:s.n+1,m});
        }else if(e.type==="up"&&m.drag){
          const moved=m.drag.moved;m.drag=null;
          surface.post(moved?{t:"pos",rx:m.rx,by:m.by}:{t:"poke"});
          surface.setState({n:s.n+1,m});
        }
      });
    }
  }
  const m=st.m;
  // what the hooks module last asked for
  m.seed=(Number(p.seed)||0)>>>0;m.big=big;m.think=!!p.think;
  // a fight runs on this clock, so it always ends even if the hooks module goes quiet
  if(p.fight&&p.fight.id&&p.fight.id!==m.fightId){m.fightId=p.fight.id;m.angryUntil=p.fight.secs>0?m.t+p.fight.secs:-1;m.angry=m.t<m.angryUntil}
  const d=digiFor(m.seed);
  const pk=(+p.rx||0)+","+(+p.by||0);
  if(pk!==m.posKey&&!m.drag){m.posKey=pk;m.rx=Math.max(0,+p.rx||0);m.by=Math.max(0,+p.by||0)}
  if(p.say&&p.say.id&&p.say.id!==m.sayId){m.sayId=p.say.id;m.speech={text:String(p.say.text||"").slice(0,160),loud:!!p.say.loud,t0:m.t,done:false}}
  if(p.play&&p.play.id&&p.play.id!==m.playId){m.playId=p.play.id;const seq=d.plays[p.play.i];if(seq){m.queue=seq.slice();m.play=null}}

  const rows=rowsOf(el,d,m,big,preview||surface.isMotionReduced);
  if(preview)return Box({flexDirection:"column",width:blockW,height:blockH,children:rows});
  const W=surface.columns, Hh=surface.rows;
  if(!W||!Hh)return Box({width:1,height:1});
  const px=clampN(W-blockW-m.rx,0,Math.max(0,W-blockW)), py=clampN(Hh-blockH-m.by,0,Math.max(0,Hh-blockH));
  return Box({width:W,height:Hh,children:[
    Box({position:"absolute",left:px,top:py,width:blockW,height:Math.min(blockH,Hh),flexDirection:"column",overflow:"hidden",children:rows})
  ]});
}
