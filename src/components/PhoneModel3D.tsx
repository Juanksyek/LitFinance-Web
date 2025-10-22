import { useEffect, useMemo } from 'react'
import IPhoneModelLoader from './iPhoneModelLoader'

export default function PhoneModel3D({ 
  screenImage,
  onPhoneChange,
  manualRotation 
}: { 
  screenImage?: string
  onPhoneChange?: (phoneInfo: { name: string, brand: string }) => void
  manualRotation?: { x: number, y: number }
}) {
  const phoneInfo = useMemo(() => ({
    name: 'Android',
    brand: 'Próximamente iOS'
  }), [])

  useEffect(() => {
    if (onPhoneChange) {
      onPhoneChange(phoneInfo)
    }
  }, [onPhoneChange, phoneInfo])

  return (
    <IPhoneModelLoader
      screenImage={screenImage}
      manualRotation={manualRotation}
    />
  )
}
