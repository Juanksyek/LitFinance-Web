import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AndroidLogo, AppleLogo } from './PlatformIcon'

type Platform = 'android' | 'ios'

const platformScreenshots: Record<Platform, string[]> = {
  android: [
    '/images/screenshots/pixel_mockup_2.png',
    '/images/screenshots/pixel_mockup_1.png',
    '/images/screenshots/pixel_mockup_3.png',
    '/images/screenshots/pixel_mockup_4.png',
    '/images/screenshots/pixel_mockup_5.png',
  ],
  ios: [
    '/images/screenshots/pixel_mockup_1.png',
    '/images/screenshots/pixel_mockup_2.png',
    '/images/screenshots/pixel_mockup_3.png',
    '/images/screenshots/pixel_mockup_4.png',
    '/images/screenshots/pixel_mockup_5.png',
  ],
}

export default function PixelPhoneMockup({
  imageSrc,
  showToggle = true,
}: {
  imageSrc?: string
  showToggle?: boolean
}) {
  const [platform, setPlatform] = useState<Platform>('android')
  const [currentIndex, setCurrentIndex] = useState(0)

  const screenshots = platformScreenshots[platform]
  const displaySrc = imageSrc || screenshots[currentIndex]

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Platform Toggle */}
      {showToggle && (
        <motion.div
          className="inline-flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/20 dark:border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <button
            onClick={() => { setPlatform('android'); setCurrentIndex(0) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              platform === 'android'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                : 'text-content/60 hover:text-content'
            }`}
          >
            <AndroidLogo size={16} />
            Android
          </button>
          <button
            onClick={() => { setPlatform('ios'); setCurrentIndex(0) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              platform === 'ios'
                ? 'bg-gradient-to-r from-gray-700 to-black text-white shadow-lg shadow-black/25'
                : 'text-content/60 hover:text-content'
            }`}
          >
            <AppleLogo size={16} />
            iOS
          </button>
        </motion.div>
      )}

      {/* Phone Mockup */}
      <motion.div
        className="relative will-change-transform"
        style={{ perspective: 1200 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={displaySrc}
              src={displaySrc}
              alt={`LitFinance en ${platform === 'android' ? 'Android' : 'iOS'}`}
              className="block w-[220px] xs:w-[240px] sm:w-[280px] md:w-[300px] lg:w-[340px] h-auto select-none pointer-events-none"
              draggable={false}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.5))',
              }}
            />
          </AnimatePresence>

          {/* Glow effect behind phone */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 blur-3xl opacity-20"
            style={{
              background: platform === 'android'
                ? 'radial-gradient(circle, rgba(34,197,94,0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(147,197,253,0.4), transparent 70%)',
            }}
          />
        </div>
      </motion.div>

      {/* Screenshot Dots */}
      {showToggle && (
        <div className="flex items-center gap-2">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-primary w-6 rounded-full'
                  : 'bg-content/20 hover:bg-content/40'
              }`}
              aria-label={`Screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
