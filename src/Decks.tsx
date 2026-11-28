import { type ReactNode, useEffect, useRef, useState } from 'react'
import { href } from './routes'
import { SAVINGS } from './Savings'

export type Slide = { tag: string; title: string; body: ReactNode }
export type DeckKey = 'ygeia' | 'zoi' | 'apotamieusi'

const Next = ({ text }: { text: string }) => <><p className="sav-lead">{text}</p>
  <div className="actions"><a className="btn" href={href('epikoinonia')}>Θέλω να με καλέσεις</a><a className="btn ghost" href={href('xartis')}>Ο χάρτης της προστασίας σου</a></div></>

// Content adapted from Christos's JARVIS presentations: generic, no NN product names or amounts
const HEALTH: Slide[] = [
  { tag: 'Υγεία', title: 'Η υγεία δεν περιμένει',
    body: <><p className="sav-lead">Όταν χρειαστεί νοσοκομείο, μετράει να μπεις γρήγορα και να μην έρθει ένας απρόβλεπτος λογαριασμός.</p>
      <p>Σε λίγες σύντομες διαφάνειες βλέπεις τι καλύπτει μια ασφάλεια υγείας και τι να ρωτήσεις πριν διαλέξεις.</p></> },
  { tag: 'Τι καλύπτει', title: 'Από το χειρουργείο μέχρι το check-up',
    body: <div className="sav-cards">
      <div className="card"><span className="tag">Νοσοκομείο</span><h3>Νοσηλεία & χειρουργείο</h3><p>Για τα μεγάλα έξοδα: δωμάτιο, χειρουργείο, εντατική.</p><p className="sav-ex">Ένα χειρουργείο γίνεται χωρίς αναμονή και γυρνάς νωρίτερα στην καθημερινότητά σου.</p></div>
      <div className="card"><span className="tag">Καθημερινά</span><h3>Γιατροί & εξετάσεις</h3><p>Επισκέψεις σε γιατρούς, εξετάσεις και το ετήσιο check-up.</p><p className="sav-ex">Μια εξέταση νωρίς βοηθά να εντοπίσεις κάτι πριν γίνει πρόβλημα.</p></div>
      <div className="card"><span className="tag">Οικογένεια</span><h3>Όλη η οικογένεια μαζί</h3><p>Κάλυψη και για τον σύντροφό σου και τα παιδιά, σε ένα πλάνο.</p><p className="sav-ex">Μια επέμβαση στο παιδί γίνεται χωρίς αναμονή και χωρίς απρόβλεπτο λογαριασμό.</p></div>
    </div> },
  { tag: 'Δύο τρόποι', title: 'Αποζημίωση ή επίδομα;',
    body: <><div className="sav-cards">
      <div className="card"><span className="tag">Αποζημίωση</span><h3>Πληρώνεται το νοσοκομείο</h3><p>Καλύπτει τα έξοδα της νοσηλείας: δωμάτιο, χειρουργείο, φάρμακα.</p></div>
      <div className="card"><span className="tag">Επίδομα</span><h3>Πληρώνεσαι εσύ</h3><p>Χρήματα στο χέρι για κάθε μέρα νοσηλείας, για να τα χρησιμοποιήσεις όπως θέλεις.</p></div>
    </div><div className="note"><b>Γιατί τα συνδυάζουν πολλοί;</b> Το νοσοκομείο πληρώνεται, και εσύ καλύπτεις το χαμένο μεροκάματο ή τα έξοδα του σπιτιού όσο λείπεις.</div></> },
  { tag: 'Πού', title: 'Μη ρωτάς μόνο «πόσο». Ρώτα και «πού»',
    body: <ul className="sav-know">
      <li><b>Στο συμβεβλημένο νοσοκομείο</b> η ασφαλιστική πληρώνει απευθείας. Δεν βάζεις χρήματα μπροστά.</li>
      <li><b>Σε μη συμβεβλημένο</b> πληρώνεις πρώτα εσύ και μετά παίρνεις πίσω ένα μέρος των εξόδων.</li>
      <li><b>Η απόσταση μετράει.</b> Ένα συμβεβλημένο νοσοκομείο κοντά στο σπίτι σου κάνει τη διαφορά τη στιγμή που το χρειάζεσαι.</li></ul> },
  { tag: 'Πριν διαλέξεις', title: 'Τέσσερις ερωτήσεις που αξίζουν',
    body: <><ul className="sav-know">
      <li><b>Πόση είναι η απαλλαγή;</b> Το ποσό που πληρώνεις εσύ πριν πληρώσει η ασφάλεια. Μεγαλύτερη απαλλαγή σημαίνει χαμηλότερο κόστος.</li>
      <li><b>Υπάρχει περίοδος αναμονής;</b> Κάποιες καλύψεις δεν ξεκινούν από την πρώτη μέρα.</li>
      <li><b>Μέχρι ποια ηλικία ισχύει;</b> Αξίζει να το ξέρεις από την αρχή.</li>
      <li><b>Τι εξαιρείται;</b> Τα βλέπουμε μαζί στους όρους, πριν υπογράψεις.</li></ul>
      <p className="small">Γενική ενημέρωση. Ισχύουν πάντα οι όροι του κάθε προγράμματος.</p></> },
  { tag: 'Επόμενο βήμα', title: 'Ας το δούμε για τη δική σου περίπτωση', body: <Next text="Τι έχεις ήδη, τι σου λείπει και τι ταιριάζει στον προϋπολογισμό σου. Τα βρίσκουμε μαζί." /> },
]

