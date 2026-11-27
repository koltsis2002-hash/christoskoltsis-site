import { useMemo, useState } from 'react'
import { Bars3D } from './Fx'

const eur = (n: number) => (isFinite(n) ? Math.round(n) : 0).toLocaleString('el-GR') + ' €'

function Num({ label, hint, value, set, min, max, step = 1, suffix }: { label: string; hint?: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; suffix: string }) {
  return <label className="num-in">
    <span className="lbl"><span>{label}</span><b>{value.toLocaleString('el-GR')} {suffix}</b></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)} />
    {hint && <small>{hint}</small>}
  </label>
}

export function Pension() {
  const [age, setAge] = useState(35), [inc, setInc] = useState(1500), [ret, setRet] = useState(67), [want, setWant] = useState(1200)
  const [pct, setPct] = useState(50), [r, setR] = useState(4), [infl, setInfl] = useState(2), [rr, setRr] = useState(3), [end, setEnd] = useState(85)
  const res = useMemo(() => {
    const gap = Math.max(0, want - inc * pct / 100)
    const real = (x: number) => (1 + x / 100) / (1 + infl / 100) - 1
    const ra = real(r) / 12, rd = real(rr) / 12
    const nRet = Math.max(1, (end - ret) * 12), nAcc = Math.max(1, (ret - age) * 12)
    const capital = rd === 0 ? gap * nRet : gap * (1 - Math.pow(1 + rd, -nRet)) / rd
    const monthly = ra === 0 ? capital / nAcc : capital * ra / (Math.pow(1 + ra, nAcc) - 1)
    return { gap, capital, monthly, state: inc * pct / 100, years: ret - age }
  }, [age, inc, ret, want, pct, r, infl, rr, end])
  return <>
    <span className="tag">Υπολογιστής σύνταξης</span>
    <h1>Το κενό της σύνταξης, <em>σε ένα λεπτό</em></h1>
    <p className="lead">Κούνησε τις μπάρες και δες ζωντανά πόσο απέχει η κρατική σύνταξη από τη ζωή που θέλεις, και τι μηνιαίο ποσό κλείνει τη διαφορά.</p>
    <div className="calc">
      <div className="card">
        <h2>Τα στοιχεία σου</h2>
        <Num label="Ηλικία σήμερα" value={age} set={v => { setAge(v); if (ret <= v) setRet(v + 1) }} min={18} max={64} suffix="ετών" />
        <Num label="Καθαρό μηνιαίο εισόδημα" value={inc} set={setInc} min={500} max={6000} step={50} suffix="€" />
        <Num label="Ηλικία συνταξιοδότησης" value={ret} set={v => setRet(Math.max(v, age + 1))} min={55} max={70} suffix="ετών" />
        <Num label="Εισόδημα που θέλεις στη σύνταξη" hint="Σε σημερινά χρήματα, δηλαδή με όσα αγοράζεις σήμερα." value={want} set={setWant} min={300} max={5000} step={50} suffix="€/μήνα" />
        <details className="assume"><summary>Παραδοχές (μπορείς να τις αλλάξεις)</summary>
          <Num label="Κρατική σύνταξη ως % του εισοδήματος" hint="Χονδρική εκτίμηση. Η πραγματική σύνταξη εξαρτάται από τα ένσημα και τον κανονισμό σου." value={pct} set={setPct} min={20} max={90} suffix="%" />
          <Num label="Ετήσια απόδοση αποταμίευσης" hint="Το ετήσιο κέρδος που υποθέτουμε για τα χρήματα που βάζεις στην άκρη. Δεν είναι εγγυημένο." value={r} set={setR} min={0} max={8} step={0.5} suffix="%" />
          <Num label="Πληθωρισμός" hint="Πόσο ανεβαίνουν οι τιμές κάθε χρόνο." value={infl} set={setInfl} min={0} max={5} step={0.5} suffix="%" />
          <Num label="Απόδοση κατά τη σύνταξη" value={rr} set={setRr} min={0} max={6} step={0.5} suffix="%" />
          <Num label="Το κεφάλαιο φτάνει μέχρι την ηλικία" value={end} set={v => setEnd(Math.max(v, ret + 1))} min={75} max={100} suffix="ετών" />
        </details>
      </div>
      <div className="card result" aria-live="polite">
        <h2>Το αποτέλεσμά σου</h2>
        <Bars3D state={res.state} gap={res.gap} />
        <div className="big-num"><small>Μηνιαίο κενό</small><b>{eur(res.gap)}</b></div>
        <p>Υποθέτουμε κρατική σύνταξη περίπου {eur(res.state)} τον μήνα, απέναντι στα {eur(want)} που θέλεις.</p>
        {res.gap > 0 ? <>
          <div className="big-num accent"><small>Χρειάζεται να αποταμιεύεις</small><b>{eur(res.monthly)}<span>/μήνα</span></b></div>
          <p>για {res.years} χρόνια, ώστε να έχεις περίπου {eur(res.capital)} στα {ret} σου (σε σημερινά χρήματα).</p>
        </> : <p className="ok">Με αυτές τις παραδοχές δεν φαίνεται κενό. Αξίζει όμως να το ελέγξουμε με τα πραγματικά σου στοιχεία.</p>}
        <a className="btn" href="#rantevou">Βρες μου τρόπο να το κλείσω →</a>
      </div>
    </div>
    <p className="small disclaimer">Ενδεικτικός υπολογισμός, όχι ασφαλιστική ή επενδυτική συμβουλή. Δεν εγγυάται αποδόσεις. Η κρατική σύνταξη απλοποιείται ως ποσοστό του εισοδήματος. Δεν υπολογίζονται φόροι και έξοδα. Τα στοιχεία που γράφεις δεν αποθηκεύονται.</p>
  </>
}

