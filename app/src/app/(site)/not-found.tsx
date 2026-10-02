import Link from 'next/link'
import { Home } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Cloud, PaperPlane, Star } from '@/components/ui/doodles'

/** 404 - the page flew away like a paper plane. */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute top-10 w-32 text-white-1 animate-drift" />
        <Star className="absolute right-[12%] bottom-16 w-10 text-sun animate-float" />
      </div>
      <Container className="relative text-center">
        <div className="relative mx-auto w-fit">
          <span className="font-display text-[7rem] leading-none font-extrabold text-tangerine [-webkit-text-stroke:3px_var(--color-ink)] sm:text-[10rem]">
            404
          </span>
          <PaperPlane className="absolute -top-4 -right-16 w-20 text-sky animate-fly sm:-right-24 sm:w-28" />
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl">Ups! Tahle stránka utekla o přestávce</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-gray-7">
          Možná se přestěhovala, nebo byl v odkazu překlep. Zkuste to z hlavní stránky.
        </p>
        <Link href="/" className="btn mt-8 bg-sun text-lg">
          <Home className="size-5" aria-hidden />
          Zpět na hlavní stránku
        </Link>
      </Container>
    </section>
  )
}
