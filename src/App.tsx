import { useEffect, useRef, useState } from 'react'
import { CATS, type Cat, PROGRAMS, POSTS, INDIVIDUALS, BUSINESS, TOPICS } from './data'
import cutout from './cutout.webp'
import mark from './mark'
import logo from './logo'
import { useDepth, useFx } from './Fx'
import { Pension, Checkup, ToolsPage, Funds, Near } from './Tools'
import { href, keyFromPath, meta, ROUTES, BASE } from './routes'

const PHONE = '6989118348'
const MAIL = 'christos.koltsis@nnadvisors.gr'
const QUIZ = 'https://koltsis2002-hash.github.io/--questionnaire/'
const NAV = [['arxiki','Αρχική'],['idiotes','Ιδιώτες'],['epixeiriseis','Επιχειρήσεις'],['ergaleia','Εργαλεία'],['blog','Άρθρα'],['epikoinonia','Επαφή']]

function Posts() {
  return <div className="grid">{POSTS.map(p => (
    <a className="card post" key={p.id} href={href('arthro-' + p.id)}>
      <span className="tag">{p.cat}</span><h3>{p.title}</h3><p>{p.lead}</p><span className="more">Διάβασε →</span>
    </a>))}</div>
}

function Words({ text, from = 0 }: { text: string; from?: number }) {
  return <>{text.split(' ').map((w, i) => <span key={i}>{i > 0 && ' '}<span className="w" style={{ ['--d' as string]: from + i }}>{w}</span></span>)}</>
}

