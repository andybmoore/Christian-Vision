import './film.css'

const canvas = document.querySelector('#journey-film')
const ctx = canvas.getContext('2d')
const renderButton = document.querySelector('#render-film')
const replayButton = document.querySelector('#replay-film')
const downloadButton = document.querySelector('#download-film')
const progress = document.querySelector('#film-progress')
const status = document.querySelector('#film-status')
const W = 3840, H = 2160, DURATION = 9000, SCENE = 1800
const phone = { x: 1650, y: 135, w: 960, h: 1880 }
const screen = { x: phone.x + 24, y: phone.y + 24, w: phone.w - 48, h: phone.h - 48 }
const lime = '#d0f063'
let startedAt = performance.now()
let isRecording = false
let recorder
let chunks = []
let oldUrl = ''
canvas.width = W
canvas.height = H

function shape(x, y, w, h, r, fill, border) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill()
  if (border) { ctx.strokeStyle = border; ctx.lineWidth = 2; ctx.stroke() }
}
function write(value, x, y, size, color, weight = 400, font = 'DM Sans') {
  ctx.fillStyle = color; ctx.font = `${weight} ${size}px "${font}",sans-serif`; ctx.fillText(value, x, y)
}
function rule(x1, y1, x2, y2, color, width = 2) {
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke()
}
function ui(value,x,y,size,color='#29392d',weight=500) { write(value,screen.x+x,screen.y+y,size,color,weight) }
function card(x,y,w,h,r,fill,border='#dfe5da') { shape(screen.x+x,screen.y+y,w,h,r,fill,border) }

function drawBackdrop(scene,phase,elapsed) {
  ctx.fillStyle='#101711'; ctx.fillRect(0,0,W,H)
  const glow=ctx.createRadialGradient(2440,1050,20,2440,1050,1800); glow.addColorStop(0,'#344632'); glow.addColorStop(1,'#101711'); ctx.fillStyle=glow; ctx.fillRect(0,0,W,H)
  write('FJ-N2N',205,150,29,'#f2f2e9',700); write('FAITH JOURNEY / NETTONEIGHBOR',205,190,15,'#bdc9b8',500,'DM Mono'); write('CHRISTIAN VISION',3280,170,16,'#c5d0bf',500,'DM Mono'); rule(185,232,3655,232,'#3a4938')
  const titles=[['A first step,','on their terms.'],['A hub shaped','around them.'],['One tap can','open a door.'],['Interests grow','into community.'],['Local interest,','human welcome.']]
  const captions=['Choose language, interests, and approximate area.','Articles, audio, podcasts, and video in one place.','Share a resource with someone you trust.','Join a group before the first visit.','Choose a nearby church. Meet a real person.']
  write(`0${scene+1} / ${['DISCOVER','PERSONALIZE','SHARE','COMMUNITY','LOCAL WELCOME'][scene]}`,225,430,17,lime,500,'DM Mono')
  const fade=Math.min(1,phase*3);ctx.save();ctx.globalAlpha=fade;write(titles[scene][0],225,730-(1-fade)*24,82,'#f2f2e9',500,'DM Serif Display');write(titles[scene][1],225,830-(1-fade)*24,82,lime,500,'DM Serif Display');write(captions[scene],232,915,22,'#b7c1b1');ctx.restore()
  shape(185,2078,3470,7,4,'#394638');shape(185,2078,Math.max(22,3470*elapsed/DURATION),7,4,lime);write('PERSONALIZE -> DISCOVER -> SHARE -> BELONG -> CONNECT',185,2120,14,'#aebbaa',400,'DM Mono')
}

