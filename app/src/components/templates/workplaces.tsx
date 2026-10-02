import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { TownPopover } from '@/components/home/town-popover'
import { WorkplacesExplorer } from '@/components/workplaces/workplaces-explorer'
import { WORKPLACES, extractPhotos, type WorkplaceWithLive } from '@/components/workplaces/data'
import { getBuildings, getEmployees, type WpPage } from '@/lib/wp'

/** WP slug of the page that gets the interactive town map instead of plain content. */
export const WORKPLACES_SLUG = 'pracoviste'

/**
 * "Pracoviště" page: a 3D model of the town with the four school buildings.
 * Photos (and the original map, used as the no-WebGL fallback) still come
 * from the WP page content, so editors can swap them; staff counts come
 * live from the employees CPT.
 */
export async function WorkplacesTemplate({ page }: { page: WpPage }) {
  const [buildings, employees] = await Promise.all([getBuildings(), getEmployees()])
  const { map, photos } = extractPhotos(page.content)

  const workplaces: WorkplaceWithLive[] = WORKPLACES.map((workplace) => {
    const building = buildings.find((b) => b.name.includes(workplace.buildingMatch))
    const staffCount = building ? employees.filter((e) => e.buildingIds.includes(building.id)).length : 0
    return { ...workplace, photo: photos[workplace.key], staffCount, buildingId: building ? Number(building.id) : null }
  })

  return (
    <>
      <PageHero
        title="Kde nás najdete"
        colorKey="pracoviste"
        eyebrow="Pracoviště školy"
        lead={
          <>
            Škola má v <TownPopover mapLink={false}>Kostelci nad Orlicí</TownPopover> čtyři budovy. Projděte si město – klikněte
            na budovu a podívejte se, co se v ní děje.
          </>
        }
      />
      <Container className="pt-2">
        <WorkplacesExplorer workplaces={workplaces} mapUrl={map} />
      </Container>
    </>
  )
}
