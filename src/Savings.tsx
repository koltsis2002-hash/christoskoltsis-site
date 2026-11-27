import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { href } from './routes'

// NN Hellas regular-premium savings scenarios, ported from JARVIS (INV.acc / project()).
// Christos chose to show these on the site; they need NN Hellas approval before launch.
const RATES = [2.6, 6.4, 10.1]
const FEE = 25
const PA_LOAD = 1.1575
const PA: [number, number][] = [[600, 42.5], [1000, 65], [1500, 95], [2000, 125]]
const ESC = [2, 3, 5]

type Point = { paid: number; value: number }
function project(monthly: number, esc: number, years: number, rate: number): Point[] {
  const annual = monthly * 12
  const pa = PA.reduce((p, [min, prem]) => (annual >= min ? prem : p), 0)
  const g = Math.pow(1 + rate / 100, 1 / 12) - 1
  let value = 0, prem = annual, paid = 0
  const out: Point[] = []
  for (let y = 1; y <= years; y++) {
    const charge = y <= 10 ? 0.025 : 0.015
    for (let m = 0; m < 12; m++) {
      value += prem / 12
      const ded = value * charge / 12 + FEE / 12 + pa * PA_LOAD / 12
      value = Math.max(value * (1 + g) - ded, 0)
    }
    paid += prem
    out.push({ paid, value })
    prem *= 1 + esc / 100
  }
  return out
}

const eur = (n: number) => Math.round(n).toLocaleString('el-GR') + ' €'
const pct = (n: number) => n.toLocaleString('el-GR', { minimumFractionDigits: 1 }) + '%'

function Chart({ runs, paid }: { runs: Point[][]; paid: number[] }) {
  const W = 600, H = 280, L = 8, B = 26, T = 12
  const n = paid.length
  const max = Math.max(...runs[2].map(p => p.value), ...paid) * 1.05
  const x = (i: number) => L + (W - L * 2) * (n === 1 ? 1 : i / (n - 1))
  const y = (v: number) => T + (H - T - B) * (1 - v / max)
  const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const lo = runs[0].map(p => p.value), hi = runs[2].map(p => p.value)
  const band = line(hi) + hi.map((_, i) => `L${x(n - 1 - i).toFixed(1)},${y(lo[n - 1 - i]).toFixed(1)}`).join('') + 'Z'
  const ticks = [0, Math.floor((n - 1) / 2), n - 1]
  return <svg className="sav-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Γράφημα: καταβολές και τα τρία σενάρια της αξίας με τα χρόνια">
    <path d={band} className="sc-band" />
    <path d={line(paid)} className="sc-paid" />
    <path d={line(lo)} className="sc-lo" />
    <path d={line(hi)} className="sc-hi" />
    <path d={line(runs[1].map(p => p.value))} className="sc-mid" />
    <line x1={L} x2={W - L} y1={H - B} y2={H - B} className="sc-axis" />
    {ticks.map(i => <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>{i + 1}ο έτος</text>)}
  </svg>
}

