import * as THREE from 'three';
import {presets} from './upstream-shadergradient/packages/shadergradient/src/presets.ts';
import {shaderMaterial} from './upstream-shadergradient/packages/shadergradient/src/shaders/shaderMaterial.ts';
import {vertex,fragment} from './upstream-shadergradient/packages/shadergradient/src/shaders/defaults/sphere/index.ts';
import * as cosmic from './upstream-shadergradient/packages/shadergradient/src/shaders/cosmic/sphere/index.ts';

export const environmentNames={
  nightyNight:'Nighty night',universe:'Universe',pensive:'Pensive',
  violaOrientalis:'Viola',sunset:'Sunset',interstella:'Interstella',off:'Off'};

export class GraphEnvironment {
  constructor(scene,shellGeometry,starPositions,glowTexture) {
    // Same compatibility aliases supplied by upstream ShaderGradientCanvas.
    // Upstream material factory and shader files are imported without edits.
    for(const chunk of ['uv2_pars_vertex','uv2_vertex','uv2_pars_fragment','encodings_fragment'])
      THREE.ShaderChunk[chunk]='';
    this.time=0;this.preset=null;
    this.shell=new THREE.Mesh(shellGeometry);this.shell.scale.setScalar(40000);
    this.shell.name='ShaderGradient 3D surround';
    this.shell.renderOrder=-1000;this.shell.frustumCulled=false;
    scene.add(this.shell);
    this.light=new THREE.AmbientLight(0xffffff,Math.PI);scene.add(this.light);
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
    this.stars=new THREE.Points(geometry,new THREE.PointsMaterial({
      color:0xc7daff,size:80,sizeAttenuation:true,map:glowTexture,
      transparent:true,depthWrite:false,alphaTest:.015,toneMapped:false}));
    this.stars.name='Blender world-space surrounding stars';
    this.stars.frustumCulled=false;scene.add(this.stars);
  }
  configure(settings) {
    const key=settings.background,enabled=key!=='off';
    this.shell.visible=enabled;this.stars.visible=enabled&&settings.surroundStars;
    if(!enabled)return;
    if(key===this.preset&&settings.environmentDesign===this.design)return;
    const p=presets[key].props;
    // Plane presets provide their exact colours/density; use the repository's
    // existing spherical deformation range to keep the surrounding shell closed.
    const sphere=p.type==='sphere';
    const uniforms={colors:[p.color1,p.color2,p.color3],uTime:p.uTime||0,
      uSpeed:p.uSpeed,uLoadingTime:1,uNoiseDensity:p.uDensity,
      uNoiseStrength:sphere?p.uStrength:presets.sunset.props.uStrength,
      uFrequency:sphere?p.uFrequency:presets.sunset.props.uFrequency,
      uAmplitude:sphere?p.uAmplitude:presets.sunset.props.uAmplitude,
      uIntensity:.5,uLoop:0,uLoopDuration:5};
    const shader=settings.environmentDesign==='cosmic'?cosmic:{vertex,fragment};
    const Material=shaderMaterial(uniforms,shader.vertex,shader.fragment);
    const previous=this.shell.material;
    this.shell.material=new Material();
    this.shell.material.side=THREE.BackSide;
    this.shell.material.depthWrite=false;
    this.shell.material.roughness=1-p.reflection;
    this.light.intensity=p.brightness*Math.PI;
    this.shell.rotation.set(p.rotationX*Math.PI/180,p.rotationY*Math.PI/180,p.rotationZ*Math.PI/180);
    previous?.dispose();
    this.preset=key;this.design=settings.environmentDesign;this.baseTime=p.uTime||0;
  }
  update(delta,settings,playing) {
    if(settings.background==='off')return false;
    // Scaling the elapsed time retains phase when the speed changes.
    if(playing&&settings.shaderSpeed>0)this.time+=delta*settings.shaderSpeed;
    this.shell.material.userData.uTime.value=this.baseTime+this.time;
    return playing&&settings.shaderSpeed>0;
  }
}
