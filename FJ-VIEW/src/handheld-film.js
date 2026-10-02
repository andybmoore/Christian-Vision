import './film.css'

const canvas = document.querySelector('#journey-film')
const ctx = canvas.getContext('2d')
const renderButton = document.querySelector('#render-film')
const replayButton = document.querySelector('#replay-film')
const downloadButton = document.querySelector('#download-film')
const progress = document.querySelector('#film-progress')
const status = document.querySelector('#film-status')
const W = 3840
const H = 2160
const DURATION = 9000
const STEP = DURATION / 5
const DEVICE = { x: 1640, y: 140, w: 980, h: 1880 }
const DISPLAY = { x: 1665, y: 165, w: 930, h: 1830 }
let started = performance.now()
let recording = false
let recorder
let chunks = []
let lastBlobUrl = ''
canvas.width = W
canvas.height = H

function drawBox(x,y,w,h,r,fill,stroke) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill()
  if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=2; ctx.stroke() }
}
function drawText(s,x,y,size,color,weight=400,family='DM Sans') {
  ctx.fillStyle=color; ctx.font=`${weight} ${size}px "${family}",sans-serif`; ctx.fillText(s,x,y)
}
function drawLine(x1,y1,x2,y2,color,width=2) {
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke()
}
function phoneText(s,x,y,size,color='#29392d',weight=500) {
  drawText(s,DISPLAY.x+x,DISPLAY.y+y,size,color,weight)
}
function phoneCard(x,y,w,h,r,fill,stroke='#dfe5da') {
  drawBox(DISPLAY.x+x,DISPLAY.y+y,w,h,r,fill,stroke)
}

function drawBackdrop(scene,phase,elapsed) {
  ctx.fillStyle='#101711'; ctx.fillRect(0,0,W,H)
  const glow=ctx.createRadialGradient(2440,1050,20,2440,1050,1800)
  glow.addColorStop(0,'#344632'); glow.addColorStop(1,'#101711'); ctx.fillStyle=glow; ctx.fillRect(0,0,W,H)
  drawText('FJ-N2N',205,150,29,'#f2f2e9',700)
  drawText('FAITH JOURNEY / NETTONEIGHBOR',205,190,15,'#bdc9b8',500,'DM Mono')
  drawText('CHRISTIAN VISION',3280,170,16,'#c5d0bf',500,'DM Mono')
  drawLine(185,232,3655,232,'#3a4938')
  const titles=[['A first step,','on their terms.'],['A hub shaped','around them.'],['One tap can','open a door.'],['Interests grow','into community.'],['Local interest,','human welcome.']]
  const captions=['Choose language, interests, and approximate area.','Articles, audio, podcasts, and video in one place.','Share a resource with someone you trust.','Join a group before the first visit.','Choose a nearby church. Meet a real person.']
  drawText(`0${scene+1} / ${['DISCOVER','PERSONALIZE','SHARE','COMMUNITY','LOCAL WELCOME'][scene]}`,225,430,17,'#d0f063',500,'DM Mono')
  const reveal=Math.min(1,phase*3); ctx.save(); ctx.globalAlpha=reveal
  drawText(titles[scene][0],225,730-(1-reveal)*24,82,'#f2f2e9',500,'DM Serif Display')
  drawText(titles[scene][1],225,830-(1-reveal)*24,82,'#d0f063',500,'DM Serif Display')
  drawText(captions[scene],232,915,22,'#b7c1b1'); ctx.restore()
  drawBox(185,2078,3470,7,4,'#394638'); drawBox(185,2078,Math.max(22,3470*elapsed/DURATION),7,4,'#d0f063')
  drawText('PERSONALIZE -> DISCOVER -> SHARE -> BELONG -> CONNECT',185,2120,14,'#aebbaa',400,'DM Mono')
}

