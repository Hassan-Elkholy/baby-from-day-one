// The whole page: loads one language's files, then renders home, cards and the emergency page.
// No text lives here; every word comes from locales/<lang>/*.json.
(function(){
'use strict';
const app=document.getElementById('app'), popEl=document.getElementById('pop');
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
// [[cardId]] or [[cardId|label]] is a link to another card; as plain text it reads as the card's title.
const XREF=/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g;
function xrefTitle(id){const c=(K&&K.cards||[]).find(x=>x.id===id);return c?c.title:''}
const plain=s=>String(s).replace(/\[\^[\w,]+\]/g,'').replace(XREF,(m,id,l)=>l||xrefTitle(id)).replace(/\*\*/g,'');
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>k in o?o[k]:m);
// The offline single-file copy carries every JSON file in window.BG_DATA, keyed by path.
const getJSON=p=>window.BG_DATA&&BG_DATA[p]?Promise.resolve(BG_DATA[p]):fetch(p).then(r=>{if(!r.ok)throw new Error(p+': '+r.status);return r.json()});

let LANGS=[],SRC={},REG={},PICS={},TAGS={},RANK={},GROUPS=[],VOICE={},lang,region,U,K,NAMES,RNAMES,DRAW,CARDS,BY,engine;

// ---------- loading ----------
async function boot(){
  [LANGS,SRC,REG,PICS,TAGS,RANK,GROUPS,VOICE]=await Promise.all(['locales/index.json','data/sources.json','data/regions.json','data/pics.json','data/tags.json','data/rank.json','data/groups.json','data/voice.json'].map(getJSON));
  const ready=LANGS.filter(l=>l.complete);
  const want=store.get('bg-lang');
  lang=(ready.find(l=>l.code===want)||ready[0]).code;
  await loadLang(lang);
  addEventListener('hashchange',route);route();
}
async function loadLang(code){
  const base=`locales/${code}/`;
  const [ui,cards,draw,names,rnames]=await Promise.all(['ui','cards','draw','sources','regions'].map(f=>getJSON(base+f+'.json')));
  U=ui;K=cards;NAMES=names;RNAMES=rnames;inBook=false;srcCount=0;
  const meta=LANGS.find(l=>l.code===code);
  document.documentElement.lang=code;document.documentElement.dir=meta.dir;
  document.title=U.title;
  DRAW=buildDrawings(k=>draw[k]!=null?draw[k]:k);
  region=store.get('bg-region');if(region===null)region=U.defaultRegion||'';
  if(region&&!REG[region])region='';
  applyRegion();
  document.getElementById('brand').textContent=U.title;
  { const hb=document.getElementById('homebtn'); hb.setAttribute('aria-label',U.home); hb.title=U.home; }
  document.getElementById('sos').textContent=U.emergency;
  paintTheme();
}
function applyRegion(){
  CARDS=K.cards.filter(c=>!c.region||c.region===region);
  BY=Object.fromEntries(CARDS.map(c=>[c.id,c]));
  engine=BGSearch.build(CARDS,TAGS,RANK);
}

// ---------- theme (light by default; the choice is saved on this device) ----------
const SUN='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const MOON='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const isDark=()=>document.documentElement.dataset.theme==='dark';
function paintTheme(){const b=document.getElementById('theme'),d=isDark();
  b.innerHTML=(d?SUN:MOON)+`<span>${esc(d?U.themeLight:U.themeDark)}</span>`;b.setAttribute('aria-label',d?U.themeLight:U.themeDark);b.setAttribute('aria-pressed',String(d))}
document.getElementById('theme').addEventListener('click',()=>{const d=!isDark();
  document.documentElement.dataset.theme=d?'dark':'light';store.set('bg-theme',d?'dark':'light');paintTheme()});

// ---------- text with footnotes ----------
// Card text marks sources as [^id] or [^id1,id2]. Each card numbers its sources in order of first use.
function notes(){const order=[];return{order,num(id){let i=order.indexOf(id);if(i<0){order.push(id);i=order.length-1}return i+1}}}
// A chip that opens another card (in the book it jumps to that card). A card hidden for this country shows as plain words.
function xref(id,label){const c=BY[id],title=label||xrefTitle(id);
  if(!c)return esc(title);
  return `<a class="xref" href="${inBook?'#b-':'#c-'}${id}"><span class="xi" aria-hidden="true"></span><span>${esc(title)}</span></a>`}
function relatedHTML(c){const ids=((K.related||{})[c.id]||[]).filter(id=>BY[id]);if(!ids.length)return'';
  return `<div class="rel"><p class="lab">${esc(U.related)}</p><div class="relrow">${ids.map(id=>xref(id)).join('')}</div></div>`}
function fmt(s,n){return fmtText(s,n).replace(XREF,(m,id,l)=>xref(id,l))}
function fmtText(s,n){
  return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[\^([\w,]+)\]/g,(m,ids)=>
    ids.split(',').map(id=>{if(!SRC[id]){console.warn('unknown source',id);return''}const k=n.num(id);
      return `<button type="button" class="fn" data-src="${id}" data-n="${k}" aria-label="${esc(fill(U.sourceN,{n:k}))}">${k}</button>`}).join(''));
}
// A block of text as HTML. Inline lists become real lists so they don't run together on one line:
// "(1) … (2) …" (the numbers may be bold) becomes a numbered list; "label: a؛ b؛ c" becomes a bulleted list.
// Long text without a list is split into one paragraph per sentence.
const NUM=/(?:\*\*)?\(\s*(\d+)\s*\)(?:\*\*)?\s*/g;
// A split is only used when every piece keeps its ** pairs whole, so bold text is never cut in half.
const whole=a=>a.every(x=>((x.match(/\*\*/g)||[]).length%2)===0);
function block(s,n){s=String(s);
  const parts=s.split(NUM);// [lead, '1', item, '2', item, …]
  if(parts.length>=5&&parts[1]==='1'&&parts[3]==='2'){
    const items=[];for(let i=2;i<parts.length;i+=2)items.push(parts[i].trim());
    const lead=parts[0].trim();
    if(whole([lead,...items]))return `${lead?`<p>${fmt(lead,n)}</p>`:''}<ol class="nl">${items.map(x=>`<li>${fmt(x,n)}</li>`).join('')}</ol>`}
  const semi=s.split('؛');
  if(semi.length>=3&&whole(semi)){const m=/^(\*\*[^*]+:\*\*)\s*([\s\S]*)$/.exec(semi[0].trim());
    if(m){semi[0]=m[2];return `<p>${fmt(m[1],n)}</p><ul class="nl">${semi.map(x=>`<li>${fmt(x.trim(),n)}</li>`).join('')}</ul>`}}
  if(s.length>200){const ss=s.split(/(?<=[.؟!](?:\[\^[\w,]+\])?)\s+(?=\S)/);
    if(ss.length>1&&whole(ss))return ss.map(x=>`<p>${fmt(x,n)}</p>`).join('')}
  return `<p>${fmt(s,n)}</p>`}