const Q: { area: string; q: string; o: [string, number][] }[] = [
  { area: 'Υγεία', q: 'Αν χρειαστεί να μπεις σε ιδιωτικό νοσοκομείο, ποιος πληρώνει;', o: [['Έχω ιδιωτικό πρόγραμμα υγείας', 10], ['Ομαδικό από τη δουλειά', 6], ['Μόνο ΕΟΠΥΥ ή από την τσέπη μου', 0]] },
  { area: 'Υγεία', q: 'Ξέρεις τι καλύπτει το πρόγραμμα υγείας σου και με τι απαλλαγή;', o: [['Ναι, ξέρω ακριβώς', 10], ['Περίπου', 5], ['Όχι ή δεν έχω πρόγραμμα', 0]] },
  { area: 'Εισόδημα', q: 'Αν δεν μπορούσες να δουλέψεις για 6 μήνες, πώς θα ζούσες;', o: [['Έχω κάλυψη ανικανότητας', 10], ['Από αποταμιεύσεις', 5], ['Δεν ξέρω', 0]] },
  { area: 'Εισόδημα', q: 'Πόσους μήνες εξόδων καλύπτουν οι αποταμιεύσεις σου;', o: [['Πάνω από 6', 10], ['3 έως 6', 6], ['Λιγότερο από 3', 0]] },
  { area: 'Οικογένεια', q: 'Αν συνέβαινε κάτι σε σένα, οι δικοί σου θα είχαν οικονομικό στήριγμα;', o: [['Ναι, έχω ασφάλεια ζωής', 10], ['Λίγο, από τη δουλειά', 4], ['Όχι', 0]] },
  { area: 'Οικογένεια', q: 'Έχεις δάνεια που θα έμεναν στους δικούς σου;', o: [['Όχι ή είναι καλυμμένα', 10], ['Ναι, μερικώς καλυμμένα', 5], ['Ναι, ακάλυπτα', 0]] },
  { area: 'Σύνταξη', q: 'Ξέρεις περίπου τι σύνταξη θα πάρεις;', o: [['Ναι', 10], ['Έχω μια ιδέα', 5], ['Όχι', 0]] },
  { area: 'Σύνταξη', q: 'Αποταμιεύεις τακτικά για τη σύνταξή σου;', o: [['Ναι, κάθε μήνα', 10], ['Πότε πότε', 5], ['Όχι', 0]] },
  { area: 'Σπίτι', q: 'Το σπίτι σου είναι ασφαλισμένο για σεισμό και φωτιά;', o: [['Ναι, με σωστά ποσά', 10], ['Ναι, αλλά δεν ξέρω τα ποσά', 5], ['Όχι', 0]] },
  { area: 'Σπίτι', q: 'Καλύπτεσαι αν προκαλέσεις ζημιά σε γείτονα, π.χ. από διαρροή νερού;', o: [['Ναι', 10], ['Δεν ξέρω', 3], ['Όχι', 0]] },
]
const TIPS: Record<string, string> = {
  'Υγεία': 'Ένα πρόγραμμα υγείας σε προστατεύει από μεγάλους λογαριασμούς νοσοκομείου.',
  'Εισόδημα': 'Μια κάλυψη ανικανότητας κρατά το εισόδημά σου αν δεν μπορείς να δουλέψεις.',
  'Οικογένεια': 'Μια ασφάλεια ζωής δίνει στους δικούς σου χρόνο και σιγουριά.',
  'Σύνταξη': 'Μικρά ποσά από νωρίς κάνουν μεγάλη διαφορά στη σύνταξη.',
  'Σπίτι': 'Η σωστή ασφάλεια σπιτιού προστατεύει ό,τι έχεις χτίσει.',
}
export function Checkup() {
  const [a, setA] = useState<number[]>([])
  const i = a.length, done = i === Q.length
  const score = a.reduce((s, x) => s + x, 0)
  const byArea = Object.keys(TIPS).map(k => ({ k, v: Q.reduce((s, q, j) => q.area === k ? s + (a[j] ?? 0) : s, 0) })).sort((x, y) => x.v - y.v).slice(0, 3)
  return <>
    <span className="tag">Check-up προστασίας</span>
    <h1>Πού είσαι <em>ακάλυπτος</em>;</h1>
    <p className="lead">Απάντησε τίμια σε 10 ερωτήσεις. Στο τέλος βλέπεις ένα σκορ στα 100 και από πού να ξεκινήσεις.</p>
    <div className="card quiz">
      {!done ? <>
        <div className="prog"><span style={{ width: (i / Q.length * 100) + '%' }} /></div>
        <small className="small">Ερώτηση {i + 1} από {Q.length} · {Q[i].area}</small>
        <h2>{Q[i].q}</h2>
        <div className="opts">{Q[i].o.map(([t, v]) => <button key={t} onClick={() => setA([...a, v])}>{t}</button>)}</div>
        {i > 0 && <button className="linkbtn" onClick={() => setA(a.slice(0, -1))}>← Πίσω</button>}
      </> : <>
        <div className="big-num accent"><small>Το σκορ προστασίας σου</small><b>{score}<span>/100</span></b></div>
        <p>{score >= 75 ? 'Είσαι σε καλό δρόμο! Ας δούμε τις λεπτομέρειες.' : score >= 45 ? 'Έχεις βάσεις, αλλά υπάρχουν κενά που αξίζει να κλείσεις.' : 'Υπάρχουν σημαντικά κενά. Η καλή είδηση: διορθώνονται βήμα βήμα.'}</p>
        <h3>Ξεκίνα από εδώ</h3>
        <ol className="gaps">{byArea.map(x => <li key={x.k}><b>{x.k}</b> ({x.v}/20): {TIPS[x.k]}</li>)}</ol>
        <div className="actions"><a className="btn" href="#rantevou">Θέλω να τα δούμε μαζί</a><button className="btn ghost" onClick={() => setA([])}>Ξανά από την αρχή</button></div>
      </>}
    </div>
    <p className="small disclaimer">Εργαλείο αυτοαξιολόγησης, όχι ασφαλιστική πρόταση. Οι απαντήσεις σου δεν αποθηκεύονται.</p>
  </>
}

