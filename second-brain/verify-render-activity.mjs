import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RenderActivity} from './render-activity.mjs';

for(const refresh of [30,60,75,120,144,240]){
  const policy=new RenderActivity(0);let frames=0;
  for(let i=0;i<refresh*10;i++)if(policy.frameDue(i*1000/refresh))frames++;
  assert.ok(Math.abs(frames-Math.min(refresh,60)*10)<=1,`${refresh} Hz: ${frames} frames in ten seconds`);
}
const activity=new RenderActivity(0);
const jittered=new RenderActivity(0);let jitterFrames=0;
for(let i=0;i<600;i++)if(jittered.frameDue(i*1000/60+Math.sin(i*1.7)*.45))jitterFrames++;
assert.equal(jitterFrames,600,'Submillisecond vsync jitter must not drop frames');
assert.equal(activity.checkIdle(29999),false);
assert.equal(activity.checkIdle(30000),true);
assert.equal(activity.touch(600000),true);
assert.equal(activity.frameDue(600000),true,'Wake without waiting for old deadlines');
assert.equal(activity.frameDue(600001),false,'Do not render a catch-up burst');
assert.equal(activity.checkIdle(629999),false);
assert.equal(activity.checkIdle(630000,true),false,'Do not sleep during a held interaction');
assert.equal(activity.checkIdle(659999),false);
assert.equal(activity.checkIdle(660000),true);
const rendererSource=readFileSync(new URL('./memory-3d.mjs',import.meta.url),'utf8');
assert.match(rendererSource,/e\.button!==0/,'Left pointer must arm field scaling');
assert.match(rendererSource,/leftPointerHeld\|\|\(e\.buttons&1\)/,'Held-left wheel input must scale the field');
assert.match(rendererSource,/settings\.spacing\*Math\.exp\(-delta\*\.0015\)/,'Wheel delta must smoothly scale field density');
assert.match(rendererSource,/settings\.spacing\)\.project\(camera\)/,'Group collision proxy must follow visible sphere spacing');
assert.match(rendererSource,/dx\*\.72/,'Visible node volume must preserve strong physical agency');
assert.doesNotMatch(rendererSource,/groupShellGeometry|groupHubGeometry/,'Synthetic group shells and hub balls must stay removed');
assert.match(rendererSource,/dataset\.groupShells!==?'0'/,'Runtime evidence must report that no group shells are rendered');
assert.match(rendererSource,/visualHubIndices/,'A real record node must anchor each visible group');
assert.doesNotMatch(rendererSource,/hash\(groupId\+'\|3d-tumble'\)/,'Per-node render loop must not repeat group motion hashes');
console.log('PASS: frame pacing, idle wake, held-left field scaling, node-made groups, real-record hubs, spacing-aware collision and visible physical agency.');