function srcList(n){if(!n.order.length)return'';
  return `<div class="src"><p class="lab" style="font-size:.95rem">${esc(U.sources)}</p><ol>${n.order.map(id=>
    `<li><a href="${esc(SRC[id].url)}" target="_blank" rel="noopener">${esc(NAMES[id]||id)}</a></li>`).join('')}</ol></div>`}
function dateText(iso,opt){try{return new Date(iso+'T00:00:00').toLocaleDateString(lang+'-u-nu-latn',opt||{day:'numeric',month:'long',year:'numeric'})}catch(e){return iso}}
let lastFocus=null;
function openPop(btn){
  const id=btn.dataset.src,s=SRC[id];if(!s)return;lastFocus=btn;
  popEl.innerHTML=`<div class="shade" data-close></div><div class="pop" role="dialog" aria-modal="true" aria-labelledby="popt"><div class="sheet">
    <p class="num" id="popt">${esc(fill(U.sourceN,{n:btn.dataset.n}))}</p>
    <p>${esc(NAMES[id]||id)}</p>
    <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a>
    <p class="when">${esc(fill(U.checkedOn,{date:dateText(s.checked)}))}</p>
    <button type="button" class="x" data-close>${esc(U.close)}</button></div></div>`;
  popEl.hidden=false;popEl.querySelector('.x').focus();
}
function closePop(){if(popEl.hidden)return;popEl.hidden=true;popEl.innerHTML='';if(lastFocus)lastFocus.focus()}
document.addEventListener('click',e=>{const b=e.target.closest('.fn');if(b){e.preventDefault();openPop(b);return}
  if(e.target.closest('[data-close]'))closePop()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});

// ---------- search (assets/search.js: weighted fields, tags in data/tags.json, ranks in data/rank.json) ----------
function search(q){const r=engine.search(q);return r&&r.map(h=>BY[h.id])}

const pic=id=>DRAW[id]||'';
// A card's picture (data/pics.json): its own, checked against the card, or else its topic's calm scene ("topic-<id>"),
// which shows no procedure and so cannot teach a wrong one. The old code drawings are not used for cards.
// A card's own picture, else its topic's; "" in pics.json means none, never the topic's (images/no-topic-pic.json).
const picOf=c=>c.id in PICS?PICS[c.id]:PICS['topic-'+c.topic]||'';
const cardPic=c=>picOf(c)?`<img src="${esc(picOf(c))}" alt="" loading="lazy" decoding="async">`:'';
const item=c=>`<li><a class="item" href="#c-${c.id}">${picOf(c)?`<span class="th">${cardPic(c)}</span>`:''}<span class="tx"><span class="tt">${esc(c.title)}</span><span class="ts">${esc(plain(c.short))}</span></span></a></li>`;

// ---------- age ----------
const DAY=864e5;
const BIRTH_DAYS=400; // the guide covers the first year; older dates are not used
const isoDay=d=>{const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
function birthRange(){const t=new Date();t.setHours(0,0,0,0);return[isoDay(new Date(t.getTime()-BIRTH_DAYS*DAY)),isoDay(t)]}
const birthOk=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return false;const[a,b]=birthRange();return v>=a&&v<=b};
function ageDays(){const v=store.get('bg-birth');if(!v||!birthOk(v))return null;const d=new Date(v+'T00:00:00');if(isNaN(d))return null;
  const n=Math.floor((new Date().setHours(0,0,0,0)-d)/DAY);return n>=0&&n<BIRTH_DAYS?n:null}
function count(n,forms){// forms: {one,two,few,many} with {n}
  return fill(n===1?forms.one:n===2?forms.two:(n<=10?forms.few:forms.many),{n})}
function ageText(n){const A=U.age;
  if(n===0)return A.today;
  if(n<14)return fill(A.is,{age:count(n,A.days)});
  const w=Math.floor(n/7),d=n%7;
  if(n<70)return fill(A.is,{age:count(w,A.weeks)+(d?A.and+count(d,A.days):'')});
  return fill(A.about,{age:count(Math.round(n/30.44),A.months)})}

