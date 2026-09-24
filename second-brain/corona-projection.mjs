import * as THREE from 'three';

// A single outline is projected onto the sphere's exact apparent ellipse.
// Its width, shoulders and UVs do not morph as the camera turns. In particular,
// no vertices interpolate between a camera-facing sheet and a physical disk.
export const coronaShapeGLSL=`
vec2 auraPoint(float angle,float r){
 float c=cos(angle),s=sin(angle),side=pow(abs(c),6.);
 float radius=uInnerRadius+r*uRadialSpan;
 return vec2(c*radius+sign(c)*uSideSpan*side*smoothstep(0.,.30,r),s*radius*(1.-.25*side*r));
}
uniform vec4 uAuraCentre;
uniform vec2 uAuraX;uniform vec2 uAuraY;
vec4 projectAura(vec2 point){
 vec4 clip=uAuraCentre;
 clip.xy+=(uAuraX*point.x+uAuraY*point.y)*clip.w;
 return clip;
}`;

export function auraProjectionUniforms(spec){
 return {uInnerRadius:{value:spec.halo.innerRadius},uRadialSpan:{value:spec.halo.radialSpan},
   uSideSpan:{value:spec.halo.sideSpan},uAuraCentre:{value:new THREE.Vector4()},
   uAuraX:{value:new THREE.Vector2()},uAuraY:{value:new THREE.Vector2()}};
}

// The ellipse follows from the tangent-ray discriminant of a unit sphere.
// Exposed separately so camera sweeps can verify it without a WebGL context.
export function sphereEllipseFrame(centre,radius,projection,tilt){
 const c=centre.clone().divideScalar(radius),p=projection.elements;
 if(c.z>=-1.001)return null; // Behind / crossing the eye plane: no valid bounded ellipse.
 const a=c.z*c.z-1,k=c.lengthSq()-1;
 const minor=1/Math.sqrt(a),major=Math.sqrt(k)/a;
 const radial=new THREE.Vector2(c.x,c.y);
 if(radial.lengthSq()<1e-12)radial.set(1,0);else radial.normalize();
 const ellipse=v=>v.clone().multiplyScalar(minor).addScaledVector(radial,v.dot(radial)*(major-minor));
 const axisX=ellipse(new THREE.Vector2(Math.cos(tilt),Math.sin(tilt)));
 const axisY=ellipse(new THREE.Vector2(-Math.sin(tilt),Math.cos(tilt)));
 axisX.multiply(new THREE.Vector2(p[0],p[5]));axisY.multiply(new THREE.Vector2(p[0],p[5]));
 const tangent=centre.clone().multiplyScalar(1-1/c.lengthSq());
 const clip=new THREE.Vector4(...tangent.toArray(),1).applyMatrix4(projection);
 clip.x=(-c.z*c.x/a*p[0]-p[8])*clip.w;
 clip.y=(-c.z*c.y/a*p[5]-p[9])*clip.w;
 return {centre:clip,axisX,axisY};
}

export function attachAuraProjection(mesh,spec){
 const centre=new THREE.Vector3();
 mesh.onBeforeRender=(_renderer,_scene,camera)=>{
   centre.setFromMatrixPosition(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
   const frame=sphereEllipseFrame(centre,mesh.matrixWorld.getMaxScaleOnAxis(),camera.projectionMatrix,spec.halo.tilt);
   const u=mesh.material.uniforms;
   if(!frame){u.uAuraCentre.value.set(0,0,2,1);u.uAuraX.value.set(0,0);u.uAuraY.value.set(0,0);return;}
   u.uAuraCentre.value.copy(frame.centre);u.uAuraX.value.copy(frame.axisX);u.uAuraY.value.copy(frame.axisY);
 };
}