function drawHandBehind() {
  const skin=ctx.createLinearGradient(2460,590,3130,1790); skin.addColorStop(0,'#e6b694'); skin.addColorStop(.5,'#bd805f'); skin.addColorStop(1,'#8f5947')
  ctx.save(); ctx.shadowColor='#0009'; ctx.shadowBlur=54; ctx.shadowOffsetX=28; ctx.shadowOffsetY=35; ctx.fillStyle=skin
  ctx.beginPath(); ctx.moveTo(2490,875); ctx.bezierCurveTo(2460,725,2510,580,2635,555); ctx.bezierCurveTo(2760,530,2880,635,2940,780); ctx.bezierCurveTo(3060,960,3140,1120,3120,1340); ctx.bezierCurveTo(3100,1570,2960,1770,2780,1845); ctx.bezierCurveTo(2640,1895,2490,1800,2450,1650); ctx.bezierCurveTo(2410,1500,2385,1250,2390,1085); ctx.bezierCurveTo(2390,980,2425,915,2490,875); ctx.closePath(); ctx.fill(); ctx.restore()
}
function drawPhone(phase) {
  const metal=ctx.createLinearGradient(DEVICE.x,0,DEVICE.x+DEVICE.w,0); metal.addColorStop(0,'#5b6665'); metal.addColorStop(.2,'#e0e3dc'); metal.addColorStop(.5,'#727d7b'); metal.addColorStop(.82,'#d7dbd3'); metal.addColorStop(1,'#515d5c')
  ctx.save(); ctx.translate(2130,1080); const zoom=1+Math.sin(phase*Math.PI)*.006; ctx.scale(zoom,zoom); ctx.translate(-2130,-1080); ctx.shadowColor='#000b'; ctx.shadowBlur=82; ctx.shadowOffsetX=34; ctx.shadowOffsetY=40; drawBox(DEVICE.x,DEVICE.y,DEVICE.w,DEVICE.h,118,metal,'#adb5ad'); ctx.restore()
  drawBox(DEVICE.x+12,DEVICE.y+12,DEVICE.w-24,DEVICE.h-24,106,'#050706')
  drawBox(DISPLAY.x,DISPLAY.y,DISPLAY.w,DISPLAY.h,88,'#f3f2e9')
  drawBox(DEVICE.x-12,DEVICE.y+350,10,145,5,'#919a97'); drawBox(DEVICE.x-12,DEVICE.y+540,10,155,5,'#919a97'); drawBox(DEVICE.x+DEVICE.w+2,DEVICE.y+500,10,192,5,'#919a97')
  drawBox(DEVICE.x+DEVICE.w/2-116,DEVICE.y+30,232,52,27,'#040605')
}
function drawPhoneHeader(scene) {
  drawText('9:41',DISPLAY.x+54,DISPLAY.y+70,24,'#1f2c20',700)
  drawText('FJ-N2N',DISPLAY.x+55,DISPLAY.y+145,30,'#344934',700)
  drawText('YOUR JOURNEY',DISPLAY.x+55,DISPLAY.y+177,13,'#7c8878',500,'DM Mono')
  drawBox(DISPLAY.x+DISPLAY.w-94,DISPLAY.y+112,40,40,20,'#e3eadd'); drawText('A',DISPLAY.x+DISPLAY.w-80,DISPLAY.y+140,18,'#556c48',700)
  drawBox(DISPLAY.x+55,DISPLAY.y+204,DISPLAY.w-110,4,2,'#dce4d7')
  if (scene>0) drawBox(DISPLAY.x+55,DISPLAY.y+204,(DISPLAY.w-110)*scene/4,4,2,'#77915f')
}
function drawField(y,title,value) {
  phoneCard(55,y,810,92,16,'#fff'); phoneText(title,77,y+31,13,'#819079',500); phoneText(value,77,y+68,22,'#344634',600)
}
function drawFeature(y,title,subtitle,color) {
  const x=DISPLAY.x+55,top=DISPLAY.y+y,w=810,h=390,gradient=ctx.createLinearGradient(x,top,x+w,top+h)
  gradient.addColorStop(0,color); gradient.addColorStop(1,'#344d3a'); drawBox(x,top,w,h,22,gradient)
  drawText(title,x+30,top+h-92,14,'#e4edda',500,'DM Mono'); drawText(subtitle,x+30,top+h-43,27,'#fff',600,'DM Serif Display')
}
function drawMediaRow(y,type,title,detail,color) {
  phoneCard(55,y,810,155,18,'#fff'); phoneCard(73,y+20,74,74,18,color); phoneText(type[0],99,y+70,28,'#fff',700)
  phoneText(type,170,y+55,13,'#788471',500); phoneText(title,170,y+91,18,'#364738',600); phoneText(detail,170,y+124,14,'#798473')
}
function drawMessage(x,y,value,fill) { phoneCard(x,y,760-x,82,18,fill); phoneText(value,x+20,y+50,16,'#405040') }
function drawMap(y,phase) {
  const x=DISPLAY.x+55,top=DISPLAY.y+y,w=810,h=390; phoneCard(55,y,w,h,22,'#e2e9d9')
  ctx.save(); ctx.beginPath(); ctx.roundRect(x,top,w,h,22); ctx.clip(); ctx.strokeStyle='#fafaf2'; ctx.lineWidth=12
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-70+i*170,top);ctx.lineTo(x+80+i*155,top+h);ctx.stroke()}
  ctx.strokeStyle='#c6d6be';ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(x+10,top+h*.74);ctx.bezierCurveTo(x+230,top+70,x+360,top+h-20,x+w-20,top+95);ctx.stroke()
  [[x+220,top+145],[x+w-180,top+105],[x+w-165,top+h-90]].forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],24,0,Math.PI*2);ctx.fillStyle=i===1&&phase>.5?'#d0f063':'#fff';ctx.fill();ctx.strokeStyle='#607e47';ctx.lineWidth=3;ctx.stroke()});ctx.restore()
}
function drawTabs() {
  const y=DISPLAY.y+DISPLAY.h-108;ctx.fillStyle='#fff';ctx.fillRect(DISPLAY.x,y-18,DISPLAY.w,126);drawLine(DISPLAY.x+40,y-18,DISPLAY.x+DISPLAY.w-40,y-18,'#e2e7dd')
  ;['HOME','EXPLORE','GROUPS','PROFILE'].forEach((name,i)=>{const x=DISPLAY.x+82+i*194;ctx.beginPath();ctx.arc(x+20,y+23,11,0,Math.PI*2);ctx.fillStyle=i===0?'#65834f':'#adb9a8';ctx.fill();drawText(name,x-9,y+61,10,i===0?'#577447':'#929c8d',500,'DM Mono')})
}
function drawScreen(scene,phase) {
  ctx.save();ctx.beginPath();ctx.roundRect(DISPLAY.x,DISPLAY.y,DISPLAY.w,DISPLAY.h,88);ctx.clip();ctx.fillStyle='#f3f2e9';ctx.fillRect(DISPLAY.x,DISPLAY.y,DISPLAY.w,DISPLAY.h);drawPhoneHeader(scene)
  if(scene===0){phoneText('Make this space',55,300,48,'#263629',600);phoneText('yours.',55,357,48,'#66834d',600);phoneText('Change these choices any time.',55,414,19,'#738070');drawField(475,'LANGUAGE','English');drawField(585,'APPROXIMATE AREA','Leicester area');phoneText('WHAT INTERESTS YOU?',55,770,16,'#74816d',600);['Family','Bible study','Daily encouragement','Faith foundations','Devotions','Budgeting'].forEach((v,i)=>{const x=55+(i%2)*385,y=810+Math.floor(i/2)*96-phase*18;phoneCard(x,y,350,68,34,i<3?'#e4efda':'#fff');phoneText(v,x+24,y+43,16,'#435441')})}
  if(scene===1){phoneText('A thoughtful place',55,300,42,'#263629',600);phoneText('to begin today.',55,350,42,'#66834d',600);drawFeature(410-phase*20,'FAITH IN FAMILY LIFE','Small steps. Lasting hope.','#71895d');drawMediaRow(900-phase*12,'SERMON AUDIO','Finding a steady rhythm','12 min / Listen','#a98662');drawMediaRow(1084-phase*12,'PODCAST','Questions worth asking','Episode 04 / Play','#6e9290');drawMediaRow(1268-phase*12,'VIDEO','A story of hope','4 min / Watch','#88765f')}
  if(scene===2){phoneText('A story worth',55,300,43,'#263629',600);phoneText('passing along.',55,350,43,'#66834d',600);drawFeature(415,'TESTIMONY / 4 MIN','A new beginning','#8b785d');phoneText('SEND THIS RESOURCE',55,905,15,'#788675',600);['WhatsApp','Messages','Social story'].forEach((v,i)=>{const y=940+i*112,active=i===0&&phase>.36;phoneCard(55,y,810,84,18,active?'#e4efda':'#fff');phoneText(['W','M','S'][i],78,y+53,20,'#607454',700);phoneText(v,145,y+53,22,'#344435',600);if(active)phoneText('✓',DISPLAY.w-138,y+53,24,'#52764a',700)})}
  if(scene===3){phoneText('Family & faith',55,300,45,'#263629',600);phoneText('A small group nearby',55,351,22,'#70806a');phoneCard(55,400,810,250,22,'#e4ebdc');phoneText('G',109,480,30,'#607d50',700);phoneText('WEEKLY DISCUSSION',175,459,14,'#718267',500);phoneText('Faith in everyday life',175,499,22,'#324231',600);phoneText('6 members / English',175,535,15,'#758170');drawMessage(72,710,'What has helped you this week?','#fff');drawMessage(155,840-phase*20,'A quiet moment and a good question.','#e4efdb');drawMessage(72,980-phase*20,'That is a lovely place to start.','#fff');phoneCard(55,1210,810,92,46,'#5e7f48');phoneText('Explore this group',268,1268,23,'#fff',600)}
  if(scene===4){phoneText('A local welcome',55,300,42,'#263629',600);phoneText('when you are ready.',55,350,22,'#71816c');drawMap(400,phase);phoneText('NEARBY PARTNER',55,845,14,'#75816f',500);phoneCard(55,870,810,132,18,'#fff');phoneText('Family & faith community',85,922,19,'#344634',600);phoneText('2.4 km / English / Weekly group',85,960,14,'#748070');phoneCard(55,1030,810,290,18,'#e6f0e1');phoneText('WHATSAPP DRAFT / OPT-IN',85,1075,13,'#617952',600);phoneText('Hi there,',85,1134,18,'#344634');phoneText('thanks for reaching out.',85,1170,18,'#344634');phoneText(phase>.45?'Would directions or group details help?':'Would directions or group details...',85,1206,16,'#344634');phoneText('Partner review before sending.',85,1275,13,'#617952')}
  drawTabs();ctx.restore()
}
function drawHandAndTap(scene,phase) {
  const x=[2470,2475,2440,2440,2460][scene]+(scene===1?Math.sin(phase*Math.PI*2)*14:0),y=scene===1?1350-phase*430:[1010,930,1160,1260,1160][scene]
  const skin=ctx.createLinearGradient(2390,y-45,2820,y+280);skin.addColorStop(0,'#e5b492');skin.addColorStop(.55,'#c28766');skin.addColorStop(1,'#a66e57')
  ctx.save();ctx.shadowColor='#2c1a1366';ctx.shadowBlur=22;ctx.shadowOffsetY=10;ctx.fillStyle=skin;ctx.beginPath();ctx.moveTo(3060,y+280);ctx.bezierCurveTo(2910,y+220,2790,y+145,2680,y+65);ctx.bezierCurveTo(2595,y+5,2525,y-43,x+25,y-45);ctx.bezierCurveTo(x-45,y-50,x-82,y-5,x-68,y+52);ctx.bezierCurveTo(x-48,y+130,2510,y+238,2620,y+315);ctx.bezierCurveTo(2750,y+410,2930,y+430,3060,y+360);ctx.closePath();ctx.fill();ctx.restore()
  const pulse=(phase*3)%1;ctx.beginPath();ctx.arc(x,y,18+pulse*30,0,Math.PI*2);ctx.strokeStyle=`rgba(208,240,99,${.82*(1-pulse)})`;ctx.lineWidth=5;ctx.stroke()
}
function drawFrame(now) { const elapsed=Math.min(DURATION-1,Math.max(0,now-origin)),scene=Math.min(4,Math.floor(elapsed/STEP)),phase=(elapsed-scene*STEP)/STEP;drawBackdrop(scene,phase,elapsed);drawHandBehind();drawDevice(phase);drawScreen(scene,phase);drawHandAndTap(scene,phase) }
let recording=false,mediaRecorder,recordedChunks=[],oldUrl=''
function animate(now){drawFrame(now);requestAnimationFrame(animate)}requestAnimationFrame(animate)
replayButton.addEventListener('click',()=>{if(!recording){origin=performance.now();status.textContent='Preview replaying · 9 seconds'}})
renderButton.addEventListener('click',async()=>{if(recording)return;const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));if(!mime||!canvas.captureStream){status.textContent='This browser cannot render WebM. Try current Chrome or Edge.';return}await document.fonts.ready;try{const stream=canvas.captureStream(30);mediaRecorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:24000000});recordedChunks=[];mediaRecorder.ondataavailable=e=>{if(e.data.size)recordedChunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(recordedChunks,{type:mime}),url=URL.createObjectURL(blob);if(oldUrl)URL.revokeObjectURL(oldUrl);oldUrl=url;downloadButton.href=url;downloadButton.hidden=false;stream.getTracks().forEach(track=>track.stop());recording=false;renderButton.disabled=false;renderButton.textContent='Render 4K WebM';progress.style.width='0%';status.textContent=`4K video ready · ${(blob.size/1000000).toFixed(1)} MB · click Download video to save`};recording=true;renderButton.disabled=true;renderButton.textContent='Rendering 4K...';origin=performance.now();status.textContent='Recording the 9-second journey at 30 fps...';mediaRecorder.start(250);const start=performance.now(),tick=()=>{if(!recording)return;const n=Math.min(100,(performance.now()-start)/DURATION*100);progress.style.width=`${n}%`;if(n>=100)mediaRecorder?.stop();else requestAnimationFrame(tick)};requestAnimationFrame(tick)}catch(error){recording=false;renderButton.disabled=false;renderButton.textContent='Render 4K WebM';status.textContent=`Could not start recording: ${error instanceof Error?error.message:'unknown error'}`}})
