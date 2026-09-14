// Actual WebGL render checks for the full curved body, independent of the app.
import * as THREE from 'three';
import {createEnclosingCorona,enclosingGeometry} from './enclosing-corona.mjs';
const checks=[];
function check(ok,name,detail={}){checks.push({name,passed:!!ok,detail});if(!ok)throw new Error(name);}
async function run(){
 const spec=await fetch('./continuous-optics.json').then(r=>r.json());
 const response=await fetch('./continuous-corona-field.bin.gz');
 const raw=new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 const texture=new THREE.DataTexture(raw,...spec.halo.dimensions,THREE.RGFormat);
 texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.wrapS=THREE.RepeatWrapping;texture.unpackAlignment=1;texture.needsUpdate=true;
 const renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(160,160);renderer.setClearColor(0,1);renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
 const errors=[];renderer.debug.onShaderError=()=>errors.push('Shader compilation failed');
 const scene=new THREE.Scene(),body=createEnclosingCorona({spec,texture},{sharedField:true,singlePass:true});scene.add(body);
 scene.add(new THREE.Mesh(new THREE.SphereGeometry(1,128,64),new THREE.MeshBasicMaterial({color:0})));
 const surfaces=body.children.filter(o=>o.name.startsWith('Closed flowing aura surface'));
 check(surfaces.length===enclosingGeometry.layers,'The full body replaces the strip and flat fill',{surfaces:surfaces.length});
 // Weld the duplicated UV seam/poles by position; every non-degenerate edge
 // must then have exactly two incident triangles. Sample inner/middle/outer.
 for(const index of [0,Math.floor(surfaces.length/2),surfaces.length-1]){
  const g=surfaces[index].geometry,p=g.attributes.position,ids=[],points=new Map(),edges=new Map();
  for(let i=0;i<p.count;i++){
   const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');
   if(!points.has(key))points.set(key,points.size);ids.push(points.get(key));
  }
  for(let i=0;i<g.index.count;i+=3){
   const tri=[0,1,2].map(k=>ids[g.index.getX(i+k)]);if(new Set(tri).size<3)continue;
   for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3],key=a<b?a+','+b:b+','+a;edges.set(key,(edges.get(key)||0)+1);}
  }
  check([...edges.values()].every(n=>n===2),'Closed geometry has no missing front/back or open boundary: surface '+(index+1),{edges:edges.size});
  g.computeBoundingBox();const size=g.boundingBox.getSize(new THREE.Vector3());
  check(Math.abs(size.x-size.z)<1e-5&&size.y>2,'Front/back span matches side span with curved vertical thickness: surface '+(index+1),{size:size.toArray()});
 }
 const outer=surfaces.at(-1).geometry.boundingBox.getSize(new THREE.Vector3());
 check(outer.y<2.4&&outer.y>2&&outer.x>14&&outer.x<14.1,'Outer body is squeezed around the core and extended about 25 percent',{size:outer.toArray(),previousSize:[11.246,3.646,11.246]});
 const camera=new THREE.PerspectiveCamera(48,1,.01,100),target=new THREE.WebGLRenderTarget(160,160);
 function sample(position,look=[0,0,0]){
  camera.position.set(...position);camera.lookAt(...look);camera.updateMatrixWorld(true);
  renderer.setRenderTarget(target);body.userData.fieldCache.prepare(renderer,camera);renderer.render(scene,camera);const p=new Uint8Array(160*160*4);renderer.readRenderTargetPixels(target,0,0,160,160,p);return p;
 }
 const lit=p=>{let n=0;for(let i=0;i<p.length;i+=4)if(p[i]+p[i+1]+p[i+2]>30)n++;return n;};
 const centre=p=>[...p.slice((80*160+80)*4,(80*160+80)*4+3)];
 const coordinates=surfaces.map(o=>o.geometry.attributes.position.array.slice());
 const views=[['front',[0,0,4.2]],['back',[0,0,-4.2]],['left',[-4.2,0,0]],['right',[4.2,0,0]],['above',[0,4.2,.001]],['below',[0,-4.2,.001]],['elevated',[0,2,3.7]]];
 for(const [name,position] of views){
  const p=sample(position),quadrants=[0,0,0,0];
  for(let y=0;y<160;y++)for(let x=0;x<160;x++){const i=(y*160+x)*4;if(p[i]+p[i+1]+p[i+2]>30)quadrants[(x>=80?1:0)+(y>=80?2:0)]++;}
  check(quadrants.every(n=>n>100),'Curved flow is visible in all four quadrants from '+name,{quadrants});
  check(Math.max(...centre(p))<8,'Dark core retained from '+name,{centre:centre(p)});
 }
 // Actual rendered hue populations, including the captured user direction.
 // Geometry and angular colour sections keep their fixed world positions.
 body.rotation.set(.20,0,.25);
 const counts={ivory:0,gold:0,copper:0,rose:0,blue:0};
 for(const position of [[0,0,4.2],[-.350660831,1.178661227,18.393335342]]){
  const p=sample(position);
  for(let i=0;i<p.length;i+=4){
   const [r,g,b]=p.slice(i,i+3);if(r+g+b<25)continue;
   if(Math.min(r,g,b)>120&&Math.max(r,g,b)-Math.min(r,g,b)<100)counts.ivory++;
   if(r>g*1.2&&g>b*1.4)counts.gold++;
   if(r>g*1.6&&g>=b*.8)counts.copper++;
   if(r>g*1.2&&b>g*1.12)counts.rose++;
   if(b>r*1.12&&b>g*1.05)counts.blue++;
  }
 }
 check(Object.values(counts).every(n=>n>5),'Distinct ivory gold copper rose and blue regions are visible in rendered pixels',{counts});
 body.rotation.set(0,0,0);
 check(surfaces.every((o,i)=>o.geometry.attributes.position.array.every((v,j)=>v===coordinates[i][j])),'Camera movement never repositions the curved geometry');
 check(lit(sample([0,0,8],[0,0,20]))===0,'Looking away leaves no screen-attached aura');
 const blocker=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshBasicMaterial({color:0x0000ff,toneMapped:false}));blocker.position.z=3;scene.add(blocker);
 const foreground=centre(sample([0,0,4.2]));check(foreground[0]<2&&foreground[1]<2&&foreground[2]>250,'Foreground objects keep correct depth',{foreground});
 check(errors.length===0,'Actual runtime shaders compile',{errors});
 renderer.dispose();target.dispose();body.userData.fieldCache.dispose();
 document.querySelector('#status').textContent=JSON.stringify({status:'passed',checks},null,2);document.body.dataset.result='passed';
}
run().catch(e=>{document.querySelector('#status').textContent=JSON.stringify({status:'failed',error:e.message,checks},null,2);document.body.dataset.result='failed';});
