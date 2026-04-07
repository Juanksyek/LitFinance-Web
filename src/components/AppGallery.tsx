import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Zap, Shield, TrendingUp, CreditCard, BarChart3, ChevronLeft, ChevronRight, Smartphone, Users, Moon } from 'lucide-react'
import { AndroidLogo, AppleLogo } from './PlatformIcon'

type Platform = 'android' | 'ios'

const screens = [
  {
    id: 1,
    title: "Dashboard Principal",
    description: "Vista general de tus finanzas con saldo total, ingresos y egresos",
    icon: <BarChart3 size={24} />,
    gradient: "from-blue-500 to-cyan-500",
    screenshot: '/images/screenshots/pixel_mockup_2.png',
  },
  {
    id: 2,
    title: "Gastos claros",
    description: "Categorías visuales y gráficos interactivos para entender a dónde va tu dinero",
    icon: <TrendingUp size={24} />,
    gradient: "from-purple-500 to-pink-500",
    screenshot: '/images/screenshots/pixel_mockup_1.png',
  },
  {
    id: 3,
    title: "Subcuentas",
    description: "Organiza tu dinero por objetivos y categorías",
    icon: <CreditCard size={24} />,
    gradient: "from-green-500 to-emerald-500",
    screenshot: '/images/screenshots/pixel_mockup_4.png',
  },
  {
    id: 4,
    title: "Transacciones",
    description: "Historial detallado con filtros avanzados",
    icon: <Zap size={24} />,
    gradient: "from-orange-500 to-red-500",
    screenshot: '/images/screenshots/pixel_mockup_3.png',
  },
  {
    id: 5,
    title: "Escanea Tickets (Beta)",
    description: "Realiza un seguimiento de tus gastos escaneando tus tickets de compra",
    icon: <BarChart3 size={24} />,
    gradient: "from-indigo-500 to-purple-500",
    screenshot: '/images/screenshots/pixel_mockup_5.png',
  },
]

export default function AppGallery() {
  const [selectedScreen, setSelectedScreen] = useState(0)
  const [platform, setPlatform] = useState<Platform>('android')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const goNext = () => setSelectedScreen((s) => (s + 1) % screens.length)
  const goPrev = () => setSelectedScreen((s) => (s - 1 + screens.length) % screens.length)

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container-app">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <AndroidLogo size={16} />
            Explora la App
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Una experiencia{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              diseñada para ti
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-content/70 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Cada pantalla pensada para hacer tu vida financiera más simple y organizada
          </p>

          {/* Platform Toggle */}
          <div className="inline-flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/20 dark:border-white/10">
            <button
              onClick={() => setPlatform('android')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                platform === 'android'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'text-content/60 hover:text-content'
              }`}
            >
              <AndroidLogo size={16} /> Android
            </button>
            <button
              onClick={() => setPlatform('ios')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                platform === 'ios'
                  ? 'bg-gradient-to-r from-gray-700 to-black text-white shadow-lg shadow-black/25'
                  : 'text-content/60 hover:text-content'
              }`}
            >
              <AppleLogo size={16} /> iOS
            </button>
          </div>
        </motion.div>

        {/* Main Display */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10 sm:mb-16">
          {/* Phone Mockup with real screenshot */}
          <motion.div 
            className="relative mx-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${platform}-${selectedScreen}`}
                  src={screens[selectedScreen].screenshot}
                  alt={screens[selectedScreen].title}
                  className="w-[220px] xs:w-[260px] sm:w-[300px] md:w-[340px] h-auto select-none pointer-events-none"
                  draggable={false}
                  initial={{ opacity: 0, scale: 0.9, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -30 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.45))' }}
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={goPrev}
                  className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-primary/20 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={20} className="text-content/70" />
                </button>
                <div className="flex gap-2">
                  {screens.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedScreen(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === selectedScreen ? 'w-6 bg-primary' : 'w-2 bg-content/20 hover:bg-content/40'
                      }`}
                      aria-label={`Screenshot ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-primary/20 transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={20} className="text-content/70" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {screens.map((screen, index) => (
              <motion.button
                key={screen.id}
                className={`w-full text-left p-4 sm:p-6 rounded-2xl transition-all duration-300 ${
                  selectedScreen === index
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
                onClick={() => setSelectedScreen(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    selectedScreen === index 
                      ? 'bg-white/20' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {screen.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{screen.title}</h3>
                    <p className={`text-sm ${
                      selectedScreen === index 
                        ? 'text-white/80' 
                        : 'text-content/60'
                    }`}>
                      {screen.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
              { icon: <Zap size={32} />, title: "Sincronización sin conexión", description: "Accede y edita tus datos sin internet; se sincroniza al reconectar" },
              { icon: <CreditCard size={32} />, title: "Tracker de gastos", description: "Registra, categoriza y sigue tus gastos con reportes claros" },
              { icon: <Moon size={32} />, title: "Modo oscuro", description: "Interfaz nocturna para mayor confort y ahorro de batería" },
              { icon: <Shield size={32} />, title: "Privacidad: sin terceros", description: "No compartimos tus datos con terceros" },
              { icon: <Smartphone size={32} />, title: "Diseño intuitivo", description: "Interfaz limpia y fácil de entender desde el primer uso" },
              { icon: <Users size={32} />, title: "Finanzas en grupo", description: "Comparte y administra gastos con familia, amigos o pareja" }
            ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-content/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}