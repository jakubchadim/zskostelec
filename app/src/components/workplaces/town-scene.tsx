'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import { ACCENT_HEX, footprintRadius, type BuildingPart, type WorkplaceKey, type WorkplaceWithLive } from './data'
import {
  INDUSTRY,
  LANDMARKS,
  PARKS,
  RAILWAY,
  RIVER,
  ROADS,
  SQUARE,
  STADIUM,
  WORLD_D,
  WORLD_W,
  generateTown,
  percentToWorld,
  toWorld,
  type Area,
  type House,
  type Landmark,
  type Line,
  type Tree,
  type Vec2
} from './town'

const FLOOR_H = 0.26

// --- shared geometry --------------------------------------------------------

/** Unit gable-roof prism: ridge along X, 1 wide (Z), 1 tall, 1 long (X), base at y=0. */
function makeGableGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(-0.5, 0)
  shape.lineTo(0.5, 0)
  shape.lineTo(0, 1)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1,
    bevelEnabled: false
  })
  geo.translate(0, 0, -0.5)
  // Extruded along Z; rotate so the ridge runs along X.
  geo.rotateY(Math.PI / 2)
  return geo
}

/** Flat ribbon along a world-space polyline, lying just above the ground. */
function makeRibbon(points: Vec2[], width: number, y: number): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(points.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dz = next[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    const nx = (-dz / len) * (width / 2)
    const nz = (dx / len) * (width / 2)
    positions.push(points[i][0] + nx, y, points[i][1] + nz, points[i][0] - nx, y, points[i][1] - nz)
    if (i < points.length - 1) {
      const a = i * 2
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** Smooths a polyline with a Catmull-Rom curve so roads/river look hand-drawn rather than jagged. */
function smoothLine(line: Line, samples = 8): Vec2[] {
  const pts = line.points.map(toWorld).map(([x, z]) => new THREE.Vector3(x, 0, z))
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  return curve.getPoints(pts.length * samples).map((v) => [v.x, v.z] as Vec2)
}

function clampToBoard(points: Vec2[]): Vec2[] {
  const hx = WORLD_W / 2
  const hz = WORLD_D / 2
  return points.map(([x, z]) => [Math.max(-hx, Math.min(hx, x)), Math.max(-hz, Math.min(hz, z))])
}

// --- static town pieces -----------------------------------------------------

function Board() {
  return (
    <group>
      {/* Grass top */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[WORLD_W + 0.6, 0.1, WORLD_D + 0.6]} />
        <meshStandardMaterial color="#cfe8b0" />
      </mesh>
      {/* Soil layers - the "diorama" cake */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[WORLD_W + 0.6, 0.7, WORLD_D + 0.6]} />
        <meshStandardMaterial color="#b98a5e" />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[WORLD_W + 0.6, 0.3, WORLD_D + 0.6]} />
        <meshStandardMaterial color="#8e6544" />
      </mesh>
    </group>
  )
}

function AreaMesh({ area, y }: { area: Area; y: number }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape(area.points.map(toWorld).map(([x, z]) => new THREE.Vector2(x, -z)))
    return new THREE.ShapeGeometry(shape)
  }, [area])

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <meshStandardMaterial color={area.color} />
    </mesh>
  )
}

function Ribbon({ line, y, smooth = true }: { line: Line; y: number; smooth?: boolean }) {
  const geo = useMemo(() => {
    const pts = clampToBoard(smooth ? smoothLine(line) : line.points.map(toWorld))
    return makeRibbon(pts, line.width, y)
  }, [line, y, smooth])

  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color={line.color} side={THREE.DoubleSide} />
    </mesh>
  )
}

