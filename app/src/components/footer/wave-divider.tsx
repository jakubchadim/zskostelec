type WaveDividerProps = {
  className?: string
}

/** Decorative wave divider, ported from web/src/components/ui/shape/shape.tsx.
 * Color comes from `currentColor` — set a text color on `className`. */
export function WaveDivider({ className }: WaveDividerProps) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 2880 48"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full origin-top scale-200 fill-current"
      >
        <path d="M0 48h2880V0h-720C1442.5 52 720 0 720 0H0v48z" />
      </svg>
    </div>
  )
}
