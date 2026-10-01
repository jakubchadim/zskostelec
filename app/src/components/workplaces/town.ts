/**
 * A stylised model of Kostelec nad Orlicí, traced by hand from the school's
 * own map image (2000x1016 reference px, same frame as `data.ts`'s
 * `mapX`/`mapY` percentages). Only the features that help orientation are
 * modelled - the river, railway, main roads, parks, the square and a few
 * landmarks - and the rest of the town is filled with procedurally placed
 * little houses and trees (seeded, so every render is identical).
 */

export const MAP_W = 2000
export const MAP_H = 1016
/** World size of the map, in scene units (1 unit ≈ 50 map px ≈ 48 m). */
export const WORLD_W = 40
export const WORLD_D = (WORLD_W * MAP_H) / MAP_W

export type Vec2 = [number, number]

/** Map px -> world [x, z]. */
export function toWorld([px, py]: Vec2): Vec2 {
  return [(px / MAP_W - 0.5) * WORLD_W, (py / MAP_H - 0.5) * WORLD_D]
}

/** Map percent (as stored in data.ts) -> world [x, z]. */
export function percentToWorld(x: number, y: number): Vec2 {
  return toWorld([(x / 100) * MAP_W, (y / 100) * MAP_H])
}

export type Line = {
  points: Vec2[]
  width: number
  color: string
  name?: string
}

// --- linear features (map px) ---------------------------------------------

export const RIVER: Line = {
  name: 'Divoká Orlice',
  width: 0.75,
  color: '#7cc4f0',
  points: [
    [-40, 728],
    [150, 738],
    [330, 758],
    [500, 785],
    [600, 815],
    [665, 860],
    [720, 915],
    [770, 975],
    [800, 1060]
  ]
}

export const RAILWAY: Line = {
  name: 'Železnice',
  width: 0.16,
  color: '#6b6577',
  points: [
    [-40, 555],
    [250, 620],
    [520, 700],
    [760, 790],
    [1000, 860],
    [1300, 905],
    [1650, 945],
    [2040, 985]
  ]
}

export const ROADS: Line[] = [
  {
    name: 'Komenského',
    width: 0.36,
    color: '#f6b85a',
    points: [
      [-40, 105],
      [250, 200],
      [460, 262],
      [700, 296],
      [1000, 306],
      [1150, 318],
      [1260, 352],
      [1400, 422],
      [1540, 466],
      [1700, 545],
      [2040, 705]
    ]
  },
  {
    name: 'Zoubkova',
    width: 0.3,
    color: '#f7dc6f',
    points: [
      [290, 1060],
      [300, 880],
      [400, 826],
      [480, 862],
      [600, 912],
      [760, 848],
      [880, 730],
      [960, 618],
      [1060, 585],
      [1200, 612],
      [1385, 645],
      [1470, 540],
      [1540, 466]
    ]
  },
  // Secondary streets (narrower, paper white).
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [870, 310],
      [960, 430],
      [1020, 520],
      [1060, 585]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1115, 318],
      [1130, 450],
      [1125, 585],
      [1100, 760],
      [1080, 1060]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1010, 40],
      [1000, 306]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1225, 90],
      [1232, 330]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [620, 60],
      [600, 296]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [860, 80],
      [1630, 120]
    ]
  },
  {
    // Na Lávkách - runs behind the school at Palackého náměstí.
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1060, 585],
      [1150, 574],
      [1250, 582],
      [1350, 584],
      [1470, 545]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1540, 466],
      [1620, 330],
      [1680, 60]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1100, 730],
      [1500, 790],
      [1980, 880]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1385, 645],
      [1440, 820],
      [1500, 1060]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [1700, 545],
      [1820, 470],
      [1990, 420]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [40, 790],
      [180, 800],
      [300, 880]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [0, 960],
      [178, 905],
      [300, 880]
    ]
  },
  {
    width: 0.18,
    color: '#fbf6ea',
    points: [
      [178, 905],
      [240, 1060]
    ]
  }
]

// --- areas (map px polygons) -----------------------------------------------

export type Area = {
  points: Vec2[]
  color: string
  name?: string
  trees?: number
}

