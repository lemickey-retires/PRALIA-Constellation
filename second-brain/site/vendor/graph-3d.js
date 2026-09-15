(()=>{var Tp=Object.defineProperty;var wp=(i,e)=>{for(var t in e)Tp(i,t,{get:e[t],enumerable:!0})};var ht=i=>document.getElementById(i),Nh={agent:"Agent",builtin:"Compact Hermes memory",fact:"Saved memory",observation:"Reported conversation",summary:"Model-generated summary","graph-node":"Stored graph entity","graph-edge":"Stored graph assertion","memory-relation":"Stored memory relationship",lesson:"Model-extracted lesson",crystal:"Consolidated summary",semantic:"Semantic memory record",procedure:"Procedural memory record",session:"Session record",note:"Obsidian note",mirror:"Generated mirror",archive:"Archived note","test-note":"Integration test note"},Ap={loads_memory:"loads compact memory",recorded_in:"recorded in session",mirrors:"mirrors this record",links_to:"links to",guided_to:"guided to",relationship_sources:"relationship evidence",conflicts_with:"conflicts with",maintains:"maintains",describes:"describes",supports:"supports",derived_from:"extraction input",summary_input:"covered summary input",excluded_summary_input:"excluded from summary",previous_version:"previous version",supersedes_record:"supersedes stored version",recorded_related_id:"recorded related ID",relationship_source:"relationship source",relationship_target:"relationship target"},Qe=(i,e,t)=>{let n=document.createElement(i);return e!==void 0&&(n.textContent=e),t&&(n.className=t),n},Yr=i=>new Intl.DateTimeFormat("en-AU",{dateStyle:"medium",timeStyle:"short",timeZone:"Australia/Brisbane"}).format(new Date(i))+" Brisbane";function Rp(i={}){let e=i.currentAttempt||i.lastQuotaEvent,t=(r,o=!1)=>{let a=o?"Historical model result:":"Model processing: the last recorded",l=r.provider||"provider",c=r.model?` (${r.model})`:"",u=r.observedAt&&Number.isFinite(Date.parse(r.observedAt))?`, ${Yr(r.observedAt)}`:"";return r.lastAttemptStatus==="passed"?`${a} ${l}${c} request passed${u}. This records that request, not current quota or unlimited availability.`:r.httpStatus===429||String(r.lastAttemptStatus||"").includes("quota")?`${a} ${l}${c} request reached its quota${r.httpStatus?` (HTTP ${r.httpStatus})`:""}${u}. ${r.summarySavedByAttempt===!1?"That attempt saved no summary. ":""}This is the recorded outcome, not a new model probe.`:`${a} ${l}${c} request has status ${r.lastAttemptStatus||"unrecorded"}${u}. API connectivity does not confirm model availability.`},n=[e?t(e):"Model processing has no separate verified request result in this snapshot."],s=i.derivedRebuild;if(s?.status==="passed"){let r=Number(s.summaries)||0,o=new Set(s.graph?.sourceObservationIds||[]).size;n.push(`Reviewed history backfill completed: ${r} session summar${r===1?"y":"ies"}${o?`; graph extraction covered ${o} verified historical observations`:""}. See individual records for coverage and uncertainty.`)}return{message:n.join(" "),history:(i.historicalEvents||[]).map(r=>t(r,!0))}}function Cp(i){if(!["graph-node","graph-edge"].includes(i.kind))return[];let e=i.confidenceScore,t=typeof e=="number"&&Number.isFinite(e)&&e>=0&&e<=1?[`Recorded confidence: ${e}. This stored score is not an independently verified probability that the claim is true.`]:["Confidence not recorded."];return i.providerWeight!=null&&t.push(`Relationship weight: ${typeof i.providerWeight=="object"?JSON.stringify(i.providerWeight):i.providerWeight}. This is not a truth probability.`),t}function Fh(i,e){let t=i.inventory,n=new Map(i.nodes.map(M=>[M.id,M])),s=new Map(i.nodes.map(M=>[M.id,[]]));i.edges.forEach(M=>{s.get(M.from).push({to:M.to,e:M,reverse:!1}),s.get(M.to).push({to:M.from,e:M,reverse:!0})});let r=new Set(i.nodes.filter(M=>M.kind==="agent").map(M=>M.id));for(let M of[...r])for(let B of s.get(M))r.add(B.to);let o="all",a=["fact","observation","summary","lesson","crystal","semantic","procedure"],l=["graph-node","graph-edge","memory-relation"],c=M=>o==="all"||o==="knowledge"&&["note","builtin"].includes(M.kind)||o==="recall"&&a.includes(M.kind)||o==="graph"&&l.includes(M.kind)||o==="team"&&r.has(M.id)||o===M.kind,u=()=>{let M=i.nodes.filter(c).length,B=i.edges.filter(V=>c(n.get(V.from))&&c(n.get(V.to))).length;ht("graph-counts").textContent=o==="all"?`${i.nodes.length} nodes \xB7 ${i.edges.length} links`:`Showing ${M} of ${i.nodes.length} nodes \xB7 ${B} links`,ht("graph-stage").dataset.visibleNodes=String(M)},d=M=>t.counts[M]||0;ht("record-scope").options[0].textContent=`Everything \xB7 ${i.nodes.length} nodes`;let h=[],f=Qe("table");f.className="inventory-table";for(let[M,B]of[["Saved memory records",d("fact")],["Conversation observations",d("observation")],["Model summaries",d("summary")],["Obsidian notes",d("note")],["Compact memory entries",t.builtinEntries]]){let V=Qe("tr");V.append(Qe("th",M),Qe("td",B.toLocaleString("en-AU"))),f.append(V)}ht("memory-inventory").append(f,Qe("p",`${d("graph-node")} saved graph entities, ${d("graph-edge")} graph relationship records and ${d("memory-relation")} memory relationship records. ${t.builtinEntries} compact entries live in ${t.builtinFiles} profile memory files.`,"small muted")),t.memoryVersionCounts&&ht("memory-inventory").append(Qe("p",`Saved memory versions: ${t.memoryVersionCounts.current} current, ${t.memoryVersionCounts.historical} historical${t.memoryVersionCounts.unspecified?", "+t.memoryVersionCounts.unspecified+" without a recorded version status":""}.`,"small muted"));function m(M){ht("connection-label").textContent=M.connected?"Memory API connected":"Memory API unavailable",ht("connection-panel").classList.toggle("connected",!!M.connected),ht("connection-detail").textContent=M.connected?"The local health and record-count requests both succeeded. This graph still shows its captured snapshot.":`Saved memories are readable, but the live API returned ${M.checks.map(B=>B.status??B.error).join(" / ")}. This view uses the saved store.`,ht("connection-time").textContent="Checked "+Yr(M.checkedAt),ht("connection-panel").dataset.connected=String(M.connected);for(let{cell:B,profile:V}of h)B.textContent=V.provider==="agentmemory"?M.connected?"Selected; connected":"Selected; unavailable":V.provider||"Built-in only"}m(t.connection);let y=Rp(t.modelProcessing),g=y.message;ht("connection-panel").append(Qe("p",g,"small muted")),ht("check-connection").onclick=async()=>{let M=ht("check-connection");M.disabled=!0,M.textContent="Checking\u2026";try{let B=await fetch("./api/connection",{cache:"no-store"});if(!B.ok)throw new Error("Preview server returned "+B.status);m(await B.json())}catch(B){ht("connection-detail").textContent="Connection check could not finish. "+B.message}finally{M.disabled=!1,M.textContent="Check live connection"}};let p=M=>{c(n.get(M))||(o="all",ht("record-scope").value="all",e.refresh(),u()),e.selectNode(M),ht("node-info").scrollIntoView({block:"nearest",behavior:"auto"})};ht("record-scope").addEventListener("change",()=>{o=ht("record-scope").value,ht("search").value="",e.refresh(),u()});let S=Qe("table");S.className="team-table";let I=Qe("tr");["Agent","Entries","Provider"].forEach(M=>I.append(Qe("th",M))),S.append(I),t.profiles.forEach(M=>{let B=Qe("tr"),V=Qe("td"),G=Qe("button",M.name),q=Qe("td");G.onclick=()=>p("agent:"+M.name),V.append(G),B.append(V,Qe("td",M.memoryEntries),q),h.push({cell:q,profile:M}),S.append(B)}),m(t.connection);let b=t.profiles.filter(M=>M.sharedReference==="Obsidian Home").map(M=>M.name);ht("team-access").append(S,Qe("p",`${b.length?b.join(", "):"No profiles"} have a saved Obsidian reference in SOUL.md. This checks stored instructions, not whether a particular model conversation has loaded a note.`,"small muted"));let T=Qe("p",`Exact Hermes history remains separate: ${t.profiles.reduce((M,B)=>M+(B.history.find(V=>V.kind==="sessions")?.count||0),0).toLocaleString("en-AU")} persisted sessions across ${t.profiles.length} profiles. These are not counted as saved memory records.`,"small muted");ht("team-access").append(T);let E=Qe("table");E.className="team-table";for(let M of t.profiles){let B=Qe("tr");B.append(Qe("th",M.name),Qe("td",`${M.history.find(V=>V.kind==="sessions")?.count||0} sessions`),Qe("td",`${(M.history.find(V=>V.kind==="messages")?.count||0).toLocaleString("en-AU")} messages`)),E.append(B)}ht("team-access").append(E);let R=ht("source-checks");R.append(Qe("p","Captured "+Yr(t.capturedAt),"small"),Qe("p",`${d("mirror")} generated mirror files, ${d("session")} AgentMemory sessions, ${d("agent")} agents, ${d("archive")} archived notes and ${d("test-note")} test notes are counted separately.`,"small muted"),Qe("p","One Obsidian file is counted as one note even when it contains many observations. The graph never adds a mirrored copy to the original record count.","small muted"),Qe("p","Source, session and mirror links are bookkeeping. Named note assertions and saved semantic relationships remain unverified claims. Inferred graph relationships are labelled separately; their saved weights are not truth probabilities.","small muted"),Qe("p","Newest dated AgentMemory record: "+(t.latestProviderRecord?Yr(t.latestProviderRecord):"none captured")+". Newest generated mirror file: "+(t.latestMirrorFile?Yr(t.latestMirrorFile):"none captured")+".","small muted"));let _={historical_recovered_conversation:"Recovered historical conversations",legacy_recovery_pending:"Legacy fragments awaiting reviewed recovery",legacy_timestamp_conflict:"Legacy fragments with timestamp conflicts",legacy_unmatched_conversation:"Legacy fragments without a unique source turn",legacy_clipped_conversation:"Legacy clipped conversations",scheduled_job_wrapper:"Scheduled-job wrappers",automatic_delegation_completion:"Automatic completion notices",automatic_delegation_batch_completion:"Automatic batch completion notices",integration_test:"Historical integration-test observations",captured_conversation:"New captured conversations",bounded_conversation_capture:"Captures reaching the text limit",recovery_unverified:"Recovery records needing verification",model_summary:"Model summaries",model_summary_partial:"Model summaries with excluded inputs"};R.append(Qe("h3","Saved content quality")),R.append(Qe("p",g,"small muted"));for(let M of y.history)R.append(Qe("p",M,"small muted"));for(let[M,B]of Object.entries(_)){let V=t.qualityCounts?.[M]||0;V&&R.append(Qe("p",`${B}: ${V}`,"small muted"))}R.append(Qe("p","Recovered text restores historical user requests and assistant claims. It does not prove that the assistant completed the work. Legacy noise remains visible with its original IDs.","small muted")),R.append(Qe("h3",`${t.issues.length} source reference issue${t.issues.length===1?"":"s"}`));for(let M of t.issues)R.append(Qe("p",`${M.detail} \xB7 ${M.source.split(/[\\/]/).pop()}:${M.line||""}`,"small muted"));R.append(Qe("h3","What Graphify adds"),Qe("p","Graphify has built this snapshot into a queryable graph. Its path and explain commands can follow these connections. Agents would need an explicit retrieval tool or skill and instructions to use it; this preview does not install that integration. This view imports existing native semantic assertions with their source IDs and uncertainty; it performs no new semantic inference.","small muted"));let A=[...i.nodes].sort((M,B)=>M.label.localeCompare(B.label));for(let M of["path-from","path-to"])for(let B of A){let V=Qe("option",`${B.label} \xB7 ${Nh[B.kind]||B.kind}`);V.value=B.id,ht(M).append(V)}ht("path-from").value="agent:Kiwi",ht("path-to").value="vault:Projects/Memory Architecture - Hermes and Obsidian.md";let N=M=>(Ap[M.relation]||M.relation)+(M.edgeClass==="inferred_graph_assertion"?" \xB7 inferred / unverified":M.edgeClass==="stored_memory_assertion"?" \xB7 stored assertion":M.edgeClass==="note_assertion"?" \xB7 source assertion":"");function C(){let M=ht("path-from").value,B=ht("path-to").value,V=new Map([[M,null]]),G=[M];for(let ce=0;ce<G.length&&!V.has(B);ce++)for(let pe of s.get(G[ce]))V.has(pe.to)||(V.set(pe.to,{prev:G[ce],...pe}),G.push(pe.to));let q=ht("path-result");if(q.replaceChildren(),!V.has(B)){q.append(Qe("p","No recorded path exists between these records in this snapshot.")),q.dataset.hops="none";return}let Y=[],ne=B;for(;ne!==M;){let ce=V.get(ne);Y.unshift({id:ne,...ce}),ne=ce.prev}q.dataset.hops=String(Y.length),q.append(Qe("p",`${Y.length} recorded connection${Y.length===1?"":"s"}. Direction and assertion status are shown at each step.`,"small muted"));let le=Qe("button",n.get(M).label);le.onclick=()=>p(M),q.append(le);for(let ce of Y){let pe=Qe("p",`${ce.reverse?"\u2190":"\u2192"} ${N(ce.e)}${ce.e.line?" \xB7 source line "+ce.e.line:""}`,"path-edge");pe.title=ce.e.evidence+(ce.e.sourceRecordId?" \xB7 native record "+ce.e.sourceRecordId:"")+(ce.e.sourceObservationIds?.length?" \xB7 extraction inputs: "+ce.e.sourceObservationIds.join(", "):"");let Te=Qe("button",n.get(ce.id).label);Te.onclick=()=>p(ce.id),q.append(pe,Te)}}return ht("trace-path").onclick=C,ht("trace-kiwi").onclick=()=>{ht("path-from").value="agent:Kiwi",ht("path-to").value="vault:Projects/Memory Architecture - Hermes and Obsidian.md",C()},{visible:c,scope:()=>o,kindName:M=>Nh[M]||M,describe(M){ht("node-source").textContent=M.source;let B=[];M.qualityStatus&&B.push(_[M.qualityStatus]||M.inferenceStatus||M.qualityStatus),M.agent&&M.agent!=="Unattributed"&&B.push(`Source profile: ${M.agent}${M.agentIdSource?" ("+M.agentIdSource+")":""}`),M.coverage&&B.push(`Summary coverage: ${M.coverage.covered??"unrecorded"}${M.coverage.eligible!=null?" of "+M.coverage.eligible:""}; excluded inputs: ${M.coverage.skippedSourceObservationIds.length}. ${M.coverage.sourceIdsRecorded?"Exact supplied input IDs are recorded.":"Exact historical input IDs were not stored."}`),M.metadata?.sourceObservationIds?.length&&B.push(`Recorded extraction inputs: ${M.metadata.sourceObservationIds.length}. These IDs trace input provenance, not proof that every input supports every claim.`),B.push(...Cp(M)),M.qualityReason&&B.push(M.qualityReason),M.recoveryVerification&&B.push(M.recoveryVerification);let V=M.content.length>1800?M.content.slice(0,1800)+`

Continue in the complete source text.`:M.content;ht("node-detail").textContent=(B.length?B.join(`
`)+`

`:"")+V,ht("open-source").href="./source?node="+encodeURIComponent(M.id)},connectionLabel(M,B){return[...new Set(s.get(M).filter(V=>V.to===B).map(V=>(V.reverse?"\u2190 ":"\u2192 ")+N(V.e)))].join("; ")}}}var fs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},yd=0,iu=1,bd=2;var Eo=1,Md=2,wr=3,Bn=0,en=1,Ht=2,In=0,kn=1,cn=2,su=3,ru=4,Sd=5;var us=100,Ed=101,Td=102,wd=103,Ad=104,Rd=200,Cd=201,Pd=202,Id=203,Ma=204,Sa=205,Ld=206,Dd=207,Nd=208,Fd=209,Ud=210,Od=211,zd=212,Bd=213,kd=214,Ea=0,Ta=1,wa=2,ws=3,Aa=4,Ra=5,Ca=6,Pa=7,ou=0,Hd=1,Vd=2,ri=0,To=1,wo=2,Ao=3,Ro=4,Co=5,Po=6,Io=7,Gc="attached",Gd="detached",au=300,ms=301,Os=302,Za=303,Ka=304,Lo=306,An=1e3,Zn=1001,hr=1002,Wt=1003,ja=1004;var zs=1005;var Et=1006,Ar=1007;var oi=1008;var xn=1009,lu=1010,cu=1011,Rr=1012,$a=1013,ai=1014,Hn=1015,un=1016,Ja=1017,Qa=1018,Cr=1020,uu=35902,hu=35899,du=1021,fu=1022,Vn=1023,vi=1026,gs=1027,el=1028,tl=1029,_n=1030,nl=1031;var il=1033,Do=33776,No=33777,Fo=33778,Uo=33779,sl=35840,rl=35841,ol=35842,al=35843,ll=36196,cl=37492,ul=37496,hl=37488,dl=37489,Oo=37490,fl=37491,pl=37808,ml=37809,gl=37810,vl=37811,xl=37812,_l=37813,yl=37814,bl=37815,Ml=37816,Sl=37817,El=37818,Tl=37819,wl=37820,Al=37821,Rl=36492,Cl=36494,Pl=36495,Il=36283,Ll=36284,zo=36285,Dl=36286;var As=2300,Rs=2301,ba=2302,Wc=2303,Xc=2400,qc=2401,Yc=2402,Wd=2500;var pu=0,Bo=1,Pr=2,Xd=3200;var Nl=0,qd=1,ji="",Gt="srgb",Sn="srgb-linear",so="linear",_t="srgb";var Es=7680;var Zc=519,Yd=512,Zd=513,Kd=514,Fl=515,jd=516,$d=517,Ul=518,Jd=519,Ia=35044,wi=35048;var mu="300 es",ni=2e3,dr=2001;function Pp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ip(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function fr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Qd(){let i=fr("canvas");return i.style.display="block",i}var Uh={},pr=null;function ro(...i){let e="THREE."+i.shift();pr?pr("log",e,...i):console.log(e,...i)}function ef(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ue(...i){i=ef(i);let e="THREE."+i.shift();if(pr)pr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Xe(...i){i=ef(i);let e="THREE."+i.shift();if(pr)pr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ts(...i){let e=i.join(" ");e in Uh||(Uh[e]=!0,Ue(...i))}function tf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var nf={[Ea]:Ta,[wa]:Ca,[Aa]:Pa,[ws]:Ra,[Ta]:Ea,[Ca]:wa,[Pa]:Aa,[Ra]:ws},si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Oh=1234567,no=Math.PI/180,Cs=180/Math.PI;function ii(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(pn[i&255]+pn[i>>8&255]+pn[i>>16&255]+pn[i>>24&255]+"-"+pn[e&255]+pn[e>>8&255]+"-"+pn[e>>16&15|64]+pn[e>>24&255]+"-"+pn[t&63|128]+pn[t>>8&255]+"-"+pn[t>>16&255]+pn[t>>24&255]+pn[n&255]+pn[n>>8&255]+pn[n>>16&255]+pn[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function gu(i,e){return(i%e+e)%e}function Lp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Dp(i,e,t){return i!==e?(t-i)/(e-i):0}function io(i,e,t){return(1-t)*i+t*e}function Np(i,e,t,n){return io(i,e,1-Math.exp(-t*n))}function Fp(i,e=1){return e-Math.abs(gu(i,e*2)-e)}function Up(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Op(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function zp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Bp(i,e){return i+Math.random()*(e-i)}function kp(i){return i*(.5-Math.random())}function Hp(i){i!==void 0&&(Oh=i);let e=Oh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vp(i){return i*no}function Gp(i){return i*Cs}function Wp(i){return(i&i-1)===0&&i!==0}function Xp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function qp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Yp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*u,a*c);break;default:Ue("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ti(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Rt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var $i={DEG2RAD:no,RAD2DEG:Cs,generateUUID:ii,clamp:nt,euclideanModulo:gu,mapLinear:Lp,inverseLerp:Dp,lerp:io,damp:Np,pingpong:Fp,smoothstep:Up,smootherstep:Op,randInt:zp,randFloat:Bp,randFloatSpread:kp,seededRandom:Hp,degToRad:Vp,radToDeg:Gp,isPowerOfTwo:Wp,ceilPowerOfTwo:Xp,floorPowerOfTwo:qp,setQuaternionFromProperEuler:Yp,normalize:Rt,denormalize:ti},ye=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Bt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],f=r[o+1],m=r[o+2],y=r[o+3];if(d!==y||l!==h||c!==f||u!==m){let g=l*h+c*f+u*m+d*y;g<0&&(h=-h,f=-f,m=-m,y=-y,g=-g);let p=1-a;if(g<.9995){let S=Math.acos(g),I=Math.sin(S);p=Math.sin(p*S)/I,a=Math.sin(a*S)/I,l=l*p+h*a,c=c*p+f*a,u=u*p+m*a,d=d*p+y*a}else{l=l*p+h*a,c=c*p+f*a,u=u*p+m*a,d=d*p+y*a;let S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+u*d+l*f-c*h,e[t+1]=l*m+u*h+c*d-a*f,e[t+2]=c*m+u*f+a*h-l*d,e[t+3]=u*m-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),h=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d-h*f*m;break;case"YXZ":this._x=h*u*d+c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d+h*f*m;break;case"ZXY":this._x=h*u*d-c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d-h*f*m;break;case"ZYX":this._x=h*u*d-c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d+h*f*m;break;case"YZX":this._x=h*u*d+c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d-h*f*m;break;case"XZY":this._x=h*u*d-c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d+h*f*m;break;default:Ue("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vc.copy(this).projectOnVector(e),this.sub(vc)}reflect(e){return this.sub(vc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vc=new D,zh=new Bt,Ze=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],m=n[8],y=s[0],g=s[3],p=s[6],S=s[1],I=s[4],b=s[7],T=s[2],E=s[5],R=s[8];return r[0]=o*y+a*S+l*T,r[3]=o*g+a*I+l*E,r[6]=o*p+a*b+l*R,r[1]=c*y+u*S+d*T,r[4]=c*g+u*I+d*E,r[7]=c*p+u*b+d*R,r[2]=h*y+f*S+m*T,r[5]=h*g+f*I+m*E,r[8]=h*p+f*b+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,m=t*d+n*h+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=d*y,e[1]=(s*c-u*n)*y,e[2]=(a*n-s*o)*y,e[3]=h*y,e[4]=(u*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(xc.makeScale(e,t)),this}rotate(e){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(xc.makeRotation(-e)),this}translate(e,t){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(xc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xc=new Ze,Bh=new Ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kh=new Ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Zp(){let i={enabled:!0,workingColorSpace:Sn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===_t&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_t&&(s.r=ur(s.r),s.g=ur(s.g),s.b=ur(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ji?so:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Sn]:{primaries:e,whitePoint:n,transfer:so,toXYZ:Bh,fromXYZ:kh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:e,whitePoint:n,transfer:_t,toXYZ:Bh,fromXYZ:kh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}}),i}var tt=Zp();function zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ur(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var js,La=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{js===void 0&&(js=fr("canvas")),js.width=e.width,js.height=e.height;let s=js.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=js}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=fr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=zi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(zi(t[n]/255)*255):t[n]=zi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Kp=0,mr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=ii(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(_c(s[o].image)):r.push(_c(s[o]))}else r=_c(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function _c(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?La.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ue("Texture: Unable to serialize Texture."),{})}var jp=0,yc=new D,ln=class i extends si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Zn,s=Zn,r=Et,o=oi,a=Vn,l=xn,c=i.DEFAULT_ANISOTROPY,u=ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=ii(),this.name="",this.source=new mr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(yc).x}get height(){return this.source.getSize(yc).y}get depth(){return this.source.getSize(yc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ue(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==au)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case An:e.x=e.x-Math.floor(e.x);break;case Zn:e.x=e.x<0?0:1;break;case hr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case An:e.y=e.y-Math.floor(e.y);break;case Zn:e.y=e.y<0?0:1;break;case hr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=au;ln.DEFAULT_ANISOTROPY=1;var mt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let I=(c+1)/2,b=(f+1)/2,T=(p+1)/2,E=(u+h)/4,R=(d+y)/4,_=(m+g)/4;return I>b&&I>T?I<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(I),s=E/n,r=R/n):b>T?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=E/s,r=_/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=R/r,s=_/r),this.set(n,s,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(d-y)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Da=class extends si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new ln(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new mr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xt=class extends Da{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},oo=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var gr=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ge=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,l,c,u,d,h,f,m,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,d,h,f,m,y,g)}set(e,t,n,s,r,o,a,l,c,u,d,h,f,m,y,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/$s.setFromMatrixColumn(e,0).length(),r=1/$s.setFromMatrixColumn(e,1).length(),o=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=o*u,f=o*d,m=a*u,y=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+m*c,t[5]=h-y*c,t[9]=-a*l,t[2]=y-h*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,m=c*u,y=c*d;t[0]=h+y*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-m,t[6]=y+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,m=c*u,y=c*d;t[0]=h-y*a,t[4]=-o*d,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*u,t[9]=y-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*u,f=o*d,m=a*u,y=a*d;t[0]=l*u,t[4]=m*c-f,t[8]=h*c+y,t[1]=l*d,t[5]=y*c+h,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,f=o*c,m=a*l,y=a*c;t[0]=l*u,t[4]=y-h*d,t[8]=m*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+m,t[10]=h-y*d}else if(e.order==="XZY"){let h=o*l,f=o*c,m=a*l,y=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+y,t[5]=o*u,t[9]=f*d-m,t[2]=m*d-f,t[6]=a*u,t[10]=y*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($p,e,Jp)}lookAt(e,t,n){let s=this.elements;return On.subVectors(e,t),On.lengthSq()===0&&(On.z=1),On.normalize(),is.crossVectors(n,On),is.lengthSq()===0&&(Math.abs(n.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),is.crossVectors(n,On)),is.normalize(),Ko.crossVectors(On,is),s[0]=is.x,s[4]=Ko.x,s[8]=On.x,s[1]=is.y,s[5]=Ko.y,s[9]=On.y,s[2]=is.z,s[6]=Ko.z,s[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],m=n[2],y=n[6],g=n[10],p=n[14],S=n[3],I=n[7],b=n[11],T=n[15],E=s[0],R=s[4],_=s[8],A=s[12],N=s[1],C=s[5],M=s[9],B=s[13],V=s[2],G=s[6],q=s[10],Y=s[14],ne=s[3],le=s[7],ce=s[11],pe=s[15];return r[0]=o*E+a*N+l*V+c*ne,r[4]=o*R+a*C+l*G+c*le,r[8]=o*_+a*M+l*q+c*ce,r[12]=o*A+a*B+l*Y+c*pe,r[1]=u*E+d*N+h*V+f*ne,r[5]=u*R+d*C+h*G+f*le,r[9]=u*_+d*M+h*q+f*ce,r[13]=u*A+d*B+h*Y+f*pe,r[2]=m*E+y*N+g*V+p*ne,r[6]=m*R+y*C+g*G+p*le,r[10]=m*_+y*M+g*q+p*ce,r[14]=m*A+y*B+g*Y+p*pe,r[3]=S*E+I*N+b*V+T*ne,r[7]=S*R+I*C+b*G+T*le,r[11]=S*_+I*M+b*q+T*ce,r[15]=S*A+I*B+b*Y+T*pe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],m=e[3],y=e[7],g=e[11],p=e[15],S=l*f-c*h,I=a*f-c*d,b=a*h-l*d,T=o*f-c*u,E=o*h-l*u,R=o*d-a*u;return t*(y*S-g*I+p*b)-n*(m*S-g*T+p*E)+s*(m*I-y*T+p*R)-r*(m*b-y*E+g*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-n*(r*u-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],m=e[12],y=e[13],g=e[14],p=e[15],S=t*a-n*o,I=t*l-s*o,b=t*c-r*o,T=n*l-s*a,E=n*c-r*a,R=s*c-r*l,_=u*y-d*m,A=u*g-h*m,N=u*p-f*m,C=d*g-h*y,M=d*p-f*y,B=h*p-f*g,V=S*B-I*M+b*C+T*N-E*A+R*_;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/V;return e[0]=(a*B-l*M+c*C)*G,e[1]=(s*M-n*B-r*C)*G,e[2]=(y*R-g*E+p*T)*G,e[3]=(h*E-d*R-f*T)*G,e[4]=(l*N-o*B-c*A)*G,e[5]=(t*B-s*N+r*A)*G,e[6]=(g*b-m*R-p*I)*G,e[7]=(u*R-h*b+f*I)*G,e[8]=(o*M-a*N+c*_)*G,e[9]=(n*N-t*M-r*_)*G,e[10]=(m*E-y*b+p*S)*G,e[11]=(d*b-u*E-f*S)*G,e[12]=(a*A-o*C-l*_)*G,e[13]=(t*C-n*A+s*_)*G,e[14]=(y*I-m*T-g*S)*G,e[15]=(u*T-d*I+h*S)*G,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,m=r*d,y=o*u,g=o*d,p=a*d,S=l*c,I=l*u,b=l*d,T=n.x,E=n.y,R=n.z;return s[0]=(1-(y+p))*T,s[1]=(f+b)*T,s[2]=(m-I)*T,s[3]=0,s[4]=(f-b)*E,s[5]=(1-(h+p))*E,s[6]=(g+S)*E,s[7]=0,s[8]=(m+I)*R,s[9]=(g-S)*R,s[10]=(1-(h+y))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=$s.set(s[0],s[1],s[2]).length(),a=$s.set(s[4],s[5],s[6]).length(),l=$s.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Jn.copy(this);let c=1/o,u=1/a,d=1/l;return Jn.elements[0]*=c,Jn.elements[1]*=c,Jn.elements[2]*=c,Jn.elements[4]*=u,Jn.elements[5]*=u,Jn.elements[6]*=u,Jn.elements[8]*=d,Jn.elements[9]*=d,Jn.elements[10]*=d,t.setFromRotationMatrix(Jn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=ni,l=!1){let c=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s),m,y;if(l)m=r/(o-r),y=o*r/(o-r);else if(a===ni)m=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===dr)m=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=ni,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s),m,y;if(l)m=1/(o-r),y=o/(o-r);else if(a===ni)m=-2/(o-r),y=-(o+r)/(o-r);else if(a===dr)m=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},$s=new D,Jn=new Ge,$p=new D(0,0,0),Jp=new D(1,1,1),is=new D,Ko=new D,On=new D,Hh=new Ge,Vh=new Bt,Rn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vh.setFromEuler(this),this.setFromQuaternion(Vh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";var vr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Qp=0,Gh=new D,Js=new Bt,Li=new Ge,jo=new D,Zr=new D,em=new D,tm=new Bt,Wh=new D(1,0,0),Xh=new D(0,1,0),qh=new D(0,0,1),Yh={type:"added"},nm={type:"removed"},Qs={type:"childadded",child:null},bc={type:"childremoved",child:null},kt=class i extends si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Rn,n=new Bt,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ge},normalMatrix:{value:new Ze}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Js.setFromAxisAngle(e,t),this.quaternion.multiply(Js),this}rotateOnWorldAxis(e,t){return Js.setFromAxisAngle(e,t),this.quaternion.premultiply(Js),this}rotateX(e){return this.rotateOnAxis(Wh,e)}rotateY(e){return this.rotateOnAxis(Xh,e)}rotateZ(e){return this.rotateOnAxis(qh,e)}translateOnAxis(e,t){return Gh.copy(e).applyQuaternion(this.quaternion),this.position.add(Gh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wh,e)}translateY(e){return this.translateOnAxis(Xh,e)}translateZ(e){return this.translateOnAxis(qh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jo.copy(e):jo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(Zr,jo,this.up):Li.lookAt(jo,Zr,this.up),this.quaternion.setFromRotationMatrix(Li),s&&(Li.extractRotation(s.matrixWorld),Js.setFromRotationMatrix(Li),this.quaternion.premultiply(Js.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Xe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yh),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null):Xe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nm),bc.child=e,this.dispatchEvent(bc),bc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yh),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,e,em),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,tm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};kt.DEFAULT_UP=new D(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var an=class extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}},im={type:"move"},xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,n),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&h>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(im)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new an;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ss={h:0,s:0,l:0},$o={h:0,s:0,l:0};function Mc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var we=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=gu(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Mc(o,r,e+1/3),this.g=Mc(o,r,e),this.b=Mc(o,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Gt){function n(r){r!==void 0&&parseFloat(r)<1&&Ue("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ue("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){let n=sf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=ur(e.r),this.g=ur(e.g),this.b=ur(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return tt.workingToColorSpace(mn.copy(this),e),Math.round(nt(mn.r*255,0,255))*65536+Math.round(nt(mn.g*255,0,255))*256+Math.round(nt(mn.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(mn.copy(this),t);let n=mn.r,s=mn.g,r=mn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=Gt){tt.workingToColorSpace(mn.copy(this),e);let t=mn.r,n=mn.g,s=mn.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ss),this.setHSL(ss.h+e,ss.s+t,ss.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ss),e.getHSL($o);let n=io(ss.h,$o.h,t),s=io(ss.s,$o.s,t),r=io(ss.l,$o.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mn=new we;we.NAMES=sf;var Ps=class extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Qn=new D,Di=new D,Sc=new D,Ni=new D,er=new D,tr=new D,Zh=new D,Ec=new D,Tc=new D,wc=new D,Ac=new mt,Rc=new mt,Cc=new mt,cs=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Qn.subVectors(e,t),s.cross(Qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Qn.subVectors(s,t),Di.subVectors(n,t),Sc.subVectors(e,t);let o=Qn.dot(Qn),a=Qn.dot(Di),l=Qn.dot(Sc),c=Di.dot(Di),u=Di.dot(Sc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,m=(o*u-a*l)*h;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ni)===null?!1:Ni.x>=0&&Ni.y>=0&&Ni.x+Ni.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ni.x),l.addScaledVector(o,Ni.y),l.addScaledVector(a,Ni.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ac.setScalar(0),Rc.setScalar(0),Cc.setScalar(0),Ac.fromBufferAttribute(e,t),Rc.fromBufferAttribute(e,n),Cc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ac,r.x),o.addScaledVector(Rc,r.y),o.addScaledVector(Cc,r.z),o}static isFrontFacing(e,t,n,s){return Qn.subVectors(n,t),Di.subVectors(e,t),Qn.cross(Di).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Qn.subVectors(this.c,this.b),Di.subVectors(this.a,this.b),Qn.cross(Di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;er.subVectors(s,n),tr.subVectors(r,n),Ec.subVectors(e,n);let l=er.dot(Ec),c=tr.dot(Ec);if(l<=0&&c<=0)return t.copy(n);Tc.subVectors(e,s);let u=er.dot(Tc),d=tr.dot(Tc);if(u>=0&&d<=u)return t.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(er,o);wc.subVectors(e,r);let f=er.dot(wc),m=tr.dot(wc);if(m>=0&&f<=m)return t.copy(r);let y=f*c-l*m;if(y<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(tr,a);let g=u*m-f*d;if(g<=0&&d-u>=0&&f-m>=0)return Zh.subVectors(r,s),a=(d-u)/(d-u+(f-m)),t.copy(s).addScaledVector(Zh,a);let p=1/(g+y+h);return o=y*p,a=h*p,t.copy(n).addScaledVector(er,o).addScaledVector(tr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},En=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ei):ei.fromBufferAttribute(r,o),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jo.copy(n.boundingBox)),Jo.applyMatrix4(e.matrixWorld),this.union(Jo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Kr),Qo.subVectors(this.max,Kr),nr.subVectors(e.a,Kr),ir.subVectors(e.b,Kr),sr.subVectors(e.c,Kr),rs.subVectors(ir,nr),os.subVectors(sr,ir),ys.subVectors(nr,sr);let t=[0,-rs.z,rs.y,0,-os.z,os.y,0,-ys.z,ys.y,rs.z,0,-rs.x,os.z,0,-os.x,ys.z,0,-ys.x,-rs.y,rs.x,0,-os.y,os.x,0,-ys.y,ys.x,0];return!Pc(t,nr,ir,sr,Qo)||(t=[1,0,0,0,1,0,0,0,1],!Pc(t,nr,ir,sr,Qo))?!1:(ea.crossVectors(rs,os),t=[ea.x,ea.y,ea.z],Pc(t,nr,ir,sr,Qo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Fi=[new D,new D,new D,new D,new D,new D,new D,new D],ei=new D,Jo=new En,nr=new D,ir=new D,sr=new D,rs=new D,os=new D,ys=new D,Kr=new D,Qo=new D,ea=new D,bs=new D;function Pc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){bs.fromArray(i,r);let a=s.x*Math.abs(bs.x)+s.y*Math.abs(bs.y)+s.z*Math.abs(bs.z),l=e.dot(bs),c=t.dot(bs),u=n.dot(bs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var $t=new D,ta=new ye,sm=0,Ct=class extends si{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:sm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ia,this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ta.fromBufferAttribute(this,t),ta.applyMatrix3(e),this.setXY(t,ta.x,ta.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix3(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ti(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ti(t,this.array)),t}setX(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ti(t,this.array)),t}setY(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ti(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ti(t,this.array)),t}setW(e,t){return this.normalized&&(t=Rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),s=Rt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),s=Rt(s,this.array),r=Rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ia&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var ao=class extends Ct{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var lo=class extends Ct{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var yt=class extends Ct{constructor(e,t,n){super(new Float32Array(e),t,n)}},rm=new En,jr=new D,Ic=new D,gn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):rm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;jr.subVectors(e,this.center);let t=jr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(jr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ic.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(jr.copy(e.center).add(Ic)),this.expandByPoint(jr.copy(e.center).sub(Ic))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},om=0,Yn=new Ge,Lc=new kt,rr=new D,zn=new En,$r=new En,on=new D,Tt=class i extends si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pp(e)?lo:ao)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,t,n){return Yn.makeTranslation(e,t,n),this.applyMatrix4(Yn),this}scale(e,t,n){return Yn.makeScale(e,t,n),this.applyMatrix4(Yn),this}lookAt(e){return Lc.lookAt(e),Lc.updateMatrix(),this.applyMatrix4(Lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rr).negate(),this.translate(rr.x,rr.y,rr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new yt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];zn.setFromBufferAttribute(r),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,zn.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,zn.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(zn.min),this.boundingBox.expandByPoint(zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(zn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];$r.setFromBufferAttribute(a),this.morphTargetsRelative?(on.addVectors(zn.min,$r.min),zn.expandByPoint(on),on.addVectors(zn.max,$r.max),zn.expandByPoint(on)):(zn.expandByPoint($r.min),zn.expandByPoint($r.max))}zn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)on.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(on));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)on.fromBufferAttribute(a,c),l&&(rr.fromBufferAttribute(e,c),on.add(rr)),s=Math.max(s,n.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Xe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Xe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ct(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new D,l[_]=new D;let c=new D,u=new D,d=new D,h=new ye,f=new ye,m=new ye,y=new D,g=new D;function p(_,A,N){c.fromBufferAttribute(n,_),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,N),h.fromBufferAttribute(r,_),f.fromBufferAttribute(r,A),m.fromBufferAttribute(r,N),u.sub(c),d.sub(c),f.sub(h),m.sub(h);let C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(y.copy(u).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(C),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(C),a[_].add(y),a[A].add(y),a[N].add(y),l[_].add(g),l[A].add(g),l[N].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let _=0,A=S.length;_<A;++_){let N=S[_],C=N.start,M=N.count;for(let B=C,V=C+M;B<V;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let I=new D,b=new D,T=new D,E=new D;function R(_){T.fromBufferAttribute(s,_),E.copy(T);let A=a[_];I.copy(A),I.sub(T.multiplyScalar(T.dot(A))).normalize(),b.crossVectors(E,A);let C=b.dot(l[_])<0?-1:1;o.setXYZW(_,I.x,I.y,I.z,C)}for(let _=0,A=S.length;_<A;++_){let N=S[_],C=N.start,M=N.count;for(let B=C,V=C+M;B<V;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ct(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,u=new D,d=new D;if(e)for(let h=0,f=e.count;h<f;h+=3){let m=e.getX(h+0),y=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,g),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,g),a.add(u),l.add(u),c.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)on.fromBufferAttribute(e,t),on.normalize(),e.setXYZ(t,on.x,on.y,on.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,m=0;for(let y=0,g=l.length;y<g;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*u;for(let p=0;p<u;p++)h[m++]=c[f++]}return new Ct(h,u,d)}if(this.index===null)return Ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},_r=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ia,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Mn=new D,yr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.applyMatrix4(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.applyNormalMatrix(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.transformDirection(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ti(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ti(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ti(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ti(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ti(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),s=Rt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Rt(t,this.array),n=Rt(n,this.array),s=Rt(s,this.array),r=Rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ro("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ct(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ro("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},am=0,Cn=class extends si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=ii(),this.name="",this.type="Material",this.blending=kn,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=Sa,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new we(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ue(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==kn&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==us&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new we().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ye().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ye().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Ui=new D,Dc=new D,na=new D,as=new D,Nc=new D,ia=new D,Fc=new D,xi=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ui.copy(this.origin).addScaledVector(this.direction,t),Ui.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Dc.copy(e).add(t).multiplyScalar(.5),na.copy(t).sub(e).normalize(),as.copy(this.origin).sub(Dc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(na),a=as.dot(this.direction),l=-as.dot(na),c=as.lengthSq(),u=Math.abs(1-o*o),d,h,f,m;if(u>0)if(d=o*l-a,h=o*a-l,m=r*u,d>=0)if(h>=-m)if(h<=m){let y=1/u;d*=y,h*=y,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-m?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=m?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Dc).addScaledVector(na,h),f}intersectSphere(e,t){Ui.subVectors(e.center,this.origin);let n=Ui.dot(this.direction),s=Ui.dot(Ui)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ui)!==null}intersectTriangle(e,t,n,s,r){Nc.subVectors(t,e),ia.subVectors(n,e),Fc.crossVectors(Nc,ia);let o=this.direction.dot(Fc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;as.subVectors(this.origin,e);let l=a*this.direction.dot(ia.crossVectors(as,ia));if(l<0)return null;let c=a*this.direction.dot(Nc.cross(as));if(c<0||l+c>o)return null;let u=-a*as.dot(Fc);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},qt=class extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=ou,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Kh=new Ge,Ms=new xi,sa=new gn,jh=new D,ra=new D,oa=new D,aa=new D,Uc=new D,la=new D,$h=new D,ca=new D,vt=class extends kt{constructor(e=new Tt,t=new qt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){la.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(Uc.fromBufferAttribute(d,e),o?la.addScaledVector(Uc,u):la.addScaledVector(Uc.sub(t),u))}t.add(la)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(r),Ms.copy(e.ray).recast(e.near),!(sa.containsPoint(Ms.origin)===!1&&(Ms.intersectSphere(sa,jh)===null||Ms.origin.distanceToSquared(jh)>(e.far-e.near)**2))&&(Kh.copy(r).invert(),Ms.copy(e.ray).applyMatrix4(Kh),!(n.boundingBox!==null&&Ms.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ms)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,y=h.length;m<y;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),I=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let b=S,T=I;b<T;b+=3){let E=a.getX(b),R=a.getX(b+1),_=a.getX(b+2);s=ua(this,p,e,n,c,u,d,E,R,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let S=a.getX(g),I=a.getX(g+1),b=a.getX(g+2);s=ua(this,o,e,n,c,u,d,S,I,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,y=h.length;m<y;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),I=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let b=S,T=I;b<T;b+=3){let E=b,R=b+1,_=b+2;s=ua(this,p,e,n,c,u,d,E,R,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let S=g,I=g+1,b=g+2;s=ua(this,o,e,n,c,u,d,S,I,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function lm(i,e,t,n,s,r,o,a){let l;if(e.side===en?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Bn,a),l===null)return null;ca.copy(a),ca.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ca);return c<t.near||c>t.far?null:{distance:c,point:ca.clone(),object:i}}function ua(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ra),i.getVertexPosition(l,oa),i.getVertexPosition(c,aa);let u=lm(i,e,t,n,ra,oa,aa,$h);if(u){let d=new D;cs.getBarycoord($h,ra,oa,aa,d),s&&(u.uv=cs.getInterpolatedAttribute(s,a,l,c,d,new ye)),r&&(u.uv1=cs.getInterpolatedAttribute(r,a,l,c,d,new ye)),o&&(u.normal=cs.getInterpolatedAttribute(o,a,l,c,d,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new D,materialIndex:0};cs.getNormal(ra,oa,aa,h.normal),u.face=h,u.barycoord=d}return u}var Jr=new mt,Jh=new mt,Qh=new mt,cm=new mt,ed=new Ge,ha=new D,Oc=new gn,td=new Ge,zc=new xi,co=class extends vt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Gc,this.bindMatrix=new Ge,this.bindMatrixInverse=new Ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new En),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingBox.expandByPoint(ha)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new gn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingSphere.expandByPoint(ha)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Oc.copy(this.boundingSphere),Oc.applyMatrix4(s),e.ray.intersectsSphere(Oc)!==!1&&(td.copy(s).invert(),zc.copy(e.ray).applyMatrix4(td),!(this.boundingBox!==null&&zc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,zc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new mt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Gc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Gd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ue("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Jh.fromBufferAttribute(s.attributes.skinIndex,e),Qh.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Jr.copy(t),t.set(0,0,0,0)):(Jr.set(...t,1),t.set(0,0,0)),Jr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=Qh.getComponent(r);if(o!==0){let a=Jh.getComponent(r);ed.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(cm.copy(Jr).applyMatrix4(ed),o)}}return t.isVector4&&(t.w=Jr.w),t.applyMatrix4(this.bindMatrixInverse)}},br=class extends kt{constructor(){super(),this.isBone=!0,this.type="Bone"}},_i=class extends ln{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Wt,u=Wt,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},nd=new Ge,um=new Ge,uo=class i{constructor(e=[],t=[]){this.uuid=ii(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ue("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Ge;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:um;nd.multiplyMatrices(a,t[r]),nd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new _i(t,e,e,Vn,Hn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(Ue("Skeleton: No bone found with UUID:",r),o=new br),this.bones.push(o),this.boneInverses.push(new Ge().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},hs=class extends Ct{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},or=new Ge,id=new Ge,da=[],sd=new En,hm=new Ge,Qr=new vt,eo=new gn,Bi=class extends vt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new hs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,hm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new En),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),sd.copy(e.boundingBox).applyMatrix4(or),this.boundingBox.union(sd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new gn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),eo.copy(e.boundingSphere).applyMatrix4(or),this.boundingSphere.union(eo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Qr.geometry=this.geometry,Qr.material=this.material,Qr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),eo.copy(this.boundingSphere),eo.applyMatrix4(n),e.ray.intersectsSphere(eo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,or),id.multiplyMatrices(n,or),Qr.matrixWorld=id,Qr.raycast(e,da);for(let o=0,a=da.length;o<a;o++){let l=da[o];l.instanceId=r,l.object=this,t.push(l)}da.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new hs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new _i(new Float32Array(s*this.count),s,this.count,el,Hn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bc=new D,dm=new D,fm=new Ze,wn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bc.subVectors(n,t).cross(dm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Bc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fm.getNormalMatrix(e),s=this.coplanarPoint(Bc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ss=new gn,pm=new ye(.5,.5),fa=new D,Mr=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,o=new wn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ni,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],m=r[8],y=r[9],g=r[10],p=r[11],S=r[12],I=r[13],b=r[14],T=r[15];if(s[0].setComponents(c-o,f-u,p-m,T-S).normalize(),s[1].setComponents(c+o,f+u,p+m,T+S).normalize(),s[2].setComponents(c+a,f+d,p+y,T+I).normalize(),s[3].setComponents(c-a,f-d,p-y,T-I).normalize(),n)s[4].setComponents(l,h,g,b).normalize(),s[5].setComponents(c-l,f-h,p-g,T-b).normalize();else if(s[4].setComponents(c-l,f-h,p-g,T-b).normalize(),t===ni)s[5].setComponents(c+l,f+h,p+g,T+b).normalize();else if(t===dr)s[5].setComponents(l,h,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ss)}intersectsSprite(e){Ss.center.set(0,0,0);let t=pm.distanceTo(e.center);return Ss.radius=.7071067811865476+t,Ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ss)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(fa.x=s.normal.x>0?e.max.x:e.min.x,fa.y=s.normal.y>0?e.max.y:e.min.y,fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(fa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var yi=class extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new we(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Na=new D,Fa=new D,rd=new Ge,to=new xi,pa=new gn,kc=new D,od=new D,Is=class extends kt{constructor(e=new Tt,t=new yi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Na.fromBufferAttribute(t,s-1),Fa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Na.distanceTo(Fa);e.setAttribute("lineDistance",new yt(n,1))}else Ue("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,e.ray.intersectsSphere(pa)===!1)return;rd.copy(s).invert(),to.copy(e.ray).applyMatrix4(rd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=c){let p=u.getX(y),S=u.getX(y+1),I=ma(this,e,to,l,p,S,y);I&&t.push(I)}if(this.isLineLoop){let y=u.getX(m-1),g=u.getX(f),p=ma(this,e,to,l,y,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=c){let p=ma(this,e,to,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=ma(this,e,to,l,m-1,f,m-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ma(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Na.fromBufferAttribute(a,s),Fa.fromBufferAttribute(a,r),t.distanceSqToSegment(Na,Fa,kc,od)>n)return;kc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(kc);if(!(c<e.near||c>e.far))return{distance:c,point:od.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var ad=new D,ld=new D,ki=class extends Is{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)ad.fromBufferAttribute(t,s),ld.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ad.distanceTo(ld);e.setAttribute("lineDistance",new yt(n,1))}else Ue("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ho=class extends Is{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},bi=class extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new we(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},cd=new Ge,Kc=new xi,ga=new gn,va=new D,Kn=class extends kt{constructor(e=new Tt,t=new bi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(s),ga.radius+=r,e.ray.intersectsSphere(ga)===!1)return;cd.copy(s).invert(),Kc.copy(e.ray).applyMatrix4(cd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=h,y=f;m<y;m++){let g=c.getX(m);va.fromBufferAttribute(d,g),ud(va,g,l,s,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let m=h,y=f;m<y;m++)va.fromBufferAttribute(d,m),ud(va,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ud(i,e,t,n,s,r,o){let a=Kc.distanceSqToPoint(i);if(a<t){let l=new D;Kc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var fo=class extends ln{constructor(e=[],t=ms,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var Hi=class extends ln{constructor(e,t,n=ai,s,r,o,a=Wt,l=Wt,c,u=vi,d=1){if(u!==vi&&u!==gs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new mr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ua=class extends Hi{constructor(e,t=ai,n=ms,s,r,o=Wt,a=Wt,l,c=vi){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},po=class extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Vi=class i extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(u,3)),this.setAttribute("uv",new yt(d,2));function m(y,g,p,S,I,b,T,E,R,_,A){let N=b/R,C=T/_,M=b/2,B=T/2,V=E/2,G=R+1,q=_+1,Y=0,ne=0,le=new D;for(let ce=0;ce<q;ce++){let pe=ce*C-B;for(let Te=0;Te<G;Te++){let it=Te*N-M;le[y]=it*S,le[g]=pe*I,le[p]=V,c.push(le.x,le.y,le.z),le[y]=0,le[g]=0,le[p]=E>0?1:-1,u.push(le.x,le.y,le.z),d.push(Te/R),d.push(1-ce/_),Y+=1}}for(let ce=0;ce<_;ce++)for(let pe=0;pe<R;pe++){let Te=h+pe+G*ce,it=h+pe+G*(ce+1),je=h+(pe+1)+G*(ce+1),Pe=h+(pe+1)+G*ce;l.push(Te,it,Pe),l.push(it,je,Pe),ne+=6}a.addGroup(f,ne,A),f+=ne,h+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Gi=class i extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,f=[],m=[],y=[],g=[];for(let p=0;p<u;p++){let S=p*h-o;for(let I=0;I<c;I++){let b=I*d-r;m.push(b,-S,0),y.push(0,0,1),g.push(I/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){let I=S+c*p,b=S+c*(p+1),T=S+1+c*(p+1),E=S+1+c*p;f.push(I,b,E),f.push(b,T,E)}this.setIndex(f),this.setAttribute("position",new yt(m,3)),this.setAttribute("normal",new yt(y,3)),this.setAttribute("uv",new yt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Wi=class i extends Tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new D,h=new D,f=[],m=[],y=[],g=[];for(let p=0;p<=n;p++){let S=[],I=p/n,b=o+I*a,T=e*Math.cos(b),E=Math.sqrt(e*e-T*T),R=0;p===0&&o===0?R=.5/t:p===n&&l===Math.PI&&(R=-.5/t);for(let _=0;_<=t;_++){let A=_/t,N=s+A*r;d.x=-E*Math.cos(N),d.y=T,d.z=E*Math.sin(N),m.push(d.x,d.y,d.z),h.copy(d).normalize(),y.push(h.x,h.y,h.z),g.push(A+R,1-I),S.push(c++)}u.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){let I=u[p][S+1],b=u[p][S],T=u[p+1][S],E=u[p+1][S+1];(p!==0||o>0)&&f.push(I,b,E),(p!==n-1||l<Math.PI)&&f.push(b,T,E)}this.setIndex(f),this.setAttribute("position",new yt(m,3)),this.setAttribute("normal",new yt(y,3)),this.setAttribute("uv",new yt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function Bs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(hd(s))s.isRenderTargetTexture?(Ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(hd(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function yn(i){let e={};for(let t=0;t<i.length;t++){let n=Bs(i[t]);for(let s in n)e[s]=n[s]}return e}function hd(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function mm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function vu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var li={clone:Bs,merge:yn},gm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,rt=class extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gm,this.fragmentShader=vm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=mm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new we().setHex(s.value);break;case"v2":this.uniforms[n].value=new ye().fromArray(s.value);break;case"v3":this.uniforms[n].value=new D().fromArray(s.value);break;case"v4":this.uniforms[n].value=new mt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ze().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ge().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Sr=class extends rt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ls=class extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new we(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nl,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},vn=class extends Ls{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new we(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new we(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new we(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Oa=class extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},za=class extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function xa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function xm(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function dd(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function _m(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}var Mi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ba=class extends Mi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xc,endingEnd:Xc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case qc:r=e,a=2*t-n;break;case Yc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case qc:o=e,l=2*n-t;break;case Yc:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),y=m*m,g=y*m,p=-h*g+2*h*y-h*m,S=(1+h)*g+(-1.5-2*h)*y+(-.5+h)*m+1,I=(-1-f)*g+(1.5+f)*y+.5*m,b=f*g-f*y;for(let T=0;T!==a;++T)r[T]=p*o[u+T]+S*o[c+T]+I*o[l+T]+b*o[d+T];return r}},ka=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},Ha=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Va=class extends Mi{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let m=(n-t)/(s-t),y=1-m;for(let g=0;g!==a;++g)r[g]=o[c+g]*y+o[l+g]*m;return r}let h=a*2,f=e-1;for(let m=0;m!==a;++m){let y=o[c+m],g=o[l+m],p=f*h+m*2,S=d[p],I=d[p+1],b=e*h+m*2,T=u[b],E=u[b+1],R=(n-t)/(s-t),_,A,N,C,M;for(let B=0;B<8;B++){_=R*R,A=_*R,N=1-R,C=N*N,M=C*N;let G=M*t+3*C*R*S+3*N*_*T+A*s-n;if(Math.abs(G)<1e-10)break;let q=3*C*(S-t)+6*N*R*(T-S)+3*_*(s-T);if(Math.abs(q)<1e-10)break;R=R-G/q,R=Math.max(0,Math.min(1,R))}r[m]=M*y+3*C*R*I+3*N*_*E+A*g}return r}},Pn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=xa(t,this.TimeBufferType),this.values=xa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:xa(e.times,Array),values:xa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ka(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ba(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Va(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case As:t=this.InterpolantFactoryMethodDiscrete;break;case Rs:t=this.InterpolantFactoryMethodLinear;break;case ba:t=this.InterpolantFactoryMethodSmooth;break;case Wc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ue("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return As;case this.InterpolantFactoryMethodLinear:return Rs;case this.InterpolantFactoryMethodSmooth:return ba;case this.InterpolantFactoryMethodBezier:return Wc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Xe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Xe("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Xe("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Xe("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Ip(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Xe("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ba,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,h=d-n,f=d+n;for(let m=0;m!==n;++m){let y=t[d+m];if(y!==t[h+m]||y!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=Rs;var Xi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Xi.prototype.ValueTypeName="bool";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=As;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};mo.prototype.ValueTypeName="color";var qi=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};qi.prototype.ValueTypeName="number";var Ga=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)Bt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Si=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ga(this.times,this.values,this.getValueSize(),e)}};Si.prototype.ValueTypeName="quaternion";Si.prototype.InterpolantFactoryMethodSmooth=void 0;var Yi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Yi.prototype.ValueTypeName="string";Yi.prototype.ValueBufferType=Array;Yi.prototype.DefaultInterpolation=As;Yi.prototype.InterpolantFactoryMethodLinear=void 0;Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Zi=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Zi.prototype.ValueTypeName="vector";var Er=class{constructor(e="",t=-1,n=[],s=Wd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=ii(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(bm(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Pn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=xm(l);l=dd(l,1,u),c=dd(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new qi(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function ym(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return qi;case"vector":case"vector2":case"vector3":case"vector4":return Zi;case"color":return mo;case"quaternion":return Si;case"bool":case"boolean":return Xi;case"string":return Yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function bm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=ym(i.type);if(i.times===void 0){let t=[],n=[];_m(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}var gi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(fd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!fd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function fd(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Wa=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},rf=new Wa,Ei=class{constructor(e){this.manager=e!==void 0?e:rf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ei.DEFAULT_MATERIAL_NAME="__DEFAULT";var Oi={},jc=class extends Error{constructor(e,t){super(e),this.response=t}},Tr=class extends Ei{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=gi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Oi[e]!==void 0){Oi[e].push({onLoad:t,onProgress:n,onError:s});return}Oi[e]=[],Oi[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ue("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Oi[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,m=f!==0,y=0,g=new ReadableStream({start(p){S();function S(){d.read().then(({done:I,value:b})=>{if(I)p.close();else{y+=b.byteLength;let T=new ProgressEvent("progress",{lengthComputable:m,loaded:y,total:f});for(let E=0,R=u.length;E<R;E++){let _=u[E];_.onProgress&&_.onProgress(T)}p.enqueue(b),S()}},I=>{p.error(I)})}}});return new Response(g)}else throw new jc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{gi.add(`file:${e}`,c);let u=Oi[e];delete Oi[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Oi[e];if(u===void 0)throw this.manager.itemError(e),c;delete Oi[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ar=new WeakMap,Xa=class extends Ei{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=gi.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=ar.get(o);d===void 0&&(d=[],ar.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=fr("img");function l(){u(),t&&t(this);let d=ar.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}ar.delete(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),gi.remove(`image:${e}`);let h=ar.get(this)||[];for(let f=0;f<h.length;f++){let m=h[f];m.onError&&m.onError(d)}ar.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),gi.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var Ds=class extends Ei{constructor(e){super(e)}load(e,t,n,s){let r=new ln,o=new Xa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ns=class extends kt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new we(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var Hc=new Ge,pd=new D,md=new D,go=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mr,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;pd.setFromMatrixPosition(e.matrixWorld),t.position.copy(pd),md.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(md),t.updateMatrixWorld(),Hc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===dr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Hc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},_a=new D,ya=new Bt,mi=new D,Fs=class extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_a,ya,mi),mi.x===1&&mi.y===1&&mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,ya,mi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(_a,ya,mi),mi.x===1&&mi.y===1&&mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,ya,mi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ls=new D,gd=new ye,vd=new ye,Jt=class extends Fs{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(no*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Cs*2*Math.atan(Math.tan(no*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ls.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ls.x,ls.y).multiplyScalar(-e/ls.z),ls.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ls.x,ls.y).multiplyScalar(-e/ls.z)}getViewSize(e,t){return this.getViewBounds(e,gd,vd),t.subVectors(vd,gd)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(no*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$c=class extends go{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Cs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},vo=class extends Ns{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new $c}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Jc=class extends go{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0}},xo=class extends Ns{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ti=class extends Fs{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Qc=class extends go{constructor(){super(new Ti(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_o=class extends Ns{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new Qc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},yo=class extends Ns{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Ki=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Vc=new WeakMap,bo=class extends Ei{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ue("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ue("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=gi.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{Vc.has(o)===!0?(s&&s(Vc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){gi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e)}).catch(function(c){s&&s(c),Vc.set(l,c),gi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});gi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var lr=-90,cr=1,qa=class extends kt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(lr,cr,e,t);s.layers=this.layers,this.add(s);let r=new Jt(lr,cr,e,t);r.layers=this.layers,this.add(r);let o=new Jt(lr,cr,e,t);o.layers=this.layers,this.add(o);let a=new Jt(lr,cr,e,t);a.layers=this.layers,this.add(a);let l=new Jt(lr,cr,e,t);l.layers=this.layers,this.add(l);let c=new Jt(lr,cr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Ya=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Us=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Mm.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Mm(){this._document.hidden===!1&&this.reset()}var xu="\\[\\]\\.:\\/",Sm=new RegExp("["+xu+"]","g"),_u="[^"+xu+"]",Em="[^"+xu.replace("\\.","")+"]",Tm=/((?:WC+[\/:])*)/.source.replace("WC",_u),wm=/(WCOD+)?/.source.replace("WCOD",Em),Am=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_u),Rm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_u),Cm=new RegExp("^"+Tm+wm+Am+Rm+"$"),Pm=["material","materials","bones","map"],eu=class{constructor(e,t,n){let s=n||It.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},It=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Sm,"")}static parseTrackName(e){let t=Cm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Pm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ue("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Xe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Xe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Xe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Xe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Xe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Xe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Xe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Xe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Xe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Xe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};It.Composite=eu;It.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};It.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};It.prototype.GetterByBindingType=[It.prototype._getValue_direct,It.prototype._getValue_array,It.prototype._getValue_arrayElement,It.prototype._getValue_toArray];It.prototype.SetterByBindingTypeAndVersioning=[[It.prototype._setValue_direct,It.prototype._setValue_direct_setNeedsUpdate,It.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[It.prototype._setValue_array,It.prototype._setValue_array_setNeedsUpdate,It.prototype._setValue_array_setMatrixWorldNeedsUpdate],[It.prototype._setValue_arrayElement,It.prototype._setValue_arrayElement_setNeedsUpdate,It.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[It.prototype._setValue_fromArray,It.prototype._setValue_fromArray_setNeedsUpdate,It.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yy=new Float32Array(1);var xd=new Ge,Mo=class{constructor(e,t,n=0,s=1/0){this.ray=new xi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new vr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Xe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return xd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(xd),this}intersectObject(e,t=!0,n=[]){return tu(e,this,n,t),n.sort(_d),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)tu(e[s],this,n,t);return n.sort(_d),n}};function _d(i,e){return i.distance-e.distance}function tu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)tu(r[o],e,t,!0)}}var ds=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=nt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(nt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var nu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};var So=class extends si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ue("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function yu(i,e,t,n){let s=Im(n);switch(t){case du:return i*e;case el:return i*e/s.components*s.byteLength;case tl:return i*e/s.components*s.byteLength;case _n:return i*e*2/s.components*s.byteLength;case nl:return i*e*2/s.components*s.byteLength;case fu:return i*e*3/s.components*s.byteLength;case Vn:return i*e*4/s.components*s.byteLength;case il:return i*e*4/s.components*s.byteLength;case Do:case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fo:case Uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rl:case al:return Math.max(i,16)*Math.max(e,8)/4;case sl:case ol:return Math.max(i,8)*Math.max(e,8)/2;case ll:case cl:case hl:case dl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ul:case Oo:case fl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case vl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case xl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case _l:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case yl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case bl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ml:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Al:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Rl:case Cl:case Pl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Il:case Ll:return Math.ceil(i/4)*Math.ceil(e/4)*8;case zo:case Dl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Im(i){switch(i){case xn:case lu:return{byteLength:1,components:1};case Rr:case cu:case un:return{byteLength:2,components:1};case Ja:case Qa:return{byteLength:2,components:4};case ai:case $a:case Hn:return{byteLength:4,components:1};case uu:case hu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function Rf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Fm(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<d.length;f++){let m=d[h],y=d[f];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++h,d[h]=y)}d.length=h+1;for(let f=0,m=d.length;f<m;f++){let y=d[f];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Um=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Om=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,zm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,km=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Gm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Xm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ym=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Km=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ng=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ig=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,rg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,og=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ag=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,lg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ug=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dg="gl_FragColor = linearToOutputTexel( gl_FragColor );",fg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,mg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_g=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Eg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ag=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Rg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Cg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Pg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ig=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ng=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ug=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Og=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Bg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Kg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,jg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$g=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,t0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,r0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,o0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,a0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,l0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,u0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,h0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,f0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,b0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,M0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,S0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,E0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,T0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,w0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,R0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,C0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,P0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,I0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,L0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,N0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,F0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,U0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,O0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,G0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,W0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,X0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,K0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,j0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,$0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ev=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,iv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,sv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ov=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,av=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,hv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:Um,alphahash_pars_fragment:Om,alphamap_fragment:zm,alphamap_pars_fragment:Bm,alphatest_fragment:km,alphatest_pars_fragment:Hm,aomap_fragment:Vm,aomap_pars_fragment:Gm,batching_pars_vertex:Wm,batching_vertex:Xm,begin_vertex:qm,beginnormal_vertex:Ym,bsdfs:Zm,iridescence_fragment:Km,bumpmap_pars_fragment:jm,clipping_planes_fragment:$m,clipping_planes_pars_fragment:Jm,clipping_planes_pars_vertex:Qm,clipping_planes_vertex:eg,color_fragment:tg,color_pars_fragment:ng,color_pars_vertex:ig,color_vertex:sg,common:rg,cube_uv_reflection_fragment:og,defaultnormal_vertex:ag,displacementmap_pars_vertex:lg,displacementmap_vertex:cg,emissivemap_fragment:ug,emissivemap_pars_fragment:hg,colorspace_fragment:dg,colorspace_pars_fragment:fg,envmap_fragment:pg,envmap_common_pars_fragment:mg,envmap_pars_fragment:gg,envmap_pars_vertex:vg,envmap_physical_pars_fragment:Rg,envmap_vertex:xg,fog_vertex:_g,fog_pars_vertex:yg,fog_fragment:bg,fog_pars_fragment:Mg,gradientmap_pars_fragment:Sg,lightmap_pars_fragment:Eg,lights_lambert_fragment:Tg,lights_lambert_pars_fragment:wg,lights_pars_begin:Ag,lights_toon_fragment:Cg,lights_toon_pars_fragment:Pg,lights_phong_fragment:Ig,lights_phong_pars_fragment:Lg,lights_physical_fragment:Dg,lights_physical_pars_fragment:Ng,lights_fragment_begin:Fg,lights_fragment_maps:Ug,lights_fragment_end:Og,lightprobes_pars_fragment:zg,logdepthbuf_fragment:Bg,logdepthbuf_pars_fragment:kg,logdepthbuf_pars_vertex:Hg,logdepthbuf_vertex:Vg,map_fragment:Gg,map_pars_fragment:Wg,map_particle_fragment:Xg,map_particle_pars_fragment:qg,metalnessmap_fragment:Yg,metalnessmap_pars_fragment:Zg,morphinstance_vertex:Kg,morphcolor_vertex:jg,morphnormal_vertex:$g,morphtarget_pars_vertex:Jg,morphtarget_vertex:Qg,normal_fragment_begin:e0,normal_fragment_maps:t0,normal_pars_fragment:n0,normal_pars_vertex:i0,normal_vertex:s0,normalmap_pars_fragment:r0,clearcoat_normal_fragment_begin:o0,clearcoat_normal_fragment_maps:a0,clearcoat_pars_fragment:l0,iridescence_pars_fragment:c0,opaque_fragment:u0,packing:h0,premultiplied_alpha_fragment:d0,project_vertex:f0,dithering_fragment:p0,dithering_pars_fragment:m0,roughnessmap_fragment:g0,roughnessmap_pars_fragment:v0,shadowmap_pars_fragment:x0,shadowmap_pars_vertex:_0,shadowmap_vertex:y0,shadowmask_pars_fragment:b0,skinbase_vertex:M0,skinning_pars_vertex:S0,skinning_vertex:E0,skinnormal_vertex:T0,specularmap_fragment:w0,specularmap_pars_fragment:A0,tonemapping_fragment:R0,tonemapping_pars_fragment:C0,transmission_fragment:P0,transmission_pars_fragment:I0,uv_pars_fragment:L0,uv_pars_vertex:D0,uv_vertex:N0,worldpos_vertex:F0,background_vert:U0,background_frag:O0,backgroundCube_vert:z0,backgroundCube_frag:B0,cube_vert:k0,cube_frag:H0,depth_vert:V0,depth_frag:G0,distance_vert:W0,distance_frag:X0,equirect_vert:q0,equirect_frag:Y0,linedashed_vert:Z0,linedashed_frag:K0,meshbasic_vert:j0,meshbasic_frag:$0,meshlambert_vert:J0,meshlambert_frag:Q0,meshmatcap_vert:ev,meshmatcap_frag:tv,meshnormal_vert:nv,meshnormal_frag:iv,meshphong_vert:sv,meshphong_frag:rv,meshphysical_vert:ov,meshphysical_frag:av,meshtoon_vert:lv,meshtoon_frag:cv,points_vert:uv,points_frag:hv,shadow_vert:dv,shadow_frag:fv,sprite_vert:pv,sprite_frag:mv},Ae={common:{diffuse:{value:new we(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},envMapRotation:{value:new Ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new we(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new we(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new we(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},Ri={basic:{uniforms:yn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:yn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new we(0)},envMapIntensity:{value:1}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:yn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new we(0)},specular:{value:new we(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:yn([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new we(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:yn([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new we(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:yn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:yn([Ae.points,Ae.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:yn([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:yn([Ae.common,Ae.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:yn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:yn([Ae.sprite,Ae.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ze}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distance:{uniforms:yn([Ae.common,Ae.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distance_vert,fragmentShader:et.distance_frag},shadow:{uniforms:yn([Ae.lights,Ae.fog,{color:{value:new we(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};Ri.physical={uniforms:yn([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new we(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new we(0)},specularColor:{value:new we(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};var Ol={r:0,b:0,g:0},gv=new Ge,Cf=new Ze;Cf.set(-1,0,0,0,1,0,0,0,1);function vv(i,e,t,n,s,r){let o=new we(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let I=S.isScene===!0?S.background:null;if(I&&I.isTexture){let b=S.backgroundBlurriness>0;I=e.get(I,b)}return I}function m(S){let I=!1,b=f(S);b===null?g(o,a):b&&b.isColor&&(g(b,1),I=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||I)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(S,I){let b=f(I);b&&(b.isCubeTexture||b.mapping===Lo)?(c===void 0&&(c=new vt(new Vi(1,1,1),new rt({name:"BackgroundCubeMaterial",uniforms:Bs(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(gv.makeRotationFromEuler(I.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Cf),c.material.toneMapped=tt.getTransfer(b.colorSpace)!==_t,(u!==b||d!==b.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=b,d=b.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new vt(new Gi(2,2),new rt({name:"BackgroundMaterial",uniforms:Bs(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,l.material.toneMapped=tt.getTransfer(b.colorSpace)!==_t,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(u!==b||d!==b.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=b,d=b.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,I){S.getRGB(Ol,vu(i)),t.buffers.color.setClear(Ol.r,Ol.g,Ol.b,I,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,I=1){o.set(S),a=I,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:m,addToRenderList:y,dispose:p}}function xv(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(C,M,B,V,G){let q=!1,Y=d(C,V,B,M);r!==Y&&(r=Y,c(r.object)),q=f(C,V,B,G),q&&m(C,V,B,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,b(C,M,B,V),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function u(C){return i.deleteVertexArray(C)}function d(C,M,B,V){let G=V.wireframe===!0,q=n[M.id];q===void 0&&(q={},n[M.id]=q);let Y=C.isInstancedMesh===!0?C.id:0,ne=q[Y];ne===void 0&&(ne={},q[Y]=ne);let le=ne[B.id];le===void 0&&(le={},ne[B.id]=le);let ce=le[G];return ce===void 0&&(ce=h(l()),le[G]=ce),ce}function h(C){let M=[],B=[],V=[];for(let G=0;G<t;G++)M[G]=0,B[G]=0,V[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:B,attributeDivisors:V,object:C,attributes:{},index:null}}function f(C,M,B,V){let G=r.attributes,q=M.attributes,Y=0,ne=B.getAttributes();for(let le in ne)if(ne[le].location>=0){let pe=G[le],Te=q[le];if(Te===void 0&&(le==="instanceMatrix"&&C.instanceMatrix&&(Te=C.instanceMatrix),le==="instanceColor"&&C.instanceColor&&(Te=C.instanceColor)),pe===void 0||pe.attribute!==Te||Te&&pe.data!==Te.data)return!0;Y++}return r.attributesNum!==Y||r.index!==V}function m(C,M,B,V){let G={},q=M.attributes,Y=0,ne=B.getAttributes();for(let le in ne)if(ne[le].location>=0){let pe=q[le];pe===void 0&&(le==="instanceMatrix"&&C.instanceMatrix&&(pe=C.instanceMatrix),le==="instanceColor"&&C.instanceColor&&(pe=C.instanceColor));let Te={};Te.attribute=pe,pe&&pe.data&&(Te.data=pe.data),G[le]=Te,Y++}r.attributes=G,r.attributesNum=Y,r.index=V}function y(){let C=r.newAttributes;for(let M=0,B=C.length;M<B;M++)C[M]=0}function g(C){p(C,0)}function p(C,M){let B=r.newAttributes,V=r.enabledAttributes,G=r.attributeDivisors;B[C]=1,V[C]===0&&(i.enableVertexAttribArray(C),V[C]=1),G[C]!==M&&(i.vertexAttribDivisor(C,M),G[C]=M)}function S(){let C=r.newAttributes,M=r.enabledAttributes;for(let B=0,V=M.length;B<V;B++)M[B]!==C[B]&&(i.disableVertexAttribArray(B),M[B]=0)}function I(C,M,B,V,G,q,Y){Y===!0?i.vertexAttribIPointer(C,M,B,G,q):i.vertexAttribPointer(C,M,B,V,G,q)}function b(C,M,B,V){y();let G=V.attributes,q=B.getAttributes(),Y=M.defaultAttributeValues;for(let ne in q){let le=q[ne];if(le.location>=0){let ce=G[ne];if(ce===void 0&&(ne==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),ne==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor)),ce!==void 0){let pe=ce.normalized,Te=ce.itemSize,it=e.get(ce);if(it===void 0)continue;let je=it.buffer,Pe=it.type,Z=it.bytesPerElement,ue=Pe===i.INT||Pe===i.UNSIGNED_INT||ce.gpuType===$a;if(ce.isInterleavedBufferAttribute){let se=ce.data,Ne=se.stride,We=ce.offset;if(se.isInstancedInterleavedBuffer){for(let Fe=0;Fe<le.locationSize;Fe++)p(le.location+Fe,se.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Fe=0;Fe<le.locationSize;Fe++)g(le.location+Fe);i.bindBuffer(i.ARRAY_BUFFER,je);for(let Fe=0;Fe<le.locationSize;Fe++)I(le.location+Fe,Te/le.locationSize,Pe,pe,Ne*Z,(We+Te/le.locationSize*Fe)*Z,ue)}else{if(ce.isInstancedBufferAttribute){for(let se=0;se<le.locationSize;se++)p(le.location+se,ce.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let se=0;se<le.locationSize;se++)g(le.location+se);i.bindBuffer(i.ARRAY_BUFFER,je);for(let se=0;se<le.locationSize;se++)I(le.location+se,Te/le.locationSize,Pe,pe,Te*Z,Te/le.locationSize*se*Z,ue)}}else if(Y!==void 0){let pe=Y[ne];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(le.location,pe);break;case 3:i.vertexAttrib3fv(le.location,pe);break;case 4:i.vertexAttrib4fv(le.location,pe);break;default:i.vertexAttrib1fv(le.location,pe)}}}}S()}function T(){A();for(let C in n){let M=n[C];for(let B in M){let V=M[B];for(let G in V){let q=V[G];for(let Y in q)u(q[Y].object),delete q[Y];delete V[G]}}delete n[C]}}function E(C){if(n[C.id]===void 0)return;let M=n[C.id];for(let B in M){let V=M[B];for(let G in V){let q=V[G];for(let Y in q)u(q[Y].object),delete q[Y];delete V[G]}}delete n[C.id]}function R(C){for(let M in n){let B=n[M];for(let V in B){let G=B[V];if(G[C.id]===void 0)continue;let q=G[C.id];for(let Y in q)u(q[Y].object),delete q[Y];delete G[C.id]}}}function _(C){for(let M in n){let B=n[M],V=C.isInstancedMesh===!0?C.id:0,G=B[V];if(G!==void 0){for(let q in G){let Y=G[q];for(let ne in Y)u(Y[ne].object),delete Y[ne];delete G[q]}delete B[V],Object.keys(B).length===0&&delete n[M]}}}function A(){N(),o=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:N,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:g,disableUnusedAttributes:S}}function _v(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function yv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==Vn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let _=R===un&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==xn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Hn&&!_)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ue("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ue("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),I=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:I,maxFragmentUniforms:b,maxSamples:T,samples:E}}function bv(i){let e=this,t=null,n=0,s=!1,r=!1,o=new wn,a=new Ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let m=d.clippingPlanes,y=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{let S=r?0:n,I=S*4,b=p.clippingState||null;l.value=b,b=u(m,h,I,f);for(let T=0;T!==I;++T)b[T]=t[T];p.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,m){let y=d!==null?d.length:0,g=null;if(y!==0){if(g=l.value,m!==!0||g===null){let p=f+y*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let I=0,b=f;I!==y;++I,b+=4)o.copy(d[I]).applyMatrix4(S,a),o.normal.toArray(g,b),g[b+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}var vs=4,of=[.125,.215,.35,.446,.526,.582],ks=20,Mv=256,ko=new Ti,af=new we,bu=null,Mu=0,Su=0,Eu=!1,Sv=new D,Bl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Sv}=r;bu=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Su=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bu,Mu,Su),this._renderer.xr.enabled=Eu,e.scissorTest=!1,Ir(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ms||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bu=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Su=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:un,format:Vn,colorSpace:Sn,depthBuffer:!1},s=lf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lf(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Ev(r)),this._blurMaterial=wv(r,e,t),this._ggxMaterial=Tv(r,e,t)}return s}_compileMaterial(e){let t=new vt(new Tt,e);this._renderer.compile(t,ko)}_sceneToCubeUV(e,t,n,s,r){let l=new Jt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(af),d.toneMapping=ri,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new vt(new Vi,new qt({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,g=y.material,p=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,p=!0):(g.color.copy(af),p=!0);for(let I=0;I<6;I++){let b=I%3;b===0?(l.up.set(0,c[I],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[I],r.y,r.z)):b===1?(l.up.set(0,0,c[I]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[I],r.z)):(l.up.set(0,c[I],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[I]));let T=this._cubeSize;Ir(s,b*T,I>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(y,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ms||e.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=uf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Ir(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,ko)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=0+c*1.25,f=d*h,{_lodMax:m}=this,y=this._sizeLods[n],g=3*y*(n>m-vs?n-m+vs:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,Ir(r,g,p,3*y,2*y),s.setRenderTarget(r),s.render(a,ko),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Ir(e,g,p,3*y,2*y),s.setRenderTarget(e),s.render(a,ko)}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Xe("blur direction must be either latitudinal or longitudinal!");let u=3,d=this._lodMeshes[s];d.material=c;let h=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ks-1),y=r/m,g=isFinite(r)?1+Math.floor(u*y):ks;g>ks&&Ue(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ks}`);let p=[],S=0;for(let R=0;R<ks;++R){let _=R/y,A=Math.exp(-_*_/2);p.push(A),R===0?S+=A:R<g&&(S+=2*A)}for(let R=0;R<p.length;R++)p[R]=p[R]/S;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);let{_lodMax:I}=this;h.dTheta.value=m,h.mipInt.value=I-n;let b=this._sizeLods[s],T=3*b*(s>I-vs?s-I+vs:0),E=4*(this._cubeSize-b);Ir(t,T,E,3*b,2*b),l.setRenderTarget(t),l.render(d,ko)}};function Ev(i){let e=[],t=[],n=[],s=i,r=i-vs+1+of.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-vs?l=of[o-i+vs-1]:o===0&&(l=0),t.push(l);let c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,m=6,y=3,g=2,p=1,S=new Float32Array(y*m*f),I=new Float32Array(g*m*f),b=new Float32Array(p*m*f);for(let E=0;E<f;E++){let R=E%3*2/3-1,_=E>2?0:-1,A=[R,_,0,R+2/3,_,0,R+2/3,_+1,0,R,_,0,R+2/3,_+1,0,R,_+1,0];S.set(A,y*m*E),I.set(h,g*m*E);let N=[E,E,E,E,E,E];b.set(N,p*m*E)}let T=new Tt;T.setAttribute("position",new Ct(S,y)),T.setAttribute("uv",new Ct(I,g)),T.setAttribute("faceIndex",new Ct(b,p)),n.push(new vt(T,null)),s>vs&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function lf(i,e,t){let n=new Xt(i,e,t);return n.texture.mapping=Lo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ir(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Tv(i,e,t){return new rt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Mv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function wv(i,e,t){let n=new Float32Array(ks),s=new D(0,1,0);return new rt({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function cf(){return new rt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function uf(){return new rt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function Vl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var kl=class extends Xt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new fo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Vi(5,5,5),r=new rt({name:"CubemapFromEquirect",uniforms:Bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:In});r.uniforms.tEquirect.value=t;let o=new vt(s,r),a=t.minFilter;return t.minFilter===oi&&(t.minFilter=Et),new qa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};function Av(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===Za||f===Ka)if(e.has(h)){let m=e.get(h).texture;return a(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let y=new kl(m.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",c),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,m=f===Za||f===Ka,y=f===ms||f===Os;if(m||y){let g=t.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new Bl(i)),g=m?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||y&&S&&l(S)?(n===null&&(n=new Bl(i)),g=m?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,f){return f===Za?h.mapping=ms:f===Ka&&(h.mapping=Os),h}function l(h){let f=0,m=6;for(let y=0;y<m;y++)h[y]!==void 0&&f++;return f===m}function c(h){let f=h.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Rv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ts("WebGLRenderer: "+n+" extension not supported."),s}}}function Cv(i,e,t,n){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,m=d.attributes.position,y=0;if(m===void 0)return;if(f!==null){let S=f.array;y=f.version;for(let I=0,b=S.length;I<b;I+=3){let T=S[I+0],E=S[I+1],R=S[I+2];h.push(T,E,E,R,R,T)}}else{let S=m.array;y=m.version;for(let I=0,b=S.length/3-1;I<b;I+=3){let T=I+0,E=I+1,R=I+2;h.push(T,E,E,R,R,T)}}let g=new(m.count>=65535?lo:ao)(h,1);g.version=y;let p=r.get(d);p&&e.remove(p),r.set(d,g)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Pv(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){i.drawElements(n,h,r,d*o),t.update(h,n,1)}function c(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*o,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let y=0;for(let g=0;g<f;g++)y+=h[g];t.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Iv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Xe("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Lv(i,e,t){let n=new WeakMap,s=new mt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let A=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],I=0;f===!0&&(I=1),m===!0&&(I=2),y===!0&&(I=3);let b=a.attributes.position.count*I,T=1;b>e.maxTextureSize&&(T=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let E=new Float32Array(b*T*4*d),R=new oo(E,b,T,d);R.type=Hn,R.needsUpdate=!0;let _=I*4;for(let N=0;N<d;N++){let C=g[N],M=p[N],B=S[N],V=b*T*4*N;for(let G=0;G<C.count;G++){let q=G*_;f===!0&&(s.fromBufferAttribute(C,G),E[V+q+0]=s.x,E[V+q+1]=s.y,E[V+q+2]=s.z,E[V+q+3]=0),m===!0&&(s.fromBufferAttribute(M,G),E[V+q+4]=s.x,E[V+q+5]=s.y,E[V+q+6]=s.z,E[V+q+7]=0),y===!0&&(s.fromBufferAttribute(B,G),E[V+q+8]=s.x,E[V+q+9]=s.y,E[V+q+10]=s.z,E[V+q+11]=B.itemSize===4?s.w:1)}}h={count:d,texture:R,size:new ye(b,T)},n.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Dv(i,e,t,n,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=e.get(c,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var Nv={[To]:"LINEAR_TONE_MAPPING",[wo]:"REINHARD_TONE_MAPPING",[Ao]:"CINEON_TONE_MAPPING",[Ro]:"ACES_FILMIC_TONE_MAPPING",[Po]:"AGX_TONE_MAPPING",[Io]:"NEUTRAL_TONE_MAPPING",[Co]:"CUSTOM_TONE_MAPPING"};function Fv(i,e,t,n,s,r){let o=new Xt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Hi(e,t):void 0}),a=new Xt(e,t,{type:un,depthBuffer:!1,stencilBuffer:!1}),l=new Tt;l.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new yt([0,2,0,0,2,0],2));let c=new Sr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new vt(l,c),d=new Ti(-1,1,1,-1,0,1),h=null,f=null,m=!1,y,g=null,p=[],S=!1;this.setSize=function(I,b){o.setSize(I,b),a.setSize(I,b);for(let T=0;T<p.length;T++){let E=p[T];E.setSize&&E.setSize(I,b)}},this.setEffects=function(I){p=I,S=p.length>0&&p[0].isRenderPass===!0;let b=o.width,T=o.height;for(let E=0;E<p.length;E++){let R=p[E];R.setSize&&R.setSize(b,T)}},this.begin=function(I,b){if(m||I.toneMapping===ri&&p.length===0)return!1;if(g=b,b!==null){let T=b.width,E=b.height;(o.width!==T||o.height!==E)&&this.setSize(T,E)}return S===!1&&I.setRenderTarget(o),y=I.toneMapping,I.toneMapping=ri,!0},this.hasRenderPass=function(){return S},this.end=function(I,b){I.toneMapping=y,m=!0;let T=o,E=a;for(let R=0;R<p.length;R++){let _=p[R];if(_.enabled!==!1&&(_.render(I,E,T,b),_.needsSwap!==!1)){let A=T;T=E,E=A}}if(h!==I.outputColorSpace||f!==I.toneMapping){h=I.outputColorSpace,f=I.toneMapping,c.defines={},tt.getTransfer(h)===_t&&(c.defines.SRGB_TRANSFER="");let R=Nv[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=T.texture,I.setRenderTarget(g),I.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}var Pf=new ln,Au=new Hi(1,1),If=new oo,Lf=new gr,Df=new fo,hf=[],df=[],ff=new Float32Array(16),pf=new Float32Array(9),mf=new Float32Array(4);function Dr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=hf[s];if(r===void 0&&(r=new Float32Array(s),hf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function tn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function nn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Gl(i,e){let t=df[e];t===void 0&&(t=new Int32Array(e),df[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Uv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Ov(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2fv(this.addr,e),nn(t,e)}}function zv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;i.uniform3fv(this.addr,e),nn(t,e)}}function Bv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4fv(this.addr,e),nn(t,e)}}function kv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;mf.set(n),i.uniformMatrix2fv(this.addr,!1,mf),nn(t,n)}}function Hv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;pf.set(n),i.uniformMatrix3fv(this.addr,!1,pf),nn(t,n)}}function Vv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;ff.set(n),i.uniformMatrix4fv(this.addr,!1,ff),nn(t,n)}}function Gv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Wv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2iv(this.addr,e),nn(t,e)}}function Xv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3iv(this.addr,e),nn(t,e)}}function qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4iv(this.addr,e),nn(t,e)}}function Yv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Zv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2uiv(this.addr,e),nn(t,e)}}function Kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3uiv(this.addr,e),nn(t,e)}}function jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4uiv(this.addr,e),nn(t,e)}}function $v(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Au.compareFunction=t.isReversedDepthBuffer()?Ul:Fl,r=Au):r=Pf,t.setTexture2D(e||r,s)}function Jv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Lf,s)}function Qv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Df,s)}function ex(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||If,s)}function tx(i){switch(i){case 5126:return Uv;case 35664:return Ov;case 35665:return zv;case 35666:return Bv;case 35674:return kv;case 35675:return Hv;case 35676:return Vv;case 5124:case 35670:return Gv;case 35667:case 35671:return Wv;case 35668:case 35672:return Xv;case 35669:case 35673:return qv;case 5125:return Yv;case 36294:return Zv;case 36295:return Kv;case 36296:return jv;case 35678:case 36198:case 36298:case 36306:case 35682:return $v;case 35679:case 36299:case 36307:return Jv;case 35680:case 36300:case 36308:case 36293:return Qv;case 36289:case 36303:case 36311:case 36292:return ex}}function nx(i,e){i.uniform1fv(this.addr,e)}function ix(i,e){let t=Dr(e,this.size,2);i.uniform2fv(this.addr,t)}function sx(i,e){let t=Dr(e,this.size,3);i.uniform3fv(this.addr,t)}function rx(i,e){let t=Dr(e,this.size,4);i.uniform4fv(this.addr,t)}function ox(i,e){let t=Dr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ax(i,e){let t=Dr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function lx(i,e){let t=Dr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function cx(i,e){i.uniform1iv(this.addr,e)}function ux(i,e){i.uniform2iv(this.addr,e)}function hx(i,e){i.uniform3iv(this.addr,e)}function dx(i,e){i.uniform4iv(this.addr,e)}function fx(i,e){i.uniform1uiv(this.addr,e)}function px(i,e){i.uniform2uiv(this.addr,e)}function mx(i,e){i.uniform3uiv(this.addr,e)}function gx(i,e){i.uniform4uiv(this.addr,e)}function vx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Au:o=Pf;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function xx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Lf,r[o])}function _x(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Df,r[o])}function yx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||If,r[o])}function bx(i){switch(i){case 5126:return nx;case 35664:return ix;case 35665:return sx;case 35666:return rx;case 35674:return ox;case 35675:return ax;case 35676:return lx;case 5124:case 35670:return cx;case 35667:case 35671:return ux;case 35668:case 35672:return hx;case 35669:case 35673:return dx;case 5125:return fx;case 36294:return px;case 36295:return mx;case 36296:return gx;case 35678:case 36198:case 36298:case 36306:case 35682:return vx;case 35679:case 36299:case 36307:return xx;case 35680:case 36300:case 36308:case 36293:return _x;case 36289:case 36303:case 36311:case 36292:return yx}}var Ru=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=tx(t.type)}},Cu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bx(t.type)}},Pu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Tu=/(\w+)(\])?(\[|\.)?/g;function gf(i,e){i.seq.push(e),i.map[e.id]=e}function Mx(i,e,t){let n=i.name,s=n.length;for(Tu.lastIndex=0;;){let r=Tu.exec(n),o=Tu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){gf(t,c===void 0?new Ru(a,i,e):new Cu(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Pu(a),gf(t,d)),t=d}}}var Lr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Mx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function vf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Sx=37297,Ex=0;function Tx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var xf=new Ze;function wx(i){tt._getMatrix(xf,tt.workingColorSpace,i);let e=`mat3( ${xf.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case so:return[e,"LinearTransferOETF"];case _t:return[e,"sRGBTransferOETF"];default:return Ue("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function _f(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Tx(i.getShaderSource(e),a)}else return r}function Ax(i,e){let t=wx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Rx={[To]:"Linear",[wo]:"Reinhard",[Ao]:"Cineon",[Ro]:"ACESFilmic",[Po]:"AgX",[Io]:"Neutral",[Co]:"Custom"};function Cx(i,e){let t=Rx[e];return t===void 0?(Ue("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var zl=new D;function Px(){tt.getLuminanceCoefficients(zl);let i=zl.x.toFixed(4),e=zl.y.toFixed(4),t=zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ix(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vo).join(`
`)}function Lx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Dx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Vo(i){return i!==""}function yf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Nx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(i){return i.replace(Nx,Ux)}var Fx=new Map;function Ux(i,e){let t=et[e];if(t===void 0){let n=Fx.get(e);if(n!==void 0)t=et[n],Ue('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Iu(t)}var Ox=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mf(i){return i.replace(Ox,zx)}function zx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var Bx={[Eo]:"SHADOWMAP_TYPE_PCF",[wr]:"SHADOWMAP_TYPE_VSM"};function kx(i){return Bx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Hx={[ms]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[Lo]:"ENVMAP_TYPE_CUBE_UV"};function Vx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Hx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Gx={[Os]:"ENVMAP_MODE_REFRACTION"};function Wx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Gx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Xx={[ou]:"ENVMAP_BLENDING_MULTIPLY",[Hd]:"ENVMAP_BLENDING_MIX",[Vd]:"ENVMAP_BLENDING_ADD"};function qx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Xx[i.combine]||"ENVMAP_BLENDING_NONE"}function Yx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Zx(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=kx(t),c=Vx(t),u=Wx(t),d=qx(t),h=Yx(t),f=Ix(t),m=Lx(r),y=s.createProgram(),g,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Vo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Vo).join(`
`),p.length>0&&(p+=`
`)):(g=[Sf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vo).join(`
`),p=[Sf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ri?"#define TONE_MAPPING":"",t.toneMapping!==ri?et.tonemapping_pars_fragment:"",t.toneMapping!==ri?Cx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,Ax("linearToOutputTexel",t.outputColorSpace),Px(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vo).join(`
`)),o=Iu(o),o=yf(o,t),o=bf(o,t),a=Iu(a),a=yf(a,t),a=bf(a,t),o=Mf(o),a=Mf(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===mu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let I=S+g+o,b=S+p+a,T=vf(s,s.VERTEX_SHADER,I),E=vf(s,s.FRAGMENT_SHADER,b);s.attachShader(y,T),s.attachShader(y,E),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(C){if(i.debug.checkShaderErrors){let M=s.getProgramInfoLog(y)||"",B=s.getShaderInfoLog(T)||"",V=s.getShaderInfoLog(E)||"",G=M.trim(),q=B.trim(),Y=V.trim(),ne=!0,le=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,T,E);else{let ce=_f(s,T,"vertex"),pe=_f(s,E,"fragment");Xe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+ce+`
`+pe)}else G!==""?Ue("WebGLProgram: Program Info Log:",G):(q===""||Y==="")&&(le=!1);le&&(C.diagnostics={runnable:ne,programLog:G,vertexShader:{log:q,prefix:g},fragmentShader:{log:Y,prefix:p}})}s.deleteShader(T),s.deleteShader(E),_=new Lr(s,y),A=Dx(s,y)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let A;this.getAttributes=function(){return A===void 0&&R(this),A};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(y,Sx)),N},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ex++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=E,this}var Kx=0,Lu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Du(e),t.set(e,n)),n}},Du=class{constructor(e){this.id=Kx++,this.code=e,this.usedTimes=0}};function jx(i){return i===_n||i===Oo||i===zo}function $x(i,e,t,n,s,r){let o=new vr,a=new Lu,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function y(_,A,N,C,M,B){let V=C.fog,G=M.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ne=e.get(_.envMap||q,Y),le=ne&&ne.mapping===Lo?ne.image.height:null,ce=f[_.type];_.precision!==null&&(h=n.getMaxPrecision(_.precision),h!==_.precision&&Ue("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let pe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Te=pe!==void 0?pe.length:0,it=0;G.morphAttributes.position!==void 0&&(it=1),G.morphAttributes.normal!==void 0&&(it=2),G.morphAttributes.color!==void 0&&(it=3);let je,Pe,Z,ue;if(ce){let Le=Ri[ce];je=Le.vertexShader,Pe=Le.fragmentShader}else{je=_.vertexShader,Pe=_.fragmentShader;let Le=a.getVertexShaderStage(_),Mt=a.getFragmentShaderStage(_);a.update(_,Le,Mt),Z=Le.id,ue=Mt.id}let se=i.getRenderTarget(),Ne=i.state.buffers.depth.getReversed(),We=M.isInstancedMesh===!0,Fe=M.isBatchedMesh===!0,pt=!!_.map,qe=!!_.matcap,at=!!ne,Je=!!_.aoMap,He=!!_.lightMap,lt=!!_.bumpMap&&_.wireframe===!1,st=!!_.normalMap,zt=!!_.displacementMap,Qt=!!_.emissiveMap,Lt=!!_.metalnessMap,xt=!!_.roughnessMap,k=_.anisotropy>0,rn=_.clearcoat>0,gt=_.dispersion>0,w=_.iridescence>0,x=_.sheen>0,H=_.transmission>0,X=k&&!!_.anisotropyMap,j=rn&&!!_.clearcoatMap,me=rn&&!!_.clearcoatNormalMap,be=rn&&!!_.clearcoatRoughnessMap,$=w&&!!_.iridescenceMap,te=w&&!!_.iridescenceThicknessMap,ve=x&&!!_.sheenColorMap,Oe=x&&!!_.sheenRoughnessMap,Se=!!_.specularMap,xe=!!_.specularColorMap,ke=!!_.specularIntensityMap,Be=H&&!!_.transmissionMap,Ke=H&&!!_.thicknessMap,z=!!_.gradientMap,ge=!!_.alphaMap,Q=_.alphaTest>0,Me=!!_.alphaHash,_e=!!_.extensions,re=ri;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(re=i.toneMapping);let Ce={shaderID:ce,shaderType:_.type,shaderName:_.name,vertexShader:je,fragmentShader:Pe,defines:_.defines,customVertexShaderID:Z,customFragmentShaderID:ue,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:Fe,batchingColor:Fe&&M._colorsTexture!==null,instancing:We,instancingColor:We&&M.instanceColor!==null,instancingMorph:We&&M.morphTexture!==null,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:tt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:pt,matcap:qe,envMap:at,envMapMode:at&&ne.mapping,envMapCubeUVHeight:le,aoMap:Je,lightMap:He,bumpMap:lt,normalMap:st,displacementMap:zt,emissiveMap:Qt,normalMapObjectSpace:st&&_.normalMapType===qd,normalMapTangentSpace:st&&_.normalMapType===Nl,packedNormalMap:st&&_.normalMapType===Nl&&jx(_.normalMap.format),metalnessMap:Lt,roughnessMap:xt,anisotropy:k,anisotropyMap:X,clearcoat:rn,clearcoatMap:j,clearcoatNormalMap:me,clearcoatRoughnessMap:be,dispersion:gt,iridescence:w,iridescenceMap:$,iridescenceThicknessMap:te,sheen:x,sheenColorMap:ve,sheenRoughnessMap:Oe,specularMap:Se,specularColorMap:xe,specularIntensityMap:ke,transmission:H,transmissionMap:Be,thicknessMap:Ke,gradientMap:z,opaque:_.transparent===!1&&_.blending===kn&&_.alphaToCoverage===!1,alphaMap:ge,alphaTest:Q,alphaHash:Me,combine:_.combine,mapUv:pt&&m(_.map.channel),aoMapUv:Je&&m(_.aoMap.channel),lightMapUv:He&&m(_.lightMap.channel),bumpMapUv:lt&&m(_.bumpMap.channel),normalMapUv:st&&m(_.normalMap.channel),displacementMapUv:zt&&m(_.displacementMap.channel),emissiveMapUv:Qt&&m(_.emissiveMap.channel),metalnessMapUv:Lt&&m(_.metalnessMap.channel),roughnessMapUv:xt&&m(_.roughnessMap.channel),anisotropyMapUv:X&&m(_.anisotropyMap.channel),clearcoatMapUv:j&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:te&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&m(_.sheenRoughnessMap.channel),specularMapUv:Se&&m(_.specularMap.channel),specularColorMapUv:xe&&m(_.specularColorMap.channel),specularIntensityMapUv:ke&&m(_.specularIntensityMap.channel),transmissionMapUv:Be&&m(_.transmissionMap.channel),thicknessMapUv:Ke&&m(_.thicknessMap.channel),alphaMapUv:ge&&m(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(st||k),vertexNormals:!!G.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:M.isPoints===!0&&!!G.attributes.uv&&(pt||ge),fog:!!V,useFog:_.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||G.attributes.normal===void 0&&st===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ne,skinning:M.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:it,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:re,decodeVideoTexture:pt&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===_t,decodeVideoTextureEmissive:Qt&&_.emissiveMap.isVideoTexture===!0&&tt.getTransfer(_.emissiveMap.colorSpace)===_t,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ht,flipSided:_.side===en,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:_e&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_e&&_.extensions.multiDraw===!0||Fe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let N in _.defines)A.push(N),A.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(p(A,_),S(A,_),A.push(i.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function p(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function S(_,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function I(_){let A=f[_.type],N;if(A){let C=Ri[A];N=li.clone(C.uniforms)}else N=_.uniforms;return N}function b(_,A){let N=u.get(A);return N!==void 0?++N.usedTimes:(N=new Zx(i,A,_,s),c.push(N),u.set(A,N)),N}function T(_){if(--_.usedTimes===0){let A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function E(_){a.remove(_)}function R(){a.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:I,acquireProgram:b,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:R}}function Jx(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Qx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Ef(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Tf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,m,y,g,p){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:m,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:g,group:p},i[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=m,S.materialVariant=o(h),S.groupOrder=y,S.renderOrder=h.renderOrder,S.z=g,S.group=p),e++,S}function l(h,f,m,y,g,p){let S=a(h,f,m,y,g,p);m.transmission>0?n.push(S):m.transparent===!0?s.push(S):t.push(S)}function c(h,f,m,y,g,p){let S=a(h,f,m,y,g,p);m.transmission>0?n.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f,m){t.length>1&&t.sort(h||Qx),n.length>1&&n.sort(f||Ef),s.length>1&&s.sort(f||Ef),m&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let h=e,f=i.length;h<f;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function e_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Tf,i.set(n,[o])):s>=r.length?(o=new Tf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function t_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new we};break;case"SpotLight":t={position:new D,direction:new D,color:new we,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new we,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new we,groundColor:new we};break;case"RectAreaLight":t={color:new we,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function n_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var i_=0;function s_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function r_(i){let e=new t_,t=n_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new Ge,o=new Ge;function a(c){let u=0,d=0,h=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let f=0,m=0,y=0,g=0,p=0,S=0,I=0,b=0,T=0,E=0,R=0;c.sort(s_);for(let A=0,N=c.length;A<N;A++){let C=c[A],M=C.color,B=C.intensity,V=C.distance,G=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===_n?G=C.shadow.map.texture:G=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=M.r*B,d+=M.g*B,h+=M.b*B;else if(C.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(C.sh.coefficients[q],B);R++}else if(C.isDirectionalLight){let q=e.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Y=C.shadow,ne=t.get(C);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,n.directionalShadow[f]=ne,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=C.shadow.matrix,S++}n.directional[f]=q,f++}else if(C.isSpotLight){let q=e.get(C);q.position.setFromMatrixPosition(C.matrixWorld),q.color.copy(M).multiplyScalar(B),q.distance=V,q.coneCos=Math.cos(C.angle),q.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),q.decay=C.decay,n.spot[y]=q;let Y=C.shadow;if(C.map&&(n.spotLightMap[T]=C.map,T++,Y.updateMatrices(C),C.castShadow&&E++),n.spotLightMatrix[y]=Y.matrix,C.castShadow){let ne=t.get(C);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,n.spotShadow[y]=ne,n.spotShadowMap[y]=G,b++}y++}else if(C.isRectAreaLight){let q=e.get(C);q.color.copy(M).multiplyScalar(B),q.halfWidth.set(C.width*.5,0,0),q.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=q,g++}else if(C.isPointLight){let q=e.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),q.distance=C.distance,q.decay=C.decay,C.castShadow){let Y=C.shadow,ne=t.get(C);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,ne.shadowCameraNear=Y.camera.near,ne.shadowCameraFar=Y.camera.far,n.pointShadow[m]=ne,n.pointShadowMap[m]=G,n.pointShadowMatrix[m]=C.shadow.matrix,I++}n.point[m]=q,m++}else if(C.isHemisphereLight){let q=e.get(C);q.skyColor.copy(C.color).multiplyScalar(B),q.groundColor.copy(C.groundColor).multiplyScalar(B),n.hemi[p]=q,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ae.LTC_FLOAT_1,n.rectAreaLTC2=Ae.LTC_FLOAT_2):(n.rectAreaLTC1=Ae.LTC_HALF_1,n.rectAreaLTC2=Ae.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let _=n.hash;(_.directionalLength!==f||_.pointLength!==m||_.spotLength!==y||_.rectAreaLength!==g||_.hemiLength!==p||_.numDirectionalShadows!==S||_.numPointShadows!==I||_.numSpotShadows!==b||_.numSpotMaps!==T||_.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=I,n.pointShadowMap.length=I,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=I,n.spotLightMatrix.length=b+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,_.directionalLength=f,_.pointLength=m,_.spotLength=y,_.rectAreaLength=g,_.hemiLength=p,_.numDirectionalShadows=S,_.numPointShadows=I,_.numSpotShadows=b,_.numSpotMaps=T,_.numLightProbes=R,n.version=i_++)}function l(c,u){let d=0,h=0,f=0,m=0,y=0,g=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){let I=c[p];if(I.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),d++}else if(I.isSpotLight){let b=n.spot[f];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(I.matrixWorld),s.setFromMatrixPosition(I.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),f++}else if(I.isRectAreaLight){let b=n.rectArea[m];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(g),o.identity(),r.copy(I.matrixWorld),r.premultiply(g),o.extractRotation(r),b.halfWidth.set(I.width*.5,0,0),b.halfHeight.set(0,I.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),m++}else if(I.isPointLight){let b=n.point[h];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(g),h++}else if(I.isHemisphereLight){let b=n.hemi[y];b.direction.setFromMatrixPosition(I.matrixWorld),b.direction.transformDirection(g),y++}}}return{setup:a,setupView:l,state:n}}function wf(i){let e=new r_(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function o(h){t.push(h)}function a(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function o_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new wf(i),e.set(s,[a])):r>=o.length?(a=new wf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var a_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,l_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,c_=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],u_=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Af=new Ge,Ho=new D,wu=new D;function h_(i,e,t){let n=new Mr,s=new ye,r=new ye,o=new mt,a=new Oa,l=new za,c={},u=t.maxTextureSize,d={[Bn]:en,[en]:Bn,[Ht]:Ht},h=new rt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:a_,fragmentShader:l_}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let m=new Tt;m.setAttribute("position",new Ct(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new vt(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eo;let p=this.type;this.render=function(E,R,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Md&&(Ue("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Eo);let A=i.getRenderTarget(),N=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),M=i.state;M.setBlending(In),M.buffers.depth.getReversed()===!0?M.buffers.color.setClear(0,0,0,0):M.buffers.color.setClear(1,1,1,1),M.buffers.depth.setTest(!0),M.setScissorTest(!1);let B=p!==this.type;B&&R.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(G=>G.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,G=E.length;V<G;V++){let q=E[V],Y=q.shadow;if(Y===void 0){Ue("WebGLShadowMap:",q,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let ne=Y.getFrameExtents();s.multiply(ne),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,Y.mapSize.y=r.y));let le=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=le,Y.map===null||B===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===wr){if(q.isPointLight){Ue("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Xt(s.x,s.y,{format:_n,type:un,minFilter:Et,magFilter:Et,generateMipmaps:!1}),Y.map.texture.name=q.name+".shadowMap",Y.map.depthTexture=new Hi(s.x,s.y,Hn),Y.map.depthTexture.name=q.name+".shadowMapDepth",Y.map.depthTexture.format=vi,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Wt,Y.map.depthTexture.magFilter=Wt}else q.isPointLight?(Y.map=new kl(s.x),Y.map.depthTexture=new Ua(s.x,ai)):(Y.map=new Xt(s.x,s.y),Y.map.depthTexture=new Hi(s.x,s.y,ai)),Y.map.depthTexture.name=q.name+".shadowMap",Y.map.depthTexture.format=vi,this.type===Eo?(Y.map.depthTexture.compareFunction=le?Ul:Fl,Y.map.depthTexture.minFilter=Et,Y.map.depthTexture.magFilter=Et):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Wt,Y.map.depthTexture.magFilter=Wt);Y.camera.updateProjectionMatrix()}let ce=Y.map.isWebGLCubeRenderTarget?6:1;for(let pe=0;pe<ce;pe++){if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,pe),i.clear();else{pe===0&&(i.setRenderTarget(Y.map),i.clear());let Te=Y.getViewport(pe);o.set(r.x*Te.x,r.y*Te.y,r.x*Te.z,r.y*Te.w),M.viewport(o)}if(q.isPointLight){let Te=Y.camera,it=Y.matrix,je=q.distance||Te.far;je!==Te.far&&(Te.far=je,Te.updateProjectionMatrix()),Ho.setFromMatrixPosition(q.matrixWorld),Te.position.copy(Ho),wu.copy(Te.position),wu.add(c_[pe]),Te.up.copy(u_[pe]),Te.lookAt(wu),Te.updateMatrixWorld(),it.makeTranslation(-Ho.x,-Ho.y,-Ho.z),Af.multiplyMatrices(Te.projectionMatrix,Te.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Af,Te.coordinateSystem,Te.reversedDepth)}else Y.updateMatrices(q);n=Y.getFrustum(),b(R,_,Y.camera,q,this.type)}Y.isPointLightShadow!==!0&&this.type===wr&&S(Y,_),Y.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(A,N,C)};function S(E,R){let _=e.update(y);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Xt(s.x,s.y,{format:_n,type:un})),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(R,null,_,h,y,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(R,null,_,f,y,null)}function I(E,R,_,A){let N=null,C=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)N=C;else if(N=_.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let M=N.uuid,B=R.uuid,V=c[M];V===void 0&&(V={},c[M]=V);let G=V[B];G===void 0&&(G=N.clone(),V[B]=G,R.addEventListener("dispose",T)),N=G}if(N.visible=R.visible,N.wireframe=R.wireframe,A===wr?N.side=R.shadowSide!==null?R.shadowSide:R.side:N.side=R.shadowSide!==null?R.shadowSide:d[R.side],N.alphaMap=R.alphaMap,N.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,N.map=R.map,N.clipShadows=R.clipShadows,N.clippingPlanes=R.clippingPlanes,N.clipIntersection=R.clipIntersection,N.displacementMap=R.displacementMap,N.displacementScale=R.displacementScale,N.displacementBias=R.displacementBias,N.wireframeLinewidth=R.wireframeLinewidth,N.linewidth=R.linewidth,_.isPointLight===!0&&N.isMeshDistanceMaterial===!0){let M=i.properties.get(N);M.light=_}return N}function b(E,R,_,A,N){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&N===wr)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);let B=e.update(E),V=E.material;if(Array.isArray(V)){let G=B.groups;for(let q=0,Y=G.length;q<Y;q++){let ne=G[q],le=V[ne.materialIndex];if(le&&le.visible){let ce=I(E,le,A,N);E.onBeforeShadow(i,E,R,_,B,ce,ne),i.renderBufferDirect(_,null,B,ce,E,ne),E.onAfterShadow(i,E,R,_,B,ce,ne)}}}else if(V.visible){let G=I(E,V,A,N);E.onBeforeShadow(i,E,R,_,B,G,null),i.renderBufferDirect(_,null,B,G,E,null),E.onAfterShadow(i,E,R,_,B,G,null)}}let M=E.children;for(let B=0,V=M.length;B<V;B++)b(M[B],R,_,A,N)}function T(E){E.target.removeEventListener("dispose",T);for(let _ in c){let A=c[_],N=E.target.uuid;N in A&&(A[N].dispose(),delete A[N])}}}function d_(i,e){function t(){let z=!1,ge=new mt,Q=null,Me=new mt(0,0,0,0);return{setMask:function(_e){Q!==_e&&!z&&(i.colorMask(_e,_e,_e,_e),Q=_e)},setLocked:function(_e){z=_e},setClear:function(_e,re,Ce,Le,Mt){Mt===!0&&(_e*=Le,re*=Le,Ce*=Le),ge.set(_e,re,Ce,Le),Me.equals(ge)===!1&&(i.clearColor(_e,re,Ce,Le),Me.copy(ge))},reset:function(){z=!1,Q=null,Me.set(-1,0,0,0)}}}function n(){let z=!1,ge=!1,Q=null,Me=null,_e=null;return{setReversed:function(re){if(ge!==re){let Ce=e.get("EXT_clip_control");re?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),ge=re;let Le=_e;_e=null,this.setClear(Le)}},getReversed:function(){return ge},setTest:function(re){re?se(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(re){Q!==re&&!z&&(i.depthMask(re),Q=re)},setFunc:function(re){if(ge&&(re=nf[re]),Me!==re){switch(re){case Ea:i.depthFunc(i.NEVER);break;case Ta:i.depthFunc(i.ALWAYS);break;case wa:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case Aa:i.depthFunc(i.EQUAL);break;case Ra:i.depthFunc(i.GEQUAL);break;case Ca:i.depthFunc(i.GREATER);break;case Pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Me=re}},setLocked:function(re){z=re},setClear:function(re){_e!==re&&(_e=re,ge&&(re=1-re),i.clearDepth(re))},reset:function(){z=!1,Q=null,Me=null,_e=null,ge=!1}}}function s(){let z=!1,ge=null,Q=null,Me=null,_e=null,re=null,Ce=null,Le=null,Mt=null;return{setTest:function(dt){z||(dt?se(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(dt){ge!==dt&&!z&&(i.stencilMask(dt),ge=dt)},setFunc:function(dt,Fn,Kt){(Q!==dt||Me!==Fn||_e!==Kt)&&(i.stencilFunc(dt,Fn,Kt),Q=dt,Me=Fn,_e=Kt)},setOp:function(dt,Fn,Kt){(re!==dt||Ce!==Fn||Le!==Kt)&&(i.stencilOp(dt,Fn,Kt),re=dt,Ce=Fn,Le=Kt)},setLocked:function(dt){z=dt},setClear:function(dt){Mt!==dt&&(i.clearStencil(dt),Mt=dt)},reset:function(){z=!1,ge=null,Q=null,Me=null,_e=null,re=null,Ce=null,Le=null,Mt=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,m=[],y=null,g=!1,p=null,S=null,I=null,b=null,T=null,E=null,R=null,_=new we(0,0,0),A=0,N=!1,C=null,M=null,B=null,V=null,G=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,ne=0,le=i.getParameter(i.VERSION);le.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(le)[1]),Y=ne>=1):le.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(le)[1]),Y=ne>=2);let ce=null,pe={},Te=i.getParameter(i.SCISSOR_BOX),it=i.getParameter(i.VIEWPORT),je=new mt().fromArray(Te),Pe=new mt().fromArray(it);function Z(z,ge,Q,Me){let _e=new Uint8Array(4),re=i.createTexture();i.bindTexture(z,re),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<Q;Ce++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(ge,0,i.RGBA,1,1,Me,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(ge+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return re}let ue={};ue[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(i.DEPTH_TEST),o.setFunc(ws),lt(!1),st(iu),se(i.CULL_FACE),Je(In);function se(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function Ne(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function We(z,ge){return h[z]!==ge?(i.bindFramebuffer(z,ge),h[z]=ge,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ge),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ge),!0):!1}function Fe(z,ge){let Q=m,Me=!1;if(z){Q=f.get(ge),Q===void 0&&(Q=[],f.set(ge,Q));let _e=z.textures;if(Q.length!==_e.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Ce=_e.length;re<Ce;re++)Q[re]=i.COLOR_ATTACHMENT0+re;Q.length=_e.length,Me=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,Me=!0);Me&&i.drawBuffers(Q)}function pt(z){return y!==z?(i.useProgram(z),y=z,!0):!1}let qe={[us]:i.FUNC_ADD,[Ed]:i.FUNC_SUBTRACT,[Td]:i.FUNC_REVERSE_SUBTRACT};qe[wd]=i.MIN,qe[Ad]=i.MAX;let at={[Rd]:i.ZERO,[Cd]:i.ONE,[Pd]:i.SRC_COLOR,[Ma]:i.SRC_ALPHA,[Ud]:i.SRC_ALPHA_SATURATE,[Nd]:i.DST_COLOR,[Ld]:i.DST_ALPHA,[Id]:i.ONE_MINUS_SRC_COLOR,[Sa]:i.ONE_MINUS_SRC_ALPHA,[Fd]:i.ONE_MINUS_DST_COLOR,[Dd]:i.ONE_MINUS_DST_ALPHA,[Od]:i.CONSTANT_COLOR,[zd]:i.ONE_MINUS_CONSTANT_COLOR,[Bd]:i.CONSTANT_ALPHA,[kd]:i.ONE_MINUS_CONSTANT_ALPHA};function Je(z,ge,Q,Me,_e,re,Ce,Le,Mt,dt){if(z===In){g===!0&&(Ne(i.BLEND),g=!1);return}if(g===!1&&(se(i.BLEND),g=!0),z!==Sd){if(z!==p||dt!==N){if((S!==us||T!==us)&&(i.blendEquation(i.FUNC_ADD),S=us,T=us),dt)switch(z){case kn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cn:i.blendFunc(i.ONE,i.ONE);break;case su:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ru:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Xe("WebGLState: Invalid blending: ",z);break}else switch(z){case kn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case su:Xe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ru:Xe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xe("WebGLState: Invalid blending: ",z);break}I=null,b=null,E=null,R=null,_.set(0,0,0),A=0,p=z,N=dt}return}_e=_e||ge,re=re||Q,Ce=Ce||Me,(ge!==S||_e!==T)&&(i.blendEquationSeparate(qe[ge],qe[_e]),S=ge,T=_e),(Q!==I||Me!==b||re!==E||Ce!==R)&&(i.blendFuncSeparate(at[Q],at[Me],at[re],at[Ce]),I=Q,b=Me,E=re,R=Ce),(Le.equals(_)===!1||Mt!==A)&&(i.blendColor(Le.r,Le.g,Le.b,Mt),_.copy(Le),A=Mt),p=z,N=!1}function He(z,ge){z.side===Ht?Ne(i.CULL_FACE):se(i.CULL_FACE);let Q=z.side===en;ge&&(Q=!Q),lt(Q),z.blending===kn&&z.transparent===!1?Je(In):Je(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);let Me=z.stencilWrite;a.setTest(Me),Me&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Qt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function lt(z){C!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),C=z)}function st(z){z!==yd?(se(i.CULL_FACE),z!==M&&(z===iu?i.cullFace(i.BACK):z===bd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),M=z}function zt(z){z!==B&&(Y&&i.lineWidth(z),B=z)}function Qt(z,ge,Q){z?(se(i.POLYGON_OFFSET_FILL),(V!==ge||G!==Q)&&(V=ge,G=Q,o.getReversed()&&(ge=-ge),i.polygonOffset(ge,Q))):Ne(i.POLYGON_OFFSET_FILL)}function Lt(z){z?se(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function xt(z){z===void 0&&(z=i.TEXTURE0+q-1),ce!==z&&(i.activeTexture(z),ce=z)}function k(z,ge,Q){Q===void 0&&(ce===null?Q=i.TEXTURE0+q-1:Q=ce);let Me=pe[Q];Me===void 0&&(Me={type:void 0,texture:void 0},pe[Q]=Me),(Me.type!==z||Me.texture!==ge)&&(ce!==Q&&(i.activeTexture(Q),ce=Q),i.bindTexture(z,ge||ue[z]),Me.type=z,Me.texture=ge)}function rn(){let z=pe[ce];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function gt(){try{i.compressedTexImage2D(...arguments)}catch(z){Xe("WebGLState:",z)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(z){Xe("WebGLState:",z)}}function x(){try{i.texSubImage2D(...arguments)}catch(z){Xe("WebGLState:",z)}}function H(){try{i.texSubImage3D(...arguments)}catch(z){Xe("WebGLState:",z)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(z){Xe("WebGLState:",z)}}function j(){try{i.compressedTexSubImage3D(...arguments)}catch(z){Xe("WebGLState:",z)}}function me(){try{i.texStorage2D(...arguments)}catch(z){Xe("WebGLState:",z)}}function be(){try{i.texStorage3D(...arguments)}catch(z){Xe("WebGLState:",z)}}function $(){try{i.texImage2D(...arguments)}catch(z){Xe("WebGLState:",z)}}function te(){try{i.texImage3D(...arguments)}catch(z){Xe("WebGLState:",z)}}function ve(z){return d[z]!==void 0?d[z]:i.getParameter(z)}function Oe(z,ge){d[z]!==ge&&(i.pixelStorei(z,ge),d[z]=ge)}function Se(z){je.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),je.copy(z))}function xe(z){Pe.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),Pe.copy(z))}function ke(z,ge){let Q=c.get(ge);Q===void 0&&(Q=new WeakMap,c.set(ge,Q));let Me=Q.get(z);Me===void 0&&(Me=i.getUniformBlockIndex(ge,z.name),Q.set(z,Me))}function Be(z,ge){let Me=c.get(ge).get(z);l.get(ge)!==Me&&(i.uniformBlockBinding(ge,Me,z.__bindingPointIndex),l.set(ge,Me))}function Ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},ce=null,pe={},h={},f=new WeakMap,m=[],y=null,g=!1,p=null,S=null,I=null,b=null,T=null,E=null,R=null,_=new we(0,0,0),A=0,N=!1,C=null,M=null,B=null,V=null,G=null,je.set(0,0,i.canvas.width,i.canvas.height),Pe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:Ne,bindFramebuffer:We,drawBuffers:Fe,useProgram:pt,setBlending:Je,setMaterial:He,setFlipSided:lt,setCullFace:st,setLineWidth:zt,setPolygonOffset:Qt,setScissorTest:Lt,activeTexture:xt,bindTexture:k,unbindTexture:rn,compressedTexImage2D:gt,compressedTexImage3D:w,texImage2D:$,texImage3D:te,pixelStorei:Oe,getParameter:ve,updateUBOMapping:ke,uniformBlockBinding:Be,texStorage2D:me,texStorage3D:be,texSubImage2D:x,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:j,scissor:Se,viewport:xe,reset:Ke}}function f_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ye,u=new WeakMap,d=new Set,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(w,x){return m?new OffscreenCanvas(w,x):fr("canvas")}function g(w,x,H){let X=1,j=gt(w);if((j.width>H||j.height>H)&&(X=H/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let me=Math.floor(X*j.width),be=Math.floor(X*j.height);h===void 0&&(h=y(me,be));let $=x?y(me,be):h;return $.width=me,$.height=be,$.getContext("2d").drawImage(w,0,0,me,be),Ue("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+me+"x"+be+")."),$}else return"data"in w&&Ue("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function p(w){return w.generateMipmaps}function S(w){i.generateMipmap(w)}function I(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(w,x,H,X,j,me=!1){if(w!==null){if(i[w]!==void 0)return i[w];Ue("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let be;X&&(be=e.get("EXT_texture_norm16"),be||Ue("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=x;if(x===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8),H===i.UNSIGNED_SHORT&&be&&($=be.R16_EXT),H===i.SHORT&&be&&($=be.R16_SNORM_EXT)),x===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),x===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8),H===i.UNSIGNED_SHORT&&be&&($=be.RG16_EXT),H===i.SHORT&&be&&($=be.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),x===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),x===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),x===i.RGB&&(H===i.UNSIGNED_SHORT&&be&&($=be.RGB16_EXT),H===i.SHORT&&be&&($=be.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),x===i.RGBA){let te=me?so:tt.getTransfer(j);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=te===_t?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&be&&($=be.RGBA16_EXT),H===i.SHORT&&be&&($=be.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function T(w,x){let H;return w?x===null||x===ai||x===Cr?H=i.DEPTH24_STENCIL8:x===Hn?H=i.DEPTH32F_STENCIL8:x===Rr&&(H=i.DEPTH24_STENCIL8,Ue("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ai||x===Cr?H=i.DEPTH_COMPONENT24:x===Hn?H=i.DEPTH_COMPONENT32F:x===Rr&&(H=i.DEPTH_COMPONENT16),H}function E(w,x){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Wt&&w.minFilter!==Et?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function R(w){let x=w.target;x.removeEventListener("dispose",R),A(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function _(w){let x=w.target;x.removeEventListener("dispose",_),C(x)}function A(w){let x=n.get(w);if(x.__webglInit===void 0)return;let H=w.source,X=f.get(H);if(X){let j=X[x.__cacheKey];j.usedTimes--,j.usedTimes===0&&N(w),Object.keys(X).length===0&&f.delete(H)}n.remove(w)}function N(w){let x=n.get(w);i.deleteTexture(x.__webglTexture);let H=w.source,X=f.get(H);delete X[x.__cacheKey],o.memory.textures--}function C(w){let x=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let j=0;j<x.__webglFramebuffer[X].length;j++)i.deleteFramebuffer(x.__webglFramebuffer[X][j]);else i.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)i.deleteFramebuffer(x.__webglFramebuffer[X]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let H=w.textures;for(let X=0,j=H.length;X<j;X++){let me=n.get(H[X]);me.__webglTexture&&(i.deleteTexture(me.__webglTexture),o.memory.textures--),n.remove(H[X])}n.remove(w)}let M=0;function B(){M=0}function V(){return M}function G(w){M=w}function q(){let w=M;return w>=s.maxTextures&&Ue("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),M+=1,w}function Y(w){let x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function ne(w,x){let H=n.get(w);if(w.isVideoTexture&&k(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&H.__version!==w.version){let X=w.image;if(X===null)Ue("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ue("WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(H,w,x);return}}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+x)}function le(w,x){let H=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){Ne(H,w,x);return}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+x)}function ce(w,x){let H=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){Ne(H,w,x);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+x)}function pe(w,x){let H=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&H.__version!==w.version){We(H,w,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+x)}let Te={[An]:i.REPEAT,[Zn]:i.CLAMP_TO_EDGE,[hr]:i.MIRRORED_REPEAT},it={[Wt]:i.NEAREST,[ja]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[Et]:i.LINEAR,[Ar]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},je={[Yd]:i.NEVER,[Jd]:i.ALWAYS,[Zd]:i.LESS,[Fl]:i.LEQUAL,[Kd]:i.EQUAL,[Ul]:i.GEQUAL,[jd]:i.GREATER,[$d]:i.NOTEQUAL};function Pe(w,x){if(x.type===Hn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Et||x.magFilter===Ar||x.magFilter===zs||x.magFilter===oi||x.minFilter===Et||x.minFilter===Ar||x.minFilter===zs||x.minFilter===oi)&&Ue("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Te[x.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Te[x.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Te[x.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,it[x.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,it[x.minFilter]),x.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,je[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Wt||x.minFilter!==zs&&x.minFilter!==oi||x.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Z(w,x){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",R));let X=x.source,j=f.get(X);j===void 0&&(j={},f.set(X,j));let me=Y(x);if(me!==w.__cacheKey){j[me]===void 0&&(j[me]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),j[me].usedTimes++;let be=j[w.__cacheKey];be!==void 0&&(j[w.__cacheKey].usedTimes--,be.usedTimes===0&&N(x)),w.__cacheKey=me,w.__webglTexture=j[me].texture}return H}function ue(w,x,H){return Math.floor(Math.floor(w/H)/x)}function se(w,x,H,X){let me=w.updateRanges;if(me.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,H,X,x.data);else{me.sort((Oe,Se)=>Oe.start-Se.start);let be=0;for(let Oe=1;Oe<me.length;Oe++){let Se=me[be],xe=me[Oe],ke=Se.start+Se.count,Be=ue(xe.start,x.width,4),Ke=ue(Se.start,x.width,4);xe.start<=ke+1&&Be===Ke&&ue(xe.start+xe.count-1,x.width,4)===Be?Se.count=Math.max(Se.count,xe.start+xe.count-Se.start):(++be,me[be]=xe)}me.length=be+1;let $=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),ve=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Oe=0,Se=me.length;Oe<Se;Oe++){let xe=me[Oe],ke=Math.floor(xe.start/4),Be=Math.ceil(xe.count/4),Ke=ke%x.width,z=Math.floor(ke/x.width),ge=Be,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ke),t.pixelStorei(i.UNPACK_SKIP_ROWS,z),t.texSubImage2D(i.TEXTURE_2D,0,Ke,z,ge,Q,H,X,x.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,ve)}}function Ne(w,x,H){let X=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=i.TEXTURE_3D);let j=Z(w,x),me=x.source;t.bindTexture(X,w.__webglTexture,i.TEXTURE0+H);let be=n.get(me);if(me.version!==be.__version||j===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let Q=tt.getPrimaries(tt.workingColorSpace),Me=x.colorSpace===ji?null:tt.getPrimaries(x.colorSpace),_e=x.colorSpace===ji||Q===Me?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let te=g(x.image,!1,s.maxTextureSize);te=rn(x,te);let ve=r.convert(x.format,x.colorSpace),Oe=r.convert(x.type),Se=b(x.internalFormat,ve,Oe,x.normalized,x.colorSpace,x.isVideoTexture);Pe(X,x);let xe,ke=x.mipmaps,Be=x.isVideoTexture!==!0,Ke=be.__version===void 0||j===!0,z=me.dataReady,ge=E(x,te);if(x.isDepthTexture)Se=T(x.format===gs,x.type),Ke&&(Be?t.texStorage2D(i.TEXTURE_2D,1,Se,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ve,Oe,null));else if(x.isDataTexture)if(ke.length>0){Be&&Ke&&t.texStorage2D(i.TEXTURE_2D,ge,Se,ke[0].width,ke[0].height);for(let Q=0,Me=ke.length;Q<Me;Q++)xe=ke[Q],Be?z&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,xe.width,xe.height,ve,Oe,xe.data):t.texImage2D(i.TEXTURE_2D,Q,Se,xe.width,xe.height,0,ve,Oe,xe.data);x.generateMipmaps=!1}else Be?(Ke&&t.texStorage2D(i.TEXTURE_2D,ge,Se,te.width,te.height),z&&se(x,te,ve,Oe)):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ve,Oe,te.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Be&&Ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,Se,ke[0].width,ke[0].height,te.depth);for(let Q=0,Me=ke.length;Q<Me;Q++)if(xe=ke[Q],x.format!==Vn)if(ve!==null)if(Be){if(z)if(x.layerUpdates.size>0){let _e=yu(xe.width,xe.height,x.format,x.type);for(let re of x.layerUpdates){let Ce=xe.data.subarray(re*_e/xe.data.BYTES_PER_ELEMENT,(re+1)*_e/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,re,xe.width,xe.height,1,ve,Ce)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,xe.width,xe.height,te.depth,ve,xe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Se,xe.width,xe.height,te.depth,0,xe.data,0,0);else Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?z&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,xe.width,xe.height,te.depth,ve,Oe,xe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,Se,xe.width,xe.height,te.depth,0,ve,Oe,xe.data)}else{Be&&Ke&&t.texStorage2D(i.TEXTURE_2D,ge,Se,ke[0].width,ke[0].height);for(let Q=0,Me=ke.length;Q<Me;Q++)xe=ke[Q],x.format!==Vn?ve!==null?Be?z&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,xe.width,xe.height,ve,xe.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,Se,xe.width,xe.height,0,xe.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?z&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,xe.width,xe.height,ve,Oe,xe.data):t.texImage2D(i.TEXTURE_2D,Q,Se,xe.width,xe.height,0,ve,Oe,xe.data)}else if(x.isDataArrayTexture)if(Be){if(Ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,Se,te.width,te.height,te.depth),z)if(x.layerUpdates.size>0){let Q=yu(te.width,te.height,x.format,x.type);for(let Me of x.layerUpdates){let _e=te.data.subarray(Me*Q/te.data.BYTES_PER_ELEMENT,(Me+1)*Q/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Me,te.width,te.height,1,ve,Oe,_e)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ve,Oe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,te.width,te.height,te.depth,0,ve,Oe,te.data);else if(x.isData3DTexture)Be?(Ke&&t.texStorage3D(i.TEXTURE_3D,ge,Se,te.width,te.height,te.depth),z&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ve,Oe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Se,te.width,te.height,te.depth,0,ve,Oe,te.data);else if(x.isFramebufferTexture){if(Ke)if(Be)t.texStorage2D(i.TEXTURE_2D,ge,Se,te.width,te.height);else{let Q=te.width,Me=te.height;for(let _e=0;_e<ge;_e++)t.texImage2D(i.TEXTURE_2D,_e,Se,Q,Me,0,ve,Oe,null),Q>>=1,Me>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),te.parentNode!==Q){Q.appendChild(te),d.add(x),Q.onpaint=Me=>{let _e=Me.changedElements;for(let re of d)_e.includes(re.image)&&(re.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let _e=i.RGBA,re=i.RGBA,Ce=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,_e,re,Ce,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ke.length>0){if(Be&&Ke){let Q=gt(ke[0]);t.texStorage2D(i.TEXTURE_2D,ge,Se,Q.width,Q.height)}for(let Q=0,Me=ke.length;Q<Me;Q++)xe=ke[Q],Be?z&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ve,Oe,xe):t.texImage2D(i.TEXTURE_2D,Q,Se,ve,Oe,xe);x.generateMipmaps=!1}else if(Be){if(Ke){let Q=gt(te);t.texStorage2D(i.TEXTURE_2D,ge,Se,Q.width,Q.height)}z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Oe,te)}else t.texImage2D(i.TEXTURE_2D,0,Se,ve,Oe,te);p(x)&&S(X),be.__version=me.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function We(w,x,H){if(x.image.length!==6)return;let X=Z(w,x),j=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+H);let me=n.get(j);if(j.version!==me.__version||X===!0){t.activeTexture(i.TEXTURE0+H);let be=tt.getPrimaries(tt.workingColorSpace),$=x.colorSpace===ji?null:tt.getPrimaries(x.colorSpace),te=x.colorSpace===ji||be===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let ve=x.isCompressedTexture||x.image[0].isCompressedTexture,Oe=x.image[0]&&x.image[0].isDataTexture,Se=[];for(let re=0;re<6;re++)!ve&&!Oe?Se[re]=g(x.image[re],!0,s.maxCubemapSize):Se[re]=Oe?x.image[re].image:x.image[re],Se[re]=rn(x,Se[re]);let xe=Se[0],ke=r.convert(x.format,x.colorSpace),Be=r.convert(x.type),Ke=b(x.internalFormat,ke,Be,x.normalized,x.colorSpace),z=x.isVideoTexture!==!0,ge=me.__version===void 0||X===!0,Q=j.dataReady,Me=E(x,xe);Pe(i.TEXTURE_CUBE_MAP,x);let _e;if(ve){z&&ge&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ke,xe.width,xe.height);for(let re=0;re<6;re++){_e=Se[re].mipmaps;for(let Ce=0;Ce<_e.length;Ce++){let Le=_e[Ce];x.format!==Vn?ke!==null?z?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce,0,0,Le.width,Le.height,ke,Le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce,Ke,Le.width,Le.height,0,Le.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce,0,0,Le.width,Le.height,ke,Be,Le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce,Ke,Le.width,Le.height,0,ke,Be,Le.data)}}}else{if(_e=x.mipmaps,z&&ge){_e.length>0&&Me++;let re=gt(Se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ke,re.width,re.height)}for(let re=0;re<6;re++)if(Oe){z?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Se[re].width,Se[re].height,ke,Be,Se[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Se[re].width,Se[re].height,0,ke,Be,Se[re].data);for(let Ce=0;Ce<_e.length;Ce++){let Mt=_e[Ce].image[re].image;z?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce+1,0,0,Mt.width,Mt.height,ke,Be,Mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce+1,Ke,Mt.width,Mt.height,0,ke,Be,Mt.data)}}else{z?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ke,Be,Se[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,ke,Be,Se[re]);for(let Ce=0;Ce<_e.length;Ce++){let Le=_e[Ce];z?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce+1,0,0,ke,Be,Le.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ce+1,Ke,ke,Be,Le.image[re])}}}p(x)&&S(i.TEXTURE_CUBE_MAP),me.__version=j.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Fe(w,x,H,X,j,me){let be=r.convert(H.format,H.colorSpace),$=r.convert(H.type),te=b(H.internalFormat,be,$,H.normalized,H.colorSpace),ve=n.get(x),Oe=n.get(H);if(Oe.__renderTarget=x,!ve.__hasExternalTextures){let Se=Math.max(1,x.width>>me),xe=Math.max(1,x.height>>me);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,me,te,Se,xe,x.depth,0,be,$,null):t.texImage2D(j,me,te,Se,xe,0,be,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,j,Oe.__webglTexture,0,Lt(x)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,j,Oe.__webglTexture,me),t.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(w,x,H){if(i.bindRenderbuffer(i.RENDERBUFFER,w),x.depthBuffer){let X=x.depthTexture,j=X&&X.isDepthTexture?X.type:null,me=T(x.stencilBuffer,j),be=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;xt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Lt(x),me,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt(x),me,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,me,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,be,i.RENDERBUFFER,w)}else{let X=x.textures;for(let j=0;j<X.length;j++){let me=X[j],be=r.convert(me.format,me.colorSpace),$=r.convert(me.type),te=b(me.internalFormat,be,$,me.normalized,me.colorSpace);xt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Lt(x),te,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt(x),te,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,te,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function qe(w,x,H){let X=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let j=n.get(x.depthTexture);if(j.__renderTarget=x,(!j.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X){if(j.__webglInit===void 0&&(j.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),j.__webglTexture===void 0){j.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Pe(i.TEXTURE_CUBE_MAP,x.depthTexture);let ve=r.convert(x.depthTexture.format),Oe=r.convert(x.depthTexture.type),Se;x.depthTexture.format===vi?Se=i.DEPTH_COMPONENT24:x.depthTexture.format===gs&&(Se=i.DEPTH24_STENCIL8);for(let xe=0;xe<6;xe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,Se,x.width,x.height,0,ve,Oe,null)}}else ne(x.depthTexture,0);let me=j.__webglTexture,be=Lt(x),$=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,te=x.depthTexture.format===gs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===vi)xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,$,me,0,be):i.framebufferTexture2D(i.FRAMEBUFFER,te,$,me,0);else if(x.depthTexture.format===gs)xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,$,me,0,be):i.framebufferTexture2D(i.FRAMEBUFFER,te,$,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function at(w){let x=n.get(w),H=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){let X=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let j=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),x.__depthDisposeCallback=j}x.__boundDepthTexture=X}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)qe(x.__webglFramebuffer[X],w,X);else{let X=w.texture.mipmaps;X&&X.length>0?qe(x.__webglFramebuffer[0],w,0):qe(x.__webglFramebuffer,w,0)}else if(H){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=i.createRenderbuffer(),pt(x.__webglDepthbuffer[X],w,!1);else{let j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=x.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,me)}}else{let X=w.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),pt(x.__webglDepthbuffer,w,!1);else{let j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,me)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Je(w,x,H){let X=n.get(w);x!==void 0&&Fe(X.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&at(w)}function He(w){let x=w.texture,H=n.get(w),X=n.get(x);w.addEventListener("dispose",_);let j=w.textures,me=w.isWebGLCubeRenderTarget===!0,be=j.length>1;if(be||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=x.version,o.memory.textures++),me){H.__webglFramebuffer=[];for(let $=0;$<6;$++)if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer[$]=[];for(let te=0;te<x.mipmaps.length;te++)H.__webglFramebuffer[$][te]=i.createFramebuffer()}else H.__webglFramebuffer[$]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer=[];for(let $=0;$<x.mipmaps.length;$++)H.__webglFramebuffer[$]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(be)for(let $=0,te=j.length;$<te;$++){let ve=n.get(j[$]);ve.__webglTexture===void 0&&(ve.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&xt(w)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let $=0;$<j.length;$++){let te=j[$];H.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[$]);let ve=r.convert(te.format,te.colorSpace),Oe=r.convert(te.type),Se=b(te.internalFormat,ve,Oe,te.normalized,te.colorSpace,w.isXRRenderTarget===!0),xe=Lt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,xe,Se,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,H.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),pt(H.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(me){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Pe(i.TEXTURE_CUBE_MAP,x);for(let $=0;$<6;$++)if(x.mipmaps&&x.mipmaps.length>0)for(let te=0;te<x.mipmaps.length;te++)Fe(H.__webglFramebuffer[$][te],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,te);else Fe(H.__webglFramebuffer[$],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);p(x)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let $=0,te=j.length;$<te;$++){let ve=j[$],Oe=n.get(ve),Se=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Se=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Se,Oe.__webglTexture),Pe(Se,ve),Fe(H.__webglFramebuffer,w,ve,i.COLOR_ATTACHMENT0+$,Se,0),p(ve)&&S(Se)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&($=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,X.__webglTexture),Pe($,x),x.mipmaps&&x.mipmaps.length>0)for(let te=0;te<x.mipmaps.length;te++)Fe(H.__webglFramebuffer[te],w,x,i.COLOR_ATTACHMENT0,$,te);else Fe(H.__webglFramebuffer,w,x,i.COLOR_ATTACHMENT0,$,0);p(x)&&S($),t.unbindTexture()}w.depthBuffer&&at(w)}function lt(w){let x=w.textures;for(let H=0,X=x.length;H<X;H++){let j=x[H];if(p(j)){let me=I(w),be=n.get(j).__webglTexture;t.bindTexture(me,be),S(me),t.unbindTexture()}}}let st=[],zt=[];function Qt(w){if(w.samples>0){if(xt(w)===!1){let x=w.textures,H=w.width,X=w.height,j=i.COLOR_BUFFER_BIT,me=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,be=n.get(w),$=x.length>1;if($)for(let ve=0;ve<x.length;ve++)t.bindFramebuffer(i.FRAMEBUFFER,be.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,be.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer);let te=w.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,be.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let ve=0;ve<x.length;ve++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,be.__webglColorRenderbuffer[ve]);let Oe=n.get(x[ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Oe,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,j,i.NEAREST),l===!0&&(st.length=0,zt.length=0,st.push(i.COLOR_ATTACHMENT0+ve),w.depthBuffer&&w.resolveDepthBuffer===!1&&(st.push(me),zt.push(me),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,zt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let ve=0;ve<x.length;ve++){t.bindFramebuffer(i.FRAMEBUFFER,be.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,be.__webglColorRenderbuffer[ve]);let Oe=n.get(x[ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,be.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,Oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){let x=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Lt(w){return Math.min(s.maxSamples,w.samples)}function xt(w){let x=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function k(w){let x=o.render.frame;u.get(w)!==x&&(u.set(w,x),w.update())}function rn(w,x){let H=w.colorSpace,X=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Sn&&H!==ji&&(tt.getTransfer(H)===_t?(X!==Vn||j!==xn)&&Ue("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xe("WebGLTextures: Unsupported texture color space:",H)),x}function gt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=B,this.getTextureUnits=V,this.setTextureUnits=G,this.setTexture2D=ne,this.setTexture2DArray=le,this.setTexture3D=ce,this.setTextureCube=pe,this.rebindTextures=Je,this.setupRenderTarget=He,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=at,this.setupFrameBufferTexture=Fe,this.useMultisampledRTT=xt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function p_(i,e){function t(n,s=ji){let r,o=tt.getTransfer(s);if(n===xn)return i.UNSIGNED_BYTE;if(n===Ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lu)return i.BYTE;if(n===cu)return i.SHORT;if(n===Rr)return i.UNSIGNED_SHORT;if(n===$a)return i.INT;if(n===ai)return i.UNSIGNED_INT;if(n===Hn)return i.FLOAT;if(n===un)return i.HALF_FLOAT;if(n===du)return i.ALPHA;if(n===fu)return i.RGB;if(n===Vn)return i.RGBA;if(n===vi)return i.DEPTH_COMPONENT;if(n===gs)return i.DEPTH_STENCIL;if(n===el)return i.RED;if(n===tl)return i.RED_INTEGER;if(n===_n)return i.RG;if(n===nl)return i.RG_INTEGER;if(n===il)return i.RGBA_INTEGER;if(n===Do||n===No||n===Fo||n===Uo)if(o===_t)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Do)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Do)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sl||n===rl||n===ol||n===al)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ol)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ll||n===cl||n===ul||n===hl||n===dl||n===Oo||n===fl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ll||n===cl)return o===_t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ul)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===hl)return r.COMPRESSED_R11_EAC;if(n===dl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Oo)return r.COMPRESSED_RG11_EAC;if(n===fl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===pl||n===ml||n===gl||n===vl||n===xl||n===_l||n===yl||n===bl||n===Ml||n===Sl||n===El||n===Tl||n===wl||n===Al)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===pl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_l)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===yl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ml)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===El)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Tl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rl||n===Cl||n===Pl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Rl)return o===_t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Il||n===Ll||n===zo||n===Dl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ll)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Dl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var m_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,g_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Nu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new po(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new rt({vertexShader:m_,fragmentShader:g_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vt(new Gi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fu=class extends si{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,m=null,y=typeof XRWebGLBinding<"u",g=new Nu,p={},S=t.getContextAttributes(),I=null,b=null,T=[],E=[],R=new ye,_=null,A=new Jt;A.viewport=new mt;let N=new Jt;N.viewport=new mt;let C=[A,N],M=new Ya,B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ue=T[Z];return ue===void 0&&(ue=new xr,T[Z]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(Z){let ue=T[Z];return ue===void 0&&(ue=new xr,T[Z]=ue),ue.getGripSpace()},this.getHand=function(Z){let ue=T[Z];return ue===void 0&&(ue=new xr,T[Z]=ue),ue.getHandSpace()};function G(Z){let ue=E.indexOf(Z.inputSource);if(ue===-1)return;let se=T[ue];se!==void 0&&(se.update(Z.inputSource,Z.frame,c||o),se.dispatchEvent({type:Z.type,data:Z.inputSource}))}function q(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Y);for(let Z=0;Z<T.length;Z++){let ue=E[Z];ue!==null&&(E[Z]=null,T[Z].disconnect(ue))}B=null,V=null,g.reset();for(let Z in p)delete p[Z];e.setRenderTarget(I),f=null,h=null,d=null,s=null,b=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Ue("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&Ue("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(I=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Y),S.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let se=null,Ne=null,We=null;S.depth&&(We=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=S.stencil?gs:vi,Ne=S.stencil?Cr:ai);let Fe={colorFormat:t.RGBA8,depthFormat:We,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Fe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),b=new Xt(h.textureWidth,h.textureHeight,{format:Vn,type:xn,depthTexture:new Hi(h.textureWidth,h.textureHeight,Ne,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let se={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,se),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Xt(f.framebufferWidth,f.framebufferHeight,{format:Vn,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Pe.setContext(s),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Y(Z){for(let ue=0;ue<Z.removed.length;ue++){let se=Z.removed[ue],Ne=E.indexOf(se);Ne>=0&&(E[Ne]=null,T[Ne].disconnect(se))}for(let ue=0;ue<Z.added.length;ue++){let se=Z.added[ue],Ne=E.indexOf(se);if(Ne===-1){for(let Fe=0;Fe<T.length;Fe++)if(Fe>=E.length){E.push(se),Ne=Fe;break}else if(E[Fe]===null){E[Fe]=se,Ne=Fe;break}if(Ne===-1)break}let We=T[Ne];We&&We.connect(se)}}let ne=new D,le=new D;function ce(Z,ue,se){ne.setFromMatrixPosition(ue.matrixWorld),le.setFromMatrixPosition(se.matrixWorld);let Ne=ne.distanceTo(le),We=ue.projectionMatrix.elements,Fe=se.projectionMatrix.elements,pt=We[14]/(We[10]-1),qe=We[14]/(We[10]+1),at=(We[9]+1)/We[5],Je=(We[9]-1)/We[5],He=(We[8]-1)/We[0],lt=(Fe[8]+1)/Fe[0],st=pt*He,zt=pt*lt,Qt=Ne/(-He+lt),Lt=Qt*-He;if(ue.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Lt),Z.translateZ(Qt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),We[10]===-1)Z.projectionMatrix.copy(ue.projectionMatrix),Z.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{let xt=pt+Qt,k=qe+Qt,rn=st-Lt,gt=zt+(Ne-Lt),w=at*qe/k*xt,x=Je*qe/k*xt;Z.projectionMatrix.makePerspective(rn,gt,w,x,xt,k),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function pe(Z,ue){ue===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ue.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ue=Z.near,se=Z.far;g.texture!==null&&(g.depthNear>0&&(ue=g.depthNear),g.depthFar>0&&(se=g.depthFar)),M.near=N.near=A.near=ue,M.far=N.far=A.far=se,(B!==M.near||V!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),B=M.near,V=M.far),M.layers.mask=Z.layers.mask|6,A.layers.mask=M.layers.mask&-5,N.layers.mask=M.layers.mask&-3;let Ne=Z.parent,We=M.cameras;pe(M,Ne);for(let Fe=0;Fe<We.length;Fe++)pe(We[Fe],Ne);We.length===2?ce(M,A,N):M.projectionMatrix.copy(A.projectionMatrix),Te(Z,M,Ne)};function Te(Z,ue,se){se===null?Z.matrix.copy(ue.matrixWorld):(Z.matrix.copy(se.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ue.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ue.projectionMatrix),Z.projectionMatrixInverse.copy(ue.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Cs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Z){l=Z,h!==null&&(h.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(M)},this.getCameraTexture=function(Z){return p[Z]};let it=null;function je(Z,ue){if(u=ue.getViewerPose(c||o),m=ue,u!==null){let se=u.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let Ne=!1;se.length!==M.cameras.length&&(M.cameras.length=0,Ne=!0);for(let qe=0;qe<se.length;qe++){let at=se[qe],Je=null;if(f!==null)Je=f.getViewport(at);else{let lt=d.getViewSubImage(h,at);Je=lt.viewport,qe===0&&(e.setRenderTargetTextures(b,lt.colorTexture,lt.depthStencilTexture),e.setRenderTarget(b))}let He=C[qe];He===void 0&&(He=new Jt,He.layers.enable(qe),He.viewport=new mt,C[qe]=He),He.matrix.fromArray(at.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(at.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(Je.x,Je.y,Je.width,Je.height),qe===0&&(M.matrix.copy(He.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Ne===!0&&M.cameras.push(He)}let We=s.enabledFeatures;if(We&&We.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();let qe=d.getDepthInformation(se[0]);qe&&qe.isValid&&qe.texture&&g.init(qe,s.renderState)}if(We&&We.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let qe=0;qe<se.length;qe++){let at=se[qe].camera;if(at){let Je=p[at];Je||(Je=new po,p[at]=Je);let He=d.getCameraImage(at);Je.sourceTexture=He}}}}for(let se=0;se<T.length;se++){let Ne=E[se],We=T[se];Ne!==null&&We!==void 0&&We.update(Ne,ue,c||o)}it&&it(Z,ue),ue.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ue}),m=null}let Pe=new Rf;Pe.setAnimationLoop(je),this.setAnimationLoop=function(Z){it=Z},this.dispose=function(){}}},v_=new Ge,Nf=new Ze;Nf.set(-1,0,0,0,1,0,0,0,1);function x_(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,vu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,I,b){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,b)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),y(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,S,I):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===en&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===en&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=e.get(p),I=S.envMap,b=S.envMapRotation;I&&(g.envMap.value=I,g.envMapRotation.value.setFromMatrix4(v_.makeRotationFromEuler(b)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Nf),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,S,I){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=I*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){let S=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function __(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,T){let E=T.program;n.uniformBlockBinding(b,E)}function c(b,T){let E=s[b.id];E===void 0&&(g(b),E=u(b),s[b.id]=E,b.addEventListener("dispose",S));let R=T.program;n.updateUBOMapping(b,R);let _=e.render.frame;r[b.id]!==_&&(h(b),r[b.id]=_)}function u(b){let T=d();b.__bindingPointIndex=T;let E=i.createBuffer(),R=b.__size,_=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,R,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,E),E}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return Xe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){let T=s[b.id],E=b.uniforms,R=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let _=0,A=E.length;_<A;_++){let N=E[_];if(Array.isArray(N))for(let C=0,M=N.length;C<M;C++)f(N[C],_,C,R);else f(N,_,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,T,E,R){if(y(b,T,E,R)===!0){let _=b.__offset,A=b.value;if(Array.isArray(A)){let N=0;for(let C=0;C<A.length;C++){let M=A[C],B=p(M);m(M,b.__data,N),typeof M!="number"&&typeof M!="boolean"&&!M.isMatrix3&&!ArrayBuffer.isView(M)&&(N+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,b.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,b.__data)}}function m(b,T,E){typeof b=="number"||typeof b=="boolean"?T[0]=b:b.isMatrix3?(T[0]=b.elements[0],T[1]=b.elements[1],T[2]=b.elements[2],T[3]=0,T[4]=b.elements[3],T[5]=b.elements[4],T[6]=b.elements[5],T[7]=0,T[8]=b.elements[6],T[9]=b.elements[7],T[10]=b.elements[8],T[11]=0):ArrayBuffer.isView(b)?T.set(new b.constructor(b.buffer,b.byteOffset,T.length)):b.toArray(T,E)}function y(b,T,E,R){let _=b.value,A=T+"_"+E;if(R[A]===void 0)return typeof _=="number"||typeof _=="boolean"?R[A]=_:ArrayBuffer.isView(_)?R[A]=_.slice():R[A]=_.clone(),!0;{let N=R[A];if(typeof _=="number"||typeof _=="boolean"){if(N!==_)return R[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(N.equals(_)===!1)return N.copy(_),!0}}return!1}function g(b){let T=b.uniforms,E=0,R=16;for(let A=0,N=T.length;A<N;A++){let C=Array.isArray(T[A])?T[A]:[T[A]];for(let M=0,B=C.length;M<B;M++){let V=C[M],G=Array.isArray(V.value)?V.value:[V.value];for(let q=0,Y=G.length;q<Y;q++){let ne=G[q],le=p(ne),ce=E%R,pe=ce%le.boundary,Te=ce+pe;E+=pe,Te!==0&&R-Te<le.storage&&(E+=R-Te),V.__data=new Float32Array(le.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=E,E+=le.storage}}}let _=E%R;return _>0&&(E+=R-_),b.__size=E,b.__cache={},this}function p(b){let T={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(T.boundary=4,T.storage=4):b.isVector2?(T.boundary=8,T.storage=8):b.isVector3||b.isColor?(T.boundary=16,T.storage=12):b.isVector4?(T.boundary=16,T.storage=16):b.isMatrix3?(T.boundary=48,T.storage=48):b.isMatrix4?(T.boundary=64,T.storage=64):b.isTexture?Ue("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(T.boundary=16,T.storage=b.byteLength):Ue("WebGLRenderer: Unsupported uniform value type.",b),T}function S(b){let T=b.target;T.removeEventListener("dispose",S);let E=o.indexOf(T.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function I(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:I}}var y_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ai=null;function b_(){return Ai===null&&(Ai=new _i(y_,16,16,_n,un),Ai.name="DFG_LUT",Ai.minFilter=Et,Ai.magFilter=Et,Ai.wrapS=Zn,Ai.wrapT=Zn,Ai.generateMipmaps=!1,Ai.needsUpdate=!0),Ai}var Hl=class{constructor(e={}){let{canvas:t=Qd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=xn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let y=f,g=new Set([il,nl,tl]),p=new Set([xn,ai,Rr,Cr,Ja,Qa]),S=new Uint32Array(4),I=new Int32Array(4),b=new D,T=null,E=null,R=[],_=[],A=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,C=!1,M=null,B=null,V=null,G=null;this._outputColorSpace=Gt;let q=0,Y=0,ne=null,le=-1,ce=null,pe=new mt,Te=new mt,it=null,je=new we(0),Pe=0,Z=t.width,ue=t.height,se=1,Ne=null,We=null,Fe=new mt(0,0,Z,ue),pt=new mt(0,0,Z,ue),qe=!1,at=new Mr,Je=!1,He=!1,lt=new Ge,st=new D,zt=new mt,Qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Lt=!1;function xt(){return ne===null?se:1}let k=n;function rn(v,L){return t.getContext(v,L)}try{let v={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"185"}`),t.addEventListener("webglcontextlost",Mt,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",Fn,!1),k===null){let L="webgl2";if(k=rn(L,v),k===null)throw rn(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(v){throw Xe("WebGLRenderer: "+v.message),v}let gt,w,x,H,X,j,me,be,$,te,ve,Oe,Se,xe,ke,Be,Ke,z,ge,Q,Me,_e,re;function Ce(){gt=new Rv(k),gt.init(),Me=new p_(k,gt),w=new yv(k,gt,e,Me),x=new d_(k,gt),w.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),B=k.createFramebuffer(),V=k.createFramebuffer(),G=k.createFramebuffer(),H=new Iv(k),X=new Jx,j=new f_(k,gt,x,X,w,Me,H),me=new Av(N),be=new Fm(k),_e=new xv(k,be),$=new Cv(k,be,H,_e),te=new Dv(k,$,be,_e,H),z=new Lv(k,w,j),ke=new bv(X),ve=new $x(N,me,gt,w,_e,ke),Oe=new x_(N,X),Se=new e_,xe=new o_(gt),Ke=new vv(N,me,x,te,m,l),Be=new h_(N,te,w),re=new __(k,H,w,x),ge=new _v(k,gt,H),Q=new Pv(k,gt,H),H.programs=ve.programs,N.capabilities=w,N.extensions=gt,N.properties=X,N.renderLists=Se,N.shadowMap=Be,N.state=x,N.info=H}Ce(),y!==xn&&(A=new Fv(y,t.width,t.height,a,s,r));let Le=new Fu(N,k);this.xr=Le,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let v=gt.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=gt.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(v){v!==void 0&&(se=v,this.setSize(Z,ue,!1))},this.getSize=function(v){return v.set(Z,ue)},this.setSize=function(v,L,U=!0){if(Le.isPresenting){Ue("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=v,ue=L,t.width=Math.floor(v*se),t.height=Math.floor(L*se),U===!0&&(t.style.width=v+"px",t.style.height=L+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(Z*se,ue*se).floor()},this.setDrawingBufferSize=function(v,L,U){Z=v,ue=L,se=U,t.width=Math.floor(v*U),t.height=Math.floor(L*U),this.setViewport(0,0,v,L)},this.setEffects=function(v){if(y===xn){Xe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let L=0;L<v.length;L++)if(v[L].isOutputPass===!0){Ue("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(pe)},this.getViewport=function(v){return v.copy(Fe)},this.setViewport=function(v,L,U,F){v.isVector4?Fe.set(v.x,v.y,v.z,v.w):Fe.set(v,L,U,F),x.viewport(pe.copy(Fe).multiplyScalar(se).round())},this.getScissor=function(v){return v.copy(pt)},this.setScissor=function(v,L,U,F){v.isVector4?pt.set(v.x,v.y,v.z,v.w):pt.set(v,L,U,F),x.scissor(Te.copy(pt).multiplyScalar(se).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(v){x.setScissorTest(qe=v)},this.setOpaqueSort=function(v){Ne=v},this.setTransparentSort=function(v){We=v},this.getClearColor=function(v){return v.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,U=!0){let F=0;if(v){let O=!1;if(ne!==null){let J=ne.texture.format;O=g.has(J)}if(O){let J=ne.texture.type,ae=p.has(J),he=Ke.getClearColor(),de=Ke.getClearAlpha(),K=he.r,oe=he.g,Ee=he.b;ae?(S[0]=K,S[1]=oe,S[2]=Ee,S[3]=de,k.clearBufferuiv(k.COLOR,0,S)):(I[0]=K,I[1]=oe,I[2]=Ee,I[3]=de,k.clearBufferiv(k.COLOR,0,I))}else F|=k.COLOR_BUFFER_BIT}L&&(F|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),U&&(F|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F!==0&&k.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),M=v},this.dispose=function(){t.removeEventListener("webglcontextlost",Mt,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",Fn,!1),Ke.dispose(),Se.dispose(),xe.dispose(),X.dispose(),me.dispose(),te.dispose(),_e.dispose(),re.dispose(),ve.dispose(),Le.dispose(),Le.removeEventListener("sessionstart",Vr),Le.removeEventListener("sessionend",Gr),hi.stop()};function Mt(v){v.preventDefault(),ro("WebGLRenderer: Context Lost."),C=!0}function dt(){ro("WebGLRenderer: Context Restored."),C=!1;let v=H.autoReset,L=Be.enabled,U=Be.autoUpdate,F=Be.needsUpdate,O=Be.type;Ce(),H.autoReset=v,Be.enabled=L,Be.autoUpdate=U,Be.needsUpdate=F,Be.type=O}function Fn(v){Xe("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Kt(v){let L=v.target;L.removeEventListener("dispose",Kt),Hr(L)}function Hr(v){Un(v),X.remove(v)}function Un(v){let L=X.get(v).programs;L!==void 0&&(L.forEach(function(U){ve.releaseProgram(U)}),v.isShaderMaterial&&ve.releaseShaderCache(v))}this.renderBufferDirect=function(v,L,U,F,O,J){L===null&&(L=Qt);let ae=O.isMesh&&O.matrixWorld.determinantAffine()<0,he=pc(v,L,U,F,O);x.setMaterial(F,ae);let de=U.index,K=1;if(F.wireframe===!0){if(de=$.getWireframeAttribute(U),de===void 0)return;K=2}let oe=U.drawRange,Ee=U.attributes.position,fe=oe.start*K,Ve=(oe.start+oe.count)*K;J!==null&&(fe=Math.max(fe,J.start*K),Ve=Math.min(Ve,(J.start+J.count)*K)),de!==null?(fe=Math.max(fe,0),Ve=Math.min(Ve,de.count)):Ee!=null&&(fe=Math.max(fe,0),Ve=Math.min(Ve,Ee.count));let $e=Ve-fe;if($e<0||$e===1/0)return;_e.setup(O,F,he,U,de);let ct,ze=ge;if(de!==null&&(ct=be.get(de),ze=Q,ze.setIndex(ct)),O.isMesh)F.wireframe===!0?(x.setLineWidth(F.wireframeLinewidth*xt()),ze.setMode(k.LINES)):ze.setMode(k.TRIANGLES);else if(O.isLine){let Ut=F.linewidth;Ut===void 0&&(Ut=1),x.setLineWidth(Ut*xt()),O.isLineSegments?ze.setMode(k.LINES):O.isLineLoop?ze.setMode(k.LINE_LOOP):ze.setMode(k.LINE_STRIP)}else O.isPoints?ze.setMode(k.POINTS):O.isSprite&&ze.setMode(k.TRIANGLES);if(O.isBatchedMesh)if(gt.get("WEBGL_multi_draw"))ze.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ut=O._multiDrawStarts,Re=O._multiDrawCounts,fn=O._multiDrawCount,ft=de?be.get(de).bytesPerElement:1,bn=X.get(F).currentProgram.getUniforms();for(let Xn=0;Xn<fn;Xn++)bn.setValue(k,"_gl_DrawID",Xn),ze.render(Ut[Xn]/ft,Re[Xn])}else if(O.isInstancedMesh)ze.renderInstances(fe,$e,O.count);else if(U.isInstancedBufferGeometry){let Ut=U._maxInstanceCount!==void 0?U._maxInstanceCount:1/0,Re=Math.min(U.instanceCount,Ut);ze.renderInstances(fe,$e,Re)}else ze.render(fe,$e)};function jt(v,L,U){v.transparent===!0&&v.side===Ht&&v.forceSinglePass===!1?(v.side=en,v.needsUpdate=!0,ts(v,L,U),v.side=Bn,v.needsUpdate=!0,ts(v,L,U),v.side=Ht):ts(v,L,U)}this.compile=function(v,L,U=null){U===null&&(U=v),E=xe.get(U),E.init(L),_.push(E),U.traverseVisible(function(O){O.isLight&&O.layers.test(L.layers)&&(E.pushLight(O),O.castShadow&&E.pushShadow(O))}),v!==U&&v.traverseVisible(function(O){O.isLight&&O.layers.test(L.layers)&&(E.pushLight(O),O.castShadow&&E.pushShadow(O))}),E.setupLights();let F=new Set;return v.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let J=O.material;if(J)if(Array.isArray(J))for(let ae=0;ae<J.length;ae++){let he=J[ae];jt(he,U,O),F.add(he)}else jt(J,U,O),F.add(J)}),E=_.pop(),F},this.compileAsync=function(v,L,U=null){let F=this.compile(v,L,U);return new Promise(O=>{function J(){if(F.forEach(function(ae){X.get(ae).currentProgram.isReady()&&F.delete(ae)}),F.size===0){O(v);return}setTimeout(J,10)}gt.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let qs=null;function Ys(v){qs&&qs(v)}function Vr(){hi.stop()}function Gr(){hi.start()}let hi=new Rf;hi.setAnimationLoop(Ys),typeof self<"u"&&hi.setContext(self),this.setAnimationLoop=function(v){qs=v,Le.setAnimationLoop(v),v===null?hi.stop():hi.start()},Le.addEventListener("sessionstart",Vr),Le.addEventListener("sessionend",Gr),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){Xe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;M!==null&&M.renderStart(v,L);let U=Le.enabled===!0&&Le.isPresenting===!0,F=A!==null&&(ne===null||U)&&A.begin(N,ne);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),Le.enabled===!0&&Le.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Le.cameraAutoUpdate===!0&&Le.updateCamera(L),L=Le.getCamera()),v.isScene===!0&&v.onBeforeRender(N,v,L,ne),E=xe.get(v,_.length),E.init(L),E.state.textureUnits=j.getTextureUnits(),_.push(E),lt.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),at.setFromProjectionMatrix(lt,ni,L.reversedDepth),He=this.localClippingEnabled,Je=ke.init(this.clippingPlanes,He),T=Se.get(v,R.length),T.init(),R.push(T),Le.enabled===!0&&Le.isPresenting===!0){let ae=N.xr.getDepthSensingMesh();ae!==null&&dn(ae,L,-1/0,N.sortObjects)}dn(v,L,0,N.sortObjects),T.finish(),N.sortObjects===!0&&T.sort(Ne,We,L.reversedDepth),Lt=Le.enabled===!1||Le.isPresenting===!1||Le.hasDepthSensing()===!1,Lt&&Ke.addToRenderList(T,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Je===!0&&ke.beginShadows();let O=E.state.shadowsArray;if(Be.render(O,v,L),Je===!0&&ke.endShadows(),(F&&A.hasRenderPass())===!1){let ae=T.opaque,he=T.transmissive;if(E.setupLights(),L.isArrayCamera){let de=L.cameras;if(he.length>0)for(let K=0,oe=de.length;K<oe;K++){let Ee=de[K];Xr(ae,he,v,Ee)}Lt&&Ke.render(v);for(let K=0,oe=de.length;K<oe;K++){let Ee=de[K];Wr(T,v,Ee,Ee.viewport)}}else he.length>0&&Xr(ae,he,v,L),Lt&&Ke.render(v),Wr(T,v,L)}ne!==null&&Y===0&&(j.updateMultisampleRenderTarget(ne),j.updateRenderTargetMipmap(ne)),F&&A.end(N),v.isScene===!0&&v.onAfterRender(N,v,L),_e.resetDefaultState(),le=-1,ce=null,_.pop(),_.length>0?(E=_[_.length-1],j.setTextureUnits(E.state.textureUnits),Je===!0&&ke.setGlobalState(N.clippingPlanes,E.state.camera)):E=null,R.pop(),R.length>0?T=R[R.length-1]:T=null,M!==null&&M.renderEnd()};function dn(v,L,U,F){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)U=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(L);else if(v.isLightProbeGrid)E.pushLightProbeGrid(v);else if(v.isLight)E.pushLight(v),v.castShadow&&E.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||at.intersectsSprite(v)){F&&zt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(lt);let ae=te.update(v),he=v.material;he.visible&&T.push(v,ae,he,U,zt.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||at.intersectsObject(v))){let ae=te.update(v),he=v.material;if(F&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),zt.copy(v.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),zt.copy(ae.boundingSphere.center)),zt.applyMatrix4(v.matrixWorld).applyMatrix4(lt)),Array.isArray(he)){let de=ae.groups;for(let K=0,oe=de.length;K<oe;K++){let Ee=de[K],fe=he[Ee.materialIndex];fe&&fe.visible&&T.push(v,ae,fe,U,zt.z,Ee)}}else he.visible&&T.push(v,ae,he,U,zt.z,null)}}let J=v.children;for(let ae=0,he=J.length;ae<he;ae++)dn(J[ae],L,U,F)}function Wr(v,L,U,F){let{opaque:O,transmissive:J,transparent:ae}=v;E.setupLightsView(U),Je===!0&&ke.setGlobalState(N.clippingPlanes,U),F&&x.viewport(pe.copy(F)),O.length>0&&Ii(O,L,U),J.length>0&&Ii(J,L,U),ae.length>0&&Ii(ae,L,U),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Xr(v,L,U,F){if((U.isScene===!0?U.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[F.id]===void 0){let fe=gt.has("EXT_color_buffer_half_float")||gt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[F.id]=new Xt(1,1,{generateMipmaps:!0,type:fe?un:xn,minFilter:oi,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace})}let J=E.state.transmissionRenderTarget[F.id],ae=F.viewport||pe;J.setSize(ae.z*N.transmissionResolutionScale,ae.w*N.transmissionResolutionScale);let he=N.getRenderTarget(),de=N.getActiveCubeFace(),K=N.getActiveMipmapLevel();N.setRenderTarget(J),N.getClearColor(je),Pe=N.getClearAlpha(),Pe<1&&N.setClearColor(16777215,.5),N.clear(),Lt&&Ke.render(U);let oe=N.toneMapping;N.toneMapping=ri;let Ee=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),E.setupLightsView(F),Je===!0&&ke.setGlobalState(N.clippingPlanes,F),Ii(v,U,F),j.updateMultisampleRenderTarget(J),j.updateRenderTargetMipmap(J),gt.has("WEBGL_multisampled_render_to_texture")===!1){let fe=!1;for(let Ve=0,$e=L.length;Ve<$e;Ve++){let ct=L[Ve],{object:ze,geometry:Ut,material:Re,group:fn}=ct;if(Re.side===Ht&&ze.layers.test(F.layers)){let ft=Re.side;Re.side=en,Re.needsUpdate=!0,es(ze,U,F,Ut,Re,fn),Re.side=ft,Re.needsUpdate=!0,fe=!0}}fe===!0&&(j.updateMultisampleRenderTarget(J),j.updateRenderTargetMipmap(J))}N.setRenderTarget(he,de,K),N.setClearColor(je,Pe),Ee!==void 0&&(F.viewport=Ee),N.toneMapping=oe}function Ii(v,L,U){let F=L.isScene===!0?L.overrideMaterial:null;for(let O=0,J=v.length;O<J;O++){let ae=v[O],{object:he,geometry:de,group:K}=ae,oe=ae.material;oe.allowOverride===!0&&F!==null&&(oe=F),he.layers.test(U.layers)&&es(he,L,U,de,oe,K)}}function es(v,L,U,F,O,J){v.onBeforeRender(N,L,U,F,O,J),v.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),O.onBeforeRender(N,L,U,F,v,J),O.transparent===!0&&O.side===Ht&&O.forceSinglePass===!1?(O.side=en,O.needsUpdate=!0,N.renderBufferDirect(U,L,F,O,v,J),O.side=Bn,O.needsUpdate=!0,N.renderBufferDirect(U,L,F,O,v,J),O.side=Ht):N.renderBufferDirect(U,L,F,O,v,J),v.onAfterRender(N,L,U,F,O,J)}function ts(v,L,U){L.isScene!==!0&&(L=Qt);let F=X.get(v),O=E.state.lights,J=E.state.shadowsArray,ae=O.state.version,he=ve.getParameters(v,O.state,J,L,U,E.state.lightProbeGridArray),de=ve.getProgramCacheKey(he),K=F.programs;F.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,F.fog=L.fog;let oe=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;F.envMap=me.get(v.envMap||F.environment,oe),F.envMapRotation=F.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,K===void 0&&(v.addEventListener("dispose",Kt),K=new Map,F.programs=K);let Ee=K.get(de);if(Ee!==void 0){if(F.currentProgram===Ee&&F.lightsStateVersion===ae)return Ks(v,he),Ee}else he.uniforms=ve.getUniforms(v),M!==null&&v.isNodeMaterial&&M.build(v,U,he),v.onBeforeCompile(he,N),Ee=ve.acquireProgram(he,de),K.set(de,Ee),F.uniforms=he.uniforms;let fe=F.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(fe.clippingPlanes=ke.uniform),Ks(v,he),F.needsLights=ee(v),F.lightsStateVersion=ae,F.needsLights&&(fe.ambientLightColor.value=O.state.ambient,fe.lightProbe.value=O.state.probe,fe.directionalLights.value=O.state.directional,fe.directionalLightShadows.value=O.state.directionalShadow,fe.spotLights.value=O.state.spot,fe.spotLightShadows.value=O.state.spotShadow,fe.rectAreaLights.value=O.state.rectArea,fe.ltc_1.value=O.state.rectAreaLTC1,fe.ltc_2.value=O.state.rectAreaLTC2,fe.pointLights.value=O.state.point,fe.pointLightShadows.value=O.state.pointShadow,fe.hemisphereLights.value=O.state.hemi,fe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,fe.spotLightMatrix.value=O.state.spotLightMatrix,fe.spotLightMap.value=O.state.spotLightMap,fe.pointShadowMatrix.value=O.state.pointShadowMatrix),F.lightProbeGrid=E.state.lightProbeGridArray.length>0,F.currentProgram=Ee,F.uniformsList=null,Ee}function Zs(v){if(v.uniformsList===null){let L=v.currentProgram.getUniforms();v.uniformsList=Lr.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function Ks(v,L){let U=X.get(v);U.outputColorSpace=L.outputColorSpace,U.batching=L.batching,U.batchingColor=L.batchingColor,U.instancing=L.instancing,U.instancingColor=L.instancingColor,U.instancingMorph=L.instancingMorph,U.skinning=L.skinning,U.morphTargets=L.morphTargets,U.morphNormals=L.morphNormals,U.morphColors=L.morphColors,U.morphTargetsCount=L.morphTargetsCount,U.numClippingPlanes=L.numClippingPlanes,U.numIntersection=L.numClipIntersection,U.vertexAlphas=L.vertexAlphas,U.vertexTangents=L.vertexTangents,U.toneMapping=L.toneMapping}function qr(v,L){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;b.setFromMatrixPosition(L.matrixWorld);for(let U=0,F=v.length;U<F;U++){let O=v[U];if(O.texture!==null&&O.boundingBox.containsPoint(b))return O}return null}function pc(v,L,U,F,O){L.isScene!==!0&&(L=Qt),j.resetTextureUnits();let J=L.fog,ae=F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial?L.environment:null,he=ne===null?N.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:tt.workingColorSpace,de=F.isMeshStandardMaterial||F.isMeshLambertMaterial&&!F.envMap||F.isMeshPhongMaterial&&!F.envMap,K=me.get(F.envMap||ae,de),oe=F.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,Ee=!!U.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),fe=!!U.morphAttributes.position,Ve=!!U.morphAttributes.normal,$e=!!U.morphAttributes.color,ct=ri;F.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ct=N.toneMapping);let ze=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Ut=ze!==void 0?ze.length:0,Re=X.get(F),fn=E.state.lights;if(Je===!0&&(He===!0||v!==ce)){let At=v===ce&&F.id===le;ke.setState(F,v,At)}let ft=!1;F.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==fn.state.version||Re.outputColorSpace!==he||O.isBatchedMesh&&Re.batching===!1||!O.isBatchedMesh&&Re.batching===!0||O.isBatchedMesh&&Re.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Re.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Re.instancing===!1||!O.isInstancedMesh&&Re.instancing===!0||O.isSkinnedMesh&&Re.skinning===!1||!O.isSkinnedMesh&&Re.skinning===!0||O.isInstancedMesh&&Re.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Re.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Re.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Re.instancingMorph===!1&&O.morphTexture!==null||Re.envMap!==K||F.fog===!0&&Re.fog!==J||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==ke.numPlanes||Re.numIntersection!==ke.numIntersection)||Re.vertexAlphas!==oe||Re.vertexTangents!==Ee||Re.morphTargets!==fe||Re.morphNormals!==Ve||Re.morphColors!==$e||Re.toneMapping!==ct||Re.morphTargetsCount!==Ut||!!Re.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Re.__version=F.version);let bn=Re.currentProgram;ft===!0&&(bn=ts(F,L,O),M&&F.isNodeMaterial&&M.onUpdateProgram(F,bn,Re));let Xn=!1,di=!1,fi=!1,St=bn.getUniforms(),Dt=Re.uniforms;if(x.useProgram(bn.program)&&(Xn=!0,di=!0,fi=!0),F.id!==le&&(le=F.id,di=!0),Re.needsLights){let At=qr(E.state.lightProbeGridArray,O);Re.lightProbeGrid!==At&&(Re.lightProbeGrid=At,di=!0)}if(Xn||ce!==v){x.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),St.setValue(k,"projectionMatrix",v.projectionMatrix),St.setValue(k,"viewMatrix",v.matrixWorldInverse);let pi=St.map.cameraPosition;pi!==void 0&&pi.setValue(k,st.setFromMatrixPosition(v.matrixWorld)),w.logarithmicDepthBuffer&&St.setValue(k,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&St.setValue(k,"isOrthographic",v.isOrthographicCamera===!0),ce!==v&&(ce=v,di=!0,fi=!0)}if(Re.needsLights&&(fn.state.directionalShadowMap.length>0&&St.setValue(k,"directionalShadowMap",fn.state.directionalShadowMap,j),fn.state.spotShadowMap.length>0&&St.setValue(k,"spotShadowMap",fn.state.spotShadowMap,j),fn.state.pointShadowMap.length>0&&St.setValue(k,"pointShadowMap",fn.state.pointShadowMap,j)),O.isSkinnedMesh){St.setOptional(k,O,"bindMatrix"),St.setOptional(k,O,"bindMatrixInverse");let At=O.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),St.setValue(k,"boneTexture",At.boneTexture,j))}O.isBatchedMesh&&(St.setOptional(k,O,"batchingTexture"),St.setValue(k,"batchingTexture",O._matricesTexture,j),St.setOptional(k,O,"batchingIdTexture"),St.setValue(k,"batchingIdTexture",O._indirectTexture,j),St.setOptional(k,O,"batchingColorTexture"),O._colorsTexture!==null&&St.setValue(k,"batchingColorTexture",O._colorsTexture,j));let qn=U.morphAttributes;if((qn.position!==void 0||qn.normal!==void 0||qn.color!==void 0)&&z.update(O,U,bn),(di||Re.receiveShadow!==O.receiveShadow)&&(Re.receiveShadow=O.receiveShadow,St.setValue(k,"receiveShadow",O.receiveShadow)),(F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial)&&F.envMap===null&&L.environment!==null&&(Dt.envMapIntensity.value=L.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=b_()),di){if(St.setValue(k,"toneMappingExposure",N.toneMappingExposure),Re.needsLights&&P(Dt,fi),J&&F.fog===!0&&Oe.refreshFogUniforms(Dt,J),Oe.refreshMaterialUniforms(Dt,F,se,ue,E.state.transmissionRenderTarget[v.id]),Re.needsLights&&Re.lightProbeGrid){let At=Re.lightProbeGrid;Dt.probesSH.value=At.texture,Dt.probesMin.value.copy(At.boundingBox.min),Dt.probesMax.value.copy(At.boundingBox.max),Dt.probesResolution.value.copy(At.resolution)}Lr.upload(k,Zs(Re),Dt,j)}if(F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(Lr.upload(k,Zs(Re),Dt,j),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&St.setValue(k,"center",O.center),St.setValue(k,"modelViewMatrix",O.modelViewMatrix),St.setValue(k,"normalMatrix",O.normalMatrix),St.setValue(k,"modelMatrix",O.matrixWorld),F.uniformsGroups!==void 0){let At=F.uniformsGroups;for(let pi=0,ns=At.length;pi<ns;pi++){let Zo=At[pi];re.update(Zo,bn),re.bind(Zo,bn)}}return bn}function P(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function ee(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(v,L,U){let F=X.get(v);F.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,F.__autoAllocateDepthBuffer===!1&&(F.__useRenderToTexture=!1),X.get(v.texture).__webglTexture=L,X.get(v.depthTexture).__webglTexture=F.__autoAllocateDepthBuffer?void 0:U,F.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){let U=X.get(v);U.__webglFramebuffer=L,U.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(v,L=0,U=0){ne=v,q=L,Y=U;let F=null,O=!1,J=!1;if(v){let he=X.get(v);if(he.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(k.FRAMEBUFFER,he.__webglFramebuffer),pe.copy(v.viewport),Te.copy(v.scissor),it=v.scissorTest,x.viewport(pe),x.scissor(Te),x.setScissorTest(it),le=-1;return}else if(he.__webglFramebuffer===void 0)j.setupRenderTarget(v);else if(he.__hasExternalTextures)j.rebindTextures(v,X.get(v.texture).__webglTexture,X.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let oe=v.depthTexture;if(he.__boundDepthTexture!==oe){if(oe!==null&&X.has(oe)&&(v.width!==oe.image.width||v.height!==oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");j.setupDepthRenderbuffer(v)}}let de=v.texture;(de.isData3DTexture||de.isDataArrayTexture||de.isCompressedArrayTexture)&&(J=!0);let K=X.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(K[L])?F=K[L][U]:F=K[L],O=!0):v.samples>0&&j.useMultisampledRTT(v)===!1?F=X.get(v).__webglMultisampledFramebuffer:Array.isArray(K)?F=K[U]:F=K,pe.copy(v.viewport),Te.copy(v.scissor),it=v.scissorTest}else pe.copy(Fe).multiplyScalar(se).floor(),Te.copy(pt).multiplyScalar(se).floor(),it=qe;if(U!==0&&(F=B),x.bindFramebuffer(k.FRAMEBUFFER,F)&&x.drawBuffers(v,F),x.viewport(pe),x.scissor(Te),x.setScissorTest(it),O){let he=X.get(v.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+L,he.__webglTexture,U)}else if(J){let he=L;for(let de=0;de<v.textures.length;de++){let K=X.get(v.textures[de]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+de,K.__webglTexture,U,he)}}else if(v!==null&&U!==0){let he=X.get(v.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,he.__webglTexture,U)}le=-1},this.readRenderTargetPixels=function(v,L,U,F,O,J,ae,he=0){if(!(v&&v.isWebGLRenderTarget)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=X.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ae!==void 0&&(de=de[ae]),de){x.bindFramebuffer(k.FRAMEBUFFER,de);try{let K=v.textures[he],oe=K.format,Ee=K.type;if(v.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+he),!w.textureFormatReadable(oe)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!w.textureTypeReadable(Ee)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=v.width-F&&U>=0&&U<=v.height-O&&k.readPixels(L,U,F,O,Me.convert(oe),Me.convert(Ee),J)}finally{let K=ne!==null?X.get(ne).__webglFramebuffer:null;x.bindFramebuffer(k.FRAMEBUFFER,K)}}},this.readRenderTargetPixelsAsync=async function(v,L,U,F,O,J,ae,he=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=X.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ae!==void 0&&(de=de[ae]),de)if(L>=0&&L<=v.width-F&&U>=0&&U<=v.height-O){x.bindFramebuffer(k.FRAMEBUFFER,de);let K=v.textures[he],oe=K.format,Ee=K.type;if(v.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+he),!w.textureFormatReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!w.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let fe=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,fe),k.bufferData(k.PIXEL_PACK_BUFFER,J.byteLength,k.STREAM_READ),k.readPixels(L,U,F,O,Me.convert(oe),Me.convert(Ee),0);let Ve=ne!==null?X.get(ne).__webglFramebuffer:null;x.bindFramebuffer(k.FRAMEBUFFER,Ve);let $e=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await tf(k,$e,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,fe),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,J),k.deleteBuffer(fe),k.deleteSync($e),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,U=0){let F=Math.pow(2,-U),O=Math.floor(v.image.width*F),J=Math.floor(v.image.height*F),ae=L!==null?L.x:0,he=L!==null?L.y:0;j.setTexture2D(v,0),k.copyTexSubImage2D(k.TEXTURE_2D,U,0,0,ae,he,O,J),x.unbindTexture()},this.copyTextureToTexture=function(v,L,U=null,F=null,O=0,J=0){let ae,he,de,K,oe,Ee,fe,Ve,$e,ct=v.isCompressedTexture?v.mipmaps[J]:v.image;if(U!==null)ae=U.max.x-U.min.x,he=U.max.y-U.min.y,de=U.isBox3?U.max.z-U.min.z:1,K=U.min.x,oe=U.min.y,Ee=U.isBox3?U.min.z:0;else{let Dt=Math.pow(2,-O);ae=Math.floor(ct.width*Dt),he=Math.floor(ct.height*Dt),v.isDataArrayTexture?de=ct.depth:v.isData3DTexture?de=Math.floor(ct.depth*Dt):de=1,K=0,oe=0,Ee=0}F!==null?(fe=F.x,Ve=F.y,$e=F.z):(fe=0,Ve=0,$e=0);let ze=Me.convert(L.format),Ut=Me.convert(L.type),Re;L.isData3DTexture?(j.setTexture3D(L,0),Re=k.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(j.setTexture2DArray(L,0),Re=k.TEXTURE_2D_ARRAY):(j.setTexture2D(L,0),Re=k.TEXTURE_2D),x.activeTexture(k.TEXTURE0),x.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,L.flipY),x.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),x.pixelStorei(k.UNPACK_ALIGNMENT,L.unpackAlignment);let fn=x.getParameter(k.UNPACK_ROW_LENGTH),ft=x.getParameter(k.UNPACK_IMAGE_HEIGHT),bn=x.getParameter(k.UNPACK_SKIP_PIXELS),Xn=x.getParameter(k.UNPACK_SKIP_ROWS),di=x.getParameter(k.UNPACK_SKIP_IMAGES);x.pixelStorei(k.UNPACK_ROW_LENGTH,ct.width),x.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ct.height),x.pixelStorei(k.UNPACK_SKIP_PIXELS,K),x.pixelStorei(k.UNPACK_SKIP_ROWS,oe),x.pixelStorei(k.UNPACK_SKIP_IMAGES,Ee);let fi=v.isDataArrayTexture||v.isData3DTexture,St=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){let Dt=X.get(v),qn=X.get(L),At=X.get(Dt.__renderTarget),pi=X.get(qn.__renderTarget);x.bindFramebuffer(k.READ_FRAMEBUFFER,At.__webglFramebuffer),x.bindFramebuffer(k.DRAW_FRAMEBUFFER,pi.__webglFramebuffer);for(let ns=0;ns<de;ns++)fi&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,X.get(v).__webglTexture,O,Ee+ns),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,X.get(L).__webglTexture,J,$e+ns)),k.blitFramebuffer(K,oe,ae,he,fe,Ve,ae,he,k.DEPTH_BUFFER_BIT,k.NEAREST);x.bindFramebuffer(k.READ_FRAMEBUFFER,null),x.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(O!==0||v.isRenderTargetTexture||X.has(v)){let Dt=X.get(v),qn=X.get(L);x.bindFramebuffer(k.READ_FRAMEBUFFER,V),x.bindFramebuffer(k.DRAW_FRAMEBUFFER,G);for(let At=0;At<de;At++)fi?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Dt.__webglTexture,O,Ee+At):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Dt.__webglTexture,O),St?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,qn.__webglTexture,J,$e+At):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,qn.__webglTexture,J),O!==0?k.blitFramebuffer(K,oe,ae,he,fe,Ve,ae,he,k.COLOR_BUFFER_BIT,k.NEAREST):St?k.copyTexSubImage3D(Re,J,fe,Ve,$e+At,K,oe,ae,he):k.copyTexSubImage2D(Re,J,fe,Ve,K,oe,ae,he);x.bindFramebuffer(k.READ_FRAMEBUFFER,null),x.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else St?v.isDataTexture||v.isData3DTexture?k.texSubImage3D(Re,J,fe,Ve,$e,ae,he,de,ze,Ut,ct.data):L.isCompressedArrayTexture?k.compressedTexSubImage3D(Re,J,fe,Ve,$e,ae,he,de,ze,ct.data):k.texSubImage3D(Re,J,fe,Ve,$e,ae,he,de,ze,Ut,ct):v.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,J,fe,Ve,ae,he,ze,Ut,ct.data):v.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,J,fe,Ve,ct.width,ct.height,ze,ct.data):k.texSubImage2D(k.TEXTURE_2D,J,fe,Ve,ae,he,ze,Ut,ct);x.pixelStorei(k.UNPACK_ROW_LENGTH,fn),x.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ft),x.pixelStorei(k.UNPACK_SKIP_PIXELS,bn),x.pixelStorei(k.UNPACK_SKIP_ROWS,Xn),x.pixelStorei(k.UNPACK_SKIP_IMAGES,di),J===0&&L.generateMipmaps&&k.generateMipmap(Re),x.unbindTexture()},this.initRenderTarget=function(v){X.get(v).__webglFramebuffer===void 0&&j.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?j.setTextureCube(v,0):v.isData3DTexture?j.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?j.setTexture2DArray(v,0):j.setTexture2D(v,0),x.unbindTexture()},this.resetState=function(){q=0,Y=0,ne=null,x.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var Ff={type:"change"},Ou={type:"start"},Of={type:"end"},Wl=new xi,Uf=new wn,M_=Math.cos(70*$i.DEG2RAD),sn=new D,Dn=2*Math.PI,Pt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Uu=1e-6,Xl=class extends So{constructor(e,t=null){super(e,t),this.state=Pt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:fs.ROTATE,MIDDLE:fs.DOLLY,RIGHT:fs.PAN},this.touches={ONE:ps.ROTATE,TWO:ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Bt,this._lastTargetPosition=new D,this._quat=new Bt().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ds,this._sphericalDelta=new ds,this._scale=1,this._panOffset=new D,this._rotateStart=new ye,this._rotateEnd=new ye,this._rotateDelta=new ye,this._panStart=new ye,this._panEnd=new ye,this._panDelta=new ye,this._dollyStart=new ye,this._dollyEnd=new ye,this._dollyDelta=new ye,this._dollyDirection=new D,this._mouse=new ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=E_.bind(this),this._onPointerDown=S_.bind(this),this._onPointerUp=T_.bind(this),this._onContextMenu=L_.bind(this),this._onMouseWheel=R_.bind(this),this._onKeyDown=C_.bind(this),this._onTouchStart=P_.bind(this),this._onTouchMove=I_.bind(this),this._onMouseDown=w_.bind(this),this._onMouseMove=A_.bind(this),this._interceptControlDown=D_.bind(this),this._interceptControlUp=N_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ff),this.update(),this.state=Pt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;sn.copy(t).sub(this.target),sn.applyQuaternion(this._quat),this._spherical.setFromVector3(sn),this.autoRotate&&this.state===Pt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Dn:n>Math.PI&&(n-=Dn),s<-Math.PI?s+=Dn:s>Math.PI&&(s-=Dn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(sn.setFromSpherical(this._spherical),sn.applyQuaternion(this._quatInverse),t.copy(this.target).add(sn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=sn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=sn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Wl.origin.copy(this.object.position),Wl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Wl.direction))<M_?this.object.lookAt(this.target):(Uf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Wl.intersectPlane(Uf,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Uu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Uu||this._lastTargetPosition.distanceToSquared(this.target)>Uu?(this.dispatchEvent(Ff),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Dn/60*this.autoRotateSpeed*e:Dn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){sn.setFromMatrixColumn(t,0),sn.multiplyScalar(-e),this._panOffset.add(sn)}_panUp(e,t){this.screenSpacePanning===!0?sn.setFromMatrixColumn(t,1):(sn.setFromMatrixColumn(t,0),sn.crossVectors(this.object.up,sn)),sn.multiplyScalar(e),this._panOffset.add(sn)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;sn.copy(s).sub(this.target);let r=sn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ye,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function S_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function E_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function T_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Of),this.state=Pt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function w_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case fs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Pt.DOLLY;break;case fs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Pt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Pt.ROTATE}break;case fs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Pt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Pt.PAN}break;default:this.state=Pt.NONE}this.state!==Pt.NONE&&this.dispatchEvent(Ou)}function A_(i){switch(this.state){case Pt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Pt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Pt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function R_(i){this.enabled===!1||this.enableZoom===!1||this.state!==Pt.NONE||(i.preventDefault(),this.dispatchEvent(Ou),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Of))}function C_(i){this.enabled!==!1&&this._handleKeyDown(i)}function P_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ps.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Pt.TOUCH_ROTATE;break;case ps.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Pt.TOUCH_PAN;break;default:this.state=Pt.NONE}break;case 2:switch(this.touches.TWO){case ps.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Pt.TOUCH_DOLLY_PAN;break;case ps.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Pt.TOUCH_DOLLY_ROTATE;break;default:this.state=Pt.NONE}break;default:this.state=Pt.NONE}this.state!==Pt.NONE&&this.dispatchEvent(Ou)}function I_(i){switch(this._trackPointer(i),this.state){case Pt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Pt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Pt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Pt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Pt.NONE}}function L_(i){this.enabled!==!1&&i.preventDefault()}function D_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function N_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function zu(i,e){if(e===pu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Pr||e===Bo){let t=i.getIndex();if(t===null){let o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Pr)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function zf(i){let e=new Map,t=new Map,n=i.clone();return Bf(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Bf(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Bf(i.children[n],e.children[n],t)}var Nn=class extends Ei{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Xu(t)}),this.register(function(t){return new qu(t)}),this.register(function(t){return new th(t)}),this.register(function(t){return new nh(t)}),this.register(function(t){return new ih(t)}),this.register(function(t){return new Zu(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new Wu(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new Yu(t)}),this.register(function(t){return new eh(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new Vu(t)}),this.register(function(t){return new ql(t,ot.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ql(t,ot.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new sh(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Ki.extractUrlBase(e);o=Ki.resolveURL(c,this.path)}else o=Ki.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Tr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Wf){try{o[ot.KHR_BINARY_GLTF]=new rh(e)}catch(d){s&&s(d);return}r=JSON.parse(o[ot.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new dh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case ot.KHR_MATERIALS_UNLIT:o[d]=new Gu;break;case ot.KHR_DRACO_MESH_COMPRESSION:o[d]=new oh(r,this.dracoLoader);break;case ot.KHR_TEXTURE_TRANSFORM:o[d]=new ah;break;case ot.KHR_MESH_QUANTIZATION:o[d]=new lh;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function F_(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Yt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var ot={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Vu=class{constructor(e){this.parser=e,this.name=ot.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new we(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Sn);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new _o(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new xo(u),c.distance=d;break;case"spot":c=new vo(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ci(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Gu=class{constructor(){this.name=ot.KHR_MATERIALS_UNLIT}getMaterialType(){return qt}extendParams(e,t,n){let s=[];e.color=new we(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Sn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Gt))}return Promise.all(s)}},Wu=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Xu=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ye(r,r)}return Promise.all(s)}},qu=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Yu=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Zu=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SHEEN}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new we(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Sn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Gt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Ku=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},ju=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_VOLUME}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new we().setRGB(r[0],r[1],r[2],Sn),Promise.all(s)}},$u=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IOR}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Ju=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new we().setRGB(r[0],r[1],r[2],Sn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Gt)),Promise.all(s)}},Qu=class{constructor(e){this.parser=e,this.name=ot.EXT_MATERIALS_BUMP}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},eh=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Yt(this.parser,e,this.name)!==null?vn:null}extendMaterialParams(e,t){let n=Yt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},th=class{constructor(e){this.parser=e,this.name=ot.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},nh=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},ih=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},ql=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}},sh=class{constructor(e){this.name=ot.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==jn.TRIANGLES&&c.mode!==jn.TRIANGLE_STRIP&&c.mode!==jn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,f=[];for(let m of d){let y=new Ge,g=new D,p=new Bt,S=new D(1,1,1),I=new Bi(m.geometry,m.material,h);for(let b=0;b<h;b++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,b),l.SCALE&&S.fromBufferAttribute(l.SCALE,b),I.setMatrixAt(b,y.compose(g,p,S));for(let b in l)if(b==="_COLOR_0"){let T=l[b];I.instanceColor=new hs(T.array,T.itemSize,T.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&m.geometry.setAttribute(b,l[b]);kt.prototype.copy.call(I,m),this.parser.assignFinalMaterial(I),f.push(I)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Wf="glTF",Go=12,kf={JSON:1313821514,BIN:5130562},rh=class{constructor(e){this.name=ot.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Go),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Wf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Go,r=new DataView(e,Go),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===kf.JSON){let c=new Uint8Array(e,Go+o,a);this.content=n.decode(c)}else if(l===kf.BIN){let c=Go+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},oh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ot.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let d=uh[u]||u.toLowerCase();a[d]=o[u]}for(let u in e.attributes){let d=uh[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[e.attributes[u]],f=Nr[h.componentType];c[d]=f.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(let m in f.attributes){let y=f.attributes[m],g=l[m];g!==void 0&&(y.normalized=g)}d(f)},a,c,Sn,h)})})}},ah=class{constructor(){this.name=ot.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},lh=class{constructor(){this.name=ot.KHR_MESH_QUANTIZATION}},Yl=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,m=e*c,y=m-c,g=-2*f+3*h,p=f-h,S=1-g,I=p-h+d;for(let b=0;b!==a;b++){let T=o[y+b+a],E=o[y+b+l]*u,R=o[m+b+a],_=o[m+b]*u;r[b]=S*T+I*E+g*R+p*_}return r}},U_=new Bt,ch=class extends Yl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return U_.fromArray(r).normalize().toArray(r),r}},jn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Nr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Hf={9728:Wt,9729:Et,9984:ja,9985:Ar,9986:zs,9987:oi},Vf={33071:Zn,33648:hr,10497:An},Bu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},uh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},xs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},O_={CUBICSPLINE:void 0,LINEAR:Rs,STEP:As},ku={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function z_(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ls({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Bn})),i.DefaultMaterial}function Hs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ci(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function B_(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let d=e[c];if(n){let h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function k_(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function H_(i){let e,t=i.extensions&&i.extensions[ot.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Hu(t.attributes):e=i.indices+":"+Hu(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Hu(i.targets[n]);return e}function Hu(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function hh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function V_(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var G_=new Ge,dh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new F_,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Ds(this.options.manager):this.textureLoader=new bo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Tr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Hs(r,a,s),Ci(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ot.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(Ki.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Bu[s.type],a=Nr[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Ct(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=Bu[s.type],c=Nr[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,y,g;if(f&&f!==d){let p=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,I=t.cache.get(S);I||(y=new c(a,p*f,s.count*f/u),I=new _r(y,f/u),t.cache.add(S,I)),g=new yr(I,l,h%f/u,m)}else a===null?y=new c(s.count*l):y=new c(a,h,s.count*l),g=new Ct(y,l,m);if(s.sparse!==void 0){let p=Bu.SCALAR,S=Nr[s.sparse.indices.componentType],I=s.sparse.indices.byteOffset||0,b=s.sparse.values.byteOffset||0,T=new S(o[1],I,s.sparse.count*p),E=new c(o[2],b,s.sparse.count*l);a!==null&&(g=new Ct(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let R=0,_=T.length;R<_;R++){let A=T[R];if(g.setX(A,E[R*l]),l>=2&&g.setY(A,E[R*l+1]),l>=3&&g.setZ(A,E[R*l+2]),l>=4&&g.setW(A,E[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=Hf[h.magFilter]||Et,u.minFilter=Hf[h.minFilter]||oi,u.wrapS=Vf[h.wrapS]||An,u.wrapT=Vf[h.wrapT]||An,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Wt&&u.minFilter!==Et,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=s.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;let h=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(h),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(d){return new Promise(function(h,f){let m=h;t.isImageBitmapLoader===!0&&(m=function(y){let g=new ln(y);g.needsUpdate=!0,h(g)}),t.load(Ki.resolveURL(d,r.path),m,void 0,f)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),Ci(d,o),d.userData.mimeType=o.mimeType||V_(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ot.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ot.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[ot.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new bi,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new yi,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ls}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[ot.KHR_MATERIALS_UNLIT]){let d=s[ot.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new we(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],Sn),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,Gt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Ht);let u=r.alphaMode||ku.OPAQUE;if(u===ku.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===ku.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==qt&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new ye(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==qt&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==qt){let d=r.emissiveFactor;a.emissive=new we().setRGB(d[0],d[1],d[2],Sn)}return r.emissiveTexture!==void 0&&o!==qt&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Gt)),Promise.all(c).then(function(){let d=new o(a);return r.name&&(d.name=r.name),Ci(d,r),t.associations.set(d,{materials:e}),r.extensions&&Hs(s,d,r),d})}createUniqueName(e){let t=It.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[ot.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Gf(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=H_(c),d=s[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[ot.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=Gf(new Tt,c,t),s[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?z_(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let f=0,m=u.length;f<m;f++){let y=u[f],g=o[f],p,S=c[f];if(g.mode===jn.TRIANGLES||g.mode===jn.TRIANGLE_STRIP||g.mode===jn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new co(y,S):new vt(y,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===jn.TRIANGLE_STRIP?p.geometry=zu(p.geometry,Bo):g.mode===jn.TRIANGLE_FAN&&(p.geometry=zu(p.geometry,Pr));else if(g.mode===jn.LINES)p=new ki(y,S);else if(g.mode===jn.LINE_STRIP)p=new Is(y,S);else if(g.mode===jn.LINE_LOOP)p=new ho(y,S);else if(g.mode===jn.POINTS)p=new Kn(y,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&k_(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Ci(p,r),g.extensions&&Hs(s,p,g),t.assignFinalMaterial(p),d.push(p)}for(let f=0,m=d.length;f<m;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Hs(s,d[0],r),d[0];let h=new an;r.extensions&&Hs(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,m=d.length;f<m;f++)h.add(d[f]);return h})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Jt($i.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Ti(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ci(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let d=o[c];if(d){a.push(d);let h=new Ge;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new uo(a,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let f=s.channels[d],m=s.samplers[f.sampler],y=f.target,g=y.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,S=s.parameters!==void 0?s.parameters[m.output]:m.output;y.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",S)),c.push(m),u.push(y))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){let h=d[0],f=d[1],m=d[2],y=d[3],g=d[4],p=[];for(let I=0,b=h.length;I<b;I++){let T=h[I],E=f[I],R=m[I],_=y[I],A=g[I];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();let N=n._createAnimationTracks(T,E,R,_,A);if(N)for(let C=0;C<N.length;C++)p.push(N[C])}let S=new Er(r,void 0,p);return Ci(S,s),S})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,G_)});for(let f=0,m=d.length;f<m;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){let f=u.userData.pivot,m=d[0];u.pivot=new D().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new br:c.length>1?u=new an:c.length===1?u=c[0]:u=new kt,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=o),Ci(u,r),r.extensions&&Hs(n,u,r),r.matrix!==void 0){let d=new Ge;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new an;n.name&&(r.name=s.createUniqueName(n.name)),Ci(r,n),n.extensions&&Hs(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++){let h=l[u];h.parent!==null?r.add(zf(h)):r.add(h)}let c=u=>{let d=new Map;for(let[h,f]of s.associations)(h instanceof Cn||h instanceof ln)&&d.set(h,f);return u.traverse(h=>{let f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}xs[r.path]===xs.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let u;switch(xs[r.path]){case xs.weights:u=qi;break;case xs.rotation:u=Si;break;case xs.translation:case xs.scale:u=Zi;break;default:n.itemSize===1?u=qi:u=Zi;break}let d=s.interpolation!==void 0?O_[s.interpolation]:Rs,h=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){let y=new u(l[f]+"."+xs[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),o.push(y)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=hh(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Si?ch:Yl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function W_(i,e,t){let n=e.attributes,s=new En;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new D(l[0],l[1],l[2]),new D(c[0],c[1],c[2])),a.normalized){let u=hh(Nr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new D,l=new D;for(let c=0,u=r.length;c<u;c++){let d=r[c];if(d.POSITION!==void 0){let h=t.json.accessors[d.POSITION],f=h.min,m=h.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),h.normalized){let y=hh(Nr[h.componentType]);l.multiplyScalar(y)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new gn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Gf(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=uh[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return tt.workingColorSpace!==Sn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),Ci(i,e),W_(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?B_(i,e.targets,t):i})}function Vt(i){let e=2166136261;for(let t of i)e=Math.imul(e^t.charCodeAt(0),16777619);return(e>>>0)/4294967296}function Zl(i,e=null,t=null){let n=[...i.nodes].sort((l,c)=>c.degree-l.degree||l.id.localeCompare(c.id)),s=new Map(n.map((l,c)=>[l.id,c])),r=new Map((e?.nodes||[]).map(l=>[l.id,l])),o=new Map((t?.nodes||[]).map(l=>[l.id,l])),a=l=>l&&["x","y","z"].every(c=>Number.isFinite(l[c])&&Math.abs(l[c])<1e5);return i.nodes.map(l=>{let c=s.get(l.id)<18?"yellow":s.get(l.id)<72?"white":"blue",u=c==="yellow"?5+2*Math.sqrt(l.degree/n[0].degree):c==="white"?3.4:2.3+Math.min(l.degree/100,.7),d=r.get(l.id)||l,h=i.routes[l.id]?.root||l.id,f=(Vt(h)-.5)*180+(Vt(l.id+"depth")-.5)*140,m=o.get(l.id),y=a(m)?{x:m.x,y:m.y,z:m.z}:{x:d.x/12,y:-d.y/12,z:f};return{...l,...y,radius:u,tier:c,pinned:a(m)?!!m.pinned:!!d.pinned,colour:c==="yellow"?"#ffe08a":c==="white"?"#f1f7ff":["#7de3ff","#9baeff","#82bbdf","#b2bbf5"][Math.floor(Vt(l.id)*4)]}})}var Kl=class{constructor(e,t,n,s){this.onUpdate=n,this.onError=s,this.nodes=e,this.index=new Map(e.map((r,o)=>[r.id,o])),this.metrics={overlaps:0,maxPenetration:0,nearContacts:0,physicsMs:0},this.steps=0,this.worker=new Worker("./vendor/graph-physics-worker.js"),this.ready=new Promise((r,o)=>{this.worker.onerror=a=>{o(new Error(a.message)),this.onError(new Error(a.message))},this.worker.onmessage=({data:a})=>{if(a.type==="error"){let l=new Error(a.message);a.stack&&(l.stack=a.stack),o(l),this.onError(l);return}a.type==="state"&&(this.nodes.forEach((l,c)=>{l.x=a.positions[c*3],l.y=a.positions[c*3+1],l.z=a.positions[c*3+2],l.pinned=!!a.pins[c]}),this.metrics=a.metrics,this.steps=a.steps,this.jointCount=a.springs,this.groupParents=new Map((a.groupParents||[]).map(([l,c,u,d])=>[l,{x:c,y:u,z:d}])),a.initial&&r(),a.action==="dragEnded"&&(this.releasePending=!1,this.onRelease?.()),a.action==="groupEnded"&&this.onGroupRelease?.(),this.onUpdate())}}),this.worker.postMessage({type:"init",nodes:e,edges:t.edges,routes:t.routes,attraction:t.attraction,settings:{running:!1,visible:!document.hidden}})}configure(e){this.worker.postMessage({type:"settings",settings:e})}pin(e,t){this.nodes[e].pinned=t,this.worker.postMessage({type:"pin",index:e,pinned:t})}startDrag(e){this.dragIndex=e,this.nodes[e].pinned=!1,this.worker.postMessage({type:"startDrag",index:e})}moveDrag(e){this.pendingTarget={x:e.x,y:e.y,z:e.z},this.moveFrame||(this.moveFrame=requestAnimationFrame(()=>{this.moveFrame=0,this.flushDrag()}))}flushDrag(){this.pendingTarget&&(this.worker.postMessage({type:"moveDrag",target:this.pendingTarget}),this.pendingTarget=null)}endDrag(e){this.flushDrag(),this.dragIndex=void 0,this.releasePending=!0,this.worker.postMessage({type:"endDrag",pin:e})}startGroupDrag(e,t,n,s=[]){this.groupDragActive=!0,this.worker.postMessage({type:"startGroupDrag",indices:e,centre:t,groupId:n,collisionProxies:s})}moveGroupDrag(e){this.pendingGroupTarget={x:e.x,y:e.y,z:e.z},this.groupMoveFrame||(this.groupMoveFrame=requestAnimationFrame(()=>{this.groupMoveFrame=0,this.flushGroupDrag()}))}flushGroupDrag(){this.pendingGroupTarget&&(this.worker.postMessage({type:"moveGroupDrag",target:this.pendingGroupTarget}),this.pendingGroupTarget=null)}endGroupDrag(){this.flushGroupDrag(),this.groupDragActive=!1,this.worker.postMessage({type:"endGroupDrag"})}clearance(){return this.metrics}dispose(){cancelAnimationFrame(this.moveFrame),cancelAnimationFrame(this.groupMoveFrame),this.worker.terminate()}};var jl=class{constructor(e){this.nodes=e,this.from=new Float32Array(e.length*3),this.to=this.from.slice(),this.started=0,this.duration=1e3/60,this.active=!1}receive(e,t,n=!1){this.nodes.forEach((s,r)=>{let o=r*3;this.from[o]=s.x,this.from[o+1]=s.y,this.from[o+2]=s.z}),this.to.set(e),this.started=t,this.active=!0,n&&this.sample(1/0)}sample(e,t=-1){if(!this.active)return!1;let n=Math.max(0,Math.min(1,(e-this.started)/this.duration));return this.nodes.forEach((s,r)=>{let o=r*3,a=r===t||s.pinned?1:n;s.x=this.from[o]+(this.to[o]-this.from[o])*a,s.y=this.from[o+1]+(this.to[o+1]-this.from[o+1])*a,s.z=this.from[o+2]+(this.to[o+2]-this.from[o+2])*a}),this.active=n<1,!0}};var Wo=class extends Kl{constructor(...e){super(...e),this.scales=new Float32Array(this.nodes.length),this.linkProgress=new Float32Array(this.nodes.length),this.entrance={active:!0,phase:"waiting",revealed:0,total:this.nodes.length},this.cycle=0,this.skipWaiters=[],this.smoother=new jl(this.nodes);let t=this.worker.onmessage;this.worker.onmessage=n=>{let s=n.data;s.type==="state"&&(s.cycle??0)<this.cycle||(s.type==="state"&&(this.smoother.receive(s.positions,performance.now(),s.initial||!!s.action),this.scales=s.scales,this.linkProgress=s.linkProgress,this.entrance=s.entrance),t(n),s.type==="state"&&!s.initial&&!s.action&&this.smoother.sample(performance.now(),this.dragIndex),s.type==="state"&&s.action==="finishEntrance"&&this.skipWaiters.splice(0).forEach(r=>r(!0)),s.type==="error"&&this.skipWaiters.splice(0).forEach(r=>r(!1)))}}sample(e){return this.smoother.sample(e,this.dragIndex)}replay(e){this.skipWaiters.splice(0).forEach(t=>t(!1)),this.cycle++,this.scales.fill(0),this.linkProgress.fill(0),this.entrance={active:!0,phase:"waiting",revealed:0,total:e.visible.filter(Boolean).length},this.worker.postMessage({type:"entrance",cycle:this.cycle,...e}),this.onUpdate()}skip(){if(!this.entrance.active)return Promise.resolve(!0);let e=new Promise(t=>this.skipWaiters.push(t));return this.worker.postMessage({type:"finishEntrance"}),e}dispose(){this.skipWaiters.splice(0).forEach(e=>e(!1)),super.dispose()}};var ph={saved:"My layout",constellation:"Constellation",galaxy:"Galaxy",globe:"Globe",helix:"Helix"},Xf={saved:"Your own saved arrangement and pins.",constellation:"Related nodes gather around their hubs in distinct three-dimensional groups.",galaxy:"Three sweeping arms with related communities beside one another.",globe:"Communities distributed across a spherical shell.",helix:"Two rising strands, with their real connections crossing between them."},X_=Math.PI*(3-Math.sqrt(5));function fh(i,e,t){let n=1-2*(i+.5)/e,s=Math.sqrt(Math.max(0,1-n*n)),r=i*X_;return{x:Math.cos(r)*s*t,y:n*t,z:Math.sin(r)*s*t}}function qf(i,e,t){if(t==="saved")return i.map(u=>({...u}));if(!ph[t])throw new Error("Unknown layout");let n=new Map,s=new Map(i.map((u,d)=>[u.id,d])),r=i.map((u,d)=>d),o=u=>{for(;r[u]!==u;)r[u]=r[r[u]],u=r[u];return u};for(let u of e.edges){let d=o(s.get(u.from)),h=o(s.get(u.to));d!==h&&(r[d]=h)}i.forEach((u,d)=>{let h=e.routes[u.id]?.root||"component-"+o(d);n.has(h)||n.set(h,[]),n.get(h).push(u)});let a=[...n.values()].sort((u,d)=>d.length-u.length||u[0].id.localeCompare(d[0].id)),l=a.flatMap(u=>u.sort((d,h)=>h.degree-d.degree||d.id.localeCompare(h.id))),c=new Map;if(t==="constellation"){let u=0;a.forEach((d,h)=>{let f=d.length>8,m=fh(f?h:u++,f?Math.min(a.length,24):Math.max(1,a.filter(g=>g.length<=8).length),f?230:520),y=f?Math.cbrt(d.length)*13:10;d.forEach((g,p)=>{let S=p===0?{x:0,y:0,z:0}:fh(p-1,d.length-1,y*Math.cbrt((p+.5)/d.length));c.set(g.id,{x:m.x+S.x,y:m.y+S.y,z:m.z+S.z})})})}else l.forEach((u,d)=>{let h=(d+.5)/l.length,f=Vt(u.id)*Math.PI*2,m;if(t==="galaxy"){let y=d%3,g=y*Math.PI*2/3+Math.sqrt(h)*Math.PI*2.1,p=65+Math.sqrt(h)*470,S=(Vt(u.id+"spread")-.5)*38;m={x:Math.cos(g)*(p+S),y:(Vt(u.id+"height")-.5)*(35+60*(1-h)),z:Math.sin(g)*(p+S)}}else if(t==="globe")m=fh(d,l.length,365+(Vt(u.id+"shell")-.5)*30);else{let y=d%2,g=h*Math.PI*6+y*Math.PI,p=180+(Vt(u.id+"helix")-.5)*65;m={x:Math.cos(g)*p,y:(h-.5)*850+(Vt(u.id+"rise")-.5)*18,z:Math.sin(g)*p}}c.set(u.id,m)});return i.map(u=>({...u,...c.get(u.id),pinned:u.tier==="yellow"}))}var ci=[{id:"notes",name:"Routines",colour:"#61cae3",centre:[-190,210,25]},{id:"memory",name:"Memory",colour:"#e7ba6e",centre:[85,235,60]},{id:"conversations",name:"Conversations",colour:"#e49bbb",centre:[250,40,-20]},{id:"graph",name:"Library",colour:"#a5d4a8",centre:[-275,-75,35]},{id:"mirrors",name:"Files",colour:"#7688ac",centre:[-55,-165,-190]},{id:"agents",name:"Activity",colour:"#b9a4eb",centre:[-325,135,85]},{id:"archive",name:"Settings",colour:"#b7aaa0",centre:[-80,-325,90]}],q_=Object.fromEntries(ci.map(i=>[i.id,i]));function Nt(i){return["note","builtin"].includes(i.kind)?"notes":["fact","summary","lesson","crystal","semantic","procedure"].includes(i.kind)?"memory":["observation","session"].includes(i.kind)?"conversations":["graph-node","graph-edge","memory-relation"].includes(i.kind)?"graph":i.kind==="mirror"?"mirrors":i.kind==="agent"?"agents":"archive"}var mh=i=>q_[Nt(i)].colour,$l={atlas:"Source sections",...ph},Yf={atlas:"Real records grouped by their source, separated in depth. All saved relationships remain available.",...Xf};function gh(i,e,t,n){let s;if(n)s=Zl(i,null,n);else if(t!=="atlas")s=qf(e,i,t);else{let r=new Map;for(let o of ci){let a=e.filter(c=>Nt(c)===o.id).sort((c,u)=>u.degree-c.degree||c.id.localeCompare(u.id)),l=o.id==="mirrors"?155:20+Math.cbrt(a.length)*13;a.forEach((c,u)=>{let d=u*2.39996323,h=1-2*(u+.5)/a.length,f=Math.sqrt(1-h*h),m=l*(.28+.72*Math.cbrt(Vt(c.id+"section")));r.set(c.id,{...c,x:o.centre[0]+Math.cos(d)*f*m,y:o.centre[1]+h*m,z:o.centre[2]+Math.sin(d)*f*m*.8})})}s=e.map(o=>r.get(o.id))}return t==="atlas"&&(s=s.map(r=>({...r,sourceGroup:Nt(r),radius:r.kind==="mirror"?r.degree>200?4.4:1.25:r.kind==="agent"?5:r.tier==="yellow"?4.4:r.tier==="white"?2.8:1.9}))),s}function vh(i,e){let t=new Map(i.map((h,f)=>[h.id,f])),n=i.map((h,f)=>f),s=h=>{for(;n[h]!==h;)n[h]=n[n[h]],h=n[h];return h},r=e.edges.map((h,f)=>{let m=t.get(h.from),y=t.get(h.to),g=i[m],p=i[y];return{i:f,a:m,b:y,d:(Nt(g)===Nt(p)?0:1e6)+(g.x-p.x)**2+(g.y-p.y)**2+(g.z-p.z)**2}}).sort((h,f)=>h.d-f.d||h.i-f.i),o=new Set,a=new Map,l=new Map;for(let h of r){let f=s(h.a),m=s(h.b);if(f===m)continue;let y=Nt(i[h.a]),g=Nt(i[h.b]);if(y==="mirrors"&&g==="mirrors"){if((l.get(h.a)||0)>=12||(l.get(h.b)||0)>=12)continue;l.set(h.a,(l.get(h.a)||0)+1),l.set(h.b,(l.get(h.b)||0)+1)}if(y!==g){let p=[y,g].sort().join(":");if((a.get(p)||0)>=2)continue;a.set(p,(a.get(p)||0)+1)}n[f]=m,o.add(h.i)}let c=new Uint16Array(i.length);for(let h of o){let f=e.edges[h];c[t.get(f.from)]++,c[t.get(f.to)]++}let u=0,d=Math.ceil(i.length*.6);for(let h of r)u>=d||o.has(h.i)||Nt(i[h.a])!==Nt(i[h.b])||c[h.a]>=3||c[h.b]>=3||(o.add(h.i),c[h.a]++,c[h.b]++,u++);return o}function Zf(i){let e=(t,n)=>i.filter(s=>s.kind===t).sort((s,r)=>r.degree-s.degree||s.id.localeCompare(r.id)).slice(0,n);return[...e("agent",2),...e("note",1),...e("graph-node",1),...e("mirror",1)].map(t=>t.id)}function xh(i,e){if(e!=="atlas")return i;let t=new Map(i.nodes.map(s=>[s.id,s])),n=Object.fromEntries(Object.entries(i.routes).map(([s,r])=>{let o=t.get(s),a=t.get(r.anchor);return[s,o&&a&&Nt(o)===Nt(a)?r:{...r,anchor:void 0}]}));return{...i,routes:n}}var Xo={celestial:{title:"Celestial",hub:"#ffe08a",local:"#f1f7ff",nodes:["#7de3ff","#9baeff","#82bbdf","#b2bbf5"],line:"#9bbbd8"},aurora:{title:"Aurora",hub:"#f9f6bd",local:"#f2ffec",nodes:["#80efbb","#9de8e6","#8ccdc4","#c2edb1"],line:"#8ec5b7"},ember:{title:"Ember",hub:"#fff1ac",local:"#ffe4ce",nodes:["#ff9970","#ef737a","#dfab91","#edbf72"],line:"#d09b85"},amethyst:{title:"Amethyst",hub:"#f7dbff",local:"#f8f2ff",nodes:["#c393ed","#a4a9f7","#e1a3cd","#ab93db"],line:"#b4a0d3"},silver:{title:"Silver",hub:"#ffffff",local:"#e7eff9",nodes:["#a9b9cc","#d7e2eb","#bcced8","#e3e7ed"],line:"#8f9eb2"}},_h={starlight:{title:"Starlight",glow:1,links:.13,core:"sphere",rings:!1},crystal:{title:"Crystal",glow:.35,links:.21,core:"crystal",rings:!1},orbital:{title:"Orbital",glow:.65,links:.11,core:"sphere",rings:!0},minimal:{title:"Minimal",glow:0,links:.075,core:"sphere",rings:!1}};function Kf(i,e){let t=Xo[e]||Xo.celestial;return i.tier==="yellow"?t.hub:i.tier==="white"?t.local:t.nodes[Math.floor(Vt(i.id)*t.nodes.length)]}var jf={name:"VolumeRenderShader1",uniforms:{u_size:{value:new D(1,1,1)},u_renderstyle:{value:0},u_renderthreshold:{value:.5},u_clim:{value:new ye(1,1)},u_data:{value:null},u_cmdata:{value:null}},vertexShader:`

		varying vec3 v_position;
		varying vec3 v_cameraInObj;
		varying vec3 v_viewDirInObj;

		void main() {
				vec4 position4 = vec4(position, 1.0);

				v_position = position;

				// Express the camera position and view direction in the object's local
				// space so the fragment shader can build the per-fragment view ray.
				// For perspective cameras, rays converge at v_cameraInObj.
				// For orthographic cameras, rays travel along v_viewDirInObj.
				v_cameraInObj = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
				v_viewDirInObj = (inverse(modelViewMatrix) * vec4(0.0, 0.0, -1.0, 0.0)).xyz;

				gl_Position = projectionMatrix * modelViewMatrix * position4;
		}`,fragmentShader:`

				precision highp float;
				precision mediump sampler3D;

				uniform vec3 u_size;
				uniform int u_renderstyle;
				uniform float u_renderthreshold;
				uniform vec2 u_clim;

				uniform sampler3D u_data;
				uniform sampler2D u_cmdata;

				varying vec3 v_position;
				varying vec3 v_cameraInObj;
				varying vec3 v_viewDirInObj;

				// The maximum distance through our rendering volume is sqrt(3).
				const int MAX_STEPS = 887;	// 887 for 512^3, 1774 for 1024^3
				const int REFINEMENT_STEPS = 4;
				const float relative_step_size = 1.0;
				const vec4 ambient_color = vec4(0.2, 0.4, 0.2, 1.0);
				const vec4 diffuse_color = vec4(0.8, 0.2, 0.2, 1.0);
				const vec4 specular_color = vec4(1.0, 1.0, 1.0, 1.0);
				const float shininess = 40.0;

				void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);
				void cast_iso(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);

				float sample1(vec3 texcoords);
				vec4 apply_colormap(float val);
				vec4 add_lighting(float val, vec3 loc, vec3 step, vec3 view_ray);


				void main() {
						// Per-fragment ray direction in object space, pointing from the back
						// face toward the camera. For perspective cameras the rays converge
						// at the camera position; for orthographic cameras they are parallel
						// to the view direction.
						vec3 view_ray = isOrthographic
								? normalize(-v_viewDirInObj)
								: normalize(v_cameraInObj - v_position);

						// Slab-based ray/AABB intersection: v_position lies on the back face
						// of the cuboid, so stepping along view_ray traverses the volume and
						// exits through the front face at t = distance.
						vec3 t1 = (vec3(-0.5) - v_position) / view_ray;
						vec3 t2 = (u_size - vec3(0.5) - v_position) / view_ray;
						vec3 tmax = max(t1, t2);
						float distance = min(min(tmax.x, tmax.y), tmax.z);

						// Decide how many steps to take
						int nsteps = int(distance / relative_step_size + 0.5);
						if ( nsteps < 1 )
								discard;

						// Get starting location and step vector in texture coordinates
						vec3 front = v_position + view_ray * distance;
						vec3 step = ((v_position - front) / u_size) / float(nsteps);
						vec3 start_loc = front / u_size;

						// For testing: show the number of steps. This helps to establish
						// whether the rays are correctly oriented
						//'gl_FragColor = vec4(0.0, float(nsteps) / 1.0 / u_size.x, 1.0, 1.0);
						//'return;

						if (u_renderstyle == 0)
								cast_mip(start_loc, step, nsteps, view_ray);
						else if (u_renderstyle == 1)
								cast_iso(start_loc, step, nsteps, view_ray);

						if (gl_FragColor.a < 0.05)
								discard;
				}


				float sample1(vec3 texcoords) {
						/* Sample float value from a 3D texture. Assumes intensity data. */
						return texture(u_data, texcoords.xyz).r;
				}


				vec4 apply_colormap(float val) {
						val = (val - u_clim[0]) / (u_clim[1] - u_clim[0]);
						float n = float(textureSize(u_cmdata, 0).x); // see #33842
						val = (val * (n - 1.0) + 0.5) / n;
						return texture2D(u_cmdata, vec2(val, 0.5));
				}


				void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {

						float max_val = -1e6;
						int max_i = 100;
						vec3 loc = start_loc;

						// Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
						// non-constant expression. So we use a hard-coded max, and an additional condition
						// inside the loop.
						for (int iter=0; iter<MAX_STEPS; iter++) {
								if (iter >= nsteps)
										break;
								// Sample from the 3D texture
								float val = sample1(loc);
								// Apply MIP operation
								if (val > max_val) {
										max_val = val;
										max_i = iter;
								}
								// Advance location deeper into the volume
								loc += step;
						}

						// Refine location, gives crispier images
						vec3 iloc = start_loc + step * (float(max_i) - 0.5);
						vec3 istep = step / float(REFINEMENT_STEPS);
						for (int i=0; i<REFINEMENT_STEPS; i++) {
								max_val = max(max_val, sample1(iloc));
								iloc += istep;
						}

						// Resolve final color
						gl_FragColor = apply_colormap(max_val);
				}


				void cast_iso(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {

						gl_FragColor = vec4(0.0);	// init transparent
						vec4 color3 = vec4(0.0);	// final color
						vec3 dstep = 1.5 / u_size;	// step to sample derivative
						vec3 loc = start_loc;

						float low_threshold = u_renderthreshold - 0.02 * (u_clim[1] - u_clim[0]);

						// Enter the raycasting loop. In WebGL 1 the loop index cannot be compared with
						// non-constant expression. So we use a hard-coded max, and an additional condition
						// inside the loop.
						for (int iter=0; iter<MAX_STEPS; iter++) {
								if (iter >= nsteps)
										break;

								// Sample from the 3D texture
								float val = sample1(loc);

								if (val > low_threshold) {
										// Take the last interval in smaller steps
										vec3 iloc = loc - 0.5 * step;
										vec3 istep = step / float(REFINEMENT_STEPS);
										for (int i=0; i<REFINEMENT_STEPS; i++) {
												val = sample1(iloc);
												if (val > u_renderthreshold) {
														gl_FragColor = add_lighting(val, iloc, dstep, view_ray);
														return;
												}
												iloc += istep;
										}
								}

								// Advance location deeper into the volume
								loc += step;
						}
				}


				vec4 add_lighting(float val, vec3 loc, vec3 step, vec3 view_ray)
				{
					// Calculate color by incorporating lighting

						// View direction
						vec3 V = normalize(view_ray);

						// calculate normal vector from gradient
						vec3 N;
						float val1, val2;
						val1 = sample1(loc + vec3(-step[0], 0.0, 0.0));
						val2 = sample1(loc + vec3(+step[0], 0.0, 0.0));
						N[0] = val1 - val2;
						val = max(max(val1, val2), val);
						val1 = sample1(loc + vec3(0.0, -step[1], 0.0));
						val2 = sample1(loc + vec3(0.0, +step[1], 0.0));
						N[1] = val1 - val2;
						val = max(max(val1, val2), val);
						val1 = sample1(loc + vec3(0.0, 0.0, -step[2]));
						val2 = sample1(loc + vec3(0.0, 0.0, +step[2]));
						N[2] = val1 - val2;
						val = max(max(val1, val2), val);

						float gm = length(N); // gradient magnitude
						N = normalize(N);

						// Flip normal so it points towards viewer
						float Nselect = float(dot(N, V) > 0.0);
						N = (2.0 * Nselect - 1.0) * N;	// ==	Nselect * N - (1.0-Nselect)*N;

						// Init colors
						vec4 ambient_color = vec4(0.0, 0.0, 0.0, 0.0);
						vec4 diffuse_color = vec4(0.0, 0.0, 0.0, 0.0);
						vec4 specular_color = vec4(0.0, 0.0, 0.0, 0.0);

						// note: could allow multiple lights
						for (int i=0; i<1; i++)
						{
								 // Get light direction (make sure to prevent zero division)
								vec3 L = normalize(view_ray);	//lightDirs[i];
								float lightEnabled = float( length(L) > 0.0 );
								L = normalize(L + (1.0 - lightEnabled));

								// Calculate lighting properties
								float lambertTerm = clamp(dot(N, L), 0.0, 1.0);
								vec3 H = normalize(L+V); // Halfway vector
								float specularTerm = pow(max(dot(H, N), 0.0), shininess);

								// Calculate mask
								float mask1 = lightEnabled;

								// Calculate colors
								ambient_color +=	mask1 * ambient_color;	// * gl_LightSource[i].ambient;
								diffuse_color +=	mask1 * lambertTerm;
								specular_color += mask1 * specularTerm * specular_color;
						}

						// Calculate final color by componing different components
						vec4 final_color;
						vec4 color = apply_colormap(val);
						final_color = color * (ambient_color + diffuse_color) + specular_color;
						final_color.a = color.a;
						return final_color;
				}`};var yh=`varying vec2 vUv;
void main(){
 vUv=uv;
 vec3 eye=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
 float distance=max(length(eye),1.001);
 vec3 forward=normalize(eye);
 vec3 pole=abs(forward.y)>.999?vec3(0.,0.,1.):vec3(0.,1.,0.);
 vec3 right=normalize(cross(pole,forward)),up=cross(forward,right);
 float depth=1./distance;
 float tangentRadius=sqrt(max(0.,1.-depth*depth));
 float angle=uv.x*6.28318530718,across=1.-uv.y;
 float ripple=.0025*sin(angle*31.)+.0012*sin(angle*79.);
 float radius=(1.025+across*.55+ripple*across)*tangentRadius;
 vec3 point=(right*cos(angle)+up*sin(angle))*radius+forward*depth;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(point,1.);
}`,Y_=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vView;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vec4 p=modelViewMatrix*vec4(position,1.);vView=-p.xyz;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*p;}`,Z_=`uniform vec3 uRings[3];uniform vec3 uColour;uniform float uStrength;
uniform float uPlaneOffset;uniform float uPlaneSlope;
varying vec3 vLocal;varying vec3 vView;varying vec3 vNormal;
void main(){
 float facing=dot(normalize(vNormal),normalize(vView));
 float projected=sqrt(max(0.,1.-facing*facing));
 float footprint=fwidth(projected),density=0.;
 for(int i=0;i<3;i++){
   float width=sqrt(uRings[i].y*uRings[i].y+footprint*footprint/6.);
   float d=(projected-uRings[i].x)/width;
   density+=exp(-d*d)*uRings[i].z*uRings[i].y/width;
 }
 float clearance=clamp((vLocal.y+uPlaneOffset-vLocal.z*uPlaneSlope)/.025,0.,1.);
 density=clamp(density,0.,1.)*clearance;
 if(density<.001)discard;
 gl_FragColor=vec4(uColour*uStrength,density);
}`,K_=`uniform sampler2D uField;uniform float uTime;uniform float uSpeed;uniform float uStrength;
varying vec2 vUv;
void main(){
 float r=1.-vUv.y;
 vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;
 float upper=smoothstep(-.04,.07,sin(vUv.x*6.28318530718));
 float density=field.r*upper;
 if(density<.001)discard;
 vec3 colour=mix(vec3(1.,.29,.045),vec3(1.,.83,.45),smoothstep(.35,.9,field.g));
 gl_FragColor=vec4(colour*uStrength,density);
}`;async function $f(){let i=await fetch("./assets/native-optics.json");if(!i.ok)throw new Error("Native horizon optics unavailable");let e=await i.json();if(e.sourceImageUsed!==!1)throw new Error("Unexpected optical material source");let[t,n]=await Promise.all([new Nn().loadAsync("./assets/"+e.file),fetch("./assets/"+e.halo.file).then(async r=>{if(!r.ok||!r.body)throw new Error("Native halo field unavailable");return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())})]);if(n.byteLength!==e.halo.bytes)throw new Error("Incomplete native halo field");let s=new _i(n,...e.halo.dimensions,_n);return s.minFilter=s.magFilter=Et,s.wrapS=An,s.unpackAlignment=1,s.needsUpdate=!0,{scene:t.scene,spec:e,texture:s}}function Jf(i,{spec:e,texture:t}){let n=i==="PhotonSphere",s=n?{uRings:{value:e.photon.rings.map(r=>new D(...r))},uColour:{value:new we(...e.photon.colour)},uStrength:{value:e.photon.strength},uPlaneOffset:{value:e.photon.planeOffset},uPlaneSlope:{value:e.photon.planeSlope},uTime:{value:0}}:{uField:{value:t},uTime:{value:0},uSpeed:{value:e.halo.flowSpeed},uStrength:{value:e.halo.strength}};return new rt({vertexShader:n?Y_:yh,fragmentShader:n?Z_:K_,uniforms:s,side:n?Bn:Ht,transparent:!0,depthWrite:!1,depthTest:!0,blending:cn,toneMapped:!1})}var Qf=`
vec2 auraPoint(float angle,float r){
 float c=cos(angle),s=sin(angle),side=pow(abs(c),6.);
 float radius=uInnerRadius+r*uRadialSpan;
 return vec2(c*radius+sign(c)*uSideSpan*side*smoothstep(0.,.30,r),s*radius*(1.-.25*side*r));
}
uniform vec4 uAuraCentre;
uniform vec2 uAuraX;uniform vec2 uAuraY;
vec4 projectAura(vec2 point){
 vec4 clip=uAuraCentre;
 clip.xy+=(uAuraX*point.x+uAuraY*point.y)*clip.w;
 return clip;
}`;function ep(i){return{uInnerRadius:{value:i.halo.innerRadius},uRadialSpan:{value:i.halo.radialSpan},uSideSpan:{value:i.halo.sideSpan},uAuraCentre:{value:new mt},uAuraX:{value:new ye},uAuraY:{value:new ye}}}var j_=`varying vec2 vUv;
uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;
${Qf}
void main(){
 vUv=uv;
 gl_Position=projectAura(auraPoint(uv.x*6.28318530718,1.-uv.y));
}`,$_=`uniform sampler2D uField;
uniform float uTime;uniform float uSpeed;uniform float uStrength;
varying vec2 vUv;
float ring(float r,float centre,float width){
 float filtered=sqrt(width*width+fwidth(r)*fwidth(r)/6.);
 float d=(r-centre)/filtered;
 return exp(-d*d)*width/filtered;
}
void main(){
 float r=1.-vUv.y,angle=vUv.x*6.28318530718;
 vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;
 // Keep emission around the entire silhouette, with gentle Doppler-like bias.
 float asymmetry=.76+.24*cos(angle-.45);
 // Broad hot gas supplies the light; nested contours are submerged in it.
 float photon=ring(r,.012,.0055)*2.3+ring(r,.050,.009)*.60+ring(r,.10,.015)*.25+ring(r,.22,.020)*.10;
 float soft=.30*exp(-r*5.5);
 float body=ring(r,.07,.035)*.48+ring(r,.17,.070)*.32+ring(r,.32,.10)*.15+ring(r,.50,.18)*.04;
 float taper=smoothstep(0.,.004,r)*(1.-smoothstep(.70,1.,r));
 float heat=clamp(.92-r*.95+(field.g-.5)*.24,0.,1.);
 vec3 gas=mix(vec3(1.,.20,.025),vec3(1.,.86,.63),smoothstep(.20,.90,heat));
 float textureEnergy=.38+field.r*.80;
 vec3 radiance=gas*((body*textureEnergy+field.r*.16)*uStrength+soft)*asymmetry;
 radiance+=mix(gas,vec3(1.,.93,.80),.65)*photon*(.90+.10*asymmetry);
 // Smooth corona falloff, independent of the much finer gas structure.
 float alpha=clamp((field.r*.16+body+soft+photon)*taper,0.,1.);
 if(alpha<.0005)discard;
 gl_FragColor=vec4(radiance*taper/alpha,alpha);
}`;async function tp(){let i=await fetch("./assets/continuous-optics.json");if(!i.ok)throw new Error("Continuous corona manifest unavailable");let e=await i.json(),[t,n]=await Promise.all([new Nn().loadAsync("./assets/"+e.file),fetch("./assets/"+e.halo.file).then(async r=>{if(!r.ok||!r.body)throw new Error("Continuous corona field unavailable");return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())})]);if(n.byteLength!==e.halo.bytes)throw new Error("Incomplete continuous corona field");let s=new _i(n,...e.halo.dimensions,_n);return s.minFilter=s.magFilter=Et,s.wrapS=An,s.unpackAlignment=1,s.needsUpdate=!0,{scene:t.scene,spec:e,texture:s}}function bh({spec:i,texture:e}){return new rt({vertexShader:j_,fragmentShader:$_,uniforms:{...ep(i),uField:{value:e},uTime:{value:0},uSpeed:{value:i.halo.flowSpeed},uStrength:{value:i.halo.strength*.36}},side:Ht,transparent:!0,depthWrite:!1,depthTest:!0,blending:cn,toneMapped:!1})}var J_=`precision highp float;
precision highp sampler3D;
uniform sampler3D uField;
uniform vec3 uMin;
uniform vec3 uMax;
uniform vec3 uNativeMin;
uniform vec3 uNativeMax;
uniform vec3 uFieldMin;
uniform vec3 uFieldMax;
uniform vec2 uSupportRadius;
uniform vec2 uSupportHeight;
uniform float uPlaneOffset;
uniform float uPlaneSlope;
uniform float uHalfHeight;
uniform float uDensityScale;
uniform float uEmission;
uniform float uHeatBias;
uniform float uUnifiedGlow;
uniform float uRadialStretch;
uniform float uOuterAura;
uniform float uTime;
uniform mat4 uLocalToClip;
varying vec3 v_position;
varying vec3 v_cameraInObj;
varying vec3 v_viewDirInObj;
vec3 colour(float x){
  vec3 a=vec3(.095,.012,.002),b=vec3(.48,.075,.009),c=vec3(1.,.34,.045),d=vec3(1.,.70,.25),e=vec3(1.,.96,.79);
  if(x<.33)return mix(a,b,smoothstep(0.,.33,x));
  if(x<.60)return mix(b,c,smoothstep(.33,.60,x));
  if(x<.81)return mix(c,d,smoothstep(.60,.81,x));
  return mix(d,e,smoothstep(.81,1.,x));
}
void main(){
  vec3 ro=v_cameraInObj,rd=normalize(v_position-ro);
  vec3 inv=1./(rd+vec3(1e-8));
  vec3 t0=(uMin-ro)*inv,t1=(uMax-ro)*inv;
  vec3 a=min(t0,t1),b=max(t0,t1);
  float start=max(max(a.x,a.y),max(a.z,0.));
  float finish=min(min(b.x,b.y),b.z);
  float planeHeight=ro.y+uPlaneOffset-ro.z*uPlaneSlope;
  float planeDirection=rd.y-rd.z*uPlaneSlope;
  if(abs(planeDirection)>.00001){
    float pa=(-uHalfHeight-planeHeight)/planeDirection;
    float pb=(uHalfHeight-planeHeight)/planeDirection;
    start=max(start,min(pa,pb));finish=min(finish,max(pa,pb));
  }else if(abs(planeHeight)>uHalfHeight)discard;
  // The opaque core blocks the gas behind it, from every camera angle.
  float sb=dot(ro,rd),sc=dot(ro,ro)-1.;
  float discriminant=sb*sb-sc;
  if(discriminant>0.){
    float hit=-sb-sqrt(discriminant);
    if(hit>0.)finish=min(finish,hit);
  }
  if(finish<=start)discard;
  int count=int(clamp(ceil((finish-start)*520.),32.,320.));
  float stepSize=(finish-start)/float(count);
  float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  float distance=start+(.15+.7*jitter)*stepSize;
  // Conservative native-field bounds remove zero-density work while keeping
  // the original sample spacing and phase inside every occupied region.
  float supportStart=start,supportFinish=finish;
  if(abs(planeDirection)>.00001){
    float sa=(uSupportHeight.x-planeHeight)/planeDirection;
    float sb=(uSupportHeight.y-planeHeight)/planeDirection;
    supportStart=max(supportStart,min(sa,sb));supportFinish=min(supportFinish,max(sa,sb));
  }else if(planeHeight<uSupportHeight.x||planeHeight>uSupportHeight.y)discard;
  float qa=dot(rd.xz,rd.xz),qb=dot(ro.xz,rd.xz);
  if(qa>.000001){
    float qc=dot(ro.xz,ro.xz)-uSupportRadius.y*uSupportRadius.y;
    float disc=qb*qb-qa*qc;
    if(disc<0.)discard;
    float root=sqrt(disc);
    supportStart=max(supportStart,(-qb-root)/qa);supportFinish=min(supportFinish,(-qb+root)/qa);
  }
  if(supportFinish<=supportStart)discard;
  int firstSample=max(0,int(ceil((supportStart-distance)/stepSize)));
  int lastSample=min(count-1,int(floor((supportFinish-distance)/stepSize)));
  if(firstSample>lastSample)discard;
  vec3 reference=ro+rd*((supportStart+supportFinish)*.5);
  vec2 referenceXY=vec2(reference.x,-reference.z);
  float referenceAngle=atan(referenceXY.y,referenceXY.x);
  float flowTime=uTime*.32;
  float innerRadiusSquared=uSupportRadius.x*uSupportRadius.x;
  vec3 inverseFieldSize=1./(uFieldMax-uFieldMin);
  vec3 radiance=vec3(0.);float alpha=0.,first=-1.;
  for(int i=firstSample;i<320;i++){
    if(i>lastSample||alpha>.985)break;
    float sampleDistance=distance+float(i)*stepSize;
    vec3 p=ro+rd*sampleDistance;
    float radiusSquared=dot(p.xz,p.xz);
    // The native bake certifies zero density inside this padded radius.
    // Reject those samples before angular maths and 3D texture reads.
    if(radiusSquared<innerRadiusSquared)continue;
    vec3 native=vec3(p.x,-p.z,p.y);
    float height=planeHeight+planeDirection*sampleDistance;
    // Differential angular flow moves inner curls a little faster. At the
    // existing default speed this becomes visible over several seconds.
    float radius=sqrt(radiusSquared);
    float crossTerm=referenceXY.x*native.y-referenceXY.y*native.x;
    float dotTerm=dot(referenceXY,native.xy);
    float angle;
    if(dotTerm>0.&&abs(crossTerm)<.125*dotTerm){
      float t=crossTerm/dotTerm,t2=t*t;
      angle=referenceAngle+t*(1.+t2*(-1./3.+t2*(1./5.-t2/7.)));
    }else angle=atan(native.y,native.x);
    angle+=flowTime*inversesqrt(max(radius,1.));
    // Expand the disk outside the unit core while retaining its central hole,
    // physical sphere occlusion and every native radial texture sample.
    float sourceRadius=1.+(radius-1.)/uRadialStretch;
    vec3 fieldPosition=vec3(sourceRadius,angle,height);
    vec3 q=(fieldPosition-uFieldMin)*inverseFieldSize;
    q.y=fract(q.y);
    vec2 gas=texture(uField,clamp(q,0.,1.)).rg;
    float innerHeat=exp(-max(0.,radius-1.08)*2.1);
    float outerFade=1.-smoothstep(1.55,2.74,sourceRadius)*.78*uUnifiedGlow;
    float density=gas.r*uDensityScale*outerFade;
    // The replacement outer aura is a quiet, complete annulus. It ramps up
    // outside the bright centre and dissolves at its outermost edge.
    if(uOuterAura>.5)density*=smoothstep(1.10,1.45,sourceRadius)*(1.-smoothstep(1.95,2.75,sourceRadius));
    if(density>.004){
      if(first<0.)first=sampleDistance;
      float absorb=1.-exp(-density*stepSize);
      float heat=clamp(gas.g+uHeatBias+innerHeat*.19*uUnifiedGlow,0.,1.);
      radiance+=(1.-alpha)*colour(heat)*uEmission*(1.+innerHeat*1.2*uUnifiedGlow)*absorb;
      alpha+=(1.-alpha)*absorb;
    }
  }
  if(alpha<.0005||first<0.)discard;
  vec4 clip=uLocalToClip*vec4(ro+rd*first,1.);
  gl_FragDepth=clip.z/clip.w*.5+.5;
  gl_FragColor=vec4(radiance/max(alpha,.00001),alpha);
}`;async function np(){let i=await fetch("./assets/native-volumes.json");if(!i.ok)throw new Error("Native horizon volumes unavailable");let e=await i.json();if(e.sourceImageUsed!==!1)throw new Error("Unexpected horizon material source");let[t,n]=await Promise.all(["native-space-volumes.json","native-space-particles.json"].map(async l=>{let c=await fetch("./assets/"+l);if(!c.ok)throw new Error("Native space asset unavailable: "+l);let u=await c.json();if(u.sourceImageUsed!==!1)throw new Error("Unexpected space material source");return u})),[s,r,o,a]=await Promise.all([Promise.all([...e.volumes,...t.volumes].map(async l=>{let c=await fetch("./assets/"+l.file);if(!c.ok||!c.body)throw new Error("Native gas field unavailable: "+l.id);let u=c.body.pipeThrough(new DecompressionStream("gzip")),d=new Uint8Array(await new Response(u).arrayBuffer());if(d.byteLength!==l.bytes)throw new Error("Incomplete native gas field: "+l.id);let h=new gr(d,...l.dimensions);return h.format=_n,h.type=xn,h.minFilter=Et,h.magFilter=Et,h.wrapT=An,h.unpackAlignment=1,h.needsUpdate=!0,{spec:l,texture:h}})),new Nn().loadAsync("./assets/native-horizon-ground.glb"),$f(),tp()]);return{volumes:s,ground:r,optics:o,corona:a,particles:n}}function Mh({spec:i,texture:e}){let t=new D(i.boundsMin[0],i.boundsMin[2],-i.boundsMax[1]),n=new D(i.boundsMax[0],i.boundsMax[2],-i.boundsMin[1]),s=n.clone().sub(t),r=t.clone().add(n).multiplyScalar(.5),o=new Vi(s.x,s.y,s.z);o.translate(r.x,r.y,r.z);let a=new rt({vertexShader:jf.vertexShader,fragmentShader:J_,uniforms:{uField:{value:e},uMin:{value:t},uMax:{value:n},uNativeMin:{value:new D(...i.boundsMin)},uNativeMax:{value:new D(...i.boundsMax)},uFieldMin:{value:new D(...i.fieldBoundsMin)},uFieldMax:{value:new D(...i.fieldBoundsMax)},uSupportRadius:{value:new ye(...i.support?.radius??[i.fieldBoundsMin[0],i.fieldBoundsMax[0]])},uSupportHeight:{value:new ye(...i.support?.height??[i.fieldBoundsMin[2],i.fieldBoundsMax[2]])},uPlaneOffset:{value:i.planeOffset},uPlaneSlope:{value:i.planeSlope},uHalfHeight:{value:i.halfHeight},uDensityScale:{value:i.densityScale*.8},uEmission:{value:i.emissionStrength*.68},uHeatBias:{value:0},uUnifiedGlow:{value:0},uRadialStretch:{value:1},uOuterAura:{value:0},uTime:{value:0},uLocalToClip:{value:new Ge}},side:en,transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1}),l=new vt(o,a);return l.userData.nativeBounds={min:t.clone(),max:n.clone(),support:a.uniforms.uSupportRadius.value.clone()},l.userData.nativeGeometry=o,l.name="Native Blender "+i.id+" gas volume",l.frustumCulled=!1,l.renderOrder=-20,l.onBeforeRender=(c,u,d)=>{a.uniforms.uLocalToClip.value.multiplyMatrices(d.projectionMatrix,d.matrixWorldInverse).multiply(l.matrixWorld)},l}function Sh(i,e){let t=i.material.uniforms;if(t.uRadialStretch.value===e)return;let n=i.userData.nativeBounds;if(t.uRadialStretch.value=e,t.uMin.value.copy(n.min),t.uMax.value.copy(n.max),t.uSupportRadius.value.copy(n.support),e===1){i.geometry=i.userData.nativeGeometry;return}let s=o=>Math.sign(o)*(1+(Math.abs(o)-1)*e);for(let o of["x","z"])t.uMin.value[o]=s(n.min[o]),t.uMax.value[o]=s(n.max[o]);let r=Math.abs(t.uPlaneSlope.value)*(t.uMax.value.z-n.max.z);if(t.uMin.value.y-=r,t.uMax.value.y+=r,t.uSupportRadius.value.set(1+(n.support.x-1)*e,1+(n.support.y-1)*e),!i.userData.expandedGeometry){let o=t.uMax.value.clone().sub(t.uMin.value),a=t.uMin.value.clone().add(t.uMax.value).multiplyScalar(.5);i.userData.expandedGeometry=new Vi(o.x,o.y,o.z),i.userData.expandedGeometry.translate(a.x,a.y,a.z)}i.geometry=i.userData.expandedGeometry}function ip(i){let e=i.colourDirection;return{uPalette:{value:e.radialStops.map(t=>new we(t.colour))},uStops:{value:e.radialStops.map(t=>t.at)},uRose:{value:new we(e.rose)},uGold:{value:new we(e.gold)},uBlue:{value:new we(e.blue)},uCyan:{value:new we(e.cyan)}}}var sp=`
uniform vec3 uPalette[10];uniform float uStops[10];
uniform vec3 uRose;uniform vec3 uGold;uniform vec3 uBlue;uniform vec3 uCyan;
vec3 radialColour(float r){
 vec3 result=uPalette[0];
 for(int i=1;i<10;i++)result=mix(result,uPalette[i],smoothstep(uStops[i-1],uStops[i],r));
 return result;
}
// Both angles are within one turn. The unsigned shortest arc is equivalent
// to the squared atan(sin(delta),cos(delta)), without twelve trig calls per
// fragment across the four colour regions.
float sector(float angle,float centre,float width){float d=abs(angle-centre);d=min(d,6.28318530718-d)/width;return exp(-d*d);}
vec3 layeredColour(float r,vec2 field,vec3 point){
 float azimuth=atan(point.z,point.x);
 float rightGold=sector(azimuth,.15,.60)*smoothstep(.025,.065,r)*(1.-smoothstep(.18,.30,r));
 float rearRose=sector(azimuth,-1.20,.72)*smoothstep(.06,.20,r);
 float leftBlue=sector(azimuth,2.22,.25)*exp(-pow((r-.10)/.075,2.));
 float leftCyan=sector(azimuth,2.72,.19)*exp(-pow((r-.17)/.08,2.));
 vec3 colour=radialColour(r);
 colour=mix(colour,uGold,rightGold*.42);
 colour=mix(colour,uRose,rearRose*.62);
 colour=mix(colour,uBlue,clamp(leftBlue*(.70+field.r*.8),0.,.94));
 colour=mix(colour,uCyan,clamp(leftCyan*(.65+field.r*.8),0.,.94));
 float ribbons=pow(.5+.5*sin(r*310.+field.r*5.),12.)*.18*(1.-smoothstep(.12,.32,r));
 colour=mix(colour,uPalette[0],ribbons);
 return colour*(1.+leftBlue*1.2+leftCyan*1.8);
}`;var Eh=`
vec2 sampleSharedCoordinates(vec3 eye,vec3 ray){
 float t=dot(-eye,ray);vec3 closest=eye+ray*t;
 vec3 pole=abs(ray.y)>.98?vec3(0.,0.,1.):vec3(0.,1.,0.);
 vec3 right=normalize(cross(pole,-ray)),up=cross(-ray,right);
 float fieldU=atan(dot(closest,up),dot(closest,right))/6.28318530718;
 float distance=length(closest),latitude=atan(closest.y,length(closest.xz));
 float shoulder=pow(max(0.,cos(latitude)),7.),vertical=mix(uVerticalSpread,1.,pow(cos(latitude),2.));
 float lo=0.,hi=1.;
 for(int j=0;j<7;j++){float mid=(lo+hi)*.5;float extent=uInnerRadius+uRadialSpan*mid*vertical+uSideSpan*shoulder*smoothstep(0.,.30,mid);if(extent<distance)lo=mid;else hi=mid;}
 float eLo=uInnerRadius+uRadialSpan*lo*vertical+uSideSpan*shoulder*smoothstep(0.,.30,lo),eHi=uInnerRadius+uRadialSpan*hi*vertical+uSideSpan*shoulder*smoothstep(0.,.30,hi);
 float fieldR=mix(lo,hi,clamp((distance-eLo)/max(eHi-eLo,.00001),0.,1.));
 return vec2(fract(fieldU),fieldR);
}
vec3 sampleSharedField(vec3 eye,vec3 ray){
 vec2 coordinates=sampleSharedCoordinates(eye,ray);
 return vec3(texture2D(uField,vec2(fract(coordinates.x+uTime*uSpeed),coordinates.y)).rg,coordinates.y);
}`;function rp(i,e){let t=new Xt(1,1,{format:_n,type:un,minFilter:Et,magFilter:Et,depthBuffer:!1,stencilBuffer:!1});t.texture.name="Full-resolution shared corona optical field (half float)";let n=new ye,s=new Ge,r=new Ge,o=new Ze,a=new D,l=.4,c=new rt({uniforms:{...e.uniforms,uProjectionInverse:{value:new Ge},uRayToLocal:{value:o},uLocalEye:{value:a}},vertexShader:"varying vec2 vNdc;void main(){vNdc=position.xy;gl_Position=vec4(position,1.);}",fragmentShader:`uniform sampler2D uField;uniform float uTime,uSpeed,uInnerRadius,uRadialSpan,uSideSpan,uVerticalSpread;
   uniform mat4 uProjectionInverse;uniform mat3 uRayToLocal;uniform vec3 uLocalEye;varying vec2 vNdc;
   ${Eh}
   void main(){vec4 point=uProjectionInverse*vec4(vNdc,1.,1.);vec3 ray=normalize(uRayToLocal*point.xyz);vec2 coordinates=sampleSharedCoordinates(uLocalEye,ray);gl_FragColor=vec4(coordinates,0.,1.);}`,depthTest:!1,depthWrite:!1,blending:In,toneMapped:!1}),u=new Tt;u.setAttribute("position",new yt([-1,-1,0,3,-1,0,-1,3,0],3));let d=new Ps,h=new Fs;d.add(new vt(u,c));let f="",m;return{prepare(y,g){if(m===void 0&&(m=y.extensions.has("EXT_color_buffer_float")),!m||!g.isPerspectiveCamera)return e.uniforms.uUseSharedField.value=!1,!1;i.updateWorldMatrix(!0,!1),g.updateWorldMatrix(!0,!1);let p=y.getRenderTarget();p?n.set(p.width,p.height):y.getDrawingBufferSize(n);let S=[...i.matrixWorld.elements,...g.matrixWorld.elements,...g.projectionMatrix.elements,n.x,n.y].join(",");if(S!==f){s.copy(i.matrixWorld).invert(),r.copy(s).multiply(g.matrixWorld),o.setFromMatrix4(r),c.uniforms.uProjectionInverse.value.copy(g.projectionMatrixInverse),a.setFromMatrixPosition(g.matrixWorld).applyMatrix4(s),e.uniforms.uLocalEye.value.copy(a);let I=Math.max(1,Math.ceil(n.x*l)),b=Math.max(1,Math.ceil(n.y*l));(t.width!==I||t.height!==b)&&t.setSize(I,b);let T=y.autoClear;try{y.autoClear=!1,y.setRenderTarget(t),y.render(d,h)}finally{y.setRenderTarget(p),y.autoClear=T}f=S}return e.uniforms.uSharedField.value=t.texture,e.uniforms.uSharedSize.value.copy(n),e.uniforms.uUseSharedField.value=!0,!0},dispose(){t.dispose(),u.dispose(),c.dispose()}}}var Q_={layers:6,segments:128,bands:128},ey=i=>{let e=Math.max(0,Math.min(1,i/.3));return e*e*(3-2*e)};function ty(i,e,t,n){let s=Math.max(0,Math.cos(e)),r=Math.sin(e),o=s**6,a=i.halo.innerRadius+n*i.halo.radialSpan,l=s*a+i.halo.sideSpan*o*ey(n),c=r*(i.halo.innerRadius+n*i.halo.radialSpan*(i.halo.verticalSpread??1))*(1-.25*o*n);return new D(l*Math.cos(t),c,l*Math.sin(t))}function ny(i){let e=bh(i);return Object.assign(e.uniforms,{uUseSharedField:{value:!1},uSharedField:{value:null},uSharedSize:{value:new ye(1,1)},uLocalEye:{value:new D}}),Object.assign(e.uniforms,{uLayerR:{value:0},uLayerProfile:{value:new mt}}),Object.assign(e.uniforms,ip(i.spec),{uInnerRadius:{value:i.spec.halo.innerRadius},uRadialSpan:{value:i.spec.halo.radialSpan},uSideSpan:{value:i.spec.halo.sideSpan},uVerticalSpread:{value:i.spec.halo.verticalSpread}}),e.vertexShader=`uniform bool uUseSharedField;uniform vec3 uLocalEye;attribute float aLightWeight;varying vec2 vUv;varying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;
 void main(){vUv=uv;vWeight=aLightWeight;vLocal=position;vEye=uUseSharedField?uLocalEye:(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}`,e.fragmentShader=sp+`uniform float uLayerR;uniform vec4 uLayerProfile;uniform bool uUseSharedField;uniform sampler2D uSharedField;uniform vec2 uSharedSize;uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;uniform float uVerticalSpread;
varying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;
`+e.fragmentShader.replace("void main(){",Eh+`
void main(){vec3 ray=normalize(vLocal-vEye);float t=dot(-vEye,ray);if(t>0.&&t*t-dot(vEye,vEye)+1.>0.)discard;`).replace("vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;",`
   vec3 sharedField;
   if(uUseSharedField){vec2 cached=texture2D(uSharedField,gl_FragCoord.xy/uSharedSize).rg;sharedField=vec3(texture2D(uField,vec2(fract(cached.x+uTime*uSpeed),cached.y)).rg,cached.y);}
   else sharedField=sampleSharedField(vEye,ray);
   float fieldR=sharedField.z;
   vec2 field=sharedField.xy;
   field=mix(texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg,field,.45);`).replace("float heat=clamp(.92-r*.95+(field.g-.5)*.24,0.,1.);","float heat=clamp(.94-fieldR*.80+(field.g-.5)*.12,0.,1.);").replace("vec3 gas=mix(vec3(1.,.20,.025),vec3(1.,.86,.63),smoothstep(.20,.90,heat));","vec3 gas=layeredColour(fieldR,field,vLocal);").replaceAll("field.r*.16","field.r*.16*exp(-r*6.)").replace("float r=1.-vUv.y","float r=uLayerR").replace("float soft=.30*exp(-r*5.5);","float soft=uLayerProfile.y;").replace("float body=ring(r,.07,.035)*.48+ring(r,.17,.070)*.32+ring(r,.32,.10)*.15+ring(r,.50,.18)*.04;","float body=uLayerProfile.x;").replace("float taper=smoothstep(0.,.004,r)*(1.-smoothstep(.70,1.,r));","float taper=uLayerProfile.z;").replaceAll("exp(-r*6.)","uLayerProfile.w").replace("float soft=","photon=0.;float soft=").replace("gl_FragColor=vec4(radiance*taper/alpha,alpha);","float facing=abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)));float rim=pow(max(0.,1.-facing),3.)*smoothstep(0.,.25,facing);gl_FragColor=vec4(radiance*taper/alpha,alpha*vWeight*rim);"),e}function op(i,{sharedField:e=!1,singlePass:t=!1}={}){let n=new an;n.name="White aura \u2014 continuous curved 360 degree body";let{layers:s,segments:r,bands:o}=Q_,a=[.004,.07,.17,.32,.5,1],l=ny(i);l.forceSinglePass=t,e&&(n.userData.fieldCache=rp(n,l));for(let c=0;c<s;c++){let u=a[c],d=((a[c+1]??1)-(a[c-1]??0))*.5,h=new Wi(1,r,o),f=h.attributes.position,m=h.attributes.uv,y=new Float32Array(f.count);for(let T=0;T<f.count;T++){let E=Math.asin(Math.max(-1,Math.min(1,f.getY(T)))),R=Math.atan2(f.getZ(T),f.getX(T)),_=ty(i.spec,E,R,u);f.setXYZ(T,..._.toArray());let A=Math.max(0,Math.cos(E)),N=Math.max(0,Math.min(1,u/.3)),C=Math.hypot(_.x,_.z),M=A*i.spec.halo.radialSpan+i.spec.halo.sideSpan*A**6*6*N*(1-N)/.3;y[T]=d*(C>1e-6?M/C:i.spec.halo.radialSpan/(i.spec.halo.innerRadius+u*i.spec.halo.radialSpan))*(i.spec.halo.bodyLightGain??5),m.setXY(T,R/(Math.PI*2)+E/(Math.PI*2)*Math.cos(R),1-u)}h.setAttribute("aLightWeight",new Ct(y,1)),h.computeVertexNormals(),h.computeBoundingSphere();let g=new vt(h,l);g.name="Closed flowing aura surface "+(c+1),g.renderOrder=-25,g.frustumCulled=!1,n.add(g);let p=Math.fround(1-Math.fround(1-u)),S=(T,E,R)=>R*Math.exp(-(((p-T)/E)**2)),I=(T,E)=>{let R=Math.max(0,Math.min(1,(p-T)/(E-T)));return R*R*(3-2*R)},b=new mt(S(.07,.035,.48)+S(.17,.07,.32)+S(.32,.1,.15)+S(.5,.18,.04),.3*Math.exp(-p*5.5),I(0,.004)*(1-I(.7,1)),Math.exp(-p*6));g.onBeforeRender=()=>{l.uniforms.uLayerR.value=p,l.uniforms.uLayerProfile.value.copy(b),l.uniformsNeedUpdate=!0}}for(let[c,[u,d]]of[[1.016,2.3],[1.048,.6],[1.087,.2]].entries()){let h=new rt({vertexShader:"varying vec3 vWorld;varying vec3 vNormal;void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}",fragmentShader:"uniform float uTime;uniform float uStrength;uniform vec3 uColour;varying vec3 vWorld;varying vec3 vNormal;void main(){float rim=pow(max(0.,1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)))),8.);if(rim<.0001)discard;gl_FragColor=vec4(uColour*uStrength,rim);}",uniforms:{uTime:{value:0},uStrength:{value:d},uColour:{value:new we(i.spec.colourDirection.innerShellColours[c])}},transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1,blending:cn}),f=new vt(new Wi(u,128,64),h);f.name="Fine inner emission shell "+(c+1),f.renderOrder=-25,n.add(f)}return n}var iy={referenceDistance:4.2,layers:33,segments:512,bands:32},ap=(i,e,t)=>{let n=Math.min(1,Math.max(0,(t-i)/(e-i)));return n*n*(3-2*n)};function lp(i,e,t,n=0){let s=Math.cos(e),r=Math.sin(e),o=Math.abs(s)**6,a=i.halo.innerRadius+t*i.halo.radialSpan,l=s*a+Math.sign(s)*i.halo.sideSpan*o*ap(0,.3,t),c=r*a*(1-.25*o*t),u=iy.referenceDistance,d=1/u,h=Math.sqrt(1-1/(u*u)),f=d+n*(.24+.38*t+.65*o*ap(.04,.8,t)),m=(u-f)/(u-d);return new D(l*h*m,c*h*m,f)}function cp(){return new Bt().setFromEuler(new Rn(.2,0,.25)).invert().multiply(new Bt().setFromEuler(new Rn(0,0,.25)))}function up(i){let e=new an;e.name="Small blue aura flares",e.quaternion.copy(cp());let t=new Gi(1,1);for(let[n,s]of i.flares.entries()){let r=new rt({vertexShader:`uniform float uTime;uniform vec3 uAnchor;
       uniform vec2 uSize;varying vec2 vUv;
       void main(){vUv=uv;
         vec4 view=modelViewMatrix*vec4(uAnchor,1.);
         view.xy+=position.xy*uSize*length(modelMatrix[0].xyz);
         gl_Position=projectionMatrix*view;
       }`,fragmentShader:`uniform float uTime;uniform float uPhase;varying vec2 vUv;
       void main(){vec2 p=(vUv-.5)*2.;float t=uTime*.65+uPhase;
         float sway=.12*sin(p.y*7.+t)+.06*sin(p.y*15.-t*.7);
         float core=exp(-dot(p*vec2(1.,1.8),p*vec2(1.,1.8))*125.);
         vec2 plume=vec2((p.x-sway)*(1.8+max(p.y,0.)*2.),(p.y-.12)*1.9);
         float mist=exp(-dot(plume,plume)*5.);
         float curls=pow(.5+.5*sin(p.x*24.+p.y*13.+sin(p.y*17.-t)*2.),3.);
         float edge=1.-smoothstep(.68,1.,length(p));
         float pulse=.80+.20*sin(t);
         vec3 light=vec3(.07,.30,1.)*mist*(.26+curls*.85)+vec3(.30,.65,1.)*core*2.8;
         float alpha=clamp((mist*.65+core*.85)*edge*pulse,0.,1.);
         if(alpha<.0005)discard;
         gl_FragColor=vec4(light*edge*pulse/alpha,alpha);
       }`,uniforms:{uTime:{value:0},uPhase:{value:n*2.17},uAnchor:{value:lp(i,s.auraAngle,s.auraRadius,.65)},uSize:{value:new ye(...s.size)}},transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1,blending:kn,side:Ht}),o=new vt(t,r);o.frustumCulled=!1,o.name="Blue disk wisp "+(n+1),o.renderOrder=-15,e.add(o)}return e}var Fr={halo:{title:"Halo",color:"white",props:{type:"plane",uAmplitude:1,uDensity:1.3,uSpeed:.4,uStrength:4,uTime:0,uFrequency:5.5,range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",axesHelper:"off",brightness:1.2,cAzimuthAngle:180,cDistance:3.6,cPolarAngle:90,cameraZoom:1,color1:"#ff5005",color2:"#dbba95",color3:"#d0bce1",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:-1.4,positionY:0,positionZ:0,reflection:.1,rotationX:0,rotationY:10,rotationZ:50,shader:"defaults",animate:"on",wireframe:!1}},pensive:{title:"Pensive",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.5,cAzimuthAngle:250,cDistance:1.5,cPolarAngle:140,cameraZoom:12.5,color1:"#809bd6",color2:"#910aff",color3:"#af38ff",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.5,rotationX:0,rotationY:0,rotationZ:140,shader:"defaults",type:"sphere",uAmplitude:7,uDensity:.8,uFrequency:5.5,uSpeed:.3,uStrength:.4,uTime:0,wireframe:!1}},mint:{title:"Mint",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.2,cAzimuthAngle:170,cDistance:4.4,cPolarAngle:70,cameraZoom:1,color1:"#94ffd1",color2:"#6bf5ff",color3:"#ffffff",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:.9,positionZ:-.3,reflection:.1,rotationX:45,rotationY:0,rotationZ:0,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.2,uFrequency:0,uSpeed:.2,uStrength:3.4,uTime:0,wireframe:!1}},interstella:{title:"Interstella",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:.8,cAzimuthAngle:270,cDistance:.5,cPolarAngle:180,cameraZoom:15.1,color1:"#73bfc4",color2:"#ff810a",color3:"#8da0ce",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"env",pixelDensity:1,fov:45,positionX:-.1,positionY:0,positionZ:0,reflection:.4,rotationX:0,rotationY:130,rotationZ:70,shader:"defaults",type:"sphere",uAmplitude:3.2,uDensity:.8,uFrequency:5.5,uSpeed:.3,uStrength:.3,uTime:0,wireframe:!1}},nightyNight:{title:"Nighty night",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1,cAzimuthAngle:180,cDistance:2.8,cPolarAngle:80,cameraZoom:9.1,color1:"#606080",color2:"#8d7dca",color3:"#212121",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.1,rotationX:50,rotationY:0,rotationZ:-60,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.5,uFrequency:0,uSpeed:.3,uStrength:1.5,uTime:8,wireframe:!1}},violaOrientalis:{title:"Viola",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",brightness:1.1,cAzimuthAngle:0,cDistance:7.1,cPolarAngle:140,cameraZoom:17.3,color1:"#ffffff",color2:"#ffbb00",color3:"#0700ff",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:0,shader:"defaults",type:"sphere",uAmplitude:1.4,uDensity:1.1,uSpeed:.1,uStrength:1,uTime:0,uFrequency:5.5,wireframe:!1}},universe:{title:"Universe",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",brightness:1.1,cAzimuthAngle:180,cDistance:3.9,cPolarAngle:115,cameraZoom:1,color1:"#5606ff",color2:"#fe8989",color3:"#000000",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:-.5,positionY:.1,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:235,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.1,uSpeed:.1,uStrength:2.4,uTime:.2,uFrequency:5.5,wireframe:!1}},sunset:{title:"Sunset",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",bgColor1:"#000000",bgColor2:"#000000",brightness:1.5,cAzimuthAngle:60,cDistance:7.1,cPolarAngle:90,cameraZoom:15.3,color1:"#ff7a33",color2:"#33a0ff",color3:"#ffc53d",embedMode:"off",envPreset:"dawn",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:-.15,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:0,shader:"defaults",type:"sphere",uAmplitude:1.4,uDensity:1.1,uSpeed:.1,uStrength:.4,uTime:0,uFrequency:5.5,wireframe:!1}},mandarin:{title:"Mandarin",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",bgColor1:"#000000",bgColor2:"#000000",brightness:1.2,cAzimuthAngle:180,cDistance:2.4,cPolarAngle:95,cameraZoom:1,color1:"#ff6a1a",color2:"#c73c00",color3:"#FD4912",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:-2.1,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:225,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.8,uSpeed:.2,uStrength:3,uTime:.2,uFrequency:5.5,wireframe:!1}},cottonCandy:{title:"Cotton Candy",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.2,cAzimuthAngle:180,cDistance:2.9,cPolarAngle:120,cameraZoom:1,color1:"#ebedff",color2:"#f3f2f8",color3:"#dbf8ff",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:1.8,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:-90,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1,uSpeed:.3,uStrength:3,uTime:.2,uFrequency:5.5,wireframe:!1}}};var f1=Object.values(Fr);function hp(i,e,t,n){return class extends vn{constructor(){let s=Object.entries(i),r=i.colors,o=Th(r[0]),a=Th(r[1]),l=Th(r[2]),c={uC1r:{value:Ji(o?.r)},uC1g:{value:Ji(o?.g)},uC1b:{value:Ji(o?.b)},uC2r:{value:Ji(a?.r)},uC2g:{value:Ji(a?.g)},uC2b:{value:Ji(a?.b)},uC3r:{value:Ji(l?.r)},uC3g:{value:Ji(l?.g)},uC3b:{value:Ji(l?.b)}},u=s.reduce((d,[h,f])=>{let m=li.clone({[h]:{value:f}});return{...d,...m}},{});super({metalness:.2,userData:u,side:Ht,onBeforeCompile:d=>{d.uniforms={...d.uniforms,...u,...c},d.vertexShader=e,d.fragmentShader=t}}),s.forEach(([d])=>Object.defineProperty(this,d,{get:()=>this.uniforms[d].value,set:h=>this.uniforms[d].value=h})),n&&n(this)}}}function sy(i){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function ry(i){let e=i.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);return e?{r:parseInt(e[1]),g:parseInt(e[2]),b:parseInt(e[3])}:null}function Th(i){if(i.startsWith("#"))return sy(i);if(i.startsWith("rgb"))return ry(i);throw new Error("Invalid color format")}function Ji(i=0){return i/255}var wh=`\r
#define STANDARD\r
#ifdef PHYSICAL\r
#define REFLECTIVITY\r
#define CLEARCOAT\r
#define TRANSMISSION\r
#endif\r
uniform vec3 diffuse;\r
uniform vec3 emissive;\r
uniform float roughness;\r
uniform float metalness;\r
uniform float opacity;\r
#ifdef TRANSMISSION\r
uniform float transmission;\r
#endif\r
#ifdef REFLECTIVITY\r
uniform float reflectivity;\r
#endif\r
#ifdef CLEARCOAT\r
uniform float clearcoat;\r
uniform float clearcoatRoughness;\r
#endif\r
#ifdef USE_SHEEN\r
uniform vec3 sheen;\r
#endif\r
varying vec3 vViewPosition;\r
#ifndef FLAT_SHADED\r
#ifdef USE_TANGENT\r
varying vec3 vTangent;\r
varying vec3 vBitangent;\r
#endif\r
#endif\r
#include <alphamap_pars_fragment>\r
#include <aomap_pars_fragment>\r
#include <color_pars_fragment>\r
#include <common>\r
#include <dithering_pars_fragment>\r
#include <emissivemap_pars_fragment>\r
#include <lightmap_pars_fragment>\r
#include <map_pars_fragment>\r
#include <packing>\r
#include <uv2_pars_fragment>\r
#include <uv_pars_fragment>\r
// #include <transmissionmap_pars_fragment>\r
#include <bsdfs>\r
#include <bumpmap_pars_fragment>\r
#include <clearcoat_pars_fragment>\r
#include <clipping_planes_pars_fragment>\r
#include <cube_uv_reflection_fragment>\r
#include <envmap_common_pars_fragment>\r
#include <envmap_physical_pars_fragment>\r
#include <fog_pars_fragment>\r
#include <lights_pars_begin>\r
#include <lights_physical_pars_fragment>\r
#include <logdepthbuf_pars_fragment>\r
#include <metalnessmap_pars_fragment>\r
#include <normalmap_pars_fragment>\r
#include <roughnessmap_pars_fragment>\r
#include <shadowmap_pars_fragment>\r
// include\uB97C \uD1B5\uD574 \uAC00\uC838\uC628 \uAC12\uC740 \uB300\uBD80\uBD84 \uD658\uACBD, \uBE5B \uB4F1\uC744 \uACC4\uC0B0\uD558\uAE30 \uC704\uD574\uC11C \uAE30\uBCF8 fragment\r
// shader\uC758 \uAC12\uB4E4\uC744 \uBC1B\uC544\uC654\uC2B5\uB2C8\uB2E4. \uC77C\uB2E8\uC740 \uBB34\uC2DC\uD558\uC154\uB3C4 \uB429\uB2C8\uB2E4.\r
varying vec3 vNormal;\r
varying float displacement;\r
varying vec3 vPos;\r
varying float vDistort;\r
uniform float uC1r;\r
uniform float uC1g;\r
uniform float uC1b;\r
uniform float uC2r;\r
uniform float uC2g;\r
uniform float uC2b;\r
uniform float uC3r;\r
uniform float uC3g;\r
uniform float uC3b;\r
varying vec3 color1;\r
varying vec3 color2;\r
varying vec3 color3;\r
varying float distanceToCenter;\r
\r
\r
// for npm package, need to add this manually\r
// 'linearToRelativeLuminance' : function already has a body\r
float linearToRelativeLuminance2( const in vec3 color ) {\r
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\r
    return dot( weights, color.rgb );\r
}\r
\r
void main() {\r
  //-------- basic gradient ------------\r
  vec3 color1 = vec3(uC1r, uC1g, uC1b);\r
  vec3 color2 = vec3(uC2r, uC2g, uC2b);\r
  vec3 color3 = vec3(uC3r, uC3g, uC3b);\r
  float clearcoat = 1.0;\r
  float clearcoatRoughness = 0.5;\r
#include <clipping_planes_fragment>\r
\r
  float distanceToCenter = distance(vPos, vec3(0, 0, 0));\r
  // distanceToCenter\uB85C \uC911\uC2EC\uC810\uACFC\uC758 \uAC70\uB9AC\uB97C \uAD6C\uD568.\r
\r
  vec4 diffuseColor =\r
      vec4(mix(color3, mix(color2, color1, smoothstep(-1.0, 1.0, vPos.y)),\r
               distanceToCenter),\r
           1);\r
\r
  //-------- materiality ------------\r
  ReflectedLight reflectedLight =\r
      ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));\r
  vec3 totalEmissiveRadiance = emissive;\r
#ifdef TRANSMISSION\r
  float totalTransmission = transmission;\r
#endif\r
#include <logdepthbuf_fragment>\r
#include <map_fragment>\r
#include <color_fragment>\r
#include <alphamap_fragment>\r
#include <alphatest_fragment>\r
#include <roughnessmap_fragment>\r
#include <metalnessmap_fragment>\r
#include <normal_fragment_begin>\r
#include <normal_fragment_maps>\r
#include <clearcoat_normal_fragment_begin>\r
#include <clearcoat_normal_fragment_maps>\r
#include <emissivemap_fragment>\r
// #include <transmissionmap_fragment>\r
#include <lights_physical_fragment>\r
#include <lights_fragment_begin>\r
#include <lights_fragment_maps>\r
#include <lights_fragment_end>\r
#include <aomap_fragment>\r
  vec3 outgoingLight =\r
      reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +\r
      reflectedLight.directSpecular + reflectedLight.indirectSpecular;\r
//\uC704\uC5D0\uC11C \uC815\uC758\uD55C diffuseColor\uC5D0 \uD658\uACBD\uC774\uB098 \uBC18\uC0AC\uAC12\uB4E4\uC744 \uBC18\uC601\uD55C \uAC12.\r
#ifdef TRANSMISSION\r
  diffuseColor.a *=\r
      mix(saturate(1. - totalTransmission +\r
                   linearToRelativeLuminance2(reflectedLight.directSpecular +\r
                                             reflectedLight.indirectSpecular)),\r
          1.0, metalness);\r
#endif\r
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);\r
  // gl_FragColor\uAC00 fragment shader\uB97C \uD1B5\uD574 \uB098\uD0C0\uB098\uB294 \uCD5C\uC885\uAC12\uC73C\uB85C, diffuseColor\uC5D0\uC11C\r
  // \uC815\uC758\uD55C \uADF8\uB77C\uB514\uC5B8\uD2B8 \uC0C9\uC0C1 \uC704\uC5D0 \uBC18\uC0AC\uB098 \uBE5B\uC744 \uACC4\uC0B0\uD55C \uAC12\uC744 \uCD5C\uC885\uAC12\uC73C\uB85C \uC815\uC758.\r
  // gl_FragColor = vec4(mix(mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x)),\r
  // color2, vNormal.z), 1.0); \uC704\uCC98\uB7FC \uCD5C\uC885\uAC12\uC744 \uADF8\uB77C\uB514\uC5B8\uD2B8 \uAC12 \uC790\uCCB4\uB97C \uB123\uC73C\uBA74 \uD658\uACBD\r
  // \uC601\uD5A5\uC5C6\uB294 \uADF8\uB77C\uB514\uC5B8\uD2B8\uB9CC \uD45C\uD604\uB428.\r
\r
#include <tonemapping_fragment>\r
#include <encodings_fragment>\r
#include <fog_fragment>\r
#include <premultiplied_alpha_fragment>\r
#include <dithering_fragment>\r
}\r
`;var Ah=`// #pragma glslify: pnoise = require(glsl-noise/periodic/3d)\r
\r
vec3 mod289(vec3 x)\r
{\r
  return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 mod289(vec4 x)\r
{\r
  return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 permute(vec4 x)\r
{\r
  return mod289(((x*34.0)+1.0)*x);\r
}\r
\r
vec4 taylorInvSqrt(vec4 r)\r
{\r
  return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
\r
vec3 fade(vec3 t) {\r
  return t*t*t*(t*(t*6.0-15.0)+10.0);\r
}\r
\r
// Classic Perlin noise, periodic variant\r
float pnoise(vec3 P, vec3 rep)\r
{\r
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\r
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\r
  Pi0 = mod289(Pi0);\r
  Pi1 = mod289(Pi1);\r
  vec3 Pf0 = fract(P); // Fractional part for interpolation\r
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\r
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
  vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
  vec4 iz0 = Pi0.zzzz;\r
  vec4 iz1 = Pi1.zzzz;\r
\r
  vec4 ixy = permute(permute(ix) + iy);\r
  vec4 ixy0 = permute(ixy + iz0);\r
  vec4 ixy1 = permute(ixy + iz1);\r
\r
  vec4 gx0 = ixy0 * (1.0 / 7.0);\r
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
  gx0 = fract(gx0);\r
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
  vec4 sz0 = step(gz0, vec4(0.0));\r
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
\r
  vec4 gx1 = ixy1 * (1.0 / 7.0);\r
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
  gx1 = fract(gx1);\r
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
  vec4 sz1 = step(gz1, vec4(0.0));\r
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
\r
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\r
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\r
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\r
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\r
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\r
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\r
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\r
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\r
\r
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
  g000 *= norm0.x;\r
  g010 *= norm0.y;\r
  g100 *= norm0.z;\r
  g110 *= norm0.w;\r
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
  g001 *= norm1.x;\r
  g011 *= norm1.y;\r
  g101 *= norm1.z;\r
  g111 *= norm1.w;\r
\r
  float n000 = dot(g000, Pf0);\r
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
  float n111 = dot(g111, Pf1);\r
\r
  vec3 fade_xyz = fade(Pf0);\r
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r
  return 2.2 * n_xyz;\r
}\r
\r
\r
//-------- start here ------------\r
\r
varying vec3 vNormal;\r
uniform float uTime;\r
uniform float uSpeed;\r
uniform float uLoop;\r
uniform float uLoopDuration;\r
uniform float uNoiseDensity;\r
uniform float uNoiseStrength;\r
uniform float uFrequency;\r
uniform float uAmplitude;\r
varying vec3 vPos;\r
varying float vDistort;\r
varying vec2 vUv;\r
varying vec3 vViewPosition;\r
\r
#define STANDARD\r
#ifndef FLAT_SHADED\r
  #ifdef USE_TANGENT\r
    varying vec3 vTangent;\r
    varying vec3 vBitangent;\r
  #endif\r
#endif\r
\r
#include <clipping_planes_pars_vertex>\r
#include <color_pars_vertex>\r
#include <common>\r
#include <displacementmap_pars_vertex>\r
#include <fog_pars_vertex>\r
#include <logdepthbuf_pars_vertex>\r
#include <morphtarget_pars_vertex>\r
#include <shadowmap_pars_vertex>\r
#include <skinning_pars_vertex>\r
#include <uv2_pars_vertex>\r
#include <uv_pars_vertex>\r
\r
\r
// rotation\r
mat3 rotation3dY(float angle) {\r
  float s = sin(angle);\r
  float c = cos(angle);\r
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);\r
}\r
\r
vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }\r
\r
void main() {\r
  #include <beginnormal_vertex>\r
  #include <color_vertex>\r
  #include <defaultnormal_vertex>\r
  #include <morphnormal_vertex>\r
  #include <skinbase_vertex>\r
  #include <skinnormal_vertex>\r
  #include <uv2_vertex>\r
  #include <uv_vertex>\r
  #ifndef FLAT_SHADED\r
    vNormal = normalize(transformedNormal);\r
  #ifdef USE_TANGENT\r
    vTangent = normalize(transformedTangent);\r
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);\r
  #endif\r
  #endif\r
  #include <begin_vertex>\r
\r
  //-------- start vertex ------------\r
  float t = uTime * uSpeed;\r
  \r
  // For seamless loops, sample noise using 4D-like circular interpolation\r
  float distortion;\r
  float angle;\r
  \r
  if (uLoop > 0.5) {\r
    // Create truly dynamic seamless loop using 4D noise simulation\r
    float loopProgress = uTime / uLoopDuration;\r
    float loopAngle = loopProgress * 6.28318530718; // 2*PI\r
    \r
    // Radius scales with speed to maintain consistent visual speed\r
    float radius = 5.0 * uSpeed;\r
    \r
    // Sample 4 noise values at cardinal points\r
    vec3 offset0 = vec3(cos(loopAngle) * radius, sin(loopAngle) * radius, 0.0);\r
    vec3 offset1 = vec3(cos(loopAngle + 1.57079632679) * radius, sin(loopAngle + 1.57079632679) * radius, 0.0);\r
    vec3 offset2 = vec3(cos(loopAngle + 3.14159265359) * radius, sin(loopAngle + 3.14159265359) * radius, 0.0);\r
    vec3 offset3 = vec3(cos(loopAngle + 4.71238898038) * radius, sin(loopAngle + 4.71238898038) * radius, 0.0);\r
    \r
    // Get noise at all 4 points\r
    float n0 = pnoise((normal + offset0) * uNoiseDensity, vec3(10.0));\r
    float n1 = pnoise((normal + offset1) * uNoiseDensity, vec3(10.0));\r
    float n2 = pnoise((normal + offset2) * uNoiseDensity, vec3(10.0));\r
    float n3 = pnoise((normal + offset3) * uNoiseDensity, vec3(10.0));\r
    \r
    // Smooth interpolation weights\r
    float w0 = (cos(loopAngle) + 1.0) * 0.5;\r
    float w1 = (cos(loopAngle + 1.57079632679) + 1.0) * 0.5;\r
    float w2 = (cos(loopAngle + 3.14159265359) + 1.0) * 0.5;\r
    float w3 = (cos(loopAngle + 4.71238898038) + 1.0) * 0.5;\r
    \r
    float totalWeight = w0 + w1 + w2 + w3;\r
    w0 /= totalWeight;\r
    w1 /= totalWeight;\r
    w2 /= totalWeight;\r
    w3 /= totalWeight;\r
    \r
    // Blend samples with amplitude boost to match single-sample strength\r
    float blendedNoise = n0 * w0 + n1 * w1 + n2 * w2 + n3 * w3;\r
    distortion = blendedNoise * 1.5 * uNoiseStrength;\r
    \r
    // Apply loop to spiral effect with blended offset\r
    float angleOffset = offset0.x * w0 + offset1.x * w1 + offset2.x * w2 + offset3.x * w3;\r
    angle = sin(uv.y * uFrequency + angleOffset) * uAmplitude;\r
  } else {\r
    // Normal linear time progression\r
    distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;\r
    angle = sin(uv.y * uFrequency + t) * uAmplitude;\r
  }\r
  \r
  vec3 pos = position + (normal * distortion);\r
  pos = rotateY(pos, angle);\r
\r
  vPos = pos;\r
  vDistort = distortion;\r
  vNormal = normal;\r
  vUv = uv;\r
\r
  // route the deformed position through <project_vertex> so gl_Position is\r
  // written exactly once; a second gl_Position write after the chunks breaks\r
  // on some OpenGL drivers (#157)\r
  transformed = pos;\r
\r
  #include <morphtarget_vertex>\r
  #include <skinning_vertex>\r
  #include <displacementmap_vertex>\r
  #include <project_vertex>\r
  #include <logdepthbuf_vertex>\r
  #include <clipping_planes_vertex>\r
\r
  // keep vViewPosition based on the undeformed position so lighting and\r
  // reflections look exactly as before\r
  vViewPosition = -(modelViewMatrix * vec4(position, 1.0)).xyz;\r
\r
  #include <worldpos_vertex>\r
  #include <shadowmap_vertex>\r
  #include <fog_vertex>\r
}\r
`;var Rh={};wp(Rh,{fragment:()=>dp,vertex:()=>fp});var dp=`// Cosmic Sphere Fragment Shader - Nebula Particle Effect\r
\r
#define STANDARD\r
#ifdef PHYSICAL\r
#define REFLECTIVITY\r
#define CLEARCOAT\r
#define TRANSMISSION\r
#endif\r
\r
uniform vec3 diffuse;\r
uniform vec3 emissive;\r
uniform float roughness;\r
uniform float metalness;\r
uniform float opacity;\r
\r
#ifdef TRANSMISSION\r
uniform float transmission;\r
#endif\r
#ifdef REFLECTIVITY\r
uniform float reflectivity;\r
#endif\r
#ifdef CLEARCOAT\r
uniform float clearcoat;\r
uniform float clearcoatRoughness;\r
#endif\r
#ifdef USE_SHEEN\r
uniform vec3 sheen;\r
#endif\r
varying vec3 vViewPosition;\r
#ifndef FLAT_SHADED\r
#ifdef USE_TANGENT\r
varying vec3 vTangent;\r
varying vec3 vBitangent;\r
#endif\r
#endif\r
#include <alphamap_pars_fragment>\r
#include <aomap_pars_fragment>\r
#include <color_pars_fragment>\r
#include <common>\r
#include <dithering_pars_fragment>\r
#include <emissivemap_pars_fragment>\r
#include <lightmap_pars_fragment>\r
#include <map_pars_fragment>\r
#include <packing>\r
#include <uv2_pars_fragment>\r
#include <uv_pars_fragment>\r
#include <bsdfs>\r
#include <bumpmap_pars_fragment>\r
#include <clearcoat_pars_fragment>\r
#include <clipping_planes_pars_fragment>\r
#include <cube_uv_reflection_fragment>\r
#include <envmap_common_pars_fragment>\r
#include <envmap_physical_pars_fragment>\r
#include <fog_pars_fragment>\r
#include <lights_pars_begin>\r
#include <lights_physical_pars_fragment>\r
#include <logdepthbuf_pars_fragment>\r
#include <metalnessmap_pars_fragment>\r
#include <normalmap_pars_fragment>\r
#include <roughnessmap_pars_fragment>\r
#include <shadowmap_pars_fragment>\r
\r
varying vec3 vNormal;\r
varying float displacement;\r
varying vec3 vPos;\r
varying float vDistort;\r
varying vec2 vUv;\r
varying float vNebulaIntensity;\r
varying float vParticleDensity;\r
varying vec3 vCosmicSwirl;\r
\r
uniform float uTime;\r
uniform float uSpeed;\r
\r
uniform float uC1r;\r
uniform float uC1g;\r
uniform float uC1b;\r
uniform float uC2r;\r
uniform float uC2g;\r
uniform float uC2b;\r
uniform float uC3r;\r
uniform float uC3g;\r
uniform float uC3b;\r
\r
// Nebula helper functions\r
float hash(vec2 p) {\r
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\r
}\r
\r
float noise2D(vec2 p) {\r
    vec2 i = floor(p);\r
    vec2 f = fract(p);\r
    vec2 u = f * f * (3.0 - 2.0 * f);\r
    \r
    return mix(mix(hash(i + vec2(0.0, 0.0)), \r
                   hash(i + vec2(1.0, 0.0)), u.x),\r
               mix(hash(i + vec2(0.0, 1.0)), \r
                   hash(i + vec2(1.0, 1.0)), u.x), u.y);\r
}\r
\r
// Fractal Brownian Motion for complex nebula patterns\r
float fbm(vec2 p) {\r
    float value = 0.0;\r
    float amplitude = 0.5;\r
    float frequency = 1.0;\r
    \r
    for(int i = 0; i < 5; i++) {\r
        value += amplitude * noise2D(p * frequency);\r
        amplitude *= 0.5;\r
        frequency *= 2.0;\r
    }\r
    return value;\r
}\r
\r
// Star field generation\r
float stars(vec2 p, float density) {\r
    vec2 n = floor(p * density);\r
    vec2 f = fract(p * density);\r
    \r
    float d = 1.0;\r
    for(int i = -1; i <= 1; i++) {\r
        for(int j = -1; j <= 1; j++) {\r
            vec2 g = vec2(float(i), float(j));\r
            vec2 o = hash(n + g) * vec2(1.0);\r
            vec2 r = g + o - f;\r
            d = min(d, dot(r, r));\r
        }\r
    }\r
    \r
    return 1.0 - smoothstep(0.0, 0.02, sqrt(d));\r
}\r
\r
// for npm package, need to add this manually\r
float linearToRelativeLuminance2( const in vec3 color ) {\r
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\r
    return dot( weights, color.rgb );\r
}\r
\r
void main() {\r
\r
  //-------- Cosmic Nebula Gradient ------------\r
  vec3 color1 = vec3(uC1r, uC1g, uC1b);\r
  vec3 color2 = vec3(uC2r, uC2g, uC2b);\r
  vec3 color3 = vec3(uC3r, uC3g, uC3b);\r
  \r
  float clearcoat = 1.0;\r
  float clearcoatRoughness = 0.1; // Very reflective for cosmic shine\r
\r
  #include <clipping_planes_fragment>\r
\r
  float t = uTime * uSpeed;\r
  \r
  // Calculate distance from center for radial effects\r
  float distanceFromCenter = length(vPos);\r
  float angle = atan(vPos.y, vPos.x);\r
  \r
  // Create complex nebula patterns using FBM\r
  vec2 nebulaCoords = vPos.xy * 3.0 + vCosmicSwirl.xy;\r
  float nebulaPattern1 = fbm(nebulaCoords + t * 0.1);\r
  float nebulaPattern2 = fbm(nebulaCoords * 2.0 + t * 0.15);\r
  float nebulaPattern3 = fbm(nebulaCoords * 4.0 + t * 0.2);\r
  \r
  // Combine nebula patterns\r
  float combinedNebula = (nebulaPattern1 + nebulaPattern2 * 0.5 + nebulaPattern3 * 0.25) / 1.75;\r
  \r
  // Create particle-like bright spots\r
  float particleField = stars(vPos.xy * 20.0 + t * 0.5, 50.0);\r
  float microParticles = stars(vPos.xy * 80.0 + t * 1.0, 200.0) * 0.5;\r
  \r
  // Create cosmic dust clouds\r
  float dustClouds = fbm(vPos.xy * 8.0 + t * 0.05) * 0.3;\r
  \r
  // Energy streams\r
  float energyStream1 = sin(vPos.x * 15.0 + t * 3.0 + angle * 2.0) * 0.1;\r
  float energyStream2 = cos(vPos.y * 20.0 + t * 2.5 + distanceFromCenter * 5.0) * 0.1;\r
  \r
  // Cosmic gradient mixing with nebula influence\r
  float gradientX = smoothstep(-3.0, 3.0, vPos.x + combinedNebula * 2.0 + vCosmicSwirl.x * 3.0);\r
  float gradientY = smoothstep(-3.0, 3.0, vPos.y + vNebulaIntensity * 1.5 + vCosmicSwirl.y * 2.0);\r
  float gradientZ = smoothstep(-2.0, 2.0, vPos.z + dustClouds * 2.0);\r
  \r
  // Multi-layer color mixing\r
  vec3 baseGradient = mix(\r
    mix(color1, color2, gradientX), \r
    color3, \r
    gradientY * 0.6 + gradientZ * 0.4\r
  );\r
  \r
  // Add nebula color variations\r
  vec3 nebulaColor = baseGradient;\r
  nebulaColor.r += combinedNebula * 0.3 + energyStream1;\r
  nebulaColor.g += vNebulaIntensity * 0.2 + energyStream2;\r
  nebulaColor.b += dustClouds * 0.4 + abs(vCosmicSwirl.z) * 0.5;\r
  \r
  // Add particle brightness\r
  vec3 particleGlow = vec3(\r
    particleField * 0.8 + microParticles * 0.4,\r
    particleField * 0.6 + microParticles * 0.3,\r
    particleField * 0.9 + microParticles * 0.5\r
  );\r
  \r
  // Create pulsing cosmic energy\r
  float cosmicPulse = sin(t * 1.5 + distanceFromCenter * 3.0) * 0.1 + 1.0;\r
  \r
  // Combine all effects\r
  vec3 finalColor = (nebulaColor + particleGlow * 2.0) * cosmicPulse;\r
  \r
  // Add cosmic rim lighting effect\r
  float rimLight = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.0);\r
  finalColor += rimLight * 0.3 * (color1 + color2 + color3) / 3.0;\r
  \r
  // Enhance particle density areas\r
  finalColor = mix(finalColor, finalColor * 1.5, vParticleDensity * 0.5);\r
  \r
  // Add subtle color temperature variation\r
  float temperature = sin(angle * 3.0 + t * 0.8) * 0.1;\r
  finalColor.r += temperature * 0.1;\r
  finalColor.b -= temperature * 0.1;\r
\r
  vec4 diffuseColor = vec4(finalColor, 1.0);\r
\r
  //-------- Enhanced Materiality for Cosmic Effect ------------\r
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));\r
  vec3 totalEmissiveRadiance = emissive + finalColor * 0.2; // Strong emission for nebula glow\r
\r
  #ifdef TRANSMISSION\r
    float totalTransmission = transmission;\r
  #endif\r
  #include <logdepthbuf_fragment>\r
  #include <map_fragment>\r
  #include <color_fragment>\r
  #include <alphamap_fragment>\r
  #include <alphatest_fragment>\r
  #include <roughnessmap_fragment>\r
  #include <metalnessmap_fragment>\r
  #include <normal_fragment_begin>\r
  #include <normal_fragment_maps>\r
  #include <clearcoat_normal_fragment_begin>\r
  #include <clearcoat_normal_fragment_maps>\r
  #include <emissivemap_fragment>\r
  #include <lights_physical_fragment>\r
  #include <lights_fragment_begin>\r
  #include <lights_fragment_maps>\r
  #include <lights_fragment_end>\r
  #include <aomap_fragment>\r
  \r
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +\r
                      reflectedLight.directSpecular + reflectedLight.indirectSpecular +\r
                      totalEmissiveRadiance;\r
\r
  #ifdef TRANSMISSION\r
    diffuseColor.a *= mix(saturate(1. - totalTransmission +\r
                        linearToRelativeLuminance2(reflectedLight.directSpecular +\r
                                                  reflectedLight.indirectSpecular)),\r
                1.0, metalness);\r
  #endif\r
\r
  #include <tonemapping_fragment>\r
  #include <encodings_fragment>\r
  #include <fog_fragment>\r
  #include <premultiplied_alpha_fragment>\r
  #include <dithering_fragment>\r
\r
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);\r
}\r
`;var fp=`// Cosmic Sphere Vertex Shader - Nebula Effect\r
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) \r
\r
// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl\r
\r
vec3 mod289(vec3 x)\r
{\r
  return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 mod289(vec4 x)\r
{\r
  return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 permute(vec4 x)\r
{\r
  return mod289(((x*34.0)+1.0)*x);\r
}\r
\r
vec4 taylorInvSqrt(vec4 r)\r
{\r
  return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
\r
vec3 fade(vec3 t) {\r
  return t*t*t*(t*(t*6.0-15.0)+10.0);\r
}\r
\r
float cnoise(vec3 P)\r
{\r
  vec3 Pi0 = floor(P); // Integer part for indexing\r
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\r
  Pi0 = mod289(Pi0);\r
  Pi1 = mod289(Pi1);\r
  vec3 Pf0 = fract(P); // Fractional part for interpolation\r
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\r
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
  vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
  vec4 iz0 = Pi0.zzzz;\r
  vec4 iz1 = Pi1.zzzz;\r
\r
  vec4 ixy = permute(permute(ix) + iy);\r
  vec4 ixy0 = permute(ixy + iz0);\r
  vec4 ixy1 = permute(ixy + iz1);\r
\r
  vec4 gx0 = ixy0 * (1.0 / 7.0);\r
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r
  gx0 = fract(gx0);\r
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
  vec4 sz0 = step(gz0, vec4(0.0));\r
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r
\r
  vec4 gx1 = ixy1 * (1.0 / 7.0);\r
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r
  gx1 = fract(gx1);\r
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
  vec4 sz1 = step(gz1, vec4(0.0));\r
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r
\r
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\r
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\r
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\r
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\r
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\r
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\r
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\r
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\r
\r
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
  g000 *= norm0.x;\r
  g010 *= norm0.y;\r
  g100 *= norm0.z;\r
  g110 *= norm0.w;\r
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
  g001 *= norm1.x;\r
  g011 *= norm1.y;\r
  g101 *= norm1.z;\r
  g111 *= norm1.w;\r
\r
  float n000 = dot(g000, Pf0);\r
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
  float n111 = dot(g111, Pf1);\r
\r
  vec3 fade_xyz = fade(Pf0);\r
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \r
  return 2.2 * n_xyz;\r
}\r
\r
//-------- Nebula Effect Functions ------------\r
\r
mat3 rotation3dY(float angle) {\r
  float s = sin(angle);\r
  float c = cos(angle);\r
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);\r
}\r
\r
mat3 rotation3dX(float angle) {\r
  float s = sin(angle);\r
  float c = cos(angle);\r
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);\r
}\r
\r
mat3 rotation3dZ(float angle) {\r
  float s = sin(angle);\r
  float c = cos(angle);\r
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);\r
}\r
\r
vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }\r
vec3 rotateX(vec3 v, float angle) { return rotation3dX(angle) * v; }\r
vec3 rotateZ(vec3 v, float angle) { return rotation3dZ(angle) * v; }\r
\r
varying vec3 vNormal;\r
varying float displacement;\r
varying vec3 vPos;\r
varying float vDistort;\r
varying vec2 vUv;\r
varying float vNebulaIntensity;\r
varying float vParticleDensity;\r
varying vec3 vCosmicSwirl;\r
\r
uniform float uTime;\r
uniform float uSpeed;\r
uniform float uLoadingTime;\r
uniform float uNoiseDensity;\r
uniform float uNoiseStrength;\r
\r
#define STANDARD\r
varying vec3 vViewPosition;\r
#ifndef FLAT_SHADED\r
#ifdef USE_TANGENT\r
varying vec3 vTangent;\r
varying vec3 vBitangent;\r
#endif\r
#endif\r
#include <clipping_planes_pars_vertex>\r
#include <color_pars_vertex>\r
#include <common>\r
#include <displacementmap_pars_vertex>\r
#include <fog_pars_vertex>\r
#include <logdepthbuf_pars_vertex>\r
#include <morphtarget_pars_vertex>\r
#include <shadowmap_pars_vertex>\r
#include <skinning_pars_vertex>\r
#include <uv2_pars_vertex>\r
#include <uv_pars_vertex>\r
\r
void main() {\r
\r
  #include <beginnormal_vertex>\r
  #include <color_vertex>\r
  #include <defaultnormal_vertex>\r
  #include <morphnormal_vertex>\r
  #include <skinbase_vertex>\r
  #include <skinnormal_vertex>\r
  #include <uv2_vertex>\r
  #include <uv_vertex>\r
  #ifndef FLAT_SHADED\r
    vNormal = normalize(transformedNormal);\r
  #ifdef USE_TANGENT\r
    vTangent = normalize(transformedTangent);\r
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);\r
  #endif\r
  #endif\r
  #include <begin_vertex>\r
\r
  //-------- Cosmic Nebula Effect ------------\r
  vUv = uv;\r
  \r
  float t = uTime * uSpeed;\r
  \r
  // Create swirling nebula patterns\r
  vec3 swirlCenter = vec3(0.0, 0.0, 0.0);\r
  vec3 toCenter = position - swirlCenter;\r
  float distanceFromCenter = length(toCenter);\r
  \r
  // Create spiral motion\r
  float angle = atan(toCenter.y, toCenter.x);\r
  float spiralAngle = angle + distanceFromCenter * 2.0 + t * 0.5;\r
  \r
  // Multi-octave noise for nebula density\r
  float nebula1 = cnoise(position * uNoiseDensity * 0.8 + vec3(t * 0.2, t * 0.3, t * 0.1));\r
  float nebula2 = cnoise(position * uNoiseDensity * 1.5 + vec3(t * 0.4, t * 0.2, t * 0.5)) * 0.7;\r
  float nebula3 = cnoise(position * uNoiseDensity * 3.0 + vec3(t * 0.8, t * 0.6, t * 0.9)) * 0.4;\r
  float nebula4 = cnoise(position * uNoiseDensity * 6.0 + vec3(t * 1.2, t * 1.0, t * 1.4)) * 0.2;\r
  \r
  // Combine nebula layers for complexity\r
  float nebulaPattern = nebula1 + nebula2 + nebula3 + nebula4;\r
  vNebulaIntensity = abs(nebulaPattern);\r
  \r
  // Create particle-like density variations\r
  float particleDensity = cnoise(position * uNoiseDensity * 8.0 + vec3(t * 2.0, t * 1.5, t * 2.5));\r
  vParticleDensity = smoothstep(-0.3, 0.8, particleDensity);\r
  \r
  // Create cosmic swirl effect\r
  vec3 swirl = vec3(\r
    sin(spiralAngle + t * 0.3) * distanceFromCenter * 0.1,\r
    cos(spiralAngle + t * 0.2) * distanceFromCenter * 0.1,\r
    sin(distanceFromCenter * 3.0 + t * 0.4) * 0.05\r
  );\r
  vCosmicSwirl = swirl;\r
  \r
  // Create pulsing effect for cosmic energy\r
  float pulse = sin(t * 2.0 + distanceFromCenter * 5.0) * 0.1 + 1.0;\r
  \r
  // Apply complex displacement\r
  float totalDisplacement = nebulaPattern * uNoiseStrength * uLoadingTime * pulse;\r
  \r
  // Add swirl displacement\r
  vec3 pos = position + normal * totalDisplacement + swirl * 0.3;\r
  vPos = pos;\r
  \r
  // Add cosmic rotation for dynamic feel\r
  pos = rotateY(pos, sin(t * 0.1 + distanceFromCenter) * 0.1);\r
  pos = rotateX(pos, cos(t * 0.08 + angle) * 0.08);\r
  pos = rotateZ(pos, sin(t * 0.05 + spiralAngle) * 0.05);\r
\r
  // route the deformed position through <project_vertex> so gl_Position is\r
  // written exactly once; a second gl_Position write after the chunks breaks\r
  // on some OpenGL drivers (#157)\r
  transformed = pos;\r
\r
  #include <morphtarget_vertex>\r
  #include <skinning_vertex>\r
  #include <displacementmap_vertex>\r
  #include <project_vertex>\r
  #include <logdepthbuf_vertex>\r
  #include <clipping_planes_vertex>\r
\r
  // keep vViewPosition based on the undeformed position so lighting and\r
  // reflections look exactly as before\r
  vViewPosition = -(modelViewMatrix * vec4(position, 1.0)).xyz;\r
\r
  #include <worldpos_vertex>\r
  #include <shadowmap_vertex>\r
  #include <fog_vertex>\r
}\r
`;var pp={nightyNight:"Nighty night",universe:"Universe",pensive:"Pensive",violaOrientalis:"Viola",sunset:"Sunset",interstella:"Interstella",off:"Off"},Jl=class{constructor(e,t,n,s){for(let o of["uv2_pars_vertex","uv2_vertex","uv2_pars_fragment","encodings_fragment"])et[o]="";this.time=0,this.preset=null,this.shell=new vt(t),this.shell.scale.setScalar(4e4),this.shell.name="ShaderGradient 3D surround",this.shell.renderOrder=-1e3,this.shell.frustumCulled=!1,e.add(this.shell),this.light=new yo(16777215,Math.PI),e.add(this.light);let r=new Tt;r.setAttribute("position",new yt(n,3)),this.stars=new Kn(r,new bi({color:13097727,size:80,sizeAttenuation:!0,map:s,transparent:!0,depthWrite:!1,alphaTest:.015,toneMapped:!1})),this.stars.name="Blender world-space surrounding stars",this.stars.frustumCulled=!1,e.add(this.stars)}configure(e){let t=e.background,n=t!=="off";if(this.shell.visible=n,this.stars.visible=n&&e.surroundStars,!n||t===this.preset&&e.environmentDesign===this.design)return;let s=Fr[t].props,r=s.type==="sphere",o={colors:[s.color1,s.color2,s.color3],uTime:s.uTime||0,uSpeed:s.uSpeed,uLoadingTime:1,uNoiseDensity:s.uDensity,uNoiseStrength:r?s.uStrength:Fr.sunset.props.uStrength,uFrequency:r?s.uFrequency:Fr.sunset.props.uFrequency,uAmplitude:r?s.uAmplitude:Fr.sunset.props.uAmplitude,uIntensity:.5,uLoop:0,uLoopDuration:5},a=e.environmentDesign==="cosmic"?Rh:{vertex:Ah,fragment:wh},l=hp(o,a.vertex,a.fragment),c=this.shell.material;this.shell.material=new l,this.shell.material.side=en,this.shell.material.depthWrite=!1,this.shell.material.roughness=1-s.reflection,this.light.intensity=s.brightness*Math.PI,this.shell.rotation.set(s.rotationX*Math.PI/180,s.rotationY*Math.PI/180,s.rotationZ*Math.PI/180),c?.dispose(),this.preset=t,this.design=e.environmentDesign,this.baseTime=s.uTime||0}update(e,t,n){return t.background==="off"?!1:(n&&t.shaderSpeed>0&&(this.time+=e*t.shaderSpeed),this.shell.material.userData.uTime.value=this.baseTime+this.time,n&&t.shaderSpeed>0)}};var Ch={horizon:"Event horizon",planetary:"Planetary surface",...pp},uy=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,mp=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+19.7;a*=.5;}return v;}`,hy=`uniform float uTime;uniform float uKind;varying vec2 vUv;${mp}
void main(){
 // Blender's glTF exporter flips the texture V axis.
 float u=vUv.x,r=1.-vUv.y,angle=u*6.2831853;
 float flow=u-uTime*.035/(.3+r);
 float cloud=fbm(vec2(flow*42.,r*17.));
 float warp=r+.026*(fbm(vec2(flow*17.,r*6.))-.5);
 float thread=pow(.5+.5*sin(warp*690.+cloud*12.),8.);
 float heat=exp(-r*5.5);
 float alpha=smoothstep(0.,.009,r)*(1.-smoothstep(.68,1.,r))*heat*(thread*.8+pow(cloud,3.)*.7);
 float energy=.35+thread*1.7+cloud*.65;
 vec3 colour=mix(vec3(1.7,.38,.045),vec3(5.0,3.5,1.8),pow(heat,2.));
 if(uKind>.5&&uKind<1.5){
   float arc=smoothstep(-.18,.08,sin(angle));
   heat=exp(-r*5.);
   float asymmetry=.42+.58*pow(.5+.5*cos(angle-.6),2.);
   alpha=smoothstep(0.,.008,r)*(1.-smoothstep(.60,1.,r))*heat*(.22+thread*.75+cloud*.5)*arc;
   energy=(.4+thread*1.6+cloud*.65)*asymmetry;
   colour=mix(vec3(1.7,.43,.07),vec3(6.5,4.7,2.8),pow(heat,2.));
 }
 if(uKind>1.5){
   float across=abs(r*2.-1.);
   float wave=r+.014*sin(u*17.+cloud*5.)+.02*(cloud-.5);
   thread=pow(.5+.5*sin(wave*940.+cloud*8.+u*16.),9.);
   heat=exp(-across*8.5);
   float core=exp(-across*48.);
   alpha=heat*(thread*.7+pow(cloud,3.)*.5)+core*.3;
   alpha*=pow(max(0.,1.-abs(u*2.-1.)),.25);
   // Quiet the central stream where foreground records cross its light.
   float foregroundClarity=mix(.20,1.,smoothstep(.06,.20,abs(u-.5)));
   energy=(.25+thread*.75+core*.7)*foregroundClarity;
   colour=mix(vec3(2.1,.48,.06),vec3(3.8,2.8,1.9),pow(heat,2.));
 }
 gl_FragColor=vec4(colour*energy,clamp(alpha,0.,1.));
}`,dy=`uniform float uTime;uniform float uTerrain;varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;${mp}
void main(){
 float grain=fbm(vLocal.xz*27.);
 float micro=fbm(vLocal.xz*105.);
 float chips=noise(vLocal.xz*430.+micro*2.3);
 float shade=.10+.90*max(0.,dot(normalize(vNormal),normalize(vec3(-.25,.32,-.85))));
 vec3 stone=mix(vec3(.003,.008,.017),vec3(.047,.084,.11),smoothstep(.24,.76,grain))*(shade*.84+micro*.16);
 stone*=.66+.55*smoothstep(.24,.74,micro)+.14*chips;
 stone+=vec3(.009,.017,.026)*pow(chips,5.);
 float cracks=pow(max(0.,1.-abs(fbm(vLocal.xz*7.)-.53)*45.),9.);
 float pockets=smoothstep(.59,.74,fbm(vLocal.xz*2.8+6.2));
 vec3 ember=vec3(1.6,.39,.035)*cracks*pockets*(.7+.3*sin(uTime*.3+grain*15.));
 float edge=1.;
 if(uTerrain>.5){
   float irregular=(fbm(vLocal.xz*1.7)-.5)*.035;
   float across=min(vUv.x,1.-vUv.x)+irregular;
   float along=min(vUv.y,1.-vUv.y)+irregular;
   edge=smoothstep(.025,.16,across)*smoothstep(.025,.19,along);
   // Dissolve the lowered outer ground into space in the rear-facing view.
   edge*=1.-smoothstep(2.75,4.15,vLocal.z);
 }
 if(edge<.001)discard;
 float opacity=uTerrain>.5?.58:1.;
 gl_FragColor=vec4(stone+ember/opacity,edge*opacity);
}`,Ql=class extends Jl{constructor(e,t,n,s,r,o,a){super(e,t,n,s),this.horizon=r.scene,this.horizon.name="Blender accretion and sculpted horizon \u2014 world space",this.horizon.position.set(0,-850,-14500),this.horizon.scale.setScalar(7600);for(let m of["HorizonTerrain","HorizonBoulders","HorizonEmbers"]){let y=this.horizon.getObjectByName(m);y.removeFromParent(),y.geometry.dispose(),Array.isArray(y.material)?y.material.forEach(g=>g.dispose()):y.material.dispose()}this.horizon.add(a.ground.scene),this.planetaryGround=a.ground.scene,this.horizon.add(a.optics.scene),this.materials=[],this.horizon.traverse(m=>{if(m.isMesh){if(m.name==="PhotonSphere"&&a.optics.spec.photon.enabled===!1){m.visible=!1;return}if(m.name==="AccretionDisk"||m.name==="LensedStream"){m.visible=!1;return}if(m.frustumCulled=!1,Array.isArray(m.material)?m.material.forEach(y=>y.dispose()):m.material.dispose(),m.name==="EventHorizon")m.material=new qt({color:0,toneMapped:!1});else if(m.name==="HorizonEmbers")m.material=new qt({color:new we(4,1.45,.16),toneMapped:!1});else if(m.name==="PhotonSphere"||m.name==="LensingHaloDetail")m.material=Jf(m.name,a.optics),m.renderOrder=m.name==="PhotonSphere"?-30:-25,this.materials.push(m.material);else{let y=m.name==="HorizonTerrain"||m.name==="HorizonBoulders",g=m.name==="HorizonTerrain";m.material=new rt({vertexShader:m.name==="LensedCorona"?yh:uy,fragmentShader:y?dy:hy,uniforms:{uTime:{value:0},uTerrain:{value:g?1:0},uKind:{value:m.name==="LensedCorona"?1:m.name==="LensedStream"?2:0}},side:Ht,transparent:!y||g,blending:y?kn:cn,depthWrite:y&&!g,depthTest:!0,toneMapped:!1}),g&&(m.renderOrder=-40),this.materials.push(m.material)}}}),this.spaceLayer=new an,this.legacyCorona=[this.horizon.getObjectByName("LensedCorona"),a.optics.scene],this.continuousCorona=op(a.corona,{sharedField:!0,singlePass:!0}),this.continuousCorona.traverse(m=>{m.isMesh&&(m.frustumCulled=!1,m.renderOrder=-25,this.materials.push(m.material))}),this.horizon.add(this.continuousCorona),this.horizonFlares=up(a.corona.spec),this.horizonFlares.traverse(m=>{m.isMesh&&this.materials.push(m.material)}),this.horizon.add(this.horizonFlares),this.spaceLayer.name="Native Blender ring haze and sparse space depth",this.horizon.add(this.spaceLayer),this.nativeVolumes=[],this.diskExtent=a.corona.spec.diskRadialStretch;for(let m of a.volumes){let y=Mh(m);this.nativeVolumes.push({mesh:y,id:m.spec.id,emission:y.material.uniforms.uEmission.value}),(m.spec.id==="haze"?this.spaceLayer:this.horizon).add(y),this.materials.push(y.material)}this.outerAura=Mh(a.volumes.find(m=>m.spec.id==="disk")),this.outerAura.name="Dark transparent outer aura \u2014 full front and back annulus";let l=this.outerAura.material.uniforms;l.uOuterAura.value=1,l.uDensityScale.value*=.6,l.uEmission.value*=.65,l.uHeatBias.value=.03,Sh(this.outerAura,a.corona.spec.outerAura.radialStretch),this.horizon.add(this.outerAura),this.materials.push(this.outerAura.material);let c=a.particles,u=new Tt;u.setAttribute("position",new yt(c.positions,3)),u.setAttribute("aColour",new yt(c.colours,3)),u.setAttribute("aSize",new yt(c.sizes,1)),u.setAttribute("aFamily",new yt(c.families,1));let d=new rt({vertexShader:`attribute vec3 aColour;attribute float aSize;attribute float aFamily;
       uniform float uTime;varying vec3 vColour;varying float vAlpha;
       void main(){vec3 point=position;
         if(aFamily<.5){float angle=uTime*.006/max(length(point.xz),1.);
           float c=cos(angle),s=sin(angle);point.xz=mat2(c,-s,s,c)*point.xz;}
         vec4 p=modelViewMatrix*vec4(point,1.);
         gl_PointSize=clamp(22000./length(p.xyz),.65,1.65)*aSize;
         gl_Position=projectionMatrix*p;vColour=aColour;vAlpha=aFamily<.5?.48:.72;
       }`,fragmentShader:`varying vec3 vColour;varying float vAlpha;
       void main(){float r=length(gl_PointCoord-.5);float a=exp(-r*r*20.)*(1.-smoothstep(.35,.5,r));
       gl_FragColor=vec4(vColour,a*vAlpha);}`,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1,blending:cn});this.spaceParticles=new Kn(u,d),this.spaceParticles.name="Blender-authored ring dust and depth stars",this.spaceParticles.renderOrder=-35,this.spaceLayer.add(this.spaceParticles),this.materials.push(d),this.materials=[...new Set(this.materials)],e.add(this.horizon);let h=new Tt;h.setAttribute("position",new yt(o.positions,3));let f=new rt({vertexShader:"void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(55000./length(p.xyz),.7,1.8);gl_Position=projectionMatrix*p;}",fragmentShader:"void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*22.)*(1.-smoothstep(.40,.5,d));gl_FragColor=vec4(.73,.83,1.,a*.85);}",transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1});this.horizonStars=new Kn(h,f),this.horizonStars.renderOrder=-60,this.horizonStars.name="Blender-generated deep space stars",e.add(this.horizonStars)}configure(e){let t=e.background==="horizon"||e.background==="planetary";this.horizon.visible=t,this.horizonStars.visible=t&&e.surroundStars,this.planetaryGround.visible=e.background==="planetary";let n=e.background==="horizon";this.continuousCorona.visible=n,this.horizonFlares.visible=n,this.outerAura.visible=!1,this.legacyCorona.forEach(s=>s.visible=!n),this.horizon.rotation.set(n?.2:0,0,n?.25:0),this.horizon.scale.setScalar(n?6500:7600),this.horizon.position.y=n?250:-850;for(let{mesh:s,id:r,emission:o}of this.nativeVolumes){s.visible=!n;let a=r==="disk"||r==="stream";Sh(s,n&&a?this.diskExtent:1),s.material.uniforms.uHeatBias.value=n&&a?.15:0,s.material.uniforms.uUnifiedGlow.value=n&&a?1:0,s.material.uniforms.uEmission.value=o*(n&&a?1.25:1)}if(this.spaceLayer.visible=e.background==="horizon",this.spaceParticles.visible=e.surroundStars,t){this.shell.visible=!1,this.stars.visible=!1,this.light.intensity=Math.PI;return}super.configure(e)}prepareRender(e,t){this.fieldCacheActive=this.horizon.visible&&this.continuousCorona.visible?this.continuousCorona.userData.fieldCache.prepare(e,t):!1}update(e,t,n){return t.background!=="horizon"&&t.background!=="planetary"?super.update(e,t,n):(n&&t.shaderSpeed>0&&(this.time+=e*t.shaderSpeed),this.materials.forEach(s=>s.uniforms.uTime.value=this.time),n&&t.shaderSpeed>0)}};var Tn=i=>document.getElementById(i),wt=(i,e={},t)=>{let n=document.createElement(i);return Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),t!==void 0&&(n.textContent=t),n};function gp(i,e){document.body.classList.add("second-brain");let t=new URLSearchParams(location.search).get("embed")==="open-method";document.body.classList.toggle("open-method-embed",t);let n=new Set(ci.map(C=>C.id)),s=document.querySelector("aside");s.id="memory-inspector",s.hidden=!0,s.querySelector("h1").textContent="Inspector";let r=wt("button",{type:"button",id:"close-inspector"},"Close");s.prepend(r),r.onclick=()=>{s.hidden=!0,Tn("inspector-toggle").setAttribute("aria-expanded","false"),Tn("inspector-toggle").focus()};let o=wt("details",{class:"settings-details"});o.append(wt("summary",{},"Snapshot and connection"));for(let C of["memory-inventory","connection-panel","graph-counts","motion-status","collision-status"])o.append(Tn(C));s.append(o);let a=wt("header",{id:"universe-header"}),l=wt("h1",{},"2nd Brain");a.append(l,Tn("view-controls"));let c=wt("button",{type:"button",id:"inspector-toggle","aria-expanded":"false","aria-controls":"memory-inspector"},"Inspector");t&&(c.textContent="Details"),c.onclick=()=>{s.hidden=!s.hidden,c.setAttribute("aria-expanded",String(!s.hidden))},a.append(c),document.body.prepend(a);let u=wt("button",{type:"button",id:"open-method-tools-toggle","aria-label":"Show constellation controls","aria-expanded":"false","aria-controls":"universe-header source-panel"},"\u2022\u2022\u2022"),d=C=>{document.body.classList.toggle("open-method-tools-open",C),u.setAttribute("aria-expanded",String(C)),u.setAttribute("aria-label",(C?"Hide":"Show")+" constellation controls"),C||(s.hidden=!0,c.setAttribute("aria-expanded","false")),e.refresh()};u.onclick=()=>d(!document.body.classList.contains("open-method-tools-open")),document.body.append(u),document.addEventListener("keydown",C=>{t&&C.key==="Escape"&&document.body.classList.contains("open-method-tools-open")&&(d(!1),u.focus(),C.preventDefault())});let h=wt("div",{id:"source-panel","aria-label":"Sources and scene controls"});h.append(wt("h2",{},"Demonstration universe"),wt("p",{class:"source-intro"},"Invented records and connections for exploring the viewer."));let f=wt("p",{id:"source-totals","aria-live":"polite"});h.append(f);let m=wt("details",{id:"source-search"});m.append(wt("summary",{},"Find a record"),document.querySelector('section[aria-label="Find nodes"]')),h.append(m);let y=wt("fieldset",{id:"source-toggles"});y.append(wt("legend",{},"Sources"));for(let C of ci){let M=i.nodes.filter(G=>Nt(G)===C.id).length,B=wt("label",{class:"source-row"}),V=wt("input",{type:"checkbox",value:C.id,checked:"","aria-label":C.name});V.style.accentColor=C.colour,B.append(V,wt("span",{},C.name),wt("span",{class:"source-count"},M.toLocaleString("en-AU"))),V.onchange=()=>{V.checked?n.add(C.id):n.delete(C.id),e.refresh()},y.append(B)}h.append(y);let g=wt("details",{id:"source-scene"});g.append(wt("summary",{},"Scene and layout"));for(let[C,M]of[["background-preset","Background"],["layout-preset","Arrangement"]]){let B=Tn(C).cloneNode(!0);B.id=C+"-quick",g.append(wt("label",{for:B.id},M),B),B.onchange=()=>{Tn(C).value=B.value,Tn(C).dispatchEvent(new Event("change"))}}let p=wt("p",{class:"source-footnote"},"Links hidden. Select a node to inspect its source and connections.");h.append(g,p),document.body.append(h);let S=wt("div",{id:"source-captions"});Tn("graph-stage").append(S);let I=new Map(ci.map(C=>{let M=wt("button",{type:"button",class:"source-caption","aria-label":"Drag "+C.name+" group"},C.name);return M.style.setProperty("--source-colour",C.colour),M.addEventListener("pointerdown",B=>e.startGroupDrag?.(C.id,B,M)),S.append(M),[C.id,M]})),b=new Map(Zf(i.nodes).map(C=>{let M=i.nodes.find(V=>V.id===C),B=wt("span",{class:"record-caption",title:M.label},M.label);return S.append(B),[C,B]})),T=wt("div",{id:"source-empty",hidden:"",role:"status"});T.append(wt("h2",{},"No records shown"),wt("p",{},"Choose a source or reset the filters."));let E=wt("button",{type:"button"},"Show all sources");T.append(E),Tn("graph-stage").append(T),E.onclick=()=>{ci.forEach(C=>n.add(C.id)),y.querySelectorAll("input").forEach(C=>C.checked=!0),Tn("record-scope").value="all",Tn("record-scope").dispatchEvent(new Event("change")),e.refresh()};let R=new D,_,A,N;return{visible:C=>n.has(Nt(C)),selected(C){C&&(n.has(Nt(C))||(n.add(Nt(C)),y.querySelector('input[value="'+Nt(C)+'"]').checked=!0,e.refresh()),(!t||document.body.classList.contains("open-method-tools-open"))&&(s.hidden=!1,c.setAttribute("aria-expanded","true")))},syncSettings(C){Tn("background-preset-quick").value=C.background,Tn("layout-preset-quick").value=C.layout;let M={off:"Links hidden. Select a node to inspect its source and connections.",selected:"Only the selected node\u2019s connections are shown.",overview:"Overview links shown. Select a node to highlight its connections.",all:"All links shown. Select a node to highlight its connections."}[C.links];p.textContent!==M&&(p.textContent=M)},updateCounts(C){let M=i.nodes.filter(C),B=new Set(M.map(G=>G.id)),V=i.edges.filter(G=>B.has(G.from)&&B.has(G.to)).length;f.textContent=M.length.toLocaleString("en-AU")+(M.length===i.nodes.length?" records":" of "+i.nodes.length.toLocaleString("en-AU")+" records")+" \xB7 "+V.toLocaleString("en-AU")+" links",T.hidden=M.length>0},updateLabels(C,M,B,V,G,q,Y){let ne=V==="atlas"&&G>.02;if(S.hidden=!ne,!ne)return;if(_!==M){_=M,A=new Map(ci.map(Pe=>[Pe.id,[]]));let je=new Map;M.forEach((Pe,Z)=>{A.get(Nt(Pe))?.push(Z),je.set(Pe.id,Z)}),N=new Map([...b.keys()].map(Pe=>[Pe,je.get(Pe)]))}let le=Tn("graph-stage").clientWidth,ce=Tn("graph-stage").clientHeight,pe=le<=760,Te=[],it=(je,Pe,Z,ue=!1)=>{let se=Math.min(220,je.textContent.length*(pe?5.7:6.4)+16),Ne=ue?22:25,We=t&&!document.body.classList.contains("open-method-tools-open"),Fe=pe||We?12:284,pt=pe?132:96,qe=ce-32;if(ue){let Je=[[Pe+se/2+10,Z],[Pe-se/2-10,Z],[Pe,Z-22],[Pe,Z+22]];for(let[He,lt]of Je)if(!(He-se/2<Fe||He+se/2>le-12||lt<pt||lt>qe)&&!Te.some(st=>Math.abs(st.x-He)<(st.w+se)/2+5&&Math.abs(st.y-lt)<(st.h+Ne)/2+4)){Te.push({x:He,y:lt,w:se,h:Ne}),je.style.left=He+"px",je.style.top=lt+"px",je.hidden=!1;return}je.hidden=!0;return}Pe=Math.max(Fe+se/2,Math.min(le-12-se/2,Pe)),Z=Math.max(pt,Math.min(qe,Z));let at=[0,28,-28,56,-56,84,-84,112,-112,140,-140];for(let Je of at){let He=Z+Je;if(!(He<pt||He>qe)&&!Te.some(lt=>Math.abs(lt.x-Pe)<(lt.w+se)/2+5&&Math.abs(lt.y-He)<(lt.h+Ne)/2+4)){Te.push({x:Pe,y:He,w:se,h:Ne}),je.style.left=Pe+"px",je.style.top=He+"px",je.hidden=!1;return}}je.hidden=!0};for(let je of ci){let Pe=I.get(je.id),Z=je.name;Pe.textContent!==Z&&(Pe.textContent=Z);let ue=0,se=0,Ne=0,We=0;for(let at of A.get(je.id)){if(!B[at]||q&&q[at]<=.15)continue;let Je=M[at];se+=Je.x,Ne+=Je.y,We+=Je.z,ue++}if(!ue){Pe.hidden=!0;continue}if(Pe.classList.contains("group-dragging")){Pe.hidden=!1;continue}let Fe=Y?.get(je.id);R.set(Fe?.x??se/ue,Fe?.y??Ne/ue+36+Math.cbrt(ue)*14,Fe?.z??We/ue).project(C);let pt=(R.x*.5+.5)*le,qe=(-R.y*.5+.5)*ce;Pe.hidden=R.z<0||R.z>1||pt<-120||pt>le+120||qe<-120||qe>ce+120,Pe.hidden||it(Pe,pt,qe)}for(let[je,Pe]of b){let Z=N.get(je),ue=M[Z];if(!ue||!B[Z]||q&&q[Z]<=.15||pe&&!["agent","note"].includes(ue.kind)){Pe.hidden=!0;continue}R.set(ue.x,ue.y,ue.z).project(C);let se=(R.x*.5+.5)*le,Ne=(-R.y*.5+.5)*ce;Pe.hidden=R.z<0||R.z>1||se<0||se>le||Ne<70||Ne>ce-25,Pe.hidden||it(Pe,se,Ne,!0)}}}}var Ur={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Gn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},fy=new Ti(-1,1,1,-1,0,1),Ph=class extends Tt{constructor(){super(),this.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new yt([0,2,0,0,2,0],2))}},py=new Ph,_s=class{constructor(e){this._mesh=new vt(py,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,fy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var ec=class extends Gn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof rt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=li.clone(e.uniforms),this.material=new rt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new _s(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var qo=class extends Gn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},tc=class extends Gn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var nc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new ye);this._width=n.width,this._height=n.height,t=new Xt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:un}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ec(Ur),this.copyPass.material.blending=In,this.timer=new Us}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}qo!==void 0&&(o instanceof qo?n=!0:o instanceof tc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new ye);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ic=class extends Gn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new we}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var vp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new we(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Or=class i extends Gn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ye(e.x,e.y):new ye(256,256),this.clearColor=new we(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Xt(r,o,{type:un}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let d=new Xt(r,o,{type:un});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let h=new Xt(r,o,{type:un});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),o=Math.round(o/2)}let a=vp;this.highPassUniforms=li.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new rt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ye(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=li.clone(Ur.uniforms),this.blendMaterial=new rt({uniforms:this.copyUniforms,vertexShader:Ur.vertexShader,fragmentShader:Ur.fragmentShader,premultipliedAlpha:!0,blending:cn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new we,this._oldClearAlpha=1,this._basic=new qt,this._fsQuad=new _s(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ye(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new rt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ye(.5,.5)},direction:{value:new ye(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new rt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Or.BlurDirectionX=new ye(1,0);Or.BlurDirectionY=new ye(0,1);var Yo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var sc=class extends Gn{constructor(){super(),this.isOutputPass=!0,this.uniforms=li.clone(Yo.uniforms),this.material=new Sr({name:Yo.name,uniforms:this.uniforms,vertexShader:Yo.vertexShader,fragmentShader:Yo.fragmentShader}),this._fsQuad=new _s(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},tt.getTransfer(this._outputColorSpace)===_t&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===To?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ao?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ro?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Po?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Io?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Co&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var rc=class{constructor(e,{idleMs:t=3e4,fps:n=60}={}){this.idleMs=t,this.interval=1e3/n,this.lastActivity=e,this.nextFrame=e,this.idle=!1}touch(e){let t=this.idle;return this.lastActivity=e,this.idle=!1,t&&(this.nextFrame=e),t}checkIdle(e,t=!1){return t&&(this.lastActivity=e),this.idle=e-this.lastActivity>=this.idleMs,this.idle}frameDue(e){if(e+1<this.nextFrame)return!1;let t=Math.max(1,Math.floor((e-this.nextFrame)/this.interval)+1);return this.nextFrame+=t*this.interval,!0}};var ie=i=>document.getElementById(i),zr={pixelRatioCap:1,activeFps:60,idleMs:3e4},bp={sources:{...Xo.celestial,name:"Source colours",line:"#92aabe",hub:"#f0cb8a"},...Xo},xp=(i,e)=>e==="sources"?mh(i):Kf(i,e),Mp={off:"Off",selected:"Selected node",overview:"Overview",all:"All"},uc=document.createElement("label");uc.className="link-control";uc.textContent="Links";var Xs=document.createElement("select");Xs.id="link-mode";Xs.setAttribute("aria-label","Connecting lines");for(let[i,e]of Object.entries(Mp)){let t=document.createElement("option");t.value=i,t.textContent=e,Xs.append(t)}uc.append(Xs);ie("all-links").replaceWith(uc);for(let[i,e,t]of[["background-preset","planetary","Planetary surface"],["background-preset","horizon","Event horizon"],["layout-preset","atlas","Source sections"],["palette-preset","sources","Source colours"]]){let n=document.createElement("option");n.value=e,n.textContent=t,ie(i).prepend(n)}var _p="hermes-memory-3d-layout-v1",hc="hermes-memory-3d-settings-v1",kr=i=>{try{return JSON.parse(localStorage.getItem(i)||"null")}catch{return null}},Dh=(i,e)=>{try{localStorage.setItem(i,JSON.stringify(e))}catch{}},$n=matchMedia("(prefers-reduced-motion: reduce)"),my=kr("hermes-memory-constellation-settings-v1"),dc=kr(hc)||{},W={paused:$n.matches,pull:my?.gravity??1,pinOnDrop:!1,autoOrbit:!1,background:"horizon",animation:"depth",formation:"sphere",speed:1,orbit:1,glow:.6,rebound:.45,pointerPhysics:!0,spacing:1,cohesion:1,repulsion:8,cursor:1.2,pointerReach:1.5,linkForce:.45,linkDistance:75,interactionVersion:3,framingVersion:2,relationMeshVersion:1,layout:"atlas",design:"starlight",palette:"sources",shaderSpeed:.05,surroundStars:!0,environmentDesign:"cosmic",links:"overview",...dc};dc.interactionVersion!==3&&(W.pointerPhysics=!0,W.pinOnDrop=!1,W.interactionVersion=3);dc.relationMeshVersion!==1&&(W.links="overview",W.relationMeshVersion=1);var Sp=dc.framingVersion!==2;Sp&&(W.framingVersion=2);W.pull=Math.max(0,Math.min(2,Number(W.pull)||0));W.spacing=Math.max(.5,Math.min(2,Number(W.spacing)||1));for(let[i,e,t,n]of[["cohesion",0,2,1],["repulsion",0,16,8],["cursor",0,2,1.2],["pointerReach",.5,2.5,1.5],["linkForce",0,1,.45],["linkDistance",20,160,75]])W[i]=Math.max(e,Math.min(t,Number.isFinite(Number(W[i]))?Number(W[i]):n));for(let[i,e,t]of[["speed",.2,2],["orbit",0,2],["glow",0,2],["rebound",0,1],["shaderSpeed",0,1]])W[i]=Math.max(e,Math.min(t,Number.isFinite(Number(W[i]))?Number(W[i]):1));["depth","float","breathe"].includes(W.animation)||(W.animation="depth");["sphere","fluid","dna"].includes(W.formation)||(W.formation="sphere");Ch[W.background]||(W.background="universe");$l[W.layout]||(W.layout="saved");bp[W.palette]||(W.palette="celestial");_h[W.design]||(W.design="starlight");["cosmic","gradient"].includes(W.environmentDesign)||(W.environmentDesign="cosmic");Object.hasOwn(Mp,W.links)||(W.links="off");var fc=i=>i==="saved"?_p:_p+"-"+i+(i==="atlas"?"-sections-v15":""),Br=kr(fc(W.layout)),De,bt,Ye,Ie,ut,Ft=-1,ui,oc,Pi,Ep,Qi=!1,Gs,yp,Vs,Ot=!0,ac=0,lc=performance.now(),Ws,Wn,Ih,Lh;window.addEventListener("message",i=>{i.source!==window.parent||i.data?.type!=="open-method-surface"||(Ih=i.data,Lh?.(i.data))});function Zt(){Xs.value=W.links,ie("motion-toggle").textContent=W.paused?"Resume motion":"Pause motion",ie("motion-toggle").setAttribute("aria-pressed",String(!W.paused)),ie("star-pull").value=String(W.pull),ie("star-pull-value").textContent=W.pull.toFixed(1),ie("pin-on-drop").checked=W.pinOnDrop,ie("auto-orbit").checked=W.autoOrbit,ie("background-preset").value=W.background,ie("animation-mode").value=W.animation,ie("formation-mode").value=W.formation;for(let e of["speed","orbit","glow","rebound","shaderSpeed"])ie(e).value=String(W[e]),ie(e+"-value").textContent=e==="shaderSpeed"?String(W[e]):W[e].toFixed(1);ie("layout-preset").value=W.layout,ie("layout-description").textContent=Yf[W.layout],ie("design-preset").value=W.design,ie("palette-preset").value=W.palette,ie("surround-stars").checked=W.surroundStars,ie("environment-design").value=W.environmentDesign,Ep?.(),Pi?.configure(W);let i=ie("astral-background");Object.assign(i.dataset,{preset:W.background,enabled:String(W.background!=="off"),renderer:"shadergradient-3d",speed:String(W.shaderSpeed),paused:String(W.paused)}),ie("background-status").textContent=W.background==="off"?"Environment off.":Ch[W.background]+" \xB7 3D surround \xB7 "+(W.paused||W.shaderSpeed===0?"still":String(W.shaderSpeed)+"\xD7 speed"),Ye&&(Ye.autoRotate=W.autoOrbit&&!W.paused&&!$n.matches),De?.configure({running:!W.paused,visible:!document.hidden&&!Ws?.idle,pull:W.pull,drift:!$n.matches,animation:W.animation,speed:W.speed,orbit:W.orbit,rebound:W.rebound,spacing:W.spacing,formation:W.formation,cohesion:W.cohesion,repulsion:W.repulsion,cursor:W.cursor,pointerReach:W.pointerReach,linkForce:W.linkForce,linkDistance:W.linkDistance}),Dh(hc,W),Ot=!0,Gs?.syncSettings(W)}Zt();function hn(){!De||!ut||Qi||De.entrance.active||Dh(fc(W.layout),{nodes:Ie.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z,pinned:i.pinned})),camera:{position:ut.position.toArray(),target:Ye.target.toArray()}})}function gy(){if(!De||Qi)return;hn();let i=[hc,...Object.keys($l).map(fc),"hermes-memory-constellation-settings-v1","hermes-memory-constellation-layout-v1","hermes-memory-constellation-position-bookmark-v1"],e={format:"pralia-constellation-snapshot",version:1,capturedAt:new Date().toISOString(),nodes:Ie.length,storage:Object.fromEntries(i.map(s=>[s,kr(s)]).filter(([,s])=>s!==null)),playback:{environmentTime:Pi.time,linkMode:W.links,allLinks:W.links==="all"}},t=URL.createObjectURL(new Blob([JSON.stringify(e)],{type:"application/json"})),n=document.createElement("a");n.href=t,n.download="pralia-constellation-snapshot.json",n.click(),setTimeout(()=>URL.revokeObjectURL(t),3e4)}ie("export-view").addEventListener("click",gy);function cc(i){console.error(i),ie("loading").hidden=!1,ie("loading").replaceChildren(document.createTextNode("The local 3D preview could not load. "));let e=document.createElement("button");e.textContent="Retry",e.onclick=()=>location.reload(),ie("loading").append(e,document.createTextNode(" If the local server has stopped, run start-preview.ps1 in the preview folder.")),ie("graph-stage").dataset.ready="error"}async function vy(){let i=await fetch("./graph-3d-data.json");if(!i.ok)throw new Error("Graph data unavailable: "+i.status);let e=await i.json(),t=()=>{Ot=!0,Ke(),z(!1),te(),Gs?.updateCounts(s)},n=Fh(e,{selectNode:P=>{let ee=De?.index.get(P);ee!==void 0&&(Be(ee),ve(ee))},refresh:t});Gs=gp(e,{refresh:t,startGroupDrag:(P,ee,v)=>yp?.(P,ee,v)});let s=P=>n.visible(P)&&Gs.visible(P),r=Zl(e,kr("hermes-memory-constellation-layout-v1"));Ie=gh(e,r,W.layout,Br),De=new Wo(Ie,xh(e,W.layout),()=>{Ot=!0,Ft>=0&&xe()},cc);let o=await Promise.all([new Nn().loadAsync("./assets/star-core.glb"),new Ds().loadAsync("./assets/star-glow.png"),De.ready,new Nn().loadAsync("./assets/crystal-core.glb"),new Nn().loadAsync("./assets/orbital-ring.glb"),new Nn().loadAsync("./assets/universe-shell.glb"),fetch("./assets/universe-stars.json").then(P=>{if(!P.ok)throw new Error("Starfield unavailable");return P.json()}),new Nn().loadAsync("./assets/event-horizon.glb"),fetch("./assets/horizon-stars.json").then(P=>{if(!P.ok)throw new Error("Horizon stars unavailable");return P.json()}),np()]),a=P=>{let ee;if(P.scene.traverse(v=>{v.isMesh&&!ee&&(ee=v)}),!ee)throw new Error("Blender mesh missing");return ee},l;if(o[0].scene.traverse(P=>{P.isMesh&&!l&&(l=P)}),!l)throw new Error("Blender star mesh is missing.");let c=o[1];c.colorSpace=Gt;let u=De.index,d=W.layout==="atlas"?vh(Ie,e):new Set(e.overview),h=Ie.map(()=>[]),f=e.edges.map((P,ee)=>{let v=u.get(P.from),L=u.get(P.to);return h[v].push(ee),h[L].push(ee),{a:v,b:L}}),m=new Ps;ut=new Jt(48,1,.1,1e5),bt=new Hl({antialias:!1,alpha:!0,powerPreference:"high-performance"}),bt.setPixelRatio(Math.min(devicePixelRatio,zr.pixelRatioCap)),bt.setClearColor(0,0),ie("graph-3d").append(bt.domElement),Pi=new Ql(m,a(o[5]).geometry,o[6].positions,c,o[7],o[8],o[9]);let y=new nc(bt);y.addPass(new ic(m,ut));let g=new Or(new ye(1,1),.58,.35,1.3);y.addPass(g),y.addPass(new sc),bt.domElement.addEventListener("webglcontextlost",P=>{P.preventDefault(),cancelAnimationFrame(Vs),cc(new Error("3D graphics context lost"))}),ui=new Bi(l.geometry,new qt({toneMapped:!1}),Ie.length),ui.instanceMatrix.setUsage(wi),ui.frustumCulled=!1,ui.boundingSphere=new gn(new D,1e5);let p=new we(16777215);Ie.forEach((P,ee)=>ui.setColorAt(ee,new we(P.colour).lerp(p,P.tier==="yellow"?.18:.55))),m.add(ui),oc=new qt({map:c,transparent:!0,blending:kn,depthWrite:!1,depthTest:!0,toneMapped:!1,opacity:W.glow});let S=new Bi(new Gi(1,1),oc,Ie.length);S.instanceMatrix.setUsage(wi),S.frustumCulled=!1,Ie.forEach((P,ee)=>S.setColorAt(ee,new we(P.colour))),m.add(S);let I=Ie.map((P,ee)=>P.tier==="blue"?-1:ee).filter(P=>P>=0),b=new Bi(a(o[4]).geometry,new qt({color:16777215,transparent:!0,opacity:.65,depthWrite:!1}),I.length);b.instanceMatrix.setUsage(wi),b.frustumCulled=!1,m.add(b);let T=I.map((P,ee)=>new Bt().setFromEuler(new Rn(ee*.7,ee*.31,ee*.23))),E=new Ge,R=new D,_=new D,A=new Bt,N=Ie.map(P=>({...P})),C=new Array(Ie.length),M=new Map,B=new Map,V=new Map,G=new Float32Array(Ie.length),q=new Float32Array(Ie.length),Y=new Map;Ie.forEach((P,ee)=>{let v=Nt(P);B.has(v)||B.set(v,[]),B.get(v).push(ee)});for(let[P,ee]of B){let v=De.groupParents?.get(P);if(!v)continue;V.set(P,[...ee].sort((O,J)=>(Ie[J].degree||0)-(Ie[O].degree||0)||Ie[O].id.localeCompare(Ie[J].id))[0]);let L=ee.map(O=>Math.hypot(Ie[O].x-v.x,Ie[O].y-v.y,Ie[O].z-v.z)).sort((O,J)=>O-J),U=Math.max(12,L[Math.floor((L.length-1)*.78)]||30),F=Vt(P+"|parent-sphere")*Math.PI*2;ee.forEach((O,J)=>{let ae=1-2*(J+.5)/ee.length,he=Math.sqrt(Math.max(0,1-ae*ae)),de=J*2.39996323+F,K=.28+.72*Math.cbrt(Vt(Ie[O].id+"|parent-shell")),oe=U*K;C[O]={x:Math.cos(de)*he*oe,y:ae*oe,z:Math.sin(de)*he*oe};let Ee=Vt(Ie[O].id+"|idle-breath")*Math.PI*2;G[O]=Math.sin(Ee),q[O]=Math.cos(Ee)}),M.set(P,1),Y.set(P,{phase:Vt(P+"|3d-tumble")*Math.PI*2,direction:Vt(P+"|orbit-direction")>.5?1:-1,rate:.055+Vt(P+"|orbit-rate")*.035})}let ne=0,le=new Float32Array(f.length*6),ce=new Tt;ce.setAttribute("position",new Ct(le,3).setUsage(wi));let pe=new yi({color:10206168,transparent:!0,opacity:.11,depthWrite:!1}),Te=new ki(ce,pe);Te.frustumCulled=!1,m.add(Te);let it=new Tt,je=new Float32Array(f.length*6);it.setAttribute("position",new Ct(je,3).setUsage(wi));let Pe=new ki(it,new yi({color:16770724,transparent:!0,opacity:.65,depthWrite:!1}));Pe.frustumCulled=!1,m.add(Pe);let Z=new Float32Array(Ie.length*6),ue=new Float32Array(Ie.length*6),se=new Tt;se.setAttribute("position",new Ct(Z,3).setUsage(wi)),se.setAttribute("color",new Ct(ue,3).setUsage(wi));let Ne=new yi({color:16777215,vertexColors:!0,transparent:!0,opacity:.085,depthWrite:!1,blending:cn}),We=new ki(se,Ne);We.frustumCulled=!1,m.add(We);let Fe=128,pt=new Float32Array(Fe*3),qe=new Tt;qe.setAttribute("position",new Ct(pt,3).setUsage(wi));let at=new Kn(qe,new bi({color:16770989,size:2.2,sizeAttenuation:!0,transparent:!0,opacity:.92,depthWrite:!1,blending:cn}));at.frustumCulled=!1,m.add(at);let Je=[...d],He=new vt(new Wi(1,16,10),new qt({color:16777215,wireframe:!0}));He.visible=!1,m.add(He),Ep=()=>{let P=bp[W.palette],ee=_h[W.design];ui.geometry=ee.core==="crystal"?a(o[3]).geometry:l.geometry,Ie.forEach((v,L)=>{let U=new we(xp(v,W.palette));ui.setColorAt(L,U.clone().lerp(p,W.palette==="sources"?.05:ee.core==="crystal"?.12:v.tier==="yellow"?.18:.55)),S.setColorAt(L,U)}),I.forEach((v,L)=>b.setColorAt(L,new we(xp(Ie[v],W.palette)))),ui.instanceColor.needsUpdate=!0,S.instanceColor.needsUpdate=!0,b.instanceColor.needsUpdate=!0,oc.opacity=W.glow*ee.glow,b.visible=ee.rings,pe.color.set(P.line),pe.opacity=W.layout==="atlas"?.085:ee.links,Pe.material.color.set(P.hub),He.material.color.set(P.hub)},Ye=new Xl(ut,bt.domElement),Ye.enableDamping=!0,Ye.dampingFactor=.09,Ye.autoRotateSpeed=.28,Ye.minDistance=12,Ye.maxDistance=15e3;let lt,st=null,zt=!0;function Qt(){if(!lt||st)return;let ee=Ye.target.clone().clamp(lt.min,lt.max).sub(Ye.target);ee.lengthSq()>0&&(Ye.target.add(ee),ut.position.add(ee))}Ye.addEventListener("change",()=>{Qt(),Ot=!0});let Lt,xt=0,k=!1,rn=!1,gt=null,w=!1,x=()=>{clearTimeout(Lt),Lt=setTimeout(hn,300)};Ye.addEventListener("end",x),bt.domElement.addEventListener("pointerdown",P=>{P.button===0&&(st=null,k=!0,gt=P.pointerId)},!0);let H=P=>{if(!k||P.pointerId!==gt&&P.type!=="blur")return;let ee=rn;k=!1,rn=!1,gt=null,ee&&(Ye.enabled=!(jt||Un),bt.domElement.style.cursor="grab",w=!0,setTimeout(()=>{w=!1},0)),ie("graph-stage").dataset.fieldScale=W.spacing.toFixed(3),x(),Wn?.()};window.addEventListener("pointerup",H),window.addEventListener("pointercancel",H),window.addEventListener("blur",H);let X=P=>{(P.type==="auxclick"&&P.button===1||w)&&(P.preventDefault(),P.stopImmediatePropagation())};bt.domElement.addEventListener("click",X,!0),bt.domElement.addEventListener("auxclick",X,!0),bt.domElement.addEventListener("wheel",P=>{if(!Ye.enabled&&!k)return;st=null,P.preventDefault(),P.stopImmediatePropagation();let ee=P.deltaMode===1?16:P.deltaMode===2?bt.domElement.clientHeight:1,v=Math.max(-300,Math.min(300,P.deltaY*ee));if(k||P.buttons&1){rn=!0,xt=0,Ye.enabled=!1,bt.domElement.style.cursor="ns-resize",Un&&!Kt&&(Un=null,Hr=null),W.spacing=Math.max(.5,Math.min(2,W.spacing*Math.exp(-v*.0015)));let L=ie("node-spacing");L&&(L.value=String(W.spacing)),De.configure({spacing:W.spacing}),Dh(hc,W),ie("graph-stage").dataset.fieldScale=W.spacing.toFixed(3),Ot=!0}else xt=Math.max(-2,Math.min(2,xt+v*.001));Wn?.()},{capture:!0,passive:!1});function j(){Wn?.();let P=ie("graph-3d"),ee=P.clientWidth,v=P.clientHeight;bt.setSize(ee,v),y.setSize(ee,v),ut.aspect=ee/v,ut.clearViewOffset(),ut.updateProjectionMatrix(),Ot=!0}new ResizeObserver(j).observe(ie("graph-3d")),j();function me(P,ee=W.layout==="atlas"?.64:.72){let v=new En;if(P.forEach(he=>v.expandByPoint(new D(he.x,he.y,he.z))),v.isEmpty())return;let L=v.getCenter(new D),U=v.getSize(new D),F=U.clone().multiplyScalar(.18).max(new D(45,45,45)),O=ie("graph-3d").clientWidth/ie("graph-3d").clientHeight,J=Math.max(80,U.x/Math.max(O,.4),U.y,U.z)*ee/Math.tan($i.degToRad(ut.fov/2)),ae=W.layout==="atlas"?new D(0,-.08,1):W.layout==="galaxy"?new D(.15,1,.4):new D(.25,.18,1);return{box:v,envelope:{min:L.clone().sub(F),max:L.clone().add(F)},center:L,distance:J,position:L.clone().add(ae.normalize().multiplyScalar(J))}}function be(P){P&&(lt=P.envelope,Ye.target.copy(P.center),ut.position.copy(P.position),Ye.maxDistance=Math.min(15e3,P.distance*3.2),Ye.update(),Ot=!0)}function $(P){if(P){if(lt=P.envelope,Ye.maxDistance=Math.min(15e3,P.distance*3.2),xt=0,$n.matches){be(P),hn();return}st={started:performance.now(),duration:720,fromPosition:ut.position.clone(),fromTarget:Ye.target.clone(),toPosition:P.position,toTarget:P.center},Wn?.(),Ot=!0}}function te(){be(me(Ie.filter(s)))}te(),!Sp&&Br?.camera&&[Br.camera.position,Br.camera.target].every(P=>Array.isArray(P)&&P.length===3&&P.every(Number.isFinite))&&(ut.position.fromArray(Br.camera.position),Ye.target.fromArray(Br.camera.target),Ye.update());async function ve(P){let ee=De;if(De.entrance.active&&!await De.skip()||ee!==De||Ft!==P)return;let v=Ie[P],L=new D(v.x,v.y,v.z),U=ut.position.clone().sub(Ye.target).normalize(),F=Math.max(v.radius*14,90);ut.position.copy(L).addScaledVector(U,F),Ye.target.copy(L),Ye.update(),Ot=!0,hn()}function Oe(P){if(P==="sessions"&&(P="conversations"),!(P==="overview"||ci.some(U=>U.id===P)))return;let v=P==="overview"?Ie.filter(s):Ie.filter(U=>s(U)&&Nt(U)===P),L=P==="overview"?W.layout==="atlas"?.64:.72:.92;$(me(v,L)),ie("graph-stage").dataset.openMethodFocus=P}function Se(P,ee){let v=document.createElement("button");return v.type="button",v.textContent=P.label,v.addEventListener("click",ee),v}function xe(){let P=Ie[Ft];if(!P)return;let ee=De?.releasePending?"Settling at drop position\u2026":P.pinned?"Pinned in 3D":"Free to move and collide";ie("node-state").textContent!==ee&&(ie("node-state").textContent=ee);let v=P.pinned?"Release node":"Pin node";ie("pin-node").textContent!==v&&(ie("pin-node").textContent=v),ie("node-info").dataset.pinned!==String(P.pinned)&&(ie("node-info").dataset.pinned=String(P.pinned))}De.onRelease=()=>{xe(),hn()},De.onGroupRelease=()=>{};async function ke(P){if(Qi||P===W.layout)return;hn();let ee=W.layout,v=De,L=kr(fc(P)),U=gh(e,r,P,L);Qi=!0,ie("layout-preset").disabled=!0,ie("replay-entrance").disabled=!0,Ye.enabled=!1,ie("layout-description").textContent="Arranging "+$l[P]+"\u2026",v.configure({running:!1});let F;try{F=new Wo(U,xh(e,P),()=>{},()=>{}),await F.ready,v.dispose(),U.forEach((O,J)=>Object.assign(Ie[J],O)),d=P==="atlas"?vh(Ie,e):new Set(e.overview),Je=[...d],F.nodes=Ie,F.onRelease=()=>{xe(),hn()},F.onGroupRelease=()=>hn(),F.onError=cc,F.onUpdate=()=>{Ot=!0,Ft>=0&&xe()},De=F,W.layout=P,Ft=-1,ie("node-info").hidden=!0,Qi=!1,Zt(),te(),L?.camera&&[L.camera.position,L.camera.target].every(O=>Array.isArray(O)&&O.length===3&&O.every(Number.isFinite))&&(ut.position.fromArray(L.camera.position),Ye.target.fromArray(L.camera.target),Ye.update()),hn(),z(!1),ie("graph-stage").dataset.layout=P}catch(O){F?.dispose(),W.layout=ee,Qi=!1,De=v,Zt(),ie("layout-description").textContent="This layout could not load. Your previous arrangement is still here.",console.error(O)}ie("layout-preset").disabled=!1,ie("replay-entrance").disabled=!1,Ye.enabled=!0,Ot=!0}function Be(P,ee=!0){if(Ft=P,Ot=!0,P<0){ie("node-info").hidden=!0;return}let v=Ie[P];ie("node-info").hidden=!1,ie("node-name").textContent=v.label,ee&&Gs.selected(v),n.describe(v),xe(),ie("node-info").dataset.nodeId=v.id,ie("node-info").dataset.pinned=String(v.pinned);let L=u.get(e.routes[v.id]?.root),U=u.get(e.routes[v.id]?.anchor),F=v.tier==="yellow"?"Primary hub":v.tier==="white"?"Local hub":"Community node";ie("node-kind").textContent=n.kindName(v.kind)+" \xB7 "+v.scope;let O=document.createElement("span");O.textContent=L===void 0?"Independent group":"Group: ",ie("node-group").replaceChildren(O),L!==void 0&&ie("node-group").append(Se(Ie[L],()=>{Be(L),ve(L)})),ie("node-anchor").textContent=U===void 0?"":"Follows: "+Ie[U].label;let J=[...new Set(h[P].map(ae=>f[ae].a===P?f[ae].b:f[ae].a))];ie("neighbours-title").textContent=`${J.length} connected node${J.length===1?"":"s"}`,ie("neighbours").replaceChildren(...J.map(ae=>{let he=Se(Ie[ae],()=>{Be(ae),ve(ae)});return he.textContent=n.connectionLabel(v.id,Ie[ae].id)+" \xB7 "+Ie[ae].label,he}))}function Ke(){let P=ie("search").value.trim().toLowerCase(),ee=P?Ie.filter(v=>s(v)&&(v.label+" "+(v.title||"")).toLowerCase().includes(P)):Ie.filter(v=>s(v)&&(n.scope()!=="all"||v.kind==="agent"||v.kind==="builtin"||v.kind==="fact")).sort((v,L)=>L.degree-v.degree);ie("results-caption").textContent=P?`${ee.length} ${ee.length===1?"match":"matches"}${ee.length>60?" \xB7 first 60 shown":""}`:"Start exploring",ie("search-results").replaceChildren(...ee.slice(0,60).map(v=>Se(v,()=>{Be(u.get(v.id)),ve(u.get(v.id))})))}Ke(),ie("search").addEventListener("input",Ke),Gs.updateCounts(s),ie("focus-node").addEventListener("click",()=>{Ft>=0&&ve(Ft)}),ie("pin-node").addEventListener("click",()=>{Ft>=0&&(De.pin(Ft,!Ie[Ft].pinned),Be(Ft),hn())}),ie("fit-view").textContent="Re-centre",ie("fit-view").title="Centre and fit the complete constellation",ie("fit-view").addEventListener("click",()=>{xt=0,te(),hn()}),Xs.addEventListener("change",()=>{W.links=Xs.value,Zt()}),ie("motion-toggle").addEventListener("click",()=>{W.paused=!W.paused,Zt()});function z(P=!0){!De||!Pi||Qi||(P&&!$n.matches&&(W.paused=!1),Pi.time=0,De.replay({visible:Ie.map(s),reduced:$n.matches||W.paused}),Zt(),Ot=!0)}ie("replay-entrance").addEventListener("click",()=>z()),ie("skip-entrance").addEventListener("click",async()=>{await De.skip()&&ie("replay-entrance").focus()}),ie("background-preset").addEventListener("change",P=>{W.background=P.target.value,Zt()}),ie("layout-preset").addEventListener("change",P=>{ke(P.target.value)}),ie("design-preset").addEventListener("change",P=>{W.design=P.target.value,Zt()}),ie("palette-preset").addEventListener("change",P=>{W.palette=P.target.value,Zt()}),ie("surround-stars").addEventListener("change",P=>{W.surroundStars=P.target.checked,Zt()}),ie("environment-design").addEventListener("change",P=>{W.environmentDesign=P.target.value,Zt()}),ie("star-pull").addEventListener("input",P=>{W.pull=Number(P.target.value),Zt()}),ie("animation-mode").addEventListener("change",P=>{W.animation=P.target.value,z(!1)}),ie("formation-mode").addEventListener("change",P=>{W.formation=P.target.value,Zt(),Wn?.()});for(let P of["speed","orbit","glow","rebound","shaderSpeed"])ie(P).addEventListener("input",ee=>{W[P]=Number(ee.target.value),Zt()});ie("pin-on-drop").addEventListener("change",P=>{W.pinOnDrop=P.target.checked,Zt()}),ie("auto-orbit").addEventListener("change",P=>{W.autoOrbit=P.target.checked,Zt()});let ge=document.createElement("label"),Q=document.createElement("input");ge.className="check",Q.type="checkbox",Q.checked=W.pointerPhysics,Q.id="pointer-physics",ge.append(Q," Cursor pushes nearby stars"),ie("auto-orbit").closest("label").after(ge),Q.addEventListener("change",()=>{W.pointerPhysics=Q.checked,W.pointerPhysics||De.worker.postMessage({type:"pointer",pointer:null}),Zt()});let Me=document.createElement("label"),_e=document.createElement("input");_e.type="range",_e.min=".5",_e.max="2",_e.step=".05",_e.value=String(W.spacing),_e.id="node-spacing",_e.setAttribute("aria-label","Node spacing"),Me.append("Node spacing ",_e),ge.after(Me),_e.addEventListener("input",()=>{W.spacing=Number(_e.value),Zt()});let re=Me;for(let[P,ee,v,L,U]of[["cohesion","Group cohesion",0,2,.1],["repulsion","Node repulsion",0,16,1],["cursor","Cursor push strength",0,2,.1],["pointerReach","Cursor push radius",.5,2.5,.1],["linkForce","Link strength",0,1,.05],["linkDistance","Link distance",20,160,5]]){let F=document.createElement("label"),O=document.createElement("span"),J=document.createElement("input");F.className="dynamic-physics-control",O.textContent=String(W[P]),J.type="range",J.min=String(v),J.max=String(L),J.step=String(U),J.value=String(W[P]),J.id="physics-"+P,J.setAttribute("aria-label",ee),F.append(ee+" ",O,J),re.after(F),re=F,J.addEventListener("input",()=>{W[P]=Number(J.value),O.textContent=J.value,Zt()})}ie("graph-3d").title="Drag a star or group label to tug; wheel to zoom; hold left mouse and scroll to contract or expand the stars; press R to re-centre.",$n.addEventListener("change",()=>{$n.matches&&(W.paused=!0,De.skip(),Zt())}),Zt();let Ce=new Mo,Le=new ye,Mt=new wn,dt=new D,Fn=new D,Kt=!1,Hr=null,Un=null,jt=null,qs=0;function Ys(P){let ee=bt.domElement.getBoundingClientRect();Le.set((P.clientX-ee.left)/ee.width*2-1,-(P.clientY-ee.top)/ee.height*2+1),Ce.setFromCamera(Le,ut)}function Vr(P){Ys(P);let ee=bt.domElement.getBoundingClientRect(),v=2*Math.tan($i.degToRad(ut.fov/2))/ee.height,L=-1,U=1/0;return N.forEach((F,O)=>{if(!s(F)||De.scales[O]<.15)return;R.set(F.x,F.y,F.z);let J=Ce.ray.origin,ae=Ce.ray.direction,he=(F.x-J.x)*ae.x+(F.y-J.y)*ae.y+(F.z-J.z)*ae.z,de=Math.max(F.radius*De.scales[O],he*v*7),K=Ce.ray.distanceSqToPoint(R),oe=he-Math.sqrt(Math.max(0,de*de-K));he>0&&oe<U&&K<de*de&&(L=O,U=oe)}),L}yp=(P,ee,v)=>{if(ee.button!==0||!De||!ut||Qi||jt||Un)return;let L=Ie.map((K,oe)=>Nt(K)===P&&s(K)?oe:-1).filter(K=>K>=0),U=L.filter(K=>De.scales[K]>.15);if(!U.length)return;let F=De.groupParents?.get(P),O=F?new D(F.x,F.y,F.z):U.reduce((K,oe)=>K.add(new D(Ie[oe].x,Ie[oe].y,Ie[oe].z)),new D).multiplyScalar(1/U.length);Ys(ee);let J=ut.getWorldDirection(new D);if(Mt.setFromNormalAndCoplanarPoint(J,O),!Ce.ray.intersectPlane(Mt,dt))return;let ae=new D(1,0,0).applyQuaternion(ut.quaternion),he=[];for(let[K,oe]of De.groupParents||[]){if(K===P)continue;let Ee=new D(oe.x,oe.y,oe.z),fe=Ee.clone().project(ut),Ve=new D;if(Ce.setFromCamera(new ye(fe.x,fe.y),ut),!Ce.ray.intersectPlane(Mt,Ve))continue;let $e=Ee.clone().addScaledVector(ae,(sourceVisualRadii.get(K)||20)*W.spacing).project(ut),ct=new D;Ce.setFromCamera(new ye($e.x,$e.y),ut),Ce.ray.intersectPlane(Mt,ct)&&he.push({id:K,x:Ve.x,y:Ve.y,z:Ve.z,radius:Math.max(8,Ve.distanceTo(ct))})}let de=v.getBoundingClientRect();jt={pointerId:ee.pointerId,groupId:P,element:v,offset:O.clone().sub(dt),screenOffset:{x:de.left+de.width/2-ee.clientX,y:de.top+de.height/2-ee.clientY}},M.set(P,0),v.classList.remove("group-settling"),v.setPointerCapture(ee.pointerId),v.classList.add("group-dragging"),Ye.enabled=!1,De.startGroupDrag(L,O,P,he),Wn?.(),ee.preventDefault(),ee.stopPropagation()},window.addEventListener("pointermove",P=>{if(!jt||P.pointerId!==jt.pointerId)return;Ys(P),Ce.ray.intersectPlane(Mt,dt)&&De.moveGroupDrag(dt.add(jt.offset));let ee=ie("graph-stage").getBoundingClientRect();jt.element.style.left=P.clientX-ee.left+jt.screenOffset.x+"px",jt.element.style.top=P.clientY-ee.top+jt.screenOffset.y+"px",Ot=!0,P.preventDefault()});let Gr=P=>{if(!jt||P.pointerId!==jt.pointerId)return;let{element:ee}=jt;De.endGroupDrag(),jt=null,Ye.enabled=!0,ee.classList.remove("group-dragging"),ee.classList.add("group-settling"),setTimeout(()=>ee.classList.remove("group-settling"),240),ee.hasPointerCapture(P.pointerId)&&ee.releasePointerCapture(P.pointerId),Ot=!0,P.preventDefault()};window.addEventListener("pointerup",Gr),window.addEventListener("pointercancel",Gr),bt.domElement.addEventListener("pointerdown",P=>{if(P.button!==0)return;let ee=Vr(P);if(ee<0)return;Be(ee,!1),Un={index:ee,x:P.clientX,y:P.clientY},Hr=P.pointerId,Ye.enabled=!1,bt.domElement.setPointerCapture(P.pointerId);let v=Ie[ee],L=ut.getWorldDirection(new D);Mt.setFromNormalAndCoplanarPoint(L,new D(v.x,v.y,v.z)),Ce.ray.intersectPlane(Mt,dt),Fn.set(v.x,v.y,v.z).sub(dt),ie("hover-label").hidden=!0,P.stopImmediatePropagation(),P.preventDefault()},!0),bt.domElement.addEventListener("pointermove",P=>{if(Un){!Kt&&Math.hypot(P.clientX-Un.x,P.clientY-Un.y)>=2&&(De.startDrag(Un.index),Kt=!0,bt.domElement.style.cursor="grabbing"),Kt&&(Ys(P),Ce.ray.intersectPlane(Mt,dt)&&De.moveDrag(dt.add(Fn)),Ot=!0);return}if(P.buttons)return;let ee=performance.now();if(ee-qs<50)return;qs=ee;let v=Vr(P),L=ie("hover-label");if(L.hidden=v<0,W.pointerPhysics&&!W.paused&&!$n.matches){let{origin:U,direction:F}=Ce.ray,J=2*Math.max(1,Ce.ray.origin.distanceTo(Ye.target))*Math.tan($i.degToRad(ut.fov/2))/bt.domElement.clientHeight;De.worker.postMessage({type:"pointer",pointer:{origin:{x:U.x,y:U.y,z:U.z},direction:{x:F.x,y:F.y,z:F.z},radius:Math.max(18,Math.min(180,J*55))}})}if(bt.domElement.style.cursor=v<0?"grab":"pointer",v>=0){let U=ie("graph-stage").getBoundingClientRect();L.textContent=Ie[v].label+" \xB7 "+n.kindName(Ie[v].kind),L.style.left=Math.min(P.clientX-U.left+12,U.width-280)+"px",L.style.top=Math.max(68,P.clientY-U.top-35)+"px"}});function hi(P){if(!Un||P.pointerId!==Hr)return;let ee=Kt;Kt&&De.endDrag(P.shiftKey?!1:W.pinOnDrop),Kt=!1,Un=null,Ye.enabled=!0,bt.domElement.style.cursor="grab",bt.domElement.hasPointerCapture(P.pointerId)&&bt.domElement.releasePointerCapture(P.pointerId),Be(Ft,!ee),De.releasePending||hn(),Ot=!0}bt.domElement.addEventListener("pointerup",hi),bt.domElement.addEventListener("pointercancel",hi),ie("graph-3d").addEventListener("keydown",P=>{if(P.key.toLowerCase()==="r"){xt=0,te(),hn(),P.preventDefault();return}if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-"].includes(P.key))return;let ee=ut.position.clone().sub(Ye.target),v=new ds().setFromVector3(ee);P.key==="ArrowLeft"&&(v.theta-=.1),P.key==="ArrowRight"&&(v.theta+=.1),P.key==="ArrowUp"&&(v.phi-=.1),P.key==="ArrowDown"&&(v.phi+=.1),(P.key==="+"||P.key==="=")&&(v.radius*=.85),P.key==="-"&&(v.radius*=1.15),v.makeSafe(),ut.position.copy(Ye.target).add(new D().setFromSpherical(v)),Ye.update(),Ot=!0,P.preventDefault(),hn()});let dn=new Uint8Array(Ie.length),Wr=(P,ee,v,L,U)=>{let F=ee*6;P[F]=v.x,P[F+1]=v.y,P[F+2]=v.z,P[F+3]=v.x+(L.x-v.x)*U,P[F+4]=v.y+(L.y-v.y)*U,P[F+5]=v.z+(L.z-v.z)*U};function Xr(){for(let[K,oe]of M)oe<.999&&M.set(K,Math.min(1,oe+.006));let P=ne*.72,ee=Math.sin(P),v=Math.cos(P),L=new Map;for(let[K,oe]of Y){let Ee=ne*oe.rate*oe.direction+oe.phase,fe=.42*Math.sin(ne*.24+oe.phase);L.set(K,{cy:Math.cos(Ee),sy:Math.sin(Ee),cx:Math.cos(fe),sx:Math.sin(fe)})}Ie.forEach((K,oe)=>{let Ee=Nt(K),fe=N[oe],Ve=De.groupParents?.get(Ee),$e=C[oe],ct=jt?.groupId===Ee;if(fe.x=K.x,fe.y=K.y,fe.z=K.z,W.layout==="atlas"&&W.formation==="sphere"&&Ve&&$e&&!ct){let ze=L.get(Ee),Ut=$e.x*W.spacing,Re=$e.y*W.spacing,fn=$e.z*W.spacing,ft=Ut*ze.cy-fn*ze.sy,bn=Ut*ze.sy+fn*ze.cy,Xn=Re*ze.cx-bn*ze.sx,di=Re*ze.sx+bn*ze.cx,fi=1+.022*(ee*q[oe]+v*G[oe]),St=K.x-(Ve.x+$e.x),Dt=K.y-(Ve.y+$e.y),qn=K.z-(Ve.z+$e.z),At=Math.hypot(St,Dt,qn);if(At>16){let gc=16/At;St*=gc,Dt*=gc,qn*=gc}let pi=Ve.x+ft*fi+St*.72,ns=Ve.y+Xn*fi+Dt*.72,Zo=Ve.z+di*fi+qn*.72,mc=M.get(Ee)??1;fe.x=K.x+(pi-K.x)*mc,fe.y=K.y+(ns-K.y)*mc,fe.z=K.z+(Zo-K.z)*mc}dn[oe]=s(K)?1:0,R.set(fe.x,fe.y,fe.z),_.setScalar(dn[oe]?K.radius*De.scales[oe]:0),E.compose(R,A,_),ui.setMatrixAt(oe,E),_.setScalar(dn[oe]?K.radius*(W.layout==="atlas"&&K.kind==="mirror"?9:16)*De.scales[oe]:0),E.compose(R,ut.quaternion,_),S.setMatrixAt(oe,E)}),ui.instanceMatrix.needsUpdate=!0,S.instanceMatrix.needsUpdate=!0,S.visible=oc.opacity>0,I.forEach((K,oe)=>{let Ee=Ie[K],fe=N[K];R.set(fe.x,fe.y,fe.z),_.setScalar(dn[K]?Ee.radius*De.scales[K]:0),E.compose(R,T[oe],_),b.setMatrixAt(oe,E)}),b.instanceMatrix.needsUpdate=!0;let U=0,F=0,O=(K,oe=!1)=>{let Ee=f[K],fe=N[Ee.a],Ve=N[Ee.b],$e=Math.min(De.linkProgress[Ee.a],De.linkProgress[Ee.b]);$e<=0||!dn[Ee.a]||!dn[Ee.b]||(oe?Wr(je,F++,fe,Ve,$e):Ft!==Ee.a&&Ft!==Ee.b&&Wr(le,U++,fe,Ve,$e))};if(W.links==="all")for(let K=0;K<f.length;K++)O(K);else if(W.links==="overview")for(let K of d)O(K);if(W.links!=="off"&&Ft>=0)for(let K of h[Ft])O(K,!0);for(let[K,oe,Ee]of[[Te,ce,U],[Pe,it,F]])if(K.visible=Ee>0,oe.setDrawRange(0,Ee*2),Ee){let fe=oe.attributes.position;fe.clearUpdateRanges(),fe.addUpdateRange(0,Ee*6),fe.needsUpdate=!0}let J=0;if(Ie.forEach((K,oe)=>{if(!dn[oe]||De.scales[oe]<=.15)return;let Ee=Nt(K),fe=De.groupParents?.get(Ee),Ve=V.get(Ee);if(!fe||Ve===void 0)return;let $e=N[oe],ct=N[Ve],ze=J++*6;Z[ze]=$e.x,Z[ze+1]=$e.y,Z[ze+2]=$e.z,Z[ze+3]=ct.x,Z[ze+4]=ct.y,Z[ze+5]=ct.z;let Ut=new we(mh(K)),Re=Ut.clone().lerp(p,.42);ue[ze]=Ut.r,ue[ze+1]=Ut.g,ue[ze+2]=Ut.b,ue[ze+3]=Re.r,ue[ze+4]=Re.g,ue[ze+5]=Re.b}),We.visible=W.layout==="atlas"&&J>0,Ne.opacity=jt?.11:.045,se.setDrawRange(0,J*2),J){let K=se.attributes.position,oe=se.attributes.color;K.clearUpdateRanges(),K.addUpdateRange(0,J*6),K.needsUpdate=!0,oe.clearUpdateRanges(),oe.addUpdateRange(0,J*6),oe.needsUpdate=!0}let ae=0,he=performance.now()*.001;for(let K=0;K<Fe;K++){let oe,Ee;if(K%3===0){let ct=K*83%Ie.length,ze=V.get(Nt(Ie[ct]));if(ze===void 0||!dn[ct]||!dn[ze])continue;oe=N[ct],Ee=N[ze]}else{let ct=Je[K*47%Math.max(1,Je.length)],ze=f[ct];if(!ze||!dn[ze.a]||!dn[ze.b])continue;oe=N[ze.a],Ee=N[ze.b]}let fe=(he*(.16+K%7*.018)+Vt(String(K)+"activity"))%1,Ve=ae++*3,$e=fe*fe*(3-2*fe);pt[Ve]=oe.x+(Ee.x-oe.x)*$e,pt[Ve+1]=oe.y+(Ee.y-oe.y)*$e,pt[Ve+2]=oe.z+(Ee.z-oe.z)*$e}if(qe.setDrawRange(0,ae),ae){let K=qe.attributes.position;K.clearUpdateRanges(),K.addUpdateRange(0,ae*3),K.needsUpdate=!0}at.visible=ae>0;let de=ie("graph-stage");if(de.dataset.drawnLinks!==String(U+F)&&(de.dataset.drawnLinks=String(U+F)),de.dataset.linkMode!==W.links&&(de.dataset.linkMode=W.links),de.dataset.parentEdges!==String(J)&&(de.dataset.parentEdges=String(J)),de.dataset.activityPackets!==String(ae)&&(de.dataset.activityPackets=String(ae)),de.dataset.formation!==W.formation&&(de.dataset.formation=W.formation),de.dataset.groupShells!=="0"&&(de.dataset.groupShells="0"),de.dataset.syntheticGroupHubs!=="0"&&(de.dataset.syntheticGroupHubs="0"),de.dataset.nodeGroupHubs!==String(V.size)&&(de.dataset.nodeGroupHubs=String(V.size)),He.visible=Ft>=0&&s(Ie[Ft])&&De.scales[Ft]>.15,Ft>=0){let K=Ie[Ft],oe=N[Ft];He.position.set(oe.x,oe.y,oe.z),He.scale.setScalar(K.radius*1.18)}Gs.updateLabels(ut,N,dn,W.layout,De.entrance.total?De.entrance.revealed/De.entrance.total:1,De.scales,De.groupParents)}ie("graph-counts").textContent=`${Ie.length.toLocaleString("en-AU")} nodes \xB7 ${f.length.toLocaleString("en-AU")} links`,ie("loading").hidden=!0,ie("graph-stage").dataset.ready="true",ie("graph-stage").dataset.nodes=String(Ie.length),ie("graph-stage").dataset.links=String(f.length),Object.assign(ie("graph-stage").dataset,{starAsset:"Blender 5.2.1 mesh and Fog Glow",starVertices:String(l.geometry.attributes.position.count)}),Object.assign(ie("graph-stage").dataset,{layout:W.layout,environment:"world-space",backgroundStars:String(o[6].positions.length/3)}),z(!1),ie("replay-entrance").disabled=!1,Xr();let Ii=new Us;Ii.connect(document),Ws=new rc(performance.now(),{idleMs:zr.idleMs,fps:zr.activeFps});let es=new Set,ts=0,Zs=0;function Ks(){!Vs&&!document.hidden&&(Vs=requestAnimationFrame(pc))}Wn=()=>{let P=performance.now(),ee=Ws.touch(P);(ee||!Vs)&&(Ii.reset(),Ws.nextFrame=P,lc=P,ac=0,Ot=!0,De.configure({visible:!document.hidden})),ie("graph-stage").dataset.renderState=document.hidden?"hidden":"active",ee&&(ie("motion-status").textContent=W.paused?"Motion paused":"Motion on"),Ks()};let qr={capture:!0,passive:!0};for(let P of["pointermove","pointerenter","wheel","keydown","input","change"])document.addEventListener(P,Wn,qr);document.addEventListener("pointerdown",P=>{es.add(P.pointerId),Wn()},qr);for(let P of["pointerup","pointercancel"])window.addEventListener(P,ee=>{es.delete(ee.pointerId),Wn()},qr);window.addEventListener("blur",()=>es.clear()),window.addEventListener("focus",Wn),Object.assign(ie("graph-stage").dataset,{renderState:"active",idleAfterSeconds:String(zr.idleMs/1e3),frameLimit:String(zr.activeFps),pixelRatio:String(bt.getPixelRatio()),renderedFrames:"0",renderTicks:"0"}),Lh=P=>{P?.type==="open-method-surface"&&(zt=P.interactive!==!1,document.body.classList.toggle("open-method-ambient",!zt),ie("graph-stage").dataset.openMethodInteractive=String(zt),Oe(P.focus),Wn())},Ih&&Lh(Ih);function pc(P){if(Vs=0,document.hidden)return;if(Zs++,Ws.checkIdle(P,Kt||!!jt||Qi||es.size>0||!!st)){De.configure({visible:!1}),Object.assign(ie("graph-stage").dataset,{renderState:"idle",fps:"0",renderedFrames:String(ts),renderTicks:String(Zs),environmentTime:Pi.time.toFixed(3)}),ie("motion-status").textContent="Idle \xB7 image held to save GPU";return}if(Ks(),!Ws.frameDue(P))return;Ii.update(P);let ee=Math.min(.05,Ii.getDelta());if(st){let J=Math.min(1,(P-st.started)/st.duration),ae=1-Math.pow(1-J,3);ut.position.lerpVectors(st.fromPosition,st.toPosition,ae),Ye.target.lerpVectors(st.fromTarget,st.toTarget,ae),Ot=!0,J>=1&&(st=null,Ye.update(),hn(),zt||(Ws.lastActivity=P-zr.idleMs+900))}let v=!W.paused&&!$n.matches&&W.layout==="atlas"&&W.formation==="sphere";if(v&&(ne+=ee*W.speed),Math.abs(xt)>1e-5){let J=xt*(1-Math.exp(-ee/.065)),ae=ut.position.clone().sub(Ye.target),he=ae.length(),de=Math.max(Ye.minDistance,Math.min(Ye.maxDistance,he*Math.exp(J)));he>0&&ut.position.copy(Ye.target).add(ae.multiplyScalar(de/he)),ie("graph-stage").dataset.zoomDistance=de.toFixed(3),xt-=J,Ot=!0,(Math.abs(xt)<=1e-5||de===Ye.minDistance||de===Ye.maxDistance)&&(xt=0,x())}De.sample(P)&&(Ot=!0);let L=Pi.update(ee,W,!W.paused&&!$n.matches);Ye.update(ee);let U=De.entrance,F=U.active&&W.paused,O=U.active?F?"Reveal paused":U.phase==="settling"?"Stars settling into place":`Revealing ${U.revealed.toLocaleString("en-AU")} of ${U.total.toLocaleString("en-AU")}`:$n.matches?"Reduced motion \xB7 all stars shown":"";if(ie("entrance-status").textContent!==O&&(ie("entrance-status").textContent=O),ie("skip-entrance").hidden===U.active&&(ie("skip-entrance").hidden=!U.active),Object.assign(ie("graph-stage").dataset,{entrance:U.phase,revealed:String(U.revealed),entranceTime:String(U.elapsed??0)}),(Ot||Ye.autoRotate||L||v)&&(Xr(),Pi.prepareRender(bt,ut),W.background==="horizon"||W.background==="planetary"?y.render():bt.render(m,ut),ac++,ts++,Ot=!1),P-lc>=1500){let J=Math.round(ac*1e3/(P-lc)),ae=De.clearance();ie("graph-stage").dataset.activeFps=String(J),ie("motion-status").textContent=W.paused&&!Kt?"Motion paused":`Motion on \xB7 ${J} fps`;let he=ie("collision-status");if(he.textContent="Solid sphere collisions on",Object.assign(he.dataset,{overlaps:String(ae.overlaps),maxPenetration:String(ae.maxPenetration),physicsMs:ae.physicsMs.toFixed(2)}),Object.assign(ie("graph-stage").dataset,{fps:String(J),drawCalls:String(bt.info.render.calls),physicalSprings:String(De.jointCount),camera:ut.position.toArray().join(","),steps:String(De.steps),environmentTime:Pi.time.toFixed(3),renderedFrames:String(ts),renderTicks:String(Zs),auraFieldCache:String(Pi.fieldCacheActive)}),Ft>=0){let de=Ie[Ft];Object.assign(ie("node-info").dataset,{x:de.x.toFixed(3),y:de.y.toFixed(3),z:de.z.toFixed(3),pinned:String(de.pinned)})}ac=0,lc=P}}Ks(),document.addEventListener("visibilitychange",()=>{hn(),document.hidden?(cancelAnimationFrame(Vs),Vs=0,es.clear(),De.configure({visible:!1}),ie("graph-stage").dataset.renderState="hidden"):Wn()}),window.addEventListener("pagehide",()=>{hn(),De.dispose()}),window.addEventListener("pageshow",P=>{P.persisted&&location.reload()})}vy().catch(cc);})();
