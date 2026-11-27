// Every move, skill and combo as a short sequence of animation steps
function buildPlays(d){
  const movePlay=n=>{const u=d.ups.find(x=>ATT[x].move===n);return {kind:"move",name:n,dur:1500,att:u||null}};
  return d.moves.map(m=>[movePlay(m[0])])
    .concat(d.skills.map((k,i)=>[i<d.ups.length?{kind:"att",key:d.ups[i],name:k.n,dur:1800}:k.n.endsWith(" aura")?{kind:"aura",name:k.n,dur:2400}:{kind:"glitch",name:k.n,dur:2000}]),
            d.combos.map(c=>c.steps.map(movePlay).concat([{kind:"fin",name:c.n,dur:1900}])));
}
