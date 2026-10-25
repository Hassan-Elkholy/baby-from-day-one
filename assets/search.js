// Search for the cards: weighted fields, Arabic-aware matching, and each card's rank as a small nudge.
// Used by app.js in the page and by tools/test_search.js in node, so both run the same code.
(function(root){
'use strict';
// Drop Arabic diacritics and unify letters people type differently (أ إ آ → ا، ة → ه، ى → ي).
function norm(s){return String(s).toLowerCase().replace(/[ً-ٰٟـ]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
// "ال" and its joined forms are optional, and so is a short ending: الانف = انف, مناخيره = مناخير.
const PRE=/^(?:وال|بال|فال|كال|لل|ال)/, PRE1=/^[وبفلك]/, SUF=/(?:ها|هم|كم|ات|ين|ون|ه|ي|ك)$/;
function stem(t){let s=t;
  const a=s.replace(PRE,'');if(a!==s&&a.length>=2)s=a;
  else{const b=s.replace(PRE1,'');if(b!==s&&b.length>=4)s=b}
  const c=s.replace(SUF,'');if(c!==s&&c.length>=3)s=c;
  return s}
// Small words that are in almost every card; they would match everything.
const STOP=new Set(['في','من','على','علي','لو','عن','مع','هو','هي','ده','دي','او','ولا','يا','انا','بس','اللي','the','a','of','and','to','is']);
const words=s=>norm(s).split(' ').filter(w=>w.length>1);

// Where a word is found counts most in the title, then the tags, the short text, the rest of the card, the details.
const W={title:10,tags:8,short:4,body:1.5,deep:.5};
// How well a word matches: the same word, the same stem, inside a longer word, or one typo away.
const Q={same:1,stem:.9,part:.6,typo:.5,start:.35};

const XREF=/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g;
function field(str){const t=words(str);return{str:' '+t.join(' ')+' ',tok:new Set(t),stem:new Set(t.map(stem)),list:[...new Set(t)]}}
// Edit distance, stopping early once it is over the limit.
function near(a,b,max){if(Math.abs(a.length-b.length)>max)return false;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){const cur=[i];let low=i;
    for(let j=1;j<=b.length;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(cur[j]<low)low=cur[j]}
    if(low>max)return false;prev=cur}
  return prev[b.length]<=max}

function build(cards,tags,rank){
  tags=tags||{};rank=rank||{};
  const title=Object.fromEntries(cards.map(c=>[c.id,c.title]));
  const plain=s=>String(s||'').replace(/\[\^[\w,]+\]/g,'').replace(XREF,(m,id,l)=>l||title[id]||'').replace(/\*\*/g,'');
  const deepText=c=>(c.deep||[]).map(s=>[s.t||'',...(s.p||[]),...(s.ol||[]),...(s.ul||[]),...(s.qa||[]).flat()].join(' ')).join(' ');
  const docText=d=>d?['now','day','ok'].map(k=>(d[k]||[]).join(' ')).join(' '):'';
  const idx=cards.map(c=>({c,rank:rank[c.id]||3,f:{
    title:field(plain(c.title)),
    tags:field([...(tags[c.id]||[]),c.k||''].join(' ')),
    short:field(plain(c.short)),
    body:field(plain([(c.steps||[]).join(' '),c.mistake||'',c.why||'',(c.buts||[]).flat().join(' '),docText(c.doc),c.note||''].join(' '))),
    deep:field(plain(deepText(c)))}}));

  function quality(F,q,qs,name){
    if(F.tok.has(q))return Q.same;
    if(F.stem.has(qs))return Q.stem;
    // Inside a longer word only from 4 letters; a 3-letter word only at the start of one, and weaker (انف is not انفصال).
    if(q.length>=4&&F.str.includes(q))return Q.part;
    if(q.length===3&&F.str.includes(' '+q))return Q.start;
    if(q.length>=4&&(name==='title'||name==='tags')){const max=q.length>=7?2:1;for(const w of F.list)if(near(q,w,max))return Q.typo}
    return 0}
  // One word against one card: its best field, plus a little for every other field it is in.
  function wordScore(e,q,qs){let best=0,rest=0;
    for(const name in W){const s=W[name]*quality(e.f[name],q,qs,name);if(s>best){rest+=best;best=s}else rest+=s}
    return best?best+.15*rest:0}

  function search(query){
    let qw=words(query);const kept=qw.filter(w=>!STOP.has(w));if(kept.length)qw=kept;
    qw=[...new Set(qw)];if(!qw.length)return null;
    const qn=' '+qw.join(' ')+' ';
    const per=qw.map(q=>{const qs=stem(q);return idx.map(e=>wordScore(e,q,qs))});
    // A word found in few cards tells more than one found in most of them.
    const N=idx.length,idf=per.map(sc=>Math.log(1+N/(sc.filter(x=>x>0).length+1))),idfAll=idf.reduce((a,b)=>a+b,0);
    const hits=[];
    idx.forEach((e,i)=>{let sum=0,got=0;
      per.forEach((sc,k)=>{if(sc[i]>0){sum+=sc[i]*idf[k];got+=idf[k]}});
      if(!got)return;
      if(qw.length>1&&(e.f.title.str.includes(qn)||e.f.tags.str.includes(qn)))sum*=2;
      // Cards that match every word come first. A missing word costs as much as it is rare: missing "مش" costs almost nothing.
      // The card's rank (1 to 5) then moves it up or down by up to a fifth.
      const score=sum*Math.pow(got/idfAll,1.5)*(1+.1*(e.rank-3));
      hits.push({id:e.c.id,score})});
    hits.sort((a,b)=>b.score-a.score||(rank[b.id]||3)-(rank[a.id]||3));
    // Weak matches still show, further down, so one exact phrase never hides every other useful card.
    const top=hits.length?hits[0].score:0;
    return hits.filter(h=>h.score>=top*.1).slice(0,40)}
  return{search}}

const api={norm,stem,build};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BGSearch=api;
})(this);
