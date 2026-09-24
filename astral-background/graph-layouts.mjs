import {hash} from './graph-physics.mjs';
export const layoutNames={saved:'My layout',constellation:'Constellation',galaxy:'Galaxy',globe:'Globe',helix:'Helix'};
export const layoutDescriptions={
  saved:'Your own saved arrangement and pins.',
  constellation:'One continuous star field. Relationships remain available on selection instead of being baked into visual blobs.',
  galaxy:'Three recognisable spiral arms in a thin disc, with related nodes held locally.',
  globe:'A true spherical shell: every community is mapped onto the surface, not a fuzzy cloud.',
  helix:'Two explicit rising strands, with local communities wrapped tightly around them.'};
const golden=Math.PI*(3-Math.sqrt(5));
function spherePoint(i,count,radius) {
  const y=1-2*(i+.5)/count,span=Math.sqrt(Math.max(0,1-y*y)),a=i*golden;
  return {x:Math.cos(a)*span*radius,y:y*radius,z:Math.sin(a)*span*radius};
}
function clusterOffset(i,count,radius,seed,vertical=1) {
  if(i===0)return {x:0,y:0,z:0};
  const point=spherePoint(i-1,Math.max(1,count-1),radius*Math.cbrt((i+.5)/Math.max(1,count)));
  const angle=seed*Math.PI*2+(i%7)*.17,tilt=(seed-.5)*.42;
  return {x:point.x*Math.cos(angle)-point.z*Math.sin(angle),y:(point.y+Math.sin(angle*1.7)*radius*.08)*vertical,
    z:point.x*Math.sin(angle)+point.z*Math.cos(angle)+tilt*point.y};
}
function tangentClusterPoint(centre,i,count,radius,seed) {
  if(i===0)return centre;
  const length=Math.hypot(centre.x,centre.y,centre.z),normal={x:centre.x/length,y:centre.y/length,z:centre.z/length};
  const reference=Math.abs(normal.y)>.9?{x:1,y:0,z:0}:{x:0,y:1,z:0};
  const uLength=Math.hypot(reference.y*normal.z-reference.z*normal.y,reference.z*normal.x-reference.x*normal.z,reference.x*normal.y-reference.y*normal.x);
  const u={x:(reference.y*normal.z-reference.z*normal.y)/uLength,y:(reference.z*normal.x-reference.x*normal.z)/uLength,z:(reference.x*normal.y-reference.y*normal.x)/uLength};
  const v={x:normal.y*u.z-normal.z*u.y,y:normal.z*u.x-normal.x*u.z,z:normal.x*u.y-normal.y*u.x};
  const amount=radius*Math.sqrt((i+.5)/Math.max(1,count)),angle=i*golden+seed*Math.PI*2;
  const point={x:centre.x+u.x*Math.cos(angle)*amount+v.x*Math.sin(angle)*amount,
    y:centre.y+u.y*Math.cos(angle)*amount+v.y*Math.sin(angle)*amount,
    z:centre.z+u.z*Math.cos(angle)*amount+v.z*Math.sin(angle)*amount};
  const scale=length/Math.hypot(point.x,point.y,point.z);
  return {x:point.x*scale,y:point.y*scale,z:point.z*scale};
}
function groupCentre(name,i,count) {
  const t=(i+.5)/Math.max(1,count),seed=hash(name+'|'+i);
  if(name==='constellation') {
    // A field must have depth, not just communities glued to an elliptical
    // rim. The deterministic radial fill keeps it recognisably wide and
    // shallow while allowing stars and small constellations through the view.
    const point=spherePoint(i,count,1),radius=105+465*Math.cbrt((i+.5)/Math.max(1,count));
    return {x:point.x*radius,y:point.y*radius,z:point.z*radius*.27};
  }
  if(name==='galaxy') {
    const arm=i%3,angle=arm*Math.PI*2/3+Math.sqrt(t)*Math.PI*2.55;
    const radius=90+Math.sqrt(t)*515+(seed-.5)*22;
    return {x:Math.cos(angle)*radius,y:(seed-.5)*16,z:Math.sin(angle)*radius};
  }
  if(name==='globe')return spherePoint(i,count,470);
  if(name==='helix') {
    const strand=i%2,angle=t*Math.PI*6.8+strand*Math.PI,radius=205+(seed-.5)*18;
    return {x:Math.cos(angle)*radius,y:(t-.5)*980,z:Math.sin(angle)*radius};
  }
  return spherePoint(i,count,500);
}
function spreadIndex(i,count) {
  // Groups are sorted by size. A coprime stride prevents the largest twenty-
  // four from all occupying the first (and therefore one-sided) part of a
  // globe, arm or helix.
  if(count<2)return 0;
  let stride=Math.max(1,Math.floor(count*.61803398875));
  const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
  while(gcd(stride,count)!==1)stride++;
  return (i*stride)%count;
}
export function makeLayout(nodes,data,name) {
  if(name==='saved')return nodes.map(n=>({...n}));
  if(!layoutNames[name])throw new Error('Unknown layout');
  if(name==='constellation') {
    // The default overview is a readable, continuous sky—not an assumption
    // that routed roots should become visible clumps. Those relationships are
    // still present in links, selection and the underlying catalogue data.
    return nodes.map((node,index)=>{
      const point=spherePoint(spreadIndex(index,nodes.length),nodes.length,1);
      const radius=80+495*Math.cbrt((index+.5)/nodes.length),seed=hash(node.id+'|field');
      return {...node,
        x:point.x*radius+(seed-.5)*11,
        y:point.y*radius*.86+(hash(node.id+'|field-y')-.5)*11,
        z:point.z*radius*.27+(hash(node.id+'|field-z')-.5)*9,
        pinned:node.tier==='yellow'};
    });
  }
  const components=new Map(),index=new Map(nodes.map((n,i)=>[n.id,i]));
  const parents=nodes.map((_,i)=>i);
  const find=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
  for(const e of data.edges){const a=find(index.get(e.from)),b=find(index.get(e.to));if(a!==b)parents[a]=b;}
  nodes.forEach((n,i)=>{
    // Existing routed hubs define related groups; other components retain
    // their own identities. Packing independent components is only placement.
    const key=data.routes[n.id]?.root||('component-'+find(i));
    if(!components.has(key))components.set(key,[]);
    components.get(key).push(n);
  });
  const groups=[...components.values()].sort((a,b)=>b.length-a.length||a[0].id.localeCompare(b[0].id));
  const result=new Map();
  groups.forEach((group,g)=>{
    // Place the group as one meaningful unit first; only then distribute its
    // members around that centre. The force targets can therefore preserve the
    // named silhouette instead of turning every preset into the same cloud.
    const centre=groupCentre(name,spreadIndex(g,groups.length),groups.length),ordered=[...group].sort((a,b)=>b.degree-a.degree||a.id.localeCompare(b.id));
    const radius=8+Math.cbrt(group.length)*8;
    ordered.forEach((n,i)=>{
      if(name==='globe')result.set(n.id,tangentClusterPoint(centre,i,ordered.length,radius,hash(n.id+'cluster')));
      else {
        const offset=clusterOffset(i,ordered.length,radius,hash(n.id+'cluster'),name==='galaxy'?.16:1);
        result.set(n.id,{x:centre.x+offset.x,y:centre.y+offset.y,z:centre.z+offset.z});
      }
    });
  });
  return nodes.map(n=>({...n,...result.get(n.id),pinned:n.tier==='yellow'}));
}
