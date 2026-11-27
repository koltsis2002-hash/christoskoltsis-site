import { type FormEvent, type ReactElement, useEffect, useRef, useState } from 'react'
import { MOMENTS, POSTS } from './data'
import cutout from './cutout.webp'
import mark from './mark'
import logo from './logo'
import { useDepth, useFx } from './Fx'
import { Pension, CoverMap, ToolsPage, QUIZ } from './Tools'
import { DECKS, Deck, DeckPage, Topic, TopicCard, type DeckKey } from './Decks'
import { href, keyFromPath, currentKey, meta, BASE, HASH, OLD, ROUTES } from './routes'

const PHONE = '6989118348'
const MAIL = 'christos.koltsis@nnadvisors.gr'
const NAV = [['arxiki', 'Αρχική'], ['stigmes', 'Στιγμές ζωής'], ['ergaleia', 'Εργαλεία'], ['blog', 'Άρθρα'], ['epikoinonia', 'Επαφή']]
const DECK_KEYS = Object.keys(DECKS) as DeckKey[]

const ICON: Record<string, ReactElement> = {
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />,
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M15 8l2 2" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>,
}
const Ico = ({ n }: { n: string }) => <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[n]}</svg>

function Words({ text, from = 0 }: { text: string; from?: number }) {
  return <>{text.split(' ').map((w, i) => <span key={i}>{i > 0 && ' '}<span className="w" style={{ ['--d' as string]: from + i }}>{w}</span></span>)}</>
}

function Posts({ n }: { n?: number }) {
  return <div className="grid">{POSTS.slice(0, n).map(p => (
    <a className="card post" key={p.id} href={href('arthro-' + p.id)}>
      <span className="tag">{p.cat}</span><h3>{p.title}</h3><p>{p.lead}</p><span className="more">Διάβασε →</span>
    </a>))}</div>
}

function MomentCards() {
  return <div className="moments">{MOMENTS.map(m => <a key={m.id} className="card moment" href={href('stigmi-' + m.id)}><Ico n={m.icon} /><h3>{m.title}</h3><p>{m.lead}</p><span className="more">Δες τι χρειάζεσαι →</span></a>)}</div>
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
        <div className="actions rise" style={{ ['--d' as string]: 8 }}><a className="btn" href={href('epikoinonia')}>Πάρε με τηλέφωνο</a><a className="btn ghost" href={href('stigmes')}>Τι σε απασχολεί;</a></div>
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
        <li><b>Τράπεζα της Ελλάδος</b><span>Πιστοποίηση ασφαλιστικής διαμεσολάβησης</span></li>
        <li><b>Πανεπιστήμιο Μακεδονίας</b><span>Πτυχίο Οικονομικών Επιστημών</span></li>
        <li><b>Πανεπιστήμιο Μακεδονίας</b><span>MSc Εφαρμοσμένη Οικονομική &amp; Χρηματοοικονομική</span></li>
      </ul>
    </section>

    <h2 className="section">Σε ποια στιγμή της ζωής σου βρίσκεσαι;</h2>
    <p className="lead">Κάθε στιγμή φέρνει τις δικές της ερωτήσεις. Διάλεξε τη δική σου.</p>
    <MomentCards />

    <h2 className="section">Πώς δουλεύει, με απλά λόγια</h2>
    <div className="deck-more">{DECK_KEYS.map(k => <TopicCard key={k} k={k} />)}</div>
    <div className="grid two" style={{ marginTop: 14 }}>
      <a className="card" href={href('xartis')}><span className="tag">1 λεπτό</span><h3>Ο χάρτης της προστασίας σου</h3><p>Έξι περιοχές, ένα πάτημα στην καθεμιά.</p><span className="more">Ξεκίνα →</span></a>
      <a className="card" href={href('syntaxi')}><span className="tag">3 ερωτήσεις</span><h3>Πόσο να βάζω για τη σύνταξη;</h3><p>Ένα νούμερο για κάθε μήνα, από σήμερα.</p><span className="more">Υπολόγισε →</span></a>
    </div>

    <h2 className="section">Από το blog</h2><Posts n={3} />
    <Callback />
  </>
}

function Moments() {
  return <>
    <span className="tag">Στιγμές ζωής</span>
    <h1>Η ασφάλεια αλλάζει <em>μαζί σου</em></h1>
    <p className="lead">Δεν χρειάζονται όλοι τα ίδια. Βρες τη στιγμή που σου μοιάζει και δες τι αξίζει να σκεφτείς.</p>
    <MomentCards />
  </>
}

