import React, { useState, useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

const SuperSecretAdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    } else {
      // Mostrar pantalla de login después de un breve delay
      setTimeout(() => setShowLogin(true), 1000);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= MAX_ATTEMPTS) {
      setError('Demasiados intentos fallidos. Acceso bloqueado.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const mockAuth = 
        credentials.email === 'elgalleto12393@gmail.com' && 
        credentials.password === 'Admin123';

      if (mockAuth) {
        // Simular token JWT
        const mockToken = btoa(JSON.stringify({
          email: credentials.email,
          role: 'admin',
          exp: Date.now() + (24 * 60 * 60 * 1000)
        }));
        
        localStorage.setItem('litfinance_admin_token', mockToken);
        setIsAuthenticated(true);
        setError('');
      } else {
        setAttempts(prev => prev + 1);
        setError(`Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - attempts - 1}`);
      }
    } catch {
      setAttempts(prev => prev + 1);
      setError('Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('litfinance_admin_token');
    setIsAuthenticated(false);
    setShowLogin(false);
    setCredentials({ email: '', password: '' });
    setAttempts(0);
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  // Pantalla de carga inicial
  if (!showLogin && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300 font-mono text-sm">Verificando permisos de acceso...</p>
        </motion.div>
      </div>
    );
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800/90 backdrop-blur-xl border border-red-500/30 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                ACCESO RESTRINGIDO
              </h1>
              <p className="text-gray-400 text-sm font-mono">
                Sistema de Administración LitFinance
              </p>
            </div>

            {attempts >= MAX_ATTEMPTS ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-red-400 text-4xl mb-4">🚫</div>
                <p className="text-red-400 font-semibold mb-2">ACCESO BLOQUEADO</p>
                <p className="text-gray-500 text-sm">Demasiados intentos fallidos</p>
                <motion.button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Volver al inicio
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email de Administrador
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="admin@litfinance.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verificando...
                    </span>
                  ) : (
                    '🔐 Acceder al Sistema'
                  )}
                </motion.button>

                <div className="text-center">
                  <motion.button
                    type="button"
                    onClick={() => window.location.href = '/'}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    ← Volver al inicio
                  </motion.button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-xs text-center font-mono">
                Sistema de seguridad activado • Intentos: {attempts}/{MAX_ATTEMPTS}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Panel de administración
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de Reportes - LitFinance
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚪 Cerrar Sesión
          </motion.button>
        </div>
      </div>

      <AdminPanel onClose={handleLogout} />
    </div>
  );
};

export { SuperSecretAdminPage };