
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
