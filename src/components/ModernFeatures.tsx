import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Wallet, Repeat, LineChart, ShieldCheck, Sparkles, Zap, Globe, Users, Star, Headphones } from 'lucide-react'

const features = [
  {
    icon: <Wallet className="h-8 w-8" />,
    title: "Metas de ahorro",
    description: "Crea espacios dedicados para cada meta: Ahorro, Viaje, Emergencias. Cada meta con su saldo, historial y personalización visual.",
    highlights: ["Metas ilimitadas", "Recordatorios de abonos", "Estimacion de tiempo para alcanzar la meta"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Repeat className="h-8 w-8" />,
    title: "Automatización Total",
    description: "Programa recordatorios para pagos recurrentes y recibe notificaciones inteligentes. Netflix, Spotify, servicios... todo bajo control automático.",
    highlights: ["Recordatorios smart", "Fechas flexibles", "Categorización auto"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Análisis Avanzado",
    description: "Reportes visuales que revelan patrones en tus finanzas. Filtra por periodo, categoría, moneda y más.",
    highlights: ["Gráficos interactivos", "Exportación CSV", "Predicciones por tendencias"],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Seguridad",
    description: "No compartimos tus datos con terceros.",
    highlights: ["Tus datos son relativos", "Decides que compartir", "Cifrado de datos"],
    gradient: "from-red-500 to-orange-500"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Velocidad Instantánea",
    description: "Interfaz optimizada. Navegación fluida y respuesta inmediata.",
    highlights: ["Cargas rápidas", "Offline ready", "Sync en tiempo real"],
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Multi-moneda",
    description: "Soporte para múltiples divisas con tasas de cambio actualizadas.",
    highlights: ["20+ monedas", "Tasas actualizadas", "Conversión automática"],
    gradient: "from-indigo-500 to-purple-500"
  }
]

export default function ModernFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(239,119,37,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(239,119,37,0.05),transparent_50%)]" />
      </div>

      <div className="container-app">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} />
            Características Principales
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
            Todo lo que necesitas.{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Nada que no uses.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-content/70 max-w-3xl mx-auto leading-relaxed px-2">
            Cada función diseñada con propósito. Cada detalle pensado para hacer 
            tu experiencia financiera más intuitiva y eficiente.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 md:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative h-full p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div 
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-content">
                  {feature.title}
                </h3>
                
                <p className="text-content/80 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (i * 0.1) }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                      <span className="text-content/70">{highlight}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "--", label: "Usuarios activos", icon: <Users className="text-primary" size={24} /> },
            { value: "-.-", label: "Rating promedio", icon: <Star className="text-yellow-500" size={24} /> },
            { value: "--.-%", label: "Tiempo activo", icon: <Zap className="text-green-500" size={24} /> },
            { value: ">1 Hora", label: "Respuesta promedio en soporte", icon: <Headphones className="text-blue-500" size={24} /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-content/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
