/**
 * The four school buildings shown on the interactive town map
 * (`/pracoviste/`). Positions are in percent of the original WP map image
 * (`mapa-Kostelec`, 2000x1016 reference), so the 3D scene and any 2D
 * fallback share one coordinate system.
 *
 * Facts come from the school's own pages (Historie, Úřední deska, Školní
 * družina, Výchovné/Kariérové poradenství, Klub rodičů) - keep them in sync
 * when those pages change. Photos and staff counts are filled in at request
 * time from the CMS (see templates/workplaces.tsx).
 */
export type WorkplaceKey = 'palackeho' | 'komenskeho' | 'drtinova' | 'erbenova'

export type BuildingPart = {
  /** Footprint in world units (x = width, z = depth). */
  width: number
  depth: number
  /** Number of storeys (drives height + window rows). */
  floors: number
  wall: string
  /** Lower-floor band colour (Palackého has a darker plinth). */
  plinth?: string
  roof: 'gable' | 'hip' | 'flat'
  roofColor: string
  /** Position inside the building group, in local units (+z = front/entrance side). */
  offset?: [number, number]
}

export type WorkplaceShape = BuildingPart & {
  /** Rotation around Y in radians (positive = counter-clockwise seen from above). */
  rotation: number
  /** Extra connected buildings (e.g. the back wing + link at Palackého náměstí). */
  annexes?: BuildingPart[]
}

/** Radius (local units) that encloses every part of the building - for the lot circle and keeping houses away. */
export function footprintRadius(shape: WorkplaceShape): number {
  return Math.max(
    ...[shape, ...(shape.annexes ?? [])].map((part) => {
      const [ox, oz] = part.offset ?? [0, 0]
      return Math.hypot(ox, oz) + Math.hypot(part.width, part.depth) / 2
    })
  )
}

export type Workplace = {
  key: WorkplaceKey
  /** Short friendly name used on pins and buttons. */
  name: string
  address: string
  /** Map position in percent of the reference map image. */
  mapX: number
  mapY: number
  /** What happens in the building. */
  roles: string[]
  facts: string[]
  /** Optional opening hours line (school club buildings). */
  hours?: string
  /** Accent colour for pin, chips and panel. */
  accent: 'berry' | 'sky' | 'grass' | 'grape'
  shape: WorkplaceShape
  /** Matches the paragraph that introduces this building in the WP page content. */
  contentMatch: string
  /** Which way the map pin's label flies out (Komenského and Erbenova stand close together). */
  pinSide?: 'left' | 'right'
  /** Close-up camera stands front-right of the entrance by default; 'left' avoids a neighbour in the way. */
  cameraFrom?: 'left' | 'right'
}

export const WORKPLACES: Workplace[] = [
  {
    key: 'palackeho',
    name: 'Budova na náměstí',
    address: 'Palackého náměstí 45',
    mapX: 62.4,
    mapY: 52.6,
    roles: ['2. stupeň', 'Sídlo a ředitelství školy', 'Vzdělávání cizinců'],
    facts: [
      'Dům postavili v 70. letech 19. století pro hraběcí odborníky, kteří stavěli cukrovar a železnici.',
      'Škole slouží od roku 1875 – je to nejstarší z našich budov.',
      'Sídlí tu výchovná poradkyně i kariérový poradce a každý čtvrtek sem za žáky 2. stupně chodí pracovnice NZDM Klídek.',
      'Podatelna: tel. 775 598 553'
    ],
    accent: 'berry',
    shape: {
      // Two buildings joined by a flat-roofed link: the main one faces the square,
      // the back wing with the hipped orange roof faces Na Lávkách.
      width: 1.6,
      depth: 0.5,
      floors: 3,
      wall: '#e3a24a',
      plinth: '#c4692c',
      roof: 'gable',
      roofColor: '#8a3b22',
      offset: [0, 0.33],
      rotation: -0.12 + Math.PI,
      annexes: [
        {
          width: 0.75,
          depth: 0.4,
          floors: 2,
          wall: '#d9d1c4',
          roof: 'flat',
          roofColor: '#cdc6ba',
          offset: [0.12, -0.05]
        },
        {
          width: 1.15,
          depth: 0.45,
          floors: 3,
          wall: '#f0c8a2',
          roof: 'hip',
          roofColor: '#e0784a',
          offset: [-0.08, -0.45]
        }
      ]
    },
    contentMatch: 'Palackého'
  },
  {
    key: 'komenskeho',
    name: 'Budova Komenského',
    address: 'Komenského 80',
    mapX: 53,
    mapY: 20.8,
    roles: ['1. stupeň', 'Vzdělávání cizinců'],
    facts: [
      'Prostorná budova s velkými okny, kterou obklopují vysoké smrky.',
      'Má vlastní podatelnu: tel. 775 751 229',
      'Sídlí tu i Klub rodičů při naší škole.'
    ],
    accent: 'sky',
    shape: {
      width: 1.3,
      depth: 0.6,
      floors: 3,
      wall: '#e4d26a',
      plinth: '#b08a63',
      roof: 'flat',
      roofColor: '#7b6a55',
      rotation: 0.08 - Math.PI / 2
    },
    contentMatch: 'Komenského',
    pinSide: 'right',
    cameraFrom: 'left'
  },
  {
    key: 'drtinova',
    name: 'Škola na Skále',
    address: 'Drtinova 662',
    mapX: 8.9,
    mapY: 87.5,
    roles: ['1. stupeň', 'Školní družina'],
    facts: [
      'Stojí ve čtvrti Skála, na druhém břehu Divoké Orlice.',
      'Na Skále má škola tradici od roku 1901 – předtím se tu učilo provizorně, třeba v hostinci u Hofmanů.',
      'Družina tu má dvě vychovatelky.'
    ],
    hours: 'Družina: 6:15–16:00',
    accent: 'grass',
    shape: {
      width: 1.4,
      depth: 0.7,
      floors: 2,
      wall: '#efcf4a',
      roof: 'gable',
      roofColor: '#5d5f6e',
      rotation: 0.42
    },
    contentMatch: 'Drtinova'
  },
  {
    key: 'erbenova',
    name: 'Družina Erbenova',
    address: 'Erbenova 891',
    mapX: 49.8,
    mapY: 26,
    roles: ['Školní družina'],
    facts: [
      'Funkcionalistická vila s terasami – hlavní pracoviště školní družiny.',
      'O vedlejších prázdninách tu družina funguje, když se přihlásí aspoň 10 dětí.',
      'Vedoucí vychovatelka: Jitka Bezdíčková.'
    ],
    hours: 'Družina: 6:00–16:00',
    accent: 'grape',
    shape: {
      width: 0.75,
      depth: 0.65,
      floors: 3,
      wall: '#8d8f9c',
      roof: 'flat',
      roofColor: '#5f6170',
      rotation: 0.1
    },
    contentMatch: 'Erbenova',
    pinSide: 'left'
  }
]

