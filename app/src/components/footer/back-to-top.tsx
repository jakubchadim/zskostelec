'use client'

import { Rocket } from '../ui/doodles'

/** Playful "back to top" button - the rocket launches on hover. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group inline-flex items-center gap-2 rounded-full border-2 border-white-1/30 px-4 py-2 font-bold text-white-1 transition-colors hover:border-sun hover:text-sun"
    >
      Nahoru
      <Rocket className="w-6 text-berry transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-12" />
    </button>
  )
}
