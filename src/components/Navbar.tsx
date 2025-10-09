import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { Download, Menu, X, Smartphone, Shield } from 'lucide-react'
import { useAdminAccess } from '../hooks/useAdminAccess'

const AdminAccessButton = () => {
  const { showAdminAccess, generateDynamicRoute, closeAdminAccess } = useAdminAccess();

  const handleAdminAccess = () => {
    const dynamicRoute = generateDynamicRoute();
    localStorage.setItem('litfinance_admin_route', dynamicRoute);
    localStorage.setItem('litfinance_admin_token', 'temp-access-' + Date.now());
    
    window.location.href = dynamicRoute;
  };

  if (!showAdminAccess) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="fixed top-20 right-4 z-[100] bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-xl shadow-2xl border border-red-500/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <Shield className="w-5 h-5" />
        <span className="font-semibold text-sm">Acceso Administrativo</span>
        <button 
          onClick={closeAdminAccess}
          className="ml-2 w-5 h-5 hover:bg-white/20 rounded-full flex items-center justify-center text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="flex gap-2">
        <motion.button
          onClick={handleAdminAccess}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🛡️ Dashboard Reportes
        </motion.button>
      </div>
      
      <p className="text-white/70 text-xs mt-2">
        Ruta dinámica temporal generada
      </p>
    </motion.div>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-content/80 hover:text-primary transition-colors group"
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
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <motion.a 
              href="#descargas" 
              className="btn btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Smartphone size={16} />
              Descargar App
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
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
              className="lg:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-2xl"
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
                  Descargar App
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
      
      {/* Acceso súper secreto */}
      <AdminAccessButton />
    </motion.header>
  )
}
// commit