// Browsing: the topics are grouped (data/groups.json, names in ui.json "groups"); a card listed in a group's "cards" belongs to that group only.
// "top" and "all" are not topics: "top" holds every card ranked 5 in data/rank.json, "all" holds every card. Inside a group, higher rank first, then book order.
let group=store.get('bg-group')||'top',query='',showAll=false;
const rankOf=c=>RANK[c.id]||3;
function groupOf(c){for(const g of GROUPS)if((g.cards||[]).includes(c.id))return g.id;for(const g of GROUPS)if((g.topics||[]).includes(c.topic))return g.id;return null}
function groupCards(id){const g=GROUPS.find(x=>x.id===id);if(!g)return[];
  const ord=new Map(readOrder().map((x,i)=>[x,i])),at=c=>ord.has(c.id)?ord.get(c.id):1e9;
  return (g.all?CARDS.slice():g.rank?CARDS.filter(c=>rankOf(c)>=g.rank):CARDS.filter(c=>groupOf(c)===id)).sort((a,b)=>rankOf(b)-rankOf(a)||at(a)-at(b))}
function prefs(){
  const ready=LANGS.filter(l=>l.complete);
  const regs=Object.keys(REG);
  return `<div class="prefs">
    <label for="reg">${esc(U.country)}</label><select id="reg">${regs.map(r=>`<option value="${r}"${r===region?' selected':''}>${esc(RNAMES[r]?RNAMES[r].name:r)}</option>`).join('')}<option value=""${region?'':' selected'}>${esc(U.otherCountry)}</option></select>
    ${ready.length>1?`<label for="lng">${esc(U.language)}</label><select id="lng">${ready.map(l=>`<option value="${l.code}"${l.code===lang?' selected':''}>${esc(l.name)}</option>`).join('')}</select>`:''}
  </div>`}

// The recently opened list was removed (2026-10-25). Its old key is cleared, so nothing unused stays on the phone.
store.del('bg-recent');
// What the guide is and why it can be trusted, in two lines. The numbers come from the data, so they stay true as cards are added.
let srcCount=0,srcDate='';
function introBox(){
  if(!srcCount){const used=new Set();for(const m of JSON.stringify(K).matchAll(/\[\^([\w,]+)\]/g))m[1].split(',').forEach(x=>{if(SRC[x])used.add(x)});
    srcCount=used.size;srcDate=[...used].map(x=>SRC[x].checked).sort().pop()||''}
  const date=srcDate?dateText(srcDate,{month:'long',year:'numeric'}):'';
  // A returning reader gets one short line, so the cards they opened stay near the top.
  if(hasProgress()||ageDays()!==null)return `<p class="intro short">${esc(fill(U.introShort,{n:CARDS.length,s:srcCount,date}))}</p>`;
  return `<section class="intro"><h1>${esc(U.introTitle)}</h1><p class="it">${esc(fill(U.introLine,{n:CARDS.length}))}</p>
    <p class="trust">${esc(fill(U.introTrustLine,{s:srcCount,date}))}</p></section>`}

// The other ways in, side by side: the baby's age, the whole guide in order, emergency. Each says what it is in one short line.
const ICON={
  age:'<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3v3H8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book:'<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  sos:'<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'};
function ways(){const n=ageDays(),o=readOrder(),p=position();
  const age=n===null?[U.wayAge,U.wayAgeSub]:[ageText(n),U.wayAgeSet];
  const bk=hasProgress()?[U.continueReading,fill(U.resumeAt,{n:p.n||1,total:p.total}),'#b-'+resumeId()]:[U.wayBook,fill(U.wayBookSub,{n:o.length,c:chapters().length}),'#book'];
  return `<nav class="ways" aria-label="${esc(U.waysLabel)}">
   <a class="way" href="#age">${ICON.age}<b>${esc(age[0])}</b><span>${esc(age[1])}</span></a>
   <a class="way" href="${bk[2]}">${ICON.book}<b>${esc(bk[0])}</b><span>${esc(bk[1])}</span></a>
   <a class="way way-sos" href="#emergency">${ICON.sos}<b>${esc(U.emergency)}</b><span>${esc(U.waySosSub)}</span></a></nav>`}

const LIST_FIRST=8;
// The list says which topic it shows and how many cards it has, so a reader who scrolled down still knows where she is.
function groupList(){const all=groupCards(group),shown=showAll?all:all.slice(0,LIST_FIRST),note=U.groupNotes&&U.groupNotes[group];
  return `<p class="ghead"><b>${esc(fill(U.groupHead,{name:U.groups[group]||group,n:all.length}))}</b>${note?` ${esc(note)}`:''}</p><ul class="list">${shown.map(item).join('')}</ul>${all.length>shown.length?`<button type="button" class="btn more" id="more">${esc(fill(U.showAll,{n:all.length}))}</button>`:''}`}
// The topics are one row that scrolls sideways and sticks under the header, so the cards they change are always right under them.
// The row starts with "all topics", which opens every topic at once, so none is hidden off the edge of the screen.
const GRID='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const shownGroups=()=>GROUPS.filter(g=>groupCards(g.id).length);
function browse(){const gs=shownGroups();if(!gs.some(g=>g.id===group))group=gs[0].id;
  return `<section class="browse" id="browse" aria-labelledby="bh"><h2 id="bh" class="sr">${esc(U.browseTitle)}</h2>
   <div class="strip" id="strip"><button type="button" class="chip allg" id="allg" aria-haspopup="dialog">${GRID}<span>${esc(U.allTopics)}</span></button>${gs.map(g=>`<button type="button" class="chip" data-g="${g.id}" aria-pressed="${g.id===group}">${esc(U.groups[g.id]||g.id)}</button>`).join('')}</div>
   <div id="glist" aria-live="polite">${groupList()}</div></section>`}
