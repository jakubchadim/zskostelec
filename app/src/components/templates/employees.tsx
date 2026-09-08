import { notFound } from 'next/navigation'
import { BlockContent } from '@/components/block/content'
import { Section } from '@/components/block/section'
import { EmployeesExplorer } from '@/components/employee/employees-explorer'
import { Container } from '@/components/ui/container'
import { getBuildings, getEmployees, getPageById, getPositions, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Employees page (page.template === EMPLOYEES) - port of web/src/templates/allEmployee.tsx:
 * page intro + a filterable employee listing (see EmployeesExplorer). */
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

  const title = (
    <Container>
      <h1 className="top">{page.title}</h1>
    </Container>
  )

  return (
    <>
      {page.blocks.length > 0 ? (
        <BlockContent blocks={page.blocks} title={title} />
      ) : (
        <Section>
          {title}
          <Container>
            {/* See templates/page.tsx for why this is plain dangerouslySetInnerHTML. */}
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </Container>
        </Section>
      )}
      <Container>
        <div className="pt-1 pb-4 sm:py-4 md:pt-8 md:pb-4">
          <EmployeesExplorer employees={employees} positions={positions} buildings={buildings} />
        </div>
      </Container>
    </>
  )
}
