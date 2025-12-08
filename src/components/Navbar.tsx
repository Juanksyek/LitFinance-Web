import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { Download, Menu, X, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useI18n } from '../hooks/useI18n'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "#features", label: "Características" },
    { href: "#gallery", label: "Galería" },
    { href: "#specs", label: "Especificaciones" },
    { href: "#testimonials", label: "Testimonios" },
    { href: "#descargas", label: "Descargar" }
  ]

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-bg/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg shadow-black/5' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <div className="container-app">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#" 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <img 
                src="/images/LitFinance-vector.png" 
                alt="LitFinance" 
                className="h-15 w-15 rounded-xl shadow-lg group-hover:shadow-primary/25 transition-shadow"
              />
            </div>
            <div>
              <span className="font-bold text-lg">LitFinance</span>
              <div className="text-xs text-primary font-medium">Alfa</div>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-content/80 hover:text-primary transition-colors group whitespace-nowrap"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100"
                  layoutId="nav-underline"
                />
              </motion.a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-3">
            <LanguageSelector />
            <Link to="/login" className="btn btn-secondary text-sm px-3 py-1.5">
              {t('auth.login')}
            </Link>
            <Link to="/register" className="btn btn-primary text-sm px-3 py-1.5">
              {t('auth.register')}
            </Link>
            <ThemeToggle />
            <motion.a 
              href="#descargas" 
              className="btn btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm px-3 py-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Smartphone size={16} />
              <span className="hidden 2xl:inline">{t('nav.downloadApp')}</span>
              <span className="xl:inline 2xl:hidden">App</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="xl:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container-app py-6">
                <nav className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="block py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-content/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>
                <Link to="/login" className="btn btn-secondary w-full mb-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="btn btn-primary w-full mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('auth.register')}
                </Link>
                <motion.a 
                  href="#descargas" 
                  className="btn btn-primary w-full justify-center shadow-lg shadow-primary/25"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={16} />
                  {t('nav.downloadApp')}
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background blur effect */}
      {isScrolled && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/20 to-transparent" />
      )}
    </motion.header>
  )
}