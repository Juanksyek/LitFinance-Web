import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Heart, User, ThumbsUp, Headphones, Smile, Smartphone, Bot, Globe, MessageCircle } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Diseñadora UX",
    location: "Ciudad de México",
    avatar: <User className="text-blue-500" size={24} />,
    rating: 5,
    text: "LitFinance cambió completamente mi forma de manejar el dinero. Las subcuentas me ayudan a ahorrar sin darme cuenta y los reportes son súper claros.",
    highlight: "Ahorro sin darme cuenta"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Desarrollador",
    location: "Guadalajara",
    avatar: <User className="text-green-500" size={24} />,
    rating: 5,
    text: "Como developer, aprecio la velocidad y la interfaz limpia. La app es súper rápida y nunca se cuelga. Perfecto para alguien que odia las apps lentas.",
    highlight: "Súper rápida y estable"
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Estudiante",
    location: "Monterrey",
    avatar: <User className="text-purple-500" size={24} />,
    rating: 5,
    text: "Me encanta poder crear subcuentas para mis gastos de universidad. Tengo una para libros, otra para transporte... me ayuda muchísimo a organizarme.",
    highlight: "Perfecta para estudiantes"
  },
  {
    id: 4,
    name: "Roberto Silva",
    role: "Empresario",
    location: "Puebla",
    avatar: <User className="text-orange-500" size={24} />,
    rating: 5,
    text: "Los pagos recurrentes automatizados son geniales. Nunca más se me olvida pagar Netflix o Spotify. La app me avisa y yo solo confirmo.",
    highlight: "Nunca olvido un pago"
  },
  {
    id: 5,
    name: "Sofía Herrera",
    role: "Freelancer",
    location: "Mérida",
    avatar: <User className="text-pink-500" size={24} />,
    rating: 5,
    text: "Trabajo con clientes internacionales y el soporte multi-moneda es perfecto. Puedo ver mis ingresos en pesos y dólares sin complicaciones.",
    highlight: "Ideal para freelancers"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setAutoPlay(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setAutoPlay(false)
  }

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      
      <div className="container-app">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart size={16} />
            Lo que dicen nuestros usuarios
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Historias reales,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              resultados reales
            </span>
          </h2>
          <p className="text-xl text-content/70 max-w-2xl mx-auto">
            Más de 50,000 usuarios ya transformaron su relación con el dinero
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 dark:border-white/10 text-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {/* Quote Icon */}
                <motion.div
                  className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Quote size={24} className="text-primary" />
                </motion.div>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed mb-8 text-content">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Highlight */}
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                  {testimonials[currentIndex].highlight}
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-content/60">{testimonials[currentIndex].role}</div>
                    <div className="text-primary text-sm">{testimonials[currentIndex].location}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 dark:border-white/10 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 dark:border-white/10 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Testimonial Indicators */}
        <motion.div 
          className="flex justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setAutoPlay(false)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-content/20 hover:bg-content/40'
              }`}
            />
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { value: "50K+", label: "Usuarios felices", icon: <Smile className="text-yellow-500" size={24} /> },
            { value: "4.9/5", label: "Rating promedio", icon: <Star className="text-yellow-500" size={24} /> },
            { value: "98%", label: "Recomiendan la app", icon: <ThumbsUp className="text-green-500" size={24} /> },
            { value: "24/7", label: "Soporte disponible", icon: <Headphones className="text-blue-500" size={24} /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-content/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-content/60 mb-4">También nos puedes encontrar en:</p>
          <div className="flex justify-center items-center gap-8">
            {[
              { icon: <Smartphone size={16} />, text: 'App Store' },
              { icon: <Bot size={16} />, text: 'Google Play' },
              { icon: <Globe size={16} />, text: 'Web' },
              { icon: <MessageCircle size={16} />, text: 'Redes Sociales' }
            ].map((platform, index) => (
              <motion.span
                key={index}
                className="text-sm font-medium text-content/80 flex items-center gap-2"
                whileHover={{ scale: 1.1, color: '#ef7725' }}
              >
                {platform.icon} {platform.text}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}