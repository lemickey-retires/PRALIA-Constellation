import { installMemory } from './memory-ui.mjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { prepareNodes, hash } from './rendering/graph-physics.mjs';
import { MemoryPhysics as WorkerPhysics } from './memory-physics-client.mjs';
import {layoutNames,layoutDescriptions,viewLayout,keyConnections,sourceColour,sourceId,physicsData,sources} from './second-brain-layout.mjs';
import {palettes as originalPalettes,designs,nodeColour as originalNodeColour} from './rendering/graph-appearance.mjs';
import {GraphEnvironment,environmentNames} from './horizon-environment.mjs';
import {loadNativeVolumes} from './native-horizon-volume.mjs';
import {installSecondBrain} from './second-brain-ui.mjs';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderActivity} from './render-activity.mjs';

const $ = id => document.getElementById(id);
// Render at motion-smooth cadence, cap high-DPI fill cost, and retain the
// advertised 30-second idle hold. The aura itself is now cheaper to integrate.
const renderProfile={pixelRatioCap:1,activeFps:60,idleMs:30000};
const palettes={sources:{...originalPalettes.celestial,name:'Source colours',line:'#92aabe',hub:'#f0cb8a'},...originalPalettes};
const nodeColour=(n,key)=>key==='sources'?sourceColour(n):originalNodeColour(n,key);
const linkModes={off:'Off',selected:'Selected node',overview:'Overview',all:'All'};
const linkControl=document.createElement('label');linkControl.className='link-control';linkControl.textContent='Links';
const linkSelect=document.createElement('select');linkSelect.id='link-mode';linkSelect.setAttribute('aria-label','Connecting lines');
for(const [value,label] of Object.entries(linkModes)){const option=document.createElement('option');option.value=value;option.textContent=label;linkSelect.append(option);}
linkControl.append(linkSelect);$('all-links').replaceWith(linkControl);
for(const [id,value,text] of [['background-preset','planetary','Planetary surface'],['background-preset','horizon','Event horizon'],['layout-preset','atlas','Source sections'],['palette-preset','sources','Source colours']]){
  const option=document.createElement('option');option.value=value;option.textContent=text;$(id).prepend(option);
}
const STORAGE = 'hermes-memory-3d-layout-v1';
const SETTINGS = 'hermes-memory-3d-settings-v1';
const read = key => {try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}};
const write = (key,data) => {try{localStorage.setItem(key,JSON.stringify(data));}catch{}};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const oldSettings=read('hermes-memory-constellation-settings-v1'), userSettings=read(SETTINGS)||{};
const settings = {paused:reduced.matches,pull:oldSettings?.gravity??1,pinOnDrop:false,autoOrbit:false,
  background:'horizon',animation:'depth',formation:'sphere',speed:1,orbit:1,glow:.6,rebound:.45,pointerPhysics:true,spacing:1,
  cohesion:1,repulsion:8,cursor:1.2,pointerReach:1.5,linkForce:.45,linkDistance:75,interactionVersion:3,framingVersion:2,relationMeshVersion:1,
  layout:'atlas',design:'starlight',palette:'sources',shaderSpeed:.05,surroundStars:true,environmentDesign:'cosmic',links:'overview',...userSettings};
// The previous local build persisted pointerPhysics=false as its default.
// Promote once to the now-verified interactive model, then respect subsequent
// user changes under interactionVersion 2.
if(userSettings.interactionVersion!==3){settings.pointerPhysics=true;settings.pinOnDrop=false;settings.interactionVersion=3;}
// Promote existing local previews once to the bounded relationship mesh. The
// user can still hide or expand links afterwards with the normal Links menu.
if(userSettings.relationMeshVersion!==1){settings.links='overview';settings.relationMeshVersion=1;}
// The old fullscreen build retained a projection offset designed for a fixed
// sidebar, then persisted that visibly skewed framing. Fit once after removing
// the offset; subsequent user camera positions remain respected.
const migrateFraming=userSettings.framingVersion!==2;
if(migrateFraming)settings.framingVersion=2;
settings.pull = Math.max(0,Math.min(2,Number(settings.pull)||0));
settings.spacing=Math.max(.5,Math.min(2,Number(settings.spacing)||1));
for(const [key,min,max,fallback] of [['cohesion',0,2,1],['repulsion',0,16,8],['cursor',0,2,1.2],
  ['pointerReach',.5,2.5,1.5],['linkForce',0,1,.45],['linkDistance',20,160,75]])
  settings[key]=Math.max(min,Math.min(max,Number.isFinite(Number(settings[key]))?Number(settings[key]):fallback));
for(const [key,min,max] of [['speed',.2,2],['orbit',0,2],['glow',0,2],['rebound',0,1],['shaderSpeed',0,1]])
  settings[key]=Math.max(min,Math.min(max,Number.isFinite(Number(settings[key]))?Number(settings[key]):1));
if(!['depth','float','breathe'].includes(settings.animation))settings.animation='depth';
if(!['sphere','fluid','dna'].includes(settings.formation))settings.formation='sphere';
if(!environmentNames[settings.background])settings.background='universe';
if(!layoutNames[settings.layout])settings.layout='saved';
if(!palettes[settings.palette])settings.palette='celestial';
if(!designs[settings.design])settings.design='starlight';
if(!['cosmic','gradient'].includes(settings.environmentDesign))settings.environmentDesign='cosmic';
if(!Object.hasOwn(linkModes,settings.links))settings.links='off';
const layoutStorage=key=>key==='saved'?STORAGE:STORAGE+'-'+key+(key==='atlas'?'-sections-v15':'');
const saved=read(layoutStorage(settings.layout));
let physics, renderer, controls, nodes, camera, selected=-1, mesh, haloMaterial,environment,applyAppearance;
let changingLayout=false;
let universeUI;
let beginGroupDrag;
let raf, dirty=true, frames=0, sampleStart=performance.now();
let renderActivity,wakeRendering;
let pendingOpenMethodSurface,applyOpenMethodSurface;

// The Open Method shell owns navigation while this viewer owns only the visual
// camera. Buffer an early message because the iframe load event can fire before
// the async graph assets have finished creating the camera and controls.
window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.data?.type!=='open-method-surface')return;
  pendingOpenMethodSurface=event.data;
  applyOpenMethodSurface?.(event.data);
});

function syncSettings() {
  linkSelect.value=settings.links;
  $('motion-toggle').textContent=settings.paused?'Resume motion':'Pause motion';
  $('motion-toggle').setAttribute('aria-pressed',String(!settings.paused));
  $('star-pull').value=String(settings.pull);$('star-pull-value').textContent=settings.pull.toFixed(1);
  $('pin-on-drop').checked=settings.pinOnDrop;$('auto-orbit').checked=settings.autoOrbit;
  $('background-preset').value=settings.background;
  $('animation-mode').value=settings.animation;
  $('formation-mode').value=settings.formation;
  for(const key of ['speed','orbit','glow','rebound','shaderSpeed']) {
    $(key).value=String(settings[key]);$(key+'-value').textContent=key==='shaderSpeed'?String(settings[key]):settings[key].toFixed(1);
  }
  $('layout-preset').value=settings.layout;$('layout-description').textContent=layoutDescriptions[settings.layout];
  $('design-preset').value=settings.design;$('palette-preset').value=settings.palette;
  $('surround-stars').checked=settings.surroundStars;
  $('environment-design').value=settings.environmentDesign;
  applyAppearance?.();environment?.configure(settings);
  const host=$('astral-background');
  Object.assign(host.dataset,{preset:settings.background,enabled:String(settings.background!=='off'),
    renderer:'shadergradient-3d',speed:String(settings.shaderSpeed),paused:String(settings.paused)});
  $('background-status').textContent=settings.background==='off'?'Environment off.':
    environmentNames[settings.background]+' · 3D surround · '+(settings.paused||settings.shaderSpeed===0?'still':String(settings.shaderSpeed)+'× speed');
  if(controls) controls.autoRotate=settings.autoOrbit&&!settings.paused&&!reduced.matches;
  physics?.configure({running:!settings.paused,visible:!document.hidden&&!renderActivity?.idle,pull:settings.pull,
    drift:!reduced.matches,animation:settings.animation,speed:settings.speed,orbit:settings.orbit,rebound:settings.rebound,spacing:settings.spacing,
    formation:settings.formation,cohesion:settings.cohesion,repulsion:settings.repulsion,cursor:settings.cursor,pointerReach:settings.pointerReach,
    linkForce:settings.linkForce,linkDistance:settings.linkDistance});
  write(SETTINGS,settings);dirty=true;
  universeUI?.syncSettings(settings);
}
syncSettings();