function drawPhone(phase) {
  const metal=ctx.createLinearGradient(phone.x,0,phone.x+phone.w,0);metal.addColorStop(0,'#5b6665');metal.addColorStop(.2,'#e0e3dc');metal.addColorStop(.5,'#727d7b');metal.addColorStop(.82,'#d7dbd3');metal.addColorStop(1,'#515d5c')
  ctx.save();ctx.translate(2130,1080);const zoom=1+Math.sin(phase*Math.PI)*.006;ctx.scale(zoom,zoom);ctx.translate(-2130,-1080);ctx.shadowColor='#000b';ctx.shadowBlur=82;ctx.shadowOffsetX=34;ctx.shadowOffsetY=40;shape(phone.x,phone.y,phone.w,phone.h,118,metal,'#adb5ad');ctx.restore()
  shape(phone.x+12,phone.y+12,phone.w-24,phone.h-24,106,'#050706');shape(screen.x,screen.y,screen.w,screen.h,88,'#f3f2e9')
  shape(phone.x-12,phone.y+350,10,145,5,'#919a97');shape(phone.x-12,phone.y+540,10,155,5,'#919a97');shape(phone.x+phone.w+2,phone.y+500,10,192,5,'#919a97');shape(phone.x+phone.w/2-116,phone.y+30,232,52,27,'#040605')
}

function phoneHeader(scene) {
  write('9:41',screen.x+54,screen.y+70,24,'#1f2c20',700);write('FJ-N2N',screen.x+55,screen.y+145,30,'#344934',700);write('YOUR JOURNEY',screen.x+55,screen.y+177,13,'#7c8878',500,'DM Mono')
  shape(screen.x+screen.w-94,screen.y+112,40,40,20,'#e3eadd');write('A',screen.x+screen.w-80,screen.y+140,18,'#556c48',700);shape(screen.x+55,screen.y+204,screen.w-110,4,2,'#dce4d7');if(scene>0)shape(screen.x+55,screen.y+204,(screen.w-110)*scene/4,4,2,'#77915f')
}
function field(y,title,value){card(55,y,810,92,16,'#fff');ui(title,77,y+31,13,'#819079',500);ui(value,77,y+68,22,'#344634',600)}
function featured(y,title,subtitle,color){const x=screen.x+55,t=screen.y+y,g=ctx.createLinearGradient(x,t,x+810,t+390);g.addColorStop(0,color);g.addColorStop(1,'#344d3a');shape(x,t,810,390,22,g);write(title,x+30,t+298,14,'#e4edda',500,'DM Mono');write(subtitle,x+30,t+347,27,'#fff',600,'DM Serif Display')}
function mediaRow(y,type,title,detail,color){card(55,y,810,155,18,'#fff');card(73,y+20,74,74,18,color);ui(type[0],99,y+70,28,'#fff',700);ui(type,170,y+55,13,'#788471',500);ui(title,170,y+91,18,'#364738',600);ui(detail,170,y+124,14,'#798473')}
function message(x,y,value,color){card(x,y,760-x,82,18,color);ui(value,x+20,y+50,16,'#405040')}
function streetMap(y,phase){const x=screen.x+55,t=screen.y+y,w=810,h=390;card(55,y,w,h,22,'#e2e9d9');ctx.save();ctx.beginPath();ctx.roundRect(x,t,w,h,22);ctx.clip();ctx.strokeStyle='#fafaf2';ctx.lineWidth=12;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-70+i*170,t);ctx.lineTo(x+80+i*155,t+h);ctx.stroke()}ctx.strokeStyle='#c6d6be';ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(x+10,t+h*.74);ctx.bezierCurveTo(x+230,t+70,x+360,t+h-20,x+w-20,t+95);ctx.stroke();[[x+220,t+145],[x+w-180,t+105],[x+w-165,t+h-90]].forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],24,0,Math.PI*2);ctx.fillStyle=i===1&&phase>.5?lime:'#fff';ctx.fill();ctx.strokeStyle='#607e47';ctx.lineWidth=3;ctx.stroke()});ctx.restore()}

