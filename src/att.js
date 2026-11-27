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

