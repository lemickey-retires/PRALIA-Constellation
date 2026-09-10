import * as THREE from 'three';
import {VolumeRenderShader1} from 'three/addons/shaders/VolumeShader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadNativeOptics} from './native-horizon-optics.mjs';

// Uses Three.js's existing volume-ray vertex setup. The field itself is
// evaluated by Blender's native shader nodes, then sampled as a 3D array.
const fragment=`precision highp float;
precision highp sampler3D;
uniform sampler3D uField;
uniform vec3 uMin;
uniform vec3 uMax;
uniform vec3 uNativeMin;
uniform vec3 uNativeMax;
uniform vec3 uFieldMin;
uniform vec3 uFieldMax;
uniform vec2 uSupportRadius;
uniform vec2 uSupportHeight;
uniform float uPlaneOffset;
uniform float uPlaneSlope;
uniform float uHalfHeight;
uniform float uDensityScale;
uniform float uEmission;
uniform float uTime;
uniform mat4 uLocalToClip;
varying vec3 v_position;
varying vec3 v_cameraInObj;
varying vec3 v_viewDirInObj;
vec3 colour(float x){
  vec3 a=vec3(.095,.012,.002),b=vec3(.48,.075,.009),c=vec3(1.,.34,.045),d=vec3(1.,.70,.25),e=vec3(1.,.96,.79);
  if(x<.33)return mix(a,b,smoothstep(0.,.33,x));
  if(x<.60)return mix(b,c,smoothstep(.33,.60,x));
  if(x<.81)return mix(c,d,smoothstep(.60,.81,x));
  return mix(d,e,smoothstep(.81,1.,x));
}
void main(){
  vec3 ro=v_cameraInObj,rd=normalize(v_position-ro);
  vec3 inv=1./(rd+vec3(1e-8));
  vec3 t0=(uMin-ro)*inv,t1=(uMax-ro)*inv;
  vec3 a=min(t0,t1),b=max(t0,t1);
  float start=max(max(a.x,a.y),max(a.z,0.));
  float finish=min(min(b.x,b.y),b.z);
  float planeHeight=ro.y+uPlaneOffset-ro.z*uPlaneSlope;
  float planeDirection=rd.y-rd.z*uPlaneSlope;
  if(abs(planeDirection)>.00001){
    float pa=(-uHalfHeight-planeHeight)/planeDirection;
    float pb=(uHalfHeight-planeHeight)/planeDirection;
    start=max(start,min(pa,pb));finish=min(finish,max(pa,pb));
  }else if(abs(planeHeight)>uHalfHeight)discard;
  // The opaque core blocks the gas behind it, from every camera angle.
  float sb=dot(ro,rd),sc=dot(ro,ro)-1.;
  float discriminant=sb*sb-sc;
  if(discriminant>0.){
    float hit=-sb-sqrt(discriminant);
    if(hit>0.)finish=min(finish,hit);
  }
  if(finish<=start)discard;
  int count=int(clamp(ceil((finish-start)*520.),32.,320.));
  float stepSize=(finish-start)/float(count);
  float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  float distance=start+(.15+.7*jitter)*stepSize;
  // Conservative native-field bounds remove zero-density work while keeping
  // the original sample spacing and phase inside every occupied region.
  float supportStart=start,supportFinish=finish;
  if(abs(planeDirection)>.00001){
    float sa=(uSupportHeight.x-planeHeight)/planeDirection;
    float sb=(uSupportHeight.y-planeHeight)/planeDirection;
    supportStart=max(supportStart,min(sa,sb));supportFinish=min(supportFinish,max(sa,sb));
  }else if(planeHeight<uSupportHeight.x||planeHeight>uSupportHeight.y)discard;
  float qa=dot(rd.xz,rd.xz),qb=dot(ro.xz,rd.xz);
  if(qa>.000001){
    float qc=dot(ro.xz,ro.xz)-uSupportRadius.y*uSupportRadius.y;
    float disc=qb*qb-qa*qc;
    if(disc<0.)discard;
    float root=sqrt(disc);
    supportStart=max(supportStart,(-qb-root)/qa);supportFinish=min(supportFinish,(-qb+root)/qa);
  }
  if(supportFinish<=supportStart)discard;
  int firstSample=max(0,int(ceil((supportStart-distance)/stepSize)));
  int lastSample=min(count-1,int(floor((supportFinish-distance)/stepSize)));
  if(firstSample>lastSample)discard;
  vec3 reference=ro+rd*((supportStart+supportFinish)*.5);
  vec2 referenceXY=vec2(reference.x,-reference.z);
  float referenceAngle=atan(referenceXY.y,referenceXY.x);
  float flowTime=uTime*.32;
  float innerRadiusSquared=uSupportRadius.x*uSupportRadius.x;
  vec3 inverseFieldSize=1./(uFieldMax-uFieldMin);
  vec3 radiance=vec3(0.);float alpha=0.,first=-1.;
  for(int i=firstSample;i<320;i++){
    if(i>lastSample||alpha>.985)break;
    float sampleDistance=distance+float(i)*stepSize;
    vec3 p=ro+rd*sampleDistance;
    float radiusSquared=dot(p.xz,p.xz);
    // The native bake certifies zero density inside this padded radius.
    // Reject those samples before angular maths and 3D texture reads.
    if(radiusSquared<innerRadiusSquared)continue;
    vec3 native=vec3(p.x,-p.z,p.y);
    float height=planeHeight+planeDirection*sampleDistance;
    // Differential angular flow moves inner curls a little faster. At the
    // existing default speed this becomes visible over several seconds.
    float radius=sqrt(radiusSquared);
    float crossTerm=referenceXY.x*native.y-referenceXY.y*native.x;
    float dotTerm=dot(referenceXY,native.xy);
    float angle;
    if(dotTerm>0.&&abs(crossTerm)<.125*dotTerm){
      float t=crossTerm/dotTerm,t2=t*t;
      angle=referenceAngle+t*(1.+t2*(-1./3.+t2*(1./5.-t2/7.)));
    }else angle=atan(native.y,native.x);
    angle+=flowTime*inversesqrt(max(radius,1.));
    vec3 fieldPosition=vec3(radius,angle,height);
    vec3 q=(fieldPosition-uFieldMin)*inverseFieldSize;
    q.y=fract(q.y);
    vec2 gas=texture(uField,clamp(q,0.,1.)).rg;
    float density=gas.r*uDensityScale;
    if(density>.004){
      if(first<0.)first=sampleDistance;
      float absorb=1.-exp(-density*stepSize);
      radiance+=(1.-alpha)*colour(gas.g)*uEmission*absorb;
      alpha+=(1.-alpha)*absorb;
    }
  }
  if(alpha<.0005||first<0.)discard;
  vec4 clip=uLocalToClip*vec4(ro+rd*first,1.);
  gl_FragDepth=clip.z/clip.w*.5+.5;
  gl_FragColor=vec4(radiance/max(alpha,.00001),alpha);
}`;

