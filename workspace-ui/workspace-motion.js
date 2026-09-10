
const {gsap, Flip} = window;
gsap.registerPlugin(Flip);
gsap.config({autoSleep: 30});
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const $ = id => document.getElementById(id);
const clear = 'transform,opacity,visibility';
const closing = new WeakMap();
let panelTween;

function enter(el, {x=0,y=8,scale=1,duration=.22}={}) {
  if (!el || !el.getClientRects().length) return;
  gsap.killTweensOf(el);
  gsap.fromTo(el, {opacity:reduced.matches?.7:0,x:reduced.matches?0:x,y:reduced.matches?0:y,scale:reduced.matches?1:scale},
    {opacity:1,x:0,y:0,scale:1,duration:reduced.matches?.08:duration,ease:'power3.out',clearProps:clear});
}

export const motion = {
  panels(change, animate=true) {
    const targets=[$('left-panel'),$('workspace-main'),$('right-panel')];
    panelTween?.progress(1);
    const state=animate&&!reduced.matches?Flip.getState(targets):null;
    change();
    if($('app').dataset.right==='true' && $('tab-indicator')){const tab=document.querySelector('.panel-tab.selected');gsap.set($('tab-indicator'),{x:tab.offsetLeft,width:tab.offsetWidth});}
    for(const side of ['left','right']) {
      const panel=$(side+'-panel');
      panel.inert=$('app').dataset[side]==='false';
      if(panel.inert && panel.contains(document.activeElement)) $(side==='left'?'show-navigation':'toggle-inspector').focus();
    }
    if(!state) return;
    panelTween=Flip.from(state,{duration:.32,ease:'power3.inOut',absoluteOnLeave:true,
      onEnter:els=>gsap.fromTo(els,{opacity:0,x:(i,el)=>el.id==='left-panel'?-18:18},{opacity:1,x:0,duration:.24,clearProps:clear}),
      onLeave:els=>gsap.to(els,{opacity:0,duration:.16}),
      onComplete:()=>gsap.set(targets,{clearProps:clear})});
  },
  show(el) {
    closing.delete(el); gsap.killTweensOf(el); el.inert=false; el.hidden=false;
    enter(el,{y:10,scale:.99});
  },
  hide(el, after) {
    if(el.hidden){after?.();return;}
    closing.set(el,true);el.inert=true;gsap.killTweensOf(el);
    gsap.to(el,{opacity:0,y:reduced.matches?0:-5,duration:reduced.matches?.06:.14,ease:'power2.in',onComplete:()=>{
      if(!closing.has(el))return;closing.delete(el);el.hidden=true;el.inert=false;gsap.set(el,{clearProps:clear});after?.();
    }});
  },
  openDialog(el) {
    closing.delete(el);gsap.killTweensOf(el);el.inert=false;
    if(!el.open)el.showModal();
    enter(el,{y:-12,scale:.985,duration:.24});
    gsap.fromTo(el,{'--backdrop-alpha':0},{'--backdrop-alpha':1,duration:reduced.matches?.08:.2});
  },
  closeDialog(el, after) {
    if(!el.open){after?.();return;}
    if(closing.has(el))return;
    closing.set(el,true);el.inert=true;gsap.killTweensOf(el);
    gsap.to(el,{opacity:0,y:reduced.matches?0:-7,scale:reduced.matches?1:.992,'--backdrop-alpha':0,duration:reduced.matches?.06:.14,ease:'power2.in',onComplete:()=>{
      closing.delete(el);el.inert=false;el.close();gsap.set(el,{clearProps:clear+',--backdrop-alpha'});after?.();
    }});
  },
  tab(name) {
    const marker=$('tab-indicator'),tab=$(name+'-tab');
    gsap.to(marker,{x:tab.offsetLeft,width:tab.offsetWidth,duration:reduced.matches?.08:.24,ease:'power3.out',overwrite:true});
    enter($(name+'-panel'),{x:name==='details'?8:-8,y:0,duration:.2});
  },
  results(root) {
    if(!root.getClientRects().length)return;
    const rows=[...root.querySelectorAll('.result-row')].slice(0,8);
    if(!rows.length)return;
    gsap.fromTo(rows,{opacity:.45,x:reduced.matches?0:-5},{opacity:1,x:0,duration:reduced.matches?.08:.17,stagger:reduced.matches?0:.012,ease:'power2.out',clearProps:clear});
  },
  detail(){enter($('record-detail'),{x:7,y:0});},
  feedback(){enter($('save-status'),{y:3,duration:.16});},
  init() {
    const marker=document.createElement('span');marker.id='tab-indicator';marker.setAttribute('aria-hidden','true');
    document.querySelector('.panel-tabs').append(marker);
    const position=()=>{const tab=document.querySelector('.panel-tab.selected');gsap.set(marker,{x:tab.offsetLeft,width:tab.offsetWidth});};
    position();window.addEventListener('resize',position);
    document.querySelectorAll('dialog').forEach(el=>el.addEventListener('cancel',e=>{e.preventDefault();motion.closeDialog(el);}));
    const pressSelector='.icon-button,.primary-button,.secondary-button,.quiet-button,.command-trigger';
    let pressed;
    document.addEventListener('pointerdown',e=>{
      const el=e.target.closest(pressSelector);if(!el||el.disabled||reduced.matches)return;
      pressed=el;gsap.to(el,{scale:.96,duration:.1,ease:'power2.out',overwrite:true});
    });
    const release=()=>{if(pressed){gsap.to(pressed,{scale:1,duration:.18,ease:'power3.out',overwrite:true,clearProps:'transform'});pressed=null;}};
    document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);window.addEventListener('blur',release);
    document.addEventListener('pointerover',e=>{const el=e.target.closest(pressSelector);if(!el||el.contains(e.relatedTarget)||reduced.matches)return;const icon=el.querySelector('svg');if(icon)gsap.to(icon,{scale:1.09,transformOrigin:'50% 50%',duration:.16,overwrite:true});});
    document.addEventListener('pointerout',e=>{const el=e.target.closest(pressSelector);if(!el||el.contains(e.relatedTarget))return;const icon=el.querySelector('svg');if(icon)gsap.to(icon,{scale:1,duration:.14,overwrite:true,clearProps:'transform'});});
    const disclosure=document.querySelector('.settings-disclosure');
    disclosure.addEventListener('toggle',()=>{if(disclosure.open)enter(disclosure.querySelector('.disclosure-content'),{y:-5});});
    reduced.addEventListener('change',()=>{gsap.globalTimeline.getChildren().forEach(t=>t.totalProgress(1));});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)gsap.globalTimeline.getChildren().forEach(t=>t.totalProgress(1));});
  }
};
