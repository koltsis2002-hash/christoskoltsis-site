import { useEffect, useState, type ReactNode } from 'react'
import { href } from './routes'
import { fetchPosts, postDate, excerpt, type Post } from './posts'

const Body = ({ text }: { text: string }) => <>{text.split(/\n\s*\n/).filter(p => p.trim()).map((p, i) =>
  <p key={i}>{p.split('\n').map((l, j) => <span key={j}>{j > 0 && <br />}{l}</span>)}</p>)}</>

export function Articles({ postId, guides }: { postId: number | null; guides: ReactNode }) {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [err, setErr] = useState(false)
  useEffect(() => { fetchPosts().then(setPosts, () => setErr(true)) }, [])
  const one = postId != null && posts ? posts.find(p => p.id === postId) : undefined
  useEffect(() => { if (one) document.title = `${one.title} · Χρήστος Κόλτσης` }, [one])

  if (postId != null) {
    if (!posts && !err) return <p className="lead">Φορτώνει…</p>
    if (!one) return <><a className="more" href={href('blog')}>← Όλα τα άρθρα</a><h1>Δεν βρέθηκε η δημοσίευση</h1><p className="lead">Ίσως έχει αφαιρεθεί. Δες τις υπόλοιπες στα Άρθρα.</p></>
    return <article className="article post-full"><a className="more" href={href('blog')}>← Όλα τα άρθρα</a>
      <span className="tag">{postDate(one.created_at)}</span><h1>{one.title}</h1>
      {one.image_url && <img src={one.image_url} alt="" loading="eager" />}
      <Body text={one.body} />
      <div className="actions"><a className="btn" href={href('epikoinonia')}>Θέλω να μιλήσουμε</a><a className="btn ghost" href={href('blog')}>Περισσότερα άρθρα</a></div></article>
  }

  return <>
    <span className="tag">Άρθρα</span><h1>Ασφάλεια, <em>με απλά λόγια</em></h1>
    <p className="lead">Σκέψεις, νέα και μικρές εξηγήσεις από μένα, για όσα αξίζει να ξέρεις πριν υπογράψεις.</p>
    {posts === null && !err && <p className="small">Φορτώνουν οι δημοσιεύσεις…</p>}
    {posts && posts.length > 0 && <div className="grid pgrid">{posts.map(p => <a key={p.id} className="card pcard" href={href('blog') + '?p=' + p.id}>
      {p.image_url && <img src={p.image_url} alt="" loading="lazy" />}
      <span className="tag">{postDate(p.created_at)}</span><h3>{p.title}</h3><p>{excerpt(p.body)}</p><span className="more">Διάβασε →</span></a>)}</div>}
    <h2 className="section">Οδηγοί</h2>
    {guides}
  </>
}