export const ACCENT_HEX: Record<Workplace['accent'], string> = {
  berry: '#ff5c8a',
  sky: '#3a9bff',
  grass: '#2fbf71',
  grape: '#8a5cf6'
}

/** Data that only exists at request time (photo, staff count from the CMS). */
export type WorkplaceLive = {
  photo: string | null
  staffCount: number
  /** CMS building (staff-buildings) id, for `/zamestnanci/?pracoviste=<id>`. */
  buildingId: number | null
}

export type WorkplaceWithLive = Workplace & WorkplaceLive

/** Upgrades legacy `http://` media URLs (mixed content on an https site). */
export function secureUrl(url: string): string {
  return url.replace(/^http:\/\//, 'https://')
}

/**
 * Pulls the building photos out of the WP page HTML: the page lists each
 * building as a paragraph followed by its photo, with the town map first.
 * Returns the map URL and a photo per workplace (null when not found), so
 * editors can still swap photos in WordPress.
 */
export function extractPhotos(html: string): {
  map: string | null
  photos: Record<WorkplaceKey, string | null>
} {
  const tokens: ({ kind: 'img'; src: string } | { kind: 'text'; text: string })[] = []
  const re = /<img[^>]*\ssrc="([^"]+)"[^>]*>|<p[^>]*>([\s\S]*?)<\/p>/g
  let match: RegExpExecArray | null

  while ((match = re.exec(html))) {
    if (match[1]) {
      tokens.push({ kind: 'img', src: secureUrl(match[1]) })
    } else {
      const text = match[2]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim()
      if (text) {
        tokens.push({ kind: 'text', text })
      }
    }
  }

  const firstText = tokens.findIndex((token) => token.kind === 'text')
  const mapToken = tokens.slice(0, firstText === -1 ? tokens.length : firstText).find((token) => token.kind === 'img')

  const photos = Object.fromEntries(
    WORKPLACES.map((workplace) => {
      const textIdx = tokens.findIndex((token) => token.kind === 'text' && token.text.includes(workplace.contentMatch))
      const img = textIdx === -1 ? undefined : tokens.slice(textIdx + 1).find((token) => token.kind === 'img')
      // Only take the image if it comes before the next building's paragraph.
      const nextText = textIdx === -1 ? -1 : tokens.findIndex((token, idx) => idx > textIdx && token.kind === 'text')
      const imgIdx = img ? tokens.indexOf(img) : -1
      const valid = img && imgIdx !== -1 && (nextText === -1 || imgIdx < nextText)
      return [workplace.key, valid && img?.kind === 'img' ? img.src : null]
    })
  ) as Record<WorkplaceKey, string | null>

  return { map: mapToken?.kind === 'img' ? mapToken.src : null, photos }
}