function Calculator() {
  const [monthly, setMonthly] = useState(100)
  const [years, setYears] = useState(25)
  const [esc, setEsc] = useState(3)
  const runs = useMemo(() => RATES.map(r => project(monthly, esc, years, r)), [monthly, esc, years])
  const paid = runs[1].map(p => p.paid)
  const last = (k: number) => runs[k][years - 1].value
  return <div className="sav-calc">
    <div className="sav-ctl">
      <label className="num-in"><span className="lbl"><span>Κάθε μήνα</span><b>{eur(monthly)}</b></span>
        <input type="range" min={50} max={500} step={10} value={monthly} onChange={e => setMonthly(+e.target.value)} /></label>
      <label className="num-in"><span className="lbl"><span>Για πόσα χρόνια</span><b>{years}</b></span>
        <input type="range" min={10} max={40} value={years} onChange={e => setYears(+e.target.value)} /></label>
      <div className="sav-esc"><span>Αύξηση του ποσού κάθε χρόνο</span>
        <div className="seg3">{ESC.map(e => <button key={e} type="button" aria-pressed={esc === e} onClick={() => setEsc(e)}>{pct(e)}</button>)}</div></div>
    </div>
    <div className="pills3">
      <div><small>Θα έχεις βάλει</small><b>{eur(paid[years - 1])}</b><span>σε {years} χρόνια</span></div>
      <div className="hot"><small>Μεσαίο σενάριο</small><b>{eur(last(1))}</b><span>με {pct(RATES[1])} τον χρόνο</span></div>
      <div><small>Εύρος</small><b>{eur(last(0))} – {eur(last(2))}</b><span>{pct(RATES[0])} έως {pct(RATES[2])}</span></div>
    </div>
    <Chart runs={runs} paid={paid} />
    <p className="sav-leg"><span><i className="lm" />Μεσαίο σενάριο</span><span><i className="lb" />Από το χαμηλό ως το υψηλό σενάριο</span><span><i className="lp" />Όσα βάζεις</span></p>
    <p className="small">Υπολογισμός με τα τρία σενάρια απόδοσης της NN Hellas για πρόγραμμα με τακτικές καταβολές ({pct(RATES[0])}, {pct(RATES[1])} και {pct(RATES[2])} τον χρόνο), αφού αφαιρεθούν οι χρεώσεις του προγράμματος. Οι αποδόσεις δεν είναι εγγυημένες: η αξία μπορεί να είναι μικρότερη ή μεγαλύτερη. Ισχύουν πάντα οι επίσημοι όροι του προγράμματος.</p>
  </div>
}

const SLIDES: { tag: string; title: string; body: ReactNode }[] = [
  { tag: 'Αποταμίευση', title: 'Ένα δικό σου κεφάλαιο, με τον δικό σου ρυθμό',
    body: <><p className="sav-lead">Ένα σταθερό ποσό κάθε μήνα, για πολλά χρόνια, γίνεται κεφάλαιο για το μέλλον.</p>
      <p>Σε έξι σύντομες διαφάνειες βλέπεις πώς δουλεύει, τι μπορεί να γίνει με τα χρόνια και τι να ξέρεις πριν ξεκινήσεις.</p></> },
  { tag: 'Για ποιο σκοπό', title: 'Για σένα ή για τα παιδιά σου',
    body: <div className="sav-cards">
      <div className="card"><span className="tag">Σύνταξη</span><h3>Κεφάλαιο για τη σύνταξη</h3><p>Για να μη χρειάζεται να στηριχτείς μόνο στη σύνταξη του ταμείου.</p><p className="sav-ex">Ένα σταθερό ποσό κάθε μήνα γίνεται κεφάλαιο για τη μέρα που θα σταματήσεις να εργάζεσαι.</p></div>
      <div className="card"><span className="tag">Παιδιά</span><h3>Κεφάλαιο για τα παιδιά</h3><p>Για τις σπουδές ή το πρώτο τους βήμα στη ζωή.</p><p className="sav-ex">Όταν το παιδί τελειώσει το σχολείο, τα χρήματα για τις σπουδές υπάρχουν ήδη.</p></div>
    </div> },
  { tag: 'Πώς δουλεύει', title: 'Τρία απλά βήματα',
    body: <><ol className="sav-steps">
      <li><b>Βάζεις ένα σταθερό ποσό κάθε μήνα.</b> Αν θέλεις, το ανεβάζεις λίγο κάθε χρόνο, όπως ανεβαίνει και ο μισθός σου.</li>
      <li><b>Τα χρήματα επενδύονται σε κεφάλαια.</b> Διαλέγεις πόσο ρίσκο αντέχεις.</li>
      <li><b>Με τα χρόνια, το κεφάλαιο μεγαλώνει.</b> Στο μεταξύ έχεις και ασφαλιστική κάλυψη για τους δικούς σου.</li></ol>
      <div className="note"><b>Τι είναι ένα κεφάλαιο;</b> Ένα «καλάθι» με μετοχές, ομόλογα και διαθέσιμα, που το διαχειρίζονται επαγγελματίες. Έτσι τα χρήματά σου δεν κρέμονται από μία μόνο επένδυση.</div></> },
  { tag: 'Η δύναμη του χρόνου', title: 'Δες πώς μπορεί να μεγαλώσει',
    body: <Calculator /> },
  { tag: 'Πριν ξεκινήσεις', title: 'Τι να ξέρεις',
    body: <ul className="sav-know">
      <li><b>Η αξία ανεβαίνει και πέφτει.</b> Καμία απόδοση δεν είναι εγγυημένη.</li>
      <li><b>Ταιριάζει σε στόχους για πολλά χρόνια.</b> Όσο περισσότερος ο χρόνος, τόσο πιο ήρεμα περνούν τα σκαμπανεβάσματα.</li>
      <li><b>Αν σταματήσεις ή τα πάρεις νωρίς,</b> μπορεί να πάρεις λιγότερα από όσα έβαλες, ειδικά τα πρώτα χρόνια.</li>
      <li><b>Υπάρχουν χρεώσεις.</b> Τις βλέπουμε μαζί στα επίσημα έγγραφα, πριν αποφασίσεις.</li></ul> },
  { tag: 'Επόμενο βήμα', title: 'Ας το δούμε για τη δική σου περίπτωση',
    body: <><p className="sav-lead">Πόσο να βάζεις, για πόσα χρόνια και με πόσο ρίσκο. Τα βρίσκουμε μαζί, με τους δικούς σου στόχους.</p>
      <div className="actions"><a className="btn" href={href('epikoinonia')}>Θέλω να με καλέσεις</a><a className="btn ghost" href={href('syntaxi')}>Πόσο να βάζω για τη σύνταξη;</a></div></> },
]

