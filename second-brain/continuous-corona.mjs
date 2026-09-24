import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {coronaShapeGLSL,auraProjectionUniforms} from './corona-projection.mjs';

// One stable optical outline, with bright inner contours and broad shoulders.
export const coronaVertex=`varying vec2 vUv;
uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;
${coronaShapeGLSL}
void main(){
 vUv=uv;
 gl_Position=projectAura(auraPoint(uv.x*6.28318530718,1.-uv.y));
}`;

export const coronaFragment=`uniform sampler2D uField;
uniform float uTime;uniform float uSpeed;uniform float uStrength;
varying vec2 vUv;
float ring(float r,float centre,float width){
 float filtered=sqrt(width*width+fwidth(r)*fwidth(r)/6.);
 float d=(r-centre)/filtered;
 return exp(-d*d)*width/filtered;
}
void main(){
 float r=1.-vUv.y,angle=vUv.x*6.28318530718;
 vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;
 // Keep emission around the entire silhouette, with gentle Doppler-like bias.
 float asymmetry=.76+.24*cos(angle-.45);
 // Broad hot gas supplies the light; nested contours are submerged in it.
 float photon=ring(r,.012,.0055)*2.3+ring(r,.050,.009)*.60+ring(r,.10,.015)*.25+ring(r,.22,.020)*.10;
 float soft=.30*exp(-r*5.5);
 float body=ring(r,.07,.035)*.48+ring(r,.17,.070)*.32+ring(r,.32,.10)*.15+ring(r,.50,.18)*.04;
 float taper=smoothstep(0.,.004,r)*(1.-smoothstep(.70,1.,r));
 float heat=clamp(.92-r*.95+(field.g-.5)*.24,0.,1.);
 vec3 gas=mix(vec3(1.,.20,.025),vec3(1.,.86,.63),smoothstep(.20,.90,heat));
 float textureEnergy=.38+field.r*.80;
 vec3 radiance=gas*((body*textureEnergy+field.r*.16)*uStrength+soft)*asymmetry;
 radiance+=mix(gas,vec3(1.,.93,.80),.65)*photon*(.90+.10*asymmetry);
 // Smooth corona falloff, independent of the much finer gas structure.
 float alpha=clamp((field.r*.16+body+soft+photon)*taper,0.,1.);
 if(alpha<.0005)discard;
 gl_FragColor=vec4(radiance*taper/alpha,alpha);
}`;

export async function loadContinuousCorona(){
 const response=await fetch('./assets/continuous-optics.json');
 if(!response.ok)throw new Error('Continuous corona manifest unavailable');
 const spec=await response.json();
 const [asset,field]=await Promise.all([
   new GLTFLoader().loadAsync('./assets/'+spec.file),
   fetch('./assets/'+spec.halo.file).then(async response=>{
     if(!response.ok||!response.body)throw new Error('Continuous corona field unavailable');
     return new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
   })
 ]);
 if(field.byteLength!==spec.halo.bytes)throw new Error('Incomplete continuous corona field');
 const texture=new THREE.DataTexture(field,...spec.halo.dimensions,THREE.RGFormat);
 texture.minFilter=texture.magFilter=THREE.LinearFilter;
 texture.wrapS=THREE.RepeatWrapping;
 texture.unpackAlignment=1;texture.needsUpdate=true;
 return {scene:asset.scene,spec,texture};
}

export function createContinuousCoronaMaterial({spec,texture}){
 return new THREE.ShaderMaterial({vertexShader:coronaVertex,fragmentShader:coronaFragment,
   uniforms:{...auraProjectionUniforms(spec),uField:{value:texture},uTime:{value:0},uSpeed:{value:spec.halo.flowSpeed},
     uStrength:{value:spec.halo.strength*.36}},
   side:THREE.DoubleSide,transparent:true,depthWrite:false,depthTest:true,
   blending:THREE.AdditiveBlending,toneMapped:false});
}
