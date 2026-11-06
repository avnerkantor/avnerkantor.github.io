'use strict';
/* ===== Games 1-10 ===== */

GAMES.push({id:'asteroids',name:'סערת אסטרואידים',en:'Asteroid Storm',tag:'אקשן',
desc:'החללית שלכם תקועה בתוך שדה אסטרואידים. פוצצו אותם לחתיכות ושרדו כמה שיותר גלים.',
how:['חיצים ימינה ושמאלה מסובבים את החללית, חץ למעלה מפעיל מנוע.','רווח יורה. אסטרואיד גדול מתפצל לשני אסטרואידים קטנים יותר.','יש לכם 3 חיים. אחרי פגיעה יש 2 שניות של הגנה.'],
keys:'← → סיבוב · ↑ מנוע · רווח ירי',pad:['ArrowLeft','ArrowRight','ArrowUp','Space'],
init(){this.s={x:W/2,y:H/2,vx:0,vy:0,a:-Math.PI/2};this.b=[];this.r=[];this.lives=3;this.inv=2;this.wave=0;this.cd=0;this.next()},
next(){this.wave++;for(let i=0;i<3+this.wave;i++){let x,y;do{x=rnd(0,W);y=rnd(0,H)}while(dist(x,y,this.s.x,this.s.y)<170);this.r.push(mkRock(x,y,rnd(34,44),rnd(30,60)+this.wave*6))}},
update(dt){const s=this.s;s.a+=E.ax().x*3.6*dt;this.th=E.up();if(this.th){s.vx+=Math.cos(s.a)*260*dt;s.vy+=Math.sin(s.a)*260*dt}Snd.thrust(this.th,.12);
  s.vx*=1-.5*dt;s.vy*=1-.5*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;wrap(s);this.inv-=dt;this.cd-=dt;
  if(E.key('Space')&&this.cd<=0){this.cd=.22;this.b.push({x:s.x+Math.cos(s.a)*16,y:s.y+Math.sin(s.a)*16,vx:Math.cos(s.a)*520+s.vx,vy:Math.sin(s.a)*520+s.vy,l:.9});Snd.tone(880,.06,'square',.05,440)}
  for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;wrap(b)}
  for(const r of this.r){r.x+=r.vx*dt;r.y+=r.vy*dt;r.rot+=r.spin*dt;wrap(r,r.r)}
  const add=[];for(const b of this.b)for(const r of this.r)if(b.l>0&&!r.dead&&dist(b.x,b.y,r.x,r.y)<r.r){b.l=0;r.dead=1;E.boom(r.x,r.y,12,'#c7cbe0');Snd.hit();E.score+=r.r>30?20:r.r>18?50:100;if(r.r>18)for(let k=0;k<2;k++)add.push(mkRock(r.x,r.y,r.r*.55,rnd(60,120)+this.wave*8))}
  this.r=this.r.filter(r=>!r.dead).concat(add);this.b=this.b.filter(b=>b.l>0);
  if(this.inv<=0)for(const r of this.r)if(dist(s.x,s.y,r.x,r.y)<r.r+9){this.lives--;E.boom(s.x,s.y,30,'#ffb070',180);Snd.burst(.6,.4,500);Object.assign(s,{x:W/2,y:H/2,vx:0,vy:0});this.inv=2;if(this.lives<=0)return E.over(false,'החללית התרסקה',`שרדתם ${this.wave} גלים.`);break}
  if(!this.r.length){E.score+=100*this.wave;Snd.level();this.next()}},
draw(){bg();for(const r of this.r)rock(r);ctx.fillStyle='#ffd27a';for(const b of this.b)ctx.fillRect(b.x-2,b.y-2,4,4);const s=this.s;if(this.inv<=0||Math.floor(E.t*10)%2)ship(s.x,s.y,s.a,this.th?1:0,1.1)},
hud(){return[['גל',this.wave],['חיים','♥'.repeat(Math.max(0,this.lives))]]}});

