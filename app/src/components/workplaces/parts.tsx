'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { BuildingPart } from './data'

/**
 * Building blocks shared by the town map (`town-scene.tsx`) and the
 * homepage diorama (`home/school-diorama.tsx`).
 */

export const FLOOR_H = 0.26

/** Unit gable-roof prism: ridge along X, 1 wide (Z), 1 tall, 1 long (X), base at y=0. */
export function makeGableGeometry(): THREE.BufferGeometry {
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

/** `night` makes the windows glow warm, for the homepage day/night toggle. */
export function Windows({
  width,
  floors,
  depth,
  rows,
  night = false
}: {
  width: number
  floors: number
  depth: number
  rows: number
  night?: boolean
}) {
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
      <meshStandardMaterial
        color={night ? '#ffe2a3' : '#cfe9ff'}
        emissive={night ? '#ffc35a' : '#9fd2ff'}
        emissiveIntensity={night ? 1.6 : 0.35}
      />
    </instancedMesh>
  )
}

/**
 * Hipped roof built in the building's real proportions (a ridge along the
 * longer side, sloped ends) - scaling a 45°-rotated pyramid would skew it,
 * because Object3D applies scale before rotation.
 */
export function makeHipGeometry(width: number, depth: number, height: number): THREE.BufferGeometry {
  const alongX = width >= depth
  const long = alongX ? width : depth
  const short = alongX ? depth : width
  const ridge = Math.max(0, long - short) / 2
  const hw = long / 2
  const hd = short / 2

  // Corners in (long, short) space, ridge ends on top.
  const a = [-hw, 0, -hd]
  const b = [hw, 0, -hd]
  const c = [hw, 0, hd]
  const d = [-hw, 0, hd]
  const r1 = [-ridge, height, 0]
  const r2 = [ridge, height, 0]
  const faces = [
    [a, r2, b],
    [a, r1, r2], // back slope
    [d, c, r2],
    [d, r2, r1], // front slope
    [a, d, r1], // left end
    [b, r2, c], // right end
    [a, b, c],
    [a, c, d] // underside
  ]
  const positions = faces.flat(2)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  if (!alongX) {
    geo.rotateY(Math.PI / 2)
  }
  geo.computeVertexNormals()
  return geo
}

export function HipRoof({ width, depth, y, color }: { width: number; depth: number; y: number; color: string }) {
  const geo = useMemo(() => makeHipGeometry(width, depth, 0.3), [width, depth])
  return (
    <mesh geometry={geo} position={[0, y, 0]} castShadow>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** One block of a school: walls, optional plinth, windows and a gable / hipped / flat roof. */
export function Part({ part, gable, night }: { part: BuildingPart; gable: THREE.BufferGeometry; night?: boolean }) {
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
      <Windows width={part.width} depth={part.depth} floors={part.floors} rows={part.floors} night={night} />
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
        <HipRoof width={part.width + 0.08} depth={part.depth + 0.08} y={height} color={part.roofColor} />
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

type At = { position: [number, number, number] }

/** Octagonal fountain basin with water and a small central pillar. */
export function Fountain({ position }: At) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.26, 0.1, 8]} />
        <meshStandardMaterial color="#d8d2c6" />
      </mesh>
      <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 8]} />
        <meshStandardMaterial color="#7cc4f0" emissive="#9fe0ff" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.16, 8]} />
        <meshStandardMaterial color="#d8d2c6" />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color="#bfe6ff" emissive="#bfe6ff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/** A linden - bigger, rounder and lighter than the generic town trees. */
export function Linden({ position, shade = 0 }: At & { shade?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.24, 6]} />
        <meshStandardMaterial color="#7a5236" />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color={shade % 2 ? '#6fbf4f' : '#7ccb5a'} flatShading />
      </mesh>
    </group>
  )
}

/** Plague column: stepped base, tall column, gilded statue on top. */
export function PlagueColumn({ position }: At) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.24, 0.06, 0.24]} />
        <meshStandardMaterial color="#cfc8b8" />
      </mesh>
      <mesh position={[0, 0.11, 0]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshStandardMaterial color="#ddd6c6" />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.52, 10]} />
        <meshStandardMaterial color="#e6dfcf" />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.055, 0.14, 8]} />
        <meshStandardMaterial color="#e8b93a" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.81, 0]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshStandardMaterial color="#f0c84a" metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  )
}
