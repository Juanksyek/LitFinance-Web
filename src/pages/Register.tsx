// 📝 Página de Registro - LitFinance
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import type { RegisterRequest, ApiError } from '../types/auth';
import { UserPlus, Mail, Lock, User, Briefcase, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    edad: 18,
    ocupacion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value) || 0 : value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.nombreCompleto) {
      return t('auth.allFieldsRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return t('auth.invalidEmail');
    }

    if (formData.password.length < 6) {
      return t('auth.passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
      return t('auth.passwordsDontMatch');
    }

    if (formData.edad < 18) {
      return t('auth.mustBe18');
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo y volver */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-6">
              <img src="/images/LitFinance-vector.png" alt="LitFinance" className="h-10 w-10 rounded-lg" />
              <span className="font-bold text-xl">LitFinance</span>
            </Link>
            <h1 className="text-3xl font-bold text-content mt-4">{t('auth.createAccount')}</h1>
            <p className="text-content/60 text-sm mt-2">{t('auth.registerSubtitle')}</p>
          </div>

          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border-black/10 dark:border-white/10 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="nombreCompleto">
                  {t('auth.fullName')} *
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="nombreCompleto"
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.fullNamePlaceholder')}
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

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="email">
                  {t('auth.email')} *
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                    autoComplete="email"
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

              {/* Grid: Edad y Ocupación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-content mb-2" htmlFor="edad">
                    {t('auth.age')} *
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                    <motion.input
                      id="edad"
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
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

                {/* Ocupación */}
                <div>
                  <label className="block text-sm font-medium text-content mb-2" htmlFor="ocupacion">
                    {t('auth.occupation')} *
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                    <motion.input
                      id="ocupacion"
                      type="text"
                      name="ocupacion"
                      value={formData.ocupacion}
                      onChange={handleChange}
                      className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                      placeholder={t('auth.occupationPlaceholder')}
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
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="password">
                  {t('auth.password')} *
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.passwordPlaceholder')}
                    minLength={6}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="confirmPassword">
                  {t('auth.confirmPassword')} *
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.passwordPlaceholder')}
                    minLength={6}
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

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full shadow-lg shadow-primary/20 mt-6"
              >
                <UserPlus size={18} />
                {isLoading ? t('auth.registering') : t('auth.registerButton')}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-content/70">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('auth.login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
