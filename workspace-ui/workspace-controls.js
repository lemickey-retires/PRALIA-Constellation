const svg = paths => `<svg aria-hidden="true" viewBox="0 0 24 24">${paths}</svg>`;
const chevron=svg('<path d="m8 10 4 4 4-4"/>');
const check=svg('<path d="m5 12 4 4L19 6"/>');
const info=svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>');
const descriptions={
  'links-mode':{title:'Connections',text:'Choose which relationships the future scene will show. This preview saves the setting while the image stays still.',options:{off:'A clear view without lines.',selected:'Only the selected record’s relationships.',overview:'A selective overview of relationships.',all:'Every available relationship.'}},
  'layout-mode':{title:'Layout',text:'Choose how records will be arranged when the 3D scene is connected.',options:{atlas:'Group records by their source.',constellation:'Cluster related records together.',galaxy:'A broad spiral arrangement.',globe:'Distribute records around a sphere.',helix:'Arrange records along a winding path.'}},
  'background-mode':{title:'Background',text:'Save a backdrop preference for the future scene. The placeholder image stays the same.',options:{horizon:'Black hole and accretion ring.',planetary:'An illuminated planetary surface.',universe:'An open star field.',off:'A plain, dark scene.'}}
};
const hints={
  'show-navigation':['Workspace navigation','Show or hide sources and saved views.'],
  'toggle-inspector':['View and details','Show or hide the right-hand panel.'],
  'focus-view':['Focus view','Hide both panels, then restore their previous positions.','F'],
  'open-command':['Search workspace','Find a sample record or run a workspace action.','Ctrl / ⌘ K'],
  'open-help':['Keyboard shortcuts','See the keys for navigation, search and focus.'],
  'close-search':['Close record search','Return to the workspace.','Esc'],
  'find-records':['Find a record','Search sample records in the enabled sources.','/'],
  'reset-view':['Reset view','Restore all sources and default display settings. Saved views are kept.']
};
const bindings=[];
let tooltip, tipOwner, tipTimer, hideTimer, priorDescription, menu, activeBinding, activeIndex=0, typeBuffer='', typeTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function animate(el){window.gsap.fromTo(el,{opacity:0,y:reduced.matches?0:-5},{opacity:1,y:0,duration:reduced.matches?.06:.16,ease:'power3.out',clearProps:'opacity,transform',overwrite:true});}
function place(el, anchor, align='start'){
  const rect=anchor.getBoundingClientRect(), gap=8;
  const box=el.getBoundingClientRect();
  let left=align==='centre'?rect.left+(rect.width-box.width)/2:rect.left;
  left=Math.max(10,Math.min(innerWidth-box.width-10,left));
  const above=rect.bottom+gap+box.height>innerHeight-10;
  const top=above?Math.max(10,rect.top-gap-box.height):rect.bottom+gap;
  el.style.left=left+'px';el.style.top=top+'px';el.dataset.placement=above?'above':'below';
}
function hideTip(){
  clearTimeout(tipTimer);clearTimeout(hideTimer);
  if(tipOwner){if(priorDescription===null)tipOwner.removeAttribute('aria-describedby');else tipOwner.setAttribute('aria-describedby',priorDescription);}
  tipOwner=null;
  if(tooltip?.matches(':popover-open'))tooltip.hidePopover();
}
function showTip(owner){
  if(!owner?.isConnected||activeBinding||owner.disabled)return;
  hideTip();tipOwner=owner;priorDescription=owner.getAttribute('aria-describedby');
  const title=owner.dataset.tipTitle||owner.getAttribute('aria-label')||owner.textContent.trim();
  tooltip.replaceChildren();const heading=document.createElement('div');heading.className='tooltip-heading';heading.innerHTML=info;
  const name=document.createElement('strong');name.textContent=title;heading.append(name);tooltip.append(heading);
  if(owner.dataset.tipText){const p=document.createElement('p');p.textContent=owner.dataset.tipText;tooltip.append(p);}
  if(owner.dataset.tipKey){const key=document.createElement('kbd');key.textContent=owner.dataset.tipKey;tooltip.append(key);}
  (owner.closest('dialog[open]')||document.body).append(tooltip);
  owner.setAttribute('aria-describedby',[priorDescription,tooltip.id].filter(Boolean).join(' '));
  tooltip.showPopover();place(tooltip,owner,'centre');animate(tooltip);
}
function tipTarget(target){return target.closest('[data-tip-title]');}
function applyHints(root=document){
  root.querySelectorAll('button[title],button[aria-label]').forEach(button=>{
    if(button.dataset.tipTitle)return;
    const value=button.getAttribute('title')||button.getAttribute('aria-label');
    if(value)button.dataset.tipTitle=value;
    button.removeAttribute('title');
  });
}
function closeMenu(restore=false){
  if(!activeBinding)return;
  const {button}=activeBinding;button.setAttribute('aria-expanded','false');activeBinding=null;
  menu.hidePopover();clearTimeout(typeTimer);typeBuffer='';
  if(restore)button.focus();
}
function focusOption(index){
  const options=[...menu.querySelectorAll('[role=option]')];
  activeIndex=(index+options.length)%options.length;
  options.forEach((option,i)=>option.classList.toggle('option-active',i===activeIndex));
  options[activeIndex]?.focus({preventScroll:true});options[activeIndex]?.scrollIntoView({block:'nearest'});
}
function choose(index){
  const binding=activeBinding;if(!binding)return;
  binding.select.value=binding.select.options[index].value;
  closeMenu(true);binding.select.dispatchEvent(new Event('change',{bubbles:true}));controls.sync();
}
function openMenu(binding,edge){
  if(activeBinding===binding){closeMenu(true);return;}
  closeMenu();hideTip();activeBinding=binding;
  const {select,button}=binding,config=descriptions[select.id];
  menu.setAttribute('aria-label',config.title);menu.replaceChildren();
  [...select.options].forEach((option,index)=>{
    const row=document.createElement('button');row.type='button';row.className='control-option';row.setAttribute('role','option');row.setAttribute('aria-selected',String(option.selected));row.tabIndex=-1;
    const copy=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('small');title.textContent=option.text;description.textContent=config.options[option.value]||'';copy.append(title,description);
    const mark=document.createElement('span');mark.className='option-check';mark.innerHTML=check;row.append(copy,mark);row.onclick=()=>choose(index);menu.append(row);
  });
  menu.style.width=Math.min(innerWidth-20,Math.max(254,button.getBoundingClientRect().width))+'px';
  button.setAttribute('aria-expanded','true');menu.showPopover();place(menu,button);animate(menu);
  focusOption(edge==='end'?select.options.length-1:edge==='start'?0:select.selectedIndex);
}
export const controls={
  sync(){
    for(const {select,button,value} of bindings){value.textContent=select.selectedOptions[0]?.text||'';button.disabled=select.disabled;}
    const range=document.getElementById('label-size');range.style.setProperty('--range-fill',((range.value-range.min)/(range.max-range.min)*100)+'%');
    applyHints();
  },
  init(){
    tooltip=document.createElement('div');tooltip.id='control-tooltip';tooltip.className='control-tooltip';tooltip.setAttribute('role','tooltip');tooltip.setAttribute('popover','manual');document.body.append(tooltip);
    menu=document.createElement('div');menu.id='control-menu';menu.className='control-menu';menu.setAttribute('role','listbox');menu.setAttribute('popover','manual');document.body.append(menu);
    for(const [id,config] of Object.entries(descriptions)){
      const select=document.getElementById(id),label=select.closest('label');
      const wrapper=document.createElement('div');wrapper.className=label.className;label.replaceWith(wrapper);
      const caption=document.createElement('div');caption.className='control-caption';const title=document.createElement('span');title.id=id+'-label';title.textContent=config.title;
      const help=document.createElement('button');help.type='button';help.className='control-help';help.setAttribute('aria-label','About '+config.title.toLowerCase());help.dataset.tipTitle=config.title;help.dataset.tipText=config.text;help.innerHTML=info;caption.append(title,help);
      const button=document.createElement('button');button.type='button';button.className='select-trigger';button.id=id+'-trigger';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',menu.id);button.setAttribute('aria-labelledby',title.id+' '+id+'-value');
      const value=document.createElement('span');value.id=id+'-value';const arrow=document.createElement('span');arrow.className='select-chevron';arrow.innerHTML=chevron;button.append(value,arrow);
      select.hidden=true;select.tabIndex=-1;select.setAttribute('aria-hidden','true');wrapper.append(caption,select,button);
      const binding={select,button,value};bindings.push(binding);button.onclick=()=>openMenu(binding);
      button.onkeydown=e=>{if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();openMenu(binding,e.key==='Home'?'start':e.key==='End'?'end':undefined);}};
    }
    for(const [id,[title,text,key]] of Object.entries(hints)){const el=document.getElementById(id);el.dataset.tipTitle=title;el.dataset.tipText=text;if(key)el.dataset.tipKey=key;el.removeAttribute('title');}
    const sceneMotion=document.getElementById('motion-enabled').closest('label');sceneMotion.querySelector(':scope>span').textContent='Scene motion';
    const help=document.createElement('button');help.type='button';help.className='control-help scene-motion-help';help.setAttribute('aria-label','About scene motion');help.dataset.tipTitle='Scene motion';help.dataset.tipText='Saves motion for the future 3D scene. Interface animations follow your system’s reduced-motion preference.';help.innerHTML=info;sceneMotion.after(help);
    applyHints();
    new MutationObserver(()=>applyHints()).observe(document.getElementById('app'),{childList:true,subtree:true});
    document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const owner=tipTarget(e.target);if(!owner||owner.contains(e.relatedTarget))return;clearTimeout(hideTimer);clearTimeout(tipTimer);tipTimer=setTimeout(()=>showTip(owner),360);});
    document.addEventListener('pointerout',e=>{const owner=tipTarget(e.target);if(!owner||owner.contains(e.relatedTarget))return;clearTimeout(tipTimer);hideTimer=setTimeout(hideTip,160);});
    tooltip.addEventListener('pointerenter',()=>clearTimeout(hideTimer));tooltip.addEventListener('pointerleave',hideTip);
    document.addEventListener('focusin',e=>{const owner=tipTarget(e.target);if(owner?.matches(':focus-visible')){clearTimeout(tipTimer);tipTimer=setTimeout(()=>showTip(owner),180);}});
    document.addEventListener('focusout',hideTip);
    document.addEventListener('click',e=>{const help=e.target.closest('.control-help');if(help){tipOwner===help?hideTip():showTip(help);}else hideTip();});
    document.addEventListener('pointerdown',e=>{if(activeBinding&&!menu.contains(e.target)&&!activeBinding.button.contains(e.target))closeMenu();if(!tooltip.contains(e.target)&&!e.target.closest('.control-help'))hideTip();});
    menu.addEventListener('keydown',e=>{
      if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='Enter'||e.key===' ')choose(activeIndex);else focusOption(e.key==='Home'?0:e.key==='End'?menu.children.length-1:activeIndex+(e.key==='ArrowDown'?1:-1));}
      else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){e.preventDefault();e.stopPropagation();clearTimeout(typeTimer);typeBuffer+=e.key.toLowerCase();const found=[...activeBinding.select.options].findIndex(o=>o.text.toLowerCase().startsWith(typeBuffer));if(found>=0)focusOption(found);typeTimer=setTimeout(()=>typeBuffer='',650);}
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeBinding){e.preventDefault();e.stopImmediatePropagation();closeMenu(true);}else if(e.key==='Tab'&&activeBinding)closeMenu(true);else if(e.key==='Escape'&&tipOwner){e.preventDefault();e.stopImmediatePropagation();hideTip();}},true);
    window.addEventListener('resize',()=>{closeMenu();hideTip();});
    document.addEventListener('scroll',e=>{if(menu.contains(e.target))return;closeMenu();hideTip();},true);
    document.getElementById('label-size').addEventListener('input',()=>controls.sync());
    const form=document.getElementById('save-form'),name=document.getElementById('view-name');
    form.noValidate=true;document.getElementById('save-error').setAttribute('role','alert');name.setAttribute('aria-describedby','save-error');
    form.addEventListener('submit',()=>name.setAttribute('aria-invalid',String(!document.getElementById('save-error').hidden)));
    name.addEventListener('input',()=>{name.removeAttribute('aria-invalid');document.getElementById('save-error').hidden=true;});
    name.addEventListener('focus',()=>{if(document.getElementById('save-error').hidden)name.removeAttribute('aria-invalid');});
    controls.sync();
  }
};
