import fs from 'node:fs';

const path=new URL('./site/graph-3d-data.json',import.meta.url);
const graph=JSON.parse(fs.readFileSync(path,'utf8'));
const additions=[
  {kind:'agent',target:24,start:7,community:6,crossKind:'observation',crossCount:224,crossStep:17},
  {kind:'archive',target:24,start:3,community:7,crossKind:'session',crossCount:146,crossStep:19}
];
let nextEdge=Math.max(...graph.edges.map(edge=>Number(edge.id.match(/(\d+)$/)?.[1])||0))+1;
const pad=value=>String(value).padStart(3,'0');
const edge=(from,to)=>({from,to,id:`demo-link-${nextEdge++}`,source:from,target:to,relation:'links_to',edgeClass:'reference',confidence:'EXTRACTED',confidenceCategory:'demonstration',inferenceStatus:'synthetic',evidence:'Invented demonstration relationship; no real claim.',line:1});

for(const spec of additions){
  const rootId=`demo-${spec.kind}-001`,root=graph.nodes.find(node=>node.id===rootId);
  if(!root)throw new Error(`Missing ${rootId}`);
  for(let number=spec.start;number<=spec.target;number++){
    const id=`demo-${spec.kind}-${pad(number)}`;
    if(graph.nodes.some(node=>node.id===id))continue;
    const angle=number*2.39996323,radius=55+(number%5)*9;
    const label=`Demo ${spec.kind} ${pad(number)}`;
    graph.nodes.push({id,label,title:label,kind:spec.kind,source:`demonstration/${spec.kind}/${pad(number)}.md`,content:`# ${label}\n\nThis is invented demonstration content. It contains no personal memory, conversation, agent instructions or live service data.`,x:root.x+Math.cos(angle)*radius,y:root.y+Math.sin(angle)*radius,community:spec.community,degree:0,scope:'synthetic',agent:'Demo agent'});
    graph.routes[id]={root:rootId,anchor:number===spec.start?rootId:`demo-${spec.kind}-${pad(number-1)}`,hops:number-1};
    graph.edges.push(edge(number===spec.start?rootId:`demo-${spec.kind}-${pad(number-1)}`,id));
    const cross=`demo-${spec.crossKind}-${pad(1+(number*spec.crossStep)%spec.crossCount)}`;
    graph.edges.push(edge(id,cross));
  }
  graph.inventory.counts[spec.kind]=graph.nodes.filter(node=>node.kind===spec.kind).length;
}

const degree=new Map(graph.nodes.map(node=>[node.id,0]));
for(const {from,to} of graph.edges){degree.set(from,(degree.get(from)||0)+1);degree.set(to,(degree.get(to)||0)+1);}
for(const node of graph.nodes)node.degree=degree.get(node.id)||0;
fs.writeFileSync(path,JSON.stringify(graph));
console.log(JSON.stringify({nodes:graph.nodes.length,edges:graph.edges.length,agents:graph.inventory.counts.agent,archives:graph.inventory.counts.archive}));
