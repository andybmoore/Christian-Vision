import './film.css'

const canvas = document.querySelector<HTMLCanvasElement>('#journey-film')!
const context = canvas.getContext('2d')!
const renderButton = document.querySelector<HTMLButtonElement>('#render-film')!
const replayButton = document.querySelector<HTMLButtonElement>('#replay-film')!
const downloadButton = document.querySelector<HTMLAnchorElement>('#download-film')!
const progress = document.querySelector<HTMLElement>('#film-progress')!
const status = document.querySelector<HTMLElement>('#film-status')!

const WIDTH = 3840
const HEIGHT = 2160
const DURATION = 9000
const SCENE_DURATION = DURATION / 5
const lime = '#d0f063'
const paper = '#f1f1e8'
const muted = '#aeb9a8'
const ink = '#18231b'

canvas.width = WIDTH
canvas.height = HEIGHT

function roundedRect(x: number, y: number, width: number, height: number, radius: number, fill: string, stroke?: string) {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
  context.fillStyle = fill
  context.fill()
  if (stroke) {
    context.strokeStyle = stroke
    context.lineWidth = 2
    context.stroke()
  }
}

function text(value: string, x: number, y: number, size: number, color: string, weight = 400, family = 'DM Sans') {
  context.fillStyle = color
  context.font = `${weight} ${size}px "${family}", sans-serif`
  context.fillText(value, x, y)
}

function line(x1: number, y1: number, x2: number, y2: number, color: string | CanvasGradient, width = 2) {
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.strokeStyle = color
  context.lineWidth = width
  context.stroke()
}

function pill(x: number, y: number, label: string, selected = false, width = 280) {
  roundedRect(x, y, width, 68, 34, selected ? '#34482f' : '#1d2a20', selected ? '#60794c' : '#344235')
  if (selected) {
    context.beginPath()
    context.arc(x + 30, y + 34, 6, 0, Math.PI * 2)
    context.fillStyle = lime
    context.fill()
  }
  text(label, x + (selected ? 52 : 28), y + 44, 25, selected ? '#f2f4e9' : '#bdc7b8', 500)
}

function drawBrand() {
  context.fillStyle = '#111811'
  context.fillRect(0, 0, WIDTH, HEIGHT)
  const glow = context.createRadialGradient(3110, 260, 20, 3110, 260, 1600)
  glow.addColorStop(0, '#263b26')
  glow.addColorStop(1, '#111811')
  context.fillStyle = glow
  context.fillRect(0, 0, WIDTH, HEIGHT)
  roundedRect(190, 142, 76, 76, 38, lime)
  text('N', 215, 195, 41, ink, 700)
  text('FJ-N2N', 300, 179, 28, '#f1f2e8', 700)
  text('FAITH JOURNEY  /  NETTONEIGHBOR', 300, 214, 17, '#b9c5b3', 500, 'DM Mono')
  text('CHRISTIAN VISION', 3220, 188, 17, '#c9d2c3', 500, 'DM Mono')
  line(190, 255, 3650, 255, '#354235', 2)
}

function sectionLabel(number: string, title: string, elapsed: number) {
  text(`${number}  /  ${title.toUpperCase()}`, 230, 390, 21, lime, 500, 'DM Mono')
  const progressWidth = 3480 * (elapsed / DURATION)
  roundedRect(190, 2040, 3480, 8, 4, '#29342a')
  roundedRect(190, 2040, Math.max(40, progressWidth), 8, 4, lime)
  text('FJ-N2N  ·  A PATH FROM FIRST INTEREST TO LOCAL WELCOME', 190, 2102, 16, '#aeb9a8', 400, 'DM Mono')
  text(`${String(Math.min(9, Math.floor(elapsed / 1000) + 1)).padStart(2, '0')} / 09`, 3520, 2102, 16, '#aeb9a8', 400, 'DM Mono')
}

function drawOnboarding(phase: number) {
  text('Begin with what', 240, 700, 118, paper, 500, 'DM Serif Display')
  text('matters to them.', 240, 835, 118, lime, 500, 'DM Serif Display')
  text('A private, optional first step.', 245, 920, 32, muted)

  roundedRect(2010, 445, 1260, 1310, 24, '#18241b', '#465644')
  text('MAKE THIS SPACE YOURS', 2110, 560, 20, '#cad6c3', 500, 'DM Mono')
  text('Choose what feels useful.', 2110, 650, 42, paper, 600)
  roundedRect(2110, 720, 500, 110, 14, '#223126', '#50634a')
  roundedRect(2650, 720, 500, 110, 14, '#223126', '#50634a')
  text('LANGUAGE', 2140, 760, 15, '#aebc9f', 500, 'DM Mono')
  text('English', 2140, 805, 27, paper, 500)
  text('APPROX. AREA', 2680, 760, 15, '#aebc9f', 500, 'DM Mono')
  text('Leicester', 2680, 805, 27, paper, 500)
  text('INTERESTS', 2110, 910, 17, '#aebc9f', 500, 'DM Mono')
  const labels = ['Family', 'Bible study', 'Daily encouragement', 'Faith foundations', 'Devotions', 'Budgeting', 'Teaching']
  labels.forEach((label, index) => pill(2110 + (index % 2) * 490, 960 + Math.floor(index / 2) * 92, label, index < 3, 440))
  text('Optional, editable, and always in their control.', 2110, 1605, 20, '#b9c5b3')
  text('No account required to explore.', 2110, 1650, 20, '#859582')
  circlePulse(1850, 1125, phase)
}

