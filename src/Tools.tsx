import { useMemo, useState } from 'react'
import { href } from './routes'
import { TopicCard, type DeckKey } from './Decks'

const eur = (n: number) => (isFinite(n) ? Math.round(n) : 0).toLocaleString('el-GR') + ' €'

/* ---------- Σύνταξη, σε 3 βήματα ---------- */
// The visitor gives both pension figures; the site never assumes what the state will pay
export function Pension() {
  const [step, setStep] = useState(0)
  const [age, setAge] = useState(35), [state, setState] = useState(''), [want, setWant] = useState('')
  const RET = 67, R = 0.04, INF = 0.02, RR = 0.03, END = 85
  const st = Number(state) || 0, wa = Number(want) || 0
  const res = useMemo(() => {
    const gap = Math.max(0, wa - st)
    const real = (x: number) => (1 + x) / (1 + INF) - 1
    const ra = real(R) / 12, rd = real(RR) / 12, nRet = (END - RET) * 12, nAcc = Math.max(1, (RET - age) * 12)
    const capital = gap * (1 - Math.pow(1 + rd, -nRet)) / rd
    return { gap, monthly: capital * ra / (Math.pow(1 + ra, nAcc) - 1) }
  }, [age, st, wa])
  const money = (v: string, set: (s: string) => void, id: string) => <label className="money-in" htmlFor={id}>
    <input id={id} inputMode="numeric" placeholder="Γράψε ποσό" value={v} onChange={e => set(e.target.value.replace(/\D/g, '').slice(0, 5))} /><span>€ τον μήνα</span></label>
  const steps = [
    { q: 'Πόσο χρονών είσαι;', ok: true, node: <><div className="bigval">{age}<small>ετών</small></div><div className="num-in"><input type="range" aria-label="Ηλικία" min={20} max={62} value={age} onChange={e => setAge(+e.target.value)} /></div></> },
    { q: 'Πόση σύνταξη υπολογίζεις να παίρνεις από το κράτος;', hint: 'Γράψε το ποσό που περιμένεις εσύ. Αν δεν ξέρεις, βάλε μια δική σου εκτίμηση ή 0.', ok: state !== '', node: money(state, setState, 'pen-state') },
    { q: 'Πόση σύνταξη θα ήθελες να παίρνεις;', hint: 'Το ποσό με το οποίο θα ζούσες άνετα, σε σημερινά χρήματα.', ok: want !== '', node: money(want, setWant, 'pen-want') },
  ]
  const done = step >= steps.length
  return <>
    <span className="tag">Εργαλείο · Σύνταξη</span>
    <h1>Τρεις ερωτήσεις για <em>το αύριο</em></h1>
    <p className="lead">Απάντησε σε τρία πράγματα και δες πόσο πρέπει να βάζεις στην άκρη κάθε μήνα, για να ζεις στη σύνταξη όπως θέλεις.</p>
    <div className="card stepper">
      <div className="dots">{steps.map((_, j) => <span key={j} className={j < step ? 'on' : j === step ? 'cur' : ''} />)}<span className={done ? 'cur' : ''} /></div>
      {!done ? <>
        <h2>{steps[step].q}</h2>
        {steps[step].hint && <p className="small">{steps[step].hint}</p>}
        {steps[step].node}
        <div className="actions">{step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>← Πίσω</button>}<button className="btn" disabled={!steps[step].ok} onClick={() => setStep(step + 1)}>Επόμενο →</button></div>
      </> : <>
        <h2>Το αποτέλεσμά σου</h2>
        <div className="pills3">
          <div><small>Θέλεις</small><b>{eur(wa)}</b><span>/μήνα</span></div>
          <div><small>Από το κράτος (όπως το υπολογίζεις)</small><b>{eur(st)}</b><span>/μήνα</span></div>
          <div className="hot"><small>Βάλε στην άκρη</small><b>{eur(res.monthly)}</b><span>/μήνα</span></div>
        </div>
        {res.gap > 0
          ? <p>Τόσο χρειάζεται κάθε μήνα από σήμερα μέχρι τα 67 σου, για να καλύψεις τα <b>{eur(res.gap)}</b> τον μήνα που λείπουν.</p>
          : <p>Με όσα υπολογίζεις, η σύνταξη που θέλεις καλύπτεται. Αξίζει πάντως να το ξαναδούμε μαζί κάθε λίγα χρόνια.</p>}
        <div className="actions"><a className="btn" href={href('epikoinonia')}>Ας το σχεδιάσουμε μαζί</a><button className="btn ghost" onClick={() => setStep(0)}>Από την αρχή</button></div>
      </>}
    </div>
    <p className="small disclaimer">Ενδεικτικός υπολογισμός με απλές παραδοχές: απόδοση 4%, πληθωρισμός 2%, κεφάλαιο που φτάνει ως τα 85. Τα ποσά σύνταξης τα δίνεις εσύ. Ποσά σε σημερινά χρήματα. Δεν είναι επενδυτική συμβουλή και δεν εγγυάται αποδόσεις.</p>
  </>
}