export function ToolsPage() {
  return <>
    <h1>Εργαλεία</h1><p className="lead">Μικρά, δωρεάν εργαλεία για να δεις πού βρίσκεσαι. Χωρίς εγγραφή.</p>
    <div className="grid">
      <a className="card" href="#checkup"><span className="tag">2 λεπτά</span><h3>Τεστ κάλυψης</h3><p>10 ερωτήσεις, σκορ στα 100 και από πού να ξεκινήσεις.</p><span className="more">Ξεκίνα →</span></a>
      <a className="card" href="#syntaxi"><span className="tag">1 λεπτό</span><h3>Υπολογιστής σύνταξης</h3><p>Πόσα θα σου λείπουν κάθε μήνα και πόσα να αποταμιεύεις.</p><span className="more">Υπολόγισε →</span></a>
      <a className="card" href="https://koltsis2002-hash.github.io/--questionnaire/" target="_blank" rel="noreferrer"><span className="tag">5 βήματα</span><h3>Ερωτηματολόγιο αναγκών</h3><p>Οι ανάγκες σου και το κόστος για να τις καλύψεις.</p><span className="more">Άνοιξε →</span></a>
      <a className="card" href="#konta"><span className="tag">Βόρεια Ελλάδα</span><h3>Υγεία κοντά σου</h3><p>Γιατί μετράει πού βρίσκεται το νοσοκομείο του προγράμματός σου.</p><span className="more">Μάθε περισσότερα →</span></a>
    </div>
  </>
}

