import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { prepareNodes } from './graph-physics.mjs';
import { WorkerPhysics } from './graph-physics-client.mjs';
import {layoutNames,layoutDescriptions,makeLayout} from './graph-layouts.mjs';
import {palettes,designs,nodeColour} from './graph-appearance.mjs';
import {GraphEnvironment,environmentNames} from './graph-environment.mjs';

const $ = id => document.getElementById(id);
const STORAGE = 'graphify-solid-3d-layout-v1';
const SETTINGS = 'graphify-solid-3d-settings-v1';
const read = key => {
  try {const value=JSON.parse(localStorage.getItem(key)||'null');if(value!==null)return value;}catch{}
  return window.PRALIA_SHARED_VIEW?.storage?.[key]??null;
};
const write = (key,data) => {try{localStorage.setItem(key,JSON.stringify(data));}catch{}};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const oldSettings=read('graphify-constellation-settings-v1'), userSettings=read(SETTINGS)||{};
const settings = {paused:reduced.matches,pull:oldSettings?.gravity??1,pinOnDrop:true,autoOrbit:false,
  background:'universe',animation:'depth',speed:1,orbit:1,glow:1,rebound:.45,
  layout:'saved',design:'starlight',palette:'celestial',shaderSpeed:.2,surroundStars:true,environmentDesign:'cosmic',...userSettings};
settings.pull = Math.max(0,Math.min(2,Number(settings.pull)||0));
for(const [key,min,max] of [['speed',.2,2],['orbit',0,2],['glow',0,2],['rebound',0,1],['shaderSpeed',0,1]])
  settings[key]=Math.max(min,Math.min(max,Number.isFinite(Number(settings[key]))?Number(settings[key]):1));
if(!['depth','float','breathe'].includes(settings.animation))settings.animation='depth';
if(!environmentNames[settings.background])settings.background='universe';
if(!layoutNames[settings.layout])settings.layout='saved';
if(!palettes[settings.palette])settings.palette='celestial';
if(!designs[settings.design])settings.design='starlight';
if(!['cosmic','gradient'].includes(settings.environmentDesign))settings.environmentDesign='cosmic';
const layoutStorage=key=>key==='saved'?STORAGE:STORAGE+'-'+key;
const saved=read(layoutStorage(settings.layout));
let physics, renderer, controls, nodes, camera, selected=-1, allLinks=false, mesh, haloMaterial,environment,applyAppearance;
let changingLayout=false;
let raf, dirty=true, frames=0, sampleStart=performance.now();

function syncSettings() {
  $('motion-toggle').textContent=settings.paused?'Resume motion':'Pause motion';
  $('motion-toggle').setAttribute('aria-pressed',String(!settings.paused));
  $('star-pull').value=String(settings.pull);$('star-pull-value').textContent=settings.pull.toFixed(1);
  $('pin-on-drop').checked=settings.pinOnDrop;$('auto-orbit').checked=settings.autoOrbit;
  $('background-preset').value=settings.background;
  $('animation-mode').value=settings.animation;
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
  physics?.configure({running:!settings.paused,visible:!document.hidden,pull:settings.pull,
    drift:!reduced.matches,animation:settings.animation,speed:settings.speed,orbit:settings.orbit,rebound:settings.rebound});
  write(SETTINGS,settings);dirty=true;
}
syncSettings();

