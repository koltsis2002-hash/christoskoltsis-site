import { type FormEvent, useEffect, useRef, useState } from 'react'
import { href } from './routes'
import { Topic, type DeckKey } from './Decks'

const LEAD_URL = 'https://rcvdnisyznxhwdfakhfl.supabase.co/functions/v1/site-lead'
const PHONE = '6989118348'

type A = Record<string, string | string[] | number>
type Opt = [string, string]
type Q = {
  id: string; part: string; q: string; hint?: string
  kind: 'one' | 'many' | 'range' | 'kids'
  opts?: Opt[]; min?: number; max?: number; step?: number; unit?: string; def?: number
  show?: (a: A) => boolean
}

const HOSP: Opt[] = [['local_pub', 'Σε ένα κοντινό δημόσιο νοσοκομείο'], ['city_pub', 'Σε ένα μεγάλο δημόσιο νοσοκομείο της πόλης'], ['local_priv', 'Σε μια ιδιωτική κλινική κοντά μου'], ['big_priv', 'Σε ένα μεγάλο ιδιωτικό νοσοκομείο στη Θεσσαλονίκη ή στην Αθήνα']]
const hasFamily = (a: A) => a.marital_status === 'married' || Number(a.children || 0) > 0

// Same questions and stored values as the existing questionnaire, so its scoring and Christos's records stay comparable
const QS: Q[] = [
  { id: 'age', part: 'Εσύ', q: 'Πόσων χρονών είσαι;', kind: 'range', min: 18, max: 70, def: 35, unit: 'χρονών' },
  { id: 'marital_status', part: 'Εσύ', q: 'Ποια είναι η οικογενειακή σου κατάσταση;', kind: 'one', opts: [['single', 'Ελεύθερος/η'], ['married', 'Παντρεμένος/η ή σε συμβίωση'], ['divorced', 'Χωρισμένος/η'], ['widowed', 'Έχω χάσει τον/τη σύντροφό μου'], ['single_parent', 'Μεγαλώνω μόνος/η τα παιδιά μου']] },
  { id: 'spouse_age', part: 'Εσύ', q: 'Πόσων χρονών είναι ο/η σύντροφός σου;', kind: 'range', min: 18, max: 80, def: 35, unit: 'χρονών', show: a => a.marital_status === 'married' },
  { id: 'children', part: 'Εσύ', q: 'Έχεις παιδιά;', kind: 'one', opts: [['0', 'Όχι ακόμα'], ['1', '1 παιδί'], ['2', '2 παιδιά'], ['3', '3 ή περισσότερα']] },
  { id: 'kids_ages', part: 'Εσύ', q: 'Πόσων χρονών είναι τα παιδιά σου;', kind: 'kids', show: a => Number(a.children || 0) > 0 },
  { id: 'occupation', part: 'Εσύ', q: 'Με τι ασχολείσαι;', kind: 'one', opts: [['employee', 'Δουλεύω σε ιδιωτική εταιρεία'], ['civil_servant', 'Δουλεύω στο Δημόσιο'], ['freelancer', 'Έχω δική μου δουλειά ή είμαι ελεύθερος επαγγελματίας'], ['retired', 'Είμαι συνταξιούχος'], ['other', 'Κάτι άλλο']] },

  { id: 'fund_satisfaction', part: 'ygeia', q: 'Πόσο σίγουρος/η νιώθεις σήμερα για τα έξοδα ενός θέματος υγείας;', kind: 'one', opts: [['none', 'Καθόλου, με ανησυχεί αρκετά'], ['little', 'Λίγο, νομίζω ότι υπάρχουν κενά'], ['enough', 'Αρκετά, θα ήθελα μόνο κάποιες βελτιώσεις'], ['fully', 'Πολύ, νιώθω ότι είμαι καλυμμένος/η']] },
  { id: 'hospital_mild', part: 'ygeia', q: 'Για ένα απλό θέμα υγείας, πού θα ένιωθες πιο σίγουρος/η;', kind: 'one', opts: HOSP },
  { id: 'hospital_severe', part: 'ygeia', q: 'Για κάτι σοβαρό, πού θα ήθελες να βρίσκεσαι;', kind: 'one', opts: [...HOSP, ['abroad', 'Σε ένα εξειδικευμένο κέντρο στο εξωτερικό']] },
  { id: 'deductible_type', part: 'ygeia', q: 'Θα ήθελες να πληρώνεις ένα μέρος των εξόδων μόνος/η σου, για να είναι πιο χαμηλή η μηνιαία δόση;', hint: 'Αυτό λέγεται απαλλαγή: ένα ποσό που συμφωνούμε από πριν ότι το πληρώνεις εσύ, και τα υπόλοιπα τα καλύπτει το πρόγραμμα.', kind: 'one', opts: [['none', 'Όχι, θέλω να καλύπτονται όλα από την αρχή'], ['annual', 'Ναι, ένα ποσό μία φορά τον χρόνο'], ['per_incident', 'Ναι, ένα ποσό σε κάθε νοσηλεία, για την πιο χαμηλή δόση']] },
  { id: 'deductible_amount', part: 'ygeia', q: 'Πόσο μεγάλο να είναι αυτό το ποσό;', hint: 'Όσο μεγαλύτερο, τόσο πιο χαμηλή η μηνιαία δόση. Το ακριβές ποσό το βρίσκουμε μαζί.', kind: 'one', opts: [['300', 'Μικρό'], ['1500', 'Μεσαίο'], ['3000', 'Μεγάλο'], ['10000', 'Πολύ μεγάλο']], show: a => a.deductible_type === 'annual' },
  { id: 'deductible_amount', part: 'ygeia', q: 'Πόσο μεγάλο να είναι το ποσό σε κάθε νοσηλεία;', hint: 'Το ακριβές ποσό το βρίσκουμε μαζί.', kind: 'one', opts: [['500', 'Μικρό'], ['1500', 'Μεγαλύτερο']], show: a => a.deductible_type === 'per_incident' },
  { id: 'coverage_scope', part: 'ygeia', q: 'Ποιους θέλεις να καλύψουμε;', kind: 'one', opts: [['self', 'Μόνο εμένα'], ['family', 'Όλη την οικογένεια']], show: hasFamily },
  { id: 'ci_pref', part: 'ygeia', q: 'Αν εμφανιστεί μια σοβαρή ασθένεια, θα ήθελες να πάρεις κι ένα ποσό στο χέρι, για να σταθείς οικονομικά;', kind: 'one', opts: [['em31', 'Ναι, για όσο περισσότερες ασθένειες γίνεται'], ['em7', 'Ναι, για τις πιο βασικές (πιο οικονομικό)'], ['none', 'Όχι, δεν με απασχολεί τώρα']] },
  { id: 'hospital_allowance', part: 'ygeia', q: 'Θα σε βοηθούσε ένα ποσό για κάθε μέρα που μένεις στο νοσοκομείο, για τα μικροέξοδα;', kind: 'one', opts: [['yes', 'Ναι, με ενδιαφέρει'], ['no', 'Όχι, δεν το χρειάζομαι']] },

  { id: 'income_concern', part: 'zoi', q: 'Αν δεν μπορούσες να δουλέψεις για καιρό, ή αν έλειπες, θα δυσκολευόταν το σπίτι οικονομικά;', kind: 'one', opts: [['yes', 'Ναι, εγώ φέρνω το βασικό εισόδημα'], ['no', 'Όχι ιδιαίτερα, θα τα κατάφερναν']] },
  { id: 'uncovered_needs', part: 'zoi', q: 'Τι θα σε ανησυχούσε περισσότερο να μείνει ακάλυπτο;', hint: 'Διάλεξε όσα ισχύουν.', kind: 'many', opts: [['mortgage', 'Το δάνειο του σπιτιού ή το ενοίκιο'], ['education', 'Οι σπουδές των παιδιών'], ['spouse_income', 'Τα έξοδα της καθημερινότητας'], ['debts', 'Άλλες υποχρεώσεις']] },
  { id: 'life_capital', part: 'zoi', q: 'Πόσο δυνατό «δίχτυ» θα ήθελες να έχουν οι δικοί σου;', hint: 'Είναι ένα ποσό που παίρνουν οι δικοί σου αν συμβεί το χειρότερο, για να συνεχίσουν χωρίς οικονομικό άγχος. Το ακριβές ποσό το υπολογίζουμε μαζί.', kind: 'one', opts: [['50k', 'Μια βασική στήριξη'], ['100k', 'Μια ισορροπημένη προστασία'], ['150k', 'Μια δυνατή κάλυψη'], ['200k', 'Όσο πιο πλήρη γίνεται']] },

  { id: 'pension_estimate', part: 'apotamieusi', q: 'Όταν βγεις στη σύνταξη, πώς πιστεύεις ότι θα είσαι οικονομικά;', kind: 'one', opts: [['none', 'Δύσκολα, δεν υπολογίζω σε σύνταξη'], ['small', 'Όχι καλά, δεν θα μου φτάνει'], ['adequate', 'Εντάξει, θα καλύπτω τα βασικά'], ['big', 'Πολύ καλά, θα ζω άνετα']] },
  { id: 'savings_plan', part: 'apotamieusi', q: 'Βάζεις ήδη χρήματα στην άκρη για το μέλλον;', kind: 'one', opts: [['yes', 'Ναι, έχω ήδη ένα πρόγραμμα αποταμίευσης'], ['soon', 'Όχι ακόμα, αλλά θέλω να ξεκινήσω'], ['family', 'Στηρίζομαι στην οικογένεια ή σε άλλα έσοδα (π.χ. ενοίκια)'], ['no', 'Όχι, δεν το έχω σκεφτεί ακόμα']] },
  { id: 'target_amount', part: 'apotamieusi', q: 'Πόσα θα ήθελες να έχεις μαζέψει;', hint: 'Είναι ο δικός σου στόχος. Θα δούμε μαζί πώς φτάνεις εκεί.', kind: 'one', opts: [['20000', '20.000 €'], ['50000', '50.000 €'], ['100000', '100.000 €'], ['200000', '200.000 € ή περισσότερα'], ['none', 'Δεν με απασχολεί τώρα']] },
  { id: 'target_years', part: 'apotamieusi', q: 'Σε πόσα χρόνια θα ήθελες να τα έχεις μαζέψει;', kind: 'range', min: 10, max: 60, def: 15, unit: 'χρόνια', show: a => !!a.target_amount && a.target_amount !== 'none' },
  { id: 'monthly_budget', part: 'Τέλος', q: 'Πόσα θα μπορούσες να διαθέτεις άνετα κάθε μήνα;', hint: 'Ένα ποσό που δεν σε πιέζει. Από αυτό ξεκινάμε, και μπορεί να αλλάξει όποτε θέλεις.', kind: 'range', min: 30, max: 1000, step: 10, def: 100, unit: '€ τον μήνα' },
]

