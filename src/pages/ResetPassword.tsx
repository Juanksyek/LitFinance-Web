// 🔄 Página de Resetear Contraseña - LitFinance
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { resetPassword } from '../services/authService';
import type { ApiError } from '../types/auth';
import { Lock, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const emailFromState = (location.state as { email?: string })?.email || '';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: emailFromState,
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.code || !formData.newPassword) {
      return t('auth.allFieldsRequired');
    }

    if (formData.code.length < 4) {
      return t('auth.codeTooShort');
    }

    if (formData.newPassword.length < 6) {
      return t('auth.passwordTooShort');
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return t('auth.passwordsDontMatch');
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
      await resetPassword(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al resetear la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 p-8 shadow-xl">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-content mb-4">{t('auth.passwordReset')}</h1>
              <p className="text-content/70 mb-6">{t('auth.passwordResetMessage')}</p>
              <p className="text-sm text-content/50">{t('auth.redirectingLogin')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <h1 className="text-3xl font-bold text-content mt-4">{t('auth.resetPasswordTitle')}</h1>
            <p className="text-content/60 text-sm mt-2">{t('auth.resetPasswordSubtitle')}</p>
          </div>

          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border-black/10 dark:border-white/10 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (si no viene del estado) */}
              {!emailFromState && (
                <div>
                  <label className="block text-sm font-medium text-content mb-2" htmlFor="email">
                    {t('auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              )}

              {/* Código de Verificación */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="code">
                  {t('auth.verificationCode')}
                </label>
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="code"
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none w-full min-w-0"
                    placeholder={t('auth.verificationCodePlaceholder')}
                    required
                    maxLength={6}
                    whileFocus={{ scale: 1.03 }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full origin-left scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100 transition-transform duration-200"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  />
                </div>
                <p className="mt-1 text-xs text-content/50">{t('auth.checkEmail')}</p>
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="newPassword">
                  {t('auth.newPassword')}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
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

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="confirmPassword">
                  {t('auth.confirmNewPassword')}
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
                <KeyRound size={18} />
                {isLoading ? t('auth.resetting') : t('auth.resetButton')}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
                <ArrowLeft size={16} />
                {t('auth.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
