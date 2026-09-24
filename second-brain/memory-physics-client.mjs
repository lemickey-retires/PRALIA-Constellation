import { WorkerPhysics } from './rendering/graph-physics-client.mjs';
import {PositionSmoother} from './position-smoother.mjs';

export class MemoryPhysics extends WorkerPhysics {
  constructor(...args) {
    super(...args);
    this.scales=new Float32Array(this.nodes.length);
    this.linkProgress=new Float32Array(this.nodes.length);
    this.entrance={active:true,phase:'waiting',revealed:0,total:this.nodes.length};
    this.cycle=0;this.skipWaiters=[];
    this.smoother=new PositionSmoother(this.nodes);
    const receive=this.worker.onmessage;
    this.worker.onmessage=event=>{
      const msg=event.data;
      if(msg.type==='state'&&(msg.cycle??0)<this.cycle)return;
      if(msg.type==='state') {
        this.smoother.receive(msg.positions,performance.now(),msg.initial||!!msg.action);
        this.scales=msg.scales;this.linkProgress=msg.linkProgress;this.entrance=msg.entrance;
      }
      receive(event);
      if(msg.type==='state'&&!msg.initial&&!msg.action)this.smoother.sample(performance.now(),this.dragIndex);
      if(msg.type==='state'&&msg.action==='finishEntrance')
        this.skipWaiters.splice(0).forEach(resolve=>resolve(true));
      if(msg.type==='error')this.skipWaiters.splice(0).forEach(resolve=>resolve(false));
    };
  }
  sample(now){return this.smoother.sample(now,this.dragIndex);}
  replay(options) {
    this.skipWaiters.splice(0).forEach(resolve=>resolve(false));
    this.cycle++;
    this.scales.fill(0);this.linkProgress.fill(0);
    this.entrance={active:true,phase:'waiting',revealed:0,total:options.visible.filter(Boolean).length};
    this.worker.postMessage({type:'entrance',cycle:this.cycle,...options});this.onUpdate();
  }
  skip(){
    if(!this.entrance.active)return Promise.resolve(true);
    const finished=new Promise(resolve=>this.skipWaiters.push(resolve));
    this.worker.postMessage({type:'finishEntrance'});return finished;
  }
  dispose(){this.skipWaiters.splice(0).forEach(resolve=>resolve(false));super.dispose();}
}
