import * as THREE from 'three';
import {createNativeVolume} from './native-horizon-volume.mjs';
import {createOpticalMaterial,lensedHaloVertex} from './native-horizon-optics.mjs';
import {GraphEnvironment as OriginalEnvironment,environmentNames as originalNames} from './rendering/graph-environment.mjs';

export const environmentNames={horizon:'Event horizon',planetary:'Planetary surface',...originalNames};
const vertex=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const noise=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+19.7;a*=.5;}return v;}`;
const radiance=`uniform float uTime;uniform float uKind;varying vec2 vUv;${noise}
void main(){
 // Blender's glTF exporter flips the texture V axis.
 float u=vUv.x,r=1.-vUv.y,angle=u*6.2831853;
 float flow=u-uTime*.035/(.3+r);
 float cloud=fbm(vec2(flow*42.,r*17.));
 float warp=r+.026*(fbm(vec2(flow*17.,r*6.))-.5);
 float thread=pow(.5+.5*sin(warp*690.+cloud*12.),8.);
 float heat=exp(-r*5.5);
 float alpha=smoothstep(0.,.009,r)*(1.-smoothstep(.68,1.,r))*heat*(thread*.8+pow(cloud,3.)*.7);
 float energy=.35+thread*1.7+cloud*.65;
 vec3 colour=mix(vec3(1.7,.38,.045),vec3(5.0,3.5,1.8),pow(heat,2.));
 if(uKind>.5&&uKind<1.5){
   float arc=smoothstep(-.18,.08,sin(angle));
   heat=exp(-r*5.);
   float asymmetry=.42+.58*pow(.5+.5*cos(angle-.6),2.);
   alpha=smoothstep(0.,.008,r)*(1.-smoothstep(.60,1.,r))*heat*(.22+thread*.75+cloud*.5)*arc;
   energy=(.4+thread*1.6+cloud*.65)*asymmetry;
   colour=mix(vec3(1.7,.43,.07),vec3(6.5,4.7,2.8),pow(heat,2.));
 }
 if(uKind>1.5){
   float across=abs(r*2.-1.);
   float wave=r+.014*sin(u*17.+cloud*5.)+.02*(cloud-.5);
   thread=pow(.5+.5*sin(wave*940.+cloud*8.+u*16.),9.);
   heat=exp(-across*8.5);
   float core=exp(-across*48.);
   alpha=heat*(thread*.7+pow(cloud,3.)*.5)+core*.3;
   alpha*=pow(max(0.,1.-abs(u*2.-1.)),.25);
   // Quiet the central stream where foreground records cross its light.
   float foregroundClarity=mix(.20,1.,smoothstep(.06,.20,abs(u-.5)));
   energy=(.25+thread*.75+core*.7)*foregroundClarity;
   colour=mix(vec3(2.1,.48,.06),vec3(3.8,2.8,1.9),pow(heat,2.));
 }
 gl_FragColor=vec4(colour*energy,clamp(alpha,0.,1.));
}`;
const terrain=`uniform float uTime;uniform float uTerrain;varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;${noise}
void main(){
 float grain=fbm(vLocal.xz*27.);
 float micro=fbm(vLocal.xz*105.);
 float chips=noise(vLocal.xz*430.+micro*2.3);
 float shade=.10+.90*max(0.,dot(normalize(vNormal),normalize(vec3(-.25,.32,-.85))));
 vec3 stone=mix(vec3(.003,.008,.017),vec3(.047,.084,.11),smoothstep(.24,.76,grain))*(shade*.84+micro*.16);
 stone*=.66+.55*smoothstep(.24,.74,micro)+.14*chips;
 stone+=vec3(.009,.017,.026)*pow(chips,5.);
 float cracks=pow(max(0.,1.-abs(fbm(vLocal.xz*7.)-.53)*45.),9.);
 float pockets=smoothstep(.59,.74,fbm(vLocal.xz*2.8+6.2));
 vec3 ember=vec3(1.6,.39,.035)*cracks*pockets*(.7+.3*sin(uTime*.3+grain*15.));
 float edge=1.;
 if(uTerrain>.5){
   float irregular=(fbm(vLocal.xz*1.7)-.5)*.035;
   float across=min(vUv.x,1.-vUv.x)+irregular;
   float along=min(vUv.y,1.-vUv.y)+irregular;
   edge=smoothstep(.025,.16,across)*smoothstep(.025,.19,along);
   // Dissolve the lowered outer ground into space in the rear-facing view.
   edge*=1.-smoothstep(2.75,4.15,vLocal.z);
 }
 if(edge<.001)discard;
 float opacity=uTerrain>.5?.58:1.;
 gl_FragColor=vec4(stone+ember/opacity,edge*opacity);
}`;

export class GraphEnvironment extends OriginalEnvironment {
 constructor(scene,shell,starPositions,glowTexture,horizonAsset,horizonStars,nativeAssets){
   super(scene,shell,starPositions,glowTexture);
   this.horizon=horizonAsset.scene;
   this.horizon.name='Blender accretion and sculpted horizon — world space';
   this.horizon.position.set(0,-850,-14500);this.horizon.scale.setScalar(7600);
   for(const name of ['HorizonTerrain','HorizonBoulders','HorizonEmbers']){
     const original=this.horizon.getObjectByName(name);
     original.removeFromParent();original.geometry.dispose();
     if(Array.isArray(original.material))original.material.forEach(m=>m.dispose());else original.material.dispose();
   }
   this.horizon.add(nativeAssets.ground.scene);
   this.planetaryGround=nativeAssets.ground.scene;
   this.horizon.add(nativeAssets.optics.scene);
   this.materials=[];
   this.horizon.traverse(o=>{
     if(!o.isMesh)return;
     if(o.name==='PhotonSphere'&&nativeAssets.optics.spec.photon.enabled===false){o.visible=false;return;}
     if(o.name==='AccretionDisk'||o.name==='LensedStream'){o.visible=false;return;}
     o.frustumCulled=false;
     if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();
     if(o.name==='EventHorizon')o.material=new THREE.MeshBasicMaterial({color:0x000000,toneMapped:false});
     else if(o.name==='HorizonEmbers')o.material=new THREE.MeshBasicMaterial({color:new THREE.Color(4,1.45,.16),toneMapped:false});
     else if(o.name==='PhotonSphere'||o.name==='LensingHaloDetail'){
       o.material=createOpticalMaterial(o.name,nativeAssets.optics);
       o.renderOrder=o.name==='PhotonSphere'?-30:-25;
       this.materials.push(o.material);
     }
     else{
       const ground=o.name==='HorizonTerrain'||o.name==='HorizonBoulders';
       const fadingTerrain=o.name==='HorizonTerrain';
       o.material=new THREE.ShaderMaterial({vertexShader:o.name==='LensedCorona'?lensedHaloVertex:vertex,fragmentShader:ground?terrain:radiance,
         uniforms:{uTime:{value:0},uTerrain:{value:fadingTerrain?1:0},uKind:{value:o.name==='LensedCorona'?1:o.name==='LensedStream'?2:0}},
         side:THREE.DoubleSide,transparent:!ground||fadingTerrain,blending:ground?THREE.NormalBlending:THREE.AdditiveBlending,
         depthWrite:ground&&!fadingTerrain,depthTest:true,toneMapped:false});
       if(fadingTerrain)o.renderOrder=-40;
       this.materials.push(o.material);
     }
   });
   this.spaceLayer=new THREE.Group();
   this.spaceLayer.name='Native Blender ring haze and sparse space depth';
   this.horizon.add(this.spaceLayer);
   for(const field of nativeAssets.volumes){
     const volume=createNativeVolume(field);
     (field.spec.id==='haze'?this.spaceLayer:this.horizon).add(volume);this.materials.push(volume.material);
   }
   const particles=nativeAssets.particles;
   const particleGeometry=new THREE.BufferGeometry();
   particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(particles.positions,3));
   particleGeometry.setAttribute('aColour',new THREE.Float32BufferAttribute(particles.colours,3));
   particleGeometry.setAttribute('aSize',new THREE.Float32BufferAttribute(particles.sizes,1));
   particleGeometry.setAttribute('aFamily',new THREE.Float32BufferAttribute(particles.families,1));
   const particleMaterial=new THREE.ShaderMaterial({
     vertexShader:`attribute vec3 aColour;attribute float aSize;attribute float aFamily;
       uniform float uTime;varying vec3 vColour;varying float vAlpha;
       void main(){vec3 point=position;
         if(aFamily<.5){float angle=uTime*.006/max(length(point.xz),1.);
           float c=cos(angle),s=sin(angle);point.xz=mat2(c,-s,s,c)*point.xz;}
         vec4 p=modelViewMatrix*vec4(point,1.);
         gl_PointSize=clamp(22000./length(p.xyz),.65,1.65)*aSize;
         gl_Position=projectionMatrix*p;vColour=aColour;vAlpha=aFamily<.5?.48:.72;
       }`,
     fragmentShader:`varying vec3 vColour;varying float vAlpha;
       void main(){float r=length(gl_PointCoord-.5);float a=exp(-r*r*20.)*(1.-smoothstep(.35,.5,r));
       gl_FragColor=vec4(vColour,a*vAlpha);}`,
     uniforms:{uTime:{value:0}},transparent:true,depthWrite:false,depthTest:true,toneMapped:false,
     blending:THREE.AdditiveBlending
   });
   this.spaceParticles=new THREE.Points(particleGeometry,particleMaterial);
   this.spaceParticles.name='Blender-authored ring dust and depth stars';
   this.spaceParticles.renderOrder=-35;
   this.spaceLayer.add(this.spaceParticles);this.materials.push(particleMaterial);
   scene.add(this.horizon);
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(horizonStars.positions,3));
   const starMaterial=new THREE.ShaderMaterial({
     vertexShader:'void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(55000./length(p.xyz),.7,1.8);gl_Position=projectionMatrix*p;}',
     fragmentShader:'void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*22.)*(1.-smoothstep(.40,.5,d));gl_FragColor=vec4(.73,.83,1.,a*.85);}',
     transparent:true,depthWrite:false,depthTest:true,toneMapped:false
   });
   this.horizonStars=new THREE.Points(geometry,starMaterial);
   this.horizonStars.renderOrder=-60;
   this.horizonStars.name='Blender-generated deep space stars';scene.add(this.horizonStars);
 }
 configure(settings){
   const active=settings.background==='horizon'||settings.background==='planetary';
   this.horizon.visible=active;this.horizonStars.visible=active&&settings.surroundStars;
   this.planetaryGround.visible=settings.background==='planetary';
   this.spaceLayer.visible=settings.background==='horizon';
   this.spaceParticles.visible=settings.surroundStars;
   if(active){this.shell.visible=false;this.stars.visible=false;this.light.intensity=Math.PI;return;}
   super.configure(settings);
 }
 update(delta,settings,playing){
   if(settings.background!=='horizon'&&settings.background!=='planetary')return super.update(delta,settings,playing);
   if(playing&&settings.shaderSpeed>0)this.time+=delta*settings.shaderSpeed;
   this.materials.forEach(m=>m.uniforms.uTime.value=this.time);
   return playing&&settings.shaderSpeed>0;
 }
}
