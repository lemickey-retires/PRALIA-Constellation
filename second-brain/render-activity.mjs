// Frame scheduling only: no changes to image resolution, assets or materials.
export class RenderActivity {
  constructor(now,{idleMs=30000,fps=60}={}) {
    this.idleMs=idleMs;this.interval=1000/fps;
    this.lastActivity=now;this.nextFrame=now;this.idle=false;
  }
  touch(now) {
    const waking=this.idle;
    this.lastActivity=now;this.idle=false;
    if(waking)this.nextFrame=now;
    return waking;
  }
  checkIdle(now,busy=false) {
    if(busy)this.lastActivity=now;
    this.idle=now-this.lastActivity>=this.idleMs;
    return this.idle;
  }
  frameDue(now) {
    if(now+.1<this.nextFrame)return false;
    // Preserve the average 60 fps budget on 75/120/144 Hz displays without
    // building up a backlog after a slow frame or a suspended tab.
    this.nextFrame=Math.max(this.nextFrame+this.interval,now+.1);
    return true;
  }
}
