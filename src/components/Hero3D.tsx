import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Play, TrendingUp, DollarSign, Building2, Star } from 'lucide-react'
import PhoneModel3D from './PhoneModel3D'

export default function Hero3D() {
  const [currentPhone, setCurrentPhone] = useState({ name: 'iPhone 14 Pro', brand: 'Apple' })
  const [manualRotation, setManualRotation] = useState<{ x: number, y: number } | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Si estamos arrastrando, actualizar la rotación manual
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        setManualRotation({
          x: deltaY * 0.01,
          y: deltaX * 0.01
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  return (
    <motion.section 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 dark:from-primary/30 dark:to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,119,37,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,119,37,0.05),transparent_50%)]" />
      </div>

      <div className="container-app relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="badge mb-6 inline-flex items-center gap-2">
                <Sparkles size={16} /> 
                Nuevo en la App Store
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
                Controla tus{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  finanzas
                </span>
                <br />
                sin complicarte
              </h1>
            </motion.div>

            <motion.p 
              className="text-xl text-content/70 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Subcuentas inteligentes, pagos recurrentes automatizados, 
              reportes visuales y más. Todo en una sola app elegante y segura.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.a 
                href="#descargas" 
                className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-primary/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Descargar gratis 
                <ArrowRight size={20} />
              </motion.a>
              
              <motion.button 
                className="btn btn-ghost text-lg px-8 py-4 border border-content/10"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 119, 37, 0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={18} />
                Ver demo
              </motion.button>
            </motion.div>

            <motion.div 
              className="flex items-center gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-content/60">Descargas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-sm text-content/60 flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" /> Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-content/60">Satisfacción</div>
              </div>
            </motion.div>

            <motion.div 
              className="text-xs uppercase tracking-wider text-muted pt-4 border-t border-content/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              Hecho con cariño, de México para el mundo
            </motion.div>
          </motion.div>

          {/* Right - 3D Phone */}
          <motion.div 
            className="relative h-[700px] lg:h-[800px] w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            }>
              <div 
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                className="w-full h-full"
              >
                <Canvas
                  camera={{ position: [0, 0, 12], fov: 40 }}
                  style={{ background: 'transparent' }}
                >
                {/* Iluminación mejorada para teléfonos modernos */}
                <ambientLight intensity={0.4} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={1.2}
                  castShadow
                />
                <directionalLight 
                  position={[-5, 8, 2]} 
                  intensity={0.8}
                  color="#ff9500"
                />
                <pointLight 
                  position={[5, -5, 3]} 
                  intensity={0.6}
                  color="#ffffff"
                />
                <pointLight 
                  position={[-5, 5, -3]} 
                  intensity={0.4}
                  color="#0096ff"
                />
                <spotLight
                  position={[0, 15, 8]}
                  angle={0.15}
                  penumbra={1}
                  intensity={0.8}
                  castShadow
                />
                
                <PhoneModel3D 
                  onPhoneChange={setCurrentPhone}
                  manualRotation={manualRotation}
                  screenImage="/screens/ejemplo-litfinance.svg" // Imagen personalizada opcional
                />
                </Canvas>
              </div>
            </Suspense>

            {/* Floating elements around phone */}
            <motion.div
              className="absolute top-20 left-10 bg-primary/20 backdrop-blur-sm rounded-2xl p-4 border border-primary/30"
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
              <DollarSign className="text-primary mb-1" size={20} />
              <div className="text-xs text-primary font-semibold">$1,234</div>
            </motion.div>

            <motion.div
              className="absolute bottom-32 right-16 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30"
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <TrendingUp className="text-green-600 mb-1" size={20} />
              <div className="text-xs text-green-600 font-semibold">+15%</div>
            </motion.div>

            <motion.div
              className="absolute top-32 right-8 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <Building2 className="text-blue-600 mb-1" size={20} />
              <div className="text-xs text-blue-600 font-semibold">Bank</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Phone model indicator and controls */}
      <motion.div 
        className="absolute bottom-20 right-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        key={currentPhone.name}
      >
        <motion.div 
          className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs text-content/60 mb-1">Disponible para:</div>
          <div className="text-sm font-semibold text-primary">{currentPhone.name}</div>
          <div className="text-xs text-content/50">{currentPhone.brand}</div>
          <div className="flex gap-1 mt-2 mb-3">
            {['iPhone 15 Pro', 'Pixel 8 Pro', 'Galaxy S24 Ultra'].map((phone) => (
              <div 
                key={phone}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPhone.name === phone 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-primary/30'
                }`} 
              />
            ))}
          </div>
          <div className="text-xs text-content/40 border-t border-white/10 pt-2">
            🖱️ Arrastra para rotar • ✋ Rotación automática
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-content/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </motion.section>
  )
}