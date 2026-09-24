// Real WebGL regression fixture, built and served separately from the app.
import * as THREE from 'three';
import {createContinuousCoronaMaterial} from './continuous-corona.mjs';
import {attachAuraProjection} from './corona-projection.mjs';
import {createSculptedCorona,createWhiteSurround} from './sculpted-corona.mjs';
const results=[];
function check(condition,name,detail){results.push({name,passed:!!condition,detail});if(!condition)throw new Error(name);}
async function run(){
 const spec=await fetch('./continuous-optics.json').then(r=>r.json());
 const response=await fetch('./continuous-corona-field.bin.gz');
 const raw=new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 const texture=new THREE.DataTexture(raw,...spec.halo.dimensions,THREE.RGFormat);
 texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.wrapS=THREE.RepeatWrapping;texture.unpackAlignment=1;texture.needsUpdate=true;
 const asset={spec,texture},renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(128,128);renderer.setClearColor(0,1);
 renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
 const errors=[];renderer.debug.onShaderError=()=>errors.push('Shader compilation failed');
 const scene=new THREE.Scene(),parent=new THREE.Group();parent.rotation.set(.20,0,.25);
 const aura=createSculptedCorona(asset);parent.add(aura);scene.add(parent);
 const surround=aura.getObjectByName('White aura — complete front back and side surround');
 // Compare the retained contour separately from the newly requested full ring.
 surround.visible=false;
 scene.add(new THREE.Mesh(new THREE.SphereGeometry(1,128,64),new THREE.MeshBasicMaterial({color:0})));
 const old=new THREE.Mesh(new THREE.PlaneGeometry(1,1,512,32),createContinuousCoronaMaterial(asset));attachAuraProjection(old,spec);old.frustumCulled=false;scene.add(old);
 const camera=new THREE.PerspectiveCamera(48,1,.01,100),target=new THREE.WebGLRenderTarget(128,128);
 const sample=(position,legacy=false,look=[0,0,0])=>{
   old.visible=legacy;parent.visible=!legacy;camera.position.set(...position);camera.lookAt(...look);camera.updateMatrixWorld(true);
   renderer.setRenderTarget(target);renderer.render(scene,camera);
   const pixels=new Uint8Array(128*128*4);renderer.readRenderTargetPixels(target,0,0,128,128,pixels);return pixels;
 };
 const difference=(a,b)=>{let total=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)total+=Math.abs(a[i+c]-b[i+c]);return total/(128*128*3);};
 const lit=p=>{let n=0;for(let i=0;i<p.length;i+=4)if(p[i]+p[i+1]+p[i+2]>30)n++;return n;};
 const centre=p=>[...p.slice((64*128+64)*4,(64*128+64)*4+3)];
 const legacy=sample([0,0,4.2],true),front=sample([0,0,4.2]);
 check(errors.length===0,'Actual 3D aura shaders compile',errors);
 const referenceDifference=difference(legacy,front);
 check(referenceDifference<8,'Retained contour reference-view shape and texture (new surround excluded)',{meanRGBByteDifference:referenceDifference});
 const coordinates=aura.children.filter(m=>m.name.startsWith('Curved')).map(m=>m.geometry.attributes.position.array.slice());
 const above=sample([0,2,3.7]),side=sample([2.7,.6,3.2]);
 check(difference(front,above)>5&&difference(front,side)>5,'Orbit changes the physical projected shape',{aboveDifference:difference(front,above),sideDifference:difference(front,side)});
 check(lit(side)>100&&lit(above)>100,'Curved aura remains visible from side and above',{});
 check(Math.max(...centre(above))<8&&Math.max(...centre(side))<8,'Opaque core hides rear light layers',{aboveCentre:centre(above),sideCentre:centre(side)});
 for(const [i,mesh] of aura.children.filter(m=>m.name.startsWith('Curved')).entries())check(mesh.geometry.attributes.position.array.every((v,j)=>v===coordinates[i][j]),'Camera does not move layer geometry '+(i+1),{});
 check(lit(sample([0,0,4.2],false,[0,0,8]))===0,'Looking away leaves no screen-facing white aura',{});
 // Isolate the new ring to prove it covers all four azimuth quadrants.
 const wrapScene=new THREE.Scene(),wrap=createWhiteSurround(asset);
 wrapScene.add(wrap);wrapScene.add(new THREE.Mesh(new THREE.SphereGeometry(1,128,64),new THREE.MeshBasicMaterial({color:0})));
 camera.position.set(0,4.2,.001);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
 renderer.render(wrapScene,camera);
 const wrapPixels=new Uint8Array(128*128*4);renderer.readRenderTargetPixels(target,0,0,128,128,wrapPixels);
 const quadrants=[0,0,0,0];
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
   const i=(y*128+x)*4;
   if(wrapPixels[i]+wrapPixels[i+1]+wrapPixels[i+2]>30)quadrants[(x>=64?1:0)+(y>=64?2:0)]++;
 }
 check(quadrants.every(n=>n>100),'White ring covers front, back and both sides',{litPixelsPerQuadrant:quadrants});
 check(Math.max(...centre(wrapPixels))<8,'Full-surround ring retains the central hole',{centre:centre(wrapPixels)});
 surround.visible=true;
 const blocker=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshBasicMaterial({color:0x0000ff,toneMapped:false}));blocker.position.z=3;scene.add(blocker);
 const foreground=centre(sample([0,0,4.2]));
 check(foreground[0]<2&&foreground[1]<2&&foreground[2]>250,'Foreground geometry keeps correct depth',{centre:foreground});
 target.dispose();renderer.dispose();
 document.querySelector('#status').textContent=JSON.stringify({status:'passed',checks:results},null,2);document.body.dataset.result='passed';
}
run().catch(error=>{document.querySelector('#status').textContent=JSON.stringify({status:'failed',error:error.message,checks:results},null,2);document.body.dataset.result='failed';});