export const PARKS: Area[] = [
  {
    name: 'Zámecký park',
    color: '#9fd48a',
    trees: 70,
    points: [
      [170, 455],
      [420, 430],
      [700, 455],
      [980, 470],
      [1000, 560],
      [930, 690],
      [820, 760],
      [600, 735],
      [380, 690],
      [200, 610],
      [130, 520]
    ]
  },
  {
    name: 'Seykorův park',
    color: '#a8da92',
    trees: 14,
    points: [
      [815, 325],
      [945, 318],
      [955, 440],
      [830, 445]
    ]
  },
  {
    color: '#a8da92',
    trees: 10,
    points: [
      [170, 240],
      [450, 280],
      [440, 420],
      [180, 420]
    ]
  },
  {
    // Cemetery / green by Rudé armády.
    color: '#b5dd9c',
    trees: 8,
    points: [
      [1720, 610],
      [1890, 650],
      [1880, 720],
      [1710, 690]
    ]
  }
]

/** Palackého náměstí - the paved main square. */
export const SQUARE: Area = {
  name: 'Palackého náměstí',
  color: '#efe2c8',
  points: [
    [1150, 432],
    [1360, 440],
    [1355, 505],
    [1150, 500]
  ]
}

/** Big industrial area south of the park - kept free of houses, drawn as flat grey blocks. */
export const INDUSTRY: Area[] = [
  {
    color: '#d6d2cf',
    points: [
      [760, 600],
      [960, 470],
      [1030, 560],
      [900, 760],
      [800, 760]
    ]
  }
]

export const STADIUM = { center: [1375, 180] as Vec2, rx: 1.35, rz: 0.75 }

export type Landmark = {
  kind: 'church' | 'castle' | 'station' | 'townhall'
  at: Vec2
  name: string
  rotation?: number
  /** Hide the floating name (e.g. when it would collide with a school pin). */
  hideLabel?: boolean
}

export const LANDMARKS: Landmark[] = [
  { kind: 'church', at: [1395, 600], name: 'Kostel sv. Jiří', rotation: 0.1 },
  { kind: 'castle', at: [360, 495], name: 'Nový zámek', rotation: -0.1 },
  { kind: 'station', at: [745, 812], name: 'Nádraží', rotation: 0.35 },
  { kind: 'townhall', at: [1250, 420], name: 'Radnice', rotation: 0, hideLabel: true }
]

// --- geometry helpers -------------------------------------------------------

function distToSegment(p: Vec2, a: Vec2, b: Vec2): { dist: number; angle: number } {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len2 = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2))
  const cx = a[0] + t * dx
  const cy = a[1] + t * dy
  return { dist: Math.hypot(p[0] - cx, p[1] - cy), angle: Math.atan2(dy, dx) }
}

/** Distance (world units) from a world point to a polyline, plus the nearest segment's direction. */
export function distToLine(p: Vec2, line: Line): { dist: number; angle: number } {
  const pts = line.points.map(toWorld)
  let best = { dist: Infinity, angle: 0 }
  for (let i = 0; i < pts.length - 1; i++) {
    const r = distToSegment(p, pts[i], pts[i + 1])
    if (r.dist < best.dist) {
      best = r
    }
  }
  return best
}

