import React from 'react'
import { FaAndroid, FaApple } from 'react-icons/fa'
import { Smartphone as LucidePhone } from 'lucide-react'

export function AndroidLogo({ className, size = 20 }: { className?: string; size?: number }) {
  return <FaAndroid size={size} className={className} />
}

export function AppleLogo({ className, size = 20 }: { className?: string; size?: number }) {
  return <FaApple size={size} className={className} />
}

export function PhoneFallback({ className, size = 20 }: { className?: string; size?: number }) {
  return <LucidePhone size={size} className={className} />
}

export default {
  AndroidLogo,
  AppleLogo,
  PhoneFallback,
}
