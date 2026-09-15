(()=>{var Rp=Object.defineProperty;var Cp=(i,e)=>{for(var t in e)Rp(i,t,{get:e[t],enumerable:!0})};var ht=i=>document.getElementById(i),Nh={agent:"Agent",builtin:"Compact Hermes memory",fact:"Saved memory",observation:"Reported conversation",summary:"Model-generated summary","graph-node":"Stored graph entity","graph-edge":"Stored graph assertion","memory-relation":"Stored memory relationship",lesson:"Model-extracted lesson",crystal:"Consolidated summary",semantic:"Semantic memory record",procedure:"Procedural memory record",session:"Session record",note:"Obsidian note",mirror:"Generated mirror",archive:"Archived note","test-note":"Integration test note"},Pp={loads_memory:"loads compact memory",recorded_in:"recorded in session",mirrors:"mirrors this record",links_to:"links to",guided_to:"guided to",relationship_sources:"relationship evidence",conflicts_with:"conflicts with",maintains:"maintains",describes:"describes",supports:"supports",derived_from:"extraction input",summary_input:"covered summary input",excluded_summary_input:"excluded from summary",previous_version:"previous version",supersedes_record:"supersedes stored version",recorded_related_id:"recorded related ID",relationship_source:"relationship source",relationship_target:"relationship target"},Je=(i,e,t)=>{let n=document.createElement(i);return e!==void 0&&(n.textContent=e),t&&(n.className=t),n},Yr=i=>new Intl.DateTimeFormat("en-AU",{dateStyle:"medium",timeStyle:"short",timeZone:"Australia/Brisbane"}).format(new Date(i))+" Brisbane";function Ip(i={}){let e=i.currentAttempt||i.lastQuotaEvent,t=(r,o=!1)=>{let a=o?"Historical model result:":"Model processing: the last recorded",l=r.provider||"provider",c=r.model?` (${r.model})`:"",u=r.observedAt&&Number.isFinite(Date.parse(r.observedAt))?`, ${Yr(r.observedAt)}`:"";return r.lastAttemptStatus==="passed"?`${a} ${l}${c} request passed${u}. This records that request, not current quota or unlimited availability.`:r.httpStatus===429||String(r.lastAttemptStatus||"").includes("quota")?`${a} ${l}${c} request reached its quota${r.httpStatus?` (HTTP ${r.httpStatus})`:""}${u}. ${r.summarySavedByAttempt===!1?"That attempt saved no summary. ":""}This is the recorded outcome, not a new model probe.`:`${a} ${l}${c} request has status ${r.lastAttemptStatus||"unrecorded"}${u}. API connectivity does not confirm model availability.`},n=[e?t(e):"Model processing has no separate verified request result in this snapshot."],s=i.derivedRebuild;if(s?.status==="passed"){let r=Number(s.summaries)||0,o=new Set(s.graph?.sourceObservationIds||[]).size;n.push(`Reviewed history backfill completed: ${r} session summar${r===1?"y":"ies"}${o?`; graph extraction covered ${o} verified historical observations`:""}. See individual records for coverage and uncertainty.`)}return{message:n.join(" "),history:(i.historicalEvents||[]).map(r=>t(r,!0))}}function Lp(i){if(!["graph-node","graph-edge"].includes(i.kind))return[];let e=i.confidenceScore,t=typeof e=="number"&&Number.isFinite(e)&&e>=0&&e<=1?[`Recorded confidence: ${e}. This stored score is not an independently verified probability that the claim is true.`]:["Confidence not recorded."];return i.providerWeight!=null&&t.push(`Relationship weight: ${typeof i.providerWeight=="object"?JSON.stringify(i.providerWeight):i.providerWeight}. This is not a truth probability.`),t}function Fh(i,e){let t=i.inventory,n=new Map(i.nodes.map(M=>[M.id,M])),s=new Map(i.nodes.map(M=>[M.id,[]]));i.edges.forEach(M=>{s.get(M.from).push({to:M.to,e:M,reverse:!1}),s.get(M.to).push({to:M.from,e:M,reverse:!0})});let r=new Set(i.nodes.filter(M=>M.kind==="agent").map(M=>M.id));for(let M of[...r])for(let B of s.get(M))r.add(B.to);let o="all",a=["fact","observation","summary","lesson","crystal","semantic","procedure"],l=["graph-node","graph-edge","memory-relation"],c=M=>o==="all"||o==="knowledge"&&["note","builtin"].includes(M.kind)||o==="recall"&&a.includes(M.kind)||o==="graph"&&l.includes(M.kind)||o==="team"&&r.has(M.id)||o===M.kind,u=()=>{let M=i.nodes.filter(c).length,B=i.edges.filter(V=>c(n.get(V.from))&&c(n.get(V.to))).length;ht("graph-counts").textContent=o==="all"?`${i.nodes.length} nodes \xB7 ${i.edges.length} links`:`Showing ${M} of ${i.nodes.length} nodes \xB7 ${B} links`,ht("graph-stage").dataset.visibleNodes=String(M)},d=M=>t.counts[M]||0;ht("record-scope").options[0].textContent=`Everything \xB7 ${i.nodes.length} nodes`;let h=[],p=Je("table");p.className="inventory-table";for(let[M,B]of[["Saved memory records",d("fact")],["Conversation observations",d("observation")],["Model summaries",d("summary")],["Obsidian notes",d("note")],["Compact memory entries",t.builtinEntries]]){let V=Je("tr");V.append(Je("th",M),Je("td",B.toLocaleString("en-AU"))),p.append(V)}ht("memory-inventory").append(p,Je("p",`${d("graph-node")} saved graph entities, ${d("graph-edge")} graph relationship records and ${d("memory-relation")} memory relationship records. ${t.builtinEntries} compact entries live in ${t.builtinFiles} profile memory files.`,"small muted")),t.memoryVersionCounts&&ht("memory-inventory").append(Je("p",`Saved memory versions: ${t.memoryVersionCounts.current} current, ${t.memoryVersionCounts.historical} historical${t.memoryVersionCounts.unspecified?", "+t.memoryVersionCounts.unspecified+" without a recorded version status":""}.`,"small muted"));function g(M){ht("connection-label").textContent=M.connected?"Memory API connected":"Memory API unavailable",ht("connection-panel").classList.toggle("connected",!!M.connected),ht("connection-detail").textContent=M.connected?"The local health and record-count requests both succeeded. This graph still shows its captured snapshot.":`Saved memories are readable, but the live API returned ${M.checks.map(B=>B.status??B.error).join(" / ")}. This view uses the saved store.`,ht("connection-time").textContent="Checked "+Yr(M.checkedAt),ht("connection-panel").dataset.connected=String(M.connected);for(let{cell:B,profile:V}of h)B.textContent=V.provider==="agentmemory"?M.connected?"Selected; connected":"Selected; unavailable":V.provider||"Built-in only"}g(t.connection);let y=Ip(t.modelProcessing),v=y.message;ht("connection-panel").append(Je("p",v,"small muted")),ht("check-connection").onclick=async()=>{let M=ht("check-connection");M.disabled=!0,M.textContent="Checking\u2026";try{let B=await fetch("./api/connection",{cache:"no-store"});if(!B.ok)throw new Error("Preview server returned "+B.status);g(await B.json())}catch(B){ht("connection-detail").textContent="Connection check could not finish. "+B.message}finally{M.disabled=!1,M.textContent="Check live connection"}};let m=M=>{c(n.get(M))||(o="all",ht("record-scope").value="all",e.refresh(),u()),e.selectNode(M),ht("node-info").scrollIntoView({block:"nearest",behavior:"auto"})};ht("record-scope").addEventListener("change",()=>{o=ht("record-scope").value,ht("search").value="",e.refresh(),u()});let E=Je("table");E.className="team-table";let L=Je("tr");["Agent","Entries","Provider"].forEach(M=>L.append(Je("th",M))),E.append(L),t.profiles.forEach(M=>{let B=Je("tr"),V=Je("td"),H=Je("button",M.name),X=Je("td");H.onclick=()=>m("agent:"+M.name),V.append(H),B.append(V,Je("td",M.memoryEntries),X),h.push({cell:X,profile:M}),E.append(B)}),g(t.connection);let b=t.profiles.filter(M=>M.sharedReference==="Obsidian Home").map(M=>M.name);ht("team-access").append(E,Je("p",`${b.length?b.join(", "):"No profiles"} have a saved Obsidian reference in SOUL.md. This checks stored instructions, not whether a particular model conversation has loaded a note.`,"small muted"));let A=Je("p",`Exact Hermes history remains separate: ${t.profiles.reduce((M,B)=>M+(B.history.find(V=>V.kind==="sessions")?.count||0),0).toLocaleString("en-AU")} persisted sessions across ${t.profiles.length} profiles. These are not counted as saved memory records.`,"small muted");ht("team-access").append(A);let T=Je("table");T.className="team-table";for(let M of t.profiles){let B=Je("tr");B.append(Je("th",M.name),Je("td",`${M.history.find(V=>V.kind==="sessions")?.count||0} sessions`),Je("td",`${(M.history.find(V=>V.kind==="messages")?.count||0).toLocaleString("en-AU")} messages`)),T.append(B)}ht("team-access").append(T);let P=ht("source-checks");P.append(Je("p","Captured "+Yr(t.capturedAt),"small"),Je("p",`${d("mirror")} generated mirror files, ${d("session")} AgentMemory sessions, ${d("agent")} agents, ${d("archive")} archived notes and ${d("test-note")} test notes are counted separately.`,"small muted"),Je("p","One Obsidian file is counted as one note even when it contains many observations. The graph never adds a mirrored copy to the original record count.","small muted"),Je("p","Source, session and mirror links are bookkeeping. Named note assertions and saved semantic relationships remain unverified claims. Inferred graph relationships are labelled separately; their saved weights are not truth probabilities.","small muted"),Je("p","Newest dated AgentMemory record: "+(t.latestProviderRecord?Yr(t.latestProviderRecord):"none captured")+". Newest generated mirror file: "+(t.latestMirrorFile?Yr(t.latestMirrorFile):"none captured")+".","small muted"));let _={historical_recovered_conversation:"Recovered historical conversations",legacy_recovery_pending:"Legacy fragments awaiting reviewed recovery",legacy_timestamp_conflict:"Legacy fragments with timestamp conflicts",legacy_unmatched_conversation:"Legacy fragments without a unique source turn",legacy_clipped_conversation:"Legacy clipped conversations",scheduled_job_wrapper:"Scheduled-job wrappers",automatic_delegation_completion:"Automatic completion notices",automatic_delegation_batch_completion:"Automatic batch completion notices",integration_test:"Historical integration-test observations",captured_conversation:"New captured conversations",bounded_conversation_capture:"Captures reaching the text limit",recovery_unverified:"Recovery records needing verification",model_summary:"Model summaries",model_summary_partial:"Model summaries with excluded inputs"};P.append(Je("h3","Saved content quality")),P.append(Je("p",v,"small muted"));for(let M of y.history)P.append(Je("p",M,"small muted"));for(let[M,B]of Object.entries(_)){let V=t.qualityCounts?.[M]||0;V&&P.append(Je("p",`${B}: ${V}`,"small muted"))}P.append(Je("p","Recovered text restores historical user requests and assistant claims. It does not prove that the assistant completed the work. Legacy noise remains visible with its original IDs.","small muted")),P.append(Je("h3",`${t.issues.length} source reference issue${t.issues.length===1?"":"s"}`));for(let M of t.issues)P.append(Je("p",`${M.detail} \xB7 ${M.source.split(/[\\/]/).pop()}:${M.line||""}`,"small muted"));P.append(Je("h3","What Graphify adds"),Je("p","Graphify has built this snapshot into a queryable graph. Its path and explain commands can follow these connections. Agents would need an explicit retrieval tool or skill and instructions to use it; this preview does not install that integration. This view imports existing native semantic assertions with their source IDs and uncertainty; it performs no new semantic inference.","small muted"));let C=[...i.nodes].sort((M,B)=>M.label.localeCompare(B.label));for(let M of["path-from","path-to"])for(let B of C){let V=Je("option",`${B.label} \xB7 ${Nh[B.kind]||B.kind}`);V.value=B.id,ht(M).append(V)}ht("path-from").value="agent:Kiwi",ht("path-to").value="vault:Projects/Memory Architecture - Hermes and Obsidian.md";let U=M=>(Pp[M.relation]||M.relation)+(M.edgeClass==="inferred_graph_assertion"?" \xB7 inferred / unverified":M.edgeClass==="stored_memory_assertion"?" \xB7 stored assertion":M.edgeClass==="note_assertion"?" \xB7 source assertion":"");function I(){let M=ht("path-from").value,B=ht("path-to").value,V=new Map([[M,null]]),H=[M];for(let le=0;le<H.length&&!V.has(B);le++)for(let fe of s.get(H[le]))V.has(fe.to)||(V.set(fe.to,{prev:H[le],...fe}),H.push(fe.to));let X=ht("path-result");if(X.replaceChildren(),!V.has(B)){X.append(Je("p","No recorded path exists between these records in this snapshot.")),X.dataset.hops="none";return}let q=[],ne=B;for(;ne!==M;){let le=V.get(ne);q.unshift({id:ne,...le}),ne=le.prev}X.dataset.hops=String(q.length),X.append(Je("p",`${q.length} recorded connection${q.length===1?"":"s"}. Direction and assertion status are shown at each step.`,"small muted"));let ae=Je("button",n.get(M).label);ae.onclick=()=>m(M),X.append(ae);for(let le of q){let fe=Je("p",`${le.reverse?"\u2190":"\u2192"} ${U(le.e)}${le.e.line?" \xB7 source line "+le.e.line:""}`,"path-edge");fe.title=le.e.evidence+(le.e.sourceRecordId?" \xB7 native record "+le.e.sourceRecordId:"")+(le.e.sourceObservationIds?.length?" \xB7 extraction inputs: "+le.e.sourceObservationIds.join(", "):"");let Ee=Je("button",n.get(le.id).label);Ee.onclick=()=>m(le.id),X.append(fe,Ee)}}return ht("trace-path").onclick=I,ht("trace-kiwi").onclick=()=>{ht("path-from").value="agent:Kiwi",ht("path-to").value="vault:Projects/Memory Architecture - Hermes and Obsidian.md",I()},{visible:c,scope:()=>o,kindName:M=>Nh[M]||M,describe(M){ht("node-source").textContent=M.source;let B=[];M.qualityStatus&&B.push(_[M.qualityStatus]||M.inferenceStatus||M.qualityStatus),M.agent&&M.agent!=="Unattributed"&&B.push(`Source profile: ${M.agent}${M.agentIdSource?" ("+M.agentIdSource+")":""}`),M.coverage&&B.push(`Summary coverage: ${M.coverage.covered??"unrecorded"}${M.coverage.eligible!=null?" of "+M.coverage.eligible:""}; excluded inputs: ${M.coverage.skippedSourceObservationIds.length}. ${M.coverage.sourceIdsRecorded?"Exact supplied input IDs are recorded.":"Exact historical input IDs were not stored."}`),M.metadata?.sourceObservationIds?.length&&B.push(`Recorded extraction inputs: ${M.metadata.sourceObservationIds.length}. These IDs trace input provenance, not proof that every input supports every claim.`),B.push(...Lp(M)),M.qualityReason&&B.push(M.qualityReason),M.recoveryVerification&&B.push(M.recoveryVerification);let V=M.content.length>1800?M.content.slice(0,1800)+`

Continue in the complete source text.`:M.content;ht("node-detail").textContent=(B.length?B.join(`
`)+`

`:"")+V,ht("open-source").href="./source?node="+encodeURIComponent(M.id)},connectionLabel(M,B){return[...new Set(s.get(M).filter(V=>V.to===B).map(V=>(V.reverse?"\u2190 ":"\u2192 ")+U(V.e)))].join("; ")}}}var ds={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},fs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},yd=0,iu=1,bd=2;var Eo=1,Md=2,wr=3,On=0,tn=1,kt=2,In=0,zn=1,cn=2,su=3,ru=4,Sd=5;var cs=100,Ed=101,Td=102,wd=103,Ad=104,Rd=200,Cd=201,Pd=202,Id=203,Ma=204,Sa=205,Ld=206,Dd=207,Nd=208,Fd=209,Ud=210,Od=211,zd=212,Bd=213,kd=214,Ea=0,Ta=1,wa=2,ws=3,Aa=4,Ra=5,Ca=6,Pa=7,ou=0,Hd=1,Vd=2,oi=0,To=1,wo=2,Ao=3,Ro=4,Co=5,Po=6,Io=7,Gc="attached",Gd="detached",au=300,ps=301,Os=302,Za=303,Ka=304,Lo=306,An=1e3,Yn=1001,hr=1002,Gt=1003,ja=1004;var zs=1005;var yt=1006,Ar=1007;var ai=1008;var gn=1009,lu=1010,cu=1011,Rr=1012,$a=1013,li=1014,Bn=1015,un=1016,Ja=1017,Qa=1018,Cr=1020,uu=35902,hu=35899,du=1021,fu=1022,kn=1023,mi=1026,ms=1027,el=1028,tl=1029,vn=1030,nl=1031;var il=1033,Do=33776,No=33777,Fo=33778,Uo=33779,sl=35840,rl=35841,ol=35842,al=35843,ll=36196,cl=37492,ul=37496,hl=37488,dl=37489,Oo=37490,fl=37491,pl=37808,ml=37809,gl=37810,vl=37811,xl=37812,_l=37813,yl=37814,bl=37815,Ml=37816,Sl=37817,El=37818,Tl=37819,wl=37820,Al=37821,Rl=36492,Cl=36494,Pl=36495,Il=36283,Ll=36284,zo=36285,Dl=36286;var As=2300,Rs=2301,ba=2302,Wc=2303,Xc=2400,qc=2401,Yc=2402,Wd=2500;var pu=0,Bo=1,Pr=2,Xd=3200;var Nl=0,qd=1,Ki="",Vt="srgb",Mn="srgb-linear",so="linear",vt="srgb";var Es=7680;var Zc=519,Yd=512,Zd=513,Kd=514,Fl=515,jd=516,$d=517,Ul=518,Jd=519,Ia=35044,Ei=35048;var mu="300 es",ii=2e3,dr=2001;function Dp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Np(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function fr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Qd(){let i=fr("canvas");return i.style.display="block",i}var Uh={},pr=null;function ro(...i){let e="THREE."+i.shift();pr?pr("log",e,...i):console.log(e,...i)}function ef(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ue(...i){i=ef(i);let e="THREE."+i.shift();if(pr)pr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ge(...i){i=ef(i);let e="THREE."+i.shift();if(pr)pr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ts(...i){let e=i.join(" ");e in Uh||(Uh[e]=!0,Ue(...i))}function tf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var nf={[Ea]:Ta,[wa]:Ca,[Aa]:Pa,[ws]:Ra,[Ta]:Ea,[Ca]:wa,[Pa]:Aa,[Ra]:ws},ri=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Oh=1234567,no=Math.PI/180,Cs=180/Math.PI;function si(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]+"-"+dn[e&255]+dn[e>>8&255]+"-"+dn[e>>16&15|64]+dn[e>>24&255]+"-"+dn[t&63|128]+dn[t>>8&255]+"-"+dn[t>>16&255]+dn[t>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function gu(i,e){return(i%e+e)%e}function Fp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Up(i,e,t){return i!==e?(t-i)/(e-i):0}function io(i,e,t){return(1-t)*i+t*e}function Op(i,e,t,n){return io(i,e,1-Math.exp(-t*n))}function zp(i,e=1){return e-Math.abs(gu(i,e*2)-e)}function Bp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function kp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Hp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Vp(i,e){return i+Math.random()*(e-i)}function Gp(i){return i*(.5-Math.random())}function Wp(i){i!==void 0&&(Oh=i);let e=Oh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Xp(i){return i*no}function qp(i){return i*Cs}function Yp(i){return(i&i-1)===0&&i!==0}function Zp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Kp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:Ue("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ni(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function At(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ji={DEG2RAD:no,RAD2DEG:Cs,generateUUID:si,clamp:nt,euclideanModulo:gu,mapLinear:Fp,inverseLerp:Up,lerp:io,damp:Op,pingpong:zp,smoothstep:Bp,smootherstep:kp,randInt:Hp,randFloat:Vp,randFloatSpread:Gp,seededRandom:Wp,degToRad:Xp,radToDeg:qp,isPowerOfTwo:Yp,ceilPowerOfTwo:Zp,floorPowerOfTwo:Kp,setQuaternionFromProperEuler:jp,normalize:At,denormalize:ni},_e=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ot=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],p=r[o+1],g=r[o+2],y=r[o+3];if(d!==y||l!==h||c!==p||u!==g){let v=l*h+c*p+u*g+d*y;v<0&&(h=-h,p=-p,g=-g,y=-y,v=-v);let m=1-a;if(v<.9995){let E=Math.acos(v),L=Math.sin(E);m=Math.sin(m*E)/L,a=Math.sin(a*E)/L,l=l*m+h*a,c=c*m+p*a,u=u*m+g*a,d=d*m+y*a}else{l=l*m+h*a,c=c*m+p*a,u=u*m+g*a,d=d*m+y*a;let E=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=E,c*=E,u*=E,d*=E}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],h=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*d+l*p-c*h,e[t+1]=l*g+u*h+c*d-a*p,e[t+2]=c*g+u*p+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),h=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"YZX":this._x=h*u*d+c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d-h*p*g;break;case"XZY":this._x=h*u*d-c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d+h*p*g;break;default:Ue("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>d){let p=2*Math.sqrt(1+n-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){let p=2*Math.sqrt(1+a-n-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+d-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vc.copy(this).projectOnVector(e),this.sub(vc)}reflect(e){return this.sub(vc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vc=new D,zh=new Ot,Ye=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],p=n[5],g=n[8],y=s[0],v=s[3],m=s[6],E=s[1],L=s[4],b=s[7],A=s[2],T=s[5],P=s[8];return r[0]=o*y+a*E+l*A,r[3]=o*v+a*L+l*T,r[6]=o*m+a*b+l*P,r[1]=c*y+u*E+d*A,r[4]=c*v+u*L+d*T,r[7]=c*m+u*b+d*P,r[2]=h*y+p*E+g*A,r[5]=h*v+p*L+g*T,r[8]=h*m+p*b+g*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,p=c*r-o*l,g=t*d+n*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=d*y,e[1]=(s*c-u*n)*y,e[2]=(a*n-s*o)*y,e[3]=h*y,e[4]=(u*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=p*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(xc.makeScale(e,t)),this}rotate(e){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(xc.makeRotation(-e)),this}translate(e,t){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(xc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xc=new Ye,Bh=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kh=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $p(){let i={enabled:!0,workingColorSpace:Mn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===vt&&(s.r=Oi(s.r),s.g=Oi(s.g),s.b=Oi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===vt&&(s.r=ur(s.r),s.g=ur(s.g),s.b=ur(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ki?so:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Mn]:{primaries:e,whitePoint:n,transfer:so,toXYZ:Bh,fromXYZ:kh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:e,whitePoint:n,transfer:vt,toXYZ:Bh,fromXYZ:kh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}}),i}var et=$p();function Oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ur(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var js,La=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{js===void 0&&(js=fr("canvas")),js.width=e.width,js.height=e.height;let s=js.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=js}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=fr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Oi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Oi(t[n]/255)*255):t[n]=Oi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Jp=0,mr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=si(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(_c(s[o].image)):r.push(_c(s[o]))}else r=_c(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function _c(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?La.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ue("Texture: Unable to serialize Texture."),{})}var Qp=0,yc=new D,ln=class i extends ri{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Yn,s=Yn,r=yt,o=ai,a=kn,l=gn,c=i.DEFAULT_ANISOTROPY,u=Ki){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=si(),this.name="",this.source=new mr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(yc).x}get height(){return this.source.getSize(yc).y}get depth(){return this.source.getSize(yc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ue(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==au)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case An:e.x=e.x-Math.floor(e.x);break;case Yn:e.x=e.x<0?0:1;break;case hr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case An:e.y=e.y-Math.floor(e.y);break;case Yn:e.y=e.y<0?0:1;break;case hr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=au;ln.DEFAULT_ANISOTROPY=1;var dt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],p=l[5],g=l[9],y=l[2],v=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-v)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+v)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let L=(c+1)/2,b=(p+1)/2,A=(m+1)/2,T=(u+h)/4,P=(d+y)/4,_=(g+v)/4;return L>b&&L>A?L<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(L),s=T/n,r=P/n):b>A?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=_/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=P/r,s=_/r),this.set(n,s,r,t),this}let E=Math.sqrt((v-g)*(v-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(E)<.001&&(E=1),this.x=(v-g)/E,this.y=(d-y)/E,this.z=(h-u)/E,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Da=class extends ri{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new ln(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new mr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Wt=class extends Da{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},oo=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var gr=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ke=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,l,c,u,d,h,p,g,y,v){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,d,h,p,g,y,v)}set(e,t,n,s,r,o,a,l,c,u,d,h,p,g,y,v){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=h,m[3]=p,m[7]=g,m[11]=y,m[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/$s.setFromMatrixColumn(e,0).length(),r=1/$s.setFromMatrixColumn(e,1).length(),o=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=o*u,p=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=h-y*c,t[9]=-a*l,t[2]=y-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*u,p=l*d,g=c*u,y=c*d;t[0]=h+y*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=y+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*u,p=l*d,g=c*u,y=c*d;t[0]=h-y*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=y-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*u,p=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+y,t[1]=l*d,t[5]=y*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,p=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=y-h*d,t[8]=g*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*d+g,t[10]=h-y*d}else if(e.order==="XZY"){let h=o*l,p=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+y,t[5]=o*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*u,t[10]=y*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(em,e,tm)}lookAt(e,t,n){let s=this.elements;return Fn.subVectors(e,t),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),ns.crossVectors(n,Fn),ns.lengthSq()===0&&(Math.abs(n.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),ns.crossVectors(n,Fn)),ns.normalize(),Ko.crossVectors(Fn,ns),s[0]=ns.x,s[4]=Ko.x,s[8]=Fn.x,s[1]=ns.y,s[5]=Ko.y,s[9]=Fn.y,s[2]=ns.z,s[6]=Ko.z,s[10]=Fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],p=n[13],g=n[2],y=n[6],v=n[10],m=n[14],E=n[3],L=n[7],b=n[11],A=n[15],T=s[0],P=s[4],_=s[8],C=s[12],U=s[1],I=s[5],M=s[9],B=s[13],V=s[2],H=s[6],X=s[10],q=s[14],ne=s[3],ae=s[7],le=s[11],fe=s[15];return r[0]=o*T+a*U+l*V+c*ne,r[4]=o*P+a*I+l*H+c*ae,r[8]=o*_+a*M+l*X+c*le,r[12]=o*C+a*B+l*q+c*fe,r[1]=u*T+d*U+h*V+p*ne,r[5]=u*P+d*I+h*H+p*ae,r[9]=u*_+d*M+h*X+p*le,r[13]=u*C+d*B+h*q+p*fe,r[2]=g*T+y*U+v*V+m*ne,r[6]=g*P+y*I+v*H+m*ae,r[10]=g*_+y*M+v*X+m*le,r[14]=g*C+y*B+v*q+m*fe,r[3]=E*T+L*U+b*V+A*ne,r[7]=E*P+L*I+b*H+A*ae,r[11]=E*_+L*M+b*X+A*le,r[15]=E*C+L*B+b*q+A*fe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],y=e[7],v=e[11],m=e[15],E=l*p-c*h,L=a*p-c*d,b=a*h-l*d,A=o*p-c*u,T=o*h-l*u,P=o*d-a*u;return t*(y*E-v*L+m*b)-n*(g*E-v*A+m*T)+s*(g*L-y*A+m*P)-r*(g*b-y*T+v*P)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-n*(r*u-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],y=e[13],v=e[14],m=e[15],E=t*a-n*o,L=t*l-s*o,b=t*c-r*o,A=n*l-s*a,T=n*c-r*a,P=s*c-r*l,_=u*y-d*g,C=u*v-h*g,U=u*m-p*g,I=d*v-h*y,M=d*m-p*y,B=h*m-p*v,V=E*B-L*M+b*I+A*U-T*C+P*_;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/V;return e[0]=(a*B-l*M+c*I)*H,e[1]=(s*M-n*B-r*I)*H,e[2]=(y*P-v*T+m*A)*H,e[3]=(h*T-d*P-p*A)*H,e[4]=(l*U-o*B-c*C)*H,e[5]=(t*B-s*U+r*C)*H,e[6]=(v*b-g*P-m*L)*H,e[7]=(u*P-h*b+p*L)*H,e[8]=(o*M-a*U+c*_)*H,e[9]=(n*U-t*M-r*_)*H,e[10]=(g*T-y*b+m*E)*H,e[11]=(d*b-u*T-p*E)*H,e[12]=(a*C-o*I-l*_)*H,e[13]=(t*I-n*C+s*_)*H,e[14]=(y*L-g*A-v*E)*H,e[15]=(u*A-d*L+h*E)*H,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,p=r*u,g=r*d,y=o*u,v=o*d,m=a*d,E=l*c,L=l*u,b=l*d,A=n.x,T=n.y,P=n.z;return s[0]=(1-(y+m))*A,s[1]=(p+b)*A,s[2]=(g-L)*A,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(h+m))*T,s[6]=(v+E)*T,s[7]=0,s[8]=(g+L)*P,s[9]=(v-E)*P,s[10]=(1-(h+y))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=$s.set(s[0],s[1],s[2]).length(),a=$s.set(s[4],s[5],s[6]).length(),l=$s.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Qn.copy(this);let c=1/o,u=1/a,d=1/l;return Qn.elements[0]*=c,Qn.elements[1]*=c,Qn.elements[2]*=c,Qn.elements[4]*=u,Qn.elements[5]*=u,Qn.elements[6]*=u,Qn.elements[8]*=d,Qn.elements[9]*=d,Qn.elements[10]*=d,t.setFromRotationMatrix(Qn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=ii,l=!1){let c=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),p=(n+s)/(n-s),g,y;if(l)g=r/(o-r),y=o*r/(o-r);else if(a===ii)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===dr)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=ii,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),p=-(n+s)/(n-s),g,y;if(l)g=1/(o-r),y=o/(o-r);else if(a===ii)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===dr)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},$s=new D,Qn=new ke,em=new D(0,0,0),tm=new D(1,1,1),ns=new D,Ko=new D,Fn=new D,Hh=new ke,Vh=new Ot,Rn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vh.setFromEuler(this),this.setFromQuaternion(Vh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";var vr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},nm=0,Gh=new D,Js=new Ot,Ii=new ke,jo=new D,Zr=new D,im=new D,sm=new Ot,Wh=new D(1,0,0),Xh=new D(0,1,0),qh=new D(0,0,1),Yh={type:"added"},rm={type:"removed"},Qs={type:"childadded",child:null},bc={type:"childremoved",child:null},zt=class i extends ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Rn,n=new Ot,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ke},normalMatrix:{value:new Ye}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Js.setFromAxisAngle(e,t),this.quaternion.multiply(Js),this}rotateOnWorldAxis(e,t){return Js.setFromAxisAngle(e,t),this.quaternion.premultiply(Js),this}rotateX(e){return this.rotateOnAxis(Wh,e)}rotateY(e){return this.rotateOnAxis(Xh,e)}rotateZ(e){return this.rotateOnAxis(qh,e)}translateOnAxis(e,t){return Gh.copy(e).applyQuaternion(this.quaternion),this.position.add(Gh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wh,e)}translateY(e){return this.translateOnAxis(Xh,e)}translateZ(e){return this.translateOnAxis(qh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ii.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jo.copy(e):jo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ii.lookAt(Zr,jo,this.up):Ii.lookAt(jo,Zr,this.up),this.quaternion.setFromRotationMatrix(Ii),s&&(Ii.extractRotation(s.matrixWorld),Js.setFromRotationMatrix(Ii),this.quaternion.premultiply(Js.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ge("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yh),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null):Ge("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rm),bc.child=e,this.dispatchEvent(bc),bc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ii.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ii.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ii),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yh),Qs.child=e,this.dispatchEvent(Qs),Qs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,e,im),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,sm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};zt.DEFAULT_UP=new D(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var an=class extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},om={type:"move"},xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let v=t.getJointPose(y,n),m=this._getHandJoint(c,y);v!==null&&(m.matrix.fromArray(v.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=v.radius),m.visible=v!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(om)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new an;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},is={h:0,s:0,l:0},$o={h:0,s:0,l:0};function Mc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Te=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=gu(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Mc(o,r,e+1/3),this.g=Mc(o,r,e),this.b=Mc(o,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=Vt){function n(r){r!==void 0&&parseFloat(r)<1&&Ue("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ue("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Vt){let n=sf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}copyLinearToSRGB(e){return this.r=ur(e.r),this.g=ur(e.g),this.b=ur(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return et.workingToColorSpace(fn.copy(this),e),Math.round(nt(fn.r*255,0,255))*65536+Math.round(nt(fn.g*255,0,255))*256+Math.round(nt(fn.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(fn.copy(this),t);let n=fn.r,s=fn.g,r=fn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(fn.copy(this),t),e.r=fn.r,e.g=fn.g,e.b=fn.b,e}getStyle(e=Vt){et.workingToColorSpace(fn.copy(this),e);let t=fn.r,n=fn.g,s=fn.b;return e!==Vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(is),this.setHSL(is.h+e,is.s+t,is.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(is),e.getHSL($o);let n=io(is.h,$o.h,t),s=io(is.s,$o.s,t),r=io(is.l,$o.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new Te;Te.NAMES=sf;var Ps=class extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ei=new D,Li=new D,Sc=new D,Di=new D,er=new D,tr=new D,Zh=new D,Ec=new D,Tc=new D,wc=new D,Ac=new dt,Rc=new dt,Cc=new dt,ls=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ei.subVectors(e,t),s.cross(ei);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ei.subVectors(s,t),Li.subVectors(n,t),Sc.subVectors(e,t);let o=ei.dot(ei),a=ei.dot(Li),l=ei.dot(Sc),c=Li.dot(Li),u=Li.dot(Sc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Di)===null?!1:Di.x>=0&&Di.y>=0&&Di.x+Di.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Di.x),l.addScaledVector(o,Di.y),l.addScaledVector(a,Di.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ac.setScalar(0),Rc.setScalar(0),Cc.setScalar(0),Ac.fromBufferAttribute(e,t),Rc.fromBufferAttribute(e,n),Cc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ac,r.x),o.addScaledVector(Rc,r.y),o.addScaledVector(Cc,r.z),o}static isFrontFacing(e,t,n,s){return ei.subVectors(n,t),Li.subVectors(e,t),ei.cross(Li).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ei.subVectors(this.c,this.b),Li.subVectors(this.a,this.b),ei.cross(Li).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;er.subVectors(s,n),tr.subVectors(r,n),Ec.subVectors(e,n);let l=er.dot(Ec),c=tr.dot(Ec);if(l<=0&&c<=0)return t.copy(n);Tc.subVectors(e,s);let u=er.dot(Tc),d=tr.dot(Tc);if(u>=0&&d<=u)return t.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(er,o);wc.subVectors(e,r);let p=er.dot(wc),g=tr.dot(wc);if(g>=0&&p<=g)return t.copy(r);let y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(tr,a);let v=u*g-p*d;if(v<=0&&d-u>=0&&p-g>=0)return Zh.subVectors(r,s),a=(d-u)/(d-u+(p-g)),t.copy(s).addScaledVector(Zh,a);let m=1/(v+y+h);return o=y*m,a=h*m,t.copy(n).addScaledVector(er,o).addScaledVector(tr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Sn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(r,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jo.copy(n.boundingBox)),Jo.applyMatrix4(e.matrixWorld),this.union(Jo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Kr),Qo.subVectors(this.max,Kr),nr.subVectors(e.a,Kr),ir.subVectors(e.b,Kr),sr.subVectors(e.c,Kr),ss.subVectors(ir,nr),rs.subVectors(sr,ir),ys.subVectors(nr,sr);let t=[0,-ss.z,ss.y,0,-rs.z,rs.y,0,-ys.z,ys.y,ss.z,0,-ss.x,rs.z,0,-rs.x,ys.z,0,-ys.x,-ss.y,ss.x,0,-rs.y,rs.x,0,-ys.y,ys.x,0];return!Pc(t,nr,ir,sr,Qo)||(t=[1,0,0,0,1,0,0,0,1],!Pc(t,nr,ir,sr,Qo))?!1:(ea.crossVectors(ss,rs),t=[ea.x,ea.y,ea.z],Pc(t,nr,ir,sr,Qo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ni=[new D,new D,new D,new D,new D,new D,new D,new D],ti=new D,Jo=new Sn,nr=new D,ir=new D,sr=new D,ss=new D,rs=new D,ys=new D,Kr=new D,Qo=new D,ea=new D,bs=new D;function Pc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){bs.fromArray(i,r);let a=s.x*Math.abs(bs.x)+s.y*Math.abs(bs.y)+s.z*Math.abs(bs.z),l=e.dot(bs),c=t.dot(bs),u=n.dot(bs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Jt=new D,ta=new _e,am=0,Rt=class extends ri{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:am++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ia,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ta.fromBufferAttribute(this,t),ta.applyMatrix3(e),this.setXY(t,ta.x,ta.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix3(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ni(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ni(t,this.array)),t}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ni(t,this.array)),t}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ni(t,this.array)),t}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ni(t,this.array)),t}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array),r=At(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ia&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var ao=class extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var lo=class extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var xt=class extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},lm=new Sn,jr=new D,Ic=new D,pn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):lm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;jr.subVectors(e,this.center);let t=jr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(jr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ic.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(jr.copy(e.center).add(Ic)),this.expandByPoint(jr.copy(e.center).sub(Ic))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},cm=0,qn=new ke,Lc=new zt,rr=new D,Un=new Sn,$r=new Sn,on=new D,bt=class i extends ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dp(e)?lo:ao)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return qn.makeRotationFromQuaternion(e),this.applyMatrix4(qn),this}rotateX(e){return qn.makeRotationX(e),this.applyMatrix4(qn),this}rotateY(e){return qn.makeRotationY(e),this.applyMatrix4(qn),this}rotateZ(e){return qn.makeRotationZ(e),this.applyMatrix4(qn),this}translate(e,t,n){return qn.makeTranslation(e,t,n),this.applyMatrix4(qn),this}scale(e,t,n){return qn.makeScale(e,t,n),this.applyMatrix4(qn),this}lookAt(e){return Lc.lookAt(e),Lc.updateMatrix(),this.applyMatrix4(Lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rr).negate(),this.translate(rr.x,rr.y,rr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new xt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Un.setFromBufferAttribute(r),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ge('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(Un.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];$r.setFromBufferAttribute(a),this.morphTargetsRelative?(on.addVectors(Un.min,$r.min),Un.expandByPoint(on),on.addVectors(Un.max,$r.max),Un.expandByPoint(on)):(Un.expandByPoint($r.min),Un.expandByPoint($r.max))}Un.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)on.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(on));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)on.fromBufferAttribute(a,c),l&&(rr.fromBufferAttribute(e,c),on.add(rr)),s=Math.max(s,n.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ge('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ge("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Rt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new D,l[_]=new D;let c=new D,u=new D,d=new D,h=new _e,p=new _e,g=new _e,y=new D,v=new D;function m(_,C,U){c.fromBufferAttribute(n,_),u.fromBufferAttribute(n,C),d.fromBufferAttribute(n,U),h.fromBufferAttribute(r,_),p.fromBufferAttribute(r,C),g.fromBufferAttribute(r,U),u.sub(c),d.sub(c),p.sub(h),g.sub(h);let I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(I),v.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(I),a[_].add(y),a[C].add(y),a[U].add(y),l[_].add(v),l[C].add(v),l[U].add(v))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let _=0,C=E.length;_<C;++_){let U=E[_],I=U.start,M=U.count;for(let B=I,V=I+M;B<V;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let L=new D,b=new D,A=new D,T=new D;function P(_){A.fromBufferAttribute(s,_),T.copy(A);let C=a[_];L.copy(C),L.sub(A.multiplyScalar(A.dot(C))).normalize(),b.crossVectors(T,C);let I=b.dot(l[_])<0?-1:1;o.setXYZW(_,L.x,L.y,L.z,I)}for(let _=0,C=E.length;_<C;++_){let U=E[_],I=U.start,M=U.count;for(let B=I,V=I+M;B<V;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);let s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,u=new D,d=new D;if(e)for(let h=0,p=e.count;h<p;h+=3){let g=e.getX(h+0),y=e.getX(h+1),v=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,v),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,v),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)on.fromBufferAttribute(e,t),on.normalize(),e.setXYZ(t,on.x,on.y,on.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),p=0,g=0;for(let y=0,v=l.length;y<v;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*u;for(let m=0;m<u;m++)h[g++]=c[p++]}return new Rt(h,u,d)}if(this.index===null)return Ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],p=e(h,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},_r=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ia,this.updateRanges=[],this.version=0,this.uuid=si()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},bn=new D,yr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.applyMatrix4(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.applyNormalMatrix(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.transformDirection(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ni(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ni(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ni(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ni(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ni(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array),r=At(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ro("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ro("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},um=0,Cn=class extends ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=si(),this.name="",this.type="Material",this.blending=zn,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=Sa,this.blendEquation=cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ue(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zn&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==cs&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new _e().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new _e().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Fi=new D,Dc=new D,na=new D,os=new D,Nc=new D,ia=new D,Fc=new D,gi=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Fi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Fi.copy(this.origin).addScaledVector(this.direction,t),Fi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Dc.copy(e).add(t).multiplyScalar(.5),na.copy(t).sub(e).normalize(),os.copy(this.origin).sub(Dc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(na),a=os.dot(this.direction),l=-os.dot(na),c=os.lengthSq(),u=Math.abs(1-o*o),d,h,p,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){let y=1/u;d*=y,h*=y,p=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Dc).addScaledVector(na,h),p}intersectSphere(e,t){Fi.subVectors(e.center,this.origin);let n=Fi.dot(this.direction),s=Fi.dot(Fi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Fi)!==null}intersectTriangle(e,t,n,s,r){Nc.subVectors(t,e),ia.subVectors(n,e),Fc.crossVectors(Nc,ia);let o=this.direction.dot(Fc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;os.subVectors(this.origin,e);let l=a*this.direction.dot(ia.crossVectors(os,ia));if(l<0)return null;let c=a*this.direction.dot(Nc.cross(os));if(c<0||l+c>o)return null;let u=-a*os.dot(Fc);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Xt=class extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=ou,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Kh=new ke,Ms=new gi,sa=new pn,jh=new D,ra=new D,oa=new D,aa=new D,Uc=new D,la=new D,$h=new D,ca=new D,pt=class extends zt{constructor(e=new bt,t=new Xt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){la.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(Uc.fromBufferAttribute(d,e),o?la.addScaledVector(Uc,u):la.addScaledVector(Uc.sub(t),u))}t.add(la)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(r),Ms.copy(e.ray).recast(e.near),!(sa.containsPoint(Ms.origin)===!1&&(Ms.intersectSphere(sa,jh)===null||Ms.origin.distanceToSquared(jh)>(e.far-e.near)**2))&&(Kh.copy(r).invert(),Ms.copy(e.ray).applyMatrix4(Kh),!(n.boundingBox!==null&&Ms.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ms)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let v=h[g],m=o[v.materialIndex],E=Math.max(v.start,p.start),L=Math.min(a.count,Math.min(v.start+v.count,p.start+p.count));for(let b=E,A=L;b<A;b+=3){let T=a.getX(b),P=a.getX(b+1),_=a.getX(b+2);s=ua(this,m,e,n,c,u,d,T,P,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let v=g,m=y;v<m;v+=3){let E=a.getX(v),L=a.getX(v+1),b=a.getX(v+2);s=ua(this,o,e,n,c,u,d,E,L,b),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let v=h[g],m=o[v.materialIndex],E=Math.max(v.start,p.start),L=Math.min(l.count,Math.min(v.start+v.count,p.start+p.count));for(let b=E,A=L;b<A;b+=3){let T=b,P=b+1,_=b+2;s=ua(this,m,e,n,c,u,d,T,P,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let v=g,m=y;v<m;v+=3){let E=v,L=v+1,b=v+2;s=ua(this,o,e,n,c,u,d,E,L,b),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}}};function hm(i,e,t,n,s,r,o,a){let l;if(e.side===tn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===On,a),l===null)return null;ca.copy(a),ca.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ca);return c<t.near||c>t.far?null:{distance:c,point:ca.clone(),object:i}}function ua(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ra),i.getVertexPosition(l,oa),i.getVertexPosition(c,aa);let u=hm(i,e,t,n,ra,oa,aa,$h);if(u){let d=new D;ls.getBarycoord($h,ra,oa,aa,d),s&&(u.uv=ls.getInterpolatedAttribute(s,a,l,c,d,new _e)),r&&(u.uv1=ls.getInterpolatedAttribute(r,a,l,c,d,new _e)),o&&(u.normal=ls.getInterpolatedAttribute(o,a,l,c,d,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new D,materialIndex:0};ls.getNormal(ra,oa,aa,h.normal),u.face=h,u.barycoord=d}return u}var Jr=new dt,Jh=new dt,Qh=new dt,dm=new dt,ed=new ke,ha=new D,Oc=new pn,td=new ke,zc=new gi,co=class extends pt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Gc,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Sn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingBox.expandByPoint(ha)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new pn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingSphere.expandByPoint(ha)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Oc.copy(this.boundingSphere),Oc.applyMatrix4(s),e.ray.intersectsSphere(Oc)!==!1&&(td.copy(s).invert(),zc.copy(e.ray).applyMatrix4(td),!(this.boundingBox!==null&&zc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,zc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new dt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Gc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Gd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ue("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Jh.fromBufferAttribute(s.attributes.skinIndex,e),Qh.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Jr.copy(t),t.set(0,0,0,0)):(Jr.set(...t,1),t.set(0,0,0)),Jr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=Qh.getComponent(r);if(o!==0){let a=Jh.getComponent(r);ed.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(dm.copy(Jr).applyMatrix4(ed),o)}}return t.isVector4&&(t.w=Jr.w),t.applyMatrix4(this.bindMatrixInverse)}},br=class extends zt{constructor(){super(),this.isBone=!0,this.type="Bone"}},vi=class extends ln{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Gt,u=Gt,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},nd=new ke,fm=new ke,uo=class i{constructor(e=[],t=[]){this.uuid=si(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ue("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:fm;nd.multiplyMatrices(a,t[r]),nd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new vi(t,e,e,kn,Bn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(Ue("Skeleton: No bone found with UUID:",r),o=new br),this.bones.push(o),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},us=class extends Rt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},or=new ke,id=new ke,da=[],sd=new Sn,pm=new ke,Qr=new pt,eo=new pn,zi=class extends pt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new us(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,pm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),sd.copy(e.boundingBox).applyMatrix4(or),this.boundingBox.union(sd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),eo.copy(e.boundingSphere).applyMatrix4(or),this.boundingSphere.union(eo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Qr.geometry=this.geometry,Qr.material=this.material,Qr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),eo.copy(this.boundingSphere),eo.applyMatrix4(n),e.ray.intersectsSphere(eo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,or),id.multiplyMatrices(n,or),Qr.matrixWorld=id,Qr.raycast(e,da);for(let o=0,a=da.length;o<a;o++){let l=da[o];l.instanceId=r,l.object=this,t.push(l)}da.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new us(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new vi(new Float32Array(s*this.count),s,this.count,el,Bn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bc=new D,mm=new D,gm=new Ye,wn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bc.subVectors(n,t).cross(mm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Bc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||gm.getNormalMatrix(e),s=this.coplanarPoint(Bc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ss=new pn,vm=new _e(.5,.5),fa=new D,Mr=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,o=new wn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ii,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],p=r[7],g=r[8],y=r[9],v=r[10],m=r[11],E=r[12],L=r[13],b=r[14],A=r[15];if(s[0].setComponents(c-o,p-u,m-g,A-E).normalize(),s[1].setComponents(c+o,p+u,m+g,A+E).normalize(),s[2].setComponents(c+a,p+d,m+y,A+L).normalize(),s[3].setComponents(c-a,p-d,m-y,A-L).normalize(),n)s[4].setComponents(l,h,v,b).normalize(),s[5].setComponents(c-l,p-h,m-v,A-b).normalize();else if(s[4].setComponents(c-l,p-h,m-v,A-b).normalize(),t===ii)s[5].setComponents(c+l,p+h,m+v,A+b).normalize();else if(t===dr)s[5].setComponents(l,h,v,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ss)}intersectsSprite(e){Ss.center.set(0,0,0);let t=vm.distanceTo(e.center);return Ss.radius=.7071067811865476+t,Ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ss)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(fa.x=s.normal.x>0?e.max.x:e.min.x,fa.y=s.normal.y>0?e.max.y:e.min.y,fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(fa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xi=class extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Na=new D,Fa=new D,rd=new ke,to=new gi,pa=new pn,kc=new D,od=new D,Is=class extends zt{constructor(e=new bt,t=new xi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Na.fromBufferAttribute(t,s-1),Fa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Na.distanceTo(Fa);e.setAttribute("lineDistance",new xt(n,1))}else Ue("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,e.ray.intersectsSphere(pa)===!1)return;rd.copy(s).invert(),to.copy(e.ray).applyMatrix4(rd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let y=p,v=g-1;y<v;y+=c){let m=u.getX(y),E=u.getX(y+1),L=ma(this,e,to,l,m,E,y);L&&t.push(L)}if(this.isLineLoop){let y=u.getX(g-1),v=u.getX(p),m=ma(this,e,to,l,y,v,g-1);m&&t.push(m)}}else{let p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=p,v=g-1;y<v;y+=c){let m=ma(this,e,to,l,y,y+1,y);m&&t.push(m)}if(this.isLineLoop){let y=ma(this,e,to,l,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ma(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Na.fromBufferAttribute(a,s),Fa.fromBufferAttribute(a,r),t.distanceSqToSegment(Na,Fa,kc,od)>n)return;kc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(kc);if(!(c<e.near||c>e.far))return{distance:c,point:od.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var ad=new D,ld=new D,Bi=class extends Is{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)ad.fromBufferAttribute(t,s),ld.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ad.distanceTo(ld);e.setAttribute("lineDistance",new xt(n,1))}else Ue("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ho=class extends Is{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},_i=class extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},cd=new ke,Kc=new gi,ga=new pn,va=new D,Zn=class extends zt{constructor(e=new bt,t=new _i){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(s),ga.radius+=r,e.ray.intersectsSphere(ga)===!1)return;cd.copy(s).invert(),Kc.copy(e.ray).applyMatrix4(cd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=h,y=p;g<y;g++){let v=c.getX(g);va.fromBufferAttribute(d,v),ud(va,v,l,s,e,t,this)}}else{let h=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=h,y=p;g<y;g++)va.fromBufferAttribute(d,g),ud(va,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ud(i,e,t,n,s,r,o){let a=Kc.distanceSqToPoint(i);if(a<t){let l=new D;Kc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var fo=class extends ln{constructor(e=[],t=ps,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var ki=class extends ln{constructor(e,t,n=li,s,r,o,a=Gt,l=Gt,c,u=mi,d=1){if(u!==mi&&u!==ms)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new mr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ua=class extends ki{constructor(e,t=li,n=ps,s,r,o=Gt,a=Gt,l,c=mi){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},po=class extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Hi=class i extends bt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new xt(c,3)),this.setAttribute("normal",new xt(u,3)),this.setAttribute("uv",new xt(d,2));function g(y,v,m,E,L,b,A,T,P,_,C){let U=b/P,I=A/_,M=b/2,B=A/2,V=T/2,H=P+1,X=_+1,q=0,ne=0,ae=new D;for(let le=0;le<X;le++){let fe=le*I-B;for(let Ee=0;Ee<H;Ee++){let it=Ee*U-M;ae[y]=it*E,ae[v]=fe*L,ae[m]=V,c.push(ae.x,ae.y,ae.z),ae[y]=0,ae[v]=0,ae[m]=T>0?1:-1,u.push(ae.x,ae.y,ae.z),d.push(Ee/P),d.push(1-le/_),q+=1}}for(let le=0;le<_;le++)for(let fe=0;fe<P;fe++){let Ee=h+fe+H*le,it=h+fe+H*(le+1),Ze=h+(fe+1)+H*(le+1),Re=h+(fe+1)+H*le;l.push(Ee,it,Re),l.push(it,Ze,Re),ne+=6}a.addGroup(p,ne,C),p+=ne,h+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Vi=class i extends bt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,p=[],g=[],y=[],v=[];for(let m=0;m<u;m++){let E=m*h-o;for(let L=0;L<c;L++){let b=L*d-r;g.push(b,-E,0),y.push(0,0,1),v.push(L/a),v.push(1-m/l)}}for(let m=0;m<l;m++)for(let E=0;E<a;E++){let L=E+c*m,b=E+c*(m+1),A=E+1+c*(m+1),T=E+1+c*m;p.push(L,b,T),p.push(b,A,T)}this.setIndex(p),this.setAttribute("position",new xt(g,3)),this.setAttribute("normal",new xt(y,3)),this.setAttribute("uv",new xt(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Gi=class i extends bt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new D,h=new D,p=[],g=[],y=[],v=[];for(let m=0;m<=n;m++){let E=[],L=m/n,b=o+L*a,A=e*Math.cos(b),T=Math.sqrt(e*e-A*A),P=0;m===0&&o===0?P=.5/t:m===n&&l===Math.PI&&(P=-.5/t);for(let _=0;_<=t;_++){let C=_/t,U=s+C*r;d.x=-T*Math.cos(U),d.y=A,d.z=T*Math.sin(U),g.push(d.x,d.y,d.z),h.copy(d).normalize(),y.push(h.x,h.y,h.z),v.push(C+P,1-L),E.push(c++)}u.push(E)}for(let m=0;m<n;m++)for(let E=0;E<t;E++){let L=u[m][E+1],b=u[m][E],A=u[m+1][E],T=u[m+1][E+1];(m!==0||o>0)&&p.push(L,b,T),(m!==n-1||l<Math.PI)&&p.push(b,A,T)}this.setIndex(p),this.setAttribute("position",new xt(g,3)),this.setAttribute("normal",new xt(y,3)),this.setAttribute("uv",new xt(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function Bs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(hd(s))s.isRenderTargetTexture?(Ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(hd(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function xn(i){let e={};for(let t=0;t<i.length;t++){let n=Bs(i[t]);for(let s in n)e[s]=n[s]}return e}function hd(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function xm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function vu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}var ci={clone:Bs,merge:xn},_m=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ym=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,at=class extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_m,this.fragmentShader=ym,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=xm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Te().setHex(s.value);break;case"v2":this.uniforms[n].value=new _e().fromArray(s.value);break;case"v3":this.uniforms[n].value=new D().fromArray(s.value);break;case"v4":this.uniforms[n].value=new dt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ye().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ke().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Sr=class extends at{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ls=class extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nl,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},mn=class extends Ls{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new _e(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Oa=class extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},za=class extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function xa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function bm(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function dd(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function Mm(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}var yi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ba=class extends yi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xc,endingEnd:Xc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case qc:r=e,a=2*t-n;break;case Yc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case qc:o=e,l=2*n-t;break;case Yc:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),y=g*g,v=y*g,m=-h*v+2*h*y-h*g,E=(1+h)*v+(-1.5-2*h)*y+(-.5+h)*g+1,L=(-1-p)*v+(1.5+p)*y+.5*g,b=p*v-p*y;for(let A=0;A!==a;++A)r[A]=m*o[u+A]+E*o[c+A]+L*o[l+A]+b*o[d+A];return r}},ka=class extends yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},Ha=class extends yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Va=class extends yi{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(n-t)/(s-t),y=1-g;for(let v=0;v!==a;++v)r[v]=o[c+v]*y+o[l+v]*g;return r}let h=a*2,p=e-1;for(let g=0;g!==a;++g){let y=o[c+g],v=o[l+g],m=p*h+g*2,E=d[m],L=d[m+1],b=e*h+g*2,A=u[b],T=u[b+1],P=(n-t)/(s-t),_,C,U,I,M;for(let B=0;B<8;B++){_=P*P,C=_*P,U=1-P,I=U*U,M=I*U;let H=M*t+3*I*P*E+3*U*_*A+C*s-n;if(Math.abs(H)<1e-10)break;let X=3*I*(E-t)+6*U*P*(A-E)+3*_*(s-A);if(Math.abs(X)<1e-10)break;P=P-H/X,P=Math.max(0,Math.min(1,P))}r[g]=M*y+3*I*P*L+3*U*_*T+C*v}return r}},Pn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=xa(t,this.TimeBufferType),this.values=xa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:xa(e.times,Array),values:xa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ka(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ba(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Va(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case As:t=this.InterpolantFactoryMethodDiscrete;break;case Rs:t=this.InterpolantFactoryMethodLinear;break;case ba:t=this.InterpolantFactoryMethodSmooth;break;case Wc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ue("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return As;case this.InterpolantFactoryMethodLinear:return Rs;case this.InterpolantFactoryMethodSmooth:return ba;case this.InterpolantFactoryMethodBezier:return Wc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ge("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ge("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Ge("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Ge("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Np(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ge("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ba,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,h=d-n,p=d+n;for(let g=0;g!==n;++g){let y=t[d+g];if(y!==t[h+g]||y!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,h=o*n;for(let p=0;p!==n;++p)t[h+p]=t[d+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=Rs;var Wi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Wi.prototype.ValueTypeName="bool";Wi.prototype.ValueBufferType=Array;Wi.prototype.DefaultInterpolation=As;Wi.prototype.InterpolantFactoryMethodLinear=void 0;Wi.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};mo.prototype.ValueTypeName="color";var Xi=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Xi.prototype.ValueTypeName="number";var Ga=class extends yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)Ot.slerpFlat(r,0,o,c-a,o,c,l);return r}},bi=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ga(this.times,this.values,this.getValueSize(),e)}};bi.prototype.ValueTypeName="quaternion";bi.prototype.InterpolantFactoryMethodSmooth=void 0;var qi=class extends Pn{constructor(e,t,n){super(e,t,n)}};qi.prototype.ValueTypeName="string";qi.prototype.ValueBufferType=Array;qi.prototype.DefaultInterpolation=As;qi.prototype.InterpolantFactoryMethodLinear=void 0;qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Yi=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Yi.prototype.ValueTypeName="vector";var Er=class{constructor(e="",t=-1,n=[],s=Wd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=si(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Em(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Pn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=bm(l);l=dd(l,1,u),c=dd(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Xi(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Sm(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Xi;case"vector":case"vector2":case"vector3":case"vector4":return Yi;case"color":return mo;case"quaternion":return bi;case"bool":case"boolean":return Wi;case"string":return qi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Em(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Sm(i.type);if(i.times===void 0){let t=[],n=[];Mm(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}var pi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(fd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!fd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function fd(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Wa=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},rf=new Wa,Mi=class{constructor(e){this.manager=e!==void 0?e:rf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Mi.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ui={},jc=class extends Error{constructor(e,t){super(e),this.response=t}},Tr=class extends Mi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=pi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ui[e]!==void 0){Ui[e].push({onLoad:t,onProgress:n,onError:s});return}Ui[e]=[],Ui[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ue("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Ui[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=h?parseInt(h):0,g=p!==0,y=0,v=new ReadableStream({start(m){E();function E(){d.read().then(({done:L,value:b})=>{if(L)m.close();else{y+=b.byteLength;let A=new ProgressEvent("progress",{lengthComputable:g,loaded:y,total:p});for(let T=0,P=u.length;T<P;T++){let _=u[T];_.onProgress&&_.onProgress(A)}m.enqueue(b),E()}},L=>{m.error(L)})}}});return new Response(v)}else throw new jc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(h);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{pi.add(`file:${e}`,c);let u=Ui[e];delete Ui[e];for(let d=0,h=u.length;d<h;d++){let p=u[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{let u=Ui[e];if(u===void 0)throw this.manager.itemError(e),c;delete Ui[e];for(let d=0,h=u.length;d<h;d++){let p=u[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ar=new WeakMap,Xa=class extends Mi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=pi.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=ar.get(o);d===void 0&&(d=[],ar.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=fr("img");function l(){u(),t&&t(this);let d=ar.get(this)||[];for(let h=0;h<d.length;h++){let p=d[h];p.onLoad&&p.onLoad(this)}ar.delete(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),pi.remove(`image:${e}`);let h=ar.get(this)||[];for(let p=0;p<h.length;p++){let g=h[p];g.onError&&g.onError(d)}ar.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),pi.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var Ds=class extends Mi{constructor(e){super(e)}load(e,t,n,s){let r=new ln,o=new Xa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ns=class extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var Hc=new ke,pd=new D,md=new D,go=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.mapType=gn,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mr,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;pd.setFromMatrixPosition(e.matrixWorld),t.position.copy(pd),md.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(md),t.updateMatrixWorld(),Hc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===dr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Hc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},_a=new D,ya=new Ot,fi=new D,Fs=class extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=ii,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_a,ya,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,ya,fi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(_a,ya,fi),fi.x===1&&fi.y===1&&fi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,ya,fi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},as=new D,gd=new _e,vd=new _e,Qt=class extends Fs{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(no*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Cs*2*Math.atan(Math.tan(no*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){as.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(as.x,as.y).multiplyScalar(-e/as.z),as.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(as.x,as.y).multiplyScalar(-e/as.z)}getViewSize(e,t){return this.getViewBounds(e,gd,vd),t.subVectors(vd,gd)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(no*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$c=class extends go{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Cs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},vo=class extends Ns{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new $c}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Jc=class extends go{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0}},xo=class extends Ns{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Si=class extends Fs{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Qc=class extends go{constructor(){super(new Si(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_o=class extends Ns{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new Qc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},yo=class extends Ns{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Zi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Vc=new WeakMap,bo=class extends Mi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ue("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ue("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=pi.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{Vc.has(o)===!0?(s&&s(Vc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){pi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e)}).catch(function(c){s&&s(c),Vc.set(l,c),pi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});pi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var lr=-90,cr=1,qa=class extends zt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(lr,cr,e,t);s.layers=this.layers,this.add(s);let r=new Qt(lr,cr,e,t);r.layers=this.layers,this.add(r);let o=new Qt(lr,cr,e,t);o.layers=this.layers,this.add(o);let a=new Qt(lr,cr,e,t);a.layers=this.layers,this.add(a);let l=new Qt(lr,cr,e,t);l.layers=this.layers,this.add(l);let c=new Qt(lr,cr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===ii)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let v=!1;e.isWebGLRenderer===!0?v=e.state.buffers.depth.getReversed():v=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ya=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Us=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Tm.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Tm(){this._document.hidden===!1&&this.reset()}var xu="\\[\\]\\.:\\/",wm=new RegExp("["+xu+"]","g"),_u="[^"+xu+"]",Am="[^"+xu.replace("\\.","")+"]",Rm=/((?:WC+[\/:])*)/.source.replace("WC",_u),Cm=/(WCOD+)?/.source.replace("WCOD",Am),Pm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_u),Im=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_u),Lm=new RegExp("^"+Rm+Cm+Pm+Im+"$"),Dm=["material","materials","bones","map"],eu=class{constructor(e,t,n){let s=n||Pt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Pt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(wm,"")}static parseTrackName(e){let t=Lm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Dm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ue("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ge("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ge("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ge("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ge("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ge("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Ge("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Pt.Composite=eu;Pt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Pt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Pt.prototype.GetterByBindingType=[Pt.prototype._getValue_direct,Pt.prototype._getValue_array,Pt.prototype._getValue_arrayElement,Pt.prototype._getValue_toArray];Pt.prototype.SetterByBindingTypeAndVersioning=[[Pt.prototype._setValue_direct,Pt.prototype._setValue_direct_setNeedsUpdate,Pt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Pt.prototype._setValue_array,Pt.prototype._setValue_array_setNeedsUpdate,Pt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Pt.prototype._setValue_arrayElement,Pt.prototype._setValue_arrayElement_setNeedsUpdate,Pt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Pt.prototype._setValue_fromArray,Pt.prototype._setValue_fromArray_setNeedsUpdate,Pt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Sy=new Float32Array(1);var xd=new ke,Mo=class{constructor(e,t,n=0,s=1/0){this.ray=new gi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new vr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ge("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return xd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(xd),this}intersectObject(e,t=!0,n=[]){return tu(e,this,n,t),n.sort(_d),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)tu(e[s],this,n,t);return n.sort(_d),n}};function _d(i,e){return i.distance-e.distance}function tu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)tu(r[o],e,t,!0)}}var hs=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=nt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(nt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var nu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};var So=class extends ri{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ue("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function yu(i,e,t,n){let s=Nm(n);switch(t){case du:return i*e;case el:return i*e/s.components*s.byteLength;case tl:return i*e/s.components*s.byteLength;case vn:return i*e*2/s.components*s.byteLength;case nl:return i*e*2/s.components*s.byteLength;case fu:return i*e*3/s.components*s.byteLength;case kn:return i*e*4/s.components*s.byteLength;case il:return i*e*4/s.components*s.byteLength;case Do:case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fo:case Uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rl:case al:return Math.max(i,16)*Math.max(e,8)/4;case sl:case ol:return Math.max(i,8)*Math.max(e,8)/2;case ll:case cl:case hl:case dl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ul:case Oo:case fl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case vl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case xl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case _l:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case yl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case bl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ml:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Al:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Rl:case Cl:case Pl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Il:case Ll:return Math.ceil(i/4)*Math.ceil(e/4)*8;case zo:case Dl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nm(i){switch(i){case gn:case lu:return{byteLength:1,components:1};case Rr:case cu:case un:return{byteLength:2,components:1};case Ja:case Qa:return{byteLength:2,components:4};case li:case $a:case Bn:return{byteLength:4,components:1};case uu:case hu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function Rf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function zm(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){let g=d[h],y=d[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){let y=d[p];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Bm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,km=`#ifdef USE_ALPHAHASH
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
#endif`,Hm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xm=`#ifdef USE_AOMAP
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
#endif`,qm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ym=`#ifdef USE_BATCHING
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
#endif`,Zm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Km=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$m=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jm=`#ifdef USE_IRIDESCENCE
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
#endif`,Qm=`#ifdef USE_BUMPMAP
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
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ag=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,lg=`#define PI 3.141592653589793
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
} // validated`,cg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ug=`vec3 transformedNormal = objectNormal;
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
#endif`,hg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mg="gl_FragColor = linearToOutputTexel( gl_FragColor );",gg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vg=`#ifdef USE_ENVMAP
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
#endif`,xg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,_g=`#ifdef USE_ENVMAP
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
#endif`,yg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bg=`#ifdef USE_ENVMAP
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
#endif`,Mg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Eg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wg=`#ifdef USE_GRADIENTMAP
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
}`,Ag=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Ig=`#ifdef USE_ENVMAP
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
#endif`,Lg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ug=`PhysicalMaterial material;
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
#endif`,Og=`uniform sampler2D dfgLUT;
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
}`,zg=`
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
#endif`,Bg=`#if defined( RE_IndirectDiffuse )
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
#endif`,kg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Vg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Kg=`#if defined( USE_POINTS_UV )
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
#endif`,jg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$g=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,e0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t0=`#ifdef USE_MORPHTARGETS
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
#endif`,n0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,s0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,r0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,l0=`#ifdef USE_NORMALMAP
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
#endif`,c0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,u0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,d0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,f0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,p0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,m0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,g0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,v0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,x0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,b0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,S0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,E0=`float getShadowMask() {
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
}`,T0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,w0=`#ifdef USE_SKINNING
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
#endif`,A0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,R0=`#ifdef USE_SKINNING
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
#endif`,C0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,P0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,I0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,L0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,D0=`#ifdef USE_TRANSMISSION
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
#endif`,N0=`#ifdef USE_TRANSMISSION
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
#endif`,F0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,z0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,B0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,k0=`uniform sampler2D t2D;
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
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,G0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X0=`#include <common>
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
}`,q0=`#if DEPTH_PACKING == 3200
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
}`,Y0=`#define DISTANCE
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
}`,Z0=`#define DISTANCE
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
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,j0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`uniform float scale;
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
}`,J0=`uniform vec3 diffuse;
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
}`,Q0=`#include <common>
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
}`,ev=`uniform vec3 diffuse;
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
}`,tv=`#define LAMBERT
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
}`,nv=`#define LAMBERT
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
}`,iv=`#define MATCAP
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
}`,sv=`#define MATCAP
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
}`,rv=`#define NORMAL
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
}`,ov=`#define NORMAL
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
}`,av=`#define PHONG
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
}`,lv=`#define PHONG
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
}`,cv=`#define STANDARD
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
}`,uv=`#define STANDARD
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
}`,hv=`#define TOON
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
}`,dv=`#define TOON
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
}`,fv=`uniform float size;
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
}`,pv=`uniform vec3 diffuse;
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
}`,mv=`#include <common>
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
}`,gv=`uniform vec3 color;
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
}`,vv=`uniform float rotation;
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
}`,xv=`uniform vec3 diffuse;
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
}`,Qe={alphahash_fragment:Bm,alphahash_pars_fragment:km,alphamap_fragment:Hm,alphamap_pars_fragment:Vm,alphatest_fragment:Gm,alphatest_pars_fragment:Wm,aomap_fragment:Xm,aomap_pars_fragment:qm,batching_pars_vertex:Ym,batching_vertex:Zm,begin_vertex:Km,beginnormal_vertex:jm,bsdfs:$m,iridescence_fragment:Jm,bumpmap_pars_fragment:Qm,clipping_planes_fragment:eg,clipping_planes_pars_fragment:tg,clipping_planes_pars_vertex:ng,clipping_planes_vertex:ig,color_fragment:sg,color_pars_fragment:rg,color_pars_vertex:og,color_vertex:ag,common:lg,cube_uv_reflection_fragment:cg,defaultnormal_vertex:ug,displacementmap_pars_vertex:hg,displacementmap_vertex:dg,emissivemap_fragment:fg,emissivemap_pars_fragment:pg,colorspace_fragment:mg,colorspace_pars_fragment:gg,envmap_fragment:vg,envmap_common_pars_fragment:xg,envmap_pars_fragment:_g,envmap_pars_vertex:yg,envmap_physical_pars_fragment:Ig,envmap_vertex:bg,fog_vertex:Mg,fog_pars_vertex:Sg,fog_fragment:Eg,fog_pars_fragment:Tg,gradientmap_pars_fragment:wg,lightmap_pars_fragment:Ag,lights_lambert_fragment:Rg,lights_lambert_pars_fragment:Cg,lights_pars_begin:Pg,lights_toon_fragment:Lg,lights_toon_pars_fragment:Dg,lights_phong_fragment:Ng,lights_phong_pars_fragment:Fg,lights_physical_fragment:Ug,lights_physical_pars_fragment:Og,lights_fragment_begin:zg,lights_fragment_maps:Bg,lights_fragment_end:kg,lightprobes_pars_fragment:Hg,logdepthbuf_fragment:Vg,logdepthbuf_pars_fragment:Gg,logdepthbuf_pars_vertex:Wg,logdepthbuf_vertex:Xg,map_fragment:qg,map_pars_fragment:Yg,map_particle_fragment:Zg,map_particle_pars_fragment:Kg,metalnessmap_fragment:jg,metalnessmap_pars_fragment:$g,morphinstance_vertex:Jg,morphcolor_vertex:Qg,morphnormal_vertex:e0,morphtarget_pars_vertex:t0,morphtarget_vertex:n0,normal_fragment_begin:i0,normal_fragment_maps:s0,normal_pars_fragment:r0,normal_pars_vertex:o0,normal_vertex:a0,normalmap_pars_fragment:l0,clearcoat_normal_fragment_begin:c0,clearcoat_normal_fragment_maps:u0,clearcoat_pars_fragment:h0,iridescence_pars_fragment:d0,opaque_fragment:f0,packing:p0,premultiplied_alpha_fragment:m0,project_vertex:g0,dithering_fragment:v0,dithering_pars_fragment:x0,roughnessmap_fragment:_0,roughnessmap_pars_fragment:y0,shadowmap_pars_fragment:b0,shadowmap_pars_vertex:M0,shadowmap_vertex:S0,shadowmask_pars_fragment:E0,skinbase_vertex:T0,skinning_pars_vertex:w0,skinning_vertex:A0,skinnormal_vertex:R0,specularmap_fragment:C0,specularmap_pars_fragment:P0,tonemapping_fragment:I0,tonemapping_pars_fragment:L0,transmission_fragment:D0,transmission_pars_fragment:N0,uv_pars_fragment:F0,uv_pars_vertex:U0,uv_vertex:O0,worldpos_vertex:z0,background_vert:B0,background_frag:k0,backgroundCube_vert:H0,backgroundCube_frag:V0,cube_vert:G0,cube_frag:W0,depth_vert:X0,depth_frag:q0,distance_vert:Y0,distance_frag:Z0,equirect_vert:K0,equirect_frag:j0,linedashed_vert:$0,linedashed_frag:J0,meshbasic_vert:Q0,meshbasic_frag:ev,meshlambert_vert:tv,meshlambert_frag:nv,meshmatcap_vert:iv,meshmatcap_frag:sv,meshnormal_vert:rv,meshnormal_frag:ov,meshphong_vert:av,meshphong_frag:lv,meshphysical_vert:cv,meshphysical_frag:uv,meshtoon_vert:hv,meshtoon_frag:dv,points_vert:fv,points_frag:pv,shadow_vert:mv,shadow_frag:gv,sprite_vert:vv,sprite_frag:xv},we={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},wi={basic:{uniforms:xn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:xn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:xn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:xn([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:xn([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new Te(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:xn([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:xn([we.points,we.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:xn([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:xn([we.common,we.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:xn([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:xn([we.sprite,we.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distance:{uniforms:xn([we.common,we.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distance_vert,fragmentShader:Qe.distance_frag},shadow:{uniforms:xn([we.lights,we.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};wi.physical={uniforms:xn([wi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};var Ol={r:0,b:0,g:0},_v=new ke,Cf=new Ye;Cf.set(-1,0,0,0,1,0,0,0,1);function yv(i,e,t,n,s,r){let o=new Te(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function p(E){let L=E.isScene===!0?E.background:null;if(L&&L.isTexture){let b=E.backgroundBlurriness>0;L=e.get(L,b)}return L}function g(E){let L=!1,b=p(E);b===null?v(o,a):b&&b.isColor&&(v(b,1),L=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||L)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(E,L){let b=p(L);b&&(b.isCubeTexture||b.mapping===Lo)?(c===void 0&&(c=new pt(new Hi(1,1,1),new at({name:"BackgroundCubeMaterial",uniforms:Bs(wi.backgroundCube.uniforms),vertexShader:wi.backgroundCube.vertexShader,fragmentShader:wi.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_v.makeRotationFromEuler(L.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Cf),c.material.toneMapped=et.getTransfer(b.colorSpace)!==vt,(u!==b||d!==b.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=b,d=b.version,h=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new pt(new Vi(2,2),new at({name:"BackgroundMaterial",uniforms:Bs(wi.background.uniforms),vertexShader:wi.background.vertexShader,fragmentShader:wi.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,l.material.toneMapped=et.getTransfer(b.colorSpace)!==vt,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(u!==b||d!==b.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=b,d=b.version,h=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function v(E,L){E.getRGB(Ol,vu(i)),t.buffers.color.setClear(Ol.r,Ol.g,Ol.b,L,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,L=1){o.set(E),a=L,v(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(E){a=E,v(o,a)},render:g,addToRenderList:y,dispose:m}}function bv(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(I,M,B,V,H){let X=!1,q=d(I,V,B,M);r!==q&&(r=q,c(r.object)),X=p(I,V,B,H),X&&g(I,V,B,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,b(I,M,B,V),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function u(I){return i.deleteVertexArray(I)}function d(I,M,B,V){let H=V.wireframe===!0,X=n[M.id];X===void 0&&(X={},n[M.id]=X);let q=I.isInstancedMesh===!0?I.id:0,ne=X[q];ne===void 0&&(ne={},X[q]=ne);let ae=ne[B.id];ae===void 0&&(ae={},ne[B.id]=ae);let le=ae[H];return le===void 0&&(le=h(l()),ae[H]=le),le}function h(I){let M=[],B=[],V=[];for(let H=0;H<t;H++)M[H]=0,B[H]=0,V[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:B,attributeDivisors:V,object:I,attributes:{},index:null}}function p(I,M,B,V){let H=r.attributes,X=M.attributes,q=0,ne=B.getAttributes();for(let ae in ne)if(ne[ae].location>=0){let fe=H[ae],Ee=X[ae];if(Ee===void 0&&(ae==="instanceMatrix"&&I.instanceMatrix&&(Ee=I.instanceMatrix),ae==="instanceColor"&&I.instanceColor&&(Ee=I.instanceColor)),fe===void 0||fe.attribute!==Ee||Ee&&fe.data!==Ee.data)return!0;q++}return r.attributesNum!==q||r.index!==V}function g(I,M,B,V){let H={},X=M.attributes,q=0,ne=B.getAttributes();for(let ae in ne)if(ne[ae].location>=0){let fe=X[ae];fe===void 0&&(ae==="instanceMatrix"&&I.instanceMatrix&&(fe=I.instanceMatrix),ae==="instanceColor"&&I.instanceColor&&(fe=I.instanceColor));let Ee={};Ee.attribute=fe,fe&&fe.data&&(Ee.data=fe.data),H[ae]=Ee,q++}r.attributes=H,r.attributesNum=q,r.index=V}function y(){let I=r.newAttributes;for(let M=0,B=I.length;M<B;M++)I[M]=0}function v(I){m(I,0)}function m(I,M){let B=r.newAttributes,V=r.enabledAttributes,H=r.attributeDivisors;B[I]=1,V[I]===0&&(i.enableVertexAttribArray(I),V[I]=1),H[I]!==M&&(i.vertexAttribDivisor(I,M),H[I]=M)}function E(){let I=r.newAttributes,M=r.enabledAttributes;for(let B=0,V=M.length;B<V;B++)M[B]!==I[B]&&(i.disableVertexAttribArray(B),M[B]=0)}function L(I,M,B,V,H,X,q){q===!0?i.vertexAttribIPointer(I,M,B,H,X):i.vertexAttribPointer(I,M,B,V,H,X)}function b(I,M,B,V){y();let H=V.attributes,X=B.getAttributes(),q=M.defaultAttributeValues;for(let ne in X){let ae=X[ne];if(ae.location>=0){let le=H[ne];if(le===void 0&&(ne==="instanceMatrix"&&I.instanceMatrix&&(le=I.instanceMatrix),ne==="instanceColor"&&I.instanceColor&&(le=I.instanceColor)),le!==void 0){let fe=le.normalized,Ee=le.itemSize,it=e.get(le);if(it===void 0)continue;let Ze=it.buffer,Re=it.type,Y=it.bytesPerElement,ce=Re===i.INT||Re===i.UNSIGNED_INT||le.gpuType===$a;if(le.isInterleavedBufferAttribute){let se=le.data,Pe=se.stride,He=le.offset;if(se.isInstancedInterleavedBuffer){for(let Fe=0;Fe<ae.locationSize;Fe++)m(ae.location+Fe,se.meshPerAttribute);I.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Fe=0;Fe<ae.locationSize;Fe++)v(ae.location+Fe);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let Fe=0;Fe<ae.locationSize;Fe++)L(ae.location+Fe,Ee/ae.locationSize,Re,fe,Pe*Y,(He+Ee/ae.locationSize*Fe)*Y,ce)}else{if(le.isInstancedBufferAttribute){for(let se=0;se<ae.locationSize;se++)m(ae.location+se,le.meshPerAttribute);I.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let se=0;se<ae.locationSize;se++)v(ae.location+se);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let se=0;se<ae.locationSize;se++)L(ae.location+se,Ee/ae.locationSize,Re,fe,Ee*Y,Ee/ae.locationSize*se*Y,ce)}}else if(q!==void 0){let fe=q[ne];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(ae.location,fe);break;case 3:i.vertexAttrib3fv(ae.location,fe);break;case 4:i.vertexAttrib4fv(ae.location,fe);break;default:i.vertexAttrib1fv(ae.location,fe)}}}}E()}function A(){C();for(let I in n){let M=n[I];for(let B in M){let V=M[B];for(let H in V){let X=V[H];for(let q in X)u(X[q].object),delete X[q];delete V[H]}}delete n[I]}}function T(I){if(n[I.id]===void 0)return;let M=n[I.id];for(let B in M){let V=M[B];for(let H in V){let X=V[H];for(let q in X)u(X[q].object),delete X[q];delete V[H]}}delete n[I.id]}function P(I){for(let M in n){let B=n[M];for(let V in B){let H=B[V];if(H[I.id]===void 0)continue;let X=H[I.id];for(let q in X)u(X[q].object),delete X[q];delete H[I.id]}}}function _(I){for(let M in n){let B=n[M],V=I.isInstancedMesh===!0?I.id:0,H=B[V];if(H!==void 0){for(let X in H){let q=H[X];for(let ne in q)u(q[ne].object),delete q[ne];delete H[X]}delete B[V],Object.keys(B).length===0&&delete n[M]}}}function C(){U(),o=!0,r!==s&&(r=s,c(r.object))}function U(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:U,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:y,enableAttribute:v,disableUnusedAttributes:E}}function Mv(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let p=0;p<u;p++)h+=c[p];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Sv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==kn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let _=P===un&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==gn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Bn&&!_)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ue("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ue("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),L=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:v,maxAttributes:m,maxVertexUniforms:E,maxVaryings:L,maxFragmentUniforms:b,maxSamples:A,samples:T}}function Ev(i){let e=this,t=null,n=0,s=!1,r=!1,o=new wn,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let p=d.length!==0||h||n!==0||s;return s=h,n=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){let g=d.clippingPlanes,y=d.clipIntersection,v=d.clipShadows,m=i.get(d);if(!s||g===null||g.length===0||r&&!v)r?u(null):c();else{let E=r?0:n,L=E*4,b=m.clippingState||null;l.value=b,b=u(g,h,L,p);for(let A=0;A!==L;++A)b[A]=t[A];m.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,p,g){let y=d!==null?d.length:0,v=null;if(y!==0){if(v=l.value,g!==!0||v===null){let m=p+y*4,E=h.matrixWorldInverse;a.getNormalMatrix(E),(v===null||v.length<m)&&(v=new Float32Array(m));for(let L=0,b=p;L!==y;++L,b+=4)o.copy(d[L]).applyMatrix4(E,a),o.normal.toArray(v,b),v[b+3]=o.constant}l.value=v,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,v}}var gs=4,of=[.125,.215,.35,.446,.526,.582],ks=20,Tv=256,ko=new Si,af=new Te,bu=null,Mu=0,Su=0,Eu=!1,wv=new D,Bl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=wv}=r;bu=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Su=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bu,Mu,Su),this._renderer.xr.enabled=Eu,e.scissorTest=!1,Ir(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ps||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bu=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Su=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:yt,minFilter:yt,generateMipmaps:!1,type:un,format:kn,colorSpace:Mn,depthBuffer:!1},s=lf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lf(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Av(r)),this._blurMaterial=Cv(r,e,t),this._ggxMaterial=Rv(r,e,t)}return s}_compileMaterial(e){let t=new pt(new bt,e);this._renderer.compile(t,ko)}_sceneToCubeUV(e,t,n,s,r){let l=new Qt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(af),d.toneMapping=oi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pt(new Hi,new Xt({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,v=y.material,m=!1,E=e.background;E?E.isColor&&(v.color.copy(E),e.background=null,m=!0):(v.color.copy(af),m=!0);for(let L=0;L<6;L++){let b=L%3;b===0?(l.up.set(0,c[L],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[L],r.y,r.z)):b===1?(l.up.set(0,0,c[L]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[L],r.z)):(l.up.set(0,c[L],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[L]));let A=this._cubeSize;Ir(s,b*A,L>2?A:0,A,A),d.setRenderTarget(s),m&&d.render(y,l),d.render(e,l)}d.toneMapping=p,d.autoClear=h,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ps||e.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=uf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Ir(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,ko)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=0+c*1.25,p=d*h,{_lodMax:g}=this,y=this._sizeLods[n],v=3*y*(n>g-gs?n-g+gs:0),m=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,Ir(r,v,m,3*y,2*y),s.setRenderTarget(r),s.render(a,ko),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Ir(e,v,m,3*y,2*y),s.setRenderTarget(e),s.render(a,ko)}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Ge("blur direction must be either latitudinal or longitudinal!");let u=3,d=this._lodMeshes[s];d.material=c;let h=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ks-1),y=r/g,v=isFinite(r)?1+Math.floor(u*y):ks;v>ks&&Ue(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${ks}`);let m=[],E=0;for(let P=0;P<ks;++P){let _=P/y,C=Math.exp(-_*_/2);m.push(C),P===0?E+=C:P<v&&(E+=2*C)}for(let P=0;P<m.length;P++)m[P]=m[P]/E;h.envMap.value=e.texture,h.samples.value=v,h.weights.value=m,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);let{_lodMax:L}=this;h.dTheta.value=g,h.mipInt.value=L-n;let b=this._sizeLods[s],A=3*b*(s>L-gs?s-L+gs:0),T=4*(this._cubeSize-b);Ir(t,A,T,3*b,2*b),l.setRenderTarget(t),l.render(d,ko)}};function Av(i){let e=[],t=[],n=[],s=i,r=i-gs+1+of.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-gs?l=of[o-i+gs-1]:o===0&&(l=0),t.push(l);let c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,y=3,v=2,m=1,E=new Float32Array(y*g*p),L=new Float32Array(v*g*p),b=new Float32Array(m*g*p);for(let T=0;T<p;T++){let P=T%3*2/3-1,_=T>2?0:-1,C=[P,_,0,P+2/3,_,0,P+2/3,_+1,0,P,_,0,P+2/3,_+1,0,P,_+1,0];E.set(C,y*g*T),L.set(h,v*g*T);let U=[T,T,T,T,T,T];b.set(U,m*g*T)}let A=new bt;A.setAttribute("position",new Rt(E,y)),A.setAttribute("uv",new Rt(L,v)),A.setAttribute("faceIndex",new Rt(b,m)),n.push(new pt(A,null)),s>gs&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function lf(i,e,t){let n=new Wt(i,e,t);return n.texture.mapping=Lo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ir(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Rv(i,e,t){return new at({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Tv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Cv(i,e,t){let n=new Float32Array(ks),s=new D(0,1,0);return new at({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function cf(){return new at({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function uf(){return new at({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

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
	`}var kl=class extends Wt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new fo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Hi(5,5,5),r=new at({name:"CubemapFromEquirect",uniforms:Bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:In});r.uniforms.tEquirect.value=t;let o=new pt(s,r),a=t.minFilter;return t.minFilter===ai&&(t.minFilter=yt),new qa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};function Pv(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,p=!1){return h==null?null:p?o(h):r(h)}function r(h){if(h&&h.isTexture){let p=h.mapping;if(p===Za||p===Ka)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let y=new kl(g.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",c),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let p=h.mapping,g=p===Za||p===Ka,y=p===ps||p===Os;if(g||y){let v=t.get(h),m=v!==void 0?v.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new Bl(i)),v=g?n.fromEquirectangular(h,v):n.fromCubemap(h,v),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),v.texture;if(v!==void 0)return v.texture;{let E=h.image;return g&&E&&E.height>0||y&&E&&l(E)?(n===null&&(n=new Bl(i)),v=g?n.fromEquirectangular(h):n.fromCubemap(h),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),h.addEventListener("dispose",u),v.texture):null}}}return h}function a(h,p){return p===Za?h.mapping=ps:p===Ka&&(h.mapping=Os),h}function l(h){let p=0,g=6;for(let y=0;y<g;y++)h[y]!==void 0&&p++;return p===g}function c(h){let p=h.target;p.removeEventListener("dispose",c);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function u(h){let p=h.target;p.removeEventListener("dispose",u);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Iv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ts("WebGLRenderer: "+n+" extension not supported."),s}}}function Lv(i,e,t,n){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];let p=r.get(h);p&&(e.remove(p),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let p in h)e.update(h[p],i.ARRAY_BUFFER)}function c(d){let h=[],p=d.index,g=d.attributes.position,y=0;if(g===void 0)return;if(p!==null){let E=p.array;y=p.version;for(let L=0,b=E.length;L<b;L+=3){let A=E[L+0],T=E[L+1],P=E[L+2];h.push(A,T,T,P,P,A)}}else{let E=g.array;y=g.version;for(let L=0,b=E.length/3-1;L<b;L+=3){let A=L+0,T=L+1,P=L+2;h.push(A,T,T,P,P,A)}}let v=new(g.count>=65535?lo:ao)(h,1);v.version=y;let m=r.get(d);m&&e.remove(m),r.set(d,v)}function u(d){let h=r.get(d);if(h){let p=d.index;p!==null&&h.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Dv(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){i.drawElements(n,h,r,d*o),t.update(h,n,1)}function c(d,h,p){p!==0&&(i.drawElementsInstanced(n,h,r,d*o,p),t.update(h,n,p))}function u(d,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,p);let y=0;for(let v=0;v<p;v++)y+=h[v];t.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Nv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Ge("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Fv(i,e,t){let n=new WeakMap,s=new dt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let C=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",C)};h!==void 0&&h.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,v=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],L=0;p===!0&&(L=1),g===!0&&(L=2),y===!0&&(L=3);let b=a.attributes.position.count*L,A=1;b>e.maxTextureSize&&(A=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let T=new Float32Array(b*A*4*d),P=new oo(T,b,A,d);P.type=Bn,P.needsUpdate=!0;let _=L*4;for(let U=0;U<d;U++){let I=v[U],M=m[U],B=E[U],V=b*A*4*U;for(let H=0;H<I.count;H++){let X=H*_;p===!0&&(s.fromBufferAttribute(I,H),T[V+X+0]=s.x,T[V+X+1]=s.y,T[V+X+2]=s.z,T[V+X+3]=0),g===!0&&(s.fromBufferAttribute(M,H),T[V+X+4]=s.x,T[V+X+5]=s.y,T[V+X+6]=s.z,T[V+X+7]=0),y===!0&&(s.fromBufferAttribute(B,H),T[V+X+8]=s.x,T[V+X+9]=s.y,T[V+X+10]=s.z,T[V+X+11]=B.itemSize===4?s.w:1)}}h={count:d,texture:P,size:new _e(b,A)},n.set(a,h),a.addEventListener("dispose",C)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Uv(i,e,t,n,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=e.get(c,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==u&&(p.update(),r.set(p,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var Ov={[To]:"LINEAR_TONE_MAPPING",[wo]:"REINHARD_TONE_MAPPING",[Ao]:"CINEON_TONE_MAPPING",[Ro]:"ACES_FILMIC_TONE_MAPPING",[Po]:"AGX_TONE_MAPPING",[Io]:"NEUTRAL_TONE_MAPPING",[Co]:"CUSTOM_TONE_MAPPING"};function zv(i,e,t,n,s,r){let o=new Wt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new ki(e,t):void 0}),a=new Wt(e,t,{type:un,depthBuffer:!1,stencilBuffer:!1}),l=new bt;l.setAttribute("position",new xt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new xt([0,2,0,0,2,0],2));let c=new Sr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new pt(l,c),d=new Si(-1,1,1,-1,0,1),h=null,p=null,g=!1,y,v=null,m=[],E=!1;this.setSize=function(L,b){o.setSize(L,b),a.setSize(L,b);for(let A=0;A<m.length;A++){let T=m[A];T.setSize&&T.setSize(L,b)}},this.setEffects=function(L){m=L,E=m.length>0&&m[0].isRenderPass===!0;let b=o.width,A=o.height;for(let T=0;T<m.length;T++){let P=m[T];P.setSize&&P.setSize(b,A)}},this.begin=function(L,b){if(g||L.toneMapping===oi&&m.length===0)return!1;if(v=b,b!==null){let A=b.width,T=b.height;(o.width!==A||o.height!==T)&&this.setSize(A,T)}return E===!1&&L.setRenderTarget(o),y=L.toneMapping,L.toneMapping=oi,!0},this.hasRenderPass=function(){return E},this.end=function(L,b){L.toneMapping=y,g=!0;let A=o,T=a;for(let P=0;P<m.length;P++){let _=m[P];if(_.enabled!==!1&&(_.render(L,T,A,b),_.needsSwap!==!1)){let C=A;A=T,T=C}}if(h!==L.outputColorSpace||p!==L.toneMapping){h=L.outputColorSpace,p=L.toneMapping,c.defines={},et.getTransfer(h)===vt&&(c.defines.SRGB_TRANSFER="");let P=Ov[p];P&&(c.defines[P]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,L.setRenderTarget(v),L.render(u,d),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}var Pf=new ln,Au=new ki(1,1),If=new oo,Lf=new gr,Df=new fo,hf=[],df=[],ff=new Float32Array(16),pf=new Float32Array(9),mf=new Float32Array(4);function Dr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=hf[s];if(r===void 0&&(r=new Float32Array(s),hf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function nn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function sn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Gl(i,e){let t=df[e];t===void 0&&(t=new Int32Array(e),df[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Bv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2fv(this.addr,e),sn(t,e)}}function Hv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(nn(t,e))return;i.uniform3fv(this.addr,e),sn(t,e)}}function Vv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4fv(this.addr,e),sn(t,e)}}function Gv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;mf.set(n),i.uniformMatrix2fv(this.addr,!1,mf),sn(t,n)}}function Wv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;pf.set(n),i.uniformMatrix3fv(this.addr,!1,pf),sn(t,n)}}function Xv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;ff.set(n),i.uniformMatrix4fv(this.addr,!1,ff),sn(t,n)}}function qv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Yv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2iv(this.addr,e),sn(t,e)}}function Zv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3iv(this.addr,e),sn(t,e)}}function Kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4iv(this.addr,e),sn(t,e)}}function jv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function $v(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2uiv(this.addr,e),sn(t,e)}}function Jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3uiv(this.addr,e),sn(t,e)}}function Qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4uiv(this.addr,e),sn(t,e)}}function ex(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Au.compareFunction=t.isReversedDepthBuffer()?Ul:Fl,r=Au):r=Pf,t.setTexture2D(e||r,s)}function tx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Lf,s)}function nx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Df,s)}function ix(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||If,s)}function sx(i){switch(i){case 5126:return Bv;case 35664:return kv;case 35665:return Hv;case 35666:return Vv;case 35674:return Gv;case 35675:return Wv;case 35676:return Xv;case 5124:case 35670:return qv;case 35667:case 35671:return Yv;case 35668:case 35672:return Zv;case 35669:case 35673:return Kv;case 5125:return jv;case 36294:return $v;case 36295:return Jv;case 36296:return Qv;case 35678:case 36198:case 36298:case 36306:case 35682:return ex;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return nx;case 36289:case 36303:case 36311:case 36292:return ix}}function rx(i,e){i.uniform1fv(this.addr,e)}function ox(i,e){let t=Dr(e,this.size,2);i.uniform2fv(this.addr,t)}function ax(i,e){let t=Dr(e,this.size,3);i.uniform3fv(this.addr,t)}function lx(i,e){let t=Dr(e,this.size,4);i.uniform4fv(this.addr,t)}function cx(i,e){let t=Dr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ux(i,e){let t=Dr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hx(i,e){let t=Dr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function dx(i,e){i.uniform1iv(this.addr,e)}function fx(i,e){i.uniform2iv(this.addr,e)}function px(i,e){i.uniform3iv(this.addr,e)}function mx(i,e){i.uniform4iv(this.addr,e)}function gx(i,e){i.uniform1uiv(this.addr,e)}function vx(i,e){i.uniform2uiv(this.addr,e)}function xx(i,e){i.uniform3uiv(this.addr,e)}function _x(i,e){i.uniform4uiv(this.addr,e)}function yx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Au:o=Pf;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function bx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Lf,r[o])}function Mx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Df,r[o])}function Sx(i,e,t){let n=this.cache,s=e.length,r=Gl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||If,r[o])}function Ex(i){switch(i){case 5126:return rx;case 35664:return ox;case 35665:return ax;case 35666:return lx;case 35674:return cx;case 35675:return ux;case 35676:return hx;case 5124:case 35670:return dx;case 35667:case 35671:return fx;case 35668:case 35672:return px;case 35669:case 35673:return mx;case 5125:return gx;case 36294:return vx;case 36295:return xx;case 36296:return _x;case 35678:case 36198:case 36298:case 36306:case 35682:return yx;case 35679:case 36299:case 36307:return bx;case 35680:case 36300:case 36308:case 36293:return Mx;case 36289:case 36303:case 36311:case 36292:return Sx}}var Ru=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sx(t.type)}},Cu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ex(t.type)}},Pu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Tu=/(\w+)(\])?(\[|\.)?/g;function gf(i,e){i.seq.push(e),i.map[e.id]=e}function Tx(i,e,t){let n=i.name,s=n.length;for(Tu.lastIndex=0;;){let r=Tu.exec(n),o=Tu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){gf(t,c===void 0?new Ru(a,i,e):new Cu(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Pu(a),gf(t,d)),t=d}}}var Lr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Tx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function vf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var wx=37297,Ax=0;function Rx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var xf=new Ye;function Cx(i){et._getMatrix(xf,et.workingColorSpace,i);let e=`mat3( ${xf.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case so:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return Ue("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function _f(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Rx(i.getShaderSource(e),a)}else return r}function Px(i,e){let t=Cx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Ix={[To]:"Linear",[wo]:"Reinhard",[Ao]:"Cineon",[Ro]:"ACESFilmic",[Po]:"AgX",[Io]:"Neutral",[Co]:"Custom"};function Lx(i,e){let t=Ix[e];return t===void 0?(Ue("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var zl=new D;function Dx(){et.getLuminanceCoefficients(zl);let i=zl.x.toFixed(4),e=zl.y.toFixed(4),t=zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vo).join(`
`)}function Fx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ux(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Vo(i){return i!==""}function yf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ox=/^[ \t]*#include +<([\w\d./]+)>/gm;function Iu(i){return i.replace(Ox,Bx)}var zx=new Map;function Bx(i,e){let t=Qe[e];if(t===void 0){let n=zx.get(e);if(n!==void 0)t=Qe[n],Ue('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Iu(t)}var kx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mf(i){return i.replace(kx,Hx)}function Hx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var Vx={[Eo]:"SHADOWMAP_TYPE_PCF",[wr]:"SHADOWMAP_TYPE_VSM"};function Gx(i){return Vx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Wx={[ps]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[Lo]:"ENVMAP_TYPE_CUBE_UV"};function Xx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Wx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var qx={[Os]:"ENVMAP_MODE_REFRACTION"};function Yx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":qx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Zx={[ou]:"ENVMAP_BLENDING_MULTIPLY",[Hd]:"ENVMAP_BLENDING_MIX",[Vd]:"ENVMAP_BLENDING_ADD"};function Kx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Zx[i.combine]||"ENVMAP_BLENDING_NONE"}function jx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function $x(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Gx(t),c=Xx(t),u=Yx(t),d=Kx(t),h=jx(t),p=Nx(t),g=Fx(r),y=s.createProgram(),v,m,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vo).join(`
`),v.length>0&&(v+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vo).join(`
`),m.length>0&&(m+=`
`)):(v=[Sf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vo).join(`
`),m=[Sf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==oi?"#define TONE_MAPPING":"",t.toneMapping!==oi?Qe.tonemapping_pars_fragment:"",t.toneMapping!==oi?Lx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,Px("linearToOutputTexel",t.outputColorSpace),Dx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vo).join(`
`)),o=Iu(o),o=yf(o,t),o=bf(o,t),a=Iu(a),a=yf(a,t),a=bf(a,t),o=Mf(o),a=Mf(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,v=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,m=["#define varying in",t.glslVersion===mu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let L=E+v+o,b=E+m+a,A=vf(s,s.VERTEX_SHADER,L),T=vf(s,s.FRAGMENT_SHADER,b);s.attachShader(y,A),s.attachShader(y,T),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function P(I){if(i.debug.checkShaderErrors){let M=s.getProgramInfoLog(y)||"",B=s.getShaderInfoLog(A)||"",V=s.getShaderInfoLog(T)||"",H=M.trim(),X=B.trim(),q=V.trim(),ne=!0,ae=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,A,T);else{let le=_f(s,A,"vertex"),fe=_f(s,T,"fragment");Ge("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+H+`
`+le+`
`+fe)}else H!==""?Ue("WebGLProgram: Program Info Log:",H):(X===""||q==="")&&(ae=!1);ae&&(I.diagnostics={runnable:ne,programLog:H,vertexShader:{log:X,prefix:v},fragmentShader:{log:q,prefix:m}})}s.deleteShader(A),s.deleteShader(T),_=new Lr(s,y),C=Ux(s,y)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let C;this.getAttributes=function(){return C===void 0&&P(this),C};let U=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(y,wx)),U},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ax++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=A,this.fragmentShader=T,this}var Jx=0,Lu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Du(e),t.set(e,n)),n}},Du=class{constructor(e){this.id=Jx++,this.code=e,this.usedTimes=0}};function Qx(i){return i===vn||i===Oo||i===zo}function e_(i,e,t,n,s,r){let o=new vr,a=new Lu,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function y(_,C,U,I,M,B){let V=I.fog,H=M.geometry,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ne=e.get(_.envMap||X,q),ae=ne&&ne.mapping===Lo?ne.image.height:null,le=p[_.type];_.precision!==null&&(h=n.getMaxPrecision(_.precision),h!==_.precision&&Ue("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let fe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ee=fe!==void 0?fe.length:0,it=0;H.morphAttributes.position!==void 0&&(it=1),H.morphAttributes.normal!==void 0&&(it=2),H.morphAttributes.color!==void 0&&(it=3);let Ze,Re,Y,ce;if(le){let Le=wi[le];Ze=Le.vertexShader,Re=Le.fragmentShader}else{Ze=_.vertexShader,Re=_.fragmentShader;let Le=a.getVertexShaderStage(_),ot=a.getFragmentShaderStage(_);a.update(_,Le,ot),Y=Le.id,ce=ot.id}let se=i.getRenderTarget(),Pe=i.state.buffers.depth.getReversed(),He=M.isInstancedMesh===!0,Fe=M.isBatchedMesh===!0,mt=!!_.map,We=!!_.matcap,st=!!ne,$e=!!_.aoMap,Xe=!!_.lightMap,rt=!!_.bumpMap&&_.wireframe===!1,Mt=!!_.normalMap,gt=!!_.displacementMap,Bt=!!_.emissiveMap,Nt=!!_.metalnessMap,Ut=!!_.roughnessMap,z=_.anisotropy>0,Zt=_.clearcoat>0,ft=_.dispersion>0,R=_.iridescence>0,x=_.sheen>0,k=_.transmission>0,W=z&&!!_.anisotropyMap,Z=Zt&&!!_.clearcoatMap,he=Zt&&!!_.clearcoatNormalMap,ge=Zt&&!!_.clearcoatRoughnessMap,K=R&&!!_.iridescenceMap,ee=R&&!!_.iridescenceThicknessMap,be=x&&!!_.sheenColorMap,Ne=x&&!!_.sheenRoughnessMap,ye=!!_.specularMap,Me=!!_.specularColorMap,Oe=!!_.specularIntensityMap,Be=k&&!!_.transmissionMap,je=k&&!!_.thicknessMap,O=!!_.gradientMap,pe=!!_.alphaMap,J=_.alphaTest>0,ve=!!_.alphaHash,Se=!!_.extensions,oe=oi;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(oe=i.toneMapping);let Ae={shaderID:le,shaderType:_.type,shaderName:_.name,vertexShader:Ze,fragmentShader:Re,defines:_.defines,customVertexShaderID:Y,customFragmentShaderID:ce,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:Fe,batchingColor:Fe&&M._colorsTexture!==null,instancing:He,instancingColor:He&&M.instanceColor!==null,instancingMorph:He&&M.morphTexture!==null,outputColorSpace:se===null?i.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:mt,matcap:We,envMap:st,envMapMode:st&&ne.mapping,envMapCubeUVHeight:ae,aoMap:$e,lightMap:Xe,bumpMap:rt,normalMap:Mt,displacementMap:gt,emissiveMap:Bt,normalMapObjectSpace:Mt&&_.normalMapType===qd,normalMapTangentSpace:Mt&&_.normalMapType===Nl,packedNormalMap:Mt&&_.normalMapType===Nl&&Qx(_.normalMap.format),metalnessMap:Nt,roughnessMap:Ut,anisotropy:z,anisotropyMap:W,clearcoat:Zt,clearcoatMap:Z,clearcoatNormalMap:he,clearcoatRoughnessMap:ge,dispersion:ft,iridescence:R,iridescenceMap:K,iridescenceThicknessMap:ee,sheen:x,sheenColorMap:be,sheenRoughnessMap:Ne,specularMap:ye,specularColorMap:Me,specularIntensityMap:Oe,transmission:k,transmissionMap:Be,thicknessMap:je,gradientMap:O,opaque:_.transparent===!1&&_.blending===zn&&_.alphaToCoverage===!1,alphaMap:pe,alphaTest:J,alphaHash:ve,combine:_.combine,mapUv:mt&&g(_.map.channel),aoMapUv:$e&&g(_.aoMap.channel),lightMapUv:Xe&&g(_.lightMap.channel),bumpMapUv:rt&&g(_.bumpMap.channel),normalMapUv:Mt&&g(_.normalMap.channel),displacementMapUv:gt&&g(_.displacementMap.channel),emissiveMapUv:Bt&&g(_.emissiveMap.channel),metalnessMapUv:Nt&&g(_.metalnessMap.channel),roughnessMapUv:Ut&&g(_.roughnessMap.channel),anisotropyMapUv:W&&g(_.anisotropyMap.channel),clearcoatMapUv:Z&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:be&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&g(_.sheenRoughnessMap.channel),specularMapUv:ye&&g(_.specularMap.channel),specularColorMapUv:Me&&g(_.specularColorMap.channel),specularIntensityMapUv:Oe&&g(_.specularIntensityMap.channel),transmissionMapUv:Be&&g(_.transmissionMap.channel),thicknessMapUv:je&&g(_.thicknessMap.channel),alphaMapUv:pe&&g(_.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Mt||z),vertexNormals:!!H.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:M.isPoints===!0&&!!H.attributes.uv&&(mt||pe),fog:!!V,useFog:_.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||H.attributes.normal===void 0&&Mt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Pe,skinning:M.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:it,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:oe,decodeVideoTexture:mt&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===vt,decodeVideoTextureEmissive:Bt&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===vt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===kt,flipSided:_.side===tn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&_.extensions.multiDraw===!0||Fe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ae.vertexUv1s=l.has(1),Ae.vertexUv2s=l.has(2),Ae.vertexUv3s=l.has(3),l.clear(),Ae}function v(_){let C=[];if(_.shaderID?C.push(_.shaderID):(C.push(_.customVertexShaderID),C.push(_.customFragmentShaderID)),_.defines!==void 0)for(let U in _.defines)C.push(U),C.push(_.defines[U]);return _.isRawShaderMaterial===!1&&(m(C,_),E(C,_),C.push(i.outputColorSpace)),C.push(_.customProgramCacheKey),C.join()}function m(_,C){_.push(C.precision),_.push(C.outputColorSpace),_.push(C.envMapMode),_.push(C.envMapCubeUVHeight),_.push(C.mapUv),_.push(C.alphaMapUv),_.push(C.lightMapUv),_.push(C.aoMapUv),_.push(C.bumpMapUv),_.push(C.normalMapUv),_.push(C.displacementMapUv),_.push(C.emissiveMapUv),_.push(C.metalnessMapUv),_.push(C.roughnessMapUv),_.push(C.anisotropyMapUv),_.push(C.clearcoatMapUv),_.push(C.clearcoatNormalMapUv),_.push(C.clearcoatRoughnessMapUv),_.push(C.iridescenceMapUv),_.push(C.iridescenceThicknessMapUv),_.push(C.sheenColorMapUv),_.push(C.sheenRoughnessMapUv),_.push(C.specularMapUv),_.push(C.specularColorMapUv),_.push(C.specularIntensityMapUv),_.push(C.transmissionMapUv),_.push(C.thicknessMapUv),_.push(C.combine),_.push(C.fogExp2),_.push(C.sizeAttenuation),_.push(C.morphTargetsCount),_.push(C.morphAttributeCount),_.push(C.numDirLights),_.push(C.numPointLights),_.push(C.numSpotLights),_.push(C.numSpotLightMaps),_.push(C.numHemiLights),_.push(C.numRectAreaLights),_.push(C.numDirLightShadows),_.push(C.numPointLightShadows),_.push(C.numSpotLightShadows),_.push(C.numSpotLightShadowsWithMaps),_.push(C.numLightProbes),_.push(C.shadowMapType),_.push(C.toneMapping),_.push(C.numClippingPlanes),_.push(C.numClipIntersection),_.push(C.depthPacking)}function E(_,C){o.disableAll(),C.instancing&&o.enable(0),C.instancingColor&&o.enable(1),C.instancingMorph&&o.enable(2),C.matcap&&o.enable(3),C.envMap&&o.enable(4),C.normalMapObjectSpace&&o.enable(5),C.normalMapTangentSpace&&o.enable(6),C.clearcoat&&o.enable(7),C.iridescence&&o.enable(8),C.alphaTest&&o.enable(9),C.vertexColors&&o.enable(10),C.vertexAlphas&&o.enable(11),C.vertexUv1s&&o.enable(12),C.vertexUv2s&&o.enable(13),C.vertexUv3s&&o.enable(14),C.vertexTangents&&o.enable(15),C.anisotropy&&o.enable(16),C.alphaHash&&o.enable(17),C.batching&&o.enable(18),C.dispersion&&o.enable(19),C.batchingColor&&o.enable(20),C.gradientMap&&o.enable(21),C.packedNormalMap&&o.enable(22),C.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),C.fog&&o.enable(0),C.useFog&&o.enable(1),C.flatShading&&o.enable(2),C.logarithmicDepthBuffer&&o.enable(3),C.reversedDepthBuffer&&o.enable(4),C.skinning&&o.enable(5),C.morphTargets&&o.enable(6),C.morphNormals&&o.enable(7),C.morphColors&&o.enable(8),C.premultipliedAlpha&&o.enable(9),C.shadowMapEnabled&&o.enable(10),C.doubleSided&&o.enable(11),C.flipSided&&o.enable(12),C.useDepthPacking&&o.enable(13),C.dithering&&o.enable(14),C.transmission&&o.enable(15),C.sheen&&o.enable(16),C.opaque&&o.enable(17),C.pointsUvs&&o.enable(18),C.decodeVideoTexture&&o.enable(19),C.decodeVideoTextureEmissive&&o.enable(20),C.alphaToCoverage&&o.enable(21),C.numLightProbeGrids>0&&o.enable(22),C.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function L(_){let C=p[_.type],U;if(C){let I=wi[C];U=ci.clone(I.uniforms)}else U=_.uniforms;return U}function b(_,C){let U=u.get(C);return U!==void 0?++U.usedTimes:(U=new $x(i,C,_,s),c.push(U),u.set(C,U)),U}function A(_){if(--_.usedTimes===0){let C=c.indexOf(_);c[C]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){a.remove(_)}function P(){a.dispose()}return{getParameters:y,getProgramCacheKey:v,getUniforms:L,acquireProgram:b,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:P}}function t_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function n_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Ef(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Tf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function a(h,p,g,y,v,m){let E=i[e];return E===void 0?(E={id:h.id,object:h,geometry:p,material:g,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:v,group:m},i[e]=E):(E.id=h.id,E.object=h,E.geometry=p,E.material=g,E.materialVariant=o(h),E.groupOrder=y,E.renderOrder=h.renderOrder,E.z=v,E.group=m),e++,E}function l(h,p,g,y,v,m){let E=a(h,p,g,y,v,m);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):t.push(E)}function c(h,p,g,y,v,m){let E=a(h,p,g,y,v,m);g.transmission>0?n.unshift(E):g.transparent===!0?s.unshift(E):t.unshift(E)}function u(h,p,g){t.length>1&&t.sort(h||n_),n.length>1&&n.sort(p||Ef),s.length>1&&s.sort(p||Ef),g&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let h=e,p=i.length;h<p;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function i_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Tf,i.set(n,[o])):s>=r.length?(o=new Tf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function s_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Te};break;case"SpotLight":t={position:new D,direction:new D,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function r_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var o_=0;function a_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function l_(i){let e=new s_,t=r_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new ke,o=new ke;function a(c){let u=0,d=0,h=0;for(let C=0;C<9;C++)n.probe[C].set(0,0,0);let p=0,g=0,y=0,v=0,m=0,E=0,L=0,b=0,A=0,T=0,P=0;c.sort(a_);for(let C=0,U=c.length;C<U;C++){let I=c[C],M=I.color,B=I.intensity,V=I.distance,H=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===vn?H=I.shadow.map.texture:H=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=M.r*B,d+=M.g*B,h+=M.b*B;else if(I.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(I.sh.coefficients[X],B);P++}else if(I.isDirectionalLight){let X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,ne=t.get(I);ne.shadowIntensity=q.intensity,ne.shadowBias=q.bias,ne.shadowNormalBias=q.normalBias,ne.shadowRadius=q.radius,ne.shadowMapSize=q.mapSize,n.directionalShadow[p]=ne,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=I.shadow.matrix,E++}n.directional[p]=X,p++}else if(I.isSpotLight){let X=e.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(M).multiplyScalar(B),X.distance=V,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,n.spot[y]=X;let q=I.shadow;if(I.map&&(n.spotLightMap[A]=I.map,A++,q.updateMatrices(I),I.castShadow&&T++),n.spotLightMatrix[y]=q.matrix,I.castShadow){let ne=t.get(I);ne.shadowIntensity=q.intensity,ne.shadowBias=q.bias,ne.shadowNormalBias=q.normalBias,ne.shadowRadius=q.radius,ne.shadowMapSize=q.mapSize,n.spotShadow[y]=ne,n.spotShadowMap[y]=H,b++}y++}else if(I.isRectAreaLight){let X=e.get(I);X.color.copy(M).multiplyScalar(B),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),n.rectArea[v]=X,v++}else if(I.isPointLight){let X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),X.distance=I.distance,X.decay=I.decay,I.castShadow){let q=I.shadow,ne=t.get(I);ne.shadowIntensity=q.intensity,ne.shadowBias=q.bias,ne.shadowNormalBias=q.normalBias,ne.shadowRadius=q.radius,ne.shadowMapSize=q.mapSize,ne.shadowCameraNear=q.camera.near,ne.shadowCameraFar=q.camera.far,n.pointShadow[g]=ne,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=I.shadow.matrix,L++}n.point[g]=X,g++}else if(I.isHemisphereLight){let X=e.get(I);X.skyColor.copy(I.color).multiplyScalar(B),X.groundColor.copy(I.groundColor).multiplyScalar(B),n.hemi[m]=X,m++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=we.LTC_FLOAT_1,n.rectAreaLTC2=we.LTC_FLOAT_2):(n.rectAreaLTC1=we.LTC_HALF_1,n.rectAreaLTC2=we.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let _=n.hash;(_.directionalLength!==p||_.pointLength!==g||_.spotLength!==y||_.rectAreaLength!==v||_.hemiLength!==m||_.numDirectionalShadows!==E||_.numPointShadows!==L||_.numSpotShadows!==b||_.numSpotMaps!==A||_.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=v,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=L,n.pointShadowMap.length=L,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=L,n.spotLightMatrix.length=b+A-T,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,_.directionalLength=p,_.pointLength=g,_.spotLength=y,_.rectAreaLength=v,_.hemiLength=m,_.numDirectionalShadows=E,_.numPointShadows=L,_.numSpotShadows=b,_.numSpotMaps=A,_.numLightProbes=P,n.version=o_++)}function l(c,u){let d=0,h=0,p=0,g=0,y=0,v=u.matrixWorldInverse;for(let m=0,E=c.length;m<E;m++){let L=c[m];if(L.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(v),d++}else if(L.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(v),b.direction.setFromMatrixPosition(L.matrixWorld),s.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(v),p++}else if(L.isRectAreaLight){let b=n.rectArea[g];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(v),o.identity(),r.copy(L.matrixWorld),r.premultiply(v),o.extractRotation(r),b.halfWidth.set(L.width*.5,0,0),b.halfHeight.set(0,L.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(L.isPointLight){let b=n.point[h];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(v),h++}else if(L.isHemisphereLight){let b=n.hemi[y];b.direction.setFromMatrixPosition(L.matrixWorld),b.direction.transformDirection(v),y++}}}return{setup:a,setupView:l,state:n}}function wf(i){let e=new l_(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function o(h){t.push(h)}function a(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function c_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new wf(i),e.set(s,[a])):r>=o.length?(a=new wf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var u_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h_=`uniform sampler2D shadow_pass;
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
}`,d_=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],f_=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Af=new ke,Ho=new D,wu=new D;function p_(i,e,t){let n=new Mr,s=new _e,r=new _e,o=new dt,a=new Oa,l=new za,c={},u=t.maxTextureSize,d={[On]:tn,[tn]:On,[kt]:kt},h=new at({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:u_,fragmentShader:h_}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let g=new bt;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new pt(g,h),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eo;let m=this.type;this.render=function(T,P,_){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||T.length===0)return;this.type===Md&&(Ue("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Eo);let C=i.getRenderTarget(),U=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),M=i.state;M.setBlending(In),M.buffers.depth.getReversed()===!0?M.buffers.color.setClear(0,0,0,0):M.buffers.color.setClear(1,1,1,1),M.buffers.depth.setTest(!0),M.setScissorTest(!1);let B=m!==this.type;B&&P.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(H=>H.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,H=T.length;V<H;V++){let X=T[V],q=X.shadow;if(q===void 0){Ue("WebGLShadowMap:",X,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ne=q.getFrameExtents();s.multiply(ne),r.copy(q.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,q.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,q.mapSize.y=r.y));let ae=i.state.buffers.depth.getReversed();if(q.camera._reversedDepth=ae,q.map===null||B===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===wr){if(X.isPointLight){Ue("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new Wt(s.x,s.y,{format:vn,type:un,minFilter:yt,magFilter:yt,generateMipmaps:!1}),q.map.texture.name=X.name+".shadowMap",q.map.depthTexture=new ki(s.x,s.y,Bn),q.map.depthTexture.name=X.name+".shadowMapDepth",q.map.depthTexture.format=mi,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Gt,q.map.depthTexture.magFilter=Gt}else X.isPointLight?(q.map=new kl(s.x),q.map.depthTexture=new Ua(s.x,li)):(q.map=new Wt(s.x,s.y),q.map.depthTexture=new ki(s.x,s.y,li)),q.map.depthTexture.name=X.name+".shadowMap",q.map.depthTexture.format=mi,this.type===Eo?(q.map.depthTexture.compareFunction=ae?Ul:Fl,q.map.depthTexture.minFilter=yt,q.map.depthTexture.magFilter=yt):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Gt,q.map.depthTexture.magFilter=Gt);q.camera.updateProjectionMatrix()}let le=q.map.isWebGLCubeRenderTarget?6:1;for(let fe=0;fe<le;fe++){if(q.map.isWebGLCubeRenderTarget)i.setRenderTarget(q.map,fe),i.clear();else{fe===0&&(i.setRenderTarget(q.map),i.clear());let Ee=q.getViewport(fe);o.set(r.x*Ee.x,r.y*Ee.y,r.x*Ee.z,r.y*Ee.w),M.viewport(o)}if(X.isPointLight){let Ee=q.camera,it=q.matrix,Ze=X.distance||Ee.far;Ze!==Ee.far&&(Ee.far=Ze,Ee.updateProjectionMatrix()),Ho.setFromMatrixPosition(X.matrixWorld),Ee.position.copy(Ho),wu.copy(Ee.position),wu.add(d_[fe]),Ee.up.copy(f_[fe]),Ee.lookAt(wu),Ee.updateMatrixWorld(),it.makeTranslation(-Ho.x,-Ho.y,-Ho.z),Af.multiplyMatrices(Ee.projectionMatrix,Ee.matrixWorldInverse),q._frustum.setFromProjectionMatrix(Af,Ee.coordinateSystem,Ee.reversedDepth)}else q.updateMatrices(X);n=q.getFrustum(),b(P,_,q.camera,X,this.type)}q.isPointLightShadow!==!0&&this.type===wr&&E(q,_),q.needsUpdate=!1}m=this.type,v.needsUpdate=!1,i.setRenderTarget(C,U,I)};function E(T,P){let _=e.update(y);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wt(s.x,s.y,{format:vn,type:un})),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,_,h,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,_,p,y,null)}function L(T,P,_,C){let U=null,I=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)U=I;else if(U=_.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let M=U.uuid,B=P.uuid,V=c[M];V===void 0&&(V={},c[M]=V);let H=V[B];H===void 0&&(H=U.clone(),V[B]=H,P.addEventListener("dispose",A)),U=H}if(U.visible=P.visible,U.wireframe=P.wireframe,C===wr?U.side=P.shadowSide!==null?P.shadowSide:P.side:U.side=P.shadowSide!==null?P.shadowSide:d[P.side],U.alphaMap=P.alphaMap,U.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,U.map=P.map,U.clipShadows=P.clipShadows,U.clippingPlanes=P.clippingPlanes,U.clipIntersection=P.clipIntersection,U.displacementMap=P.displacementMap,U.displacementScale=P.displacementScale,U.displacementBias=P.displacementBias,U.wireframeLinewidth=P.wireframeLinewidth,U.linewidth=P.linewidth,_.isPointLight===!0&&U.isMeshDistanceMaterial===!0){let M=i.properties.get(U);M.light=_}return U}function b(T,P,_,C,U){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&U===wr)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let B=e.update(T),V=T.material;if(Array.isArray(V)){let H=B.groups;for(let X=0,q=H.length;X<q;X++){let ne=H[X],ae=V[ne.materialIndex];if(ae&&ae.visible){let le=L(T,ae,C,U);T.onBeforeShadow(i,T,P,_,B,le,ne),i.renderBufferDirect(_,null,B,le,T,ne),T.onAfterShadow(i,T,P,_,B,le,ne)}}}else if(V.visible){let H=L(T,V,C,U);T.onBeforeShadow(i,T,P,_,B,H,null),i.renderBufferDirect(_,null,B,H,T,null),T.onAfterShadow(i,T,P,_,B,H,null)}}let M=T.children;for(let B=0,V=M.length;B<V;B++)b(M[B],P,_,C,U)}function A(T){T.target.removeEventListener("dispose",A);for(let _ in c){let C=c[_],U=T.target.uuid;U in C&&(C[U].dispose(),delete C[U])}}}function m_(i,e){function t(){let O=!1,pe=new dt,J=null,ve=new dt(0,0,0,0);return{setMask:function(Se){J!==Se&&!O&&(i.colorMask(Se,Se,Se,Se),J=Se)},setLocked:function(Se){O=Se},setClear:function(Se,oe,Ae,Le,ot){ot===!0&&(Se*=Le,oe*=Le,Ae*=Le),pe.set(Se,oe,Ae,Le),ve.equals(pe)===!1&&(i.clearColor(Se,oe,Ae,Le),ve.copy(pe))},reset:function(){O=!1,J=null,ve.set(-1,0,0,0)}}}function n(){let O=!1,pe=!1,J=null,ve=null,Se=null;return{setReversed:function(oe){if(pe!==oe){let Ae=e.get("EXT_clip_control");oe?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),pe=oe;let Le=Se;Se=null,this.setClear(Le)}},getReversed:function(){return pe},setTest:function(oe){oe?se(i.DEPTH_TEST):Pe(i.DEPTH_TEST)},setMask:function(oe){J!==oe&&!O&&(i.depthMask(oe),J=oe)},setFunc:function(oe){if(pe&&(oe=nf[oe]),ve!==oe){switch(oe){case Ea:i.depthFunc(i.NEVER);break;case Ta:i.depthFunc(i.ALWAYS);break;case wa:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case Aa:i.depthFunc(i.EQUAL);break;case Ra:i.depthFunc(i.GEQUAL);break;case Ca:i.depthFunc(i.GREATER);break;case Pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=oe}},setLocked:function(oe){O=oe},setClear:function(oe){Se!==oe&&(Se=oe,pe&&(oe=1-oe),i.clearDepth(oe))},reset:function(){O=!1,J=null,ve=null,Se=null,pe=!1}}}function s(){let O=!1,pe=null,J=null,ve=null,Se=null,oe=null,Ae=null,Le=null,ot=null;return{setTest:function(Tt){O||(Tt?se(i.STENCIL_TEST):Pe(i.STENCIL_TEST))},setMask:function(Tt){pe!==Tt&&!O&&(i.stencilMask(Tt),pe=Tt)},setFunc:function(Tt,Kt,jt){(J!==Tt||ve!==Kt||Se!==jt)&&(i.stencilFunc(Tt,Kt,jt),J=Tt,ve=Kt,Se=jt)},setOp:function(Tt,Kt,jt){(oe!==Tt||Ae!==Kt||Le!==jt)&&(i.stencilOp(Tt,Kt,jt),oe=Tt,Ae=Kt,Le=jt)},setLocked:function(Tt){O=Tt},setClear:function(Tt){ot!==Tt&&(i.clearStencil(Tt),ot=Tt)},reset:function(){O=!1,pe=null,J=null,ve=null,Se=null,oe=null,Ae=null,Le=null,ot=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},h={},p=new WeakMap,g=[],y=null,v=!1,m=null,E=null,L=null,b=null,A=null,T=null,P=null,_=new Te(0,0,0),C=0,U=!1,I=null,M=null,B=null,V=null,H=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ne=0,ae=i.getParameter(i.VERSION);ae.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(ae)[1]),q=ne>=1):ae.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(ae)[1]),q=ne>=2);let le=null,fe={},Ee=i.getParameter(i.SCISSOR_BOX),it=i.getParameter(i.VIEWPORT),Ze=new dt().fromArray(Ee),Re=new dt().fromArray(it);function Y(O,pe,J,ve){let Se=new Uint8Array(4),oe=i.createTexture();i.bindTexture(O,oe),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<J;Ae++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,Se):i.texImage2D(pe+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Se);return oe}let ce={};ce[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(i.DEPTH_TEST),o.setFunc(ws),rt(!1),Mt(iu),se(i.CULL_FACE),$e(In);function se(O){u[O]!==!0&&(i.enable(O),u[O]=!0)}function Pe(O){u[O]!==!1&&(i.disable(O),u[O]=!1)}function He(O,pe){return h[O]!==pe?(i.bindFramebuffer(O,pe),h[O]=pe,O===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pe),O===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function Fe(O,pe){let J=g,ve=!1;if(O){J=p.get(pe),J===void 0&&(J=[],p.set(pe,J));let Se=O.textures;if(J.length!==Se.length||J[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,Ae=Se.length;oe<Ae;oe++)J[oe]=i.COLOR_ATTACHMENT0+oe;J.length=Se.length,ve=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,ve=!0);ve&&i.drawBuffers(J)}function mt(O){return y!==O?(i.useProgram(O),y=O,!0):!1}let We={[cs]:i.FUNC_ADD,[Ed]:i.FUNC_SUBTRACT,[Td]:i.FUNC_REVERSE_SUBTRACT};We[wd]=i.MIN,We[Ad]=i.MAX;let st={[Rd]:i.ZERO,[Cd]:i.ONE,[Pd]:i.SRC_COLOR,[Ma]:i.SRC_ALPHA,[Ud]:i.SRC_ALPHA_SATURATE,[Nd]:i.DST_COLOR,[Ld]:i.DST_ALPHA,[Id]:i.ONE_MINUS_SRC_COLOR,[Sa]:i.ONE_MINUS_SRC_ALPHA,[Fd]:i.ONE_MINUS_DST_COLOR,[Dd]:i.ONE_MINUS_DST_ALPHA,[Od]:i.CONSTANT_COLOR,[zd]:i.ONE_MINUS_CONSTANT_COLOR,[Bd]:i.CONSTANT_ALPHA,[kd]:i.ONE_MINUS_CONSTANT_ALPHA};function $e(O,pe,J,ve,Se,oe,Ae,Le,ot,Tt){if(O===In){v===!0&&(Pe(i.BLEND),v=!1);return}if(v===!1&&(se(i.BLEND),v=!0),O!==Sd){if(O!==m||Tt!==U){if((E!==cs||A!==cs)&&(i.blendEquation(i.FUNC_ADD),E=cs,A=cs),Tt)switch(O){case zn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cn:i.blendFunc(i.ONE,i.ONE);break;case su:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ru:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ge("WebGLState: Invalid blending: ",O);break}else switch(O){case zn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case su:Ge("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ru:Ge("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ge("WebGLState: Invalid blending: ",O);break}L=null,b=null,T=null,P=null,_.set(0,0,0),C=0,m=O,U=Tt}return}Se=Se||pe,oe=oe||J,Ae=Ae||ve,(pe!==E||Se!==A)&&(i.blendEquationSeparate(We[pe],We[Se]),E=pe,A=Se),(J!==L||ve!==b||oe!==T||Ae!==P)&&(i.blendFuncSeparate(st[J],st[ve],st[oe],st[Ae]),L=J,b=ve,T=oe,P=Ae),(Le.equals(_)===!1||ot!==C)&&(i.blendColor(Le.r,Le.g,Le.b,ot),_.copy(Le),C=ot),m=O,U=!1}function Xe(O,pe){O.side===kt?Pe(i.CULL_FACE):se(i.CULL_FACE);let J=O.side===tn;pe&&(J=!J),rt(J),O.blending===zn&&O.transparent===!1?$e(In):$e(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);let ve=O.stencilWrite;a.setTest(ve),ve&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Bt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?se(i.SAMPLE_ALPHA_TO_COVERAGE):Pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(O){I!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),I=O)}function Mt(O){O!==yd?(se(i.CULL_FACE),O!==M&&(O===iu?i.cullFace(i.BACK):O===bd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pe(i.CULL_FACE),M=O}function gt(O){O!==B&&(q&&i.lineWidth(O),B=O)}function Bt(O,pe,J){O?(se(i.POLYGON_OFFSET_FILL),(V!==pe||H!==J)&&(V=pe,H=J,o.getReversed()&&(pe=-pe),i.polygonOffset(pe,J))):Pe(i.POLYGON_OFFSET_FILL)}function Nt(O){O?se(i.SCISSOR_TEST):Pe(i.SCISSOR_TEST)}function Ut(O){O===void 0&&(O=i.TEXTURE0+X-1),le!==O&&(i.activeTexture(O),le=O)}function z(O,pe,J){J===void 0&&(le===null?J=i.TEXTURE0+X-1:J=le);let ve=fe[J];ve===void 0&&(ve={type:void 0,texture:void 0},fe[J]=ve),(ve.type!==O||ve.texture!==pe)&&(le!==J&&(i.activeTexture(J),le=J),i.bindTexture(O,pe||ce[O]),ve.type=O,ve.texture=pe)}function Zt(){let O=fe[le];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ft(){try{i.compressedTexImage2D(...arguments)}catch(O){Ge("WebGLState:",O)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(O){Ge("WebGLState:",O)}}function x(){try{i.texSubImage2D(...arguments)}catch(O){Ge("WebGLState:",O)}}function k(){try{i.texSubImage3D(...arguments)}catch(O){Ge("WebGLState:",O)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(O){Ge("WebGLState:",O)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(O){Ge("WebGLState:",O)}}function he(){try{i.texStorage2D(...arguments)}catch(O){Ge("WebGLState:",O)}}function ge(){try{i.texStorage3D(...arguments)}catch(O){Ge("WebGLState:",O)}}function K(){try{i.texImage2D(...arguments)}catch(O){Ge("WebGLState:",O)}}function ee(){try{i.texImage3D(...arguments)}catch(O){Ge("WebGLState:",O)}}function be(O){return d[O]!==void 0?d[O]:i.getParameter(O)}function Ne(O,pe){d[O]!==pe&&(i.pixelStorei(O,pe),d[O]=pe)}function ye(O){Ze.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),Ze.copy(O))}function Me(O){Re.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Re.copy(O))}function Oe(O,pe){let J=c.get(pe);J===void 0&&(J=new WeakMap,c.set(pe,J));let ve=J.get(O);ve===void 0&&(ve=i.getUniformBlockIndex(pe,O.name),J.set(O,ve))}function Be(O,pe){let ve=c.get(pe).get(O);l.get(pe)!==ve&&(i.uniformBlockBinding(pe,ve,O.__bindingPointIndex),l.set(pe,ve))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},le=null,fe={},h={},p=new WeakMap,g=[],y=null,v=!1,m=null,E=null,L=null,b=null,A=null,T=null,P=null,_=new Te(0,0,0),C=0,U=!1,I=null,M=null,B=null,V=null,H=null,Ze.set(0,0,i.canvas.width,i.canvas.height),Re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:Pe,bindFramebuffer:He,drawBuffers:Fe,useProgram:mt,setBlending:$e,setMaterial:Xe,setFlipSided:rt,setCullFace:Mt,setLineWidth:gt,setPolygonOffset:Bt,setScissorTest:Nt,activeTexture:Ut,bindTexture:z,unbindTexture:Zt,compressedTexImage2D:ft,compressedTexImage3D:R,texImage2D:K,texImage3D:ee,pixelStorei:Ne,getParameter:be,updateUBOMapping:Oe,uniformBlockBinding:Be,texStorage2D:he,texStorage3D:ge,texSubImage2D:x,texSubImage3D:k,compressedTexSubImage2D:W,compressedTexSubImage3D:Z,scissor:ye,viewport:Me,reset:je}}function g_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new _e,u=new WeakMap,d=new Set,h,p=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,x){return g?new OffscreenCanvas(R,x):fr("canvas")}function v(R,x,k){let W=1,Z=ft(R);if((Z.width>k||Z.height>k)&&(W=k/Math.max(Z.width,Z.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let he=Math.floor(W*Z.width),ge=Math.floor(W*Z.height);h===void 0&&(h=y(he,ge));let K=x?y(he,ge):h;return K.width=he,K.height=ge,K.getContext("2d").drawImage(R,0,0,he,ge),Ue("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+he+"x"+ge+")."),K}else return"data"in R&&Ue("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function m(R){return R.generateMipmaps}function E(R){i.generateMipmap(R)}function L(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(R,x,k,W,Z,he=!1){if(R!==null){if(i[R]!==void 0)return i[R];Ue("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ge;W&&(ge=e.get("EXT_texture_norm16"),ge||Ue("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===i.RED&&(k===i.FLOAT&&(K=i.R32F),k===i.HALF_FLOAT&&(K=i.R16F),k===i.UNSIGNED_BYTE&&(K=i.R8),k===i.UNSIGNED_SHORT&&ge&&(K=ge.R16_EXT),k===i.SHORT&&ge&&(K=ge.R16_SNORM_EXT)),x===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.R8UI),k===i.UNSIGNED_SHORT&&(K=i.R16UI),k===i.UNSIGNED_INT&&(K=i.R32UI),k===i.BYTE&&(K=i.R8I),k===i.SHORT&&(K=i.R16I),k===i.INT&&(K=i.R32I)),x===i.RG&&(k===i.FLOAT&&(K=i.RG32F),k===i.HALF_FLOAT&&(K=i.RG16F),k===i.UNSIGNED_BYTE&&(K=i.RG8),k===i.UNSIGNED_SHORT&&ge&&(K=ge.RG16_EXT),k===i.SHORT&&ge&&(K=ge.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RG8UI),k===i.UNSIGNED_SHORT&&(K=i.RG16UI),k===i.UNSIGNED_INT&&(K=i.RG32UI),k===i.BYTE&&(K=i.RG8I),k===i.SHORT&&(K=i.RG16I),k===i.INT&&(K=i.RG32I)),x===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGB8UI),k===i.UNSIGNED_SHORT&&(K=i.RGB16UI),k===i.UNSIGNED_INT&&(K=i.RGB32UI),k===i.BYTE&&(K=i.RGB8I),k===i.SHORT&&(K=i.RGB16I),k===i.INT&&(K=i.RGB32I)),x===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),k===i.UNSIGNED_INT&&(K=i.RGBA32UI),k===i.BYTE&&(K=i.RGBA8I),k===i.SHORT&&(K=i.RGBA16I),k===i.INT&&(K=i.RGBA32I)),x===i.RGB&&(k===i.UNSIGNED_SHORT&&ge&&(K=ge.RGB16_EXT),k===i.SHORT&&ge&&(K=ge.RGB16_SNORM_EXT),k===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),x===i.RGBA){let ee=he?so:et.getTransfer(Z);k===i.FLOAT&&(K=i.RGBA32F),k===i.HALF_FLOAT&&(K=i.RGBA16F),k===i.UNSIGNED_BYTE&&(K=ee===vt?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT&&ge&&(K=ge.RGBA16_EXT),k===i.SHORT&&ge&&(K=ge.RGBA16_SNORM_EXT),k===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function A(R,x){let k;return R?x===null||x===li||x===Cr?k=i.DEPTH24_STENCIL8:x===Bn?k=i.DEPTH32F_STENCIL8:x===Rr&&(k=i.DEPTH24_STENCIL8,Ue("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===li||x===Cr?k=i.DEPTH_COMPONENT24:x===Bn?k=i.DEPTH_COMPONENT32F:x===Rr&&(k=i.DEPTH_COMPONENT16),k}function T(R,x){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Gt&&R.minFilter!==yt?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function P(R){let x=R.target;x.removeEventListener("dispose",P),C(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function _(R){let x=R.target;x.removeEventListener("dispose",_),I(x)}function C(R){let x=n.get(R);if(x.__webglInit===void 0)return;let k=R.source,W=p.get(k);if(W){let Z=W[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&U(R),Object.keys(W).length===0&&p.delete(k)}n.remove(R)}function U(R){let x=n.get(R);i.deleteTexture(x.__webglTexture);let k=R.source,W=p.get(k);delete W[x.__cacheKey],o.memory.textures--}function I(R){let x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let Z=0;Z<x.__webglFramebuffer[W].length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[W][Z]);else i.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)i.deleteFramebuffer(x.__webglFramebuffer[W]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let k=R.textures;for(let W=0,Z=k.length;W<Z;W++){let he=n.get(k[W]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),o.memory.textures--),n.remove(k[W])}n.remove(R)}let M=0;function B(){M=0}function V(){return M}function H(R){M=R}function X(){let R=M;return R>=s.maxTextures&&Ue("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),M+=1,R}function q(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function ne(R,x){let k=n.get(R);if(R.isVideoTexture&&z(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&k.__version!==R.version){let W=R.image;if(W===null)Ue("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Ue("WebGLRenderer: Texture marked for update but image is incomplete");else{Pe(k,R,x);return}}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+x)}function ae(R,x){let k=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){Pe(k,R,x);return}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+x)}function le(R,x){let k=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){Pe(k,R,x);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+x)}function fe(R,x){let k=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&k.__version!==R.version){He(k,R,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+x)}let Ee={[An]:i.REPEAT,[Yn]:i.CLAMP_TO_EDGE,[hr]:i.MIRRORED_REPEAT},it={[Gt]:i.NEAREST,[ja]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[yt]:i.LINEAR,[Ar]:i.LINEAR_MIPMAP_NEAREST,[ai]:i.LINEAR_MIPMAP_LINEAR},Ze={[Yd]:i.NEVER,[Jd]:i.ALWAYS,[Zd]:i.LESS,[Fl]:i.LEQUAL,[Kd]:i.EQUAL,[Ul]:i.GEQUAL,[jd]:i.GREATER,[$d]:i.NOTEQUAL};function Re(R,x){if(x.type===Bn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===yt||x.magFilter===Ar||x.magFilter===zs||x.magFilter===ai||x.minFilter===yt||x.minFilter===Ar||x.minFilter===zs||x.minFilter===ai)&&Ue("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Ee[x.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Ee[x.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Ee[x.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,it[x.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,it[x.minFilter]),x.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ze[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Gt||x.minFilter!==zs&&x.minFilter!==ai||x.type===Bn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Y(R,x){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",P));let W=x.source,Z=p.get(W);Z===void 0&&(Z={},p.set(W,Z));let he=q(x);if(he!==R.__cacheKey){Z[he]===void 0&&(Z[he]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),Z[he].usedTimes++;let ge=Z[R.__cacheKey];ge!==void 0&&(Z[R.__cacheKey].usedTimes--,ge.usedTimes===0&&U(x)),R.__cacheKey=he,R.__webglTexture=Z[he].texture}return k}function ce(R,x,k){return Math.floor(Math.floor(R/k)/x)}function se(R,x,k,W){let he=R.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,k,W,x.data);else{he.sort((Ne,ye)=>Ne.start-ye.start);let ge=0;for(let Ne=1;Ne<he.length;Ne++){let ye=he[ge],Me=he[Ne],Oe=ye.start+ye.count,Be=ce(Me.start,x.width,4),je=ce(ye.start,x.width,4);Me.start<=Oe+1&&Be===je&&ce(Me.start+Me.count-1,x.width,4)===Be?ye.count=Math.max(ye.count,Me.start+Me.count-ye.start):(++ge,he[ge]=Me)}he.length=ge+1;let K=t.getParameter(i.UNPACK_ROW_LENGTH),ee=t.getParameter(i.UNPACK_SKIP_PIXELS),be=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Ne=0,ye=he.length;Ne<ye;Ne++){let Me=he[Ne],Oe=Math.floor(Me.start/4),Be=Math.ceil(Me.count/4),je=Oe%x.width,O=Math.floor(Oe/x.width),pe=Be,J=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,je),t.pixelStorei(i.UNPACK_SKIP_ROWS,O),t.texSubImage2D(i.TEXTURE_2D,0,je,O,pe,J,k,W,x.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,K),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(i.UNPACK_SKIP_ROWS,be)}}function Pe(R,x,k){let W=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=i.TEXTURE_3D);let Z=Y(R,x),he=x.source;t.bindTexture(W,R.__webglTexture,i.TEXTURE0+k);let ge=n.get(he);if(he.version!==ge.__version||Z===!0){if(t.activeTexture(i.TEXTURE0+k),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let J=et.getPrimaries(et.workingColorSpace),ve=x.colorSpace===Ki?null:et.getPrimaries(x.colorSpace),Se=x.colorSpace===Ki||J===ve?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let ee=v(x.image,!1,s.maxTextureSize);ee=Zt(x,ee);let be=r.convert(x.format,x.colorSpace),Ne=r.convert(x.type),ye=b(x.internalFormat,be,Ne,x.normalized,x.colorSpace,x.isVideoTexture);Re(W,x);let Me,Oe=x.mipmaps,Be=x.isVideoTexture!==!0,je=ge.__version===void 0||Z===!0,O=he.dataReady,pe=T(x,ee);if(x.isDepthTexture)ye=A(x.format===ms,x.type),je&&(Be?t.texStorage2D(i.TEXTURE_2D,1,ye,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,ye,ee.width,ee.height,0,be,Ne,null));else if(x.isDataTexture)if(Oe.length>0){Be&&je&&t.texStorage2D(i.TEXTURE_2D,pe,ye,Oe[0].width,Oe[0].height);for(let J=0,ve=Oe.length;J<ve;J++)Me=Oe[J],Be?O&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Me.width,Me.height,be,Ne,Me.data):t.texImage2D(i.TEXTURE_2D,J,ye,Me.width,Me.height,0,be,Ne,Me.data);x.generateMipmaps=!1}else Be?(je&&t.texStorage2D(i.TEXTURE_2D,pe,ye,ee.width,ee.height),O&&se(x,ee,be,Ne)):t.texImage2D(i.TEXTURE_2D,0,ye,ee.width,ee.height,0,be,Ne,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Be&&je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ye,Oe[0].width,Oe[0].height,ee.depth);for(let J=0,ve=Oe.length;J<ve;J++)if(Me=Oe[J],x.format!==kn)if(be!==null)if(Be){if(O)if(x.layerUpdates.size>0){let Se=yu(Me.width,Me.height,x.format,x.type);for(let oe of x.layerUpdates){let Ae=Me.data.subarray(oe*Se/Me.data.BYTES_PER_ELEMENT,(oe+1)*Se/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,oe,Me.width,Me.height,1,be,Ae)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,ee.depth,be,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,ye,Me.width,Me.height,ee.depth,0,Me.data,0,0);else Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,ee.depth,be,Ne,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,ye,Me.width,Me.height,ee.depth,0,be,Ne,Me.data)}else{Be&&je&&t.texStorage2D(i.TEXTURE_2D,pe,ye,Oe[0].width,Oe[0].height);for(let J=0,ve=Oe.length;J<ve;J++)Me=Oe[J],x.format!==kn?be!==null?Be?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,Me.width,Me.height,be,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,J,ye,Me.width,Me.height,0,Me.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?O&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Me.width,Me.height,be,Ne,Me.data):t.texImage2D(i.TEXTURE_2D,J,ye,Me.width,Me.height,0,be,Ne,Me.data)}else if(x.isDataArrayTexture)if(Be){if(je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ye,ee.width,ee.height,ee.depth),O)if(x.layerUpdates.size>0){let J=yu(ee.width,ee.height,x.format,x.type);for(let ve of x.layerUpdates){let Se=ee.data.subarray(ve*J/ee.data.BYTES_PER_ELEMENT,(ve+1)*J/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ve,ee.width,ee.height,1,be,Ne,Se)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,be,Ne,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ye,ee.width,ee.height,ee.depth,0,be,Ne,ee.data);else if(x.isData3DTexture)Be?(je&&t.texStorage3D(i.TEXTURE_3D,pe,ye,ee.width,ee.height,ee.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,be,Ne,ee.data)):t.texImage3D(i.TEXTURE_3D,0,ye,ee.width,ee.height,ee.depth,0,be,Ne,ee.data);else if(x.isFramebufferTexture){if(je)if(Be)t.texStorage2D(i.TEXTURE_2D,pe,ye,ee.width,ee.height);else{let J=ee.width,ve=ee.height;for(let Se=0;Se<pe;Se++)t.texImage2D(i.TEXTURE_2D,Se,ye,J,ve,0,be,Ne,null),J>>=1,ve>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let J=i.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),ee.parentNode!==J){J.appendChild(ee),d.add(x),J.onpaint=ve=>{let Se=ve.changedElements;for(let oe of d)Se.includes(oe.image)&&(oe.needsUpdate=!0)},J.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ee);else{let Se=i.RGBA,oe=i.RGBA,Ae=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Se,oe,Ae,ee)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Oe.length>0){if(Be&&je){let J=ft(Oe[0]);t.texStorage2D(i.TEXTURE_2D,pe,ye,J.width,J.height)}for(let J=0,ve=Oe.length;J<ve;J++)Me=Oe[J],Be?O&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,be,Ne,Me):t.texImage2D(i.TEXTURE_2D,J,ye,be,Ne,Me);x.generateMipmaps=!1}else if(Be){if(je){let J=ft(ee);t.texStorage2D(i.TEXTURE_2D,pe,ye,J.width,J.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,Ne,ee)}else t.texImage2D(i.TEXTURE_2D,0,ye,be,Ne,ee);m(x)&&E(W),ge.__version=he.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function He(R,x,k){if(x.image.length!==6)return;let W=Y(R,x),Z=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+k);let he=n.get(Z);if(Z.version!==he.__version||W===!0){t.activeTexture(i.TEXTURE0+k);let ge=et.getPrimaries(et.workingColorSpace),K=x.colorSpace===Ki?null:et.getPrimaries(x.colorSpace),ee=x.colorSpace===Ki||ge===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let be=x.isCompressedTexture||x.image[0].isCompressedTexture,Ne=x.image[0]&&x.image[0].isDataTexture,ye=[];for(let oe=0;oe<6;oe++)!be&&!Ne?ye[oe]=v(x.image[oe],!0,s.maxCubemapSize):ye[oe]=Ne?x.image[oe].image:x.image[oe],ye[oe]=Zt(x,ye[oe]);let Me=ye[0],Oe=r.convert(x.format,x.colorSpace),Be=r.convert(x.type),je=b(x.internalFormat,Oe,Be,x.normalized,x.colorSpace),O=x.isVideoTexture!==!0,pe=he.__version===void 0||W===!0,J=Z.dataReady,ve=T(x,Me);Re(i.TEXTURE_CUBE_MAP,x);let Se;if(be){O&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,je,Me.width,Me.height);for(let oe=0;oe<6;oe++){Se=ye[oe].mipmaps;for(let Ae=0;Ae<Se.length;Ae++){let Le=Se[Ae];x.format!==kn?Oe!==null?O?J&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,0,0,Le.width,Le.height,Oe,Le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,je,Le.width,Le.height,0,Le.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,0,0,Le.width,Le.height,Oe,Be,Le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,je,Le.width,Le.height,0,Oe,Be,Le.data)}}}else{if(Se=x.mipmaps,O&&pe){Se.length>0&&ve++;let oe=ft(ye[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,je,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Ne){O?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ye[oe].width,ye[oe].height,Oe,Be,ye[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,je,ye[oe].width,ye[oe].height,0,Oe,Be,ye[oe].data);for(let Ae=0;Ae<Se.length;Ae++){let ot=Se[Ae].image[oe].image;O?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,0,0,ot.width,ot.height,Oe,Be,ot.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,je,ot.width,ot.height,0,Oe,Be,ot.data)}}else{O?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Oe,Be,ye[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,je,Oe,Be,ye[oe]);for(let Ae=0;Ae<Se.length;Ae++){let Le=Se[Ae];O?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,0,0,Oe,Be,Le.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,je,Oe,Be,Le.image[oe])}}}m(x)&&E(i.TEXTURE_CUBE_MAP),he.__version=Z.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Fe(R,x,k,W,Z,he){let ge=r.convert(k.format,k.colorSpace),K=r.convert(k.type),ee=b(k.internalFormat,ge,K,k.normalized,k.colorSpace),be=n.get(x),Ne=n.get(k);if(Ne.__renderTarget=x,!be.__hasExternalTextures){let ye=Math.max(1,x.width>>he),Me=Math.max(1,x.height>>he);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,he,ee,ye,Me,x.depth,0,ge,K,null):t.texImage2D(Z,he,ee,ye,Me,0,ge,K,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),Ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,Z,Ne.__webglTexture,0,Nt(x)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,Z,Ne.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function mt(R,x,k){if(i.bindRenderbuffer(i.RENDERBUFFER,R),x.depthBuffer){let W=x.depthTexture,Z=W&&W.isDepthTexture?W.type:null,he=A(x.stencilBuffer,Z),ge=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ut(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt(x),he,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt(x),he,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,he,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,R)}else{let W=x.textures;for(let Z=0;Z<W.length;Z++){let he=W[Z],ge=r.convert(he.format,he.colorSpace),K=r.convert(he.type),ee=b(he.internalFormat,ge,K,he.normalized,he.colorSpace);Ut(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt(x),ee,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt(x),ee,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ee,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function We(R,x,k){let W=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=n.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Re(i.TEXTURE_CUBE_MAP,x.depthTexture);let be=r.convert(x.depthTexture.format),Ne=r.convert(x.depthTexture.type),ye;x.depthTexture.format===mi?ye=i.DEPTH_COMPONENT24:x.depthTexture.format===ms&&(ye=i.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,ye,x.width,x.height,0,be,Ne,null)}}else ne(x.depthTexture,0);let he=Z.__webglTexture,ge=Nt(x),K=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+k:i.TEXTURE_2D,ee=x.depthTexture.format===ms?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===mi)Ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,K,he,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,ee,K,he,0);else if(x.depthTexture.format===ms)Ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,K,he,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,ee,K,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function st(R){let x=n.get(R),k=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let W=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){let Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",Z)};W.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=W}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(k)for(let W=0;W<6;W++)We(x.__webglFramebuffer[W],R,W);else{let W=R.texture.mipmaps;W&&W.length>0?We(x.__webglFramebuffer[0],R,0):We(x.__webglFramebuffer,R,0)}else if(k){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=i.createRenderbuffer(),mt(x.__webglDepthbuffer[W],R,!1);else{let Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=x.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,he)}}else{let W=R.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),mt(x.__webglDepthbuffer,R,!1);else{let Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function $e(R,x,k){let W=n.get(R);x!==void 0&&Fe(W.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&st(R)}function Xe(R){let x=R.texture,k=n.get(R),W=n.get(x);R.addEventListener("dispose",_);let Z=R.textures,he=R.isWebGLCubeRenderTarget===!0,ge=Z.length>1;if(ge||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=x.version,o.memory.textures++),he){k.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[K]=[];for(let ee=0;ee<x.mipmaps.length;ee++)k.__webglFramebuffer[K][ee]=i.createFramebuffer()}else k.__webglFramebuffer[K]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)k.__webglFramebuffer[K]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ge)for(let K=0,ee=Z.length;K<ee;K++){let be=n.get(Z[K]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Ut(R)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let K=0;K<Z.length;K++){let ee=Z[K];k.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[K]);let be=r.convert(ee.format,ee.colorSpace),Ne=r.convert(ee.type),ye=b(ee.internalFormat,be,Ne,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),Me=Nt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,ye,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,k.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),mt(k.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Re(i.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)Fe(k.__webglFramebuffer[K][ee],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ee);else Fe(k.__webglFramebuffer[K],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);m(x)&&E(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ge){for(let K=0,ee=Z.length;K<ee;K++){let be=Z[K],Ne=n.get(be),ye=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ye=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ye,Ne.__webglTexture),Re(ye,be),Fe(k.__webglFramebuffer,R,be,i.COLOR_ATTACHMENT0+K,ye,0),m(be)&&E(ye)}t.unbindTexture()}else{let K=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(K=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(K,W.__webglTexture),Re(K,x),x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)Fe(k.__webglFramebuffer[ee],R,x,i.COLOR_ATTACHMENT0,K,ee);else Fe(k.__webglFramebuffer,R,x,i.COLOR_ATTACHMENT0,K,0);m(x)&&E(K),t.unbindTexture()}R.depthBuffer&&st(R)}function rt(R){let x=R.textures;for(let k=0,W=x.length;k<W;k++){let Z=x[k];if(m(Z)){let he=L(R),ge=n.get(Z).__webglTexture;t.bindTexture(he,ge),E(he),t.unbindTexture()}}}let Mt=[],gt=[];function Bt(R){if(R.samples>0){if(Ut(R)===!1){let x=R.textures,k=R.width,W=R.height,Z=i.COLOR_BUFFER_BIT,he=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(R),K=x.length>1;if(K)for(let be=0;be<x.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let ee=R.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let be=0;be<x.length;be++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),K){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[be]);let Ne=n.get(x[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ne,0)}i.blitFramebuffer(0,0,k,W,0,0,k,W,Z,i.NEAREST),l===!0&&(Mt.length=0,gt.length=0,Mt.push(i.COLOR_ATTACHMENT0+be),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Mt.push(he),gt.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,gt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Mt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let be=0;be<x.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,ge.__webglColorRenderbuffer[be]);let Ne=n.get(x[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,Ne,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let x=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Nt(R){return Math.min(s.maxSamples,R.samples)}function Ut(R){let x=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function z(R){let x=o.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Zt(R,x){let k=R.colorSpace,W=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==Mn&&k!==Ki&&(et.getTransfer(k)===vt?(W!==kn||Z!==gn)&&Ue("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ge("WebGLTextures: Unsupported texture color space:",k)),x}function ft(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.getTextureUnits=V,this.setTextureUnits=H,this.setTexture2D=ne,this.setTexture2DArray=ae,this.setTexture3D=le,this.setTextureCube=fe,this.rebindTextures=$e,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=Bt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Fe,this.useMultisampledRTT=Ut,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function v_(i,e){function t(n,s=Ki){let r,o=et.getTransfer(s);if(n===gn)return i.UNSIGNED_BYTE;if(n===Ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lu)return i.BYTE;if(n===cu)return i.SHORT;if(n===Rr)return i.UNSIGNED_SHORT;if(n===$a)return i.INT;if(n===li)return i.UNSIGNED_INT;if(n===Bn)return i.FLOAT;if(n===un)return i.HALF_FLOAT;if(n===du)return i.ALPHA;if(n===fu)return i.RGB;if(n===kn)return i.RGBA;if(n===mi)return i.DEPTH_COMPONENT;if(n===ms)return i.DEPTH_STENCIL;if(n===el)return i.RED;if(n===tl)return i.RED_INTEGER;if(n===vn)return i.RG;if(n===nl)return i.RG_INTEGER;if(n===il)return i.RGBA_INTEGER;if(n===Do||n===No||n===Fo||n===Uo)if(o===vt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Do)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Do)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===No)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Uo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sl||n===rl||n===ol||n===al)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ol)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ll||n===cl||n===ul||n===hl||n===dl||n===Oo||n===fl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ll||n===cl)return o===vt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ul)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===hl)return r.COMPRESSED_R11_EAC;if(n===dl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Oo)return r.COMPRESSED_RG11_EAC;if(n===fl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===pl||n===ml||n===gl||n===vl||n===xl||n===_l||n===yl||n===bl||n===Ml||n===Sl||n===El||n===Tl||n===wl||n===Al)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===pl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_l)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===yl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ml)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===El)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Tl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rl||n===Cl||n===Pl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Rl)return o===vt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Il||n===Ll||n===zo||n===Dl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ll)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Dl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var x_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,__=`
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

}`,Nu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new po(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new at({vertexShader:x_,fragmentShader:__,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pt(new Vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fu=class extends ri{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,p=null,g=null,y=typeof XRWebGLBinding<"u",v=new Nu,m={},E=t.getContextAttributes(),L=null,b=null,A=[],T=[],P=new _e,_=null,C=new Qt;C.viewport=new dt;let U=new Qt;U.viewport=new dt;let I=[C,U],M=new Ya,B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ce=A[Y];return ce===void 0&&(ce=new xr,A[Y]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(Y){let ce=A[Y];return ce===void 0&&(ce=new xr,A[Y]=ce),ce.getGripSpace()},this.getHand=function(Y){let ce=A[Y];return ce===void 0&&(ce=new xr,A[Y]=ce),ce.getHandSpace()};function H(Y){let ce=T.indexOf(Y.inputSource);if(ce===-1)return;let se=A[ce];se!==void 0&&(se.update(Y.inputSource,Y.frame,c||o),se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",q);for(let Y=0;Y<A.length;Y++){let ce=T[Y];ce!==null&&(T[Y]=null,A[Y].disconnect(ce))}B=null,V=null,v.reset();for(let Y in m)delete m[Y];e.setRenderTarget(L),p=null,h=null,d=null,s=null,b=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&Ue("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&Ue("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(L=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",X),s.addEventListener("inputsourceschange",q),E.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let se=null,Pe=null,He=null;E.depth&&(He=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=E.stencil?ms:mi,Pe=E.stencil?Cr:li);let Fe={colorFormat:t.RGBA8,depthFormat:He,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Fe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),b=new Wt(h.textureWidth,h.textureHeight,{format:kn,type:gn,depthTexture:new ki(h.textureWidth,h.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let se={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,se),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Wt(p.framebufferWidth,p.framebufferHeight,{format:kn,type:gn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Re.setContext(s),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function q(Y){for(let ce=0;ce<Y.removed.length;ce++){let se=Y.removed[ce],Pe=T.indexOf(se);Pe>=0&&(T[Pe]=null,A[Pe].disconnect(se))}for(let ce=0;ce<Y.added.length;ce++){let se=Y.added[ce],Pe=T.indexOf(se);if(Pe===-1){for(let Fe=0;Fe<A.length;Fe++)if(Fe>=T.length){T.push(se),Pe=Fe;break}else if(T[Fe]===null){T[Fe]=se,Pe=Fe;break}if(Pe===-1)break}let He=A[Pe];He&&He.connect(se)}}let ne=new D,ae=new D;function le(Y,ce,se){ne.setFromMatrixPosition(ce.matrixWorld),ae.setFromMatrixPosition(se.matrixWorld);let Pe=ne.distanceTo(ae),He=ce.projectionMatrix.elements,Fe=se.projectionMatrix.elements,mt=He[14]/(He[10]-1),We=He[14]/(He[10]+1),st=(He[9]+1)/He[5],$e=(He[9]-1)/He[5],Xe=(He[8]-1)/He[0],rt=(Fe[8]+1)/Fe[0],Mt=mt*Xe,gt=mt*rt,Bt=Pe/(-Xe+rt),Nt=Bt*-Xe;if(ce.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Nt),Y.translateZ(Bt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),He[10]===-1)Y.projectionMatrix.copy(ce.projectionMatrix),Y.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{let Ut=mt+Bt,z=We+Bt,Zt=Mt-Nt,ft=gt+(Pe-Nt),R=st*We/z*Ut,x=$e*We/z*Ut;Y.projectionMatrix.makePerspective(Zt,ft,R,x,Ut,z),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function fe(Y,ce){ce===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ce.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ce=Y.near,se=Y.far;v.texture!==null&&(v.depthNear>0&&(ce=v.depthNear),v.depthFar>0&&(se=v.depthFar)),M.near=U.near=C.near=ce,M.far=U.far=C.far=se,(B!==M.near||V!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),B=M.near,V=M.far),M.layers.mask=Y.layers.mask|6,C.layers.mask=M.layers.mask&-5,U.layers.mask=M.layers.mask&-3;let Pe=Y.parent,He=M.cameras;fe(M,Pe);for(let Fe=0;Fe<He.length;Fe++)fe(He[Fe],Pe);He.length===2?le(M,C,U):M.projectionMatrix.copy(C.projectionMatrix),Ee(Y,M,Pe)};function Ee(Y,ce,se){se===null?Y.matrix.copy(ce.matrixWorld):(Y.matrix.copy(se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ce.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ce.projectionMatrix),Y.projectionMatrixInverse.copy(ce.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Cs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)},this.getCameraTexture=function(Y){return m[Y]};let it=null;function Ze(Y,ce){if(u=ce.getViewerPose(c||o),g=ce,u!==null){let se=u.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let Pe=!1;se.length!==M.cameras.length&&(M.cameras.length=0,Pe=!0);for(let We=0;We<se.length;We++){let st=se[We],$e=null;if(p!==null)$e=p.getViewport(st);else{let rt=d.getViewSubImage(h,st);$e=rt.viewport,We===0&&(e.setRenderTargetTextures(b,rt.colorTexture,rt.depthStencilTexture),e.setRenderTarget(b))}let Xe=I[We];Xe===void 0&&(Xe=new Qt,Xe.layers.enable(We),Xe.viewport=new dt,I[We]=Xe),Xe.matrix.fromArray(st.transform.matrix),Xe.matrix.decompose(Xe.position,Xe.quaternion,Xe.scale),Xe.projectionMatrix.fromArray(st.projectionMatrix),Xe.projectionMatrixInverse.copy(Xe.projectionMatrix).invert(),Xe.viewport.set($e.x,$e.y,$e.width,$e.height),We===0&&(M.matrix.copy(Xe.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Pe===!0&&M.cameras.push(Xe)}let He=s.enabledFeatures;if(He&&He.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();let We=d.getDepthInformation(se[0]);We&&We.isValid&&We.texture&&v.init(We,s.renderState)}if(He&&He.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let We=0;We<se.length;We++){let st=se[We].camera;if(st){let $e=m[st];$e||($e=new po,m[st]=$e);let Xe=d.getCameraImage(st);$e.sourceTexture=Xe}}}}for(let se=0;se<A.length;se++){let Pe=T[se],He=A[se];Pe!==null&&He!==void 0&&He.update(Pe,ce,c||o)}it&&it(Y,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),g=null}let Re=new Rf;Re.setAnimationLoop(Ze),this.setAnimationLoop=function(Y){it=Y},this.dispose=function(){}}},y_=new ke,Nf=new Ye;Nf.set(-1,0,0,0,1,0,0,0,1);function b_(i,e){function t(v,m){v.matrixAutoUpdate===!0&&v.updateMatrix(),m.value.copy(v.matrix)}function n(v,m){m.color.getRGB(v.fogColor.value,vu(i)),m.isFog?(v.fogNear.value=m.near,v.fogFar.value=m.far):m.isFogExp2&&(v.fogDensity.value=m.density)}function s(v,m,E,L,b){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(v,m):m.isMeshLambertMaterial?(r(v,m),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(v,m),d(v,m)):m.isMeshPhongMaterial?(r(v,m),u(v,m),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(v,m),h(v,m),m.isMeshPhysicalMaterial&&p(v,m,b)):m.isMeshMatcapMaterial?(r(v,m),g(v,m)):m.isMeshDepthMaterial?r(v,m):m.isMeshDistanceMaterial?(r(v,m),y(v,m)):m.isMeshNormalMaterial?r(v,m):m.isLineBasicMaterial?(o(v,m),m.isLineDashedMaterial&&a(v,m)):m.isPointsMaterial?l(v,m,E,L):m.isSpriteMaterial?c(v,m):m.isShadowMaterial?(v.color.value.copy(m.color),v.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(v,m){v.opacity.value=m.opacity,m.color&&v.diffuse.value.copy(m.color),m.emissive&&v.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(v.map.value=m.map,t(m.map,v.mapTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,t(m.alphaMap,v.alphaMapTransform)),m.bumpMap&&(v.bumpMap.value=m.bumpMap,t(m.bumpMap,v.bumpMapTransform),v.bumpScale.value=m.bumpScale,m.side===tn&&(v.bumpScale.value*=-1)),m.normalMap&&(v.normalMap.value=m.normalMap,t(m.normalMap,v.normalMapTransform),v.normalScale.value.copy(m.normalScale),m.side===tn&&v.normalScale.value.negate()),m.displacementMap&&(v.displacementMap.value=m.displacementMap,t(m.displacementMap,v.displacementMapTransform),v.displacementScale.value=m.displacementScale,v.displacementBias.value=m.displacementBias),m.emissiveMap&&(v.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,v.emissiveMapTransform)),m.specularMap&&(v.specularMap.value=m.specularMap,t(m.specularMap,v.specularMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest);let E=e.get(m),L=E.envMap,b=E.envMapRotation;L&&(v.envMap.value=L,v.envMapRotation.value.setFromMatrix4(y_.makeRotationFromEuler(b)).transpose(),L.isCubeTexture&&L.isRenderTargetTexture===!1&&v.envMapRotation.value.premultiply(Nf),v.reflectivity.value=m.reflectivity,v.ior.value=m.ior,v.refractionRatio.value=m.refractionRatio),m.lightMap&&(v.lightMap.value=m.lightMap,v.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,v.lightMapTransform)),m.aoMap&&(v.aoMap.value=m.aoMap,v.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,v.aoMapTransform))}function o(v,m){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,m.map&&(v.map.value=m.map,t(m.map,v.mapTransform))}function a(v,m){v.dashSize.value=m.dashSize,v.totalSize.value=m.dashSize+m.gapSize,v.scale.value=m.scale}function l(v,m,E,L){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,v.size.value=m.size*E,v.scale.value=L*.5,m.map&&(v.map.value=m.map,t(m.map,v.uvTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,t(m.alphaMap,v.alphaMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest)}function c(v,m){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,v.rotation.value=m.rotation,m.map&&(v.map.value=m.map,t(m.map,v.mapTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,t(m.alphaMap,v.alphaMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest)}function u(v,m){v.specular.value.copy(m.specular),v.shininess.value=Math.max(m.shininess,1e-4)}function d(v,m){m.gradientMap&&(v.gradientMap.value=m.gradientMap)}function h(v,m){v.metalness.value=m.metalness,m.metalnessMap&&(v.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,v.metalnessMapTransform)),v.roughness.value=m.roughness,m.roughnessMap&&(v.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,v.roughnessMapTransform)),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)}function p(v,m,E){v.ior.value=m.ior,m.sheen>0&&(v.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),v.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(v.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,v.sheenColorMapTransform)),m.sheenRoughnessMap&&(v.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,v.sheenRoughnessMapTransform))),m.clearcoat>0&&(v.clearcoat.value=m.clearcoat,v.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(v.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,v.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(v.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===tn&&v.clearcoatNormalScale.value.negate())),m.dispersion>0&&(v.dispersion.value=m.dispersion),m.iridescence>0&&(v.iridescence.value=m.iridescence,v.iridescenceIOR.value=m.iridescenceIOR,v.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(v.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,v.iridescenceMapTransform)),m.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),m.transmission>0&&(v.transmission.value=m.transmission,v.transmissionSamplerMap.value=E.texture,v.transmissionSamplerSize.value.set(E.width,E.height),m.transmissionMap&&(v.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,v.transmissionMapTransform)),v.thickness.value=m.thickness,m.thicknessMap&&(v.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=m.attenuationDistance,v.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(v.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(v.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=m.specularIntensity,v.specularColor.value.copy(m.specularColor),m.specularColorMap&&(v.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,v.specularColorMapTransform)),m.specularIntensityMap&&(v.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,v.specularIntensityMapTransform))}function g(v,m){m.matcap&&(v.matcap.value=m.matcap)}function y(v,m){let E=e.get(m).light;v.referencePosition.value.setFromMatrixPosition(E.matrixWorld),v.nearDistance.value=E.shadow.camera.near,v.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function M_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,A){let T=A.program;n.uniformBlockBinding(b,T)}function c(b,A){let T=s[b.id];T===void 0&&(v(b),T=u(b),s[b.id]=T,b.addEventListener("dispose",E));let P=A.program;n.updateUBOMapping(b,P);let _=e.render.frame;r[b.id]!==_&&(h(b),r[b.id]=_)}function u(b){let A=d();b.__bindingPointIndex=A;let T=i.createBuffer(),P=b.__size,_=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,P,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,T),T}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return Ge("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){let A=s[b.id],T=b.uniforms,P=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let _=0,C=T.length;_<C;_++){let U=T[_];if(Array.isArray(U))for(let I=0,M=U.length;I<M;I++)p(U[I],_,I,P);else p(U,_,0,P)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(b,A,T,P){if(y(b,A,T,P)===!0){let _=b.__offset,C=b.value;if(Array.isArray(C)){let U=0;for(let I=0;I<C.length;I++){let M=C[I],B=m(M);g(M,b.__data,U),typeof M!="number"&&typeof M!="boolean"&&!M.isMatrix3&&!ArrayBuffer.isView(M)&&(U+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(C,b.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,b.__data)}}function g(b,A,T){typeof b=="number"||typeof b=="boolean"?A[0]=b:b.isMatrix3?(A[0]=b.elements[0],A[1]=b.elements[1],A[2]=b.elements[2],A[3]=0,A[4]=b.elements[3],A[5]=b.elements[4],A[6]=b.elements[5],A[7]=0,A[8]=b.elements[6],A[9]=b.elements[7],A[10]=b.elements[8],A[11]=0):ArrayBuffer.isView(b)?A.set(new b.constructor(b.buffer,b.byteOffset,A.length)):b.toArray(A,T)}function y(b,A,T,P){let _=b.value,C=A+"_"+T;if(P[C]===void 0)return typeof _=="number"||typeof _=="boolean"?P[C]=_:ArrayBuffer.isView(_)?P[C]=_.slice():P[C]=_.clone(),!0;{let U=P[C];if(typeof _=="number"||typeof _=="boolean"){if(U!==_)return P[C]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(U.equals(_)===!1)return U.copy(_),!0}}return!1}function v(b){let A=b.uniforms,T=0,P=16;for(let C=0,U=A.length;C<U;C++){let I=Array.isArray(A[C])?A[C]:[A[C]];for(let M=0,B=I.length;M<B;M++){let V=I[M],H=Array.isArray(V.value)?V.value:[V.value];for(let X=0,q=H.length;X<q;X++){let ne=H[X],ae=m(ne),le=T%P,fe=le%ae.boundary,Ee=le+fe;T+=fe,Ee!==0&&P-Ee<ae.storage&&(T+=P-Ee),V.__data=new Float32Array(ae.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=T,T+=ae.storage}}}let _=T%P;return _>0&&(T+=P-_),b.__size=T,b.__cache={},this}function m(b){let A={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(A.boundary=4,A.storage=4):b.isVector2?(A.boundary=8,A.storage=8):b.isVector3||b.isColor?(A.boundary=16,A.storage=12):b.isVector4?(A.boundary=16,A.storage=16):b.isMatrix3?(A.boundary=48,A.storage=48):b.isMatrix4?(A.boundary=64,A.storage=64):b.isTexture?Ue("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(A.boundary=16,A.storage=b.byteLength):Ue("WebGLRenderer: Unsupported uniform value type.",b),A}function E(b){let A=b.target;A.removeEventListener("dispose",E);let T=o.indexOf(A.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function L(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:L}}var S_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ti=null;function E_(){return Ti===null&&(Ti=new vi(S_,16,16,vn,un),Ti.name="DFG_LUT",Ti.minFilter=yt,Ti.magFilter=yt,Ti.wrapS=Yn,Ti.wrapT=Yn,Ti.generateMipmaps=!1,Ti.needsUpdate=!0),Ti}var Hl=class{constructor(e={}){let{canvas:t=Qd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:p=gn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let y=p,v=new Set([il,nl,tl]),m=new Set([gn,li,Rr,Cr,Ja,Qa]),E=new Uint32Array(4),L=new Int32Array(4),b=new D,A=null,T=null,P=[],_=[],C=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=oi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let U=this,I=!1,M=null,B=null,V=null,H=null;this._outputColorSpace=Vt;let X=0,q=0,ne=null,ae=-1,le=null,fe=new dt,Ee=new dt,it=null,Ze=new Te(0),Re=0,Y=t.width,ce=t.height,se=1,Pe=null,He=null,Fe=new dt(0,0,Y,ce),mt=new dt(0,0,Y,ce),We=!1,st=new Mr,$e=!1,Xe=!1,rt=new ke,Mt=new D,gt=new dt,Bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Nt=!1;function Ut(){return ne===null?se:1}let z=n;function Zt(f,S){return t.getContext(f,S)}try{let f={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"185"}`),t.addEventListener("webglcontextlost",ot,!1),t.addEventListener("webglcontextrestored",Tt,!1),t.addEventListener("webglcontextcreationerror",Kt,!1),z===null){let S="webgl2";if(z=Zt(S,f),z===null)throw Zt(S)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(f){throw Ge("WebGLRenderer: "+f.message),f}let ft,R,x,k,W,Z,he,ge,K,ee,be,Ne,ye,Me,Oe,Be,je,O,pe,J,ve,Se,oe;function Ae(){ft=new Iv(z),ft.init(),ve=new v_(z,ft),R=new Sv(z,ft,e,ve),x=new m_(z,ft),R.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),B=z.createFramebuffer(),V=z.createFramebuffer(),H=z.createFramebuffer(),k=new Nv(z),W=new t_,Z=new g_(z,ft,x,W,R,ve,k),he=new Pv(U),ge=new zm(z),Se=new bv(z,ge),K=new Lv(z,ge,k,Se),ee=new Uv(z,K,ge,Se,k),O=new Fv(z,R,Z),Oe=new Ev(W),be=new e_(U,he,ft,R,Se,Oe),Ne=new b_(U,W),ye=new i_,Me=new c_(ft),je=new yv(U,he,x,ee,g,l),Be=new p_(U,ee,R),oe=new M_(z,k,R,x),pe=new Mv(z,ft,k),J=new Dv(z,ft,k),k.programs=be.programs,U.capabilities=R,U.extensions=ft,U.properties=W,U.renderLists=ye,U.shadowMap=Be,U.state=x,U.info=k}Ae(),y!==gn&&(C=new zv(y,t.width,t.height,a,s,r));let Le=new Fu(U,z);this.xr=Le,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let f=ft.get("WEBGL_lose_context");f&&f.loseContext()},this.forceContextRestore=function(){let f=ft.get("WEBGL_lose_context");f&&f.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(f){f!==void 0&&(se=f,this.setSize(Y,ce,!1))},this.getSize=function(f){return f.set(Y,ce)},this.setSize=function(f,S,w=!0){if(Le.isPresenting){Ue("WebGLRenderer: Can't change size while VR device is presenting.");return}Y=f,ce=S,t.width=Math.floor(f*se),t.height=Math.floor(S*se),w===!0&&(t.style.width=f+"px",t.style.height=S+"px"),C!==null&&C.setSize(t.width,t.height),this.setViewport(0,0,f,S)},this.getDrawingBufferSize=function(f){return f.set(Y*se,ce*se).floor()},this.setDrawingBufferSize=function(f,S,w){Y=f,ce=S,se=w,t.width=Math.floor(f*w),t.height=Math.floor(S*w),this.setViewport(0,0,f,S)},this.setEffects=function(f){if(y===gn){Ge("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(f){for(let S=0;S<f.length;S++)if(f[S].isOutputPass===!0){Ue("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(f||[])},this.getCurrentViewport=function(f){return f.copy(fe)},this.getViewport=function(f){return f.copy(Fe)},this.setViewport=function(f,S,w,N){f.isVector4?Fe.set(f.x,f.y,f.z,f.w):Fe.set(f,S,w,N),x.viewport(fe.copy(Fe).multiplyScalar(se).round())},this.getScissor=function(f){return f.copy(mt)},this.setScissor=function(f,S,w,N){f.isVector4?mt.set(f.x,f.y,f.z,f.w):mt.set(f,S,w,N),x.scissor(Ee.copy(mt).multiplyScalar(se).round())},this.getScissorTest=function(){return We},this.setScissorTest=function(f){x.setScissorTest(We=f)},this.setOpaqueSort=function(f){Pe=f},this.setTransparentSort=function(f){He=f},this.getClearColor=function(f){return f.copy(je.getClearColor())},this.setClearColor=function(){je.setClearColor(...arguments)},this.getClearAlpha=function(){return je.getClearAlpha()},this.setClearAlpha=function(){je.setClearAlpha(...arguments)},this.clear=function(f=!0,S=!0,w=!0){let N=0;if(f){let F=!1;if(ne!==null){let $=ne.texture.format;F=v.has($)}if(F){let $=ne.texture.type,re=m.has($),j=je.getClearColor(),ue=je.getClearAlpha(),me=j.r,xe=j.g,ie=j.b;re?(E[0]=me,E[1]=xe,E[2]=ie,E[3]=ue,z.clearBufferuiv(z.COLOR,0,E)):(L[0]=me,L[1]=xe,L[2]=ie,L[3]=ue,z.clearBufferiv(z.COLOR,0,L))}else N|=z.COLOR_BUFFER_BIT}S&&(N|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),w&&(N|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N!==0&&z.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(f){f.setRenderer(this),M=f},this.dispose=function(){t.removeEventListener("webglcontextlost",ot,!1),t.removeEventListener("webglcontextrestored",Tt,!1),t.removeEventListener("webglcontextcreationerror",Kt,!1),je.dispose(),ye.dispose(),Me.dispose(),W.dispose(),he.dispose(),ee.dispose(),Se.dispose(),oe.dispose(),be.dispose(),Le.dispose(),Le.removeEventListener("sessionstart",Hr),Le.removeEventListener("sessionend",Qi),di.stop()};function ot(f){f.preventDefault(),ro("WebGLRenderer: Context Lost."),I=!0}function Tt(){ro("WebGLRenderer: Context Restored."),I=!1;let f=k.autoReset,S=Be.enabled,w=Be.autoUpdate,N=Be.needsUpdate,F=Be.type;Ae(),k.autoReset=f,Be.enabled=S,Be.autoUpdate=w,Be.needsUpdate=N,Be.type=F}function Kt(f){Ge("WebGLRenderer: A WebGL context could not be created. Reason: ",f.statusMessage)}function jt(f){let S=f.target;S.removeEventListener("dispose",jt),Zo(S)}function Zo(f){$n(f),W.remove(f)}function $n(f){let S=W.get(f).programs;S!==void 0&&(S.forEach(function(w){be.releaseProgram(w)}),f.isShaderMaterial&&be.releaseShaderCache(f))}this.renderBufferDirect=function(f,S,w,N,F,$){S===null&&(S=Bt);let re=F.isMesh&&F.matrixWorld.determinantAffine()<0,j=Xr(f,S,w,N,F);x.setMaterial(N,re);let ue=w.index,me=1;if(N.wireframe===!0){if(ue=K.getWireframeAttribute(w),ue===void 0)return;me=2}let xe=w.drawRange,ie=w.attributes.position,Q=xe.start*me,Ce=(xe.start+xe.count)*me;$!==null&&(Q=Math.max(Q,$.start*me),Ce=Math.min(Ce,($.start+$.count)*me)),ue!==null?(Q=Math.max(Q,0),Ce=Math.min(Ce,ue.count)):ie!=null&&(Q=Math.max(Q,0),Ce=Math.min(Ce,ie.count));let ze=Ce-Q;if(ze<0||ze===1/0)return;Se.setup(F,N,j,w,ue);let Ke,Ve=pe;if(ue!==null&&(Ke=ge.get(ue),Ve=J,Ve.setIndex(Ke)),F.isMesh)N.wireframe===!0?(x.setLineWidth(N.wireframeLinewidth*Ut()),Ve.setMode(z.LINES)):Ve.setMode(z.TRIANGLES);else if(F.isLine){let tt=N.linewidth;tt===void 0&&(tt=1),x.setLineWidth(tt*Ut()),F.isLineSegments?Ve.setMode(z.LINES):F.isLineLoop?Ve.setMode(z.LINE_LOOP):Ve.setMode(z.LINE_STRIP)}else F.isPoints?Ve.setMode(z.POINTS):F.isSprite&&Ve.setMode(z.TRIANGLES);if(F.isBatchedMesh)if(ft.get("WEBGL_multi_draw"))Ve.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let tt=F._multiDrawStarts,de=F._multiDrawCounts,$t=F._multiDrawCount,ut=ue?ge.get(ue).bytesPerElement:1,yn=W.get(N).currentProgram.getUniforms();for(let Gn=0;Gn<$t;Gn++)yn.setValue(z,"_gl_DrawID",Gn),Ve.render(tt[Gn]/ut,de[Gn])}else if(F.isInstancedMesh)Ve.renderInstances(Q,ze,F.count);else if(w.isInstancedBufferGeometry){let tt=w._maxInstanceCount!==void 0?w._maxInstanceCount:1/0,de=Math.min(w.instanceCount,tt);Ve.renderInstances(Q,ze,de)}else Ve.render(Q,ze)};function qs(f,S,w){f.transparent===!0&&f.side===kt&&f.forceSinglePass===!1?(f.side=tn,f.needsUpdate=!0,Ci(f,S,w),f.side=On,f.needsUpdate=!0,Ci(f,S,w),f.side=kt):Ci(f,S,w)}this.compile=function(f,S,w=null){w===null&&(w=f),T=Me.get(w),T.init(S),_.push(T),w.traverseVisible(function(F){F.isLight&&F.layers.test(S.layers)&&(T.pushLight(F),F.castShadow&&T.pushShadow(F))}),f!==w&&f.traverseVisible(function(F){F.isLight&&F.layers.test(S.layers)&&(T.pushLight(F),F.castShadow&&T.pushShadow(F))}),T.setupLights();let N=new Set;return f.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let $=F.material;if($)if(Array.isArray($))for(let re=0;re<$.length;re++){let j=$[re];qs(j,w,F),N.add(j)}else qs($,w,F),N.add($)}),T=_.pop(),N},this.compileAsync=function(f,S,w=null){let N=this.compile(f,S,w);return new Promise(F=>{function $(){if(N.forEach(function(re){W.get(re).currentProgram.isReady()&&N.delete(re)}),N.size===0){F(f);return}setTimeout($,10)}ft.get("KHR_parallel_shader_compile")!==null?$():setTimeout($,10)})};let _n=null;function en(f){_n&&_n(f)}function Hr(){di.stop()}function Qi(){di.start()}let di=new Rf;di.setAnimationLoop(en),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(f){_n=f,Le.setAnimationLoop(f),f===null?di.stop():di.start()},Le.addEventListener("sessionstart",Hr),Le.addEventListener("sessionend",Qi),this.render=function(f,S){if(S!==void 0&&S.isCamera!==!0){Ge("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;M!==null&&M.renderStart(f,S);let w=Le.enabled===!0&&Le.isPresenting===!0,N=C!==null&&(ne===null||w)&&C.begin(U,ne);if(f.matrixWorldAutoUpdate===!0&&f.updateMatrixWorld(),S.parent===null&&S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),Le.enabled===!0&&Le.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(Le.cameraAutoUpdate===!0&&Le.updateCamera(S),S=Le.getCamera()),f.isScene===!0&&f.onBeforeRender(U,f,S,ne),T=Me.get(f,_.length),T.init(S),T.state.textureUnits=Z.getTextureUnits(),_.push(T),rt.multiplyMatrices(S.projectionMatrix,S.matrixWorldInverse),st.setFromProjectionMatrix(rt,ii,S.reversedDepth),Xe=this.localClippingEnabled,$e=Oe.init(this.clippingPlanes,Xe),A=ye.get(f,P.length),A.init(),P.push(A),Le.enabled===!0&&Le.isPresenting===!0){let re=U.xr.getDepthSensingMesh();re!==null&&Ys(re,S,-1/0,U.sortObjects)}Ys(f,S,0,U.sortObjects),A.finish(),U.sortObjects===!0&&A.sort(Pe,He,S.reversedDepth),Nt=Le.enabled===!1||Le.isPresenting===!1||Le.hasDepthSensing()===!1,Nt&&je.addToRenderList(A,f),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$e===!0&&Oe.beginShadows();let F=T.state.shadowsArray;if(Be.render(F,f,S),$e===!0&&Oe.endShadows(),(N&&C.hasRenderPass())===!1){let re=A.opaque,j=A.transmissive;if(T.setupLights(),S.isArrayCamera){let ue=S.cameras;if(j.length>0)for(let me=0,xe=ue.length;me<xe;me++){let ie=ue[me];Tn(re,j,f,ie)}Nt&&je.render(f);for(let me=0,xe=ue.length;me<xe;me++){let ie=ue[me];Vr(A,f,ie,ie.viewport)}}else j.length>0&&Tn(re,j,f,S),Nt&&je.render(f),Vr(A,f,S)}ne!==null&&q===0&&(Z.updateMultisampleRenderTarget(ne),Z.updateRenderTargetMipmap(ne)),N&&C.end(U),f.isScene===!0&&f.onAfterRender(U,f,S),Se.resetDefaultState(),ae=-1,le=null,_.pop(),_.length>0?(T=_[_.length-1],Z.setTextureUnits(T.state.textureUnits),$e===!0&&Oe.setGlobalState(U.clippingPlanes,T.state.camera)):T=null,P.pop(),P.length>0?A=P[P.length-1]:A=null,M!==null&&M.renderEnd()};function Ys(f,S,w,N){if(f.visible===!1)return;if(f.layers.test(S.layers)){if(f.isGroup)w=f.renderOrder;else if(f.isLOD)f.autoUpdate===!0&&f.update(S);else if(f.isLightProbeGrid)T.pushLightProbeGrid(f);else if(f.isLight)T.pushLight(f),f.castShadow&&T.pushShadow(f);else if(f.isSprite){if(!f.frustumCulled||st.intersectsSprite(f)){N&&gt.setFromMatrixPosition(f.matrixWorld).applyMatrix4(rt);let re=ee.update(f),j=f.material;j.visible&&A.push(f,re,j,w,gt.z,null)}}else if((f.isMesh||f.isLine||f.isPoints)&&(!f.frustumCulled||st.intersectsObject(f))){let re=ee.update(f),j=f.material;if(N&&(f.boundingSphere!==void 0?(f.boundingSphere===null&&f.computeBoundingSphere(),gt.copy(f.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),gt.copy(re.boundingSphere.center)),gt.applyMatrix4(f.matrixWorld).applyMatrix4(rt)),Array.isArray(j)){let ue=re.groups;for(let me=0,xe=ue.length;me<xe;me++){let ie=ue[me],Q=j[ie.materialIndex];Q&&Q.visible&&A.push(f,re,Q,w,gt.z,ie)}}else j.visible&&A.push(f,re,j,w,gt.z,null)}}let $=f.children;for(let re=0,j=$.length;re<j;re++)Ys($[re],S,w,N)}function Vr(f,S,w,N){let{opaque:F,transmissive:$,transparent:re}=f;T.setupLightsView(w),$e===!0&&Oe.setGlobalState(U.clippingPlanes,w),N&&x.viewport(fe.copy(N)),F.length>0&&_s(F,S,w),$.length>0&&_s($,S,w),re.length>0&&_s(re,S,w),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Tn(f,S,w,N){if((w.isScene===!0?w.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[N.id]===void 0){let Q=ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[N.id]=new Wt(1,1,{generateMipmaps:!0,type:Q?un:gn,minFilter:ai,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}let $=T.state.transmissionRenderTarget[N.id],re=N.viewport||fe;$.setSize(re.z*U.transmissionResolutionScale,re.w*U.transmissionResolutionScale);let j=U.getRenderTarget(),ue=U.getActiveCubeFace(),me=U.getActiveMipmapLevel();U.setRenderTarget($),U.getClearColor(Ze),Re=U.getClearAlpha(),Re<1&&U.setClearColor(16777215,.5),U.clear(),Nt&&je.render(w);let xe=U.toneMapping;U.toneMapping=oi;let ie=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),T.setupLightsView(N),$e===!0&&Oe.setGlobalState(U.clippingPlanes,N),_s(f,w,N),Z.updateMultisampleRenderTarget($),Z.updateRenderTargetMipmap($),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Q=!1;for(let Ce=0,ze=S.length;Ce<ze;Ce++){let Ke=S[Ce],{object:Ve,geometry:tt,material:de,group:$t}=Ke;if(de.side===kt&&Ve.layers.test(N.layers)){let ut=de.side;de.side=tn,de.needsUpdate=!0,Gr(Ve,w,N,tt,de,$t),de.side=ut,de.needsUpdate=!0,Q=!0}}Q===!0&&(Z.updateMultisampleRenderTarget($),Z.updateRenderTargetMipmap($))}U.setRenderTarget(j,ue,me),U.setClearColor(Ze,Re),ie!==void 0&&(N.viewport=ie),U.toneMapping=xe}function _s(f,S,w){let N=S.isScene===!0?S.overrideMaterial:null;for(let F=0,$=f.length;F<$;F++){let re=f[F],{object:j,geometry:ue,group:me}=re,xe=re.material;xe.allowOverride===!0&&N!==null&&(xe=N),j.layers.test(w.layers)&&Gr(j,S,w,ue,xe,me)}}function Gr(f,S,w,N,F,$){f.onBeforeRender(U,S,w,N,F,$),f.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,f.matrixWorld),f.normalMatrix.getNormalMatrix(f.modelViewMatrix),F.onBeforeRender(U,S,w,N,f,$),F.transparent===!0&&F.side===kt&&F.forceSinglePass===!1?(F.side=tn,F.needsUpdate=!0,U.renderBufferDirect(w,S,N,F,f,$),F.side=On,F.needsUpdate=!0,U.renderBufferDirect(w,S,N,F,f,$),F.side=kt):U.renderBufferDirect(w,S,N,F,f,$),f.onAfterRender(U,S,w,N,F,$)}function Ci(f,S,w){S.isScene!==!0&&(S=Bt);let N=W.get(f),F=T.state.lights,$=T.state.shadowsArray,re=F.state.version,j=be.getParameters(f,F.state,$,S,w,T.state.lightProbeGridArray),ue=be.getProgramCacheKey(j),me=N.programs;N.environment=f.isMeshStandardMaterial||f.isMeshLambertMaterial||f.isMeshPhongMaterial?S.environment:null,N.fog=S.fog;let xe=f.isMeshStandardMaterial||f.isMeshLambertMaterial&&!f.envMap||f.isMeshPhongMaterial&&!f.envMap;N.envMap=he.get(f.envMap||N.environment,xe),N.envMapRotation=N.environment!==null&&f.envMap===null?S.environmentRotation:f.envMapRotation,me===void 0&&(f.addEventListener("dispose",jt),me=new Map,N.programs=me);let ie=me.get(ue);if(ie!==void 0){if(N.currentProgram===ie&&N.lightsStateVersion===re)return Zs(f,j),ie}else j.uniforms=be.getUniforms(f),M!==null&&f.isNodeMaterial&&M.build(f,w,j),f.onBeforeCompile(j,U),ie=be.acquireProgram(j,ue),me.set(ue,ie),N.uniforms=j.uniforms;let Q=N.uniforms;return(!f.isShaderMaterial&&!f.isRawShaderMaterial||f.clipping===!0)&&(Q.clippingPlanes=Oe.uniform),Zs(f,j),N.needsLights=pc(f),N.lightsStateVersion=re,N.needsLights&&(Q.ambientLightColor.value=F.state.ambient,Q.lightProbe.value=F.state.probe,Q.directionalLights.value=F.state.directional,Q.directionalLightShadows.value=F.state.directionalShadow,Q.spotLights.value=F.state.spot,Q.spotLightShadows.value=F.state.spotShadow,Q.rectAreaLights.value=F.state.rectArea,Q.ltc_1.value=F.state.rectAreaLTC1,Q.ltc_2.value=F.state.rectAreaLTC2,Q.pointLights.value=F.state.point,Q.pointLightShadows.value=F.state.pointShadow,Q.hemisphereLights.value=F.state.hemi,Q.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Q.spotLightMatrix.value=F.state.spotLightMatrix,Q.spotLightMap.value=F.state.spotLightMap,Q.pointShadowMatrix.value=F.state.pointShadowMatrix),N.lightProbeGrid=T.state.lightProbeGridArray.length>0,N.currentProgram=ie,N.uniformsList=null,ie}function es(f){if(f.uniformsList===null){let S=f.currentProgram.getUniforms();f.uniformsList=Lr.seqWithValue(S.seq,f.uniforms)}return f.uniformsList}function Zs(f,S){let w=W.get(f);w.outputColorSpace=S.outputColorSpace,w.batching=S.batching,w.batchingColor=S.batchingColor,w.instancing=S.instancing,w.instancingColor=S.instancingColor,w.instancingMorph=S.instancingMorph,w.skinning=S.skinning,w.morphTargets=S.morphTargets,w.morphNormals=S.morphNormals,w.morphColors=S.morphColors,w.morphTargetsCount=S.morphTargetsCount,w.numClippingPlanes=S.numClippingPlanes,w.numIntersection=S.numClipIntersection,w.vertexAlphas=S.vertexAlphas,w.vertexTangents=S.vertexTangents,w.toneMapping=S.toneMapping}function Wr(f,S){if(f.length===0)return null;if(f.length===1)return f[0].texture!==null?f[0]:null;b.setFromMatrixPosition(S.matrixWorld);for(let w=0,N=f.length;w<N;w++){let F=f[w];if(F.texture!==null&&F.boundingBox.containsPoint(b))return F}return null}function Xr(f,S,w,N,F){S.isScene!==!0&&(S=Bt),Z.resetTextureUnits();let $=S.fog,re=N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial?S.environment:null,j=ne===null?U.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:et.workingColorSpace,ue=N.isMeshStandardMaterial||N.isMeshLambertMaterial&&!N.envMap||N.isMeshPhongMaterial&&!N.envMap,me=he.get(N.envMap||re,ue),xe=N.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,ie=!!w.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),Q=!!w.morphAttributes.position,Ce=!!w.morphAttributes.normal,ze=!!w.morphAttributes.color,Ke=oi;N.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ke=U.toneMapping);let Ve=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,tt=Ve!==void 0?Ve.length:0,de=W.get(N),$t=T.state.lights;if($e===!0&&(Xe===!0||f!==le)){let St=f===le&&N.id===ae;Oe.setState(N,f,St)}let ut=!1;N.version===de.__version?(de.needsLights&&de.lightsStateVersion!==$t.state.version||de.outputColorSpace!==j||F.isBatchedMesh&&de.batching===!1||!F.isBatchedMesh&&de.batching===!0||F.isBatchedMesh&&de.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&de.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&de.instancing===!1||!F.isInstancedMesh&&de.instancing===!0||F.isSkinnedMesh&&de.skinning===!1||!F.isSkinnedMesh&&de.skinning===!0||F.isInstancedMesh&&de.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&de.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&de.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&de.instancingMorph===!1&&F.morphTexture!==null||de.envMap!==me||N.fog===!0&&de.fog!==$||de.numClippingPlanes!==void 0&&(de.numClippingPlanes!==Oe.numPlanes||de.numIntersection!==Oe.numIntersection)||de.vertexAlphas!==xe||de.vertexTangents!==ie||de.morphTargets!==Q||de.morphNormals!==Ce||de.morphColors!==ze||de.toneMapping!==Ke||de.morphTargetsCount!==tt||!!de.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ut=!0):(ut=!0,de.__version=N.version);let yn=de.currentProgram;ut===!0&&(yn=Ci(N,S,F),M&&N.isNodeMaterial&&M.onUpdateProgram(N,yn,de));let Gn=!1,Jn=!1,ts=!1,wt=yn.getUniforms(),It=de.uniforms;if(x.useProgram(yn.program)&&(Gn=!0,Jn=!0,ts=!0),N.id!==ae&&(ae=N.id,Jn=!0),de.needsLights){let St=Wr(T.state.lightProbeGridArray,F);de.lightProbeGrid!==St&&(de.lightProbeGrid=St,Jn=!0)}if(Gn||le!==f){x.buffers.depth.getReversed()&&f.reversedDepth!==!0&&(f._reversedDepth=!0,f.updateProjectionMatrix()),wt.setValue(z,"projectionMatrix",f.projectionMatrix),wt.setValue(z,"viewMatrix",f.matrixWorldInverse);let Xn=wt.map.cameraPosition;Xn!==void 0&&Xn.setValue(z,Mt.setFromMatrixPosition(f.matrixWorld)),R.logarithmicDepthBuffer&&wt.setValue(z,"logDepthBufFC",2/(Math.log(f.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&wt.setValue(z,"isOrthographic",f.isOrthographicCamera===!0),le!==f&&(le=f,Jn=!0,ts=!0)}if(de.needsLights&&($t.state.directionalShadowMap.length>0&&wt.setValue(z,"directionalShadowMap",$t.state.directionalShadowMap,Z),$t.state.spotShadowMap.length>0&&wt.setValue(z,"spotShadowMap",$t.state.spotShadowMap,Z),$t.state.pointShadowMap.length>0&&wt.setValue(z,"pointShadowMap",$t.state.pointShadowMap,Z)),F.isSkinnedMesh){wt.setOptional(z,F,"bindMatrix"),wt.setOptional(z,F,"bindMatrixInverse");let St=F.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),wt.setValue(z,"boneTexture",St.boneTexture,Z))}F.isBatchedMesh&&(wt.setOptional(z,F,"batchingTexture"),wt.setValue(z,"batchingTexture",F._matricesTexture,Z),wt.setOptional(z,F,"batchingIdTexture"),wt.setValue(z,"batchingIdTexture",F._indirectTexture,Z),wt.setOptional(z,F,"batchingColorTexture"),F._colorsTexture!==null&&wt.setValue(z,"batchingColorTexture",F._colorsTexture,Z));let Wn=w.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&O.update(F,w,yn),(Jn||de.receiveShadow!==F.receiveShadow)&&(de.receiveShadow=F.receiveShadow,wt.setValue(z,"receiveShadow",F.receiveShadow)),(N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial)&&N.envMap===null&&S.environment!==null&&(It.envMapIntensity.value=S.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=E_()),Jn){if(wt.setValue(z,"toneMappingExposure",U.toneMappingExposure),de.needsLights&&qr(It,ts),$&&N.fog===!0&&Ne.refreshFogUniforms(It,$),Ne.refreshMaterialUniforms(It,N,se,ce,T.state.transmissionRenderTarget[f.id]),de.needsLights&&de.lightProbeGrid){let St=de.lightProbeGrid;It.probesSH.value=St.texture,It.probesMin.value.copy(St.boundingBox.min),It.probesMax.value.copy(St.boundingBox.max),It.probesResolution.value.copy(St.resolution)}Lr.upload(z,es(de),It,Z)}if(N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(Lr.upload(z,es(de),It,Z),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&wt.setValue(z,"center",F.center),wt.setValue(z,"modelViewMatrix",F.modelViewMatrix),wt.setValue(z,"normalMatrix",F.normalMatrix),wt.setValue(z,"modelMatrix",F.matrixWorld),N.uniformsGroups!==void 0){let St=N.uniformsGroups;for(let Xn=0,Pi=St.length;Xn<Pi;Xn++){let Ks=St[Xn];oe.update(Ks,yn),oe.bind(Ks,yn)}}return yn}function qr(f,S){f.ambientLightColor.needsUpdate=S,f.lightProbe.needsUpdate=S,f.directionalLights.needsUpdate=S,f.directionalLightShadows.needsUpdate=S,f.pointLights.needsUpdate=S,f.pointLightShadows.needsUpdate=S,f.spotLights.needsUpdate=S,f.spotLightShadows.needsUpdate=S,f.rectAreaLights.needsUpdate=S,f.hemisphereLights.needsUpdate=S}function pc(f){return f.isMeshLambertMaterial||f.isMeshToonMaterial||f.isMeshPhongMaterial||f.isMeshStandardMaterial||f.isShadowMaterial||f.isShaderMaterial&&f.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(f,S,w){let N=W.get(f);N.__autoAllocateDepthBuffer=f.resolveDepthBuffer===!1,N.__autoAllocateDepthBuffer===!1&&(N.__useRenderToTexture=!1),W.get(f.texture).__webglTexture=S,W.get(f.depthTexture).__webglTexture=N.__autoAllocateDepthBuffer?void 0:w,N.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(f,S){let w=W.get(f);w.__webglFramebuffer=S,w.__useDefaultFramebuffer=S===void 0},this.setRenderTarget=function(f,S=0,w=0){ne=f,X=S,q=w;let N=null,F=!1,$=!1;if(f){let j=W.get(f);if(j.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(z.FRAMEBUFFER,j.__webglFramebuffer),fe.copy(f.viewport),Ee.copy(f.scissor),it=f.scissorTest,x.viewport(fe),x.scissor(Ee),x.setScissorTest(it),ae=-1;return}else if(j.__webglFramebuffer===void 0)Z.setupRenderTarget(f);else if(j.__hasExternalTextures)Z.rebindTextures(f,W.get(f.texture).__webglTexture,W.get(f.depthTexture).__webglTexture);else if(f.depthBuffer){let xe=f.depthTexture;if(j.__boundDepthTexture!==xe){if(xe!==null&&W.has(xe)&&(f.width!==xe.image.width||f.height!==xe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(f)}}let ue=f.texture;(ue.isData3DTexture||ue.isDataArrayTexture||ue.isCompressedArrayTexture)&&($=!0);let me=W.get(f).__webglFramebuffer;f.isWebGLCubeRenderTarget?(Array.isArray(me[S])?N=me[S][w]:N=me[S],F=!0):f.samples>0&&Z.useMultisampledRTT(f)===!1?N=W.get(f).__webglMultisampledFramebuffer:Array.isArray(me)?N=me[w]:N=me,fe.copy(f.viewport),Ee.copy(f.scissor),it=f.scissorTest}else fe.copy(Fe).multiplyScalar(se).floor(),Ee.copy(mt).multiplyScalar(se).floor(),it=We;if(w!==0&&(N=B),x.bindFramebuffer(z.FRAMEBUFFER,N)&&x.drawBuffers(f,N),x.viewport(fe),x.scissor(Ee),x.setScissorTest(it),F){let j=W.get(f.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+S,j.__webglTexture,w)}else if($){let j=S;for(let ue=0;ue<f.textures.length;ue++){let me=W.get(f.textures[ue]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+ue,me.__webglTexture,w,j)}}else if(f!==null&&w!==0){let j=W.get(f.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,j.__webglTexture,w)}ae=-1},this.readRenderTargetPixels=function(f,S,w,N,F,$,re,j=0){if(!(f&&f.isWebGLRenderTarget)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=W.get(f).__webglFramebuffer;if(f.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue){x.bindFramebuffer(z.FRAMEBUFFER,ue);try{let me=f.textures[j],xe=me.format,ie=me.type;if(f.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+j),!R.textureFormatReadable(xe)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(ie)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}S>=0&&S<=f.width-N&&w>=0&&w<=f.height-F&&z.readPixels(S,w,N,F,ve.convert(xe),ve.convert(ie),$)}finally{let me=ne!==null?W.get(ne).__webglFramebuffer:null;x.bindFramebuffer(z.FRAMEBUFFER,me)}}},this.readRenderTargetPixelsAsync=async function(f,S,w,N,F,$,re,j=0){if(!(f&&f.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=W.get(f).__webglFramebuffer;if(f.isWebGLCubeRenderTarget&&re!==void 0&&(ue=ue[re]),ue)if(S>=0&&S<=f.width-N&&w>=0&&w<=f.height-F){x.bindFramebuffer(z.FRAMEBUFFER,ue);let me=f.textures[j],xe=me.format,ie=me.type;if(f.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+j),!R.textureFormatReadable(xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Q=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Q),z.bufferData(z.PIXEL_PACK_BUFFER,$.byteLength,z.STREAM_READ),z.readPixels(S,w,N,F,ve.convert(xe),ve.convert(ie),0);let Ce=ne!==null?W.get(ne).__webglFramebuffer:null;x.bindFramebuffer(z.FRAMEBUFFER,Ce);let ze=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await tf(z,ze,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Q),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,$),z.deleteBuffer(Q),z.deleteSync(ze),$}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(f,S=null,w=0){let N=Math.pow(2,-w),F=Math.floor(f.image.width*N),$=Math.floor(f.image.height*N),re=S!==null?S.x:0,j=S!==null?S.y:0;Z.setTexture2D(f,0),z.copyTexSubImage2D(z.TEXTURE_2D,w,0,0,re,j,F,$),x.unbindTexture()},this.copyTextureToTexture=function(f,S,w=null,N=null,F=0,$=0){let re,j,ue,me,xe,ie,Q,Ce,ze,Ke=f.isCompressedTexture?f.mipmaps[$]:f.image;if(w!==null)re=w.max.x-w.min.x,j=w.max.y-w.min.y,ue=w.isBox3?w.max.z-w.min.z:1,me=w.min.x,xe=w.min.y,ie=w.isBox3?w.min.z:0;else{let It=Math.pow(2,-F);re=Math.floor(Ke.width*It),j=Math.floor(Ke.height*It),f.isDataArrayTexture?ue=Ke.depth:f.isData3DTexture?ue=Math.floor(Ke.depth*It):ue=1,me=0,xe=0,ie=0}N!==null?(Q=N.x,Ce=N.y,ze=N.z):(Q=0,Ce=0,ze=0);let Ve=ve.convert(S.format),tt=ve.convert(S.type),de;S.isData3DTexture?(Z.setTexture3D(S,0),de=z.TEXTURE_3D):S.isDataArrayTexture||S.isCompressedArrayTexture?(Z.setTexture2DArray(S,0),de=z.TEXTURE_2D_ARRAY):(Z.setTexture2D(S,0),de=z.TEXTURE_2D),x.activeTexture(z.TEXTURE0),x.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,S.flipY),x.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),x.pixelStorei(z.UNPACK_ALIGNMENT,S.unpackAlignment);let $t=x.getParameter(z.UNPACK_ROW_LENGTH),ut=x.getParameter(z.UNPACK_IMAGE_HEIGHT),yn=x.getParameter(z.UNPACK_SKIP_PIXELS),Gn=x.getParameter(z.UNPACK_SKIP_ROWS),Jn=x.getParameter(z.UNPACK_SKIP_IMAGES);x.pixelStorei(z.UNPACK_ROW_LENGTH,Ke.width),x.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Ke.height),x.pixelStorei(z.UNPACK_SKIP_PIXELS,me),x.pixelStorei(z.UNPACK_SKIP_ROWS,xe),x.pixelStorei(z.UNPACK_SKIP_IMAGES,ie);let ts=f.isDataArrayTexture||f.isData3DTexture,wt=S.isDataArrayTexture||S.isData3DTexture;if(f.isDepthTexture){let It=W.get(f),Wn=W.get(S),St=W.get(It.__renderTarget),Xn=W.get(Wn.__renderTarget);x.bindFramebuffer(z.READ_FRAMEBUFFER,St.__webglFramebuffer),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let Pi=0;Pi<ue;Pi++)ts&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,W.get(f).__webglTexture,F,ie+Pi),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,W.get(S).__webglTexture,$,ze+Pi)),z.blitFramebuffer(me,xe,re,j,Q,Ce,re,j,z.DEPTH_BUFFER_BIT,z.NEAREST);x.bindFramebuffer(z.READ_FRAMEBUFFER,null),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(F!==0||f.isRenderTargetTexture||W.has(f)){let It=W.get(f),Wn=W.get(S);x.bindFramebuffer(z.READ_FRAMEBUFFER,V),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,H);for(let St=0;St<ue;St++)ts?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,It.__webglTexture,F,ie+St):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,It.__webglTexture,F),wt?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Wn.__webglTexture,$,ze+St):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Wn.__webglTexture,$),F!==0?z.blitFramebuffer(me,xe,re,j,Q,Ce,re,j,z.COLOR_BUFFER_BIT,z.NEAREST):wt?z.copyTexSubImage3D(de,$,Q,Ce,ze+St,me,xe,re,j):z.copyTexSubImage2D(de,$,Q,Ce,me,xe,re,j);x.bindFramebuffer(z.READ_FRAMEBUFFER,null),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else wt?f.isDataTexture||f.isData3DTexture?z.texSubImage3D(de,$,Q,Ce,ze,re,j,ue,Ve,tt,Ke.data):S.isCompressedArrayTexture?z.compressedTexSubImage3D(de,$,Q,Ce,ze,re,j,ue,Ve,Ke.data):z.texSubImage3D(de,$,Q,Ce,ze,re,j,ue,Ve,tt,Ke):f.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,$,Q,Ce,re,j,Ve,tt,Ke.data):f.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,$,Q,Ce,Ke.width,Ke.height,Ve,Ke.data):z.texSubImage2D(z.TEXTURE_2D,$,Q,Ce,re,j,Ve,tt,Ke);x.pixelStorei(z.UNPACK_ROW_LENGTH,$t),x.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ut),x.pixelStorei(z.UNPACK_SKIP_PIXELS,yn),x.pixelStorei(z.UNPACK_SKIP_ROWS,Gn),x.pixelStorei(z.UNPACK_SKIP_IMAGES,Jn),$===0&&S.generateMipmaps&&z.generateMipmap(de),x.unbindTexture()},this.initRenderTarget=function(f){W.get(f).__webglFramebuffer===void 0&&Z.setupRenderTarget(f)},this.initTexture=function(f){f.isCubeTexture?Z.setTextureCube(f,0):f.isData3DTexture?Z.setTexture3D(f,0):f.isDataArrayTexture||f.isCompressedArrayTexture?Z.setTexture2DArray(f,0):Z.setTexture2D(f,0),x.unbindTexture()},this.resetState=function(){X=0,q=0,ne=null,x.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}};var Ff={type:"change"},Ou={type:"start"},Of={type:"end"},Wl=new gi,Uf=new wn,T_=Math.cos(70*ji.DEG2RAD),rn=new D,Dn=2*Math.PI,Ct={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Uu=1e-6,Xl=class extends So{constructor(e,t=null){super(e,t),this.state=Ct.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ds.ROTATE,MIDDLE:ds.DOLLY,RIGHT:ds.PAN},this.touches={ONE:fs.ROTATE,TWO:fs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Ot,this._lastTargetPosition=new D,this._quat=new Ot().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new hs,this._sphericalDelta=new hs,this._scale=1,this._panOffset=new D,this._rotateStart=new _e,this._rotateEnd=new _e,this._rotateDelta=new _e,this._panStart=new _e,this._panEnd=new _e,this._panDelta=new _e,this._dollyStart=new _e,this._dollyEnd=new _e,this._dollyDelta=new _e,this._dollyDirection=new D,this._mouse=new _e,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=A_.bind(this),this._onPointerDown=w_.bind(this),this._onPointerUp=R_.bind(this),this._onContextMenu=F_.bind(this),this._onMouseWheel=I_.bind(this),this._onKeyDown=L_.bind(this),this._onTouchStart=D_.bind(this),this._onTouchMove=N_.bind(this),this._onMouseDown=C_.bind(this),this._onMouseMove=P_.bind(this),this._interceptControlDown=U_.bind(this),this._interceptControlUp=O_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ff),this.update(),this.state=Ct.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;rn.copy(t).sub(this.target),rn.applyQuaternion(this._quat),this._spherical.setFromVector3(rn),this.autoRotate&&this.state===Ct.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Dn:n>Math.PI&&(n-=Dn),s<-Math.PI?s+=Dn:s>Math.PI&&(s-=Dn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(rn.setFromSpherical(this._spherical),rn.applyQuaternion(this._quatInverse),t.copy(this.target).add(rn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=rn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=rn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Wl.origin.copy(this.object.position),Wl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Wl.direction))<T_?this.object.lookAt(this.target):(Uf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Wl.intersectPlane(Uf,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Uu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Uu||this._lastTargetPosition.distanceToSquared(this.target)>Uu?(this.dispatchEvent(Ff),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Dn/60*this.autoRotateSpeed*e:Dn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){rn.setFromMatrixColumn(t,0),rn.multiplyScalar(-e),this._panOffset.add(rn)}_panUp(e,t){this.screenSpacePanning===!0?rn.setFromMatrixColumn(t,1):(rn.setFromMatrixColumn(t,0),rn.crossVectors(this.object.up,rn)),rn.multiplyScalar(e),this._panOffset.add(rn)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;rn.copy(s).sub(this.target);let r=rn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Dn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new _e,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function w_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function A_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function R_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Of),this.state=Ct.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function C_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ds.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ct.DOLLY;break;case ds.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ct.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ct.ROTATE}break;case ds.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ct.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ct.PAN}break;default:this.state=Ct.NONE}this.state!==Ct.NONE&&this.dispatchEvent(Ou)}function P_(i){switch(this.state){case Ct.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ct.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ct.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function I_(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ct.NONE||(i.preventDefault(),this.dispatchEvent(Ou),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Of))}function L_(i){this.enabled!==!1&&this._handleKeyDown(i)}function D_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case fs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ct.TOUCH_ROTATE;break;case fs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ct.TOUCH_PAN;break;default:this.state=Ct.NONE}break;case 2:switch(this.touches.TWO){case fs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ct.TOUCH_DOLLY_PAN;break;case fs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ct.TOUCH_DOLLY_ROTATE;break;default:this.state=Ct.NONE}break;default:this.state=Ct.NONE}this.state!==Ct.NONE&&this.dispatchEvent(Ou)}function N_(i){switch(this._trackPointer(i),this.state){case Ct.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ct.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ct.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ct.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ct.NONE}}function F_(i){this.enabled!==!1&&i.preventDefault()}function U_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function O_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function zu(i,e){if(e===pu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Pr||e===Bo){let t=i.getIndex();if(t===null){let o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Pr)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function zf(i){let e=new Map,t=new Map,n=i.clone();return Bf(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Bf(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Bf(i.children[n],e.children[n],t)}var Nn=class extends Mi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Xu(t)}),this.register(function(t){return new qu(t)}),this.register(function(t){return new th(t)}),this.register(function(t){return new nh(t)}),this.register(function(t){return new ih(t)}),this.register(function(t){return new Zu(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new Wu(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new Yu(t)}),this.register(function(t){return new eh(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new Vu(t)}),this.register(function(t){return new ql(t,lt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ql(t,lt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new sh(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Zi.extractUrlBase(e);o=Zi.resolveURL(c,this.path)}else o=Zi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Tr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Wf){try{o[lt.KHR_BINARY_GLTF]=new rh(e)}catch(d){s&&s(d);return}r=JSON.parse(o[lt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new dh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case lt.KHR_MATERIALS_UNLIT:o[d]=new Gu;break;case lt.KHR_DRACO_MESH_COMPRESSION:o[d]=new oh(r,this.dracoLoader);break;case lt.KHR_TEXTURE_TRANSFORM:o[d]=new ah;break;case lt.KHR_MESH_QUANTIZATION:o[d]=new lh;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function z_(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function qt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var lt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Vu=class{constructor(e){this.parser=e,this.name=lt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new Te(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Mn);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new _o(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new xo(u),c.distance=d;break;case"spot":c=new vo(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ai(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Gu=class{constructor(){this.name=lt.KHR_MATERIALS_UNLIT}getMaterialType(){return Xt}extendParams(e,t,n){let s=[];e.color=new Te(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Mn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Vt))}return Promise.all(s)}},Wu=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Xu=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new _e(r,r)}return Promise.all(s)}},qu=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Yu=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Zu=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_SHEEN}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Te(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Mn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Vt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Ku=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},ju=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_VOLUME}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Te().setRGB(r[0],r[1],r[2],Mn),Promise.all(s)}},$u=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_IOR}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Ju=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Te().setRGB(r[0],r[1],r[2],Mn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Vt)),Promise.all(s)}},Qu=class{constructor(e){this.parser=e,this.name=lt.EXT_MATERIALS_BUMP}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},eh=class{constructor(e){this.parser=e,this.name=lt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return qt(this.parser,e,this.name)!==null?mn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},th=class{constructor(e){this.parser=e,this.name=lt.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},nh=class{constructor(e){this.parser=e,this.name=lt.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},ih=class{constructor(e){this.parser=e,this.name=lt.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},ql=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(p){return p.buffer}):o.ready.then(function(){let p=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(p),u,d,h,s.mode,s.filter),p})})}else return null}},sh=class{constructor(e){this.name=lt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==Kn.TRIANGLES&&c.mode!==Kn.TRIANGLE_STRIP&&c.mode!==Kn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,p=[];for(let g of d){let y=new ke,v=new D,m=new Ot,E=new D(1,1,1),L=new zi(g.geometry,g.material,h);for(let b=0;b<h;b++)l.TRANSLATION&&v.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,b),l.SCALE&&E.fromBufferAttribute(l.SCALE,b),L.setMatrixAt(b,y.compose(v,m,E));for(let b in l)if(b==="_COLOR_0"){let A=l[b];L.instanceColor=new us(A.array,A.itemSize,A.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&g.geometry.setAttribute(b,l[b]);zt.prototype.copy.call(L,g),this.parser.assignFinalMaterial(L),p.push(L)}return u.isGroup?(u.clear(),u.add(...p),u):p[0]}))}},Wf="glTF",Go=12,kf={JSON:1313821514,BIN:5130562},rh=class{constructor(e){this.name=lt.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Go),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Wf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Go,r=new DataView(e,Go),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===kf.JSON){let c=new Uint8Array(e,Go+o,a);this.content=n.decode(c)}else if(l===kf.BIN){let c=Go+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},oh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=lt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let d=uh[u]||u.toLowerCase();a[d]=o[u]}for(let u in e.attributes){let d=uh[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[e.attributes[u]],p=Nr[h.componentType];c[d]=p.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(p){for(let g in p.attributes){let y=p.attributes[g],v=l[g];v!==void 0&&(y.normalized=v)}d(p)},a,c,Mn,h)})})}},ah=class{constructor(){this.name=lt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},lh=class{constructor(){this.name=lt.KHR_MESH_QUANTIZATION}},Yl=class extends yi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,d=(n-t)/u,h=d*d,p=h*d,g=e*c,y=g-c,v=-2*p+3*h,m=p-h,E=1-v,L=m-h+d;for(let b=0;b!==a;b++){let A=o[y+b+a],T=o[y+b+l]*u,P=o[g+b+a],_=o[g+b]*u;r[b]=E*A+L*T+v*P+m*_}return r}},B_=new Ot,ch=class extends Yl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return B_.fromArray(r).normalize().toArray(r),r}},Kn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Nr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Hf={9728:Gt,9729:yt,9984:ja,9985:Ar,9986:zs,9987:ai},Vf={33071:Yn,33648:hr,10497:An},Bu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},uh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},vs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},k_={CUBICSPLINE:void 0,LINEAR:Rs,STEP:As},ku={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function H_(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ls({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:On})),i.DefaultMaterial}function Hs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ai(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function V_(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let d=e[c];if(n){let h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function G_(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function W_(i){let e,t=i.extensions&&i.extensions[lt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Hu(t.attributes):e=i.indices+":"+Hu(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Hu(i.targets[n]);return e}function Hu(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function hh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function X_(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var q_=new ke,dh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new z_,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Ds(this.options.manager):this.textureLoader=new bo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Tr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Hs(r,a,s),Ai(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[lt.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(Zi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Bu[s.type],a=Nr[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Rt(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=Bu[s.type],c=Nr[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,p=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,y,v;if(p&&p!==d){let m=Math.floor(h/p),E="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,L=t.cache.get(E);L||(y=new c(a,m*p,s.count*p/u),L=new _r(y,p/u),t.cache.add(E,L)),v=new yr(L,l,h%p/u,g)}else a===null?y=new c(s.count*l):y=new c(a,h,s.count*l),v=new Rt(y,l,g);if(s.sparse!==void 0){let m=Bu.SCALAR,E=Nr[s.sparse.indices.componentType],L=s.sparse.indices.byteOffset||0,b=s.sparse.values.byteOffset||0,A=new E(o[1],L,s.sparse.count*m),T=new c(o[2],b,s.sparse.count*l);a!==null&&(v=new Rt(v.array.slice(),v.itemSize,v.normalized)),v.normalized=!1;for(let P=0,_=A.length;P<_;P++){let C=A[P];if(v.setX(C,T[P*l]),l>=2&&v.setY(C,T[P*l+1]),l>=3&&v.setZ(C,T[P*l+2]),l>=4&&v.setW(C,T[P*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}v.normalized=g}return v})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=Hf[h.magFilter]||yt,u.minFilter=Hf[h.minFilter]||ai,u.wrapS=Vf[h.wrapS]||An,u.wrapT=Vf[h.wrapT]||An,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Gt&&u.minFilter!==yt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=s.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;let h=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(h),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(d){return new Promise(function(h,p){let g=h;t.isImageBitmapLoader===!0&&(g=function(y){let v=new ln(y);v.needsUpdate=!0,h(v)}),t.load(Zi.resolveURL(d,r.path),g,void 0,p)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),Ai(d,o),d.userData.mimeType=o.mimeType||X_(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[lt.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[lt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[lt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new _i,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new xi,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ls}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[lt.KHR_MATERIALS_UNLIT]){let d=s[lt.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new Te(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],Mn),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,Vt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=kt);let u=r.alphaMode||ku.OPAQUE;if(u===ku.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===ku.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Xt&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new _e(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==Xt&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Xt){let d=r.emissiveFactor;a.emissive=new Te().setRGB(d[0],d[1],d[2],Mn)}return r.emissiveTexture!==void 0&&o!==Xt&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Vt)),Promise.all(c).then(function(){let d=new o(a);return r.name&&(d.name=r.name),Ai(d,r),t.associations.set(d,{materials:e}),r.extensions&&Hs(s,d,r),d})}createUniqueName(e){let t=Pt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[lt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Gf(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=W_(c),d=s[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[lt.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=Gf(new bt,c,t),s[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?H_(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let p=0,g=u.length;p<g;p++){let y=u[p],v=o[p],m,E=c[p];if(v.mode===Kn.TRIANGLES||v.mode===Kn.TRIANGLE_STRIP||v.mode===Kn.TRIANGLE_FAN||v.mode===void 0)m=r.isSkinnedMesh===!0?new co(y,E):new pt(y,E),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),v.mode===Kn.TRIANGLE_STRIP?m.geometry=zu(m.geometry,Bo):v.mode===Kn.TRIANGLE_FAN&&(m.geometry=zu(m.geometry,Pr));else if(v.mode===Kn.LINES)m=new Bi(y,E);else if(v.mode===Kn.LINE_STRIP)m=new Is(y,E);else if(v.mode===Kn.LINE_LOOP)m=new ho(y,E);else if(v.mode===Kn.POINTS)m=new Zn(y,E);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+v.mode);Object.keys(m.geometry.morphAttributes).length>0&&G_(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Ai(m,r),v.extensions&&Hs(s,m,v),t.assignFinalMaterial(m),d.push(m)}for(let p=0,g=d.length;p<g;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return r.extensions&&Hs(s,d[0],r),d[0];let h=new an;r.extensions&&Hs(s,h,r),t.associations.set(h,{meshes:e});for(let p=0,g=d.length;p<g;p++)h.add(d[p]);return h})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Qt(ji.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Si(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ai(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let d=o[c];if(d){a.push(d);let h=new ke;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new uo(a,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let p=s.channels[d],g=s.samplers[p.sampler],y=p.target,v=y.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,E=s.parameters!==void 0?s.parameters[g.output]:g.output;y.node!==void 0&&(o.push(this.getDependency("node",v)),a.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",E)),c.push(g),u.push(y))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){let h=d[0],p=d[1],g=d[2],y=d[3],v=d[4],m=[];for(let L=0,b=h.length;L<b;L++){let A=h[L],T=p[L],P=g[L],_=y[L],C=v[L];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();let U=n._createAnimationTracks(A,T,P,_,C);if(U)for(let I=0;I<U.length;I++)m.push(U[I])}let E=new Er(r,void 0,m);return Ai(E,s),E})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(p){p.isSkinnedMesh&&p.bind(h,q_)});for(let p=0,g=d.length;p<g;p++)u.add(d[p]);if(u.userData.pivot!==void 0&&d.length>0){let p=u.userData.pivot,g=d[0];u.pivot=new D().fromArray(p),u.position.x-=p[0],u.position.y-=p[1],u.position.z-=p[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new br:c.length>1?u=new an:c.length===1?u=c[0]:u=new zt,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=o),Ai(u,r),r.extensions&&Hs(n,u,r),r.matrix!==void 0){let d=new ke;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new an;n.name&&(r.name=s.createUniqueName(n.name)),Ai(r,n),n.extensions&&Hs(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++){let h=l[u];h.parent!==null?r.add(zf(h)):r.add(h)}let c=u=>{let d=new Map;for(let[h,p]of s.associations)(h instanceof Cn||h instanceof ln)&&d.set(h,p);return u.traverse(h=>{let p=s.associations.get(h);p!=null&&d.set(h,p)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,l=[];function c(p){p.morphTargetInfluences&&l.push(p.name?p.name:p.uuid)}vs[r.path]===vs.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let u;switch(vs[r.path]){case vs.weights:u=Xi;break;case vs.rotation:u=bi;break;case vs.translation:case vs.scale:u=Yi;break;default:n.itemSize===1?u=Xi:u=Yi;break}let d=s.interpolation!==void 0?k_[s.interpolation]:Rs,h=this._getArrayFromAccessor(n);for(let p=0,g=l.length;p<g;p++){let y=new u(l[p]+"."+vs[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),o.push(y)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=hh(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof bi?ch:Yl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Y_(i,e,t){let n=e.attributes,s=new Sn;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new D(l[0],l[1],l[2]),new D(c[0],c[1],c[2])),a.normalized){let u=hh(Nr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new D,l=new D;for(let c=0,u=r.length;c<u;c++){let d=r[c];if(d.POSITION!==void 0){let h=t.json.accessors[d.POSITION],p=h.min,g=h.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),h.normalized){let y=hh(Nr[h.componentType]);l.multiplyScalar(y)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new pn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Gf(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=uh[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return et.workingColorSpace!==Mn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${et.workingColorSpace}" not supported.`),Ai(i,e),Y_(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?V_(i,e.targets,t):i})}function Ht(i){let e=2166136261;for(let t of i)e=Math.imul(e^t.charCodeAt(0),16777619);return(e>>>0)/4294967296}function Zl(i,e=null,t=null){let n=[...i.nodes].sort((l,c)=>c.degree-l.degree||l.id.localeCompare(c.id)),s=new Map(n.map((l,c)=>[l.id,c])),r=new Map((e?.nodes||[]).map(l=>[l.id,l])),o=new Map((t?.nodes||[]).map(l=>[l.id,l])),a=l=>l&&["x","y","z"].every(c=>Number.isFinite(l[c])&&Math.abs(l[c])<1e5);return i.nodes.map(l=>{let c=s.get(l.id)<18?"yellow":s.get(l.id)<72?"white":"blue",u=c==="yellow"?5+2*Math.sqrt(l.degree/n[0].degree):c==="white"?3.4:2.3+Math.min(l.degree/100,.7),d=r.get(l.id)||l,h=i.routes[l.id]?.root||l.id,p=(Ht(h)-.5)*180+(Ht(l.id+"depth")-.5)*140,g=o.get(l.id),y=a(g)?{x:g.x,y:g.y,z:g.z}:{x:d.x/12,y:-d.y/12,z:p};return{...l,...y,radius:u,tier:c,pinned:a(g)?!!g.pinned:!!d.pinned,colour:c==="yellow"?"#ffe08a":c==="white"?"#f1f7ff":["#7de3ff","#9baeff","#82bbdf","#b2bbf5"][Math.floor(Ht(l.id)*4)]}})}var Kl=class{constructor(e,t,n,s){this.onUpdate=n,this.onError=s,this.nodes=e,this.index=new Map(e.map((r,o)=>[r.id,o])),this.metrics={overlaps:0,maxPenetration:0,nearContacts:0,physicsMs:0},this.steps=0,this.worker=new Worker("./vendor/graph-physics-worker.js"),this.ready=new Promise((r,o)=>{this.worker.onerror=a=>{o(new Error(a.message)),this.onError(new Error(a.message))},this.worker.onmessage=({data:a})=>{if(a.type==="error"){let l=new Error(a.message);a.stack&&(l.stack=a.stack),o(l),this.onError(l);return}a.type==="state"&&(this.nodes.forEach((l,c)=>{l.x=a.positions[c*3],l.y=a.positions[c*3+1],l.z=a.positions[c*3+2],l.pinned=!!a.pins[c]}),this.metrics=a.metrics,this.steps=a.steps,this.jointCount=a.springs,this.groupParents=new Map((a.groupParents||[]).map(([l,c,u,d])=>[l,{x:c,y:u,z:d}])),a.initial&&r(),a.action==="dragEnded"&&(this.releasePending=!1,this.onRelease?.()),a.action==="groupEnded"&&this.onGroupRelease?.(),this.onUpdate())}}),this.worker.postMessage({type:"init",nodes:e,edges:t.edges,routes:t.routes,attraction:t.attraction,settings:{running:!1,visible:!document.hidden}})}configure(e){this.worker.postMessage({type:"settings",settings:e})}pin(e,t){this.nodes[e].pinned=t,this.worker.postMessage({type:"pin",index:e,pinned:t})}startDrag(e){this.dragIndex=e,this.nodes[e].pinned=!1,this.worker.postMessage({type:"startDrag",index:e})}moveDrag(e){this.pendingTarget={x:e.x,y:e.y,z:e.z},this.moveFrame||(this.moveFrame=requestAnimationFrame(()=>{this.moveFrame=0,this.flushDrag()}))}flushDrag(){this.pendingTarget&&(this.worker.postMessage({type:"moveDrag",target:this.pendingTarget}),this.pendingTarget=null)}endDrag(e){this.flushDrag(),this.dragIndex=void 0,this.releasePending=!0,this.worker.postMessage({type:"endDrag",pin:e})}startGroupDrag(e,t,n,s=[]){this.groupDragActive=!0,this.worker.postMessage({type:"startGroupDrag",indices:e,centre:t,groupId:n,collisionProxies:s})}moveGroupDrag(e){this.pendingGroupTarget={x:e.x,y:e.y,z:e.z},this.groupMoveFrame||(this.groupMoveFrame=requestAnimationFrame(()=>{this.groupMoveFrame=0,this.flushGroupDrag()}))}flushGroupDrag(){this.pendingGroupTarget&&(this.worker.postMessage({type:"moveGroupDrag",target:this.pendingGroupTarget}),this.pendingGroupTarget=null)}endGroupDrag(){this.flushGroupDrag(),this.groupDragActive=!1,this.worker.postMessage({type:"endGroupDrag"})}clearance(){return this.metrics}dispose(){cancelAnimationFrame(this.moveFrame),cancelAnimationFrame(this.groupMoveFrame),this.worker.terminate()}};var jl=class{constructor(e){this.nodes=e,this.from=new Float32Array(e.length*3),this.to=this.from.slice(),this.started=0,this.duration=1e3/60,this.active=!1}receive(e,t,n=!1){this.nodes.forEach((s,r)=>{let o=r*3;this.from[o]=s.x,this.from[o+1]=s.y,this.from[o+2]=s.z}),this.to.set(e),this.started=t,this.active=!0,n&&this.sample(1/0)}sample(e,t=-1){if(!this.active)return!1;let n=Math.max(0,Math.min(1,(e-this.started)/this.duration));return this.nodes.forEach((s,r)=>{let o=r*3,a=r===t||s.pinned?1:n;s.x=this.from[o]+(this.to[o]-this.from[o])*a,s.y=this.from[o+1]+(this.to[o+1]-this.from[o+1])*a,s.z=this.from[o+2]+(this.to[o+2]-this.from[o+2])*a}),this.active=n<1,!0}};var Wo=class extends Kl{constructor(...e){super(...e),this.scales=new Float32Array(this.nodes.length),this.linkProgress=new Float32Array(this.nodes.length),this.entrance={active:!0,phase:"waiting",revealed:0,total:this.nodes.length},this.cycle=0,this.skipWaiters=[],this.smoother=new jl(this.nodes);let t=this.worker.onmessage;this.worker.onmessage=n=>{let s=n.data;s.type==="state"&&(s.cycle??0)<this.cycle||(s.type==="state"&&(this.smoother.receive(s.positions,performance.now(),s.initial||!!s.action),this.scales=s.scales,this.linkProgress=s.linkProgress,this.entrance=s.entrance),t(n),s.type==="state"&&!s.initial&&!s.action&&this.smoother.sample(performance.now(),this.dragIndex),s.type==="state"&&s.action==="finishEntrance"&&this.skipWaiters.splice(0).forEach(r=>r(!0)),s.type==="error"&&this.skipWaiters.splice(0).forEach(r=>r(!1)))}}sample(e){return this.smoother.sample(e,this.dragIndex)}replay(e){this.skipWaiters.splice(0).forEach(t=>t(!1)),this.cycle++,this.scales.fill(0),this.linkProgress.fill(0),this.entrance={active:!0,phase:"waiting",revealed:0,total:e.visible.filter(Boolean).length},this.worker.postMessage({type:"entrance",cycle:this.cycle,...e}),this.onUpdate()}skip(){if(!this.entrance.active)return Promise.resolve(!0);let e=new Promise(t=>this.skipWaiters.push(t));return this.worker.postMessage({type:"finishEntrance"}),e}dispose(){this.skipWaiters.splice(0).forEach(e=>e(!1)),super.dispose()}};var ph={saved:"My layout",constellation:"Constellation",galaxy:"Galaxy",globe:"Globe",helix:"Helix"},Xf={saved:"Your own saved arrangement and pins.",constellation:"Related nodes gather around their hubs in distinct three-dimensional groups.",galaxy:"Three sweeping arms with related communities beside one another.",globe:"Communities distributed across a spherical shell.",helix:"Two rising strands, with their real connections crossing between them."},Z_=Math.PI*(3-Math.sqrt(5));function fh(i,e,t){let n=1-2*(i+.5)/e,s=Math.sqrt(Math.max(0,1-n*n)),r=i*Z_;return{x:Math.cos(r)*s*t,y:n*t,z:Math.sin(r)*s*t}}function qf(i,e,t){if(t==="saved")return i.map(u=>({...u}));if(!ph[t])throw new Error("Unknown layout");let n=new Map,s=new Map(i.map((u,d)=>[u.id,d])),r=i.map((u,d)=>d),o=u=>{for(;r[u]!==u;)r[u]=r[r[u]],u=r[u];return u};for(let u of e.edges){let d=o(s.get(u.from)),h=o(s.get(u.to));d!==h&&(r[d]=h)}i.forEach((u,d)=>{let h=e.routes[u.id]?.root||"component-"+o(d);n.has(h)||n.set(h,[]),n.get(h).push(u)});let a=[...n.values()].sort((u,d)=>d.length-u.length||u[0].id.localeCompare(d[0].id)),l=a.flatMap(u=>u.sort((d,h)=>h.degree-d.degree||d.id.localeCompare(h.id))),c=new Map;if(t==="constellation"){let u=0;a.forEach((d,h)=>{let p=d.length>8,g=fh(p?h:u++,p?Math.min(a.length,24):Math.max(1,a.filter(v=>v.length<=8).length),p?230:520),y=p?Math.cbrt(d.length)*13:10;d.forEach((v,m)=>{let E=m===0?{x:0,y:0,z:0}:fh(m-1,d.length-1,y*Math.cbrt((m+.5)/d.length));c.set(v.id,{x:g.x+E.x,y:g.y+E.y,z:g.z+E.z})})})}else l.forEach((u,d)=>{let h=(d+.5)/l.length,p=Ht(u.id)*Math.PI*2,g;if(t==="galaxy"){let y=d%3,v=y*Math.PI*2/3+Math.sqrt(h)*Math.PI*2.1,m=65+Math.sqrt(h)*470,E=(Ht(u.id+"spread")-.5)*38;g={x:Math.cos(v)*(m+E),y:(Ht(u.id+"height")-.5)*(35+60*(1-h)),z:Math.sin(v)*(m+E)}}else if(t==="globe")g=fh(d,l.length,365+(Ht(u.id+"shell")-.5)*30);else{let y=d%2,v=h*Math.PI*6+y*Math.PI,m=180+(Ht(u.id+"helix")-.5)*65;g={x:Math.cos(v)*m,y:(h-.5)*850+(Ht(u.id+"rise")-.5)*18,z:Math.sin(v)*m}}c.set(u.id,g)});return i.map(u=>({...u,...c.get(u.id),pinned:u.tier==="yellow"}))}var ui=[{id:"notes",name:"Routines",colour:"#61cae3",centre:[-190,210,25]},{id:"memory",name:"Memory",colour:"#e7ba6e",centre:[85,235,60]},{id:"conversations",name:"Conversations",colour:"#e49bbb",centre:[250,40,-20]},{id:"graph",name:"Library",colour:"#a5d4a8",centre:[-275,-75,35]},{id:"mirrors",name:"Files",colour:"#7688ac",centre:[-55,-165,-190]},{id:"agents",name:"Activity",colour:"#b9a4eb",centre:[-325,135,85]},{id:"archive",name:"Settings",colour:"#b7aaa0",centre:[-80,-325,90]}],K_=Object.fromEntries(ui.map(i=>[i.id,i]));function Lt(i){return["note","builtin"].includes(i.kind)?"notes":["fact","summary","lesson","crystal","semantic","procedure"].includes(i.kind)?"memory":["observation","session"].includes(i.kind)?"conversations":["graph-node","graph-edge","memory-relation"].includes(i.kind)?"graph":i.kind==="mirror"?"mirrors":i.kind==="agent"?"agents":"archive"}var mh=i=>K_[Lt(i)].colour,$l={atlas:"Source sections",...ph},Yf={atlas:"Real records grouped by their source, separated in depth. All saved relationships remain available.",...Xf};function gh(i,e,t,n){let s;if(n)s=Zl(i,null,n);else if(t!=="atlas")s=qf(e,i,t);else{let r=new Map;for(let o of ui){let a=e.filter(c=>Lt(c)===o.id).sort((c,u)=>u.degree-c.degree||c.id.localeCompare(u.id)),l=o.id==="mirrors"?155:20+Math.cbrt(a.length)*13;a.forEach((c,u)=>{let d=u*2.39996323,h=1-2*(u+.5)/a.length,p=Math.sqrt(1-h*h),g=l*(.28+.72*Math.cbrt(Ht(c.id+"section")));r.set(c.id,{...c,x:o.centre[0]+Math.cos(d)*p*g,y:o.centre[1]+h*g,z:o.centre[2]+Math.sin(d)*p*g*.8})})}s=e.map(o=>r.get(o.id))}return t==="atlas"&&(s=s.map(r=>({...r,sourceGroup:Lt(r),radius:r.kind==="mirror"?r.degree>200?4.4:1.25:r.kind==="agent"?5:r.tier==="yellow"?4.4:r.tier==="white"?2.8:1.9}))),s}function vh(i,e){let t=new Map(i.map((h,p)=>[h.id,p])),n=i.map((h,p)=>p),s=h=>{for(;n[h]!==h;)n[h]=n[n[h]],h=n[h];return h},r=e.edges.map((h,p)=>{let g=t.get(h.from),y=t.get(h.to),v=i[g],m=i[y];return{i:p,a:g,b:y,d:(Lt(v)===Lt(m)?0:1e6)+(v.x-m.x)**2+(v.y-m.y)**2+(v.z-m.z)**2}}).sort((h,p)=>h.d-p.d||h.i-p.i),o=new Set,a=new Map,l=new Map;for(let h of r){let p=s(h.a),g=s(h.b);if(p===g)continue;let y=Lt(i[h.a]),v=Lt(i[h.b]);if(y==="mirrors"&&v==="mirrors"){if((l.get(h.a)||0)>=12||(l.get(h.b)||0)>=12)continue;l.set(h.a,(l.get(h.a)||0)+1),l.set(h.b,(l.get(h.b)||0)+1)}if(y!==v){let m=[y,v].sort().join(":");if((a.get(m)||0)>=2)continue;a.set(m,(a.get(m)||0)+1)}n[p]=g,o.add(h.i)}let c=new Uint16Array(i.length);for(let h of o){let p=e.edges[h];c[t.get(p.from)]++,c[t.get(p.to)]++}let u=0,d=Math.ceil(i.length*.6);for(let h of r)u>=d||o.has(h.i)||Lt(i[h.a])!==Lt(i[h.b])||c[h.a]>=3||c[h.b]>=3||(o.add(h.i),c[h.a]++,c[h.b]++,u++);return o}function Zf(i){let e=(t,n)=>i.filter(s=>s.kind===t).sort((s,r)=>r.degree-s.degree||s.id.localeCompare(r.id)).slice(0,n);return[...e("agent",2),...e("note",1),...e("graph-node",1),...e("mirror",1)].map(t=>t.id)}function xh(i,e){if(e!=="atlas")return i;let t=new Map(i.nodes.map(s=>[s.id,s])),n=Object.fromEntries(Object.entries(i.routes).map(([s,r])=>{let o=t.get(s),a=t.get(r.anchor);return[s,o&&a&&Lt(o)===Lt(a)?r:{...r,anchor:void 0}]}));return{...i,routes:n}}var Xo={celestial:{title:"Celestial",hub:"#ffe08a",local:"#f1f7ff",nodes:["#7de3ff","#9baeff","#82bbdf","#b2bbf5"],line:"#9bbbd8"},aurora:{title:"Aurora",hub:"#f9f6bd",local:"#f2ffec",nodes:["#80efbb","#9de8e6","#8ccdc4","#c2edb1"],line:"#8ec5b7"},ember:{title:"Ember",hub:"#fff1ac",local:"#ffe4ce",nodes:["#ff9970","#ef737a","#dfab91","#edbf72"],line:"#d09b85"},amethyst:{title:"Amethyst",hub:"#f7dbff",local:"#f8f2ff",nodes:["#c393ed","#a4a9f7","#e1a3cd","#ab93db"],line:"#b4a0d3"},silver:{title:"Silver",hub:"#ffffff",local:"#e7eff9",nodes:["#a9b9cc","#d7e2eb","#bcced8","#e3e7ed"],line:"#8f9eb2"}},_h={starlight:{title:"Starlight",glow:1,links:.13,core:"sphere",rings:!1},crystal:{title:"Crystal",glow:.35,links:.21,core:"crystal",rings:!1},orbital:{title:"Orbital",glow:.65,links:.11,core:"sphere",rings:!0},minimal:{title:"Minimal",glow:0,links:.075,core:"sphere",rings:!1}};function Kf(i,e){let t=Xo[e]||Xo.celestial;return i.tier==="yellow"?t.hub:i.tier==="white"?t.local:t.nodes[Math.floor(Ht(i.id)*t.nodes.length)]}var jf={name:"VolumeRenderShader1",uniforms:{u_size:{value:new D(1,1,1)},u_renderstyle:{value:0},u_renderthreshold:{value:.5},u_clim:{value:new _e(1,1)},u_data:{value:null},u_cmdata:{value:null}},vertexShader:`

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
}`,j_=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vView;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vec4 p=modelViewMatrix*vec4(position,1.);vView=-p.xyz;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*p;}`,$_=`uniform vec3 uRings[3];uniform vec3 uColour;uniform float uStrength;
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
}`,J_=`uniform sampler2D uField;uniform float uTime;uniform float uSpeed;uniform float uStrength;
varying vec2 vUv;
void main(){
 float r=1.-vUv.y;
 vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;
 float upper=smoothstep(-.04,.07,sin(vUv.x*6.28318530718));
 float density=field.r*upper;
 if(density<.001)discard;
 vec3 colour=mix(vec3(1.,.29,.045),vec3(1.,.83,.45),smoothstep(.35,.9,field.g));
 gl_FragColor=vec4(colour*uStrength,density);
}`;async function $f(){let i=await fetch("./assets/native-optics.json");if(!i.ok)throw new Error("Native horizon optics unavailable");let e=await i.json();if(e.sourceImageUsed!==!1)throw new Error("Unexpected optical material source");let[t,n]=await Promise.all([new Nn().loadAsync("./assets/"+e.file),fetch("./assets/"+e.halo.file).then(async r=>{if(!r.ok||!r.body)throw new Error("Native halo field unavailable");return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())})]);if(n.byteLength!==e.halo.bytes)throw new Error("Incomplete native halo field");let s=new vi(n,...e.halo.dimensions,vn);return s.minFilter=s.magFilter=yt,s.wrapS=An,s.unpackAlignment=1,s.needsUpdate=!0,{scene:t.scene,spec:e,texture:s}}function Jf(i,{spec:e,texture:t}){let n=i==="PhotonSphere",s=n?{uRings:{value:e.photon.rings.map(r=>new D(...r))},uColour:{value:new Te(...e.photon.colour)},uStrength:{value:e.photon.strength},uPlaneOffset:{value:e.photon.planeOffset},uPlaneSlope:{value:e.photon.planeSlope},uTime:{value:0}}:{uField:{value:t},uTime:{value:0},uSpeed:{value:e.halo.flowSpeed},uStrength:{value:e.halo.strength}};return new at({vertexShader:n?j_:yh,fragmentShader:n?$_:J_,uniforms:s,side:n?On:kt,transparent:!0,depthWrite:!1,depthTest:!0,blending:cn,toneMapped:!1})}var Qf=`
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
}`;function ep(i){return{uInnerRadius:{value:i.halo.innerRadius},uRadialSpan:{value:i.halo.radialSpan},uSideSpan:{value:i.halo.sideSpan},uAuraCentre:{value:new dt},uAuraX:{value:new _e},uAuraY:{value:new _e}}}var Q_=`varying vec2 vUv;
uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;
${Qf}
void main(){
 vUv=uv;
 gl_Position=projectAura(auraPoint(uv.x*6.28318530718,1.-uv.y));
}`,ey=`uniform sampler2D uField;
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
}`;async function tp(){let i=await fetch("./assets/continuous-optics.json");if(!i.ok)throw new Error("Continuous corona manifest unavailable");let e=await i.json(),[t,n]=await Promise.all([new Nn().loadAsync("./assets/"+e.file),fetch("./assets/"+e.halo.file).then(async r=>{if(!r.ok||!r.body)throw new Error("Continuous corona field unavailable");return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())})]);if(n.byteLength!==e.halo.bytes)throw new Error("Incomplete continuous corona field");let s=new vi(n,...e.halo.dimensions,vn);return s.minFilter=s.magFilter=yt,s.wrapS=An,s.unpackAlignment=1,s.needsUpdate=!0,{scene:t.scene,spec:e,texture:s}}function bh({spec:i,texture:e}){return new at({vertexShader:Q_,fragmentShader:ey,uniforms:{...ep(i),uField:{value:e},uTime:{value:0},uSpeed:{value:i.halo.flowSpeed},uStrength:{value:i.halo.strength*.36}},side:kt,transparent:!0,depthWrite:!1,depthTest:!0,blending:cn,toneMapped:!1})}var ty=`precision highp float;
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
}`;async function np(){let i=await fetch("./assets/native-volumes.json");if(!i.ok)throw new Error("Native horizon volumes unavailable");let e=await i.json();if(e.sourceImageUsed!==!1)throw new Error("Unexpected horizon material source");let[t,n]=await Promise.all(["native-space-volumes.json","native-space-particles.json"].map(async l=>{let c=await fetch("./assets/"+l);if(!c.ok)throw new Error("Native space asset unavailable: "+l);let u=await c.json();if(u.sourceImageUsed!==!1)throw new Error("Unexpected space material source");return u})),[s,r,o,a]=await Promise.all([Promise.all([...e.volumes,...t.volumes].map(async l=>{let c=await fetch("./assets/"+l.file);if(!c.ok||!c.body)throw new Error("Native gas field unavailable: "+l.id);let u=c.body.pipeThrough(new DecompressionStream("gzip")),d=new Uint8Array(await new Response(u).arrayBuffer());if(d.byteLength!==l.bytes)throw new Error("Incomplete native gas field: "+l.id);let h=new gr(d,...l.dimensions);return h.format=vn,h.type=gn,h.minFilter=yt,h.magFilter=yt,h.wrapT=An,h.unpackAlignment=1,h.needsUpdate=!0,{spec:l,texture:h}})),new Nn().loadAsync("./assets/native-horizon-ground.glb"),$f(),tp()]);return{volumes:s,ground:r,optics:o,corona:a,particles:n}}function Mh({spec:i,texture:e}){let t=new D(i.boundsMin[0],i.boundsMin[2],-i.boundsMax[1]),n=new D(i.boundsMax[0],i.boundsMax[2],-i.boundsMin[1]),s=n.clone().sub(t),r=t.clone().add(n).multiplyScalar(.5),o=new Hi(s.x,s.y,s.z);o.translate(r.x,r.y,r.z);let a=new at({vertexShader:jf.vertexShader,fragmentShader:ty,uniforms:{uField:{value:e},uMin:{value:t},uMax:{value:n},uNativeMin:{value:new D(...i.boundsMin)},uNativeMax:{value:new D(...i.boundsMax)},uFieldMin:{value:new D(...i.fieldBoundsMin)},uFieldMax:{value:new D(...i.fieldBoundsMax)},uSupportRadius:{value:new _e(...i.support?.radius??[i.fieldBoundsMin[0],i.fieldBoundsMax[0]])},uSupportHeight:{value:new _e(...i.support?.height??[i.fieldBoundsMin[2],i.fieldBoundsMax[2]])},uPlaneOffset:{value:i.planeOffset},uPlaneSlope:{value:i.planeSlope},uHalfHeight:{value:i.halfHeight},uDensityScale:{value:i.densityScale*.8},uEmission:{value:i.emissionStrength*.68},uHeatBias:{value:0},uUnifiedGlow:{value:0},uRadialStretch:{value:1},uOuterAura:{value:0},uTime:{value:0},uLocalToClip:{value:new ke}},side:tn,transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1}),l=new pt(o,a);return l.userData.nativeBounds={min:t.clone(),max:n.clone(),support:a.uniforms.uSupportRadius.value.clone()},l.userData.nativeGeometry=o,l.name="Native Blender "+i.id+" gas volume",l.frustumCulled=!1,l.renderOrder=-20,l.onBeforeRender=(c,u,d)=>{a.uniforms.uLocalToClip.value.multiplyMatrices(d.projectionMatrix,d.matrixWorldInverse).multiply(l.matrixWorld)},l}function Sh(i,e){let t=i.material.uniforms;if(t.uRadialStretch.value===e)return;let n=i.userData.nativeBounds;if(t.uRadialStretch.value=e,t.uMin.value.copy(n.min),t.uMax.value.copy(n.max),t.uSupportRadius.value.copy(n.support),e===1){i.geometry=i.userData.nativeGeometry;return}let s=o=>Math.sign(o)*(1+(Math.abs(o)-1)*e);for(let o of["x","z"])t.uMin.value[o]=s(n.min[o]),t.uMax.value[o]=s(n.max[o]);let r=Math.abs(t.uPlaneSlope.value)*(t.uMax.value.z-n.max.z);if(t.uMin.value.y-=r,t.uMax.value.y+=r,t.uSupportRadius.value.set(1+(n.support.x-1)*e,1+(n.support.y-1)*e),!i.userData.expandedGeometry){let o=t.uMax.value.clone().sub(t.uMin.value),a=t.uMin.value.clone().add(t.uMax.value).multiplyScalar(.5);i.userData.expandedGeometry=new Hi(o.x,o.y,o.z),i.userData.expandedGeometry.translate(a.x,a.y,a.z)}i.geometry=i.userData.expandedGeometry}function ip(i){let e=i.colourDirection;return{uPalette:{value:e.radialStops.map(t=>new Te(t.colour))},uStops:{value:e.radialStops.map(t=>t.at)},uRose:{value:new Te(e.rose)},uGold:{value:new Te(e.gold)},uBlue:{value:new Te(e.blue)},uCyan:{value:new Te(e.cyan)}}}var sp=`
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
}`;function rp(i,e){let t=new Wt(1,1,{format:vn,type:un,minFilter:yt,magFilter:yt,depthBuffer:!1,stencilBuffer:!1});t.texture.name="Full-resolution shared corona optical field (half float)";let n=new _e,s=new ke,r=new ke,o=new Ye,a=new D,l=.4,c=new at({uniforms:{...e.uniforms,uProjectionInverse:{value:new ke},uRayToLocal:{value:o},uLocalEye:{value:a}},vertexShader:"varying vec2 vNdc;void main(){vNdc=position.xy;gl_Position=vec4(position,1.);}",fragmentShader:`uniform sampler2D uField;uniform float uTime,uSpeed,uInnerRadius,uRadialSpan,uSideSpan,uVerticalSpread;
   uniform mat4 uProjectionInverse;uniform mat3 uRayToLocal;uniform vec3 uLocalEye;varying vec2 vNdc;
   ${Eh}
   void main(){vec4 point=uProjectionInverse*vec4(vNdc,1.,1.);vec3 ray=normalize(uRayToLocal*point.xyz);vec2 coordinates=sampleSharedCoordinates(uLocalEye,ray);gl_FragColor=vec4(coordinates,0.,1.);}`,depthTest:!1,depthWrite:!1,blending:In,toneMapped:!1}),u=new bt;u.setAttribute("position",new xt([-1,-1,0,3,-1,0,-1,3,0],3));let d=new Ps,h=new Fs;d.add(new pt(u,c));let p="",g;return{prepare(y,v){if(g===void 0&&(g=y.extensions.has("EXT_color_buffer_float")),!g||!v.isPerspectiveCamera)return e.uniforms.uUseSharedField.value=!1,!1;i.updateWorldMatrix(!0,!1),v.updateWorldMatrix(!0,!1);let m=y.getRenderTarget();m?n.set(m.width,m.height):y.getDrawingBufferSize(n);let E=[...i.matrixWorld.elements,...v.matrixWorld.elements,...v.projectionMatrix.elements,n.x,n.y].join(",");if(E!==p){s.copy(i.matrixWorld).invert(),r.copy(s).multiply(v.matrixWorld),o.setFromMatrix4(r),c.uniforms.uProjectionInverse.value.copy(v.projectionMatrixInverse),a.setFromMatrixPosition(v.matrixWorld).applyMatrix4(s),e.uniforms.uLocalEye.value.copy(a);let L=Math.max(1,Math.ceil(n.x*l)),b=Math.max(1,Math.ceil(n.y*l));(t.width!==L||t.height!==b)&&t.setSize(L,b);let A=y.autoClear;try{y.autoClear=!1,y.setRenderTarget(t),y.render(d,h)}finally{y.setRenderTarget(m),y.autoClear=A}p=E}return e.uniforms.uSharedField.value=t.texture,e.uniforms.uSharedSize.value.copy(n),e.uniforms.uUseSharedField.value=!0,!0},dispose(){t.dispose(),u.dispose(),c.dispose()}}}var ny={layers:6,segments:128,bands:128},iy=i=>{let e=Math.max(0,Math.min(1,i/.3));return e*e*(3-2*e)};function sy(i,e,t,n){let s=Math.max(0,Math.cos(e)),r=Math.sin(e),o=s**6,a=i.halo.innerRadius+n*i.halo.radialSpan,l=s*a+i.halo.sideSpan*o*iy(n),c=r*(i.halo.innerRadius+n*i.halo.radialSpan*(i.halo.verticalSpread??1))*(1-.25*o*n);return new D(l*Math.cos(t),c,l*Math.sin(t))}function ry(i){let e=bh(i);return Object.assign(e.uniforms,{uUseSharedField:{value:!1},uSharedField:{value:null},uSharedSize:{value:new _e(1,1)},uLocalEye:{value:new D}}),Object.assign(e.uniforms,{uLayerR:{value:0},uLayerProfile:{value:new dt}}),Object.assign(e.uniforms,ip(i.spec),{uInnerRadius:{value:i.spec.halo.innerRadius},uRadialSpan:{value:i.spec.halo.radialSpan},uSideSpan:{value:i.spec.halo.sideSpan},uVerticalSpread:{value:i.spec.halo.verticalSpread}}),e.vertexShader=`uniform bool uUseSharedField;uniform vec3 uLocalEye;attribute float aLightWeight;varying vec2 vUv;varying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;
 void main(){vUv=uv;vWeight=aLightWeight;vLocal=position;vEye=uUseSharedField?uLocalEye:(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}`,e.fragmentShader=sp+`uniform float uLayerR;uniform vec4 uLayerProfile;uniform bool uUseSharedField;uniform sampler2D uSharedField;uniform vec2 uSharedSize;uniform float uInnerRadius;uniform float uRadialSpan;uniform float uSideSpan;uniform float uVerticalSpread;
varying vec3 vWorld;varying vec3 vNormal;varying float vWeight;varying vec3 vLocal;varying vec3 vEye;
`+e.fragmentShader.replace("void main(){",Eh+`
void main(){vec3 ray=normalize(vLocal-vEye);float t=dot(-vEye,ray);if(t>0.&&t*t-dot(vEye,vEye)+1.>0.)discard;`).replace("vec2 field=texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg;",`
   vec3 sharedField;
   if(uUseSharedField){vec2 cached=texture2D(uSharedField,gl_FragCoord.xy/uSharedSize).rg;sharedField=vec3(texture2D(uField,vec2(fract(cached.x+uTime*uSpeed),cached.y)).rg,cached.y);}
   else sharedField=sampleSharedField(vEye,ray);
   float fieldR=sharedField.z;
   vec2 field=sharedField.xy;
   field=mix(texture2D(uField,vec2(fract(vUv.x+uTime*uSpeed),r)).rg,field,.45);`).replace("float heat=clamp(.92-r*.95+(field.g-.5)*.24,0.,1.);","float heat=clamp(.94-fieldR*.80+(field.g-.5)*.12,0.,1.);").replace("vec3 gas=mix(vec3(1.,.20,.025),vec3(1.,.86,.63),smoothstep(.20,.90,heat));","vec3 gas=layeredColour(fieldR,field,vLocal);").replaceAll("field.r*.16","field.r*.16*exp(-r*6.)").replace("float r=1.-vUv.y","float r=uLayerR").replace("float soft=.30*exp(-r*5.5);","float soft=uLayerProfile.y;").replace("float body=ring(r,.07,.035)*.48+ring(r,.17,.070)*.32+ring(r,.32,.10)*.15+ring(r,.50,.18)*.04;","float body=uLayerProfile.x;").replace("float taper=smoothstep(0.,.004,r)*(1.-smoothstep(.70,1.,r));","float taper=uLayerProfile.z;").replaceAll("exp(-r*6.)","uLayerProfile.w").replace("float soft=","photon=0.;float soft=").replace("gl_FragColor=vec4(radiance*taper/alpha,alpha);","float facing=abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)));float rim=pow(max(0.,1.-facing),3.)*smoothstep(0.,.25,facing);gl_FragColor=vec4(radiance*taper/alpha,alpha*vWeight*rim);"),e}function op(i,{sharedField:e=!1,singlePass:t=!1}={}){let n=new an;n.name="White aura \u2014 continuous curved 360 degree body";let{layers:s,segments:r,bands:o}=ny,a=[.004,.07,.17,.32,.5,1],l=ry(i);l.forceSinglePass=t,e&&(n.userData.fieldCache=rp(n,l));for(let c=0;c<s;c++){let u=a[c],d=((a[c+1]??1)-(a[c-1]??0))*.5,h=new Gi(1,r,o),p=h.attributes.position,g=h.attributes.uv,y=new Float32Array(p.count);for(let A=0;A<p.count;A++){let T=Math.asin(Math.max(-1,Math.min(1,p.getY(A)))),P=Math.atan2(p.getZ(A),p.getX(A)),_=sy(i.spec,T,P,u);p.setXYZ(A,..._.toArray());let C=Math.max(0,Math.cos(T)),U=Math.max(0,Math.min(1,u/.3)),I=Math.hypot(_.x,_.z),M=C*i.spec.halo.radialSpan+i.spec.halo.sideSpan*C**6*6*U*(1-U)/.3;y[A]=d*(I>1e-6?M/I:i.spec.halo.radialSpan/(i.spec.halo.innerRadius+u*i.spec.halo.radialSpan))*(i.spec.halo.bodyLightGain??5),g.setXY(A,P/(Math.PI*2)+T/(Math.PI*2)*Math.cos(P),1-u)}h.setAttribute("aLightWeight",new Rt(y,1)),h.computeVertexNormals(),h.computeBoundingSphere();let v=new pt(h,l);v.name="Closed flowing aura surface "+(c+1),v.renderOrder=-25,v.frustumCulled=!1,n.add(v);let m=Math.fround(1-Math.fround(1-u)),E=(A,T,P)=>P*Math.exp(-(((m-A)/T)**2)),L=(A,T)=>{let P=Math.max(0,Math.min(1,(m-A)/(T-A)));return P*P*(3-2*P)},b=new dt(E(.07,.035,.48)+E(.17,.07,.32)+E(.32,.1,.15)+E(.5,.18,.04),.3*Math.exp(-m*5.5),L(0,.004)*(1-L(.7,1)),Math.exp(-m*6));v.onBeforeRender=()=>{l.uniforms.uLayerR.value=m,l.uniforms.uLayerProfile.value.copy(b),l.uniformsNeedUpdate=!0}}for(let[c,[u,d]]of[[1.016,2.3],[1.048,.6],[1.087,.2]].entries()){let h=new at({vertexShader:"varying vec3 vWorld;varying vec3 vNormal;void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}",fragmentShader:"uniform float uTime;uniform float uStrength;uniform vec3 uColour;varying vec3 vWorld;varying vec3 vNormal;void main(){float rim=pow(max(0.,1.-abs(dot(normalize(vNormal),normalize(cameraPosition-vWorld)))),8.);if(rim<.0001)discard;gl_FragColor=vec4(uColour*uStrength,rim);}",uniforms:{uTime:{value:0},uStrength:{value:d},uColour:{value:new Te(i.spec.colourDirection.innerShellColours[c])}},transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1,blending:cn}),p=new pt(new Gi(u,128,64),h);p.name="Fine inner emission shell "+(c+1),p.renderOrder=-25,n.add(p)}return n}var oy={referenceDistance:4.2,layers:33,segments:512,bands:32},ap=(i,e,t)=>{let n=Math.min(1,Math.max(0,(t-i)/(e-i)));return n*n*(3-2*n)};function lp(i,e,t,n=0){let s=Math.cos(e),r=Math.sin(e),o=Math.abs(s)**6,a=i.halo.innerRadius+t*i.halo.radialSpan,l=s*a+Math.sign(s)*i.halo.sideSpan*o*ap(0,.3,t),c=r*a*(1-.25*o*t),u=oy.referenceDistance,d=1/u,h=Math.sqrt(1-1/(u*u)),p=d+n*(.24+.38*t+.65*o*ap(.04,.8,t)),g=(u-p)/(u-d);return new D(l*h*g,c*h*g,p)}function cp(){return new Ot().setFromEuler(new Rn(.2,0,.25)).invert().multiply(new Ot().setFromEuler(new Rn(0,0,.25)))}function up(i){let e=new an;e.name="Small blue aura flares",e.quaternion.copy(cp());let t=new Vi(1,1);for(let[n,s]of i.flares.entries()){let r=new at({vertexShader:`uniform float uTime;uniform vec3 uAnchor;
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
       }`,uniforms:{uTime:{value:0},uPhase:{value:n*2.17},uAnchor:{value:lp(i,s.auraAngle,s.auraRadius,.65)},uSize:{value:new _e(...s.size)}},transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1,blending:zn,side:kt}),o=new pt(t,r);o.frustumCulled=!1,o.name="Blue disk wisp "+(n+1),o.renderOrder=-15,e.add(o)}return e}var Fr={halo:{title:"Halo",color:"white",props:{type:"plane",uAmplitude:1,uDensity:1.3,uSpeed:.4,uStrength:4,uTime:0,uFrequency:5.5,range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",axesHelper:"off",brightness:1.2,cAzimuthAngle:180,cDistance:3.6,cPolarAngle:90,cameraZoom:1,color1:"#ff5005",color2:"#dbba95",color3:"#d0bce1",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:-1.4,positionY:0,positionZ:0,reflection:.1,rotationX:0,rotationY:10,rotationZ:50,shader:"defaults",animate:"on",wireframe:!1}},pensive:{title:"Pensive",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.5,cAzimuthAngle:250,cDistance:1.5,cPolarAngle:140,cameraZoom:12.5,color1:"#809bd6",color2:"#910aff",color3:"#af38ff",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.5,rotationX:0,rotationY:0,rotationZ:140,shader:"defaults",type:"sphere",uAmplitude:7,uDensity:.8,uFrequency:5.5,uSpeed:.3,uStrength:.4,uTime:0,wireframe:!1}},mint:{title:"Mint",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.2,cAzimuthAngle:170,cDistance:4.4,cPolarAngle:70,cameraZoom:1,color1:"#94ffd1",color2:"#6bf5ff",color3:"#ffffff",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:.9,positionZ:-.3,reflection:.1,rotationX:45,rotationY:0,rotationZ:0,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.2,uFrequency:0,uSpeed:.2,uStrength:3.4,uTime:0,wireframe:!1}},interstella:{title:"Interstella",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:.8,cAzimuthAngle:270,cDistance:.5,cPolarAngle:180,cameraZoom:15.1,color1:"#73bfc4",color2:"#ff810a",color3:"#8da0ce",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"env",pixelDensity:1,fov:45,positionX:-.1,positionY:0,positionZ:0,reflection:.4,rotationX:0,rotationY:130,rotationZ:70,shader:"defaults",type:"sphere",uAmplitude:3.2,uDensity:.8,uFrequency:5.5,uSpeed:.3,uStrength:.3,uTime:0,wireframe:!1}},nightyNight:{title:"Nighty night",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1,cAzimuthAngle:180,cDistance:2.8,cPolarAngle:80,cameraZoom:9.1,color1:"#606080",color2:"#8d7dca",color3:"#212121",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.1,rotationX:50,rotationY:0,rotationZ:-60,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.5,uFrequency:0,uSpeed:.3,uStrength:1.5,uTime:8,wireframe:!1}},violaOrientalis:{title:"Viola",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",brightness:1.1,cAzimuthAngle:0,cDistance:7.1,cPolarAngle:140,cameraZoom:17.3,color1:"#ffffff",color2:"#ffbb00",color3:"#0700ff",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:0,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:0,shader:"defaults",type:"sphere",uAmplitude:1.4,uDensity:1.1,uSpeed:.1,uStrength:1,uTime:0,uFrequency:5.5,wireframe:!1}},universe:{title:"Universe",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",brightness:1.1,cAzimuthAngle:180,cDistance:3.9,cPolarAngle:115,cameraZoom:1,color1:"#5606ff",color2:"#fe8989",color3:"#000000",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:-.5,positionY:.1,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:235,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.1,uSpeed:.1,uStrength:2.4,uTime:.2,uFrequency:5.5,wireframe:!1}},sunset:{title:"Sunset",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",bgColor1:"#000000",bgColor2:"#000000",brightness:1.5,cAzimuthAngle:60,cDistance:7.1,cPolarAngle:90,cameraZoom:15.3,color1:"#ff7a33",color2:"#33a0ff",color3:"#ffc53d",embedMode:"off",envPreset:"dawn",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:-.15,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:0,shader:"defaults",type:"sphere",uAmplitude:1.4,uDensity:1.1,uSpeed:.1,uStrength:.4,uTime:0,uFrequency:5.5,wireframe:!1}},mandarin:{title:"Mandarin",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"on",bgColor1:"#000000",bgColor2:"#000000",brightness:1.2,cAzimuthAngle:180,cDistance:2.4,cPolarAngle:95,cameraZoom:1,color1:"#ff6a1a",color2:"#c73c00",color3:"#FD4912",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:-2.1,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:225,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1.8,uSpeed:.2,uStrength:3,uTime:.2,uFrequency:5.5,wireframe:!1}},cottonCandy:{title:"Cotton Candy",color:"white",props:{range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",animate:"on",axesHelper:"off",brightness:1.2,cAzimuthAngle:180,cDistance:2.9,cPolarAngle:120,cameraZoom:1,color1:"#ebedff",color2:"#f3f2f8",color3:"#dbf8ff",embedMode:"off",envPreset:"city",grain:"off",lightType:"3d",pixelDensity:1,fov:45,positionX:0,positionY:1.8,positionZ:0,reflection:.1,rotationX:0,rotationY:0,rotationZ:-90,shader:"defaults",type:"waterPlane",uAmplitude:0,uDensity:1,uSpeed:.3,uStrength:3,uTime:.2,uFrequency:5.5,wireframe:!1}}};var g1=Object.values(Fr);function hp(i,e,t,n){return class extends mn{constructor(){let s=Object.entries(i),r=i.colors,o=Th(r[0]),a=Th(r[1]),l=Th(r[2]),c={uC1r:{value:$i(o?.r)},uC1g:{value:$i(o?.g)},uC1b:{value:$i(o?.b)},uC2r:{value:$i(a?.r)},uC2g:{value:$i(a?.g)},uC2b:{value:$i(a?.b)},uC3r:{value:$i(l?.r)},uC3g:{value:$i(l?.g)},uC3b:{value:$i(l?.b)}},u=s.reduce((d,[h,p])=>{let g=ci.clone({[h]:{value:p}});return{...d,...g}},{});super({metalness:.2,userData:u,side:kt,onBeforeCompile:d=>{d.uniforms={...d.uniforms,...u,...c},d.vertexShader=e,d.fragmentShader=t}}),s.forEach(([d])=>Object.defineProperty(this,d,{get:()=>this.uniforms[d].value,set:h=>this.uniforms[d].value=h})),n&&n(this)}}}function ay(i){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function ly(i){let e=i.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);return e?{r:parseInt(e[1]),g:parseInt(e[2]),b:parseInt(e[3])}:null}function Th(i){if(i.startsWith("#"))return ay(i);if(i.startsWith("rgb"))return ly(i);throw new Error("Invalid color format")}function $i(i=0){return i/255}var wh=`\r
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
`;var Rh={};Cp(Rh,{fragment:()=>dp,vertex:()=>fp});var dp=`// Cosmic Sphere Fragment Shader - Nebula Particle Effect\r
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
`;var pp={nightyNight:"Nighty night",universe:"Universe",pensive:"Pensive",violaOrientalis:"Viola",sunset:"Sunset",interstella:"Interstella",off:"Off"},Jl=class{constructor(e,t,n,s){for(let o of["uv2_pars_vertex","uv2_vertex","uv2_pars_fragment","encodings_fragment"])Qe[o]="";this.time=0,this.preset=null,this.shell=new pt(t),this.shell.scale.setScalar(4e4),this.shell.name="ShaderGradient 3D surround",this.shell.renderOrder=-1e3,this.shell.frustumCulled=!1,e.add(this.shell),this.light=new yo(16777215,Math.PI),e.add(this.light);let r=new bt;r.setAttribute("position",new xt(n,3)),this.stars=new Zn(r,new _i({color:13097727,size:80,sizeAttenuation:!0,map:s,transparent:!0,depthWrite:!1,alphaTest:.015,toneMapped:!1})),this.stars.name="Blender world-space surrounding stars",this.stars.frustumCulled=!1,e.add(this.stars)}configure(e){let t=e.background,n=t!=="off";if(this.shell.visible=n,this.stars.visible=n&&e.surroundStars,!n||t===this.preset&&e.environmentDesign===this.design)return;let s=Fr[t].props,r=s.type==="sphere",o={colors:[s.color1,s.color2,s.color3],uTime:s.uTime||0,uSpeed:s.uSpeed,uLoadingTime:1,uNoiseDensity:s.uDensity,uNoiseStrength:r?s.uStrength:Fr.sunset.props.uStrength,uFrequency:r?s.uFrequency:Fr.sunset.props.uFrequency,uAmplitude:r?s.uAmplitude:Fr.sunset.props.uAmplitude,uIntensity:.5,uLoop:0,uLoopDuration:5},a=e.environmentDesign==="cosmic"?Rh:{vertex:Ah,fragment:wh},l=hp(o,a.vertex,a.fragment),c=this.shell.material;this.shell.material=new l,this.shell.material.side=tn,this.shell.material.depthWrite=!1,this.shell.material.roughness=1-s.reflection,this.light.intensity=s.brightness*Math.PI,this.shell.rotation.set(s.rotationX*Math.PI/180,s.rotationY*Math.PI/180,s.rotationZ*Math.PI/180),c?.dispose(),this.preset=t,this.design=e.environmentDesign,this.baseTime=s.uTime||0}update(e,t,n){return t.background==="off"?!1:(n&&t.shaderSpeed>0&&(this.time+=e*t.shaderSpeed),this.shell.material.userData.uTime.value=this.baseTime+this.time,n&&t.shaderSpeed>0)}};var Ch={horizon:"Event horizon",planetary:"Planetary surface",...pp},fy=`varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;
void main(){vUv=uv;vLocal=position;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,mp=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+19.7;a*=.5;}return v;}`,py=`uniform float uTime;uniform float uKind;varying vec2 vUv;${mp}
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
}`,my=`uniform float uTime;uniform float uTerrain;varying vec2 vUv;varying vec3 vLocal;varying vec3 vNormal;${mp}
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
}`,Ql=class extends Jl{constructor(e,t,n,s,r,o,a){super(e,t,n,s),this.horizon=r.scene,this.horizon.name="Blender accretion and sculpted horizon \u2014 world space",this.horizon.position.set(0,-850,-14500),this.horizon.scale.setScalar(7600);for(let g of["HorizonTerrain","HorizonBoulders","HorizonEmbers"]){let y=this.horizon.getObjectByName(g);y.removeFromParent(),y.geometry.dispose(),Array.isArray(y.material)?y.material.forEach(v=>v.dispose()):y.material.dispose()}this.horizon.add(a.ground.scene),this.planetaryGround=a.ground.scene,this.horizon.add(a.optics.scene),this.materials=[],this.horizon.traverse(g=>{if(g.isMesh){if(g.name==="PhotonSphere"&&a.optics.spec.photon.enabled===!1){g.visible=!1;return}if(g.name==="AccretionDisk"||g.name==="LensedStream"){g.visible=!1;return}if(g.frustumCulled=!1,Array.isArray(g.material)?g.material.forEach(y=>y.dispose()):g.material.dispose(),g.name==="EventHorizon")g.material=new Xt({color:0,toneMapped:!1});else if(g.name==="HorizonEmbers")g.material=new Xt({color:new Te(4,1.45,.16),toneMapped:!1});else if(g.name==="PhotonSphere"||g.name==="LensingHaloDetail")g.material=Jf(g.name,a.optics),g.renderOrder=g.name==="PhotonSphere"?-30:-25,this.materials.push(g.material);else{let y=g.name==="HorizonTerrain"||g.name==="HorizonBoulders",v=g.name==="HorizonTerrain";g.material=new at({vertexShader:g.name==="LensedCorona"?yh:fy,fragmentShader:y?my:py,uniforms:{uTime:{value:0},uTerrain:{value:v?1:0},uKind:{value:g.name==="LensedCorona"?1:g.name==="LensedStream"?2:0}},side:kt,transparent:!y||v,blending:y?zn:cn,depthWrite:y&&!v,depthTest:!0,toneMapped:!1}),v&&(g.renderOrder=-40),this.materials.push(g.material)}}}),this.spaceLayer=new an,this.legacyCorona=[this.horizon.getObjectByName("LensedCorona"),a.optics.scene],this.continuousCorona=op(a.corona,{sharedField:!0,singlePass:!0}),this.continuousCorona.traverse(g=>{g.isMesh&&(g.frustumCulled=!1,g.renderOrder=-25,this.materials.push(g.material))}),this.horizon.add(this.continuousCorona),this.horizonFlares=up(a.corona.spec),this.horizonFlares.traverse(g=>{g.isMesh&&this.materials.push(g.material)}),this.horizon.add(this.horizonFlares),this.spaceLayer.name="Native Blender ring haze and sparse space depth",this.horizon.add(this.spaceLayer),this.nativeVolumes=[],this.diskExtent=a.corona.spec.diskRadialStretch;for(let g of a.volumes){let y=Mh(g);this.nativeVolumes.push({mesh:y,id:g.spec.id,emission:y.material.uniforms.uEmission.value}),(g.spec.id==="haze"?this.spaceLayer:this.horizon).add(y),this.materials.push(y.material)}this.outerAura=Mh(a.volumes.find(g=>g.spec.id==="disk")),this.outerAura.name="Dark transparent outer aura \u2014 full front and back annulus";let l=this.outerAura.material.uniforms;l.uOuterAura.value=1,l.uDensityScale.value*=.6,l.uEmission.value*=.65,l.uHeatBias.value=.03,Sh(this.outerAura,a.corona.spec.outerAura.radialStretch),this.horizon.add(this.outerAura),this.materials.push(this.outerAura.material);let c=a.particles,u=new bt;u.setAttribute("position",new xt(c.positions,3)),u.setAttribute("aColour",new xt(c.colours,3)),u.setAttribute("aSize",new xt(c.sizes,1)),u.setAttribute("aFamily",new xt(c.families,1));let d=new at({vertexShader:`attribute vec3 aColour;attribute float aSize;attribute float aFamily;
       uniform float uTime;varying vec3 vColour;varying float vAlpha;
       void main(){vec3 point=position;
         if(aFamily<.5){float angle=uTime*.006/max(length(point.xz),1.);
           float c=cos(angle),s=sin(angle);point.xz=mat2(c,-s,s,c)*point.xz;}
         vec4 p=modelViewMatrix*vec4(point,1.);
         gl_PointSize=clamp(22000./length(p.xyz),.65,1.65)*aSize;
         gl_Position=projectionMatrix*p;vColour=aColour;vAlpha=aFamily<.5?.48:.72;
       }`,fragmentShader:`varying vec3 vColour;varying float vAlpha;
       void main(){float r=length(gl_PointCoord-.5);float a=exp(-r*r*20.)*(1.-smoothstep(.35,.5,r));
       gl_FragColor=vec4(vColour,a*vAlpha);}`,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1,blending:cn});this.spaceParticles=new Zn(u,d),this.spaceParticles.name="Blender-authored ring dust and depth stars",this.spaceParticles.renderOrder=-35,this.spaceLayer.add(this.spaceParticles),this.materials.push(d),this.materials=[...new Set(this.materials)],e.add(this.horizon);let h=new bt;h.setAttribute("position",new xt(o.positions,3));let p=new at({vertexShader:"void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(55000./length(p.xyz),.7,1.8);gl_Position=projectionMatrix*p;}",fragmentShader:"void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*22.)*(1.-smoothstep(.40,.5,d));gl_FragColor=vec4(.73,.83,1.,a*.85);}",transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1});this.horizonStars=new Zn(h,p),this.horizonStars.renderOrder=-60,this.horizonStars.name="Blender-generated deep space stars",e.add(this.horizonStars)}configure(e){let t=e.background==="horizon"||e.background==="planetary";this.horizon.visible=t,this.horizonStars.visible=t&&e.surroundStars,this.planetaryGround.visible=e.background==="planetary";let n=e.background==="horizon";this.continuousCorona.visible=n,this.horizonFlares.visible=n,this.outerAura.visible=!1,this.legacyCorona.forEach(s=>s.visible=!n),this.horizon.rotation.set(n?.2:0,0,n?.25:0),this.horizon.scale.setScalar(n?6500:7600),this.horizon.position.y=n?250:-850;for(let{mesh:s,id:r,emission:o}of this.nativeVolumes){s.visible=!n;let a=r==="disk"||r==="stream";Sh(s,n&&a?this.diskExtent:1),s.material.uniforms.uHeatBias.value=n&&a?.15:0,s.material.uniforms.uUnifiedGlow.value=n&&a?1:0,s.material.uniforms.uEmission.value=o*(n&&a?1.25:1)}if(this.spaceLayer.visible=e.background==="horizon",this.spaceParticles.visible=e.surroundStars,t){this.shell.visible=!1,this.stars.visible=!1,this.light.intensity=Math.PI;return}super.configure(e)}prepareRender(e,t){this.fieldCacheActive=this.horizon.visible&&this.continuousCorona.visible?this.continuousCorona.userData.fieldCache.prepare(e,t):!1}update(e,t,n){return t.background!=="horizon"&&t.background!=="planetary"?super.update(e,t,n):(n&&t.shaderSpeed>0&&(this.time+=e*t.shaderSpeed),this.materials.forEach(s=>s.uniforms.uTime.value=this.time),n&&t.shaderSpeed>0)}};var En=i=>document.getElementById(i),Et=(i,e={},t)=>{let n=document.createElement(i);return Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),t!==void 0&&(n.textContent=t),n};function gp(i,e){document.body.classList.add("second-brain");let t=new URLSearchParams(location.search).get("embed")==="open-method";document.body.classList.toggle("open-method-embed",t);let n=new Set(ui.map(I=>I.id)),s=document.querySelector("aside");s.id="memory-inspector",s.hidden=!0,s.querySelector("h1").textContent="Inspector";let r=Et("button",{type:"button",id:"close-inspector"},"Close");s.prepend(r),r.onclick=()=>{s.hidden=!0,En("inspector-toggle").setAttribute("aria-expanded","false"),En("inspector-toggle").focus()};let o=Et("details",{class:"settings-details"});o.append(Et("summary",{},"Snapshot and connection"));for(let I of["memory-inventory","connection-panel","graph-counts","motion-status","collision-status"])o.append(En(I));s.append(o);let a=Et("header",{id:"universe-header"}),l=Et("h1",{},"2nd Brain");a.append(l,En("view-controls"));let c=Et("button",{type:"button",id:"inspector-toggle","aria-expanded":"false","aria-controls":"memory-inspector"},"Inspector");t&&(c.textContent="Details"),c.onclick=()=>{s.hidden=!s.hidden,c.setAttribute("aria-expanded",String(!s.hidden))},a.append(c),document.body.prepend(a);let u=Et("button",{type:"button",id:"open-method-tools-toggle","aria-label":"Show constellation controls","aria-expanded":"false","aria-controls":"universe-header source-panel"},"\u2022\u2022\u2022"),d=I=>{document.body.classList.toggle("open-method-tools-open",I),u.setAttribute("aria-expanded",String(I)),u.setAttribute("aria-label",(I?"Hide":"Show")+" constellation controls"),I||(s.hidden=!0,c.setAttribute("aria-expanded","false")),e.refresh()};u.onclick=()=>d(!document.body.classList.contains("open-method-tools-open")),document.body.append(u),document.addEventListener("keydown",I=>{t&&I.key==="Escape"&&document.body.classList.contains("open-method-tools-open")&&(d(!1),u.focus(),I.preventDefault())});let h=Et("div",{id:"source-panel","aria-label":"Sources and scene controls"});h.append(Et("h2",{},"Demonstration universe"),Et("p",{class:"source-intro"},"Invented records and connections for exploring the viewer."));let p=Et("p",{id:"source-totals","aria-live":"polite"});h.append(p);let g=Et("details",{id:"source-search"});g.append(Et("summary",{},"Find a record"),document.querySelector('section[aria-label="Find nodes"]')),h.append(g);let y=Et("fieldset",{id:"source-toggles"});y.append(Et("legend",{},"Sources"));for(let I of ui){let M=i.nodes.filter(H=>Lt(H)===I.id).length,B=Et("label",{class:"source-row"}),V=Et("input",{type:"checkbox",value:I.id,checked:"","aria-label":I.name});V.style.accentColor=I.colour,B.append(V,Et("span",{},I.name),Et("span",{class:"source-count"},M.toLocaleString("en-AU"))),V.onchange=()=>{V.checked?n.add(I.id):n.delete(I.id),e.refresh()},y.append(B)}h.append(y);let v=Et("details",{id:"source-scene"});v.append(Et("summary",{},"Scene and layout"));for(let[I,M]of[["background-preset","Background"],["layout-preset","Arrangement"]]){let B=En(I).cloneNode(!0);B.id=I+"-quick",v.append(Et("label",{for:B.id},M),B),B.onchange=()=>{En(I).value=B.value,En(I).dispatchEvent(new Event("change"))}}let m=Et("p",{class:"source-footnote"},"Links hidden. Select a node to inspect its source and connections.");h.append(v,m),document.body.append(h);let E=Et("div",{id:"source-captions"});En("graph-stage").append(E);let L=new Map(ui.map(I=>{let M=Et("button",{type:"button",class:"source-caption","aria-label":"Drag "+I.name+" group"},I.name);return M.style.setProperty("--source-colour",I.colour),M.addEventListener("pointerdown",B=>e.startGroupDrag?.(I.id,B,M)),E.append(M),[I.id,M]})),b=new Map(Zf(i.nodes).map(I=>{let M=i.nodes.find(V=>V.id===I),B=Et("span",{class:"record-caption",title:M.label},M.label);return E.append(B),[I,B]})),A=Et("div",{id:"source-empty",hidden:"",role:"status"});A.append(Et("h2",{},"No records shown"),Et("p",{},"Choose a source or reset the filters."));let T=Et("button",{type:"button"},"Show all sources");A.append(T),En("graph-stage").append(A),T.onclick=()=>{ui.forEach(I=>n.add(I.id)),y.querySelectorAll("input").forEach(I=>I.checked=!0),En("record-scope").value="all",En("record-scope").dispatchEvent(new Event("change")),e.refresh()};let P=new D,_,C,U;return{visible:I=>n.has(Lt(I)),selected(I){I&&(n.has(Lt(I))||(n.add(Lt(I)),y.querySelector('input[value="'+Lt(I)+'"]').checked=!0,e.refresh()),(!t||document.body.classList.contains("open-method-tools-open"))&&(s.hidden=!1,c.setAttribute("aria-expanded","true")))},syncSettings(I){En("background-preset-quick").value=I.background,En("layout-preset-quick").value=I.layout;let M={off:"Links hidden. Select a node to inspect its source and connections.",selected:"Only the selected node\u2019s connections are shown.",overview:"Overview links shown. Select a node to highlight its connections.",all:"All links shown. Select a node to highlight its connections."}[I.links];m.textContent!==M&&(m.textContent=M)},updateCounts(I){let M=i.nodes.filter(I),B=new Set(M.map(H=>H.id)),V=i.edges.filter(H=>B.has(H.from)&&B.has(H.to)).length;p.textContent=M.length.toLocaleString("en-AU")+(M.length===i.nodes.length?" records":" of "+i.nodes.length.toLocaleString("en-AU")+" records")+" \xB7 "+V.toLocaleString("en-AU")+" links",A.hidden=M.length>0},updateLabels(I,M,B,V,H,X,q){let ne=V==="atlas"&&H>.02;if(E.hidden=!ne,!ne)return;if(_!==M){_=M,C=new Map(ui.map(Re=>[Re.id,[]]));let Ze=new Map;M.forEach((Re,Y)=>{C.get(Lt(Re))?.push(Y),Ze.set(Re.id,Y)}),U=new Map([...b.keys()].map(Re=>[Re,Ze.get(Re)]))}let ae=En("graph-stage").clientWidth,le=En("graph-stage").clientHeight,fe=ae<=760,Ee=[],it=(Ze,Re,Y,ce=!1)=>{let se=Math.min(220,Ze.textContent.length*(fe?5.7:6.4)+16),Pe=ce?22:25,He=t&&!document.body.classList.contains("open-method-tools-open"),Fe=fe||He?12:284,mt=fe?132:96,We=le-32;if(ce){let $e=[[Re+se/2+10,Y],[Re-se/2-10,Y],[Re,Y-22],[Re,Y+22]];for(let[Xe,rt]of $e)if(!(Xe-se/2<Fe||Xe+se/2>ae-12||rt<mt||rt>We)&&!Ee.some(Mt=>Math.abs(Mt.x-Xe)<(Mt.w+se)/2+5&&Math.abs(Mt.y-rt)<(Mt.h+Pe)/2+4)){Ee.push({x:Xe,y:rt,w:se,h:Pe}),Ze.style.left=Xe+"px",Ze.style.top=rt+"px",Ze.hidden=!1;return}Ze.hidden=!0;return}Re=Math.max(Fe+se/2,Math.min(ae-12-se/2,Re)),Y=Math.max(mt,Math.min(We,Y));let st=[0,28,-28,56,-56,84,-84,112,-112,140,-140];for(let $e of st){let Xe=Y+$e;if(!(Xe<mt||Xe>We)&&!Ee.some(rt=>Math.abs(rt.x-Re)<(rt.w+se)/2+5&&Math.abs(rt.y-Xe)<(rt.h+Pe)/2+4)){Ee.push({x:Re,y:Xe,w:se,h:Pe}),Ze.style.left=Re+"px",Ze.style.top=Xe+"px",Ze.hidden=!1;return}}Ze.hidden=!0};for(let Ze of ui){let Re=L.get(Ze.id),Y=Ze.name;Re.textContent!==Y&&(Re.textContent=Y);let ce=0,se=0,Pe=0,He=0;for(let st of C.get(Ze.id)){if(!B[st]||X&&X[st]<=.15)continue;let $e=M[st];se+=$e.x,Pe+=$e.y,He+=$e.z,ce++}if(!ce){Re.hidden=!0;continue}if(Re.classList.contains("group-dragging")){Re.hidden=!1;continue}let Fe=q?.get(Ze.id);P.set(Fe?.x??se/ce,Fe?.y??Pe/ce+36+Math.cbrt(ce)*14,Fe?.z??He/ce).project(I);let mt=(P.x*.5+.5)*ae,We=(-P.y*.5+.5)*le;Re.hidden=P.z<0||P.z>1||mt<-120||mt>ae+120||We<-120||We>le+120,Re.hidden||it(Re,mt,We)}for(let[Ze,Re]of b){if(t&&!document.body.classList.contains("open-method-tools-open")){Re.hidden=!0;continue}let Y=U.get(Ze),ce=M[Y];if(!ce||!B[Y]||X&&X[Y]<=.15||fe&&!["agent","note"].includes(ce.kind)){Re.hidden=!0;continue}P.set(ce.x,ce.y,ce.z).project(I);let se=(P.x*.5+.5)*ae,Pe=(-P.y*.5+.5)*le;Re.hidden=P.z<0||P.z>1||se<0||se>ae||Pe<70||Pe>le-25,Re.hidden||it(Re,se,Pe,!0)}}}}var Ur={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Hn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},gy=new Si(-1,1,1,-1,0,1),Ph=class extends bt{constructor(){super(),this.setAttribute("position",new xt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new xt([0,2,0,0,2,0],2))}},vy=new Ph,xs=class{constructor(e){this._mesh=new pt(vy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,gy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var ec=class extends Hn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof at?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ci.clone(e.uniforms),this.material=new at({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new xs(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var qo=class extends Hn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},tc=class extends Hn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var nc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new _e);this._width=n.width,this._height=n.height,t=new Wt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:un}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ec(Ur),this.copyPass.material.blending=In,this.timer=new Us}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}qo!==void 0&&(o instanceof qo?n=!0:o instanceof tc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new _e);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ic=class extends Hn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Te}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var vp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Te(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var Or=class i extends Hn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new _e(e.x,e.y):new _e(256,256),this.clearColor=new Te(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Wt(r,o,{type:un}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let d=new Wt(r,o,{type:un});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let h=new Wt(r,o,{type:un});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),o=Math.round(o/2)}let a=vp;this.highPassUniforms=ci.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new at({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new _e(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ci.clone(Ur.uniforms),this.blendMaterial=new at({uniforms:this.copyUniforms,vertexShader:Ur.vertexShader,fragmentShader:Ur.fragmentShader,premultipliedAlpha:!0,blending:cn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Te,this._oldClearAlpha=1,this._basic=new Xt,this._fsQuad=new xs(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new _e(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new at({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new _e(.5,.5)},direction:{value:new _e(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new at({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Or.BlurDirectionX=new _e(1,0);Or.BlurDirectionY=new _e(0,1);var Yo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var sc=class extends Hn{constructor(){super(),this.isOutputPass=!0,this.uniforms=ci.clone(Yo.uniforms),this.material=new Sr({name:Yo.name,uniforms:this.uniforms,vertexShader:Yo.vertexShader,fragmentShader:Yo.fragmentShader}),this._fsQuad=new xs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===vt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===To?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ao?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ro?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Po?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Io?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Co&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var rc=class{constructor(e,{idleMs:t=3e4,fps:n=60}={}){this.idleMs=t,this.interval=1e3/n,this.lastActivity=e,this.nextFrame=e,this.idle=!1}touch(e){let t=this.idle;return this.lastActivity=e,this.idle=!1,t&&(this.nextFrame=e),t}checkIdle(e,t=!1){return t&&(this.lastActivity=e),this.idle=e-this.lastActivity>=this.idleMs,this.idle}frameDue(e){if(e+1<this.nextFrame)return!1;let t=Math.max(1,Math.floor((e-this.nextFrame)/this.interval)+1);return this.nextFrame+=t*this.interval,!0}};var te=i=>document.getElementById(i),zr={pixelRatioCap:1,activeFps:60,idleMs:3e4},bp={sources:{...Xo.celestial,name:"Source colours",line:"#92aabe",hub:"#f0cb8a"},...Xo},xp=(i,e)=>e==="sources"?mh(i):Kf(i,e),Mp={off:"Off",selected:"Selected node",overview:"Overview",all:"All"},uc=document.createElement("label");uc.className="link-control";uc.textContent="Links";var Xs=document.createElement("select");Xs.id="link-mode";Xs.setAttribute("aria-label","Connecting lines");for(let[i,e]of Object.entries(Mp)){let t=document.createElement("option");t.value=i,t.textContent=e,Xs.append(t)}uc.append(Xs);te("all-links").replaceWith(uc);for(let[i,e,t]of[["background-preset","planetary","Planetary surface"],["background-preset","horizon","Event horizon"],["layout-preset","atlas","Source sections"],["palette-preset","sources","Source colours"]]){let n=document.createElement("option");n.value=e,n.textContent=t,te(i).prepend(n)}var _p="hermes-memory-3d-layout-v1",hc="hermes-memory-3d-settings-v1",kr=i=>{try{return JSON.parse(localStorage.getItem(i)||"null")}catch{return null}},Dh=(i,e)=>{try{localStorage.setItem(i,JSON.stringify(e))}catch{}},jn=matchMedia("(prefers-reduced-motion: reduce)"),xy=kr("hermes-memory-constellation-settings-v1"),dc=kr(hc)||{},G={paused:jn.matches,pull:xy?.gravity??1,pinOnDrop:!1,autoOrbit:!1,background:"horizon",animation:"depth",formation:"sphere",speed:1,orbit:1,glow:.6,rebound:.45,pointerPhysics:!0,spacing:1,cohesion:1,repulsion:8,cursor:1.2,pointerReach:1.5,linkForce:.45,linkDistance:75,interactionVersion:3,framingVersion:2,relationMeshVersion:1,layout:"atlas",design:"starlight",palette:"sources",shaderSpeed:.05,surroundStars:!0,environmentDesign:"cosmic",links:"overview",...dc};dc.interactionVersion!==3&&(G.pointerPhysics=!0,G.pinOnDrop=!1,G.interactionVersion=3);dc.relationMeshVersion!==1&&(G.links="overview",G.relationMeshVersion=1);var Sp=dc.framingVersion!==2;Sp&&(G.framingVersion=2);G.pull=Math.max(0,Math.min(2,Number(G.pull)||0));G.spacing=Math.max(.5,Math.min(2,Number(G.spacing)||1));for(let[i,e,t,n]of[["cohesion",0,2,1],["repulsion",0,16,8],["cursor",0,2,1.2],["pointerReach",.5,2.5,1.5],["linkForce",0,1,.45],["linkDistance",20,160,75]])G[i]=Math.max(e,Math.min(t,Number.isFinite(Number(G[i]))?Number(G[i]):n));for(let[i,e,t]of[["speed",.2,2],["orbit",0,2],["glow",0,2],["rebound",0,1],["shaderSpeed",0,1]])G[i]=Math.max(e,Math.min(t,Number.isFinite(Number(G[i]))?Number(G[i]):1));["depth","float","breathe"].includes(G.animation)||(G.animation="depth");["sphere","fluid","dna"].includes(G.formation)||(G.formation="sphere");Ch[G.background]||(G.background="universe");$l[G.layout]||(G.layout="saved");bp[G.palette]||(G.palette="celestial");_h[G.design]||(G.design="starlight");["cosmic","gradient"].includes(G.environmentDesign)||(G.environmentDesign="cosmic");Object.hasOwn(Mp,G.links)||(G.links="off");var fc=i=>i==="saved"?_p:_p+"-"+i+(i==="atlas"?"-sections-v15":""),Br=kr(fc(G.layout)),De,_t,qe,Ie,ct,Dt=-1,hi,oc,Ri,Ep,Ji=!1,Gs,yp,Vs,Ft=!0,ac=0,lc=performance.now(),Ws,Vn,Ih,Lh;window.addEventListener("message",i=>{i.source!==window.parent||i.data?.type!=="open-method-surface"||(Ih=i.data,Lh?.(i.data))});function Yt(){Xs.value=G.links,te("motion-toggle").textContent=G.paused?"Resume motion":"Pause motion",te("motion-toggle").setAttribute("aria-pressed",String(!G.paused)),te("star-pull").value=String(G.pull),te("star-pull-value").textContent=G.pull.toFixed(1),te("pin-on-drop").checked=G.pinOnDrop,te("auto-orbit").checked=G.autoOrbit,te("background-preset").value=G.background,te("animation-mode").value=G.animation,te("formation-mode").value=G.formation;for(let e of["speed","orbit","glow","rebound","shaderSpeed"])te(e).value=String(G[e]),te(e+"-value").textContent=e==="shaderSpeed"?String(G[e]):G[e].toFixed(1);te("layout-preset").value=G.layout,te("layout-description").textContent=Yf[G.layout],te("design-preset").value=G.design,te("palette-preset").value=G.palette,te("surround-stars").checked=G.surroundStars,te("environment-design").value=G.environmentDesign,Ep?.(),Ri?.configure(G);let i=te("astral-background");Object.assign(i.dataset,{preset:G.background,enabled:String(G.background!=="off"),renderer:"shadergradient-3d",speed:String(G.shaderSpeed),paused:String(G.paused)}),te("background-status").textContent=G.background==="off"?"Environment off.":Ch[G.background]+" \xB7 3D surround \xB7 "+(G.paused||G.shaderSpeed===0?"still":String(G.shaderSpeed)+"\xD7 speed"),qe&&(qe.autoRotate=G.autoOrbit&&!G.paused&&!jn.matches),De?.configure({running:!G.paused,visible:!document.hidden&&!Ws?.idle,pull:G.pull,drift:!jn.matches,animation:G.animation,speed:G.speed,orbit:G.orbit,rebound:G.rebound,spacing:G.spacing,formation:G.formation,cohesion:G.cohesion,repulsion:G.repulsion,cursor:G.cursor,pointerReach:G.pointerReach,linkForce:G.linkForce,linkDistance:G.linkDistance}),Dh(hc,G),Ft=!0,Gs?.syncSettings(G)}Yt();function hn(){!De||!ct||Ji||De.entrance.active||Dh(fc(G.layout),{nodes:Ie.map(i=>({id:i.id,x:i.x,y:i.y,z:i.z,pinned:i.pinned})),camera:{position:ct.position.toArray(),target:qe.target.toArray()}})}function _y(){if(!De||Ji)return;hn();let i=[hc,...Object.keys($l).map(fc),"hermes-memory-constellation-settings-v1","hermes-memory-constellation-layout-v1","hermes-memory-constellation-position-bookmark-v1"],e={format:"pralia-constellation-snapshot",version:1,capturedAt:new Date().toISOString(),nodes:Ie.length,storage:Object.fromEntries(i.map(s=>[s,kr(s)]).filter(([,s])=>s!==null)),playback:{environmentTime:Ri.time,linkMode:G.links,allLinks:G.links==="all"}},t=URL.createObjectURL(new Blob([JSON.stringify(e)],{type:"application/json"})),n=document.createElement("a");n.href=t,n.download="pralia-constellation-snapshot.json",n.click(),setTimeout(()=>URL.revokeObjectURL(t),3e4)}te("export-view").addEventListener("click",_y);function cc(i){console.error(i),te("loading").hidden=!1,te("loading").replaceChildren(document.createTextNode("The local 3D preview could not load. "));let e=document.createElement("button");e.textContent="Retry",e.onclick=()=>location.reload(),te("loading").append(e,document.createTextNode(" If the local server has stopped, run start-preview.ps1 in the preview folder.")),te("graph-stage").dataset.ready="error"}async function yy(){let i=await fetch("./graph-3d-data.json");if(!i.ok)throw new Error("Graph data unavailable: "+i.status);let e=await i.json(),t=()=>{Ft=!0,pe(),J(!1),Ne(),Gs?.updateCounts(s)},n=Fh(e,{selectNode:f=>{let S=De?.index.get(f);S!==void 0&&(O(S),ye(S))},refresh:t});Gs=gp(e,{refresh:t,startGroupDrag:(f,S,w)=>yp?.(f,S,w)});let s=f=>n.visible(f)&&Gs.visible(f),r=Zl(e,kr("hermes-memory-constellation-layout-v1"));Ie=gh(e,r,G.layout,Br),De=new Wo(Ie,xh(e,G.layout),()=>{Ft=!0,Dt>=0&&Be()},cc);let o=await Promise.all([new Nn().loadAsync("./assets/star-core.glb"),new Ds().loadAsync("./assets/star-glow.png"),De.ready,new Nn().loadAsync("./assets/crystal-core.glb"),new Nn().loadAsync("./assets/orbital-ring.glb"),new Nn().loadAsync("./assets/universe-shell.glb"),fetch("./assets/universe-stars.json").then(f=>{if(!f.ok)throw new Error("Starfield unavailable");return f.json()}),new Nn().loadAsync("./assets/event-horizon.glb"),fetch("./assets/horizon-stars.json").then(f=>{if(!f.ok)throw new Error("Horizon stars unavailable");return f.json()}),np()]),a=f=>{let S;if(f.scene.traverse(w=>{w.isMesh&&!S&&(S=w)}),!S)throw new Error("Blender mesh missing");return S},l;if(o[0].scene.traverse(f=>{f.isMesh&&!l&&(l=f)}),!l)throw new Error("Blender star mesh is missing.");let c=o[1];c.colorSpace=Vt;let u=De.index,d=G.layout==="atlas"?vh(Ie,e):new Set(e.overview),h=Ie.map(()=>[]),p=e.edges.map((f,S)=>{let w=u.get(f.from),N=u.get(f.to);return h[w].push(S),h[N].push(S),{a:w,b:N}}),g=new Ps;ct=new Qt(48,1,.1,1e5),_t=new Hl({antialias:!1,alpha:!0,powerPreference:"high-performance"}),_t.setPixelRatio(Math.min(devicePixelRatio,zr.pixelRatioCap)),_t.setClearColor(0,0),te("graph-3d").append(_t.domElement),Ri=new Ql(g,a(o[5]).geometry,o[6].positions,c,o[7],o[8],o[9]);let y=new nc(_t);y.addPass(new ic(g,ct));let v=new Or(new _e(1,1),.58,.35,1.3);y.addPass(v),y.addPass(new sc),_t.domElement.addEventListener("webglcontextlost",f=>{f.preventDefault(),cancelAnimationFrame(Vs),cc(new Error("3D graphics context lost"))}),hi=new zi(l.geometry,new Xt({toneMapped:!1}),Ie.length),hi.instanceMatrix.setUsage(Ei),hi.frustumCulled=!1,hi.boundingSphere=new pn(new D,1e5);let m=new Te(16777215);Ie.forEach((f,S)=>hi.setColorAt(S,new Te(f.colour).lerp(m,f.tier==="yellow"?.18:.55))),g.add(hi),oc=new Xt({map:c,transparent:!0,blending:zn,depthWrite:!1,depthTest:!0,toneMapped:!1,opacity:G.glow});let E=new zi(new Vi(1,1),oc,Ie.length);E.instanceMatrix.setUsage(Ei),E.frustumCulled=!1,Ie.forEach((f,S)=>E.setColorAt(S,new Te(f.colour))),g.add(E);let L=Ie.map((f,S)=>f.tier==="blue"?-1:S).filter(f=>f>=0),b=new zi(a(o[4]).geometry,new Xt({color:16777215,transparent:!0,opacity:.65,depthWrite:!1}),L.length);b.instanceMatrix.setUsage(Ei),b.frustumCulled=!1,g.add(b);let A=L.map((f,S)=>new Ot().setFromEuler(new Rn(S*.7,S*.31,S*.23))),T=new ke,P=new D,_=new D,C=new Ot,U=Ie.map(f=>({...f})),I=new Array(Ie.length),M=new Map,B=new Map,V=new Map,H=new Map,X=new Float32Array(Ie.length),q=new Float32Array(Ie.length),ne=new Map;Ie.forEach((f,S)=>{let w=Lt(f);B.has(w)||B.set(w,[]),B.get(w).push(S)});for(let[f,S]of B){let w=De.groupParents?.get(f);if(!w)continue;V.set(f,[...S].sort((re,j)=>(Ie[j].degree||0)-(Ie[re].degree||0)||Ie[re].id.localeCompare(Ie[j].id))[0]);let N=S.map(re=>Math.hypot(Ie[re].x-w.x,Ie[re].y-w.y,Ie[re].z-w.z)).sort((re,j)=>re-j),F=Math.max(12,N[Math.floor((N.length-1)*.78)]||30),$=Ht(f+"|parent-sphere")*Math.PI*2;H.set(f,F),S.forEach((re,j)=>{let ue=1-2*(j+.5)/S.length,me=Math.sqrt(Math.max(0,1-ue*ue)),xe=j*2.39996323+$,ie=.28+.72*Math.cbrt(Ht(Ie[re].id+"|parent-shell")),Q=F*ie;I[re]={x:Math.cos(xe)*me*Q,y:ue*Q,z:Math.sin(xe)*me*Q};let Ce=Ht(Ie[re].id+"|idle-breath")*Math.PI*2;X[re]=Math.sin(Ce),q[re]=Math.cos(Ce)}),M.set(f,1),ne.set(f,{phase:Ht(f+"|3d-tumble")*Math.PI*2,direction:Ht(f+"|orbit-direction")>.5?1:-1,rate:.055+Ht(f+"|orbit-rate")*.035})}let ae=0,le=new Float32Array(p.length*6),fe=new bt;fe.setAttribute("position",new Rt(le,3).setUsage(Ei));let Ee=new xi({color:10206168,transparent:!0,opacity:.11,depthWrite:!1}),it=new Bi(fe,Ee);it.frustumCulled=!1,g.add(it);let Ze=new bt,Re=new Float32Array(p.length*6);Ze.setAttribute("position",new Rt(Re,3).setUsage(Ei));let Y=new Bi(Ze,new xi({color:16770724,transparent:!0,opacity:.65,depthWrite:!1}));Y.frustumCulled=!1,g.add(Y);let ce=new Float32Array(Ie.length*6),se=new Float32Array(Ie.length*6),Pe=new bt;Pe.setAttribute("position",new Rt(ce,3).setUsage(Ei)),Pe.setAttribute("color",new Rt(se,3).setUsage(Ei));let He=new xi({color:16777215,vertexColors:!0,transparent:!0,opacity:.085,depthWrite:!1,blending:cn}),Fe=new Bi(Pe,He);Fe.frustumCulled=!1,g.add(Fe);let mt=128,We=new Float32Array(mt*3),st=new bt;st.setAttribute("position",new Rt(We,3).setUsage(Ei));let $e=new Zn(st,new _i({color:16770989,size:2.2,sizeAttenuation:!0,transparent:!0,opacity:.92,depthWrite:!1,blending:cn}));$e.frustumCulled=!1,g.add($e);let Xe=[...d],rt=new pt(new Gi(1,16,10),new Xt({color:16777215,wireframe:!0}));rt.visible=!1,g.add(rt),Ep=()=>{let f=bp[G.palette],S=_h[G.design];hi.geometry=S.core==="crystal"?a(o[3]).geometry:l.geometry,Ie.forEach((w,N)=>{let F=new Te(xp(w,G.palette));hi.setColorAt(N,F.clone().lerp(m,G.palette==="sources"?.05:S.core==="crystal"?.12:w.tier==="yellow"?.18:.55)),E.setColorAt(N,F)}),L.forEach((w,N)=>b.setColorAt(N,new Te(xp(Ie[w],G.palette)))),hi.instanceColor.needsUpdate=!0,E.instanceColor.needsUpdate=!0,b.instanceColor.needsUpdate=!0,oc.opacity=G.glow*S.glow,b.visible=S.rings,Ee.color.set(f.line),Ee.opacity=G.layout==="atlas"?.085:S.links,Y.material.color.set(f.hub),rt.material.color.set(f.hub)},qe=new Xl(ct,_t.domElement),qe.enableDamping=!0,qe.dampingFactor=.09,qe.autoRotateSpeed=.28,qe.minDistance=12,qe.maxDistance=15e3;let Mt,gt=null,Bt=!0;function Nt(){if(!Mt||gt)return;let S=qe.target.clone().clamp(Mt.min,Mt.max).sub(qe.target);S.lengthSq()>0&&(qe.target.add(S),ct.position.add(S))}qe.addEventListener("change",()=>{Nt(),Ft=!0});let Ut,z=0,Zt=!1,ft=!1,R=null,x=!1,k=()=>{clearTimeout(Ut),Ut=setTimeout(hn,300)};qe.addEventListener("end",k),_t.domElement.addEventListener("pointerdown",f=>{f.button===0&&(gt=null,Zt=!0,R=f.pointerId)},!0);let W=f=>{if(!Zt||f.pointerId!==R&&f.type!=="blur")return;let S=ft;Zt=!1,ft=!1,R=null,S&&(qe.enabled=!(en||_n),_t.domElement.style.cursor="grab",x=!0,setTimeout(()=>{x=!1},0)),te("graph-stage").dataset.fieldScale=G.spacing.toFixed(3),k(),Vn?.()};window.addEventListener("pointerup",W),window.addEventListener("pointercancel",W),window.addEventListener("blur",W);let Z=f=>{(f.type==="auxclick"&&f.button===1||x)&&(f.preventDefault(),f.stopImmediatePropagation())};_t.domElement.addEventListener("click",Z,!0),_t.domElement.addEventListener("auxclick",Z,!0),_t.domElement.addEventListener("wheel",f=>{if(!qe.enabled&&!Zt)return;gt=null,f.preventDefault(),f.stopImmediatePropagation();let S=f.deltaMode===1?16:f.deltaMode===2?_t.domElement.clientHeight:1,w=Math.max(-300,Math.min(300,f.deltaY*S));if(Zt||f.buttons&1){ft=!0,z=0,qe.enabled=!1,_t.domElement.style.cursor="ns-resize",_n&&!$n&&(_n=null,qs=null),G.spacing=Math.max(.5,Math.min(2,G.spacing*Math.exp(-w*.0015)));let N=te("node-spacing");N&&(N.value=String(G.spacing)),De.configure({spacing:G.spacing}),Dh(hc,G),te("graph-stage").dataset.fieldScale=G.spacing.toFixed(3),Ft=!0}else z=Math.max(-2,Math.min(2,z+w*.001));Vn?.()},{capture:!0,passive:!1});let he=0;function ge(){Vn?.();let f=te("graph-3d"),S=f.clientWidth,w=f.clientHeight;_t.setSize(S,w),y.setSize(S,w),ct.aspect=S/w,ct.clearViewOffset(),he>0&&ct.setViewOffset(S,w,-he/2,0,S,w),ct.updateProjectionMatrix(),Ft=!0}new ResizeObserver(ge).observe(te("graph-3d")),ge();function K(f,S=G.layout==="atlas"?.82:.72){let w=new Sn;if(f.forEach(me=>w.expandByPoint(new D(me.x,me.y,me.z))),w.isEmpty())return;let N=w.getCenter(new D),F=w.getSize(new D),$=F.clone().multiplyScalar(.18).max(new D(45,45,45)),re=(te("graph-3d").clientWidth-he)/te("graph-3d").clientHeight,j=Math.max(80,F.x/Math.max(re,.4),F.y,F.z)*S/Math.tan(ji.degToRad(ct.fov/2)),ue=G.layout==="atlas"?new D(0,-.08,1):G.layout==="galaxy"?new D(.15,1,.4):new D(.25,.18,1);return{box:w,envelope:{min:N.clone().sub($),max:N.clone().add($)},center:N,distance:j,position:N.clone().add(ue.normalize().multiplyScalar(j))}}function ee(f){f&&(Mt=f.envelope,qe.target.copy(f.center),ct.position.copy(f.position),qe.maxDistance=Math.min(15e3,f.distance*3.2),qe.update(),Ft=!0)}function be(f){if(f){if(Mt=f.envelope,qe.maxDistance=Math.min(15e3,f.distance*3.2),z=0,jn.matches){ee(f),hn();return}gt={started:performance.now(),duration:720,fromPosition:ct.position.clone(),fromTarget:qe.target.clone(),toPosition:f.position,toTarget:f.center},Vn?.(),Ft=!0}}function Ne(){ee(K(Ie.filter(s)))}Ne(),!Sp&&Br?.camera&&[Br.camera.position,Br.camera.target].every(f=>Array.isArray(f)&&f.length===3&&f.every(Number.isFinite))&&(ct.position.fromArray(Br.camera.position),qe.target.fromArray(Br.camera.target),qe.update());async function ye(f){let S=De;if(De.entrance.active&&!await De.skip()||S!==De||Dt!==f)return;let w=Ie[f],N=new D(w.x,w.y,w.z),F=ct.position.clone().sub(qe.target).normalize(),$=Math.max(w.radius*14,90);ct.position.copy(N).addScaledVector(F,$),qe.target.copy(N),qe.update(),Ft=!0,hn()}function Me(f){if(f==="sessions"&&(f="conversations"),!(f==="overview"||ui.some(F=>F.id===f)))return;let w=f==="overview"?Ie.filter(s):Ie.filter(F=>s(F)&&Lt(F)===f),N=f==="overview"?G.layout==="atlas"?.82:.72:.92;be(K(w,N)),te("graph-stage").dataset.openMethodFocus=f}function Oe(f,S){let w=document.createElement("button");return w.type="button",w.textContent=f.label,w.addEventListener("click",S),w}function Be(){let f=Ie[Dt];if(!f)return;let S=De?.releasePending?"Settling at drop position\u2026":f.pinned?"Pinned in 3D":"Free to move and collide";te("node-state").textContent!==S&&(te("node-state").textContent=S);let w=f.pinned?"Release node":"Pin node";te("pin-node").textContent!==w&&(te("pin-node").textContent=w),te("node-info").dataset.pinned!==String(f.pinned)&&(te("node-info").dataset.pinned=String(f.pinned))}De.onRelease=()=>{Be(),hn()},De.onGroupRelease=()=>{};async function je(f){if(Ji||f===G.layout)return;hn();let S=G.layout,w=De,N=kr(fc(f)),F=gh(e,r,f,N);Ji=!0,te("layout-preset").disabled=!0,te("replay-entrance").disabled=!0,qe.enabled=!1,te("layout-description").textContent="Arranging "+$l[f]+"\u2026",w.configure({running:!1});let $;try{$=new Wo(F,xh(e,f),()=>{},()=>{}),await $.ready,w.dispose(),F.forEach((re,j)=>Object.assign(Ie[j],re)),d=f==="atlas"?vh(Ie,e):new Set(e.overview),Xe=[...d],$.nodes=Ie,$.onRelease=()=>{Be(),hn()},$.onGroupRelease=()=>hn(),$.onError=cc,$.onUpdate=()=>{Ft=!0,Dt>=0&&Be()},De=$,G.layout=f,Dt=-1,te("node-info").hidden=!0,Ji=!1,Yt(),Ne(),N?.camera&&[N.camera.position,N.camera.target].every(re=>Array.isArray(re)&&re.length===3&&re.every(Number.isFinite))&&(ct.position.fromArray(N.camera.position),qe.target.fromArray(N.camera.target),qe.update()),hn(),J(!1),te("graph-stage").dataset.layout=f}catch(re){$?.dispose(),G.layout=S,Ji=!1,De=w,Yt(),te("layout-description").textContent="This layout could not load. Your previous arrangement is still here.",console.error(re)}te("layout-preset").disabled=!1,te("replay-entrance").disabled=!1,qe.enabled=!0,Ft=!0}function O(f,S=!0){if(Dt=f,Ft=!0,f<0){te("node-info").hidden=!0;return}let w=Ie[f];te("node-info").hidden=!1,te("node-name").textContent=w.label,S&&Gs.selected(w),n.describe(w),Be(),te("node-info").dataset.nodeId=w.id,te("node-info").dataset.pinned=String(w.pinned);let N=u.get(e.routes[w.id]?.root),F=u.get(e.routes[w.id]?.anchor),$=w.tier==="yellow"?"Primary hub":w.tier==="white"?"Local hub":"Community node";te("node-kind").textContent=n.kindName(w.kind)+" \xB7 "+w.scope;let re=document.createElement("span");re.textContent=N===void 0?"Independent group":"Group: ",te("node-group").replaceChildren(re),N!==void 0&&te("node-group").append(Oe(Ie[N],()=>{O(N),ye(N)})),te("node-anchor").textContent=F===void 0?"":"Follows: "+Ie[F].label;let j=[...new Set(h[f].map(ue=>p[ue].a===f?p[ue].b:p[ue].a))];te("neighbours-title").textContent=`${j.length} connected node${j.length===1?"":"s"}`,te("neighbours").replaceChildren(...j.map(ue=>{let me=Oe(Ie[ue],()=>{O(ue),ye(ue)});return me.textContent=n.connectionLabel(w.id,Ie[ue].id)+" \xB7 "+Ie[ue].label,me}))}function pe(){let f=te("search").value.trim().toLowerCase(),S=f?Ie.filter(w=>s(w)&&(w.label+" "+(w.title||"")).toLowerCase().includes(f)):Ie.filter(w=>s(w)&&(n.scope()!=="all"||w.kind==="agent"||w.kind==="builtin"||w.kind==="fact")).sort((w,N)=>N.degree-w.degree);te("results-caption").textContent=f?`${S.length} ${S.length===1?"match":"matches"}${S.length>60?" \xB7 first 60 shown":""}`:"Start exploring",te("search-results").replaceChildren(...S.slice(0,60).map(w=>Oe(w,()=>{O(u.get(w.id)),ye(u.get(w.id))})))}pe(),te("search").addEventListener("input",pe),Gs.updateCounts(s),te("focus-node").addEventListener("click",()=>{Dt>=0&&ye(Dt)}),te("pin-node").addEventListener("click",()=>{Dt>=0&&(De.pin(Dt,!Ie[Dt].pinned),O(Dt),hn())}),te("fit-view").textContent="Re-centre",te("fit-view").title="Centre and fit the complete constellation",te("fit-view").addEventListener("click",()=>{z=0,Ne(),hn()}),Xs.addEventListener("change",()=>{G.links=Xs.value,Yt()}),te("motion-toggle").addEventListener("click",()=>{G.paused=!G.paused,Yt()});function J(f=!0){!De||!Ri||Ji||(f&&!jn.matches&&(G.paused=!1),Ri.time=0,De.replay({visible:Ie.map(s),reduced:jn.matches||G.paused}),Yt(),Ft=!0)}te("replay-entrance").addEventListener("click",()=>J()),te("skip-entrance").addEventListener("click",async()=>{await De.skip()&&te("replay-entrance").focus()}),te("background-preset").addEventListener("change",f=>{G.background=f.target.value,Yt()}),te("layout-preset").addEventListener("change",f=>{je(f.target.value)}),te("design-preset").addEventListener("change",f=>{G.design=f.target.value,Yt()}),te("palette-preset").addEventListener("change",f=>{G.palette=f.target.value,Yt()}),te("surround-stars").addEventListener("change",f=>{G.surroundStars=f.target.checked,Yt()}),te("environment-design").addEventListener("change",f=>{G.environmentDesign=f.target.value,Yt()}),te("star-pull").addEventListener("input",f=>{G.pull=Number(f.target.value),Yt()}),te("animation-mode").addEventListener("change",f=>{G.animation=f.target.value,J(!1)}),te("formation-mode").addEventListener("change",f=>{G.formation=f.target.value,Yt(),Vn?.()});for(let f of["speed","orbit","glow","rebound","shaderSpeed"])te(f).addEventListener("input",S=>{G[f]=Number(S.target.value),Yt()});te("pin-on-drop").addEventListener("change",f=>{G.pinOnDrop=f.target.checked,Yt()}),te("auto-orbit").addEventListener("change",f=>{G.autoOrbit=f.target.checked,Yt()});let ve=document.createElement("label"),Se=document.createElement("input");ve.className="check",Se.type="checkbox",Se.checked=G.pointerPhysics,Se.id="pointer-physics",ve.append(Se," Cursor pushes nearby stars"),te("auto-orbit").closest("label").after(ve),Se.addEventListener("change",()=>{G.pointerPhysics=Se.checked,G.pointerPhysics||De.worker.postMessage({type:"pointer",pointer:null}),Yt()});let oe=document.createElement("label"),Ae=document.createElement("input");Ae.type="range",Ae.min=".5",Ae.max="2",Ae.step=".05",Ae.value=String(G.spacing),Ae.id="node-spacing",Ae.setAttribute("aria-label","Node spacing"),oe.append("Node spacing ",Ae),ve.after(oe),Ae.addEventListener("input",()=>{G.spacing=Number(Ae.value),Yt()});let Le=oe;for(let[f,S,w,N,F]of[["cohesion","Group cohesion",0,2,.1],["repulsion","Node repulsion",0,16,1],["cursor","Cursor push strength",0,2,.1],["pointerReach","Cursor push radius",.5,2.5,.1],["linkForce","Link strength",0,1,.05],["linkDistance","Link distance",20,160,5]]){let $=document.createElement("label"),re=document.createElement("span"),j=document.createElement("input");$.className="dynamic-physics-control",re.textContent=String(G[f]),j.type="range",j.min=String(w),j.max=String(N),j.step=String(F),j.value=String(G[f]),j.id="physics-"+f,j.setAttribute("aria-label",S),$.append(S+" ",re,j),Le.after($),Le=$,j.addEventListener("input",()=>{G[f]=Number(j.value),re.textContent=j.value,Yt()})}te("graph-3d").removeAttribute("title"),jn.addEventListener("change",()=>{jn.matches&&(G.paused=!0,De.skip(),Yt())}),Yt();let ot=new Mo,Tt=new _e,Kt=new wn,jt=new D,Zo=new D,$n=!1,qs=null,_n=null,en=null,Hr=0;function Qi(f){let S=_t.domElement.getBoundingClientRect();Tt.set((f.clientX-S.left)/S.width*2-1,-(f.clientY-S.top)/S.height*2+1),ot.setFromCamera(Tt,ct)}function di(f){Qi(f);let S=_t.domElement.getBoundingClientRect(),w=2*Math.tan(ji.degToRad(ct.fov/2))/S.height,N=-1,F=1/0;return U.forEach(($,re)=>{if(!s($)||De.scales[re]<.15)return;P.set($.x,$.y,$.z);let j=ot.ray.origin,ue=ot.ray.direction,me=($.x-j.x)*ue.x+($.y-j.y)*ue.y+($.z-j.z)*ue.z,xe=Math.max($.radius*De.scales[re],me*w*7),ie=ot.ray.distanceSqToPoint(P),Q=me-Math.sqrt(Math.max(0,xe*xe-ie));me>0&&Q<F&&ie<xe*xe&&(N=re,F=Q)}),N}yp=(f,S,w)=>{if(S.button!==0||!De||!ct||Ji||en||_n)return;let N=Ie.map((ie,Q)=>Lt(ie)===f&&s(ie)?Q:-1).filter(ie=>ie>=0),F=N.filter(ie=>De.scales[ie]>.15);if(!F.length)return;let $=De.groupParents?.get(f),re=$?new D($.x,$.y,$.z):F.reduce((ie,Q)=>ie.add(new D(Ie[Q].x,Ie[Q].y,Ie[Q].z)),new D).multiplyScalar(1/F.length);Qi(S);let j=ct.getWorldDirection(new D);if(Kt.setFromNormalAndCoplanarPoint(j,re),!ot.ray.intersectPlane(Kt,jt))return;let ue=new D(1,0,0).applyQuaternion(ct.quaternion),me=[];for(let[ie,Q]of De.groupParents||[]){if(ie===f)continue;let Ce=new D(Q.x,Q.y,Q.z),ze=Ce.clone().project(ct),Ke=new D;if(ot.setFromCamera(new _e(ze.x,ze.y),ct),!ot.ray.intersectPlane(Kt,Ke))continue;let Ve=Ce.clone().addScaledVector(ue,(H.get(ie)||20)*G.spacing).project(ct),tt=new D;ot.setFromCamera(new _e(Ve.x,Ve.y),ct),ot.ray.intersectPlane(Kt,tt)&&me.push({id:ie,x:Ke.x,y:Ke.y,z:Ke.z,radius:Math.max(8,Ke.distanceTo(tt))})}if(Qi(S),!ot.ray.intersectPlane(Kt,jt))return;let xe=w.getBoundingClientRect();en={pointerId:S.pointerId,groupId:f,element:w,offset:re.clone().sub(jt),screenOffset:{x:xe.left+xe.width/2-S.clientX,y:xe.top+xe.height/2-S.clientY}},M.set(f,1),w.classList.remove("group-settling"),w.setPointerCapture(S.pointerId),w.classList.add("group-dragging"),qe.enabled=!1,De.startGroupDrag(N,re,f,me),Vn?.(),S.preventDefault(),S.stopPropagation()},window.addEventListener("pointermove",f=>{if(!en||f.pointerId!==en.pointerId)return;Qi(f),ot.ray.intersectPlane(Kt,jt)&&De.moveGroupDrag(jt.add(en.offset));let S=te("graph-stage").getBoundingClientRect();en.element.style.left=f.clientX-S.left+en.screenOffset.x+"px",en.element.style.top=f.clientY-S.top+en.screenOffset.y+"px",Ft=!0,f.preventDefault()});let Ys=f=>{if(!en||f.pointerId!==en.pointerId)return;let{element:S}=en;De.endGroupDrag(),en=null,qe.enabled=!0,S.classList.remove("group-dragging"),S.classList.add("group-settling"),setTimeout(()=>S.classList.remove("group-settling"),240),S.hasPointerCapture(f.pointerId)&&S.releasePointerCapture(f.pointerId),Ft=!0,f.preventDefault()};window.addEventListener("pointerup",Ys),window.addEventListener("pointercancel",Ys),_t.domElement.addEventListener("pointerdown",f=>{if(f.button!==0)return;let S=di(f);if(S<0)return;O(S,!1),_n={index:S,x:f.clientX,y:f.clientY},qs=f.pointerId,qe.enabled=!1,_t.domElement.setPointerCapture(f.pointerId);let w=Ie[S],N=ct.getWorldDirection(new D);Kt.setFromNormalAndCoplanarPoint(N,new D(w.x,w.y,w.z)),ot.ray.intersectPlane(Kt,jt),Zo.set(w.x,w.y,w.z).sub(jt),te("hover-label").hidden=!0,f.stopImmediatePropagation(),f.preventDefault()},!0),_t.domElement.addEventListener("pointermove",f=>{if(_n){!$n&&Math.hypot(f.clientX-_n.x,f.clientY-_n.y)>=2&&(De.startDrag(_n.index),$n=!0,_t.domElement.style.cursor="grabbing"),$n&&(Qi(f),ot.ray.intersectPlane(Kt,jt)&&De.moveDrag(jt.add(Zo)),Ft=!0);return}if(f.buttons)return;let S=performance.now();if(S-Hr<50)return;Hr=S;let w=di(f),N=te("hover-label");if(N.hidden=w<0,G.pointerPhysics&&!G.paused&&!jn.matches){let{origin:F,direction:$}=ot.ray,j=2*Math.max(1,ot.ray.origin.distanceTo(qe.target))*Math.tan(ji.degToRad(ct.fov/2))/_t.domElement.clientHeight;De.worker.postMessage({type:"pointer",pointer:{origin:{x:F.x,y:F.y,z:F.z},direction:{x:$.x,y:$.y,z:$.z},radius:Math.max(18,Math.min(180,j*55))}})}if(_t.domElement.style.cursor=w<0?"grab":"pointer",w>=0){let F=te("graph-stage").getBoundingClientRect();N.textContent=Ie[w].label+" \xB7 "+n.kindName(Ie[w].kind),N.style.left=Math.min(f.clientX-F.left+12,F.width-280)+"px",N.style.top=Math.max(68,f.clientY-F.top-35)+"px"}});function Vr(f){if(!_n||f.pointerId!==qs)return;let S=$n;$n&&De.endDrag(f.shiftKey?!1:G.pinOnDrop),$n=!1,_n=null,qe.enabled=!0,_t.domElement.style.cursor="grab",_t.domElement.hasPointerCapture(f.pointerId)&&_t.domElement.releasePointerCapture(f.pointerId),O(Dt,!S),De.releasePending||hn(),Ft=!0}_t.domElement.addEventListener("pointerup",Vr),_t.domElement.addEventListener("pointercancel",Vr),te("graph-3d").addEventListener("keydown",f=>{if(f.key.toLowerCase()==="r"){z=0,Ne(),hn(),f.preventDefault();return}if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-"].includes(f.key))return;let S=ct.position.clone().sub(qe.target),w=new hs().setFromVector3(S);f.key==="ArrowLeft"&&(w.theta-=.1),f.key==="ArrowRight"&&(w.theta+=.1),f.key==="ArrowUp"&&(w.phi-=.1),f.key==="ArrowDown"&&(w.phi+=.1),(f.key==="+"||f.key==="=")&&(w.radius*=.85),f.key==="-"&&(w.radius*=1.15),w.makeSafe(),ct.position.copy(qe.target).add(new D().setFromSpherical(w)),qe.update(),Ft=!0,f.preventDefault(),hn()});let Tn=new Uint8Array(Ie.length),_s=(f,S,w,N,F)=>{let $=S*6;f[$]=w.x,f[$+1]=w.y,f[$+2]=w.z,f[$+3]=w.x+(N.x-w.x)*F,f[$+4]=w.y+(N.y-w.y)*F,f[$+5]=w.z+(N.z-w.z)*F};function Gr(){for(let[ie,Q]of M)Q<.999&&M.set(ie,Math.min(1,Q+.006));let f=ae*.72,S=Math.sin(f),w=Math.cos(f),N=new Map;for(let[ie,Q]of ne){let Ce=ae*Q.rate*Q.direction+Q.phase,ze=.42*Math.sin(ae*.24+Q.phase);N.set(ie,{cy:Math.cos(Ce),sy:Math.sin(Ce),cx:Math.cos(ze),sx:Math.sin(ze)})}Ie.forEach((ie,Q)=>{let Ce=Lt(ie),ze=U[Q],Ke=De.groupParents?.get(Ce),Ve=I[Q],tt=en?.groupId===Ce;if(ze.x=ie.x,ze.y=ie.y,ze.z=ie.z,G.layout==="atlas"&&G.formation==="sphere"&&Ke&&Ve){let de=N.get(Ce),$t=Ve.x*G.spacing,ut=Ve.y*G.spacing,yn=Ve.z*G.spacing,Gn=$t*de.cy-yn*de.sy,Jn=$t*de.sy+yn*de.cy,ts=ut*de.cx-Jn*de.sx,wt=ut*de.sx+Jn*de.cx,It=1+.022*(S*q[Q]+w*X[Q]),Wn=ie.x-(Ke.x+Ve.x),St=ie.y-(Ke.y+Ve.y),Xn=ie.z-(Ke.z+Ve.z),Pi=Math.hypot(Wn,St,Xn);if(Pi>16){let gc=16/Pi;Wn*=gc,St*=gc,Xn*=gc}let Ks=tt?.2:.45,Tp=Ke.x+Gn*It+Wn*Ks,wp=Ke.y+ts*It+St*Ks,Ap=Ke.z+wt*It+Xn*Ks,mc=M.get(Ce)??1;ze.x=ie.x+(Tp-ie.x)*mc,ze.y=ie.y+(wp-ie.y)*mc,ze.z=ie.z+(Ap-ie.z)*mc}Tn[Q]=s(ie)?1:0,P.set(ze.x,ze.y,ze.z),_.setScalar(Tn[Q]?ie.radius*De.scales[Q]:0),T.compose(P,C,_),hi.setMatrixAt(Q,T),_.setScalar(Tn[Q]?ie.radius*(G.layout==="atlas"&&ie.kind==="mirror"?9:16)*De.scales[Q]:0),T.compose(P,ct.quaternion,_),E.setMatrixAt(Q,T)}),hi.instanceMatrix.needsUpdate=!0,E.instanceMatrix.needsUpdate=!0,E.visible=oc.opacity>0,L.forEach((ie,Q)=>{let Ce=Ie[ie],ze=U[ie];P.set(ze.x,ze.y,ze.z),_.setScalar(Tn[ie]?Ce.radius*De.scales[ie]:0),T.compose(P,A[Q],_),b.setMatrixAt(Q,T)}),b.instanceMatrix.needsUpdate=!0;let F=0,$=0,re=(ie,Q=!1)=>{let Ce=p[ie],ze=U[Ce.a],Ke=U[Ce.b],Ve=Math.min(De.linkProgress[Ce.a],De.linkProgress[Ce.b]);Ve<=0||!Tn[Ce.a]||!Tn[Ce.b]||(Q?_s(Re,$++,ze,Ke,Ve):Dt!==Ce.a&&Dt!==Ce.b&&_s(le,F++,ze,Ke,Ve))};if(G.links==="all")for(let ie=0;ie<p.length;ie++)re(ie);else if(G.links==="overview")for(let ie of d)re(ie);if(G.links!=="off"&&Dt>=0)for(let ie of h[Dt])re(ie,!0);for(let[ie,Q,Ce]of[[it,fe,F],[Y,Ze,$]])if(ie.visible=Ce>0,Q.setDrawRange(0,Ce*2),Ce){let ze=Q.attributes.position;ze.clearUpdateRanges(),ze.addUpdateRange(0,Ce*6),ze.needsUpdate=!0}let j=0;if(Ie.forEach((ie,Q)=>{if(!Tn[Q]||De.scales[Q]<=.15)return;let Ce=Lt(ie),ze=De.groupParents?.get(Ce),Ke=V.get(Ce);if(!ze||Ke===void 0)return;let Ve=U[Q],tt=j++*6;ce[tt]=Ve.x,ce[tt+1]=Ve.y,ce[tt+2]=Ve.z,ce[tt+3]=ze.x,ce[tt+4]=ze.y,ce[tt+5]=ze.z;let de=new Te(mh(ie)),$t=de.clone().lerp(m,.42);se[tt]=de.r,se[tt+1]=de.g,se[tt+2]=de.b,se[tt+3]=$t.r,se[tt+4]=$t.g,se[tt+5]=$t.b}),Fe.visible=G.layout==="atlas"&&j>0,He.opacity=en?.11:.045,Pe.setDrawRange(0,j*2),j){let ie=Pe.attributes.position,Q=Pe.attributes.color;ie.clearUpdateRanges(),ie.addUpdateRange(0,j*6),ie.needsUpdate=!0,Q.clearUpdateRanges(),Q.addUpdateRange(0,j*6),Q.needsUpdate=!0}let ue=0,me=performance.now()*.001;for(let ie=0;ie<mt;ie++){let Q,Ce;if(ie%3===0){let tt=ie*83%Ie.length,de=De.groupParents?.get(Lt(Ie[tt]));if(!de||!Tn[tt])continue;Q=U[tt],Ce=de}else{let tt=Xe[ie*47%Math.max(1,Xe.length)],de=p[tt];if(!de||!Tn[de.a]||!Tn[de.b])continue;Q=U[de.a],Ce=U[de.b]}let ze=(me*(.16+ie%7*.018)+Ht(String(ie)+"activity"))%1,Ke=ue++*3,Ve=ze*ze*(3-2*ze);We[Ke]=Q.x+(Ce.x-Q.x)*Ve,We[Ke+1]=Q.y+(Ce.y-Q.y)*Ve,We[Ke+2]=Q.z+(Ce.z-Q.z)*Ve}if(st.setDrawRange(0,ue),ue){let ie=st.attributes.position;ie.clearUpdateRanges(),ie.addUpdateRange(0,ue*3),ie.needsUpdate=!0}$e.visible=ue>0;let xe=te("graph-stage");if(xe.dataset.drawnLinks!==String(F+$)&&(xe.dataset.drawnLinks=String(F+$)),xe.dataset.linkMode!==G.links&&(xe.dataset.linkMode=G.links),xe.dataset.parentEdges!==String(j)&&(xe.dataset.parentEdges=String(j)),xe.dataset.activityPackets!==String(ue)&&(xe.dataset.activityPackets=String(ue)),xe.dataset.formation!==G.formation&&(xe.dataset.formation=G.formation),xe.dataset.groupShells!=="0"&&(xe.dataset.groupShells="0"),xe.dataset.syntheticGroupHubs!=="0"&&(xe.dataset.syntheticGroupHubs="0"),xe.dataset.nodeGroupHubs!==String(V.size)&&(xe.dataset.nodeGroupHubs=String(V.size)),rt.visible=Dt>=0&&s(Ie[Dt])&&De.scales[Dt]>.15,Dt>=0){let ie=Ie[Dt],Q=U[Dt];rt.position.set(Q.x,Q.y,Q.z),rt.scale.setScalar(ie.radius*1.18)}Gs.updateLabels(ct,U,Tn,G.layout,De.entrance.total?De.entrance.revealed/De.entrance.total:1,De.scales,De.groupParents)}te("graph-counts").textContent=`${Ie.length.toLocaleString("en-AU")} nodes \xB7 ${p.length.toLocaleString("en-AU")} links`,te("loading").hidden=!0,te("graph-stage").dataset.ready="true",te("graph-stage").dataset.nodes=String(Ie.length),te("graph-stage").dataset.links=String(p.length),Object.assign(te("graph-stage").dataset,{starAsset:"Blender 5.2.1 mesh and Fog Glow",starVertices:String(l.geometry.attributes.position.count)}),Object.assign(te("graph-stage").dataset,{layout:G.layout,environment:"world-space",backgroundStars:String(o[6].positions.length/3)}),J(!1),te("replay-entrance").disabled=!1,Gr();let Ci=new Us;Ci.connect(document),Ws=new rc(performance.now(),{idleMs:zr.idleMs,fps:zr.activeFps});let es=new Set,Zs=0,Wr=0;function Xr(){!Vs&&!document.hidden&&(Vs=requestAnimationFrame(pc))}Vn=()=>{let f=performance.now(),S=Ws.touch(f);(S||!Vs)&&(Ci.reset(),Ws.nextFrame=f,lc=f,ac=0,Ft=!0,De.configure({visible:!document.hidden})),te("graph-stage").dataset.renderState=document.hidden?"hidden":"active",S&&(te("motion-status").textContent=G.paused?"Motion paused":"Motion on"),Xr()};let qr={capture:!0,passive:!0};for(let f of["pointermove","pointerenter","wheel","keydown","input","change"])document.addEventListener(f,Vn,qr);document.addEventListener("pointerdown",f=>{es.add(f.pointerId),Vn()},qr);for(let f of["pointerup","pointercancel"])window.addEventListener(f,S=>{es.delete(S.pointerId),Vn()},qr);window.addEventListener("blur",()=>es.clear()),window.addEventListener("focus",Vn),Object.assign(te("graph-stage").dataset,{renderState:"active",idleAfterSeconds:String(zr.idleMs/1e3),frameLimit:String(zr.activeFps),pixelRatio:String(_t.getPixelRatio()),renderedFrames:"0",renderTicks:"0"}),Lh=f=>{if(f?.type!=="open-method-surface")return;Bt=f.interactive!==!1;let S=Math.max(0,Math.min(te("graph-3d").clientWidth*.4,Number(f.navigationInset)||0));S!==he&&(he=S,ge()),document.body.classList.toggle("open-method-ambient",!Bt),te("graph-stage").dataset.openMethodInteractive=String(Bt),Me(f.focus),Vn()},Ih&&Lh(Ih);function pc(f){if(Vs=0,document.hidden)return;if(Wr++,Ws.checkIdle(f,$n||!!en||Ji||es.size>0||!!gt)){De.configure({visible:!1}),Object.assign(te("graph-stage").dataset,{renderState:"idle",fps:"0",renderedFrames:String(Zs),renderTicks:String(Wr),environmentTime:Ri.time.toFixed(3)}),te("motion-status").textContent="Idle \xB7 image held to save GPU";return}if(Xr(),!Ws.frameDue(f))return;Ci.update(f);let S=Math.min(.05,Ci.getDelta());if(gt){let j=Math.min(1,(f-gt.started)/gt.duration),ue=1-Math.pow(1-j,3);ct.position.lerpVectors(gt.fromPosition,gt.toPosition,ue),qe.target.lerpVectors(gt.fromTarget,gt.toTarget,ue),Ft=!0,j>=1&&(gt=null,qe.update(),hn(),Bt||(Ws.lastActivity=f-zr.idleMs+900))}let w=!G.paused&&!jn.matches&&G.layout==="atlas"&&G.formation==="sphere";if(w&&(ae+=S*G.speed),Math.abs(z)>1e-5){let j=z*(1-Math.exp(-S/.065)),ue=ct.position.clone().sub(qe.target),me=ue.length(),xe=Math.max(qe.minDistance,Math.min(qe.maxDistance,me*Math.exp(j)));me>0&&ct.position.copy(qe.target).add(ue.multiplyScalar(xe/me)),te("graph-stage").dataset.zoomDistance=xe.toFixed(3),z-=j,Ft=!0,(Math.abs(z)<=1e-5||xe===qe.minDistance||xe===qe.maxDistance)&&(z=0,k())}De.sample(f)&&(Ft=!0);let N=Ri.update(S,G,!G.paused&&!jn.matches);qe.update(S);let F=De.entrance,$=F.active&&G.paused,re=F.active?$?"Reveal paused":F.phase==="settling"?"Stars settling into place":`Revealing ${F.revealed.toLocaleString("en-AU")} of ${F.total.toLocaleString("en-AU")}`:jn.matches?"Reduced motion \xB7 all stars shown":"";if(te("entrance-status").textContent!==re&&(te("entrance-status").textContent=re),te("skip-entrance").hidden===F.active&&(te("skip-entrance").hidden=!F.active),Object.assign(te("graph-stage").dataset,{entrance:F.phase,revealed:String(F.revealed),entranceTime:String(F.elapsed??0)}),(Ft||qe.autoRotate||N||w)&&(Gr(),Ri.prepareRender(_t,ct),G.background==="horizon"||G.background==="planetary"?y.render():_t.render(g,ct),ac++,Zs++,Ft=!1),f-lc>=1500){let j=Math.round(ac*1e3/(f-lc)),ue=De.clearance();te("graph-stage").dataset.activeFps=String(j),te("motion-status").textContent=G.paused&&!$n?"Motion paused":`Motion on \xB7 ${j} fps`;let me=te("collision-status");if(me.textContent="Solid sphere collisions on",Object.assign(me.dataset,{overlaps:String(ue.overlaps),maxPenetration:String(ue.maxPenetration),physicsMs:ue.physicsMs.toFixed(2)}),Object.assign(te("graph-stage").dataset,{fps:String(j),drawCalls:String(_t.info.render.calls),physicalSprings:String(De.jointCount),camera:ct.position.toArray().join(","),steps:String(De.steps),environmentTime:Ri.time.toFixed(3),renderedFrames:String(Zs),renderTicks:String(Wr),auraFieldCache:String(Ri.fieldCacheActive)}),Dt>=0){let xe=Ie[Dt];Object.assign(te("node-info").dataset,{x:xe.x.toFixed(3),y:xe.y.toFixed(3),z:xe.z.toFixed(3),pinned:String(xe.pinned)})}ac=0,lc=f}}Xr(),document.addEventListener("visibilitychange",()=>{hn(),document.hidden?(cancelAnimationFrame(Vs),Vs=0,es.clear(),De.configure({visible:!1}),te("graph-stage").dataset.renderState="hidden"):Vn()}),window.addEventListener("pagehide",()=>{hn(),De.dispose()}),window.addEventListener("pageshow",f=>{f.persisted&&location.reload()})}yy().catch(cc);})();