function drawHub() {
  text('A hub that feels', 240, 700, 118, paper, 500, 'DM Serif Display')
  text('made for you.', 240, 835, 118, lime, 500, 'DM Serif Display')
  text('One place. Every preferred format.', 245, 920, 32, muted)
  const cards = [
    { x: 1760, y: 485, label: 'ARTICLE', title: 'Faith in family life', color: '#82976a', icon: 'A' },
    { x: 2700, y: 485, label: 'SERMON AUDIO', title: 'A steadier rhythm', color: '#b48c67', icon: 'S' },
    { x: 1760, y: 1110, label: 'PODCAST', title: 'Questions worth asking', color: '#738f91', icon: 'P' },
    { x: 2700, y: 1110, label: 'VIDEO', title: 'A story of hope', color: '#9b8263', icon: 'V' },
  ]
  cards.forEach((card, index) => {
    context.save()
    context.globalAlpha = Math.min(1, Math.max(0, (index + .6) * .7))
    roundedRect(card.x, card.y, 780, 540, 22, '#1a261d', '#465443')
    roundedRect(card.x + 30, card.y + 28, 68, 68, 18, card.color)
    text(card.icon, card.x + 53, card.y + 77, 34, '#f4f4e9', 700)
    text(card.label, card.x + 30, card.y + 410, 17, '#b3c39f', 500, 'DM Mono')
    text(card.title, card.x + 30, card.y + 468, 29, paper, 600)
    context.restore()
  })
  roundedRect(900, 1180, 720, 300, 22, '#263a2a', '#536849')
  text('BEFORE THE FIRST VISIT', 950, 1250, 17, lime, 500, 'DM Mono')
  text('Find your people.', 950, 1330, 34, paper, 600)
  text('Small groups around curated content.', 950, 1390, 20, '#bdc9b7')
}

function drawShare(phase: number) {
  text('A good resource', 240, 700, 118, paper, 500, 'DM Serif Display')
  text('opens a door.', 240, 835, 118, lime, 500, 'DM Serif Display')
  text('Sharing turns content into invitation.', 245, 920, 32, muted)
  roundedRect(340, 1080, 1100, 500, 25, '#eef0e5')
  roundedRect(410, 1150, 74, 74, 37, '#5f7c4b')
  text('A', 436, 1200, 36, paper, 700)
  text('FAITH IN EVERYDAY LIFE', 410, 1325, 18, '#65785a', 500, 'DM Mono')
  text('Small steps. Lasting hope.', 410, 1400, 40, '#243627', 600, 'DM Serif Display')

  glowLine(1510, 1330, 2250, phase)
  const nodes = [
    { x: 2470, y: 650, label: 'MESSAGING', detail: 'WhatsApp · Messages', icon: 'M' },
    { x: 2470, y: 970, label: 'SOCIAL', detail: 'Personal feed or story', icon: 'S' },
    { x: 2470, y: 1290, label: 'FRIEND', detail: 'A direct invitation', icon: 'F' },
  ]
  nodes.forEach((node, index) => {
    roundedRect(node.x, node.y, 900, 230, 18, '#1c2a20', '#475745')
    roundedRect(node.x + 35, node.y + 40, 145, 145, 72, '#2d432e')
    text(node.icon, node.x + 88, node.y + 134, 43, lime, 700)
    text(node.label, node.x + 220, node.y + 90, 17, '#b2c29f', 500, 'DM Mono')
    text(node.detail, node.x + 220, node.y + 145, 27, paper, 500)
    if (phase > .25 + index * .12) {
      context.beginPath(); context.arc(node.x + 805, node.y + 112, 12, 0, Math.PI * 2)
      context.fillStyle = lime; context.fill()
    }
  })
}

