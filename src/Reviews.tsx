import { useEffect, useState } from 'react'
import { SB_URL } from './posts'

export type Review = { author: string; authorUrl: string | null; rating: number; text: string; when: string }
export type Reviews = { configured: boolean; rating?: number | null; count?: number; url?: string; writeUrl?: string; reviews?: Review[] }

// One request per page load, shared by every component that shows reviews
let once: Promise<Reviews> | null = null
const load = () => (once ??= fetch(`${SB_URL}/functions/v1/google-reviews`).then(r => r.json() as Promise<Reviews>).catch(() => ({ configured: false })))

export function useReviews() {
  const [r, setR] = useState<Reviews | null>(null)
  useEffect(() => { load().then(setR) }, [])
  return r
}

const Stars = ({ n, label }: { n: number; label?: string }) => <span className="stars" role="img" aria-label={label ?? `${n} από 5 αστέρια`}>
  {[1, 2, 3, 4, 5].map(i => <span key={i} className={i <= Math.round(n) ? 'on' : ''} aria-hidden="true">★</span>)}</span>

// Hidden until Christos's Google Business Profile is connected and has at least one review
export function GoogleReviews() {
  const r = useReviews()
  if (!r?.configured || !r.rating || !r.count || !r.writeUrl) return null
  const rating = r.rating.toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return <section className="reviews" aria-labelledby="rv-h">
    <h2 className="section" id="rv-h">Τι λένε για μένα</h2>
    <div className="rv-sum"><b>{rating}</b><Stars n={r.rating} label={`${rating} από 5 αστέρια`} /><a href={r.url} target="_blank" rel="noopener">{r.count} {r.count === 1 ? 'κριτική' : 'κριτικές'} στη Google</a></div>
    {!!r.reviews?.length && <div className="rv-list">{r.reviews.filter(v => v.text.trim()).map((v, i) => <figure key={i} className="card rv">
      <Stars n={v.rating} /><blockquote>{v.text}</blockquote>
      <figcaption>{v.authorUrl ? <a href={v.authorUrl} target="_blank" rel="noopener">{v.author}</a> : v.author}{v.when && <span> · {v.when}</span>}</figcaption>
    </figure>)}</div>}
    <div className="actions"><a className="btn" href={r.writeUrl} target="_blank" rel="noopener">Γράψε μια κριτική</a><a className="btn ghost" href={r.url} target="_blank" rel="noopener">Δες όλες στη Google</a></div>
    <p className="small">Κριτικές από τη Google, όπως τις έγραψαν οι πελάτες μου.</p>
  </section>
}

// Short "write a review" invitation for places like the questionnaire results
export function ReviewLink() {
  const r = useReviews()
  if (!r?.configured || !r.writeUrl) return null
  return <p className="rv-invite">Με ξέρεις ήδη; Μια κριτική σου στη Google βοηθά κι άλλους να με βρουν. <a href={r.writeUrl} target="_blank" rel="noopener">Γράψε μια κριτική →</a></p>
}
