import { HASH } from './routes'

export const SB_URL = 'https://rcvdnisyznxhwdfakhfl.supabase.co'
// Publishable key: safe in the browser, the table's RLS decides who may read or write
export const SB_KEY = 'sb_publishable_3BSJ42oEqi4J6aka-90n1A_keC8IlQJ'
export const EDITOR = 'christos.koltsis@nnadvisors.gr'

export type Post = { id: number; created_at: string; title: string; body: string; image_url: string | null; published?: boolean }

export async function fetchPosts(): Promise<Post[]> {
  const r = await fetch(`${SB_URL}/rest/v1/site_posts?select=id,created_at,title,body,image_url&published=eq.true&order=created_at.desc&limit=100`, { headers: { apikey: SB_KEY } })
  if (!r.ok) throw new Error('posts ' + r.status)
  return r.json()
}

// A single post lives at /blog/?p=<id> (or #blog?p=<id> in the preview), since posts are added after the site is built
export function postParam() {
  if (typeof location === 'undefined') return null
  const q = HASH ? location.hash.split('?')[1] ?? '' : location.search.slice(1)
  const id = Number(new URLSearchParams(q).get('p'))
  return id > 0 ? id : null
}

export const postDate = (s: string) => new Date(s).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })
export const excerpt = (s: string, n = 170) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t }