function openGroups(btn){lastFocus=btn;
  popEl.innerHTML=`<div class="shade" data-close></div><div class="pop" role="dialog" aria-modal="true" aria-labelledby="gt"><div class="sheet"><p class="num" id="gt">${esc(U.allTopics)}</p><div class="gsheet">${shownGroups().map(g=>`<button type="button" class="chip${g.all?' wide':''}" data-pick="${g.id}" aria-pressed="${g.id===group}">${esc(U.groups[g.id]||g.id)} <small>${groupCards(g.id).length}</small></button>`).join('')}</div><button type="button" class="x" data-close>${esc(U.close)}</button></div></div>`;
  popEl.hidden=false;popEl.querySelector('.x').focus()}

// "Add to home screen": shown only when the browser offers it (assets/pwa.js, hosted site only), and not again once refused.
function installBox(){if(!window.BG_INSTALL||store.get('bg-noinstall'))return'';
  return `<div class="install" id="install"><p>${esc(U.installText)}</p><button type="button" class="btn" id="instyes">${esc(U.installBtn)}</button><button type="button" class="btn quiet" id="instno">${esc(U.installNo)}</button></div>`}
function bindInstall(){const yes=document.getElementById('instyes');if(!yes)return;const box=document.getElementById('install');
  yes.addEventListener('click',async()=>{const ev=window.BG_INSTALL;window.BG_INSTALL=null;box.remove();if(ev){ev.prompt();try{await ev.userChoice}catch(e){}}});
  document.getElementById('instno').addEventListener('click',()=>{store.set('bg-noinstall','1');box.remove()})}
addEventListener('bg-install',()=>{if(location.hash.slice(1) in {'':1,home:1})home()});

// Home is the hub: what this is, search, the three other ways in, then the topics with their cards right under them.
function home(){
  app.innerHTML=`<section class="view home">
   ${introBox()}
   <div class="search"><input id="q" type="search" placeholder="${esc(U.searchPlaceholder)}" aria-label="${esc(U.search)}" value="${esc(query)}" enterkeyhint="search" autocomplete="off">
   <div class="try"><span>${esc(U.tryLabel)}</span>${U.tryWords.map(w=>`<button type="button" class="tryw">${esc(w)}</button>`).join('')}</div></div>
   <div id="res" hidden></div>
   <div id="rest" class="view">
   ${ways()}
   ${browse()}
   ${prefs()}
   ${installBox()}
   <footer class="foot"><p>${esc(U.disclaimer)}</p><p>${esc(U.about)}</p><p>${esc(U.privacy)}</p><p class="lic"><b>${esc(U.copyright)}</b> · <a href="${esc(U.licenseUrl)}" target="_blank" rel="noopener">${esc(U.licenseLink)}</a><br>${esc(U.licenseText)}</p></footer>
   </div></section>`;
  const q=document.getElementById('q'),res=document.getElementById('res'),rest=document.getElementById('rest');
  // No results is never a blank page: the message, and the topics stay under it.
  function run(){query=q.value;const r=search(query);
    if(r===null){res.hidden=true;rest.hidden=false;return}
    res.hidden=false;rest.hidden=r.length>0;
    res.innerHTML=r.length?`<p class="count">${esc(fill(U.resultsN,{n:r.length}))}</p><ul class="list">${r.map(item).join('')}</ul>`:`<p class="empty">${esc(U.noResults)}</p>`}
  bindInstall();
  let t=null;q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(run,120)});run();
  app.querySelectorAll('.tryw').forEach(b=>b.addEventListener('click',()=>{q.value=b.textContent;run()}));
  const bindMore=()=>{const m=document.getElementById('more');if(m)m.addEventListener('click',()=>{showAll=true;paintList()})};
  const paintList=()=>{document.getElementById('glist').innerHTML=groupList();bindMore()};
  bindMore();
  // A new topic swaps the cards in place. If the reader had scrolled down the old list, the page goes back to the top of the new one.
  const strip=document.getElementById('strip'),hdr=document.querySelector('.top');
  const stick=()=>document.documentElement.style.setProperty('--top-h',hdr.offsetHeight+'px');stick();
  const pick=id=>{group=id;showAll=false;store.set('bg-group',group);
    strip.querySelectorAll('[data-g]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.g===id)));paintList();
    const on=strip.querySelector(`[data-g="${id}"]`);if(on)on.scrollIntoView({inline:'center',block:'nearest'});
    const list=document.getElementById('glist'),below=hdr.offsetHeight+strip.offsetHeight;
    if(list.getBoundingClientRect().top<below)window.scrollTo(0,window.scrollY+list.getBoundingClientRect().top-below-8)};
  strip.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.g)));
  { const on=strip.querySelector('[aria-pressed="true"]');if(on)strip.scrollLeft+=on.getBoundingClientRect().left-strip.getBoundingClientRect().left-strip.clientWidth/2+on.offsetWidth/2 }
  document.getElementById('allg').addEventListener('click',e=>openGroups(e.currentTarget));
  popEl.onclick=e=>{const p=e.target.closest('[data-pick]');if(p&&location.hash.slice(1)in{'':1,home:1}){closePop();pick(p.dataset.pick)}};
  document.getElementById('reg').addEventListener('change',e=>{region=e.target.value;store.set('bg-region',region);applyRegion();home()});
  const lng=document.getElementById('lng');if(lng)lng.addEventListener('change',async e=>{store.set('bg-lang',e.target.value);lang=e.target.value;await loadLang(lang);route()});
}