function River() {
  const material = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (material.current) {
      material.current.emissiveIntensity = 0.12 + Math.sin(clock.elapsedTime * 1.2) * 0.05
    }
  })
  const geo = useMemo(() => makeRibbon(clampToBoard(smoothLine(RIVER, 10)), RIVER.width, 0.012), [])
  const bank = useMemo(() => makeRibbon(clampToBoard(smoothLine(RIVER, 10)), RIVER.width + 0.22, 0.008), [])

  return (
    <group>
      <mesh geometry={bank} receiveShadow>
        <meshStandardMaterial color="#e8d9a8" side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo}>
        <meshStandardMaterial
          ref={material}
          color={RIVER.color}
          emissive="#9fe0ff"
          emissiveIntensity={0.12}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Railway() {
  const points = useMemo(() => clampToBoard(smoothLine(RAILWAY, 6)), [])
  const bed = useMemo(() => makeRibbon(points, 0.26, 0.009), [points])
  const ties = useMemo(() => {
    const out: { x: number; z: number; rot: number }[] = []
    for (let i = 0; i < points.length - 1; i += 1) {
      const [x1, z1] = points[i]
      const [x2, z2] = points[i + 1]
      out.push({
        x: (x1 + x2) / 2,
        z: (z1 + z2) / 2,
        rot: -Math.atan2(z2 - z1, x2 - x1)
      })
    }
    return out
  }, [points])
  const ref = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    ties.forEach((tie, i) => {
      m.position.set(tie.x, 0.02, tie.z)
      m.rotation.set(0, tie.rot, 0)
      m.updateMatrix()
      ref.current?.setMatrixAt(i, m.matrix)
    })
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
  }, [ties])

  return (
    <group>
      <mesh geometry={bed} receiveShadow>
        <meshStandardMaterial color="#b9b0a5" side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, ties.length]}>
        <boxGeometry args={[0.05, 0.02, 0.24]} />
        <meshStandardMaterial color={RAILWAY.color} />
      </instancedMesh>
    </group>
  )
}

function Stadium() {
  const [x, z] = toWorld(STADIUM.center)
  return (
    <group position={[x, 0, z]} rotation={[0, -0.08, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[STADIUM.rx, STADIUM.rz, 1]} position={[0, 0.011, 0]} receiveShadow>
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial color="#d9744f" />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[STADIUM.rx * 0.78, STADIUM.rz * 0.66, 1]}
        position={[0, 0.014, 0]}
        receiveShadow
      >
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial color="#7ccf6a" />
      </mesh>
      <mesh position={[0, 0.06, -STADIUM.rz - 0.18]} castShadow>
        <boxGeometry args={[1.4, 0.12, 0.18]} />
        <meshStandardMaterial color="#f1f1f1" />
      </mesh>
    </group>
  )
}

function Houses({ houses }: { houses: House[] }) {
  const bodies = useRef<THREE.InstancedMesh>(null)
  const roofs = useRef<THREE.InstancedMesh>(null)
  const gable = useMemo(() => makeGableGeometry(), [])

  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    const color = new THREE.Color()
    houses.forEach((house, i) => {
      m.position.set(house.x, house.h / 2, house.z)
      m.rotation.set(0, house.rot, 0)
      m.scale.set(house.w, house.h, house.d)
      m.updateMatrix()
      bodies.current?.setMatrixAt(i, m.matrix)
      bodies.current?.setColorAt(i, color.set(house.wall))

      m.position.set(house.x, house.h, house.z)
      m.scale.set(house.w + 0.04, house.d * 0.55, house.d + 0.04)
      m.updateMatrix()
      roofs.current?.setMatrixAt(i, m.matrix)
      roofs.current?.setColorAt(i, color.set(house.roof))
    })
    for (const mesh of [bodies.current, roofs.current]) {
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      }
    }
  }, [houses])

  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, houses.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[gable, undefined, houses.length]} castShadow>
        <meshStandardMaterial />
      </instancedMesh>
    </group>
  )
}

function Trees({ trees }: { trees: Tree[] }) {
  const round = useMemo(() => trees.filter((tree) => tree.kind === 'round'), [trees])
  const pine = useMemo(() => trees.filter((tree) => tree.kind === 'pine'), [trees])
  const trunks = useRef<THREE.InstancedMesh>(null)
  const crowns = useRef<THREE.InstancedMesh>(null)
  const pines = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    const color = new THREE.Color()
    const greens = ['#5fbf5a', '#4caf50', '#6ccb63', '#3f9f4a']
    trees.forEach((tree, i) => {
      m.position.set(tree.x, 0.08 * tree.s, tree.z)
      m.rotation.set(0, 0, 0)
      m.scale.set(tree.s, tree.s, tree.s)
      m.updateMatrix()
      trunks.current?.setMatrixAt(i, m.matrix)
    })
    round.forEach((tree, i) => {
      m.position.set(tree.x, 0.28 * tree.s, tree.z)
      m.scale.set(tree.s, tree.s, tree.s)
      m.updateMatrix()
      crowns.current?.setMatrixAt(i, m.matrix)
      crowns.current?.setColorAt(i, color.set(greens[i % greens.length]))
    })
    pine.forEach((tree, i) => {
      m.position.set(tree.x, 0.32 * tree.s, tree.z)
      m.scale.set(tree.s, tree.s, tree.s)
      m.updateMatrix()
      pines.current?.setMatrixAt(i, m.matrix)
      pines.current?.setColorAt(i, color.set(i % 2 ? '#2f8a4a' : '#3a9a55'))
    })
    for (const mesh of [trunks.current, crowns.current, pines.current]) {
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      }
    }
  }, [trees, round, pine])

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.16, 6]} />
        <meshStandardMaterial color="#8a5a3b" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, round.length]} castShadow>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial flatShading />
      </instancedMesh>
      <instancedMesh ref={pines} args={[undefined, undefined, pine.length]} castShadow>
        <coneGeometry args={[0.13, 0.42, 7]} />
        <meshStandardMaterial flatShading />
      </instancedMesh>
    </group>
  )
}