function drawCommunity(phase: number) {
  text('Interests become', 240, 700, 118, paper, 500, 'DM Serif Display')
  text('community.', 240, 835, 118, lime, 500, 'DM Serif Display')
  text('Belonging can begin before a building.', 245, 920, 32, muted)
  const left = [
    { y: 700, text: 'Family' },
    { y: 930, text: 'Bible study' },
    { y: 1160, text: 'Devotions' },
  ]
  left.forEach((item, index) => {
    roundedRect(280, item.y, 650, 145, 22, '#1e2a20', '#4a5a43')
    text(item.text, 350, item.y + 92, 36, paper, 500)
    context.beginPath(); context.arc(320, item.y + 72, 12, 0, Math.PI * 2)
    context.fillStyle = index === 0 ? lime : '#789567'; context.fill()
    drawConnector(960, item.y + 72, 2150, 1015, phase, index)
  })
  roundedRect(2210, 790, 980, 500, 26, '#253a29', '#60764f')
  roundedRect(2290, 875, 100, 100, 50, lime)
  text('G', 2323, 945, 43, ink, 700)
  text('NEARBY GROUP', 2440, 900, 17, '#d0e2b0', 500, 'DM Mono')
  text('Family & faith', 2440, 965, 35, paper, 600)
  text('A local community matched', 2290, 1080, 23, '#c1ccb9')
  text('to interests they chose.', 2290, 1125, 23, '#c1ccb9')
  text('DISCUSSION  /  CURATED CONTENT', 2290, 1225, 15, '#b7c997', 500, 'DM Mono')
}

function drawLocalWelcome(phase: number) {
  text('From online interest', 240, 660, 108, paper, 500, 'DM Serif Display')
  text('to a real welcome.', 240, 785, 108, lime, 500, 'DM Serif Display')
  text('They choose the next step. A person makes the connection.', 245, 865, 28, muted)
  drawMap(230, 1010, 1730, 780, phase)
  roundedRect(2250, 1010, 1150, 780, 24, '#18251b', '#485942')
  roundedRect(2330, 1090, 990, 620, 18, '#1c3023')
  text('WHATSAPP DRAFT  /  OPT-IN', 2400, 1170, 17, '#cfe89b', 500, 'DM Mono')
  text('Hi there,', 2400, 1280, 30, paper, 500)
  text('thanks for reaching out.', 2400, 1340, 30, paper, 500)
  text('Would directions or group details help?', 2400, 1400, 30, paper, 500)
  line(2400, 1470, 3290, 1470, '#40533f', 2)
  roundedRect(2400, 1520, 330, 70, 35, '#33472e')
  text('PARTNER REVIEW', 2440, 1565, 15, '#d1e7a2', 500, 'DM Mono')
  text('CONSENT FIRST  ·  DETAILS STAY LOCAL', 240, 1910, 17, '#c4d0bd', 500, 'DM Mono')
}

function circlePulse(x: number, y: number, phase: number) {
  context.beginPath(); context.arc(x, y, 82 + (phase * 58), 0, Math.PI * 2)
  context.strokeStyle = `rgba(208,240,99,${.4 * (1 - phase)})`
  context.lineWidth = 4; context.stroke()
  context.beginPath(); context.arc(x, y, 12, 0, Math.PI * 2)
  context.fillStyle = lime; context.fill()
}

function glowLine(x1: number, y: number, x2: number, phase: number) {
  const gradient = context.createLinearGradient(x1, y, x2, y)
  gradient.addColorStop(0, '#4f6347'); gradient.addColorStop(Math.min(.99, phase), lime); gradient.addColorStop(1, '#4f6347')
  line(x1, y, x2, y, gradient, 7)
}

function drawConnector(x1: number, y1: number, x2: number, y2: number, phase: number, index: number) {
  const endX = x1 + (x2 - x1) * Math.min(1, Math.max(0, (phase * 1.4) - index * .2))
  context.beginPath(); context.moveTo(x1, y1); context.bezierCurveTo(x1 + 380, y1, x2 - 330, y2, endX, y1 + (y2 - y1) * Math.min(1, Math.max(0, (phase * 1.4) - index * .2)))
  context.strokeStyle = index === 0 ? lime : '#78926a'; context.lineWidth = 4; context.setLineDash([12, 12]); context.stroke(); context.setLineDash([])
}