function MomentPage({ id }: { id: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const m = MOMENTS.find(x => x.id === id)
  if (!m) return <Moments />
  const i = MOMENTS.indexOf(m), next = MOMENTS[(i + 1) % MOMENTS.length]
  const toggle = (j: number) => {
    setOpen(o => (o === j ? null : j))
    requestAnimationFrame(() => document.getElementById('need-' + j)?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }
  return <>
    <a className="more" href={href('stigmes')}>← Όλες οι στιγμές</a>
    <div className="mhead"><Ico n={m.icon} /><div><span className="tag">Στιγμή ζωής</span><h1>{m.title}</h1></div></div>
    <blockquote className="worry">{m.worry}</blockquote>
    <h2 className="section">Τι αξίζει να σκεφτείς</h2>
    <div className={'stack' + (open != null ? ' has-open' : '')}>{m.needs.map((n, j) => <article id={'need-' + j} className={'card step' + (open === j ? ' open' : '')} key={n.t} style={{ ['--i' as string]: j }}>
      <span className="step-n">{j + 1}</span>
      <div className="step-body"><h3>{n.t}</h3><p>{n.d}</p>
        {n.deck && <button type="button" className="step-toggle" aria-expanded={open === j} aria-controls={'deck-' + j} onClick={() => toggle(j)}>{open === j ? 'Κλείσε ▴' : <><Topic k={n.deck} sm /> · Μάθε για αυτήν ▾</>}</button>}
        {n.deck && open === j && <div id={'deck-' + j} className="step-deck"><Deck k={n.deck} bare /></div>}
      </div></article>)}</div>
    <p className="small disclaimer">Γενική ενημέρωση. Τι ακριβώς σου ταιριάζει εξαρτάται από την ηλικία, το εισόδημα και όσα ήδη έχεις.</p>
    <Callback topic={m.title} />
    <a className="card band" href={href('stigmi-' + next.id)}><span className="tag">Επόμενη στιγμή</span><h2>{next.title}</h2><p>{next.lead}</p><span className="more">Συνέχισε →</span></a>
  </>
}

const LEAD_URL = 'https://rcvdnisyznxhwdfakhfl.supabase.co/functions/v1/site-lead'
const WAYS = ['Τηλεφωνικά', 'Βιντεοκλήση']
// Short day codes keep pref_day within the 20 characters the lead function stores
const DAYS: [string, string][] = [['Δευτέρα', 'Δε'], ['Τρίτη', 'Τρ'], ['Τετάρτη', 'Τε'], ['Πέμπτη', 'Πε'], ['Παρασκευή', 'Πα'], ['Σάββατο', 'Σα']]
const TIMES = Array.from({ length: 25 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)

function Callback({ topic = '' }: { topic?: string }) {
  const [f, setF] = useState({ name: '', phone: '', meet: WAYS[0], consent: false, website: '' })
  const [days, setDays] = useState<string[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')
  const [t0] = useState(() => Date.now())
  const id = 'cb' + topic.replace(/\W/g, '').slice(0, 12)
  const set = (k: string, v: string | boolean) => setF(o => ({ ...o, [k]: v }))
  const toggle = (list: string[], put: (x: string[]) => void, v: string) => put(list.includes(v) ? list.filter(x => x !== v) : [...list, v])
  const badRange = !!from !== !!to || (!!from && to <= from)
  const pickFrom = (v: string) => { setFrom(v); if (v && (!to || to <= v)) setTo(TIMES[Math.min(TIMES.indexOf(v) + 4, TIMES.length - 1)]) }
  const valid = f.name.trim().length > 1 && f.phone.replace(/\D/g, '').length >= 10 && f.consent && !badRange
  const send = async (e: FormEvent) => {
    e.preventDefault(); if (!valid || state === 'sending') return
    setState('sending'); setMsg('')
    const pref_day = DAYS.filter(([d]) => days.includes(d)).map(([, s]) => s).join(',')
    const pref_slot = from ? `${from}–${to}` : 'Οποιαδήποτε ώρα'
    try {
      const r = await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, topic, pref_day, pref_slot, elapsed_ms: Date.now() - t0, source: 'site' }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) { setState('ok'); return }
      setState('err'); setMsg(r.status === 429 ? 'Έστειλες ήδη αίτημα. Θα σε καλέσω σύντομα!' : 'Κάτι δεν πήγε καλά. Δοκίμασε ξανά ή κάλεσέ με στο ' + PHONE + '.')
    } catch { setState('err'); setMsg('Δεν ήταν δυνατή η αποστολή από εδώ. Κάλεσέ με στο ' + PHONE + '.') }
  }
  if (state === 'ok') return <section className="card callback done"><h2>Ευχαριστώ, {f.name.trim().split(' ')[0]}! 😊</h2><p>{f.meet === 'Βιντεοκλήση' ? 'Θα σε καλέσω σύντομα για να κανονίσουμε τη βιντεοκλήση.' : 'Θα σε καλέσω σύντομα.'}</p></section>
  return <section className="card callback">
    <div className="cbtext"><h2>Πάρε με τηλέφωνο, <em>ή σε παίρνω εγώ</em></h2>
      <p>Άφησε όνομα και τηλέφωνο, πες μου πώς και πότε σε βολεύει, και θα σε καλέσω. Χωρίς καμία δέσμευση.</p>
      <p className="direct"><a href={'tel:' + PHONE}>{PHONE}</a><span>·</span><a href={'mailto:' + MAIL}>{MAIL}</a></p></div>
    <form onSubmit={send}>
      <label>Όνομα<input id={id + 'n'} autoComplete="name" required value={f.name} onChange={e => set('name', e.target.value)} /></label>
      <label>Τηλέφωνο<input id={id + 'p'} type="tel" autoComplete="tel" required value={f.phone} onChange={e => set('phone', e.target.value)} /></label>
      <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={e => set('website', e.target.value)} /></label>
      <fieldset><legend>Πώς να μιλήσουμε;</legend><div className="chips">{WAYS.map(t => <label className="pick" key={t}><input type="radio" name={id + 'way'} checked={f.meet === t} onChange={() => set('meet', t)} /><span>{t}</span></label>)}</div></fieldset>
      <fieldset><legend>Ποιες μέρες σε βολεύουν;</legend><div className="chips">{DAYS.map(([d]) => <label className="pick" key={d}><input type="checkbox" checked={days.includes(d)} onChange={() => toggle(days, setDays, d)} /><span>{d}</span></label>)}</div></fieldset>
      <fieldset><legend>Ποια ώρα να σε καλέσω;</legend><div className="range">
        <label>Από<select id={id + 'f'} value={from} onChange={e => pickFrom(e.target.value)}><option value="">Οποιαδήποτε</option>{TIMES.slice(0, -1).map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Έως<select id={id + 't'} value={to} onChange={e => setTo(e.target.value)}><option value="">Οποιαδήποτε</option>{TIMES.slice(1).map(t => <option key={t} disabled={!!from && t <= from}>{t}</option>)}</select></label>
      </div>{badRange && <p className="small" role="alert">Διάλεξε μια ώρα «έως» μετά την ώρα «από».</p>}</fieldset>
      <label className="check"><input type="checkbox" checked={f.consent} onChange={e => set('consent', e.target.checked)} /><span>Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για να επικοινωνήσεις μαζί μου. <a href={href('aporrito')}>Απόρρητο</a></span></label>
      <button className="btn" disabled={!valid || state === 'sending'}>{state === 'sending' ? 'Αποστολή…' : 'Θέλω να με καλέσεις'}</button>
      {msg && <p className="small" role="alert">{msg}</p>}
    </form>
  </section>
}

function Article({ id }: { id: string }) {
  const p = POSTS.find(x => x.id === id)
  if (!p) return <Posts />
  return <article className="article"><a className="more" href={href('blog')}>← Όλα τα άρθρα</a><span className="tag">{p.cat}</span><h1>{p.title}</h1><p className="lead">{p.lead}</p>
    {p.body.map(t => <p key={t}>{t}</p>)}
    <div className="note"><b>Μια συμβουλή:</b> {p.tip}</div>
    <p className="small">Γενική ενημέρωση. Ισχύουν πάντα οι όροι του κάθε συμβολαίου.</p>
    <Callback topic={'Άρθρο: ' + p.title} /></article>
}

function Privacy() {
  return <article className="article"><h1>Πολιτική απορρήτου</h1><div className="note">Πρόχειρο. Χρειάζεται συμπλήρωση και έγκριση πριν δημοσιευτεί.</div>
    <h2>Ποια στοιχεία ζητούνται</h2><p>Όνομα, τηλέφωνο, αν προτιμάς τηλεφώνημα ή βιντεοκλήση και ποιες μέρες και ώρες σε βολεύουν, μόνο όταν τα συμπληρώνεις στη φόρμα.</p>
    <h2>Για ποιον λόγο</h2><p>Για να επικοινωνήσω μαζί σου σχετικά με το αίτημά σου. Τα στοιχεία δεν χρησιμοποιούνται για τίποτε άλλο.</p>
    <h2>Τα δικαιώματά σου</h2><p>Μπορείς να ζητήσεις να δεις, να διορθώσεις ή να διαγράψεις τα στοιχεία σου στο {MAIL}.</p></article>
}

export default function App({ initial }: { initial?: string }) {
  const [route, setRoute] = useState(() => initial ?? currentKey())
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const go = (key: string) => {
      setRoute(key); setMenu(false); window.scrollTo(0, 0)
      const m = meta(key); document.title = m.title
      document.querySelector('meta[name=description]')?.setAttribute('content', m.description)
    }
    if (HASH) { const f = () => go(currentKey()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }
    const raw = location.hash.slice(1), old = OLD[raw] ?? raw
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
  const active = route.startsWith('arthro-') ? 'blog' : route.startsWith('stigmi-') ? 'stigmes' : ['xartis', 'syntaxi', ...DECK_KEYS].includes(route) ? 'ergaleia' : route
  const page = route === 'stigmes' ? <Moments /> : route.startsWith('stigmi-') ? <MomentPage key={route} id={route.slice(7)} />
    : route === 'ergaleia' ? <ToolsPage /> : route === 'xartis' ? <CoverMap /> : route === 'syntaxi' ? <Pension /> : DECK_KEYS.includes(route as DeckKey) ? <DeckPage k={route as DeckKey} />
    : route === 'blog' ? <><span className="tag">Άρθρα</span><h1>Ασφάλεια, <em>με απλά λόγια</em></h1><p className="lead">Μικρές εξηγήσεις για όσα αξίζει να ξέρεις πριν υπογράψεις.</p><Posts /></>
    : route.startsWith('arthro-') ? <Article id={route.slice(7)} />
    : route === 'epikoinonia' ? <><span className="tag">Επαφή</span><h1>Ας μιλήσουμε</h1><p className="lead">Ένα τηλεφώνημα, ένας καφές στην Έδεσσα ή μια βιντεοκλήση. Όπως σε βολεύει.</p><Callback /></>
    : route === 'aporrito' ? <Privacy /> : <Home />
  return <>
    <div className="draft">Προεπισκόπηση · εκκρεμεί έγκριση πριν δημοσιευτεί</div>
    <header className={menu ? 'open' : undefined}><div className="pill">
      <a className="brand" href={href('arxiki')}><img className="mark" src={mark} alt="" /><span><b>Κόλτσης Χρήστος</b><small>Insurance &amp; Financial Advisor</small></span></a>
      <nav id="menu" aria-label="Κύριο μενού">{NAV.map(([k, l]) => <a key={k} href={href(k)} aria-current={active === k ? 'page' : undefined} onClick={() => setMenu(false)}>{l}</a>)}</nav>
      <a className="btn book" href={href('epikoinonia')}>Σε παίρνω εγώ</a>
      <button className="burger" aria-expanded={menu} aria-controls="menu" aria-label={menu ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'} onClick={() => setMenu(m => !m)}><i /><i /><i /></button>
    </div></header>
    <main className="wrap">{page}</main>
    <footer><div className="wrap"><img className="flogo" src={logo} alt="Κόλτσης Χρήστος · Insurance & Financial Advisor" /><span>Ασφαλιστικός &amp; Χρηματοοικονομικός Σύμβουλος · NN Hellas</span><span>{PHONE} · {MAIL}</span><span>Έδεσσα · Βόρεια Ελλάδα</span><span><a href={QUIZ} target="_blank" rel="noreferrer">Ερωτηματολόγιο αναγκών</a> · <a href={href('arxiki') + '#sxetika'}>Σχετικά</a> · <a href={href('aporrito')}>Πολιτική απορρήτου</a></span></div></footer>
  </>
}