const LIFE: Slide[] = [
  { tag: 'Ζωή', title: 'Αν λείψει το εισόδημα, η ζωή της οικογένειας συνεχίζεται',
    body: <><p className="sav-lead">Οι δόσεις, τα πάγια έξοδα και οι σπουδές των παιδιών δεν σταματούν.</p>
      <p>Σε λίγες σύντομες διαφάνειες βλέπεις τι κάνει μια ασφάλεια ζωής και πώς βρίσκεις πόση χρειάζεσαι.</p></> },
  { tag: 'Τι κάνει', title: 'Ένα ποσό για τους δικούς σου',
    body: <><div className="sav-cards">
      <div className="card"><span className="tag">Ζωή</span><h3>Κεφάλαιο για την οικογένεια</h3><p>Ένα ποσό που παίρνει η οικογένεια, ώστε να κρατήσει το επίπεδο ζωής της.</p><p className="sav-ex">Το δάνειο του σπιτιού εξοφλείται και τα παιδιά συνεχίζουν τις σπουδές τους.</p></div>
      <div className="card"><span className="tag">Ανικανότητα</span><h3>Αν δεν μπορείς να εργαστείς</h3><p>Κεφάλαιο και όταν, μετά από ασθένεια ή ατύχημα, δεν μπορείς πια να δουλέψεις.</p><p className="sav-ex">Μετά από ένα σοβαρό ατύχημα, το κεφάλαιο στηρίζει την οικογένεια.</p></div>
    </div><div className="note"><b>Τι σημαίνει «διαρκής ολική ανικανότητα»;</b> Όταν κάποιος δεν μπορεί πλέον να εργαστεί, λόγω ασθένειας ή ατυχήματος.</div></> },
  { tag: 'Πόσο χρειάζεσαι', title: 'Ένας απλός λογαριασμός',
    body: <><ol className="sav-steps">
      <li><b>Πρόσθεσε τα δάνεια</b> που θα έμεναν, π.χ. του σπιτιού.</li>
      <li><b>Πρόσθεσε τα έξοδα του σπιτιού</b> για μερικά χρόνια, μέχρι να σταθεί η οικογένεια.</li>
      <li><b>Πρόσθεσε τις σπουδές των παιδιών.</b></li>
      <li><b>Αφαίρεσε ό,τι υπάρχει ήδη:</b> αποταμιεύσεις ή άλλες ασφάλειες ζωής.</li></ol>
      <p>Ό,τι μένει είναι το κεφάλαιο που αξίζει να έχεις. Το υπολογίζουμε μαζί, με τα δικά σου νούμερα.</p></> },
  { tag: 'Πότε', title: 'Γιατί συμφέρει από νωρίς',
    body: <ul className="sav-know">
      <li><b>Όσο νεότερος ξεκινάς, τόσο χαμηλότερο το κόστος.</b></li>
      <li><b>Η υγεία σου μετράει όταν ξεκινάς.</b> Αργότερα μπορεί να είναι πιο δύσκολο ή πιο ακριβό.</li>
      <li><b>Κάθε αλλαγή στη ζωή σου</b>, ένα παιδί ή ένα δάνειο, είναι καλή στιγμή να ξαναδούμε το ποσό.</li></ul> },
  { tag: 'Πριν ξεκινήσεις', title: 'Τι να ξέρεις',
    body: <><ul className="sav-know">
      <li><b>Το κεφάλαιο το διαλέγεις εσύ,</b> με βάση τις υποχρεώσεις και τα σχέδιά σου.</li>
      <li><b>Αν έχεις ήδη ασφάλεια ζωής</b>, π.χ. από ένα δάνειο, ελέγχουμε αν φτάνει.</li>
      <li><b>Υπάρχουν όροι και εξαιρέσεις.</b> Τα βλέπουμε μαζί, πριν υπογράψεις.</li></ul>
      <p className="small">Γενική ενημέρωση. Ισχύουν πάντα οι όροι του κάθε προγράμματος.</p></> },
  { tag: 'Επόμενο βήμα', title: 'Ας το δούμε για τη δική σου περίπτωση', body: <Next text="Πόσο κεφάλαιο, για πόσα χρόνια και τι ήδη έχεις. Τα βρίσκουμε μαζί, με τα δικά σου νούμερα." /> },
]

