'use strict';
/* ===== Space Arcade engine: shared loop, input, sound and drawing helpers ===== */
const W=800,H=500,TAU=Math.PI*2;
const rnd=(a,b)=>a+Math.random()*(b-a),rndi=(a,b)=>Math.floor(a+Math.random()*(b-a+1)),clamp=(v,a,b)=>v<a?a:v>b?b:v,dist=(a,b,c,d)=>Math.hypot(c-a,d-b),pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const angDiff=(a,b)=>{let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d};
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FONT='Assistant, system-ui, sans-serif',DISP='Karantina, Assistant, sans-serif';
const GAMES=[];
const KEYS=new Set(),HITS=new Set();
let ctx=null,tapQ=false;

/* ---------- Sound ---------- */
const Snd={ac:null,out:null,muted:false,thr:null,nb:null,
  init(){try{if(!this.ac){this.ac=new (window.AudioContext||window.webkitAudioContext)();this.out=this.ac.createGain();this.out.gain.value=this.muted?0:.5;this.out.connect(this.ac.destination)}if(this.ac.state==='suspended')this.ac.resume()}catch(e){}},
  setMuted(m){this.muted=m;if(this.out)this.out.gain.value=m?0:.5},
  tone(f,d=.15,type='sine',v=.2,f2=null,delay=0){if(!this.ac)return;const t=this.ac.currentTime+delay,o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(this.out);o.start(t);o.stop(t+d+.05)},
  noise(){if(this.nb)return this.nb;const b=this.ac.createBuffer(1,this.ac.sampleRate,this.ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return this.nb=b},
  burst(d=.5,v=.3,fq=900){if(!this.ac)return;const t=this.ac.currentTime,s=this.ac.createBufferSource(),f=this.ac.createBiquadFilter(),g=this.ac.createGain();s.buffer=this.noise();f.type='lowpass';f.frequency.setValueAtTime(fq,t);f.frequency.exponentialRampToValueAtTime(60,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(this.out);s.start(t);s.stop(t+d+.05)},
  thrustOn(v=.22){if(!this.ac||this.thr)return;const t=this.ac.currentTime,s=this.ac.createBufferSource(),f=this.ac.createBiquadFilter(),g=this.ac.createGain();s.buffer=this.noise();s.loop=true;f.type='lowpass';f.frequency.value=520;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.06);s.connect(f).connect(g).connect(this.out);s.start(t);this.thr={s,g}},
  thrustOff(){if(!this.thr)return;const{s,g}=this.thr,t=this.ac.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+.15);s.stop(t+.2);this.thr=null},
  thrust(on,v){on?this.thrustOn(v):this.thrustOff()},
  chime(){this.tone(880,.18,'triangle',.18);this.tone(1320,.3,'triangle',.12,null,.07)},
  win(){[523,659,784,1047].forEach((f,i)=>this.tone(f,.35,'triangle',.18,null,i*.12))},
  lose(){this.tone(320,.9,'sawtooth',.12,35);this.burst(1,.3,600)},
  warn(){this.tone(230,.16,'square',.08)},
  level(){this.tone(392,.2,'triangle',.16);this.tone(587,.4,'triangle',.16,null,.14)},
  hit(){this.burst(.3,.28,900)}
};

/* ---------- Engine state ---------- */
const E={t:0,score:0,state:'idle',game:null,fx:[],tap:false,ptr:{x:W/2,y:H/2,down:false,active:false},
  key:c=>KEYS.has(c),hit:c=>HITS.has(c),fire:()=>HITS.has('Space')||HITS.has('Enter'),
  ax(){return{x:(KEYS.has('ArrowRight')||KEYS.has('KeyD')?1:0)-(KEYS.has('ArrowLeft')||KEYS.has('KeyA')?1:0),y:(KEYS.has('ArrowDown')||KEYS.has('KeyS')?1:0)-(KEYS.has('ArrowUp')||KEYS.has('KeyW')?1:0)}},
  up:()=>KEYS.has('ArrowUp')||KEYS.has('KeyW'),
  boom(x,y,n=16,col='#ffb070',spd=120){for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(.3,1)*spd;E.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:rnd(.4,.9),t:0,col})}},
  puff(x,y,vx,vy,col='#ffc070'){if(Math.random()<.6)E.fx.push({x,y,vx:vx+rnd(-25,25),vy:vy+rnd(-25,25),l:.35,t:0,col})},
  over(win,title,body=''){if(E.state!=='play')return;E.state='over';Snd.thrustOff();win?Snd.win():Snd.lose();const sc=Math.floor(E.score),nb=Arcade.saveBest(E.game.id,sc);
    Arcade.show(title||(win?'כל הכבוד!':'המשחק נגמר'),`${body} ניקוד: ${sc}.${nb?' שיא חדש!':''}`.trim(),'שחקו שוב',()=>Arcade.play(E.game,true),true)}
};