export function Funds() {
  const mra = [[1,'Πολύ χαμηλός'],[2,'Χαμηλός'],[3,'Χαμηλός-μέτριος'],[4,'Μέτριος'],[5,'Μέτριος-υψηλός'],[6,'Υψηλός'],[7,'Πολύ υψηλός']]
  return <>
    <span className="tag">Επενδύσεις</span>
    <h1>Επένδυση με <em>δίχτυ ασφαλείας</em></h1>
    <p className="lead">Τα επενδυτικά ασφαλιστικά προγράμματα συνδυάζουν επένδυση με ασφάλιση ζωής. Τα χρήματά σου μπαίνουν σε κεφάλαια, δηλαδή «καλάθια» με μετοχές, ομόλογα και διαθέσιμα, και ταυτόχρονα έχεις κάλυψη για τους δικούς σου.</p>
    <div className="grid">
      {[['Βήμα βήμα','Βάζεις ένα ποσό τακτικά και χτίζεις κεφάλαιο, με προστασία για τους δικούς σου.'],
        ['Μία φορά','Επενδύεις ένα ποσό εφάπαξ και μπορείς να προσθέτεις όποτε θέλεις.'],
        ['Εσύ διαλέγεις τον κίνδυνο','Επιλέγεις στρατηγική ανάλογα με το πόσα σκαμπανεβάσματα αντέχεις και πόσα χρόνια έχεις μπροστά σου.']].map(([t,d]) => <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>)}
    </div>
    <h2 className="section">Ο δείκτης κινδύνου, απλά</h2>
    <p className="lead">Κάθε κεφάλαιο έχει βαθμό κινδύνου από 1 έως 7. Όσο ψηλότερα, τόσο μεγαλύτερα τα πιθανά σκαμπανεβάσματα, αλλά και η πιθανή απόδοση μακροπρόθεσμα.</p>
    <div className="risk">{mra.map(([n,t]) => <div key={n} style={{ ['--k' as string]: (n as number) / 7 }}><i /><b>{n}</b><small>{t}</small></div>)}</div>
    <div className="card cta">
      <h2>Θες να δεις τα κεφάλαια;</h2>
      <p>Τις αποδόσεις και τη σύνθεση των κεφαλαίων τις βλέπουμε μαζί, με τα επίσημα ενημερωτικά στο χέρι.</p>
      <div className="actions"><a className="btn" href="#rantevou">Συζήτησέ το μαζί μου</a></div>
    </div>
    <p className="small disclaimer">Οι προηγούμενες αποδόσεις δεν εγγυώνται μελλοντικές. Η αξία μιας επένδυσης μπορεί να ανέβει ή να πέσει και μπορεί να πάρεις πίσω λιγότερα από όσα έβαλες. Διάβασε το Έγγραφο Βασικών Πληροφοριών (KID) κάθε προϊόντος πριν αποφασίσεις.</p>
  </>
}

export function Near() {
  return <>
    <span className="tag">Υγεία</span>
    <h1>Υγεία <em>κοντά σου</em></h1>
    <p className="lead">Όταν διαλέγεις πρόγραμμα υγείας, δεν μετράει μόνο τι καλύπτει. Μετράει και πού. Ένα συνεργαζόμενο νοσοκομείο κοντά σου κάνει τη διαφορά τη στιγμή που το χρειάζεσαι.</p>
    <div className="grid">{[
      ['Λιγότερη ταλαιπωρία', 'Σε συνεργαζόμενο νοσοκομείο συνήθως δεν πληρώνεις μπροστά ολόκληρο τον λογαριασμό.'],
      ['Βοήθεια στα επείγοντα', 'Πολλά νοσοκομεία δίνουν επιπλέον προνόμια στους ασφαλισμένους, π.χ. επισκέψεις ή εξετάσεις στα Επείγοντα.'],
      ['Υποστήριξη όλο το 24ωρο', 'Ιατρικές συμβουλές, βοήθεια να βρεις γιατρό και συντονισμός μεταφοράς, όταν το χρειαστείς.'],
      ['Κοντά στη Βόρεια Ελλάδα', 'Βλέπουμε μαζί ποιες επιλογές υπάρχουν κοντά σε σένα και στην οικογένειά σου.']].map(([t, d]) =>
      <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
    <div className="card cta"><h2>Θες να δεις τι ισχύει κοντά σου;</h2><p>Πες μου πού μένεις και σου δείχνω τις επιλογές.</p><div className="actions"><a className="btn" href="#epikoinonia">Ρώτησέ με</a></div></div>
    <p className="small disclaimer">Γενική ενημέρωση. Τα νοσοκομεία και τα προνόμια εξαρτώνται από το πρόγραμμα και μπορεί να αλλάξουν.</p>
  </>
}