GAMES.push({id:'lander',name:'נחיתה על הירח',en:'Moon Lander',tag:'דיוק',
desc:'הנחיתו את רכב הנחיתה בעדינות על המשטח הירוק. כל נחיתה מוצלחת מובילה לשלב קשה יותר.',
how:['חץ למעלה או רווח מפעילים את המנוע ומאטים את הנפילה.','חיצים ימינה ושמאלה מטים את הרכב כדי לזוז הצידה.','נוחתים רק כשהמהירות האנכית מתחת ל-45, המהירות הצידית מתחת ל-25 והרכב ישר.'],
keys:'↑ או רווח מנוע · ← → הטיה',pad:['ArrowLeft','ArrowRight','ArrowUp'],
init(){this.lvl=0;this.fuel=65;this.newLevel()},
newLevel(){this.lvl++;const ys=[];let y=rnd(330,430);for(let i=0;i<=16;i++){ys.push(y);y=clamp(y+rnd(-60,60),260,470)}const p=rndi(3,12);ys[p+1]=ys[p+2]=ys[p];this.ys=ys;this.pad={x1:p*50,x2:(p+2)*50,y:ys[p]};this.s={x:80,y:60,vx:rnd(15,40),vy:0,a:0};this.g=24+this.lvl*4;this.fuel=Math.min(100,this.fuel+35)},
ground(x){const i=clamp(Math.floor(x/50),0,15),f=clamp(x/50-i,0,1);return this.ys[i]+(this.ys[i+1]-this.ys[i])*f},
update(dt){const s=this.s;s.a=clamp(s.a+E.ax().x*2.2*dt,-1.3,1.3);this.th=(E.up()||E.key('Space'))&&this.fuel>0;Snd.thrust(this.th,.16);
  if(this.th){s.vx+=Math.sin(s.a)*80*dt;s.vy-=Math.cos(s.a)*80*dt;this.fuel=Math.max(0,this.fuel-13*dt)}
  s.vy+=this.g*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.x<0||s.x>W)return E.over(false,'יצאתם מאזור הנחיתה','');
  const gy=this.ground(s.x);if(s.y+13>=gy){Snd.thrustOff();const P=this.pad,onPad=s.x>P.x1+6&&s.x<P.x2-6,ok=onPad&&Math.abs(s.vy)<45&&Math.abs(s.vx)<25&&Math.abs(s.a)<.3;
    if(ok){E.score+=Math.round(50+this.fuel*5);Snd.level();E.boom(s.x,gy,16,'#56e39f',80);this.newLevel()}else{E.boom(s.x,s.y,40,'#ffb070',170);return E.over(false,'הרכב התרסק',onPad?'מהר מדי או עקום. נחתו לאט וישר.':'צריך לנחות על המשטח הירוק.')}}},
draw(){bg(0,0,false);ctx.fillStyle='#262b44';ctx.beginPath();ctx.moveTo(0,H);this.ys.forEach((y,i)=>ctx.lineTo(i*50,y));ctx.lineTo(W,H);ctx.closePath();ctx.fill();ctx.strokeStyle='#5c6490';ctx.lineWidth=2;ctx.beginPath();this.ys.forEach((y,i)=>ctx[i?'lineTo':'moveTo'](i*50,y));ctx.stroke();
  const P=this.pad;ctx.strokeStyle='#56e39f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(P.x1,P.y);ctx.lineTo(P.x2,P.y);ctx.stroke();ctx.fillStyle=Math.floor(E.t*3)%2?'#56e39f':'#1f5c40';ctx.fillRect(P.x1,P.y-8,4,8);ctx.fillRect(P.x2-4,P.y-8,4,8);
  planet(690,80,34,'#3b7bd8');const s=this.s;lander(s.x,s.y,s.a,this.th?1:0)},
hud(){const s=this.s;return[['שלב',this.lvl],['דלק',Math.round(this.fuel)+'%'],['אנכית',Math.round(s.vy)+(Math.abs(s.vy)<45?' ✓':'')],['צידית',Math.round(s.vx)+(Math.abs(s.vx)<25?' ✓':'')]]}});

