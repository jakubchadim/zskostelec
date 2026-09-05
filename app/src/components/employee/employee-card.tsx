import { Briefcase, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { WpImage, type WpMediaLike } from '@/components/image/wp-image'
import { formatPhoneNumber } from './format-phone'

type EmployeeCardProps = {
  name: string
  photo: WpMediaLike | null
  position?: string
  location?: string
  phone?: string
  email?: string
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-gray-7 first:mt-0">
      <span className="text-secondary-1">{icon}</span>
      {children}
    </div>
  )
}

/** One employee row-card: photo, name, and translated position/building plus contact links.
 * Port of web/src/components/employee/employee.tsx + ui/employee/employee.tsx, restyled with
 * Tailwind (a simplified, non-floating responsive layout rather than the legacy CSS-float trick). */
export function EmployeeCard({ name, photo, position, location, phone, email }: EmployeeCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-medium bg-white-1 p-4 shadow-lift sm:flex-row">
      {photo && (
        <div className="h-32 w-32 shrink-0 self-center overflow-hidden rounded-small bg-gray-2 sm:h-40 sm:w-40 sm:self-auto">
          <WpImage media={photo} alt={name} className="h-full w-full object-cover" sizes="10rem" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="mt-0 mb-2 text-[1.5625rem] font-light text-secondary-1">{name}</h2>
        {position && (
          <ContactRow icon={<Briefcase size={18} />}>
            <span>{position}</span>
          </ContactRow>
        )}
        {phone && (
          <ContactRow icon={<Phone size={18} />}>
            <a href={`tel:${phone}`} className="hover:text-primary-1">
              {formatPhoneNumber(phone)}
            </a>
          </ContactRow>
        )}
        {email && (
          <ContactRow icon={<Mail size={18} />}>
            <a href={`mailto:${email}`} className="hover:text-primary-1">
              {email}
            </a>
          </ContactRow>
        )}
        {location && (
          <ContactRow icon={<MapPin size={18} />}>
            <span>{location}</span>
          </ContactRow>
        )}
      </div>
    </div>
  )
}
