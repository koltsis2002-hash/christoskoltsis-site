import { useEffect, type RefObject } from 'react'

const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false } }

/** Το «ΚΟΛΤΣΗΣ» και η φωτογραφία κινούνται αντίθετα με το ποντίκι, για αίσθηση βάθους */
export function useDepth(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || matchMedia('(hover: none)').matches) return
    let raf = 0, x = 0, y = 0, tx = 0, ty = 0
    const tick = () => {
      x += (tx - x) * .08; y += (ty - y) * .08
      el.style.setProperty('--mx', x.toFixed(4)); el.style.setProperty('--my', y.toFixed(4))
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .0005 ? requestAnimationFrame(tick) : 0
    }
    const mv = (e: PointerEvent) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; if (!raf) raf = requestAnimationFrame(tick) }
    addEventListener('pointermove', mv)
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf) }
  }, [ref])
}

/** Κάρτες που γέρνουν σε 3D με το ποντίκι + εμφάνιση με κύλιση */
export function useFx(route: string) {
  useEffect(() => {
    if (reduced()) { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 })
    const t = setTimeout(() => document.querySelectorAll('main .card:not(.face), main .flip, main .section, .risk, .bars3d').forEach((e, i) => {
      e.classList.add('reveal'); (e as HTMLElement).style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(e)
    }), 30)
    return () => { clearTimeout(t); io.disconnect() }
  }, [route])
  useEffect(() => {
    if (reduced() || matchMedia('(hover: none)').matches) return
    let cur: HTMLElement | null = null
    const reset = (c: HTMLElement) => { c.style.removeProperty('--rx'); c.style.removeProperty('--ry') }
    const mv = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest<HTMLElement>('.card:not(.callback):not(.sav-deck):not(.face):not(.step)')
      if (cur && cur !== c) reset(cur); cur = c; if (!c) return
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
      c.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg'); c.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg')
      c.style.setProperty('--gx', (x + .5) * 100 + '%'); c.style.setProperty('--gy', (y + .5) * 100 + '%')
    }
    const out = () => { if (cur) reset(cur); cur = null }
    addEventListener('pointermove', mv); document.addEventListener('pointerleave', out)
    return () => { removeEventListener('pointermove', mv); document.removeEventListener('pointerleave', out) }
  }, [])
}
