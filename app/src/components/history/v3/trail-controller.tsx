'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Hiker } from './hiker'
import { KCT_RED } from './marks'
import { markVisited, setKm } from './store'
import s from './trail.module.css'

/*
 * Draws the winding trail behind the stops and walks the hiker along it.
 *
 * - Geometry is measured in a ResizeObserver callback: every stop has a
 *   `[data-anchor]` (the foot of its signpost, or the paint mark in the
 *   mobile gutter) and the path is a chain of S-curves through them.
 * - The path is sampled into a lookup table; because it only ever goes
 *   down, the point "under" the reading line is a binary search by y.
 * - On scroll (rAF-throttled) the trail is revealed up to the reading
 *   line (a clip rect), the hiker is moved there, cards near the viewport
 *   get `data-near` (pop in) and passed stops get `data-reached` (stamp).
 *
 * Everything per-frame is a direct DOM write - no React state - so the
 * page stays smooth. Without JS the stops simply render as a list.
 */

const TRAIL_KM = 40
/** The hiker walks at this fraction of the viewport height. */
const READ_LINE = 0.58

type Pt = { x: number; y: number }
type Tuft = { x: number; y: number; kind: 0 | 1 | 2 }
type StopGeo = { el: HTMLElement; id: string; top: number; anchorY: number }

type Geo = {
  w: number
  h: number
  d: string
  xs: Float32Array
  ys: Float32Array
  ls: Float32Array
  total: number
  river: { y: number; d: string; bridge: Pt } | null
  tufts: Tuft[]
  desktop: boolean
}

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y }
}

/** Index of the first sample with value >= v (arrays are non-decreasing). */
function search(arr: Float32Array, v: number) {
  let lo = 0
  let hi = arr.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] < v) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  return lo
}

function sampleAt(geo: Geo, arr: Float32Array, v: number) {
  const i = Math.max(1, search(arr, v))
  const a = arr[i - 1]
  const b = arr[i]
  const t = b > a ? Math.min(1, Math.max(0, (v - a) / (b - a))) : 0
  return {
    x: geo.xs[i - 1] + (geo.xs[i] - geo.xs[i - 1]) * t,
    y: geo.ys[i - 1] + (geo.ys[i] - geo.ys[i - 1]) * t,
    len: geo.ls[i - 1] + (geo.ls[i] - geo.ls[i - 1]) * t,
    dx: geo.xs[i] - geo.xs[i - 1]
  }
}

function buildGeo(anchors: Pt[], sides: number[], w: number, h: number, riverY: number | null, desktop: boolean): Geo {
  const amp = desktop ? 42 : 13
  const pts: Pt[] = [{ x: anchors[0].x, y: 0 }, ...anchors, { x: anchors[anchors.length - 1].x, y: h }]
  // Preferred bulge direction when leaving / arriving at each point (0 = any):
  // on desktop the trail must swing away from the signpost, never through it.
  const pref = [0, ...sides, 0]
  const segs: [Pt, Pt, Pt, Pt][] = []
  let sign = 1
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    let n = Math.max(1, Math.round((b.y - a.y) / (desktop ? 300 : 220)))
    if (pref[i]) {
      sign = pref[i]
    } else if (pref[i + 1]) {
      sign = n % 2 ? pref[i + 1] : -pref[i + 1]
    }
    if (pref[i] && pref[i + 1] && sign * (n % 2 ? 1 : -1) !== pref[i + 1]) {
      n += 1
    }
    for (let j = 0; j < n; j++) {
      const p = lerp(a, b, j / n)
      const q = lerp(a, b, (j + 1) / n)
      const dy = q.y - p.y
      segs.push([p, { x: p.x + sign * amp, y: p.y + dy * 0.38 }, { x: q.x + sign * amp, y: q.y - dy * 0.38 }, q])
      sign = -sign
    }
  }

  const STEPS = 36
  const count = segs.length * STEPS + 1
  const xs = new Float32Array(count)
  const ys = new Float32Array(count)
  const ls = new Float32Array(count)
  let k = 0
  let len = 0
  let prev = segs[0][0]
  xs[0] = prev.x
  ys[0] = prev.y
  for (const seg of segs) {
    for (let st = 1; st <= STEPS; st++) {
      const pt = cubic(seg[0], seg[1], seg[2], seg[3], st / STEPS)
      len += Math.hypot(pt.x - prev.x, pt.y - prev.y)
      k++
      xs[k] = pt.x
      ys[k] = Math.max(pt.y, ys[k - 1])
      ls[k] = len
      prev = pt
    }
  }
  const f = (n: number) => n.toFixed(1)
  const d = `M${f(segs[0][0].x)} ${f(segs[0][0].y)}${segs.map(([, c1, c2, q]) => `C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(q.x)} ${f(q.y)}`).join('')}`

  const geo: Geo = { w, h, d, xs, ys, ls, total: len, river: null, tufts: [], desktop }

  if (riverY !== null) {
    // runs far past the column; the section clips it at the viewport edges
    let rd = `M-1400 ${f(riverY)}`
    for (let x = -1400, i = 0; x < w + 1400; x += 70, i++) {
      rd += ` Q${f(x + 35)} ${f(riverY + (i % 2 ? 9 : -9))} ${f(x + 70)} ${f(riverY)}`
    }
    const at = sampleAt(geo, ys, riverY)
    geo.river = { y: riverY, d: rd, bridge: { x: at.x, y: at.y } }
  }

  // Grass tufts, flowers and pebbles along the way.
  const step = desktop ? 120 : 150
  const side = desktop ? 30 : 15
  for (let l = 60, i = 0; l < len - 40; l += step, i++) {
    const at = sampleAt(geo, ls, l)
    if (geo.river && Math.abs(at.y - geo.river.y) < 60) {
      continue
    }
    geo.tufts.push({ x: at.x + (i % 2 ? side : -side), y: at.y + 6, kind: (i % 3) as 0 | 1 | 2 })
  }
  return geo
}

