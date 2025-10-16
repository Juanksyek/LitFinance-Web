import { Suspense } from 'react'
import IPhone14ProModelGLB from './iPhone14ProModelGLB'

export default function IPhoneModelLoader({
  screenImage,
  manualRotation,
}: {
  screenImage?: string
  manualRotation?: { x: number; y: number }
}) {
  return (
    <Suspense
      fallback={
        <group>
          <mesh scale={[6, 6, 6]}>
            <boxGeometry args={[0.05, 0.1, 0.005]} />
            <meshStandardMaterial color="#5e5e60" transparent opacity={0.7} />
          </mesh>
        </group>
      }
    >
      <IPhone14ProModelGLB
        screenImage={screenImage}
        manualRotation={manualRotation}
      />
    </Suspense>
  )
}
// commit
