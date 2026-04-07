import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Monitor, Shield, Zap, Globe, Tablet, HardDrive, Lock, User, Cloud, Database, RefreshCw, Battery, CreditCard, BarChart3, MessageSquare } from 'lucide-react'
import { AppleLogo, AndroidLogo } from './PlatformIcon'

export default function TechSpecs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const specs = [
    {
      category: "Compatibilidad",
      items: [
        { label: "iOS", value: "15.0 o posterior", icon: <AppleLogo className="text-blue-500" size={20} /> },
        { label: "Android", value: "8.0 (API 26) o superior", icon: <AndroidLogo className="text-green-500" size={20} /> },
        { label: "Tablets", value: "iPadOS 15.0 y Android 8.0", icon: <Tablet className="text-purple-500" size={20} /> },
        { label: "Tamaño", value: "145.2 MB", icon: <HardDrive className="text-gray-500" size={20} /> }
      ]
    },
    {
      category: "Seguridad",
      items: [
        { label: "Cifrado", value: "Protegemos tus datos", icon: <Lock className="text-red-500" size={20} /> },
        { label: "Autenticación", value: "Contraseñas y biometría", icon: <User className="text-blue-500" size={20} /> },
        { label: "Backup", value: "Automático y cifrado", icon: <Cloud className="text-sky-500" size={20} /> },
        { label: "Privacidad", value: "Zero-knowledge", icon: <Shield className="text-green-500" size={20} /> }
      ]
    },
    {
      category: "Rendimiento",
      items: [
        { label: "Carga inicial", value: "< 1.3 segundos", icon: <Zap className="text-yellow-500" size={20} /> },
        { label: "Datos optimizados", value: "Compresión y caching", icon: <Database className="text-orange-500" size={20} /> },
        { label: "Sincronización", value: "Tiempo real", icon: <RefreshCw className="text-blue-500" size={20} /> },
        { label: "Uso de batería", value: "Optimizado", icon: <Battery className="text-green-500" size={20} /> }
      ]
    },
    {
      category: "Funcionalidades",
      items: [
        { label: "Subcuentas", value: "Para segmentar tus finanzas", icon: <CreditCard className="text-primary" size={20} /> },
        { label: "Metas", value: "Para lograr objetivos", icon: <Globe className="text-green-500" size={20} /> },
        { label: "Exportación", value: "CSV, Excel, PDF", icon: <BarChart3 className="text-blue-500" size={20} /> },
        { label: "Idiomas", value: "ES, EN (próximamente)", icon: <MessageSquare className="text-purple-500" size={20} /> }
      ]
    }
  ]

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-bg to-bg/50">
      <div className="container-app">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Monitor size={16} />
            Especificaciones Técnicas
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Potencia y precisión en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              cada detalle
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-content/70 max-w-2xl mx-auto px-2">
            Tecnología de vanguardia optimizada para ofrecerte la mejor experiencia financiera
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-16">
          {specs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="space-y-6"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-xl font-bold text-primary border-b border-primary/20 pb-2">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 119, 37, 0.05)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span>{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-content/90">{item.label}</div>
                      <div className="text-xs text-content/60 mt-1">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Disponible en tus dispositivos favoritos</h3>
          <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-12">
            {[
              { icon: <AppleLogo size={48} />, name: "iOS", color: "text-gray-700" },
              { icon: <AndroidLogo size={48} />, name: "Android", color: "text-green-600" },
            ].map((platform, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-3"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className={`${platform.color}`}>
                  {platform.icon}
                </div>
                <span className="text-sm font-medium text-content/80">{platform.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/20 dark:border-white/10">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Requisitos del Sistema</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <AppleLogo size={24} className="text-gray-700" />
                  <h4 className="text-lg font-semibold">iOS</h4>
                </div>
                <div className="space-y-2 text-sm text-content/80">
                  <div>• iOS 15.0 o posterior</div>
                  <div>• iPhone 8 o posterior</div>
                  <div>• 150 MB de espacio libre</div>
                  <div>• Conexión a internet</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <AndroidLogo size={24} className="text-green-600" />
                  <h4 className="text-lg font-semibold">Android</h4>
                </div>
                <div className="space-y-2 text-sm text-content/80">
                  <div>• Android 8.0 (API nivel 26)</div>
                  <div>• 2 GB de RAM mínimo</div>
                  <div>• 150 MB de espacio libre</div>
                  <div>• Google Play Services</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
