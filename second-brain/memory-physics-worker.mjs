import { initPhysics } from './rendering/graph-physics.mjs';
import { EntrancePhysics } from './memory-entrance-physics.mjs';

let physics,timer,last=0,accumulator=0,sample=0,totalMs=0,totalSteps=0,stepCount=0,cycle=0;
let settings={running:true,visible:true,pull:1,drift:true};
let metrics={overlaps:0,maxPenetration:0,nearContacts:0,physicsMs:0};
function sendState(initial=false,action=null) {
  const positions=new Float32Array(physics.nodes.length*3),pins=new Uint8Array(physics.nodes.length);
  physics.nodes.forEach((n,i)=>{positions.set([n.x,n.y,n.z],i*3);pins[i]=Number(n.pinned);});
  const scales=physics.scales.slice(),linkProgress=physics.links.slice();
  postMessage({type:'state',initial,action,cycle,positions,pins,metrics,scales,linkProgress,entrance:physics.entrance,
    springs:physics.jointCount,steps:stepCount},[positions.buffer,pins.buffer,scales.buffer,linkProgress.buffer]);
}
function tick() {
  clearTimeout(timer);if(!physics)return;
  const started=performance.now(),running=settings.visible&&(settings.running||!!physics.drag);
  if(running) {
    const wasDragging=!!physics.drag;
    accumulator+=Math.min(.05,(started-last)/1000);
    let count=0;
    while(accumulator>=1/60&&count<3) {
      const t=performance.now();physics.step({...settings,drift:settings.drift&&settings.running});
      totalMs+=performance.now()-t;totalSteps++;stepCount++;count++;accumulator-=1/60;
    }
    if(started-sample>1500){metrics={...physics.clearance(),physicsMs:totalMs/Math.max(1,totalSteps)};sample=started;totalMs=0;totalSteps=0;}
    if(count)sendState(false,wasDragging&&!physics.drag?'dragEnded':null);
  }else accumulator=0;
  last=started;
  timer=setTimeout(tick,running?Math.max(1,16-(performance.now()-started)):150);
}
self.onmessage=async({data})=>{
  try {
    if(data.type==='init') {
      await initPhysics();
      physics=new EntrancePhysics(data.nodes,data.edges,data.routes,data.attraction);
      settings={...settings,...data.settings};last=performance.now();sample=last;
      metrics={...physics.clearance(),physicsMs:0};sendState(true);tick();return;
    }
    if(!physics)return;
    if(data.type==='settings')settings={...settings,...data.settings};
    if(data.type==='entrance'){cycle=data.cycle??cycle+1;physics.beginEntrance(data);accumulator=0;last=performance.now();}
    if(data.type==='finishEntrance')physics.finishEntrance();
    if(data.type==='pin')physics.pin(data.index,data.pinned);
    if(data.type==='startDrag')physics.startDrag(data.index);
    if(data.type==='moveDrag')physics.moveDrag(data.target);
    if(data.type==='endDrag')physics.endDrag(data.pin);
    if(data.type==='dispose'){clearTimeout(timer);physics.dispose();close();return;}
    sendState(false,data.type);tick();
  }catch(error){postMessage({type:'error',message:error.message,stack:error.stack});}
};
