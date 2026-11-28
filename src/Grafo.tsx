import { type FormEvent, useEffect, useRef, useState } from 'react'
import type { SupabaseClient, Session } from '@supabase/supabase-js'
import { href } from './routes'
import { SB_URL, SB_KEY, EDITOR, postDate, type Post } from './posts'

const BUCKET = 'post-images'
const EMPTY = { id: 0, title: '', body: '', image_url: '' as string | null, published: true }

// Phone photos are large: shrink to 1600px wide JPEG before uploading
async function shrink(file: File): Promise<Blob> {
  const img = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / img.width)
  const c = document.createElement('canvas')
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
  return new Promise((ok, no) => c.toBlob(b => (b ? ok(b) : no(new Error('image'))), 'image/jpeg', 0.82))
}
const pathOf = (url: string | null) => url?.split(`/object/public/${BUCKET}/`)[1]

export function Grafo() {
  const sb = useRef<SupabaseClient | null>(null)
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [recovery, setRecovery] = useState(false)
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState(EDITOR)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [f, setF] = useState(EMPTY)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const formTop = useRef<HTMLFormElement>(null)

  useEffect(() => {
    let off = () => {}
    import('@supabase/supabase-js').then(({ createClient }) => {
      const c = createClient(SB_URL, SB_KEY)
      sb.current = c
      c.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
      const { data } = c.auth.onAuthStateChange((ev, s) => { setSession(s); if (ev === 'PASSWORD_RECOVERY') setRecovery(true) })
      off = () => data.subscription.unsubscribe()
    })
    return () => off()
  }, [])

  const isEditor = session?.user.email?.toLowerCase() === EDITOR
  const load = async () => {
    const { data } = await sb.current!.from('site_posts').select('id,created_at,title,body,image_url,published').order('created_at', { ascending: false })
    setPosts((data as Post[]) ?? [])
  }
  useEffect(() => { if (isEditor) load() }, [isEditor])
  useEffect(() => { if (!file) { setPreview(''); return } const u = URL.createObjectURL(file); setPreview(u); return () => URL.revokeObjectURL(u) }, [file])

  const back = (to = href('grafo')) => (typeof location === 'undefined' ? to : location.origin + to)
  const auth = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('')
    const c = sb.current!
    if (recovery) {
      const { error } = await c.auth.updateUser({ password: pw })
      setMsg(error ? 'Δεν άλλαξε ο κωδικός: ' + error.message : 'Ο νέος κωδικός αποθηκεύτηκε.'); if (!error) setRecovery(false)
    } else if (mode === 'in') {
      const { error } = await c.auth.signInWithPassword({ email: email.trim(), password: pw })
      if (error) setMsg(/confirm/i.test(error.message) ? 'Πρώτα πάτα τον σύνδεσμο επιβεβαίωσης που σου ήρθε στο email.' : 'Λάθος email ή κωδικός.')
    } else {
      const { error } = await c.auth.signUp({ email: email.trim(), password: pw, options: { emailRedirectTo: back() } })
      setMsg(error ? 'Κάτι δεν πήγε καλά: ' + error.message : 'Σου έστειλα email. Πάτα τον σύνδεσμο μέσα και μετά μπες εδώ με τον κωδικό σου.')
    }
    setPw(''); setBusy(false)
  }
  const forgot = async () => {
    setBusy(true)
    const { error } = await sb.current!.auth.resetPasswordForEmail(email.trim(), { redirectTo: back() })
    setMsg(error ? 'Κάτι δεν πήγε καλά: ' + error.message : 'Σου έστειλα email για νέο κωδικό.'); setBusy(false)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!f.title.trim() || busy) return
    setBusy(true); setMsg('')
    const c = sb.current!
    try {
      let image_url = f.image_url || null
      if (file) {
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
        const { error } = await c.storage.from(BUCKET).upload(name, await shrink(file), { contentType: 'image/jpeg', cacheControl: '31536000' })
        if (error) throw error
        const old = pathOf(f.image_url)
        if (old) await c.storage.from(BUCKET).remove([old])
        image_url = c.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
      }
      const row = { title: f.title.trim(), body: f.body.trim(), image_url, published: f.published }
      const { error } = f.id
        ? await c.from('site_posts').update({ ...row, updated_at: new Date().toISOString() }).eq('id', f.id)
        : await c.from('site_posts').insert(row)
      if (error) throw error
      setMsg(f.id ? 'Οι αλλαγές αποθηκεύτηκαν.' : f.published ? 'Δημοσιεύτηκε! Φαίνεται ήδη στα Άρθρα.' : 'Αποθηκεύτηκε ως πρόχειρο.')
      setF(EMPTY); setFile(null); await load()
    } catch (err) { setMsg('Δεν αποθηκεύτηκε: ' + (err as Error).message) }
    setBusy(false)
  }
  const edit = (p: Post) => { setF({ id: p.id, title: p.title, body: p.body, image_url: p.image_url, published: p.published !== false }); setFile(null); setMsg(''); formTop.current?.scrollIntoView({ behavior: 'smooth' }) }
  const remove = async (p: Post) => {
    if (!confirm(`Να σβηστεί οριστικά η δημοσίευση «${p.title}»;`)) return
    const c = sb.current!
    const { error } = await c.from('site_posts').delete().eq('id', p.id)
    if (error) { setMsg('Δεν σβήστηκε: ' + error.message); return }
    const path = pathOf(p.image_url); if (path) await c.storage.from(BUCKET).remove([path])
    if (f.id === p.id) setF(EMPTY)
    await load(); setMsg('Σβήστηκε.')
  }

  if (!ready) return <><span className="tag">Για τον Χρήστο</span><h1>Νέα δημοσίευση</h1><p className="lead">Φορτώνει…</p></>

  if (!session || recovery) return <>
    <span className="tag">Για τον Χρήστο</span><h1>Νέα δημοσίευση</h1>
    <p className="lead">Αυτή η σελίδα είναι μόνο για μένα. Μπες με το email και τον κωδικό σου.</p>
    <form className="card grafo-form" onSubmit={auth}>
      {!recovery && <div className="seg3 grafo-tabs"><button type="button" aria-pressed={mode === 'in'} onClick={() => setMode('in')}>Σύνδεση</button><button type="button" aria-pressed={mode === 'up'} onClick={() => setMode('up')}>Πρώτη φορά</button></div>}
      {!recovery && <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>}
      <label>{recovery ? 'Νέος κωδικός' : 'Κωδικός'}<input type="password" autoComplete={mode === 'up' || recovery ? 'new-password' : 'current-password'} minLength={8} required value={pw} onChange={e => setPw(e.target.value)} /></label>
      {mode === 'up' && !recovery && <p className="small">Διάλεξε έναν κωδικό με τουλάχιστον 8 χαρακτήρες. Θα σου έρθει email επιβεβαίωσης.</p>}
      <button className="btn" disabled={busy}>{recovery ? 'Αποθήκευση κωδικού' : mode === 'in' ? 'Σύνδεση' : 'Φτιάξε τον λογαριασμό'}</button>
      {mode === 'in' && !recovery && <button type="button" className="linkbtn" onClick={forgot} disabled={busy}>Ξέχασα τον κωδικό</button>}
      {msg && <p className="small" role="status">{msg}</p>}
    </form>
  </>

  if (!isEditor) return <>
    <span className="tag">Για τον Χρήστο</span><h1>Δεν έχεις πρόσβαση</h1>
    <p className="lead">Εδώ γράφει μόνο ο Χρήστος. Συνδέθηκες ως {session.user.email}.</p>
    <button className="btn ghost" onClick={() => sb.current!.auth.signOut()}>Αποσύνδεση</button>
  </>

  return <>
    <span className="tag">Για τον Χρήστο</span><h1>{f.id ? 'Διόρθωση δημοσίευσης' : 'Νέα δημοσίευση'}</h1>
    <p className="lead">Γράψε, βάλε φωτογραφία και πάτα «Δημοσίευση». Βγαίνει αμέσως στα <a href={href('blog')}>Άρθρα</a>.</p>
    <form ref={formTop} className="card grafo-form" onSubmit={save}>
      <label>Τίτλος<input required maxLength={200} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></label>
      <label>Κείμενο<textarea rows={10} maxLength={20000} value={f.body} onChange={e => setF({ ...f, body: e.target.value })} placeholder="Άφησε μια κενή γραμμή για νέα παράγραφο." /></label>
      <label>Φωτογραφία <small>(προαιρετικά)</small><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
      {(preview || f.image_url) && <div className="grafo-img"><img src={preview || f.image_url!} alt="" />
        <button type="button" className="linkbtn" onClick={() => { setFile(null); setF({ ...f, image_url: null }) }}>Χωρίς φωτογραφία</button></div>}
      <label className="check"><input type="checkbox" checked={f.published} onChange={e => setF({ ...f, published: e.target.checked })} /><span>Να φαίνεται στο σάιτ (αλλιώς μένει πρόχειρο)</span></label>
      <div className="actions"><button className="btn" disabled={busy || !f.title.trim()}>{busy ? 'Αποθήκευση…' : f.id ? 'Αποθήκευση αλλαγών' : f.published ? 'Δημοσίευση' : 'Αποθήκευση πρόχειρου'}</button>
        {f.id > 0 && <button type="button" className="btn ghost" onClick={() => { setF(EMPTY); setFile(null) }}>Άκυρο</button>}</div>
      {msg && <p className="small" role="status">{msg}</p>}
    </form>
    <h2 className="section">Οι δημοσιεύσεις μου</h2>
    {posts.length === 0 ? <p className="small">Δεν έχεις γράψει ακόμα τίποτα.</p>
      : <div className="grafo-list">{posts.map(p => <div key={p.id} className="card grafo-item">
        {p.image_url && <img src={p.image_url} alt="" loading="lazy" />}
        <div><span className="tag">{postDate(p.created_at)}{p.published === false ? ' · πρόχειρο' : ''}</span><h3>{p.title}</h3>
          <div className="actions"><button className="btn ghost" onClick={() => edit(p)}>Διόρθωση</button><button className="btn ghost" onClick={() => remove(p)}>Σβήσιμο</button>
            {p.published !== false && <a className="more" href={href('blog') + '?p=' + p.id}>Δες τη →</a>}</div></div></div>)}</div>}
    <p className="small" style={{ marginTop: 24 }}>Συνδεδεμένος ως {session.user.email} · <button className="linkbtn" onClick={() => sb.current!.auth.signOut()}>Αποσύνδεση</button></p>
  </>
}