function LandmarkModel({ landmark }: { landmark: Landmark }) {
  const [x, z] = toWorld(landmark.at)
  const gable = useMemo(() => makeGableGeometry(), [])

  let body: ReactNode
  switch (landmark.kind) {
    case 'church':
      body = (
        <>
          <mesh position={[0.15, 0.25, 0]} castShadow>
            <boxGeometry args={[0.9, 0.5, 0.42]} />
            <meshStandardMaterial color="#fff6e6" />
          </mesh>
          <mesh geometry={gable} position={[0.15, 0.5, 0]} scale={[0.92, 0.32, 0.46]} castShadow>
            <meshStandardMaterial color="#9a4a32" />
          </mesh>
          <mesh position={[-0.42, 0.45, 0]} castShadow>
            <boxGeometry args={[0.26, 0.9, 0.26]} />
            <meshStandardMaterial color="#fff6e6" />
          </mesh>
          <mesh position={[-0.42, 1.1, 0]} castShadow>
            <coneGeometry args={[0.18, 0.45, 4]} />
            <meshStandardMaterial color="#4f8f74" />
          </mesh>
        </>
      )
      break
    case 'castle':
      body = (
        <>
          <mesh position={[0, 0.27, 0]} castShadow>
            <boxGeometry args={[1.3, 0.54, 0.5]} />
            <meshStandardMaterial color="#fbf0d9" />
          </mesh>
          <mesh geometry={gable} position={[0, 0.54, 0]} scale={[1.32, 0.3, 0.54]} castShadow>
            <meshStandardMaterial color="#c4502f" />
          </mesh>
          {[-0.62, 0.62].map((tx) => (
            <group key={tx} position={[tx, 0, 0]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.7, 12]} />
                <meshStandardMaterial color="#fbf0d9" />
              </mesh>
              <mesh position={[0, 0.83, 0]} castShadow>
                <coneGeometry args={[0.19, 0.3, 12]} />
                <meshStandardMaterial color="#c4502f" />
              </mesh>
            </group>
          ))}
        </>
      )
      break
    case 'station':
      body = (
        <>
          <mesh position={[0, 0.17, 0]} castShadow>
            <boxGeometry args={[0.8, 0.34, 0.34]} />
            <meshStandardMaterial color="#f7e3b5" />
          </mesh>
          <mesh geometry={gable} position={[0, 0.34, 0]} scale={[0.86, 0.2, 0.4]} castShadow>
            <meshStandardMaterial color="#6c6f80" />
          </mesh>
        </>
      )
      break
    case 'townhall':
      body = (
        <>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.8, 0.5, 0.4]} />
            <meshStandardMaterial color="#f3d9a4" />
          </mesh>
          <mesh geometry={gable} position={[0, 0.5, 0]} scale={[0.82, 0.22, 0.44]} castShadow>
            <meshStandardMaterial color="#b4573a" />
          </mesh>
          <mesh position={[0, 0.78, 0]} castShadow>
            <boxGeometry args={[0.14, 0.3, 0.14]} />
            <meshStandardMaterial color="#f3d9a4" />
          </mesh>
          <mesh position={[0, 1.0, 0]} castShadow>
            <coneGeometry args={[0.12, 0.2, 4]} />
            <meshStandardMaterial color="#4f8f74" />
          </mesh>
        </>
      )
      break
  }

  return (
    <group position={[x, 0, z]} rotation={[0, landmark.rotation ?? 0, 0]}>
      {body}
    </group>
  )
}

