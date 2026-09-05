import { notFound } from 'next/navigation'
import { getStaticRoutes, resolveRoute } from '@/lib/wp'
import { templateRegistry } from '@/components/templates/registry'
import { templateKeyForRoute } from '@/components/templates/route-mapping'

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const resolved = await resolveRoute(slug ?? [])

  if (!resolved) {
    notFound()
  }

  const Template = templateRegistry[templateKeyForRoute(resolved)]

  if (!Template) {
    notFound()
  }

  return <Template data={resolved} />
}

export async function generateStaticParams() {
  // Without a reachable WP (or WP_URL unset, e.g. CI), build nothing statically;
  // `dynamicParams` serves every route on demand via ISR instead.
  if (!process.env.WP_URL) {
    return []
  }

  try {
    const routes = await getStaticRoutes()

    return routes.map(({ path }) => ({
      slug: path.split('/').filter(Boolean)
    }))
  } catch (error) {
    console.warn('[generateStaticParams] WP unreachable, falling back to fully dynamic rendering:', error)
    return []
  }
}

export const dynamicParams = true
