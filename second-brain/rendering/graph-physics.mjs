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
    // Interactive contact solving must leave frame headroom. Fast dragged
    // bodies opt into CCD below; ordinary slow orbital bodies do not pay for it.
    p.numSolverIterations = 4;
    p.normalizedAllowedLinearError = 0.001;
    p.maxCcdSubsteps = 2;
    this.bodies = nodes.map(n => {
      const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(n.x,n.y,n.z).setLinearDamping(2.6).lockRotations()
        .setCcdEnabled(false));
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
    // The full 1,057 records remain rendered and pickable. Keep hubs plus a
    // stable sample of leaf nodes continuously physical; cursor/drag contact
    // promotes nearby leaves temporarily so every star can still respond.
    const full=nodes.length<=600;
    this.baseMobile=nodes.map(n=>full||n.tier!=='blue'||hash(n.id+'|mobile')<.14);
    this.mobile=this.baseMobile.slice();this.interactionLife=new Float32Array(nodes.length);
    this.mobile.forEach((moving,i)=>{if(!moving&&!nodes[i].pinned)this.bodies[i].setBodyType(RAPIER.RigidBodyType.Fixed,false);});
    this.home = nodes.map(n => ({x:n.x,y:n.y,z:n.z}));
    this.groups=new Map();
    nodes.forEach((n,i)=>{if(n.sourceGroup){if(!this.groups.has(n.sourceGroup))this.groups.set(n.sourceGroup,[]);this.groups.get(n.sourceGroup).push(i);}});
    this.groupRadii=new Map([...this.groups].map(([id,members])=>{
      const centre=members.reduce((c,i)=>({x:c.x+nodes[i].x/members.length,y:c.y+nodes[i].y/members.length,z:c.z+nodes[i].z/members.length}),{x:0,y:0,z:0});
      const distances=members.map(i=>Math.hypot(nodes[i].x-centre.x,nodes[i].y-centre.y,nodes[i].z-centre.z)).sort((a,b)=>a-b);
      return [id,(distances[Math.floor((distances.length-1)*.78)]||1)+18];
    }));
    this.groupParents=new Map([...this.groups].map(([id,members])=>{
      const centre=members.reduce((c,i)=>({x:c.x+nodes[i].x/members.length,y:c.y+nodes[i].y/members.length,z:c.z+nodes[i].z/members.length}),{x:0,y:0,z:0});
      const radius=Math.max(12,(this.groupRadii.get(id)||30)-18),phase=hash(id+'|parent-sphere')*Math.PI*2;
      const sphereOffsets=new Map(members.map((i,k)=>{
        const vertical=1-2*(k+.5)/members.length,span=Math.sqrt(Math.max(0,1-vertical*vertical)),angle=k*2.39996323+phase;
        const shell=.28+.72*Math.cbrt(hash(nodes[i].id+'|parent-shell')),distance=radius*shell;
        return [i,{x:Math.cos(angle)*span*distance,y:vertical*distance,z:Math.sin(angle)*span*distance}];
      }));
      return [id,{id,members,position:{...centre},home:{...centre},velocity:{x:0,y:0,z:0},mass:Math.max(18,Math.sqrt(members.length)*4),
        order:new Map(members.map((i,k)=>[i,k])),offsets:sphereOffsets,
        rest:new Map(members.map(i=>{const o=sphereOffsets.get(i);return[i,Math.max(4,Math.hypot(o.x,o.y,o.z))];}))}];
    }));
    this.layoutCentre=this.home.reduce((c,n)=>({x:c.x+n.x/nodes.length,y:c.y+n.y/nodes.length,z:c.z+n.z/nodes.length}),{x:0,y:0,z:0});
    this.sceneBounds=this.home.reduce((box,n)=>({min:{x:Math.min(box.min.x,n.x),y:Math.min(box.min.y,n.y),z:Math.min(box.min.z,n.z)},
      max:{x:Math.max(box.max.x,n.x),y:Math.max(box.max.y,n.y),z:Math.max(box.max.z,n.z)}}),
      {min:{x:Infinity,y:Infinity,z:Infinity},max:{x:-Infinity,y:-Infinity,z:-Infinity}});
    this.sceneRadius=Math.max(1,...this.home.map(n=>Math.hypot(n.x-this.layoutCentre.x,n.y-this.layoutCentre.y,n.z-this.layoutCentre.z)));
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
    this.rebound=.28;this.pointer=null;
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
      parents[pa]=pb;physicalEdges.push({a,b,strong:strong.has(i)});
    }
    this.forceLinks=physicalEdges;
    this.jointCount=this.forceLinks.length;
    this.drag = null;
    this.time = 0;
    nodes.forEach((n,i) => { if(n.pinned) this.pin(i,true); });
  }
  readPositions() {
    this.bodies.forEach((b,i) => Object.assign(this.nodes[i],b.translation()));
  }
  setMobileState(i,moving) {
    this.mobile[i]=moving;
    this.bodies[i].setBodyType(moving?RAPIER.RigidBodyType.Dynamic:RAPIER.RigidBodyType.Fixed,true);
  }
  setPinnedState(i,pinned) {
    const body = this.bodies[i];
    this.mobile[i]=!pinned;
    body.setBodyType(pinned ? RAPIER.RigidBodyType.Fixed : RAPIER.RigidBodyType.Dynamic,true);
    body.enableCcd(false);
    body.setLinvel({x:0,y:0,z:0},true);
    this.nodes[i].pinned = pinned;
    this.home[i] = {...body.translation()};
  }
  pin(i,pinned){this.setPinnedState(i,pinned);}
  clampToScene(target,padding=36){
    const c=this.layoutCentre,r=this.sceneRadius+padding,dx=target.x-c.x,dy=target.y-c.y,dz=target.z-c.z,d=Math.hypot(dx,dy,dz);
    if(d<=r)return {...target};const scale=r/d;return{x:c.x+dx*scale,y:c.y+dy*scale,z:c.z+dz*scale};
  }
  startDrag(i) {
    this.setPinnedState(i,false);
    this.bodies[i].enableCcd(true);this.interactionLife[i]=3;
    this.drag = {index:i,target:{...this.bodies[i].translation()}};
    // A graph grab should feel like tugging a small connected structure, not
    // moving one bead through frozen scenery. Wake a bounded set of immediate
    // neighbours; force links and collisions then transmit the motion.
    let promoted=0;
    for(const link of this.forceLinks){
      const neighbour=link.a===i?link.b:link.b===i?link.a:-1;
      if(neighbour>=0&&this.activate(neighbour,3)&&++promoted>=24)break;
    }
  }
  moveDrag(target) { if(this.drag) this.drag.target = this.clampToScene(target); }
  setPointer(pointer){this.pointer=pointer?{...pointer,life:.45,origin:{...pointer.origin},direction:{...pointer.direction}}:null;}
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
    const velocity={...this.bodies[i].linvel()};
    this.drag = null;
    // Pin the contact-resolved position, never teleport to the pointer target.
    this.setPinnedState(i,pinned);
    // A free drop keeps its contact-resolved momentum. Pinned drops retain
    // their existing precise placement behaviour.
    if(!pinned)this.bodies[i].setLinvel(velocity,true);
    this.bodies[i].enableCcd(false);
  }
  startGroupDrag(indices,handleCentre,groupId,collisionProxies=[]){
    const members=[...new Set(indices)].filter(i=>Number.isInteger(i)&&i>=0&&i<this.nodes.length);
    if(!members.length)return;
    const average=members.reduce((c,i)=>({x:c.x+this.nodes[i].x/members.length,y:c.y+this.nodes[i].y/members.length,z:c.z+this.nodes[i].z/members.length}),{x:0,y:0,z:0});
    const centre=handleCentre&&['x','y','z'].every(k=>Number.isFinite(handleCentre[k]))?this.clampToScene(handleCentre,0):average;
    const originalPins=new Map(members.map(i=>[i,this.nodes[i].pinned]));
    for(const i of members){
      if(this.nodes[i].pinned)this.nodes[i].pinned=false;
      this.activate(i,8);this.bodies[i].enableCcd(false);
    }
    const memberSet=new Set(members),external=[];
    for(const link of this.forceLinks){
      const insideA=memberSet.has(link.a),insideB=memberSet.has(link.b);
      if(insideA!==insideB)external.push(insideA?link.b:link.a);
    }
    for(const i of [...new Set(external)].slice(0,24))this.activate(i,3);
    const resolvedGroup=groupId||this.nodes[members[0]]?.sourceGroup;
    const parent=this.groupParents.get(resolvedGroup)||{id:resolvedGroup,members,position:{...centre},home:{...centre},velocity:{x:0,y:0,z:0},
      rest:new Map(members.map(i=>[i,Math.max(4,Math.hypot(this.nodes[i].x-centre.x,this.nodes[i].y-centre.y,this.nodes[i].z-centre.z))]))};
    parent.position={...centre};parent.velocity={x:0,y:0,z:0};
    const proxyMap=new Map(collisionProxies.map(proxy=>{
      const other=this.groupParents.get(proxy.id);
      return [proxy.id,{radius:proxy.radius,offset:{x:proxy.x-(other?.position.x||0),y:proxy.y-(other?.position.y||0),z:proxy.z-(other?.position.z||0)}}];
    }));
    this.groupDrag={members,memberSet,groupId:resolvedGroup,parent,originalPins,centre,target:{...centre},previousTarget:{...centre},handleVelocity:{x:0,y:0,z:0},lastMove:performance.now(),collisionProxies:proxyMap,hitGroups:new Set()};
  }
  moveGroupDrag(target){
    const g=this.groupDrag;if(!g)return;
    const next=this.clampToScene(target,0),now=performance.now(),dt=Math.max(.008,Math.min(.08,(now-g.lastMove)/1000));
    const raw={x:(next.x-g.previousTarget.x)/dt,y:(next.y-g.previousTarget.y)/dt,z:(next.z-g.previousTarget.z)/dt};
    const speed=Math.hypot(raw.x,raw.y,raw.z),limit=Math.min(1,1400/Math.max(.001,speed));
    raw.x*=limit;raw.y*=limit;raw.z*=limit;
    g.handleVelocity.x=g.handleVelocity.x*.35+raw.x*.65;g.handleVelocity.y=g.handleVelocity.y*.35+raw.y*.65;g.handleVelocity.z=g.handleVelocity.z*.35+raw.z*.65;
    g.previousTarget={...next};g.target=next;g.lastMove=now;
  }
  applyGroupDrag(){
    const g=this.groupDrag;if(!g)return;
    const parent=g.parent;
    // Preserve the full handle path for continuous group-envelope collision.
    // A pointer can cross an entire neighbouring cluster between 60 Hz steps;
    // testing only the two endpoints lets that motion tunnel straight through.
    g.stepFrom={...parent.position};g.stepTo={...g.target};
    parent.position={...g.target};parent.velocity={...g.handleVelocity};
    for(const i of g.members){
      const body=this.bodies[i],p=body.translation(),v=body.linvel(),offset=parent.offsets?.get(i);
      const target=offset?{x:parent.position.x+offset.x,y:parent.position.y+offset.y,z:parent.position.z+offset.z}:parent.position;
      const dx=target.x-p.x,dy=target.y-p.y,dz=target.z-p.z;
      // Pull each record toward its own attachment point, not merely toward a
      // shared radius. Slightly varied stiffness gives nearby branches a
      // natural follow-through while the constellation keeps its node-made
      // volume during a fast group tug.
      const branch=hash(this.nodes[i].id+'|branch-flex'),gain=54+branch*34,damping=8.5+branch*4.5;
      let fx=dx*gain+(parent.velocity.x-v.x)*damping,fy=dy*gain+(parent.velocity.y-v.y)*damping,fz=dz*gain+(parent.velocity.z-v.z)*damping;
      const acceleration=Math.hypot(fx,fy,fz),limit=Math.min(1,3200/Math.max(.001,acceleration)),mass=body.mass();
      fx*=limit;fy*=limit;fz*=limit;body.addForce({x:fx*mass,y:fy*mass,z:fz*mass},true);
    }
    g.handleVelocity.x*=.82;g.handleVelocity.y*=.82;g.handleVelocity.z*=.82;
  }
  applyGroupCollisions(){
    if(this.groups.size<2)return;
    const states=[...this.groups].map(([id,members])=>{
      const parent=this.groupParents.get(id),centre=parent?.position||members.reduce((c,i)=>({x:c.x+this.nodes[i].x/members.length,y:c.y+this.nodes[i].y/members.length,z:c.z+this.nodes[i].z/members.length}),{x:0,y:0,z:0});
      const velocity=parent?.velocity||members.reduce((v,i)=>{const q=this.bodies[i].linvel();v.x+=q.x/members.length;v.y+=q.y/members.length;v.z+=q.z/members.length;return v;},{x:0,y:0,z:0});
      return {id,members,parent,centre,velocity,radius:this.groupRadii.get(id)||1};
    });
    this.resolveGroupSweep(states);
    for(let a=0;a<states.length;a++)for(let b=a+1;b<states.length;b++){
      const A=states[a],B=states[b],dx=A.centre.x-B.centre.x,dy=A.centre.y-B.centre.y,dz=A.centre.z-B.centre.z;
      const distance=Math.hypot(dx,dy,dz)||.001,minDistance=A.radius+B.radius,penetration=minDistance-distance;
      if(penetration<=0)continue;
      const involvesDrag=this.groupDrag&&(A.id===this.groupDrag.groupId||B.id===this.groupDrag.groupId);
      const moving=Math.hypot(A.velocity.x,A.velocity.y,A.velocity.z)>2||Math.hypot(B.velocity.x,B.velocity.y,B.velocity.z)>2;
      if(!involvesDrag&&!moving)continue;
      if(involvesDrag){
        const other=A.id===this.groupDrag.groupId?B:A;
        this.activateContactMembers(other,3);
      }
      const nx=dx/distance,ny=dy/distance,nz=dz/distance;
      const closing=Math.max(0,-((A.velocity.x-B.velocity.x)*nx+(A.velocity.y-B.velocity.y)*ny+(A.velocity.z-B.velocity.z)*nz));
      const acceleration=Math.min(650,penetration*5+closing*1.5);
      if(A.parent){A.parent.velocity.x+=nx*acceleration*.08;A.parent.velocity.y+=ny*acceleration*.08;A.parent.velocity.z+=nz*acceleration*.08;}
      if(B.parent){B.parent.velocity.x-=nx*acceleration*.08;B.parent.velocity.y-=ny*acceleration*.08;B.parent.velocity.z-=nz*acceleration*.08;}
      for(const [group,sign] of [[A,1],[B,-1]])for(const i of group.members){
        if(!this.mobile[i])continue;
        const n=this.nodes[i],face=(sign*(n.x-group.centre.x)*nx+sign*(n.y-group.centre.y)*ny+sign*(n.z-group.centre.z)*nz)/group.radius;
        const weight=.85+Math.max(0,face)*.2,mass=this.bodies[i].mass();
        this.bodies[i].addForce({x:nx*sign*acceleration*weight*mass,y:ny*sign*acceleration*weight*mass,z:nz*sign*acceleration*weight*mass},true);
      }
    }
  }
  resolveGroupSweep(states){
    const g=this.groupDrag,from=g?.stepFrom,to=g?.stepTo;if(!g||!from||!to)return;
    const dragged=states.find(state=>state.id===g.groupId);if(!dragged?.parent)return;
    const sx=to.x-from.x,sy=to.y-from.y,sz=to.z-from.z,a=sx*sx+sy*sy+sz*sz;if(a<.0001)return;
    let hit=null;
    for(const other of states){
      if(other===dragged||!other.parent)continue;
      const proxy=g.collisionProxies?.get(other.id),collisionCentre=proxy?{x:other.centre.x+proxy.offset.x,y:other.centre.y+proxy.offset.y,z:other.centre.z+proxy.offset.z}:other.centre;
      const radius=dragged.radius+(proxy?.radius||other.radius),mx=from.x-collisionCentre.x,my=from.y-collisionCentre.y,mz=from.z-collisionCentre.z;
      const c=mx*mx+my*my+mz*mz-radius*radius,b=2*(mx*sx+my*sy+mz*sz);
      let t;
      if(c<=0){
        const distance=Math.hypot(mx,my,mz)||1,nx=mx/distance,ny=my/distance,nz=mz/distance;
        if(sx*nx+sy*ny+sz*nz>=0)continue;
        t=0;
      }else{
        const discriminant=b*b-4*a*c;if(discriminant<0)continue;
        t=(-b-Math.sqrt(discriminant))/(2*a);if(t<0||t>1)continue;
      }
      if(!hit||t<hit.t)hit={other,t,radius,collisionCentre};
    }
    if(!hit)return;
    const {other,t,radius,collisionCentre}=hit,contact={x:from.x+sx*t,y:from.y+sy*t,z:from.z+sz*t};
    let nx=contact.x-collisionCentre.x,ny=contact.y-collisionCentre.y,nz=contact.z-collisionCentre.z,nl=Math.hypot(nx,ny,nz);
    if(nl<.001){const travel=Math.sqrt(a);nx=-sx/travel;ny=-sy/travel;nz=-sz/travel;nl=1;}else{nx/=nl;ny/=nl;nz/=nl;}
    const incoming={...g.handleVelocity},normalSpeed=incoming.x*nx+incoming.y*ny+incoming.z*nz,firstImpact=!g.hitGroups.has(other.id);
    const impactSpeed=Math.max(0,-normalSpeed),impulse=firstImpact?Math.min(320,Math.max(70,impactSpeed*.42)):0;
    g.hitGroups.add(other.id);
    this.activateContactMembers(other,3);
    const push=firstImpact?Math.min(6,Math.max(1.5,impactSpeed/220)):0;
    other.parent.position.x-=nx*push;other.parent.position.y-=ny*push;other.parent.position.z-=nz*push;
    other.parent.velocity.x-=nx*impulse;other.parent.velocity.y-=ny*impulse;other.parent.velocity.z-=nz*impulse;
    // Resolve to the contact surface, not the far-side pointer endpoint. This
    // is the actual non-penetration constraint that makes two source spheres
    // collide instead of merely playing a displacement effect after crossing.
    dragged.parent.position.x=collisionCentre.x-nx*push+nx*(radius+.35);
    dragged.parent.position.y=collisionCentre.y-ny*push+ny*(radius+.35);
    dragged.parent.position.z=collisionCentre.z-nz*push+nz*(radius+.35);
    if(normalSpeed<0){
      // The first contact bounces. Further pointer packets in the same held
      // gesture keep the surface constraint but cannot stack another kick.
      const restitution=firstImpact?.58:0;
      dragged.parent.velocity.x=incoming.x-(1+restitution)*normalSpeed*nx;
      dragged.parent.velocity.y=incoming.y-(1+restitution)*normalSpeed*ny;
      dragged.parent.velocity.z=incoming.z-(1+restitution)*normalSpeed*nz;
    }
    g.target={...dragged.parent.position};g.stepTo={...dragged.parent.position};g.handleVelocity={...dragged.parent.velocity};
    if(firstImpact)for(const i of other.members){
      if(!this.mobile[i])continue;
      const mass=this.bodies[i].mass(),weight=.75+hash(this.nodes[i].id+'|sweep')*.5;
      this.bodies[i].addForce({x:-nx*impulse*weight*mass,y:-ny*impulse*weight*mass,z:-nz*impulse*weight*mass},true);
    }
  }
  applyGroupParents(cohesion,pull,formation='sphere'){
    for(const parent of this.groupParents.values()){
      if(this.groupDrag?.groupId===parent.id)continue;
      // The source parent is a body with momentum, not a cursor handle tied to
      // its authored coordinate. A very soft home spring prevents permanent
      // drift while allowing throws and collisions to breathe for many seconds.
      const dt=1/60,homeForce=.035;
      parent.velocity.x+=(parent.home.x-parent.position.x)*homeForce*dt;parent.velocity.y+=(parent.home.y-parent.position.y)*homeForce*dt;parent.velocity.z+=(parent.home.z-parent.position.z)*homeForce*dt;
      parent.velocity.x*=.995;parent.velocity.y*=.995;parent.velocity.z*=.995;
      parent.position.x+=parent.velocity.x*dt;parent.position.y+=parent.velocity.y*dt;parent.position.z+=parent.velocity.z*dt;
      parent.position=this.clampToScene(parent.position,0);
      let reactionX=0,reactionY=0,reactionZ=0,reactionCount=0;
      for(const i of parent.members){
        if(!this.mobile[i]||this.nodes[i].pinned)continue;
        const body=this.bodies[i],p=body.translation(),v=body.linvel(),k=parent.order.get(i)||0,base=parent.offsets.get(i),radius=this.groupRadii.get(parent.id)||40;let target;
        if(formation==='sphere'){
          target={x:parent.position.x+base.x,y:parent.position.y+base.y,z:parent.position.z+base.z};
        }else if(formation==='fluid'){
          const wave=1+.16*Math.sin(this.time*.9+k*.37),twist=.18*Math.sin(this.time*.55+k*.11),cs=Math.cos(twist),sn=Math.sin(twist);
          target={x:parent.position.x+(base.x*cs-base.z*sn)*wave,y:parent.position.y+base.y*(1+.1*Math.cos(this.time+k*.19)),z:parent.position.z+(base.x*sn+base.z*cs)*wave};
        }else{
          const pair=Math.floor(k/2),pairs=Math.max(2,Math.ceil(parent.members.length/2)),angle=pair*.55+(k%2)*Math.PI+this.time*.18,r=Math.max(10,radius*.32);
          target={x:parent.position.x+Math.cos(angle)*r,y:parent.position.y+(pair/(pairs-1)-.5)*radius*1.55,z:parent.position.z+Math.sin(angle)*r};
        }
        const gain=(formation==='dna'?2.4:formation==='fluid'?1.8:2.15)*cohesion*pull;
        let fx=(target.x-p.x)*gain-(v.x-parent.velocity.x)*.68,fy=(target.y-p.y)*gain-(v.y-parent.velocity.y)*.68,fz=(target.z-p.z)*gain-(v.z-parent.velocity.z)*.68;
        const scale=Math.min(1,150/Math.max(.001,Math.hypot(fx,fy,fz))),mass=body.mass();fx*=scale;fy*=scale;fz*=scale;
        body.addForce({x:fx*mass,y:fy*mass,z:fz*mass},true);reactionX-=fx;reactionY-=fy;reactionZ-=fz;reactionCount++;
      }
      if(reactionCount){const back=.12/reactionCount;parent.velocity.x+=reactionX*back*dt;parent.velocity.y+=reactionY*back*dt;parent.velocity.z+=reactionZ*back*dt;}
    }
  }
  applySceneBounds(){
    const padding=28,c=this.layoutCentre,r=this.sceneRadius+padding;
    for(let i=0;i<this.nodes.length;i++){
      if(!this.mobile[i])continue;
      const n=this.nodes[i],v=this.bodies[i].linvel(),dx=n.x-c.x,dy=n.y-c.y,dz=n.z-c.z,distance=Math.hypot(dx,dy,dz);if(distance<=r)continue;
      const penetration=distance-r,nx=dx/distance,ny=dy/distance,nz=dz/distance,outward=v.x*nx+v.y*ny+v.z*nz;
      const strength=penetration*22+Math.max(0,outward)*7,force={x:-nx*strength,y:-ny*strength,z:-nz*strength};
      const length=Math.hypot(force.x,force.y,force.z);
      const mass=this.bodies[i].mass()*Math.min(1,1500/length);
      this.bodies[i].addForce({x:force.x*mass,y:force.y*mass,z:force.z*mass},true);
    }
  }
  endGroupDrag(){
    const g=this.groupDrag;if(!g)return;
    if(g.releaseSteps!==undefined)return;
    // Mouse-up is not the end of a fast pull. Keep the invisible handle alive
    // while the elastic branches finish sweeping into place.
    g.releaseSteps=0;
  }
  finishPendingGroup(){
    const g=this.groupDrag;if(!g||g.releaseSteps===undefined)return false;
    g.releaseSteps++;if(g.releaseSteps<2)return false;
    if(g.parent){g.parent.position={...g.target};g.parent.velocity={x:g.handleVelocity.x*.82,y:g.handleVelocity.y*.82,z:g.handleVelocity.z*.82};}
    for(const i of g.members){
      this.interactionLife[i]=8;
    }
    for(const i of g.members)if(g.originalPins.get(i))this.setPinnedState(i,true);
    this.groupDrag=null;this.readPositions();this.resetFollowers?.();return true;
  }
  activate(i,life=1.2){
    if(this.nodes[i].pinned)return false;
    if(!this.mobile[i]){this.mobile[i]=true;this.bodies[i].setBodyType(RAPIER.RigidBodyType.Dynamic,true);}
    this.interactionLife[i]=Math.max(this.interactionLife[i],life);return true;
  }
  activateContactMembers(group,life=3,limit=96){
    // The virtual parent moves the complete visible sphere. A distributed
    // physical sample supplies local squash and rebound without turning all
    // 486 mirror leaves into expensive rigid bodies for one collision.
    const members=group.members||[];
    if(members.length<=limit){for(const i of members)this.activate(i,life);return;}
    for(let k=0;k<limit;k++)this.activate(members[Math.floor(k*members.length/limit)],life);
  }
  applyRepulsion(repulsion,spacing){
    if(repulsion<=0)return;
    const range=Math.max(22,(32+repulsion*2)*spacing),grid=new Map(),key=(x,y,z)=>`${x},${y},${z}`;
    this.nodes.forEach((node,i)=>{
      if(!this.mobile[i]||(this.scales&&this.scales[i]<=.15))return;
      const cx=Math.floor(node.x/range),cy=Math.floor(node.y/range),cz=Math.floor(node.z/range);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)for(const j of grid.get(key(cx+dx,cy+dy,cz+dz))||[]){
        const other=this.nodes[j];let x=node.x-other.x,y=node.y-other.y,z=node.z-other.z,distance=Math.hypot(x,y,z);
        if(distance>=range)continue;
        if(distance<.001){const angle=hash(node.id+'|'+other.id)*Math.PI*2;x=Math.cos(angle);y=Math.sin(angle);z=Math.sin(angle*.73);distance=1;}
        const falloff=1-distance/range,force=repulsion*9*falloff*falloff,length=Math.hypot(x,y,z)||1;
        x=x/length*force;y=y/length*force;z=z/length*force;
        this.bodies[i].addForce({x,y,z},true);this.bodies[j].addForce({x:-x,y:-y,z:-z},true);
      }
      const own=key(cx,cy,cz);if(!grid.has(own))grid.set(own,[]);grid.get(own).push(i);
    });
  }
  applyLinkForces(linkForce,linkDistance){
    if(linkForce<=0)return;
    for(const link of this.forceLinks){
      if(this.scales&&(this.scales[link.a]<=.15||this.scales[link.b]<=.15))continue;
      const a=this.nodes[link.a],b=this.nodes[link.b],x=b.x-a.x,y=b.y-a.y,z=b.z-a.z,distance=Math.hypot(x,y,z)||.001;
      const desired=Math.max(a.radius+b.radius+3,linkDistance*(link.strong?.72:1));
      const degree=Math.sqrt(Math.max(1,(a.degree||0)+1)*Math.max(1,(b.degree||0)+1));
      const force=Math.max(-100,Math.min(100,(distance-desired)*linkForce*(link.strong?1.5:1)*.5/degree));
      const fx=x/distance*force,fy=y/distance*force,fz=z/distance*force;
      if(this.mobile[link.a])this.bodies[link.a].addForce({x:fx,y:fy,z:fz},true);
      if(this.mobile[link.b])this.bodies[link.b].addForce({x:-fx,y:-fy,z:-fz},true);
    }
  }
  applyPointerForce(cursor,spacing,pointerReach){
    const pointer=this.pointer;if(!pointer||cursor<=0)return;
    pointer.life-=1/60;if(pointer.life<=0){this.pointer=null;return;}
    const range=(pointer.radius??70)*pointerReach,{origin,direction}=pointer,candidates=[];
    this.nodes.forEach((node,i)=>{
      if(this.drag?.index===i)return;
      if(this.scales&&this.scales[i]<=.15)return;
      const ox=node.x-origin.x,oy=node.y-origin.y,oz=node.z-origin.z,along=ox*direction.x+oy*direction.y+oz*direction.z;
      if(along<0)return;
      let x=node.x-origin.x-direction.x*along,y=node.y-origin.y-direction.y*along,z=node.z-origin.z-direction.z*along,distance=Math.hypot(x,y,z);
      if(distance>=range)return;
      if(distance<.001){const angle=hash(node.id+'pointer')*Math.PI*2;x=Math.cos(angle);y=Math.sin(angle);z=Math.sin(angle*.61);distance=1;}
      candidates.push({i,x,y,z,distance});
    });
    candidates.sort((a,b)=>a.distance-b.distance);
    for(const {i,x,y,z,distance} of candidates.slice(0,64)){
      if(!this.activate(i))continue;
      const falloff=1-distance/range,force=cursor*520*falloff*falloff,length=Math.hypot(x,y,z)||1;
      this.bodies[i].addForce({x:x/length*force,y:y/length*force,z:z/length*force},true);
    }
  }
  step({pull = 1, drift = true, animation='depth',formation='sphere', speed=1, orbit=1, rebound=.28,spacing=1,
    cohesion=1,repulsion=8,cursor=1.2,pointerReach=1.5,linkForce=.45,linkDistance=75} = {}) {
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
    if(this.drag){
      const source=this.nodes[this.drag.index];
      this.nodes.forEach((node,i)=>{
        if(i===this.drag.index||node.pinned||this.mobile[i])return;
        const range=(node.radius+source.radius)*3+12;
        if(Math.hypot(node.x-source.x,node.y-source.y,node.z-source.z)<range)this.activate(i,1.2);
      });
    }
    for(let i=0;i<this.nodes.length;i++){
      if(!this.mobile[i]||this.baseMobile[i]||this.nodes[i].pinned||this.drag?.index===i||this.groupDrag?.memberSet.has(i))continue;
      if(formation==='sphere'&&this.nodes[i].sourceGroup){
        const parent=this.groupParents.get(this.nodes[i].sourceGroup),base=parent?.offsets.get(i),p=this.bodies[i].translation();
        if(parent&&base){
          const error=Math.hypot(p.x-parent.position.x-base.x,p.y-parent.position.y-base.y,p.z-parent.position.z-base.z);
          const parentMoving=Math.hypot(parent.velocity.x,parent.velocity.y,parent.velocity.z)>.35||Math.hypot(parent.position.x-parent.home.x,parent.position.y-parent.home.y,parent.position.z-parent.home.z)>1;
          if(error>Math.max(1.5,this.nodes[i].radius*1.5)||parentMoving){this.interactionLife[i]=Math.max(this.interactionLife[i],.5);continue;}
        }
      }
      this.interactionLife[i]-=1/60;
      if(this.interactionLife[i]<=0){
        this.mobile[i]=false;this.bodies[i].enableCcd(false);this.bodies[i].setBodyType(RAPIER.RigidBodyType.Fixed,false);
      }
    }
    this.nodes.forEach((n,i)=>{if(this.mobile[i])this.bodies[i].resetForces(false);});
    this.applyGroupDrag();this.applyGroupParents(cohesion,pull,formation);this.applyGroupCollisions();this.applySceneBounds();this.applyRepulsion(repulsion,spacing);this.applyLinkForces(linkForce,linkDistance);this.applyPointerForce(cursor,spacing,pointerReach);
    this.nodes.forEach((n,i) => {
      const body = this.bodies[i];
      if(!this.mobile[i]) return;
      if(this.groupDrag?.memberSet.has(i)||n.sourceGroup)return;
      const v = body.linvel();
      let target, gain, damping;
      if(this.drag?.index === i) {
        target = this.drag.target; gain = 625; damping = 47;
      } else {
        const centre=this.followCentres[i],phase=this.phases[i];
        if(centre) {
          const raw=orbitOffset(this.offsets[i],this.time,phase,animation,amount);
          const offset={x:raw.x*spacing,y:raw.y*spacing,z:raw.z*spacing};
          target={x:centre.x+offset.x,y:centre.y+offset.y,z:centre.z+offset.z};
        }else {
          const home=this.home[i],amplitude=amount*(n.tier==='yellow'?5:11);
          const c=this.layoutCentre;
          target={x:c.x+(home.x-c.x)*spacing+amplitude*Math.sin(this.time*.6+phase),
            y:c.y+(home.y-c.y)*spacing+amplitude*Math.cos(this.time*.48+phase),
            z:c.z+(home.z-c.z)*spacing+amplitude*Math.sin(this.time*.38+phase)};
        }
        gain=(centre?1.6*cohesion:.3)*pull;damping=.6;
      }
      let fx=(target.x-n.x)*gain-v.x*damping,
        fy=(target.y-n.y)*gain-v.y*damping,
        fz=(target.z-n.z)*gain-v.z*damping;
      const maxAcceleration = this.drag?.index === i ? 9000 : 100;
      const scale = Math.min(1,maxAcceleration/Math.max(0.001,Math.hypot(fx,fy,fz))) * body.mass();
      body.addForce({x:fx*scale,y:fy*scale,z:fz*scale},true);
      // A dragged star pushes a small cushion of nearby free stars before
      // solid contact. Smooth compact falloff keeps distant groups untouched.
      if(this.drag&&this.drag.index!==i){
        const source=this.nodes[this.drag.index],dx=n.x-source.x,dy=n.y-source.y,dz=n.z-source.z;
        const distance=Math.hypot(dx,dy,dz),range=(n.radius+source.radius)*3+12;
        if(distance>1e-5&&distance<range){
          const falloff=1-distance/range,strength=180*falloff*falloff*body.mass()/distance;
          body.addForce({x:dx*strength,y:dy*strength,z:dz*strength},true);
        }
      }
    });
    this.world.step();
    this.readPositions();
    this.finishPendingDrag();
    return this.finishPendingGroup();
  }
  finishPendingDrag(){
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
