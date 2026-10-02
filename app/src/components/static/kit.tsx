import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock, Download, FileText, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt, accentFor, type Accent } from '@/components/ui/accent'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { initialsOf } from '@/components/employee/employee-card'
import { formatPhoneNumber } from '@/components/employee/format-phone'

/*
 * Building blocks for the hand-made static pages (Historie, Úřední deska,
 * poradenství, ...). Content lives directly in each page's TSX, so a change
 * is an edit to that file - no CMS involved.
 */

type SectionProps = {
  eyebrow: string
  title: ReactNode
  accent?: Accent
  id?: string
  children: ReactNode
  className?: string
  /** Light tinted band behind the whole section. */
  tinted?: boolean
}

/** A page section with the playful heading (eyebrow + squiggle). */
export function Section({ eyebrow, title, accent, id, children, className, tinted }: SectionProps) {
  const a = accent ?? accentFor(eyebrow)
  return (
    <section id={id} className={cn('scroll-mt-24 py-10 sm:py-14', tinted && a.tint, className)}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} accent={a} />
        {children}
      </Container>
    </section>
  )
}

/** `+420 775 606 361` -> `tel:+420775606361`. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('+') ? digits : `+420${digits}`}`
}

export type Person = {
  name: string
  role?: string
  place?: ReactNode
  hours?: string
  phones?: string[]
  email?: string
  note?: ReactNode
}

/** Contact card for a named person: initials avatar, role, tap-to-call / tap-to-mail. */
export function PersonCard({ person, className }: { person: Person; className?: string }) {
  const accent = accentFor(person.name)
  // Strip academic titles for the initials ("Mgr. Petr Málek" -> "PM").
  const plain = person.name.replace(/\b(Mgr|Bc|Ing|PhDr|DiS|Dr|PaedDr)\.?,?/g, '').trim()

  return (
    <article className={cn('sticker flex h-full flex-col gap-4 p-5 sm:p-6', className)}>
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className={cn(
            'grid size-16 shrink-0 place-items-center rounded-full border-[2.5px] border-ink font-display text-2xl font-extrabold',
            accent.tint,
            accent.text
          )}
        >
          {initialsOf(plain)}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight">{person.name}</h3>
          {person.role && <p className={cn('m-0 text-sm font-bold', accent.text)}>{person.role}</p>}
        </div>
      </div>
      {(person.place || person.hours) && (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-sm text-gray-7">
          {person.place && (
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {person.place}
            </li>
          )}
          {person.hours && (
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              {person.hours}
            </li>
          )}
        </ul>
      )}
      {person.note && <div className="text-sm text-gray-7">{person.note}</div>}
      {(person.phones?.length || person.email) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {person.phones?.map((phone) => (
            <a key={phone} href={telHref(phone)} className="btn bg-paper px-3.5 py-1.5 text-sm shadow-pop-sm">
              <Phone className="size-4" aria-hidden />
              {formatPhoneNumber(phone.replace(/\D/g, '').replace(/^420/, ''))}
            </a>
          ))}
          {person.email && (
            <a href={`mailto:${person.email}`} className="btn bg-sun px-3.5 py-1.5 text-sm break-all shadow-pop-sm">
              <Mail className="size-4 shrink-0" aria-hidden />
              {person.email}
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export type DocItem = {
  title: string
  href: string
  /** Short hint under the title ("PDF, 14 stran"...). */
  note?: string
}

function extOf(href: string): string {
  const match = href.split('?')[0].match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toUpperCase() : 'WEB'
}

/** Downloadable documents as chunky tiles with the file type badge. */
export function DocList({ docs, className }: { docs: DocItem[]; className?: string }) {
  return (
    <ul className={cn('m-0 grid list-none gap-3 p-0 sm:grid-cols-2', className)}>
      {docs.map((doc, idx) => {
        const accent = accentAt(idx + 2)
        const ext = extOf(doc.href)
        return (
          <li key={doc.href}>
            <Reveal delay={idx * 50} className="h-full">
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group sticker hover-lift flex h-full items-center gap-4 p-4 no-underline"
              >
                <span
                  className={cn(
                    'relative grid size-12 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink transition-transform group-hover:-rotate-6',
                    accent.tint
                  )}
                >
                  <FileText className={cn('size-6', accent.text)} aria-hidden />
                  <span className="absolute -right-2 -bottom-2 rounded-md border-2 border-ink bg-paper px-1 text-[0.6rem] leading-tight font-extrabold">
                    {ext}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-tight font-bold">{doc.title}</span>
                  {doc.note && <span className="block text-sm text-gray-6">{doc.note}</span>}
                </span>
                <Download className="size-5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
              </a>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}

export type LinkItem = { title: string; href: string; note?: string }

/** External links as compact pills with a description. */
export function LinkList({ links, className }: { links: LinkItem[]; className?: string }) {
  return (
    <ul className={cn('m-0 grid list-none gap-3 p-0 sm:grid-cols-2', className)}>
      {links.map((link) => {
        const internal = link.href.startsWith('/')
        const inner = (
          <>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{link.title}</span>
              {link.note && <span className="block text-sm text-gray-6">{link.note}</span>}
            </span>
            <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </>
        )
        const cls =
          'group flex h-full items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 no-underline transition-colors hover:border-ink'
        return (
          <li key={link.href}>
            {internal ? (
              <Link href={link.href} className={cls}>
                {inner}
              </Link>
            ) : (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export type Fact = { icon: LucideIcon; label: string; value: ReactNode; hint?: ReactNode }

/** Big at-a-glance tiles (opening hours, prices, key numbers). */
export function FactGrid({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <ul className={cn('m-0 grid list-none gap-4 p-0 sm:grid-cols-2 md:grid-cols-3', className)}>
      {facts.map((fact, idx) => {
        const accent = accentAt(idx)
        const Icon = fact.icon
        return (
          <li key={fact.label}>
            <Reveal delay={idx * 60} className="h-full">
              <div className={cn('sticker flex h-full flex-col gap-2 p-5', accent.tint)}>
                <span className="flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
                  <Icon className={cn('size-5', accent.text)} aria-hidden />
                  {fact.label}
                </span>
                <span className="font-display text-2xl leading-tight font-extrabold sm:text-3xl">{fact.value}</span>
                {fact.hint && <span className="text-sm text-gray-7">{fact.hint}</span>}
              </div>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}

/** Card with a coloured icon badge - for grouped lists of activities, rules... */
export function IconCard({
  icon: Icon,
  title,
  children,
  accent,
  className
}: {
  icon: LucideIcon
  title: ReactNode
  children: ReactNode
  accent?: Accent
  className?: string
}) {
  const a = accent ?? accentFor(String(title))
  return (
    <article className={cn('sticker flex h-full flex-col gap-3 p-5 sm:p-6', className)}>
      <div className="flex items-center gap-3">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl border-[2.5px] border-ink', a.tint)}>
          <Icon className={cn('size-5', a.text)} aria-hidden />
        </span>
        <h3 className="font-display text-xl leading-tight">{title}</h3>
      </div>
      <div className="text-gray-8 [&_li]:mt-1.5 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:marker:text-gray-5">{children}</div>
    </article>
  )
}

/** Highlighted note / call to action box. */
export function Callout({
  icon: Icon,
  title,
  children,
  accent,
  className
}: {
  icon?: LucideIcon
  title?: ReactNode
  children: ReactNode
  accent?: Accent
  className?: string
}) {
  const a = accent ?? accentAt(0)
  return (
    <div className={cn('flex gap-4 rounded-[var(--radius-large)] border-[2.5px] border-ink p-5 sm:p-6', a.tint, className)}>
      {Icon && (
        <span className="grid size-11 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-paper">
          <Icon className={cn('size-5', a.text)} aria-hidden />
        </span>
      )}
      <div className="min-w-0">
        {title && <h3 className="mb-1 font-display text-xl leading-tight">{title}</h3>}
        <div className="text-gray-8">{children}</div>
      </div>
    </div>
  )
}

/** Native <details> accordion, styled - works without JS, keyboard friendly. */
export function Accordion({ items, className }: { items: { title: ReactNode; content: ReactNode; id?: string }[]; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, idx) => {
        const accent = accentAt(idx + 1)
        return (
          <details key={idx} id={item.id} className="group sticker scroll-mt-24 overflow-hidden p-0 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-display text-lg leading-tight font-bold select-none sm:p-5">
              <span className={cn('size-3 shrink-0 rounded-full border-2 border-ink', accent.bg)} aria-hidden />
              <span className="flex-1">{item.title}</span>
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-xl leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="border-t-2 border-ink/10 px-4 pt-4 pb-5 text-gray-8 sm:px-6 [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
              {item.content}
            </div>
          </details>
        )
      })}
    </div>
  )
}

/** In-page jump links shown under the hero. */
export function JumpNav({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Na této stránce" className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            'rounded-full border-2 border-ink px-3 py-1 text-sm font-bold no-underline shadow-pop-sm transition-transform hover:-translate-y-0.5',
            accentAt(idx).tint
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
