import * as THREE from './city-assets/three.module.min.js';
import {createBuilding, createRobot, COLORS, BUILDING_TYPES} from './city-models.js';
import {PLOTS, EXTENSIONS, TOOLS} from './city-data.js';
const $ = id => document.getElementById(id);
const KEY = 'corners-city-draft-v1';
const LABEL_SAFE = /^[\p{L}\p{N} .,'’&!?()\-]{1,40}$/u;
const vacant = id => PLOTS.some(p => p.id === id && !p.team);
function validateDraft(rows) {
 if (!Array.isArray(rows) || rows.length > PLOTS.length) throw new Error('Invalid draft');
 const seen = new Set();
 return rows.map(r => {
  if (!r || !vacant(r.plotId) || seen.has(r.plotId) || !BUILDING_TYPES.includes(r.type) || typeof r.label !== 'string' || !LABEL_SAFE.test(r.label.trim()) || /\d{7,}/.test(r.label)) throw new Error('Invalid plot or label');
  seen.add(r.plotId); return {plotId:r.plotId, type:r.type, label:r.label.trim()};
 });
}
/* Reviewed entries in city-data.js may also carry a blurb, a link into the product
   and the board action ids being built there. Browser drafts never can: validateDraft
   drops every extra field, so a draft cannot inject a link. */
const HREF_SAFE = /^(https:\/\/[A-Za-z0-9.-]+\/[A-Za-z0-9._~/#-]*|[A-Za-z0-9._-]+\.html(#[A-Za-z0-9-]+)?)$/;
function approveExtensions(rows) {
 const base = validateDraft(rows);
 return base.map((clean, i) => {
  const raw = rows[i], out = {...clean};
  if (typeof raw.blurb === 'string' && raw.blurb.trim().length <= 180) out.blurb = raw.blurb.trim();
  if (typeof raw.href === 'string' && HREF_SAFE.test(raw.href)) out.href = raw.href;
  if (Array.isArray(raw.acts)) out.acts = raw.acts.filter(a => /^A-\d{3}$/.test(a));
  return out;
 });
}
let drafts = [], storageOK = true, selected = null, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
try { const raw = localStorage.getItem(KEY); if (raw) drafts = validateDraft(JSON.parse(raw)); }
catch(e) { storageOK = false; $('storageStatus').textContent = 'Saved draft unavailable. Export changes before closing.'; }
const approved = approveExtensions(EXTENSIONS).map((row,i)=>({...row,tool:TOOLS[EXTENSIONS[i].tool]}));
// The shared building wins the view; keep displaced drafts in storage/exports.
const displaced = drafts.filter(d=>approved.some(a=>a.plotId===d.plotId));
if(displaced.length) $('storageStatus').textContent='A shared building now uses a drafted plot. Your previous draft is kept in Export city draft.';
function announce(message) { $('toast').textContent=message; $('toast').hidden=false; clearTimeout(announce.timer); announce.timer=setTimeout(()=>$('toast').hidden=true,5000); }
function persist() {
 try { localStorage.setItem(KEY,JSON.stringify(drafts)); storageOK=true; }
 catch(e) { storageOK=false; }
 $('storageStatus').textContent=storageOK?(displaced.length?'Your previous draft on a shared plot is kept in Export city draft.':'Drafts stay in this browser. No shared editing.'):'Temporary draft only. Export before closing this page.';
}
const scene = new THREE.Scene(); scene.background=new THREE.Color(COLORS.chocolate);
let renderer;
try {
 renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.NoToneMapping; $('scene').append(renderer.domElement);
} catch(e) {
 $('loadNotice').textContent='3D is unavailable. Enable hardware acceleration in your browser, then reload. You can still open the company board and builder guide.'; throw e;
}
scene.add(new THREE.AmbientLight('#FFFFFF',1.2));
const light = new THREE.DirectionalLight('#FFFFFF',1.8); light.position.set(-15,35,20); scene.add(light);
const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);
const target=new THREE.Vector3(0,0,0);let viewHeight=39;
const root=new THREE.Group();scene.add(root);
const groundMat=new THREE.MeshBasicMaterial({color:COLORS.chocolate});
const edgeMat=new THREE.LineBasicMaterial({color:COLORS.blue,transparent:true,opacity:.55});
const roadMat=new THREE.MeshBasicMaterial({color:COLORS.blue,transparent:true,opacity:.18});
const roadMark=new THREE.MeshBasicMaterial({color:COLORS.blue,transparent:true,opacity:.65});
function box(w,h,d,x,y,z,material,parent=root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y+h/2,z);parent.add(m);return m;}
// Roads and Fit city follow the actual plots, including team-added rows.
const xs=[...new Set(PLOTS.map(p=>p.x))].sort((a,b)=>a-b),zs=[...new Set(PLOTS.map(p=>p.z))].sort((a,b)=>a-b);
const minX=xs[0]-7,maxX=xs.at(-1)+7,minZ=zs[0]-7,maxZ=zs.at(-1)+7;
const middleX=(minX+maxX)/2,middleZ=(minZ+maxZ)/2;
for(let i=1;i<zs.length;i++){const z=(zs[i-1]+zs[i])/2;box(maxX-minX,.03,1.8,middleX,.03,z,roadMat);for(let x=minX+2;x<maxX;x+=3)box(1.3,.02,.07,x,.07,z,roadMark);}
for(let i=1;i<xs.length;i++){const x=(xs[i-1]+xs[i])/2;box(1.8,.03,maxZ-minZ,x,.03,middleZ,roadMat);for(let z=minZ+2;z<maxZ;z+=3)box(.07,.02,1.3,x,.07,z,roadMark);}
// Inherited visual geometry; clean demonstration robots, not running AI agents.
const robots=[];
for(let i=0;i<5;i++){const robot=createRobot();robot.scale.setScalar(1.5);root.add(robot);robots.push({robot,phase:i*7.2});}
const places=new Map();
function labelFor(p){const extension=[...approved,...drafts].find(d=>d.plotId===p.id);const team=window.DIP?.company?.teams?.find(t=>t.id===p.team);return {...p,...extension,label:team?.name || extension?.label || `Open plot ${p.id.slice(-2)}`,type:p.type||extension?.type,draft:!!extension&&!approved.includes(extension),question:team?.question};}
function buildPlaces(){
 for(const v of places.values()){root.remove(v.group);v.group.traverse(o=>{if(o.geometry)o.geometry.dispose();});v.label.remove();}
 places.clear();$('placeList').replaceChildren();
 for(const p of PLOTS){
  const info=labelFor(p),group=new THREE.Group();group.position.set(p.x,0,p.z);root.add(group);
  const pad=box(9,.15,9,0,0,0,groundMat,group);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(pad.geometry),edgeMat);pad.add(edges);
  let height=.5;
  if(info.type){const building=createBuilding(info.type);building.group.position.y=.17;group.add(building.group);height=building.height;}
  else {const plusMat=new THREE.MeshBasicMaterial({color:COLORS.blue,transparent:true,opacity:.65});box(1.7,.05,.18,0,.19,0,plusMat,group);box(.18,.05,1.7,0,.19,0,plusMat,group);for(const x of [-3.8,3.8])for(const z of [-3.8,3.8])box(.12,.5,.12,x,.18,z,plusMat,group);}
  const label=document.createElement('button');label.className='plot-label'+(info.type?'':' open');label.dataset.plot=p.id;label.type='button';label.setAttribute('aria-label',`${info.label}${info.type?', view place':', build here'}`);
  const title=document.createElement('b');title.textContent=info.type?info.label:`＋ ${info.label}`;label.append(title);
  if(info.type){const sub=document.createElement('small');sub.textContent=p.team?'OPEN DEPARTMENT ↗':info.tool?info.tool.action.toUpperCase():info.draft?'BROWSER DRAFT':'TEAM ADDITION';label.append(sub);}
  label.onclick=()=>selectPlace(p.id);$('labels').append(label);
  const picker=document.createElement('button');picker.type='button';picker.dataset.place=p.id;picker.textContent=info.label;picker.setAttribute('aria-pressed','false');
  picker.onclick=()=>{selectPlace(p.id);$('closeInspector').focus();};$('placeList').append(picker);
  places.set(p.id,{group,label,picker,info,height});
 }
 const used=[...places.values()].filter(p=>p.info.type).length;
 $('cityCount').textContent=`${used} places · ${PLOTS.length-used} open plots · yours to shape`;
}
function projectLabels(){for(const v of places.values()){const point=new THREE.Vector3(v.info.x,.25,v.info.z+4.8).project(camera);v.label.style.left=`${(point.x*.5+.5)*$('scene').clientWidth}px`;v.label.style.top=`${(-point.y*.5+.5)*$('scene').clientHeight}px`;v.label.hidden=point.x < -1.2 || point.x >1.2 || point.y < -1.15 || point.y >1.15;}}
function resize(){const w=$('scene').clientWidth,h=$('scene').clientHeight;let aspect=w/h;camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.position.copy(target).add(new THREE.Vector3(65,65*.86,65));camera.lookAt(target);camera.updateMatrixWorld();camera.updateProjectionMatrix();renderer.setSize(w,h);projectLabels();}
function fit(){
 target.set(middleX,2,middleZ);viewHeight=1;resize();let extent=0;
 for(const p of places.values())for(const x of [-4.8,4.8])for(const z of [-4.8,4.8])for(const y of [0,p.height]){
  const v=new THREE.Vector3(p.info.x+x,y,p.info.z+z).project(camera);extent=Math.max(extent,Math.abs(v.x),Math.abs(v.y));
 }
 viewHeight=Math.max(35,extent*1.12);resize();
}
function selectPlace(id){
 selected=id;const v=places.get(id),info=v.info;
 for(const p of places.values()){p.label.classList.toggle('selected',p===v);p.picker.setAttribute('aria-pressed',String(p===v));}
 $('placeList').hidden=true;$('placesToggle').setAttribute('aria-expanded','false');$('placesToggle').textContent=`Places · ${info.label} ⌃`;
 $('placeKind').textContent=info.tool?.kind || (info.team?'EXISTING DEPARTMENT':!info.type?'AVAILABLE TO YOUR TEAM':info.draft?'VISUAL CITY DRAFT':'SECTION IN BUILD');
 $('placeTitle').textContent=info.label;
 $('placeDescription').textContent=info.tool?.description || info.blurb || info.question || (info.type?'A building shell for your idea. This visual draft does not create tasks, assign people, or run an AI agent.':'An empty plot. Choose a shape and name for a visual draft, then build its real function with your agent.');
 renderWork(info);const actions=$('placeActions');actions.replaceChildren();
 if(info.tool){const link=document.createElement('a');link.href=info.tool.href;link.textContent=info.tool.action;actions.append(link);}
 else if(info.team){const link=document.createElement('a');link.href=`index.html#${info.team}`;link.textContent='Open the existing department ↗';actions.append(link);}
 else if(!info.type){const button=document.createElement('button');button.textContent='Build on this plot ↗';button.onclick=()=>{$('plotName').textContent=info.label;$('buildError').textContent='';$('buildForm').reset();$('builder').showModal();$('buildingLabel').focus();};actions.append(button);}
 else{if(info.href){const open=document.createElement('a');open.href=info.href;open.target='_blank';open.rel='noopener';open.textContent=`Open ${info.label} in the app ↗`;actions.append(open);}const link=document.createElement('a');link.href='city-guide.html';link.className=info.href?'secondary':'';link.textContent='Build the real function ↗';actions.append(link);}
 $('inspector').hidden=false;
}
/* What the board says is being built in this section. The board stays the record;
   the city only reads it, so there is no second task system. */
