// The original constellation's depth, float and breathing motions, carried
// through all three axes. These are force targets; Rapier moves the bodies.
export function orbitOffset(offset, time, phase, mode = 'depth', amount = 1) {
  const {x,y,z} = offset;
  if(mode === 'float') return {
    x:x+Math.sin(time*.6+phase)*5*amount,
    y:y+Math.cos(time*.48+phase)*5*amount,
    z:z+Math.sin(time*.38+phase)*7*amount};
  if(mode === 'breathe') {
    const breath=1+Math.sin(time*.55+phase*.08)*.11*amount;
    return {x:x*breath,y:y*breath,z:z*breath};
  }
  const yaw=(Math.sin(time*.32+phase*.1)*.24+time*.045)*amount;
  const pitch=Math.cos(time*.27+phase*.07)*.22*amount;
  const roll=Math.sin(time*.18+phase*.05)*.1*amount;
  const x1=x*Math.cos(yaw)+z*Math.sin(yaw),z1=-x*Math.sin(yaw)+z*Math.cos(yaw);
  const y2=y*Math.cos(pitch)-z1*Math.sin(pitch),z2=y*Math.sin(pitch)+z1*Math.cos(pitch);
  return {x:x1*Math.cos(roll)-y2*Math.sin(roll),
    y:x1*Math.sin(roll)+y2*Math.cos(roll),z:z2};
}
