import * as THREE from 'three';
import {sculptedAuraPoint,sculptedAuraOrientation} from './sculpted-corona.mjs';

// The small sprite wisps use fixed 3D anchors in the curved aura and its clock.
export function createHorizonFlares(spec){
 const group=new THREE.Group();group.name='Small blue aura flares';
 group.quaternion.copy(sculptedAuraOrientation());
 const geometry=new THREE.PlaneGeometry(1,1);
 for(const [index,flare] of spec.flares.entries()){
   const material=new THREE.ShaderMaterial({
     vertexShader:`uniform float uTime;uniform vec3 uAnchor;
       uniform vec2 uSize;varying vec2 vUv;
       void main(){vUv=uv;
         vec4 view=modelViewMatrix*vec4(uAnchor,1.);
         view.xy+=position.xy*uSize*length(modelMatrix[0].xyz);
         gl_Position=projectionMatrix*view;
       }`,
     fragmentShader:`uniform float uTime;uniform float uPhase;varying vec2 vUv;
       void main(){vec2 p=(vUv-.5)*2.;float t=uTime*.65+uPhase;
         float sway=.12*sin(p.y*7.+t)+.06*sin(p.y*15.-t*.7);
         float core=exp(-dot(p*vec2(1.,1.8),p*vec2(1.,1.8))*125.);
         vec2 plume=vec2((p.x-sway)*(1.8+max(p.y,0.)*2.),(p.y-.12)*1.9);
         float mist=exp(-dot(plume,plume)*5.);
         float curls=pow(.5+.5*sin(p.x*24.+p.y*13.+sin(p.y*17.-t)*2.),3.);
         float edge=1.-smoothstep(.68,1.,length(p));
         float pulse=.80+.20*sin(t);
         vec3 light=vec3(.07,.30,1.)*mist*(.26+curls*.85)+vec3(.30,.65,1.)*core*2.8;
         float alpha=clamp((mist*.65+core*.85)*edge*pulse,0.,1.);
         if(alpha<.0005)discard;
         gl_FragColor=vec4(light*edge*pulse/alpha,alpha);
       }`,
     uniforms:{uTime:{value:0},uPhase:{value:index*2.17},uAnchor:{value:sculptedAuraPoint(spec,flare.auraAngle,flare.auraRadius,.65)},
       uSize:{value:new THREE.Vector2(...flare.size)}},
     transparent:true,depthTest:true,depthWrite:false,toneMapped:false,
     blending:THREE.NormalBlending,side:THREE.DoubleSide
   });
   const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
   mesh.name='Blue disk wisp '+(index+1);mesh.renderOrder=-15;group.add(mesh);
 }
 return group;
}
