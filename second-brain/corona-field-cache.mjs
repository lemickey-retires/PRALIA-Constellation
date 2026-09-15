import * as THREE from 'three';

// This optical sample is identical along a viewing ray. Computing it once
// at full render resolution avoids repeating it through 192 light surfaces.
export const sharedFieldGLSL=`
vec2 sampleSharedCoordinates(vec3 eye,vec3 ray){
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
 return vec2(fract(fieldU),fieldR);
}
vec3 sampleSharedField(vec3 eye,vec3 ray){
 vec2 coordinates=sampleSharedCoordinates(eye,ray);
 return vec3(texture2D(uField,vec2(fract(coordinates.x+uTime*uSpeed),coordinates.y)).rg,coordinates.y);
}`;

export function createCoronaFieldCache(group,flowMaterial){
 // Both cached values are normalised. Half floats retain far more precision
 // than the source texture while halving render-target bandwidth on integrated
 // GPUs. Linear sampling avoids introducing visible quantisation or banding.
 const target=new THREE.WebGLRenderTarget(1,1,{format:THREE.RGFormat,type:THREE.HalfFloatType,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false,stencilBuffer:false});
 target.texture.name='Full-resolution shared corona optical field (half float)';
 const size=new THREE.Vector2(),inverse=new THREE.Matrix4(),viewToLocal=new THREE.Matrix4(),rayToLocal=new THREE.Matrix3(),eye=new THREE.Vector3();
 // The optical field is linearly reconstructed and intentionally lower
 // frequency than the full-resolution geometry/rim. At this workstation's
 // 2K canvas, 40% still supplies an 826 by 508 field while reducing the
 // camera-dependent binary-search pass that dominates orbiting.
 const cacheScale=.4;
 const material=new THREE.ShaderMaterial({
  uniforms:{...flowMaterial.uniforms,uProjectionInverse:{value:new THREE.Matrix4()},uRayToLocal:{value:rayToLocal},uLocalEye:{value:eye}},
  vertexShader:'varying vec2 vNdc;void main(){vNdc=position.xy;gl_Position=vec4(position,1.);}',
  fragmentShader:`uniform sampler2D uField;uniform float uTime,uSpeed,uInnerRadius,uRadialSpan,uSideSpan,uVerticalSpread;
   uniform mat4 uProjectionInverse;uniform mat3 uRayToLocal;uniform vec3 uLocalEye;varying vec2 vNdc;
   ${sharedFieldGLSL}
   void main(){vec4 point=uProjectionInverse*vec4(vNdc,1.,1.);vec3 ray=normalize(uRayToLocal*point.xyz);vec2 coordinates=sampleSharedCoordinates(uLocalEye,ray);gl_FragColor=vec4(coordinates,0.,1.);}`,
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
   const key=[...group.matrixWorld.elements,...viewCamera.matrixWorld.elements,...viewCamera.projectionMatrix.elements,size.x,size.y].join(',');
   if(key!==lastKey){
    inverse.copy(group.matrixWorld).invert();viewToLocal.copy(inverse).multiply(viewCamera.matrixWorld);rayToLocal.setFromMatrix4(viewToLocal);
    material.uniforms.uProjectionInverse.value.copy(viewCamera.projectionMatrixInverse);
    eye.setFromMatrixPosition(viewCamera.matrixWorld).applyMatrix4(inverse);
    flowMaterial.uniforms.uLocalEye.value.copy(eye);
    const cacheWidth=Math.max(1,Math.ceil(size.x*cacheScale)),cacheHeight=Math.max(1,Math.ceil(size.y*cacheScale));
    if(target.width!==cacheWidth||target.height!==cacheHeight)target.setSize(cacheWidth,cacheHeight);
    const autoClear=renderer.autoClear;
    try{renderer.autoClear=false;renderer.setRenderTarget(target);renderer.render(scene,camera);}
    finally{renderer.setRenderTarget(previous);renderer.autoClear=autoClear;}
    lastKey=key;
   }
   flowMaterial.uniforms.uSharedField.value=target.texture;
   // Sampling still uses full-frame fragment coordinates; the texture's
   // linear filter reconstructs the half-resolution optical field.
   flowMaterial.uniforms.uSharedSize.value.copy(size);
   flowMaterial.uniforms.uUseSharedField.value=true;
   return true;
  },
  dispose(){target.dispose();geometry.dispose();material.dispose();}
 };
}
