// 📧 Página de Olvidé Contraseña - LitFinance
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { forgotPassword } from '../services/authService';
import type { ApiError } from '../types/auth';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError(t('auth.fillAllFields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al enviar el código de recuperación');
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
              <h1 className="text-2xl font-bold text-content mb-4">{t('auth.codeSent')}</h1>
              <p className="text-content/70 mb-6">{t('auth.codeSentMessage')}</p>
              <p className="text-sm text-content/50">{t('auth.redirecting')}</p>
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
            <h1 className="text-3xl font-bold text-content mt-4">{t('auth.forgotPasswordTitle')}</h1>
            <p className="text-content/60 text-sm mt-2">{t('auth.forgotPasswordSubtitle')}</p>
          </div>

          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border-black/10 dark:border-white/10 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-content mb-2" htmlFor="email">
                  {t('auth.email')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-content/40 transition-colors group-focus-within:text-primary group-hover:text-primary" size={18} />
                  <motion.input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="input pl-10 border-2 border-transparent focus:border-primary group-hover:border-primary transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 shadow-sm focus:shadow-primary/10 rounded-xl outline-none"
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

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full shadow-lg shadow-primary/20"
              >
                <Mail size={18} />
                {isLoading ? t('auth.sendingCode') : t('auth.sendCode')}
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
