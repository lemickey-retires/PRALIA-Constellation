import * as THREE from 'three';

// This optical sample is identical along a viewing ray. Computing it once
// at full render resolution avoids repeating it through 192 light surfaces.
export const sharedFieldGLSL=`
vec3 sampleSharedField(vec3 eye,vec3 ray){
 float t=dot(-eye,ray);vec3 closest=eye+ray*t;
 vec3 pole=abs(ray.y)>.98?vec3(0.,0.,1.):vec3(0.,1.,0.);
 vec3 right=normalize(cross(pole,-ray)),up=cross(-ray,right);
 float fieldU=atan(dot(closest,up),dot(closest,right))/6.28318530718;
 float distance=length(closest),latitude=atan(closest.y,length(closest.xz));
 float shoulder=pow(max(0.,cos(latitude)),7.),vertical=mix(uVerticalSpread,1.,pow(cos(latitude),2.));
 float lo=0.,hi=1.;
 for(int j=0;j<7;j++){float mid=(lo+hi)*.5;float extent=uInnerRadius+uRadialSpan*mid*vertical+uSideSpan*shoulder*smoothstep(0.,.30,mid);if(extent<distance)lo=mid;else hi=mid;}
 float eLo=uInnerRadius+uRadialSpan*lo*vertical+uSideSpan*shoulder*smoothstep(0.,.30,lo),eHi=uInnerRadius+uRadialSpan*hi*vertical+uSideSpan*shoulder*smoothstep(0.,.30,hi);
 float fieldR=mix(lo,hi,clamp((distance-eLo)/max(eHi-eLo,.00001),0.,1.));
 return vec3(texture2D(uField,vec2(fract(fieldU+uTime*uSpeed),fieldR)).rg,fieldR);
}`;

export function createCoronaFieldCache(group,flowMaterial){
 // Only density and radial position affect the current layered palette.
 // Keep both at full 32-bit precision in RG rather than wasting bandwidth
 // on an unused heat channel and alpha through every transparent layer.
 const target=new THREE.WebGLRenderTarget(1,1,{format:THREE.RGFormat,type:THREE.FloatType,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:false,stencilBuffer:false});
 target.texture.name='Full-resolution shared corona optical field';
 const size=new THREE.Vector2(),inverse=new THREE.Matrix4(),viewToLocal=new THREE.Matrix4(),rayToLocal=new THREE.Matrix3(),eye=new THREE.Vector3();
 const material=new THREE.ShaderMaterial({
  uniforms:{...flowMaterial.uniforms,uProjectionInverse:{value:new THREE.Matrix4()},uRayToLocal:{value:rayToLocal},uLocalEye:{value:eye}},
  vertexShader:'varying vec2 vNdc;void main(){vNdc=position.xy;gl_Position=vec4(position,1.);}',
  fragmentShader:`uniform sampler2D uField;uniform float uTime,uSpeed,uInnerRadius,uRadialSpan,uSideSpan,uVerticalSpread;
   uniform mat4 uProjectionInverse;uniform mat3 uRayToLocal;uniform vec3 uLocalEye;varying vec2 vNdc;
   ${sharedFieldGLSL}
   void main(){vec4 point=uProjectionInverse*vec4(vNdc,1.,1.);vec3 ray=normalize(uRayToLocal*point.xyz);vec3 field=sampleSharedField(uLocalEye,ray);gl_FragColor=vec4(field.x,field.z,0.,1.);}`,
  depthTest:false,depthWrite:false,blending:THREE.NoBlending,toneMapped:false
 });
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
 const scene=new THREE.Scene(),camera=new THREE.Camera();scene.add(new THREE.Mesh(geometry,material));
 let lastKey='',supported;
 return {
  prepare(renderer,viewCamera){
   if(supported===undefined)supported=renderer.extensions.has('EXT_color_buffer_float');
   if(!supported||!viewCamera.isPerspectiveCamera){flowMaterial.uniforms.uUseSharedField.value=false;return false;}
   group.updateWorldMatrix(true,false);viewCamera.updateWorldMatrix(true,false);
   const previous=renderer.getRenderTarget();
   if(previous)size.set(previous.width,previous.height);else renderer.getDrawingBufferSize(size);
   const key=[...group.matrixWorld.elements,...viewCamera.matrixWorld.elements,...viewCamera.projectionMatrix.elements,size.x,size.y,flowMaterial.uniforms.uTime.value].join(',');
   if(key!==lastKey){
    inverse.copy(group.matrixWorld).invert();viewToLocal.copy(inverse).multiply(viewCamera.matrixWorld);rayToLocal.setFromMatrix4(viewToLocal);
    material.uniforms.uProjectionInverse.value.copy(viewCamera.projectionMatrixInverse);
    eye.setFromMatrixPosition(viewCamera.matrixWorld).applyMatrix4(inverse);
    if(target.width!==size.x||target.height!==size.y)target.setSize(size.x,size.y);
    const autoClear=renderer.autoClear;
    try{renderer.autoClear=false;renderer.setRenderTarget(target);renderer.render(scene,camera);}
    finally{renderer.setRenderTarget(previous);renderer.autoClear=autoClear;}
    lastKey=key;
   }
   flowMaterial.uniforms.uSharedField.value=target.texture;
   flowMaterial.uniforms.uSharedSize.value.copy(size);
   flowMaterial.uniforms.uUseSharedField.value=true;
   return true;
  },
  dispose(){target.dispose();geometry.dispose();material.dispose();}
 };
}
