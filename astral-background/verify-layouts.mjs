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
  const physics=new GraphPhysics(nodes,data.edges,data.routes,data.attraction);
  let overlaps=0,maxPenetration=0;
  for(let i=0;i<240;i++) {
    physics.step({pull:2,drift:true,speed:1,orbit:1});
    if(i%30===0) {
      const state=physics.clearance();overlaps=Math.max(overlaps,state.overlaps);
      maxPenetration=Math.max(maxPenetration,state.maxPenetration);
    }
  }
  results.push({name,nodes:nodes.length,sampledOverlaps:overlaps,maxPenetration,
    extent:Object.fromEntries(['x','y','z'].map(axis=>[axis,Math.max(...nodes.map(n=>n[axis]))-Math.min(...nodes.map(n=>n[axis]))]))});
  console.log(JSON.stringify(results.at(-1)));
  assert.equal(overlaps,0,name+' visible cores overlap');
  physics.dispose();
}
assert.equal(JSON.stringify(base),before,'Creating presets changed the saved arrangement');
assert.ok(new Set(results.map(r=>Math.round(r.extent.y))).size===4);
await writeFile('graph-layouts-receipt.json',JSON.stringify({checkedAt:new Date().toISOString(),results,originalArrangementUnchanged:true},null,2));
console.log(JSON.stringify(results,null,2));
