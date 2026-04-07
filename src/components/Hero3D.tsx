import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, DollarSign, Star, Users } from 'lucide-react'
import { AndroidLogo } from './PlatformIcon' // AppleLogo
import PixelPhoneMockup from './PixelPhoneMockup'

export default function Hero3D() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -80])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <motion.section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 dark:from-primary/30 dark:to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,119,37,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,119,37,0.08),transparent_50%)]" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-app relative w-full">
        {/* ── Mobile layout: stacked column ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center min-h-screen py-20 sm:py-24 lg:py-16 gap-6">

          {/* ── Left: Text content ── */}
          <motion.div
            className="flex flex-col gap-5 sm:gap-6 text-center lg:text-left items-center lg:items-start"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.span
              className="badge inline-flex items-center gap-2 text-xs sm:text-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Sparkles size={14} />
              Nuevo en Play Store, próximamente en App Store
            </motion.span>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Controla tus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                finanzas
              </span>
              <br className="hidden sm:block" />{' '}
              sin complicarte
            </motion.h1>

            {/* Sub text */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-content/70 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Cuentas inteligentes, control de pagos recurrentes,
              reportes visuales y más. Todo en una sola app rápida y segura.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.a
                href="#descargas"
                className="btn btn-primary text-sm sm:text-base px-6 py-3 shadow-lg shadow-primary/25 w-full xs:w-auto justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Descargar gratis
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-2 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {[
                { val: '--', label: 'Descargas' },
                { val: '-.-', label: 'Rating', star: true },
                { val: '--%', label: 'Satisfacción' },
              ].map(({ val, label, star }) => (
                <div key={label} className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary">{val}</div>
                  <div className="text-xs text-content/60 flex items-center justify-center gap-1">
                    {star && <Star size={12} className="text-yellow-500" />}
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Footer note */}
            <motion.p
              className="text-[11px] uppercase tracking-wider text-muted pt-2 border-t border-content/10 w-full text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              Hecho con ❤️ en México
            </motion.p>
          </motion.div>

          {/* ── Right: Phone + floating chips ── */}
          <motion.div
            className="relative flex items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <PixelPhoneMockup showToggle />

            {/* Chip – balance */}
            <motion.div
              className="absolute top-8 -left-2 sm:left-2 lg:left-0 xl:-left-4 bg-primary/20 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-primary/30 hidden sm:flex flex-col items-start gap-0.5 shadow-lg"
              animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <DollarSign className="text-primary" size={18} />
              <div className="text-xs text-primary font-semibold whitespace-nowrap">$30,540</div>
            </motion.div>

            {/* Chip – trend */}
            <motion.div
              className="absolute bottom-24 sm:bottom-20 -right-2 sm:right-2 lg:right-0 xl:-right-4 bg-green-500/20 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-green-500/30 hidden sm:flex flex-col items-start gap-0.5 shadow-lg"
              animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <TrendingUp className="text-green-500" size={18} />
              <div className="text-xs text-green-500 font-semibold">+15%</div>
            </motion.div>

            {/* Chip – grupos */}
            <motion.div
              className="absolute top-20 sm:top-24 -right-2 sm:right-2 lg:right-0 xl:-right-4 bg-purple-500/20 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-purple-500/30 hidden sm:flex flex-col items-start gap-0.5 shadow-lg"
              animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            >
              <Users className="text-purple-500" size={18} />
              <div className="text-xs text-purple-500 font-semibold">Grupos</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom platform pill */}
      <motion.div
        className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 dark:border-white/10 text-[11px] sm:text-xs text-content/60">
          <AndroidLogo size={13} className="text-green-500" />
          {/* <AppleLogo size={13} className="text-content/70" /> */}
          <span>Disponible en Android</span>
        </div>
      </motion.div>

      {/* Scroll mouse indicator */}
      <motion.div
        className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-9 border-2 border-content/25 rounded-full flex justify-center">
          <div className="w-1 h-2.5 bg-primary rounded-full mt-1.5 animate-pulse" />
        </div>
      </motion.div>
    </motion.section>
  )
}