// Scoring ported from the questionnaire engine (DATA.scoring): identical points, so the order of needs is the same
const S = {
  fund: { none: 40, little: 28, enough: 11, fully: 0 } as Record<string, number>,
  mild: { local_pub: 0, city_pub: 7, local_priv: 20, big_priv: 30 } as Record<string, number>,
  severe: { local_pub: 0, city_pub: 7, local_priv: 14, big_priv: 30, abroad: 30 } as Record<string, number>,
  marital: { single: 0, married: 7, divorced: 0, widowed: 9, single_parent: 9 } as Record<string, number>,
  children: { 0: 0, 1: 6, 2: 9, 3: 13 } as Record<string, number>,
  capital: { '50k': 15, '100k': 25, '150k': 30, '200k': 28 } as Record<string, number>,
  pension: { none: 59, small: 41, adequate: 19, big: 4 } as Record<string, number>,
  savings: { no: 30, soon: 30, family: 13, yes: 0 } as Record<string, number>,
}
const str = (v: A[string] | undefined) => String(v ?? '')
export function scores(a: A) {
  const needs = Array.isArray(a.uncovered_needs) ? a.uncovered_needs : []
  const health = (S.fund[str(a.fund_satisfaction)] ?? 0) + (S.mild[str(a.hospital_mild)] ?? 0) + (S.severe[str(a.hospital_severe)] ?? 0)
  const life = (S.marital[str(a.marital_status)] ?? 0) + (S.children[str(a.children || '0')] ?? 0) + (a.income_concern === 'yes' ? 32 : 0)
    + Math.min(needs.length * 4, 16) + (S.capital[str(a.life_capital)] ?? 0)
  const retirement = (S.pension[str(a.pension_estimate)] ?? 0) + (S.savings[str(a.savings_plan)] ?? 0) + (Number(a.age) > 40 ? 11 : 0)
  return { health, life, retirement }
}