GAMES.push({id:'invaders',name:'גל הפולשים',en:'Invader Wave',tag:'אקשן',
desc:'שורות של חייזרים יורדות לעבר הבסיס. ירו בהם לפני שהם נוחתים.',
how:['זזים ימינה ושמאלה עם החיצים או עם העכבר.','רווח או לחיצה על המסך יורים.','ככל שנשארים פחות חייזרים, הם זזים מהר יותר.'],
keys:'← → תנועה · רווח ירי · אפשר גם עכבר',pad:['ArrowLeft','ArrowRight','Space'],
init(){this.px=W/2;this.wave=0;this.lives=3;this.newWave()},
newWave(){this.wave++;this.al=[];for(let r=0;r<4;r++)for(let c=0;c<9;c++)this.al.push({x:140+c*60,y:60+r*44,r});this.dir=1;this.spd=26+this.wave*8;this.pb=[];this.eb=[];this.cd=0;this.inv=0},
update(dt){const ax=E.ax().x;if(ax)this.px+=ax*340*dt;else if(E.ptr.active)this.px+=(E.ptr.x-this.px)*Math.min(1,dt*10);this.px=clamp(this.px,30,W-30);this.cd-=dt;this.inv-=dt;
  if((E.key('Space')||E.ptr.down)&&this.cd<=0){this.cd=.35;this.pb.push({x:this.px,y:440});Snd.tone(660,.08,'square',.05,330)}
  const n=this.al.length,sp=this.spd*(1+(36-n)/14);let edge=false;for(const a of this.al){a.x+=this.dir*sp*dt;if(a.x>W-30||a.x<30)edge=true}
  if(edge){this.dir*=-1;for(const a of this.al){a.y+=16;a.x+=this.dir*3}}
  if(n&&Math.random()<dt*(.6+this.wave*.25)){const a=pick(this.al);this.eb.push({x:a.x,y:a.y+10})}
  for(const b of this.pb)b.y-=480*dt;for(const b of this.eb)b.y+=220*dt;
  for(const b of this.pb)for(const a of this.al)if(!a.dead&&!b.dead&&Math.abs(b.x-a.x)<18&&Math.abs(b.y-a.y)<14){a.dead=b.dead=1;E.score+=(4-a.r)*10;E.boom(a.x,a.y,12,'#56e39f');Snd.burst(.2,.2,1200)}
  for(const b of this.eb)if(!b.dead&&this.inv<=0&&Math.abs(b.x-this.px)<20&&Math.abs(b.y-452)<14){b.dead=1;this.lives--;this.inv=1.5;E.boom(this.px,452,24,'#ffb070');Snd.burst(.5,.4,500);if(this.lives<=0)return E.over(false,'הבסיס נפל',`הגעתם לגל ${this.wave}.`)}
  this.al=this.al.filter(a=>!a.dead);this.pb=this.pb.filter(b=>!b.dead&&b.y>-10);this.eb=this.eb.filter(b=>!b.dead&&b.y<H+10);
  if(this.al.some(a=>a.y>420))return E.over(false,'הפולשים נחתו',`הגעתם לגל ${this.wave}.`);if(!this.al.length){Snd.level();E.score+=100;this.newWave()}},
draw(){bg();for(const a of this.al)alien(a.x,a.y,a.r);ctx.fillStyle='#ffd27a';for(const b of this.pb)ctx.fillRect(b.x-2,b.y-8,4,12);ctx.fillStyle='#ff5468';for(const b of this.eb)ctx.fillRect(b.x-2,b.y-6,4,10);
  ctx.fillStyle='rgba(86,227,159,.15)';ctx.fillRect(0,476,W,24);if(this.inv<=0||Math.floor(E.t*10)%2)ship(this.px,452,-Math.PI/2,.3,1.3)},
hud(){return[['גל',this.wave],['חיים','♥'.repeat(Math.max(0,this.lives))]]}});

