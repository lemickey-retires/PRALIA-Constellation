import * as THREE from 'three';
import {createContinuousCoronaMaterial} from './continuous-corona.mjs';

// Fixed, curved layers of the accepted aura, with the original UV material.
// Their reference view shares the previous contour. Camera movement never
// changes their vertices, world pose or depth; orbiting reveals parallax.
export const auraDepth={referenceDistance:4.2,layers:33,segments:512,bands:32};
const smooth=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t);};
export function sculptedAuraPoint(spec,angle,r,layer=0){
 const c=Math.cos(angle),s=Math.sin(angle),side=Math.abs(c)**6;
 const radius=spec.halo.innerRadius+r*spec.halo.radialSpan;
 const x=c*radius+Math.sign(c)*spec.halo.sideSpan*side*smooth(0,.30,r);
 const y=s*radius*(1-.25*side*r);
 const d=auraDepth.referenceDistance,tangentDepth=1/d,tangentRadius=Math.sqrt(1-1/(d*d));
 const depth=tangentDepth+layer*(.24+.38*r+.65*side*smooth(.04,.8,r));
 const perspective=(d-depth)/(d-tangentDepth);
 return new THREE.Vector3(x*tangentRadius*perspective,y*tangentRadius*perspective,depth);
}

export function sculptedAuraOrientation(){
 // This is a fixed authoring transform, independent of the active camera.
 return new THREE.Quaternion().setFromEuler(new THREE.Euler(.20,0,.25)).invert()
   .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,.25)));
}

export function whiteWrapPoint(angle,r,layer=0){
 const radius=1.008+4.2*r;
 const x=Math.cos(angle)*radius,z=-Math.sin(angle)*radius;
 const thickness=.025+.18*Math.exp(-r*8);
 return new THREE.Vector3(x,-.06+z*.035+layer*thickness,z);
}

function weightedFlowMaterial(asset,weight,photonStrength=1){
 const material=createContinuousCoronaMaterial(asset);
 material.vertexShader='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
 material.fragmentShader='uniform float uLayerWeight;\n'+material.fragmentShader.replace('vec4(radiance*taper/alpha,alpha)','vec4(radiance*taper/alpha,alpha*uLayerWeight)');
 if(photonStrength!==1)material.fragmentShader=material.fragmentShader.replace('float soft=',`photon*=${photonStrength.toFixed(1)};float soft=`);
 material.uniforms.uLayerWeight={value:weight};
 return material;
}

export function createWhiteSurround(asset){
 const group=new THREE.Group();group.name='White aura — complete front back and side surround';
 const segments=256,bands=64,layers=25;
 const weights=Array.from({length:layers},(_,i)=>Math.exp(-Math.pow((i/(layers-1)*2-1)*2.2,2)));
 const totalWeight=weights.reduce((a,b)=>a+b,0);
 for(let layer=0;layer<layers;layer++){
   const position=[],uv=[],indices=[];
   for(let row=0;row<=bands;row++)for(let col=0;col<=segments;col++){
     const r=row/bands,u=col/segments;
     position.push(...whiteWrapPoint(u*Math.PI*2,r,layer/(layers-1)*2-1).toArray());uv.push(u,1-r);
   }
   for(let row=0;row<bands;row++)for(let col=0;col<segments;col++){
     const a=row*(segments+1)+col,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);
   }
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(position,3));
   geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);
   // The fine core contour already has physical shells. The surround carries
   // the same flowing gas, without multiplying that contour into stacked bands.
   const mesh=new THREE.Mesh(geometry,weightedFlowMaterial(asset,.55*weights[layer]/totalWeight,0));
   mesh.name='White full-surround flow '+(layer+1);mesh.frustumCulled=false;mesh.renderOrder=-25;group.add(mesh);
 }
 return group;
}

export function createSculptedCorona(asset){
 const group=new THREE.Group();group.name='Original flowing aura — curved layers with real depth';
 group.quaternion.copy(sculptedAuraOrientation());
 const {segments,bands,layers}=auraDepth;
 const weights=Array.from({length:layers},(_,i)=>Math.exp(-Math.pow((i/(layers-1)*2-1)*1.7,2)));
 const sum=weights.reduce((a,b)=>a+b,0);
 for(let layer=0;layer<layers;layer++){
   const position=[],uv=[],indices=[],depth=layer/(layers-1)*2-1;
   for(let row=0;row<=bands;row++)for(let col=0;col<=segments;col++){
     const r=row/bands,u=col/segments,p=sculptedAuraPoint(asset.spec,u*Math.PI*2,r,depth);
     position.push(...p.toArray());uv.push(u,1-r);
   }
   for(let row=0;row<bands;row++)for(let col=0;col<segments;col++){
     const a=row*(segments+1)+col,b=a+segments+1;
     indices.push(a,b,a+1,b,b+1,a+1);
   }
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',new THREE.Float32BufferAttribute(position,3));
   geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);
   const material=weightedFlowMaterial(asset,weights[layer]/sum*.52+(layer===(layers-1)/2?.48:0));
   const mesh=new THREE.Mesh(geometry,material);mesh.name='Curved flowing-light layer '+(layer+1);
   mesh.frustumCulled=false;mesh.renderOrder=-25;group.add(mesh);
 }
 // Actual spherical light shells keep the fine inner contour continuous when
 // the curved flow moves behind the opaque core. They have real surface depth.
 for(const [index,[radius,strength]] of [[1.016,.65],[1.048,.20],[1.087,.08]].entries()){
   const material=new THREE.ShaderMaterial({
     vertexShader:'varying vec3 vWorld;varying vec3 vNormal;void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}',
     fragmentShader:'uniform float uTime;uniform float uStrength;varying vec3 vWorld;varying vec3 vNormal;void main(){float rim=pow(max(0.,1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)))),8.);if(rim<.0001)discard;gl_FragColor=vec4(vec3(1.,.93,.80)*uStrength,rim);}',
     uniforms:{uTime:{value:0},uStrength:{value:strength}},transparent:true,depthWrite:false,depthTest:true,toneMapped:false,blending:THREE.AdditiveBlending});
   const shell=new THREE.Mesh(new THREE.SphereGeometry(radius,256,128),material);
   shell.name='Fine inner emission shell '+(index+1);shell.renderOrder=-25;group.add(shell);
 }
 const surround=createWhiteSurround(asset);
 // The complete ring shares the disk's fixed tilt, while the preserved
 // contour layers keep their authored composition above it.
 surround.quaternion.copy(group.quaternion).invert();group.add(surround);
 return group;
}
