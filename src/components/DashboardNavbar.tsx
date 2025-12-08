import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { Menu, X, Smartphone, LogOut, LayoutDashboard, BarChart3, History } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useI18n } from '../hooks/useI18n'
import { useAuth } from '../hooks/useAuth'

export default function DashboardNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analíticas', icon: BarChart3 },
    { path: '/historial', label: 'Historial', icon: History }
  ];

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
          {/* Logo / Welcome Message */}
          <motion.div 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <img 
                src="/images/LitFinance-vector.png" 
                alt="LitFinance" 
                className="h-15 w-15 rounded-xl shadow-lg group-hover:shadow-primary/25 transition-shadow"
              />
            </div>
            <div>
              <span className="font-bold text-lg">Bienvenido</span>
              <div className="text-xs text-primary font-medium">{user?.nombre || user?.nombreCompleto || 'Usuario'}</div>
            </div>
          </motion.div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-4 2xl:gap-6">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1 mr-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'text-content/70 hover:text-content hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <LanguageSelector />
            <ThemeToggle />
            <motion.a 
              href="#descargas" 
              className="btn btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm px-3 py-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Smartphone size={16} />
              <span className="hidden 2xl:inline">{t('nav.downloadApp')}</span>
              <span className="lg:inline 2xl:hidden">App</span>
            </motion.a>
            <motion.button 
              onClick={handleLogout}
              className="btn btn-secondary shadow-lg text-sm px-3 py-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              <span className="hidden 2xl:inline">Cerrar Sesión</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
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
              className="lg:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container-app py-6">
                {/* Navigation Links */}
                <div className="space-y-2 mb-4">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-lg shadow-primary/30'
                              : 'bg-white/10 text-content hover:bg-white/20'
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.a 
                  href="#descargas" 
                  className="btn btn-primary w-full justify-center shadow-lg shadow-primary/25 mb-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Smartphone size={16} />
                  {t('nav.downloadApp')}
                </motion.a>
                <motion.button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn btn-secondary w-full justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </motion.button>
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