function Tuft({ x, y, kind }: Tuft) {
  if (kind === 0) {
    return <path d={`M${x - 7} ${y} q2 -10 4 -12 M${x} ${y} q0 -12 0 -15 M${x + 7} ${y} q-2 -10 -4 -12`} stroke="#16784a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  }
  if (kind === 1) {
    return (
      <g>
        <path d={`M${x} ${y} v-11`} stroke="#16784a" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={x} cy={y - 14} r="5" fill="#ff5c8a" stroke="#1d2150" strokeWidth="2" />
        <circle cx={x} cy={y - 14} r="1.8" fill="#ffcf33" />
      </g>
    )
  }
  return <ellipse cx={x} cy={y - 3} rx="7" ry="4.5" fill="#d9ccb8" stroke="#1d2150" strokeWidth="2" />
}

export function TrailController({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<SVGRectElement>(null)
  const hikerRef = useRef<HTMLDivElement>(null)
  const hikerFlipRef = useRef<HTMLDivElement>(null)
  const geoRef = useRef<Geo | null>(null)
  const stopsRef = useRef<StopGeo[]>([])
  const [geo, setGeo] = useState<Geo | null>(null)
  const clipId = `v3-trail-clip-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  // Measure: anchors -> path geometry.
  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }
    root.dataset.armed = ''

    const measure = () => {
      const box = root.getBoundingClientRect()
      const stops: StopGeo[] = []
      const anchors: Pt[] = []
      const sides: number[] = []
      let riverY: number | null = null
      const items = Array.from(root.querySelectorAll<HTMLElement>('[data-stop]'))
      items.forEach((el, i) => {
        const anchor = Array.from(el.querySelectorAll<HTMLElement>('[data-anchor]')).find((a) => a.getClientRects().length > 0)
        const r = el.getBoundingClientRect()
        const a = anchor?.getBoundingClientRect()
        const pt = a ? { x: a.left + a.width / 2 - box.left, y: a.top + a.height / 2 - box.top } : { x: 24, y: r.top - box.top + 30 }
        anchors.push(pt)
        sides.push(Number(anchor?.dataset.side ?? 0))
        stops.push({ el, id: el.dataset.stop ?? '', top: r.top - box.top, anchorY: pt.y })
        if (el.dataset.riverAfter !== undefined && items[i + 1]) {
          const next = items[i + 1].getBoundingClientRect()
          // middle of the gap below this stop's content (its bottom padding)
          const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0
          riverY = Math.min(r.bottom - pad / 2, next.top - 30) - box.top
        }
      })
      if (!anchors.length) {
        return
      }
      const desktop = window.matchMedia('(min-width: 55.125em)').matches
      const next = buildGeo(anchors, sides, box.width, box.height, riverY, desktop)
      stopsRef.current = stops
      geoRef.current = next
      setGeo(next)
    }

    const ro = new ResizeObserver(() => measure())
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  // Scroll: reveal, walk, pop in, stamp.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !geo) {
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let idle: ReturnType<typeof setTimeout> | undefined
    let facing = 1

    const update = () => {
      frame = 0
      const g = geoRef.current
      if (!g) {
        return
      }
      const box = root.getBoundingClientRect()
      const vh = window.innerHeight
      const lineY = Math.min(g.h, Math.max(0, vh * READ_LINE - box.top))
      const at = sampleAt(g, g.ys, lineY)

      const shown = reduce.matches ? g.h : at.y
      clipRef.current?.setAttribute('height', String(Math.max(0, shown + 2)))

      const hiker = hikerRef.current
      if (hiker) {
        hiker.style.transform = `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0)`
        if (Math.abs(at.dx) > 0.35) {
          facing = at.dx > 0 ? 1 : -1
        }
        if (hikerFlipRef.current) {
          hikerFlipRef.current.style.transform = `scaleX(${facing})`
        }
      }

      const reached: string[] = []
      for (const stop of stopsRef.current) {
        if (reduce.matches || box.top + stop.top < vh * 0.9) {
          stop.el.dataset.near = ''
        }
        if (stop.anchorY <= lineY + 1) {
          if (stop.el.dataset.reached === undefined) {
            stop.el.dataset.reached = ''
          }
          reached.push(stop.id)
        }
      }
      markVisited(reached)
      setKm(Math.round((at.len / g.total) * TRAIL_KM * 10) / 10)
    }

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
      const hiker = hikerRef.current
      if (hiker && !reduce.matches) {
        hiker.dataset.walking = ''
        clearTimeout(idle)
        idle = setTimeout(() => {
          delete hiker.dataset.walking
        }, 220)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [geo])

  return (
    <div ref={rootRef} className={cn(s.root, 'relative')}>
      {geo && (
        <svg
          aria-hidden
          focusable={false}
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect ref={clipRef} x={-200} y={-50} width={geo.w + 400} height={0} />
            </clipPath>
          </defs>
          {geo.river && <River river={geo.river} w={geo.w} desktop={geo.desktop} />}
          {/* the whole route, faintly pencilled in */}
          <path d={geo.d} fill="none" stroke="#1d2150" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="1 11" strokeLinecap="round" />
          {/* the part already walked */}
          <g clipPath={`url(#${clipId})`}>
            <path d={geo.d} fill="none" stroke="#1d2150" strokeWidth={geo.desktop ? 21 : 15} strokeLinecap="round" />
            <path d={geo.d} fill="none" stroke="#f3dcae" strokeWidth={geo.desktop ? 16 : 10.5} strokeLinecap="round" />
            <path d={geo.d} fill="none" stroke={KCT_RED} strokeWidth={geo.desktop ? 4 : 3} strokeDasharray="14 12" strokeLinecap="round" />
          </g>
          {geo.river && <Bridge at={geo.river.bridge} desktop={geo.desktop} />}
          {geo.tufts.map((t, i) => (
            <Tuft key={i} {...t} />
          ))}
        </svg>
      )}
      {children}
      {geo && (
        <div ref={hikerRef} aria-hidden className={s.hikerSlot}>
          <div ref={hikerFlipRef} className={s.hikerFlip}>
            <Hiker />
          </div>
        </div>
      )}
    </div>
  )
}

