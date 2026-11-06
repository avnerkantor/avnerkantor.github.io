'use strict';
/* ===== Games 21-30 ===== */

GAMES.push({id:'launch',name:'שיגור רב-שלבי',en:'Multistage Launch',tag:'דיוק',
desc:'לרקטה יש שלושה שלבים. הדליקו כל שלב בדיוק כשהמחוג באזור הירוק כדי להגיע למסלול.',
how:['המחוג נע הלוך ושוב. לחצו רווח או על המסך כשהוא באזור הירוק.','ככל שאתם מדויקים יותר, השלב מוסיף יותר גובה.','בכל שלב המחוג מהיר יותר והאזור צר יותר. צריך להגיע ל-160 ק"מ.'],
keys:'רווח / לחיצה',pad:['Space'],padText:{Space:'הצתה'},
init(){this.st=0;this.alt=0;this.ph='aim';this.n=0;this.dir=1;this.zone={c:rnd(.3,.7),w:.2};this.drops=[];this.goal=0},
update(dt){for(const d of this.drops){d.y+=d.vy*dt;d.vy+=60*dt;d.r+=dt}this.drops=this.drops.filter(d=>d.y<H+80);
  if(this.ph==='aim'){this.n+=this.dir*(.9+this.st*.5)*dt;if(this.n>1){this.n=1;this.dir=-1}if(this.n<0){this.n=0;this.dir=1}
    if(E.fire()||E.tap){const q=clamp(1-Math.abs(this.n-this.zone.c)/(this.zone.w*1.5),0,1);this.q=q;this.ph='burn';this.bt=2;this.from=this.alt;this.goal=this.alt+[50,60,70][this.st]*(.3+.7*q);E.score+=Math.round(q*100);Snd.thrustOn(.25);q>.8?Snd.chime():q<.3&&Snd.warn()}}
  else if(this.ph==='burn'){this.bt-=dt;this.alt=this.goal-(this.goal-this.from)*Math.max(0,this.bt/2)**2;
    if(this.bt<=0){Snd.thrustOff();this.drops.push({y:300,vy:20,r:0,st:this.st});Snd.burst(.4,.25,800);this.st++;if(this.st>=3){E.score+=Math.round(this.alt);return this.alt>=160?E.over(true,'הגעתם למסלול!',`גובה ${Math.round(this.alt)} ק"מ.`):E.over(false,'הרקטה לא הגיעה למסלול',`הגעתם ל-${Math.round(this.alt)} ק"מ, וצריך 160.`)}
      this.ph='aim';this.zone={c:rnd(.25,.75),w:.2-this.st*.05};this.n=0;this.dir=1}}},
draw(){const k=clamp(this.alt/120,0,1),g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgb(${Math.round(40*(1-k)+3)},${Math.round(90*(1-k)+4)},${Math.round(170*(1-k)+10)})`);g.addColorStop(1,`rgb(${Math.round(120*(1-k)+3)},${Math.round(170*(1-k)+4)},${Math.round(230*(1-k)+10)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(k>.4){ctx.globalAlpha=(k-.4)/.6;bg(0,-this.alt*3,false);ctx.globalAlpha=1}
  const gy=420+this.alt*12;if(gy<H+10){ctx.fillStyle='#2f5a2f';ctx.fillRect(0,gy,W,H);ctx.fillStyle='#6a7096';ctx.fillRect(330,gy-120,14,120)}
  for(const d of this.drops){ctx.save();ctx.translate(400,d.y+60+d.st*0);ctx.rotate(d.r);ctx.fillStyle=['#e8eaf6','#c7cbe0','#9aa3c8'][d.st];ctx.fillRect(-14,-30,28,60);ctx.restore()}
  const x=400,top=210;ctx.fillStyle='#e8eaf6';ctx.beginPath();ctx.moveTo(x,top-40);ctx.quadraticCurveTo(x+16,top-10,x+16,top);ctx.lineTo(x-16,top);ctx.quadraticCurveTo(x-16,top-10,x,top-40);ctx.fill();
  const segs=[['#9aa3c8',60],['#c7cbe0',60],['#e8eaf6',70]];let y=top;for(let i=2;i>=this.st;i--){ctx.fillStyle=segs[i][0];ctx.fillRect(x-16,y,32,segs[i][1]);ctx.strokeStyle='#3a4a7a';ctx.strokeRect(x-16,y,32,segs[i][1]);y+=segs[i][1]}
  if(this.ph==='burn'){const L=40+Math.random()*30,fg=ctx.createLinearGradient(0,y,0,y+L);fg.addColorStop(0,'rgba(255,250,220,.95)');fg.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=fg;ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x,y+L);ctx.lineTo(x+12,y);ctx.fill()}
  if(this.ph==='aim'&&this.st<3){ctx.fillStyle='rgba(6,8,20,.75)';ctx.fillRect(180,440,440,40);ctx.fillStyle='rgba(86,227,159,.6)';ctx.fillRect(200+(this.zone.c-this.zone.w/2)*400,448,this.zone.w*400,24);ctx.fillStyle='#ffd27a';ctx.fillRect(200+this.n*400-2,444,4,32);txt(`שלב ${this.st+1}`,400,425,22,'#e8eaf6','center',700,DISP)}
  txt(`${Math.round(this.alt)} ק"מ`,700,60,34,'#e8eaf6','center',700,DISP)},
hud(){return[['שלב',`${Math.min(this.st+1,3)}/3`],['גובה',Math.round(this.alt)+' ק"מ'],['יעד','160 ק"מ']]}});

GAMES.push({id:'solar-shield',name:'מגן סולארי',en:'Solar Shield',tag:'מיומנות',
desc:'סופה סולארית שולחת חלקיקים מסוכנים לעבר כדור הארץ. סובבו את המגן כדי לחסום אותם.',
how:['חיצים ימינה ושמאלה מסובבים את המגן. אפשר גם להזיז את העכבר סביב כדור הארץ.','חסמו את החלקיקים האדומים.','חלקיקים ירוקים יוצרים זוהר צפוני, אז תנו להם לעבור ותקבלו בונוס. שרדו 60 שניות.'],
keys:'← → או עכבר',pad:['ArrowLeft','ArrowRight'],
init(){this.ang=Math.PI;this.p=[];this.hp=100;this.time=0;this.tm=0;this.aur=0},
update(dt){this.time+=dt;this.aur-=dt;const ax=E.ax().x;if(ax)this.ang+=ax*3.4*dt;else if(E.ptr.active&&dist(E.ptr.x,E.ptr.y,400,250)>20){const t=Math.atan2(E.ptr.y-250,E.ptr.x-400);this.ang+=angDiff(t,this.ang)*Math.min(1,dt*14)}
  this.tm-=dt;if(this.tm<=0){this.tm=Math.max(.2,.8-this.time*.01);const a=Math.random()<.7?Math.PI+rnd(-.9,.9):rnd(0,TAU);this.p.push({a,r:440,sp:rnd(110,160)+this.time*1.6,good:Math.random()<.25})}
  for(const p of this.p){const pr=p.r;p.r-=p.sp*dt;if(pr>=110&&p.r<110&&Math.abs(angDiff(p.a,this.ang))<.55){p.dead=1;if(!p.good){E.score+=5;E.boom(400+Math.cos(p.a)*110,250+Math.sin(p.a)*110,8,'#ff9a3c',60);Snd.tone(700,.05,'square',.04)}}
    if(!p.dead&&p.r<48){p.dead=1;if(p.good){E.score+=20;this.aur=.8;Snd.chime()}else{this.hp-=12;Snd.burst(.3,.3,500);E.boom(400+Math.cos(p.a)*48,250+Math.sin(p.a)*48,14,'#ff5468');if(this.hp<=0)return E.over(false,'השדה המגנטי קרס',`החזקתם ${Math.floor(this.time)} שניות.`)}}}
  this.p=this.p.filter(p=>!p.dead);if(this.time>=60){E.score+=this.hp*2;return E.over(true,'כדור הארץ מוגן!','')}},
draw(){bg();sun(-40,250,110);ctx.strokeStyle='rgba(95,212,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(400,250,110,0,TAU);ctx.stroke();
  if(this.aur>0)glow(400,250,80,`rgba(86,227,159,${this.aur*.6})`);planet(400,250,46,'#3b8ee0');ctx.fillStyle='rgba(86,227,159,.5)';ctx.beginPath();ctx.ellipse(392,240,14,9,.4,0,TAU);ctx.fill();
  ctx.strokeStyle='#5fd4ff';ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.arc(400,250,110,this.ang-.55,this.ang+.55);ctx.stroke();ctx.lineCap='butt';glow(400+Math.cos(this.ang)*110,250+Math.sin(this.ang)*110,30,'rgba(95,212,255,.35)');
  for(const p of this.p){const x=400+Math.cos(p.a)*p.r,y=250+Math.sin(p.a)*p.r;glow(x,y,10,p.good?'rgba(86,227,159,.8)':'rgba(255,90,60,.85)');ctx.fillStyle=p.good?'#c8ffe0':'#ffd0c0';ctx.fillRect(x-2,y-2,4,4)}},
hud(){return[['זמן',`${Math.floor(this.time)}/60`],['שדה מגנטי',Math.max(0,this.hp)+'%']]}});

GAMES.push({id:'stacker',name:'בונים תחנת חלל',en:'Station Stacker',tag:'דיוק',
desc:'הרכיבו מגדל של מודולים לתחנת חלל. כל מודול צריך לנחות בדיוק על זה שמתחתיו.',
how:['המודול זז הלוך ושוב. לחצו רווח או על המסך כדי להוריד אותו.','החלק שבולט מעבר למודול התחתון נופל, והמודול הבא קטן יותר.','הנחה מושלמת שומרת על הרוחב ומוסיפה בונוס.'],
keys:'רווח / לחיצה',pad:['Space'],padText:{Space:'הורדה'},
COL:['#5fd4ff','#ff9a3c','#c58bff','#56e39f','#e8c07a','#ff7aa8'],
init(){this.stack=[{x:300,w:200}];this.cur={x:0,w:200,dir:1};this.sp=210;this.cam=0;this.fall=[]},
yOf(i){return 450-i*26},
update(dt){const c=this.cur;c.x+=c.dir*this.sp*dt;if(c.x>W-c.w){c.x=W-c.w;c.dir=-1}if(c.x<0){c.x=0;c.dir=1}
  for(const f of this.fall){f.y+=f.vy*dt;f.vy+=600*dt;f.r+=f.vr*dt}this.fall=this.fall.filter(f=>f.y<this.cam+H+100);
  if(E.fire()||E.tap){const top=this.stack[this.stack.length-1],y=this.yOf(this.stack.length);let x1=Math.max(c.x,top.x),x2=Math.min(c.x+c.w,top.x+top.w);
    if(Math.abs(c.x-top.x)<5){x1=top.x;x2=top.x+top.w;E.score+=3;Snd.chime()}else Snd.tone(300,.1,'triangle',.12);
    if(x2-x1<=0){this.fall.push({x:c.x,w:c.w,y,vy:0,r:0,vr:rnd(-2,2),i:this.stack.length});return E.over(false,'המודול נפל',`בניתם ${this.stack.length-1} מודולים.`)}
    if(c.x<x1)this.fall.push({x:c.x,w:x1-c.x,y,vy:0,r:0,vr:-1.5,i:this.stack.length});if(c.x+c.w>x2)this.fall.push({x:x2,w:c.x+c.w-x2,y,vy:0,r:0,vr:1.5,i:this.stack.length});
    this.stack.push({x:x1,w:x2-x1});E.score+=1;this.sp+=10;this.cur={x:this.stack.length%2?0:W-(x2-x1),w:x2-x1,dir:this.stack.length%2?1:-1}}
  this.cam+=(Math.min(0,this.yOf(this.stack.length)-160)-this.cam)*Math.min(1,dt*4)},
mod(x,y,w,i){const c=this.COL[i%6],g=ctx.createLinearGradient(0,y,0,y+24);g.addColorStop(0,'#e8eaf6');g.addColorStop(.5,c);g.addColorStop(1,'#2a3060');ctx.fillStyle=g;ctx.fillRect(x,y,w,24);ctx.fillStyle='rgba(10,13,29,.6)';for(let k=x+10;k<x+w-8;k+=22)ctx.fillRect(k,y+8,8,8)},
draw(){bg(0,this.cam*.5);ctx.save();ctx.translate(0,-this.cam);const gy=this.yOf(0)+24;ctx.fillStyle='#3d63b8';ctx.fillRect(240,gy,320,40);
  this.stack.forEach((s,i)=>this.mod(s.x,this.yOf(i),s.w,i));for(const f of this.fall){ctx.save();ctx.translate(f.x+f.w/2,f.y+12);ctx.rotate(f.r);this.mod(-f.w/2,-12,f.w,f.i);ctx.restore()}
  if(E.state!=='over')this.mod(this.cur.x,this.yOf(this.stack.length),this.cur.w,this.stack.length);ctx.restore()},
hud(){return[['מודולים',this.stack.length-1],['רוחב',Math.round(this.cur.w)]]}});

GAMES.push({id:'pulsar',name:'קצב הפולסר',en:'Pulsar Rhythm',tag:'מיומנות',
desc:'פולסר הוא כוכב נייטרונים שמסתובב ומהבהב בקצב קבוע. לחצו בדיוק כשהטבעת מגיעה לעיגול המטרה.',
how:['טבעות מתכווצות לעבר המרכז. לחצו רווח או על המסך כשהן נוגעות בעיגול המקווקו.','לחיצה מושלמת שווה יותר, ורצף של פגיעות מכפיל את הניקוד.','הקצב מאיץ עם הזמן. 8 החטאות מסיימות את המשחק, ושרדו 60 שניות כדי לנצח.'],
keys:'רווח / לחיצה',pad:['Space'],padText:{Space:'פעימה'},
init(){this.rings=[];this.bpm=80;this.beat=1;this.time=0;this.miss=0;this.combo=0;this.fb='';this.ft=0},
update(dt){this.time+=dt;this.ft-=dt;this.bpm=Math.min(150,80+this.time*1.2);const iv=60/this.bpm;this.beat-=dt;
  if(this.beat<=0){this.beat+=iv*(Math.random()<.2?.5:1);this.rings.push({r:330,v:260/(2*iv)});Snd.tone(180,.05,'sine',.06)}
  for(const g of this.rings){g.r-=g.v*dt;if(!g.dead&&g.r<48){g.dead=1;this.miss++;this.combo=0;this.fb='החטאה';this.ft=.5;Snd.warn()}}
  if(E.fire()||E.tap){let best=null;for(const g of this.rings)if(!g.dead&&(!best||Math.abs(g.r-70)<Math.abs(best.r-70)))best=g;
    if(best&&Math.abs(best.r-70)<60){const d=Math.abs(best.r-70);best.dead=1;if(d<9){this.combo++;E.score+=30*(1+this.combo/10);this.fb='מושלם!';Snd.tone(880,.12,'triangle',.15)}else if(d<22){this.combo++;E.score+=10*(1+this.combo/10);this.fb='טוב';Snd.tone(660,.1,'triangle',.12)}else{this.miss++;this.combo=0;this.fb='מוקדם מדי';Snd.warn()}this.ft=.5}}
  this.rings=this.rings.filter(g=>!g.dead);
  if(this.miss>=8)return E.over(false,'יצאתם מהקצב',`רצף אחרון: ${this.combo}.`);if(this.time>=60)return E.over(true,'שמרתם על הקצב!','')},
draw(){bg();ctx.save();ctx.translate(400,250);ctx.rotate(E.t*2.4);for(const s of[1,-1]){const g=ctx.createLinearGradient(0,0,0,s*260);g.addColorStop(0,'rgba(180,220,255,.5)');g.addColorStop(1,'rgba(180,220,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-30,s*260);ctx.lineTo(30,s*260);ctx.fill()}ctx.restore();
  glow(400,250,40,'rgba(220,240,255,.9)');ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(400,250,9,0,TAU);ctx.fill();
  ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(255,210,122,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(400,250,70,0,TAU);ctx.stroke();ctx.setLineDash([]);
  for(const g of this.rings){const k=Math.abs(g.r-70)<22;ctx.strokeStyle=k?'#ffd27a':'rgba(95,212,255,.8)';ctx.lineWidth=k?5:3;ctx.beginPath();ctx.arc(400,250,Math.max(1,g.r),0,TAU);ctx.stroke()}
  if(this.ft>0)txt(this.fb,400,60,40,this.fb==='מושלם!'?'#ffd27a':this.fb==='טוב'?'#56e39f':'#ff5468','center',700,DISP)},
hud(){return[['זמן',`${Math.floor(this.time)}/60`],['רצף',this.combo],['החטאות',`${this.miss}/8`]]}});

GAMES.push({id:'ufo-whack',name:'ציד עב"מים',en:'UFO Whack',tag:'מיומנות',
desc:'עב"מים מציצים מהמכתשים על הירח. לחצו עליהם מהר, אבל אל תפגעו באסטרונאוטים.',
how:['לחצו על עב"ם שיוצא ממכתש. במקלדת, המקשים 1 עד 9 מתאימים למכתשים.','לחיצה על אסטרונאוט מורידה חיים. יש 3 חיים.','יש לכם 45 שניות, והעב"מים הולכים ומאיצים.'],
keys:'לחיצה או מקשים 1-9',
P:[[220,190],[400,190],[580,190],[220,300],[400,300],[580,300],[220,410],[400,410],[580,410]],
init(){this.h=this.P.map(()=>({k:null,t:0,up:0}));this.time=45;this.lives=3;this.tm=.6},
whack(i){const h=this.h[i];if(!h||!h.k||h.up<.4)return;const[x,y]=this.P[i];if(h.k==='ufo'){E.score+=10;E.boom(x,y-30,14,'#56e39f');Snd.tone(900,.1,'square',.08,300)}else{this.lives--;Snd.warn();E.boom(x,y-30,10,'#ff5468');if(this.lives<=0)return E.over(false,'פגעתם באסטרונאוטים','')}h.k=null},
update(dt){this.time-=dt;if(this.time<=0)return E.over(true,'הזמן נגמר','');const el=45-this.time;
  this.tm-=dt;if(this.tm<=0){this.tm=Math.max(.32,.9-el*.013);const free=this.h.filter(h=>!h.k);if(free.length){const h=pick(free);h.k=Math.random()<.22?'astro':'ufo';h.t=Math.max(.65,1.4-el*.016);h.up=0}}
  for(const h of this.h)if(h.k){h.up=Math.min(1,h.up+dt*6);h.t-=dt;if(h.t<=0)h.k=null}
  for(let i=1;i<=9;i++)if(E.hit('Digit'+i)||E.hit('Numpad'+i))this.whack(i-1);
  if(E.tap){const i=this.P.findIndex(([x,y])=>Math.abs(E.ptr.x-x)<70&&E.ptr.y>y-90&&E.ptr.y<y+20);if(i>=0)this.whack(i)}},
draw(){ctx.fillStyle='#03040a';ctx.fillRect(0,0,W,H);bg(0,0,false);planet(700,70,36,'#3b8ee0');const g=ctx.createLinearGradient(0,120,0,H);g.addColorStop(0,'#5a5e72');g.addColorStop(1,'#2a2d3c');ctx.fillStyle=g;ctx.fillRect(0,130,W,H);
  this.P.forEach(([x,y],i)=>{const h=this.h[i];ctx.fillStyle='#1d1f2b';ctx.beginPath();ctx.ellipse(x,y,62,18,0,0,TAU);ctx.fill();
    if(h.k){ctx.save();ctx.beginPath();ctx.rect(x-80,y-120,160,120);ctx.clip();const yy=y+20-h.up*55;h.k==='ufo'?ufo(x,yy,1.6):astro(x,yy+4,1.5);ctx.restore()}
    ctx.strokeStyle='#6a6e84';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,62,18,0,0,Math.PI);ctx.stroke();txt(String(i+1),x+70,y+6,13,'rgba(255,255,255,.35)','center',600,FONT)})},
hud(){return[['זמן',Math.ceil(this.time)+'s'],['חיים','♥'.repeat(Math.max(0,this.lives))]]}});

GAMES.push({id:'antimatter',name:'חומר ואנטי-חומר',en:'Matter & Antimatter',tag:'מיומנות',
desc:'חור שחור פולט חלקיקים כחולים של חומר וכתומים של אנטי-חומר. החליפו את צבע החללית כדי לספוג רק חלקיקים בצבע שלה.',
how:['זזים ימינה ושמאלה עם החיצים או עם העכבר.','רווח, חץ למעלה או לחיצה מחליפים את הצבע בין כחול לכתום.','חלקיק בצבע שלכם מוסיף נקודות. חלקיק בצבע ההפוך מתאיין ומוריד חיים.'],
keys:'← → תנועה · רווח החלפת צבע',pad:['ArrowLeft','Space','ArrowRight'],padText:{Space:'צבע'},
C:['#5fd4ff','#ff9a3c'],
init(){this.x=400;this.col=0;this.p=[];this.tm=0;this.time=0;this.lives=3;this.inv=0},
update(dt){this.time+=dt;this.inv-=dt;if(E.fire()||E.tap||E.hit('ArrowUp')){this.col^=1;Snd.tone(this.col?520:780,.08,'triangle',.1)}
  const ax=E.ax().x;if(ax)this.x+=ax*420*dt;else if(E.ptr.active)this.x+=(E.ptr.x-this.x)*Math.min(1,dt*10);this.x=clamp(this.x,24,W-24);
  this.tm-=dt;if(this.tm<=0){this.tm=Math.max(.16,.55-this.time*.006);const a=Math.PI/2+rnd(-.9,.9),sp=rnd(140,210)+this.time*2;this.p.push({x:400,y:55,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,c:Math.random()<.5?0:1})}
  for(const p of this.p){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<8||p.x>W-8)p.vx*=-1;if(!p.dead&&dist(p.x,p.y,this.x,450)<26){p.dead=1;if(p.c===this.col){E.score+=10;Snd.tone(1000,.05,'sine',.08)}else if(this.inv<=0){this.lives--;this.inv=.8;Snd.burst(.5,.4,1200);E.boom(this.x,450,30,'#ffffff',200);if(this.lives<=0)return E.over(false,'החללית התאיינה',`שרדתם ${Math.floor(this.time)} שניות.`)}}}
  this.p=this.p.filter(p=>!p.dead&&p.y<H+20)},
draw(){bg();const jt=ctx.createLinearGradient(400,40,400,140);jt.addColorStop(0,'rgba(200,220,255,.4)');jt.addColorStop(1,'rgba(200,220,255,0)');ctx.fillStyle=jt;ctx.beginPath();ctx.moveTo(392,50);ctx.lineTo(330,160);ctx.lineTo(470,160);ctx.lineTo(408,50);ctx.fill();hole(400,45,18);
  for(const p of this.p){glow(p.x,p.y,13,p.c?'rgba(255,154,60,.85)':'rgba(95,212,255,.85)');txt(p.c?'−':'+',p.x,p.y+1,14,'#0a0d1d','center',700,FONT)}
  glow(this.x,450,40,this.col?'rgba(255,154,60,.45)':'rgba(95,212,255,.45)');ctx.strokeStyle=this.C[this.col];ctx.lineWidth=3;ctx.beginPath();ctx.arc(this.x,450,24,0,TAU);ctx.stroke();if(this.inv<=0||Math.floor(E.t*10)%2)ship(this.x,450,-Math.PI/2,.3,1.2)},
hud(){return[['צבע',this.col?'אנטי-חומר':'חומר'],['חיים','♥'.repeat(Math.max(0,this.lives))]]}});

GAMES.push({id:'dogfight',name:'קרב חלליות',en:'Dogfight',tag:'אקשן',
desc:'חלליות אויב רודפות אחריכם. התחמקו מהירי שלהן והפילו את כולן. בכל גל מגיעות יותר.',
how:['החללית פונה לכיוון העכבר, או מסתובבת עם החיצים ימינה ושמאלה.','החזקת לחיצה או חץ למעלה מפעילים מנוע.','הירי אוטומטי. יש לכם 5 נקודות שריון.'],
keys:'עכבר או ← → · ↑ / לחיצה מנוע',pad:['ArrowLeft','ArrowUp','ArrowRight'],
init(){this.s={x:400,y:250,vx:0,vy:0,a:0};this.hp=5;this.b=[];this.e=[];this.eb=[];this.wave=0;this.cd=0;this.inv=0;this.next()},
next(){this.wave++;for(let i=0;i<1+this.wave;i++){const a=rnd(0,TAU);this.e.push({x:400+Math.cos(a)*460,y:250+Math.sin(a)*460,vx:0,vy:0,a:a+Math.PI,hp:2,cd:rnd(1.2,2.4)})}},
update(dt){const s=this.s,ax=E.ax().x;if(ax)s.a+=ax*3.6*dt;else if(E.ptr.active)s.a+=angDiff(Math.atan2(E.ptr.y-s.y,E.ptr.x-s.x),s.a)*Math.min(1,dt*8);
  this.th=E.up()||E.ptr.down;Snd.thrust(this.th,.1);if(this.th){s.vx+=Math.cos(s.a)*240*dt;s.vy+=Math.sin(s.a)*240*dt}s.vx*=1-.8*dt;s.vy*=1-.8*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;wrap(s);this.inv-=dt;
  this.cd-=dt;if(this.cd<=0){this.cd=.26;this.b.push({x:s.x+Math.cos(s.a)*16,y:s.y+Math.sin(s.a)*16,vx:Math.cos(s.a)*520+s.vx,vy:Math.sin(s.a)*520+s.vy,l:.8});Snd.tone(980,.04,'square',.03,600)}
  for(const e of this.e){const t=Math.atan2(s.y-e.y,s.x-e.x),d=angDiff(t,e.a);e.a+=clamp(d,-2.2*dt,2.2*dt);e.vx+=Math.cos(e.a)*150*dt;e.vy+=Math.sin(e.a)*150*dt;e.vx*=1-.9*dt;e.vy*=1-.9*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;wrap(e,20);
    e.cd-=dt;if(e.cd<=0&&Math.abs(d)<.3&&dist(e.x,e.y,s.x,s.y)<420){e.cd=rnd(1.3,2.2);this.eb.push({x:e.x,y:e.y,vx:Math.cos(e.a)*300,vy:Math.sin(e.a)*300,l:1.6})}}
  for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;for(const e of this.e)if(e.hp>0&&b.l>0&&dist(b.x,b.y,e.x,e.y)<16){b.l=0;e.hp--;if(e.hp<=0){E.score+=50;E.boom(e.x,e.y,26,'#ff7a5a',160);Snd.hit()}}}
  for(const b of this.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(b.l>0&&this.inv<=0&&dist(b.x,b.y,s.x,s.y)<14){b.l=0;this.hp--;this.inv=.6;Snd.burst(.3,.3,700);E.boom(s.x,s.y,12,'#5fd4ff');if(this.hp<=0)return E.over(false,'החללית הופלה',`הגעתם לגל ${this.wave}.`)}}
  this.b=this.b.filter(b=>b.l>0);this.eb=this.eb.filter(b=>b.l>0);this.e=this.e.filter(e=>e.hp>0);if(!this.e.length){E.score+=100;Snd.level();this.next()}},
draw(){bg(this.s.x*.2,this.s.y*.2);ctx.fillStyle='#ffd27a';for(const b of this.b)ctx.fillRect(b.x-2,b.y-2,4,4);ctx.fillStyle='#ff5468';for(const b of this.eb){ctx.beginPath();ctx.arc(b.x,b.y,3.5,0,TAU);ctx.fill()}
  for(const e of this.e)ship(e.x,e.y,e.a,.5,1.1,'foe');if(this.inv<=0||Math.floor(E.t*12)%2)ship(this.s.x,this.s.y,this.s.a,this.th?1:.2,1.15)},
hud(){return[['גל',this.wave],['אויבים',this.e.length],['שריון','◆'.repeat(Math.max(0,this.hp))]]}});

const QUIZ=[
 ['איזה כוכב לכת הוא הגדול ביותר במערכת השמש?',['צדק','שבתאי','כדור הארץ','נפטון'],'אפשר להכניס לתוך צדק יותר מ-1,300 כדורי ארץ.'],
 ['כמה זמן לוקח לאור השמש להגיע לכדור הארץ?',['כ-8 דקות','כ-8 שניות','כ-8 שעות','כשנה'],'האור עובר כ-150 מיליון ק"מ בכ-8 דקות ו-20 שניות.'],
 ['מהו אופק האירועים של חור שחור?',['הגבול שממנו אפילו אור לא יכול לברוח','הטבעת הזוהרת סביב החור','החומר שנופל לתוך החור','המקום שבו נולד החור'],'מעבר לאופק האירועים, מהירות הבריחה גבוהה ממהירות האור.'],
 ['איך נקרא החור השחור שבמרכז שביל החלב?',['Sagittarius A*','אנדרומדה','Cygnus X-1','M87*'],'המסה שלו היא כ-4 מיליון מסות שמש. M87* נמצא בגלקסיה אחרת.'],
 ['איזה כוכב לכת מכונה "הכוכב האדום"?',['מאדים','נוגה','כוכב חמה','צדק'],'הצבע האדום מגיע מתחמוצת ברזל, כלומר חלודה, באבק שעל פני הכוכב.'],
 ['מי היה האדם הראשון שהלך על הירח?',['ניל ארמסטרונג','יורי גגרין','באז אולדרין','אילן רמון'],'ארמסטרונג הלך על הירח ב-1969. גגרין היה האדם הראשון בחלל, ב-1961.'],
 ['מי היה האסטרונאוט הישראלי הראשון?',['אילן רמון','איתן סטיבה','ניל ארמסטרונג','יורי גגרין'],'אילן רמון טס במעבורת קולומביה ב-2003. איתן סטיבה טס ב-2022.'],
 ['איזה כוכב לכת הוא החם ביותר במערכת השמש?',['נוגה','כוכב חמה','מאדים','צדק'],'כוכב חמה קרוב יותר לשמש, אבל האטמוספרה העבה של נוגה לוכדת חום של כ-460 מעלות.'],
 ['כמה כוכבי לכת יש במערכת השמש?',['8','9','7','12'],'מאז 2006 פלוטו מוגדר כוכב לכת ננסי.'],
 ['מהי בערך מהירות האור?',['300,000 ק"מ בשנייה','300 ק"מ בשנייה','3,000 ק"מ בשעה','30 ק"מ בשנייה'],'שום גוף שיש לו מסה לא יכול להגיע למהירות הזו.'],
 ['איזה טלסקופ חלל שוגר ב-2021 ורואה בעיקר באינפרא-אדום?',['ג\'יימס ווב','האבל','קפלר','גלילאו'],'ג\'יימס ווב שוגר בדצמבר 2021 ונמצא כ-1.5 מיליון ק"מ מכדור הארץ.'],
 ['מה גורם בעיקר לגאות ולשפל בים?',['כוח המשיכה של הירח','הרוח','סיבוב השמש','רעידות אדמה'],'גם לשמש יש השפעה, אבל היא קטנה בערך פי שניים מזו של הירח.'],
 ['לאיזה כוכב לכת יש את הטבעות הבולטות ביותר?',['שבתאי','מאדים','נוגה','כוכב חמה'],'גם לצדק, לאורנוס ולנפטון יש טבעות, אבל הן חלשות הרבה יותר.'],
 ['מה זה ספגטיפיקציה?',['מתיחה של גוף ליד חור שחור','סוג של כוכב שביט','מסלול סביב הירח','פיצוץ של כוכב'],'ההפרש בכוח המשיכה בין קצה אחד של הגוף לקצה השני מותח אותו לאורך.'],
 ['איך נקרא כוכב ענק שמתפוצץ בסוף חייו?',['סופרנובה','פולסר','קוואזר','ננס לבן'],'אחרי סופרנובה יכולים להישאר כוכב נייטרונים או חור שחור.']];
GAMES.push({id:'quiz',name:'חידון החלל',en:'Space Quiz',tag:'חשיבה',
desc:'עשר שאלות על כוכבי לכת, חורים שחורים ומסעות בחלל. אחרי כל תשובה מופיע הסבר קצר.',
how:['לחצו על התשובה הנכונה, או השתמשו במקשים 1 עד 4.','כל תשובה נכונה שווה 100 נקודות.','אחרי ההסבר לחצו שוב כדי לעבור לשאלה הבאה. 6 תשובות נכונות או יותר הן ניצחון.'],
keys:'לחיצה או מקשים 1-4',
BOX:[[410,240,330,70],[60,240,330,70],[410,330,330,70],[60,330,330,70]],
init(){this.q=shuffle(QUIZ.slice()).slice(0,10);this.i=0;this.right=0;this.load()},
load(){const Q=this.q[this.i];this.opts=shuffle(Q[1].map((t,j)=>({t,ok:j===0})));this.ans=-1;this.wait=0},
update(dt){if(this.ans>=0){this.wait+=dt;if(this.wait>.5&&(E.tap||E.fire()||E.hit('Enter')||this.wait>6)){this.i++;if(this.i>=this.q.length)return E.over(this.right>=6,this.right>=6?'אלופי החלל!':'כמעט!',`ענית נכון על ${this.right} מתוך 10.`);this.load()}return}
  let pickI=-1;for(let k=1;k<=4;k++)if(E.hit('Digit'+k)||E.hit('Numpad'+k))pickI=k-1;
  if(E.tap)pickI=this.BOX.findIndex(([x,y,w,h])=>E.ptr.x>x&&E.ptr.x<x+w&&E.ptr.y>y&&E.ptr.y<y+h);
  if(pickI>=0){this.ans=pickI;if(this.opts[pickI].ok){this.right++;E.score+=100;Snd.chime()}else Snd.warn()}},
draw(){bg();txt(`שאלה ${this.i+1} מתוך 10`,400,50,16,'#ff9a3c','center',700,FONT);wrapText(this.q[this.i][0],400,110,680,40,30,'#e8eaf6');
  this.opts.forEach((o,k)=>{const[x,y,w,h]=this.BOX[k];let bgc='#161b38',bc='#3b4478';if(this.ans>=0){if(o.ok){bgc='#123a2a';bc='#56e39f'}else if(k===this.ans){bgc='#3a1420';bc='#ff5468'}}
    ctx.fillStyle=bgc;ctx.fillRect(x,y,w,h);ctx.strokeStyle=bc;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);txt(String(k+1),x+w-22,y+h/2,16,'#ff9a3c','center',700,FONT);txt(o.t,x+w/2-8,y+h/2,20,'#e8eaf6','center',600,FONT)});
  if(this.ans>=0){wrapText(this.q[this.i][2],400,428,720,24,17,'#98a0c8');txt('לחצו כדי להמשיך',400,484,14,'#ff9a3c','center',600,FONT)}},
hud(){return[['נכונות',`${this.right}/10`]]}});