const KEYS: [keyof ReturnType<typeof scores>, DeckKey][] = [['health', 'ygeia'], ['life', 'zoi'], ['retirement', 'apotamieusi']]
const rank = (a: A) => { const s = scores(a); return KEYS.map(([k, d]) => ({ k, d, score: s[k] })).sort((x, y) => y.score - x.score) }

function reasons(d: DeckKey, a: A) {
  const out: string[] = [], needs = Array.isArray(a.uncovered_needs) ? a.uncovered_needs : []
  if (d === 'ygeia') {
    if (['none', 'little'].includes(str(a.fund_satisfaction))) out.push('Νιώθεις ότι υπάρχουν κενά στα έξοδα υγείας.')
    if (['big_priv', 'abroad'].includes(str(a.hospital_severe))) out.push('Για κάτι σοβαρό θέλεις να διαλέγεις εσύ πού θα πας.')
    if (a.ci_pref && a.ci_pref !== 'none') out.push('Θέλεις ένα ποσό στο χέρι, αν εμφανιστεί σοβαρή ασθένεια.')
    if (a.coverage_scope === 'family') out.push('Θέλεις να είναι καλυμμένη όλη η οικογένεια.')
    if (a.hospital_allowance === 'yes') out.push('Ένα ποσό για κάθε μέρα στο νοσοκομείο θα σε βοηθούσε.')
    if (!out.length) out.push('Ένα θέμα υγείας δεν το διαλέγει κανείς. Καλό είναι να ξέρεις από πριν τι καλύπτεται.')
  } else if (d === 'zoi') {
    if (a.income_concern === 'yes') out.push('Εσύ φέρνεις το βασικό εισόδημα στο σπίτι.')
    if (Number(a.children || 0) > 0) out.push('Έχεις παιδιά που στηρίζονται σε σένα.')
    if (needs.includes('mortgage')) out.push('Θέλεις να μη μείνει ακάλυπτο το σπίτι.')
    if (needs.includes('education')) out.push('Θέλεις να είναι σίγουρες οι σπουδές των παιδιών.')
    if (needs.includes('spouse_income')) out.push('Θέλεις να συνεχίσει κανονικά η καθημερινότητα των δικών σου.')
    if (!out.length) out.push('Ένα «δίχτυ» για τους δικούς σου, αν συμβεί κάτι απρόοπτο.')
  } else {
    if (['none', 'small'].includes(str(a.pension_estimate))) out.push('Δεν περιμένεις ότι η σύνταξη θα σου φτάνει.')
    if (['soon', 'no'].includes(str(a.savings_plan))) out.push('Θέλεις να ξεκινήσεις να βάζεις χρήματα στην άκρη.')
    if (a.target_amount && a.target_amount !== 'none') out.push(`Έχεις έναν στόχο για τα επόμενα ${a.target_years ?? 15} χρόνια.`)
    if (!out.length) out.push('Λίγα χρήματα κάθε μήνα, με σταθερότητα, κάνουν μεγάλη διαφορά με τα χρόνια.')
  }
  return out
}

