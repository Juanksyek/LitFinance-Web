import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Smartphone, Zap, Shield, TrendingUp, CreditCard, BarChart3, Target, Lightbulb } from 'lucide-react'

const mockScreenshots = [
  {
    id: 1,
    title: "Dashboard Principal",
    description: "Vista general de tus finanzas",
    icon: <BarChart3 size={24} />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Subcuentas",
    description: "Organiza tu dinero por objetivos",
    icon: <CreditCard size={24} />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Transacciones",
    description: "Historial detallado y filtros",
    icon: <TrendingUp size={24} />,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Pagos Recurrentes",
    description: "Automatiza tus servicios",
    icon: <Zap size={24} />,
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    title: "Reportes",
    description: "Análisis visual de gastos",
    icon: <BarChart3 size={24} />,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    title: "Configuración",
    description: "Personaliza tu experiencia",
    icon: <Shield size={24} />,
    color: "from-teal-500 to-green-500"
  }
]

export default function AppGallery() {
  const [selectedScreen, setSelectedScreen] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
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
            <Smartphone size={16} />
            Explora la App
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Una experiencia{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              diseñada para ti
            </span>
          </h2>
          <p className="text-xl text-content/70 max-w-2xl mx-auto">
            Cada pantalla pensada para hacer tu vida financiera más simple y organizada
          </p>
        </motion.div>

        {/* Main Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Phone Mockup */}
          <motion.div 
            className="relative mx-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-80 h-[640px] mx-auto">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <motion.div
                    key={selectedScreen}
                    className={`absolute inset-4 rounded-[2rem] bg-gradient-to-br ${mockScreenshots[selectedScreen].color} flex items-center justify-center`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center text-white">
                      <div className="mb-4 flex justify-center">
                        {mockScreenshots[selectedScreen].icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        {mockScreenshots[selectedScreen].title}
                      </h3>
                      <p className="text-sm opacity-90">
                        {mockScreenshots[selectedScreen].description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
                </div>
              </div>

              {/* Floating UI Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Target className="text-primary" size={24} />
                <div className="text-xs font-semibold text-primary">Meta</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -3, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Lightbulb className="text-primary" size={24} />
                <div className="text-xs font-semibold text-primary">Smart</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {mockScreenshots.map((screen, index) => (
              <motion.button
                key={screen.id}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
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
                    <h3 className="font-semibold text-lg">{screen.title}</h3>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            {
              icon: <Smartphone size={32} />,
              title: "Diseño Intuitivo",
              description: "Interfaz limpia y fácil de usar para todos"
            },
            {
              icon: <Zap size={32} />,
              title: "Súper Rápida",
              description: "Carga instantánea y navegación fluida"
            },
            {
              icon: <Shield size={32} />,
              title: "100% Segura",
              description: "Cifrado de extremo a extremo"
            },
            {
              icon: <Smartphone size={32} />,
              title: "Multiplataforma",
              description: "Disponible en iOS y Android"
            },
            {
              icon: <Shield size={32} />,
              title: "Modo Oscuro",
              description: "Perfecto para usar de noche"
            },
            {
              icon: <CreditCard size={32} />,
              title: "Sincronización",
              description: "Tus datos siempre actualizados"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
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