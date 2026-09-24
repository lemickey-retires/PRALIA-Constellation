import { gsap } from 'gsap';
import { GraphPhysics, COLLISION_MARGIN, hash } from './rendering/graph-physics.mjs';

// GSAP supplies the per-node reveal. Rapier remains the sole owner of position,
// velocity, contacts and settling, including throughout the entrance.
gsap.ticker.sleep();
export class EntrancePhysics extends GraphPhysics {
  constructor(...args) {
    super(...args);
    this.scales = new Float32Array(this.nodes.length);
    this.links = new Float32Array(this.nodes.length);
    this.entrance = {active:false, elapsed:0, revealed:0, total:0, phase:'waiting'};
    this.enabled = this.nodes.map(()=>true);
  }
  beginEntrance({visible=this.nodes.map(()=>true), reduced=false}={}) {
    if(this.entrance.active)this.finishEntrance();
    this.timeline?.kill();
    this.drag=null;this.time=0;this.motionAmount=0;
    this.targets=this.home.map(p=>({...p}));
    this.originalPins=this.nodes.map(n=>n.pinned);
    this.enabled=this.nodes.map((_,i)=>!!visible[i]);
    this.states=this.nodes.map(()=>({scale:0,link:0}));
    const order=this.nodes.map((n,i)=>i).filter(i=>this.enabled[i])
      .sort((a,b)=>this.nodes[b].degree-this.nodes[a].degree||this.nodes[a].id.localeCompare(this.nodes[b].id));
    this.delays=new Float64Array(this.nodes.length).fill(-1);
    this.colliderRadii=new Float64Array(this.nodes.length).fill(COLLISION_MARGIN);
    const spread=Math.min(5.4,Math.max(.65,order.length*.022));
    order.forEach((i,k)=>{this.delays[i]=order.length>1?k*spread/(order.length-1):0;});
    this.bodies.forEach((body,i)=>{
      super.pin(i,false);this.home[i]={...this.targets[i]};this.nodes[i].pinned=this.originalPins[i];
      body.setEnabled(false);body.resetForces(false);
      const target=this.targets[i],n=this.nodes[i],theta=hash(n.id+'entrance')*Math.PI*2;
      const z=hash(n.id+'rise')*2-1,length=24+hash(n.id+'burst')*40;
      const xy=Math.sqrt(1-z*z);
      body.setTranslation({x:target.x+Math.cos(theta)*xy*length,y:target.y+Math.sin(theta)*xy*length,z:target.z+z*length},false);
      body.collider(0).setRadius(COLLISION_MARGIN);
    });
    this.scales.fill(0);this.links.fill(0);
    this.entrance={active:true,elapsed:0,revealed:0,total:order.length,phase:'revealing'};
    this.timeline=gsap.timeline({paused:true});
    for(const i of order) {
      this.timeline.to(this.states[i],{scale:1,duration:.62,ease:'back.out(1.8)'},this.delays[i]);
      this.timeline.to(this.states[i],{link:1,duration:.42,ease:'power2.out'},this.delays[i]+.22);
    }
    this.duration=this.timeline.duration();gsap.ticker.sleep();
    this.readPositions();
    if(reduced||!order.length)this.finishEntrance(reduced?'reduced':'ready');
  }
  finishEntrance(phase='ready') {
    if(!this.targets)return;
    this.timeline?.kill();this.timeline=null;
    this.bodies.forEach((body,i)=>{
      body.setEnabled(this.enabled[i]);
      body.setTranslation(this.targets[i],true);body.resetForces(false);
      body.collider(0).setRadius(this.nodes[i].radius+COLLISION_MARGIN);
      super.pin(i,this.originalPins[i]);
      this.scales[i]=this.enabled[i]?1:0;this.links[i]=this.scales[i];
    });
    this.readPositions();this.resetFollowers();
    this.entrance={...this.entrance,active:false,revealed:this.entrance.total,phase};
  }
  resetFollowers() {
    this.followCentres.forEach((centre,i)=>{
      if(centre)Object.assign(centre,this.bodies[this.anchors[i]].translation());
    });
  }
  // Interactions take over the existing engine without competing forces.
  pin(i,value) { if(this.entrance?.active)this.finishEntrance();super.pin(i,value); }
  startDrag(i) { if(this.entrance.active)this.finishEntrance();super.startDrag(i); }
  step(settings={}) {
    if(!this.entrance.active){super.step(settings);return;}
    this.entrance.elapsed+=1/60;
    this.timeline.time(Math.min(this.duration,this.entrance.elapsed),false);
    const rebound=settings.rebound??.45;
    if(rebound!==this.rebound){this.rebound=rebound;this.bodies.forEach(body=>body.collider(0).setRestitution(rebound));}
    let revealed=0,maxDistance=0;
    this.bodies.forEach((body,i)=>{
      const state=this.states[i],n=this.nodes[i];
      this.scales[i]=state.scale;this.links[i]=state.link;
      if(!this.enabled[i]||state.scale<=0)return;
      revealed++;
      if(!body.isEnabled()) {
        body.setEnabled(true);
        const pos=body.translation(),target=this.targets[i];
        body.setLinvel({x:(pos.x-target.x)*.65,y:(pos.y-target.y)*.65,z:(pos.z-target.z)*.65},true);
      }
      const radius=n.radius*state.scale+COLLISION_MARGIN;
      if(radius!==this.colliderRadii[i]){body.collider(0).setRadius(radius);this.colliderRadii[i]=radius;}
      const pos=body.translation(),v=body.linvel(),target=this.targets[i];
      maxDistance=Math.max(maxDistance,Math.hypot(pos.x-target.x,pos.y-target.y,pos.z-target.z));
      const force={x:(target.x-pos.x)*52-v.x*11,y:(target.y-pos.y)*52-v.y*11,z:(target.z-pos.z)*52-v.z*11};
      // Two arriving bodies can meet head-on. A small sideways force lets
      // them pass around one another instead of resting on opposite targets.
      if(this.entrance.elapsed-this.delays[i]>1&&Math.hypot(pos.x-target.x,pos.y-target.y,pos.z-target.z)>n.radius*2&&Math.hypot(v.x,v.y,v.z)<5) {
        const dx=target.x-pos.x,dy=target.y-pos.y,dz=target.z-pos.z;
        const tangent={x:-dy+dz*.37,y:dx-dz*.61,z:dy*.61-dx*.37};
        const gain=90/Math.max(.001,Math.hypot(tangent.x,tangent.y,tangent.z));
        force.x+=tangent.x*gain;force.y+=tangent.y*gain;force.z+=tangent.z*gain;
      }
      const mass=body.mass()*Math.min(1,2200/Math.max(.001,Math.hypot(force.x,force.y,force.z)));
      body.resetForces(false);body.addForce({x:force.x*mass,y:force.y*mass,z:force.z*mass},true);
    });
    this.entrance.revealed=revealed;
    this.entrance.phase=this.entrance.elapsed<this.duration?'revealing':'settling';
    this.world.step();this.readPositions();
    const arrived=this.entrance.elapsed>this.duration+.6&&maxDistance<COLLISION_MARGIN*2;
    // Saved targets can compete for the same space. After the full reveal and
    // eight seconds of settling, hand their physical positions back to normal
    // movement instead of running the arrival forces indefinitely.
    const settlingLimit=this.entrance.elapsed>this.duration+8;
    if(arrived||settlingLimit) {
      // Restore exact saved pins only after physical arrival. Free nodes keep
      // their contact-resolved positions and resume the chosen group movement.
      this.timeline.kill();this.timeline=null;
      this.bodies.forEach((body,i)=>{
        body.collider(0).setRadius(this.nodes[i].radius+COLLISION_MARGIN);
        if(this.originalPins[i]) {
          body.setTranslation(this.targets[i],true);
          super.pin(i,true);
        }
      });
      this.readPositions();this.resetFollowers();
      this.entrance.active=false;this.entrance.phase='ready';
      this.entrance.completion=arrived?'arrived':'settling-limit';
    }
  }
  clearance() {
    if(!this.entrance?.active)return super.clearance();
    // Count only visible physical surfaces while their colliders are growing.
    const original=this.nodes;
    try {
      this.nodes=original.flatMap((n,i)=>this.scales[i]>0?[{...n,radius:n.radius*this.scales[i]}]:[]);
      return this.nodes.length?super.clearance():{overlaps:0,maxPenetration:0,nearContacts:0};
    }finally{this.nodes=original;}
  }
  dispose(){this.timeline?.kill();super.dispose();}
}
