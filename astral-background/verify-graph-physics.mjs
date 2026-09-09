import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {initPhysics,GraphPhysics,prepareNodes} from './graph-physics.mjs';
await initPhysics();
const checks=[];
const node=(id,x,pinned=false)=>({id,x,y:0,z:0,radius:2,tier:'blue',pinned});
// A pointer pulled through a fixed obstacle must stop on the near side.
let physics=new GraphPhysics([node('moving',-10),node('fixed',0,true)]);
physics.startDrag(0);physics.moveDrag({x:10,y:0,z:0});
for(let i=0;i<240;i++)physics.step({pull:0,drift:false});
assert.equal(physics.clearance().overlaps,0);
assert.ok(physics.nodes[0].x < -4);
physics.endDrag(true);
for(let i=0;i<25;i++)physics.step({pull:0,drift:false});
assert.equal(physics.nodes[0].pinned,true);
const pinned=physics.nodes[0].x;
for(let i=0;i<60;i++)physics.step({pull:0,drift:false});
assert.equal(physics.nodes[0].x,pinned);
checks.push('Dragging through a fixed sphere is blocked; release pins the resolved position.');physics.dispose();
// CCD must catch a velocity capable of crossing the obstacle in one step.
physics=new GraphPhysics([node('fast',-10),node('wall',0,true)]);
physics.bodies[0].setLinvel({x:3000,y:0,z:0},true);
physics.world.step();physics.readPositions();
assert.ok(physics.nodes[0].x < 0);assert.equal(physics.clearance().overlaps,0);
checks.push('Fast-moving sphere cannot tunnel through a fixed sphere.');physics.dispose();
// Free bodies must push each other; movement is not just visual avoidance.
physics=new GraphPhysics([node('push',-10),node('free',0)]);
physics.startDrag(0);physics.moveDrag({x:10,y:0,z:0});
for(let i=0;i<160;i++)physics.step({pull:0,drift:false});
assert.ok(physics.nodes[1].x>5);assert.equal(physics.clearance().overlaps,0);
checks.push('A dragged sphere physically displaces a free sphere.');physics.dispose();
// A free drag should catch up quickly, without teleporting past contacts.
physics=new GraphPhysics([node('pointer',0)]);
physics.startDrag(0);physics.moveDrag({x:100,y:40,z:20});
for(let i=0;i<30;i++)physics.step({pull:0,drift:false});
assert.ok(Math.hypot(physics.nodes[0].x-100,physics.nodes[0].y-40,physics.nodes[0].z-20)<1.5);
checks.push('An unobstructed 3D drag reaches within 1.5 units of its target in half a second.');physics.dispose();
physics=new GraphPhysics([node('drop',0)]);
physics.startDrag(0);physics.moveDrag({x:8,y:4,z:2});
for(let i=0;i<10;i++)physics.step({pull:0,drift:false});
physics.endDrag(true);
for(let i=0;i<25;i++)physics.step({pull:0,drift:false});
assert.equal(physics.nodes[0].pinned,true);
assert.ok(Math.hypot(physics.nodes[0].x-8,physics.nodes[0].y-4,physics.nodes[0].z-2)<.2);
checks.push('A quick pointer release finishes its last physical movement before saving the pin.');physics.dispose();
// Children must follow a dragged hub through real graph forces in all axes.
physics=new GraphPhysics([node('hub',0),node('child',30)],[],{child:{anchor:'hub',hops:1}});
physics.startDrag(0);physics.moveDrag({x:60,y:30,z:40});
for(let i=0;i<60;i++)physics.step({pull:2,drift:false});
physics.endDrag(true);
for(let i=0;i<180;i++)physics.step({pull:2,drift:false});
assert.ok(physics.nodes[1].x>65&&physics.nodes[1].y>15&&physics.nodes[1].z>20);
assert.equal(physics.clearance().overlaps,0);
checks.push('Dragging a hub draws its child group after it in x, y and z.');physics.dispose();
// Gravity can be changed without moving pinned bodies.
physics=new GraphPhysics([node('gravity',0),node('pinned',40,true)]);
physics.bodies[0].setTranslation({x:20,y:0,z:0},true);
for(let i=0;i<120;i++)physics.step({pull:0,drift:false,repulsion:0,linkForce:0,cursor:0});
assert.ok(physics.nodes[0].x>19);
for(let i=0;i<240;i++)physics.step({pull:2,drift:false,repulsion:0,linkForce:0,cursor:0});
assert.ok(physics.nodes[0].x<10);assert.equal(physics.nodes[1].x,40);
checks.push('Gravity restores displaced free nodes and preserves fixed pins.');physics.dispose();
// The keep-apart setting must do visible work before solid cores collide.
physics=new GraphPhysics([node('repel-left',-14),node('repel-right',14)]);
const beforeRepulsion=Math.abs(physics.nodes[1].x-physics.nodes[0].x);
for(let i=0;i<120;i++)physics.step({pull:0,drift:false,repulsion:12,spacing:1.4,cursor:0,linkForce:0});
assert.ok(Math.abs(physics.nodes[1].x-physics.nodes[0].x)>beforeRepulsion+4);
checks.push('Adjustable keep-apart force separates nearby free nodes before collision.');physics.dispose();
// Link settings must be live forces, rather than static joints baked at startup.
physics=new GraphPhysics([node('link-left',-120),node('link-right',120)],[{from:'link-left',to:'link-right'}]);
const beforeLink=Math.abs(physics.nodes[1].x-physics.nodes[0].x);
for(let i=0;i<120;i++)physics.step({pull:0,drift:false,repulsion:0,cursor:0,linkForce:1.4,linkDistance:45});
assert.ok(Math.abs(physics.nodes[1].x-physics.nodes[0].x)<beforeLink-40);
checks.push('Live link force and link distance pull a connected pair toward its selected spring length.');physics.dispose();
// A cursor ray is a real physics field, not a screen-only hover effect.
physics=new GraphPhysics([node('cursor-node',0)]);
physics.setPointer({active:true,origin:{x:0,y:0,z:-70},direction:{x:0,y:0,z:1}});
for(let i=0;i<24;i++){physics.setPointer({active:true,origin:{x:0,y:0,z:-70},direction:{x:0,y:0,z:1}});physics.step({pull:0,drift:false,repulsion:0,cursor:2,spacing:1,pointerReach:2,linkForce:0});}
assert.ok(Math.hypot(physics.nodes[0].x,physics.nodes[0].y)>4);
checks.push('Moving the cursor ray repels nearby free nodes in the physical simulation.');physics.dispose();
// Test the complete actual graph, including every node and connected component.
const data=JSON.parse(await readFile('../graphify-out/graph-3d-data.json','utf8'));
const nodes=prepareNodes(data);
physics=new GraphPhysics(nodes,data.edges,data.routes,data.attraction);
let maxOverlap=0;const start=performance.now();
let stepTotal=0;
for(const animation of ['depth','float','breathe']) {
  const before=nodes.map(n=>({x:n.x,y:n.y,z:n.z}));
  for(let i=0;i<240;i++){
    physics.step({pull:2,drift:true,animation,speed:1.5,orbit:1.5,rebound:.5});stepTotal++;
    if(i%30===0) {
      const contact=physics.clearance();
      maxOverlap=Math.max(maxOverlap,contact.overlaps);
      if(contact.overlaps)console.log(JSON.stringify({animation,step:i,...contact}));
    }
  }
  assert.ok(nodes.some((n,i)=>Math.hypot(n.x-before[i].x,n.y-before[i].y,n.z-before[i].z)>3));
  assert.ok(nodes.some((n,i)=>Math.abs(n.z-before[i].z)>1));
  assert.equal(physics.clearance().overlaps,0);
}
const ms=(performance.now()-start)/stepTotal;
assert.equal(nodes.length,3520);assert.equal(data.edges.length,14520);
assert.equal(maxOverlap,0);assert.equal(physics.clearance().overlaps,0);
checks.push('The solid drag-and-drop physics core moves in three dimensions with zero sampled visible-core overlap in orbital, float and breathing modes; all-star visual-field motion is checked separately.');
const result={checkedAt:new Date().toISOString(),checks,nodes:nodes.length,edges:data.edges.length,
  physicalSprings:physics.jointCount,sampledOverlaps:maxOverlap,averageHeadlessStepMs:ms,
  note:'Native physics tests, not a browser FPS benchmark. Screen projection may occlude spheres at different depths.'};
physics.dispose();await writeFile('graph-3d-physics-receipt.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