function Clouds({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null)
  const clouds = useMemo(
    () => [
      { x: -14, z: -6, s: 1.1, speed: 0.25 },
      { x: 4, z: -9, s: 0.8, speed: 0.18 },
      { x: 12, z: 2, s: 1.3, speed: 0.22 },
      { x: -6, z: 6, s: 0.9, speed: 0.3 }
    ],
    []
  )

  useFrame((_, delta) => {
    if (!animate || !group.current) return
    group.current.children.forEach((child, i) => {
      child.position.x += clouds[i].speed * delta
      if (child.position.x > WORLD_W / 2 + 6) child.position.x = -WORLD_W / 2 - 6
    })
  })

  return (
    <group ref={group}>
      {clouds.map((cloud, i) => (
        <group key={i} position={[cloud.x, 9 + i * 0.5, cloud.z]} scale={cloud.s * 0.7}>
          {[
            [0, 0, 0, 0.9],
            [0.9, -0.15, 0.1, 0.65],
            [-0.85, -0.2, 0, 0.6],
            [0.3, 0.35, -0.2, 0.6]
          ].map(([cx, cy, cz, r], j) => (
            <mesh key={j} position={[cx, cy, cz]} castShadow>
              <icosahedronGeometry args={[r, 1]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.45} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// --- school buildings -------------------------------------------------------

function Windows({ width, floors, depth, rows }: { width: number; floors: number; depth: number; rows: number }) {
  const count = Math.max(2, Math.round(width / 0.18))
  const ref = useRef<THREE.InstancedMesh>(null)
  const total = count * rows * 2

  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    let i = 0
    for (const side of [1, -1]) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < count; c++) {
          const x = -width / 2 + (width / count) * (c + 0.5)
          const y = FLOOR_H * (r + floors - rows) + FLOOR_H * 0.55
          m.position.set(x, y, side * (depth / 2 + 0.005))
          m.updateMatrix()
          ref.current?.setMatrixAt(i++, m.matrix)
        }
      }
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
  }, [count, rows, width, depth, floors])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, total]}>
      <boxGeometry args={[0.09, 0.13, 0.02]} />
      <meshStandardMaterial color="#cfe9ff" emissive="#9fd2ff" emissiveIntensity={0.35} />
    </instancedMesh>
  )
}

type SchoolProps = {
  workplace: WorkplaceWithLive
  selected: boolean
  hovered: boolean
  onSelect: (key: WorkplaceKey) => void
  onHover: (key: WorkplaceKey | null) => void
}

/** One block of a school: walls, optional plinth, windows and a gable / hipped / flat roof. */
function Part({ part, gable }: { part: BuildingPart; gable: THREE.BufferGeometry }) {
  const height = part.floors * FLOOR_H
  const [ox, oz] = part.offset ?? [0, 0]

  return (
    <group position={[ox, 0, oz]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[part.width, height, part.depth]} />
        <meshStandardMaterial color={part.wall} />
      </mesh>
      {part.plinth && (
        <mesh position={[0, FLOOR_H / 2, 0]} castShadow>
          <boxGeometry args={[part.width + 0.02, FLOOR_H, part.depth + 0.02]} />
          <meshStandardMaterial color={part.plinth} />
        </mesh>
      )}
      <Windows width={part.width} depth={part.depth} floors={part.floors} rows={part.floors} />
      {part.roof === 'gable' && (
        <mesh
          geometry={gable}
          position={[0, height, 0]}
          scale={[part.width + 0.06, 0.32, part.depth + 0.08]}
          castShadow
        >
          <meshStandardMaterial color={part.roofColor} />
        </mesh>
      )}
      {part.roof === 'hip' && (
        // 4-sided cone rotated 45° = a pyramid with a square base of side 1, scaled to the footprint.
        <mesh
          position={[0, height + 0.15, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[part.width + 0.08, 0.3, part.depth + 0.08]}
          castShadow
        >
          <coneGeometry args={[Math.SQRT1_2, 1, 4]} />
          <meshStandardMaterial color={part.roofColor} flatShading />
        </mesh>
      )}
      {part.roof === 'flat' && (
        <mesh position={[0, height + 0.03, 0]} castShadow>
          <boxGeometry args={[part.width + 0.05, 0.06, part.depth + 0.05]} />
          <meshStandardMaterial color={part.roofColor} />
        </mesh>
      )}
    </group>
  )
}

function School({ workplace, selected, hovered, onSelect, onHover }: SchoolProps) {
  const { shape } = workplace
  const [x, z] = percentToWorld(workplace.mapX, workplace.mapY)
  const height = shape.floors * FLOOR_H
  const [mx, mz] = shape.offset ?? [0, 0]
  const group = useRef<THREE.Group>(null)
  const gable = useMemo(() => makeGableGeometry(), [])
  const accent = ACCENT_HEX[workplace.accent]

  useFrame((_, delta) => {
    if (group.current) {
      const target = hovered || selected ? 1.12 : 1
      const s = THREE.MathUtils.damp(group.current.scale.x, target, 8, delta)
      group.current.scale.setScalar(s)
    }
  })

  const handlers = {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelect(workplace.key)
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onHover(workplace.key)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      onHover(null)
      document.body.style.cursor = ''
    }
  }

  return (
    <group position={[x, 0, z]}>
      {/* Coloured "lot" around the school so it pops out of the town. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]} receiveShadow>
        <circleGeometry args={[footprintRadius(shape) * 0.95, 40]} />
        <meshStandardMaterial color={accent} transparent opacity={selected ? 0.55 : 0.3} />
      </mesh>

      <group ref={group} rotation={[0, shape.rotation, 0]} {...handlers}>
        <Part part={shape} gable={gable} />
        {shape.annexes?.map((annex, i) => (
          <Part key={i} part={annex} gable={gable} />
        ))}
        {/* Entrance canopy (front = local +z) */}
        <mesh position={[mx, FLOOR_H * 0.95, mz + shape.depth / 2 + 0.07]} castShadow>
          <boxGeometry args={[0.32, 0.03, 0.16]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        {/* Flag */}
        <mesh position={[mx + shape.width / 2 - 0.08, height + 0.32, mz]}>
          <cylinderGeometry args={[0.01, 0.01, 0.55, 6]} />
          <meshStandardMaterial color="#6b6577" />
        </mesh>
        <mesh position={[mx + shape.width / 2 + 0.02, height + 0.52, mz]}>
          <boxGeometry args={[0.2, 0.12, 0.01]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
    </group>
  )
}

// --- labels -----------------------------------------------------------------

type Label = { id: string; pos: [number, number, number] }

/**
 * Projects 3D anchor points to screen space every frame and moves the
 * matching DOM elements (rendered in a plain overlay next to the canvas).
 * Cheaper and more accessible than drei's <Html> (no React root per label,
 * pins are ordinary focusable buttons in the page's own tree).
 */
function LabelProjector({ labels, elements }: { labels: Label[]; elements: Map<string, HTMLElement> }) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const v = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    for (const label of labels) {
      const el = elements.get(label.id)
      if (!el) continue
      v.set(...label.pos).project(camera)
      const visible = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15
      el.style.visibility = visible ? 'visible' : 'hidden'
      if (visible) {
        const x = ((v.x + 1) / 2) * size.width
        const y = ((1 - v.y) / 2) * size.height
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      }
    }
  })

  return null
}