function sceneScreen(scene,phase){ctx.save();ctx.beginPath();ctx.roundRect(screen.x,screen.y,screen.w,screen.h,88);ctx.clip();ctx.fillStyle='#f3f2e9';ctx.fillRect(screen.x,screen.y,screen.w,screen.h);phoneHeader(scene)
  if(scene===0){ui('Make this space',55,300,48,'#263629',600);ui('yours.',55,357,48,'#66834d',600);ui('Change these choices any time.',55,414,19,'#738070');field(475,'LANGUAGE','English');field(585,'APPROXIMATE AREA','Leicester area');ui('WHAT INTERESTS YOU?',55,770,16,'#74816d',600);['Family','Bible study','Daily encouragement','Faith foundations','Devotions','Budgeting'].forEach((v,i)=>{const x=55+(i%2)*385,y=810+Math.floor(i/2)*96-phase*18;card(x,y,350,68,34,i<3?'#e4efda':'#fff',i<3?'#8da47a':'#dfe5da');ui(v,x+24,y+43,16,'#435441')})}
  if(scene===1){ui('A thoughtful place',55,300,42,'#263629',600);ui('to begin today.',55,350,42,'#66834d',600);featured(410-phase*20,'FAITH IN FAMILY LIFE','Small steps. Lasting hope.','#71895d');mediaRow(900-phase*12,'SERMON AUDIO','Finding a steady rhythm','12 min / Listen','#a98662');mediaRow(1084-phase*12,'PODCAST','Questions worth asking','Episode 04 / Play','#6e9290');mediaRow(1268-phase*12,'VIDEO','A story of hope','4 min / Watch','#88765f')}
  if(scene===2){ui('A story worth',55,300,43,'#263629',600);ui('passing along.',55,350,43,'#66834d',600);featured(415,'TESTIMONY / 4 MIN','A new beginning','#8b785d');ui('SEND THIS RESOURCE',55,905,15,'#788675',600);['WhatsApp','Messages','Social story'].forEach((v,i)=>{const y=940+i*112,on=i===0&&phase>.36;card(55,y,810,84,18,on?'#e4efda':'#fff',on?'#78945e':'#dce2d7');ui(['W','M','S'][i],78,y+53,20,'#607454',700);ui(v,145,y+53,22,'#344435',600);if(on)ui('✓',screen.w-138,y+53,24,'#52764a',700)})}
  if(scene===3){ui('Family & faith',55,300,45,'#263629',600);ui('A small group nearby',55,351,22,'#70806a');card(55,400,810,250,22,'#e4ebdc');ui('G',109,480,30,'#607d50',700);ui('WEEKLY DISCUSSION',175,459,14,'#718267',500);ui('Faith in everyday life',175,499,22,'#324231',600);message(72,710,'What has helped you this week?','#fff');message(155,840-phase*20,'A quiet moment and a good question.','#e4efdb');message(72,980-phase*20,'That is a lovely place to start.','#fff');card(55,1210,810,92,46,'#5e7f48');ui('Explore this group',268,1268,23,'#fff',600)}
  if(scene===4){ui('A local welcome',55,300,42,'#263629',600);ui('when you are ready.',55,350,22,'#71816c');streetMap(400,phase);ui('NEARBY PARTNER',55,845,14,'#75816f',500);card(55,870,810,132,18,'#fff');ui('Family & faith community',85,922,19,'#344634',600);ui('2.4 km / English / Weekly group',85,960,14,'#748070');card(55,1030,810,290,18,'#e6f0e1');ui('WHATSAPP DRAFT / OPT-IN',85,1075,13,'#617952',600);ui('Hi there,',85,1134,18,'#344634');ui('thanks for reaching out.',85,1170,18,'#344634');ui(phase>.45?'Would directions or group details help?':'Would directions or group details...',85,1206,16,'#344634');ui('Partner review before sending.',85,1275,13,'#617952')}
  const navY=screen.y+screen.h-108;ctx.fillStyle='#fff';ctx.fillRect(screen.x,navY-18,screen.w,126);line(screen.x+40,navY-18,screen.x+screen.w-40,navY-18,'#e2e7dd');['HOME','EXPLORE','GROUPS','PROFILE'].forEach((v,i)=>{const x=screen.x+82+i*194;ctx.beginPath();ctx.arc(x+20,navY+23,11,0,Math.PI*2);ctx.fillStyle=i===0?'#65834f':'#adb9a8';ctx.fill();text(v,x-9,navY+61,10,i===0?'#577447':'#929c8d',500,'DM Mono')});ctx.restore()}

