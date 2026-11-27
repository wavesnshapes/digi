
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