/** Calls `onReady` once, after the first frame has actually been rendered. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (!done.current) {
      done.current = true
      onReady()
    }
  })
  return null
}

// --- camera -----------------------------------------------------------------

const OVERVIEW = { pos: [2, 19, 17] as const, target: [0, 0, 0.5] as const }
const FOV = 38

/**
 * Overview framing: fits the bounding box of the four schools (plus a
 * margin of town around them) for the current aspect ratio, so every
 * building is on screen on a phone as well as on a wide monitor.
 */
function overviewFor(aspect: number, workplaces: WorkplaceWithLive[]) {
  const pts = workplaces.map((w) => percentToWorld(w.mapX, w.mapY))
  const xs = pts.map((p) => p[0])
  const zs = pts.map((p) => p[1])
  const margin = 3.6
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2
  const halfW = (Math.max(...xs) - Math.min(...xs)) / 2 + margin
  const halfD = (Math.max(...zs) - Math.min(...zs)) / 2 + margin

  const tanV = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  // Distance needed to fit the width horizontally / the depth (foreshortened) vertically.
  const dist = Math.max((halfW * 1.12) / (tanV * aspect), (halfD * 0.75) / tanV)
  const dir = new THREE.Vector3(...OVERVIEW.pos).normalize()

  return {
    pos: [cx + dir.x * dist, dir.y * dist, cz + dir.z * dist] as const,
    target: [cx, 0, cz] as const
  }
}