GAMES.push({id:'mars-landing',name:'נחיתה על מאדים',en:'Mars Landing',tag:'דיוק',
desc:'הרכב שלכם צולל באטמוספרה הדקה של מאדים. פתחו מצנח בזמן הנכון, ואז האטו עם מנועים לנחיתה רכה.',
how:['שלב 1: לחצו רווח או על המסך כדי לפתוח מצנח, רק כשהמהירות יורדת מתחת ל-450 מ\'/ש. מוקדם יותר, המצנח ייקרע.','שלב 2: החזיקו רווח או לחיצה כדי להפעיל את מנועי הבלימה. המצנח מתנתק אוטומטית.','נוגעים בקרקע במהירות מתחת ל-6 מ\'/ש. הדלק מוגבל.'],
keys:'רווח / לחיצה (ואז להחזיק)',pad:['Space'],padText:{Space:'מצנח / מנוע'},
init(){this.alt=8000;this.v=1400;this.ph=0;this.fuel=100;this.time=0;this.held=false},
update(dt){const p=dt*2;this.time+=dt;const hold=E.key('Space')||E.ptr.down;
  if(this.ph===0){if(E.fire()||E.tap){if(this.v>=450){E.boom(400,200,20,'#ffd27a');return E.over(false,'המצנח נקרע','פתחתם אותו מהר מדי. חכו שהמהירות תרד מתחת ל-450.')}this.ph=1;Snd.tone(200,.4,'sawtooth',.12,90);this.held=true}
    this.v+=(3.7-2.8e-4*this.v*this.v)*p}
  else if(this.ph===1){if(hold&&!this.held){this.ph=2;Snd.tone(500,.15,'triangle',.1)}if(!hold)this.held=false;this.v+=(3.7-6.6e-4*this.v*this.v)*p}
  if(this.ph===2){const on=hold&&this.fuel>0;this.on=on;Snd.thrust(on,.2);this.v+=(3.7-(on?10:0))*p;if(on)this.fuel=Math.max(0,this.fuel-7*p)}
  this.alt-=this.v*p;
  if(this.ph===0&&this.alt<800)return E.over(false,'מאוחר מדי','לא נשאר מספיק גובה לפתוח מצנח.');
  if(this.alt<=0){this.alt=0;Snd.thrustOff();if(this.v<6){E.score+=Math.round(200+this.fuel*8);E.boom(400,300,20,'#c96a3a',60);return E.over(true,'נחיתה רכה על מאדים!',`נגעתם בקרקע במהירות ${this.v.toFixed(1)} מ'/ש.`)}E.boom(400,290,40,'#ffb070',180);return E.over(false,'הרכב התרסק',`נגעתם בקרקע במהירות ${Math.round(this.v)} מ'/ש.`)}},
draw(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a1410');g.addColorStop(1,'#c47a52');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const gy=300+this.alt*.11;if(gy<H+40){ctx.fillStyle='#8a3e22';ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=40)ctx.lineTo(x,gy+Math.sin(x*.02)*6+(x<200||x>600?-Math.sin(x*.01)*25:0));ctx.lineTo(W,H);ctx.fill()}
  for(let i=0;i<14;i++){const y=((i*67+this.time*this.v*.2)%560)-30;ctx.fillStyle='rgba(255,220,190,.15)';ctx.fillRect((i*137)%W,y,2,18)}
  const x=400,y=270;if(this.ph===0&&this.v>500){glow(x,y+18,60,`rgba(255,140,60,${clamp((this.v-500)/900,0,.8)})`)}
  if(this.ph===1){ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-12,y-14);ctx.lineTo(x-60,y-90);ctx.moveTo(x+12,y-14);ctx.lineTo(x+60,y-90);ctx.stroke();ctx.fillStyle='#f2f2f2';ctx.beginPath();ctx.ellipse(x,y-90,62,30,0,Math.PI,TAU);ctx.fill();ctx.fillStyle='#ff9a3c';ctx.beginPath();ctx.ellipse(x,y-90,62,30,0,Math.PI,Math.PI*1.33);ctx.lineTo(x,y-90);ctx.fill();ctx.beginPath();ctx.ellipse(x,y-90,62,30,0,Math.PI*1.66,TAU);ctx.lineTo(x,y-90);ctx.fill()}
  if(this.ph===2&&this.on){for(const dx of[-14,14]){const L=18+Math.random()*16,fg=ctx.createLinearGradient(0,y+14,0,y+14+L);fg.addColorStop(0,'rgba(255,250,220,.95)');fg.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=fg;ctx.beginPath();ctx.moveTo(x+dx-5,y+14);ctx.lineTo(x+dx,y+14+L);ctx.lineTo(x+dx+5,y+14);ctx.fill()}}
  if(this.ph===0){ctx.fillStyle='#8a5a3a';ctx.beginPath();ctx.ellipse(x,y+10,30,10,0,0,Math.PI);ctx.fill();ctx.fillStyle='#d9dce8';ctx.beginPath();ctx.moveTo(x-28,y+10);ctx.lineTo(x-12,y-16);ctx.lineTo(x+12,y-16);ctx.lineTo(x+28,y+10);ctx.fill()}
  else{ctx.fillStyle='#d9dce8';ctx.fillRect(x-22,y-8,44,18);ctx.fillStyle='#6a7096';ctx.fillRect(x-26,y+10,52,5);ctx.fillStyle='#3a3f5c';for(const dx of[-18,0,18]){ctx.beginPath();ctx.arc(x+dx,y+18,5,0,TAU);ctx.fill()}ctx.fillStyle='#5fd4ff';ctx.fillRect(x+6,y-16,8,8)}
  const hint=this.ph===0?(this.v<450?'עכשיו אפשר לפתוח מצנח!':'חכו... המהירות גבוהה מדי למצנח'):this.ph===1?'החזיקו כדי להפעיל מנועי בלימה':'נגעו בקרקע במהירות מתחת ל-6';txt(hint,400,40,26,this.ph===0&&this.v<450?'#56e39f':'#ffe2c2','center',700,DISP)},
hud(){return[['גובה',Math.round(this.alt)+' מ\''],['מהירות',Math.round(this.v)+" מ'/ש"],['דלק',Math.round(this.fuel)+'%']]}});