const label = (id: string, v: A[string] | undefined) => {
  const q = QS.find(x => x.id === id && x.opts?.some(([k]) => k === v))
  return q?.opts?.find(([k]) => k === v)?.[1] ?? str(v)
}
// Plain-text summary for Christos (Telegram / JARVIS); the visitor never sees it
function summary(a: A) {
  const s = scores(a), r = rank(a)
  const kids = Array.isArray(a.kids_ages) && a.kids_ages.length ? ` (${a.kids_ages.join(', ')})` : ''
  const ded = a.deductible_type === 'none' ? 'χωρίς απαλλαγή' : `${label('deductible_type', a.deductible_type)} · ${str(a.deductible_amount)}€`
  return [
    `Ανάγκες: ${r.map((x, i) => `${i + 1}) ${x.d === 'ygeia' ? 'ΥΓΕΙΑ' : x.d === 'zoi' ? 'ΖΩΗ' : 'ΑΠΟΤΑΜΙΕΥΣΗ'}`).join(' ')} · scores Υ${s.health}/Ζ${s.life}/Σ${s.retirement}`,
    `Προφίλ: ${a.age} χρονών · ${label('marital_status', a.marital_status)}${a.spouse_age ? ` (σύντροφος ${a.spouse_age})` : ''} · παιδιά ${a.children ?? 0}${kids} · ${label('occupation', a.occupation)}`,
    `Υγεία: ${label('fund_satisfaction', a.fund_satisfaction)} · απλό: ${label('hospital_mild', a.hospital_mild)} · σοβαρό: ${label('hospital_severe', a.hospital_severe)} · ${ded}${a.coverage_scope ? ' · ' + label('coverage_scope', a.coverage_scope) : ''} · σοβαρή ασθένεια: ${label('ci_pref', a.ci_pref)} · ημερήσιο: ${label('hospital_allowance', a.hospital_allowance)}`,
    `Ζωή: ${label('income_concern', a.income_concern)} · ${(Array.isArray(a.uncovered_needs) ? a.uncovered_needs : []).map(v => label('uncovered_needs', v)).join(', ') || '—'} · κεφάλαιο ${str(a.life_capital)}`,
    `Αποταμίευση: ${label('pension_estimate', a.pension_estimate)} · ${label('savings_plan', a.savings_plan)} · στόχος ${a.target_amount === 'none' ? '—' : `${str(a.target_amount)}€ σε ${a.target_years ?? 15} χρόνια`}`,
    `Μηνιαίο ποσό: ${a.monthly_budget}€`,
  ].join('\n')
}

