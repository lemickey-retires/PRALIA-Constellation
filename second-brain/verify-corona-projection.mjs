// Bundle for Node using build-view.mjs's dependency paths.
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {sphereEllipseFrame} from './corona-projection.mjs';

let tangentRays=0;
for(const aspect of [.7,1.4,2.2]){
  const camera=new THREE.PerspectiveCamera(48,aspect,.01,1000);
  for(const z of [-1.2,-2,-4,-8])for(const x of [-8,-3,0,3,8])for(const y of [-3,0,3]){
    const centre=new THREE.Vector3(x,y,z);
    const frame=sphereEllipseFrame(centre,1,camera.projectionMatrix,.25);
    assert.ok(frame);
    const {axisX,axisY}=frame;
    assert.ok(axisX.x*axisY.y-axisX.y*axisY.x>0,'Projection must not fold or mirror the aura');
    for(let i=0;i<48;i++){
      const angle=i*Math.PI/24;
      const ndc=new THREE.Vector2(frame.centre.x/frame.centre.w,frame.centre.y/frame.centre.w)
        .addScaledVector(axisX,Math.cos(angle)).addScaledVector(axisY,Math.sin(angle));
      const ray=new THREE.Vector3(ndc.x/camera.projectionMatrix.elements[0],ndc.y/camera.projectionMatrix.elements[5],-1).normalize();
      const discriminant=ray.dot(centre)**2-(centre.lengthSq()-1);
      assert.ok(Math.abs(discriminant)<1e-8,'Inner outline must be tangent to the actual core under pan and zoom');
      tangentRays++;
    }
  }
}
assert.equal(sphereEllipseFrame(new THREE.Vector3(0,0,2),1,new THREE.Matrix4(),.25),null);
assert.equal(sphereEllipseFrame(new THREE.Vector3(0,0,-.5),1,new THREE.Matrix4(),.25),null);
console.log(`PASS: ${tangentRays} tangent rays across camera offsets, distances and aspect ratios; no mirrored/folded projection; behind-camera guard.`);
