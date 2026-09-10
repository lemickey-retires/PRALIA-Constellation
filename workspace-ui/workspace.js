import {motion} from './workspace-motion.js';
import {scenePort} from './scene-port.js';

const $ = id => document.getElementById(id);
const icons = {
  orbit:'<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  'panel-left':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  'panel-right':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  'bookmark-plus':'<path d="M19 10v11l-7-4-7 4V5a2 2 0 0 1 2-2h6m5-1v6m-3-3h6"/>',
  bookmark:'<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4Z"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.4"/><path d="m21 15-5-5L5 21"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
  book:'<path d="M12 5v16M3 3h5a4 4 0 0 1 4 3 4 4 0 0 1 4-3h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
  message:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l2-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9h8m-8 4h5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  graph:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="9" cy="19" r="2"/><path d="m7 5 10 2M6 7l3 10m9-8-8 8"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m2-16a3 3 0 0 1 0 6m4 10v-2a6 6 0 0 0-4-5"/>',
  archive:'<rect x="3" y="3" width="18" height="4" rx="1"/><path d="M5 7v14h14V7m-10 5h6"/>',
  filter:'<path d="M3 4h18l-7 8v7l-4 2v-9Z"/>',
  'chevron-right':'<path d="m9 5 7 7-7 7"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 2.8c-1 .4-1 1.2-1 2.2m0 3v.01"/>',
  scan:'<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/><circle cx="12" cy="12" r="3"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
  reset:'<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>'
};
function icon(name){return '<svg aria-hidden="true" viewBox="0 0 24 24">'+(icons[name]||icons.file)+'</svg>';}
function paintIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
function element(tag,props={},text){const el=document.createElement(tag);Object.entries(props).forEach(([key,value])=>{if(key==='class')el.className=value;else el.setAttribute(key,value);});if(text!==undefined)el.textContent=text;return el;}
const sourceTypes=[
  {id:'notes',name:'Notes & guidance',icon:'book'}, {id:'memory',name:'Saved memory',icon:'bookmark'},
  {id:'conversations',name:'Conversations',icon:'message'}, {id:'sessions',name:'Sessions',icon:'clock'},
  {id:'graph',name:'Knowledge graph',icon:'graph'}, {id:'mirrors',name:'Generated mirrors',icon:'layers'},
  {id:'agents',name:'Agents',icon:'users'}, {id:'archive',name:'Archive',icon:'archive'}
];
// Small, invented UI fixtures. There are no rendered graph nodes in this preview.
const records=[
  ['research-notebook','Research notebook','notes','A place to collect questions, references and useful observations. This sample record shows how a longer note will read in the inspector.','Design collection'],
  ['workspace-principles','Workspace principles','notes','Keep useful controls close, make their state clear, and leave room for the work. This is invented content for reviewing the interface.','Design collection'],
  ['reading-list','Reading list','notes','A small collection of reading for the next research session. The final workspace can show the original source and its connections here.','Reference collection'],
  ['working-preferences','Working preferences','memory','A sample saved preference: show essential controls first and keep advanced options available on demand.','Sample memory'],
  ['weekly-review','Weekly review','memory','Collect open questions and decide what to revisit next. This record is a UI example, not a real saved memory.','Sample memory'],
  ['design-conversation','A conversation about design','conversations','A fictional conversation summary used to demonstrate record types and source information.','Sample conversation'],
  ['research-session','Research session','sessions','A sample session bringing together notes, questions and a few related references.','Sample session'],
  ['interface-patterns','Interface patterns','graph','Relationships between navigation, search and selected-record details. This entry represents a sample knowledge-graph record.','Sample relationship'],
  ['project-connections','Project connections','graph','An invented record connecting a project overview with its supporting notes.','Sample relationship'],
  ['reference-mirror','Reference mirror','mirrors','A sample generated copy that stays distinguishable from its original source.','Sample mirror'],
  ['research-assistant','Research assistant','agents','An illustrative agent entry. No real agent profile or service is connected to this preview.','Sample profile'],
  ['previous-exploration','Previous exploration','archive','An earlier example kept for reference. Archived sources can be excluded without removing them.','Sample archive']
].map(([id,title,source,body,collection])=>({id,title,source,body,collection}));
const sourceIds=sourceTypes.map(s=>s.id);
const defaults={sources:[...sourceIds],links:'off',layout:'atlas',paused:false,background:'horizon',showLabels:true,showSources:true,labelSize:100};
const storageKey='second-brain-workspace-ui-v1';
const clone=value=>JSON.parse(JSON.stringify(value));
function cleanView(value){
  const v=value&&typeof value==='object'?value:{};
  return {sources:Array.isArray(v.sources)?sourceIds.filter(id=>v.sources.includes(id)):[...sourceIds],
    links:['off','selected','overview','all'].includes(v.links)?v.links:'off',
    layout:['atlas','constellation','galaxy','globe','helix'].includes(v.layout)?v.layout:'atlas',
    paused:typeof v.paused==='boolean'?v.paused:false,
    background:['horizon','planetary','universe','off'].includes(v.background)?v.background:'horizon',
    showLabels:typeof v.showLabels==='boolean'?v.showLabels:true,showSources:typeof v.showSources==='boolean'?v.showSources:true,
    labelSize:Number.isFinite(v.labelSize)?Math.max(75,Math.min(150,v.labelSize)):100};
}
let stored={};try{stored=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
let state=cleanView(stored.state);
let savedViews=(Array.isArray(stored.savedViews)?stored.savedViews:[]).filter(v=>typeof v?.id==='string'&&typeof v?.name==='string'&&v.name.trim()).slice(0,30).map(v=>({id:v.id,name:v.name.slice(0,48),state:cleanView(v.state)}));
let activeView=['all','reading',...savedViews.map(v=>v.id)].includes(stored.activeView)?stored.activeView:null;
let selected=null,noticeTimer,commandItems=[],commandIndex=0;
const compact=matchMedia('(max-width:960px)');
let panels={left:!compact.matches,right:!compact.matches,focus:false};
let beforeFocus={left:true,right:true};
let desktopPanels={left:true,right:true};

function announce(message){$('announcement').textContent=message;}
function notice(message){clearTimeout(noticeTimer);$('save-status').textContent=message;motion.feedback();announce(message);noticeTimer=setTimeout(()=>{$('save-status').textContent='Saved on this browser';},2200);}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({state,savedViews,activeView}));return true;}catch{notice('Browser storage unavailable · changes last for this session');return false;}}
function emit(){scenePort.update({settings:clone(state),selectedRecord:selected?.id||null,mode:'static-preview'});}
function applyPanels(animate=true){
  motion.panels(()=>{
  $('app').dataset.left=String(panels.left);$('app').dataset.right=String(panels.right);$('app').dataset.focus=String(panels.focus);
  $('show-navigation').setAttribute('aria-expanded',String(panels.left));$('toggle-inspector').setAttribute('aria-expanded',String(panels.right));
  $('focus-view').setAttribute('aria-pressed',String(panels.focus));$('focus-view').querySelector('span:last-child').textContent=panels.focus?'Exit focus':'Focus view';
  $('panel-scrim').hidden=!compact.matches||(!panels.left&&!panels.right);
  },animate);
}
function togglePanel(side){panels.focus=false;panels[side]=!panels[side];if(compact.matches&&panels[side])panels[side==='left'?'right':'left']=false;applyPanels();}
function focusView(){
  if(!panels.focus){beforeFocus={left:panels.left,right:panels.right};panels={left:false,right:false,focus:true};}
  else panels={...beforeFocus,focus:false};
  applyPanels();announce(panels.focus?'Focus view. Both panels hidden.':'Workspace panels restored.');
}
compact.addEventListener('change',event=>{
  if(event.matches){desktopPanels={left:panels.left,right:panels.right};panels={left:false,right:false,focus:false};}
  else panels={...desktopPanels,focus:false};
  applyPanels(false);
});
function renderSources(){
  const focusedSource=$('source-list').contains(document.activeElement)?document.activeElement.value:null;
  $('source-list').replaceChildren(...sourceTypes.map(source=>{
    const label=element('label',{class:'source-row'});
    const input=element('input',{type:'checkbox','aria-label':source.name,value:source.id});input.checked=state.sources.includes(source.id);
    input.addEventListener('change',()=>{state.sources=input.checked?[...state.sources,source.id]:state.sources.filter(id=>id!==source.id);changed('Source filters updated');});
    const mark=element('span',{class:'source-icon'});mark.innerHTML=icon(source.icon);
    const count=records.filter(record=>record.source===source.id).length;
    label.append(input,mark,element('span',{class:'source-name'},source.name),element('span',{class:'source-count','aria-label':count+' sample records'},String(count)));return label;
  }));
  $('toggle-sources').textContent=state.sources.length?'Hide all':'Show all';
  if(focusedSource) [...$('source-list').querySelectorAll('input')].find(input=>input.value===focusedSource)?.focus();
}
function renderSavedViews(){
  const presets=[{id:'all',name:'All sources',state:clone(defaults)},{id:'reading',name:'Reading view',state:{...clone(defaults),sources:['notes','memory','graph'],links:'selected',paused:true}}];
  $('saved-views').replaceChildren(...[...presets,...savedViews].map(view=>{
    const row=element('div',{class:'saved-view'+(activeView===view.id?' selected':'')});
    const button=element('button',{type:'button',title:view.name});button.innerHTML=icon('bookmark');button.append(element('span',{},view.name));
    button.onclick=()=>{state=cleanView(view.state);activeView=view.id;persist();render();notice(view.name+' opened');if(compact.matches){panels.left=false;applyPanels();}};
    row.append(button);
    if(!presets.includes(view)){
      const remove=element('button',{type:'button',class:'icon-button small delete-view','aria-label':'Delete saved view '+view.name,title:'Delete saved view'});remove.innerHTML=icon('trash');
      remove.onclick=()=>{savedViews=savedViews.filter(v=>v.id!==view.id);if(activeView===view.id)activeView=null;persist();renderSavedViews();renderTitle();notice('Saved view deleted');};row.append(remove);
    }
    return row;
  }));
}
function renderTitle(){const view=savedViews.find(v=>v.id===activeView);$('view-title').textContent=view?.name||(activeView==='reading'?'Reading view':'Universe');$('view-subtitle').textContent=state.sources.length===8?'All sources':state.sources.length+' sources';}
function renderControls(){
  $('links-mode').value=state.links;$('layout-mode').value=state.layout;$('background-mode').value=state.background;
  $('show-labels').checked=state.showLabels;$('show-sources').checked=state.showSources;$('motion-enabled').checked=!state.paused;
  $('label-size').value=String(state.labelSize);$('label-size-value').value=state.labelSize+'%';
  $('links-note').textContent={off:'Keep the workspace clear of connection lines.',selected:'Reveal connections for the selected record.',overview:'Show a selective overview of relationships.',all:'Include every connection in this view.'}[state.links];
  $('source-summary').textContent=state.sources.length+' '+(state.sources.length===1?'source':'sources')+' enabled';
  $('filter-summary').textContent=state.sources.length===8?'No filters applied':(8-state.sources.length)+' sources hidden';
  $('no-sources').hidden=state.sources.length>0;
}
function changed(message){activeView=null;persist();render();if(message)notice(message);}
function render(){renderSources();renderSavedViews();renderTitle();renderControls();renderRecords();emit();}
function setTab(name){
  const changedTab=$(name+'-tab').getAttribute('aria-selected')!=='true';
  for(const tab of ['view','details']){$(tab+'-tab').classList.toggle('selected',tab===name);$(tab+'-tab').setAttribute('aria-selected',String(tab===name));$(tab+'-tab').tabIndex=tab===name?0:-1;$(tab+'-panel').hidden=tab!==name;}
  if(changedTab)motion.tab(name);
}
function selectRecord(record){
  selected=record;panels.right=true;panels.focus=false;if(compact.matches)panels.left=false;applyPanels();setTab('details');
  $('inspector-empty').hidden=true;$('record-detail').hidden=false;
  const source=sourceTypes.find(s=>s.id===record.source),detail=$('record-detail');detail.replaceChildren();
  const type=element('div',{class:'detail-type'});type.innerHTML=icon(source.icon);type.append(element('span',{},source.name));
  detail.append(type,element('h2',{},record.title),element('span',{class:'sample-label'},'Sample record'),element('p',{class:'detail-body'},record.body));
  const properties=element('section',{class:'detail-section'});properties.append(element('h3',{},'Source information'));
  for(const [label,value] of [['Collection',record.collection],['Content','Invented example'],['Access','Preview only']]){const row=element('div',{class:'detail-property'});row.append(element('span',{},label),element('span',{},value));properties.append(row);}
  const related=element('section',{class:'detail-section'});related.append(element('h3',{},'Sample connections'));
  const start=records.indexOf(record);for(let i=1;i<=2;i++){const next=records[(start+i)%records.length];const button=element('button',{class:'related-record',type:'button'});button.innerHTML=icon('file');button.append(element('span',{},next.title));button.onclick=()=>selectRecord(next);related.append(button);}
  detail.append(properties,related);motion.detail();motion.hide($('search-drawer'));emit();announce(record.title+' selected. Sample details opened.');
}
function openRecords(){
  if(compact.matches){panels.left=false;panels.right=false;panels.focus=false;applyPanels();}
  motion.show($('search-drawer'));renderRecords();motion.results($('record-results'));$('record-query').focus();
}
function resultButton(record){const button=element('button',{class:'result-row',type:'button'});button.innerHTML=icon(sourceTypes.find(s=>s.id===record.source).icon);const text=element('span',{class:'result-copy'});text.append(element('span',{class:'result-title'},record.title),element('small',{},sourceTypes.find(s=>s.id===record.source).name+' · Sample record'));button.append(text);button.onclick=()=>selectRecord(record);return button;}
function renderRecords(){
  // Result motion is bounded to the visible list; filtering stays synchronous.
  const query=$('record-query').value.trim().toLowerCase();
  const matches=records.filter(r=>state.sources.includes(r.source)&&(r.title+' '+r.body).toLowerCase().includes(query));
  $('record-results').replaceChildren(element('p',{class:'results-note'},matches.length+' sample '+(matches.length===1?'record':'records')+' in enabled sources'),...matches.map(resultButton));
  if(!matches.length){const empty=element('div',{class:'empty-results'});empty.append(element('strong',{},'No matching records'),element('span',{},'Try another search or show more sources.'));const clear=element('button',{type:'button'},'Clear search and show all sources');clear.onclick=()=>{$('record-query').value='';state.sources=[...sourceIds];changed();$('record-query').focus();};empty.append(clear);$('record-results').append(empty);}
}
function openSave(){if(savedViews.length>=30){notice('You have 30 saved views. Delete one to make room.');return;}$('save-error').hidden=true;$('view-name').value='';motion.openDialog($('save-dialog'));$('view-name').focus();}
function resetView(){state=clone(defaults);activeView=null;persist();render();notice('Default view restored');}
function exportView(){const data={version:1,kind:'workspace-ui-preview',view:state,savedViews};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=element('a',{href:url,download:'second-brain-workspace.json'});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Workspace settings exported');}
const commands=[
  {title:'Focus view',description:'Hide or restore workspace panels',icon:'expand',run:focusView},
  {title:'Toggle source panel',description:'Show or hide navigation',icon:'panel-left',run:()=>togglePanel('left')},
  {title:'Toggle view panel',description:'Show or hide settings and details',icon:'panel-right',run:()=>togglePanel('right')},
  {title:'Save view',description:'Keep sources and display settings',icon:'bookmark-plus',run:openSave},
  {title:'Export workspace settings',description:'Download this preview’s settings',icon:'download',run:exportView},
  {title:'Reset view',description:'Restore all sources and default settings',icon:'reset',run:resetView}
];
function openCommand(){$('command-query').value='';motion.openDialog($('command-dialog'));renderCommand();motion.results($('command-results'));$('command-query').focus();}
function renderCommand(){
  const query=$('command-query').value.trim().toLowerCase();
  commandItems=[...commands.filter(c=>(c.title+' '+c.description).toLowerCase().includes(query)).map(c=>({...c,kind:'Action'})),...records.filter(r=>(r.title+' '+r.body).toLowerCase().includes(query)).map(r=>({title:r.title,description:sourceTypes.find(s=>s.id===r.source).name,icon:'file',kind:'Sample',run:()=>selectRecord(r)}))];
  commandIndex=0;$('command-results').replaceChildren(...commandItems.map((item,index)=>{
    const button=element('button',{class:'result-row'+(index===0?' command-active':''),type:'button'});button.innerHTML=icon(item.icon);
    const text=element('span',{class:'result-copy'});text.append(element('span',{class:'result-title'},item.title),element('small',{},item.description));button.append(text,element('span',{class:'result-end'},item.kind));
    button.onclick=()=>{motion.closeDialog($('command-dialog'),()=>item.run());};return button;
  }));
  if(!commandItems.length)$('command-results').append(element('p',{class:'empty-results'},'No matching records or actions. Try a different search.'));
}

document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.action;if(action==='toggle-left')togglePanel('left');if(action==='toggle-right')togglePanel('right');if(action==='save-view')openSave();}));
document.querySelectorAll('[data-close-dialog]').forEach(button=>button.onclick=()=>motion.closeDialog(button.closest('dialog')));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)motion.closeDialog(dialog);}));
$('focus-view').onclick=focusView;$('universe-nav').onclick=()=>{activeView=null;renderTitle();motion.hide($('search-drawer'));setTab('view');};
$('find-records').onclick=openRecords;$('browse-samples').onclick=openRecords;$('close-search').onclick=()=>{motion.hide($('search-drawer'));($('find-records').getClientRects().length?$('find-records'):$('open-command')).focus();};
$('record-query').addEventListener('input',()=>{renderRecords();motion.results($('record-results'));});$('open-command').onclick=openCommand;$('command-query').addEventListener('input',()=>{renderCommand();motion.results($('command-results'));});
$('open-help').onclick=()=>motion.openDialog($('help-dialog'));$('reset-view').onclick=resetView;
$('toggle-sources').onclick=()=>{state.sources=state.sources.length?[]:[...sourceIds];changed('Source filters updated');};
$('restore-sources').onclick=()=>{state.sources=[...sourceIds];changed('All sources shown');};
$('panel-scrim').onclick=()=>{panels.left=false;panels.right=false;applyPanels();};
for(const name of ['view','details']){
  $(name+'-tab').onclick=()=>setTab(name);
  $(name+'-tab').onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'view':event.key==='End'?'details':name==='view'?'details':'view';setTab(next);$(next+'-tab').focus();}};
}
for(const [id,key,read] of [['links-mode','links',el=>el.value],['layout-mode','layout',el=>el.value],['background-mode','background',el=>el.value],['show-labels','showLabels',el=>el.checked],['show-sources','showSources',el=>el.checked],['motion-enabled','paused',el=>!el.checked]])$(id).onchange=event=>{state[key]=read(event.target);changed('View settings saved');};
$('label-size').oninput=event=>{state.labelSize=Number(event.target.value);$('label-size-value').value=state.labelSize+'%';};
$('label-size').onchange=()=>changed('View settings saved');
$('save-form').onsubmit=event=>{
  event.preventDefault();const name=$('view-name').value.trim();
  if(!name){$('save-error').textContent='Give this view a name.';$('save-error').hidden=false;$('view-name').focus();return;}
  if(savedViews.some(v=>v.name.toLowerCase()===name.toLowerCase())||['all sources','reading view'].includes(name.toLowerCase())){$('save-error').textContent='A view with this name already exists. Choose another name.';$('save-error').hidden=false;return;}
  const view={id:crypto.randomUUID(),name,state:clone(state)};savedViews.push(view);activeView=view.id;const saved=persist();renderSavedViews();renderTitle();motion.closeDialog($('save-dialog'));if(saved)notice('“'+name+'” saved');
};
$('command-dialog').addEventListener('keydown',event=>{
  if(!['ArrowDown','ArrowUp','Enter'].includes(event.key)||!commandItems.length)return;
  if(event.key==='Enter'){if(document.activeElement!==$('command-query'))return;event.preventDefault();const command=commandItems[commandIndex];motion.closeDialog($('command-dialog'),()=>command.run());return;}
  event.preventDefault();commandIndex=(commandIndex+(event.key==='ArrowDown'?1:-1)+commandItems.length)%commandItems.length;
  [...$('command-results').children].forEach((el,index)=>el.classList.toggle('command-active',index===commandIndex));$('command-results').children[commandIndex]?.scrollIntoView({block:'nearest'});
});
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!$('command-dialog').open&&!document.querySelector('dialog[open]'))openCommand();return;}
  if(document.querySelector('dialog[open]'))return;
  if(event.key==='Escape'){
    if(!$('search-drawer').hidden){motion.hide($('search-drawer'));($('find-records').getClientRects().length?$('find-records'):$('open-command')).focus();}
    else if(panels.focus)focusView();else if(compact.matches){panels.left=false;panels.right=false;applyPanels();}
    return;
  }
  if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.key==='/'){event.preventDefault();openRecords();}
  if(event.key.toLowerCase()==='f'){event.preventDefault();focusView();}
});
$('scene-image').addEventListener('error',()=>{$('image-error').hidden=false;});
$('scene-image').addEventListener('load',()=>{$('image-error').hidden=true;});
$('retry-image').onclick=()=>{$('scene-image').src='./assets/universe-still.png?retry='+Date.now();};
if(/Mac|iPhone|iPad/.test(navigator.platform))$('command-shortcut').textContent='⌘ K';
paintIcons();motion.init();applyPanels(false);render();
document.documentElement.dataset.ready='true';