/* ---------- Χάρτης κάλυψης ---------- */
const AREAS = [['Νοσοκομείο', 'Αν χρειαστεί χειρουργείο σε ιδιωτικό νοσοκομείο'], ['Γιατροί & εξετάσεις', 'Για τα καθημερινά: παιδίατρος, αιματολογικές, check-up'],
  ['Εισόδημα', 'Αν δεν μπορείς να δουλέψεις για μήνες'], ['Οικογένεια', 'Αν λείψεις εσύ'], ['Σπίτι', 'Σεισμός, φωτιά, ζημιά σε γείτονα'], ['Σύνταξη', 'Ένα δεύτερο εισόδημα για μετά']]
const LV: [string, number][] = [['Καλυμμένο', 2], ['Δεν ξέρω', 1], ['Ακάλυπτο', 0]]
export function CoverMap() {
  const [a, setA] = useState<Record<string, number>>({})
  const n = Object.keys(a).length, done = n === AREAS.length
  const gaps = AREAS.filter(([k]) => a[k] !== undefined && a[k] < 2).map(([k]) => k)
  return <>
    <span className="tag">Εργαλείο · Χάρτης κάλυψης</span>
    <h1>Ο χάρτης <em>της προστασίας σου</em></h1>
    <p className="lead">Πάτα σε κάθε περιοχή πόσο καλυμμένος νιώθεις. Ο χάρτης χρωματίζεται και βλέπεις αμέσως πού υπάρχουν κενά.</p>
    <div className="map">{AREAS.map(([k, d]) => <div key={k} className={'tile lv' + (a[k] ?? 'x')}>
      <h3>{k}</h3><p>{d}</p>
      <div className="seg3">{LV.map(([l, v]) => <button key={l} aria-pressed={a[k] === v} onClick={() => setA({ ...a, [k]: v })}>{l}</button>)}</div>
    </div>)}</div>
    {done && <div className="card cta"><h2>{gaps.length ? `Έχεις ${gaps.length} ${gaps.length === 1 ? 'σημείο' : 'σημεία'} να δούμε` : 'Μπράβο, φαίνεσαι καλυμμένος!'}</h2>
      <p>{gaps.length ? `Ξεκίνα από: ${gaps.join(', ')}. Ένα σύντομο τηλεφώνημα αρκεί για να δούμε τι σου ταιριάζει.` : 'Αξίζει πάντως μια δεύτερη ματιά στα ποσά και στους όρους που έχεις.'}</p>
      <div className="actions"><a className="btn" href={href('epikoinonia')}>Πάρε με τηλέφωνο</a><button className="btn ghost" onClick={() => setA({})}>Από την αρχή</button></div></div>}
    <p className="small disclaimer">Εργαλείο αυτοαξιολόγησης. Οι απαντήσεις σου δεν αποθηκεύονται πουθενά.</p>
  </>
}

export function ToolsPage() {
  const T: [string, string, string, string][] = [
    [href('xartis'), '1 λεπτό', 'Ο χάρτης της προστασίας σου', 'Έξι περιοχές, ένα πάτημα στην καθεμιά, και βλέπεις τα κενά σου.'],
    [href('syntaxi'), '3 ερωτήσεις', 'Πόσο να βάζω για τη σύνταξη', 'Ένα νούμερο για κάθε μήνα, από σήμερα.'],
    [href('erotimatologio'), '5 λεπτά', 'Τι χρειάζεσαι πραγματικά;', 'Λίγες απλές ερωτήσεις, και βλέπεις ποια ανάγκη σου έρχεται πρώτη.'],
  ]
  return <>
    <span className="tag">Εργαλεία</span>
    <h1>Δοκίμασε <em>μόνος σου</em></h1><p className="lead">Μικρά, δωρεάν εργαλεία, χωρίς εγγραφή. Για να έρθεις στη συζήτηση με καθαρή εικόνα.</p>
    <div className="deck-more">{(['ygeia', 'zoi', 'apotamieusi'] as DeckKey[]).map(k => <TopicCard key={k} k={k} />)}</div>
    <h2 className="section">Εργαλεία</h2>
    <div className="grid">{T.map(([h, tag, t, d]) => <a className="card" key={t} href={h} {...(h.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      <span className="tag">{tag}</span><h3>{t}</h3><p>{d}</p><span className="more">Άνοιξε →</span></a>)}</div>
  </>
}