export async function loadNativeVolumes(){
  const response=await fetch('./assets/native-volumes.json');
  if(!response.ok)throw new Error('Native horizon volumes unavailable');
  const manifest=await response.json();
  if(manifest.sourceImageUsed!==false)throw new Error('Unexpected horizon material source');
  const [spaceManifest,particles]=await Promise.all(['native-space-volumes.json','native-space-particles.json'].map(async file=>{
    const response=await fetch('./assets/'+file);
    if(!response.ok)throw new Error('Native space asset unavailable: '+file);
    const data=await response.json();
    if(data.sourceImageUsed!==false)throw new Error('Unexpected space material source');
    return data;
  }));
  const [volumes,ground,optics]=await Promise.all([Promise.all([...manifest.volumes,...spaceManifest.volumes].map(async spec=>{
    const response=await fetch('./assets/'+spec.file);
    if(!response.ok||!response.body)throw new Error('Native gas field unavailable: '+spec.id);
    const stream=response.body.pipeThrough(new DecompressionStream('gzip'));
    const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
    if(bytes.byteLength!==spec.bytes)throw new Error('Incomplete native gas field: '+spec.id);
    const texture=new THREE.Data3DTexture(bytes,...spec.dimensions);
    texture.format=THREE.RGFormat;texture.type=THREE.UnsignedByteType;
    texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;
    texture.wrapT=THREE.RepeatWrapping;
    texture.unpackAlignment=1;texture.needsUpdate=true;
    return {spec,texture};
  })),new GLTFLoader().loadAsync('./assets/native-horizon-ground.glb'),loadNativeOptics()]);
  return {volumes,ground,optics,particles};
}

export function createNativeVolume({spec,texture}){
  const min=new THREE.Vector3(spec.boundsMin[0],spec.boundsMin[2],-spec.boundsMax[1]);
  const max=new THREE.Vector3(spec.boundsMax[0],spec.boundsMax[2],-spec.boundsMin[1]);
  const size=max.clone().sub(min),centre=min.clone().add(max).multiplyScalar(.5);
  const geometry=new THREE.BoxGeometry(size.x,size.y,size.z);
  geometry.translate(centre.x,centre.y,centre.z);
  const material=new THREE.ShaderMaterial({
    vertexShader:VolumeRenderShader1.vertexShader,fragmentShader:fragment,
    uniforms:{uField:{value:texture},uMin:{value:min},uMax:{value:max},
      uNativeMin:{value:new THREE.Vector3(...spec.boundsMin)},
      uNativeMax:{value:new THREE.Vector3(...spec.boundsMax)},
      uFieldMin:{value:new THREE.Vector3(...spec.fieldBoundsMin)},
      uFieldMax:{value:new THREE.Vector3(...spec.fieldBoundsMax)},
      uSupportRadius:{value:new THREE.Vector2(...(spec.support?.radius??[spec.fieldBoundsMin[0],spec.fieldBoundsMax[0]]))},
      uSupportHeight:{value:new THREE.Vector2(...(spec.support?.height??[spec.fieldBoundsMin[2],spec.fieldBoundsMax[2]]))},
      uPlaneOffset:{value:spec.planeOffset},uPlaneSlope:{value:spec.planeSlope},
      uHalfHeight:{value:spec.halfHeight},
      uDensityScale:{value:spec.densityScale*.8},uEmission:{value:spec.emissionStrength*.68},
      uTime:{value:0},uLocalToClip:{value:new THREE.Matrix4()}},
    side:THREE.BackSide,transparent:true,depthTest:true,depthWrite:false,toneMapped:false
  });
  const mesh=new THREE.Mesh(geometry,material);
  mesh.name='Native Blender '+spec.id+' gas volume';
  mesh.frustumCulled=false;mesh.renderOrder=-20;
  mesh.onBeforeRender=(_renderer,_scene,camera)=>{
    material.uniforms.uLocalToClip.value.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(mesh.matrixWorld);
  };
  return mesh;
}
