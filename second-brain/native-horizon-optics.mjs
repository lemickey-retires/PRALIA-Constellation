import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// The apparent lensing arc belongs to the sphere's silhouette, rather than
// a fixed hoop through space. Keep the authored UVs and filaments, but project
// their radial bands onto the sphere's camera-facing tangent circle.
export const lensedHaloVertex=`varying vec2 vUv;
void main(){
 vUv=uv;
 vec3 eye=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
 float distance=max(length(eye),1.001);
 vec3 forward=normalize(eye);
 vec3 pole=abs(forward.y)>.999?vec3(0.,0.,1.):vec3(0.,1.,0.);
 vec3 right=normalize(cross(pole,forward)),up=cross(forward,right);
 float depth=1./distance;
 float tangentRadius=sqrt(max(0.,1.-depth*depth));
 float angle=uv.x*6.28318530718,across=1.-uv.y;
 float ripple=.0025*sin(angle*31.)+.0012*sin(angle*79.);
 float radius=(1.025+across*.55+ripple*across)*tangentRadius;
 vec3 point=(right*cos(angle)+up*sin(angle))*radius+forward*depth;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(point,1.);
}`;

const vertex=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vView;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vec4 p=modelViewMatrix*vec4(position,1.);vView=-p.xyz;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*p;}`;
const photon=`uniform vec3 uRings[3];uniform vec3 uColour;uniform float uStrength;
uniform float uPlaneOffset;uniform float uPlaneSlope;
varying vec3 vLocal;varying vec3 vView;varying vec3 vNormal;
void main(){
 float facing=dot(normalize(vNormal),normalize(vView));
 float projected=sqrt(max(0.,1.-facing*facing));
 float footprint=fwidth(projected),density=0.;
 for(int i=0;i<3;i++){
   float width=sqrt(uRings[i].y*uRings[i].y+footprint*footprint/6.);
   float d=(projected-uRings[i].x)/width;
   density+=exp(-d*d)*uRings[i].z*uRings[i].y/width;
 }
 float clearance=clamp((vLocal.y+uPlaneOffset-vLocal.z*uPlaneSlope)/.025,0.,1.);
 density=clamp(density,0.,1.)*clearance;
 if(density<.001)discard;
 gl_FragColor=vec4(uColour*uStrength,density);
}`;
const halo=`uniform sampler2D uField;uniform float uTime;uniform float uSpeed;uniform float uStrength;
varying vec2 vUv;
void main(){
 float r=1.-vUv.y;
 vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;
 float upper=smoothstep(-.04,.07,sin(vUv.x*6.28318530718));
 float density=field.r*upper;
 if(density<.001)discard;
 vec3 colour=mix(vec3(1.,.29,.045),vec3(1.,.83,.45),smoothstep(.35,.9,field.g));
 gl_FragColor=vec4(colour*uStrength,density);
}`;

export async function loadNativeOptics(){
 const response=await fetch('./assets/native-optics.json');
 if(!response.ok)throw new Error('Native horizon optics unavailable');
 const spec=await response.json();
 if(spec.sourceImageUsed!==false)throw new Error('Unexpected optical material source');
 const [asset,field]=await Promise.all([new GLTFLoader().loadAsync('./assets/'+spec.file),
   fetch('./assets/'+spec.halo.file).then(async response=>{
     if(!response.ok||!response.body)throw new Error('Native halo field unavailable');
     return new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
   })]);
 if(field.byteLength!==spec.halo.bytes)throw new Error('Incomplete native halo field');
 const texture=new THREE.DataTexture(field,...spec.halo.dimensions,THREE.RGFormat);
 texture.minFilter=texture.magFilter=THREE.LinearFilter;
 texture.wrapS=THREE.RepeatWrapping;texture.unpackAlignment=1;texture.needsUpdate=true;
 return {scene:asset.scene,spec,texture};
}

export function createOpticalMaterial(name,{spec,texture}){
 const isPhoton=name==='PhotonSphere';
 const uniforms=isPhoton?{
   uRings:{value:spec.photon.rings.map(r=>new THREE.Vector3(...r))},
   uColour:{value:new THREE.Color(...spec.photon.colour)},uStrength:{value:spec.photon.strength},
   uPlaneOffset:{value:spec.photon.planeOffset},uPlaneSlope:{value:spec.photon.planeSlope},uTime:{value:0}
 }:{uField:{value:texture},uTime:{value:0},uSpeed:{value:spec.halo.flowSpeed},uStrength:{value:spec.halo.strength}};
 return new THREE.ShaderMaterial({vertexShader:isPhoton?vertex:lensedHaloVertex,fragmentShader:isPhoton?photon:halo,uniforms,
   side:isPhoton?THREE.FrontSide:THREE.DoubleSide,transparent:true,depthWrite:false,
   depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false});
}