function CameraRig({
  selected,
  workplaces,
  animate
}: {
  selected: WorkplaceKey | null
  workplaces: WorkplaceWithLive[]
  /** False with prefers-reduced-motion: jump instead of flying. */
  animate: boolean
}) {
  const controls = useRef<CameraControls>(null)
  const first = useRef(true)
  const aspect = useThree((state) => state.size.width / state.size.height)

  useEffect(() => {
    const c = controls.current
    if (!c) return

    const workplace = workplaces.find((w) => w.key === selected)
    // First run with no building in the URL: a fly-in intro. With a deep link (#palackeho)
    // the camera starts at that building right away.
    const intro = first.current && !workplace && animate
    const smooth = animate && !first.current
    first.current = false

    if (!workplace) {
      const overview = overviewFor(aspect, workplaces)
      if (intro) {
        c.setLookAt(0, 40, 36, 0, 0, 0, false)
      }
      c.setLookAt(...overview.pos, ...overview.target, intro || smooth)
      return
    }
    const [x, z] = percentToWorld(workplace.mapX, workplace.mapY)
    // Look at the entrance side (local +z), like the photos do, a bit from the right.
    const r = workplace.shape.rotation
    const front: Vec2 = [Math.sin(r), Math.cos(r)]
    const right: Vec2 = [Math.cos(r), -Math.sin(r)]
    // On wide screens the info panel covers the right side - aim a bit right of the building.
    const shift = aspect > 1.2 ? 1.1 : 0
    const k = Math.max(1, 1.2 / aspect)
    const side = workplace.cameraFrom === 'left' ? -1 : 1
    const tx = x + right[0] * shift
    const tz = z + right[1] * shift
    c.setLookAt(
      tx + front[0] * 4.2 * k + right[0] * 2.6 * k * side,
      3.4 * k,
      tz + front[1] * 4.2 * k + right[1] * 2.6 * k * side,
      tx,
      0.35,
      tz,
      smooth
    )
  }, [selected, workplaces, aspect, animate])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={3}
      maxDistance={60}
      minPolarAngle={0.25}
      maxPolarAngle={1.2}
      smoothTime={0.6}
      draggingSmoothTime={0.15}
    />
  )
}

// --- scene ------------------------------------------------------------------

export type TownSceneProps = {
  workplaces: WorkplaceWithLive[]
  selected: WorkplaceKey | null
  onSelect: (key: WorkplaceKey | null) => void
  reducedMotion: boolean
}