GAMES.push({id:'tunnel',name:'מנהרת האסטרואידים',en:'Asteroid Tunnel',tag:'מיומנות',
desc:'טוסו בין עמודי אסטרואידים בלי לגעת בהם. כל לחיצה נותנת דחיפה קטנה כלפי מעלה.',
how:['לחיצה על המסך, רווח או חץ למעלה מפעילים פרץ מנוע.','בלי לחיצה, החללית נופלת למטה.','כל מעבר שעברתם שווה נקודה. המרווחים הולכים ומצטמצמים.'],
keys:'רווח / ↑ / לחיצה',pad:['Space'],padText:{Space:'דחיפה'},
init(){this.y=H/2;this.vy=0;this.cols=[];this.tm=.4;this.passed=0;this.fl=0},
update(dt){if(E.fire()||E.tap||E.hit('ArrowUp')){this.vy=-310;Snd.tone(320,.12,'sine',.1,600);this.fl=.15}
  this.fl-=dt;this.vy+=900*dt;this.y+=this.vy*dt;this.tm-=dt;const sp=170+this.passed*3;
  if(this.tm<=0){this.tm=1.55;const gap=Math.max(125,175-this.passed*2);this.cols.push({x:W+40,gy:rnd(70+gap/2,H-70-gap/2),gap})}
  for(const c of this.cols){c.x-=sp*dt;if(!c.p&&c.x<200){c.p=1;this.passed++;E.score++;Snd.chime()}}this.cols=this.cols.filter(c=>c.x>-60);
  const die=()=>{E.boom(200,this.y,30,'#ffb070');E.over(false,'פגעתם באסטרואיד',`עברתם ${this.passed} מעברים.`)};
  if(this.y<0||this.y>H)return die();for(const c of this.cols)if(Math.abs(c.x-200)<36&&(this.y<c.gy-c.gap/2+8||this.y>c.gy+c.gap/2-8))return die()},
column(x,y1,y2){if(y2<=y1)return;ctx.save();ctx.beginPath();ctx.rect(x-40,y1,80,y2-y1);ctx.clip();ctx.fillStyle='#4a4f6a';ctx.beginPath();for(let y=y1-10;y<y2+30;y+=24){const j=Math.sin(y*.37)*6;ctx.moveTo(x+30+j,y);ctx.arc(x+j,y,30,0,TAU)}ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';for(let y=y1+12;y<y2;y+=46){ctx.beginPath();ctx.arc(x+8+Math.sin(y)*6,y,6,0,TAU);ctx.fill()}ctx.restore()},
draw(){bg(E.t*60,0);for(const c of this.cols){this.column(c.x,0,c.gy-c.gap/2);this.column(c.x,c.gy+c.gap/2,H)}ship(200,this.y,clamp(this.vy/600,-.6,.9),this.fl>0?1:.2,1.1)},
hud(){return[['מעברים',this.passed]]}});

GAMES.push({id:'meteor-rain',name:'גשם מטאורים',en:'Meteor Rain',tag:'מיומנות',
desc:'מטאורים בוערים נופלים מהשמיים. התחמקו מהם ואספו את הגבישים הסגולים.',
how:['זזים ימינה ושמאלה עם החיצים או עם העכבר והאצבע.','גביש סגול שווה 25 נקודות, וכל שנייה ששורדים מוסיפה עוד.','יש לכם מגן ששורד 3 פגיעות.'],
keys:'← → או עכבר',pad:['ArrowLeft','ArrowRight'],
init(){this.x=W/2;this.m=[];this.tm=0;this.time=0;this.sh=3;this.inv=0},
update(dt){this.time+=dt;E.score+=dt*10;const ax=E.ax().x;if(ax)this.x+=ax*400*dt;else if(E.ptr.active)this.x+=(E.ptr.x-this.x)*Math.min(1,dt*12);this.x=clamp(this.x,20,W-20);this.inv-=dt;
  this.tm-=dt;if(this.tm<=0){this.tm=Math.max(.12,.55-this.time*.008);const g=Math.random()<.15;this.m.push({x:rnd(10,W-10),y:-20,r:g?10:rnd(10,26),v:rnd(160,260)+this.time*4,g,rot:0,pts:rockPts(),spin:rnd(-2,2)})}
  for(const o of this.m){o.y+=o.v*dt;o.rot+=o.spin*dt;if(!o.dead&&dist(o.x,o.y,this.x,455)<o.r+14){o.dead=1;if(o.g){E.score+=25;Snd.chime();E.boom(o.x,o.y,14,'#d9b4ff')}else if(this.inv<=0){this.sh--;this.inv=1.2;Snd.burst(.4,.35,600);E.boom(o.x,o.y,20,'#ffb070');if(this.sh<=0)return E.over(false,'המגן קרס',`שרדתם ${Math.floor(this.time)} שניות.`)}}}
  this.m=this.m.filter(o=>!o.dead&&o.y<H+40)},
draw(){bg(0,-E.t*30);for(const o of this.m){if(o.g){gem(o.x,o.y);continue}const g=ctx.createLinearGradient(o.x,o.y,o.x,o.y-o.r*4);g.addColorStop(0,'rgba(255,150,60,.7)');g.addColorStop(1,'rgba(255,80,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(o.x-o.r*.8,o.y);ctx.lineTo(o.x,o.y-o.r*4.5);ctx.lineTo(o.x+o.r*.8,o.y);ctx.fill();rock(o,'#9a7f74')}
  if(this.inv>0){ctx.strokeStyle='rgba(95,212,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(this.x,455,24,0,TAU);ctx.stroke()}ship(this.x,455,-Math.PI/2,.4,1.3)},
hud(){return[['זמן',Math.floor(this.time)+'s'],['מגן','◆'.repeat(Math.max(0,this.sh))]]}});

GAMES.push({id:'orbit',name:'שומר המסלול',en:'Orbit Keeper',tag:'מיומנות',
desc:'החללית מקיפה חור שחור, והוא מושך אותה פנימה כל הזמן. השתמשו במנוע כדי להישאר במסלול ולאסוף גבישים.',
how:['החזיקו רווח, חץ למעלה או לחיצה כדי להתרחק מהחור.','כשמשחררים, הכבידה מושכת פנימה. ככל שמתקרבים, היא חזקה יותר.','אל תחצו את הקו האדום הפנימי ואל תצאו מהטבעת החיצונית. שרדו 60 שניות.'],
keys:'החזיקו רווח / ↑ / לחיצה',pad:['Space'],padText:{Space:'מנוע'},
init(){this.a=0;this.r=150;this.vr=0;this.time=0;this.gems=[];for(let i=0;i<4;i++)this.addGem()},
addGem(){this.gems.push({a:this.a+rnd(1,5.5),r:rnd(95,215)})},
update(dt){this.time+=dt;const hold=E.key('Space')||E.ptr.down||E.up();this.hold=hold;Snd.thrust(hold,.14);
  this.vr+=(-6000/this.r+(hold?120:0))*dt;this.vr*=1-.6*dt;this.r+=this.vr*dt;this.a+=200/this.r*dt;
  for(const g of this.gems){const d=angDiff(g.a,this.a);if(Math.abs(d)<.09&&Math.abs(this.r-g.r)<18){g.dead=1;E.score+=10;Snd.chime();E.boom(400+Math.cos(g.a)*g.r,250+Math.sin(g.a)*g.r,12,'#d9b4ff')}}
  this.gems=this.gems.filter(g=>!g.dead);while(this.gems.length<4)this.addGem();
  if(this.r<60)return E.over(false,'נבלעתם בחור השחור',`החזקתם ${Math.floor(this.time)} שניות.`);if(this.r>235)return E.over(false,'ברחתם מהמסלול',`החזקתם ${Math.floor(this.time)} שניות.`);
  if(this.time>=60){E.score+=100;return E.over(true,'60 שניות במסלול!','')}},
draw(){bg();const cx=400,cy=250;ctx.setLineDash([6,6]);ctx.lineWidth=1.5;ctx.strokeStyle='rgba(255,84,104,.8)';ctx.beginPath();ctx.arc(cx,cy,60,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(95,212,255,.5)';ctx.beginPath();ctx.arc(cx,cy,235,0,TAU);ctx.stroke();ctx.setLineDash([]);
  hole(cx,cy,30);for(const g of this.gems)gem(cx+Math.cos(g.a)*g.r,cy+Math.sin(g.a)*g.r);ship(cx+Math.cos(this.a)*this.r,cy+Math.sin(this.a)*this.r,this.a+Math.PI/2,this.hold?1:0,1.1)},
hud(){return[['זמן',`${Math.floor(this.time)}/60`],['מרחק',Math.round(this.r)]]}});

GAMES.push({id:'earth-defense',name:'מגן כדור הארץ',en:'Earth Defense',tag:'אקשן',
desc:'אסטרואידים צונחים לעבר ערי כדור הארץ. שגרו טילי יירוט שמתפוצצים בנקודה שבה לחצתם.',
how:['לחצו בשמיים כדי לשגר טיל יירוט לנקודה הזו.','הפיצוץ מתרחב לשנייה ומשמיד כל אסטרואיד שנוגע בו.','כדאי ללחוץ קצת לפני האסטרואיד, כי לטיל לוקח זמן להגיע.'],
keys:'לחיצה בעכבר או נגיעה',
init(){this.cities=[110,250,550,690].map(x=>({x,alive:true}));this.ast=[];this.ex=[];this.ms=[];this.tm=1;this.time=0;this.cd=0},
update(dt){this.time+=dt;E.score+=dt*2;this.cd-=dt;this.tm-=dt;const alive=this.cities.filter(c=>c.alive);
  if(this.tm<=0&&alive.length){this.tm=Math.max(.4,1.6-this.time*.02);const tx=pick(alive).x+rnd(-8,8),x=rnd(0,W),sp=rnd(38,62)+this.time*1.1,d=dist(x,-10,tx,440);this.ast.push({x,y:-10,sx:x,sy:-10,vx:(tx-x)/d*sp,vy:450/d*sp})}
  if(E.tap&&this.cd<=0){this.cd=.2;const tx=E.ptr.x,ty=Math.min(E.ptr.y,420),d=Math.max(1,dist(400,445,tx,ty));this.ms.push({x:400,y:445,tx,ty,vx:(tx-400)/d*650,vy:(ty-445)/d*650,l:d/650});Snd.tone(900,.15,'triangle',.07,300)}
  for(const m of this.ms){m.x+=m.vx*dt;m.y+=m.vy*dt;m.l-=dt;if(m.l<=0){m.dead=1;this.ex.push({x:m.tx,y:m.ty,t:0});Snd.burst(.4,.22,1400)}}
  for(const e of this.ex)e.t+=dt;
  for(const a of this.ast){a.x+=a.vx*dt;a.y+=a.vy*dt;for(const e of this.ex){const R=48*Math.sin(Math.min(1,e.t/.8)*Math.PI);if(dist(a.x,a.y,e.x,e.y)<R+6){a.dead=1;E.score+=25;break}}
    if(!a.dead&&a.y>=438){a.dead=1;E.boom(a.x,440,24,'#ffb070');Snd.burst(.6,.4,400);for(const c of this.cities)if(c.alive&&Math.abs(c.x-a.x)<32)c.alive=false}}
  this.ast=this.ast.filter(a=>!a.dead);this.ms=this.ms.filter(m=>!m.dead);this.ex=this.ex.filter(e=>e.t<.8);
  if(!this.cities.some(c=>c.alive))return E.over(false,'כל הערים נפגעו',`הגנתם ${Math.floor(this.time)} שניות.`)},
draw(){bg();const g=ctx.createLinearGradient(0,430,0,H);g.addColorStop(0,'#2f7fd1');g.addColorStop(1,'#123a6b');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(400,830,700,390,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(120,200,255,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(400,830,704,394,0,Math.PI,TAU);ctx.stroke();
  for(const c of this.cities){if(c.alive){ctx.fillStyle='#c7d2f0';ctx.beginPath();ctx.arc(c.x,452,16,Math.PI,TAU);ctx.fill();ctx.fillStyle='#ffd27a';for(let i=-1;i<=1;i++)ctx.fillRect(c.x+i*7-1.5,444,3,3)}else{ctx.fillStyle='#4a3a3a';ctx.fillRect(c.x-14,448,28,5)}}
  ctx.fillStyle='#e8eaf6';ctx.beginPath();ctx.arc(400,448,10,Math.PI,TAU);ctx.fill();
  for(const a of this.ast){ctx.strokeStyle='rgba(255,140,70,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(a.x,a.y);ctx.stroke();rock({x:a.x,y:a.y,r:8,rot:a.x},'#a08070')}
  for(const m of this.ms){ctx.strokeStyle='rgba(95,212,255,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(400,445);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(m.x-2,m.y-2,4,4)}
  for(const e of this.ex){const R=48*Math.sin(Math.min(1,e.t/.8)*Math.PI);glow(e.x,e.y,R+4,'rgba(255,230,170,.9)')}
  if(E.ptr.active){ctx.strokeStyle='rgba(95,212,255,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(E.ptr.x,E.ptr.y,10,0,TAU);ctx.moveTo(E.ptr.x-16,E.ptr.y);ctx.lineTo(E.ptr.x+16,E.ptr.y);ctx.moveTo(E.ptr.x,E.ptr.y-16);ctx.lineTo(E.ptr.x,E.ptr.y+16);ctx.stroke()}},
hud(){return[['ערים',this.cities.filter(c=>c.alive).length+'/4'],['זמן',Math.floor(this.time)+'s']]}});

GAMES.push({id:'docking',name:'עגינה בתחנת החלל',en:'Station Docking',tag:'דיוק',
desc:'בחלל אין חיכוך, וכל דחיפה ממשיכה לפעול. הביאו את החללית לנמל העגינה לאט ובדיוק.',
how:['חיצים מפעילים מנועי כיוון קטנים לכל צד. אפשר גם להחזיק לחיצה לכיוון הרצוי.','כדי לעצור צריך לדחוף לכיוון ההפוך.','עוגנים כשהמהירות מתחת ל-30 והחללית מול האורות הירוקים. צריך 3 עגינות.'],
keys:'חיצים או החזקת לחיצה',pad:['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'],
init(){this.s={x:90,y:rnd(120,380),vx:0,vy:0};this.fuel=100;this.time=0;this.round=1;this.py=250},
update(dt){const s=this.s;this.time+=dt;this.py=250+Math.sin(this.time*.6)*(this.round-1)*35;
  let ax=E.ax();if(!ax.x&&!ax.y&&E.ptr.down){const dx=E.ptr.x-s.x,dy=E.ptr.y-s.y,d=Math.hypot(dx,dy)||1;ax={x:dx/d,y:dy/d}}
  const on=(ax.x||ax.y)&&this.fuel>0;Snd.thrust(on,.1);if(on){s.vx+=ax.x*45*dt;s.vy+=ax.y*45*dt;this.fuel=Math.max(0,this.fuel-5*dt);E.puff(s.x-ax.x*14,s.y-ax.y*14,-ax.x*90,-ax.y*90,'#cfe8ff')}
  s.x+=s.vx*dt;s.y+=s.vy*dt;const sp=Math.hypot(s.vx,s.vy);
  if(s.x+16>=690&&Math.abs(s.y-this.py)<120){const dy=Math.abs(s.y-this.py);if(dy<14&&sp<30){E.score+=Math.round(100+this.fuel*3);Snd.level();this.round++;if(this.round>3)return E.over(true,'שלוש עגינות מושלמות!','');Object.assign(s,{x:90,y:rnd(100,400),vx:0,vy:0});this.fuel=Math.min(100,this.fuel+40)}
    else{E.boom(s.x,s.y,40,'#ffb070',160);return E.over(false,'התנגשות בתחנה',sp>=30?'מהר מדי. גשו לנמל במהירות מתחת ל-30.':'לא הייתם מול נמל העגינה.')}}
  if(s.x<-30||s.x>W+30||s.y<-30||s.y>H+30)return E.over(false,'החללית התרחקה מהתחנה','')},
draw(){bg();const py=this.py;ctx.fillStyle='#3d63b8';ctx.fillRect(712,py-200,70,60);ctx.fillRect(712,py+140,70,60);ctx.strokeStyle='#9fb6ff';ctx.strokeRect(712,py-200,70,60);ctx.strokeRect(712,py+140,70,60);
  const g=ctx.createLinearGradient(690,0,800,0);g.addColorStop(0,'#c7cbe0');g.addColorStop(1,'#6a7096');ctx.fillStyle=g;ctx.fillRect(700,py-140,100,280);ctx.fillStyle='#8f9ccc';ctx.fillRect(690,py-22,14,44);
  ctx.fillStyle=Math.floor(E.t*3)%2?'#56e39f':'#1f5c40';ctx.fillRect(686,py-26,6,6);ctx.fillRect(686,py+20,6,6);ctx.setLineDash([4,8]);ctx.strokeStyle='rgba(86,227,159,.4)';ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(686,py);ctx.stroke();ctx.setLineDash([]);
  const s=this.s;ship(s.x,s.y,0,0,1.2)},
hud(){const sp=Math.hypot(this.s.vx,this.s.vy);return[['עגינה',`${Math.min(3,this.round)}/3`],['מהירות',Math.round(sp)+(sp<30?' ✓':' ✗')],['דלק',Math.round(this.fuel)+'%']]}});

GAMES.push({id:'belt-runner',name:'חגורת האסטרואידים',en:'Belt Runner',tag:'מיומנות',
desc:'טסים במהירות דרך חגורת האסטרואידים שבין מאדים לצדק. החליפו נתיב כדי להתחמק ואספו תאי אנרגיה.',
how:['חץ למעלה ולמטה מעבירים נתיב. במסך מגע לוחצים על הנתיב הרצוי.','תא אנרגיה ירוק שווה 50 נקודות.','המהירות עולה כל הזמן. יש מגן ששורד 3 פגיעות.'],
keys:'↑ ↓ או לחיצה על נתיב',pad:['ArrowUp','ArrowDown'],
init(){this.lane=1;this.y=250;this.obs=[];this.tm=0;this.d=0;this.sh=3;this.inv=0;this.sp=260},
update(dt){if(E.hit('ArrowUp')||E.hit('KeyW'))this.lane=Math.max(0,this.lane-1);if(E.hit('ArrowDown')||E.hit('KeyS'))this.lane=Math.min(2,this.lane+1);if(E.tap)this.lane=E.ptr.y<H/3?0:E.ptr.y<2*H/3?1:2;
  this.y+=(150+this.lane*100-this.y)*Math.min(1,dt*12);this.sp+=dt*6;this.d+=this.sp*dt;E.score+=this.sp*dt/20;this.inv-=dt;this.tm-=dt;
  if(this.tm<=0){this.tm=rnd(.55,.95)*300/this.sp;const ls=shuffle([0,1,2]),n=Math.random()<.35?2:1;for(let i=0;i<n;i++)this.obs.push({x:W+40,l:ls[i],k:'r',r:rnd(24,32),rot:0,pts:rockPts()});if(Math.random()<.35)this.obs.push({x:W+40,l:ls[2],k:'c'})}
  for(const o of this.obs){o.x-=this.sp*dt;o.rot+=dt;if(!o.dead&&Math.abs(o.x-150)<30&&Math.abs(150+o.l*100-this.y)<34){if(o.k==='c'){o.dead=1;E.score+=50;Snd.chime();E.boom(o.x,150+o.l*100,12,'#56e39f')}else if(this.inv<=0){o.dead=1;this.sh--;this.inv=1;Snd.burst(.4,.35,600);E.boom(150,this.y,20,'#ffb070');if(this.sh<=0)return E.over(false,'החללית התרסקה',`טסתם ${Math.floor(this.d/100)} ק"מ.`)}}}
  this.obs=this.obs.filter(o=>!o.dead&&o.x>-60)},
draw(){bg(E.t*this.sp*.5,0);ctx.setLineDash([20,20]);ctx.lineDashOffset=E.t*this.sp;ctx.strokeStyle='rgba(95,212,255,.12)';for(const y of[200,300]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.setLineDash([]);
  for(const o of this.obs){const y=150+o.l*100;if(o.k==='c'){glow(o.x,y,24,'rgba(86,227,159,.5)');ctx.fillStyle='#56e39f';ctx.fillRect(o.x-7,y-12,14,24);ctx.fillStyle='#0a0d1d';ctx.fillRect(o.x-4,y-8,8,6)}else rock({x:o.x,y,r:o.r,rot:o.rot,pts:o.pts})}
  if(this.inv<=0||Math.floor(E.t*10)%2)ship(150,this.y,0,1,1.3)},
hud(){return[['מרחק',Math.floor(this.d/100)+' ק"מ'],['מגן','◆'.repeat(Math.max(0,this.sh))]]}});

GAMES.push({id:'comet-catcher',name:'ציידי השביטים',en:'Comet Catcher',tag:'מיומנות',
desc:'שביטים חוצים את השמיים במהירות. לחצו עליהם כדי ללכוד אותם לפני שהם יוצאים מהמסך.',
how:['לחצו על ראש השביט, הנקודה הבהירה.','שביט מהיר שווה יותר נקודות.','אל תלחצו על לוויינים. כל שביט שבורח או לוויין שנפגע מוריד ניסיון אחד מתוך 5.'],
keys:'לחיצה בעכבר או נגיעה',
init(){this.c=[];this.tm=.5;this.miss=0;this.time=0},
update(dt){this.time+=dt;this.tm-=dt;if(this.tm<=0){this.tm=Math.max(.35,1.1-this.time*.012);const isSat=Math.random()<.2,side=Math.random()<.5,y0=rnd(40,H-40),y1=rnd(40,H-40),x0=side?-30:W+30,x1=side?W+30:-30,sp=(rnd(160,240)+this.time*3)*(isSat?.7:1),d=dist(x0,y0,x1,y1);this.c.push({x:x0,y:y0,vx:(x1-x0)/d*sp,vy:(y1-y0)/d*sp,sat:isSat})}
  for(const c of this.c){c.x+=c.vx*dt;c.y+=c.vy*dt}
  if(E.tap){const h=this.c.find(c=>dist(c.x,c.y,E.ptr.x,E.ptr.y)<32);if(h){h.dead=1;if(h.sat){this.miss++;Snd.burst(.4,.3,500);E.boom(h.x,h.y,20,'#ff5468')}else{E.score+=Math.round(Math.hypot(h.vx,h.vy)/10);Snd.chime();E.boom(h.x,h.y,20,'#9fe3ff')}}}
  for(const c of this.c)if(!c.dead&&(c.x<-40||c.x>W+40)){c.dead=1;if(!c.sat){this.miss++;Snd.warn()}}
  this.c=this.c.filter(c=>!c.dead);if(this.miss>=5)return E.over(false,'נגמרו הניסיונות',`צדתם ${Math.floor(this.time)} שניות.`)},
draw(){bg();for(const c of this.c)c.sat?sat(c.x,c.y,E.t):comet(c.x,c.y,c.vx,c.vy,90);if(E.ptr.active){ctx.strokeStyle='rgba(255,210,122,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(E.ptr.x,E.ptr.y,14,0,TAU);ctx.stroke()}},
hud(){return[['ניסיונות','♥'.repeat(Math.max(0,5-this.miss))]]}});
