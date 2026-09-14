import * as THREE from 'three';
import {createContinuousCoronaMaterial} from './continuous-corona.mjs';
import {colourUniforms,paletteGLSL} from './corona-palette.mjs';
import {createCoronaFieldCache,sharedFieldGLSL} from './corona-field-cache.mjs';

// Revolve the accepted meridian through every azimuth. Each density surface
// is closed: its front and back carry exactly the same bulge as its sides.
export const enclosingGeometry={layers:192,segments:128,bands:128};
const smooth=v=>{const t=Math.max(0,Math.min(1,v/.30));return t*t*(3-2*t);};
export function enclosingPoint(spec,latitude,azimuth,r){
 const c=Math.max(0,Math.cos(latitude)),s=Math.sin(latitude),side=c**6;
 const radius=spec.halo.innerRadius+r*spec.halo.radialSpan;
 const rho=c*radius+spec.halo.sideSpan*side*smooth(r);
 const height=s*(spec.halo.innerRadius+r*spec.halo.radialSpan*(spec.halo.verticalSpread??1))*(1-.25*side*r);
 return new THREE.Vector3(rho*Math.cos(azimuth),height,rho*Math.sin(azimuth));
}
function flowMaterial(asset){
 const mat=createContinuousCoronaMaterial(asset);
 Object.assign(mat.uniforms,{uUseSharedField:{value:false},uSharedField:{value:null},uSharedSize:{value:new THREE.Vector2(1,1)}});
 Object.assign(mat.uniforms,{uLayerR:{value:0},uLayerProfile:{value:new THREE.Vector4()}});
 Object.assign(mat.uniforms,colourUniforms(asset.spec),{uInnerRadius:{value:asset.spec.halo.innerRadius},uRadialSpan:{value:asset.spec.halo.radialSpan},uSideSpan:{value:asset.spec.halo.sideSpan},uVerticalSpread:{value:asset.spec.halo.verticalSpread}});
 mat.vertexShader=`attribute float aLightWeight;varying vec2 vUv;varying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;
 void main(){vUv=uv;vWeight=aLightWeight;vLocal=position;vEye=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}`;
 mat.fragmentShader=paletteGLSL+'uniform float uLayerR;uniform vec4 uLayerProfile;uniform bool uUseSharedField;uniform sampler2D uSharedField;uniform vec2 uSharedSize;uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;uniform float uVerticalSpread;\nvarying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;\n'+mat.fragmentShader
  // Optical extinction preserves the dark apparent core even where the
  // enclosing emission surfaces pass in front of it. Geometry stays fixed.
  .replace('void main(){',sharedFieldGLSL+'\nvoid main(){vec3 ray=normalize(vLocal-vEye);float t=dot(-vEye,ray);if(t>0.&&t*t-dot(vEye,vEye)+1.>0.)discard;')
  // All samples on a view ray share the same fine optical field. Otherwise
  // adding depth averages unrelated texture samples into a featureless glow.
  .replace('vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;',`
   vec3 sharedField;
   if(uUseSharedField){vec2 cached=texture2D(uSharedField,gl_FragCoord.xy/uSharedSize).rg;sharedField=vec3(cached.r,0.,cached.g);}
   else sharedField=sampleSharedField(vEye,ray);
   float fieldR=sharedField.z;
   vec2 field=sharedField.xy;
   field=mix(texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg,field,.45);`)
  .replace('float heat=clamp(.92-r*.95+(field.g-.5)*.24,0.,1.);','float heat=clamp(.94-fieldR*.80+(field.g-.5)*.12,0.,1.);')
  .replace('vec3 gas=mix(vec3(1.,.20,.025),vec3(1.,.86,.63),smoothstep(.20,.90,heat));','vec3 gas=layeredColour(fieldR,field,vLocal);')
  .replaceAll('field.r*.16','field.r*.16*exp(-r*6.)')
  // UV radius is constant throughout a surface. Evaluate its emission
  // profile once on construction rather than at every covered pixel.
  .replace('float r=1.-vUv.y','float r=uLayerR')
  .replace('float soft=.30*exp(-r*5.5);','float soft=uLayerProfile.y;')
  .replace('float body=ring(r,.07,.035)*.48+ring(r,.17,.070)*.32+ring(r,.32,.10)*.15+ring(r,.50,.18)*.04;','float body=uLayerProfile.x;')
  .replace('float taper=smoothstep(0.,.004,r)*(1.-smoothstep(.70,1.,r));','float taper=uLayerProfile.z;')
  .replaceAll('exp(-r*6.)','uLayerProfile.w')
  .replace('float soft=','photon=0.;float soft=')
  .replace('gl_FragColor=vec4(radiance*taper/alpha,alpha);',
   'float facing=abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)));float rim=pow(max(0.,1.-facing),3.)*smoothstep(0.,.25,facing);gl_FragColor=vec4(radiance*taper/alpha,alpha*vWeight*rim);');
 return mat;
}
export function createEnclosingCorona(asset,{sharedField=false,singlePass=false}={}){
 const group=new THREE.Group();group.name='White aura — continuous curved 360 degree body';
 const {layers,segments,bands}=enclosingGeometry;
 const radii=Array.from({length:layers},(_,i)=>.004+.996*(i/(layers-1))**1.8);
 const material=flowMaterial(asset);
 // Additive light does not need a separate back-face draw for transparency
 // sorting. Both sides still render, with the same geometry and shading.
 material.forceSinglePass=singlePass;
 if(sharedField)group.userData.fieldCache=createCoronaFieldCache(group,material);
 for(let layer=0;layer<layers;layer++){
  const r=radii[layer],dr=((radii[layer+1]??1)-(radii[layer-1]??0))*.5;
  const geometry=new THREE.SphereGeometry(1,segments,bands);
  const position=geometry.attributes.position,uv=geometry.attributes.uv,weight=new Float32Array(position.count);
  for(let i=0;i<position.count;i++){
   const latitude=Math.asin(Math.max(-1,Math.min(1,position.getY(i))));
   const azimuth=Math.atan2(position.getZ(i),position.getX(i));
   const p=enclosingPoint(asset.spec,latitude,azimuth,r);position.setXYZ(i,...p.toArray());
   const c=Math.max(0,Math.cos(latitude)),t=Math.max(0,Math.min(1,r/.30));
   const rho=Math.hypot(p.x,p.z),dR=c*asset.spec.halo.radialSpan+asset.spec.halo.sideSpan*c**6*6*t*(1-t)/.30;
   weight[i]=dr*(rho>1e-6?dR/rho:asset.spec.halo.radialSpan/(asset.spec.halo.innerRadius+r*asset.spec.halo.radialSpan))*(asset.spec.halo.bodyLightGain??5);
   uv.setXY(i,azimuth/(Math.PI*2)+latitude/(Math.PI*2)*Math.cos(azimuth),1-r);
  }
  geometry.setAttribute('aLightWeight',new THREE.BufferAttribute(weight,1));geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,material);mesh.name='Closed flowing aura surface '+(layer+1);mesh.renderOrder=-25;mesh.frustumCulled=false;group.add(mesh);
  const shaderRadius=Math.fround(1-Math.fround(1-r));
  const gaussian=(centre,width,gain)=>gain*Math.exp(-(((shaderRadius-centre)/width)**2));
  const edge=(a,b)=>{const t=Math.max(0,Math.min(1,(shaderRadius-a)/(b-a)));return t*t*(3-2*t);};
  const profile=new THREE.Vector4(gaussian(.07,.035,.48)+gaussian(.17,.070,.32)+gaussian(.32,.10,.15)+gaussian(.50,.18,.04),.30*Math.exp(-shaderRadius*5.5),edge(0,.004)*(1-edge(.70,1)),Math.exp(-shaderRadius*6));
  mesh.onBeforeRender=()=>{material.uniforms.uLayerR.value=shaderRadius;material.uniforms.uLayerProfile.value.copy(profile);material.uniformsNeedUpdate=true;};
 }
 for(const [index,[radius,strength]] of [[1.016,2.3],[1.048,.60],[1.087,.20]].entries()){
  const material=new THREE.ShaderMaterial({
   vertexShader:'varying vec3 vWorld;varying vec3 vNormal;void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}',
   fragmentShader:'uniform float uTime;uniform float uStrength;uniform vec3 uColour;varying vec3 vWorld;varying vec3 vNormal;void main(){float rim=pow(max(0.,1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)))),8.);if(rim<.0001)discard;gl_FragColor=vec4(uColour*uStrength,rim);}',
   uniforms:{uTime:{value:0},uStrength:{value:strength},uColour:{value:new THREE.Color(asset.spec.colourDirection.innerShellColours[index])}},transparent:true,depthWrite:false,depthTest:true,toneMapped:false,blending:THREE.AdditiveBlending});
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,256,128),material);mesh.name='Fine inner emission shell '+(index+1);mesh.renderOrder=-25;group.add(mesh);
 }
 return group;
}
