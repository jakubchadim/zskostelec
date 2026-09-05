import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Container } from '@/components/ui/container'

/** 404 page, loosely porting the visuals of
 * web/src/components/nonIdealState/nonIdealState.tsx. */
export default function NotFound() {
  return (
    <section className="py-8 text-center sm:py-10 md:py-12">
      <Container>
        <FileQuestion className="mx-auto mb-4 size-12 text-gray-6" aria-hidden />
        <h2 className="mt-0">404</h2>
        <p className="mx-auto max-w-[25rem]">Hledaná stránka nebyla nalezena.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-small bg-primary-1/10 px-3 py-2 font-medium text-primary-1 no-underline hover:bg-primary-2/10"
        >
          Hlavní strana
        </Link>
      </Container>
    </section>
  )
}