/* ---------- Drawing helpers ---------- */
const BG=Array.from({length:170},()=>{const r=Math.random()*1.4+.3;return{x:Math.random()*W,y:Math.random()*H,r,z:r*.25,p:Math.random()*TAU,s:.5+Math.random()*2,c:r>1.3?'#ffe2c2':'#dfe6ff'}});
function bg(ox=0,oy=0,neb=true){ctx.fillStyle='#03040a';ctx.fillRect(0,0,W,H);
  if(neb){const g=ctx.createRadialGradient(W*.75,H*.2,10,W*.75,H*.2,W*.7);g.addColorStop(0,'rgba(70,40,140,.22)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  for(const s of BG){const x=((s.x-ox*s.z)%W+W)%W,y=((s.y-oy*s.z)%H+H)%H;ctx.globalAlpha=REDUCE?.7:.3+.7*(.5+.5*Math.sin(E.t*s.s+s.p));ctx.fillStyle=s.c;ctx.fillRect(x,y,s.r,s.r)}ctx.globalAlpha=1}
function hole(x,y,r,alpha=1){ctx.save();ctx.globalAlpha=alpha;
  let g=ctx.createRadialGradient(x,y,r*.8,x,y,r*4);g.addColorStop(0,'rgba(255,150,60,.5)');g.addColorStop(.35,'rgba(255,80,30,.15)');g.addColorStop(1,'rgba(255,80,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*4,0,TAU);ctx.fill();
  const disk=front=>{ctx.save();ctx.translate(x,y);ctx.rotate(-.22);for(let i=0;i<3;i++){ctx.beginPath();front?ctx.ellipse(0,0,r*(1.7+i*.4),r*(.42+i*.1),0,0,Math.PI):ctx.ellipse(0,0,r*(1.7+i*.4),r*(.42+i*.1),0,0,TAU);ctx.strokeStyle=`rgba(255,${200-i*40},${110-i*30},${.85-i*.22})`;ctx.lineWidth=Math.max(1,r*.22);ctx.stroke()}ctx.restore()};
  disk(false);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle='#000';ctx.fill();ctx.lineWidth=Math.max(1.2,r*.08);ctx.strokeStyle='rgba(255,226,180,.9)';ctx.beginPath();ctx.arc(x,y,r*1.06,0,TAU);ctx.stroke();disk(true);ctx.restore()}
const PAL={me:['#f2f5ff','#8f9ccc','#3a4a7a','#5fd4ff'],foe:['#ffd0d6','#c0405a','#5a1a2a','#ffd27a']};
function ship(x,y,a,flame=0,sc=1,pal='me'){const P=PAL[pal];ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(sc,sc);
  if(flame>0){const L=10+flame*20*(.75+Math.random()*.5),g=ctx.createLinearGradient(-8,0,-8-L,0);g.addColorStop(0,'rgba(255,250,220,.95)');g.addColorStop(.3,'rgba(255,170,60,.9)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-7,-5);ctx.quadraticCurveTo(-8-L*.6,-7,-8-L,0);ctx.quadraticCurveTo(-8-L*.6,7,-7,5);ctx.closePath();ctx.fill()}
  ctx.fillStyle=P[2];ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(-12,-12);ctx.lineTo(-9,-4);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-4,5);ctx.lineTo(-12,12);ctx.lineTo(-9,4);ctx.closePath();ctx.fill();
  const b=ctx.createLinearGradient(0,-7,0,7);b.addColorStop(0,P[0]);b.addColorStop(1,P[1]);ctx.fillStyle=b;ctx.beginPath();ctx.moveTo(17,0);ctx.quadraticCurveTo(8,-7,-8,-6);ctx.lineTo(-8,6);ctx.quadraticCurveTo(8,7,17,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=P[3];ctx.beginPath();ctx.ellipse(6,0,3.8,2.6,0,0,TAU);ctx.fill();ctx.restore()}
function lander(x,y,a,fl){ctx.save();ctx.translate(x,y);ctx.rotate(a);
  if(fl){const L=10+fl*18*rnd(.7,1.2),g=ctx.createLinearGradient(0,8,0,8+L);g.addColorStop(0,'rgba(255,240,200,.95)');g.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(0,7+L);ctx.lineTo(5,7);ctx.fill()}
  ctx.strokeStyle='#c7cbe0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-7,4);ctx.lineTo(-13,13);ctx.moveTo(7,4);ctx.lineTo(13,13);ctx.moveTo(-17,13);ctx.lineTo(-9,13);ctx.moveTo(9,13);ctx.lineTo(17,13);ctx.stroke();
  ctx.fillStyle='#d9a441';ctx.fillRect(-9,-2,18,9);ctx.fillStyle='#e8eaf6';ctx.beginPath();ctx.arc(0,-6,8,0,TAU);ctx.fill();ctx.fillStyle='#5fd4ff';ctx.beginPath();ctx.arc(0,-7,3.5,0,TAU);ctx.fill();ctx.restore()}
function planet(x,y,r,c='#5fd4ff',ring=false){
  const rg=front=>{ctx.save();ctx.translate(x,y);ctx.rotate(-.35);ctx.strokeStyle='rgba(230,210,170,.6)';ctx.lineWidth=r*.16;ctx.beginPath();ctx.ellipse(0,0,r*1.7,r*.45,0,front?0:Math.PI,front?Math.PI:TAU);ctx.stroke();ctx.restore()};
  if(ring)rg(false);const g=ctx.createRadialGradient(x-r*.4,y-r*.4,r*.1,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'#0b0e22');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.globalAlpha=.1;ctx.fillStyle='#fff';for(let i=-2;i<=2;i++)ctx.fillRect(x-r,y+i*r*.34-r*.05,r*2,r*.1);ctx.restore();if(ring)rg(true)}
function moon(x,y,r){ctx.fillStyle='#b9bccb';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle='rgba(60,64,90,.35)';[[.3,-.2,.25],[-.35,.25,.18],[.1,.45,.12],[-.2,-.4,.14]].forEach(([a,b,c])=>{ctx.beginPath();ctx.arc(x+a*r,y+b*r,c*r,0,TAU);ctx.fill()})}
function sun(x,y,r){const g=ctx.createRadialGradient(x,y,r*.2,x,y,r*2.6);g.addColorStop(0,'#fff6d8');g.addColorStop(.3,'rgba(255,200,90,.9)');g.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.6,0,TAU);ctx.fill();ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
const rockPts=()=>Array.from({length:9},()=>rnd(.72,1.08));
function mkRock(x,y,r,spd){const a=rnd(0,TAU);return{x,y,r,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,rot:rnd(0,TAU),spin:rnd(-1.2,1.2),pts:rockPts()}}
const DEFPTS=rockPts();
function rock(o,col='#8b90aa'){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rot||0);const p=o.pts||DEFPTS,r=o.r;ctx.fillStyle=col;ctx.beginPath();p.forEach((k,i)=>{const a=i/p.length*TAU;ctx[i?'lineTo':'moveTo'](Math.cos(a)*r*k,Math.sin(a)*r*k)});ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.arc(r*.25,r*.1,r*.22,0,TAU);ctx.moveTo(-r*.3+r*.14,-r*.25);ctx.arc(-r*.3,-r*.25,r*.14,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.arc(-r*.2,-r*.3,r*.35,0,TAU);ctx.fill();ctx.restore()}
function gem(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.rotate(REDUCE?0:Math.sin(E.t*2+x)*.3);const g=ctx.createRadialGradient(0,0,0,0,0,18*s);g.addColorStop(0,'rgba(197,139,255,.5)');g.addColorStop(1,'rgba(197,139,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,18*s,0,TAU);ctx.fill();
  ctx.fillStyle='#d9b4ff';ctx.beginPath();ctx.moveTo(0,-9*s);ctx.lineTo(6*s,0);ctx.lineTo(0,9*s);ctx.lineTo(-6*s,0);ctx.closePath();ctx.fill();ctx.restore()}
function glow(x,y,r,c){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function ufo(x,y,s=1,c='#56e39f'){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(150,255,200,.25)';ctx.beginPath();ctx.arc(0,-5,10,Math.PI,TAU);ctx.fill();ctx.strokeStyle='#bfffe0';ctx.lineWidth=1.5;ctx.stroke();
  const g=ctx.createLinearGradient(0,-6,0,6);g.addColorStop(0,'#d8dcef');g.addColorStop(1,'#6a7096');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,22,7,0,0,TAU);ctx.fill();
  for(let i=-2;i<=2;i++){ctx.fillStyle=(Math.floor(E.t*6)+i+2)%2?c:'#ffd27a';ctx.beginPath();ctx.arc(i*8,1,2,0,TAU);ctx.fill()}ctx.restore()}
function alien(x,y,k){const c=['#ff7aa8','#c58bff','#5fd4ff','#56e39f'][k%4],w=Math.sin(E.t*6+x*.05)*3;ctx.save();ctx.translate(x,y);ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,14,10,0,0,TAU);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-8,6);ctx.lineTo(-12,13+w);ctx.moveTo(8,6);ctx.lineTo(12,13-w);ctx.moveTo(-5,-8);ctx.lineTo(-8,-15);ctx.moveTo(5,-8);ctx.lineTo(8,-15);ctx.stroke();ctx.fillStyle='#0a0d1d';ctx.beginPath();ctx.arc(-5,-1,3,0,TAU);ctx.moveTo(8,-1);ctx.arc(5,-1,3,0,TAU);ctx.fill();ctx.restore()}
function astro(x,y,s=1,a=0){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(s,s);ctx.fillStyle='#9aa3c8';ctx.fillRect(-12,-3,6,15);ctx.fillStyle='#eef1fb';ctx.fillRect(-7,-4,14,17);ctx.fillRect(-7,12,5,9);ctx.fillRect(2,12,5,9);ctx.fillRect(7,-2,4,11);
  ctx.beginPath();ctx.arc(0,-12,9,0,TAU);ctx.fill();ctx.fillStyle='#ffb347';ctx.beginPath();ctx.ellipse(1.5,-12,6,4.5,0,0,TAU);ctx.fill();ctx.restore()}
function comet(x,y,vx,vy,len=90,s=1){const d=Math.hypot(vx,vy)||1,tx=x-vx/d*len,ty=y-vy/d*len,g=ctx.createLinearGradient(x,y,tx,ty);g.addColorStop(0,'rgba(190,240,255,.85)');g.addColorStop(1,'rgba(95,212,255,0)');ctx.save();ctx.strokeStyle=g;ctx.lineCap='round';ctx.lineWidth=9*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.stroke();glow(x,y,16*s,'rgba(200,245,255,.8)');ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,5*s,0,TAU);ctx.fill();ctx.restore()}
function sat(x,y,a=0,s=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(s,s);ctx.fillStyle='#3d63b8';ctx.fillRect(-28,-6,18,12);ctx.fillRect(10,-6,18,12);ctx.strokeStyle='#9fb6ff';ctx.lineWidth=1;ctx.strokeRect(-28,-6,18,12);ctx.strokeRect(10,-6,18,12);ctx.fillStyle='#d9a441';ctx.fillRect(-9,-8,18,16);ctx.fillStyle='#e8eaf6';ctx.beginPath();ctx.arc(0,-12,4,0,TAU);ctx.fill();ctx.restore()}
function txt(s,x,y,size=16,col='#e8eaf6',al='center',wt=700,fam=FONT){ctx.save();ctx.direction='rtl';ctx.textAlign=al;ctx.textBaseline='middle';ctx.font=`${wt} ${size}px ${fam}`;ctx.fillStyle=col;ctx.fillText(s,x,y);ctx.restore()}
function wrapText(s,x,y,maxW,lh,size,col){ctx.save();ctx.font=`700 ${size}px ${FONT}`;const lines=[];let line='';for(const w of s.split(' ')){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w}else line=t}lines.push(line);ctx.restore();lines.forEach((l,i)=>txt(l,x,y+i*lh,size,col));return lines.length}
function icon(k,x,y,s=1){switch(k){case'planet':planet(x,y,22*s,'#56e39f');break;case'ring':planet(x,y,17*s,'#e8c07a',true);break;case'rocket':ship(x,y,-Math.PI/2,.6,1.7*s);break;case'ufo':ufo(x,y,1.3*s);break;case'hole':hole(x,y,11*s);break;case'comet':comet(x+12*s,y-12*s,1,-1,50*s,s);break;case'moon':moon(x,y,20*s);break;case'sun':sun(x,y,13*s);break;case'astro':astro(x,y,1.4*s);break;case'sat':sat(x,y,-.4,s)}}
function drawFx(){for(const p of E.fx){ctx.globalAlpha=Math.max(0,1-p.t/p.l);ctx.fillStyle=p.col;ctx.fillRect(p.x-1.5,p.y-1.5,3,3)}ctx.globalAlpha=1}
function wrap(o,m=0){if(o.x<-m)o.x=W+m;else if(o.x>W+m)o.x=-m;if(o.y<-m)o.y=H+m;else if(o.y>H+m)o.y=-m}

/* ---------- App shell ---------- */
const Arcade=(()=>{
  const $=id=>document.getElementById(id);let cv,mainCtx,dpr=1,lastHud=0,msgFn=null,best={};
  try{best=JSON.parse(localStorage.getItem('space-arcade-best')||'{}')}catch(e){best={}}
  const PADL={ArrowLeft:'◀',ArrowRight:'▶',ArrowUp:'▲',ArrowDown:'▼',Space:'●'};
  function saveBest(id,sc){if(sc>(best[id]||0)){best[id]=sc;try{localStorage.setItem('space-arcade-best',JSON.stringify(best))}catch(e){}return true}return false}
  function fit(){dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr}
  function show(t,b,btn,fn,second){$('msgT').textContent=t;$('msgB').textContent=b;$('msgBtn').textContent=btn;$('msgBtn2').hidden=!second;msgFn=fn;$('msg').hidden=false;try{$('msgBtn').focus({preventScroll:true})}catch(e){}}
  function hideMsg(){$('msg').hidden=true}
  function play(g,now){Snd.thrustOff();E.game=g;E.fx=[];E.score=0;KEYS.clear();HITS.clear();g.init();
    if(now){E.state='play';hideMsg()}else{E.state='ready';show(g.name,g.desc,'התחילו',()=>{E.state='play'},false)}}
  function panel(g){const i=GAMES.indexOf(g);$('pNum').textContent=`משחק ${i+1} מתוך ${GAMES.length}`;$('pName').textContent=g.name;$('pEn').textContent=g.en;$('pDesc').textContent=g.desc;
    $('pHow').innerHTML='';g.how.forEach(h=>{const li=document.createElement('li');li.textContent=h;$('pHow').appendChild(li)});$('pKeys').textContent=g.keys;$('pBest').textContent=best[g.id]?`השיא שלכם: ${best[g.id]}`:'עוד אין לכם שיא במשחק הזה.';
    const pad=$('pad');pad.innerHTML='';if(g.pad&&matchMedia('(pointer:coarse)').matches){pad.hidden=false;g.pad.forEach(k=>{const b=document.createElement('button');b.className='pbtn';b.textContent=(g.padText&&g.padText[k])||PADL[k];b.setAttribute('aria-label',k);
      const dn=e=>{e.preventDefault();Snd.init();KEYS.add(k);HITS.add(k);b.classList.add('on')},up=()=>{KEYS.delete(k);b.classList.remove('on')};b.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,up));b.addEventListener('contextmenu',e=>e.preventDefault());pad.appendChild(b)})}else pad.hidden=true}
  function route(){const id=location.hash.slice(1),g=GAMES.find(x=>x.id===id);
    if(g){$('hub').hidden=true;$('player').hidden=false;panel(g);play(g,false);window.scrollTo(0,0)}
    else{$('player').hidden=true;$('hub').hidden=false;Snd.thrustOff();E.game=null;E.state='idle';refreshBest()}}
  function refreshBest(){document.querySelectorAll('.card').forEach(c=>{const b=best[c.dataset.id];c.querySelector('.best').textContent=b?`שיא: ${b}`:''})}
  function thumbs(){const k=Math.min(2,devicePixelRatio||1);GAMES.forEach(g=>{const c=document.querySelector(`.card[data-id="${g.id}"] canvas`);if(!c)return;c.width=240*k;c.height=150*k;const t=c.getContext('2d');t.setTransform(.3*k,0,0,.3*k,0,0);ctx=t;E.t=rnd(1,9);try{g.init();const st=E.state;E.state='thumb';for(let i=0;i<70;i++){E.t+=1/60;g.update(1/60)}E.state=st;E.score=0;E.fx=[];g.draw()}catch(e){console.error(g.id,e)}});ctx=mainCtx}
  function buildHub(){const grid=$('grid');GAMES.forEach((g,i)=>{const a=document.createElement('a');a.className='card';a.href='#'+g.id;a.dataset.id=g.id;a.dataset.tag=g.tag;
    a.innerHTML=`<canvas aria-hidden="true"></canvas><div class="meta"><span class="num">${String(i+1).padStart(2,'0')}</span><span class="tag">${g.tag}</span></div><h3></h3><p class="en"></p><p class="best"></p>`;a.querySelector('h3').textContent=g.name;a.querySelector('.en').textContent=g.en;grid.appendChild(a)});
    $('count').textContent=GAMES.length;
    document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c===ch)));const f=ch.dataset.f;document.querySelectorAll('.card').forEach(c=>c.hidden=f!=='all'&&c.dataset.tag!==f)}))}
  function toLocal(e){const r=cv.getBoundingClientRect();E.ptr.x=(e.clientX-r.left)/r.width*W;E.ptr.y=(e.clientY-r.top)/r.height*H}
  function step(){const now=performance.now();let dt=Math.min(.25,(now-last)/1000);last=now;E.t+=dt;
    if(E.game&&E.state==='play'){let first=true;while(dt>1e-6){const d=Math.min(1/60,dt);E.tap=first&&tapQ;if(first)tapQ=false;try{E.game.update(d)}catch(e){console.error(e)}if(first)HITS.clear();first=false;E.tap=false;dt-=d;if(E.state!=='play')break}}
    else{HITS.clear();tapQ=false}
    for(let i=E.fx.length-1;i>=0;i--){const p=E.fx[i];p.t+=.016;p.x+=p.vx*.016;p.y+=p.vy*.016;p.vx*=.98;p.vy*=.98;if(p.t>p.l)E.fx.splice(i,1)}
    if(now-lastDraw>110)render(now)}
  let last=performance.now(),lastDraw=0;
  function render(now){lastDraw=now;if(!E.game)return;ctx=mainCtx;ctx.setTransform(dpr,0,0,dpr,0,0);try{E.game.draw()}catch(e){console.error(e)}drawFx();
    if(now-lastHud>120){lastHud=now;const items=[['ניקוד',Math.floor(E.score)],...(E.game.hud?E.game.hud():[])];$('hud').innerHTML=items.map(([k,v])=>`<div class="chip2"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}}
  function frame(now){render(now);requestAnimationFrame(frame)}
  function boot(){cv=$('game');mainCtx=cv.getContext('2d');ctx=mainCtx;fit();addEventListener('resize',fit);buildHub();
    try{thumbs()}catch(e){console.error(e)}if(document.fonts)document.fonts.ready.then(()=>{if(!E.game)thumbs()});
    cv.addEventListener('pointerdown',e=>{Snd.init();toLocal(e);E.ptr.down=true;E.ptr.active=true;tapQ=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
    cv.addEventListener('pointermove',e=>{toLocal(e);E.ptr.active=true});
    ['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,e=>{toLocal(e);E.ptr.down=false}));
    cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){E.ptr.active=false;E.ptr.down=false}});
    cv.addEventListener('contextmenu',e=>e.preventDefault());
    addEventListener('keydown',e=>{if(!E.game)return;if(E.state==='play'&&/^(Arrow|Space)/.test(e.code))e.preventDefault();KEYS.add(e.code);if(!e.repeat)HITS.add(e.code)});
    addEventListener('keyup',e=>KEYS.delete(e.code));addEventListener('blur',()=>KEYS.clear());
    $('msgBtn').addEventListener('click',()=>{Snd.init();const f=msgFn;hideMsg();f&&f()});
    $('msgBtn2').addEventListener('click',()=>{location.hash=''});$('back').addEventListener('click',()=>{location.hash=''});
    $('restart').addEventListener('click',()=>{Snd.init();if(E.game)play(E.game,true)});
    const mv=d=>{const i=GAMES.indexOf(E.game);location.hash=GAMES[(i+d+GAMES.length)%GAMES.length].id};$('prev').addEventListener('click',()=>mv(-1));$('next').addEventListener('click',()=>mv(1));
    $('mute').addEventListener('click',e=>{Snd.init();const m=!Snd.muted;Snd.setMuted(m);e.currentTarget.setAttribute('aria-pressed',String(m));e.currentTarget.textContent=m?'🔇 צליל כבוי':'🔊 צליל פועל'});
    addEventListener('hashchange',route);route();setInterval(step,16);requestAnimationFrame(frame)}
  return{boot,play,show,saveBest}
})();