export default function TownScene({ workplaces, selected, onSelect, reducedMotion }: TownSceneProps) {
  const [hovered, setHovered] = useState<WorkplaceKey | null>(null)
  // Shader compilation can take a moment after the bundle loads - keep the loader up until the first frame.
  const [ready, setReady] = useState(false)

  const { houses, trees } = useMemo(() => {
    const keepOut = workplaces.map((w) => {
      const [x, z] = percentToWorld(w.mapX, w.mapY)
      return { x, z, r: footprintRadius(w.shape) + 0.3 }
    })
    return generateTown(keepOut)
  }, [workplaces])

  // A stable mutable registry of label elements (written by ref callbacks, read in useFrame).
  const [elements] = useState(() => new Map<string, HTMLElement>())
  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) elements.set(id, el)
    else elements.delete(id)
  }

  const labels = useMemo<Label[]>(() => {
    const out: Label[] = workplaces.map((w) => {
      const [x, z] = percentToWorld(w.mapX, w.mapY)
      return { id: w.key, pos: [x, w.shape.floors * FLOOR_H + 0.55, z] }
    })
    for (const landmark of LANDMARKS) {
      const [x, z] = toWorld(landmark.at)
      out.push({ id: `lm-${landmark.name}`, pos: [x, 1.3, z] })
    }
    const [rx, rz] = toWorld(RIVER.points[2])
    out.push({ id: 'river', pos: [rx, 0.05, rz + 0.75] })
    return out
  }, [workplaces])

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: FOV, position: [0, 34, 30], near: 0.1, far: 200 }}
        onPointerMissed={() => onSelect(null)}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#dcefff']} />
        <fog attach="fog" args={['#dcefff', 45, 90]} />
        <hemisphereLight args={['#ffffff', '#b7d7a0', 0.9]} />
        <directionalLight
          position={[12, 22, 10]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-24}
          shadow-camera-right={24}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-bias={-0.0005}
        />

        <Board />
        {PARKS.map((park, i) => (
          <AreaMesh key={i} area={park} y={0.004} />
        ))}
        {INDUSTRY.map((area, i) => (
          <AreaMesh key={`i${i}`} area={area} y={0.004} />
        ))}
        <AreaMesh area={SQUARE} y={0.006} />
        <River />
        <Railway />
        {ROADS.map((road, i) => (
          <Ribbon key={i} line={road} y={0.01 + (road.width > 0.25 ? 0.004 : 0)} />
        ))}
        <Stadium />
        <Houses houses={houses} />
        <Trees trees={trees} />
        {LANDMARKS.map((landmark) => (
          <LandmarkModel key={landmark.name} landmark={landmark} />
        ))}
        <Clouds animate={!reducedMotion} />

        {workplaces.map((workplace) => (
          <School
            key={workplace.key}
            workplace={workplace}

            selected={selected === workplace.key}
            hovered={hovered === workplace.key}
            onSelect={onSelect}
            onHover={setHovered}
          />
        ))}

        <CameraRig selected={selected} workplaces={workplaces} animate={!reducedMotion} />
        <LabelProjector labels={labels} elements={elements} />
        <FirstFrame onReady={() => setReady(true)} />
      </Canvas>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-sky-tint">
          <div className="flex flex-col items-center gap-3 font-display font-bold text-gray-7">
            <span className="size-10 animate-spin rounded-full border-4 border-white-1 border-t-sky" />
            Stavíme Kostelec…
          </div>
        </div>
      )}

      {/* DOM labels, positioned every frame by <LabelProjector>. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {LANDMARKS.filter((landmark) => !landmark.hideLabel).map((landmark) => (
          <div
            key={landmark.name}
            ref={register(`lm-${landmark.name}`)}
            className="invisible absolute top-0 left-0 will-change-transform"
          >
            <span className="block -translate-x-1/2 -translate-y-full rounded-full bg-paper/90 px-2 py-0.5 font-display text-[11px] font-bold whitespace-nowrap text-gray-7 shadow-pop-sm">
              {landmark.name}
            </span>
          </div>
        ))}
        <div ref={register('river')} className="invisible absolute top-0 left-0 will-change-transform">
          <span className="block -translate-x-1/2 font-display text-xs font-bold whitespace-nowrap text-[#0f5fb3] italic">
            Divoká Orlice
          </span>
        </div>
        {workplaces.map((workplace, index) => {
          const accent = ACCENT_HEX[workplace.accent]
          const isSelected = selected === workplace.key
          const side = workplace.pinSide
          return (
            <div
              key={workplace.key}
              ref={register(workplace.key)}
              className="invisible absolute top-0 left-0 z-10 will-change-transform"
            >
              <button
                type="button"
                onClick={() => onSelect(workplace.key)}
                onMouseEnter={() => setHovered(workplace.key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(workplace.key)}
                onBlur={() => setHovered(null)}
                aria-label={`${workplace.name}, ${workplace.address}`}
                aria-pressed={isSelected}
                className={cn(
                  'group pointer-events-auto absolute bottom-0 flex flex-col',
                  side === 'left'
                    ? 'right-0 items-end'
                    : side === 'right'
                      ? 'left-0 items-start'
                      : 'left-0 -translate-x-1/2 items-center'
                )}
              >
                <span
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-1 font-display text-sm font-bold whitespace-nowrap text-ink shadow-pop-sm transition-transform group-hover:-translate-y-1',
                    !reducedMotion && !isSelected && 'animate-float'
                  )}
                  style={{
                    background: isSelected ? accent : '#fffdf8',
                    animationDelay: `${index * -1.3}s`,
                    animationDuration: '3.2s'
                  }}
                >
                  <span
                    className="grid size-5 place-items-center rounded-full border-2 border-ink text-[11px]"
                    style={{ background: accent }}
                  >
                    {index + 1}
                  </span>
                  <span className="max-sm:hidden">{workplace.name}</span>
                </span>
                <span className={cn('h-4 w-0.5 bg-ink', side === 'left' ? 'mr-3' : side === 'right' ? 'ml-3' : '')} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
