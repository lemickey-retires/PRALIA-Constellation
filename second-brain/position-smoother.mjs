// Interpolate worker snapshots on the display clock. Never extrapolate through
// contacts; a late worker frame holds its last resolved position.
export class PositionSmoother {
  constructor(nodes){this.nodes=nodes;this.from=new Float32Array(nodes.length*3);this.to=this.from.slice();this.started=0;this.duration=1000/60;this.active=false;}
  receive(positions,now,snap=false){
    this.nodes.forEach((n,i)=>{const k=i*3;this.from[k]=n.x;this.from[k+1]=n.y;this.from[k+2]=n.z;});
    this.to.set(positions);this.started=now;this.active=true;
    if(snap)this.sample(Infinity);
  }
  sample(now,immediateIndex=-1){
    if(!this.active)return false;
    const t=Math.max(0,Math.min(1,(now-this.started)/this.duration));
    this.nodes.forEach((n,i)=>{const k=i*3,a=i===immediateIndex||n.pinned?1:t;
      n.x=this.from[k]+(this.to[k]-this.from[k])*a;n.y=this.from[k+1]+(this.to[k+1]-this.from[k+1])*a;n.z=this.from[k+2]+(this.to[k+2]-this.from[k+2])*a;});
    this.active=t<1;return true;
  }
}
