import { NavLink } from '../nav/nav-link'
import { Container } from '../ui/container'
import { WaveDivider } from './wave-divider'
import type { NavItem } from '../nav/types'

type FooterProps = {
  fastFirst: NavItem[]
  fastSecond: NavItem[]
}

function FooterNavList({ items }: { items: NavItem[] }) {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {items.map((item, idx) => (
        <li key={`${item.slug ?? item.url}-${idx}`}>
          <NavLink item={item} className="opacity-90 hover:opacity-100" />
          {item.items.length > 0 && (
            <ul className="m-0 mt-1 ml-3 list-none space-y-1 border-l border-white-1/20 p-0 pl-3">
              {item.items.map((child, childIdx) => (
                <li key={`${child.slug ?? child.url}-${childIdx}`}>
                  <NavLink item={child} className="opacity-90 hover:opacity-100" />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

/** Site footer: logo, the two "fast" nav menus, contact block, and a
 * decorative wave divider. Ports web/src/components/footer/footer.tsx. */
export default function Footer({ fastFirst, fastSecond }: FooterProps) {
  return (
    <footer className="relative bg-secondary-3 text-white-1">
      <WaveDivider className="relative z-[5] -mt-4 h-[1.375rem] overflow-hidden text-secondary-3" />
      <Container>
        <div className="mx-auto max-w-[31.25rem] py-8 text-sm sm:pt-12 sm:pb-10 md:max-w-none md:pt-16 md:pb-12">
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4 md:gap-8">
            <div className="hidden md:block">
              <img
                src="/logo.svg"
                alt="Základní škola Gutha Jarkovského Kostelec nad Orlicí"
                width={160}
                height={160}
                className="mx-auto block h-18 w-auto opacity-50"
              />
            </div>
            <div>
              <FooterNavList items={fastFirst} />
            </div>
            <div>
              <FooterNavList items={fastSecond} />
            </div>
            <div className="text-center opacity-70 sm:mt-4 md:mt-0 md:text-left">
              Základní škola Gutha&nbsp;Jarkovského Kostelec nad Orlicí
              <br />
              Palackého náměstí 45,
              <br />
              517 41 Kostelec nad Orlicí
            </div>
          </div>
          <div className="mt-6 text-center opacity-50">ZŠ Kostelec nad Orlicí</div>
        </div>
      </Container>
    </footer>
  )
}
