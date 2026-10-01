import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { EmployeesExplorer } from '@/components/employee/employees-explorer'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { getBuildings, getEmployees, getPageById, getPositions, type ResolvedRoute } from '@/lib/wp'
import { PageBody } from './page-body'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Staff directory: hero + page intro + searchable/filterable staff cards. */
export async function EmployeesTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const [page, employees, positions, buildings] = await Promise.all([
    getPageById(route.id),
    getEmployees(),
    getPositions(),
    getBuildings()
  ])

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageHero
        title={null}
        titleHtml={page.title}
        colorKey="zamestnanci"
        eyebrow="Kdo je kdo"
        lead="Najděte učitele, vychovatele i další kolegy. Hledejte podle jména, pozice nebo budovy."
      />
      <PageBody page={page} intro />
      <Container className="pt-4">
        {/* Suspense: the explorer reads `?pracoviste=` via useSearchParams. */}
        <Suspense>
          <EmployeesExplorer employees={employees} positions={positions} buildings={buildings} />
        </Suspense>
      </Container>
    </>
  )
}