const clearBtn=b=>b&&birthOk(b)?`<button type="button" class="btn" id="clr">${esc(U.forget)}</button>`:'';
// The month summary card for an age in days (month1 is the first 30 days).
const monthCard=d=>BY['month'+Math.min(12,Math.floor(d/30.44)+1)];
function agePart(){
  const n=ageDays(),isEx=n===null,a=isEx?10:n;
  const today=CARDS.filter(c=>c.when&&a>=c.when[0]&&a<=c.when[1]&&c.topic!=='bymonth').sort((x,y)=>(x.p||9)-(y.p||9)).slice(0,3);
  const mc=monthCard(a);if(mc)today.unshift(mc);
  const soon=K.soon.filter(s=>!s.region||s.region===region).filter(s=>BY[s.href]).map(s=>({...s,at:s.day-a})).filter(s=>s.at>0&&s.at<=70).slice(0,3);
  const birth=store.get('bg-birth');
  const base=isEx?null:new Date(birth+'T00:00:00');
  return `${isEx?`<p class="example">${esc(U.example)}</p>`:`<p class="age">${esc(ageText(n))}</p>`}
     <ul class="list">${today.map(item).join('')}</ul>
     ${soon.length?`<div><h3>${esc(U.comingUp)}</h3><ul class="soon">${soon.map(s=>`<li><b>${esc(s.label?s.label:(base?dateText(new Date(base.getTime()+s.day*DAY).toISOString().slice(0,10),{day:'numeric',month:'long'}):fill(U.inDays,{n:s.at})))}</b><span><a href="#c-${s.href}">${esc(s.text)}</a></span></li>`).join('')}</ul></div>`:''}`;
}
// The age tool has its own page (#age), one tap from home, so the home screen is not a form.
function agePage(){
  let birth=store.get('bg-birth');if(birth&&!birthOk(birth)){store.del('bg-birth');birth=null}
  // Once a date is saved, the cards for today come first and the date sits under them, folded, so the page is not a form.
  const dobBox=`<div class="dob"><label for="dd">${esc(U.bornOn)}</label><div class="dobf" id="dobf" dir="ltr" role="group" aria-label="${esc(U.bornOn)}"><input id="dd" inputmode="numeric" autocomplete="off" maxlength="2" placeholder="DD" aria-label="${esc(U.dobDay)}"><span aria-hidden="true">/</span><input id="mm" inputmode="numeric" autocomplete="off" maxlength="2" placeholder="MM" aria-label="${esc(U.dobMonth)}"><span aria-hidden="true">/</span><input id="yy" class="yy" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="YYYY" aria-label="${esc(U.dobYear)}"><button type="button" class="calbtn" id="calbtn" aria-label="${esc(U.dobPick)}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><input id="dob" class="nat" type="date" tabindex="-1" aria-hidden="true" value="${esc(birthOk(birth)?birth:'')}" min="${birthRange()[0]}" max="${birthRange()[1]}"></div><span id="clrbox">${clearBtn(birth)}</span></div>
     <p class="hint" id="dobhint" role="status" hidden></p>
     <p class="privacy">${esc(U.privacy)}</p>`;
  app.innerHTML=`<section class="view">
   <button class="back" type="button" id="bk">${esc(U.back)}</button>
   <section class="today" aria-labelledby="th">
     <h1 id="th">${esc(U.todayTitle)}</h1>
     ${birth?`<div id="agepart">${agePart()}</div><details class="dobfold"><summary>${esc(U.changeDate)}</summary>${dobBox}</details>`
       :`<p>${esc(U.ageIntro)}</p>${dobBox}<div id="agepart">${agePart()}</div>`}
   </section></section>`;
  bindDob();
  document.getElementById('bk').addEventListener('click',goBack);
}

// The date input is never rebuilt while it is being edited. A desktop date input reports a 'valid' date for every typed digit of the year,
// so only dates inside the allowed range are saved, and only #agepart is refreshed.
function bindDob(){
  const $=id=>document.getElementById(id);
  const dd=$('dd'),mm=$('mm'),yy=$('yy'),nat=$('dob'),hint=$('dobhint'),grp=$('dobf');
  const say=t=>{hint.textContent=t||'';hint.hidden=!t};
  const digits=s=>s.replace(/[\u0660-\u0669]/g,c=>c.charCodeAt(0)-1632).replace(/[\u06F0-\u06F9]/g,c=>c.charCodeAt(0)-1776).replace(/\D/g,'');
  const fromIso=v=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?[m[3],m[2],m[1]]:['','','']};
  const show=v=>{[dd.value,mm.value,yy.value]=fromIso(v)};
  show(birthOk(store.get('bg-birth'))?store.get('bg-birth'):'');
  const read=()=>{const d=dd.value,m=mm.value,y=yy.value;
    if(!d&&!m&&!y)return{empty:true};
    if(!d||!m||y.length<4)return{partial:true};
    const dn=+d,mn=+m,yn=+y,t=new Date(yn,mn-1,dn);
    if(t.getFullYear()!==yn||t.getMonth()!==mn-1||t.getDate()!==dn)return{bad:true};
    return{iso:isoDay(t)}};
  const refresh=()=>{$('agepart').innerHTML=agePart();$('clrbox').innerHTML=clearBtn(store.get('bg-birth'));bindClr()};
  const bindClr=()=>{const c=$('clr');if(c)c.addEventListener('click',()=>{store.del('bg-birth');show('');say('');refresh()})};
  // A complete but impossible date (31/02) is reported at once and the old date is dropped, so the age shown never disagrees with the boxes.
  const commit=()=>{const r=read();
    if(r.iso&&birthOk(r.iso)){say('');if(store.get('bg-birth')!==r.iso){store.set('bg-birth',r.iso);refresh()}}
    else if(r.bad){say(U.dobInvalid);if(store.get('bg-birth')){store.del('bg-birth');refresh()}}};
  // On blur or Enter: save a usable date, clear when empty, otherwise say why and put the last good date back.
  const settle=()=>{const r=read(),old=store.get('bg-birth');
    if(r.iso&&birthOk(r.iso)){commit();return}
    if(r.empty){store.del('bg-birth');say('');refresh();return}
    say(r.bad?U.dobInvalid:r.partial?U.dobPartial:U.dobRange);show(birthOk(old)?old:'')};
  const order=[dd,mm,yy];
  order.forEach((el,i)=>{
    el.addEventListener('input',()=>{const sep=/[\/\-. \u066B\u060C]/.test(el.value);el.value=digits(el.value);
      if(i<2&&(el.value.length===2||(sep&&el.value.length>=1)))order[i+1].focus();
      commit()});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();settle()}
      if(e.key==='Backspace'&&!el.value&&i>0)order[i-1].focus()});
    el.addEventListener('focus',()=>{try{el.select()}catch(e){}})});
  grp.addEventListener('focusout',e=>{if(!grp.contains(e.relatedTarget))settle()});
  $('calbtn').addEventListener('click',()=>{try{nat.showPicker()}catch(e){nat.focus();nat.click()}});
  nat.addEventListener('change',()=>{if(nat.value){show(nat.value);commit();settle()}});
  bindClr();
}

