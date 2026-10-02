'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/** A value (IČ, account number...) with a one-click copy button. */
export function CopyValue({ value, copyText, className }: { value: string; copyText?: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? value.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure context, permissions) - the value is still selectable.
    }
  }

  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <span className="font-display text-xl font-bold select-all">{value}</span>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold transition-colors',
          copied ? 'bg-grass-tint' : 'bg-paper hover:bg-sun-tint'
        )}
        aria-label={copied ? 'Zkopírováno' : `Zkopírovat ${value}`}
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? 'Zkopírováno' : 'Kopírovat'}
      </button>
    </span>
  )
}