GAMES.push({id:'telescope',name:'צייד בטלסקופ',en:'Telescope Hunt',tag:'חשיבה',
desc:'חפשו בשמי הלילה גלקסיות, ערפיליות וחורים שחורים נסתרים. רואים אותם רק דרך העדשה של הטלסקופ.',
how:['הזיזו את העדשה עם העכבר, עם האצבע או עם החיצים.','הצפצוף ומד האות מתחזקים ככל שמתקרבים לגרם השמיים.','כשהוא במרכז העדשה, לחצו או הקישו רווח כדי לצלם אותו. יש לכם 90 שניות.'],
keys:'עכבר / חיצים · לחיצה או רווח לצילום',pad:['ArrowLeft','ArrowUp','ArrowDown','ArrowRight','Space'],
NAMES:{galaxy:'גלקסיה ספירלית',nebula:'ערפילית',hole:'חור שחור',comet:'שביט',ring:'כוכב לכת עם טבעות'},
init(){this.stars=Array.from({length:240},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(.4,1.6)}));this.found=0;this.time=90;this.tx=400;this.ty=250;this.bt=0;this.msg=0;this.place()},
place(){this.obj={x:rnd(60,W-60),y:rnd(60,H-60),k:pick(Object.keys(this.NAMES)),rot:rnd(0,TAU)}},
update(dt){this.time-=dt;this.msg-=dt;if(this.time<=0)return E.over(this.found>=3,'נגמר זמן התצפית',`מצאתם ${this.found} גרמי שמיים.`);
  const ax=E.ax();if(ax.x||ax.y){this.tx+=ax.x*280*dt;this.ty+=ax.y*280*dt}else if(E.ptr.active){this.tx+=(E.ptr.x-this.tx)*Math.min(1,dt*12);this.ty+=(E.ptr.y-this.ty)*Math.min(1,dt*12)}this.tx=clamp(this.tx,0,W);this.ty=clamp(this.ty,0,H);
  const d=dist(this.tx,this.ty,this.obj.x,this.obj.y);this.sig=clamp(1-d/450,0,1);this.bt-=dt;if(this.bt<=0){this.bt=.12+(1-this.sig)*.9;Snd.tone(300+this.sig*800,.04,'sine',.05)}
  const cx=E.tap?E.ptr.x:this.tx,cy=E.tap?E.ptr.y:this.ty;if(E.tap||E.fire()){if(dist(cx,cy,this.obj.x,this.obj.y)<30){this.found++;E.score+=Math.round(50+this.time*2);Snd.level();this.last=this.NAMES[this.obj.k];this.msg=1.5;E.boom(this.obj.x,this.obj.y,20,'#ffd27a');this.place()}else if(E.fire())Snd.warn()}},