function levels(d,n){if(!d)return'';
  const L=[['now',U.levelNow],['day',U.levelDay],['ok',U.levelOk]];
  return `<div class="sec"><p class="lab">${esc(U.whenDoctor)}</p><div class="doc">${L.filter(([k])=>d[k]&&d[k].length).map(([k,h])=>
    `<div class="lvl ${k}"><h4>${esc(fill(h,{num:emergencyNumber()||U.localNumber}))}</h4><ul>${d[k].map(x=>`<li>${fmt(x,n)}</li>`).join('')}</ul></div>`).join('')}</div></div>`}
const emergencyNumber=()=>region&&REG[region]?REG[region].emergency:'';

// The deep layer: sections of paragraphs, lists and questions. Always collapsed, in the card and in the book; the reader opens it.
function deepText(c){return (c.deep||[]).map(s=>[s.t||'',...(s.p||[]),...(s.ol||[]),...(s.ul||[]),...(s.qa||[]).flat()].join(' ')).join(' ')}
function deepHTML(c,n){const S=c.deep;if(!S||!S.length)return'';
  const body=S.map(s=>`<section class="dsec"><h3>${esc(s.t||(U.deepHeads&&U.deepHeads[s.h])||'')}</h3>${(s.p||[]).map(x=>block(x,n)).join('')}${s.ol?`<ol>${s.ol.map(x=>`<li>${block(x,n)}</li>`).join('')}</ol>`:''}${s.ul?`<ul>${s.ul.map(x=>`<li>${block(x,n)}</li>`).join('')}</ul>`:''}${s.qa?`<div class="buts">${s.qa.map(([q,a])=>`<details><summary>${esc(q)}</summary>${block(a,n)}</details>`).join('')}</div>`:''}</section>`).join('');
  return `<details class="deep"><summary>${esc(U.deepOpen)}</summary>${body}</details>`}

// Listening: a card plays only a recorded file (data/voice.json maps a card id to it), never the phone's own voice.
// A card with no recording shows the button switched off, with a short "coming soon".
const SPK='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function voiceBtn(c){const has=!!VOICE[c.id];
  return `<div class="tools"><button type="button" class="btn voice" ${has?`data-voice="${c.id}" aria-pressed="false"`:'disabled'}>${SPK}<span>${esc(U.listen)}</span></button>${has?'':`<span class="hint">${esc(U.voiceSoon)}</span>`}</div>`}
let player=null;
function stopVoice(){if(player){player.pause();player=null}document.querySelectorAll('.voice[aria-pressed="true"]').forEach(b=>{b.setAttribute('aria-pressed','false');b.querySelector('span').textContent=U.listen})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-voice]');if(!b)return;
  if(b.getAttribute('aria-pressed')==='true'){stopVoice();return}
  stopVoice();player=new Audio(VOICE[b.dataset.voice]);player.addEventListener('ended',stopVoice);
  player.play().then(()=>{b.setAttribute('aria-pressed','true');b.querySelector('span').textContent=U.listenStop}).catch(stopVoice)});