export function QuizPage() {
  const [a, setA] = useState<A>({})
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'q' | 'contact' | 'done'>('q')
  const [f, setF] = useState({ name: '', email: '', phone: '', consent: false, website: '' })
  const [sent, setSent] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [t0] = useState(() => Date.now())
  const timer = useRef<number>(undefined)
  const top = useRef<HTMLDivElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const list = QS.filter(q => !q.show || q.show(a))
  const q = list[Math.min(i, list.length - 1)]
  const val = a[q.id] ?? q.def
  const kidsN = Math.min(Number(a.children || 0), 3)
  const kidsAges = Array.isArray(a.kids_ages) ? a.kids_ages : []
  const ok = q.kind === 'many' ? Array.isArray(val) && val.length > 0 : q.kind === 'kids' ? kidsAges.length === kidsN && kidsAges.every(x => x !== '' && Number(x) >= 0 && Number(x) <= 40) : val !== undefined && val !== ''
  const total = list.length + 1, at = phase === 'q' ? i : list.length

  const scroll = () => requestAnimationFrame(() => (document.querySelector('.qz') ?? top.current)?.scrollIntoView({
    block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  const next = () => {
    clearTimeout(timer.current)
    if (!ok) return
    if (q.kind === 'range' && a[q.id] === undefined) setA(o => ({ ...o, [q.id]: q.def! }))
    if (i + 1 < list.length) setI(i + 1); else setPhase('contact')
    scroll()
  }
  const back = () => { clearTimeout(timer.current); if (phase === 'contact') setPhase('q'); else setI(Math.max(0, i - 1)); scroll() }
  const pick = (v: string) => {
    // Changing an answer that controls follow-up questions clears the stale follow-ups
    const reset: A = a[q.id] === v ? {} : q.id === 'deductible_type' ? { deductible_amount: '' } : q.id === 'children' ? { kids_ages: [] } : {}
    const na = { ...a, ...reset, [q.id]: v }
    setA(na)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (i + 1 < QS.filter(x => !x.show || x.show(na)).length) setI(i + 1); else setPhase('contact')
      scroll()
    }, 320)
  }
  const toggle = (v: string) => { const cur = Array.isArray(val) ? val : []; setA(o => ({ ...o, [q.id]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] })) }
  const setKid = (j: number, v: string) => { const ages = Array.from({ length: kidsN }, (_, n) => kidsAges[n] ?? ''); ages[j] = v.replace(/\D/g, '').slice(0, 2); setA(o => ({ ...o, kids_ages: ages })) }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())
  const digits = f.phone.replace(/\D/g, '')
  const contactOk = f.name.trim().length > 1 && emailOk && (digits.length === 0 || digits.length >= 10) && f.consent
  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (!contactOk || sent === 'sending') return
    const full: A = Object.fromEntries(Object.entries({ ...Object.fromEntries(list.filter(x => x.kind === 'range').map(x => [x.id, x.def!])), ...a }).filter(([k]) => list.some(x => x.id === k)))
    setA(full); setSent('sending')
    try {
      const r = await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), consent: f.consent, website: f.website,
        topic: 'Ερωτηματολόγιο αναγκών', source: 'erotimatologio', message: summary(full), answers: { ...full, scores: scores(full) }, elapsed_ms: Date.now() - t0 }) })
      const j = await r.json().catch(() => ({}))
      setSent(r.ok && j.ok ? 'ok' : 'err')
    } catch { setSent('err') }
    setPhase('done'); scroll()
  }
  const restart = () => { setA({}); setI(0); setPhase('q'); setSent('idle'); scroll() }

  if (phase === 'done') {
    const r = rank(a), calm = r[0].score < 45, first = f.name.trim().split(' ')[0]
    return <div ref={top} className="quiz">
      <span className="tag">Τα αποτελέσματά σου</span>
      <h1>{first}, {calm ? <em>είσαι σε καλό δρόμο</em> : <em>από εδώ ξεκινάμε</em>}</h1>
      <p className="lead">{calm ? 'Δεν βλέπω κάτι επείγον σήμερα. Οι ανάγκες σου, με τη σειρά που βγήκαν:' : 'Με βάση τις απαντήσεις σου, οι ανάγκες σου μπαίνουν με αυτή τη σειρά:'}</p>
      <div className="need-res">{r.map((x, j) => <div key={x.k} className={'card' + (j === 0 && !calm ? ' first' : '')}>
        <span className="rank">{j + 1}η ανάγκη</span><Topic k={x.d} />
        <ul>{reasons(x.d, a).map(t => <li key={t}>{t}</li>)}</ul>
        <a className="learn" href={href(x.d)}>Μάθε για αυτήν →</a></div>)}</div>
      <div className="note">Είναι μια πρώτη εικόνα από τις απαντήσεις σου. Το πρόγραμμα και το κόστος τα βρίσκουμε μαζί, πάνω σε ό,τι σου ταιριάζει.</div>
      <div className="card cta"><h2>Ας τα πούμε από κοντά</h2>
        <p>{sent === 'ok' ? (digits ? 'Έλαβα τις απαντήσεις σου και θα σε καλέσω σύντομα.' : 'Έλαβα τις απαντήσεις σου. Θα σου γράψω στο email σου, ή πάρε με όποτε θέλεις.')
          : `Οι απαντήσεις δεν έφτασαν σε μένα από εδώ. Πάρε με στο ${PHONE} και τα λέμε.`}</p>
        <div className="actions"><a className="btn" href={'tel:' + PHONE}>Πάρε με τηλέφωνο</a><a className="btn ghost" href={href('epikoinonia')}>Σε παίρνω εγώ</a><button className="btn ghost" onClick={restart}>Από την αρχή</button></div></div>
    </div>
  }

  const part = phase === 'contact' ? 'Τέλος' : q.part
  return <div ref={top} className="quiz">
    <span className="tag">Ερωτηματολόγιο · 5 λεπτά</span>
    <h1>Τι χρειάζεσαι <em>πραγματικά;</em></h1>
    <p className="lead">Λίγες απλές ερωτήσεις, μία τη φορά. Στο τέλος βλέπεις ποια ανάγκη σου έρχεται πρώτη. Χωρίς υποχρέωση.</p>
    <div className="card stepper qz">
      <div className="qz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={at + 1} aria-label="Πρόοδος"><span style={{ width: `${((at + 1) / total) * 100}%` }} /></div>
      <div className="qz-part">{part === 'ygeia' || part === 'zoi' || part === 'apotamieusi' ? <Topic k={part} sm /> : <b>{part}</b>}<small>{at + 1} από {total}</small></div>
      {phase === 'q' ? <>
        <h2 id="qz-q">{q.q}</h2>
        {q.hint && <p className="qz-hint">{q.hint}</p>}
        {q.kind === 'one' && <div className="qz-opts" role="radiogroup" aria-labelledby="qz-q">{q.opts!.map(([v, l]) => <label className="pick" key={v}><input type="radio" name={q.id + i} checked={val === v} onChange={() => pick(v)} /><span>{l}</span></label>)}</div>}
        {q.kind === 'many' && <div className="qz-opts" role="group" aria-labelledby="qz-q">{q.opts!.map(([v, l]) => <label className="pick" key={v}><input type="checkbox" checked={Array.isArray(val) && val.includes(v)} onChange={() => toggle(v)} /><span>{l}</span></label>)}</div>}
        {q.kind === 'range' && <><div className="bigval">{q.unit?.startsWith('€') ? Number(val).toLocaleString('el-GR') + ' €' : val}<small>{q.unit?.startsWith('€') ? 'τον μήνα' : q.unit}</small></div>
          <div className="num-in"><input type="range" aria-labelledby="qz-q" min={q.min} max={q.max} step={q.step ?? 1} value={Number(val)} onChange={e => setA(o => ({ ...o, [q.id]: +e.target.value }))} /></div></>}
        {q.kind === 'kids' && <div className="qz-kids">{Array.from({ length: kidsN }, (_, j) => <label key={j}>{`${j + 1}ο παιδί`}<input inputMode="numeric" placeholder="π.χ. 6" value={kidsAges[j] ?? ''} onChange={e => setKid(j, e.target.value)} /></label>)}</div>}
        <div className="actions">{i > 0 && <button className="btn ghost" onClick={back}>← Πίσω</button>}<button className="btn" disabled={!ok} onClick={next}>Επόμενο →</button></div>
      </> : <form onSubmit={submit} className="qz-form">
        <h2>Πού να σου στείλω τα αποτελέσματα;</h2>
        <label>Όνομα<input autoComplete="name" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label>Email<input type="email" inputMode="email" autoComplete="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></label>
        {f.email.trim().length > 3 && !emailOk && <p className="small" role="alert">Έλεγξε το email, π.χ. onoma@gmail.com</p>}
        <label>Τηλέφωνο <small>(προαιρετικό: αν το αφήσεις, σε παίρνω εγώ)</small><input type="tel" autoComplete="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></label>
        {digits.length > 0 && digits.length < 10 && <p className="small" role="alert">Το τηλέφωνο θέλει 10 ψηφία, ή άφησέ το κενό.</p>}
        <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} /></label>
        <label className="check"><input type="checkbox" checked={f.consent} onChange={e => setF({ ...f, consent: e.target.checked })} /><span>Συμφωνώ να χρησιμοποιηθούν οι απαντήσεις και τα στοιχεία μου μόνο για να επικοινωνήσεις μαζί μου. <a href={href('aporrito')}>Απόρρητο</a></span></label>
        <div className="actions"><button type="button" className="btn ghost" onClick={back}>← Πίσω</button><button className="btn" disabled={!contactOk || sent === 'sending'}>{sent === 'sending' ? 'Αποστολή…' : 'Δες τα αποτελέσματα →'}</button></div>
      </form>}
    </div>
    <p className="small disclaimer">Οι απαντήσεις σου φτάνουν μόνο σε μένα, όταν πατήσεις «Δες τα αποτελέσματα».</p>
  </div>
}
