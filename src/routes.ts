import { POSTS } from './data'

export const BASE = import.meta.env.BASE_URL
// Preview builds (claude.ai artifact) can't use real paths, so pages switch on #key there
export const HASH = import.meta.env.VITE_HASH_ROUTES === 'true'

export const PAGES = ['arxiki', 'idiotes', 'epixeiriseis', 'programmata', 'ergaleia', 'syntaxi', 'checkup', 'kefalaia', 'konta', 'blog', 'epikoinonia', 'rantevou', 'aporrito'] as const
export const ROUTES: string[] = [...PAGES, ...POSTS.map(p => 'arthro-' + p.id)]

export const href = (key: string) =>
  HASH ? '#' + key : key === 'arxiki' ? BASE : BASE + (key.startsWith('arthro-') ? 'arthra/' + key.slice(7) : key) + '/'

export function currentKey() {
  if (!HASH) return keyFromPath(location.pathname)
  const key = location.hash.slice(1).split('#')[0]
  return ROUTES.includes(key) ? key : 'arxiki'
}

export function keyFromPath(pathname: string) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  const [a, b] = rest.split('/').filter(Boolean)
  const key = !a ? 'arxiki' : a === 'arthra' && b ? 'arthro-' + b : a
  return ROUTES.includes(key) ? key : 'arxiki'
}

const NAME = 'Χρήστος Κόλτσης'
type Meta = { title: string; description: string }
const META: Record<string, Meta> = {
  arxiki: { title: `${NAME} · Ασφαλιστικός & Χρηματοοικονομικός Σύμβουλος στην Έδεσσα`, description: 'Ασφαλιστικός και χρηματοοικονομικός σύμβουλος στην Έδεσσα. Ζωή, υγεία, σύνταξη, επενδύσεις και λύσεις για επιχειρήσεις, με απλά λόγια, για όλη τη Βόρεια Ελλάδα.' },
  idiotes: { title: 'Ασφάλιση για ιδιώτες και οικογένειες', description: 'Από ένα απρόοπτο στο νοσοκομείο μέχρι τη σύνταξη, βρίσκουμε μαζί τι σου ταιριάζει, με το κόστος ξεκάθαρο από την αρχή.' },
  epixeiriseis: { title: 'Ασφάλιση για επιχειρήσεις και ελεύθερους επαγγελματίες', description: 'Key person, συνεταίροι, ομαδικά προγράμματα, ευθύνη και cyber. Ξεκινάμε από τους ανθρώπους της επιχείρησης.' },
  programmata: { title: 'Προγράμματα για κάθε ανάγκη', description: 'Υγεία, ζωή, σύνταξη, επένδυση και λύσεις για επιχειρήσεις. Δες σε τι βοηθάει το καθένα και τα συζητάμε για τη δική σου περίπτωση.' },
  ergaleia: { title: 'Δωρεάν εργαλεία', description: 'Υπολογιστής σύνταξης, τεστ κάλυψης και άλλα μικρά, δωρεάν εργαλεία για να δεις πού βρίσκεσαι. Χωρίς εγγραφή.' },
  syntaxi: { title: 'Υπολογιστής σύνταξης', description: 'Δες σε ένα λεπτό πόσο απέχει η κρατική σύνταξη από τη ζωή που θέλεις, και τι μηνιαίο ποσό κλείνει τη διαφορά.' },
  checkup: { title: 'Τεστ κάλυψης: πού είσαι ακάλυπτος;', description: 'Απάντησε σε 10 ερωτήσεις και δες ένα σκορ στα 100 για την υγεία, το εισόδημα, την οικογένεια και το σπίτι σου.' },
  kefalaia: { title: 'Επένδυση με δίχτυ ασφαλείας', description: 'Πώς τα επενδυτικά ασφαλιστικά προγράμματα συνδυάζουν επένδυση σε κεφάλαια με ασφάλιση ζωής, και τι σημαίνει ο βαθμός κινδύνου.' },
  konta: { title: 'Υγεία κοντά σου στη Βόρεια Ελλάδα', description: 'Όταν διαλέγεις πρόγραμμα υγείας, μετράει και πού καλύπτεσαι. Γιατί ένα συνεργαζόμενο νοσοκομείο κοντά σου κάνει τη διαφορά.' },
  blog: { title: 'Άρθρα', description: 'Μικρές, απλές εξηγήσεις για όσα αξίζει να ξέρεις πριν διαλέξεις ασφάλιση υγείας, ζωής ή σύνταξης.' },
  epikoinonia: { title: 'Επικοινωνία', description: `Μίλα με τον ${NAME}: τηλέφωνο 6989118348, email ή φόρμα. Έδεσσα και όλη η Βόρεια Ελλάδα, από κοντά ή online.` },
  rantevou: { title: 'Κλείσε ένα ραντεβού', description: 'Ένας καφές, μια βιντεοκλήση ή ένα τηλεφώνημα, χωρίς καμία δέσμευση. Πες μου λίγα λόγια και θα σε πάρω τηλέφωνο.' },
  aporrito: { title: 'Πολιτική απορρήτου', description: 'Ποια στοιχεία ζητούνται στη φόρμα, για ποιον λόγο και πώς ζητάς να τα δεις, να τα διορθώσεις ή να τα διαγράψεις.' },
}

export function meta(key: string): Meta {
  const post = key.startsWith('arthro-') && POSTS.find(p => p.id === key.slice(7))
  const m = post ? { title: post.title, description: post.lead } : META[key] ?? META.arxiki
  return key === 'arxiki' ? m : { ...m, title: `${m.title} · ${NAME}` }
}
