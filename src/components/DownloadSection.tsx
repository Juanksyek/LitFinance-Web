import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Apple, Smartphone, Download, Star, Shield, Zap, Rocket } from 'lucide-react'

export default function DownloadSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
      
      <div className="container-app">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Download size={16} />
            Descarga Gratuita
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Disponible en todas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              tus plataformas
            </span>
          </h2>
          <p className="text-xl text-content/70 max-w-2xl mx-auto">
            Descarga LitFinance gratis y comienza a transformar tu relación con el dinero hoy mismo
          </p>
        </motion.div>

        {/* Main Download Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* iOS Card */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-black rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 overflow-hidden">
              {/* iOS Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-500/10 to-transparent rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Apple size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">iOS</h3>
                    <p className="text-content/60">iPhone y iPad</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">iOS 15.0 o posterior</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">45.2 MB • Gratis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">⭐ 4.9 rating</span>
                  </div>
                </div>

                <motion.a
                  href="#"
                  className="btn btn-primary w-full text-lg py-4 shadow-lg shadow-primary/25"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Apple size={20} />
                  Descargar en App Store
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Android Card */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 overflow-hidden">
              {/* Android Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Android</h3>
                    <p className="text-content/60">Teléfonos y tablets</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">Android 8.0 o superior</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">42.8 MB • Gratis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm">⭐ 4.8 rating</span>
                  </div>
                </div>

                <motion.a
                  href="#"
                  className="btn btn-primary w-full text-lg py-4 shadow-lg shadow-primary/25"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Smartphone size={20} />
                  Descargar en Google Play
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Row */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: <Shield size={20} />, title: "100% Seguro", description: "Descarga verificada" },
            { icon: <Zap size={20} />, title: "Sin Publicidad", description: "Experiencia limpia" },
            { icon: <Star size={20} />, title: "Actualizaciones", description: "Gratis para siempre" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-3">
                {feature.icon}
              </div>
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-content/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm">
            <Rocket size={16} /> Próximamente: Versión web y escritorio
          </div>
        </motion.div>
      </div>
    </section>
  )
}