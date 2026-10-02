import { SchoolMark } from '@/components/ui/school-logo'

/** Login screen logo: the school mark + name. */
export function Logo() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span className="zs-mark" style={{ width: 64, height: 64 }}>
        <SchoolMark outline="#1d2150" />
      </span>
      <span style={{ lineHeight: 1.1 }}>
        <span style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: '#b35300' }}>ZÁKLADNÍ ŠKOLA</span>
        <span style={{ display: 'block', fontSize: 24, fontWeight: 800 }}>Gutha-Jarkovského</span>
        <span style={{ display: 'block', fontSize: 13, opacity: 0.7 }}>Správa webu</span>
      </span>
    </span>
  )
}

/** Small icon in the admin's top bar. */
export function Icon() {
  return (
    <span className="zs-mark" style={{ width: '100%', height: '100%' }}>
      <SchoolMark outline="#1d2150" />
    </span>
  )
}
