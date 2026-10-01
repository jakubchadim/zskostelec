import { Mail, MapPin, Phone } from 'lucide-react'
import { WpImage, type WpMediaLike } from '@/components/image/wp-image'
import { accentFor } from '@/components/ui/accent'
import { cn } from '@/lib/utils'
import { formatPhoneNumber } from './format-phone'

type EmployeeCardProps = {
  name: string
  photo: WpMediaLike | null
  positions?: string[]
  location?: string
  phone?: string
  email?: string
}

/** "Němec Jiří, Mgr." -> "NJ" for the avatar fallback. */
export function initialsOf(name: string): string {
  return name
    .split(',')[0]
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** One staff member: round photo (or colourful initials), name, role chips and tap-to-call/mail buttons. */
export function EmployeeCard({ name, photo, positions = [], location, phone, email }: EmployeeCardProps) {
  const accent = accentFor(name)
  const [surnameFirst, titles] = name.split(/,(.+)/)

  return (
    <article className="sticker hover-lift flex h-full flex-col p-5">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-[2.5px] border-ink font-display text-2xl font-extrabold',
            accent.tint,
            accent.text
          )}
        >
          {photo ? (
            <WpImage media={photo} alt="" className="h-full w-full object-cover" sizes="6rem" />
          ) : (
            <span aria-hidden>{initialsOf(name)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-xl leading-tight">{surnameFirst.trim()}</h2>
          {titles && <span className="text-sm font-semibold text-gray-6">{titles.trim()}</span>}
        </div>
      </div>

      {positions.length > 0 && (
        <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
          {positions.map((role) => (
            <li key={role} className={cn('rounded-full px-2.5 py-0.5 text-xs font-extrabold', accent.tint, accent.text)}>
              {role}
            </li>
          ))}
        </ul>
      )}

      {location && (
        <p className="mt-3 mb-0 flex gap-2 text-sm text-gray-7">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          {location}
        </p>
      )}

      {(phone || email) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-grass-tint px-3 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              <Phone className="size-4" aria-hidden />
              {formatPhoneNumber(phone)}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border-2 border-ink bg-sky-tint px-3 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
              title={email}
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{email}</span>
            </a>
          )}
        </div>
      )}
    </article>
  )
}
