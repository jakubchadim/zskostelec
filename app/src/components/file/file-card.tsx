import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFileIcon } from './file-icon'

type FileCardProps = {
  name: string
  href?: string
}

/** Colour per file family, so a PDF/Word/Excel is recognisable at a glance. */
function toneFor(extension?: string): string {
  switch (extension?.toLowerCase()) {
    case 'pdf':
      return 'bg-berry-tint text-[#b3164a]'
    case 'doc':
    case 'docx':
    case 'txt':
      return 'bg-sky-tint text-[#0f5fb3]'
    case 'xls':
    case 'xlsx':
      return 'bg-grass-tint text-[#16784a]'
    case 'ppt':
    case 'pptx':
      return 'bg-tangerine-tint text-primary-3'
    default:
      return 'bg-grape-tint text-[#5b2fc2]'
  }
}

/** One document row: coloured file-type icon, name, extension tag and a download pill.
 * The whole row is the link (bigger tap target than the old small button). */
export function FileCard({ name, href }: FileCardProps) {
  const extension = href?.split('.').pop()?.split('?')[0]
  const Icon = getFileIcon(extension)
  const known = extension && extension.length <= 4

  const inner = (
    <>
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink', toneFor(extension))}>
        {/* eslint-disable-next-line react-hooks/static-components -- one of a fixed set of lucide icons chosen by extension */}
        <Icon className="size-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 font-bold leading-snug text-ink">{name}</span>
        {known && <span className="mt-0.5 block text-xs font-extrabold tracking-wider text-gray-6 uppercase">{extension}</span>}
      </span>
      {href && (
        <span className="hidden shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-2 font-display text-sm font-bold transition-transform group-hover:-translate-y-0.5 xs:inline-flex">
          <Download className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
          Stáhnout
        </span>
      )}
    </>
  )

  const cls = 'group flex items-center gap-4 rounded-[1.25rem] border-[2.5px] border-ink bg-paper p-3 pr-4 no-underline! shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop'

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls} aria-label={`Stáhnout ${name}${known ? ` (${extension})` : ''}`}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}
