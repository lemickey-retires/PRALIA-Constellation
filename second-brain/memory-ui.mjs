const $=id=>document.getElementById(id);
const kindNames={agent:'Agent',builtin:'Compact Hermes memory',fact:'Saved memory',observation:'Reported conversation',summary:'Model-generated summary','graph-node':'Stored graph entity','graph-edge':'Stored graph assertion','memory-relation':'Stored memory relationship',lesson:'Model-extracted lesson',crystal:'Consolidated summary',semantic:'Semantic memory record',procedure:'Procedural memory record',session:'Session record',note:'Obsidian note',mirror:'Generated mirror',archive:'Archived note','test-note':'Integration test note'};
const relationNames={loads_memory:'loads compact memory',recorded_in:'recorded in session',mirrors:'mirrors this record',links_to:'links to',guided_to:'guided to',relationship_sources:'relationship evidence',conflicts_with:'conflicts with',maintains:'maintains',describes:'describes',supports:'supports',derived_from:'extraction input',summary_input:'covered summary input',excluded_summary_input:'excluded from summary',previous_version:'previous version',supersedes_record:'supersedes stored version',recorded_related_id:'recorded related ID',relationship_source:'relationship source',relationship_target:'relationship target'};
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
const localDate=v=>new Intl.DateTimeFormat('en-AU',{dateStyle:'medium',timeStyle:'short',timeZone:'Australia/Brisbane'}).format(new Date(v))+' Brisbane';
export function describeModelProcessing(processing={}){
  const attempt=processing.currentAttempt||processing.lastQuotaEvent;
  const describe=(value,historical=false)=>{
    const prefix=historical?'Historical model result:':'Model processing: the last recorded';
    const provider=value.provider||'provider';
    const model=value.model?` (${value.model})`:'';
    const when=value.observedAt&&Number.isFinite(Date.parse(value.observedAt))?`, ${localDate(value.observedAt)}`:'';
    if(value.lastAttemptStatus==='passed')return `${prefix} ${provider}${model} request passed${when}. This records that request, not current quota or unlimited availability.`;
    if(value.httpStatus===429||String(value.lastAttemptStatus||'').includes('quota'))return `${prefix} ${provider}${model} request reached its quota${value.httpStatus?` (HTTP ${value.httpStatus})`:''}${when}. ${value.summarySavedByAttempt===false?'That attempt saved no summary. ':''}This is the recorded outcome, not a new model probe.`;
    return `${prefix} ${provider}${model} request has status ${value.lastAttemptStatus||'unrecorded'}${when}. API connectivity does not confirm model availability.`;
  };
  const parts=[attempt?describe(attempt):'Model processing has no separate verified request result in this snapshot.'];
  const derived=processing.derivedRebuild;
  if(derived?.status==='passed'){
    const summaries=Number(derived.summaries)||0;
    const sources=new Set(derived.graph?.sourceObservationIds||[]).size;
    parts.push(`Reviewed history backfill completed: ${summaries} session summar${summaries===1?'y':'ies'}${sources?`; graph extraction covered ${sources} verified historical observations`:''}. See individual records for coverage and uncertainty.`);
  }
  return {message:parts.join(' '),history:(processing.historicalEvents||[]).map(value=>describe(value,true))};
}
export function graphConfidenceNotes(record){
  if(!['graph-node','graph-edge'].includes(record.kind))return [];
  const score=record.confidenceScore;
  const notes=typeof score==='number'&&Number.isFinite(score)&&score>=0&&score<=1
    ?[`Recorded confidence: ${score}. This stored score is not an independently verified probability that the claim is true.`]
    :['Confidence not recorded.'];
  if(record.providerWeight!=null)notes.push(`Relationship weight: ${typeof record.providerWeight==='object'?JSON.stringify(record.providerWeight):record.providerWeight}. This is not a truth probability.`);
  return notes;
}
export function installMemory(data,actions){
  const inv=data.inventory, byId=new Map(data.nodes.map(n=>[n.id,n]));
  const adjacency=new Map(data.nodes.map(n=>[n.id,[]]));
  data.edges.forEach(e=>{adjacency.get(e.from).push({to:e.to,e,reverse:false});adjacency.get(e.to).push({to:e.from,e,reverse:true});});
  const team=new Set(data.nodes.filter(n=>n.kind==='agent').map(n=>n.id));
  for(const id of [...team])for(const edge of adjacency.get(id))team.add(edge.to);
  let scope='all';
  const recallKinds=['fact','observation','summary','lesson','crystal','semantic','procedure'];
  const graphKinds=['graph-node','graph-edge','memory-relation'];
  const visible=n=>scope==='all'||scope==='knowledge'&&['note','builtin'].includes(n.kind)||scope==='recall'&&recallKinds.includes(n.kind)||scope==='graph'&&graphKinds.includes(n.kind)||scope==='team'&&team.has(n.id)||scope===n.kind;
  const updateVisibleCount=()=>{const amount=data.nodes.filter(visible).length;const links=data.edges.filter(e=>visible(byId.get(e.from))&&visible(byId.get(e.to))).length;$('graph-counts').textContent=scope==='all'?`${data.nodes.length} nodes · ${data.edges.length} links`:`Showing ${amount} of ${data.nodes.length} nodes · ${links} links`;$('graph-stage').dataset.visibleNodes=String(amount);};
  const count=kind=>inv.counts[kind]||0;
  $('record-scope').options[0].textContent=`Everything · ${data.nodes.length} nodes`;
  const providerCells=[];
  const table=el('table');table.className='inventory-table';
  for(const [label,value] of [['Saved memory records',count('fact')],['Conversation observations',count('observation')],['Model summaries',count('summary')],['Obsidian notes',count('note')],['Compact memory entries',inv.builtinEntries]]){
    const tr=el('tr');tr.append(el('th',label),el('td',value.toLocaleString('en-AU')));table.append(tr);
  }
  $('memory-inventory').append(table,el('p',`${count('graph-node')} saved graph entities, ${count('graph-edge')} graph relationship records and ${count('memory-relation')} memory relationship records. ${inv.builtinEntries} compact entries live in ${inv.builtinFiles} profile memory files.`,'small muted'));
  if(inv.memoryVersionCounts)$('memory-inventory').append(el('p',`Saved memory versions: ${inv.memoryVersionCounts.current} current, ${inv.memoryVersionCounts.historical} historical${inv.memoryVersionCounts.unspecified?', '+inv.memoryVersionCounts.unspecified+' without a recorded version status':''}.`,'small muted'));
  function showConnection(value){
    $('connection-label').textContent=value.connected?'Memory API connected':'Memory API unavailable';
    $('connection-panel').classList.toggle('connected',!!value.connected);
    $('connection-detail').textContent=value.connected?'The local health and record-count requests both succeeded. This graph still shows its captured snapshot.':`Saved memories are readable, but the live API returned ${value.checks.map(c=>c.status??c.error).join(' / ')}. This view uses the saved store.`;
    $('connection-time').textContent='Checked '+localDate(value.checkedAt);
    $('connection-panel').dataset.connected=String(value.connected);
    for(const {cell,profile} of providerCells)cell.textContent=profile.provider==='agentmemory'?(value.connected?'Selected; connected':'Selected; unavailable'):(profile.provider||'Built-in only');
  }
  showConnection(inv.connection);
  const modelStatus=describeModelProcessing(inv.modelProcessing),modelMessage=modelStatus.message;
  $('connection-panel').append(el('p',modelMessage,'small muted'));
  $('check-connection').onclick=async()=>{
    const b=$('check-connection');b.disabled=true;b.textContent='Checking…';
    try{const response=await fetch('./api/connection',{cache:'no-store'});if(!response.ok)throw new Error('Preview server returned '+response.status);showConnection(await response.json());}
    catch(e){$('connection-detail').textContent='Connection check could not finish. '+e.message;}
    finally{b.disabled=false;b.textContent='Check live connection';}
  };
  const showNode=id=>{
    if(!visible(byId.get(id))){scope='all';$('record-scope').value='all';actions.refresh();updateVisibleCount();}
    actions.selectNode(id);
    $('node-info').scrollIntoView({block:'nearest',behavior:'auto'});
  };
  $('record-scope').addEventListener('change',()=>{scope=$('record-scope').value;$('search').value='';actions.refresh();updateVisibleCount();});

  const teamTable=el('table');teamTable.className='team-table';
  const head=el('tr');['Agent','Entries','Provider'].forEach(t=>head.append(el('th',t)));teamTable.append(head);
  inv.profiles.forEach(p=>{const tr=el('tr'),name=el('td'),button=el('button',p.name),cell=el('td');button.onclick=()=>showNode('agent:'+p.name);name.append(button);tr.append(name,el('td',p.memoryEntries),cell);providerCells.push({cell,profile:p});teamTable.append(tr);});
  showConnection(inv.connection);
  const routed=inv.profiles.filter(p=>p.sharedReference==='Obsidian Home').map(p=>p.name);
  $('team-access').append(teamTable,el('p',`${routed.length?routed.join(', '):'No profiles'} have a saved Obsidian reference in SOUL.md. This checks stored instructions, not whether a particular model conversation has loaded a note.`,'small muted'));
  const history=el('p',`Exact Hermes history remains separate: ${inv.profiles.reduce((t,p)=>t+(p.history.find(h=>h.kind==='sessions')?.count||0),0).toLocaleString('en-AU')} persisted sessions across ${inv.profiles.length} profiles. These are not counted as saved memory records.`,'small muted');
  $('team-access').append(history);
  const histTable=el('table');histTable.className='team-table';
  for(const p of inv.profiles){const tr=el('tr');tr.append(el('th',p.name),el('td',`${p.history.find(h=>h.kind==='sessions')?.count||0} sessions`),el('td',`${(p.history.find(h=>h.kind==='messages')?.count||0).toLocaleString('en-AU')} messages`));histTable.append(tr);}
  $('team-access').append(histTable);

  const checks=$('source-checks');
  checks.append(el('p','Captured '+localDate(inv.capturedAt),'small'),el('p',`${count('mirror')} generated mirror files, ${count('session')} AgentMemory sessions, ${count('agent')} agents, ${count('archive')} archived notes and ${count('test-note')} test notes are counted separately.`,'small muted'),el('p','One Obsidian file is counted as one note even when it contains many observations. The graph never adds a mirrored copy to the original record count.','small muted'),el('p','Source, session and mirror links are bookkeeping. Named note assertions and saved semantic relationships remain unverified claims. Inferred graph relationships are labelled separately; their saved weights are not truth probabilities.','small muted'),el('p','Newest dated AgentMemory record: '+(inv.latestProviderRecord?localDate(inv.latestProviderRecord):'none captured')+'. Newest generated mirror file: '+(inv.latestMirrorFile?localDate(inv.latestMirrorFile):'none captured')+'.','small muted'));
  const qualityLabels={historical_recovered_conversation:'Recovered historical conversations',legacy_recovery_pending:'Legacy fragments awaiting reviewed recovery',legacy_timestamp_conflict:'Legacy fragments with timestamp conflicts',legacy_unmatched_conversation:'Legacy fragments without a unique source turn',legacy_clipped_conversation:'Legacy clipped conversations',scheduled_job_wrapper:'Scheduled-job wrappers',automatic_delegation_completion:'Automatic completion notices',automatic_delegation_batch_completion:'Automatic batch completion notices',integration_test:'Historical integration-test observations',captured_conversation:'New captured conversations',bounded_conversation_capture:'Captures reaching the text limit',recovery_unverified:'Recovery records needing verification',model_summary:'Model summaries',model_summary_partial:'Model summaries with excluded inputs'};
  checks.append(el('h3','Saved content quality'));
  checks.append(el('p',modelMessage,'small muted'));
  for(const historical of modelStatus.history)checks.append(el('p',historical,'small muted'));
  for(const [key,label] of Object.entries(qualityLabels)){const amount=inv.qualityCounts?.[key]||0;if(amount)checks.append(el('p',`${label}: ${amount}`,'small muted'));}
  checks.append(el('p','Recovered text restores historical user requests and assistant claims. It does not prove that the assistant completed the work. Legacy noise remains visible with its original IDs.','small muted'));
  checks.append(el('h3',`${inv.issues.length} source reference issue${inv.issues.length===1?'':'s'}`));
  for(const issue of inv.issues)checks.append(el('p',`${issue.detail} · ${issue.source.split(/[\\/]/).pop()}:${issue.line||''}`,'small muted'));
  checks.append(el('h3','What Graphify adds'),el('p','Graphify has built this snapshot into a queryable graph. Its path and explain commands can follow these connections. Agents would need an explicit retrieval tool or skill and instructions to use it; this preview does not install that integration. This view imports existing native semantic assertions with their source IDs and uncertainty; it performs no new semantic inference.','small muted'));

  const sorted=[...data.nodes].sort((a,b)=>a.label.localeCompare(b.label));
  for(const id of ['path-from','path-to'])for(const n of sorted){const option=el('option',`${n.label} · ${kindNames[n.kind]||n.kind}`);option.value=n.id;$(id).append(option);}
  $('path-from').value='agent:Kiwi';$('path-to').value='vault:Projects/Memory Architecture - Hermes and Obsidian.md';
  const edgeLabel=e=>(relationNames[e.relation]||e.relation)+(e.edgeClass==='inferred_graph_assertion'?' · inferred / unverified':e.edgeClass==='stored_memory_assertion'?' · stored assertion':e.edgeClass==='note_assertion'?' · source assertion':'');
  function trace(){
    const from=$('path-from').value,to=$('path-to').value,parent=new Map([[from,null]]),queue=[from];
    for(let i=0;i<queue.length&&!parent.has(to);i++)for(const item of adjacency.get(queue[i]))if(!parent.has(item.to)){parent.set(item.to,{prev:queue[i],...item});queue.push(item.to);}
    const result=$('path-result');result.replaceChildren();
    if(!parent.has(to)){result.append(el('p','No recorded path exists between these records in this snapshot.'));result.dataset.hops='none';return;}
    const path=[];let current=to;while(current!==from){const step=parent.get(current);path.unshift({id:current,...step});current=step.prev;}
    result.dataset.hops=String(path.length);
    result.append(el('p',`${path.length} recorded connection${path.length===1?'':'s'}. Direction and assertion status are shown at each step.`,'small muted'));
    const start=el('button',byId.get(from).label);start.onclick=()=>showNode(from);result.append(start);
    for(const step of path){const evidence=el('p',`${step.reverse?'←':'→'} ${edgeLabel(step.e)}${step.e.line?' · source line '+step.e.line:''}`,'path-edge');evidence.title=step.e.evidence+(step.e.sourceRecordId?' · native record '+step.e.sourceRecordId:'')+(step.e.sourceObservationIds?.length?' · extraction inputs: '+step.e.sourceObservationIds.join(', '):'');const button=el('button',byId.get(step.id).label);button.onclick=()=>showNode(step.id);result.append(evidence,button);}
  }
  $('trace-path').onclick=trace;
  $('trace-kiwi').onclick=()=>{$('path-from').value='agent:Kiwi';$('path-to').value='vault:Projects/Memory Architecture - Hermes and Obsidian.md';trace();};
  return {visible,scope:()=>scope,kindName:k=>kindNames[k]||k,
    describe(n){
      $('node-source').textContent=n.source;
      const notes=[];
      if(n.qualityStatus)notes.push(qualityLabels[n.qualityStatus]||n.inferenceStatus||n.qualityStatus);
      if(n.agent&&n.agent!=='Unattributed')notes.push(`Source profile: ${n.agent}${n.agentIdSource?' ('+n.agentIdSource+')':''}`);
      if(n.coverage)notes.push(`Summary coverage: ${n.coverage.covered??'unrecorded'}${n.coverage.eligible!=null?' of '+n.coverage.eligible:''}; excluded inputs: ${n.coverage.skippedSourceObservationIds.length}. ${n.coverage.sourceIdsRecorded?'Exact supplied input IDs are recorded.':'Exact historical input IDs were not stored.'}`);
      if(n.metadata?.sourceObservationIds?.length)notes.push(`Recorded extraction inputs: ${n.metadata.sourceObservationIds.length}. These IDs trace input provenance, not proof that every input supports every claim.`);
      notes.push(...graphConfidenceNotes(n));
      if(n.qualityReason)notes.push(n.qualityReason);
      if(n.recoveryVerification)notes.push(n.recoveryVerification);
      const preview=n.content.length>1800?n.content.slice(0,1800)+'\n\nContinue in the complete source text.':n.content;
      $('node-detail').textContent=(notes.length?notes.join('\n')+'\n\n':'')+preview;
      $('open-source').href='./source?node='+encodeURIComponent(n.id);
    },
    connectionLabel(a,b){return [...new Set(adjacency.get(a).filter(x=>x.to===b).map(x=>(x.reverse?'← ':'→ ')+edgeLabel(x.e)))].join('; ');}
  };
}
