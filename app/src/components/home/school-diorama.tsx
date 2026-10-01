'use client'

import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { WORKPLACES } from '@/components/workplaces/data'
import { Fountain, Linden, Part, PlagueColumn, makeGableGeometry } from '@/components/workplaces/parts'

const MAIN = WORKPLACES.find((w) => w.key === 'palackeho')!.shape

/** Row houses flanking the school along the square, like the real Palackého náměstí. */
const NEIGHBOURS = [
  { x: -1.35, w: 0.55, h: 0.62, wall: '#fbe3c4', roof: '#c4502f' },
  { x: -1.95, w: 0.6, h: 0.5, wall: '#e6f1fb', roof: '#8f4c3a' },
  { x: -2.5, w: 0.45, h: 0.56, wall: '#fff3dc', roof: '#d7653f' },
  { x: 1.33, w: 0.5, h: 0.58, wall: '#fde9ef', roof: '#b4573a' },
  { x: 1.9, w: 0.6, h: 0.66, wall: '#fff7c9', roof: '#c4502f' },
  { x: 2.48, w: 0.45, h: 0.48, wall: '#efe7ff', roof: '#6c6f80' }
]

function Platform() {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.08, 64]} />
        <meshStandardMaterial color="#cfe8b0" />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[3.2, 3.05, 0.5, 64]} />
        <meshStandardMaterial color="#b98a5e" />
      </mesh>
      {/* Paved square in front of the school (kept inside the round platform) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.45]} receiveShadow>
        <planeGeometry args={[4.2, 1.75]} />
        <meshStandardMaterial color="#efe2c8" />
      </mesh>
      {/* Street along the front of the square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.55]} receiveShadow>
        <planeGeometry args={[3.2, 0.42]} />
        <meshStandardMaterial color="#f6b85a" />
      </mesh>
    </group>
  )
}

function Neighbours({ night }: { night: boolean }) {
  const gable = useMemo(() => makeGableGeometry(), [])
  return (
    <group>
      {NEIGHBOURS.map((house) => (
        <group key={house.x} position={[house.x, 0, 0.42]}>
          <mesh position={[0, house.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[house.w, house.h, 0.5]} />
            <meshStandardMaterial color={house.wall} />
          </mesh>
          <mesh geometry={gable} position={[0, house.h, 0]} scale={[house.w + 0.04, 0.28, 0.54]} castShadow>
            <meshStandardMaterial color={house.roof} />
          </mesh>
          {/* A couple of windows facing the square */}
          {[-0.12, 0.12].map((wx) => (
            <mesh key={wx} position={[wx, house.h * 0.62, 0.252]}>
              <boxGeometry args={[0.09, 0.12, 0.01]} />
              <meshStandardMaterial
                color={night ? '#ffe2a3' : '#cfe9ff'}
                emissive={night ? '#ffc35a' : '#9fd2ff'}
                emissiveIntensity={night ? 1.4 : 0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Lamp({ position, night }: { position: [number, number, number]; night: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.016, 0.6, 6]} />
        <meshStandardMaterial color="#3d3f63" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial
          color={night ? '#ffe2a3' : '#f4f1e8'}
          emissive="#ffc35a"
          emissiveIntensity={night ? 2.2 : 0}
        />
      </mesh>
      {night && <pointLight position={[0, 0.62, 0]} color="#ffc35a" intensity={1.2} distance={1.6} />}
    </group>
  )
}

/** Paper plane looping around the school - pure decoration. */
function PaperPlane({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    // Two wings meeting at the nose (+x), slightly folded.
    const v = [0.22, 0, 0, -0.14, 0.02, 0.12, -0.1, -0.03, 0, 0.22, 0, 0, -0.1, -0.03, 0, -0.14, 0.02, -0.12]
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = animate ? clock.elapsedTime * 0.45 : 1.2
    const r = 2.1
    ref.current.position.set(Math.cos(t) * r, 1.7 + Math.sin(t * 2) * 0.18, Math.sin(t) * r)
    // Face the direction of travel (tangent of the circle) and bank into the turn.
    ref.current.rotation.set(0.35, -t - Math.PI / 2 + Math.PI, 0)
  })

  return (
    <group ref={ref}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  )
}

function Stars() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pts: number[] = []
    // Deterministic pseudo-random dome of stars.
    for (let i = 0; i < 160; i++) {
      const a = (i * 2.399963) % (Math.PI * 2)
      const y = 0.25 + ((i * 0.618034) % 1) * 0.75
      const rr = Math.sqrt(1 - y * y)
      pts.push(Math.cos(a) * rr * 14, y * 14, Math.sin(a) * rr * 14)
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial color="#fff6d6" size={0.2} sizeAttenuation />
    </points>
  )
}

