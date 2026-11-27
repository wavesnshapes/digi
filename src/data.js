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