function save() {
  if(!physics||!camera||changingLayout||physics.entrance.active)return;
  write(layoutStorage(settings.layout),{nodes:nodes.map(n=>({id:n.id,x:n.x,y:n.y,z:n.z,pinned:n.pinned})),
    camera:{position:camera.position.toArray(),target:controls.target.toArray()}});
}
function exportView() {
  if(!physics||changingLayout)return;
  save();
  const keys=[SETTINGS,...Object.keys(layoutNames).map(layoutStorage),
    'hermes-memory-constellation-settings-v1','hermes-memory-constellation-layout-v1',
    'hermes-memory-constellation-position-bookmark-v1'];
  const snapshot={format:'pralia-constellation-snapshot',version:1,
    capturedAt:new Date().toISOString(),nodes:nodes.length,
    storage:Object.fromEntries(keys.map(key=>[key,read(key)]).filter(([,value])=>value!==null)),
    playback:{environmentTime:environment.time,linkMode:settings.links,allLinks:settings.links==='all'}};
  const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='pralia-constellation-snapshot.json';
  link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
$('export-view').addEventListener('click',exportView);
function fail(error) {
  console.error(error);$('loading').hidden=false;
  $('loading').replaceChildren(document.createTextNode('The local 3D preview could not load. '));
  const retry=document.createElement('button');retry.textContent='Retry';retry.onclick=()=>location.reload();
  $('loading').append(retry,document.createTextNode(' If the local server has stopped, run start-preview.ps1 in the preview folder.'));
  $('graph-stage').dataset.ready='error';
}

async function start() {
  const response = await fetch('./graph-3d-data.json');
  if(!response.ok)throw new Error('Graph data unavailable: '+response.status);
  const data=await response.json();
  const refresh=()=>{dirty=true;search();replay(false);fit();universeUI?.updateCounts(visible);};
  const memory=installMemory(data, {selectNode:id=>{const i=physics?.index.get(id);if(i!==undefined){select(i);focus(i);}}, refresh});
  universeUI=installSecondBrain(data,{refresh,startGroupDrag:(id,event,element)=>beginGroupDrag?.(id,event,element)});
  const visible=n=>memory.visible(n)&&universeUI.visible(n);
  const baseline=prepareNodes(data,read('hermes-memory-constellation-layout-v1'));
  nodes=viewLayout(data,baseline,settings.layout,saved);
  physics=new WorkerPhysics(nodes,physicsData(data,settings.layout),()=>{dirty=true;if(selected>=0)updateNodeState();},fail);
  const assets=await Promise.all([new GLTFLoader().loadAsync('./assets/star-core.glb'),
    new THREE.TextureLoader().loadAsync('./assets/star-glow.png'),physics.ready,
    new GLTFLoader().loadAsync('./assets/crystal-core.glb'),
    new GLTFLoader().loadAsync('./assets/orbital-ring.glb'),
    new GLTFLoader().loadAsync('./assets/universe-shell.glb'),
    fetch('./assets/universe-stars.json').then(r=>{if(!r.ok)throw new Error('Starfield unavailable');return r.json();}),
    new GLTFLoader().loadAsync('./assets/event-horizon.glb'),
    fetch('./assets/horizon-stars.json').then(r=>{if(!r.ok)throw new Error('Horizon stars unavailable');return r.json();}),
    loadNativeVolumes()]);
  const getMesh=asset=>{let m;asset.scene.traverse(o=>{if(o.isMesh&&!m)m=o;});if(!m)throw new Error('Blender mesh missing');return m;};
  let core;
  assets[0].scene.traverse(object=>{if(object.isMesh&&!core)core=object;});
  if(!core)throw new Error('Blender star mesh is missing.');
  const glowTexture=assets[1];glowTexture.colorSpace=THREE.SRGBColorSpace;
  const index=physics.index;
  let overview=settings.layout==='atlas'?keyConnections(nodes,data):new Set(data.overview);
  const incident=nodes.map(()=>[]);
  const links=data.edges.map((e,i)=>{
    const a=index.get(e.from),b=index.get(e.to);incident[a].push(i);incident[b].push(i);return {a,b};
  });
  const scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(48,1,.1,100000);
  // EffectComposer renders the scene into single-sample targets. MSAA on the
  // final full-screen output quad adds fill cost without smoothing scene edges.
  renderer=new THREE.WebGLRenderer({antialias:false,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,renderProfile.pixelRatioCap));
  renderer.setClearColor(0x000000,0);
  $('graph-3d').append(renderer.domElement);
  environment=new GraphEnvironment(scene,getMesh(assets[5]).geometry,assets[6].positions,glowTexture,assets[7],assets[8],assets[9]);
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.58,.35,1.3);composer.addPass(bloom);
  composer.addPass(new OutputPass());
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);fail(new Error('3D graphics context lost'));});
  // The unit core is exported from Blender. Native unlit materials retain
  // the established gold/white/blue colours while the baked glow adds light.
  mesh=new THREE.InstancedMesh(core.geometry,
    new THREE.MeshBasicMaterial({toneMapped:false}),nodes.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;
  mesh.boundingSphere=new THREE.Sphere(new THREE.Vector3(),100000);
  const whiteCore=new THREE.Color(0xffffff);
  nodes.forEach((n,i)=>mesh.setColorAt(i,new THREE.Color(n.colour).lerp(whiteCore,n.tier==='yellow'?.18:.55)));
  scene.add(mesh);
  haloMaterial=new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,
    blending:THREE.NormalBlending,depthWrite:false,depthTest:true,toneMapped:false,opacity:settings.glow});
  const halos=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),haloMaterial,nodes.length);
  halos.instanceMatrix.setUsage(THREE.DynamicDrawUsage);halos.frustumCulled=false;
  nodes.forEach((n,i)=>halos.setColorAt(i,new THREE.Color(n.colour)));
  scene.add(halos);
  const ringNodes=nodes.map((n,i)=>n.tier==='blue'?-1:i).filter(i=>i>=0);
  const orbitRings=new THREE.InstancedMesh(getMesh(assets[4]).geometry,
    new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.65,depthWrite:false}),ringNodes.length);
  orbitRings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);orbitRings.frustumCulled=false;scene.add(orbitRings);
  const ringRotations=ringNodes.map((i,k)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(k*.7,k*.31,k*.23)));
  const matrix=new THREE.Matrix4(),pos=new THREE.Vector3(),scale=new THREE.Vector3(),rotation=new THREE.Quaternion();
  const visualNodes=nodes.map(n=>({...n})),visualSphereOffsets=new Array(nodes.length),formationBlend=new Map(),membersBySource=new Map(),visualHubIndices=new Map();
  const visualBreathSin=new Float32Array(nodes.length),visualBreathCos=new Float32Array(nodes.length),groupMotion=new Map();
  nodes.forEach((n,i)=>{const id=sourceId(n);if(!membersBySource.has(id))membersBySource.set(id,[]);membersBySource.get(id).push(i);});
  for(const [id,members] of membersBySource){
    const parent=physics.groupParents?.get(id);if(!parent)continue;
    visualHubIndices.set(id,[...members].sort((a,b)=>(nodes[b].degree||0)-(nodes[a].degree||0)||nodes[a].id.localeCompare(nodes[b].id))[0]);
    const distances=members.map(i=>Math.hypot(nodes[i].x-parent.x,nodes[i].y-parent.y,nodes[i].z-parent.z)).sort((a,b)=>a-b);
    const radius=Math.max(12,distances[Math.floor((distances.length-1)*.78)]||30),phase=hash(id+'|parent-sphere')*Math.PI*2;
    members.forEach((i,k)=>{const vertical=1-2*(k+.5)/members.length,span=Math.sqrt(Math.max(0,1-vertical*vertical)),angle=k*2.39996323+phase;
      const shell=.28+.72*Math.cbrt(hash(nodes[i].id+'|parent-shell')),distance=radius*shell;
      visualSphereOffsets[i]={x:Math.cos(angle)*span*distance,y:vertical*distance,z:Math.sin(angle)*span*distance};
      const breathPhase=hash(nodes[i].id+'|idle-breath')*Math.PI*2;visualBreathSin[i]=Math.sin(breathPhase);visualBreathCos[i]=Math.cos(breathPhase);});
    formationBlend.set(id,1);
    groupMotion.set(id,{phase:hash(id+'|3d-tumble')*Math.PI*2,direction:hash(id+'|orbit-direction')>.5?1:-1,rate:.055+hash(id+'|orbit-rate')*.035});
  }
  // Group volume is described only by real records and their links. The
  // previous translucent shell and synthetic centre ball obscured that fact
  // and made the graph feel like seven coloured ornaments rather than a live
  // constellation.
  let nodeMotionTime=0;
  const linePositions=new Float32Array(links.length*6);
  const lineGeometry=new THREE.BufferGeometry();
  lineGeometry.setAttribute('position',new THREE.BufferAttribute(linePositions,3).setUsage(THREE.DynamicDrawUsage));
  const lineMaterial=new THREE.LineBasicMaterial({color:0x9bbbd8,transparent:true,opacity:.11,depthWrite:false});
  const lines=new THREE.LineSegments(lineGeometry,lineMaterial);lines.frustumCulled=false;scene.add(lines);
  const selectedGeometry=new THREE.BufferGeometry();
  const selectedPositions=new Float32Array(links.length*6);
  selectedGeometry.setAttribute('position',new THREE.BufferAttribute(selectedPositions,3).setUsage(THREE.DynamicDrawUsage));
  const selectedLines=new THREE.LineSegments(selectedGeometry,new THREE.LineBasicMaterial({color:0xffe6a4,transparent:true,opacity:.65,depthWrite:false}));
  selectedLines.frustumCulled=false;scene.add(selectedLines);
  const parentLinePositions=new Float32Array(nodes.length*6),parentLineColours=new Float32Array(nodes.length*6),parentLineGeometry=new THREE.BufferGeometry();
  parentLineGeometry.setAttribute('position',new THREE.BufferAttribute(parentLinePositions,3).setUsage(THREE.DynamicDrawUsage));
  parentLineGeometry.setAttribute('color',new THREE.BufferAttribute(parentLineColours,3).setUsage(THREE.DynamicDrawUsage));
  const parentLineMaterial=new THREE.LineBasicMaterial({color:0xffffff,vertexColors:true,transparent:true,opacity:.085,depthWrite:false,blending:THREE.AdditiveBlending});
  const parentLines=new THREE.LineSegments(parentLineGeometry,parentLineMaterial);parentLines.frustumCulled=false;scene.add(parentLines);
  const activityCount=128,activityPositions=new Float32Array(activityCount*3),activityGeometry=new THREE.BufferGeometry();
  activityGeometry.setAttribute('position',new THREE.BufferAttribute(activityPositions,3).setUsage(THREE.DynamicDrawUsage));
  const activityDots=new THREE.Points(activityGeometry,new THREE.PointsMaterial({color:0xffe7ad,size:2.2,sizeAttenuation:true,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending}));
  activityDots.frustumCulled=false;scene.add(activityDots);let activityEdges=[...overview];
  const selectionRing=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true}));
  selectionRing.visible=false;scene.add(selectionRing);
  applyAppearance=()=>{
    const p=palettes[settings.palette],style=designs[settings.design];
    mesh.geometry=style.core==='crystal'?getMesh(assets[3]).geometry:core.geometry;
    nodes.forEach((n,i)=>{
      const colour=new THREE.Color(nodeColour(n,settings.palette));
      mesh.setColorAt(i,colour.clone().lerp(whiteCore,settings.palette==='sources'?.05:style.core==='crystal'?.12:n.tier==='yellow'?.18:.55));
      halos.setColorAt(i,colour);
    });
    ringNodes.forEach((i,k)=>orbitRings.setColorAt(k,new THREE.Color(nodeColour(nodes[i],settings.palette))));
    mesh.instanceColor.needsUpdate=true;halos.instanceColor.needsUpdate=true;orbitRings.instanceColor.needsUpdate=true;
    haloMaterial.opacity=settings.glow*style.glow;orbitRings.visible=style.rings;
    lineMaterial.color.set(p.line);lineMaterial.opacity=settings.layout==='atlas'?.085:style.links;
    selectedLines.material.color.set(p.hub);selectionRing.material.color.set(p.hub);
  };
  controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.autoRotateSpeed=.28;
  controls.minDistance=12;controls.maxDistance=15000;
  let fitEnvelope,cameraFlight=null,surfaceInteractive=true;
  function constrainCameraTarget(){
    if(!fitEnvelope||cameraFlight)return;
    const clamped=controls.target.clone().clamp(fitEnvelope.min,fitEnvelope.max);
    const correction=clamped.sub(controls.target);
    if(correction.lengthSq()>0){controls.target.add(correction);camera.position.add(correction);}
  }
  controls.addEventListener('change',()=>{constrainCameraTarget();dirty=true;});
  let saveTimer,wheelRemaining=0,leftPointerHeld=false,fieldScaleGesture=false,fieldScalePointer=null,suppressFieldClick=false;
  const deferSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(save,300);};
  controls.addEventListener('end',deferSave);
  // Wheel notches used to jump the camera and synchronously serialize every
  // node on each event. Accumulate zoom in log-distance and ease on the render
  // clock; persist once after movement ends.
  // A plain left press still orbits or drags normally. Rolling the wheel while
  // that press is held promotes it into field scaling and suppresses the click
  // that would otherwise fire when the button is released over a star.
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;cameraFlight=null;leftPointerHeld=true;fieldScalePointer=e.pointerId;
  },true);
  const endFieldScale=e=>{
    if(!leftPointerHeld||(e.pointerId!==fieldScalePointer&&e.type!=='blur'))return;
    const scaled=fieldScaleGesture;leftPointerHeld=false;fieldScaleGesture=false;fieldScalePointer=null;
    if(scaled){controls.enabled=!(groupDrag||pendingDrag);renderer.domElement.style.cursor='grab';suppressFieldClick=true;setTimeout(()=>{suppressFieldClick=false;},0);}
    $('graph-stage').dataset.fieldScale=settings.spacing.toFixed(3);deferSave();wakeRendering?.();
  };
  window.addEventListener('pointerup',endFieldScale);window.addEventListener('pointercancel',endFieldScale);window.addEventListener('blur',endFieldScale);
  const blockFieldClick=e=>{if((e.type==='auxclick'&&e.button===1)||suppressFieldClick){e.preventDefault();e.stopImmediatePropagation();}};
  renderer.domElement.addEventListener('click',blockFieldClick,true);renderer.domElement.addEventListener('auxclick',blockFieldClick,true);
  renderer.domElement.addEventListener('wheel',e=>{
    if(!controls.enabled&&!leftPointerHeld)return;
    cameraFlight=null;
    e.preventDefault();e.stopImmediatePropagation();
    const unit=e.deltaMode===1?16:e.deltaMode===2?renderer.domElement.clientHeight:1;
    const delta=Math.max(-300,Math.min(300,e.deltaY*unit));
    if(leftPointerHeld||(e.buttons&1)){
      fieldScaleGesture=true;wheelRemaining=0;controls.enabled=false;renderer.domElement.style.cursor='ns-resize';
      // Cancel a click-only node candidate when the gesture becomes a scale.
      // An already moving node remains physical and can scale with its field.
      if(pendingDrag&&!dragging){pendingDrag=null;dragPointer=null;}
      settings.spacing=Math.max(.5,Math.min(2,settings.spacing*Math.exp(-delta*.0015)));
      const spacingControl=$('node-spacing');if(spacingControl)spacingControl.value=String(settings.spacing);
      physics.configure({spacing:settings.spacing});write(SETTINGS,settings);
      $('graph-stage').dataset.fieldScale=settings.spacing.toFixed(3);dirty=true;
    }else wheelRemaining=Math.max(-2,Math.min(2,wheelRemaining+delta*.001));
    wakeRendering?.();
  },{capture:true,passive:false});
  function resize() {
    wakeRendering?.();
    const host=$('graph-3d'),w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;
    camera.clearViewOffset();
    camera.updateProjectionMatrix();dirty=true;
  }
  new ResizeObserver(resize).observe($('graph-3d'));resize();
  function frameFor(members,scale=settings.layout==='atlas'?.64:.72) {
    const box=new THREE.Box3();members.forEach(n=>box.expandByPoint(new THREE.Vector3(n.x,n.y,n.z)));
    if(box.isEmpty())return;
    const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
    const pan=size.clone().multiplyScalar(.18).max(new THREE.Vector3(45,45,45));
    const availableAspect=$('graph-3d').clientWidth/$('graph-3d').clientHeight;
    const distance=Math.max(80,size.x/Math.max(availableAspect,.4),size.y,size.z)*scale/Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    const view=settings.layout==='atlas'?new THREE.Vector3(0,-.08,1):settings.layout==='galaxy'?new THREE.Vector3(.15,1,.4):new THREE.Vector3(.25,.18,1);
    return {box,envelope:{min:center.clone().sub(pan),max:center.clone().add(pan)},center,distance,position:center.clone().add(view.normalize().multiplyScalar(distance))};
  }
  function applyFrame(frame) {
    if(!frame)return;
    fitEnvelope=frame.envelope;controls.target.copy(frame.center);camera.position.copy(frame.position);
    controls.maxDistance=Math.min(15000,frame.distance*3.2);
    controls.update();dirty=true;
  }
  function flyToFrame(frame) {
    if(!frame)return;
    fitEnvelope=frame.envelope;controls.maxDistance=Math.min(15000,frame.distance*3.2);wheelRemaining=0;
    if(reduced.matches){applyFrame(frame);save();return;}
    cameraFlight={started:performance.now(),duration:720,fromPosition:camera.position.clone(),fromTarget:controls.target.clone(),toPosition:frame.position,toTarget:frame.center};
    wakeRendering?.();dirty=true;
  }
  function fit() {
    applyFrame(frameFor(nodes.filter(visible)));
  }
  fit();
  if(!migrateFraming&&saved?.camera&&[saved.camera.position,saved.camera.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite))) {
    camera.position.fromArray(saved.camera.position);controls.target.fromArray(saved.camera.target);controls.update();
  }
  async function focus(i) {
    const currentPhysics=physics;
    if(physics.entrance.active&&!(await physics.skip()))return;
    if(currentPhysics!==physics||selected!==i)return;
    const n=nodes[i],target=new THREE.Vector3(n.x,n.y,n.z);
    const direction=camera.position.clone().sub(controls.target).normalize();
    const distance=Math.max(n.radius*14,90);
    camera.position.copy(target).addScaledVector(direction,distance);controls.target.copy(target);
    controls.update();dirty=true;save();
  }
  function focusSource(focus) {
    // Older shells called the approvals/session cluster "sessions". Keep that
    // message compatible while the visible information architecture now owns
    // both chat and decisions under Conversations.
    if(focus==='sessions')focus='conversations';
    const validFocus=focus==='overview'||sources.some(source=>source.id===focus);
    if(!validFocus)return;
    const members=focus==='overview'?nodes.filter(visible):nodes.filter(n=>visible(n)&&sourceId(n)===focus);
    const scale=focus==='overview'?(settings.layout==='atlas'?.64:.72):.92;
    flyToFrame(frameFor(members,scale));
    $('graph-stage').dataset.openMethodFocus=focus;
  }
  function nodeButton(n,callback) {
    const button=document.createElement('button');button.type='button';button.textContent=n.label;
    button.addEventListener('click',callback);return button;
  }
  function updateNodeState() {
    const n=nodes[selected];if(!n)return;
    const state=physics?.releasePending?'Settling at drop position…':n.pinned?'Pinned in 3D':'Free to move and collide';
    if($('node-state').textContent!==state)$('node-state').textContent=state;
    const pinLabel=n.pinned?'Release node':'Pin node';
    if($('pin-node').textContent!==pinLabel)$('pin-node').textContent=pinLabel;
    if($('node-info').dataset.pinned!==String(n.pinned))$('node-info').dataset.pinned=String(n.pinned);
  }
  physics.onRelease=()=>{updateNodeState();save();};
  // Group throws are transient physics: preserve the authored spherical home
  // instead of saving a half-settled tangle as the next startup layout.
  physics.onGroupRelease=()=>{};
  async function changeLayout(key) {
    if(changingLayout||key===settings.layout)return;
    save();
    const priorLayout=settings.layout,priorPhysics=physics;
    const remembered=read(layoutStorage(key));
    const replacement=viewLayout(data,baseline,key,remembered);
    changingLayout=true;$('layout-preset').disabled=true;$('replay-entrance').disabled=true;controls.enabled=false;
    $('layout-description').textContent='Arranging '+layoutNames[key]+'…';
    priorPhysics.configure({running:false});
    let next;
    try {
      next=new WorkerPhysics(replacement,physicsData(data,key),()=>{},()=>{});
      await next.ready;
      priorPhysics.dispose();
      replacement.forEach((n,i)=>Object.assign(nodes[i],n));
      overview=key==='atlas'?keyConnections(nodes,data):new Set(data.overview);
      activityEdges=[...overview];
      // Retain the objects referenced by the renderer while the worker feeds
      // new physical positions into that same array.
      next.nodes=nodes;next.onRelease=()=>{updateNodeState();save();};next.onGroupRelease=()=>save();next.onError=fail;
      next.onUpdate=()=>{dirty=true;if(selected>=0)updateNodeState();};
      physics=next;settings.layout=key;selected=-1;$('node-info').hidden=true;
      changingLayout=false;syncSettings();fit();
      if(remembered?.camera&&[remembered.camera.position,remembered.camera.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite))){
        camera.position.fromArray(remembered.camera.position);controls.target.fromArray(remembered.camera.target);controls.update();
      }
      save();replay(false);$('graph-stage').dataset.layout=key;
    }catch(error){next?.dispose();settings.layout=priorLayout;changingLayout=false;physics=priorPhysics;syncSettings();$('layout-description').textContent='This layout could not load. Your previous arrangement is still here.';console.error(error);}
    $('layout-preset').disabled=false;$('replay-entrance').disabled=false;controls.enabled=true;dirty=true;
  }
  function select(i,openInspector=true) {
    selected=i;dirty=true;if(i<0){$('node-info').hidden=true;return;}
    const n=nodes[i];$('node-info').hidden=false;$('node-name').textContent=n.label;
    if(openInspector)universeUI.selected(n);
    memory.describe(n);
    updateNodeState();
    $('node-info').dataset.nodeId=n.id;$('node-info').dataset.pinned=String(n.pinned);
    const root=index.get(data.routes[n.id]?.root),anchor=index.get(data.routes[n.id]?.anchor);
    const kind=n.tier==='yellow'?'Primary hub':n.tier==='white'?'Local hub':'Community node';
    $('node-kind').textContent=memory.kindName(n.kind)+' · '+n.scope;
    const group=document.createElement('span');group.textContent=root===undefined?'Independent group':'Group: ';
    $('node-group').replaceChildren(group);
    if(root!==undefined)$('node-group').append(nodeButton(nodes[root],()=>{select(root);focus(root);}));
    $('node-anchor').textContent=anchor===undefined?'':('Follows: '+nodes[anchor].label);
    const neighbours=[...new Set(incident[i].map(k=>links[k].a===i?links[k].b:links[k].a))];
    $('neighbours-title').textContent=`${neighbours.length} connected node${neighbours.length===1?'':'s'}`;
    $('neighbours').replaceChildren(...neighbours.map(j=>{const b=nodeButton(nodes[j],()=>{select(j);focus(j);});b.textContent=memory.connectionLabel(n.id,nodes[j].id)+' · '+nodes[j].label;return b;}));
  }
  function search() {
    const term=$('search').value.trim().toLowerCase();
    const matches=term?nodes.filter(n=>visible(n)&&(n.label+' '+(n.title||'')).toLowerCase().includes(term))
      :nodes.filter(n=>visible(n)&&(memory.scope()!=='all'||n.kind==='agent'||n.kind==='builtin'||n.kind==='fact')).sort((a,b)=>b.degree-a.degree);
    $('results-caption').textContent=term?`${matches.length} ${matches.length===1?'match':'matches'}${matches.length>60?' · first 60 shown':''}`:'Start exploring';
    $('search-results').replaceChildren(...matches.slice(0,60).map(n=>nodeButton(n,()=>{select(index.get(n.id));focus(index.get(n.id));})));
  }
  search();$('search').addEventListener('input',search);
  universeUI.updateCounts(visible);
  $('focus-node').addEventListener('click',()=>{if(selected>=0)focus(selected);});
  $('pin-node').addEventListener('click',()=>{if(selected>=0){physics.pin(selected,!nodes[selected].pinned);select(selected);save();}});
  $('fit-view').textContent='Re-centre';
  $('fit-view').title='Centre and fit the complete constellation';
  $('fit-view').addEventListener('click',()=>{wheelRemaining=0;fit();save();});
  linkSelect.addEventListener('change',()=>{settings.links=linkSelect.value;syncSettings();});
  $('motion-toggle').addEventListener('click',()=>{settings.paused=!settings.paused;syncSettings();});
  function replay(resume=true) {
    if(!physics||!environment||changingLayout)return;
    if(resume&&!reduced.matches)settings.paused=false;
    environment.time=0;
    physics.replay({visible:nodes.map(visible),reduced:reduced.matches||settings.paused});
    syncSettings();dirty=true;
  }
  $('replay-entrance').addEventListener('click',()=>replay());
  $('skip-entrance').addEventListener('click',async()=>{
    if(await physics.skip())$('replay-entrance').focus();
  });
  $('background-preset').addEventListener('change',e=>{settings.background=e.target.value;syncSettings();});
  $('layout-preset').addEventListener('change',e=>{void changeLayout(e.target.value);});
  $('design-preset').addEventListener('change',e=>{settings.design=e.target.value;syncSettings();});
  $('palette-preset').addEventListener('change',e=>{settings.palette=e.target.value;syncSettings();});
  $('surround-stars').addEventListener('change',e=>{settings.surroundStars=e.target.checked;syncSettings();});
  $('environment-design').addEventListener('change',e=>{settings.environmentDesign=e.target.value;syncSettings();});
  $('star-pull').addEventListener('input',e=>{settings.pull=Number(e.target.value);syncSettings();});
  $('animation-mode').addEventListener('change',e=>{settings.animation=e.target.value;replay(false);});
  $('formation-mode').addEventListener('change',e=>{settings.formation=e.target.value;syncSettings();wakeRendering?.();});
  for(const key of ['speed','orbit','glow','rebound','shaderSpeed'])
    $(key).addEventListener('input',e=>{settings[key]=Number(e.target.value);syncSettings();});
  $('pin-on-drop').addEventListener('change',e=>{settings.pinOnDrop=e.target.checked;syncSettings();});
  $('auto-orbit').addEventListener('change',e=>{settings.autoOrbit=e.target.checked;syncSettings();});
  const pointerLabel=document.createElement('label'),pointerToggle=document.createElement('input');
  pointerLabel.className='check';
  pointerToggle.type='checkbox';pointerToggle.checked=settings.pointerPhysics;pointerToggle.id='pointer-physics';
  pointerLabel.append(pointerToggle,' Cursor pushes nearby stars');
  $('auto-orbit').closest('label').after(pointerLabel);
  pointerToggle.addEventListener('change',()=>{settings.pointerPhysics=pointerToggle.checked;if(!settings.pointerPhysics)physics.worker.postMessage({type:'pointer',pointer:null});syncSettings();});
  const spacingLabel=document.createElement('label'),spacingInput=document.createElement('input');
  spacingInput.type='range';spacingInput.min='.5';spacingInput.max='2';spacingInput.step='.05';spacingInput.value=String(settings.spacing);spacingInput.id='node-spacing';
  spacingInput.setAttribute('aria-label','Node spacing');spacingLabel.append('Node spacing ',spacingInput);pointerLabel.after(spacingLabel);
  spacingInput.addEventListener('input',()=>{settings.spacing=Number(spacingInput.value);syncSettings();});
  let physicsControlAfter=spacingLabel;
  for(const [key,label,min,max,step] of [
    ['cohesion','Group cohesion',0,2,.1],['repulsion','Node repulsion',0,16,1],
    ['cursor','Cursor push strength',0,2,.1],['pointerReach','Cursor push radius',.5,2.5,.1],
    ['linkForce','Link strength',0,1,.05],['linkDistance','Link distance',20,160,5]]){
    const row=document.createElement('label'),value=document.createElement('span'),input=document.createElement('input');
    row.className='dynamic-physics-control';value.textContent=String(settings[key]);
    input.type='range';input.min=String(min);input.max=String(max);input.step=String(step);input.value=String(settings[key]);
    input.id='physics-'+key;input.setAttribute('aria-label',label);row.append(label+' ',value,input);physicsControlAfter.after(row);physicsControlAfter=row;
    input.addEventListener('input',()=>{settings[key]=Number(input.value);value.textContent=input.value;syncSettings();});
  }
  $('graph-3d').title='Drag a star or group label to tug; wheel to zoom; hold left mouse and scroll to contract or expand the stars; press R to re-centre.';
  reduced.addEventListener('change',()=>{if(reduced.matches){settings.paused=true;physics.skip();syncSettings();}});
  syncSettings();
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(),hitPoint=new THREE.Vector3(),dragOffset=new THREE.Vector3();
  let dragging=false,dragPointer=null,pendingDrag=null,groupDrag=null,hoverAt=0;
  function ray(e) {
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
  }
  function pick(e) {
    ray(e);
    // A small on-screen hit allowance keeps distant stars easy to recognise.
    // Use the nearest sphere on the view ray, never the decorative halo.
    const rect=renderer.domElement.getBoundingClientRect(),pixelAngle=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/rect.height;
    let found=-1,nearest=Infinity;
    visualNodes.forEach((n,i)=>{
      if(!visible(n)||physics.scales[i]<.15)return;
      pos.set(n.x,n.y,n.z);
      const origin=raycaster.ray.origin,direction=raycaster.ray.direction;
      const depth=(n.x-origin.x)*direction.x+(n.y-origin.y)*direction.y+(n.z-origin.z)*direction.z;
      const radius=Math.max(n.radius*physics.scales[i],depth*pixelAngle*7);
      const distanceSq=raycaster.ray.distanceSqToPoint(pos);
      const front=depth-Math.sqrt(Math.max(0,radius*radius-distanceSq));
      if(depth>0&&front<nearest&&distanceSq<radius*radius){found=i;nearest=front;}
    });return found;
  }
  beginGroupDrag=(groupId,e,element)=>{
    if(e.button!==0||!physics||!camera||changingLayout||groupDrag||pendingDrag)return;
    const indices=nodes.map((n,i)=>sourceId(n)===groupId&&visible(n)?i:-1).filter(i=>i>=0);
    const revealed=indices.filter(i=>physics.scales[i]>.15);if(!revealed.length)return;
    const parent=physics.groupParents?.get(groupId);
    const centre=parent?new THREE.Vector3(parent.x,parent.y,parent.z):revealed.reduce((c,i)=>c.add(new THREE.Vector3(nodes[i].x,nodes[i].y,nodes[i].z)),new THREE.Vector3()).multiplyScalar(1/revealed.length);
    ray(e);const normal=camera.getWorldDirection(new THREE.Vector3());plane.setFromNormalAndCoplanarPoint(normal,centre);
    if(!raycaster.ray.intersectPlane(plane,hitPoint))return;
    // Flatten every other visible sphere onto the active drag plane through
    // the camera projection. This makes visible contact and physical contact
    // agree even though the authored source centres occupy different depths.
    const cameraRight=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion),collisionProxies=[];
    for(const [id,p] of physics.groupParents||[]){
      if(id===groupId)continue;
      const worldCentre=new THREE.Vector3(p.x,p.y,p.z),ndc=worldCentre.clone().project(camera),proxyCentre=new THREE.Vector3();
      raycaster.setFromCamera(new THREE.Vector2(ndc.x,ndc.y),camera);if(!raycaster.ray.intersectPlane(plane,proxyCentre))continue;
      const edgeNdc=worldCentre.clone().addScaledVector(cameraRight,(sourceVisualRadii.get(id)||20)*settings.spacing).project(camera),proxyEdge=new THREE.Vector3();
      raycaster.setFromCamera(new THREE.Vector2(edgeNdc.x,edgeNdc.y),camera);if(!raycaster.ray.intersectPlane(plane,proxyEdge))continue;
      collisionProxies.push({id,x:proxyCentre.x,y:proxyCentre.y,z:proxyCentre.z,radius:Math.max(8,proxyCentre.distanceTo(proxyEdge))});
    }
    const rect=element.getBoundingClientRect();
    groupDrag={pointerId:e.pointerId,groupId,element,offset:centre.clone().sub(hitPoint),screenOffset:{x:rect.left+rect.width/2-e.clientX,y:rect.top+rect.height/2-e.clientY}};
    formationBlend.set(groupId,0);
    element.classList.remove('group-settling');
    element.setPointerCapture(e.pointerId);element.classList.add('group-dragging');controls.enabled=false;
    physics.startGroupDrag(indices,centre,groupId,collisionProxies);wakeRendering?.();
    e.preventDefault();e.stopPropagation();
  };
  window.addEventListener('pointermove',e=>{
    if(!groupDrag||e.pointerId!==groupDrag.pointerId)return;
    ray(e);if(raycaster.ray.intersectPlane(plane,hitPoint))physics.moveGroupDrag(hitPoint.add(groupDrag.offset));
    const stage=$('graph-stage').getBoundingClientRect();
    groupDrag.element.style.left=e.clientX-stage.left+groupDrag.screenOffset.x+'px';
    groupDrag.element.style.top=e.clientY-stage.top+groupDrag.screenOffset.y+'px';
    dirty=true;e.preventDefault();
  });
  const endGroupDrag=e=>{
    if(!groupDrag||e.pointerId!==groupDrag.pointerId)return;
    const {element}=groupDrag;physics.endGroupDrag();groupDrag=null;controls.enabled=true;
    element.classList.remove('group-dragging');element.classList.add('group-settling');
    setTimeout(()=>element.classList.remove('group-settling'),240);
    if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
    dirty=true;e.preventDefault();
  };
  window.addEventListener('pointerup',endGroupDrag);window.addEventListener('pointercancel',endGroupDrag);
  // Capture before OrbitControls: dragging a node must not also rotate the camera.
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const i=pick(e);if(i<0)return;
    select(i,false);
    pendingDrag={index:i,x:e.clientX,y:e.clientY};dragPointer=e.pointerId;
    controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);
    const n=nodes[i],normal=camera.getWorldDirection(new THREE.Vector3());
    plane.setFromNormalAndCoplanarPoint(normal,new THREE.Vector3(n.x,n.y,n.z));
    raycaster.ray.intersectPlane(plane,hitPoint);dragOffset.set(n.x,n.y,n.z).sub(hitPoint);
    $('hover-label').hidden=true;e.stopImmediatePropagation();e.preventDefault();
  },true);
  renderer.domElement.addEventListener('pointermove',e=>{
    if(pendingDrag){
      if(!dragging&&Math.hypot(e.clientX-pendingDrag.x,e.clientY-pendingDrag.y)>=2){physics.startDrag(pendingDrag.index);dragging=true;renderer.domElement.style.cursor='grabbing';}
      if(dragging){ray(e);if(raycaster.ray.intersectPlane(plane,hitPoint))physics.moveDrag(hitPoint.add(dragOffset));dirty=true;}
      return;
    }
    if(e.buttons)return; // Orbiting needs no hover picking or label mutations.
    const now=performance.now();if(now-hoverAt<50)return;hoverAt=now;
    const i=pick(e),label=$('hover-label');label.hidden=i<0;
    if(settings.pointerPhysics&&!settings.paused&&!reduced.matches){
      const {origin:o,direction:d}=raycaster.ray;
      const focusDepth=Math.max(1,raycaster.ray.origin.distanceTo(controls.target));
      const worldPerPixel=2*focusDepth*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/renderer.domElement.clientHeight;
      physics.worker.postMessage({type:'pointer',pointer:{origin:{x:o.x,y:o.y,z:o.z},direction:{x:d.x,y:d.y,z:d.z},radius:Math.max(18,Math.min(180,worldPerPixel*55))}});
    }
    renderer.domElement.style.cursor=i<0?'grab':'pointer';
    if(i>=0){const rect=$('graph-stage').getBoundingClientRect();label.textContent=nodes[i].label+' · '+memory.kindName(nodes[i].kind);
      label.style.left=Math.min(e.clientX-rect.left+12,rect.width-280)+'px';label.style.top=Math.max(68,e.clientY-rect.top-35)+'px';}
  });
  function endDrag(e){
    if(!pendingDrag||e.pointerId!==dragPointer)return;
    const wasDragging=dragging;
    if(dragging)physics.endDrag(e.shiftKey?false:settings.pinOnDrop);
    dragging=false;pendingDrag=null;controls.enabled=true;renderer.domElement.style.cursor='grab';
    if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
    select(selected,!wasDragging);if(!physics.releasePending)save();dirty=true;
  }
  renderer.domElement.addEventListener('pointerup',endDrag);
  renderer.domElement.addEventListener('pointercancel',endDrag);
  $('graph-3d').addEventListener('keydown',e=>{
    if(e.key.toLowerCase()==='r'){wheelRemaining=0;fit();save();e.preventDefault();return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;
    const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);
    if(e.key==='ArrowLeft')spherical.theta-=.1;if(e.key==='ArrowRight')spherical.theta+=.1;
    if(e.key==='ArrowUp')spherical.phi-=.1;if(e.key==='ArrowDown')spherical.phi+=.1;
    if(e.key==='+'||e.key==='=')spherical.radius*=.85;if(e.key==='-')spherical.radius*=1.15;
    spherical.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
    controls.update();dirty=true;e.preventDefault();save();
  });
  const nodeVisibility=new Uint8Array(nodes.length);
  const writeSegment=(buffer,count,a,b,progress)=>{
    const offset=count*6;
    buffer[offset]=a.x;buffer[offset+1]=a.y;buffer[offset+2]=a.z;
    buffer[offset+3]=a.x+(b.x-a.x)*progress;
    buffer[offset+4]=a.y+(b.y-a.y)*progress;
    buffer[offset+5]=a.z+(b.z-a.z)*progress;
  };
  function updateObjects() {
    for(const [id,blend] of formationBlend)if(blend<.999)formationBlend.set(id,Math.min(1,blend+.006));
    const breathAngle=nodeMotionTime*.72,breathSin=Math.sin(breathAngle),breathCos=Math.cos(breathAngle),groupTransforms=new Map();
    for(const [id,motion] of groupMotion){
      const angleY=nodeMotionTime*motion.rate*motion.direction+motion.phase,angleX=.42*Math.sin(nodeMotionTime*.24+motion.phase);
      groupTransforms.set(id,{cy:Math.cos(angleY),sy:Math.sin(angleY),cx:Math.cos(angleX),sx:Math.sin(angleX)});
    }
    nodes.forEach((n,i)=>{
      const groupId=sourceId(n),v=visualNodes[i],parent=physics.groupParents?.get(groupId),base=visualSphereOffsets[i],held=groupDrag?.groupId===groupId;
      v.x=n.x;v.y=n.y;v.z=n.z;
      if(settings.layout==='atlas'&&settings.formation==='sphere'&&parent&&base&&!held){
        // Coherent two-axis tumble preserves the spherical group silhouette
        // while making front/back depth unmistakable. Individual breathing is
        // radial, so idle motion never flattens the cluster into a disc.
        const transform=groupTransforms.get(groupId),scaledX=base.x*settings.spacing,scaledY=base.y*settings.spacing,scaledZ=base.z*settings.spacing;
        const x1=scaledX*transform.cy-scaledZ*transform.sy,z1=scaledX*transform.sy+scaledZ*transform.cy;
        const y2=scaledY*transform.cx-z1*transform.sx,z2=scaledY*transform.sx+z1*transform.cx;
        const breath=1+.022*(breathSin*visualBreathCos[i]+breathCos*visualBreathSin[i]);
        // Preserve a bounded portion of the worker's physical displacement so
        // neighbouring stars visibly repel instead of being painted back onto
        // an immovable shell every frame.
        let dx=n.x-(parent.x+base.x),dy=n.y-(parent.y+base.y),dz=n.z-(parent.z+base.z),deformation=Math.hypot(dx,dy,dz);
        if(deformation>16){const cap=16/deformation;dx*=cap;dy*=cap;dz*=cap;}
        const idealX=parent.x+x1*breath+dx*.72,idealY=parent.y+y2*breath+dy*.72,idealZ=parent.z+z2*breath+dz*.72;
        const blend=formationBlend.get(groupId)??1;v.x=n.x+(idealX-n.x)*blend;v.y=n.y+(idealY-n.y)*blend;v.z=n.z+(idealZ-n.z)*blend;
      }
      nodeVisibility[i]=visible(n)?1:0;
      pos.set(v.x,v.y,v.z);scale.setScalar(nodeVisibility[i]?n.radius*physics.scales[i]:0);matrix.compose(pos,rotation,scale);mesh.setMatrixAt(i,matrix);
      // The 16-unit Blender bake matches the physical one-unit core.
      scale.setScalar(nodeVisibility[i]?n.radius*(settings.layout==='atlas'&&n.kind==='mirror'?9:16)*physics.scales[i]:0);
      matrix.compose(pos,camera.quaternion,scale);halos.setMatrixAt(i,matrix);
    });
    mesh.instanceMatrix.needsUpdate=true;
    halos.instanceMatrix.needsUpdate=true;halos.visible=haloMaterial.opacity>0;
    ringNodes.forEach((i,k)=>{const n=nodes[i],v=visualNodes[i];pos.set(v.x,v.y,v.z);scale.setScalar(nodeVisibility[i]?n.radius*physics.scales[i]:0);
      matrix.compose(pos,ringRotations[k],scale);orbitRings.setMatrixAt(k,matrix);});
    orbitRings.instanceMatrix.needsUpdate=true;
    let count=0,highlightCount=0;
    const writeLink=(i,highlight=false)=>{
      const link=links[i];
      const a=visualNodes[link.a],b=visualNodes[link.b];
      const progress=Math.min(physics.linkProgress[link.a],physics.linkProgress[link.b]);
      if(progress<=0||!nodeVisibility[link.a]||!nodeVisibility[link.b])return;
      if(highlight)writeSegment(selectedPositions,highlightCount++,a,b,progress);
      else if(selected!==link.a&&selected!==link.b)writeSegment(linePositions,count++,a,b,progress);
    };
    if(settings.links==='all')for(let i=0;i<links.length;i++)writeLink(i);
    else if(settings.links==='overview')for(const i of overview)writeLink(i);
    if(settings.links!=='off'&&selected>=0)for(const i of incident[selected])writeLink(i,true);
    for(const [object,geometry,amount] of [[lines,lineGeometry,count],[selectedLines,selectedGeometry,highlightCount]]){
      object.visible=amount>0;geometry.setDrawRange(0,amount*2);
      if(amount){const attribute=geometry.attributes.position;attribute.clearUpdateRanges();attribute.addUpdateRange(0,amount*6);attribute.needsUpdate=true;}
    }
    let parentCount=0;
    nodes.forEach((n,i)=>{
      if(!nodeVisibility[i]||physics.scales[i]<=.15)return;
      const groupId=sourceId(n),parent=physics.groupParents?.get(groupId),hubIndex=visualHubIndices.get(groupId);if(!parent||hubIndex===undefined)return;
      const v=visualNodes[i],hub=visualNodes[hubIndex],k=parentCount++*6;parentLinePositions[k]=v.x;parentLinePositions[k+1]=v.y;parentLinePositions[k+2]=v.z;
      parentLinePositions[k+3]=hub.x;parentLinePositions[k+4]=hub.y;parentLinePositions[k+5]=hub.z;
      const colour=new THREE.Color(sourceColour(n)),hubColour=colour.clone().lerp(whiteCore,.42);
      parentLineColours[k]=colour.r;parentLineColours[k+1]=colour.g;parentLineColours[k+2]=colour.b;
      parentLineColours[k+3]=hubColour.r;parentLineColours[k+4]=hubColour.g;parentLineColours[k+5]=hubColour.b;
    });
    parentLines.visible=settings.layout==='atlas'&&parentCount>0;parentLineMaterial.opacity=groupDrag?.11:.045;
    parentLineGeometry.setDrawRange(0,parentCount*2);if(parentCount){
      const positions=parentLineGeometry.attributes.position,colours=parentLineGeometry.attributes.color;
      positions.clearUpdateRanges();positions.addUpdateRange(0,parentCount*6);positions.needsUpdate=true;
      colours.clearUpdateRanges();colours.addUpdateRange(0,parentCount*6);colours.needsUpdate=true;
    }
    let activeCount=0,time=performance.now()*.001;
    for(let k=0;k<activityCount;k++){
      let a,b;
      if(k%3===0){const i=(k*83)%nodes.length,hubIndex=visualHubIndices.get(sourceId(nodes[i]));if(hubIndex===undefined||!nodeVisibility[i]||!nodeVisibility[hubIndex])continue;a=visualNodes[i];b=visualNodes[hubIndex];}
      else {const edgeIndex=activityEdges[(k*47)%Math.max(1,activityEdges.length)],edge=links[edgeIndex];if(!edge||!nodeVisibility[edge.a]||!nodeVisibility[edge.b])continue;a=visualNodes[edge.a];b=visualNodes[edge.b];}
      const t=(time*(.16+(k%7)*.018)+hash(String(k)+'activity'))%1,j=activeCount++*3,ease=t*t*(3-2*t);
      activityPositions[j]=a.x+(b.x-a.x)*ease;activityPositions[j+1]=a.y+(b.y-a.y)*ease;activityPositions[j+2]=a.z+(b.z-a.z)*ease;
    }
    activityGeometry.setDrawRange(0,activeCount);if(activeCount){const a=activityGeometry.attributes.position;a.clearUpdateRanges();a.addUpdateRange(0,activeCount*3);a.needsUpdate=true;}
    activityDots.visible=activeCount>0;
    const graphHost=$('graph-stage');
    if(graphHost.dataset.drawnLinks!==String(count+highlightCount))graphHost.dataset.drawnLinks=String(count+highlightCount);
    if(graphHost.dataset.linkMode!==settings.links)graphHost.dataset.linkMode=settings.links;
    if(graphHost.dataset.parentEdges!==String(parentCount))graphHost.dataset.parentEdges=String(parentCount);
    if(graphHost.dataset.activityPackets!==String(activeCount))graphHost.dataset.activityPackets=String(activeCount);
    if(graphHost.dataset.formation!==settings.formation)graphHost.dataset.formation=settings.formation;
    if(graphHost.dataset.groupShells!=='0')graphHost.dataset.groupShells='0';
    if(graphHost.dataset.syntheticGroupHubs!=='0')graphHost.dataset.syntheticGroupHubs='0';
    if(graphHost.dataset.nodeGroupHubs!==String(visualHubIndices.size))graphHost.dataset.nodeGroupHubs=String(visualHubIndices.size);
    selectionRing.visible=selected>=0&&visible(nodes[selected])&&physics.scales[selected]>.15;
    if(selected>=0){const n=nodes[selected],v=visualNodes[selected];selectionRing.position.set(v.x,v.y,v.z);selectionRing.scale.setScalar(n.radius*1.18);}
    universeUI.updateLabels(camera,visualNodes,nodeVisibility,settings.layout,physics.entrance.total?physics.entrance.revealed/physics.entrance.total:1,physics.scales,physics.groupParents);
  }
  $('graph-counts').textContent=`${nodes.length.toLocaleString('en-AU')} nodes · ${links.length.toLocaleString('en-AU')} links`;
  $('loading').hidden=true;$('graph-stage').dataset.ready='true';
  $('graph-stage').dataset.nodes=String(nodes.length);$('graph-stage').dataset.links=String(links.length);
  Object.assign($('graph-stage').dataset,{starAsset:'Blender 5.2.1 mesh and Fog Glow',starVertices:String(core.geometry.attributes.position.count)});
  Object.assign($('graph-stage').dataset,{layout:settings.layout,environment:'world-space',backgroundStars:String(assets[6].positions.length/3)});
  replay(false);$('replay-entrance').disabled=false;
  updateObjects();
  const renderTimer=new THREE.Timer();renderTimer.connect(document);
  renderActivity=new RenderActivity(performance.now(),{idleMs:renderProfile.idleMs,fps:renderProfile.activeFps});
  const heldPointers=new Set();let renderedFrames=0,renderTicks=0;
  function requestRender() {if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);}
  wakeRendering=()=>{
    const now=performance.now(),waking=renderActivity.touch(now);
    if(waking||!raf){
      renderTimer.reset();renderActivity.nextFrame=now;
      sampleStart=now;frames=0;dirty=true;
      physics.configure({visible:!document.hidden});
    }
    $('graph-stage').dataset.renderState=document.hidden?'hidden':'active';
    if(waking)$('motion-status').textContent=settings.paused?'Motion paused':'Motion on';
    requestRender();
  };
  const activityOptions={capture:true,passive:true};
  for(const name of ['pointermove','pointerenter','wheel','keydown','input','change'])
    document.addEventListener(name,wakeRendering,activityOptions);
  document.addEventListener('pointerdown',event=>{heldPointers.add(event.pointerId);wakeRendering();},activityOptions);
  for(const name of ['pointerup','pointercancel'])window.addEventListener(name,event=>{heldPointers.delete(event.pointerId);wakeRendering();},activityOptions);
  window.addEventListener('blur',()=>heldPointers.clear());
  window.addEventListener('focus',wakeRendering);
  Object.assign($('graph-stage').dataset,{renderState:'active',idleAfterSeconds:String(renderProfile.idleMs/1000),frameLimit:String(renderProfile.activeFps),pixelRatio:String(renderer.getPixelRatio()),renderedFrames:'0',renderTicks:'0'});
  applyOpenMethodSurface=data=>{
    if(data?.type!=='open-method-surface')return;
    surfaceInteractive=data.interactive!==false;
    document.body.classList.toggle('open-method-ambient',!surfaceInteractive);
    $('graph-stage').dataset.openMethodInteractive=String(surfaceInteractive);
    focusSource(data.focus);
    wakeRendering();
  };
  if(pendingOpenMethodSurface)applyOpenMethodSurface(pendingOpenMethodSurface);
  function tick(now) {
    raf=0;if(document.hidden)return;
    renderTicks++;
    if(renderActivity.checkIdle(now,dragging||!!groupDrag||changingLayout||heldPointers.size>0||!!cameraFlight)){
      // Leave the browser's composited canvas untouched. No screenshot copy,
      // repeated scene draw or post-processing is needed to hold this image.
      physics.configure({visible:false});
      Object.assign($('graph-stage').dataset,{renderState:'idle',fps:'0',renderedFrames:String(renderedFrames),renderTicks:String(renderTicks),environmentTime:environment.time.toFixed(3)});
      $('motion-status').textContent='Idle · image held to save GPU';
      return;
    }
    requestRender();if(!renderActivity.frameDue(now))return;
    renderTimer.update(now);const frameDelta=Math.min(.05,renderTimer.getDelta());
    if(cameraFlight){
      const progress=Math.min(1,(now-cameraFlight.started)/cameraFlight.duration),eased=1-Math.pow(1-progress,3);
      camera.position.lerpVectors(cameraFlight.fromPosition,cameraFlight.toPosition,eased);
      controls.target.lerpVectors(cameraFlight.fromTarget,cameraFlight.toTarget,eased);dirty=true;
      if(progress>=1){cameraFlight=null;controls.update();save();if(!surfaceInteractive)renderActivity.lastActivity=now-renderProfile.idleMs+900;}
    }
    const nodeFieldMoving=!settings.paused&&!reduced.matches&&settings.layout==='atlas'&&settings.formation==='sphere';
    if(nodeFieldMoving)nodeMotionTime+=frameDelta*settings.speed;
    if(Math.abs(wheelRemaining)>.00001){
      const step=wheelRemaining*(1-Math.exp(-frameDelta/.065));
      const offset=camera.position.clone().sub(controls.target),length=offset.length();
      const next=Math.max(controls.minDistance,Math.min(controls.maxDistance,length*Math.exp(step)));
      if(length>0)camera.position.copy(controls.target).add(offset.multiplyScalar(next/length));
      $('graph-stage').dataset.zoomDistance=next.toFixed(3);
      wheelRemaining-=step;dirty=true;
      if(Math.abs(wheelRemaining)<=.00001||next===controls.minDistance||next===controls.maxDistance){wheelRemaining=0;deferSave();}
    }
    if(physics.sample(now))dirty=true;
    const backgroundMoving=environment.update(frameDelta,settings,!settings.paused&&!reduced.matches);
    controls.update(frameDelta);
    const entrance=physics.entrance;
    const paused=entrance.active&&settings.paused;
    const entranceText=entrance.active
      ?(paused?'Reveal paused':entrance.phase==='settling'?'Stars settling into place':`Revealing ${entrance.revealed.toLocaleString('en-AU')} of ${entrance.total.toLocaleString('en-AU')}`)
      :(reduced.matches?'Reduced motion · all stars shown':'');
    if($('entrance-status').textContent!==entranceText)$('entrance-status').textContent=entranceText;
    if($('skip-entrance').hidden===entrance.active)$('skip-entrance').hidden=!entrance.active;
    Object.assign($('graph-stage').dataset,{entrance:entrance.phase,revealed:String(entrance.revealed),entranceTime:String(entrance.elapsed??0)});
    if(dirty||controls.autoRotate||backgroundMoving||nodeFieldMoving){
      updateObjects();
      environment.prepareRender(renderer,camera);if(settings.background==='horizon'||settings.background==='planetary')composer.render();else renderer.render(scene,camera);
      frames++;renderedFrames++;dirty=false;
    }
    if(now-sampleStart>=1500){
      const fps=Math.round(frames*1000/(now-sampleStart)),clearance=physics.clearance();
      $('graph-stage').dataset.activeFps=String(fps);
      $('motion-status').textContent=settings.paused&&!dragging?'Motion paused':`Motion on · ${fps} fps`;
      const status=$('collision-status');status.textContent='Solid sphere collisions on';
      Object.assign(status.dataset,{overlaps:String(clearance.overlaps),maxPenetration:String(clearance.maxPenetration),physicsMs:clearance.physicsMs.toFixed(2)});
      Object.assign($('graph-stage').dataset,{fps:String(fps),drawCalls:String(renderer.info.render.calls),physicalSprings:String(physics.jointCount),camera:camera.position.toArray().join(','),steps:String(physics.steps),environmentTime:environment.time.toFixed(3),renderedFrames:String(renderedFrames),renderTicks:String(renderTicks),auraFieldCache:String(environment.fieldCacheActive)});
      if(selected>=0){const n=nodes[selected];Object.assign($('node-info').dataset,{x:n.x.toFixed(3),y:n.y.toFixed(3),z:n.z.toFixed(3),pinned:String(n.pinned)});}
      frames=0;sampleStart=now;
    }
  }
  requestRender();
  document.addEventListener('visibilitychange',()=>{
    save();
    if(document.hidden){cancelAnimationFrame(raf);raf=0;heldPointers.clear();physics.configure({visible:false});$('graph-stage').dataset.renderState='hidden';}
    else wakeRendering();
  });
  window.addEventListener('pagehide',()=>{save();physics.dispose();});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}
start().catch(fail);
