// Drawings for the cards. Each one shows the real step, not decoration.
// Colours come from the page's CSS classes (.d ...), so they follow light and dark themes.
// Build all drawings for one language. L(key) returns that language's label for the key.
function buildDrawings(L){
const W=360,H=220;
const svg=(label,inner,vb=`0 0 ${W} ${H}`)=>`<svg class="d" viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`;
const T=(x,y,t,o={})=>`<text x="${x}" y="${y}" class="${o.c||'lb'}" text-anchor="${o.a||'middle'}" direction="rtl"${o.s?` style="font-size:${o.s}px"`:''}>${t}</text>`;
const no=(x,y,r=15)=>`<g transform="translate(${x} ${y})"><circle r="${r}" class="nobg"/><path class="nox" d="M${-r*.45} ${-r*.45}L${r*.45} ${r*.45}M${r*.45} ${-r*.45}L${-r*.45} ${r*.45}"/></g>`;
const ok=(x,y,r=15)=>`<g transform="translate(${x} ${y})"><circle r="${r}" class="okbg"/><path class="okx" d="M${-r*.45} 0L${-r*.1} ${r*.4}L${r*.5} ${-r*.4}"/></g>`;
// a thick limb with an ink outline: kind = sk (skin) or cl (onesie)
const limb=(d,kind='sk',w=11)=>`<path d="${d}" class="lo" style="stroke-width:${w+6}"/><path d="${d}" class="l${kind}" style="stroke-width:${w}"/>`;
const ground=(y,x1=10,x2=350)=>`<path class="ln thin" d="M${x1} ${y}H${x2}"/>`;

// Baby seen from above, lying on the back. Origin = middle of the body. Head points up before rotation.
function babyTop(cx,cy,s=1,rot=0,o={}){
  const eyes=o.awake?`<circle cx="-8" cy="-38" r="2.6" class="ink"/><circle cx="8" cy="-38" r="2.6" class="ink"/>`
    :`<path class="ln" d="M-13 -38q5 4 9 0M4 -38q5 4 9 0"/>`;
  const arms=o.armsUp?limb('M-18 -6Q-40 -18 -40 -40')+limb('M18 -6Q40 -18 40 -40')+`<circle cx="-40" cy="-44" r="7" class="sk"/><circle cx="40" cy="-44" r="7" class="sk"/>`
    :limb('M-18 -4Q-38 6 -36 26')+limb('M18 -4Q38 6 36 26')+`<circle cx="-36" cy="30" r="7" class="sk"/><circle cx="36" cy="30" r="7" class="sk"/>`;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">
   ${limb('M-11 34Q-16 52 -14 70','cl',15)}${limb('M11 34Q16 52 14 70','cl',15)}
   ${arms}
   <rect x="-24" y="-16" width="48" height="58" rx="20" class="cl"/>
   ${o.blanket?`<rect x="-30" y="6" width="60" height="70" rx="8" class="c2"/><path class="ln thin" d="M-30 14H30"/>`:''}
   <circle cx="0" cy="-36" r="24" class="sk"/>
   <path class="hr" d="M-14 -55q8 -8 16 -2q4 -6 12 -2q-10 -2 -12 6q-6 -6 -16 -2z"/>
   ${eyes}<path class="ln" d="M-4 -24q4 3 8 0"/>
   ${o.over||''}</g>`;
}
// Baby on the tummy, side view, head lifted. Origin = middle of the body, faces right.
function babyTummy(cx,cy,s=1,o={}){
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
   ${limb('M-40 6Q-62 4 -74 18','cl',15)}${limb('M-36 12Q-50 22 -70 26','cl',15)}
   <ellipse cx="-4" cy="4" rx="46" ry="20" class="cl"/>
   ${limb('M26 2Q34 22 56 22')}<circle cx="60" cy="22" r="7" class="sk"/>
   <circle cx="50" cy="-24" r="22" class="sk"/>
   <path class="hr" d="M30 -34q4 -16 22 -14q-8 4 -6 10q-8 -2 -16 4z"/>
   <circle cx="62" cy="-26" r="2.6" class="ink"/><path class="ln" d="M60 -14q5 3 9 -1"/>
  </g>`;
}
// Adult upper body, front view, clothed. Origin = base of the neck.
function adultFront(cx,cy,s=1,o={}){
  const head=o.man?`<circle cx="0" cy="-36" r="27" class="sk"/><path class="hr" d="M-27 -40q2 -26 27 -26q25 0 27 26q-8 -14 -27 -14q-19 0 -27 14z"/>`
    :`<path class="sc" d="M-34 -30q0 -40 34 -40q34 0 34 40q0 26 -10 36h-48q-10 -10 -10 -36z"/><ellipse cx="0" cy="-30" rx="20" ry="24" class="sk"/>`;
  const face=o.sad?`<path class="ln" d="M-10 -32h6M4 -32h6"/><path class="ln" d="M-7 -14q7 -5 14 0"/>`
    :o.closed?`<path class="ln" d="M-11 -32q4 3 8 0M3 -32q4 3 8 0"/><path class="ln" d="M-6 -16q6 4 12 0"/>`
    :`<circle cx="-7" cy="-32" r="2.6" class="ink"/><circle cx="7" cy="-32" r="2.6" class="ink"/><path class="ln" d="M-6 -17q6 5 12 0"/>`;
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
   <path class="${o.cls||'ad'}" d="M-52 120V40q0 -36 30 -40h44q30 4 30 40v80z"/>
   ${head}${face}${o.over||''}</g>`;
}
function cotTop(x,y,w,h){
  let bars='';for(let i=x+14;i<x+w-6;i+=16)bars+=`M${i} ${y+2}v8M${i} ${y+h-10}v8`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="wd"/><rect x="${x+12}" y="${y+12}" width="${w-24}" height="${h-24}" rx="6" class="sh"/><path class="ln thin" d="${bars}"/>`;
}
function thermo(x,y,txt,rot=0,s=1){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-14" y="-60" width="28" height="92" rx="12" class="th"/><rect x="-9" y="-50" width="18" height="30" rx="3" class="scr"/>${T(0,-29,txt,{c:'scrt',s:11})}<path class="ln" d="M0 32v26"/><circle cx="0" cy="60" r="5" class="mt"/></g>`;
}
const drop=(x,y,s=1,cls='milk')=>`<path transform="translate(${x} ${y}) scale(${s})" class="${cls}" d="M0 -26C10 -10 18 0 18 10a18 18 0 0 1 -36 0C-18 0 -10 -10 0 -26z"/>`;
const bottle=(x,y,s=1,cls='milk')=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="tt2" d="M-6 -58q6 -10 12 0v8h-12z"/><rect x="-13" y="-50" width="26" height="8" rx="3" class="cap"/><rect x="-16" y="-42" width="32" height="64" rx="10" class="gl"/><rect x="-16" y="-14" width="32" height="36" rx="10" class="${cls}"/></g>`;
const cup=(x,y,s=1,fill='tea')=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="gl" d="M-20 -24h40l-5 44h-30z"/><path class="${fill}" d="M-18 -12h36l-4 30h-28z"/><path class="ln" d="M20 -14q14 0 12 14q-2 10 -14 10"/><path class="ln thin" d="M-6 -40q-4 6 0 10M6 -40q-4 6 0 10"/></g>`;
const jar=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-20" y="-30" width="40" height="10" rx="3" class="cap"/><path class="honey" d="M-22 -20h44v40q0 8 -8 8h-28q-8 0 -8 -8z"/>${T(0,8,L('common.honey'),{s:12})}</g>`;
const dummy=(x,y,s=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse cx="0" cy="0" rx="22" ry="14" class="c2"/><path class="tt2" d="M-8 -12q8 -26 16 0z"/><circle cx="0" cy="12" r="10" class="ln"/></g>`;
const phone=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-24" width="28" height="48" rx="6" class="ph"/><rect x="-10" y="-17" width="20" height="30" rx="2" class="scr"/><circle cx="0" cy="18" r="2.4" class="ink"/></g>`;
// a mitten hand; fingertips at x=+16 before rotation
const hand=(x,y,s=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="sl" d="M-76 -15h40v30h-40z"/><rect x="-38" y="-11" width="54" height="22" rx="11" class="sk"/><ellipse cx="-14" cy="-12" rx="11" ry="6" class="sk"/><path class="ln thin" d="M2 -3h10M2 4h10"/></g>`;
const sun=(x,y,r=18)=>{let ray='';for(let a=0;a<360;a+=45){const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);ray+=`M${(x+c*(r+6)).toFixed(1)} ${(y+s*(r+6)).toFixed(1)}L${(x+c*(r+16)).toFixed(1)} ${(y+s*(r+16)).toFixed(1)}`}
  return `<circle cx="${x}" cy="${y}" r="${r}" class="su"/><path class="sur" d="${ray}"/>`};
const arrow=(d,cls='arw')=>`<path class="${cls}" d="${d}" marker-end="url(#ah)"/>`;
const defs=`<defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ahd"/></marker></defs>`;
const D={};

// ---------- sleep ----------
D.sleep=svg(L('sleep.1'),
  cotTop(70,14,150,196)+babyTop(145,125,1,0,{blanket:false})+
  `<path class="acl" d="M236 30v160"/>`+T(290,62,L('sleep.2'))+T(290,84,L('sleep.3'))+T(290,106,L('sleep.4'))+T(290,128,L('sleep.5'))+
  ok(300,170,18)+
  `<g transform="translate(30 60)"><rect x="-20" y="-12" width="40" height="24" rx="10" class="c2"/>${no(16,-14,10)}</g>`+
  `<g transform="translate(30 120)"><circle r="14" class="su"/><circle cx="-10" cy="-12" r="6" class="su"/><circle cx="10" cy="-12" r="6" class="su"/>${no(16,-14,10)}</g>`+
  `<g transform="translate(30 178)"><path class="c2" d="M-20 -10q20 -12 40 0v20q-20 -12 -40 0z"/>${no(16,-14,10)}</g>`);
D.bedshare=svg(L('bedshare.1'),
  `<path class="ln thin" d="M180 10v200"/>`+
  // sofa (danger)
  `<rect x="14" y="96" width="150" height="56" rx="16" class="sofa"/><rect x="14" y="70" width="150" height="40" rx="14" class="sofa"/><rect x="8" y="90" width="22" height="62" rx="10" class="sofa"/><rect x="148" y="90" width="22" height="62" rx="10" class="sofa"/><path class="ln" d="M30 152v14M150 152v14"/>`+
  `<ellipse cx="80" cy="92" rx="54" ry="13" class="c2"/><circle cx="130" cy="78" r="15" class="sk"/><path class="ln" d="M124 78q4 3 8 0"/>`+
  `<ellipse cx="74" cy="78" rx="16" ry="9" class="cl"/><circle cx="58" cy="74" r="9" class="sk"/>`+
  no(150,40,18)+T(90,196,L('bedshare.2'))+
  // parent bed + side cot (safe)
  `<rect x="196" y="110" width="104" height="40" rx="8" class="wd"/><rect x="196" y="98" width="104" height="18" rx="8" class="sh"/><path class="ln" d="M200 150v14M296 150v14"/>`+
  `<rect x="300" y="96" width="50" height="40" rx="6" class="wd"/><path class="ln thin" d="M308 96v40M318 96v40M328 96v40M338 96v40"/><path class="ln" d="M304 136v28M346 136v28"/>`+
  `<ellipse cx="326" cy="92" rx="18" ry="7" class="cl"/><circle cx="342" cy="88" r="7" class="sk"/>`+
  ok(326,40,18)+T(270,196,L('bedshare.3')));
D.heat=svg(L('heat.1'),
  babyTop(110,108,.9,0)+hand(147,104,.8,180)+
  T(110,212,L('heat.2'))+
  `<g transform="translate(270 95)"><rect x="-34" y="-60" width="68" height="100" rx="12" class="th"/><rect x="-24" y="-48" width="48" height="34" rx="4" class="scr"/>${T(0,-24,'16-20°',{c:'scrt',s:15})}${T(0,18,L('heat.3'),{s:12})}</g>`+
  `<g transform="translate(300 182)"><path class="c2" d="M-26 8q0 -30 26 -30t26 30z"/><rect x="-30" y="6" width="60" height="10" rx="5" class="c2"/>${no(28,-18,11)}</g>`);

// ---------- feeding ----------
D.nowater=svg(L('nowater.1'),
  drop(64,84,2.1)+ok(98,40,16)+T(64,170,L('nowater.2'),{s:18})+T(64,192,L('nowater.3'),{s:13})+
  `<path class="ln thin" d="M126 18v190"/>`+
  `<g>${bottle(170,96,.9,'wtr')}${T(170,138,L('nowater.4'),{s:13})}${no(186,40,11)}</g>`+
  `<g>${cup(238,92,.9,'tea2')}${T(238,138,L('nowater.5'),{s:13})}${no(256,48,11)}</g>`+
  `<g>${jar(306,94,.9)}${T(306,138,L('nowater.6'),{s:13})}${no(324,58,11)}</g>`+
  `<g>${cup(170,184,.75,'tea')}${T(212,192,L('nowater.7'),{s:13})}${no(186,150,10)}</g>`+
  `<g>${bottle(276,186,.6,'wtr')}${T(318,192,L('nowater.8'),{s:13})}${no(290,150,10)}</g>`);
D.heatfeed=svg(L('heatfeed.1'),
  sun(56,56,24)+T(56,120,L('heatfeed.2'))+
  `<path class="ln thin" d="M110 20v180"/>`+
  cup(170,100,1.1,'wtr2')+no(196,58,13)+T(170,170,L('heatfeed.3'))+
  drop(280,94,1.6)+`<path class="acl" d="M318 52v24M306 64h24" style="stroke-width:5"/>`+T(280,170,L('heatfeed.4')));
D.honey=svg(L('honey.1'),
  jar(84,110,1.6)+dummy(150,72,1,30)+`<path class="honey" d="M148 84q-6 14 0 22q6 -8 0 -22z"/>`+no(130,40,16)+
  `<g transform="translate(270 108)"><rect x="-56" y="-60" width="112" height="120" rx="12" class="sh"/><rect x="-56" y="-60" width="112" height="30" rx="12" class="rdf"/><path class="ln thin" d="M-30 -66v14M30 -66v14"/>${T(0,-38,L('honey.2'),{c:'lbw',s:15})}${T(0,24,L('honey.3'),{s:30})}</g>`+
  T(84,200,L('honey.4')));
D.nappies=svg(L('nappies.1'),
  (()=>{let o='';const nap=(x,y,cls)=>`<path class="nap" d="M${x-12} ${y-10}h24v6q0 14 -12 14q-12 0 -12 -14z"/><path class="${cls}" d="M${x-7} ${y}q7 6 14 0"/>`;
    const rows=[[L('nappies.2'),L('nappies.3'),3,'wet'],[L('nappies.4'),L('nappies.5'),6,'wet'],[L('nappies.6'),L('nappies.7'),2,'poo']];
    rows.forEach(([d,n,k,c],i)=>{const y=44+i*58;o+=T(346,y+6,d,{a:'start',s:14});o+=T(14,y+6,n,{a:'end',s:15,c:'lbb'});
      for(let j=0;j<k;j++)o+=nap(236-j*28,y,c)});
    o+=`<path class="ln thin" d="M20 140H340"/>`;
    return o+T(180,212,L('nappies.8'),{s:14})})());
D.burp=svg(L('burp.1'),
  // over the shoulder
  adultFront(96,96,1,{over:''})+
  `<g><ellipse cx="72" cy="122" rx="22" ry="34" class="cl"/><circle cx="68" cy="78" r="18" class="sk"/><path class="hr" d="M54 70q8 -10 22 -4"/>${limb('M88 112q14 6 14 22')}</g>`+
  hand(70,128,.6,-90)+`<path class="acl" d="M40 112q-8 8 0 16M34 106q-14 14 0 28"/>`+
  T(96,212,L('burp.2'))+
  `<path class="ln thin" d="M184 16v190"/>`+
  // sitting on the lap, side view
  `<rect x="220" y="160" width="120" height="22" rx="10" class="ad"/>`+
  `<ellipse cx="276" cy="130" rx="22" ry="30" class="cl"/><circle cx="284" cy="88" r="20" class="sk"/><circle cx="294" cy="86" r="2.4" class="ink"/><path class="hr" d="M266 80q6 -14 24 -10"/>`+
  `<path class="sk" d="M300 108q22 -2 24 8q-2 8 -24 6z"/><path class="sl" d="M324 108h20v16h-20z"/>`+
  hand(248,124,.55,-90)+T(270,212,L('burp.3')));
D.spit=svg(L('spit.1'),
  `<path class="ln thin" d="M180 16v190"/>`+
  `<g transform="translate(270 96)"><circle r="40" class="sk"/><path class="ln" d="M-16 -8q6 4 12 0M4 -8q6 4 12 0"/><path class="ln" d="M-8 16q8 6 16 0"/><path class="milk" d="M4 20q4 16 -2 26q-8 -8 -2 -26z"/><path class="hr" d="M-24 -32q14 -16 36 -8"/></g>`+
  ok(320,40,16)+T(270,180,L('spit.2'))+T(270,202,L('spit.3'),{s:13})+
  `<g transform="translate(140 96)"><circle r="40" class="sk"/><path class="ln" d="M-16 -10h10M6 -10h10"/><ellipse cx="-12" cy="14" rx="8" ry="10" class="ink"/><path class="hr" d="M-24 -32q14 -16 36 -8"/></g>`+
  [[112,108,7],[96,112,8],[78,120,9],[60,132,9],[44,146,9],[30,162,8]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" class="bilef"/>`).join('')+
  no(40,40,16)+T(90,186,L('spit.4'),{s:14})+T(90,206,L('spit.5'),{s:13}));
D.formula=svg(L('formula.1'),
  `<g transform="translate(296 100)"><path class="gl" d="M-40 -30h70v50q0 20 -20 20h-30q-20 0 -20 -20z"/><path class="ln" d="M30 -20q24 0 22 24q-2 18 -22 18"/><path class="ln" d="M-30 -30q-10 -14 6 -18"/>${T(-6,8,'70°',{s:18,c:'lbb'})}</g>`+
  T(296,176,L('formula.2'),{s:14})+T(296,196,L('formula.3'),{s:13})+T(296,214,L('formula.4'),{s:13})+
  `<g transform="translate(184 98)"><path class="milk" d="M-30 -6h40q0 26 -20 26t-20 -26z"/><rect x="10" y="-4" width="40" height="8" rx="4" class="cap"/><path class="ln" d="M-40 -12l60 -2" style="stroke-width:4"/></g>`+
  T(180,176,L('formula.5'),{s:14})+T(180,196,L('formula.6'),{s:13})+T(180,214,L('formula.7'),{s:13})+
  bottle(60,110,1.1)+T(60,176,L('formula.8'),{s:14})+T(60,196,L('formula.9'),{s:13})+T(60,214,L('formula.10'),{s:13}));
// ---------- crying ----------
D.cryingpeak=(()=>{const x0=40,x1=340,y0=176,y1=30,wk=[0,2,4,6,8,10,12,14,16];
  const X=w=>x1-(w/16)*(x1-x0);const Y=h=>y0-(h/3.4)*(y0-y1);
  // shape only: about 3 hours a day at 6 weeks, 1-2 hours a day by 3-4 months (AAP); rises from about 2 weeks (NHS)
  const pts=[[0,1.4],[2,1.7],[4,2.4],[6,3],[8,2.6],[10,2],[12,1.6],[14,1.4],[16,1.3]];
  const d='M'+pts.map(([w,h])=>`${X(w).toFixed(1)} ${Y(h).toFixed(1)}`).join('L');
  return svg(L('cryingpeak.1'),
   [1,2,3].map(h=>`<path class="grid" d="M${x0} ${Y(h)}H${x1}"/>`+T(x1+12,Y(h)+5,h+L('cryingpeak.2'),{s:12,a:'start'})).join('')+
   `<path class="grid" d="M${x0} ${y0}H${x1}"/>`+
   `<path class="area" d="${d}L${X(16)} ${y0}L${X(0)} ${y0}z"/><path class="acl" d="${d}" style="stroke-width:4"/>`+
   `<circle cx="${X(6)}" cy="${Y(3)}" r="7" class="ac"/>`+T(X(6),Y(3)-14,L('cryingpeak.3'),{s:13})+
   wk.map(w=>T(X(w),y0+20,String(w),{s:12})).join('')+T(190,214,L('cryingpeak.4'),{s:13})+
   T(X(14),Y(1.4)-16,L('cryingpeak.5'),{s:14,c:'lbb'}));})();
D.soothe=svg(L('soothe.1'),
  adultFront(150,96,1.05,{closed:true})+
  `<g><ellipse cx="150" cy="154" rx="40" ry="22" class="cl"/><circle cx="114" cy="142" r="18" class="sk"/><path class="ln" d="M106 142q4 3 8 0"/></g>`+
  limb('M104 126q-20 30 10 44')+limb('M196 126q20 30 -10 44')+
  `<path class="acl" d="M60 126q-14 20 0 40M44 118q-22 28 0 56"/><path class="acl" d="M240 126q14 20 0 40M256 118q22 28 0 56"/>`+
  T(306,70,L('soothe.2'),{s:20,c:'lbb'})+`<path class="acl" d="M276 80q-30 10 -60 30" marker-end="url(#ah)"/>`+T(180,206,L('soothe.3'),{s:14}));
D.shake=svg(L('shake.1'),
  cotTop(20,40,120,150)+babyTop(80,120,.8,0,{awake:true})+ok(140,40,14)+
  `<rect x="164" y="30" width="62" height="160" rx="4" class="door"/><circle cx="214" cy="112" r="5" class="ink"/>`+
  adultFront(296,112,.8,{closed:true})+phone(326,140,.8)+
  T(80,212,L('shake.2'))+T(196,212,L('shake.3'))+T(300,212,L('shake.4')));
// ---------- fever ----------
D.fever3m=svg(L('fever3m.1'),
  thermo(60,92,'38.0',0,1.25)+
  `<g transform="translate(176 92)"><rect x="-46" y="-50" width="92" height="96" rx="10" class="sh"/><rect x="-46" y="-50" width="92" height="26" rx="10" class="rdf"/>${T(0,-32,L('fever3m.2'),{c:'lbw',s:14})}${T(0,8,L('fever3m.3'),{s:14})}${T(0,34,L('fever3m.4'),{s:18,c:'lbb'})}</g>`+
  arrow('M232 92h30')+
  `<g transform="translate(310 92)"><rect x="-34" y="-40" width="68" height="70" rx="6" class="sh"/><path class="rdl" d="M0 -26v32M-16 -10h32" style="stroke-width:8"/></g>`+
  T(310,152,L('fever3m.5'),{s:15,c:'lbb'})+T(180,206,L('fever3m.6'),{s:15}));
D.armpit=svg(L('armpit.1'),
  `<g transform="translate(180 112)">
   ${limb('M-11 34Q-16 52 -14 70','cl',15)}${limb('M11 34Q16 52 14 70','cl',15)}
   ${limb('M18 -4Q38 6 36 26')}<circle cx="36" cy="30" r="7" class="sk"/>
   <g transform="translate(-22 -2) rotate(-50)"><rect x="-6" y="-58" width="12" height="58" rx="5" class="th"/><rect x="-4" y="-50" width="8" height="14" rx="2" class="scr"/></g>
   <rect x="-24" y="-16" width="48" height="58" rx="20" class="cl"/>
   ${limb('M-22 -2Q-30 14 -24 30')}<circle cx="-23" cy="34" r="7" class="sk"/>
   <circle cx="0" cy="-36" r="24" class="sk"/><path class="hr" d="M-14 -55q8 -8 16 -2q4 -6 12 -2q-10 -2 -12 6q-6 -6 -16 -2z"/>
   <path class="ln" d="M-13 -38q5 4 9 0M4 -38q5 4 9 0"/><path class="ln" d="M-4 -24q4 3 8 0"/></g>`+
  hand(142,140,.7,0)+
  T(66,52,L('armpit.2'),{s:14})+T(66,72,L('armpit.3'),{s:14})+arrow('M86 82q30 4 46 14')+
  T(292,70,L('armpit.4'),{s:15})+T(292,100,L('armpit.5'),{s:15})+T(292,130,L('armpit.6'),{s:15}));
D.fevermyth=svg(L('fevermyth.1'),
  `<g transform="translate(64 100)"><circle r="36" class="sk"/><path class="hr" d="M-28 -24q20 -20 50 -6"/><path class="ln" d="M-14 0q5 3 10 0M4 0q5 3 10 0"/></g>`+hand(64,74,.75,0)+no(100,44,13)+T(64,170,L('fevermyth.2'),{s:13})+
  `<g transform="translate(180 100)"><rect x="-44" y="-30" width="88" height="66" rx="14" class="c2"/><path class="ln thin" d="M-44 -10h88M-44 10h88"/><circle cx="0" cy="-42" r="18" class="sk"/></g>`+no(216,48,13)+T(180,170,L('fevermyth.3'),{s:13})+
  `<g transform="translate(296 100)"><rect x="-18" y="-30" width="36" height="66" rx="8" class="gl"/><rect x="-10" y="-44" width="20" height="16" rx="3" class="cap"/>${T(0,10,L('fevermyth.4'),{s:12})}</g>`+no(322,48,13)+T(296,170,L('fevermyth.5'),{s:13})+
  T(180,206,L('fevermyth.6'),{s:13}));

// ---------- jaundice ----------
D.jaundice=svg(L('jaundice.1'),
  `<g transform="translate(290 92)"><circle r="44" class="sk"/><circle r="16" class="yel"/><path class="ln thin" d="M-10 -24q10 -6 20 0"/></g>`+
  `<g transform="translate(290 92)"><path class="sk" d="M6 -14l40 -60q8 -6 14 2l-40 60z"/></g>`+
  T(290,168,L('jaundice.2'),{s:14})+T(290,190,L('jaundice.3'),{s:14})+T(290,212,L('jaundice.4'),{s:14,c:'lbb'})+
  `<path class="ln thin" d="M180 20v190"/>`+
  `<g transform="translate(90 90)"><path class="eyeo" d="M-60 0q60 -50 120 0q-60 50 -120 0z"/><circle r="20" class="iris"/><circle r="9" class="ink"/></g>`+
  T(90,168,L('jaundice.5'),{s:14})+T(90,190,L('jaundice.6'),{s:14}));
D.nosun=svg(L('nosun.1'),
  `<rect x="24" y="30" width="90" height="80" rx="4" class="sky"/><path class="ln" d="M69 30v80M24 70h90"/>`+sun(69,70,14)+
  `<path class="sunb" d="M60 110L40 170h90L120 110z"/>`+babyTop(84,160,.5,90)+no(140,40,16)+T(84,206,L('nosun.2'),{s:14})+
  `<path class="ln thin" d="M180 20v180"/>`+
  `<rect x="214" y="40" width="120" height="22" rx="8" class="lamp"/><path class="blue" d="M224 62L206 150h136L324 62z"/><rect x="200" y="150" width="148" height="20" rx="6" class="wd"/>`+babyTop(274,136,.5,90)+ok(330,30,16)+T(274,206,L('nosun.3'),{s:14}));

// ---------- cord & hernia ----------
D.cord=svg(L('cord.1'),
  `<g transform="translate(180 110)"><rect x="-110" y="-90" width="220" height="200" rx="80" class="sk"/>
   <circle cx="0" cy="-10" r="12" class="cordc"/><path class="cordc" d="M-2 -18q10 -18 22 -12q-4 8 -16 14z"/>
   <path class="nap" d="M-110 30h220v80h-220z"/><path class="napf" d="M-110 30h220v14h-220z"/></g>`+
  arrow('M300 70q-60 0 -100 24')+T(300,52,L('cord.2'),{s:15})+arrow('M64 200q20 -30 50 -48')+T(60,214,L('cord.3'),{s:14}));
D.hernia=svg(L('hernia.1'),
  `<g transform="translate(110 110)"><ellipse rx="90" ry="80" class="sk"/><ellipse cx="0" cy="0" rx="18" ry="16" class="sk2"/><path class="ln thin" d="M-6 0q6 4 12 0"/></g>`+
  T(110,212,L('hernia.2'),{s:13})+
  `<g transform="translate(270 90)"><circle r="30" class="coin"/>${T(0,8,'1',{s:24,c:'lbb'})}<rect x="-50" y="-8" width="100" height="16" rx="3" class="tape" transform="rotate(-20)"/></g>`+no(310,46,16)+
  T(270,160,L('hernia.3'),{s:14}));

// ---------- nappies & skin ----------
D.wipe=svg(L('wipe.1'),
  `<path class="nap" d="M70 30h160l-30 70v20l30 70h-160l30 -70v-20z"/><path class="napf" d="M70 30h160l-6 14h-148z"/>`+
  arrow('M150 54v126','arwb')+
  T(300,62,L('wipe.2'),{s:18,c:'lbb'})+T(300,180,L('wipe.3'),{s:18,c:'lbb'})+`<path class="ln thin" d="M276 70v94"/>`+
  T(300,120,L('wipe.4'),{s:14})+T(300,140,L('wipe.5'),{s:14})+T(150,212,L('wipe.6'),{s:14}));
D.rash=svg(L('rash.1'),
  `<g transform="translate(110 110)"><rect x="-80" y="-60" width="160" height="110" rx="40" class="sk"/><path class="rashp" d="M-40 10q20 -20 40 0t40 0"/></g>`+
  `<g transform="translate(120 70) rotate(30)"><path class="sk" d="M0 -10h60q10 0 10 10t-10 10h-60z"/><ellipse cx="66" cy="0" rx="10" ry="8" class="crm"/></g>`+
  T(110,200,L('rash.2'),{s:14})+
  `<g transform="translate(290 100)"><rect x="-26" y="-50" width="52" height="96" rx="12" class="gl"/><rect x="-22" y="-62" width="44" height="14" rx="6" class="cap"/>${T(0,8,L('rash.3'),{s:14})}<path class="pow" d="M-6 -70q-10 -20 -30 -20M6 -70q0 -24 10 -30"/></g>`+no(326,40,16)+T(290,200,L('rash.4'),{s:14}));
D.acne=svg(L('acne.1'),
  `<g transform="translate(130 110)"><circle r="82" class="sk"/><path class="hr" d="M-60 -50q40 -50 110 -20q-30 -10 -50 4q-20 -14 -60 16z"/><path class="ln" d="M-38 -6q8 6 16 0M22 -6q8 6 16 0"/><path class="ln" d="M-10 40q10 6 20 0"/>
   ${[[-40,20],[-30,32],[-50,30],[40,18],[50,30],[30,30],[0,-40],[10,-30],[-10,-32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" class="spot"/>`).join('')}</g>`+
  T(290,70,L('acne.2'),{s:16,c:'lbb'})+T(290,96,L('acne.3'),{s:14})+T(290,122,L('acne.4'),{s:14})+T(290,160,L('acne.5'),{s:14})+T(290,182,L('acne.6'),{s:14}));
D.cradle=svg(L('cradle.1'),
  `<g transform="translate(140 120)"><circle r="80" class="sk"/>${[[-40,-50],[-20,-62],[4,-66],[28,-60],[48,-46],[-50,-30],[56,-24]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="7" class="scale"/>`).join('')}
   <path class="ln" d="M-36 4q8 6 16 0M20 4q8 6 16 0"/><path class="ln" d="M-10 40q10 6 20 0"/></g>`+
  `<g transform="translate(250 50) rotate(20)"><rect x="-40" y="-10" width="80" height="22" rx="10" class="c2"/><path class="ln thin" d="M-34 12v10M-24 12v10M-14 12v10M-4 12v10M6 12v10M16 12v10M26 12v10M34 12v10"/></g>`+
  T(290,120,L('cradle.2'),{s:14})+T(290,144,L('cradle.3'),{s:14})+T(290,178,L('cradle.4'),{s:14}));

// ---------- nose ----------
D.nose=svg(L('nose.1'),
  `<g transform="translate(270 112)"><circle r="54" class="sk"/><path class="hr" d="M-40 -34q30 -36 80 -12"/><path class="ln" d="M-26 -6q6 4 12 0M14 -6q6 4 12 0"/><ellipse cx="-6" cy="16" rx="4" ry="3" class="ink"/><ellipse cx="6" cy="16" rx="4" ry="3" class="ink"/></g>`+
  `<g transform="translate(270 72) rotate(-12)"><rect x="-6" y="-40" width="12" height="44" rx="4" class="gl"/><path class="c2" d="M-8 -40q8 -20 16 0z"/></g><circle cx="265" cy="124" r="3" class="wtrd"/>`+
  T(270,200,L('nose.2'),{s:15})+
  `<path class="ln thin" d="M180 20v180"/>`+
  `<g transform="translate(90 112)"><circle r="54" class="sk"/><path class="hr" d="M-40 -34q30 -36 80 -12"/><path class="ln" d="M-26 -6q6 4 12 0M14 -6q6 4 12 0"/><ellipse cx="-6" cy="16" rx="4" ry="3" class="ink"/><ellipse cx="6" cy="16" rx="4" ry="3" class="ink"/></g>`+
  `<g transform="translate(96 52) rotate(14)"><ellipse cx="0" cy="-12" rx="18" ry="22" class="bulb"/><path class="bulb" d="M-5 8h10l-3 64h-4z"/></g>`+hand(52,40,.55,0)+
  `<path class="acl" d="M70 22l-8 -8M126 22l8 -8" style="stroke-width:3"/>`+
  T(90,200,L('nose.3'),{s:15}));
// ---------- hiccups ----------
D.hiccup=svg(L('hiccup.1'),
  babyTop(110,104,.9,0,{awake:true})+T(176,46,L('hiccup.2'),{s:20,c:'lbb'})+T(196,74,L('hiccup.3'),{s:15,c:'lbb'})+
  T(110,206,L('hiccup.4'),{s:14})+
  `<path class="ln thin" d="M240 20v180"/>`+
  `<g transform="translate(296 100)"><circle r="34" class="sk"/><path class="thread" d="M-26 -14q14 -8 26 0q12 8 26 0"/><path class="ln" d="M-14 6q5 3 10 0M4 6q5 3 10 0"/></g>`+no(330,50,14)+T(296,170,L('hiccup.5'),{s:13})+T(296,190,L('hiccup.6'),{s:13}));
// ---------- sucking ----------
D.thumb=svg(L('thumb.1'),
  `<g transform="translate(270 104)"><circle r="62" class="sk"/><path class="hr" d="M-44 -40q32 -40 86 -14"/><path class="ln" d="M-28 -10q7 5 14 0M14 -10q7 5 14 0"/>
   <path class="sk" d="M-10 16q-10 30 -30 40q-10 -14 -2 -24q8 -12 18 -20z"/><circle cx="-6" cy="20" r="10" class="sk"/></g>`+
  ok(326,36,15)+T(270,200,L('thumb.2'),{s:15})+
  `<path class="ln thin" d="M180 20v180"/>`+
  `<g transform="translate(110 100)"><circle r="52" class="sk"/><path class="hr" d="M-38 -34q28 -34 72 -12"/><path class="ln" d="M-24 -10l10 4M24 -10l-10 4"/><ellipse cx="0" cy="22" rx="12" ry="10" class="mouth"/>
   <path class="rain" d="M-24 -2v12M24 -2v12"/></g>`+
  `<circle cx="40" cy="150" r="9" class="sk"/>`+hand(66,152,.6,180)+`<path class="arwr" d="M58 132l-30 -20" marker-end="url(#ah)"/>`+
  no(150,36,15)+T(100,200,L('thumb.3'),{s:15}));
D.dummy=svg(L('dummy.1'),
  dummy(70,96,1.6)+ok(108,50,15)+T(70,170,L('dummy.2'),{s:14})+
  dummy(190,96,1.3)+`<path class="honey" d="M180 84q-6 18 4 26q6 -10 -4 -26z"/>`+no(222,54,13)+T(190,170,L('dummy.3'),{s:14})+
  dummy(300,96,1.3)+`<path class="ln" d="M300 108q-30 40 -10 70M300 108q30 40 10 70" style="stroke-dasharray:4 5"/>`+no(334,54,13)+T(300,196,L('dummy.4'),{s:14}));

// ---------- tummy time ----------
D.tummy=svg(L('tummy.1'),
  // on a parent's chest, reclined
  `<path class="ad" d="M20 190q10 -70 60 -90l70 -20q20 30 0 60l-60 50z"/><path class="sc" d="M140 60q20 -30 46 -10q10 24 -10 40z"/><ellipse cx="162" cy="62" rx="16" ry="18" class="sk"/><circle cx="168" cy="58" r="2.2" class="ink"/>`+
  babyTummy(96,90,.7)+T(96,212,L('tummy.2'),{s:14})+
  `<path class="ln thin" d="M196 20v180"/>`+
  `<rect x="210" y="160" width="140" height="10" rx="5" class="mat"/>`+babyTummy(282,136,.8)+
  T(282,212,L('tummy.3'),{s:14}));

// ---------- visitors ----------
D.kiss=svg(L('kiss.1'),
  adultFront(80,96,.9,{man:true})+`<g transform="translate(130 92)"><circle r="20" class="sk"/><path class="ln" d="M-8 0q4 3 8 0"/><ellipse cx="0" cy="34" rx="18" ry="16" class="cl"/></g>`+
  `<path class="rdl" d="M104 70q8 -8 14 0q6 -8 14 0q0 10 -14 20q-14 -10 -14 -20z" style="stroke-width:3"/>`+no(160,40,15)+T(100,206,L('kiss.2'),{s:15})+
  `<path class="ln thin" d="M190 20v180"/>`+
  `<g transform="translate(276 110)">${hand(-10,-10,.8,0)}${hand(10,10,.8,180)}<circle cx="-30" cy="-34" r="7" class="bub"/><circle cx="-12" cy="-44" r="5" class="bub"/><circle cx="20" cy="-38" r="9" class="bub"/><path class="wtrl" d="M0 -80v30M-10 -78v20M10 -78v20"/></g>`+
  ok(330,40,15)+T(276,206,L('kiss.3'),{s:15}));
D.coldsore=svg(L('coldsore.1'),
  `<g transform="translate(110 110)"><path class="lip" d="M-70 0q35 -30 70 -10q35 -20 70 10q-35 40 -70 30q-35 10 -70 -30z"/><path class="ln thin" d="M-70 0q70 10 140 0"/>
   <circle cx="42" cy="-14" r="10" class="sore"/><circle cx="52" cy="-8" r="7" class="sore"/></g>`+
  T(110,190,L('coldsore.2'),{s:14})+
  babyTop(280,120,.85,0)+no(326,44,16)+T(280,206,L('coldsore.3'),{s:14}));
D.smoke=svg(L('smoke.1'),
  `<g transform="translate(70 120)"><path class="gl" d="M-26 50q-10 -40 26 -50q36 10 26 50z"/><rect x="-6" y="-60" width="12" height="60" class="cap"/><path class="c2" d="M-18 -60h36l-6 -16h-24z"/><path class="ln" d="M6 -20q40 0 50 40"/></g>`+
  `<path class="smk" d="M60 40q20 -20 40 0t40 0t40 0t40 10"/><path class="smk" d="M80 60q20 -16 40 0t40 0t40 6"/>`+
  babyTop(282,124,.8,0)+no(150,110,18)+
  T(90,206,L('smoke.2'),{s:14})+T(282,206,L('smoke.3'),{s:14}));

// ---------- vaccines ----------
D.vaccard=svg(L('vaccard.1'),
  `<g transform="translate(180 110)"><rect x="-140" y="-90" width="280" height="180" rx="14" class="sh"/><rect x="-140" y="-90" width="280" height="40" rx="14" class="acf"/>${T(0,-64,L('vaccard.2'),{c:'lbw',s:17})}
   ${[[L('vaccard.3'),-24,true],[L('vaccard.4'),14,false],[L('vaccard.5'),52,false]].map(([t,y,d])=>`${T(120,y+6,t,{a:'start',s:15})}<path class="ln thin" d="M-120 ${y+16}H120"/>${d?ok(-100,y,11):`<rect x="-112" y="${y-11}" width="22" height="22" rx="5" class="box0"/>`}`).join('')}</g>`);
D.vac2m=svg(L('vac2m.1'),
  `<g transform="translate(90 100)"><rect x="-60" y="-64" width="120" height="124" rx="12" class="sh"/><rect x="-60" y="-64" width="120" height="30" rx="12" class="acf"/>${T(0,-42,L('vac2m.2'),{c:'lbw',s:15})}${T(0,8,L('vac2m.3'),{s:26,c:'lbb'})}${T(0,40,L('vac2m.4'),{s:13})}</g>`+
  `<g transform="translate(260 100)"><rect x="-50" y="-8" width="80" height="16" rx="6" class="gl"/><rect x="-30" y="-6" width="30" height="12" class="wtr"/><path class="ln" d="M30 0h30M-50 0h-14M-64 -12v24"/></g>`+
  T(260,150,L('vac2m.5'),{s:14})+T(180,200,L('vac2m.6'),{s:13}));

// ---------- mother ----------
D.mumrest=svg(L('mumrest.1'),
  `<rect x="20" y="130" width="190" height="40" rx="10" class="wd"/><rect x="20" y="110" width="190" height="30" rx="12" class="sh"/><ellipse cx="50" cy="108" rx="24" ry="12" class="sh"/>`+
  `<path class="sc" d="M36 92q14 -24 34 -6q2 16 -14 22z"/><ellipse cx="54" cy="98" rx="13" ry="12" class="sk"/><path class="ln" d="M48 98q3 2 6 0"/><path class="c2" d="M70 106h120q10 0 10 10h-130z"/>`+
  adultFront(290,100,.8,{man:true})+`<g transform="translate(290 150)"><ellipse rx="34" ry="18" class="cl"/><circle cx="-30" cy="-6" r="14" class="sk"/></g>`+
  `<g transform="translate(120 66)"><rect x="-44" y="-4" width="88" height="10" rx="4" class="wd"/><circle cx="-16" cy="-14" r="12" class="crm"/>${cup(20,-18,.5,'wtr2')}</g>`+
  T(115,206,L('mumrest.2'),{s:15})+T(290,206,L('mumrest.3'),{s:14}));
D.blues=svg(L('blues.1'),
  adultFront(170,110,1.1,{sad:true})+`<path class="cloud" d="M120 40q-20 -2 -20 16q0 16 20 16h90q20 0 20 -16q0 -18 -22 -16q-6 -20 -30 -16q-10 -14 -30 -4q-22 0 -28 20z"/>`+
  `<path class="rain" d="M130 82v12M160 82v14M190 82v12"/>`+hand(100,130,.75,10)+
  T(300,70,L('blues.2'),{s:16,c:'lbb'})+T(300,96,L('blues.3'),{s:15})+T(300,130,L('blues.4'),{s:15})+T(300,156,L('blues.5'),{s:15}));
D.dads=svg(L('dads.1'),
  adultFront(160,100,1.1,{man:true,sad:true})+`<g transform="translate(160 156)"><ellipse rx="40" ry="20" class="cl"/><circle cx="-38" cy="-8" r="16" class="sk"/></g>`+
  `<path class="cloud" d="M230 40q-16 -2 -16 12q0 12 16 12h60q16 0 16 -12q0 -14 -18 -12q-6 -16 -24 -12q-20 -6 -34 12z"/>`+
  T(90,48,L('dads.2'),{s:16,c:'lbb'})+T(90,72,L('dads.3'),{s:14}));

// ---------- choking ----------
D.ch1=svg(L('ch1.1'),
  `<rect x="40" y="176" width="270" height="26" rx="13" class="ad"/>`+
  `<path class="lo" d="M50 132L290 182" style="stroke-width:28"/><path class="lsk2" d="M50 132L290 182" style="stroke-width:22"/>`+
  `<g transform="translate(176 137) rotate(12)">${limb('M-40 8q-6 20 -14 30','cl',13)}${limb('M-24 10q2 20 -4 30','cl',13)}<ellipse cx="0" cy="0" rx="58" ry="19" class="cl"/><circle cx="74" cy="6" r="21" class="sk"/><path class="hr" d="M60 -10q14 -10 30 0q-14 -2 -30 0z"/><path class="ln" d="M84 18q4 3 8 0"/></g>`+
  `<g transform="translate(262 184) rotate(12)"><ellipse cx="0" cy="0" rx="16" ry="9" class="sk"/></g>`+
  hand(166,58,.75,90)+`<path class="acl" d="M150 96l-6 8M166 98v10M182 96l6 8" style="stroke-width:4"/>`+
  T(300,92,L('ch1.2'),{s:15,c:'lbb'})+T(300,114,L('ch1.3'),{s:13})+
  T(70,40,L('ch1.4'),{s:16,c:'lbb'})+T(70,62,L('ch1.5'),{s:14})+T(70,84,L('ch1.6'),{s:14}));
D.ch2=svg(L('ch2.1'),
  `<rect x="40" y="176" width="270" height="26" rx="13" class="ad"/>`+
  `<path class="lo" d="M50 132L290 182" style="stroke-width:28"/><path class="lsk2" d="M50 132L290 182" style="stroke-width:22"/>`+
  `<g transform="translate(176 136) rotate(12)">${limb('M-44 -6q-20 -16 -36 -12','cl',13)}${limb('M-40 6q-22 4 -36 14','cl',13)}<ellipse cx="0" cy="0" rx="58" ry="20" class="cl"/><circle cx="76" cy="0" r="21" class="sk"/><path class="ln" d="M74 -8q4 3 8 0"/><path class="hr" d="M92 -14q8 12 0 26q8 -12 0 -26z"/></g>`+
  `<g transform="translate(210 70)"><rect x="-11" y="0" width="9" height="56" rx="4" class="sk"/><rect x="2" y="0" width="9" height="56" rx="4" class="sk"/><rect x="-18" y="-30" width="36" height="34" rx="12" class="sk"/><path class="sl" d="M-16 -66h32v38h-32z"/></g>`+
  arrow('M244 74v40')+T(310,44,L('ch2.2'),{s:16,c:'lbb'})+T(310,66,L('ch2.3'),{s:14})+T(310,88,L('ch2.4'),{s:14})+
  T(90,40,L('ch2.5'),{s:16,c:'lbb'})+T(90,62,L('ch2.6'),{s:14}));
D.ch3=svg(L('ch3.1'),
  `<g transform="translate(110 110)"><circle r="70" class="sk"/><path class="hr" d="M-50 -46q36 -40 96 -14"/><path class="ln" d="M-30 -14q7 5 14 0M16 -14q7 5 14 0"/><ellipse cx="0" cy="26" rx="22" ry="18" class="mouth"/><circle cx="4" cy="26" r="7" class="obj"/></g>`+
  T(270,60,L('ch3.2'),{s:16,c:'lbb'})+T(270,88,L('ch3.3'),{s:14})+T(270,122,L('ch3.4'),{s:14})+T(270,146,L('ch3.5'),{s:14})+T(270,184,L('ch3.6'),{s:15,c:'lbb'}));
D.ch4=svg(L('ch4.1'),
  phone(110,110,3)+`<path class="rdl" d="M110 96v28M96 110h28" style="stroke-width:7"/>`+T(260,70,L('ch4.2'),{s:18,c:'lbb'})+T(260,100,L('ch4.3'),{s:14})+T(260,124,L('ch4.4'),{s:14})+T(260,148,L('ch4.5'),{s:14}));

D.kohlcard=svg(L('kohlcard.1'),
  `<g transform="translate(110 104)"><circle r="76" class="sk"/><path class="hr" d="M-56 -46q40 -44 104 -14"/>
   <path class="ln" d="M-44 -6q16 10 32 0M12 -6q16 10 32 0"/><path class="kohl" d="M-50 -2q22 16 44 0M6 -2q22 16 44 0"/><path class="ln" d="M-10 34q10 6 20 0"/></g>`+
  no(170,40,16)+T(110,204,L('kohlcard.2'),{s:14})+
  `<path class="ln thin" d="M220 20v180"/>`+
  `<g transform="translate(290 100)"><ellipse cx="0" cy="0" rx="34" ry="26" class="crm"/><path class="ln thin" d="M-20 -6q20 -10 40 0M-24 8q24 -8 48 0"/></g>`+
  `<g transform="translate(290 46)"><path class="wtrl" d="M0 -12v16M-10 -8v10M10 -8v10"/></g>`+ok(330,46,14)+T(290,160,L('kohlcard.3'),{s:14})+T(290,182,L('kohlcard.4'),{s:13}));
// ---------- sleep and milk ----------
const arc=(cx,cy,r,a0,a1,cls)=>{const p=a=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)].map(v=>v.toFixed(1)).join(' ');
  return `<path class="${cls}" d="M${p(a0)}A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${p(a1)}"/>`};
const bag=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="milk" d="M-14 -22h28v36q0 8 -8 8h-12q-8 0 -8 -8z"/><path class="ln thin" d="M-14 -14h28"/></g>`;
const clock=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-12" cy="-16" r="6" class="sc"/><circle cx="12" cy="-16" r="6" class="sc"/><circle r="16" class="box0"/><path class="ln" d="M0 0V-9M0 0H7"/><path class="ln" d="M-10 15l-4 6M10 15l4 6"/></g>`;
const moon=(x,y,r=16)=>`<circle cx="${x}" cy="${y}" r="${r}" class="moon"/><circle cx="${x+r*.45}" cy="${y-r*.25}" r="${r*.85}" class="nightc"/>`;
const bed=(x,y,w)=>`<rect x="${x}" y="${y+20}" width="${w}" height="40" rx="10" class="wd"/><rect x="${x}" y="${y}" width="${w}" height="30" rx="12" class="sh"/><ellipse cx="${x+30}" cy="${y-2}" rx="24" ry="12" class="sh"/>`;
const sofa=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="26" width="150" height="56" rx="16" class="sofa"/><rect x="0" y="0" width="150" height="40" rx="14" class="sofa"/><rect x="-6" y="20" width="22" height="62" rx="10" class="sofa"/><rect x="134" y="20" width="22" height="62" rx="10" class="sofa"/><path class="ln" d="M16 82v14M136 82v14"/></g>`;

D.babysleep=(()=>{let r='';for(let i=0;i<8;i++){const a=i*45;r+=arc(110,110,72,a+2,a+31,'sarc')+arc(110,110,72,a+33,a+43,'warc')}
  return svg(L('babysleep.1'),r+T(110,108,'24',{s:28,c:'lbb'})+T(110,132,L('babysleep.2'),{s:14})+
  `<rect x="300" y="44" width="34" height="16" rx="8" class="sarcf"/>`+T(250,58,L('babysleep.3'),{s:14})+
  `<rect x="300" y="86" width="34" height="16" rx="8" class="warcf"/>`+T(250,100,L('babysleep.4'),{s:14})+
  T(266,150,L('babysleep.5'),{s:15,c:'lbb'})+T(266,174,L('babysleep.6'),{s:14}))})();
D.nightday=svg(L('nightday.1'),
  `<rect x="20" y="16" width="140" height="78" rx="8" class="sky"/><path class="ln thin" d="M90 16v78"/>`+sun(56,52,14)+
  `<ellipse cx="90" cy="150" rx="66" ry="26" class="mat"/>`+babyTop(90,148,.5,-90,{awake:true,armsUp:true})+`<circle cx="138" cy="128" r="9" class="sc"/>`+
  T(90,208,L('nightday.2'),{s:15})+
  `<path class="ln thin" d="M180 16v190"/>`+
  `<rect x="200" y="16" width="140" height="78" rx="8" class="night"/><path class="ln thin" d="M270 16v78"/>`+moon(306,52,15)+`<circle cx="232" cy="38" r="2.5" class="moon"/><circle cx="246" cy="66" r="2" class="moon"/>`+
  cotTop(222,104,96,80)+babyTop(270,148,.4,0)+
  T(270,208,L('nightday.3'),{s:15}));
D.momsleep=svg(L('momsleep.1'),
  bed(14,120,186)+`<path class="sc" d="M30 104q14 -24 34 -6q2 16 -14 22z"/><ellipse cx="48" cy="110" rx="13" ry="12" class="sk"/><path class="ln" d="M42 110q3 2 6 0"/><path class="c2" d="M64 118h120q10 0 10 10h-130z"/>`+
  clock(170,70,.9)+T(110,206,L('momsleep.2'),{s:15})+
  adultFront(282,96,.75,{man:true})+
  `<g transform="translate(282 146)"><ellipse rx="36" ry="17" class="cl"/><circle cx="-32" cy="-6" r="14" class="sk"/><path class="ln" d="M-36 -8q3 2 6 0"/></g>`+
  `<g transform="translate(278 116) rotate(-135)">${bottle(0,0,.55)}</g>`+T(282,206,L('momsleep.3'),{s:15}));
D.feedawake=svg(L('feedawake.1'),
  sofa(16,80)+`<ellipse cx="80" cy="96" rx="50" ry="12" class="c2"/><circle cx="126" cy="84" r="14" class="sk"/><path class="ln" d="M120 84q4 3 8 0"/>`+
  `<ellipse cx="72" cy="84" rx="15" ry="8" class="cl"/><circle cx="57" cy="80" r="8" class="sk"/>`+no(150,46,17)+T(92,206,L('feedawake.2'),{s:15})+
  `<path class="ln thin" d="M190 16v190"/>`+
  cup(230,92,.8,'wtr2')+clock(290,90,1.1)+`<g transform="translate(330 100)"><circle r="11" class="crm"/></g>`+ok(270,40,17)+
  T(276,150,L('feedawake.3'),{s:14})+T(276,174,L('feedawake.4'),{s:14})+T(276,206,L('feedawake.5'),{s:14,c:'lbb'}));
D.storebm=svg(L('storebm.1'),
  `<rect x="30" y="12" width="140" height="176" rx="10" class="box0"/><rect x="30" y="12" width="140" height="56" rx="10" class="frost"/><path class="ln" d="M30 68h140M150 24v32M150 80v40"/>`+
  bag(62,46,.8)+bag(88,46,.8)+`<path class="ln thin" d="M40 128h96"/>`+bag(62,112,.8)+ok(98,104,11)+
  `<rect x="140" y="140" width="24" height="40" rx="4" class="sl"/>`+bag(152,160,.55)+no(152,128,10)+
  `<path class="ln" d="M44 188v12M156 188v12"/>`+
  T(268,46,L('storebm.2'),{s:15,c:'lbb'})+T(268,110,L('storebm.3'),{s:15,c:'lbb'})+T(268,134,L('storebm.4'),{s:13})+
  `<path class="ln thin" d="M200 160H340"/>`+T(268,186,L('storebm.5'),{s:14})+T(268,206,L('storebm.6'),{s:14}));
D.thawbm=svg(L('thawbm.1'),
  `<path class="wtr2" d="M18 96h104l-10 48q-2 10 -12 10h-60q-10 0 -12 -10z"/><path class="ln" d="M18 96h104l-10 48q-2 10 -12 10h-60q-10 0 -12 -10z"/>`+bag(70,98,1)+
  `<path class="ln thin" d="M46 70q-6 -8 0 -16M70 66q-6 -8 0 -16M94 70q-6 -8 0 -16"/>`+ok(112,44,14)+T(70,190,L('thawbm.2'),{s:14})+
  `<rect x="140" y="80" width="88" height="62" rx="8" class="box0"/><rect x="150" y="90" width="50" height="42" rx="4" class="sl"/><circle cx="214" cy="100" r="4" class="ink"/><circle cx="214" cy="118" r="4" class="ink"/>`+no(222,64,14)+T(184,190,L('thawbm.3'),{s:14})+
  limb('M262 136H340','sk',16)+`<rect x="330" y="122" width="28" height="28" rx="6" class="sl"/><ellipse cx="256" cy="136" rx="16" ry="13" class="sk"/>`+
  drop(292,74,.6)+arrow('M292 94v18')+T(300,190,L('thawbm.4'),{s:14}));
D.powercut=svg(L('powercut.1'),
  `<rect x="24" y="34" width="96" height="140" rx="10" class="frost"/><path class="ln" d="M104 70v40"/>`+
  `<path class="bolt" d="M76 6l-12 18h10l-8 16"/>`+no(92,20,10)+
  T(72,196,L('powercut.2'),{s:14,c:'lbb'})+T(72,214,L('powercut.3'),{s:12})+
  `<rect x="150" y="96" width="84" height="60" rx="8" class="sc"/><rect x="146" y="86" width="92" height="16" rx="6" class="box0"/><rect x="162" y="110" width="26" height="14" rx="4" class="ice"/><rect x="196" y="110" width="26" height="14" rx="4" class="ice"/>`+
  T(192,196,L('powercut.4'),{s:14,c:'lbb'})+T(192,214,L('powercut.5'),{s:12})+
  bottle(300,110,1)+`<path class="ln thin" d="M288 46q-6 -8 0 -16M304 42q-6 -8 0 -16"/>`+T(300,196,L('powercut.6'),{s:14,c:'lbb'})+T(300,214,L('powercut.7'),{s:12}));

// ---------- batch 1: bath, breastfeeding, swaddle, going out, milestones, vaccines ----------
const pan=(i,icon,label)=>{const cx=300-120*i;return `<g transform="translate(${cx} 92)">${icon}</g>`+T(cx,190,label,{s:13})};
const faceIc=(smile=true,look=0)=>`<circle r="38" class="sk"/><path class="hr" d="M-22 -30q22 -16 44 0q-10 -6 -22 -4q-12 -2 -22 4z"/><circle cx="${-13+look}" cy="-6" r="3" class="ink"/><circle cx="${13+look}" cy="-6" r="3" class="ink"/>${smile?`<path class="ln" d="M-14 12q14 14 28 0"/>`:`<ellipse cy="16" rx="8" ry="10" class="mouth"/>`}`;
const bubble=txt=>`<path class="bub" d="M-44 -28h88q12 0 12 12v28q0 12 -12 12H-8l-16 18v-18h-20q-12 0 -12 -12v-28q0 -12 12 -12z"/>${T(0,6,txt,{s:22,c:'lbb'})}`;
const calc=(cx,cy,top,big,l1,l2)=>`<g transform="translate(${cx} ${cy})"><rect x="-70" y="-84" width="140" height="150" rx="12" class="sh"/><rect x="-70" y="-84" width="140" height="30" rx="12" class="acf"/>${T(0,-62,top,{c:'lbw',s:15})}${T(0,-6,big,{s:36,c:'lbb'})}${T(0,24,l1,{s:14})}${l2?T(0,46,l2,{s:14}):''}</g>`;

D.bath=svg(L('bath.1'),
  `<path class="wtr2" d="M20 124h112l-10 56q-2 10 -12 10H42q-10 0 -12 -10z"/><path class="ln" d="M20 124h112l-10 56q-2 10 -12 10H42q-10 0 -12 -10z"/>`+
  `<ellipse cx="78" cy="120" rx="26" ry="12" class="cl"/><circle cx="78" cy="92" r="24" class="sk"/><path class="hr" d="M60 80q18 -14 36 0q-12 -6 -18 -4q-8 -2 -18 4z"/><path class="ln" d="M68 92q3 3 6 0M82 92q3 3 6 0"/>`+
  hand(150,126,.6,180)+T(80,212,L('bath.2'),{s:13})+
  `<path class="ln thin" d="M184 16v190"/>`+
  limb('M214 104H292','sk',16)+`<ellipse cx="206" cy="104" rx="16" ry="13" class="sk"/>`+drop(262,52,.6,'wtr')+arrow('M262 70v22')+
  T(260,150,L('bath.3'),{s:13})+T(260,172,L('bath.4'),{s:13})+
  `<path class="ln thin" d="M326 16v190" style="display:none"/>`+
  phone(316,60,1.2)+no(330,34,13)+T(316,212,L('bath.5'),{s:12}));
D.latch=svg(L('latch.1'),
  adultFront(98,64,.7,{man:false})+
  `<g transform="translate(92 146)"><ellipse rx="40" ry="17" class="cl"/><circle cx="-36" cy="-4" r="15" class="sk"/><path class="ln" d="M-40 -6q3 2 6 0"/></g>`+
  `<path class="acl" d="M46 134H138" style="stroke-dasharray:7 6"/>`+T(92,200,L('latch.2'),{s:13})+
  `<path class="ln thin" d="M186 16v190"/>`+
  `<g transform="translate(272 92)"><circle r="46" class="sk"/><path class="hr" d="M-28 -34q28 -20 56 0q-14 -8 -28 -5q-14 -3 -28 5z"/><path class="ln" d="M-24 -10q8 6 16 0M8 -10q8 6 16 0"/><ellipse cy="22" rx="17" ry="19" class="mouth"/></g>`+
  T(272,162,L('latch.3'),{s:13})+arrow('M272 200v-22')+T(272,214,L('latch.4'),{s:12}));
D.breastpain=svg(L('breastpain.1'),
  `<g transform="translate(90 56)"><rect x="-40" y="-8" width="80" height="34" rx="8" class="c2"/><path class="ln thin" d="M-18 -16q-6 -10 0 -18M0 -16q-6 -10 0 -18M18 -16q-6 -10 0 -18"/></g>`+T(90,108,L('breastpain.2'),{s:13})+
  `<g transform="translate(270 56)"><rect x="-40" y="-8" width="80" height="34" rx="8" class="frost"/><rect x="-24" y="-2" width="20" height="14" rx="3" class="ice"/><rect x="2" y="-2" width="20" height="14" rx="3" class="ice"/></g>`+T(270,108,L('breastpain.3'),{s:13})+
  `<g transform="translate(90 168)">${drop(-20,0,.7)}${drop(8,8,.7)}${drop(34,-2,.7)}</g>`+ok(130,138,13)+T(90,206,L('breastpain.4'),{s:13})+
  clock(240,160,1.2)+T(300,148,'12-24',{s:20,c:'lbb'})+T(270,206,L('breastpain.5'),{s:12}));
D.cluster=svg(L('cluster.1'),
  `<path class="ln" d="M24 120H340"/>`+
  [40,100,160].map(x=>drop(x,98,.4)).join('')+
  [204,217,230,243,256,269,282,295].map(x=>drop(x,98,.4)).join('')+drop(334,98,.4)+
  `<path class="ln" d="M198 66v-10h106v10"/>`+T(251,40,L('cluster.2'),{s:14,c:'lbb'})+
  T(100,150,L('cluster.3'),{s:13})+ok(251,162,16)+T(251,204,L('cluster.4'),{s:14,c:'lbb'}));
D.swaddle=svg(L('swaddle.1'),
  `<path class="c2" d="M66 96h76l10 100q-48 20 -96 0z"/><path class="ln thin" d="M74 120l68 18M70 150l78 16"/><circle cx="104" cy="70" r="26" class="sk"/><path class="hr" d="M86 58q18 -14 36 0q-12 -6 -18 -4q-8 -2 -18 4z"/><path class="ln" d="M94 72q3 3 6 0M108 72q3 3 6 0"/>`+
  ok(172,60,15)+T(104,214,L('swaddle.2'),{s:13})+
  `<path class="ln thin" d="M196 16v190"/>`+
  babyTop(262,110,.55,-20,{awake:true})+arrow('M214 56q40 -34 86 -2','arwr')+no(318,44,14)+
  T(266,196,L('swaddle.4'),{s:14})+T(266,214,L('swaddle.5'),{s:14,c:'lbb'}));
D.sun=svg(L('sun.1'),
  sun(54,50,22)+clock(54,130,1)+T(54,200,L('sun.2'),{s:12})+
  `<path class="ln thin" d="M112 16v190"/>`+
  `<path class="sc" d="M148 86q48 -56 96 0z"/><path class="ln" d="M196 86v76"/><rect x="170" y="150" width="52" height="34" rx="10" class="cl"/><circle cx="182" cy="196" r="7" class="ink"/><circle cx="210" cy="196" r="7" class="ink"/><circle cx="196" cy="132" r="13" class="sk"/>`+
  ok(250,60,14)+T(196,214,L('sun.3'),{s:13})+
  `<path class="ln thin" d="M266 16v190"/>`+
  `<path class="c2" d="M278 128h72q8 0 8 10v16h-86z"/><path class="c2" d="M290 128q8 -26 28 -26h22q10 0 14 26z"/><circle cx="296" cy="158" r="8" class="ink"/><circle cx="338" cy="158" r="8" class="ink"/>`+
  no(314,64,16)+T(314,198,L('sun.4'),{s:12})+T(314,214,L('sun.5'),{s:12}));
D.carseat=svg(L('carseat.1'),
  `<path class="c2" d="M20 140h206q16 0 16 18v16H20z"/><path class="c2" d="M62 140q12 -44 52 -44h74q18 0 32 44z"/><circle cx="64" cy="176" r="14" class="ink"/><circle cx="196" cy="176" r="14" class="ink"/>`+
  `<path class="cl" d="M132 104q-38 0 -40 36h56z"/><circle cx="108" cy="110" r="12" class="sk"/><path class="ln" d="M102 112q3 2 6 0"/>`+arrow('M106 74H60')+
  ok(250,100,16)+T(120,214,L('carseat.2'),{s:13})+
  `<path class="ln thin" d="M276 16v190"/>`+
  `<g transform="translate(310 92)"><rect x="-22" y="-2" width="44" height="40" rx="12" class="sc"/><circle cy="-16" r="14" class="sk"/><ellipse cy="20" rx="26" ry="10" class="cl"/><circle cx="-24" cy="14" r="8" class="sk"/></g>`+no(344,50,16)+T(318,214,L('carseat.3'),{s:12}));

D.mile2=svg(L('mile2.1'),
  pan(0,faceIc(true),L('mile2.2'))+
  pan(1,babyTummy(0,10,.55),L('mile2.3'))+
  pan(2,`<g transform="translate(-10 0)">${faceIc(true,6)}</g>`+arrow('M36 -4h22'),L('mile2.4')));
D.mile4=svg(L('mile4.1'),
  pan(0,bubble(L('mile4.5')),L('mile4.2'))+
  pan(1,`<circle cy="-16" r="18" class="sc"/><path class="ln" d="M0 2v34" style="stroke-width:5"/><circle cx="-18" cy="42" r="10" class="sk"/>`,L('mile4.3'))+
  pan(2,babyTummy(0,10,.55),L('mile4.4')));
D.mile6=svg(L('mile6.1'),
  pan(0,babyTop(0,8,.42,-25,{awake:true})+arrow('M-44 -42q40 -22 74 6'),L('mile6.2'))+
  pan(1,`<rect x="-34" y="-46" width="68" height="92" rx="16" class="gl"/><g transform="scale(.55)">${faceIc(true)}</g>`,L('mile6.3'))+
  pan(2,babyTop(0,2,.5,0,{awake:true})+`<circle cx="-30" cy="48" r="8" class="sk"/><circle cx="30" cy="48" r="8" class="sk"/>`,L('mile6.4')));
D.mile9=svg(L('mile9.1'),
  pan(0,babyTop(0,2,.5,0,{awake:true}),L('mile9.2'))+
  pan(1,faceIc(true)+`<circle cx="-14" cy="-6" r="14" class="sk2"/><circle cx="14" cy="-6" r="14" class="sk2"/>`,L('mile9.3'))+
  pan(2,bubble(L('mile9.5')),L('mile9.4')));
D.mile12=svg(L('mile12.1'),
  pan(0,babyTop(-12,2,.5,0,{awake:true})+`<rect x="14" y="-8" width="50" height="8" rx="3" class="wd"/><path class="ln" d="M22 0v52M56 0v52"/>`,L('mile12.2'))+
  pan(1,`<circle r="24" class="sk"/><path class="ln" d="M34 -22q14 12 0 26M46 -30q20 18 0 40"/>`,L('mile12.3'))+
  pan(2,cup(0,6,1.4,'wtr2'),L('mile12.4')));
D.vac46=svg(L('vac46.1'),
  calc(264,98,L('vac46.2'),'4',L('vac46.4'),'')+calc(96,98,L('vac46.2'),'6',L('vac46.4'),L('vac46.5'))+
  T(180,206,L('vac46.6'),{s:13}));
D.vac912=svg(L('vac912.1'),
  calc(264,98,L('vac912.2'),'9',L('vac912.4'),'')+calc(96,98,L('vac912.2'),'12',L('vac912.5'),L('vac912.6'))+
  T(180,206,L('vac912.7'),{s:13}));

// ---------- batch 2: hair and eyes ----------
D.hairtourn=svg(L('hairtourn.1'),
  `<g transform="translate(252 112)">
    <path class="sk" d="M-34 -30q-14 30 -10 70q4 40 36 44q34 2 40 -34q6 -40 -10 -80z"/>
    ${[[-36,-34,8],[-16,-50,9],[8,-60,15],[32,-50,9],[48,-32,7]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" class="sk"${i===2?' style="fill:#E58C80"':''}/>`).join('')}
    <ellipse cx="8" cy="-46" rx="17" ry="6" class="thread"/>
    <path class="ln thin" d="M-10 -10q10 6 20 0"/>
   </g>`+
  arrow('M168 62H226')+T(100,58,L('hairtourn.2'),{s:14})+T(100,80,L('hairtourn.3'),{s:14})+
  `<path class="ln thin" d="M20 112H180"/>`+
  T(100,138,L('hairtourn.4'),{s:14})+T(100,160,L('hairtourn.5'),{s:14})+
  T(180,208,L('hairtourn.6'),{s:14}));
D.stickyeye=svg(L('stickyeye.1'),
  `<g transform="translate(120 100)"><path class="eyeo" d="M-72 0Q0 -62 72 0Q0 62 -72 0z"/><circle r="26" class="iris"/><circle r="11" class="ink"/><circle cx="8" cy="-8" r="4" fill="#fff"/>
    <ellipse cx="66" cy="8" rx="9" ry="7" class="yel"/></g>`+
  arrow('M190 150Q120 184 50 150')+
  `<g transform="translate(292 86)"><circle r="24" class="c2"/><path class="ln thin" d="M-12 -4q12 -10 24 0M-14 8q14 -8 28 0"/></g>`+
  drop(292,140,.7,'wtr')+
  T(292,44,L('stickyeye.2'),{s:14})+T(292,176,L('stickyeye.3'),{s:13})+
  T(190,40,L('stickyeye.4'),{s:14})+T(180,208,L('stickyeye.5'),{s:14}));
D.hairloss=svg(L('hairloss.1'),
  `<g transform="translate(106 108)"><ellipse cx="-72" cy="14" rx="9" ry="14" class="sk"/><ellipse cx="72" cy="14" rx="9" ry="14" class="sk"/>
    <circle r="70" class="sk"/>
    <path class="hr" d="M-68 -4q0 -64 68 -64q68 0 68 64q-30 -26 -68 -26q-38 0 -68 26z"/>
    <ellipse cx="0" cy="26" rx="34" ry="22" class="sk2"/>
    <path class="ln thin" d="M-70 70q-14 20 -2 38M70 70q14 20 2 38"/></g>`+
  T(106,208,L('hairloss.2'),{s:14})+
  `<rect x="215" y="128" width="130" height="14" rx="5" class="ad"/><rect x="247" y="128" width="33" height="14" rx="5" class="sc"/>`+
  T(330,160,L('hairloss.3'),{s:12})+T(262,118,L('hairloss.4'),{s:13})+T(236,160,L('hairloss.5'),{s:12})+
  T(280,70,L('hairloss.6'),{s:14})+T(280,92,L('hairloss.7'),{s:14})+T(280,180,L('hairloss.8'),{s:14}));

// ---------- batch 2: more drawings ----------
const razor=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-32" y="-16" width="64" height="32" rx="5" class="cap"/><rect x="-20" y="-5" width="40" height="10" rx="5" class="sh"/><path class="ln thin" d="M-32 -9H32"/></g>`;
D.hairshave=svg(L('hairshave.1'),
  pan(0,razor(0,0,1.1)+ok(34,-40,14),L('hairshave.2'))+
  pan(1,razor(-10,-8,.9)+`<g transform="translate(10 12) rotate(12)">${razor(0,0,.9)}</g>`+no(36,-42,14),L('hairshave.3'))+
  pan(2,`<path class="sc" d="M-32 8a32 32 0 0 1 64 0z"/><rect x="-42" y="8" width="84" height="9" rx="4" class="sc"/>`+sun(30,-38,9),L('hairshave.4')));
D.hairstyle=svg(L('hairstyle.1'),
  pan(0,`<rect x="-22" y="-8" width="44" height="14" rx="6" class="cap"/><circle cx="-8" cy="22" r="9" class="coin"/><circle cx="12" cy="24" r="7" class="honey"/>`+no(34,-40,14),L('hairstyle.2'))+
  pan(1,`<circle r="30" class="sk"/><path class="hr" d="M-30 -4q0 -34 30 -34q30 0 30 34q-14 -16 -30 -16q-16 0 -30 16z"/><path class="ln" d="M-14 -22L0 -44L14 -22"/><circle cy="-46" r="6" class="cap"/>`+no(40,-44,14),L('hairstyle.3'))+
  pan(2,`<circle r="30" class="sk"/><path class="hr" d="M-30 -4q0 -34 30 -34q30 0 30 34q-14 -16 -30 -16q-16 0 -30 16z"/><path class="c2" d="M-30 -6q30 -22 60 0v10q-30 -22 -60 0z"/>`+ok(40,-44,14),L('hairstyle.4')));
D.cryreasons=svg(L('cryreasons.1'),
  [[300,58],[180,58],[60,58],[300,148],[180,148],[60,148]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${[
    drop(0,6,1,'milk'),
    T(0,10,'Zzz',{s:28,c:'lbb'}),
    `<path class="c2" d="M-26 -14h52v12q0 26 -26 30q-26 -4 -26 -30z"/><path class="ln thin" d="M-26 -14l-6 8M26 -14l6 8"/>`,
    `<g transform="scale(.5)">${thermo(0,6,'37')}</g>`,
    `<path class="cl" d="M-30 -22l16 -8h28l16 8l-12 16l-8 -6v36h-32v-36l-8 6z"/>`,
    `<g transform="scale(.5)">${faceIc(false)}</g>`][i]}</g>`+T(x,y+38,L('cryreasons.'+(i+2)),{s:13})).join(''));
D.herbal=svg(L('herbal.1'),
  pan(0,bottle(0,8,.9,'milk')+ok(36,-40,14),L('herbal.2'))+
  pan(1,cup(0,6,1.3,'tea')+no(34,-40,14),L('herbal.3'))+
  pan(2,`<path class="tea2" d="M0 -26l7 18l19 -4l-12 14l12 14l-19 -4l-7 18l-7 -18l-19 4l12 -14l-12 -14l19 4z"/>`+no(34,-40,14),L('herbal.4')));
D.cryemerg=svg(L('cryemerg.1'),
  pan(0,`<g transform="scale(.8)">${thermo(0,6,'38')}</g>`,L('cryemerg.2'))+
  pan(1,`<g transform="scale(.6)">${faceIc(false)}</g><path class="ln" d="M-14 14q14 -10 28 0" style="stroke:var(--red)"/>`,L('cryemerg.3'))+
  pan(2,`<circle r="22" class="sk2"/><ellipse cy="-2" rx="24" ry="7" class="thread"/>`,L('cryemerg.4')));

// ---------- batch 3: months 6 to 12 ----------
const hospital=(x=0,y=0)=>`<g transform="translate(${x} ${y})"><rect x="-24" y="-24" width="48" height="48" rx="10" class="box0"/><rect x="-18" y="-6" width="36" height="12" class="rdf"/><rect x="-6" y="-18" width="12" height="36" class="rdf"/></g>`;
const salt=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="gl" d="M-14 -26h28l4 52h-36z"/><rect x="-14" y="-34" width="28" height="10" rx="4" class="cap"/><circle cx="-5" cy="-29" r="1.8" class="ink"/><circle cx="5" cy="-29" r="1.8" class="ink"/></g>`;
const spoon=(x,y,rot=0,s=1)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse cx="0" cy="-18" rx="11" ry="15" class="cap"/><rect x="-3" y="-4" width="6" height="40" rx="3" class="cap"/></g>`;
const bowl=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="gl" d="M-34 -6h68q0 34 -34 34t-34 -34z"/><path class="crm" d="M-30 -6h60q-2 10 -8 14h-44q-6 -4 -8 -14z"/></g>`;
const grape=(x,y,r=10)=>`<circle cx="${x}" cy="${y}" r="${r}" class="sc"/><path class="ln thin" d="M${x} ${y-r}v-6"/>`;
D.solids=svg(L('solids.1'),
  pan(0,`<rect x="-22" y="0" width="44" height="40" rx="10" class="cl"/><circle cy="-18" r="22" class="sk"/><circle cx="-8" cy="-20" r="2.4" class="ink"/><circle cx="8" cy="-20" r="2.4" class="ink"/><path class="ln" d="M-5 -8q5 4 10 0"/><path class="ln thin" d="M-30 46h60"/>`,L('solids.2'))+
  pan(1,bowl(-6,6,.9)+spoon(30,-6,25,.7),L('solids.3'))+
  pan(2,`<rect x="-34" y="-34" width="68" height="68" rx="12" class="box0"/><rect x="-34" y="-34" width="68" height="18" rx="12" class="sc"/>`+T(0,22,'6',{s:42,c:'lbb'}),L('solids.4')));
D.gagchoke=svg(L('gagchoke.1'),
  pan(0,faceIc(true)+`<path class="mouth" d="M-12 8q12 12 24 0z"/><path class="lip" d="M-5 12q5 18 10 0z"/>`+ok(40,-36,14),L('gagchoke.2'))+
  pan(1,faceIc(false)+`<path class="ln" d="M-28 34q10 -8 20 -2M28 34q-10 -8 -20 -2"/>`+hospital(46,-36),L('gagchoke.3'))+
  pan(2,`<rect x="-30" y="-6" width="14" height="40" rx="5" class="honey"/><rect x="-10" y="-6" width="14" height="40" rx="5" class="honey"/>`+ok(-8,-30,12)+grape(26,20,12)+no(34,-26,12),L('gagchoke.4')));
D.allergens=svg(L('allergens.1'),
  pan(0,`<ellipse cy="4" rx="26" ry="32" class="crm"/><ellipse cx="-4" cy="-6" rx="5" ry="9" class="box0"/>`+T(34,-34,'1',{s:20,c:'lbb'}),L('allergens.2'))+
  pan(1,`<rect x="-36" y="-6" width="72" height="44" rx="10" class="honey"/><path class="mat" d="M-26 6q16 -8 52 0q-4 14 -26 14t-26 -14z"/>`+ok(40,-30,13),L('allergens.3'))+
  pan(2,faceIc(false)+`<circle cx="-18" cy="10" r="3.2" class="spot"/><circle cx="16" cy="14" r="3.2" class="spot"/><circle cx="-4" cy="26" r="3.2" class="spot"/><circle cx="22" cy="-2" r="3.2" class="spot"/>`,L('allergens.4')));
D.ironvitd=svg(L('ironvitd.1'),
  pan(0,`<rect x="-14" y="-12" width="28" height="44" rx="8" class="gl"/><rect x="-8" y="-28" width="16" height="18" rx="3" class="cap"/>`+drop(0,-4,.55,'honey')+drop(30,22,.4,'honey'),L('ironvitd.2'))+
  pan(1,`<path class="sore" d="M-34 6q0 -26 30 -24q34 2 34 24q-2 20 -32 20q-32 0 -32 -20z"/><circle cx="-14" cy="-4" r="3" class="spot"/><circle cx="2" cy="4" r="3" class="spot"/><circle cx="14" cy="-6" r="3" class="spot"/>`,L('ironvitd.3'))+
  pan(2,`<circle r="26" class="yel"/><path class="ln thin" d="M0 -26v52M-26 0h52M-18 -18l36 36M18 -18l-36 36"/>`+T(0,48,'C',{s:20,c:'lbb'}),L('ironvitd.4')));
D.foodsavoid=svg(L('foodsavoid.1'),
  pan(0,salt(0,4,1.2)+no(34,-40,14),L('foodsavoid.2'))+
  pan(1,cup(0,6,1.3,'honey')+no(34,-40,14),L('foodsavoid.3'))+
  pan(2,bottle(0,8,.95,'milk')+no(34,-40,14),L('foodsavoid.4')));
D.cupweaning=svg(L('cupweaning.1'),
  pan(0,cup(0,6,1.4,'wtr')+ok(36,-40,14),L('cupweaning.2'))+
  pan(1,bottle(-6,8,.9,'milk')+`<path class="moon" d="M24 -40a14 14 0 1 0 12 20a11 11 0 1 1 -12 -20z"/>`+no(40,18,13),L('cupweaning.3'))+
  pan(2,`<rect x="-36" y="-34" width="72" height="68" rx="12" class="box0"/><rect x="-36" y="-34" width="72" height="18" rx="12" class="sc"/>`+T(0,20,'12-18',{s:22,c:'lbb'}),L('cupweaning.4')));
D.teething=svg(L('teething.1'),
  pan(0,`<circle r="26" class="c2"/><circle r="10" class="box0"/>`+`<rect x="-8" y="-40" width="16" height="14" rx="5" class="cap"/>`+ok(36,-36,13),L('teething.2'))+
  pan(1,`<rect x="-10" y="-34" width="20" height="56" rx="6" class="gl"/><path class="cap" d="M-8 22h16l-2 12h-12z"/><path class="milk" d="M-6 -26h12v36h-12z"/>`+no(30,-36,14),L('teething.3'))+
  pan(2,`<path class="ln" d="M-34 -30q34 90 68 0"/>`+[-26,-16,-6,6,16,26].map((x,i)=>`<circle cx="${x}" cy="${[-4,10,18,18,10,-4][i]}" r="6" class="honey"/>`).join('')+no(34,-40,14),L('teething.4')));
D.babyproof=svg(L('babyproof.1'),
  pan(0,`<rect x="-34" y="-34" width="68" height="70" rx="4" class="sh"/>`+[-24,-12,0,12,24].map(x=>`<path class="ln" d="M${x} -34v70"/>`).join('')+`<path class="ln" d="M-34 -8h68"/>`+ok(36,-40,13),L('babyproof.2'))+
  pan(1,`<path class="ln thin" d="M-40 40h80M38 -40v80"/><rect x="-22" y="-30" width="44" height="66" rx="4" class="wd"/><path class="ln" d="M-22 -4h44M-22 16h44"/><path class="ln" d="M22 -22h16"/>`,L('babyproof.3'))+
  pan(2,`<rect x="-30" y="-34" width="60" height="68" rx="3" class="sky"/><path class="ln" d="M0 -34v68M-30 0h60"/><rect x="-4" y="-4" width="8" height="8" class="cap"/>`+ok(34,-38,13),L('babyproof.4')));
D.fallsbump=svg(L('fallsbump.1'),
  pan(0,`<rect x="-40" y="22" width="80" height="14" rx="5" class="mat"/><ellipse cx="0" cy="8" rx="24" ry="10" class="cl"/><circle cx="-26" cy="2" r="12" class="sk"/>`+ok(36,-26,13),L('fallsbump.2'))+
  pan(1,faceIc(false)+`<circle cx="22" cy="-26" r="9" class="sore"/>`,L('fallsbump.3'))+
  pan(2,hospital(0,0),L('fallsbump.4')));
D.battery=svg(L('battery.1'),
  pan(0,`<circle r="22" class="coin"/><circle r="14" class="sh"/>`+no(30,-30,14),L('battery.2'))+
  pan(1,`<rect x="-34" y="-24" width="68" height="46" rx="8" class="ph"/><rect x="-14" y="-4" width="28" height="26" class="tape"/>`+ok(36,-32,13),L('battery.3'))+
  pan(2,hospital(0,0),L('battery.4')));
D.walking=svg(L('walking.1'),
  pan(0,`<circle cx="-24" cy="30" r="9" class="ln"/><circle cx="24" cy="30" r="9" class="ln"/><path class="ln" d="M-26 22L-14 -22h28L26 22z"/>`+no(38,-34,14),L('walking.2'))+
  pan(1,`<rect x="-28" y="-6" width="56" height="34" rx="6" class="wd"/><path class="ln" d="M-20 -6L-14 -38h28L20 -6"/><circle cx="-18" cy="34" r="6" class="ln"/><circle cx="18" cy="34" r="6" class="ln"/>`+ok(38,-34,14),L('walking.3'))+
  pan(2,`<path class="cl" d="M-36 22v-30q0 -12 12 -12h12q4 14 20 18q20 4 20 18v6z"/><path class="ln" d="M-36 22h68"/>`+ok(36,-32,13),L('walking.4')));
D.sleep612=svg(L('sleep612.1'),
  pan(0,`<g transform="scale(.46) translate(0 -6)">${babyTop(0,18,1,0,{})}</g>`,L('sleep612.2'))+
  pan(1,`<path class="moon" d="M-8 -34a30 30 0 1 0 34 40a24 24 0 1 1 -34 -40z"/>`+T(22,-20,'Z',{s:22,c:'lbb'})+T(34,-34,'z',{s:16,c:'lbb'}),L('sleep612.3'))+
  pan(2,`<circle r="30" class="box0"/><path class="ln" d="M0 -20V0l14 10"/>`,L('sleep612.4')));
D.separation=svg(L('separation.1'),
  pan(0,faceIc(true)+`<circle cx="-18" cy="-4" r="13" class="sk2"/><circle cx="18" cy="-4" r="13" class="sk2"/>`,L('separation.2'))+
  pan(1,`<g transform="rotate(-18)"><rect x="-10" y="4" width="20" height="34" rx="7" class="sk"/><rect x="-14" y="-30" width="6" height="30" rx="3" class="sk"/><rect x="-6" y="-36" width="6" height="36" rx="3" class="sk"/><rect x="2" y="-34" width="6" height="34" rx="3" class="sk"/><rect x="10" y="-28" width="6" height="28" rx="3" class="sk"/></g>`,L('separation.3'))+
  pan(2,`<path class="c2" d="M-34 -10q34 -22 68 0v22q-34 -22 -68 0z"/><path class="c2" d="M-14 12l-6 26h12z"/><path class="ln thin" d="M-24 -4q20 -10 40 0"/>`,L('separation.4')));
D.play612=svg(L('play612.1'),
  pan(0,`<g transform="scale(.6)">${babyTummy(0,10,1)}</g>`,L('play612.2'))+
  pan(1,`<path class="sc" d="M-32 -30h64v60h-64z"/><path class="box0" d="M-26 -26h52v52h-52z"/><path class="ln" d="M0 -26v52M-18 -10h12M6 -10h12M-18 4h12M6 4h12"/>`+ok(34,-34,13),L('play612.3'))+
  pan(2,phone(0,0,1.5)+no(30,-36,14),L('play612.4')));

// ---------- batch 4: twins, boy and girl ----------
const cot2=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-22" width="52" height="46" rx="6" class="wd"/><rect x="-20" y="-16" width="40" height="34" rx="4" class="sh"/>${[-12,-4,4,12].map(v=>`<path class="ln thin" d="M${v} -22v-8"/>`).join('')}<circle cx="0" cy="-2" r="8" class="sk"/><rect x="-10" y="4" width="20" height="10" rx="4" class="cl"/></g>`;
D.twinsleep=svg(L('twinsleep.1'),
  pan(0,cot2(-24,4,.75)+cot2(24,4,.75)+ok(40,-34,13),L('twinsleep.2'))+
  pan(1,`<rect x="-38" y="-6" width="76" height="40" rx="8" class="sh"/><rect x="-38" y="-6" width="76" height="12" rx="6" class="c2"/><circle cx="-20" cy="10" r="9" class="sk"/><circle cx="14" cy="14" r="7" class="sk"/>`+no(34,-34,14),L('twinsleep.3'))+
  pan(2,`<rect x="-34" y="-34" width="68" height="68" rx="12" class="box0"/><rect x="-34" y="-34" width="68" height="18" rx="12" class="sc"/>`+T(0,22,'6',{s:42,c:'lbb'}),L('twinsleep.4')));
D.twinsfeed=svg(L('twinsfeed.1'),
  pan(0,`<circle cx="-22" cy="0" r="17" class="sk"/><circle cx="22" cy="0" r="17" class="sk"/><circle cx="-27" cy="-2" r="2.4" class="ink"/><circle cx="-17" cy="-2" r="2.4" class="ink"/><circle cx="17" cy="-2" r="2.4" class="ink"/><circle cx="27" cy="-2" r="2.4" class="ink"/><path class="ln" d="M-26 8q4 3 8 0M18 8q4 3 8 0"/>`+ok(38,-30,13),L('twinsfeed.2'))+
  pan(1,`<path class="c2" d="M-40 -6q0 -24 40 -24q40 0 40 24v6h-18v-6q0 -8 -22 -8q-22 0 -22 8v6h-18z"/><circle cx="-26" cy="4" r="10" class="sk"/><circle cx="26" cy="4" r="10" class="sk"/>`,L('twinsfeed.3'))+
  pan(2,bottle(-8,8,.9,'milk')+bottle(22,10,.9,'milk')+ok(40,-36,13),L('twinsfeed.4')));
D.twinsone=svg(L('twinsone.1'),
  pan(0,`<g transform="translate(-26 0) scale(.5)"><path class="cl" d="M-44 -14l16 -8h18l8 12l8 -12h18l16 8l-12 18l-8 -6v34h-40v-34l-8 6z"/></g><g transform="translate(26 0) scale(.5)"><path class="sc" d="M-44 -14l16 -8h18l8 12l8 -12h18l16 8l-12 18l-8 -6v34h-40v-34l-8 6z"/></g>`,L('twinsone.2'))+
  pan(1,`<rect x="-34" y="-34" width="68" height="68" rx="12" class="box0"/><rect x="-34" y="-34" width="68" height="18" rx="12" class="sc"/>`+`<rect x="-26" y="14" width="14" height="5" rx="2" class="lbb" style="fill:currentColor"/>`+T(8,26,'8',{s:34,c:'lbb'}),L('twinsone.3'))+
  pan(2,`<path class="ln" d="M-36 30L-36 -30M-36 30H36"/><path class="arw" d="M-34 24q20 -4 30 -22q10 -18 36 -24"/><path class="arwb" d="M-34 28q20 6 34 -4q16 -12 32 -12"/>`,L('twinsone.4')));
D.twinsmom=svg(L('twinsmom.1'),
  pan(0,`<path class="rdf" d="M0 22C-36 -4 -26 -34 -8 -26Q0 -22 0 -14Q0 -22 8 -26C26 -34 36 -4 0 22z" style="opacity:.85"/>`,L('twinsmom.2'))+
  pan(1,`<path class="moon" d="M-8 -34a30 30 0 1 0 34 40a24 24 0 1 1 -34 -40z"/>`+T(22,-20,'Z',{s:22,c:'lbb'}),L('twinsmom.3'))+
  pan(2,`<path class="box0" d="M-38 -26h76v40h-30l-14 16v-16h-32z"/><path class="ln" d="M-24 -12h48M-24 0h30"/>`,L('twinsmom.4')));
D.boygirl=svg(L('boygirl.1'),
  pan(0,`<path class="ln" d="M-36 30L-36 -30M-36 30H36"/><path class="arw" d="M-34 26q20 -2 34 -18q14 -16 34 -20"/><path class="arwb" d="M-34 28q20 4 34 -2q14 -6 34 -8"/>`,L('boygirl.2'))+
  pan(1,`<circle cx="-22" cy="0" r="17" class="sk"/><circle cx="22" cy="0" r="17" class="sk2"/>`+T(0,6,'=',{s:26,c:'lbb'}),L('boygirl.3'))+
  pan(2,faceIc(true)+ok(40,-36,13),L('boygirl.4')));
D.genitals=svg(L('genitals.1'),
  pan(0,`<rect x="-26" y="-34" width="52" height="68" rx="14" class="c2"/>`+arrow('M0 -24V24')+ok(36,-34,13),L('genitals.2'))+
  pan(1,hand(8,4,.7,0)+no(36,-28,14),L('genitals.3'))+
  pan(2,hospital(0,0),L('genitals.4')));

// ---------- batch 5: illness 1 ----------
const chest5=(pull=false)=>`<ellipse rx="46" ry="40" class="cl"/><path class="ln thin" d="M-30 -14q30 14 60 0M-32 2q32 14 64 0M-30 18q30 12 60 0"/>`+(pull?`<path class="arwr" d="M-10 44l0 -22M10 44l0 -22" marker-end="url(#ah)"/>`:'');
const bulb5=()=>`<g transform="rotate(-18)"><ellipse cx="0" cy="-12" rx="16" ry="20" class="bulb"/><path class="bulb" d="M-4 8h8l-3 38h-2z"/></g>`;
const swab5=()=>`<g transform="rotate(-30)"><rect x="-3" y="-30" width="6" height="60" rx="3" class="gl"/><ellipse cx="0" cy="-32" rx="7" ry="9" class="c2"/><ellipse cx="0" cy="32" rx="7" ry="9" class="c2"/></g>`;
const ear5=()=>`<path class="sk" d="M-18 -42q46 -10 46 32q0 26 -22 36q-6 24 -26 18q-6 -4 -4 -12q-30 -6 -24 -40q4 -22 30 -34z"/><path class="ln" d="M-10 -26q22 -4 22 18q0 12 -12 16"/>`;
const clk5=(t)=>`<circle r="34" class="box0"/><path class="ln" d="M0 0V-22M0 0H14"/>${T(0,56,t,{s:15,c:'lbb'})}`;
const syr5=()=>`<g transform="rotate(-20)"><rect x="-40" y="-9" width="60" height="18" rx="4" class="gl"/><rect x="-40" y="-9" width="34" height="18" rx="4" class="milk"/><path class="ln" d="M20 0h24M-40 0h-14M-54 -12v24"/></g>`;

D.cold=svg(L('cold.1'),
  pan(0,faceIc(true,0)+`<g transform="translate(-44 -46)">${bulb5()}</g>`+drop(-52,6,.55,'wtrd'),L('cold.2'))+
  pan(1,bottle(0,4,1.2,'milk'),L('cold.3'))+
  pan(2,bottle(0,4,1.2,'tea')+no(26,-36,15),L('cold.4')));
D.cough=svg(L('cough.1'),
  pan(0,chest5(false),L('cough.2'))+
  pan(1,drop(0,6,1.8,'wtrd')+bulb5().replace('rotate(-18)','translate(34 -26) rotate(-18) scale(.6)'),L('cough.3'))+
  pan(2,jar(0,8,1.7)+no(34,-34,15),L('cough.4')));
D.fastbreath=svg(L('fastbreath.1'),
  pan(0,chest5(true),L('fastbreath.2'))+
  pan(1,faceIc(false,0)+`<ellipse cx="0" cy="18" rx="13" ry="6" class="blue" style="opacity:.95"/>`,L('fastbreath.3'))+
  pan(2,phone(0,2,2.1)+ok(30,-40,14),L('fastbreath.4')));
D.croup=svg(L('croup.1'),
  pan(0,bubble(L('croup.5')),L('croup.2'))+
  pan(1,faceIc(false,0)+`<path class="ln thin" d="M-60 54v-90M60 54v-90"/>`,L('croup.3'))+
  pan(2,`<path class="smk" d="M-20 30q-12 -16 0 -30q12 -14 0 -30M4 30q-12 -16 0 -30q12 -14 0 -30M28 30q-12 -16 0 -30q12 -14 0 -30"/>`+no(0,0,26),L('croup.4')));
D.earpain=svg(L('earpain.1'),
  pan(0,ear5()+`<path class="rdl" d="M40 -40l14 -10M44 -22l18 -2M42 -4l16 8"/>`,L('earpain.2'))+
  pan(1,swab5()+no(30,-30,15),L('earpain.3'))+
  pan(2,clk5('72'),L('earpain.4')));
D.vaxfever=svg(L('vaxfever.1'),
  pan(0,`<path class="lsk" d="M-50 20Q-20 -20 40 -10" style="stroke-width:26"/><circle cx="6" cy="-6" r="16" class="rdf" style="opacity:.55"/>${syr5().replace('rotate(-20)','translate(-8 -44) rotate(60) scale(.7)')}`,L('vaxfever.2'))+
  pan(1,thermo(0,4,'38.0',0,1.1),L('vaxfever.3'))+
  pan(2,`<path class="ice" d="M-24 -20l24 -14l24 14v28l-24 14l-24 -14z"/>`+no(0,0,26),L('vaxfever.4')));
D.febseizure=svg(L('febseizure.1'),
  pan(0,babyTop(0,6,.55,90,{}),L('febseizure.2'))+
  pan(1,clk5('5'),L('febseizure.3'))+
  pan(2,`<circle r="28" class="mouth"/>`+no(0,0,24),L('febseizure.4')));
D.medsafe=svg(L('medsafe.1'),
  pan(0,syr5(),L('medsafe.2'))+
  pan(1,phone(0,2,2)+no(26,-36,15),L('medsafe.3'))+
  pan(2,`<rect x="-34" y="-40" width="68" height="80" rx="6" class="box0"/><path class="ln thin" d="M-22 -20h44M-22 -6h44M-22 8h30"/>`+T(0,32,L('medsafe.5'),{s:14,c:'lbb'}),L('medsafe.4')));
D.cprbaby=svg(L('cprbaby.1'),
  pan(0,babyTop(0,8,.5,90,{})+hand(-30,-40,.5,30),L('cprbaby.2'))+
  pan(1,faceIc(false,0)+`<ellipse cx="0" cy="8" rx="30" ry="22" class="ln" style="fill:none"/>`+T(0,64,'5',{s:20,c:'lbb'}),L('cprbaby.3'))+
  pan(2,`<ellipse rx="38" ry="30" class="cl"/><rect x="-10" y="-6" width="8" height="26" rx="4" class="sk"/><rect x="2" y="-6" width="8" height="26" rx="4" class="sk"/>`+T(0,58,'30',{s:20,c:'lbb'}),L('cprbaby.4')));
D.danger=svg(L('danger.1'),
  pan(0,chest5(true),L('danger.2'))+
  pan(1,faceIc(false,0)+`<ellipse cx="0" cy="18" rx="13" ry="6" class="blue" style="opacity:.95"/>`+`<circle cx="-18" cy="-4" r="9" class="blue"/><circle cx="18" cy="-4" r="9" class="blue"/>`,L('danger.3'))+
  pan(2,moon(0,0,26)+T(30,-22,'z',{s:22})+T(44,-40,'Z',{s:26}),L('danger.4')));

// ---------- batch 6: illness 2 ----------
const mouth6=()=>`<circle r="40" class="sk"/><ellipse cx="0" cy="8" rx="26" ry="16" class="mouth"/><path class="c2" d="M-14 6q14 -8 28 0q-14 10 -28 0z" style="fill:#F3EFE6"/>`;
const diaper6=(c='yel')=>`<path class="c2" d="M-40 -20h80l-12 46q-28 12 -56 0z"/><ellipse cx="0" cy="6" rx="18" ry="10" class="${c}"/>`;
const stoolBox6=(cls)=>`<rect x="-26" y="-18" width="52" height="36" rx="18" class="${cls}"/>`;
const mug6=()=>`<rect x="-24" y="-30" width="48" height="60" rx="8" class="gl"/><path class="wtr2" d="M-22 -4h44v32q0 4 -4 4h-36q-4 0 -4 -4z"/>`;

D.thrush=svg(L('thrush.1'),
  pan(0,mouth6(),L('thrush.2'))+
  pan(1,dummy(0,-4,1.9,0)+`<path class="wtrl" d="M-30 34q30 12 60 0"/>`,L('thrush.3'))+
  pan(2,`<circle r="30" class="box0"/><path class="ln" d="M0 0V-18M0 0H12"/>`+T(0,54,'7',{s:18,c:'lbb'}),L('thrush.4')));
D.eczema=svg(L('eczema.1'),
  pan(0,faceIc(true,0)+`<circle cx="-24" cy="6" r="9" class="rdf" style="opacity:.55"/><circle cx="24" cy="6" r="9" class="rdf" style="opacity:.55"/>`,L('eczema.2'))+
  pan(1,`<path class="gl" d="M-22 -34h44v68h-44z"/><path class="crm" d="M-18 -4h36v34h-36z"/><path class="cap" d="M-22 -34h44v12h-44z"/>`,L('eczema.3'))+
  pan(2,`<circle r="28" class="sk2"/><path class="ln" d="M-16 -4q8 6 16 0q8 -6 16 0"/>`+no(26,-30,15),L('eczema.4')));
D.cmpa=svg(L('cmpa.1'),
  pan(0,bottle(0,2,1.5,'milk'),L('cmpa.2'))+
  pan(1,faceIc(false,0)+`<circle cx="-22" cy="-14" r="6" class="rdf" style="opacity:.6"/><circle cx="20" cy="-18" r="6" class="rdf" style="opacity:.6"/><circle cx="2" cy="30" r="6" class="rdf" style="opacity:.6"/>`,L('cmpa.3'))+
  pan(2,phone(0,2,2.1)+ok(30,-40,14),L('cmpa.4')));
D.tonguetie=svg(L('tonguetie.1'),
  pan(0,`<circle r="40" class="sk"/><ellipse cx="0" cy="8" rx="22" ry="14" class="mouth"/><path class="lip" d="M-12 12q12 -14 24 0q-12 12 -24 0z"/><path class="ln" d="M0 12v10"/>`,L('tonguetie.2'))+
  pan(1,faceIc(true,0)+`<path class="ln" d="M-26 30q26 22 52 0" style="stroke-width:4"/>`,L('tonguetie.3'))+
  pan(2,`<rect x="-34" y="-34" width="68" height="68" rx="12" class="box0"/>`+T(0,6,'?',{s:44,c:'lbb'}),L('tonguetie.4')));
D.stoolcolor=svg(L('stoolcolor.1'),
  pan(0,diaper6('yel'),L('stoolcolor.2'))+
  pan(1,`<ellipse rx="26" ry="18" class="rdf" style="opacity:.75"/><ellipse rx="26" ry="18" cx="0" cy="26" class="ink"/>`,L('stoolcolor.3'))+
  pan(2,`<ellipse rx="30" ry="20" class="box0"/>`+no(0,0,22),L('stoolcolor.4')));
D.diarrhoea=svg(L('diarrhoea.1'),
  pan(0,bottle(0,2,1.4,'milk'),L('diarrhoea.2'))+
  pan(1,mug6(),L('diarrhoea.3'))+
  pan(2,cup(0,4,1.7,'tea')+no(30,-34,15),L('diarrhoea.4')));
D.dehydration=svg(L('dehydration.1'),
  pan(0,faceIc(false,0)+`<ellipse cx="0" cy="-34" rx="12" ry="5" class="ln" style="fill:none;stroke-dasharray:3 4"/>`,L('dehydration.2'))+
  pan(1,diaper6('box0'),L('dehydration.3'))+
  pan(2,mug6()+ok(30,-34,14),L('dehydration.4')));
D.vomit=svg(L('vomit.1'),
  pan(0,faceIc(false,0)+`<path class="wtrl" d="M10 22q22 8 30 30" style="stroke:#6E9A56;stroke-width:5"/>`,L('vomit.2'))+
  pan(1,`<ellipse rx="34" ry="30" class="cl"/><path class="arwr" d="M-8 -6h30" marker-end="url(#ah)"/>`+T(0,54,'15-30',{s:15,c:'lbb'}),L('vomit.3'))+
  pan(2,`<ellipse rx="30" ry="22" class="rdf" style="opacity:.8"/>`+T(0,6,'!',{s:30,c:'lbw'}),L('vomit.4')));
D.constipation=svg(L('constipation.1'),
  pan(0,faceIc(false,0)+`<path class="ln" d="M-14 14q14 -10 28 0"/><path class="ln thin" d="M-30 -22l8 6M30 -22l-8 6"/>`,L('constipation.2'))+
  pan(1,`<rect x="-40" y="-8" width="80" height="16" rx="8" class="cl"/>`+T(0,44,'10',{s:18,c:'lbb'}),L('constipation.3'))+
  pan(2,cup(0,4,1.7,'tea')+no(30,-34,15),L('constipation.4')));
// ---------- batch 7: breast and bottle ----------
const pill7=()=>`<rect x="-30" y="-14" width="60" height="28" rx="14" class="box0"/><path class="ln thin" d="M0 -14V14"/>`;
const scale7=()=>`<rect x="-36" y="-6" width="72" height="34" rx="9" class="box0"/><path class="ln" d="M-14 -2q14 -16 28 0"/>`;
const funnel7=()=>`<path class="gl" d="M-26 -30h52l-16 34h-20z"/><rect x="-10" y="4" width="20" height="30" rx="6" class="milk"/>`;
const micro7=()=>`<rect x="-34" y="-22" width="68" height="44" rx="6" class="box0"/><rect x="-26" y="-14" width="38" height="28" rx="3" class="gl"/><circle cx="23" cy="0" r="5" class="ink"/>`;
const pot7=()=>`<path class="gl" d="M-30 -20h60v46q0 6 -6 6h-48q-6 0 -6 -6z"/><path class="wtr2" d="M-28 -2h56v28h-56z"/>`;
const fish7=()=>`<ellipse rx="30" ry="14" class="c2"/><path class="c2" d="M28 0l16 -13v26z"/><circle cx="-18" cy="-3" r="3" class="ink"/>`;
const curve7=(extra='')=>`<path class="ln thin" d="M-40 32V-30M-40 32H40"/><path class="ln thin" d="M-40 22q30 -4 80 -40"/><path class="ln" d="M-40 12q30 -4 80 -40"/>${extra}`;

D.hungercues=svg(L('hungercues.1'),
  pan(0,faceIc(false,0),L('hungercues.2'))+
  pan(1,faceIc(false,0)+`<path class="wtrl" d="M-24 4q-4 14 0 22M24 4q4 14 0 22"/>`,L('hungercues.3'))+
  pan(2,faceIc(true,14),L('hungercues.4')));
D.supply=svg(L('supply.1'),
  pan(0,diaper6('yel'),L('supply.2'))+
  pan(1,scale7(),L('supply.3'))+
  pan(2,bag(0,2,1.6)+no(30,-34,15),L('supply.4')));
D.pump=svg(L('pump.1'),
  pan(0,funnel7(),L('pump.2'))+
  pan(1,clock(0,4,2.2),L('pump.3'))+
  pan(2,micro7()+no(32,-34,15),L('pump.4')));
D.bottlefeed=svg(L('bottlefeed.1'),
  pan(0,faceIc(true,0)+bottle(40,38,.7,'milk'),L('bottlefeed.2'))+
  pan(1,`<g transform="rotate(-80)">`+bottle(0,0,1.5,'milk')+`</g>`,L('bottlefeed.3'))+
  pan(2,bottle(0,2,1.5,'milk')+no(30,-34,15),L('bottlefeed.4')));
D.mixfeed=svg(L('mixfeed.1'),
  pan(0,T(0,10,'6-8',{s:40,c:'lbb'}),L('mixfeed.2'))+
  pan(1,bag(-26,4,1.3)+bottle(28,4,1.1,'milk'),L('mixfeed.3'))+
  pan(2,T(0,12,'1',{s:52,c:'lbb'}),L('mixfeed.4')));
D.momdiet=svg(L('momdiet.1'),
  pan(0,cup(0,4,1.7,'wtr2'),L('momdiet.2'))+
  pan(1,cup(0,4,1.7,'tea')+T(0,54,'200',{s:16,c:'lbb'}),L('momdiet.3'))+
  pan(2,fish7(),L('momdiet.4')));
D.bfmeds=svg(L('bfmeds.1'),
  pan(0,faceIc(true,0),L('bfmeds.2'))+
  pan(1,pill7()+ok(32,-30,14),L('bfmeds.3'))+
  pan(2,phone(0,2,2.1),L('bfmeds.4')));
D.nightfeed=svg(L('nightfeed.1'),
  pan(0,moon(0,-4,26),L('nightfeed.2'))+
  pan(1,bottle(0,2,1.5,'milk')+no(30,-34,15),L('nightfeed.3'))+
  pan(2,faceIc(true,0)+ok(32,-34,14),L('nightfeed.4')));
D.weanbreast=svg(L('weanbreast.1'),
  pan(0,drop(-34,6,1,'milk')+drop(0,10,.8,'milk')+drop(32,14,.6,'milk'),L('weanbreast.2'))+
  pan(1,cup(0,4,1.7,'wtr2'),L('weanbreast.3'))+
  pan(2,T(0,12,'2-3',{s:34,c:'lbb'}),L('weanbreast.4')));
D.formulatype=svg(L('formulatype.1'),
  pan(0,bottle(0,2,1.6,'milk')+T(0,54,'1',{s:18,c:'lbb'}),L('formulatype.2'))+
  pan(1,bottle(0,2,1.5,'milk')+no(30,-34,15),L('formulatype.3'))+
  pan(2,T(0,12,'Fe',{s:40,c:'lbb'}),L('formulatype.4')));
D.sterilise=svg(L('sterilise.1'),
  pan(0,pot7()+T(0,54,'10',{s:18,c:'lbb'}),L('sterilise.2'))+
  pan(1,bottle(0,2,1.4,'milk')+drop(32,-30,.6,'wtr2'),L('sterilise.3'))+
  pan(2,clock(0,4,2.2)+no(34,-34,15),L('sterilise.4')));
D.bottleintro=svg(L('bottleintro.1'),
  pan(0,bottle(0,2,1.6,'milk'),L('bottleintro.2'))+
  pan(1,T(0,12,'½',{s:52,c:'lbb'}),L('bottleintro.3'))+
  pan(2,dummy(0,-4,1.9,0),L('bottleintro.4')));
D.growthchart=svg(L('growthchart.1'),
  pan(0,curve7(),L('growthchart.2'))+
  pan(1,curve7(`<path class="arwr" d="M-30 26L30 -26" marker-end="url(#ah)"/>`),L('growthchart.3'))+
  pan(2,`<circle cx="-24" r="20" class="sk"/><circle cx="24" r="20" class="sk"/>`+no(0,-34,15),L('growthchart.4')));
// ---------- batch 8: carrying and gear ----------
const wheel8=()=>`<circle r="30" class="box0"/><path class="ln" d="M0 -30V30M-30 0H30"/>`;
const machine8=()=>`<rect x="-34" y="-34" width="68" height="68" rx="10" class="box0"/><circle r="20" class="gl"/>`;
const capsule8=()=>`<rect x="-22" y="-12" width="44" height="24" rx="12" class="rdf"/>`;
const incline8=()=>`<path class="wd" d="M-38 24h76v10h-76z"/><path class="sh" d="M-32 24l64 -30v30z"/>`;
const mattress8=()=>`<rect x="-38" y="-10" width="76" height="24" rx="6" class="sh"/>`;
const walker8=()=>`<rect x="-34" y="-20" width="68" height="40" rx="12" class="box0"/><circle cx="-22" cy="26" r="6" class="ink"/><circle cx="22" cy="26" r="6" class="ink"/>`;
const flatHead8=()=>`<path class="sk" d="M-34 -10q0 -30 34 -30q34 0 34 30q0 30 -34 30h-34z"/><path class="ln" d="M-34 -14v28"/>`;

D.holdbaby=svg(L('holdbaby.1'),
  pan(0,faceIc(true,0)+`<path class="ln" d="M-40 44q40 14 80 0" style="stroke-width:5"/>`,L('holdbaby.2'))+
  pan(1,T(0,12,'4',{s:56,c:'lbb'}),L('holdbaby.3'))+
  pan(2,cup(0,4,1.6,'tea')+no(30,-34,15),L('holdbaby.4')));
D.carrier=svg(L('carrier.1'),
  pan(0,T(0,12,'TICKS',{s:34,c:'lbb'}),L('carrier.2'))+
  pan(1,faceIc(true,0)+ok(32,-34,14),L('carrier.3'))+
  pan(2,bottle(0,2,1.5,'milk')+no(30,-34,15),L('carrier.4')));
D.hips=svg(L('hips.1'),
  pan(0,`<circle cx="0" cy="-6" r="14" class="c2"/><path class="ln" d="M-26 4q26 30 52 0"/>`,L('hips.2'))+
  pan(1,T(0,12,'6',{s:56,c:'lbb'}),L('hips.3'))+
  pan(2,`<path class="ln" d="M-24 22q-12 -24 10 -32M24 22q12 -24 -10 -32" style="stroke-width:5"/>`,L('hips.4')));
D.flathead=svg(L('flathead.1'),
  pan(0,flatHead8(),L('flathead.2'))+
  pan(1,faceIc(true,0),L('flathead.3'))+
  pan(2,`<rect x="-30" y="-14" width="60" height="28" rx="14" class="sh"/>`+no(30,-34,15),L('flathead.4')));
D.stroller=svg(L('stroller.1'),
  pan(0,T(0,12,'5',{s:60,c:'lbb'}),L('stroller.2'))+
  pan(1,bag(0,2,1.6)+no(30,-34,15),L('stroller.3'))+
  pan(2,wheel8(),L('stroller.4')));
D.bouncer=svg(L('bouncer.1'),
  pan(0,walker8()+no(32,-34,15),L('bouncer.2'))+
  pan(1,clock(0,4,2.2)+T(0,60,'20',{s:16,c:'lbb'}),L('bouncer.3'))+
  pan(2,moon(0,-4,26)+no(32,-34,15),L('bouncer.4')));
D.dressing=svg(L('dressing.1'),
  pan(0,T(0,12,'+1',{s:56,c:'lbb'}),L('dressing.2'))+
  pan(1,sun(0,-6,18),L('dressing.3'))+
  pan(2,T(0,12,'16-20',{s:30,c:'lbb'}),L('dressing.4')));
D.laundry=svg(L('laundry.1'),
  pan(0,machine8(),L('laundry.2'))+
  pan(1,machine8()+T(0,60,'60',{s:16,c:'lbb'}),L('laundry.3'))+
  pan(2,capsule8()+no(32,-34,15),L('laundry.4')));
D.buyskip=svg(L('buyskip.1'),
  pan(0,ok(0,0,26),L('buyskip.2'))+
  pan(1,incline8()+no(32,-34,15),L('buyskip.3'))+
  pan(2,mattress8()+ok(32,-34,14),L('buyskip.4')));
// ---------- batch 9: talking, playing, teaching ----------
const bubble9=()=>`<path class="gl" d="M-28 -24h56v34h-36l-14 14v-14h-6z"/>`;
const tv9=()=>`<rect x="-34" y="-24" width="68" height="46" rx="6" class="box0"/><rect x="-26" y="-16" width="52" height="30" rx="3" class="gl"/>`;
const book9=()=>`<rect x="-34" y="-22" width="68" height="44" rx="4" class="box0"/><path class="ln" d="M0 -22V22"/>`;
const ear9=()=>`<circle r="18" class="box0"/><path class="ln" d="M24 -12q10 12 0 24M34 -18q16 18 0 36"/>`;
const drum9=()=>`<rect x="-22" y="-12" width="44" height="34" rx="4" class="gl"/><ellipse cy="-12" rx="22" ry="8" class="c2"/>`;
const crate9=()=>`<rect x="-30" y="-20" width="60" height="40" rx="4" class="wd"/><path class="ln thin" d="M-30 -4h60"/>`;

D.talkbaby=svg(L('talkbaby.1'),
  pan(0,faceIc(true,0),L('talkbaby.2'))+
  pan(1,bubble9(),L('talkbaby.3'))+
  pan(2,tv9()+no(32,-34,15),L('talkbaby.4')));
D.readbook=svg(L('readbook.1'),
  pan(0,book9(),L('readbook.2'))+
  pan(1,T(0,12,'15-25',{s:34,c:'lbb'}),L('readbook.3'))+
  pan(2,ok(0,0,26),L('readbook.4')));
D.songs=svg(L('songs.1'),
  pan(0,T(0,18,'♪',{s:64,c:'lbb'}),L('songs.2'))+
  pan(1,T(0,16,'↻',{s:56,c:'lbb'}),L('songs.3'))+
  pan(2,tv9()+no(32,-34,15),L('songs.4')));
D.firstwords=svg(L('firstwords.1'),
  pan(0,T(0,12,'2',{s:60,c:'lbb'}),L('firstwords.2'))+
  pan(1,T(0,12,'4',{s:60,c:'lbb'}),L('firstwords.3'))+
  pan(2,T(0,12,'7',{s:60,c:'lbb'}),L('firstwords.4')));
D.bilingual=svg(L('bilingual.1'),
  pan(0,T(0,12,'A ع',{s:46,c:'lbb'}),L('bilingual.2'))+
  pan(1,ok(0,0,26),L('bilingual.3'))+
  pan(2,T(0,12,'؟',{s:56,c:'lbb'})+no(30,-34,15),L('bilingual.4')));
D.play06=svg(L('play06.1'),
  pan(0,faceIc(true,0),L('play06.2'))+
  pan(1,`<ellipse rx="34" ry="18" class="sk"/><circle cx="-40" cy="-4" r="14" class="sk"/>`,L('play06.3'))+
  pan(2,pot7(),L('play06.4')));
D.vision=svg(L('vision.1'),
  pan(0,T(0,12,'20-30',{s:34,c:'lbb'}),L('vision.2'))+
  pan(1,faceIc(true,10),L('vision.3'))+
  pan(2,T(0,12,'3',{s:60,c:'lbb'}),L('vision.4')));
D.hearing=svg(L('hearing.1'),
  pan(0,ear9(),L('hearing.2'))+
  pan(1,T(0,12,'1',{s:60,c:'lbb'}),L('hearing.3'))+
  pan(2,ear9()+no(34,-34,15),L('hearing.4')));
D.screens=svg(L('screens.1'),
  pan(0,tv9()+no(32,-34,15),L('screens.2'))+
  pan(1,phone(0,2,2.1)+ok(30,-40,14),L('screens.3'))+
  pan(2,faceIc(true,0),L('screens.4')));
D.toyssafe=svg(L('toyssafe.1'),
  pan(0,`<circle r="30" class="mouth"/><circle r="10" class="c2"/>`,L('toyssafe.2'))+
  pan(1,`<rect x="-14" y="-14" width="28" height="28" rx="14" class="box0"/>`+no(26,-30,15),L('toyssafe.3'))+
  pan(2,T(0,12,'36',{s:46,c:'lbb'}),L('toyssafe.4')));
D.toyschoose=svg(L('toyschoose.1'),
  pan(0,T(0,12,'؟',{s:60,c:'lbb'}),L('toyschoose.2'))+
  pan(1,crate9(),L('toyschoose.3'))+
  pan(2,faceIc(true,0)+ok(32,-34,14),L('toyschoose.4')));
D.householdplay=svg(L('householdplay.1'),
  pan(0,cup(0,4,1.7,'wtr2'),L('householdplay.2'))+
  pan(1,drum9(),L('householdplay.3'))+
  pan(2,faceIc(true,0)+`<path class="c2" d="M-30 -42h60v16h-60z" style="opacity:.8"/>`,L('householdplay.4')));
// ---------- batch 10: feelings, behaviour, sleep habits ----------
const heart10=()=>`<path class="rdf" d="M0 24C-36 -2 -24 -32 0 -12C24 -32 36 -2 0 24z"/>`;
const twofaces10=()=>`<circle cx="-22" r="22" class="sk"/><circle cx="22" r="22" class="sk"/>`;
const bear10=()=>`<circle cx="-18" cy="-24" r="9" class="c2"/><circle cx="18" cy="-24" r="9" class="c2"/><circle r="26" class="c2"/><circle cx="-9" cy="-4" r="3" class="ink"/><circle cx="9" cy="-4" r="3" class="ink"/>`;
const sack10=()=>`<path class="sh" d="M-24 -30h48l8 62h-64z"/><path class="ln thin" d="M-18 -10h36"/>`;
const brush10=()=>`<rect x="-34" y="-6" width="52" height="12" rx="6" class="box0"/><rect x="18" y="-14" width="16" height="28" rx="4" class="sh"/>`;
const door10=()=>`<rect x="-24" y="-34" width="48" height="68" rx="4" class="wd"/><circle cx="14" cy="2" r="3" class="ink"/>`;

D.attach=svg(L('attach.1'),
  pan(0,heart10(),L('attach.2'))+
  pan(1,faceIc(false,0)+`<path class="wtrl" d="M-24 4q-4 14 0 22M24 4q4 14 0 22"/>`,L('attach.3'))+
  pan(2,T(0,12,'1-4',{s:44,c:'lbb'}),L('attach.4')));
D.temper=svg(L('temper.1'),
  pan(0,twofaces10(),L('temper.2'))+
  pan(1,T(0,12,'6',{s:60,c:'lbb'}),L('temper.3'))+
  pan(2,ok(0,0,26),L('temper.4')));
D.feelings=svg(L('feelings.1'),
  pan(0,faceIc(false,14),L('feelings.2'))+
  pan(1,T(0,12,'10-18',{s:34,c:'lbb'}),L('feelings.3'))+
  pan(2,door10(),L('feelings.4')));
D.limits=svg(L('limits.1'),
  pan(0,`<circle r="28" class="sk"/>`+no(26,-30,15),L('limits.2'))+
  pan(1,cup(0,4,1.7,'wtr2'),L('limits.3'))+
  pan(2,ok(0,0,26),L('limits.4')));
D.tantrum=svg(L('tantrum.1'),
  pan(0,faceIc(false,0),L('tantrum.2'))+
  pan(1,T(0,12,'18',{s:56,c:'lbb'}),L('tantrum.3'))+
  pan(2,ok(0,0,26),L('tantrum.4')));
D.biting=svg(L('biting.1'),
  pan(0,`<circle r="34" class="sk"/><ellipse cy="10" rx="16" ry="10" class="mouth"/>`,L('biting.2'))+
  pan(1,`<circle r="28" class="sk"/>`+no(26,-30,15),L('biting.3'))+
  pan(2,`<path class="ln" d="M-30 30q30 -50 60 0" style="stroke-width:6"/>`,L('biting.4')));
D.sleepsudden=svg(L('sleepsudden.1'),
  pan(0,moon(0,-4,26),L('sleepsudden.2'))+
  pan(1,T(0,12,'4',{s:60,c:'lbb'}),L('sleepsudden.3'))+
  pan(2,T(0,12,'؟',{s:60,c:'lbb'}),L('sleepsudden.4')));
D.sleeptrain=svg(L('sleeptrain.1'),
  pan(0,T(0,12,'6',{s:60,c:'lbb'}),L('sleeptrain.2'))+
  pan(1,clock(0,4,2.2),L('sleeptrain.3'))+
  pan(2,phone(0,2,2.1),L('sleeptrain.4')));
D.routine=svg(L('routine.1'),
  pan(0,book9(),L('routine.2'))+
  pan(1,brush10(),L('routine.3'))+
  pan(2,moon(0,-4,26)+ok(34,-34,14),L('routine.4')));
D.lovey=svg(L('lovey.1'),
  pan(0,bear10()+no(32,-34,15),L('lovey.2'))+
  pan(1,sack10(),L('lovey.3'))+
  pan(2,dummy(0,-4,1.9,0)+no(34,-34,15),L('lovey.4')));
D.siblings=svg(L('siblings.1'),
  pan(0,twofaces10(),L('siblings.2'))+
  pan(1,T(0,12,'دور',{s:44,c:'lbb'}),L('siblings.3'))+
  pan(2,heart10(),L('siblings.4')));
D.childcare=svg(L('childcare.1'),
  pan(0,T(0,12,'؟',{s:60,c:'lbb'}),L('childcare.2'))+
  pan(1,T(0,12,'24',{s:52,c:'lbb'}),L('childcare.3'))+
  pan(2,faceIc(true,0),L('childcare.4')));
// ---------- batch 11: pets and the cat ----------
const catf11=()=>`<path class="c2" d="M-24 -12L-22 -36L-6 -22zM24 -12L22 -36L6 -22z"/><circle r="26" class="c2"/><circle cx="-9" cy="-4" r="3" class="ink"/><circle cx="9" cy="-4" r="3" class="ink"/><path class="ln thin" d="M-4 8h8"/>`;
const blanket11=()=>`<rect x="-30" y="-22" width="60" height="44" rx="6" class="sh"/><path class="ln thin" d="M-30 -6h60M-30 8h60"/>`;
const litter11=()=>`<rect x="-32" y="-8" width="64" height="30" rx="6" class="box0"/><path class="ln thin" d="M-24 4h48"/>`;
const plate11=()=>`<circle r="28" class="box0"/><circle r="18" class="sh"/>`;
const band11=()=>`<g transform="rotate(-20)"><rect x="-34" y="-12" width="68" height="24" rx="12" class="sh"/><rect x="-10" y="-12" width="20" height="24" class="box0"/></g>`;
const cross11=()=>`<rect x="-8" y="-26" width="16" height="52" rx="3" class="rdf"/><rect x="-26" y="-8" width="52" height="16" rx="3" class="rdf"/>`;

D.petintro=svg(L('petintro.1'),
  pan(0,blanket11(),L('petintro.2'))+
  pan(1,catf11(),L('petintro.3'))+
  pan(2,ok(0,0,26),L('petintro.4')));
D.catcot=svg(L('catcot.1'),
  pan(0,catf11()+no(28,-30,15),L('catcot.2'))+
  pan(1,door10(),L('catcot.3'))+
  pan(2,moon(0,-4,26),L('catcot.4')));
D.petkind=svg(L('petkind.1'),
  pan(0,twofaces10(),L('petkind.2'))+
  pan(1,`<path class="ln" d="M-30 0q15 -30 30 0t30 0" style="stroke-width:5"/>`+no(26,-30,15),L('petkind.3'))+
  pan(2,T(0,12,'5-6',{s:50,c:'lbb'}),L('petkind.4')));
D.petgerms=svg(L('petgerms.1'),
  pan(0,drop(0,0,1.5,'wtr2'),L('petgerms.2'))+
  pan(1,litter11(),L('petgerms.3'))+
  pan(2,plate11()+no(28,-30,15),L('petgerms.4')));
D.toxo=svg(L('toxo.1'),
  pan(0,catf11()+ok(28,-30,13),L('toxo.2'))+
  pan(1,litter11(),L('toxo.3'))+
  pan(2,plate11(),L('toxo.4')));
D.petallergy=svg(L('petallergy.1'),
  pan(0,catf11(),L('petallergy.2'))+
  pan(1,door10(),L('petallergy.3'))+
  pan(2,T(0,12,'60',{s:60,c:'lbb'}),L('petallergy.4')));
D.scratch=svg(L('scratch.1'),
  pan(0,drop(0,0,1.5,'wtr2'),L('scratch.2'))+
  pan(1,band11(),L('scratch.3'))+
  pan(2,T(0,12,'2-4',{s:56,c:'lbb'}),L('scratch.4')));
D.rabies=svg(L('rabies.1'),
  pan(0,drop(0,0,1.5,'wtr2'),L('rabies.2'))+
  pan(1,catf11()+no(28,-30,15),L('rabies.3'))+
  pan(2,cross11(),L('rabies.4')));
// ---------- batch 12: home safety and first aid ----------
const win12=()=>`<rect x="-30" y="-34" width="60" height="68" rx="4" class="box0"/><path class="ln thin" d="M0 -34v68M-30 0h60"/>`;
const chair12=()=>`<path class="ln" d="M-14 -24v40M-14 4h28M14 4v22M-14 16v10" style="stroke-width:5"/>`;
const gate12=()=>`<rect x="-32" y="-30" width="64" height="60" rx="4" class="box0"/><path class="ln thin" d="M-20 -30v60M-8 -30v60M4 -30v60M16 -30v60M-32 -8h64"/>`;
const plug12=()=>`<rect x="-22" y="-22" width="44" height="44" rx="8" class="box0"/><circle cx="-8" cy="-4" r="3.5" class="ink"/><circle cx="8" cy="-4" r="3.5" class="ink"/>`;
const cord12=()=>`<path class="ln" d="M-34 22q20 -54 40 0t30 -12" style="stroke-width:5"/>`;
const bolt12=()=>`<path class="rdf" d="M6 -34L-14 4h14l-6 30L18 -8H4z"/>`;
const dresser12=()=>`<rect x="-26" y="-32" width="52" height="64" rx="4" class="wd"/><path class="ln thin" d="M-26 -10h52M-26 12h52"/>`;
const bracket12=()=>`<path class="ln" d="M-30 -34h-10v68h10M-30 -20h30" style="stroke-width:5"/>`;
const medbtl12=()=>`<rect x="-16" y="-24" width="32" height="48" rx="6" class="box0"/><rect x="-12" y="-36" width="24" height="12" rx="3" class="cap"/>`;
const flame12=()=>`<path class="rdf" d="M0 -34C14 -14 22 -4 22 12a22 22 0 0 1 -44 0C-22 -4 -10 -14 0 -34z"/>`;
const net12=()=>`<path class="ln thin" d="M-30 -30h60v60h-60zM-30 -10h60M-30 10h60M-10 -30v60M10 -30v60"/>`;
const cube12=()=>`<rect x="-20" y="-20" width="40" height="40" rx="6" class="box0"/>`;
const alarm12=()=>`<circle r="28" class="box0"/><circle r="9" class="ink"/>`;
const rad12=()=>`<rect x="-30" y="-24" width="60" height="48" rx="6" class="box0"/><path class="ln thin" d="M-18 -16v32M-6 -16v32M6 -16v32M18 -16v32"/>`;
const guard12=()=>`<path class="ln" d="M-30 -24h60v48h-60zM-30 -8h60M-30 8h60" style="stroke-width:4"/>`;

D.window=svg(L('window.1'),
  pan(0,win12(),L('window.2'))+
  pan(1,T(0,12,'6.5',{s:46,c:'lbb'}),L('window.3'))+
  pan(2,chair12()+no(28,-30,15),L('window.4')));
D.stairgate=svg(L('stairgate.1'),
  pan(0,gate12(),L('stairgate.2'))+
  pan(1,T(0,12,'2',{s:60,c:'lbb'}),L('stairgate.3'))+
  pan(2,`<circle r="24" class="c2"/><path class="ln" d="M-30 28h60"/>`+no(28,-30,15),L('stairgate.4')));
D.scald=svg(L('scald.1'),
  pan(0,cup(0,4,1.7),L('scald.2'))+
  pan(1,T(0,12,'15',{s:56,c:'lbb'}),L('scald.3'))+
  pan(2,T(0,12,'49°',{s:50,c:'lbb'}),L('scald.4')));
D.shock=svg(L('shock.1'),
  pan(0,plug12(),L('shock.2'))+
  pan(1,cord12()+no(26,-30,15),L('shock.3'))+
  pan(2,bolt12(),L('shock.4')));
D.tipover=svg(L('tipover.1'),
  pan(0,dresser12(),L('tipover.2'))+
  pan(1,bracket12(),L('tipover.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('tipover.4')));
D.drown=svg(L('drown.1'),
  pan(0,drop(0,0,1.5,'wtr2'),L('drown.2'))+
  pan(1,T(0,12,'5',{s:60,c:'lbb'}),L('drown.3'))+
  pan(2,clock(0,4,2.2),L('drown.4')));
D.poison=svg(L('poison.1'),
  pan(0,medbtl12(),L('poison.2'))+
  pan(1,`<ellipse cy="6" rx="18" ry="11" class="mouth"/>`+no(26,-26,15),L('poison.3'))+
  pan(2,phone(0,2,2.1),L('poison.4')));
D.co=svg(L('co.1'),
  pan(0,flame12(),L('co.2'))+
  pan(1,T(0,12,'CO',{s:52,c:'lbb'}),L('co.3'))+
  pan(2,door10(),L('co.4')));
D.mosquito=svg(L('mosquito.1'),
  pan(0,net12(),L('mosquito.2'))+
  pan(1,T(0,12,'3',{s:60,c:'lbb'}),L('mosquito.3'))+
  pan(2,cross11(),L('mosquito.4')));
D.burnaid=svg(L('burnaid.1'),
  pan(0,drop(0,0,1.5,'wtr2'),L('burnaid.2'))+
  pan(1,T(0,12,'20',{s:60,c:'lbb'}),L('burnaid.3'))+
  pan(2,cube12()+no(24,-24,16),L('burnaid.4')));
D.firesafe=svg(L('firesafe.1'),
  pan(0,alarm12(),L('firesafe.2'))+
  pan(1,door10(),L('firesafe.3'))+
  pan(2,no(0,0,28),L('firesafe.4')));
D.heater=svg(L('heater.1'),
  pan(0,rad12(),L('heater.2'))+
  pan(1,T(0,12,'16-20',{s:42,c:'lbb'}),L('heater.3'))+
  pan(2,guard12(),L('heater.4')));
// ---------- batch 13: outings and travel ----------
const ear13=()=>`<path class="ln" d="M-14 -30q32 -14 36 22q4 26 -22 32q-14 5 -14 24" style="stroke-width:5"/>`;
const muff13=()=>`<path class="ln" d="M-30 6q0 -40 30 -40t30 40" style="stroke-width:5"/><rect x="-38" y="2" width="16" height="30" rx="6" class="sh"/><rect x="22" y="2" width="16" height="30" rx="6" class="sh"/>`;
const plane13=()=>`<path class="sh" d="M-38 2l66 -6l18 -18l8 4l-8 20l8 20l-8 4l-18 -18l-66 -6z"/>`;
const cooler13=()=>`<rect x="-30" y="-12" width="60" height="38" rx="6" class="box0"/><rect x="-30" y="-24" width="60" height="12" rx="4" class="sh"/>`;
const flask13=()=>`<rect x="-14" y="-34" width="28" height="68" rx="10" class="box0"/><rect x="-10" y="-40" width="20" height="8" rx="3" class="cap"/>`;
const crowd13=()=>`<circle cx="-22" r="18" class="sk"/><circle cx="2" cy="-8" r="18" class="sk"/><circle cx="24" cy="6" r="18" class="sk"/>`;

D.firstout=svg(L('firstout.1'),
  pan(0,clock(0,4,2.2),L('firstout.2'))+
  pan(1,crowd13()+no(26,-30,15),L('firstout.3'))+
  pan(2,T(0,12,'4-7',{s:52,c:'lbb'}),L('firstout.4')));
D.cartrip=svg(L('cartrip.1'),
  pan(0,clock(0,4,2.2),L('cartrip.2'))+
  pan(1,`<ellipse cy="6" rx="18" ry="11" class="mouth"/>`+no(26,-26,15),L('cartrip.3'))+
  pan(2,ok(0,0,26),L('cartrip.4')));
D.carhot=svg(L('carhot.1'),
  pan(0,T(0,12,'10',{s:60,c:'lbb'}),L('carhot.2'))+
  pan(1,sun(0,-4,16),L('carhot.3'))+
  pan(2,no(0,0,28),L('carhot.4')));
D.noise=svg(L('noise.1'),
  pan(0,ear13(),L('noise.2'))+
  pan(1,muff13(),L('noise.3'))+
  pan(2,T(0,12,'150',{s:52,c:'lbb'}),L('noise.4')));
D.flying=svg(L('flying.1'),
  pan(0,plane13(),L('flying.2'))+
  pan(1,bottle(0,8,1.2),L('flying.3'))+
  pan(2,medbtl12()+no(26,-26,15),L('flying.4')));
D.travelhealth=svg(L('travelhealth.1'),
  pan(0,cross11(),L('travelhealth.2'))+
  pan(1,T(0,12,'6',{s:60,c:'lbb'}),L('travelhealth.3'))+
  pan(2,drop(0,0,1.5,'wtr2'),L('travelhealth.4')));
D.feedout=svg(L('feedout.1'),
  pan(0,cooler13(),L('feedout.2'))+
  pan(1,flask13(),L('feedout.3'))+
  pan(2,T(0,12,'2',{s:60,c:'lbb'}),L('feedout.4')));
D.outbag=svg(L('outbag.1'),
  pan(0,bag(0,4,2),L('outbag.2'))+
  pan(1,sun(0,-4,16),L('outbag.3'))+
  pan(2,ok(0,0,26),L('outbag.4')));
// ---------- batch 14: the mother's body after birth ----------
const belly14=()=>`<rect x="-34" y="-26" width="68" height="52" rx="16" class="sk"/><path class="ln" d="M-24 8h48" style="stroke-width:4"/>`;
const hammock14=()=>`<path class="ln" d="M-38 -14q38 56 76 0" style="stroke-width:5"/><circle cx="0" cy="-8" r="9" class="sc"/>`;
const stool14=()=>`<rect x="-28" y="6" width="56" height="20" rx="6" class="wd"/><path class="ln" d="M-18 26v14M18 26v14" style="stroke-width:5"/><path class="ln" d="M-22 -26q-4 24 8 30h30" style="stroke-width:5"/>`;
const gap14=()=>`<rect x="-38" y="-26" width="30" height="52" rx="9" class="sk"/><rect x="8" y="-26" width="30" height="52" rx="9" class="sk"/><path class="arw" d="M-6 0h12" marker-end="url(#ah)"/>`;
const soap14=()=>`<rect x="-28" y="-14" width="56" height="34" rx="9" class="box0"/>${T(0,8,'صابون',{s:15})}`;
const situp14=()=>`<rect x="-34" y="-12" width="68" height="34" rx="9" class="box0"/>${T(0,10,'سيت-أب',{s:15})}`;
const heavy14=()=>`<rect x="-30" y="-16" width="60" height="38" rx="9" class="box0"/>${T(0,8,'ثقيل',{s:16})}`;

D.lochia=svg(L('lochia.1'),
  pan(0,drop(0,2,1.5,'rdf'),L('lochia.2'))+
  pan(1,drop(0,8,0.9,'rdf'),L('lochia.3'))+
  pan(2,T(0,16,'2-6',{s:50,c:'lbb'}),L('lochia.4')));
D.perineum=svg(L('perineum.1'),
  pan(0,drop(0,0,1.4,'wtr2'),L('perineum.2'))+
  pan(1,soap14()+no(26,-26,15),L('perineum.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('perineum.4')));
D.csection=svg(L('csection.1'),
  pan(0,belly14(),L('csection.2'))+
  pan(1,T(0,16,'6',{s:56,c:'lbb'}),L('csection.3'))+
  pan(2,heavy14()+no(26,-26,15),L('csection.4')));
D.pelvicfloor=svg(L('pelvicfloor.1'),
  pan(0,hammock14(),L('pelvicfloor.2'))+
  pan(1,T(0,10,'5+5',{s:50,c:'lbb'}),L('pelvicfloor.3'))+
  pan(2,situp14()+no(26,-26,15),L('pelvicfloor.4')));
D.bowelbladder=svg(L('bowelbladder.1'),
  pan(0,mug6(),L('bowelbladder.2'))+
  pan(1,stool14(),L('bowelbladder.3'))+
  pan(2,clock(0,4,2.2),L('bowelbladder.4')));
D.warnsigns=svg(L('warnsigns.1'),
  pan(0,drop(0,2,1.5,'rdf'),L('warnsigns.2'))+
  pan(1,T(0,14,'38°',{s:52,c:'lbb'}),L('warnsigns.3'))+
  pan(2,hospital(0,0),L('warnsigns.4')));
D.exercise=svg(L('exercise.1'),
  pan(0,T(0,14,'30',{s:56,c:'lbb'}),L('exercise.2'))+
  pan(1,T(0,14,'3',{s:56,c:'lbb'}),L('exercise.3'))+
  pan(2,T(0,12,'150',{s:46,c:'lbb'}),L('exercise.4')));
D.mumiron=svg(L('mumiron.1'),
  pan(0,drop(0,2,1.5,'rdf'),L('mumiron.2'))+
  pan(1,pill7(),L('mumiron.3'))+
  pan(2,cup(0,2,1.2,'tea')+no(28,-26,14),L('mumiron.4')));
D.periodreturn=svg(L('periodreturn.1'),
  pan(0,T(0,14,'3',{s:56,c:'lbb'}),L('periodreturn.2'))+
  pan(1,T(0,14,'5-6',{s:46,c:'lbb'}),L('periodreturn.3'))+
  pan(2,T(0,14,'12',{s:56,c:'lbb'}),L('periodreturn.4')));
D.sexafter=svg(L('sexafter.1'),
  pan(0,heart10(),L('sexafter.2'))+
  pan(1,T(0,14,'6',{s:56,c:'lbb'}),L('sexafter.3'))+
  pan(2,drop(0,2,1.4,'wtr2'),L('sexafter.4')));
D.diastasis=svg(L('diastasis.1'),
  pan(0,gap14(),L('diastasis.2'))+
  pan(1,T(0,14,'8',{s:56,c:'lbb'}),L('diastasis.3'))+
  pan(2,situp14()+no(26,-26,15),L('diastasis.4')));
D.mumshape=svg(L('mumshape.1'),
  pan(0,scale7(),L('mumshape.2'))+
  pan(1,T(0,14,'8',{s:56,c:'lbb'}),L('mumshape.3'))+
  pan(2,bowl(0,4,1.3),L('mumshape.4')));
// ---------- batch 15: growth and checks ----------
const skull15=()=>`<ellipse cx="0" cy="4" rx="34" ry="38" class="sk"/><ellipse cx="0" cy="-22" rx="11" ry="8" class="sh" style="stroke:var(--ink);stroke-width:3"/>`;
const heelprick15=()=>`<path class="ln" d="M-30 22q10 -34 34 -22q18 10 6 26q-18 18 -40 -4z" style="stroke-width:4"/>${drop(14,22,0.8,'rdf')}`;
const tooth15=()=>`<path class="sh" d="M-24 -26q24 -14 48 0q8 26 -6 50q-6 12 -10 -12q-8 -8 -16 0q-4 24 -10 12q-14 -24 -6 -50z" style="stroke:var(--ink);stroke-width:3"/>`;
const foot15=()=>`<path class="sk" d="M-30 18q-4 -34 14 -38q10 -2 20 4q16 6 24 22q6 12 -6 12h-44q-8 0 -8 0z"/><circle cx="26" cy="12" r="5" class="sk"/><circle cx="34" cy="20" r="4" class="sk"/>`;
const person15=()=>`<circle cx="0" cy="-22" r="14" class="sk"/><path class="cl" d="M-22 34q0 -40 22 -40t22 40z"/>`;
const bed15=()=>`<rect x="-34" y="-4" width="68" height="26" rx="8" class="box0"/><path class="ln" d="M-34 22v10M34 22v10"/>${drop(0,-14,0.6,'rdf')}`;

D.headsoft=svg(L('headsoft.1'),
  pan(0,skull15(),L('headsoft.2'))+
  pan(1,T(0,16,'12-18',{s:34,c:'lbb'}),L('headsoft.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('headsoft.4')));
D.newbornscreen=svg(L('newbornscreen.1'),
  pan(0,heelprick15(),L('newbornscreen.2'))+
  pan(1,T(0,16,'24h',{s:46,c:'lbb'}),L('newbornscreen.3'))+
  pan(2,hospital(0,0),L('newbornscreen.4')));
D.checkups=svg(L('checkups.1'),
  pan(0,person15(),L('checkups.2'))+
  pan(1,scale7(),L('checkups.3'))+
  pan(2,T(0,16,'12',{s:56,c:'lbb'}),L('checkups.4')));
D.correctedage=svg(L('correctedage.1'),
  pan(0,T(0,16,'40-32',{s:36,c:'lbb'}),L('correctedage.2'))+
  pan(1,T(0,16,'4-2',{s:50,c:'lbb'}),L('correctedage.3'))+
  pan(2,T(0,16,'24',{s:56,c:'lbb'}),L('correctedage.4')));
D.toothcare=svg(L('toothcare.1'),
  pan(0,tooth15(),L('toothcare.2'))+
  pan(1,T(0,16,'2x',{s:56,c:'lbb'}),L('toothcare.3'))+
  pan(2,bottle(0,2,0.9)+no(24,-28,14),L('toothcare.4')));
D.feet=svg(L('feet.1'),
  pan(0,foot15(),L('feet.2'))+
  pan(1,T(0,16,'7',{s:56,c:'lbb'}),L('feet.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('feet.4')));
D.devworry=svg(L('devworry.1'),
  pan(0,T(0,18,'؟',{s:70,c:'lbb'}),L('devworry.2'))+
  pan(1,person15(),L('devworry.3'))+
  pan(2,clock(0,4,2.2)+no(26,-28,14),L('devworry.4')));
D.earlyweight=svg(L('earlyweight.1'),
  pan(0,scale7(),L('earlyweight.2'))+
  pan(1,T(0,16,'2-3',{s:50,c:'lbb'}),L('earlyweight.3'))+
  pan(2,T(0,16,'10%',{s:46,c:'lbb'}),L('earlyweight.4')));
// ---------- batch 16: boys and girls ----------
const ring16=()=>`<circle cx="0" cy="2" r="22" class="sh" style="stroke:var(--ink);stroke-width:4;fill:none"/><circle cx="0" cy="2" r="9" class="sk"/>`;
const testis16=()=>`<circle cx="-14" cy="10" r="15" class="sk"/><circle cx="14" cy="10" r="15" class="sk"/><path class="ln" d="M-10 -26q10 14 0 22M10 -26q-10 14 0 22" style="stroke-width:3"/>`;
const girl16=()=>`<circle cx="0" cy="-20" r="14" class="sk"/><path class="cl" d="M-22 34q0 -38 22 -38t22 38z"/><circle cx="-16" cy="-18" r="4" class="sh" style="stroke:var(--ink);stroke-width:2.5"/>`;
const potty16=()=>`<path class="sh" d="M-26 -4h52q4 22 -8 32h-36q-12 -10 -8 -32z" style="stroke:var(--ink);stroke-width:3"/><ellipse cx="0" cy="-4" rx="26" ry="8" class="sk"/>`;
D.circcare=svg(L('circcare.1'),
  pan(0,T(0,16,'7-10',{s:44,c:'lbb'}),L('circcare.2'))+
  pan(1,ring16()+no(26,-26,15),L('circcare.3'))+
  pan(2,clock(0,4,2.2),L('circcare.4')));
D.foreskin=svg(L('foreskin.1'),
  pan(0,no(0,0,28),L('foreskin.2'))+
  pan(1,testis16(),L('foreskin.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('foreskin.4')));
D.labial=svg(L('labial.1'),
  pan(0,T(0,16,'80%',{s:44,c:'lbb'}),L('labial.2'))+
  pan(1,hospital(0,0),L('labial.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('labial.4')));
D.earpierce=svg(L('earpierce.1'),
  pan(0,girl16(),L('earpierce.2'))+
  pan(1,T(0,16,'4-6',{s:44,c:'lbb'}),L('earpierce.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('earpierce.4')));
D.fgm=svg(L('fgm.1'),
  pan(0,no(0,0,34),L('fgm.2'))+
  pan(1,cross11(),L('fgm.3'))+
  pan(2,hospital(0,0)+no(26,-26,15),L('fgm.4')));
D.toiletmyths=svg(L('toiletmyths.1'),
  pan(0,T(0,16,'18',{s:56,c:'lbb'}),L('toiletmyths.2'))+
  pan(1,potty16(),L('toiletmyths.3'))+
  pan(2,no(0,0,28),L('toiletmyths.4')));
// ---------- batch 17: later in the first year ----------
const stick17=()=>`<rect x="-8" y="-30" width="16" height="60" rx="6" class="cap"/>`;
const coin17=()=>`<circle cx="0" cy="2" r="22" class="cap"/>`;
D.familyfoods=svg(L('familyfoods.1'),
  pan(0,bowl(0,-6,1.3),L('familyfoods.2'))+
  pan(1,T(0,16,'3',{s:60,c:'lbb'}),L('familyfoods.3'))+
  pan(2,T(0,14,'0',{s:44,c:'lbb'})+no(26,-26,15),L('familyfoods.4')));
D.fingerfoods=svg(L('fingerfoods.1'),
  pan(0,stick17(),L('fingerfoods.2'))+
  pan(1,coin17()+no(26,-26,15),L('fingerfoods.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('fingerfoods.4')));
D.pickyfood=svg(L('pickyfood.1'),
  pan(0,T(0,16,'10',{s:56,c:'lbb'}),L('pickyfood.2'))+
  pan(1,no(0,0,28),L('pickyfood.3'))+
  pan(2,bowl(0,-6,1.3),L('pickyfood.4')));
D.birthday=svg(L('birthday.1'),
  pan(0,T(0,16,'12',{s:56,c:'lbb'}),L('birthday.2'))+
  pan(1,no(0,0,28),L('birthday.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('birthday.4')));
D.cowsmilk=svg(L('cowsmilk.1'),
  pan(0,cup(0,4,1.7,'milk'),L('cowsmilk.2'))+
  pan(1,T(0,16,'12',{s:56,c:'lbb'}),L('cowsmilk.3'))+
  pan(2,no(0,0,28),L('cowsmilk.4')));
D.nightwean=svg(L('nightwean.1'),
  pan(0,moon(0,-4,26),L('nightwean.2'))+
  pan(1,T(0,16,'8',{s:60,c:'lbb'}),L('nightwean.3'))+
  pan(2,T(0,16,'1',{s:60,c:'lbb'}),L('nightwean.4')));
// ---------- batch 18: the myth-checker ----------
D.mythgive=svg(L('mythgive.1'),
  pan(0,cup(0,4,1.7,'wtr2')+no(26,-30,15),L('mythgive.2'))+
  pan(1,T(0,16,'6',{s:60,c:'lbb'}),L('mythgive.3'))+
  pan(2,T(0,22,'12',{s:50,c:'lbb'})+no(26,-30,15),L('mythgive.4')));
D.mythsleepcry=svg(L('mythsleepcry.1'),
  pan(0,heart10(),L('mythsleepcry.2'))+
  pan(1,moon(0,-4,26),L('mythsleepcry.3'))+
  pan(2,no(0,0,28),L('mythsleepcry.4')));
// ---------- batch 18 (second part): the myth-checker ----------
D.mythsick=svg(L('mythsick.1'),
  pan(0,T(0,16,'38',{s:56,c:'lbb'}),L('mythsick.2'))+
  pan(1,no(0,0,28),L('mythsick.3'))+
  pan(2,drop(0,0,1.2,'rdf'),L('mythsick.4')));
D.mythfeedmilk=svg(L('mythfeedmilk.1'),
  pan(0,T(0,16,'1',{s:60,c:'lbb'}),L('mythfeedmilk.2'))+
  pan(1,bottle(0,2,1.5,'milk')+no(26,-30,15),L('mythfeedmilk.3'))+
  pan(2,T(0,22,'6',{s:60,c:'lbb'}),L('mythfeedmilk.4')));
D.mythskin=svg(L('mythskin.1'),
  pan(0,no(0,0,28),L('mythskin.2'))+
  pan(1,no(0,0,28),L('mythskin.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('mythskin.4')));
D.mythbody=svg(L('mythbody.1'),
  pan(0,no(0,0,28),L('mythbody.2'))+
  pan(1,T(0,16,'18',{s:56,c:'lbb'}),L('mythbody.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('mythbody.4')));
D.mythfood=svg(L('mythfood.1'),
  pan(0,T(0,16,'6',{s:60,c:'lbb'}),L('mythfood.2'))+
  pan(1,no(0,0,28),L('mythfood.3'))+
  pan(2,T(0,16,'12',{s:56,c:'lbb'}),L('mythfood.4')));
D.mythpost=svg(L('mythpost.1'),
  pan(0,T(0,16,'40',{s:56,c:'lbb'}),L('mythpost.2'))+
  pan(1,heart10(),L('mythpost.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('mythpost.4')));
// ---------- batch 19: the by-month cards ----------
D.month1=svg(L('month1.1'),
  pan(0,T(0,16,'1',{s:56,c:'lbb'}),L('month1.2'))+
  pan(1,hospital(),L('month1.3'))+
  pan(2,cross11(),L('month1.4')));
D.month2=svg(L('month2.1'),
  pan(0,T(0,16,'2',{s:56,c:'lbb'}),L('month2.2'))+
  pan(1,hospital(),L('month2.3'))+
  pan(2,cross11(),L('month2.4')));
D.month3=svg(L('month3.1'),
  pan(0,T(0,16,'3',{s:56,c:'lbb'}),L('month3.2'))+
  pan(1,hospital()+no(26,-26,12),L('month3.3'))+
  pan(2,cross11()+no(26,-26,12),L('month3.4')));
D.month4=svg(L('month4.1'),
  pan(0,T(0,16,'4',{s:56,c:'lbb'}),L('month4.2'))+
  pan(1,hospital(),L('month4.3'))+
  pan(2,cross11(),L('month4.4')));
D.month5=svg(L('month5.1'),
  pan(0,T(0,16,'5',{s:56,c:'lbb'}),L('month5.2'))+
  pan(1,hospital()+no(26,-26,12),L('month5.3'))+
  pan(2,cross11()+no(26,-26,12),L('month5.4')));
D.month6=svg(L('month6.1'),
  pan(0,T(0,16,'6',{s:56,c:'lbb'}),L('month6.2'))+
  pan(1,hospital(),L('month6.3'))+
  pan(2,cross11(),L('month6.4')));
D.month7=svg(L('month7.1'),
  pan(0,T(0,16,'7',{s:56,c:'lbb'}),L('month7.2'))+
  pan(1,hospital()+no(26,-26,12),L('month7.3'))+
  pan(2,cross11()+no(26,-26,12),L('month7.4')));
D.month8=svg(L('month8.1'),
  pan(0,T(0,16,'8',{s:56,c:'lbb'}),L('month8.2'))+
  pan(1,hospital()+no(26,-26,12),L('month8.3'))+
  pan(2,cross11()+no(26,-26,12),L('month8.4')));
D.month9=svg(L('month9.1'),
  pan(0,T(0,16,'9',{s:56,c:'lbb'}),L('month9.2'))+
  pan(1,hospital(),L('month9.3'))+
  pan(2,cross11(),L('month9.4')));
D.month10=svg(L('month10.1'),
  pan(0,T(0,16,'10',{s:56,c:'lbb'}),L('month10.2'))+
  pan(1,hospital()+no(26,-26,12),L('month10.3'))+
  pan(2,cross11()+no(26,-26,12),L('month10.4')));
D.month11=svg(L('month11.1'),
  pan(0,T(0,16,'11',{s:56,c:'lbb'}),L('month11.2'))+
  pan(1,hospital()+no(26,-26,12),L('month11.3'))+
  pan(2,cross11()+no(26,-26,12),L('month11.4')));
D.month12=svg(L('month12.1'),
  pan(0,T(0,16,'12',{s:56,c:'lbb'}),L('month12.2'))+
  pan(1,hospital(),L('month12.3'))+
  pan(2,cross11(),L('month12.4')));
// ---------- batch 20: body care, infections, water and photos ----------
D.nails=svg(L('nails.1'),
  pan(0,T(0,16,'1',{s:60,c:'lbb'}),L('nails.2'))+
  pan(1,no(0,0,28),L('nails.3'))+
  pan(2,moon(0,-4,26),L('nails.4')));
D.birthmarks=svg(L('birthmarks.1'),
  pan(0,T(0,16,'1',{s:60,c:'lbb'}),L('birthmarks.2'))+
  pan(1,ok(0,0,26),L('birthmarks.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('birthmarks.4')));
D.newbornreflex=svg(L('newbornreflex.1'),
  pan(0,T(0,16,'2',{s:60,c:'lbb'}),L('newbornreflex.2'))+
  pan(1,T(0,16,'4',{s:60,c:'lbb'}),L('newbornreflex.3'))+
  pan(2,ok(0,0,26),L('newbornreflex.4')));
D.bronchiolitis=svg(L('bronchiolitis.1'),
  pan(0,T(0,16,'3-5',{s:44,c:'lbb'}),L('bronchiolitis.2'))+
  pan(1,T(0,22,'!',{s:70,c:'lbb'}),L('bronchiolitis.3'))+
  pan(2,drop(0,0,1.2,'rdf'),L('bronchiolitis.4')));
D.handfoot=svg(L('handfoot.1'),
  pan(0,T(0,16,'7-10',{s:40,c:'lbb'}),L('handfoot.2'))+
  pan(1,drop(0,0,1.2,'rdf'),L('handfoot.3'))+
  pan(2,ok(0,0,26),L('handfoot.4')));
D.roseola=svg(L('roseola.1'),
  pan(0,T(0,16,'3-5',{s:44,c:'lbb'}),L('roseola.2'))+
  pan(1,ok(0,0,26),L('roseola.3'))+
  pan(2,hospital(),L('roseola.4')));
D.swimbaby=svg(L('swimbaby.1'),
  pan(0,T(0,16,'1',{s:60,c:'lbb'}),L('swimbaby.2'))+
  pan(1,no(0,0,28),L('swimbaby.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('swimbaby.4')));
D.sharenting=svg(L('sharenting.1'),
  pan(0,no(0,0,28),L('sharenting.2'))+
  pan(1,T(0,16,'5',{s:60,c:'lbb'}),L('sharenting.3'))+
  pan(2,ok(0,0,26),L('sharenting.4')));
// ---------- batch 21: infections, breathing, massage, safe sleep ----------
D.pertussis=svg(L('pertussis.1'),
  pan(0,T(0,16,'6',{s:60,c:'lbb'}),L('pertussis.2'))+
  pan(1,cross11(),L('pertussis.3'))+
  pan(2,T(0,22,'!',{s:70,c:'lbb'}),L('pertussis.4')));
D.measles=svg(L('measles.1'),
  pan(0,T(0,16,'1',{s:60,c:'lbb'}),L('measles.2'))+
  pan(1,T(0,16,'2',{s:60,c:'lbb'}),L('measles.3'))+
  pan(2,hospital(),L('measles.4')));
D.conjunct=svg(L('conjunct.1'),
  pan(0,T(0,16,'30',{s:50,c:'lbb'}),L('conjunct.2'))+
  pan(1,drop(0,0,1.2,'milk'),L('conjunct.3'))+
  pan(2,T(0,16,'7',{s:60,c:'lbb'}),L('conjunct.4')));
D.babyuti=svg(L('babyuti.1'),
  pan(0,T(0,16,'38',{s:50,c:'lbb'}),L('babyuti.2'))+
  pan(1,T(0,16,'3',{s:60,c:'lbb'}),L('babyuti.3'))+
  pan(2,hospital(),L('babyuti.4')));
D.newbornbreath=svg(L('newbornbreath.1'),
  pan(0,T(0,16,'70',{s:50,c:'lbb'}),L('newbornbreath.2'))+
  pan(1,T(0,16,'6',{s:60,c:'lbb'}),L('newbornbreath.3'))+
  pan(2,ok(0,0,26),L('newbornbreath.4')));
D.massage=svg(L('massage.1'),
  pan(0,T(0,16,'4-6',{s:44,c:'lbb'}),L('massage.2'))+
  pan(1,ok(0,0,26),L('massage.3'))+
  pan(2,no(0,0,28),L('massage.4')));
D.carsleep=svg(L('carsleep.1'),
  pan(0,no(0,0,28),L('carsleep.2'))+
  pan(1,moon(0,-4,26),L('carsleep.3'))+
  pan(2,ok(0,0,26),L('carsleep.4')));
D.sleepgear=svg(L('sleepgear.1'),
  pan(0,no(0,0,28),L('sleepgear.2'))+
  pan(1,no(0,0,28),L('sleepgear.3'))+
  pan(2,ok(0,0,26),L('sleepgear.4')));

// Wrap every drawing with the arrow marker definition once (ids are scoped per svg by repetition, same shape everywhere).
for(const k in D)D[k]=D[k].replace('role="img"',`role="img"`).replace(/(<svg[^>]*>)/,`$1${defs}`);
return D;
}
