// 🔐 Página de Inicio de Sesión - LitFinance
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import type { LoginRequest, ApiError } from '../types/auth';
import { Mail, Lock, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.password) {
      setError(t('auth.allFieldsRequired'));
      return;
    }
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || t('auth.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo y volver */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-6">
              <img src="/images/LitFinance-vector.png" alt="LitFinance" className="h-10 w-10 rounded-lg" />
              <span className="font-bold text-xl">LitFinance</span>
            </Link>
            <h1 className="text-3xl font-bold text-content mt-4">{t('auth.login')}</h1>
            <p className="text-content/60 text-sm mt-2">{t('auth.loginSubtitle')}</p>
          </div>

          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border-black/10 dark:border-white/10 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-content" htmlFor="email">
                  {t('auth.email')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    whileFocus={{ scale: 1.03 }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full origin-left scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100 transition-transform duration-200"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-content" htmlFor="password">
                  {t('auth.password')}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.passwordPlaceholder')}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    whileFocus={{ scale: 1.03 }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full origin-left scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100 transition-transform duration-200"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                <LogIn size={18} />
                {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-content/70">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                {t('auth.register')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
