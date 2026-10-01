'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Hand, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const SchoolDiorama = dynamic(() => import('./school-diorama'), { ssr: false })

function subscribeNoop() {
  return () => {}
}
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/**
 * Homepage wrapper for the 3D school diorama. three.js is only downloaded
 * once the block scrolls near the viewport; until then (and without WebGL)
 * the bundled school illustration is shown instead.
 */
export function SchoolDioramaLazy({ href }: { href: string }) {
  const router = useRouter()
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [night, setNight] = useState(false)
  const webgl = useSyncExternalStore(subscribeNoop, hasWebGL, () => false)
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )

  useEffect(() => {
    const node = box.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const show3d = webgl && visible

  return (
    <div
      ref={box}
      className={cn(
        'relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[1.75rem] transition-colors duration-700',
        night && ready ? 'bg-ink' : 'bg-transparent'
      )}
    >
      {(!show3d || !ready) && (
        // eslint-disable-next-line @next/next/no-img-element -- bundled illustration (placeholder / no-WebGL fallback)
        <img
          src="/school.png"
          alt="Ilustrace školní budovy"
          width={1600}
          height={1020}
          className={cn('absolute inset-0 m-auto w-full object-contain transition-opacity', show3d && 'opacity-40')}
        />
      )}

      {show3d && (
        <div className={cn('absolute inset-0 transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}>
          <SchoolDiorama
            night={night}
            reducedMotion={reducedMotion}
            onOpen={() => router.push(`${href}#palackeho`)}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      {show3d && ready && (
        <>
          <button
            type="button"
            onClick={() => setNight((value) => !value)}
            aria-pressed={night}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold shadow-pop-sm transition-transform hover:-translate-y-0.5"
          >
            {night ? (
              <Sun className="size-4 text-primary-3" aria-hidden />
            ) : (
              <Moon className="size-4 text-grape" aria-hidden />
            )}
            {night ? 'Den' : 'Noc'}
          </button>
          <p className="pointer-events-none absolute bottom-3 left-3 m-0 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-bold text-gray-7">
            <Hand className="size-3.5" aria-hidden />
            Otáčej tažením · klikni na školu
          </p>
        </>
      )}
    </div>
  )
}