// One card's content. Used by the single-card page and by the book, so there is one source of text.
function cardParts(c,n,inBookView){
  const T=inBookView?'h2':'h1';
  return `${picOf(c)?`<figure class="pic" style="margin:0">${cardPic(c)}</figure>`:''}
   <${T}>${esc(c.title)}</${T}>
   <p class="lead">${fmt(c.short,n)}</p>
   ${inBookView?'':voiceBtn(c)}
   ${c.steps?`<div class="sec"><p class="lab">${esc(c.stepsLabel||U.whatToDo)}</p><ol class="steps">${c.steps.map(s=>`<li><span>${fmt(s,n)}</span></li>`).join('')}</ol></div>`:''}
   ${c.mistake?`<div class="box no"><p class="lab">${esc(U.mistake)}</p>${block(c.mistake,n)}</div>`:''}
   ${c.why?`<div class="box why"><p class="lab">${esc(U.why)}</p>${block(c.why,n)}</div>`:''}
   ${c.buts&&c.buts.length?`<div class="sec"><p class="lab">${esc(U.butWhat)}</p><div class="buts">${c.buts.map(([q,a])=>`<details><summary>${esc(q)}</summary>${block(a,n)}</details>`).join('')}</div></div>`:''}
   ${levels(c.doc,n)}
   ${c.note?`<p class="note">${fmt(c.note,n)}</p>`:''}
   ${deepHTML(c,n)}
   ${relatedHTML(c)}
   ${srcList(n)}`;
}
function card(id){
  const c=BY[id];if(!c){location.hash='home';return}
  const i=CARDS.indexOf(c),nx=CARDS[i+1],pv=CARDS[i-1],n=notes();
  app.innerHTML=`<article class="view card">
   <button class="back" type="button" id="bk">${esc(U.back)}</button>
   ${cardParts(c,n,false)}
   <nav class="next">${pv?`<a class="nb prev" href="#c-${pv.id}"><small>${esc(U.prevLabel)}</small><span>${esc(pv.title)}</span></a>`:'<span></span>'}${nx?`<a class="nb nxt" href="#c-${nx.id}"><small>${esc(U.nextLabel)}</small><span>${esc(nx.title)}</span></a>`:''}</nav>
  </article>`;
  document.getElementById('bk').addEventListener('click',goBack);
  // Next and previous replace the current place, so رجوع returns to where the reader came from.
  app.querySelectorAll('nav.next a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go(a.getAttribute('href'),true)}));
}

function emergency(){
  const E=K.emergency,n=notes(),num=emergencyNumber(),rn=region&&RNAMES[region];
  app.innerHTML=`<section class="view">
   <h1>${esc(U.emergency)}</h1>
   <div class="call">${num?`<p>${esc(rn.ambulance)}</p><p class="num" id="num">${esc(num)}</p><a class="callnow" href="tel:${esc(num)}">${esc(fill(U.callNow,{num}))}</a>`:`<p>${esc(U.noRegionNumber)}</p>`}</div>
   ${levels(E.doc,n)}
   <section class="choke" aria-labelledby="ch"><h2 id="ch">${esc(E.choke.title)}</h2><p>${fmt(E.choke.intro,n)}</p>
     ${E.choke.steps.map(s=>`<div class="st">${pic(s.draw)}<p>${fmt(s.text,n)}</p></div>`).join('')}
     <div class="box no"><p class="lab">${esc(U.never)}</p><ul style="margin:0;padding-inline-start:1.1em">${E.choke.dont.map(x=>`<li>${fmt(x,n)}</li>`).join('')}</ul></div>
     <div class="box why"><p class="lab">${esc(E.choke.unconsciousTitle)}</p><p>${fmt(fill(E.choke.unconscious,{num:num||U.localNumber}),n)}</p></div>
   </section>
   ${rn&&rn.note?`<p class="note">${fmt(rn.note,n)}</p>`:''}
   ${srcList(n)}
  </section>`;
}

// ---------- book view: every card in reading order, chapter by chapter ----------
// Chapters are lists of card ids in cards.json ("book"); the card text itself is never copied.
let inBook=false,io=null,posTimer=null;
const readSet=()=>{try{return new Set(JSON.parse(store.get('bg-read')||'[]'))}catch(e){return new Set()}};
const saveRead=s=>store.set('bg-read',JSON.stringify([...s]));
const chapters=()=>(K.book||[]).map(ch=>({...ch,cards:ch.cards.filter(id=>BY[id])})).filter(ch=>ch.cards.length);
const readOrder=()=>chapters().flatMap(ch=>ch.cards);
function progress(){const o=readOrder(),r=readSet();return{done:o.filter(id=>r.has(id)).length,total:o.length}}
// Where the reader IS: the card at the top of the screen (saved as bg-pos), counted in reading order.
let curId=null;
function position(){const o=readOrder(),id=curId||store.get('bg-pos')||o[0],i=id?o.indexOf(id):-1;return{n:i+1,total:o.length,id:i>=0?id:null}}
function chapterOf(id){const chs=chapters();for(let i=0;i<chs.length;i++)if(chs[i].cards.includes(id))return{i:i+1,name:chs[i].name};return null}
function resumeId(){const o=readOrder(),pos=store.get('bg-pos');if(pos&&BY[pos])return pos;const r=readSet();return o.find(id=>!r.has(id))||o[0]||null}
function hasProgress(){return !!(store.get('bg-pos')||readSet().size)}

function bookCard(c,r){const done=r.has(c.id);
  return `<article class="card bookcard" id="b-${c.id}" data-id="${c.id}">${cardParts(c,notes(),true)}
   <div class="bookfoot"><button type="button" class="btn readbtn" data-read="${c.id}" aria-pressed="${done}">${esc(done?U.markedRead:U.markRead)}</button></div></article>`}
function paintSub(){const sub=document.getElementById('subbar');if(!sub)return;
  sub.innerHTML=`<button type="button" class="btn small" id="toc">${esc(U.toc)}</button><span class="prog" id="subprog"></span><div class="bar" aria-hidden="true"><i id="subbari" style="width:0%"></i></div>`;
  sub.hidden=false;paintPos()}
// Updates only the position text and bar, so it is cheap to call while scrolling.
function paintPos(){const t=document.getElementById('subprog'),b=document.getElementById('subbari');if(!t||!b)return;const p=position(),ch=p.id&&chapterOf(p.id);
  t.textContent=p.n?fill(U.position,{n:p.n,total:p.total})+(ch?' · '+fill(U.chapterN,{n:ch.i})+': '+ch.name:''):fill(U.position,{n:1,total:p.total});
  b.style.width=(p.total?Math.round((p.n||1)*100/p.total):0)+'%'}
function goTo(h){let id=h;if(h==='book'){const r=store.get('bg-pos');id=r&&BY[r]?'b-'+r:null}
  const el=id&&document.getElementById(id);if(el)el.scrollIntoView({block:'start'});else window.scrollTo(0,0)}
function book(){inBook=true;curId=store.get('bg-pos')||null;const r=readSet(),chs=chapters();
  app.innerHTML=`<div class="view book">${chs.map((ch,i)=>`<section class="chap" id="b-ch_${ch.id}"><p class="chapno">${esc(fill(U.chapterN,{n:i+1}))}</p><h1 class="chaptitle">${esc(ch.name)}</h1>${ch.intro?`<p class="chapintro">${esc(ch.intro)}</p>`:''}${ch.cards.map(id=>bookCard(BY[id],r)).join('')}</section>`).join('')}</div>`;
  paintSub();
  if('IntersectionObserver' in window){io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){clearTimeout(posTimer);const id=e.target.dataset.id;curId=id;paintPos();posTimer=setTimeout(()=>store.set('bg-pos',id),400)}},{rootMargin:'-130px 0px -65% 0px'});
    app.querySelectorAll('.bookcard').forEach(el=>io.observe(el))}}