function Home() {
  const hero = useRef<HTMLElement>(null)
  useDepth(hero)
  return <>
    <section className="hero2" id="sxetika" ref={hero}>
      <div className="sig" aria-hidden="true">ΚΟΛΤΣΗΣ</div>
      <div className="hero-copy">
        <span className="tag rise" style={{ ['--d' as string]: 0 }}>Γεια σου, είμαι ο Χρήστος</span>
        <h1 className="hero-title"><Words text="Ο σύμβουλός σου για" /> <em><Words text="ό,τι μετράει" from={4} /></em></h1>
        <p className="rise" style={{ ['--d' as string]: 7 }}>Ασφαλιστικός και χρηματοοικονομικός σύμβουλος στην Έδεσσα. Σε ακούω πρώτα, σου εξηγώ απλά και αποφασίζεις εσύ.</p>
        <div className="actions rise" style={{ ['--d' as string]: 8 }}><a className="btn" href={href('rantevou')}>Ας γνωριστούμε</a><a className="btn ghost" href={'tel:' + PHONE}>{PHONE}</a></div>
      </div>
      <figure className="cut"><img src={cutout} alt="Ο Χρήστος Κόλτσης" width={447} height={897} /></figure>
    </section>

    <section className="about2">
      <div className="bio">
        <p>Είμαι οικονομολόγος και συνεργάζομαι με τη NN Hellas ως ασφαλιστικός και χρηματοοικονομικός σύμβουλος. Βοηθάω οικογένειες και επιχειρήσεις σε όλη τη Βόρεια Ελλάδα.</p>
        <p>Πιστεύω ότι μια καλή απόφαση ξεκινά από μια καθαρή εξήγηση.</p>
      </div>
        <ul className="cv">
          <li><b>NN Hellas</b><span>Ασφαλιστικός &amp; Χρηματοοικονομικός Σύμβουλος, από τον Δεκέμβριο 2025</span></li>
          <li><b>Τράπεζα της Ελλάδος</b><span>Πιστοποιημένος ασφαλιστικός διαμεσολαβητής</span></li>
          <li><b>Πανεπιστήμιο Μακεδονίας</b><span>Πτυχίο Οικονομικών Επιστημών</span></li>
          <li><b>Πανεπιστήμιο Μακεδονίας</b><span>MSc Εφαρμοσμένη Οικονομική &amp; Χρηματοοικονομική (ολοκληρώνεται)</span></li>
        </ul>
    </section>

    <h2 className="section">Τρία βήματα, καμία βιασύνη</h2>
    <div className="stack">{[
      ['1','Σε ακούω','Μου λες τι σε απασχολεί, τι έχεις ήδη και τι θέλεις να προστατέψεις. Χωρίς πίεση και χωρίς υποχρέωση.'],
      ['2','Σου δείχνω επιλογές','Βλέπουμε μαζί τις λύσεις που ταιριάζουν και τι κοστίζει η καθεμιά, με απλά λόγια.'],
      ['3','Μένω δίπλα σου','Σε μια αποζημίωση, σε μια αλλαγή στη ζωή σου ή απλώς για μια ερώτηση. Ένα τηλέφωνο είμαι.']].map(([n,t,d], i) =>
      <div className="card step" key={n} style={{ ['--i' as string]: i }}><span className="step-n">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>

    <h2 className="section" id="ypiresies">Πού μπορώ να βοηθήσω</h2>
    <div className="grid two">
      <a className="card big" href={href('idiotes')}><span className="tag">Ιδιώτες</span><h3>Οικογένεια &amp; προσωπικά σχέδια</h3><p>Ζωή, υγεία, σύνταξη, αποταμίευση και σπίτι.</p><span className="more">Δες τις λύσεις →</span></a>
      <a className="card big" href={href('epixeiriseis')}><span className="tag">Επιχειρήσεις</span><h3>Επιχειρήσεις &amp; ελεύθεροι επαγγελματίες</h3><p>Key person, συνεταίροι, ομαδικά προγράμματα, ευθύνη και cyber.</p><span className="more">Δες τις λύσεις →</span></a>
    </div>

    <h2 className="section">Δοκίμασε μόνος σου</h2>
    <div className="grid">
      <a className="card" href={QUIZ} target="_blank" rel="noreferrer"><span className="tag">2 λεπτά</span><h3>Βρες τις ανάγκες σου</h3><p>Ερωτηματολόγιο 5 βημάτων με τις ανάγκες σου και το κόστος κάλυψης.</p><span className="more">Ξεκίνα →</span></a>
      <a className="card" href={href('syntaxi')}><span className="tag">1 λεπτό</span><h3>Υπολογιστής σύνταξης</h3><p>Πόσα θα σου λείπουν κάθε μήνα στη σύνταξη.</p><span className="more">Υπολόγισε →</span></a>
      <a className="card" href={href('checkup')}><span className="tag">2 λεπτά</span><h3>Check-up προστασίας</h3><p>Πόσο καλυμμένος είσαι σε υγεία, εισόδημα, οικογένεια και σπίτι.</p><span className="more">Κάνε το check-up →</span></a>
    </div>

    <a className="card band" href={href('konta')}><span className="tag">Βόρεια Ελλάδα</span><h2>Υγεία κοντά σου</h2><p>Τι κερδίζεις όταν το πρόγραμμά σου συνεργάζεται με νοσοκομεία κοντά στο σπίτι σου.</p><span className="more">Μάθε περισσότερα →</span></a>
    <h2 className="section">Τελευταία άρθρα</h2><Posts />
    <Booking />
  </>
}
function Individuals() {
  return <>
    <span className="tag">Ιδιώτες</span><h1>Ήσυχος για σένα και <em>τους ανθρώπους σου</em></h1>
    <p className="lead">Από ένα απρόοπτο στο νοσοκομείο μέχρι τη σύνταξη, βρίσκουμε μαζί τι σου ταιριάζει, με το κόστος ξεκάθαρο από την αρχή.</p>
    <div className="grid">{INDIVIDUALS.map((x,i) => <article className="card" key={x.t}><span className="num">{i+1}</span><h3>{x.t}</h3><p>{x.d}</p>
      <a className="more" href={href('programmata')} onClick={() => sessionPick(x.c as Cat)}>Τα προγράμματα →</a></article>)}</div>
    <Cta other={[href('epixeiriseis'),'Λύσεις για επιχειρήσεις']} />
  </>
}
function Business() {
  return <>
    <span className="tag">Επιχειρήσεις</span><h1>Για όσους <em>χτίζουν</em> μια δουλειά</h1>
    <p className="lead">Ξεκινάμε από αυτό που δεν γυρίζει πίσω, δηλαδή τους ανθρώπους. Μετά βλέπουμε τα ομαδικά προγράμματα, το φορολογικό όφελος και την περιουσία της επιχείρησης.</p>
    {BUSINESS.map(g => <section key={g.g}><h2 className="section">{g.g}</h2>
      <div className="grid">{g.items.map(([t,d]) => <article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>)}</div></section>)}
    <Cta other={[href('idiotes'),'Λύσεις για ιδιώτες']} />
  </>
}
function Cta({ other }: { other: string[] }) {
  return <div className="card cta"><h2>Θες να το δούμε για τη δική σου περίπτωση;</h2><p>Ένας καφές ή μια βιντεοκλήση, χωρίς καμία δέσμευση.</p>
    <div className="actions"><a className="btn" href={href('rantevou')}>Ας γνωριστούμε</a><a className="btn ghost" href={other[0]}>{other[1]}</a></div></div>
}
const LEAD_URL = 'https://rcvdnisyznxhwdfakhfl.supabase.co/functions/v1/site-lead'
function Booking({ h1 = false }: { h1?: boolean }) {
  const H = h1 ? 'h1' : 'h2'
  const [f, setF] = useState({ name: '', phone: '', email: '', topic: '', meet: '', pref_day: '', pref_slot: 'Οποιαδήποτε', message: '', consent: false, website: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')
  const [t0] = useState(() => Date.now())
  const set = (k: string, v: string | boolean) => setF(o => ({ ...o, [k]: v }))
  const valid = f.name.trim().length > 1 && f.phone.replace(/\D/g, '').length >= 10 && f.consent && f.meet
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!valid || state === 'sending') return
    setState('sending'); setMsg('')
    try {
      const r = await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, elapsed_ms: Date.now() - t0, source: 'site' }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) { setState('ok'); return }
      setState('err'); setMsg(r.status === 429 ? 'Έστειλες ήδη αίτημα. Θα σε καλέσω σύντομα!' : 'Κάτι δεν πήγε καλά. Δοκίμασε ξανά ή κάλεσέ με.')
    } catch { setState('err'); setMsg('Δεν ήταν δυνατή η αποστολή από εδώ. Κάλεσέ με στο ' + PHONE + '.') }
  }
  if (state === 'ok') return <section className="card booking" id="rantevou-form"><h2>Ευχαριστώ, {f.name.split(' ')[0]}! 😊</h2><p>Πήρα το αίτημά σου και θα σε καλέσω σύντομα.</p></section>
  return <section className="card booking" id="rantevou-form">
    <H>Ας γνωριστούμε, χωρίς δέσμευση</H>
    <p>Πες μου λίγα λόγια και θα σε πάρω τηλέφωνο. Αν έχεις ήδη συμβόλαια, φέρ' τα να τα δούμε μαζί. Ή κάλεσέ με στο <b>{PHONE}</b>.</p>
    <form onSubmit={send}>
      <div className="row"><label>Ονοματεπώνυμο *<input autoComplete="name" required value={f.name} onChange={e => set('name', e.target.value)} /></label>
        <label>Τηλέφωνο *<input type="tel" autoComplete="tel" required value={f.phone} onChange={e => set('phone', e.target.value)} /></label></div>
      <label>Email<input type="email" autoComplete="email" value={f.email} onChange={e => set('email', e.target.value)} /></label>
      <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={e => set('website', e.target.value)} /></label>
      <fieldset><legend>Τι σε ενδιαφέρει;</legend><div className="chips">{TOPICS.map(t => <label className="pick" key={t}><input type="radio" name="topic" checked={f.topic === t} onChange={() => set('topic', t)} /><span>{t}</span></label>)}</div></fieldset>
      <fieldset><legend>Πώς προτιμάς να βρεθούμε; *</legend><div className="chips">{['Από κοντά','Online βιντεοκλήση','Τηλεφωνικά'].map(t => <label className="pick" key={t}><input type="radio" name="meet" checked={f.meet === t} onChange={() => set('meet', t)} /><span>{t}</span></label>)}</div></fieldset>
      <div className="row"><label>Προτιμώμενη μέρα<input type="date" value={f.pref_day} onChange={e => set('pref_day', e.target.value)} /></label>
        <label>Ώρα<select value={f.pref_slot} onChange={e => set('pref_slot', e.target.value)}><option>Οποιαδήποτε</option><option>Πρωί</option><option>Μεσημέρι</option><option>Απόγευμα</option></select></label></div>
      <label>Μήνυμα (προαιρετικό)<textarea rows={3} maxLength={1500} value={f.message} onChange={e => set('message', e.target.value)} /></label>
      <label className="check"><input type="checkbox" checked={f.consent} onChange={e => set('consent', e.target.checked)} /><span>Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για να επικοινωνήσεις μαζί μου για το αίτημά μου. <a href={href('aporrito')}>Απόρρητο</a> *</span></label>
      <button className="btn" disabled={!valid || state === 'sending'}>{state === 'sending' ? 'Αποστολή…' : 'Θέλω να με καλέσεις'}</button>
      {msg && <p className="small" role="alert">{msg}</p>}
    </form>
  </section>
}
let picked: Cat = 'Όλα'
function sessionPick(c: Cat) { picked = c }