export function SavingsDeck() {
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)
  const root = useRef<HTMLElement>(null)
  const go = (n: number) => setI(Math.max(0, Math.min(SLIDES.length - 1, n)))
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, button, a')) return
      if (e.key === 'ArrowRight') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [i])
  const prev = useRef(i)
  useEffect(() => {
    if (prev.current !== i) root.current?.querySelector<HTMLElement>('.sav-slide.on h2')?.focus({ preventScroll: true })
    prev.current = i
  }, [i])
  return <section className="card sav-deck" ref={root} aria-roledescription="παρουσίαση" aria-label="Πώς δουλεύει η αποταμίευση"
    onTouchStart={e => { touch.current = e.touches[0].clientX }}
    onTouchEnd={e => {
      if (touch.current == null || (e.target as HTMLElement).closest('input')) return
      const dx = e.changedTouches[0].clientX - touch.current; touch.current = null
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
    }}>
    <div className="dots" aria-hidden="true">{SLIDES.map((_, j) => <span key={j} className={j < i ? 'on' : j === i ? 'cur' : ''} />)}</div>
    {SLIDES.map((s, j) => <div key={s.title} className={'sav-slide' + (j === i ? ' on' : '')} hidden={j !== i} aria-roledescription="διαφάνεια" aria-label={`${j + 1} από ${SLIDES.length}`}>
      <span className="tag">{s.tag}</span><h2 tabIndex={-1}>{s.title}</h2>{s.body}
    </div>)}
    <div className="sav-nav">
      <button className="btn ghost" type="button" onClick={() => go(i - 1)} disabled={i === 0}>← Πίσω</button>
      <span className="small">{i + 1} / {SLIDES.length}</span>
      <button className="btn" type="button" onClick={() => go(i + 1)} disabled={i === SLIDES.length - 1}>Επόμενο →</button>
    </div>
  </section>
}

export function SavingsPage() {
  return <>
    <span className="tag">Παρουσίαση</span>
    <h1>Πώς δουλεύει <em>η αποταμίευση</em></h1>
    <p className="lead">Με απλά λόγια, σε έξι διαφάνειες. Πέρασέ τες με τα κουμπιά ή σύρε με το δάχτυλο.</p>
    <SavingsDeck />
  </>
}