function River({ river, w, desktop }: { river: NonNullable<Geo['river']>; w: number; desktop: boolean }) {
  const width = desktop ? 34 : 26
  return (
    <g>
      <path d={river.d} fill="none" stroke="#1d2150" strokeWidth={width + 6} />
      <path d={river.d} fill="none" stroke="#3a9bff" strokeWidth={width} />
      <path d={river.d} fill="none" stroke="#dcedff" strokeWidth="2.5" strokeDasharray="10 26" strokeLinecap="round" transform="translate(0 -5)" />
      <path d={river.d} fill="none" stroke="#dcedff" strokeWidth="2.5" strokeDasharray="6 30" strokeLinecap="round" transform="translate(14 6)" />
      <text
        x={desktop ? w - 24 : w - 8}
        y={river.y + width / 2 + 22}
        textAnchor="end"
        fontSize="15"
        fontStyle="italic"
        fontWeight="800"
        fill="#0f5fb3"
        fontFamily="var(--font-display)"
      >
        řeka Orlice
      </text>
    </g>
  )
}

function Bridge({ at, desktop }: { at: Pt; desktop: boolean }) {
  const bw = desktop ? 46 : 32
  const bh = desktop ? 58 : 46
  const x = at.x - bw / 2
  const y = at.y - bh / 2
  const planks = []
  for (let py = y + 6; py < y + bh - 4; py += 8) {
    planks.push(<path key={py} d={`M${x + 3} ${py} H${x + bw - 3}`} stroke="#8a5427" strokeWidth="1.8" />)
  }
  return (
    <g>
      <rect x={x} y={y} width={bw} height={bh} rx="4" fill="#d9a066" stroke="#1d2150" strokeWidth="2.6" />
      {planks}
      <path d={`M${x - 5} ${y - 2} V${y + bh + 2} M${x + bw + 5} ${y - 2} V${y + bh + 2}`} stroke="#1d2150" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x - 5} ${y - 2} V${y + bh + 2} M${x + bw + 5} ${y - 2} V${y + bh + 2}`} stroke="#b9783f" strokeWidth="3.4" strokeLinecap="round" />
    </g>
  )
}