export const DECKS: Record<DeckKey, { word: string; upper: string; label: string; lead: string; slides: Slide[] }> = {
  ygeia: { word: 'Υγεία', upper: 'ΥΓΕΙΑ', label: 'Πώς δουλεύει η ασφάλεια υγείας', lead: 'Τι καλύπτει, πού ισχύει και τι να ρωτήσεις πριν διαλέξεις. Με απλά λόγια.', slides: HEALTH },
  zoi: { word: 'Ζωή', upper: 'ΖΩΗ', label: 'Πώς δουλεύει η ασφάλεια ζωής', lead: 'Τι κάνει για τους δικούς σου και πώς βρίσκεις πόση χρειάζεσαι. Με απλά λόγια.', slides: LIFE },
  apotamieusi: { word: 'Αποταμίευση', upper: 'ΑΠΟΤΑΜΙΕΥΣΗ', label: 'Πώς δουλεύει η αποταμίευση', lead: 'Πώς ένα σταθερό ποσό κάθε μήνα γίνεται κεφάλαιο, και τι μπορεί να γίνει με τα χρόνια.', slides: SAVINGS },
}

// Christos wants these three topics always shown big, bold and in the accent colour
export const Topic = ({ k, sm = false }: { k: DeckKey; sm?: boolean }) => <strong className={'topic' + (sm ? ' sm' : '')}>{DECKS[k].upper}</strong>

export function TopicCard({ k }: { k: DeckKey }) {
  return <a className="card" href={href(k)}><Topic k={k} /><p>{DECKS[k].lead}</p><span className="learn">Μάθε για αυτήν →</span></a>
}

export function Deck({ k, bare = false }: { k: DeckKey; bare?: boolean }) {
  const { slides, label } = DECKS[k]
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)
  const root = useRef<HTMLElement>(null)
  const go = (n: number) => setI(Math.max(0, Math.min(slides.length - 1, n)))
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, button, a')) return
      if (!root.current?.contains(document.activeElement) && document.activeElement !== document.body) return
      if (e.key === 'ArrowRight') setI(x => Math.min(slides.length - 1, x + 1))
      if (e.key === 'ArrowLeft') setI(x => Math.max(0, x - 1))
    }
    addEventListener('keydown', key); return () => removeEventListener('keydown', key)
  }, [slides.length])
  const prev = useRef(i)
  useEffect(() => {
    if (prev.current !== i) {
      root.current?.querySelector<HTMLElement>('.sav-slide.on h2')?.focus({ preventScroll: true })
      if (root.current && root.current.getBoundingClientRect().top < 90) root.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
    prev.current = i
  }, [i])
  return <section className={'sav-deck' + (bare ? ' bare' : ' card')} ref={root} aria-roledescription="παρουσίαση" aria-label={label}
    onTouchStart={e => { touch.current = e.touches[0].clientX }}
    onTouchEnd={e => {
      if (touch.current == null || (e.target as HTMLElement).closest('input, select')) return
      const dx = e.changedTouches[0].clientX - touch.current; touch.current = null
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
    }}>
    <div className="dots" aria-hidden="true">{slides.map((_, j) => <span key={j} className={j < i ? 'on' : j === i ? 'cur' : ''} />)}</div>
    {slides.map((s, j) => <div key={s.title} className={'sav-slide' + (j === i ? ' on' : '')} hidden={j !== i} aria-roledescription="διαφάνεια" aria-label={`${j + 1} από ${slides.length}`}>
      <span className="tag">{s.tag}</span><h2 tabIndex={-1}>{s.title}</h2>{s.body}
    </div>)}
    <div className="sav-nav">
      <button className="btn ghost" type="button" onClick={() => go(i - 1)} disabled={i === 0}>← Πίσω</button>
      <span className="small">{i + 1} / {slides.length}</span>
      <button className="btn" type="button" onClick={() => go(i + 1)} disabled={i === slides.length - 1}>Επόμενο →</button>
    </div>
  </section>
}

export function DeckPage({ k }: { k: DeckKey }) {
  const d = DECKS[k]
  return <>
    <h1><Topic k={k} /><span className="h1-sub">{d.label}</span></h1>
    <p className="lead">{d.lead} Πέρασε τις διαφάνειες με τα κουμπιά ή σύρε με το δάχτυλο.</p>
    <Deck k={k} />
    <div className="deck-more">{(Object.keys(DECKS) as DeckKey[]).filter(x => x !== k).map(x => <TopicCard key={x} k={x} />)}</div>
  </>
}