function handAndTap(scene,phase){const x=[2470,2475,2440,2440,2460][scene]+(scene===1?Math.sin(phase*Math.PI*2)*14:0),y=scene===1?1350-phase*430:[1010,930,1160,1260,1160][scene],skin=ctx.createLinearGradient(2390,y-45,2820,y+280);skin.addColorStop(0,'#e5b492');skin.addColorStop(.55,'#c28766');skin.addColorStop(1,'#a66e57');ctx.save();ctx.shadowColor='#2c1a1366';ctx.shadowBlur=22;ctx.shadowOffsetY=10;ctx.fillStyle=skin;ctx.beginPath();ctx.moveTo(3060,y+280);ctx.bezierCurveTo(2910,y+220,2790,y+145,2680,y+65);ctx.bezierCurveTo(2595,y+5,2525,y-43,x+25,y-45);ctx.bezierCurveTo(x-45,y-50,x-82,y-5,x-68,y+52);ctx.bezierCurveTo(x-48,y+130,2510,y+238,2620,y+315);ctx.bezierCurveTo(2750,y+410,2930,y+430,3060,y+360);ctx.closePath();ctx.fill();ctx.restore();const q=(phase*3)%1;ctx.beginPath();ctx.arc(x,y,18+q*30,0,Math.PI*2);ctx.strokeStyle=`rgba(208,240,99,${.82*(1-q)})`;ctx.lineWidth=5;ctx.stroke()}

function frame(now){const elapsed=Math.min(DURATION-1,Math.max(0,now-started)),scene=Math.min(4,Math.floor(elapsed/STEP)),phase=(elapsed-scene*STEP)/STEP;drawBackdrop(scene,phase,elapsed);drawHandBehind();drawPhone(phase);sceneScreen(scene,phase);handAndTap(scene,phase)}
let recording=false,media,parts=[],previousUrl=''
function animate(now){frame(now);requestAnimationFrame(animate)}requestAnimationFrame(animate)
replayButton.addEventListener('click',()=>{if(!recording){started=performance.now();status.textContent='Preview replaying · 9 seconds'}})
renderButton.addEventListener('click',async()=>{if(recording)return;const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x=>MediaRecorder.isTypeSupported(x));if(!mime||!canvas.captureStream){status.textContent='This browser cannot render WebM. Try current Chrome or Edge.';return}await document.fonts.ready;try{const stream=canvas.captureStream(30);media=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:24000000});parts=[];media.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};media.onstop=()=>{const blob=new Blob(parts,{type:mime}),url=URL.createObjectURL(blob);if(previousUrl)URL.revokeObjectURL(previousUrl);previousUrl=url;downloadButton.href=url;downloadButton.hidden=false;stream.getTracks().forEach(t=>t.stop());recording=false;renderButton.disabled=false;renderButton.textContent='Render 4K WebM';progress.style.width='0%';status.textContent=`4K video ready · ${(blob.size/1000000).toFixed(1)} MB · click Download video to save`};recording=true;renderButton.disabled=true;renderButton.textContent='Rendering 4K...';started=performance.now();status.textContent='Recording the 9-second journey at 30 fps...';media.start(250);const t=performance.now(),tick=()=>{if(!recording)return;const n=Math.min(100,(performance.now()-t)/DURATION*100);progress.style.width=`${n}%`;if(n>=100)media?.stop();else requestAnimationFrame(tick)};requestAnimationFrame(tick)}catch(e){recording=false;renderButton.disabled=false;renderButton.textContent='Render 4K WebM';status.textContent=`Could not start recording: ${e instanceof Error?e.message:'unknown error'}`}})