function renderWork(info){
 const box=$('placeWork');if(!box)return;box.replaceChildren();
 const ids=info.acts||[],rows=(window.DIP?.actions||[]).filter(a=>ids.includes(a.id));
 if(!rows.length)return;
 const head=document.createElement('p');head.className='work-h';head.textContent='On the board';box.append(head);
 const list=document.createElement('ul');list.className='work';
 for(const a of rows){
  const person=(window.DIP?.people||[]).find(p=>p.id===a.owner);
  const who=person&&person.name&&person.name!=='—'?person.name:a.owner;
  const item=document.createElement('li');if(a.state==='done')item.className='is-done';
  const what=document.createElement('b');what.textContent=a.what;
  const meta=document.createElement('small');meta.textContent=`${who} · due ${a.due} · ${a.state}`;
  item.append(what,meta);list.append(item);
 }
 box.append(list);
}
$('placesToggle').onclick=()=>{const open=$('placeList').hidden;$('placeList').hidden=!open;$('placesToggle').setAttribute('aria-expanded',String(open));if(open)$('inspector').hidden=true;};
$('closeInspector').onclick=()=>{$('inspector').hidden=true;(matchMedia('(max-width:700px)').matches?$('placesToggle'):places.get(selected)?.label)?.focus();};
$('cancelBuild').onclick=()=>$('builder').close();
$('buildForm').onsubmit=e=>{e.preventDefault();const name=$('buildingLabel').value.trim(),type=$('buildingType').value;try{const newRows=validateDraft([...drafts,{plotId:selected,label:name,type}]);drafts=newRows;persist();buildPlaces();resize();$('builder').close();selectPlace(selected);announce(storageOK?'Your corner is built. Saved in this browser.':'Your corner is built temporarily. Export it before closing.');}catch(err){$('buildError').textContent='Use a short invented place name, without contacts or personal data.';}};
$('exportDraft').onclick=()=>{const data={format:'corners-city-draft',version:1,notice:'Visual draft only. Team review required before adding to city-data.js.',extensions:drafts};const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='corners-city-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Draft exported. Give this file to your agent for review.');};
$('homeView').onclick=fit;$('zoomIn').onclick=()=>{viewHeight=Math.max(25,viewHeight*.85);resize();};$('zoomOut').onclick=()=>{viewHeight=Math.min(160,viewHeight/ .85);resize();};
function motionLabel(){$('motion').textContent=paused?'Resume robots':'Pause robots';$('motion').setAttribute('aria-pressed',String(paused));}motionLabel();$('motion').onclick=()=>{paused=!paused;motionLabel();};
const canvas=renderer.domElement;canvas.setAttribute('aria-label','Isometric buildings and demonstration robots. Use the named place buttons to navigate.');let drag=null,moved=false;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};moved=false;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;const scale=viewHeight/$('scene').clientHeight;target.x-=dx*scale*.707+dy*scale*.6;target.z+=dx*scale*.707-dy*scale*.6;target.x=THREE.MathUtils.clamp(target.x,-22,22);target.z=THREE.MathUtils.clamp(target.z,-22,22);drag={x:e.clientX,y:e.clientY};resize();});
canvas.addEventListener('pointerup',e=>{drag=null;if(moved)return;const rect=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects([...places.values()].map(v=>v.group),true);if(hits.length){let object=hits[0].object;while(object.parent&&object.parent!==root)object=object.parent;for(const [id,p] of places)if(p.group===object){selectPlace(id);break;}}});
canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();viewHeight=THREE.MathUtils.clamp(viewHeight*(e.deltaY>0?1.06:.94),25,160);resize();},{passive:false});
addEventListener('resize',resize);addEventListener('keydown',e=>{if(e.key==='Escape'){$('inspector').hidden=true;if(!$('placeList').hidden){$('placeList').hidden=true;$('placesToggle').setAttribute('aria-expanded','false');$('placesToggle').focus();}}});
buildPlaces();fit();$('loadNotice').hidden=true;
let time=0,last=performance.now();
function frame(now){const delta=Math.min((now-last)/1000,.05);last=now;if(!paused)time+=delta;for(const {robot,phase} of robots){const t=(time*.9+phase)%36;robot.position.set(-18+t,.2,6);robot.userData.partes.cuerpo.position.y=paused?0:Math.sin(time*5+phase)*.05;}renderer.render(scene,camera);projectLabels();requestAnimationFrame(frame);}requestAnimationFrame(frame);
