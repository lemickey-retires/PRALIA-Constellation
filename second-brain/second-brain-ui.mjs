import * as THREE from 'three';
import {sources,sourceId,recordHubs} from './second-brain-layout.mjs';
const $=id=>document.getElementById(id);
const make=(tag,props={},text)=>{const n=document.createElement(tag);Object.entries(props).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};

export function installSecondBrain(data,actions){
  document.body.classList.add('second-brain');
  const active=new Set(sources.map(s=>s.id));
  const inspector=document.querySelector('aside');inspector.id='memory-inspector';inspector.hidden=true;
  inspector.querySelector('h1').textContent='Inspector';
  const close=make('button',{type:'button',id:'close-inspector'},'Close');
  inspector.prepend(close);close.onclick=()=>{inspector.hidden=true;$('inspector-toggle').setAttribute('aria-expanded','false');$('inspector-toggle').focus();};
  const inventory=make('details',{class:'settings-details'});inventory.append(make('summary',{},'Snapshot and connection'));
  for(const id of ['memory-inventory','connection-panel','graph-counts','motion-status','collision-status'])inventory.append($(id));
  inspector.append(inventory);
  const header=make('header',{id:'universe-header'}),title=make('h1',{},'2nd Brain');
  header.append(title,$('view-controls'));
  const inspect=make('button',{type:'button',id:'inspector-toggle','aria-expanded':'false','aria-controls':'memory-inspector'},'Inspector');
  inspect.onclick=()=>{inspector.hidden=!inspector.hidden;inspect.setAttribute('aria-expanded',String(!inspector.hidden));};
  header.append(inspect);document.body.prepend(header);

  const panel=make('div',{id:'source-panel','aria-label':'Sources and scene controls'});
  panel.append(make('h2',{},'Demonstration universe'),make('p',{class:'source-intro'},'Invented records and connections for exploring the viewer.'));
  const totals=make('p',{id:'source-totals','aria-live':'polite'});panel.append(totals);
  const find=make('details',{id:'source-search'});find.append(make('summary',{},'Find a record'),document.querySelector('section[aria-label="Find nodes"]'));panel.append(find);
  const group=make('fieldset',{id:'source-toggles'});group.append(make('legend',{},'Sources'));
  for(const source of sources){
    const amount=data.nodes.filter(n=>sourceId(n)===source.id).length;
    const label=make('label',{class:'source-row'}),check=make('input',{type:'checkbox',value:source.id,checked:'','aria-label':source.name});
    check.style.accentColor=source.colour;
    label.append(check,make('span',{},source.name),make('span',{class:'source-count'},amount.toLocaleString('en-AU')));
    check.onchange=()=>{if(check.checked)active.add(source.id);else active.delete(source.id);actions.refresh();};group.append(label);
  }
  panel.append(group);
  const view=make('details',{id:'source-scene'});view.append(make('summary',{},'Scene and layout'));
  for(const [id,label] of [['background-preset','Background'],['layout-preset','Arrangement']]){
    const select=$(id).cloneNode(true);select.id=id+'-quick';
    view.append(make('label',{for:select.id},label),select);
    select.onchange=()=>{$(id).value=select.value;$(id).dispatchEvent(new Event('change'));};
  }
  const linkFootnote=make('p',{class:'source-footnote'},'Links hidden. Select a node to inspect its source and connections.');
  panel.append(view,linkFootnote);
  document.body.append(panel);

  const captions=make('div',{id:'source-captions','aria-hidden':'true'});$('graph-stage').append(captions);
  const captionNodes=new Map(sources.map(s=>{const el=make('span',{class:'source-caption'},s.name);el.style.setProperty('--source-colour',s.colour);captions.append(el);return [s.id,el];}));
  const recordLabels=new Map(recordHubs(data.nodes).map(id=>{const n=data.nodes.find(n=>n.id===id),el=make('span',{class:'record-caption',title:n.label},n.label);captions.append(el);return [id,el];}));
  const shortNames={notes:'Notes',memory:'Memory',conversations:'Conversations',sessions:'Sessions',graph:'Knowledge graph',mirrors:'Mirrors',agents:'Agents',archive:'Archive'};
  const empty=make('div',{id:'source-empty',hidden:'',role:'status'});empty.append(make('h2',{},'No records shown'),make('p',{},'Choose a source or reset the filters.'));
  const reset=make('button',{type:'button'},'Show all sources');empty.append(reset);$('graph-stage').append(empty);
  reset.onclick=()=>{sources.forEach(s=>active.add(s.id));group.querySelectorAll('input').forEach(n=>n.checked=true);$('record-scope').value='all';$('record-scope').dispatchEvent(new Event('change'));actions.refresh();};
  const vector=new THREE.Vector3();
  let indexedNodes,sourceGroups,recordIndices;
  return {
    visible:n=>active.has(sourceId(n)),
    selected(n){if(n){if(!active.has(sourceId(n))){active.add(sourceId(n));group.querySelector('input[value="'+sourceId(n)+'"]').checked=true;actions.refresh();}inspector.hidden=false;inspect.setAttribute('aria-expanded','true');}},
    syncSettings(settings){
      $('background-preset-quick').value=settings.background;$('layout-preset-quick').value=settings.layout;
      const text={off:'Links hidden. Select a node to inspect its source and connections.',selected:'Only the selected node’s connections are shown.',overview:'Overview links shown. Select a node to highlight its connections.',all:'All links shown. Select a node to highlight its connections.'}[settings.links];
      if(linkFootnote.textContent!==text)linkFootnote.textContent=text;
    },
    updateCounts(visible){const shown=data.nodes.filter(visible),ids=new Set(shown.map(n=>n.id));const links=data.edges.filter(e=>ids.has(e.from)&&ids.has(e.to)).length;totals.textContent=shown.length.toLocaleString('en-AU')+(shown.length===data.nodes.length?' records':' of '+data.nodes.length.toLocaleString('en-AU')+' records')+' · '+links.toLocaleString('en-AU')+' links';empty.hidden=shown.length>0;},
    updateLabels(camera,nodes,visibility,layout,revealed){
      const show=layout==='atlas'&&revealed>.96;
      captions.hidden=!show;if(!show)return;
      if(indexedNodes!==nodes){
        indexedNodes=nodes;sourceGroups=new Map(sources.map(s=>[s.id,[]]));
        const indices=new Map();
        nodes.forEach((n,i)=>{sourceGroups.get(sourceId(n))?.push(i);indices.set(n.id,i);});
        recordIndices=new Map([...recordLabels.keys()].map(id=>[id,indices.get(id)]));
      }
      const width=$('graph-stage').clientWidth,height=$('graph-stage').clientHeight,mobile=width<=760;
      const occupied=[];
      const place=(label,x,y,record=false)=>{
        const w=Math.min(220,label.textContent.length*(mobile?5.7:6.4)+16),h=record?22:25;
        const left=mobile?12:284,minY=mobile?132:96,maxY=height-32;
        if(record){
          // Record names stay beside their actual nodes. If every adjacent
          // position collides, inspection remains available through the node.
          const candidates=[[x+w/2+10,y],[x-w/2-10,y],[x,y-22],[x,y+22]];
          for(const [cx,cy] of candidates){
            if(cx-w/2<left||cx+w/2>width-12||cy<minY||cy>maxY)continue;
            if(occupied.some(r=>Math.abs(r.x-cx)<(r.w+w)/2+5&&Math.abs(r.y-cy)<(r.h+h)/2+4))continue;
            occupied.push({x:cx,y:cy,w,h});label.style.left=cx+'px';label.style.top=cy+'px';label.hidden=false;return;
          }
          label.hidden=true;return;
        }
        x=Math.max(left+w/2,Math.min(width-12-w/2,x));
        y=Math.max(minY,Math.min(maxY,y));
        const offsets=[0,28,-28,56,-56,84,-84,112,-112,140,-140];
        for(const offset of offsets){
          const cy=y+offset;if(cy<minY||cy>maxY)continue;
          if(occupied.some(r=>Math.abs(r.x-x)<(r.w+w)/2+5&&Math.abs(r.y-cy)<(r.h+h)/2+4))continue;
          occupied.push({x,y:cy,w,h});label.style.left=x+'px';label.style.top=cy+'px';label.hidden=false;return;
        }
        label.hidden=true;
      };
      for(const source of sources){
        const label=captionNodes.get(source.id);
        const caption=mobile?shortNames[source.id]:source.name;if(label.textContent!==caption)label.textContent=caption;
        let count=0,xSum=0,ySum=0,zSum=0;
        for(const i of sourceGroups.get(source.id)){if(!visibility[i])continue;const n=nodes[i];xSum+=n.x;ySum+=n.y;zSum+=n.z;count++;}
        if(!count){label.hidden=true;continue;}
        vector.set(xSum/count,ySum/count+36+Math.cbrt(count)*14,zSum/count).project(camera);
        const x=(vector.x*.5+.5)*width,y=(-vector.y*.5+.5)*height;
        label.hidden=vector.z<0||vector.z>1||x<-120||x>width+120||y<-120||y>height+120;
        if(!label.hidden)place(label,x,y);
      }
      for(const [id,label] of recordLabels){
        const i=recordIndices.get(id),n=nodes[i];
        if(!n||!visibility[i]||(mobile&&!['agent','note'].includes(n.kind))){label.hidden=true;continue;}
        vector.set(n.x,n.y,n.z).project(camera);
        const x=(vector.x*.5+.5)*width,y=(-vector.y*.5+.5)*height;
        label.hidden=vector.z<0||vector.z>1||x<0||x>width||y<70||y>height-25;
        if(!label.hidden)place(label,x,y,true);
      }
    }
  };
}
