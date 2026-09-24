// The browser's standard Worker keeps Rapier off the camera/rendering thread.
export class WorkerPhysics {
  constructor(nodes,data,onUpdate,onError) {
    this.onUpdate=onUpdate;
    this.onError=onError;
    this.nodes=nodes;this.index=new Map(nodes.map((n,i)=>[n.id,i]));
    this.metrics={overlaps:0,maxPenetration:0,nearContacts:0,physicsMs:0};this.steps=0;
    this.worker=new Worker('./vendor/graph-physics-worker.js');
    this.ready=new Promise((resolve,reject)=>{
      this.worker.onerror=e=>{reject(new Error(e.message));this.onError(new Error(e.message));};
      this.worker.onmessage=({data:msg})=>{
        if(msg.type==='error'){const e=new Error(msg.message);reject(e);this.onError(e);return;}
        if(msg.type!=='state')return;
        this.nodes.forEach((n,i)=>{n.x=msg.positions[i*3];n.y=msg.positions[i*3+1];n.z=msg.positions[i*3+2];n.pinned=!!msg.pins[i];});
        this.metrics=msg.metrics;this.steps=msg.steps;this.jointCount=msg.springs;
        if(msg.initial)resolve();
        if(msg.action==='dragEnded'){this.releasePending=false;this.onRelease?.();}
        this.onUpdate();
      };
    });
    this.worker.postMessage({type:'init',nodes,edges:data.edges,routes:data.routes,attraction:data.attraction,
      settings:{running:false,visible:!document.hidden}});
  }
  configure(settings){this.worker.postMessage({type:'settings',settings});}
  pin(index,pinned){this.nodes[index].pinned=pinned;this.worker.postMessage({type:'pin',index,pinned});}
  startDrag(index){this.dragIndex=index;this.nodes[index].pinned=false;this.worker.postMessage({type:'startDrag',index});}
  moveDrag(target){
    this.pendingTarget={x:target.x,y:target.y,z:target.z};
    if(!this.moveFrame)this.moveFrame=requestAnimationFrame(()=>{this.moveFrame=0;this.flushDrag();});
  }
  flushDrag(){if(this.pendingTarget){this.worker.postMessage({type:'moveDrag',target:this.pendingTarget});this.pendingTarget=null;}}
  endDrag(pin){this.flushDrag();this.dragIndex=undefined;this.releasePending=true;this.worker.postMessage({type:'endDrag',pin});}
  clearance(){return this.metrics;}
  dispose(){cancelAnimationFrame(this.moveFrame);this.worker.terminate();}
}