export function pointInPolygon(p: Vec2, poly: Vec2[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

/** Deterministic PRNG (mulberry32) so the town looks the same on every render. */
export function seeded(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type House = {
  x: number
  z: number
  w: number
  d: number
  h: number
  rot: number
  wall: string
  roof: string
}
export type Tree = { x: number; z: number; s: number; kind: 'round' | 'pine' }

const WALLS = ['#fff3dc', '#ffe3c2', '#f4e7d0', '#fde9ef', '#e6f1fb', '#fff7c9', '#efe7ff']
const ROOFS = ['#d7653f', '#c4502f', '#b4573a', '#8f4c3a', '#e07a4f', '#6c6f80']

/**
 * Fills the town with small houses along the streets and trees in the parks,
 * avoiding roads, river, railway, parks, the square, landmarks and the
 * school buildings (`keepOut`, world coords + radius).
 */
export function generateTown(keepOut: { x: number; z: number; r: number }[]): {
  houses: House[]
  trees: Tree[]
} {
  const rand = seeded(1875)
  const houses: House[] = []
  const trees: Tree[] = []
  const worldPoly = (area: Area) => area.points.map(toWorld)
  const parks = PARKS.map(worldPoly)
  const blocked = [worldPoly(SQUARE), ...INDUSTRY.map(worldPoly)]
  const landmarkPts = LANDMARKS.map((landmark) => toWorld(landmark.at))
  const stadium = toWorld(STADIUM.center)
  const allRoads = ROADS

  const step = 0.52
  for (let x = -WORLD_W / 2 + 0.4; x < WORLD_W / 2 - 0.3; x += step) {
    for (let z = -WORLD_D / 2 + 0.4; z < WORLD_D / 2 - 0.3; z += step) {
      const p: Vec2 = [x + (rand() - 0.5) * 0.22, z + (rand() - 0.5) * 0.22]

      if (parks.some((poly) => pointInPolygon(p, poly)) || blocked.some((poly) => pointInPolygon(p, poly))) {
        continue
      }
      if (distToLine(p, RIVER).dist < RIVER.width / 2 + 0.35) {
        if (rand() < 0.25 && distToLine(p, RIVER).dist > RIVER.width / 2 + 0.12) {
          trees.push({
            x: p[0],
            z: p[1],
            s: 0.7 + rand() * 0.5,
            kind: 'round'
          })
        }
        continue
      }
      if (distToLine(p, RAILWAY).dist < 0.35) {
        continue
      }
      if (keepOut.some((k) => Math.hypot(p[0] - k.x, p[1] - k.z) < k.r)) {
        continue
      }
      if (landmarkPts.some(([lx, lz]) => Math.hypot(p[0] - lx, p[1] - lz) < 0.9)) {
        continue
      }
      if (Math.hypot((p[0] - stadium[0]) / (STADIUM.rx + 0.45), (p[1] - stadium[1]) / (STADIUM.rz + 0.45)) < 1) {
        continue
      }

      let nearest = { dist: Infinity, angle: 0 }
      for (const road of allRoads) {
        const r = distToLine(p, road)
        const clearance = r.dist - road.width / 2
        if (clearance < nearest.dist) {
          nearest = { dist: clearance, angle: r.angle }
        }
      }

      if (nearest.dist < 0.18) {
        continue
      }

      // Houses cluster along streets; open land in between gets the odd tree.
      if (nearest.dist < 0.9 && rand() < 0.78) {
        const w = 0.26 + rand() * 0.16
        const d = 0.24 + rand() * 0.12
        houses.push({
          x: p[0],
          z: p[1],
          w,
          d,
          h: 0.2 + rand() * 0.22,
          rot: -nearest.angle + (rand() < 0.5 ? 0 : Math.PI / 2) * 0,
          wall: WALLS[Math.floor(rand() * WALLS.length)],
          roof: ROOFS[Math.floor(rand() * ROOFS.length)]
        })
      } else if (rand() < 0.3) {
        trees.push({
          x: p[0],
          z: p[1],
          s: 0.6 + rand() * 0.6,
          kind: rand() < 0.3 ? 'pine' : 'round'
        })
      }
    }
  }

  // Park trees.
  PARKS.forEach((park, idx) => {
    const poly = parks[idx]
    const xs = poly.map((p) => p[0])
    const zs = poly.map((p) => p[1])
    let placed = 0
    let guard = 0
    while (placed < (park.trees ?? 0) && guard++ < 2000) {
      const p: Vec2 = [
        Math.min(...xs) + rand() * (Math.max(...xs) - Math.min(...xs)),
        Math.min(...zs) + rand() * (Math.max(...zs) - Math.min(...zs))
      ]
      if (!pointInPolygon(p, poly)) continue
      if (landmarkPts.some(([lx, lz]) => Math.hypot(p[0] - lx, p[1] - lz) < 1)) continue
      if (ROADS.some((road) => distToLine(p, road).dist < road.width / 2 + 0.15)) continue
      trees.push({
        x: p[0],
        z: p[1],
        s: 0.8 + rand() * 0.7,
        kind: rand() < 0.35 ? 'pine' : 'round'
      })
      placed++
    }
  })

  return { houses, trees }
}
