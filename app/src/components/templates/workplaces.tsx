import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { TownPopover } from '@/components/home/town-popover'
import { WorkplacesExplorer } from '@/components/workplaces/workplaces-explorer'
import { WORKPLACES, type WorkplaceWithLive } from '@/components/workplaces/data'
import { getBuildings, getEmployees } from '@/lib/content'

/** WP slug of the page that gets the interactive town map instead of plain content. */
export const WORKPLACES_SLUG = 'pracoviste'

/** Building photos and the classic map (no-WebGL fallback) live in public/soubory/pracoviste/. */
const MAP_URL = '/soubory/pracoviste/mapa.jpg'

/**
 * "Pracoviště" page: a 3D model of the town with the four school buildings,
 * their photos, and staff counts from the staff list in the CMS.
 */
export async function WorkplacesTemplate() {
  const [buildings, employees] = await Promise.all([getBuildings(), getEmployees()])

  const workplaces: WorkplaceWithLive[] = WORKPLACES.map((workplace) => {
    const building = buildings.find((b) => b.workplace === workplace.key)
    const staffCount = building ? employees.filter((e) => e.buildingIds.includes(building.id)).length : 0
    return { ...workplace, photo: `/soubory/pracoviste/${workplace.key}.jpg`, staffCount, buildingId: building ? Number(building.id) : null }
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
        <WorkplacesExplorer workplaces={workplaces} mapUrl={MAP_URL} />
      </Container>
    </>
  )
}