function save() {
  if(!physics||!camera||changingLayout)return;
  write(layoutStorage(settings.layout),{nodes:nodes.map(n=>({id:n.id,x:n.x,y:n.y,z:n.z,pinned:n.pinned})),
    camera:{position:camera.position.toArray(),target:controls.target.toArray()}});
}
function exportView() {
  if(!physics||changingLayout)return;
  save();
  const keys=[SETTINGS,...Object.keys(layoutNames).map(layoutStorage),
    'graphify-constellation-settings-v1','graphify-constellation-layout-v1',
    'graphify-constellation-position-bookmark-v1'];
  const snapshot={format:'pralia-constellation-snapshot',version:1,
    capturedAt:new Date().toISOString(),nodes:nodes.length,
    storage:Object.fromEntries(keys.map(key=>[key,read(key)]).filter(([,value])=>value!==null)),
    playback:{environmentTime:environment.time,allLinks}};
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
  const baseline=prepareNodes(data,read('graphify-constellation-layout-v1'));
  nodes=saved?prepareNodes(data,null,saved):makeLayout(baseline,data,settings.layout);
  physics=new WorkerPhysics(nodes,data,()=>{dirty=true;if(selected>=0)updateNodeState();},fail);
  const assets=await Promise.all([new GLTFLoader().loadAsync('./assets/star-core.glb'),
    new THREE.TextureLoader().loadAsync('./assets/star-glow.png'),physics.ready,
    new GLTFLoader().loadAsync('./assets/crystal-core.glb'),
    new GLTFLoader().loadAsync('./assets/orbital-ring.glb'),
    new GLTFLoader().loadAsync('./assets/universe-shell.glb'),
    fetch('./assets/universe-stars.json').then(r=>{if(!r.ok)throw new Error('Starfield unavailable');return r.json();})]);
  const getMesh=asset=>{let m;asset.scene.traverse(o=>{if(o.isMesh&&!m)m=o;});if(!m)throw new Error('Blender mesh missing');return m;};
  let core;
  assets[0].scene.traverse(object=>{if(object.isMesh&&!core)core=object;});
  if(!core)throw new Error('Blender star mesh is missing.');
  const glowTexture=assets[1];glowTexture.colorSpace=THREE.SRGBColorSpace;
  const index=physics.index, overview=new Set(data.overview);
  const incident=nodes.map(()=>[]);
  const links=data.edges.map((e,i)=>{
    const a=index.get(e.from),b=index.get(e.to);incident[a].push(i);incident[b].push(i);return {a,b};
  });
  const scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(48,1,.1,100000);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0x000000,0);
  $('graph-3d').append(renderer.domElement);
  environment=new GraphEnvironment(scene,getMesh(assets[5]).geometry,assets[6].positions,glowTexture);
  environment.time=window.PRALIA_SHARED_VIEW?.playback?.environmentTime??0;
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
  const linePositions=new Float32Array(links.length*6);
  const lineGeometry=new THREE.BufferGeometry();
  lineGeometry.setAttribute('position',new THREE.BufferAttribute(linePositions,3).setUsage(THREE.DynamicDrawUsage));
  const lineMaterial=new THREE.LineBasicMaterial({color:0x9bbbd8,transparent:true,opacity:.18,depthWrite:false});
  const lines=new THREE.LineSegments(lineGeometry,lineMaterial);lines.frustumCulled=false;scene.add(lines);
  const selectedGeometry=new THREE.BufferGeometry();
  const selectedPositions=new Float32Array(links.length*6);
  selectedGeometry.setAttribute('position',new THREE.BufferAttribute(selectedPositions,3).setUsage(THREE.DynamicDrawUsage));
  const selectedLines=new THREE.LineSegments(selectedGeometry,new THREE.LineBasicMaterial({color:0xffe6a4,transparent:true,opacity:.65,depthWrite:false}));
  selectedLines.frustumCulled=false;scene.add(selectedLines);
  const selectionRing=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true}));
  selectionRing.visible=false;scene.add(selectionRing);
  applyAppearance=()=>{
    const p=palettes[settings.palette],style=designs[settings.design];
    mesh.geometry=style.core==='crystal'?getMesh(assets[3]).geometry:core.geometry;
    nodes.forEach((n,i)=>{
      const colour=new THREE.Color(nodeColour(n,settings.palette));
      mesh.setColorAt(i,colour.clone().lerp(whiteCore,style.core==='crystal'?.12:n.tier==='yellow'?.18:.55));
      halos.setColorAt(i,colour);
    });
    ringNodes.forEach((i,k)=>orbitRings.setColorAt(k,new THREE.Color(nodeColour(nodes[i],settings.palette))));
    mesh.instanceColor.needsUpdate=true;halos.instanceColor.needsUpdate=true;orbitRings.instanceColor.needsUpdate=true;
    haloMaterial.opacity=settings.glow*style.glow;orbitRings.visible=style.rings;
    lineMaterial.color.set(p.line);lineMaterial.opacity=style.links;
    selectedLines.material.color.set(p.hub);selectionRing.material.color.set(p.hub);
  };
  controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.autoRotateSpeed=.28;
  controls.minDistance=12;controls.maxDistance=15000;
  controls.addEventListener('change',()=>{dirty=true;});
  controls.addEventListener('end',save);
  function resize() {
    const host=$('graph-3d'),w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true;
  }
  new ResizeObserver(resize).observe($('graph-3d'));resize();
  function fit() {
    const box=new THREE.Box3();nodes.forEach(n=>box.expandByPoint(new THREE.Vector3(n.x,n.y,n.z)));
    const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
    const distance=Math.max(size.x/Math.max(camera.aspect,.4),size.y,size.z)*.6/Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    const view=settings.layout==='galaxy'?new THREE.Vector3(.15,1,.4):new THREE.Vector3(.25,.18,1);
    controls.target.copy(center);camera.position.copy(center).add(view.normalize().multiplyScalar(distance));
    controls.update();dirty=true;
  }
  fit();
  if(saved?.camera&&[saved.camera.position,saved.camera.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite))) {
    camera.position.fromArray(saved.camera.position);controls.target.fromArray(saved.camera.target);controls.update();
  }
  function focus(i) {
    const n=nodes[i],target=new THREE.Vector3(n.x,n.y,n.z);
    const direction=camera.position.clone().sub(controls.target).normalize();
    const distance=Math.max(n.radius*14,90);
    camera.position.copy(target).addScaledVector(direction,distance);controls.target.copy(target);
    controls.update();dirty=true;save();
  }
  function nodeButton(n,callback) {
    const button=document.createElement('button');button.type='button';button.textContent=n.label;
    button.addEventListener('click',callback);return button;
  }
  function updateNodeState() {
    const n=nodes[selected];if(!n)return;
    $('node-state').textContent=physics?.releasePending?'Settling at drop position…':n.pinned?'Pinned in 3D':'Free to move and collide';
    $('pin-node').textContent=n.pinned?'Release node':'Pin node';
    $('node-info').dataset.pinned=String(n.pinned);
  }
  physics.onRelease=()=>{updateNodeState();save();};
  async function changeLayout(key) {
    if(changingLayout||key===settings.layout)return;
    save();
    const priorLayout=settings.layout,priorPhysics=physics;
    const remembered=read(layoutStorage(key));
    const replacement=remembered?prepareNodes(data,null,remembered):makeLayout(baseline,data,key);
    changingLayout=true;$('layout-preset').disabled=true;controls.enabled=false;
    $('layout-description').textContent='Arranging '+layoutNames[key]+'…';
    priorPhysics.configure({running:false});
    let next;
    try {
      next=new WorkerPhysics(replacement,data,()=>{},()=>{});
      await next.ready;
      priorPhysics.dispose();
      replacement.forEach((n,i)=>Object.assign(nodes[i],n));
      // Retain the objects referenced by the renderer while the worker feeds
      // new physical positions into that same array.
      next.nodes=nodes;next.onRelease=()=>{updateNodeState();save();};next.onError=fail;
      next.onUpdate=()=>{dirty=true;if(selected>=0)updateNodeState();};
      physics=next;settings.layout=key;selected=-1;$('node-info').hidden=true;
      changingLayout=false;syncSettings();fit();
      if(remembered?.camera&&[remembered.camera.position,remembered.camera.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite))){
        camera.position.fromArray(remembered.camera.position);controls.target.fromArray(remembered.camera.target);controls.update();
      }
      save();$('graph-stage').dataset.layout=key;
    }catch(error){next?.dispose();settings.layout=priorLayout;changingLayout=false;physics=priorPhysics;syncSettings();$('layout-description').textContent='This layout could not load. Your previous arrangement is still here.';console.error(error);}
    $('layout-preset').disabled=false;controls.enabled=true;dirty=true;
  }
  function select(i) {
    selected=i;dirty=true;if(i<0){$('node-info').hidden=true;return;}
    const n=nodes[i];$('node-info').hidden=false;$('node-name').textContent=n.label;
    $('node-detail').textContent=(n.title||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').slice(0,2600);
    updateNodeState();
    $('node-info').dataset.nodeId=n.id;$('node-info').dataset.pinned=String(n.pinned);
    const root=index.get(data.routes[n.id]?.root),anchor=index.get(data.routes[n.id]?.anchor);
    const kind=n.tier==='yellow'?'Primary hub':n.tier==='white'?'Local hub':'Community node';
    $('node-kind').textContent=kind;
    const group=document.createElement('span');group.textContent=root===undefined?'Independent group':'Group: ';
    $('node-group').replaceChildren(group);
    if(root!==undefined)$('node-group').append(nodeButton(nodes[root],()=>{select(root);focus(root);}));
    $('node-anchor').textContent=anchor===undefined?'':('Follows: '+nodes[anchor].label);
    const neighbours=[...new Set(incident[i].map(k=>links[k].a===i?links[k].b:links[k].a))];
    $('neighbours-title').textContent=`${neighbours.length} connected node${neighbours.length===1?'':'s'}`;
    $('neighbours').replaceChildren(...neighbours.slice(0,30).map(j=>nodeButton(nodes[j],()=>{select(j);focus(j);})));
  }
  function search() {
    const term=$('search').value.trim().toLowerCase();
    const matches=term?nodes.filter(n=>(n.label+' '+(n.title||'')).toLowerCase().includes(term))
      :nodes.filter(n=>n.tier==='yellow').sort((a,b)=>b.degree-a.degree);
    $('results-caption').textContent=term?`${matches.length} ${matches.length===1?'match':'matches'}${matches.length>60?' · first 60 shown':''}`:'Main hubs';
    $('search-results').replaceChildren(...matches.slice(0,60).map(n=>nodeButton(n,()=>{select(index.get(n.id));focus(index.get(n.id));})));
  }
  search();$('search').addEventListener('input',search);
  $('focus-node').addEventListener('click',()=>{if(selected>=0)focus(selected);});
  $('pin-node').addEventListener('click',()=>{if(selected>=0){physics.pin(selected,!nodes[selected].pinned);select(selected);save();}});
  $('fit-view').addEventListener('click',()=>{fit();save();});
  $('all-links').addEventListener('click',()=>{allLinks=!allLinks;$('all-links').textContent=allLinks?'Fewer links':'Show all links';$('all-links').setAttribute('aria-pressed',String(allLinks));dirty=true;});
  $('motion-toggle').addEventListener('click',()=>{settings.paused=!settings.paused;syncSettings();});
  $('background-preset').addEventListener('change',e=>{settings.background=e.target.value;syncSettings();});
  $('layout-preset').addEventListener('change',e=>{void changeLayout(e.target.value);});
  $('design-preset').addEventListener('change',e=>{settings.design=e.target.value;syncSettings();});
  $('palette-preset').addEventListener('change',e=>{settings.palette=e.target.value;syncSettings();});
  $('surround-stars').addEventListener('change',e=>{settings.surroundStars=e.target.checked;syncSettings();});
  $('environment-design').addEventListener('change',e=>{settings.environmentDesign=e.target.value;syncSettings();});
  $('star-pull').addEventListener('input',e=>{settings.pull=Number(e.target.value);syncSettings();});
  $('animation-mode').addEventListener('change',e=>{settings.animation=e.target.value;syncSettings();});
  for(const key of ['speed','orbit','glow','rebound','shaderSpeed'])
    $(key).addEventListener('input',e=>{settings[key]=Number(e.target.value);syncSettings();});
  $('pin-on-drop').addEventListener('change',e=>{settings.pinOnDrop=e.target.checked;syncSettings();});
  $('auto-orbit').addEventListener('change',e=>{settings.autoOrbit=e.target.checked;syncSettings();});
  reduced.addEventListener('change',()=>{if(reduced.matches){settings.paused=true;syncSettings();}});
  syncSettings();
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(),hitPoint=new THREE.Vector3(),dragOffset=new THREE.Vector3();
  let dragging=false,dragPointer=null,pendingDrag=null,hoverAt=0;
  function ray(e) {
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
  }
  function pick(e) {
    ray(e);
    const exact=raycaster.intersectObject(mesh,false)[0]?.instanceId;
    if(exact!==undefined)return exact;
    // A small on-screen hit allowance keeps distant stars easy to recognise.
    // Use the nearest sphere on the view ray, never the decorative halo.
    const rect=renderer.domElement.getBoundingClientRect(),pixelAngle=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/rect.height;
    let found=-1,nearest=Infinity;
    nodes.forEach((n,i)=>{
      pos.set(n.x,n.y,n.z);
      const depth=pos.clone().sub(raycaster.ray.origin).dot(raycaster.ray.direction);
      const radius=Math.max(n.radius,depth*pixelAngle*4);
      if(depth>0&&depth<nearest&&raycaster.ray.distanceSqToPoint(pos)<radius*radius){found=i;nearest=depth;}
    });return found;
  }
  // Capture before OrbitControls: dragging a node must not also rotate the camera.
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const i=pick(e);if(i<0)return;
    select(i);pendingDrag={index:i,x:e.clientX,y:e.clientY};dragPointer=e.pointerId;
    controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);
    const n=nodes[i],normal=camera.getWorldDirection(new THREE.Vector3());
    plane.setFromNormalAndCoplanarPoint(normal,new THREE.Vector3(n.x,n.y,n.z));
    raycaster.ray.intersectPlane(plane,hitPoint);dragOffset.set(n.x,n.y,n.z).sub(hitPoint);
    $('hover-label').hidden=true;e.stopImmediatePropagation();e.preventDefault();
  },true);
  renderer.domElement.addEventListener('pointermove',e=>{
    if(pendingDrag){
      if(!dragging&&Math.hypot(e.clientX-pendingDrag.x,e.clientY-pendingDrag.y)>=4){physics.startDrag(pendingDrag.index);dragging=true;}
      if(dragging){ray(e);if(raycaster.ray.intersectPlane(plane,hitPoint))physics.moveDrag(hitPoint.add(dragOffset));dirty=true;}
      return;
    }
    const now=performance.now();if(now-hoverAt<50)return;hoverAt=now;
    const i=pick(e),label=$('hover-label');label.hidden=i<0;
    renderer.domElement.style.cursor=i<0?'grab':'pointer';
    if(i>=0){const rect=$('graph-stage').getBoundingClientRect();label.textContent=nodes[i].label+' · '+(nodes[i].tier==='yellow'?'primary hub':nodes[i].tier==='white'?'local hub':'community');
      label.style.left=Math.min(e.clientX-rect.left+12,rect.width-280)+'px';label.style.top=Math.max(68,e.clientY-rect.top-35)+'px';}
  });
  function endDrag(e){
    if(!pendingDrag||e.pointerId!==dragPointer)return;
    if(dragging)physics.endDrag(settings.pinOnDrop);
    dragging=false;pendingDrag=null;controls.enabled=true;
    if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
    select(selected);if(!physics.releasePending)save();dirty=true;
  }
  renderer.domElement.addEventListener('pointerup',endDrag);
  renderer.domElement.addEventListener('pointercancel',endDrag);
  $('graph-3d').addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;
    const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);
    if(e.key==='ArrowLeft')spherical.theta-=.1;if(e.key==='ArrowRight')spherical.theta+=.1;
    if(e.key==='ArrowUp')spherical.phi-=.1;if(e.key==='ArrowDown')spherical.phi+=.1;
    if(e.key==='+'||e.key==='=')spherical.radius*=.85;if(e.key==='-')spherical.radius*=1.15;
    spherical.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
    controls.update();dirty=true;e.preventDefault();save();
  });
  function updateObjects() {
    nodes.forEach((n,i)=>{
      pos.set(n.x,n.y,n.z);scale.setScalar(n.radius);matrix.compose(pos,rotation,scale);mesh.setMatrixAt(i,matrix);
      // The 16-unit Blender bake matches the physical one-unit core.
      scale.setScalar(n.radius*16);
      matrix.compose(pos,camera.quaternion,scale);halos.setMatrixAt(i,matrix);
    });
    mesh.instanceMatrix.needsUpdate=true;
    halos.instanceMatrix.needsUpdate=true;halos.visible=haloMaterial.opacity>0;
    ringNodes.forEach((i,k)=>{const n=nodes[i];pos.set(n.x,n.y,n.z);scale.setScalar(n.radius);
      matrix.compose(pos,ringRotations[k],scale);orbitRings.setMatrixAt(k,matrix);});
    orbitRings.instanceMatrix.needsUpdate=true;
    let count=0,highlightCount=0;
    links.forEach((link,i)=>{
      const a=nodes[link.a],b=nodes[link.b];
      if(allLinks||overview.has(i)) {linePositions.set([a.x,a.y,a.z,b.x,b.y,b.z],count*6);count++;}
      if(selected===link.a||selected===link.b){selectedPositions.set([a.x,a.y,a.z,b.x,b.y,b.z],highlightCount*6);highlightCount++;}
    });
    lineGeometry.setDrawRange(0,count*2);lineGeometry.attributes.position.needsUpdate=true;
    selectedGeometry.setDrawRange(0,highlightCount*2);selectedGeometry.attributes.position.needsUpdate=true;
    selectionRing.visible=selected>=0;
    if(selected>=0){const n=nodes[selected];selectionRing.position.set(n.x,n.y,n.z);selectionRing.scale.setScalar(n.radius*1.18);}
  }
  $('graph-counts').textContent=`${nodes.length.toLocaleString('en-AU')} nodes · ${links.length.toLocaleString('en-AU')} links`;
  $('loading').hidden=true;$('graph-stage').dataset.ready='true';
  $('graph-stage').dataset.nodes=String(nodes.length);$('graph-stage').dataset.links=String(links.length);
  Object.assign($('graph-stage').dataset,{starAsset:'Blender 5.2.1 mesh and Fog Glow',starVertices:String(core.geometry.attributes.position.count)});
  Object.assign($('graph-stage').dataset,{layout:settings.layout,environment:'world-space',backgroundStars:String(assets[6].positions.length/3)});
  updateObjects();
  const renderTimer=new THREE.Timer();renderTimer.connect(document);
  function tick(now) {
    raf=requestAnimationFrame(tick);if(document.hidden)return;
    renderTimer.update(now);
    const backgroundMoving=environment.update(renderTimer.getDelta(),settings,!settings.paused&&!reduced.matches);
    controls.update();
    if(dirty||controls.autoRotate||backgroundMoving){updateObjects();renderer.render(scene,camera);frames++;dirty=false;}
    if(now-sampleStart>=1500){
      const fps=Math.round(frames*1000/(now-sampleStart)),clearance=physics.clearance();
      $('motion-status').textContent=settings.paused&&!dragging?'Motion paused':`Motion on · ${fps} fps`;
      const status=$('collision-status');status.textContent='Solid sphere collisions on';
      Object.assign(status.dataset,{overlaps:String(clearance.overlaps),maxPenetration:String(clearance.maxPenetration),physicsMs:clearance.physicsMs.toFixed(2)});
      Object.assign($('graph-stage').dataset,{fps:String(fps),drawCalls:String(renderer.info.render.calls),physicalSprings:String(physics.jointCount),camera:camera.position.toArray().join(','),steps:String(physics.steps),environmentTime:environment.time.toFixed(3)});
      if(selected>=0){const n=nodes[selected];Object.assign($('node-info').dataset,{x:n.x.toFixed(3),y:n.y.toFixed(3),z:n.z.toFixed(3),pinned:String(n.pinned)});}
      frames=0;sampleStart=now;
    }
  }
  raf=requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',()=>{save();physics.configure({visible:!document.hidden});dirty=true;});
  window.addEventListener('pagehide',()=>{save();physics.dispose();});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}
start().catch(fail);