function Programs() {
  const [cat, setCat] = useState<Cat>(picked)
  const [open, setOpen] = useState<string | null>(null)
  useEffect(() => { picked = 'Όλα' }, [])
  return <>
    <span className="tag">Προγράμματα</span>
    <h1>Λύσεις για <em>κάθε ανάγκη</em></h1>
    <p className="lead">Πάτησε μια κάρτα για να τη γυρίσεις και να δεις σε τι σε βοηθάει. Τις λεπτομέρειες τις βλέπουμε μαζί, για τη δική σου περίπτωση.</p>
    <Finder go={c => setCat(c)} />
    <div className="chips" role="group" aria-label="Κατηγορίες">{CATS.map(c => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}</div>
    <div className="grid flips">{PROGRAMS.filter(p => cat === 'Όλα' || p.cat === cat).map(p => {
      const on = open === p.name
      return <button className={'flip' + (on ? ' on' : '')} key={p.name} aria-expanded={on} onClick={() => setOpen(on ? null : p.name)}>
        <span className="face front card"><span className="tag">{p.tag ?? p.cat}</span><h3>{p.name}</h3><p>{p.line}</p><span className="more">Σε τι βοηθάει ↻</span></span>
        <span className="face back card"><h3>{p.name}</h3><ul>{p.facts.map(f => <li key={f}>{f}</li>)}</ul>
          {p.valid && <small className="small">Όροι σε ισχύ από {p.valid}</small>}<span className="more">↻ Πίσω</span></span>
      </button>})}</div>
    <p className="small disclaimer">Γενική ενημέρωση. Οι καλύψεις και το κόστος εξαρτώνται από το πρόγραμμα, την ηλικία και τις επιλογές σου.</p>
    <Cta other={[href('checkup'),'Κάνε το τεστ κάλυψης']} />
  </>
}

function Finder({ go }: { go: (c: Cat) => void }) {
  const [step, setStep] = useState(0)
  const opts: [string, Cat][] = [['Να μη με τρομάζει ένας λογαριασμός νοσοκομείου', 'Υγεία'], ['Να έχουν στήριγμα οι δικοί μου', 'Ζωή'], ['Να μαζέψω για τη σύνταξη', 'Σύνταξη'], ['Να βάλω τα χρήματά μου να δουλέψουν', 'Επένδυση'], ['Να προστατέψω την επιχείρησή μου', 'Επιχειρηματικές']]
  return <div className="card finder">
    <h2>Τι θέλεις να πετύχεις;</h2>
    <div className="opts">{opts.map(([t, c], i) => <button key={t} aria-pressed={step === i + 1} onClick={() => { setStep(i + 1); go(c) }}>{t}</button>)}</div>
  </div>
}

function Article({ id }: { id: string }) {
  const p = POSTS.find(x => x.id === id)
  if (!p) return <Posts />
  return <article className="article"><a className="more" href={href('blog')}>← Όλα τα άρθρα</a><span className="tag">{p.cat}</span><h1>{p.title}</h1><p className="lead">{p.lead}</p>
    {p.body.map(t => <p key={t}>{t}</p>)}
    <div className="note"><b>Μια συμβουλή:</b> {p.tip}</div>
    <p className="small">Γενική ενημέρωση. Ισχύουν πάντα οι όροι του κάθε συμβολαίου.</p>
    <a className="btn" href={href('epikoinonia')}>Πάμε να το δούμε μαζί 😊</a></article>
}

function Contact() {
  const [way, setWay] = useState('call')
  const [copied, setCopied] = useState('')
  const copy = (t: string) => { navigator.clipboard?.writeText(t).then(() => setCopied('Αντιγράφηκε ✓'), () => setCopied('Επίλεξε το κείμενο για αντιγραφή')) }
  const ways = [['call','Τηλέφωνο'],['mail','Email'],['form','Φόρμα'],['quiz','Ερωτηματολόγιο']]
  return <>
    <h1>Πώς προτιμάς να μιλήσουμε;</h1><p className="lead">Διάλεξε ό,τι σε βολεύει.</p>
    <div className="chips">{ways.map(([k,l]) => <button key={k} aria-pressed={way === k} onClick={() => { setWay(k); setCopied('') }}>{l}</button>)}</div>
    {way === 'form' ? <Booking /> : <div className="card contact">
      {way === 'call' && <><h2>{PHONE}</h2><p>Πάρε με για μια πρώτη κουβέντα.</p><div className="actions"><a className="btn" href={'tel:' + PHONE}>Κλήση</a><button className="btn ghost" onClick={() => copy(PHONE)}>Αντιγραφή</button></div></>}
      {way === 'mail' && <><h2 className="mail">{MAIL}</h2><p>Γράψε μου τι σε απασχολεί.</p><div className="actions"><a className="btn" href={'mailto:' + MAIL}>Νέο email</a><button className="btn ghost" onClick={() => copy(MAIL)}>Αντιγραφή</button></div></>}
      {way === 'quiz' && <><h2>Βρες τις ανάγκες σου</h2><p>Ένα ερωτηματολόγιο 5 βημάτων.</p><div className="actions"><a className="btn" href={QUIZ} target="_blank" rel="noreferrer">Ξεκίνα</a></div></>}
      <p className="small" aria-live="polite">{copied}</p>
    </div>}
  </>
}

function Privacy() {
  return <article className="article"><h1>Πολιτική απορρήτου</h1><div className="note">Πρόχειρο. Χρειάζεται συμπλήρωση και έγκριση πριν δημοσιευτεί.</div>
    <h2>Ποια στοιχεία ζητούνται</h2><p>Όνομα, τηλέφωνο και το μήνυμά σου, μόνο όταν τα συμπληρώνεις στη φόρμα.</p>
    <h2>Για ποιον λόγο</h2><p>Για να επικοινωνήσω μαζί σου σχετικά με το αίτημά σου.</p>
    <h2>Τα δικαιώματά σου</h2><p>Μπορείς να ζητήσεις να δεις, να διορθώσεις ή να διαγράψεις τα στοιχεία σου στο {MAIL}.</p></article>
}

export default function App({ initial }: { initial?: string }) {
  const [route, setRoute] = useState(() => initial ?? keyFromPath(location.pathname))
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const go = (key: string) => {
      setRoute(key); setMenu(false); window.scrollTo(0, 0)
      const m = meta(key); document.title = m.title
      document.querySelector('meta[name=description]')?.setAttribute('content', m.description)
    }
    const old = location.hash.slice(1)
    if (location.pathname === BASE && ROUTES.includes(old) && old !== 'arxiki') { history.replaceState(null, '', href(old)); go(old) }
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const u = new URL(a.href)
      if (u.origin !== location.origin || !u.pathname.startsWith(BASE) || u.hash) return
      e.preventDefault()
      if (u.pathname !== location.pathname) history.pushState(null, '', u.pathname)
      go(keyFromPath(u.pathname))
    }
    const pop = () => go(keyFromPath(location.pathname))
    document.addEventListener('click', click); addEventListener('popstate', pop)
    return () => { document.removeEventListener('click', click); removeEventListener('popstate', pop) }
  }, [])
  useEffect(() => {
    if (!menu) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [menu])
  useFx(route)
  const active = route.startsWith('arthro-') ? 'blog' : route === 'programmata' ? '' : ['syntaxi','checkup','konta','kefalaia'].includes(route) ? 'ergaleia' : route
  return <>
    <div className="draft">Προεπισκόπηση · εκκρεμεί έγκριση πριν δημοσιευτεί</div>
    <header className={menu ? 'open' : undefined}><div className="pill">
      <a className="brand" href={href('arxiki')}><img className="mark" src={mark} alt="" /><span><b>Κόλτσης Χρήστος</b><small>Insurance &amp; Financial Advisor</small></span></a>
      <nav id="menu" aria-label="Κύριο μενού">{NAV.map(([k,l]) => <a key={k} href={href(k)} aria-current={active === k ? 'page' : undefined} onClick={() => setMenu(false)}>{l}</a>)}</nav>
      <a className="btn book" href={href('rantevou')}>Ραντεβού</a>
      <button className="burger" aria-expanded={menu} aria-controls="menu" aria-label={menu ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'} onClick={() => setMenu(m => !m)}><i /><i /><i /></button>
    </div></header>
    <main className="wrap">
      {route === 'ergaleia' ? <ToolsPage /> : route === 'syntaxi' ? <Pension /> : route === 'checkup' ? <Checkup /> : route === 'kefalaia' ? <Funds /> : route === 'konta' ? <Near /> : route === 'programmata' ? <Programs /> : route === 'idiotes' ? <Individuals /> : route === 'epixeiriseis' ? <Business /> : route === 'rantevou' ? <Booking h1 /> : route === 'blog' ? <><h1>Άρθρα</h1><p className="lead">Μικρές εξηγήσεις για όσα αξίζει να ξέρεις.</p><Posts /></> :
       route.startsWith('arthro-') ? <Article id={route.slice(7)} /> : route === 'epikoinonia' ? <Contact /> : route === 'aporrito' ? <Privacy /> : <Home />}
    </main>
    <footer><div className="wrap"><img className="flogo" src={logo} alt="Κόλτσης Χρήστος · Insurance & Financial Advisor" /><span>Ασφαλιστικός &amp; Χρηματοοικονομικός Σύμβουλος · NN Hellas</span><span>{PHONE} · {MAIL}</span><span>Έδεσσα</span><span><a href={href('programmata')}>Προγράμματα</a> · <a href={href('kefalaia')}>Κεφάλαια</a> · <a href={href('arxiki') + '#sxetika'}>Σχετικά</a> · <a href={href('aporrito')}>Πολιτική απορρήτου</a></span></div></footer>
  </>
}
