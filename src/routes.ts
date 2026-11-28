import { MOMENTS, POSTS } from './data'

export const BASE = import.meta.env.BASE_URL
// Preview builds (claude.ai artifact) can't use real paths, so pages switch on #key there
export const HASH = import.meta.env.VITE_HASH_ROUTES === 'true'

export const PAGES = ['arxiki', 'stigmes', 'ygeia', 'zoi', 'apotamieusi', 'ergaleia', 'erotimatologio', 'xartis', 'syntaxi', 'blog', 'epikoinonia', 'aporrito'] as const
export const ROUTES: string[] = [...PAGES, ...MOMENTS.map(m => 'stigmi-' + m.id), ...POSTS.map(p => 'arthro-' + p.id)]
// Hash links from the earlier version of the site
export const OLD: Record<string, string> = { idiotes: 'stigmes', epixeiriseis: 'stigmi-epixeirisi', programmata: 'stigmes', kefalaia: 'apotamieusi', konta: 'arthro-symvevlimeno', checkup: 'xartis', rantevou: 'epikoinonia', nosileia: 'ergaleia', 'arthro-efka': 'blog' }

const SUB: [string, string][] = [['arthro-', 'arthra/'], ['stigmi-', 'stigmes/']]
export const href = (key: string) => {
  if (HASH) return '#' + key
  if (key === 'arxiki') return BASE
  const sub = SUB.find(([p]) => key.startsWith(p))
  return BASE + (sub ? sub[1] + key.slice(sub[0].length) : key) + '/'
}

export function currentKey() {
  if (!HASH) return keyFromPath(location.pathname)
  const raw = location.hash.slice(1).split('#')[0], key = OLD[raw] ?? raw
  return ROUTES.includes(key) ? key : 'arxiki'
}

export function keyFromPath(pathname: string) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  const [a, b] = rest.split('/').filter(Boolean)
  const sub = b ? SUB.find(([, d]) => d === a + '/') : undefined
  const key = !a ? 'arxiki' : b ? (sub ? sub[0] + b : '') : OLD[a] ?? a
  return ROUTES.includes(key) ? key : 'arxiki'
}

const NAME = 'Χρήστος Κόλτσης'
type Meta = { title: string; description: string }
const META: Record<string, Meta> = {
  arxiki: { title: `${NAME} · Ασφαλιστικός & Χρηματοοικονομικός Σύμβουλος στην Έδεσσα`, description: 'Ασφαλιστικός και χρηματοοικονομικός σύμβουλος στην Έδεσσα. Ζωή, υγεία, σύνταξη, επενδύσεις και λύσεις για επιχειρήσεις, με απλά λόγια, για όλη τη Βόρεια Ελλάδα.' },
  stigmes: { title: 'Στιγμές ζωής', description: 'Η πρώτη δουλειά, η οικογένεια, το σπίτι, η επιχείρηση, η σύνταξη. Βρες τη στιγμή που σου μοιάζει και δες τι αξίζει να σκεφτείς.' },
  ygeia: { title: 'Πώς δουλεύει η ασφάλεια υγείας', description: 'Νοσηλεία, γιατροί και εξετάσεις, αποζημίωση ή επίδομα, συμβεβλημένο νοσοκομείο και τι να ρωτήσεις πριν διαλέξεις. Μια μικρή παρουσίαση με απλά λόγια.' },
  zoi: { title: 'Πώς δουλεύει η ασφάλεια ζωής', description: 'Τι κάνει μια ασφάλεια ζωής για τους δικούς σου, πώς βρίσκεις πόσο κεφάλαιο χρειάζεσαι και γιατί συμφέρει από νωρίς. Με απλά λόγια.' },
  apotamieusi: { title: 'Πώς δουλεύει η αποταμίευση', description: 'Μια μικρή παρουσίαση με απλά λόγια: πώς ένα σταθερό ποσό κάθε μήνα γίνεται κεφάλαιο για τη σύνταξη ή για τα παιδιά.' },
  ergaleia: { title: 'Δωρεάν εργαλεία', description: 'Ο χάρτης της προστασίας σου, πόσο να βάζεις για τη σύνταξη και πώς δουλεύει η αποταμίευση. Μικρά, δωρεάν εργαλεία, χωρίς εγγραφή.' },
  erotimatologio: { title: 'Τι χρειάζεσαι πραγματικά; Ερωτηματολόγιο αναγκών', description: 'Λίγες απλές ερωτήσεις, μία τη φορά: δες ποια ανάγκη σου έρχεται πρώτη, υγεία, ζωή ή αποταμίευση. Δωρεάν, χωρίς υποχρέωση.' },
  xartis: { title: 'Ο χάρτης της προστασίας σου', description: 'Έξι περιοχές, ένα πάτημα στην καθεμιά: δες αμέσως πού είσαι καλυμμένος και πού υπάρχουν κενά.' },
  syntaxi: { title: 'Πόσο να βάζω για τη σύνταξη;', description: 'Τρεις ερωτήσεις, μία τη φορά, και ένα νούμερο για κάθε μήνα από σήμερα, για να ζεις στη σύνταξη όπως θέλεις.' },
  blog: { title: 'Άρθρα', description: 'Μικρές, απλές εξηγήσεις για όσα αξίζει να ξέρεις πριν διαλέξεις ασφάλιση υγείας, ζωής ή σύνταξης.' },
  epikoinonia: { title: 'Επικοινωνία', description: `Μίλα με τον ${NAME}: τηλέφωνο 6989118348 ή άφησε το τηλέφωνό σου και σε παίρνω εγώ, τηλεφωνικά ή με βιντεοκλήση.` },
  aporrito: { title: 'Πολιτική απορρήτου', description: 'Ποια στοιχεία ζητούνται στη φόρμα, για ποιον λόγο και πώς ζητάς να τα δεις, να τα διορθώσεις ή να τα διαγράψεις.' },
}

export function meta(key: string): Meta {
  const post = key.startsWith('arthro-') && POSTS.find(p => p.id === key.slice(7))
  const moment = key.startsWith('stigmi-') && MOMENTS.find(m => m.id === key.slice(7))
  const m = post ? { title: post.title, description: post.lead }
    : moment ? { title: moment.title, description: `${moment.lead} ${moment.needs.map(n => n.t).join(', ')}: τι αξίζει να σκεφτείς, με απλά λόγια.` }
    : META[key] ?? META.arxiki
  return key === 'arxiki' ? m : { ...m, title: `${m.title} · ${NAME}` }
}
