import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/* ----------------------------- Light Rig inline ---------------------------- */

type LightRigProps = {
  color?: string
  intensity?: number
  radius?: number
  azimuth?: number   // grados (0 = +X, aumenta hacia +Z)
  elevation?: number // grados (0 = horizonte, 90 = arriba)
  enableKeys?: boolean
  shadows?: boolean
  helper?: boolean
  target?: [number, number, number]
}

/**
 * Atajos (si enableKeys):
 *  J / L → azimut -/+ 5°
 *  I / K → elevación +/− 3°
 *  U / O → radio -/+ 0.2
 *  - / = → intensidad -/+ 0.2
 *  1/2/3 → presets (neutro / cálido / frío)
 */
function LightRig({
  color = '#ffffff',
  intensity = 2.2,
  radius = 2.0,
  azimuth = -35,
  elevation = 25,
  enableKeys = true,
  shadows = true,
  target = [0, 0, 0],
}: LightRigProps) {
  const keyRef = useRef<THREE.DirectionalLight>(null!)
  const rimRef = useRef<THREE.DirectionalLight>(null!)
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D())

  const [state, setState] = useState({ radius, azimuth, elevation, intensity, color })

  useEffect(() => {
    targetRef.current.position.set(...target)
    targetRef.current.updateMatrixWorld()
  }, [target.join(',')])

  useEffect(() => {
    if (!enableKeys) return
    const onKey = (e: KeyboardEvent) => {
      setState((s) => {
        const n = { ...s }
        const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
        switch (e.key) {
          case 'j': case 'J': n.azimuth -= 5; break
          case 'l': case 'L': n.azimuth += 5; break
          case 'i': case 'I': n.elevation = clamp(n.elevation + 3, -5, 85); break
          case 'k': case 'K': n.elevation = clamp(n.elevation - 3, -5, 85); break
          case 'u': case 'U': n.radius = clamp(n.radius - 0.2, 0.6, 6); break
          case 'o': case 'O': n.radius = clamp(n.radius + 0.2, 0.6, 6); break
          case '-': n.intensity = clamp(n.intensity - 0.2, 0, 10); break
          case '=': case '+': n.intensity = clamp(n.intensity + 0.2, 0, 10); break
          case '1': n.azimuth = -35; n.elevation = 25; n.radius = 2.0; n.intensity = 2.2; n.color = '#ffffff'; break
          case '2': n.azimuth = 20; n.elevation = 45; n.radius = 1.6; n.intensity = 2.6; n.color = '#ffe2bf'; break
          case '3': n.azimuth = -120; n.elevation = 15; n.radius = 2.8; n.intensity = 2.0; n.color = '#bfe3ff'; break
          default: return s
        }
        return n
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enableKeys])

  const keyPos = useMemo(() => new THREE.Vector3(), [])
  const rimPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const phi = THREE.MathUtils.degToRad(90 - state.elevation)
    const theta = THREE.MathUtils.degToRad(state.azimuth)

    keyPos.setFromSpherical(new THREE.Spherical(state.radius, phi, theta))
    rimPos.setFromSpherical(new THREE.Spherical(state.radius * 1.2, phi, theta + Math.PI))

    if (keyRef.current) {
      keyRef.current.position.copy(keyPos)
      keyRef.current.intensity = state.intensity
      keyRef.current.color.set(state.color)
      keyRef.current.target.position.copy(targetRef.current.position)
      keyRef.current.target.updateMatrixWorld()
    }
    if (rimRef.current) {
      rimRef.current.position.copy(rimPos)
      rimRef.current.intensity = state.intensity * 0.45
      rimRef.current.color.set('#ffffff')
      rimRef.current.target.position.copy(targetRef.current.position)
      rimRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <>
      <directionalLight
        ref={keyRef}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={2}
      />
      <hemisphereLight color={'#ffffff'} groundColor={'#1b1b1b'} intensity={0.35} />
      <directionalLight ref={rimRef} castShadow={false} />
      <primitive object={targetRef.current} />
    </>
  )
}

/* --------------------------- iPhone + materiales --------------------------- */

type Props = {
  screenImage?: string
  manualRotation?: { x: number; y: number }
  light?: Partial<LightRigProps>
}

export default function IPhone14ProModelGLB({ screenImage, manualRotation, light }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF('/models/iphone_14_pro.glb')
  const { scene } = gltf

  const clonedScene = useMemo(() => {
    const root = (scene?.clone?.(true) as THREE.Group) || new THREE.Group()

    const reLens = /(lens|camera_glass)/i
    const reLensRing = /(ring|rim|trim|camera_metal|metal_ring)/i
    const reFrontGlass = /(front_glass|glass_front|screen_glass|display_glass|frontglass)/i
    const reBackGlass  = /(back_glass|rear_glass|backglass)/i

    root.traverse((obj: THREE.Object3D) => {
      if (!(obj instanceof THREE.Mesh)) return
      const mesh = obj as THREE.Mesh
      mesh.castShadow = mesh.receiveShadow = true

      const name = mesh.name.toLowerCase()
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : (mesh.material as THREE.Material | undefined)

      const toPhysical = (m: THREE.Material) => {
        if (m instanceof THREE.MeshPhysicalMaterial) return m
        const p = new THREE.MeshPhysicalMaterial()
        THREE.MeshStandardMaterial.prototype.copy.call(p, m as THREE.Material)
        return p
      }

      if (mat) {
        if (reFrontGlass.test(name) || reBackGlass.test(name)) {
          const p = toPhysical(mat)
          p.color = new THREE.Color('#0d0d0f')
          p.metalness = 0
          p.roughness = 0.12
          p.clearcoat = 1
          p.clearcoatRoughness = 0.06
          p.envMapIntensity = 1.2
          p.transparent = false
          p.depthWrite = true
          p.depthTest  = true
          p.transmission = 0
          p.opacity = 1
          mesh.material = p
          mesh.renderOrder = 5
        } else if (reLens.test(name)) {
          const p = toPhysical(mat)
          p.color = new THREE.Color('#111214')
          p.metalness = 0
          p.roughness = 0.06
          p.clearcoat = 1
          p.clearcoatRoughness = 0.04
          p.envMapIntensity = 0.9
          p.transparent = false
          p.depthWrite = true
          p.transmission = 0
          mesh.material = p
          mesh.renderOrder = 2
        } else if (reLensRing.test(name)) {
          const s = mat instanceof THREE.MeshStandardMaterial ? mat : new THREE.MeshStandardMaterial()
          s.color = new THREE.Color('#1a1a1a')
          s.metalness = 1
          s.roughness = 0.25
          s.envMapIntensity = 1.5
          s.transparent = false
          s.depthWrite = true
          mesh.material = s
          mesh.renderOrder = 2
        } else {
          const s = mat instanceof THREE.MeshStandardMaterial ? mat : new THREE.MeshStandardMaterial()
          s.envMapIntensity = 1.2
          s.transparent = false
          s.depthWrite = true
          mesh.material = s
        }
      }
    })

    const box = new THREE.Box3().setFromObject(root)
    const center = box.getCenter(new THREE.Vector3())
    root.position.sub(center)

    return root
  }, [scene])

  const tex = useTexture(screenImage || '')
  useEffect(() => {
    if (!screenImage || !tex) return
    tex.flipY = false
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.needsUpdate = true
  }, [tex, screenImage])

  const hasScreenMesh = useMemo(() => {
    let found = false
    clonedScene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && /screen|display|pantalla/i.test(o.name)) found = true
    })
    return found
  }, [clonedScene])

  useEffect(() => {
    if (!screenImage || !tex) return
    if (!hasScreenMesh) return

    clonedScene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && /screen|display|pantalla/i.test(o.name)) {
        const m = new THREE.MeshPhysicalMaterial({
          map: tex,
          emissiveMap: tex,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.55,
          roughness: 0.85,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          side: THREE.FrontSide,
          transparent: false,
          depthWrite: true,
          depthTest: true,
        })
        ;(o as THREE.Mesh).material = m
        ;(o as THREE.Mesh).renderOrder = 1
      }
    })
  }, [clonedScene, hasScreenMesh, screenImage, tex])

  const needsOverlay = !hasScreenMesh
  const baseEuler = useMemo(() => new THREE.Euler(0, Math.PI, 0), [])
  const targetQuat = useMemo(() => new THREE.Quaternion(), [])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const dx = manualRotation?.x ?? 0
    const dy = manualRotation?.y ?? 0
    const e = new THREE.Euler(baseEuler.x + dx, baseEuler.y + dy, 0, 'XYZ')
    targetQuat.setFromEuler(e)
    g.quaternion.slerp(targetQuat, 0.12)
  })

  // Valores por defecto del rig + override desde prop `light`
  const lightCfg: LightRigProps = {
    color: '#ffffff',
    intensity: 2.2,
    azimuth: -35,
    elevation: 25,
    radius: 2.0,
    enableKeys: true,
    shadows: true,
    helper: false,
    target: [0, 0, 0],
    ...(light || {}),
  }

  return (
    <>
      {/* Rig de luces controlable */}
      <LightRig {...lightCfg} />

      {/* Modelo */}
      <group ref={groupRef} scale={[40, 40, 40]}>
        <primitive object={clonedScene} />

        {needsOverlay && (
          <mesh position={[0, 0, -0.0126]} renderOrder={0}>
            <planeGeometry args={[0.063, 0.137]} />
            {screenImage && tex ? (
              <meshPhysicalMaterial
                map={tex}
                emissiveMap={tex}
                emissive={0xffffff}
                emissiveIntensity={0.55}
                roughness={0.85}
                metalness={0}
                clearcoat={1}
                clearcoatRoughness={0.12}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
                transparent={false}
                depthWrite
                depthTest
                side={THREE.FrontSide}
              />
            ) : (
              <meshPhysicalMaterial
                color={'#121212'}
                emissive={'#0b0b0b'}
                emissiveIntensity={0.3}
                clearcoat={1}
                clearcoatRoughness={0.15}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
                transparent={false}
                depthWrite
                depthTest
                side={THREE.FrontSide}
              />
            )}
          </mesh>
        )}
      </group>
    </>
  )
}

useGLTF.preload('/models/iphone_14_pro.glb')
