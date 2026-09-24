// Bundle for Node with the same dependency paths as build-view.mjs.
// This checks expanded-volume coverage and exact restoration for Planetary.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeVolume,setNativeVolumeExtent} from './native-horizon-volume.mjs';

const manifest=JSON.parse(readFileSync('site/assets/native-volumes.json','utf8'));
const optics=JSON.parse(readFileSync('site/assets/continuous-optics.json','utf8'));
for(const spec of manifest.volumes){
 for(const stretch of [optics.diskRadialStretch,optics.outerAura.radialStretch]){
  const mesh=createNativeVolume({spec,texture:null});
  const u=mesh.material.uniforms,original=mesh.geometry;
  const snapshot=[u.uMin.value.toArray(),u.uMax.value.toArray(),u.uSupportRadius.value.toArray()];
  setNativeVolumeExtent(mesh,stretch);
  const expanded=mesh.geometry;
  expanded.computeBoundingBox();
  assert.ok(expanded.boundingBox.min.distanceTo(u.uMin.value)<1e-5);
  assert.ok(expanded.boundingBox.max.distanceTo(u.uMax.value)<1e-5);
  assert.notEqual(expanded,original);
  assert.ok(u.uSupportRadius.value.x>1,'The expanded disk must retain its central hole');
  assert.ok(u.uSupportRadius.value.y>spec.support.radius[1]);
  for(let i=0;i<64;i++){
    const angle=i/64*Math.PI*2,radius=u.uSupportRadius.value.y;
    const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    for(const height of spec.support.height){
      const y=-spec.planeOffset+z*spec.planeSlope+height;
      assert.ok(x>=u.uMin.value.x&&x<=u.uMax.value.x);
      assert.ok(z>=u.uMin.value.z&&z<=u.uMax.value.z);
      assert.ok(y>=u.uMin.value.y&&y<=u.uMax.value.y,'Bounds must enclose the tilted emitting plane');
    }
  }
  setNativeVolumeExtent(mesh,1);
  assert.equal(mesh.geometry,original);
  assert.deepEqual([u.uMin.value.toArray(),u.uMax.value.toArray(),u.uSupportRadius.value.toArray()],snapshot);
  assert.equal(u.uRadialStretch.value,1);
  setNativeVolumeExtent(mesh,stretch);
  assert.equal(mesh.geometry,expanded,'Preset toggles must reuse their geometry');
  setNativeVolumeExtent(mesh,1);
  assert.equal(mesh.geometry,original);
 }
}
console.log('PASS: expanded disk and stream bounds, central holes, exact preset restoration and geometry reuse.');
