import {layoutNames as originalNames,layoutDescriptions as originalDescriptions,makeLayout as originalLayout} from './rendering/graph-layouts.mjs';
import {prepareNodes,hash} from './rendering/graph-physics.mjs';
export const sources=[
  {id:'notes',name:'Routines',colour:'#61cae3',centre:[-190,210,25]},
  {id:'memory',name:'Memory',colour:'#e7ba6e',centre:[85,235,60]},
  {id:'conversations',name:'Conversations',colour:'#e49bbb',centre:[250,40,-20]},
  {id:'graph',name:'Library',colour:'#a5d4a8',centre:[-275,-75,35]},
  {id:'mirrors',name:'Files',colour:'#7688ac',centre:[-55,-165,-190]},
  {id:'agents',name:'Activity',colour:'#b9a4eb',centre:[-325,135,85]},
  {id:'archive',name:'Settings',colour:'#b7aaa0',centre:[-80,-325,90]}
];
const sourceLookup=Object.fromEntries(sources.map(s=>[s.id,s]));
export function sourceId(n){
  if(['note','builtin'].includes(n.kind))return 'notes';
  if(['fact','summary','lesson','crystal','semantic','procedure'].includes(n.kind))return 'memory';
  if(['observation','session'].includes(n.kind))return 'conversations';
  if(['graph-node','graph-edge','memory-relation'].includes(n.kind))return 'graph';
  if(n.kind==='mirror')return 'mirrors';
  if(n.kind==='agent')return 'agents';
  return 'archive';
}
export const sourceColour=n=>sourceLookup[sourceId(n)].colour;
export const layoutNames={atlas:'Source sections',...originalNames};
export const layoutDescriptions={atlas:'Real records grouped by their source, separated in depth. All saved relationships remain available.',...originalDescriptions};
export function viewLayout(data,baseline,key,saved){
  let result;
  if(saved)result=prepareNodes(data,null,saved);
  else if(key!=='atlas')result=originalLayout(baseline,data,key);
  else {
    const placed=new Map();
    for(const source of sources){
      const group=baseline.filter(n=>sourceId(n)===source.id).sort((a,b)=>b.degree-a.degree||a.id.localeCompare(b.id));
      const radius=source.id==='mirrors'?155:20+Math.cbrt(group.length)*13;
      group.forEach((n,i)=>{
        const phi=i*2.39996323,vertical=1-2*(i+.5)/group.length;
        const span=Math.sqrt(1-vertical*vertical),distance=radius*(.28+.72*Math.cbrt(hash(n.id+'section')));
        placed.set(n.id,{...n,x:source.centre[0]+Math.cos(phi)*span*distance,y:source.centre[1]+vertical*distance,z:source.centre[2]+Math.sin(phi)*span*distance*.80});
      });
    }
    result=baseline.map(n=>placed.get(n.id));
  }
  if(key==='atlas')result=result.map(n=>({...n,sourceGroup:sourceId(n),radius:n.kind==='mirror'?(n.degree>200?4.4:1.25):n.kind==='agent'?5:n.tier==='yellow'?4.4:n.tier==='white'?2.8:1.9}));
  return result;
}
// A spanning forest plus a bounded set of local cycles selects existing links;
// it never invents a relationship. The extra cycles make a legible structural
// web around each parent without rendering every possible cross-reference.
export function keyConnections(nodes,data){
  const index=new Map(nodes.map((n,i)=>[n.id,i])),parent=nodes.map((_,i)=>i);
  const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
  const sorted=data.edges.map((e,i)=>{
    const a=index.get(e.from),b=index.get(e.to),n=nodes[a],m=nodes[b];
    return {i,a,b,d:(sourceId(n)===sourceId(m)?0:1000000)+(n.x-m.x)**2+(n.y-m.y)**2+(n.z-m.z)**2};
  }).sort((a,b)=>a.d-b.d||a.i-b.i);
  const result=new Set(),bridges=new Map(),mirrorDegree=new Map();
  for(const e of sorted){
    const a=root(e.a),b=root(e.b);if(a===b)continue;
    const from=sourceId(nodes[e.a]),to=sourceId(nodes[e.b]);
    if(from==='mirrors'&&to==='mirrors'){
      if((mirrorDegree.get(e.a)||0)>=12||(mirrorDegree.get(e.b)||0)>=12)continue;
      mirrorDegree.set(e.a,(mirrorDegree.get(e.a)||0)+1);mirrorDegree.set(e.b,(mirrorDegree.get(e.b)||0)+1);
    }
    if(from!==to){const pair=[from,to].sort().join(':');if((bridges.get(pair)||0)>=2)continue;bridges.set(pair,(bridges.get(pair)||0)+1);}
    parent[a]=b;result.add(e.i);
  }
  const degree=new Uint16Array(nodes.length);
  for(const i of result){const e=data.edges[i];degree[index.get(e.from)]++;degree[index.get(e.to)]++;}
  let extras=0;const extraLimit=Math.ceil(nodes.length*.6);
  for(const e of sorted){
    if(extras>=extraLimit||result.has(e.i)||sourceId(nodes[e.a])!==sourceId(nodes[e.b]))continue;
    if(degree[e.a]>=3||degree[e.b]>=3)continue;
    result.add(e.i);degree[e.a]++;degree[e.b]++;extras++;
  }
  return result;
}

export function recordHubs(nodes){
  const choose=(kind,count)=>nodes.filter(n=>n.kind===kind).sort((a,b)=>b.degree-a.degree||a.id.localeCompare(b.id)).slice(0,count);
  return [...choose('agent',2),...choose('note',1),...choose('graph-node',1),...choose('mirror',1)].map(n=>n.id);
}

// Physical anchors are a view concern. Keep the source records and their
// relationships intact while avoiding orbits centred in another section.
export function physicsData(data,key){
  if(key!=='atlas')return data;
  const byId=new Map(data.nodes.map(n=>[n.id,n]));
  const routes=Object.fromEntries(Object.entries(data.routes).map(([id,route])=>{
    const node=byId.get(id),anchor=byId.get(route.anchor);
    return [id,node&&anchor&&sourceId(node)===sourceId(anchor)?route:{...route,anchor:undefined}];
  }));
  return {...data,routes};
}