function School({ night, onOpen }: { night: boolean; onOpen: () => void }) {
  const group = useRef<THREE.Group>(null)
  const flag = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const gable = useMemo(() => makeGableGeometry(), [])
  const height = MAIN.floors * 0.26
  const [mx, mz] = MAIN.offset ?? [0, 0]

  useFrame(({ clock }, delta) => {
    if (group.current) {
      const s = THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.05 : 1, 8, delta)
      group.current.scale.setScalar(s)
    }
    if (flag.current) {
      flag.current.rotation.y = Math.sin(clock.elapsedTime * 3) * 0.35
    }
  })

  return (
    <group
      ref={group}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onOpen()
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ''
      }}
    >
      <Part part={MAIN} gable={gable} night={night} />
      {MAIN.annexes?.map((annex, i) => (
        <Part key={i} part={annex} gable={gable} night={night} />
      ))}
      {/* Entrance canopy */}
      <mesh position={[mx, 0.25, mz + MAIN.depth / 2 + 0.07]} castShadow>
        <boxGeometry args={[0.32, 0.03, 0.16]} />
        <meshStandardMaterial color="#ff5c8a" />
      </mesh>
      {/* Flag on the roof */}
      <mesh position={[mx + MAIN.width / 2 - 0.1, height + 0.32, mz]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        <meshStandardMaterial color="#6b6577" />
      </mesh>
      <mesh ref={flag} position={[mx + MAIN.width / 2 - 0.1, height + 0.54, mz]}>
        <boxGeometry args={[0.24, 0.13, 0.01]} />
        <meshStandardMaterial color="#ff8a00" />
      </mesh>
    </group>
  )
}

export type SchoolDioramaProps = {
  night: boolean
  reducedMotion: boolean
  onOpen: () => void
  onReady: () => void
}

/**
 * Homepage diorama of the main building at Palackého náměstí: the school
 * (main block, link and back wing - same model as the town map), the square
 * in front with its fountain, lindens and plague columns, neighbouring row
 * houses, a paper plane doing laps and a day/night mode.
 */
export default function SchoolDiorama({ night, reducedMotion, onOpen, onReady }: SchoolDioramaProps) {
  const ready = useRef(false)

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 32, position: [6.1, 4.8, 8.5], near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true }}
    >
      {night && <color attach="background" args={['#1d2150']} />}
      <hemisphereLight args={[night ? '#5b6bb5' : '#ffffff', night ? '#1d2150' : '#b7d7a0', night ? 0.45 : 0.95]} />
      <directionalLight
        position={night ? [-4, 6, 3] : [5, 8, 4]}
        intensity={night ? 0.35 : 1.6}
        color={night ? '#9fb2ff' : '#ffffff'}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />
      {night && <Stars />}

      <group position={[0, 0, -0.2]}>
        <Platform />
        <School night={night} onOpen={onOpen} />
        <Neighbours night={night} />
        <Fountain position={[1.05, 0, 1.6]} />
        {[
          [0.72, 1.3],
          [1.38, 1.3],
          [0.72, 1.92],
          [1.38, 1.92]
        ].map(([x, z], i) => (
          <Linden key={i} position={[x, 0, z]} shade={i} />
        ))}
        <PlagueColumn position={[-1.5, 0, 1.4]} />
        <PlagueColumn position={[1.85, 0, 1.15]} />
        <Lamp position={[-0.85, 0, 2.2]} night={night} />
        <Lamp position={[1.2, 0, 2.2]} night={night} />
        {/* Trees behind the school */}
        {[
          [-2.3, -1.4],
          [-1.5, -2.1],
          [1.7, -1.8],
          [2.4, -0.9],
          [0.4, -2.4]
        ].map(([x, z], i) => (
          <Linden key={`t${i}`} position={[x, 0, z]} shade={i + 1} />
        ))}
        <PaperPlane animate={!reducedMotion} />
      </group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
        minPolarAngle={0.6}
        maxPolarAngle={1.25}
        target={[0, 0.5, 0.2]}
      />
      <FirstFrame
        onFrame={() => {
          if (!ready.current) {
            ready.current = true
            onReady()
          }
        }}
      />
    </Canvas>
  )
}

function FirstFrame({ onFrame }: { onFrame: () => void }) {
  useFrame(onFrame)
  return null
}
