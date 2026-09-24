import {hash} from './graph-physics.mjs';
export const layoutNames={saved:'My layout',constellation:'Constellation',galaxy:'Galaxy',globe:'Globe',helix:'Helix'};
export const layoutDescriptions={
  saved:'Your own saved arrangement and pins.',
  constellation:'Related nodes gather around their hubs in distinct three-dimensional groups.',
  galaxy:'Three sweeping arms with related communities beside one another.',
  globe:'Communities distributed across a spherical shell.',
  helix:'Two rising strands, with their real connections crossing between them.'};
const golden=Math.PI*(3-Math.sqrt(5));
function spherePoint(i,count,radius) {
  const y=1-2*(i+.5)/count,span=Math.sqrt(Math.max(0,1-y*y)),a=i*golden;
  return {x:Math.cos(a)*span*radius,y:y*radius,z:Math.sin(a)*span*radius};
}
export function makeLayout(nodes,data,name) {
  if(name==='saved')return nodes.map(n=>({...n}));
  if(!layoutNames[name])throw new Error('Unknown layout');
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
  const ordered=groups.flatMap(g=>g.sort((a,b)=>b.degree-a.degree||a.id.localeCompare(b.id)));
  const result=new Map();
  if(name==='constellation') {
    let small=0;
    groups.forEach((group,g)=>{
      const large=group.length>8;
      const centre=spherePoint(large?g:small++,large?Math.min(groups.length,24):Math.max(1,groups.filter(a=>a.length<=8).length),large?230:520);
      const radius=large?Math.cbrt(group.length)*13:10;
      group.forEach((n,i)=>{
        const offset=i===0?{x:0,y:0,z:0}:spherePoint(i-1,group.length-1,radius*Math.cbrt((i+.5)/group.length));
        result.set(n.id,{x:centre.x+offset.x,y:centre.y+offset.y,z:centre.z+offset.z});
      });
    });
  }else ordered.forEach((n,i)=>{
    const t=(i+.5)/ordered.length,phase=hash(n.id)*Math.PI*2;
    let p;
    if(name==='galaxy') {
      const arm=i%3,a=arm*Math.PI*2/3+Math.sqrt(t)*Math.PI*2.1;
      const radius=65+Math.sqrt(t)*470,jitter=(hash(n.id+'spread')-.5)*38;
      p={x:Math.cos(a)*(radius+jitter),y:(hash(n.id+'height')-.5)*(35+60*(1-t)),z:Math.sin(a)*(radius+jitter)};
    }else if(name==='globe') {
      p=spherePoint(i,ordered.length,365+(hash(n.id+'shell')-.5)*30);
    }else {
      const strand=i%2,a=t*Math.PI*6+strand*Math.PI,radius=180+(hash(n.id+'helix')-.5)*65;
      p={x:Math.cos(a)*radius,y:(t-.5)*850+(hash(n.id+'rise')-.5)*18,z:Math.sin(a)*radius};
    }
    result.set(n.id,p);
  });
  return nodes.map(n=>({...n,...result.get(n.id),pinned:n.tier==='yellow'}));
}
