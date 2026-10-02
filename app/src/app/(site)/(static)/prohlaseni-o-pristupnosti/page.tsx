import { AlertTriangle, CheckCircle2, FileText, Mail, Scale } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { Container } from '@/components/ui/container'
import { accentAt } from '@/components/ui/accent'
import { Callout, IconCard } from '@/components/static/kit'
import { staticPageMetadata } from '@/components/static/meta'

export const metadata = staticPageMetadata({
  title: 'Prohlášení o přístupnosti',
  description: 'Prohlášení o přístupnosti webu www.zskostelec.cz podle zákona č. 99/2019 Sb.',
  path: '/prohlaseni-o-pristupnosti/'
})

export default function ProhlaseniOPristupnostiPage() {
  return (
    <>
      <PageHero title="Prohlášení o přístupnosti" colorKey="prohlaseni-o-pristupnosti" eyebrow="Web www.zskostelec.cz" />
      <Container className="grid max-w-prose gap-6 py-10 text-lg">
        <p className="m-0">
          Provozovatel tohoto webu se zavazuje ke zpřístupnění obsahu v souladu se směrnicí Evropského parlamentu a Rady (EU)
          2016/2102 a se zákonem č. 99/2019 Sb., o přístupnosti internetových stránek a mobilních aplikací. Prohlášení se
          vztahuje na doménu www.zskostelec.cz.
        </p>
        <Callout icon={CheckCircle2} accent={accentAt(3)} title="Stav souladu">
          Stránky jsou v souladu s výše uvedenými předpisy, s normou EN 301 549 V2 1.2 a standardem WCAG 2.1 – s výjimkami
          uvedenými níže.
        </Callout>
        <IconCard icon={AlertTriangle} title="Nepřístupný obsah" accent={accentAt(0)}>
          <p className="m-0">
            Některé dokumenty přicházejí k uveřejnění již nepřístupné (z jiných úřadů, vygenerované účetním systémem apod.) a
            provozovatel je přesto musí zveřejnit. Některé starší fotografie a fotoalba postrádají alternativní textový popis a
            některá vložená videa titulky. Jejich úprava by byla pro provozovatele finančně neúměrně náročná, proto podle § 7
            zákona č. 99/2019 Sb. dodatečně upravovány nejsou.
          </p>
        </IconCard>
        <IconCard icon={FileText} title="Dokumenty ke stažení" accent={accentAt(1)}>
          <p className="m-0">
            Část informací je v souborech PDF – většina prohlížečů je zobrazí přímo, případně poslouží Adobe Reader nebo jiný
            prohlížeč PDF. Dokumenty ve formátech .doc, .docx, .odt, .xls, .xlsx, .ods apod. otevřou běžné kancelářské
            aplikace (MS Office, LibreOffice, OpenOffice).
          </p>
        </IconCard>
        <IconCard icon={Scale} title="Vypracování prohlášení" accent={accentAt(4)}>
          <p className="m-0">
            Při vypracování byly použity uvedené zákony a metodický pokyn MV ČR, norma EN 301 549 V2 1.2 a standard Web Content
            Accessibility Guidelines – WCAG 2.1.
          </p>
        </IconCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="mailto:webmaster@zskostelec.cz" className="sticker hover-lift flex items-center gap-3 p-5 no-underline">
            <Mail className="size-6 text-[#0f5fb3]" aria-hidden />
            <span>
              <span className="block text-sm font-bold text-gray-6">Kontakt na provozovatele</span>
              <span className="font-bold">webmaster@zskostelec.cz</span>
            </span>
          </a>
          <a href="mailto:ja@jakubchadim.cz" className="sticker hover-lift flex items-center gap-3 p-5 no-underline">
            <Mail className="size-6 text-[#b3164a]" aria-hidden />
            <span>
              <span className="block text-sm font-bold text-gray-6">Kontakt na dodavatele webu</span>
              <span className="font-bold">ja@jakubchadim.cz</span>
            </span>
          </a>
        </div>
      </Container>
    </>
  )
}
