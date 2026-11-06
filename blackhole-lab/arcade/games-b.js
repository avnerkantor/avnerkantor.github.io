'use strict';
/* ===== Games 11-20 ===== */

GAMES.push({id:'planet-hop',name:'קופצים בין כוכבים',en:'Planet Hopper',tag:'מיומנות',
desc:'אתם עומדים על כוכב לכת מסתובב. קפצו בדיוק ברגע הנכון כדי לנחות על הכוכב הבא ולטפס למעלה.',
how:['החללית מסתובבת סביב הכוכב. הקו המרוסק מראה לאן תקפצו.','לחיצה, רווח או חץ למעלה משגרים את החללית בכיוון הקו.','נחיתה על כוכב גבוה יותר נותנת נקודות. אם נסחפים אל מחוץ למסך, המשחק נגמר.'],
keys:'רווח / לחיצה',pad:['Space'],padText:{Space:'קפיצה'},
COL:['#5fd4ff','#ff9a3c','#56e39f','#c58bff','#e8c07a','#ff7aa8'],
init(){this.p=[{x:W/2,y:420,r:40,w:1.3,c:'#5fd4ff'}];for(let i=0;i<6;i++)this.addP();this.on=0;this.top=0;this.a=-Math.PI/2;this.fly=null;this.cam=0},
addP(){const l=this.p[this.p.length-1],r=rnd(22,40);this.p.push({x:clamp(l.x+rnd(-260,260),70,W-70),y:l.y-rnd(150,200),r,w:rnd(1,2.1)*(Math.random()<.5?-1:1),c:pick(this.COL),ring:Math.random()<.25})},
update(dt){if(!this.fly){const P=this.p[this.on];this.a+=P.w*dt;if(E.tap||E.fire()||E.hit('ArrowUp')){this.fly={x:P.x+Math.cos(this.a)*(P.r+10),y:P.y+Math.sin(this.a)*(P.r+10),vx:Math.cos(this.a)*430,vy:Math.sin(this.a)*430};Snd.tone(300,.25,'sawtooth',.08,700)}}
  else{const f=this.fly;f.x+=f.vx*dt;f.y+=f.vy*dt;for(let i=0;i<this.p.length;i++){if(i===this.on)continue;const P=this.p[i];if(dist(f.x,f.y,P.x,P.y)<P.r+12){this.a=Math.atan2(f.y-P.y,f.x-P.x);if(i>this.top){E.score+=(i-this.top)*10;this.top=i;Snd.chime()}else Snd.tone(400,.1);this.on=i;this.fly=null;while(this.p.length<this.on+7)this.addP();break}}
    if(this.fly&&(f.x<-30||f.x>W+30||f.y-this.cam>H+30||f.y-this.cam<-260))return E.over(false,'נסחפתם לחלל',`טיפסתם ${this.top} כוכבים.`)}
  this.cam+=(this.p[this.on].y-380-this.cam)*Math.min(1,dt*3)},
draw(){bg(0,this.cam*.4);ctx.save();ctx.translate(0,-this.cam);for(const P of this.p)planet(P.x,P.y,P.r,P.c,P.ring);
  if(this.fly){const f=this.fly;ship(f.x,f.y,Math.atan2(f.vy,f.vx),1,1.1)}else{const P=this.p[this.on],x=P.x+Math.cos(this.a)*(P.r+10),y=P.y+Math.sin(this.a)*(P.r+10);ctx.setLineDash([6,7]);ctx.strokeStyle='rgba(95,212,255,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(this.a)*130,y+Math.sin(this.a)*130);ctx.stroke();ctx.setLineDash([]);ship(x,y,this.a,0,1.1)}ctx.restore()},
hud(){return[['גובה',this.top]]}});

GAMES.push({id:'eclipse',name:'ליקוי חמה',en:'Eclipse Timing',tag:'דיוק',
desc:'הירח חוצה את השמש. לחצו בדיוק ברגע שהוא מכסה אותה לגמרי כדי ליצור ליקוי חמה מלא.',
how:['לחצו על רווח או על המסך כשהירח בדיוק מעל השמש.','ככל שאתם מדויקים יותר, מקבלים יותר נקודות: עד 100 על ליקוי מושלם.','יש 10 סבבים, והירח מאיץ בכל סבב. שלוש החטאות מסיימות את המשחק.'],
keys:'רווח / לחיצה',pad:['Space'],padText:{Space:'עכשיו!'},
init(){this.round=0;this.miss=0;this.next()},
next(){this.round++;this.dir=Math.random()<.5?1:-1;this.mx=this.dir>0?-70:W+70;this.sp=rnd(150,210)+this.round*28;this.done=false;this.res='';this.wob=this.round>4?rnd(15,35):0},
my(){return 250+Math.sin(this.mx/45)*this.wob},
update(dt){if(!this.done){this.mx+=this.dir*this.sp*dt;if(E.fire()||E.tap){const d=Math.abs(this.mx-W/2);this.done=true;this.rt=1.2;let p=0;if(d<4){p=100;this.res='ליקוי מושלם!'}else if(d<12){p=60;this.res='מצוין'}else if(d<25){p=25;this.res='קרוב'}else{this.miss++;this.res='החטאה'}E.score+=p;p?Snd.chime():Snd.warn()}
    if((this.dir>0&&this.mx>W+70)||(this.dir<0&&this.mx<-70)){this.done=true;this.miss++;this.res='פספסתם';this.rt=1.2;Snd.warn()}}
  else{this.rt-=dt;if(this.rt<=0){if(this.miss>=3)return E.over(false,'שלוש החטאות',`הגעתם לסבב ${this.round}.`);if(this.round>=10)return E.over(true,'עשרה ליקויים!','');this.next()}}},
draw(){const ov=clamp(1-Math.abs(this.mx-W/2)/120,0,1);ctx.fillStyle='#03040a';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1-ov*.85;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a4b8d');g.addColorStop(1,'#6a8fc9');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;if(ov>.6)bg(0,0,false);
  if(ov>.85){ctx.save();ctx.translate(400,250);for(let i=0;i<24;i++){ctx.rotate(TAU/24);ctx.strokeStyle=`rgba(255,250,230,${(ov-.85)*3})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(64,0);ctx.lineTo(90+Math.sin(i*3)*25,0);ctx.stroke()}ctx.restore()}
  sun(400,250,60);ctx.fillStyle='#0b0d18';ctx.beginPath();ctx.arc(this.mx,this.my(),61,0,TAU);ctx.fill();
  ctx.fillStyle='rgba(20,30,20,.9)';ctx.fillRect(0,440,W,60);if(this.res)txt(this.res,400,80,44,this.res.includes('החטאה')||this.res.includes('פספסתם')?'#ff5468':'#ffd27a','center',700,DISP)},
hud(){return[['סבב',`${this.round}/10`],['החטאות',`${this.miss}/3`]]}});

const CONS=[{n:'העגלה הגדולה',p:[[150,170],[250,150],[330,185],[410,225],[430,320],[560,330],[585,235]]},{n:'קסיופאה',p:[[180,180],[280,310],[390,220],[500,320],[610,190]]},{n:'אוריון',p:[[300,100],[480,120],[430,245],[395,258],[360,270],[320,400],[490,390]]},{n:'עקרב',p:[[230,110],[290,140],[335,185],[360,245],[352,305],[380,358],[445,392],[515,372],[540,325]]},{n:'הצלב הדרומי',p:[[400,90],[400,400],[300,230],[495,250]]}];
GAMES.push({id:'constellations',name:'חברו את הכוכבים',en:'Constellations',tag:'חשיבה',
desc:'ציירו קבוצות כוכבים אמיתיות מהשמיים. לחצו על הכוכבים לפי הסדר כדי לחשוף את הצורה.',
how:['לחצו על הכוכבים המסומנים במספרים לפי הסדר, מ-1 והלאה.','לחיצה על כוכב לא נכון מורידה 2 שניות.','יש 5 קבוצות כוכבים. על כל אחת יש 25 שניות, וזמן שנשאר מוסיף נקודות.'],
keys:'לחיצה בעכבר או נגיעה',
init(){this.i=0;this.setup()},
setup(){const C=CONS[this.i];this.pts=C.p.map(([x,y])=>({x:x+rnd(-6,6),y:y+rnd(-6,6)}));this.k=0;this.tl=25;this.done=0;this.dec=Array.from({length:45},()=>({x:rnd(20,W-20),y:rnd(20,H-20),r:rnd(.8,2)}))},
update(dt){if(this.done>0){this.done-=dt;if(this.done<=0){this.i++;if(this.i>=CONS.length)return E.over(true,'מיפיתם את כל קבוצות הכוכבים','');this.setup()}return}
  this.tl-=dt;if(this.tl<=0)return E.over(false,'נגמר הזמן',`השלמתם ${this.i} קבוצות כוכבים.`);
  if(E.tap){let best=-1,bd=28;this.pts.forEach((p,j)=>{const d=dist(p.x,p.y,E.ptr.x,E.ptr.y);if(d<bd){bd=d;best=j}});if(best===this.k){this.k++;Snd.tone(500+this.k*70,.15,'triangle',.14);if(this.k>=this.pts.length){E.score+=Math.round(50+this.tl*10);Snd.level();this.done=1.8}}else if(best>=0&&best>this.k){this.tl-=2;Snd.warn()}}},
draw(){bg(0,0,true);for(const s of this.dec){ctx.fillStyle='rgba(220,230,255,.55)';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.fill()}
  ctx.strokeStyle='rgba(95,212,255,.8)';ctx.lineWidth=2;ctx.beginPath();for(let j=0;j<this.k;j++)ctx[j?'lineTo':'moveTo'](this.pts[j].x,this.pts[j].y);ctx.stroke();
  this.pts.forEach((p,j)=>{glow(p.x,p.y,16,'rgba(255,240,200,.6)');ctx.fillStyle=j<this.k?'#5fd4ff':'#fff';ctx.beginPath();ctx.arc(p.x,p.y,4,0,TAU);ctx.fill();if(j>=this.k)txt(String(j+1),p.x+14,p.y-14,15,'#ffd27a','center',700,FONT);
    if(j===this.k&&!this.done){ctx.strokeStyle=`rgba(255,210,122,${.5+.5*Math.sin(E.t*6)})`;ctx.beginPath();ctx.arc(p.x,p.y,13,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(95,212,255,.8)'}});
  if(this.done)txt(CONS[this.i].n,400,465,46,'#ffd27a','center',700,DISP)},
hud(){return[['קבוצה',`${Math.min(this.i+1,5)}/5`],['זמן',Math.max(0,Math.ceil(this.tl))+'s']]}});

const ICONS=['planet','ring','rocket','ufo','hole','comet','moon','sun'];
GAMES.push({id:'memory',name:'זיכרון חללי',en:'Space Memory',tag:'חשיבה',
desc:'מצאו את כל הזוגות: כוכבי לכת, רקטות, חורים שחורים ועוד. כמה שפחות מהלכים, יותר נקודות.',
how:['לחצו על קלף כדי להפוך אותו, ואז על קלף נוסף.','אם שני הקלפים זהים, הם נשארים פתוחים.','הניקוד יורד עם כל מהלך ועם כל שנייה שעוברת.'],
keys:'לחיצה בעכבר או נגיעה',
init(){this.cards=shuffle([...ICONS,...ICONS]).map((k,i)=>({k,c:i%4,r:i/4|0,up:false,ok:false,f:0}));this.sel=[];this.moves=0;this.time=0;this.wait=0},
pos(c){return{x:160+c.c*122,y:22+c.r*116}},
update(dt){this.time+=dt;for(const c of this.cards)c.f+=((c.up||c.ok?1:0)-c.f)*Math.min(1,dt*10);
  if(this.wait>0){this.wait-=dt;if(this.wait<=0){for(const c of this.sel)c.up=false;this.sel=[]}return}
  if(E.tap){const c=this.cards.find(c=>{const p=this.pos(c);return E.ptr.x>p.x&&E.ptr.x<p.x+112&&E.ptr.y>p.y&&E.ptr.y<p.y+106});if(c&&!c.up&&!c.ok){c.up=true;this.sel.push(c);Snd.tone(600,.08,'triangle',.1);
    if(this.sel.length===2){this.moves++;if(this.sel[0].k===this.sel[1].k){this.sel.forEach(c=>c.ok=true);this.sel=[];Snd.chime();if(this.cards.every(c=>c.ok)){E.score=Math.max(50,Math.round(1000-this.moves*20-this.time*4));return E.over(true,'מצאתם את כל הזוגות',`${this.moves} מהלכים.`)}}else this.wait=.8}}}},
draw(){bg();for(const c of this.cards){const p=this.pos(c),sx=Math.abs(1-2*c.f),cx=p.x+56,cy=p.y+53;ctx.save();ctx.translate(cx,cy);ctx.scale(Math.max(.02,sx),1);
  if(c.f<.5){ctx.fillStyle='#1b2150';ctx.fillRect(-56,-53,112,106);ctx.strokeStyle='#3b4478';ctx.lineWidth=2;ctx.strokeRect(-56,-53,112,106);ctx.fillStyle='rgba(255,154,60,.6)';ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.fill()}
  else{ctx.fillStyle=c.ok?'#132a2a':'#0d1130';ctx.fillRect(-56,-53,112,106);ctx.strokeStyle=c.ok?'#56e39f':'#5fd4ff';ctx.lineWidth=2;ctx.strokeRect(-56,-53,112,106);ctx.restore();ctx.save();if(sx>.3)icon(c.k,cx,cy,1)}ctx.restore()}},
hud(){return[['מהלכים',this.moves],['זמן',Math.floor(this.time)+'s']]}});

const GOLF=[{b:[90,250],t:[710,250],o:[{x:400,y:250,r:40,m:9e5,c:'#5fd4ff'}]},
 {b:[90,400],t:[710,110],o:[{x:330,y:200,r:30,m:7e5,c:'#ff9a3c'},{x:520,y:330,r:34,m:8e5,c:'#56e39f'}]},
 {b:[90,250],t:[700,250],o:[{x:400,y:250,r:22,m:2.4e6,h:1}]},
 {b:[400,450],t:[400,60],o:[{x:400,y:250,r:46,m:1.2e6,c:'#c58bff'},{x:180,y:150,r:18,m:5e5,h:1}]},
 {b:[80,80],t:[720,420],o:[{x:300,y:330,r:28,m:8e5,c:'#e8c07a'},{x:480,y:160,r:20,m:1.4e6,h:1},{x:610,y:320,r:30,m:6e5,c:'#ff7aa8'}]}];
GAMES.push({id:'gravity-golf',name:'גולף כבידה',en:'Gravity Golf',tag:'חשיבה',
desc:'שגרו כדור אל הדגל הירוק. כוכבי הלכת והחורים השחורים מכופפים את המסלול, אז צריך לחשוב על הכבידה.',
how:['גררו מהכדור אחורה, כמו בקלע, ושחררו כדי לשגר. ככל שגוררים רחוק יותר, הזריקה חזקה יותר.','במקלדת: חיצים ימינה ושמאלה מכוונים, למעלה ולמטה משנים עוצמה, ורווח משגר.','פגיעה בכוכב לכת או יציאה מהמסך מחזירות את הכדור להתחלה. יש 5 גומות.'],
keys:'גרירה ושחרור · או חיצים ורווח',pad:['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'],
init(){this.h=0;this.strokes=0;this.load()},
load(){const L=GOLF[this.h];this.L=L;this.ball={x:L.b[0],y:L.b[1],vx:0,vy:0};this.moving=false;this.aim={a:Math.atan2(L.t[1]-L.b[1],L.t[0]-L.b[0]),p:.45};this.drag=null;this.ft=0;this.trail=[];this.hs=0},
reset(){const L=this.L;Object.assign(this.ball,{x:L.b[0],y:L.b[1],vx:0,vy:0});this.moving=false},
shoot(){const v=120+this.aim.p*480;this.ball.vx=Math.cos(this.aim.a)*v;this.ball.vy=Math.sin(this.aim.a)*v;this.moving=true;this.strokes++;this.hs++;this.ft=0;this.trail=[];Snd.tone(220,.2,'triangle',.16,500)},
update(dt){const b=this.ball,L=this.L;
  if(!this.moving){const ax=E.ax();this.aim.a+=ax.x*1.4*dt;this.aim.p=clamp(this.aim.p-ax.y*.6*dt,0,1);
    if(E.ptr.down){if(!this.drag)this.drag={x:E.ptr.x,y:E.ptr.y};const dx=this.drag.x-E.ptr.x,dy=this.drag.y-E.ptr.y,l=Math.hypot(dx,dy);if(l>8){this.aim.a=Math.atan2(dy,dx);this.aim.p=clamp(l/170,0,1)}}
    else if(this.drag){const dx=this.drag.x-E.ptr.x,dy=this.drag.y-E.ptr.y;this.drag=null;if(Math.hypot(dx,dy)>8)this.shoot()}
    if(E.fire())this.shoot();return}
  this.ft+=dt;for(let k=0;k<4;k++){const h=dt/4;for(const o of L.o){const dx=o.x-b.x,dy=o.y-b.y,d2=dx*dx+dy*dy,d=Math.sqrt(d2),a=o.m/(d2+100);b.vx+=a*dx/d*h;b.vy+=a*dy/d*h;
      if(d<o.r){E.boom(b.x,b.y,16,o.h?'#ffb070':'#c7cbe0');Snd.burst(.3,.25,600);return this.reset()}}b.x+=b.vx*h;b.y+=b.vy*h;
    if(dist(b.x,b.y,L.t[0],L.t[1])<18){Snd.level();E.score+=Math.max(10,100-(this.hs-1)*20);this.h++;if(this.h>=GOLF.length)return E.over(true,'סיימתם את כל המסלול',`${this.strokes} חבטות ב-5 גומות.`);return this.load()}}
  if(this.trail.push([b.x,b.y])>120)this.trail.shift();
  if(b.x<-60||b.x>W+60||b.y<-60||b.y>H+60||this.ft>8){Snd.warn();this.reset()}},
draw(){bg();const L=this.L;for(const o of L.o)o.h?hole(o.x,o.y,o.r*.55):planet(o.x,o.y,o.r,o.c);
  const[tx,ty]=L.t;glow(tx,ty,30,'rgba(86,227,159,.4)');ctx.strokeStyle='#56e39f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx,ty,16+Math.sin(E.t*4)*2,0,TAU);ctx.stroke();ctx.fillStyle='#56e39f';ctx.fillRect(tx-1,ty-30,2,30);ctx.beginPath();ctx.moveTo(tx+1,ty-30);ctx.lineTo(tx+16,ty-24);ctx.lineTo(tx+1,ty-18);ctx.fill();
  ctx.strokeStyle='rgba(95,212,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();this.trail.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.stroke();
  const b=this.ball;glow(b.x,b.y,14,'rgba(255,255,255,.5)');ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,6,0,TAU);ctx.fill();
  if(!this.moving){const l=30+this.aim.p*100;ctx.setLineDash([6,6]);ctx.strokeStyle='#ffd27a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+Math.cos(this.aim.a)*l,b.y+Math.sin(this.aim.a)*l);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(20,470,160,10);ctx.fillStyle='#ff9a3c';ctx.fillRect(20,470,160*this.aim.p,10)}},
hud(){return[['גומה',`${Math.min(this.h+1,5)}/5`],['חבטות',this.strokes]]}});

GAMES.push({id:'laser-mirrors',name:'מראות לייזר',en:'Laser Mirrors',tag:'חשיבה',
desc:'קרן לייזר יוצאת מהתחנה משמאל. סובבו את המראות כדי להוביל אותה אל הגביש הקולט.',
how:['לחצו על מראה כדי לסובב אותה בין שני מצבים: / ו-\\.','אסטרואידים בולעים את הקרן, אז צריך לעקוף אותם.','יש 6 שלבים. ככל שמשתמשים בפחות לחיצות, מקבלים יותר נקודות.'],
keys:'לחיצה על מראה',
init(){this.lvl=0;this.next()},
next(){this.lvl++;let ok=false;for(let t=0;t<300&&!ok;t++)ok=this.gen();this.clicks=0;this.won=0;this.trace();if(this.hit){const m=this.mirrors[0];m.o=m.o==='/'?'\\':'/';this.trace()}},
gen(){const C=10,R=6,g=[...Array(R)].map(()=>Array(C).fill(null));let r=rndi(0,R-1),c=0,dx=1,dy=0;g[r][c]={t:'S'};this.src={r,c};const path=new Set([r+','+c]),want=Math.min(7,2+this.lvl),mir=[];let m=0;
  for(let guard=0;guard<40;guard++){let k=rndi(1,3),moved=0;while(k--){const nr=r+dy,nc=c+dx;if(nr<0||nr>=R||nc<0||nc>=C||path.has(nr+','+nc))break;r=nr;c=nc;path.add(r+','+c);moved++}
    if(!moved)return false;if(m>=want){g[r][c]={t:'T'};break}
    const[ndx,ndy]=pick(dx?[[0,1],[0,-1]]:[[1,0],[-1,0]]);const cell={t:'M',sol:(ndx===-dy&&ndy===-dx)?'/':'\\'};g[r][c]=cell;mir.push(cell);m++;dx=ndx;dy=ndy}
  if(m<want||!g.flat().some(x=>x&&x.t==='T'))return false;
  for(const cell of mir)cell.o=Math.random()<.5?'/':'\\';if(mir.every(x=>x.o===x.sol))mir[0].o=mir[0].sol==='/'?'\\':'/';
  const empty=[];for(let y=0;y<R;y++)for(let x=1;x<C;x++)if(!g[y][x]&&!path.has(y+','+x))empty.push([y,x]);shuffle(empty);
  for(let i=0;i<Math.min(empty.length,this.lvl+2);i++){const[y,x]=empty.pop();g[y][x]={t:'R',pts:rockPts()}}
  for(let i=0;i<2&&empty.length;i++){const[y,x]=empty.pop();const cell={t:'M',o:Math.random()<.5?'/':'\\'};g[y][x]=cell;mir.push(cell)}
  this.g=g;this.mirrors=mir;return true},
trace(){let r=this.src.r,c=this.src.c,dx=1,dy=0;const pts=[[c*80+40,r*80+20+40]];this.hit=false;
  for(let i=0;i<120;i++){r+=dy;c+=dx;if(r<0||r>=6||c<0||c>=10){pts.push([c*80+40-dx*40,r*80+60-dy*40]);break}const x=c*80+40,y=r*80+60,cell=this.g[r][c];
    if(!cell)continue;if(cell.t==='M'){pts.push([x,y]);if(cell.o==='/'){[dx,dy]=[-dy,-dx]}else{[dx,dy]=[dy,dx]}}else if(cell.t==='R'){pts.push([x,y]);break}else if(cell.t==='T'){pts.push([x,y]);this.hit=true;break}}
  this.beam=pts},
update(dt){if(this.won>0){this.won-=dt;if(this.won<=0){if(this.lvl>=6)return E.over(true,'כל הקרניים הגיעו ליעד','');this.next()}return}
  if(E.tap){const c=Math.floor(E.ptr.x/80),r=Math.floor((E.ptr.y-20)/80);const cell=this.g[r]&&this.g[r][c];if(cell&&cell.t==='M'){cell.o=cell.o==='/'?'\\':'/';this.clicks++;Snd.tone(520,.06,'triangle',.1);this.trace();if(this.hit){E.score+=Math.max(20,100-this.clicks*5);Snd.level();this.won=1.4}}}},
draw(){bg(0,0,false);ctx.strokeStyle='rgba(95,212,255,.07)';ctx.lineWidth=1;for(let x=0;x<=10;x++){ctx.beginPath();ctx.moveTo(x*80,20);ctx.lineTo(x*80,500);ctx.stroke()}for(let y=0;y<=6;y++){ctx.beginPath();ctx.moveTo(0,20+y*80);ctx.lineTo(W,20+y*80);ctx.stroke()}
  for(let r=0;r<6;r++)for(let c=0;c<10;c++){const cell=this.g[r][c];if(!cell)continue;const x=c*80+40,y=r*80+60;
    if(cell.t==='S'){ctx.fillStyle='#6a7096';ctx.fillRect(x-26,y-18,40,36);ctx.fillStyle='#ff5468';ctx.fillRect(x+14,y-6,12,12)}
    else if(cell.t==='T'){glow(x,y,34,this.hit?'rgba(86,227,159,.8)':'rgba(197,139,255,.5)');gem(x,y,1.6)}
    else if(cell.t==='R')rock({x,y,r:26,rot:c+r,pts:cell.pts});
    else{ctx.fillStyle='rgba(255,255,255,.05)';ctx.beginPath();ctx.arc(x,y,30,0,TAU);ctx.fill();ctx.save();ctx.translate(x,y);ctx.rotate(cell.o==='/'?-Math.PI/4:Math.PI/4);ctx.fillStyle='#cfe8ff';ctx.fillRect(-30,-3,60,6);ctx.fillStyle='#5fd4ff';ctx.fillRect(-30,-3,60,2);ctx.restore()}}
  ctx.save();ctx.strokeStyle='rgba(255,84,104,.35)';ctx.lineWidth=9;ctx.lineJoin='round';ctx.beginPath();this.beam.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.stroke();ctx.strokeStyle='#ffd0d6';ctx.lineWidth=2.5;ctx.stroke();ctx.restore()},
hud(){return[['שלב',`${this.lvl}/6`],['לחיצות',this.clicks]]}});

GAMES.push({id:'gravity-pong',name:'פונג כבידה',en:'Gravity Pong',tag:'אקשן',
desc:'פינג-פונג חללי נגד המחשב, עם חור שחור באמצע השולחן שמכופף את מסלול הכדור.',
how:['הזיזו את המחבט השמאלי עם החיצים למעלה ולמטה או עם העכבר.','החור השחור מושך את הכדור. אם הכדור נבלע, הוא חוזר למשחק בלי נקודה.','הראשון שמגיע ל-7 נקודות מנצח.'],
keys:'↑ ↓ או עכבר',pad:['ArrowUp','ArrowDown'],
init(){this.py=250;this.ay=250;this.ps=0;this.as=0;this.serve(1)},
serve(d){this.b={x:d>0?160:640,y:rnd(90,410),vx:d*250,vy:rnd(-120,120)};this.pause=.6},
update(dt){const ay=E.ax().y;if(ay)this.py+=ay*420*dt;else if(E.ptr.active)this.py+=(E.ptr.y-this.py)*Math.min(1,dt*12);this.py=clamp(this.py,50,450);
  const b=this.b,aiT=b.vx>0?b.y:250;this.ay+=clamp(aiT-this.ay,-1,1)*Math.min(Math.abs(aiT-this.ay),(230+this.ps*15)*dt);this.ay=clamp(this.ay,50,450);
  if(this.pause>0){this.pause-=dt;return}
  for(let k=0;k<3;k++){const h=dt/3,dx=400-b.x,dy=250-b.y,d2=dx*dx+dy*dy,d=Math.sqrt(d2),a=1.6e6/(d2+900);b.vx+=a*dx/d*h;b.vy+=a*dy/d*h;const sp=Math.hypot(b.vx,b.vy);if(sp>700){b.vx*=700/sp;b.vy*=700/sp}b.x+=b.vx*h;b.y+=b.vy*h;
    if(b.y<8){b.y=8;b.vy=Math.abs(b.vy)}if(b.y>H-8){b.y=H-8;b.vy=-Math.abs(b.vy)}
    if(b.vx<0&&b.x<46&&b.x>24&&Math.abs(b.y-this.py)<52){b.vx=Math.abs(b.vx)*1.05;b.vy+=(b.y-this.py)*4;Snd.tone(440,.06,'square',.08)}
    if(b.vx>0&&b.x>754&&b.x<776&&Math.abs(b.y-this.ay)<52){b.vx=-Math.abs(b.vx)*1.05;b.vy+=(b.y-this.ay)*4;Snd.tone(330,.06,'square',.08)}
    if(d<16){Snd.tone(200,.5,'sine',.2,60);E.boom(400,250,20,'#ffb070');return this.serve(Math.random()<.5?1:-1)}}
  if(b.x<-10){this.as++;Snd.warn();if(this.as>=7)return E.over(false,'המחשב ניצח',`${this.ps} : ${this.as}`);this.serve(-1)}
  if(b.x>W+10){this.ps++;E.score+=100;Snd.chime();if(this.ps>=7)return E.over(true,'ניצחתם!',`${this.ps} : ${this.as}`);this.serve(1)}},
draw(){bg();ctx.setLineDash([8,12]);ctx.strokeStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(400,0);ctx.lineTo(400,H);ctx.stroke();ctx.setLineDash([]);hole(400,250,15);
  txt(String(this.ps),300,50,60,'rgba(95,212,255,.6)','center',700,DISP);txt(String(this.as),500,50,60,'rgba(255,154,60,.6)','center',700,DISP);
  ctx.fillStyle='#5fd4ff';ctx.fillRect(28,this.py-48,12,96);ctx.fillStyle='#ff9a3c';ctx.fillRect(760,this.ay-48,12,96);const b=this.b;glow(b.x,b.y,16,'rgba(255,255,255,.5)');ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(b.x,b.y,7,0,TAU);ctx.fill()},
hud(){return[['אתם',this.ps],['מחשב',this.as]]}});

GAMES.push({id:'breakout',name:'שוברי אסטרואידים',en:'Asteroid Breakout',tag:'אקשן',
desc:'החזירו כדור אנרגיה בעזרת התחנה ופוצצו את כל האסטרואידים שמעליה.',
how:['הזיזו את התחנה עם העכבר או עם החיצים.','רווח או לחיצה משגרים את הכדור.','אסטרואידים כהים צריכים כמה פגיעות. יש 3 חיים.'],
keys:'← → או עכבר · רווח שיגור',pad:['ArrowLeft','ArrowRight','Space'],
COLS:['#8b90aa','#6b7aa6','#7d6a9e','#9a6a7e'],
init(){this.lvl=0;this.lives=3;this.px=400;this.next()},
next(){this.lvl++;this.br=[];for(let r=0;r<5;r++)for(let c=0;c<10;c++)this.br.push({x:76+c*72,y:60+r*36,hp:1+Math.floor(Math.random()*Math.min(3,this.lvl+(4-r)/3)),pts:rockPts(),rot:rnd(0,TAU)});this.reset()},
reset(){this.b={x:this.px,y:430,vx:0,vy:0};this.stuck=true},
update(dt){const ax=E.ax().x;if(ax)this.px+=ax*480*dt;else if(E.ptr.active)this.px+=(E.ptr.x-this.px)*Math.min(1,dt*14);this.px=clamp(this.px,55,W-55);const b=this.b;
  if(this.stuck){b.x=this.px;b.y=432;if(E.fire()||E.tap){this.stuck=false;b.vx=rnd(-160,160);b.vy=-340-this.lvl*20}return}
  for(let k=0;k<3;k++){const h=dt/3;b.x+=b.vx*h;b.y+=b.vy*h;if(b.x<7){b.x=7;b.vx=Math.abs(b.vx)}if(b.x>W-7){b.x=W-7;b.vx=-Math.abs(b.vx)}if(b.y<7){b.y=7;b.vy=Math.abs(b.vy)}
    if(b.vy>0&&b.y+7>=444&&b.y<458&&Math.abs(b.x-this.px)<60){b.vy=-Math.abs(b.vy);b.vx=(b.x-this.px)*6;Snd.tone(440,.05,'triangle',.08)}
    for(const r of this.br){if(r.hp<=0)continue;const ox=Math.abs(b.x-r.x)-32,oy=Math.abs(b.y-r.y)-14;if(ox<7&&oy<7){if(ox>oy)b.vx*=-1;else b.vy*=-1;r.hp--;if(r.hp<=0){E.score+=10*this.lvl;E.boom(r.x,r.y,12,'#c7cbe0');Snd.burst(.2,.2,1000)}else Snd.tone(300,.05,'square',.06);break}}}
  this.br=this.br.filter(r=>r.hp>0);
  if(b.y>H+10){this.lives--;Snd.warn();if(this.lives<=0)return E.over(false,'הכדור אבד',`הגעתם לשלב ${this.lvl}.`);this.reset()}
  if(!this.br.length){E.score+=200;Snd.level();this.next()}},
draw(){bg();for(const r of this.br)rock({x:r.x,y:r.y,r:18,rot:r.rot,pts:r.pts},this.COLS[Math.min(3,r.hp-1)]);
  const g=ctx.createLinearGradient(0,444,0,458);g.addColorStop(0,'#e8eaf6');g.addColorStop(1,'#6a7096');ctx.fillStyle=g;ctx.fillRect(this.px-55,444,110,12);ctx.fillStyle='#5fd4ff';for(let i=-2;i<=2;i++)ctx.fillRect(this.px+i*18-3,448,6,3);
  glow(this.b.x,this.b.y,16,'rgba(255,210,122,.6)');ctx.fillStyle='#fff3d6';ctx.beginPath();ctx.arc(this.b.x,this.b.y,6,0,TAU);ctx.fill()},
hud(){return[['שלב',this.lvl],['חיים','♥'.repeat(Math.max(0,this.lives))]]}});

GAMES.push({id:'space-worm',name:'תולעת החלל',en:'Space Worm',tag:'מיומנות',
desc:'תולעת חלל אוכלת אבק כוכבים וגדלה. אל תתנגשו בקירות, בגוף שלכם או בחורים השחורים.',
how:['החיצים משנים כיוון. במסך מגע לוחצים בצד שאליו רוצים לפנות.','כל גרגר אבק כוכבים מאריך את התולעת ומאיץ אותה.','אחרי כל 5 גרגרים מופיע חור שחור חדש.'],
keys:'חיצים או לחיצה',pad:['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'],
init(){this.s=[{x:10,y:12},{x:9,y:12},{x:8,y:12}];this.d={x:1,y:0};this.nd={x:1,y:0};this.acc=0;this.speed=7;this.holes=[];this.eaten=0;for(let i=0;i<3;i++)this.holes.push(this.free(5));this.food=this.free(0)},
free(m){for(let t=0;t<500;t++){const p={x:rndi(1,38),y:rndi(1,23)};if(this.s.some(q=>q.x===p.x&&q.y===p.y))continue;if(this.holes.some(h=>Math.abs(h.x-p.x)<2&&Math.abs(h.y-p.y)<2))continue;if(m&&Math.abs(p.x-this.s[0].x)<m&&Math.abs(p.y-this.s[0].y)<m)continue;return p}return{x:1,y:1}},
turn(x,y){if(x===-this.d.x&&y===-this.d.y)return;this.nd={x,y}},
update(dt){if(E.hit('ArrowUp')||E.hit('KeyW'))this.turn(0,-1);if(E.hit('ArrowDown')||E.hit('KeyS'))this.turn(0,1);if(E.hit('ArrowLeft')||E.hit('KeyA'))this.turn(-1,0);if(E.hit('ArrowRight')||E.hit('KeyD'))this.turn(1,0);
  if(E.tap){const h=this.s[0],dx=E.ptr.x-(h.x*20+10),dy=E.ptr.y-(h.y*20+10);if(this.d.x)this.turn(0,dy<0?-1:1);else this.turn(dx<0?-1:1,0)}
  this.acc+=dt*this.speed;while(this.acc>=1){this.acc--;this.d=this.nd;const h={x:this.s[0].x+this.d.x,y:this.s[0].y+this.d.y};
    if(h.x<0||h.x>=40||h.y<0||h.y>=25)return E.over(false,'התנגשתם בקיר',`אכלתם ${this.eaten} גרגרים.`);
    if(this.s.some(q=>q.x===h.x&&q.y===h.y))return E.over(false,'התולעת נתקעה בעצמה',`אכלתם ${this.eaten} גרגרים.`);
    if(this.holes.some(q=>q.x===h.x&&q.y===h.y)){E.boom(h.x*20+10,h.y*20+10,24,'#ffb070');return E.over(false,'נבלעתם בחור שחור',`אכלתם ${this.eaten} גרגרים.`)}
    this.s.unshift(h);if(h.x===this.food.x&&h.y===this.food.y){this.eaten++;E.score+=10;this.speed=Math.min(16,this.speed+.35);Snd.chime();if(this.eaten%5===0)this.holes.push(this.free(5));this.food=this.free(0)}else this.s.pop()}},
draw(){bg(0,0,false);ctx.strokeStyle='rgba(95,212,255,.05)';for(let x=0;x<=40;x++){ctx.beginPath();ctx.moveTo(x*20,0);ctx.lineTo(x*20,H);ctx.stroke()}for(let y=0;y<=25;y++){ctx.beginPath();ctx.moveTo(0,y*20);ctx.lineTo(W,y*20);ctx.stroke()}
  for(const h of this.holes)hole(h.x*20+10,h.y*20+10,7);const f=this.food;glow(f.x*20+10,f.y*20+10,16,'rgba(255,230,150,.7)');ctx.fillStyle='#fff6d8';ctx.beginPath();ctx.arc(f.x*20+10,f.y*20+10,4,0,TAU);ctx.fill();
  const n=this.s.length;this.s.forEach((q,i)=>{const k=1-i/n;ctx.fillStyle=`hsl(${190+i*4},80%,${45+k*25}%)`;ctx.beginPath();ctx.arc(q.x*20+10,q.y*20+10,8+k*2,0,TAU);ctx.fill()});
  const h=this.s[0];ctx.fillStyle='#0a0d1d';ctx.beginPath();ctx.arc(h.x*20+10+this.d.x*3-this.d.y*4,h.y*20+10+this.d.y*3+this.d.x*4,2.2,0,TAU);ctx.arc(h.x*20+10+this.d.x*3+this.d.y*4,h.y*20+10+this.d.y*3-this.d.x*4,2.2,0,TAU);ctx.fill()},
hud(){return[['אורך',this.s.length],['חורים',this.holes.length]]}});

GAMES.push({id:'spacewalk',name:'הליכת חלל',en:'Spacewalk',tag:'דיוק',
desc:'אסטרונאוטית יצאה מהתחנה לאסוף 5 כלים שנסחפו. אספו את כולם וחזרו לפתח לפני שנגמר החמצן.',
how:['חיצים מפעילים את תרמיל הסילון. אפשר גם להחזיק לחיצה לכיוון הרצוי.','בחלל אין בלמים, אז כדי לעצור צריך לדחוף לכיוון ההפוך.','אחרי שאספתם את כל 5 הכלים, הפתח בתחנה נדלק בירוק. חזרו אליו.'],
keys:'חיצים או החזקת לחיצה',pad:['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'],
init(){this.a={x:110,y:250,vx:0,vy:0};this.o2=100;this.fuel=100;this.got=0;this.tools=Array.from({length:5},()=>({x:rnd(300,750),y:rnd(50,440),vx:rnd(-14,14),vy:rnd(-14,14),rot:rnd(0,TAU)}))},
update(dt){const a=this.a;this.o2-=dt*100/80;if(this.o2<=0)return E.over(false,'נגמר החמצן',`אספתם ${this.got} מתוך 5 כלים.`);
  let ax=E.ax();if(!ax.x&&!ax.y&&E.ptr.down){const dx=E.ptr.x-a.x,dy=E.ptr.y-a.y,d=Math.hypot(dx,dy)||1;if(d>10)ax={x:dx/d,y:dy/d}}
  const on=(ax.x||ax.y)&&this.fuel>0;this.on=on;Snd.thrust(on,.08);if(on){a.vx+=ax.x*60*dt;a.vy+=ax.y*60*dt;this.fuel=Math.max(0,this.fuel-6*dt);E.puff(a.x-ax.x*14,a.y-ax.y*14,-ax.x*80,-ax.y*80,'#e8f4ff')}
  a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<70&&Math.abs(a.y-250)>60){a.x=70;a.vx=Math.abs(a.vx)*.4}if(a.x<20){a.x=20;a.vx=Math.abs(a.vx)*.4}if(a.x>W-15){a.x=W-15;a.vx=-Math.abs(a.vx)*.4}if(a.y<15){a.y=15;a.vy=Math.abs(a.vy)*.4}if(a.y>H-15){a.y=H-15;a.vy=-Math.abs(a.vy)*.4}
  for(const t of this.tools){t.x+=t.vx*dt;t.y+=t.vy*dt;t.rot+=dt;if(t.x<260||t.x>W-20)t.vx*=-1;if(t.y<20||t.y>H-20)t.vy*=-1;if(!t.got&&dist(t.x,t.y,a.x,a.y)<24){t.got=1;this.got++;E.score+=50;Snd.chime();E.boom(t.x,t.y,10,'#ffd27a')}}
  if(this.got===5&&a.x<85&&Math.abs(a.y-250)<50){E.score+=Math.round(this.o2*5+this.fuel*2);return E.over(true,'חזרתם בשלום לתחנה','')}},
draw(){bg();const g=ctx.createRadialGradient(760,620,200,760,620,420);g.addColorStop(0,'#2f7fd1');g.addColorStop(.85,'#123a6b');g.addColorStop(1,'rgba(120,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(760,620,420,0,TAU);ctx.fill();
  const sg=ctx.createLinearGradient(0,0,60,0);sg.addColorStop(0,'#6a7096');sg.addColorStop(1,'#c7cbe0');ctx.fillStyle=sg;ctx.fillRect(0,40,60,420);ctx.fillStyle='#3d63b8';ctx.fillRect(4,0,50,36);ctx.fillRect(4,464,50,36);
  ctx.fillStyle=this.got===5?(Math.floor(E.t*3)%2?'#56e39f':'#1f5c40'):'#3a3f5c';ctx.fillRect(52,200,10,100);
  for(const t of this.tools){if(t.got)continue;ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.rot);ctx.fillStyle='#ffd27a';ctx.fillRect(-12,-3,22,6);ctx.beginPath();ctx.arc(12,0,6,0,TAU);ctx.fill();ctx.fillStyle='#03040a';ctx.fillRect(12,-2,8,4);ctx.restore()}
  astro(this.a.x,this.a.y,1.2,clamp(this.a.vx/200,-.4,.4));if(this.o2<25&&Math.floor(E.t*4)%2)txt('חמצן נמוך!',400,40,28,'#ff5468','center',700,DISP)},
hud(){return[['כלים',`${this.got}/5`],['חמצן',Math.ceil(this.o2)+'%'],['סילון',Math.round(this.fuel)+'%']]}});
