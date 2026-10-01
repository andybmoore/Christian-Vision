import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, BookOpenCheck, Check, ChevronLeft, ChevronRight, Clock3, Compass, Headphones, Heart, Languages, MapPin, MessageCircle, MessagesSquare, Moon, Play, Printer, Podcast, Send, Share2, ShieldCheck, Sparkles, Sun, UsersRound, X, CircleHelp } from 'lucide-react'

function CVMark({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 714 165" role="img" aria-label="CV"><path d="M348 143H84A60.5 60.5 0 0 1 84 22H300C322 22 338 29 353 44L468 133Q493 158 518 133L636 22H692" fill="none" stroke="currentColor" strokeWidth="44" strokeLinecap="butt" strokeLinejoin="round" /></svg>
}

const slides = ['Meet & personalize', 'Share & invite', 'Find a local welcome']
const scripts = [
  'The first encounter happens in the app, before someone is ready to visit a church. Keep onboarding light and optional: let people choose a preferred language, share an approximate location if they wish, and select interests such as family, Bible study, daily encouragement, faith foundations, devotionals, budgeting or teaching. Those choices shape a central content hub across articles, sermon audio, podcasts and video. Curated small groups and discussion forums connect people around the content, so belonging can begin before a building is involved. Let people explore privately and change or skip preferences at any time.',
  'The second moment is sharing. A useful article, sermon, podcast or testimony should be easy to send to a personal social account or directly to a messaging app. The recipient can open the same resource without friction, explore related content and find a small group or conversation if they choose. Sharing is not just a distribution tactic: it is a personal invitation from someone they already trust. Measure shared-resource visits and meaningful follow-on engagement, not only impressions. Always make the destination and privacy implications clear.',
  'When a seeker is ready, FJ-N2N can turn their chosen location, language and interests into a relevant local suggestion. Show nearby partner churches and practical details first. With explicit consent, pass the minimum necessary contact and interest context to the chosen church or welcome partner. A welcome team can reach out through the person’s preferred channel, answer questions and offer directions or a small-group introduction. Target a twenty-five percent reduction in handoff time and a fifteen percent lift in multi-touch engagement. Keep identifiable details local, and never automate theological counselling.',
]
const followUps = [
  ['How do you keep onboarding from feeling intrusive?', 'Use progressive, optional setup. Ask only for language and broad interests first; request approximate location only when it adds value, explain why, and let people skip or change every choice.'],
  ['How does sharing lead to meaningful connection?', 'A shared resource opens into a related content path and an optional community invitation. Track consented return visits and group interest, not social reach alone.'],
  ['How do you protect people during a church handoff?', 'Show the suggested church first and require an explicit opt-in before any contact information or interest context is shared. Keep the data local, limit it to the chosen partner, and log a minimal receipt.'],
]
const questions = [
  ['How do you keep the app useful before someone visits a church?', 'Personalized articles, audio and video lead into small groups and discussion around curated content. People can form a sense of community at their own pace, without a building visit as the first step.'],
  ['How do you handle location and sensitive interests?', 'Collect the least precise location that still helps, explain its purpose, and ask before using it for church matching. Keep individual-level data local and provide clear controls to edit or remove it.'],
  ['How do local churches receive a handoff?', 'The person chooses whether to connect and which partner to contact. The church receives a minimal, consented introduction, then responds through an agreed low-friction channel and reports a simple receipt.'],
  ['How do you adapt recommendations across regions?', 'Use a shared content taxonomy with locally curated material, language and interest tags. Regional teams own partner fit and recommendations; global reporting uses aggregated movement measures.'],
]

const interests = ['Family', 'Bible study', 'Daily encouragement', 'Faith foundations', 'Devotional', 'Budgeting', 'Teaching']

function FirstEncounterSlide() {
  return <div className="slide journey-slide encounter-slide">
    <header className="journey-title"><div><span className="eyebrow"><i/> 01 / FIRST ENCOUNTER</span><h1>Start with what<br/><em>matters to them.</em></h1></div><p>A welcoming app experience, shaped by each person’s language, interests and pace.</p></header>
    <div className="encounter-layout">
      <section className="onboarding-panel"><div className="product-bar"><span className="app-glyph">N</span><b>YOUR STARTING POINT</b><span className="step-label">OPTIONAL SETUP</span></div><h2>Make this space yours.</h2><p>Choose what feels useful. You can update these any time.</p>
        <div className="profile-fields"><div><MapPin size={14}/><span><small>APPROXIMATE LOCATION</small><b>Leicester area <i>Change</i></b></span></div><div><Languages size={14}/><span><small>PREFERRED LANGUAGE</small><b>English <i>Change</i></b></span></div></div>
        <div className="interest-heading"><strong>What are you interested in?</strong><small>SELECT ANY</small></div><div className="interest-chips">{interests.map((interest,index)=><span className={index<3?'is-selected':''} key={interest}>{index<3&&<Check size={11}/>} {interest}</span>)}</div>
        <div className="privacy-hint"><ShieldCheck size={14}/><span>Location is optional. Ask permission before using it to suggest a nearby church.</span></div>
      </section>
      <section className="personalized-panel"><div className="hub-topline"><span><Sparkles size={13}/> A CONTENT HUB THAT LEARNS</span><b>FOR YOU</b></div><div className="hub-media-row"><article><BookOpen size={16}/><small>ARTICLE</small><strong>Faith in family life</strong></article><article><Headphones size={16}/><small>SERMON AUDIO</small><strong>Finding a steady rhythm</strong></article><article><Podcast size={16}/><small>PODCAST</small><strong>Questions worth asking</strong></article><article><Play size={16}/><small>VIDEO</small><strong>A story of hope</strong></article></div>
        <div className="community-card"><div className="community-symbol"><UsersRound size={17}/></div><div><small>BEFORE YOUR FIRST VISIT</small><strong>Find your people, at your pace.</strong><p>Join a small group or discussion around content you already care about.</p></div><ArrowUpRight size={16}/></div>
        <div className="community-tags"><span><Heart size={12}/> Family & faith</span><span><MessagesSquare size={12}/> Curated discussion</span></div>
      </section>
    </div>
  </div>
}

function SharingSlide() {
  return <div className="slide journey-slide sharing-slide">
    <header className="journey-title"><div><span className="eyebrow"><i/> 02 / SHARE & INVITE</span><h1>Good content<br/><em>opens another door.</em></h1></div><p>Make every useful resource easy to pass along, wherever people already connect.</p></header>
    <div className="sharing-layout">
      <section className="share-resource"><div className="resource-art"><div className="resource-art-mark"><BookOpen size={21}/></div><span>FAITH IN EVERYDAY LIFE</span><b>Small steps.<br/>Lasting hope.</b><small>CV EDITORIAL · 6 MIN READ</small></div><div className="resource-details"><span>CURATED FOR YOU <i/> FAITH FOUNDATIONS</span><h2>A resource that feels worth sharing.</h2><p>Article, sermon audio, podcast or video: the hub keeps preferred media one tap away.</p><div className="media-types"><span><BookOpen size={13}/> Articles</span><span><Headphones size={13}/> Sermons</span><span><Podcast size={13}/> Podcasts</span><span><Play size={13}/> Video</span></div></div></section>
      <div className="share-connector"><span>ONE TAP</span><ArrowRight size={18}/></div>
      <section className="share-destinations"><div className="share-heading"><span><Share2 size={15}/> SHARE FROM THE HUB</span><small>PERSONAL · OPTIONAL</small></div><a href="https://wa.me/?text=Explore%20this%20resource" target="_blank" rel="noreferrer"><MessageCircle size={16}/><span><b>Messaging apps</b><small>WhatsApp, Messages & more</small></span><ArrowUpRight size={14}/></a><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.cvglobal.co%2Fen" target="_blank" rel="noreferrer"><Share2 size={16}/><span><b>Social channels</b><small>Share to a personal feed or story</small></span><ArrowUpRight size={14}/></a><button type="button"><Send size={16}/><span><b>Send to a friend</b><small>Invite someone into the conversation</small></span><ArrowUpRight size={14}/></button><div className="share-consent"><ShieldCheck size={13}/> The recipient chooses what to explore next.</div></section>
    </div>
    <div className="share-outcome"><div><span className="outcome-icon"><UsersRound size={16}/></span><span><small>THE INVITATION</small><b>A trusted person shares something meaningful.</b></span></div><ArrowRight size={16}/><div><span className="outcome-icon"><Compass size={16}/></span><span><small>THE NEXT STEP</small><b>Discover content, community and local connection.</b></span></div><span className="outcome-note">Reach through relationship, not reach for its own sake.</span></div>
  </div>
}

function LocalConnectionSlide() {
  return <div className="slide journey-slide local-slide">
    <header className="journey-title"><div><span className="eyebrow"><i/> 03 / LOCAL CONNECTION</span><h1>From online interest<br/><em>to a real welcome.</em></h1></div><p>Clear next steps, a consent-led introduction and a human being ready to respond.</p></header>
    <div className="local-flow">
      <article className="local-step"><span className="local-step-number">01</span><div className="local-step-icon"><MapPin size={18}/></div><small>LOCALIZE</small><h2>Match the context.</h2><p>Use chosen language, approximate location, interests and accessibility preferences.</p><div className="local-tags"><span>Language</span><span>Distance</span><span>Interests</span></div></article>
      <div className="local-arrow"><ArrowRight size={18}/></div>
      <article className="local-step match-step"><span className="local-step-number">02</span><div className="local-step-icon"><Compass size={18}/></div><small>SUGGEST, DON’T ASSIGN</small><h2>Let them choose.</h2><p>Show nearby partner churches with a language and interest fit, plus directions and visit details.</p><div className="church-match"><span><BuildingChurchIcon/><i/></span><div><b>Nearby partner community</b><small>2.4 km · English · family group</small></div><Check size={14}/></div></article>
      <div className="local-arrow"><ArrowRight size={18}/></div>
      <article className="local-step handoff-step"><span className="local-step-number">03</span><div className="local-step-icon"><HandHeartIcon/></div><small>OPT-IN HANDOFF</small><h2>A person follows up.</h2><p>With permission, send the minimum details to a church partner or welcome team.</p><div className="welcome-message"><MessageCircle size={13}/><span>Welcome team reaches out by the person’s preferred channel.</span></div></article>
    </div>
    <div className="local-bottom"><div className="local-measures"><span>6—12 MONTH SIGNALS</span><b><strong>25%</strong> faster handoff</b><i/><b><strong>15%</strong> more multi-touch engagement</b></div><div className="local-guardrail"><ShieldCheck size={16}/><span><b>CONSENT FIRST. DATA STAYS LOCAL.</b><small>No central seeker profile · no automated theological counselling</small></span></div></div>
  </div>
}

function BuildingChurchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M12 2v5M9.5 4.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function HandHeartIcon() {
  return <Heart size={18}/>
}

function PresentationApp({ theme = 'original' }: { theme?: 'original' | 'cv-global' }) {
  const appearanceKey = theme === 'cv-global' ? 'fj-n2n:appearance:cv-global' : 'fj-n2n:appearance:original'
  const [active, setActive] = useState(0)
  const [guide, setGuide] = useState(false)
  const [qa, setQa] = useState(false)
  const [appearance, setAppearance] = useState<'day' | 'night'>(() => localStorage.getItem(appearanceKey) === 'night' ? 'night' : 'day')
  useEffect(() => {
    localStorage.setItem(appearanceKey, appearance)
  }, [appearance, appearanceKey])
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setGuide(false)
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey) setGuide(open => !open)
      if (event.key === 'ArrowRight' || event.key === 'PageDown') setActive(index => Math.min(2,index+1))
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') setActive(index => Math.max(0,index-1))
      if (event.key === 'Home') setActive(0)
      if (event.key === 'End') setActive(2)
    }
    window.addEventListener('keydown',onKey);return ()=>window.removeEventListener('keydown',onKey)
  },[])
  const CurrentSlide=[FirstEncounterSlide,SharingSlide,LocalConnectionSlide][active]
  return <main className={`app ${theme === 'cv-global' ? 'cv-global-theme' : ''}`} data-appearance={appearance}><header className="topbar"><div className="brand"><CVMark className="brand-symbol"/><i/><span>CHRISTIAN VISION<small className="product-name">Faith Journey | NetToNeighbor (FJ-N2N)</small></span></div><div className="deck-name">DATA PRODUCT <i>/</i> <b>FJ-N2N</b></div><div className="top-tools"><span><i/> INTERVIEW DECK</span><button className="appearance-toggle" onClick={()=>setAppearance(mode=>mode==='day'?'night':'day')} title={`Switch to ${appearance==='day'?'night':'day'} mode`} aria-label={`Switch to ${appearance==='day'?'night':'day'} mode`}>{appearance==='day'?<Moon size={15}/>:<Sun size={15}/>}</button><button onClick={()=>window.print()} title="Print or save as PDF"><Printer size={15}/><label>Print</label></button></div></header>
    <div className={`workspace ${guide?'with-guide':''}`}><section className="deck"><div className="slide-meta"><span>0{active+1} / {['FIRST ENCOUNTER','SHARE & INVITE','LOCAL CONNECTION'][active]}</span><span>CHRISTIAN VISION <i>·</i> 2026</span></div><div className="canvas" key={active}><CurrentSlide/><span className="slide-count">0{active+1}<i>/</i>03</span></div>
      <nav className="controls" aria-label="Slide navigation"><button className="arrow" onClick={()=>setActive(i=>Math.max(0,i-1))} disabled={active===0} aria-label="Previous slide"><ChevronLeft size={18}/></button><div className="tabs">{slides.map((name,index)=><button key={name} onClick={()=>setActive(index)} className={index===active?'selected':''} aria-current={index===active?'step':undefined}><small>0{index+1}</small><b>{name}</b></button>)}</div><button className="arrow" onClick={()=>setActive(i=>Math.min(2,i+1))} disabled={active===2} aria-label="Next slide"><ChevronRight size={18}/></button><i className="separator"/><button className={`guide-toggle ${guide?'active':''}`} onClick={()=>setGuide(value=>!value)} aria-expanded={guide} aria-label="Speaker guide"><BookOpenCheck size={16}/><span>Speaker guide</span></button></nav><div className="key-hint"><kbd>←</kbd><kbd>→</kbd> navigate <i>·</i> <kbd>N</kbd> speaker guide</div></section>
      {guide&&<aside className="guide"><header><div><span className="eyebrow"><i/> 5-MINUTE SPEAKER GUIDE</span><h2>{qa?'Panel Q&A':['First encounter & personalization','Sharing as invitation','Local church localization'][active]}</h2></div><button className="close" onClick={()=>setGuide(false)} aria-label="Close speaker guide"><X size={17}/></button></header><nav className="guide-tabs"><button className={!qa?'chosen':''} onClick={()=>setQa(false)}>Speaking notes</button><button className={qa?'chosen':''} onClick={()=>setQa(true)}>Q&A prep <small>04</small></button></nav>{qa?<div className="qa-list">{questions.map(([question,answer],i)=><article key={question}><small>0{i+1} / PANEL QUESTION</small><h3>{question}</h3><p>{answer}</p></article>)}</div>:<div className="script"><label><Clock3 size={13}/> MINUTE {active===0?'1':active===1?'2—3':'4—5'}</label><p>“{scripts[active]}”</p><article><small><CircleHelp size={13}/> LIKELY FOLLOW-UP</small><h3>{followUps[active][0]}</h3><p>{followUps[active][1]}</p></article><aside><Sparkles size={14}/> Keep the person’s choice and local context in view.</aside></div>}<footer><button disabled={!active} onClick={()=>setActive(i=>Math.max(0,i-1))}><ArrowLeft size={13}/> Previous</button><span>0{active+1} / 03</span><button disabled={active===2} onClick={()=>setActive(i=>Math.min(2,i+1))}>Next <ArrowRight size={13}/></button></footer></aside>}</div>
    <footer className="page-footer"><span>Faith Journey NetToNeighbor (FJ-N2N)</span><span>Every touchpoint, a path to human connection.</span></footer>
  </main>
}
export default PresentationApp