function drawMap(x: number, y: number, width: number, height: number, phase: number) {
  context.save()
  roundedRect(x, y, width, height, 28, '#e3e9d9')
  context.beginPath(); context.roundRect(x, y, width, height, 28); context.clip()
  context.translate(x, y); context.scale(width / 1000, height / 450)
  context.fillStyle = '#d2dfc6'; context.fillRect(0, 0, 1000, 450)
  for (let i = -200; i < 1200; i += 185) {
    line(i, 0, i + 180, 450, '#f7f7ee', 18)
    line(i + 90, 0, i - 60, 450, '#c2d2b6', 26)
  }
  line(0, 225, 1000, 225, '#f8f8f1', 22)
  const focusX = 500 + Math.sin(phase * Math.PI * 2) * 22
  const focusY = 225 + Math.cos(phase * Math.PI * 2) * 16
  const scale = 1 + phase * .24
  context.translate(focusX, focusY); context.scale(scale, scale); context.translate(-focusX, -focusY)
  const churches = [[335, 154], [690, 160], [700, 305]]
  context.setLineDash([10, 9]); context.strokeStyle = '#819c66'; context.lineWidth = 5
  churches.forEach(([cx, cy]) => { context.beginPath(); context.moveTo(focusX, focusY); context.lineTo(cx, cy); context.stroke() })
  context.setLineDash([])
  churches.forEach(([cx, cy]) => {
    context.beginPath(); context.arc(cx, cy, 28, 0, Math.PI * 2); context.fillStyle = '#fff'; context.fill(); context.strokeStyle = '#607e47'; context.lineWidth = 4; context.stroke()
    text('+', cx - 10, cy + 12, 30, '#567643', 700)
  })
  context.beginPath(); context.arc(focusX, focusY, 13, 0, Math.PI * 2); context.fillStyle = '#416c91'; context.fill()
  context.beginPath(); context.arc(focusX, focusY, 32 + phase * 20, 0, Math.PI * 2); context.strokeStyle = '#416c914f'; context.lineWidth = 5; context.stroke()
  context.restore()
  roundedRect(x + 22, y + 20, 370, 58, 29, '#f6f7eee8')
  text('NEARBY PARTNER CHURCHES', x + 46, y + 58, 17, '#546b45', 500, 'DM Mono')
}

function drawFrame(now: number, origin: number) {
  const elapsed = Math.min(DURATION - 1, Math.max(0, now - origin))
  const scene = Math.min(4, Math.floor(elapsed / SCENE_DURATION))
  const phase = (elapsed - scene * SCENE_DURATION) / SCENE_DURATION
  drawBrand()
  sectionLabel(['01', '02', '03', '04', '05'][scene], ['MEET', 'PERSONALIZE', 'SHARE', 'COMMUNITY', 'LOCAL WELCOME'][scene], elapsed)
  context.save()
  context.globalAlpha = Math.min(1, phase * 3)
  context.translate(0, (1 - Math.min(1, phase * 3)) * 28)
  if (scene === 0) drawOnboarding(phase)
  if (scene === 1) drawHub()
  if (scene === 2) drawShare(phase)
  if (scene === 3) drawCommunity(phase)
  if (scene === 4) drawLocalWelcome(phase)
  context.restore()
}

let previewOrigin = performance.now()
let isRecording = false
let recorder: MediaRecorder | null = null
let chunks: Blob[] = []
let recordTimer = 0
let previousVideoUrl = ''

function animate(now: number) {
  drawFrame(isRecording ? now : now, isRecording ? previewOrigin : previewOrigin)
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

replayButton.addEventListener('click', () => {
  if (isRecording) return
  previewOrigin = performance.now()
  status.textContent = 'Preview replaying · 9 seconds'
})

renderButton.addEventListener('click', async () => {
  if (isRecording) return
  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type))
  if (!mimeType || !canvas.captureStream) {
    status.textContent = 'This browser cannot render WebM. Try current Chrome or Edge.'
    return
  }
  await document.fonts.ready
  try {
    const stream = canvas.captureStream(30)
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 24000000 })
    chunks = []
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)
      if (previousVideoUrl) URL.revokeObjectURL(previousVideoUrl)
      previousVideoUrl = url
      downloadButton.href = url
      downloadButton.style.cssText = 'min-height:36px;flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border:1px solid #d0f063;background:#d0f063;color:#172016;font-size:9px;text-decoration:none;cursor:pointer'
      downloadButton.hidden = false
      stream.getTracks().forEach(track => track.stop())
      isRecording = false
      renderButton.disabled = false
      renderButton.textContent = 'Render 4K WebM'
      progress.style.width = '0%'
      status.textContent = `4K video ready · ${(blob.size / 1000000).toFixed(1)} MB · click Download video to save`
    }
    isRecording = true
    renderButton.disabled = true
    renderButton.textContent = 'Rendering 4K...'
    previewOrigin = performance.now()
    status.textContent = 'Recording the 9-second journey at 30 fps...'
    recorder.start(250)
    const started = performance.now()
    const updateProgress = () => {
      if (!isRecording) return
      const amount = Math.min(100, ((performance.now() - started) / DURATION) * 100)
      progress.style.width = `${amount}%`
      if (amount >= 100) recorder?.stop()
      else recordTimer = requestAnimationFrame(updateProgress)
    }
    recordTimer = requestAnimationFrame(updateProgress)
  } catch (error) {
    isRecording = false
    renderButton.disabled = false
    renderButton.textContent = 'Render 4K WebM'
    status.textContent = `Could not start recording: ${error instanceof Error ? error.message : 'unknown error'}`
  }
})

void recordTimer