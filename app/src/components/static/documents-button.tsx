import Link from 'next/link'
import { FolderOpen } from 'lucide-react'
import { documentsHref } from '@/components/file/filter'
import { cn } from '@/lib/utils'

/** "Dokumenty" button for a static page's hero: opens /dokumenty/ filtered to that page's document category. */
export function DocumentsButton({ category, className }: { category: string; className?: string }) {
  return (
    <Link href={documentsHref(category)} className={cn('btn bg-paper text-lg', className)}>
      <FolderOpen className="size-5" aria-hidden />
      Dokumenty
    </Link>
  )
}
