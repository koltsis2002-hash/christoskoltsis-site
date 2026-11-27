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

/** Εμφάνιση με κύλιση */
export function useFx(route: string) {
  useEffect(() => {
    if (reduced()) { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 })
    const t = setTimeout(() => document.querySelectorAll('main .card:not(.face), main .flip, main .section, .risk, .bars3d').forEach((e, i) => {
      e.classList.add('reveal'); (e as HTMLElement).style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(e)
    }), 30)
    return () => { clearTimeout(t); io.disconnect() }
  }, [route])
}
