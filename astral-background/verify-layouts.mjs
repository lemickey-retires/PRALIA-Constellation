import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {prepareNodes,GraphPhysics,initPhysics} from './graph-physics.mjs';
import {makeLayout} from './graph-layouts.mjs';
await initPhysics();
const data=JSON.parse(await readFile('../graphify-out/graph-3d-data.json','utf8'));
const base=prepareNodes(data),before=JSON.stringify(base),results=[];
for(const name of ['constellation','galaxy','globe','helix']) {
  const nodes=makeLayout(base,data,name);
  assert.equal(nodes.length,3520);
  assert.deepEqual(nodes.map(n=>n.id),base.map(n=>n.id));
  assert.ok(nodes.every(n=>[n.x,n.y,n.z].every(Number.isFinite)));
  const initialExtent=Object.fromEntries(['x','y','z'].map(axis=>[axis,Math.max(...nodes.map(n=>n[axis]))-Math.min(...nodes.map(n=>n[axis]))]));
  if(name==='globe') {
    const radii=nodes.map(n=>Math.hypot(n.x,n.y,n.z)),mean=radii.reduce((sum,value)=>sum+value,0)/radii.length;
    assert.ok(Math.max(...radii.map(value=>Math.abs(value-mean)))<.001,'globe is a true spherical shell');
    assert.ok(Math.max(...Object.values(initialExtent))-Math.min(...Object.values(initialExtent))<3,'globe silhouette is round in every axis');
  }
  if(name==='galaxy')assert.ok(initialExtent.y<Math.min(initialExtent.x,initialExtent.z)*.08,'galaxy is a thin disc');
  if(name==='helix')assert.ok(initialExtent.y>Math.max(initialExtent.x,initialExtent.z)*1.8,'helix is recognisably taller than it is wide');
  if(name==='constellation')assert.ok(initialExtent.z<Math.min(initialExtent.x,initialExtent.y)*.4,'constellation is a broad shallow field');
  const physics=new GraphPhysics(nodes,data.edges,data.routes,data.attraction);
  let overlaps=0,maxPenetration=0;
  for(let i=0;i<240;i++) {
    physics.step({pull:2,drift:true,speed:1,orbit:1});
    if(i%30===0) {
      const state=physics.clearance();overlaps=Math.max(overlaps,state.overlaps);
      maxPenetration=Math.max(maxPenetration,state.maxPenetration);
    }
  }
  results.push({name,nodes:nodes.length,sampledOverlaps:overlaps,maxPenetration,initialExtent,
    extent:Object.fromEntries(['x','y','z'].map(axis=>[axis,Math.max(...nodes.map(n=>n[axis]))-Math.min(...nodes.map(n=>n[axis]))]))});
  console.log(JSON.stringify(results.at(-1)));
  assert.equal(overlaps,0,name+' visible cores overlap');
  if(name!=='constellation') {
    const child=nodes.find(n=>data.routes[n.id]?.root&&data.routes[n.id].root!==n.id);
    const root=nodes.find(n=>n.id===data.routes[child.id].root);
    assert.ok(Math.hypot(child.x-root.x,child.y-root.y,child.z-root.z)<360,name+' keeps a routed community clustered around its root');
  }
  physics.dispose();
}
assert.equal(JSON.stringify(base),before,'Creating presets changed the saved arrangement');
assert.ok(new Set(results.map(r=>Math.round(r.extent.y))).size===4);
await writeFile('graph-layouts-receipt.json',JSON.stringify({checkedAt:new Date().toISOString(),results,originalArrangementUnchanged:true},null,2));
console.log(JSON.stringify(results,null,2));