// After a link inside the book, a bar offers a clear way back to the exact place the reader left.
let backTo=null;
function showBack(){let bar=document.getElementById('backbar');
  if(!bar){bar=document.createElement('div');bar.id='backbar';bar.className='backbar';document.body.appendChild(bar)}
  bar.innerHTML=`<button type="button" class="backgo" data-backgo>${esc(fill(U.backTo,{t:backTo.title}))}</button><button type="button" class="backx" data-backx aria-label="${esc(U.close)}">×</button>`;bar.hidden=false}
function hideBack(){backTo=null;const bar=document.getElementById('backbar');if(bar)bar.hidden=true}
document.addEventListener('click',e=>{
  const a=e.target.closest('a.xref');
  if(a&&inBook){const from=a.closest('.bookcard');backTo={y:window.scrollY,title:from&&BY[from.dataset.id]?BY[from.dataset.id].title:U.home};showBack();return}
  if(e.target.closest('[data-backgo]')){const y=backTo?backTo.y:0;hideBack();window.scrollTo(0,y);return}
  if(e.target.closest('[data-backx]'))hideBack()},true);
function leaveBook(){inBook=false;curId=null;hideBack();if(io){io.disconnect();io=null}clearTimeout(posTimer);const sub=document.getElementById('subbar');if(sub)sub.hidden=true}
function openToc(btn){lastFocus=btn;const r=readSet();
  popEl.innerHTML=`<div class="shade" data-close></div><div class="pop" role="dialog" aria-modal="true" aria-labelledby="toct"><div class="sheet toc"><p class="num" id="toct">${esc(U.toc)}</p><ol>${chapters().map(ch=>`<li><a href="#b-ch_${ch.id}" data-close>${esc(ch.name)}</a><span>${ch.cards.filter(id=>r.has(id)).length}/${ch.cards.length}</span></li>`).join('')}</ol><button type="button" class="x" data-close>${esc(U.close)}</button></div></div>`;
  popEl.hidden=false;popEl.querySelector('.x').focus()}
document.addEventListener('click',e=>{
  const t=e.target.closest('#toc');if(t){openToc(t);return}
  const b=e.target.closest('[data-read]');if(!b)return;
  const r=readSet(),id=b.dataset.read;if(r.has(id))r.delete(id);else r.add(id);saveRead(r);
  b.setAttribute('aria-pressed',String(r.has(id)));b.textContent=r.has(id)?U.markedRead:U.markRead;paintSub()});

let goTop=false;
// The places visited in this guide since it opened, so رجوع never leaves the guide or walks back through every next-card tap.
const trail=[];let replaceNext=false;
function track(){const h=location.hash||'#home';
  if(replaceNext){trail[trail.length?trail.length-1:0]=h;replaceNext=false}
  else if(trail.length>1&&trail[trail.length-2]===h)trail.pop();
  else if(trail[trail.length-1]!==h)trail.push(h)}
function go(hash,replace){if(replace){replaceNext=true;location.replace(hash)}else location.hash=hash}
function goBack(){if(trail.length>1)history.back();else go('#home',true)}
function route(){closePop();stopVoice();track();
  const h=location.hash.slice(1);
  if(h==='book'||h.startsWith('b-')){if(!inBook)book();goTo(h);return}
  const wasBook=inBook;
  leaveBook();
  if(h==='emergency')emergency();else if(h==='age')agePage();else if(h.startsWith('c-'))card(h.slice(2));else home();
  const isHome=h==='home'||h==='';
  if(!isHome||wasBook||goTop)window.scrollTo(0,0);
  goTop=false}
// The home button and the title: on the home screen already, scroll to the top; otherwise go home and start at the top.
for(const id of ['homebtn','brand'])document.getElementById(id).addEventListener('click',e=>{const h=location.hash.slice(1);
  if(h===''||h==='home'){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}else goTop=true});

boot().catch(e=>{app.innerHTML='<p class="loading">Could not load the guide. Check your connection and reload. / تعذر تحميل الدليل. اتأكدي من النت وحمّلي الصفحة تاني.</p>';console.error(e)});
})();
