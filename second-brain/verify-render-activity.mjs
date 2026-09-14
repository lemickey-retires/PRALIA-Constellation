import assert from 'node:assert/strict';
import {RenderActivity} from './render-activity.mjs';

for(const refresh of [30,60,75,120,144,240]){
  const policy=new RenderActivity(0);let frames=0;
  for(let i=0;i<refresh*10;i++)if(policy.frameDue(i*1000/refresh))frames++;
  assert.ok(Math.abs(frames-Math.min(refresh,60)*10)<=1,`${refresh} Hz: ${frames} frames in ten seconds`);
}
const activity=new RenderActivity(0);
assert.equal(activity.checkIdle(29999),false);
assert.equal(activity.checkIdle(30000),true);
assert.equal(activity.touch(600000),true);
assert.equal(activity.frameDue(600000),true,'Wake without waiting for old deadlines');
assert.equal(activity.frameDue(600001),false,'Do not render a catch-up burst');
assert.equal(activity.checkIdle(629999),false);
assert.equal(activity.checkIdle(630000,true),false,'Do not sleep during a held interaction');
assert.equal(activity.checkIdle(659999),false);
assert.equal(activity.checkIdle(660000),true);
console.log('PASS: 30–240 Hz frame pacing, 30-second idle, held interaction and immediate wake without catch-up.');