drawObj(o){const{x,y}=o;switch(o.k){
  case'galaxy':ctx.save();ctx.translate(x,y);ctx.rotate(o.rot);for(let i=0;i<60;i++){const a=i*.35,r=2+i*.45;for(const s of[0,Math.PI]){ctx.fillStyle=`rgba(200,210,255,${.8-i/80})`;ctx.fillRect(Math.cos(a+s)*r,Math.sin(a+s)*r*.6,2,2)}}glow(0,0,14,'rgba(255,240,200,.9)');ctx.restore();break;
  case'nebula':for(let i=0;i<5;i++)glow(x+Math.cos(o.rot+i*1.3)*12,y+Math.sin(o.rot+i*1.7)*10,26,i%2?'rgba(255,90,160,.4)':'rgba(95,180,255,.4)');break;
  case'hole':hole(x,y,9);break;case'comet':comet(x,y,Math.cos(o.rot),Math.sin(o.rot),50,.8);break;case'ring':planet(x,y,14,'#e8c07a',true)}},
draw(){ctx.fillStyle='#020308';ctx.fillRect(0,0,W,H);for(const s of this.stars){ctx.fillStyle='rgba(220,230,255,.3)';ctx.fillRect(s.x,s.y,s.r,s.r)}
  ctx.save();ctx.beginPath();ctx.arc(this.tx,this.ty,78,0,TAU);ctx.clip();ctx.fillStyle='#070b1c';ctx.fillRect(0,0,W,H);for(const s of this.stars){ctx.fillStyle='#fff';ctx.fillRect(s.x,s.y,s.r*1.6,s.r*1.6)}this.drawObj(this.obj);ctx.restore();
  ctx.strokeStyle='#9aa3c8';ctx.lineWidth=5;ctx.beginPath();ctx.arc(this.tx,this.ty,80,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(95,212,255,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(this.tx-80,this.ty);ctx.lineTo(this.tx+80,this.ty);ctx.moveTo(this.tx,this.ty-80);ctx.lineTo(this.tx,this.ty+80);ctx.stroke();
  ctx.fillStyle='rgba(6,8,20,.8)';ctx.fillRect(20,470,180,14);ctx.fillStyle=this.sig>.9?'#56e39f':'#ff9a3c';ctx.fillRect(22,472,176*(this.sig||0),10);
  if(this.msg>0)txt(`צילמתם ${this.last}!`,400,40,34,'#ffd27a','center',700,DISP)},
hud(){return[['נמצאו',this.found],['זמן',Math.ceil(this.time)+'s'],['אות',Math.round((this.sig||0)*100)+'%']]}});
