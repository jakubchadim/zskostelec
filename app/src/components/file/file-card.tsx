import { Download } from 'lucide-react'
import { getFileIcon } from './file-icon'

type FileCardProps = {
  name: string
  href?: string
}

/** One document/file row: icon (by extension), filename, extension badge, download button.
 * Port of web/src/components/file/file.tsx + ui/file/file.tsx, restyled with Tailwind. */
export function FileCard({ name, href }: FileCardProps) {
  const extension = href?.split('.').pop()
  const Icon = getFileIcon(extension)

  return (
    <div className="flex items-center gap-4 rounded-medium bg-white-1 p-4 shadow-lift">
      {/* eslint-disable-next-line react-hooks/static-components -- Icon is one of a fixed set of
          stateless lucide icon components chosen by file extension, not created dynamically */}
      <Icon size={34} className="shrink-0 text-secondary-1" />
      <div className="min-w-0 flex-1 truncate">{name}</div>
      {extension && <div className="shrink-0 text-right text-sm font-bold opacity-50">.{extension}</div>}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-small bg-primary-1 px-3 py-2 text-sm font-medium text-white-1 hover:bg-primary-2"
        >
          <Download size={16} />
          Stáhnout
        </a>
      )}
    </div>
  )
}
