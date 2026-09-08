import RAPIER from '@dimforge/rapier3d-compat';
import { orbitOffset } from './graph-motion.mjs';

export const initPhysics = () => RAPIER.init();
export const COLLISION_MARGIN = 0.3;
export function hash(id) {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

export function prepareNodes(data, saved2d = null, saved3d = null) {
  const ranked = [...data.nodes].sort((a,b) => b.degree-a.degree || a.id.localeCompare(b.id));
  const rank = new Map(ranked.map((n,i) => [n.id,i]));
  const positions2d = new Map((saved2d?.nodes || []).map(n => [n.id,n]));
  const positions3d = new Map((saved3d?.nodes || []).map(n => [n.id,n]));
  const finite = p => p && ['x','y','z'].every(k => Number.isFinite(p[k]) && Math.abs(p[k]) < 100000);
  return data.nodes.map(n => {
    const tier = rank.get(n.id) < 18 ? 'yellow' : rank.get(n.id) < 72 ? 'white' : 'blue';
    const r = tier === 'yellow' ? 5 + 2*Math.sqrt(n.degree/ranked[0].degree)
      : tier === 'white' ? 3.4 : 2.3 + Math.min(n.degree/100,0.7);
    const old = positions2d.get(n.id) || n;
    const root = data.routes[n.id]?.root || n.id;
    const z = (hash(root)-0.5)*180 + (hash(n.id+'depth')-0.5)*140;
    const saved = positions3d.get(n.id);
    const position = finite(saved) ? {x:saved.x,y:saved.y,z:saved.z}
      : {x:old.x/12,y:-old.y/12,z};
    return {...n, ...position, radius:r, tier,
      pinned: finite(saved) ? !!saved.pinned : !!old.pinned,
      colour: tier === 'yellow' ? '#ffe08a' : tier === 'white' ? '#f1f7ff'
        : ['#7de3ff','#9baeff','#82bbdf','#b2bbf5'][Math.floor(hash(n.id)*4)]};
  });
}

// Rapier owns integration, solid contacts, restitution, damping, spring joints
// and continuous collision detection. This adapter only supplies graph forces.
export class GraphPhysics {
  constructor(nodes, edges = [], routes = {}, attraction = []) {
    this.nodes = nodes;
    this.index = new Map(nodes.map((n,i) => [n.id,i]));
    this.world = new RAPIER.World({x:0,y:0,z:0});
    const p = this.world.integrationParameters;
    p.dt = 1/60;
    // Extra native contact-solving iterations support the restored orbital
    // forces and fast dragging; verified with the complete moving graph.
    p.numSolverIterations = 12;
    p.normalizedAllowedLinearError = 0.0001;
    p.maxCcdSubsteps = 4;
    this.bodies = nodes.map(n => {
      const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(n.x,n.y,n.z).setLinearDamping(2.6).lockRotations()
        .setCcdEnabled(true));
      this.world.createCollider(RAPIER.ColliderDesc.ball(n.radius + COLLISION_MARGIN)
        .setMass(n.tier === 'yellow' ? 6 : n.tier === 'white' ? 2.5 : 1)
        .setRestitution(0.28).setFriction(0.12), body);
      return body;
    });
    // Start from a contact-resolved layout before any saved pin becomes fixed.
    for(let i=0;i<90;i++) this.world.step();
    this.readPositions();
    for(let extra=0;extra<270 && this.clearance().overlaps;extra+=30) {
      for(let j=0;j<30;j++)this.world.step();
      this.readPositions();
    }
    if(this.clearance().overlaps)throw new Error('Initial collision layout could not settle safely.');
    this.home = nodes.map(n => ({x:n.x,y:n.y,z:n.z}));
    this.anchors = nodes.map(n => this.index.get(routes[n.id]?.anchor) ?? -1);
    this.offsets = nodes.map((n,i) => {
      const a = nodes[this.anchors[i]];
      return a ? {x:n.x-a.x,y:n.y-a.y,z:n.z-a.z} : {x:0,y:0,z:0};
    });
    this.phases=nodes.map((n,i)=>i*2.399);
    this.followCentres=nodes.map((n,i)=>{
      const anchor=nodes[this.anchors[i]];
      return anchor ? {x:anchor.x,y:anchor.y,z:anchor.z} : null;
    });
    this.followLags=nodes.map((n,i)=>{
      const offset=this.offsets[i],angle=Math.atan2(offset.y,offset.x);
      const wave=(1+Math.sin(angle*1.7+(this.phases[this.anchors[i]]||0)*.12))/2;
      return .12+Math.min(routes[n.id]?.hops||0,6)/6*.2+wave*.42;
    });
    this.rebound=.28;
    const strong = new Set(attraction);
    // One real path between connected nodes is enough to hold each component
    // together. Keep every original edge for viewing; avoid thousands of
    // redundant physical spring constraints on the same connected component.
    const parents = nodes.map((_,i)=>i);
    const find = i => {while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
    const physicalEdges = [];
    for(const i of [...attraction,...edges.map((_,i)=>i).filter(i=>!strong.has(i))]) {
      const e=edges[i],a=this.index.get(e.from),b=this.index.get(e.to);
      if(a===undefined||b===undefined)continue;
      const pa=find(a),pb=find(b);if(pa===pb)continue;
      parents[pa]=pb;physicalEdges.push(i);
    }
    this.jointCount = 0;
    for(const i of physicalEdges) {
      const e = edges[i], ai = this.index.get(e.from), bi = this.index.get(e.to);
      if(ai === undefined || bi === undefined || ai === bi) continue;
      const a=nodes[ai],b=nodes[bi];
      const rest = Math.max(a.radius+b.radius+2,Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z));
      const joint = this.world.createImpulseJoint(
        RAPIER.JointData.spring(rest,strong.has(i)?0.16:0.04,0.025,
          {x:0,y:0,z:0},{x:0,y:0,z:0}),this.bodies[ai],this.bodies[bi],true);
      joint.setContactsEnabled(true);
      this.jointCount++;
    }
    this.drag = null;
    this.time = 0;
    nodes.forEach((n,i) => { if(n.pinned) this.pin(i,true); });
  }
  readPositions() {
    this.bodies.forEach((b,i) => Object.assign(this.nodes[i],b.translation()));
  }
  pin(i, pinned) {
    const body = this.bodies[i];
    body.setBodyType(pinned ? RAPIER.RigidBodyType.Fixed : RAPIER.RigidBodyType.Dynamic,true);
    body.setLinvel({x:0,y:0,z:0},true);
    this.nodes[i].pinned = pinned;
    this.home[i] = {...body.translation()};
  }
  startDrag(i) {
    this.pin(i,false);
    this.drag = {index:i,target:{...this.bodies[i].translation()}};
  }
  moveDrag(target) { if(this.drag) this.drag.target = {...target}; }
  endDrag(pin = true) {
    if(!this.drag) return;
    // Let the physical body finish the last short pointer movement before
    // pinning. A blocked drop times out at its resolved contact position.
    this.drag.release={pin,steps:0};
  }
  finishDrag() {
    if(!this.drag)return;
    const i = this.drag.index;
    const pinned=this.drag.release.pin;
    this.drag = null;
    // Pin the contact-resolved position, never teleport to the pointer target.
    this.pin(i,pinned);
  }
  step({pull = 1, drift = true, animation='depth', speed=1, orbit=1, rebound=.28} = {}) {
    this.readPositions();
    if(drift) {this.time += speed/60;this.motionAmount=orbit;}
    const amount=this.motionAmount??0;
    if(rebound!==this.rebound) {
      this.rebound=rebound;
      this.bodies.forEach(b=>b.collider(0).setRestitution(rebound));
    }
    this.followCentres.forEach((centre,i)=>{
      if(!centre)return;
      const a=this.nodes[this.anchors[i]],blend=1-Math.exp(-1/60/this.followLags[i]);
      centre.x+=(a.x-centre.x)*blend;centre.y+=(a.y-centre.y)*blend;centre.z+=(a.z-centre.z)*blend;
    });
    this.nodes.forEach((n,i) => {
      const body = this.bodies[i];
      if(n.pinned) return;
      body.resetForces(false);
      const v = body.linvel();
      let target, gain, damping;
      if(this.drag?.index === i) {
        target = this.drag.target; gain = 625; damping = 47;
      } else {
        const centre=this.followCentres[i],phase=this.phases[i];
        if(centre) {
          const offset=orbitOffset(this.offsets[i],this.time,phase,animation,amount);
          target={x:centre.x+offset.x,y:centre.y+offset.y,z:centre.z+offset.z};
        }else {
          const home=this.home[i],amplitude=amount*(n.tier==='yellow'?5:11);
          target={x:home.x+amplitude*Math.sin(this.time*.6+phase),
            y:home.y+amplitude*Math.cos(this.time*.48+phase),
            z:home.z+amplitude*Math.sin(this.time*.38+phase)};
        }
        gain=(centre?1.6:.3)*pull;damping=.6;
      }
      let fx=(target.x-n.x)*gain-v.x*damping,
        fy=(target.y-n.y)*gain-v.y*damping,
        fz=(target.z-n.z)*gain-v.z*damping;
      const maxAcceleration = this.drag?.index === i ? 9000 : 100;
      const scale = Math.min(1,maxAcceleration/Math.max(0.001,Math.hypot(fx,fy,fz))) * body.mass();
      body.addForce({x:fx*scale,y:fy*scale,z:fz*scale},true);
    });
    this.world.step();
    this.readPositions();
    if(this.drag?.release) {
      const n=this.nodes[this.drag.index],t=this.drag.target,release=this.drag.release;
      release.steps++;
      if(Math.hypot(n.x-t.x,n.y-t.y,n.z-t.z)<.12||release.steps>=20)this.finishDrag();
    }
  }
  clearance() {
    const cell = Math.max(...this.nodes.map(n => n.radius))*2 + 1;
    const bins = new Map();
    let overlaps=0,maxPenetration=0,nearContacts=0;
    for(const n of this.nodes) {
      const x=Math.floor(n.x/cell),y=Math.floor(n.y/cell),z=Math.floor(n.z/cell);
      for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) for(let dz=-1;dz<=1;dz++) {
        for(const other of bins.get(`${x+dx},${y+dy},${z+dz}`) || []) {
          const distance=Math.hypot(n.x-other.x,n.y-other.y,n.z-other.z);
          const penetration=n.radius+other.radius-distance;
          if(penetration>0.001) { overlaps++;maxPenetration=Math.max(maxPenetration,penetration); }
          if(distance<n.radius+other.radius+COLLISION_MARGIN*2+0.12) nearContacts++;
        }
      }
      const key=`${x},${y},${z}`;
      if(!bins.has(key)) bins.set(key,[]);
      bins.get(key).push(n);
    }
    return {overlaps,maxPenetration,nearContacts};
  }
  dispose() { this.world.free(); }
}
