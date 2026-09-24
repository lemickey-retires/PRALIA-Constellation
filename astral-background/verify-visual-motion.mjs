import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareNodes} from './graph-physics.mjs';
import {makeLayout} from './graph-layouts.mjs';
import {VisualMotion} from './graph-visual-motion.mjs';

const data = JSON.parse(await readFile('../graphify-out/graph-3d-data.json', 'utf8'));
const settings = {animation:'depth',speed:.8,orbit:.8,spacing:1,center:.5,cohesion:.8,repulsion:2,cursor:1.2,pointerReach:1.5,linkForce:.3,linkDistance:90};
const nodes = makeLayout(prepareNodes(data), data, 'globe');
const motion = new VisualMotion(nodes, data);
assert.equal(motion.count, 3520);
assert.ok(motion.links.length > 2000 && motion.links.length < data.edges.length);
const before = Array.from(motion.positions);
const samples = [];
for (let step = 0; step < 180; step++) {
  const started = performance.now();
  motion.step(1 / 60, settings, true);
  samples.push(performance.now() - started);
}
let moved = 0;
for (let index = 0; index < nodes.length; index++) {
  const offset = index * 3;
  if (Math.hypot(motion.positions[offset] - before[offset], motion.positions[offset + 1] - before[offset + 1], motion.positions[offset + 2] - before[offset + 2]) > .08) moved++;
}
assert.ok(moved > 3400, 'the visual field animates the full rendered population');
const radii = nodes.map((_, index) => {
  const offset = index * 3;
  return Math.hypot(motion.positions[offset], motion.positions[offset + 1], motion.positions[offset + 2]);
});
assert.ok(Math.max(...radii) - Math.min(...radii) < 80, 'visual drift preserves the recognisable globe shell');
const target = 0, offset = target * 3, previousX = motion.positions[offset];
motion.setPointer({active:true, origin:{x:motion.positions[offset],y:motion.positions[offset + 1],z:motion.positions[offset + 2] - 70}, direction:{x:0,y:0,z:1}});
for (let step = 0; step < 24; step++) motion.step(1 / 60, settings, true);
assert.ok(Math.abs(motion.positions[offset] - previousX) > 4 || Math.abs(motion.positions[offset + 1] - motion.base[offset + 1]) > 4,
  'pointer field visibly deflects a rendered star');
const formationTargets = makeLayout(prepareNodes(data), data, 'helix');
const averageRadius = positions => {
  let total = 0;
  for (let index = 0; index < nodes.length; index++) {
    const point = index * 3;
    total += Math.hypot(positions[point], positions[point + 1], positions[point + 2]);
  }
  return total / nodes.length;
};
const formationStartRadius = averageRadius(motion.positions);
motion.beginFormation(formationTargets);
assert.equal(motion.isForming, true);
for (let step = 0; step < 30; step++) motion.step(1 / 60, settings, true);
const collapsedRadius = averageRadius(motion.positions);
assert.ok(collapsedRadius < formationStartRadius * .22, 'a layout transition gathers the stars through the centre');
for (let step = 0; step < 150; step++) motion.step(1 / 60, settings, true);
assert.equal(motion.isForming, false, 'formation completes and hands back to the live field');
const formationExtent = axis => {
  const position = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  let low = Infinity, high = -Infinity;
  for (let index = 0; index < nodes.length; index++) {
    const value = motion.positions[index * 3 + position]; low = Math.min(low, value); high = Math.max(high, value);
  }
  return high - low;
};
const helixExtent={x:formationExtent('x'),y:formationExtent('y'),z:formationExtent('z')};
assert.ok(helixExtent.y > Math.max(helixExtent.x, helixExtent.z) * 1.65, 'the formation resolves into the selected helix silhouette');
const averageStepMs = samples.reduce((sum, value) => sum + value, 0) / samples.length;
const sortedSamples=[...samples].sort((left,right)=>left-right),p95StepMs=sortedSamples[Math.floor(sortedSamples.length*.95)];
assert.ok(p95StepMs < 30, 'each scheduled full force-field update leaves room for browser rendering on this machine');
assert.ok(averageStepMs < 8, 'the amortised all-star motion stays well below the 40 Hz force cadence budget');
console.log(JSON.stringify({nodes:motion.count,sparseForceLinks:motion.links.length,moved,globeRadialRange:Math.max(...radii)-Math.min(...radii),formationStartRadius,collapsedRadius,helixExtent,averageStepMs,p95StepMs,peakStepMs:Math.max(...samples)}, null, 2));
