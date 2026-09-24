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
    // This is an interactive graph, not an offline rigid-body solve. Four
    // iterations preserve the visible solid contacts while leaving headroom
    // for camera interaction on an ordinary laptop.
    p.numSolverIterations = 4;
    p.normalizedAllowedLinearError = 0.001;
    p.maxCcdSubsteps = 2;
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
    // Thousands of simultaneously moving rigid bodies are neither readable nor
    // responsive in this graph. The rendered set remains complete, but on a
    // large graph a stable representative core moves until a person drags a
    // particular node, at which point that node always becomes fully physical.
    const limitFullSimulation=nodes.length<=600;
    this.mobile=nodes.map(n=>limitFullSimulation||n.tier!=='blue'||hash(n.id+'|mobile')<.1);
    this.mobile.forEach((mobile,i)=>{if(!mobile&&!nodes[i].pinned)this.bodies[i].setBodyType(RAPIER.RigidBodyType.Fixed,false);});
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
    this.pointer=null;
    const strong = new Set(attraction);
    // Keep the visual layer faithful to every original edge, but do not turn
    // every one of 14,520 edges into a per-frame physical spring. A spanning
    // force network keeps each real connected component together (prioritising
    // attraction edges), while Link force and Link distance remain genuinely
    // live and useful rather than making the whole viewer unusable.
    const parents=nodes.map((_,i)=>i);
    const find=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
    const physical=[];
    for(const i of [...attraction,...edges.map((_,i)=>i).filter(i=>!strong.has(i))]) {
      const edge=edges[i],a=this.index.get(edge.from),b=this.index.get(edge.to);
      if(a===undefined||b===undefined||a===b)continue;
      const pa=find(a),pb=find(b);if(pa===pb)continue;
      parents[pa]=pb;physical.push({a,b,strong:strong.has(i)});
    }
    this.links=physical;
    this.jointCount=this.links.length;
    this.drag = null;
    this.time = 0;
    nodes.forEach((n,i) => { if(n.pinned) this.pin(i,true); });
  }
  readPositions() {
    this.bodies.forEach((b,i) => Object.assign(this.nodes[i],b.translation()));
  }
  pin(i, pinned) {
    const body = this.bodies[i];
    this.mobile[i] = !pinned;
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
  setPointer(pointer) {
    this.pointer=pointer&&pointer.active?{...pointer,life:.45,origin:{...pointer.origin},direction:{...pointer.direction}}:null;
  }
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
  applyRepulsion(repulsion,spacing) {
    if(repulsion<=0)return;
    // A spatial hash keeps the force local and predictable: every node only
    // compares itself with nearby cells instead of all 3,520 bodies.
    const range=Math.max(22,(32+repulsion*2)*spacing),cell=range,grid=new Map();
    const key=(x,y,z)=>`${x},${y},${z}`;
    this.nodes.forEach((node,i)=>{
      // Static display nodes are still colliders for a dragged node, but they
      // do not need to spend CPU repelling one another every simulation step.
      if(!this.mobile[i])return;
      const cx=Math.floor(node.x/cell),cy=Math.floor(node.y/cell),cz=Math.floor(node.z/cell);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++) {
        for(const j of grid.get(key(cx+dx,cy+dy,cz+dz))||[]) {
          const other=this.nodes[j],x=node.x-other.x,y=node.y-other.y,z=node.z-other.z;
          let distance=Math.hypot(x,y,z);
          if(distance>=range)continue;
          // Two bodies can start at exactly the same point. A stable hashed
          // direction lets them separate without a random simulation jump.
          let ux=x,uy=y,uz=z;
          if(distance<.001) {
            const angle=hash(node.id+'|'+other.id)*Math.PI*2;ux=Math.cos(angle);uy=Math.sin(angle);uz=Math.sin(angle*.73);distance=1;
          }
          const falloff=1-distance/range,force=repulsion*9*falloff*falloff;
          const length=Math.hypot(ux,uy,uz)||1;
          ux=ux/length*force;uy=uy/length*force;uz=uz/length*force;
          this.bodies[i].addForce({x:ux,y:uy,z:uz},true);
          this.bodies[j].addForce({x:-ux,y:-uy,z:-uz},true);
        }
      }
      const own=key(cx,cy,cz);if(!grid.has(own))grid.set(own,[]);grid.get(own).push(i);
    });
  }
  applyLinkForces(linkForce,linkDistance) {
    if(linkForce<=0)return;
    for(const link of this.links) {
      const a=this.nodes[link.a],b=this.nodes[link.b],x=b.x-a.x,y=b.y-a.y,z=b.z-a.z;
      const distance=Math.hypot(x,y,z)||.001;
      const desired=Math.max(a.radius+b.radius+3,linkDistance*(link.strong?.72:1));
      const degree=Math.sqrt(Math.max(1,(a.degree||0)+1)*Math.max(1,(b.degree||0)+1));
      const raw=(distance-desired)*linkForce*(link.strong?1.5:1)*.5/degree;
      const force=Math.max(-100,Math.min(100,raw));
      const fx=x/distance*force,fy=y/distance*force,fz=z/distance*force;
      if(this.mobile[link.a])this.bodies[link.a].addForce({x:fx,y:fy,z:fz},true);
      if(this.mobile[link.b])this.bodies[link.b].addForce({x:-fx,y:-fy,z:-fz},true);
    }
  }
  applyPointerForce(cursor,spacing,pointerReach) {
    const pointer=this.pointer;if(!pointer||cursor<=0)return;
    pointer.life-=1/60;if(pointer.life<=0){this.pointer=null;return;}
    const range=Math.max(70,170*spacing*pointerReach),{origin,direction}=pointer;
    this.nodes.forEach((node,i)=>{
      if(!this.mobile[i]||this.drag?.index===i)return;
      const ox=node.x-origin.x,oy=node.y-origin.y,oz=node.z-origin.z;
      const along=ox*direction.x+oy*direction.y+oz*direction.z;
      if(along<0)return;
      const px=origin.x+direction.x*along,py=origin.y+direction.y*along,pz=origin.z+direction.z*along;
      let x=node.x-px,y=node.y-py,z=node.z-pz,distance=Math.hypot(x,y,z);
      if(distance>=range)return;
      if(distance<.001){const angle=hash(node.id+'pointer')*Math.PI*2;x=Math.cos(angle);y=Math.sin(angle);z=Math.sin(angle*.61);distance=1;}
      const falloff=1-distance/range,force=cursor*520*falloff*falloff,length=Math.hypot(x,y,z)||1;
      this.bodies[i].addForce({x:x/length*force,y:y/length*force,z:z/length*force},true);
    });
  }
  step({pull = 1, drift = true, animation='depth', speed=1, orbit=1, rebound=.28,
    spacing=1,cohesion=1,repulsion=8,cursor=1.2,pointerReach=1.5,linkForce=.45,linkDistance=75} = {}) {
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
    this.nodes.forEach((n,i) => {if(this.mobile[i])this.bodies[i].resetForces(false);});
    this.applyRepulsion(repulsion,spacing);
    this.applyLinkForces(linkForce,linkDistance);
    this.applyPointerForce(cursor,spacing,pointerReach);
    this.nodes.forEach((n,i) => {
      const body = this.bodies[i];
      if(!this.mobile[i]) return;
      const v = body.linvel();
      let target, gain, damping;
      if(this.drag?.index === i) {
        target = this.drag.target; gain = 625; damping = 47;
      } else {
        const centre=this.followCentres[i],phase=this.phases[i];
        if(centre) {
          const offset=orbitOffset(this.offsets[i],this.time,phase,animation,amount);
          target={x:centre.x+offset.x*spacing,y:centre.y+offset.y*spacing,z:centre.z+offset.z*spacing};
        }else {
          const home=this.home[i],amplitude=amount*(n.tier==='yellow'?8:16);
          target={x:home.x*spacing+amplitude*Math.sin(this.time*.6+phase),
            y:home.y*spacing+amplitude*Math.cos(this.time*.48+phase),
            z:home.z*spacing+amplitude*Math.sin(this.time*.38+phase)};
        }
        gain=(centre?2.5*cohesion:.7)*pull;damping=.72;
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
