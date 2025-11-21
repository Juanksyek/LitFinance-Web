import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dynamicRouteService } from '../services/dynamicRouteService';
import { SuperSecretAdminPage } from '../pages/SuperSecretAdmin';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Clock } from 'lucide-react';

export const DynamicRouteGuard: React.FC = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidRoute, setIsValidRoute] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const validateRoute = () => {
      const currentPath = window.location.pathname;
      const isValid = dynamicRouteService.isValidSecretRoute(currentPath);
      const remaining = dynamicRouteService.getTimeRemaining();

      setIsValidRoute(isValid);
      setTimeRemaining(remaining);
      setIsValidating(false);

      if (!isValid) {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    validateRoute();

    const interval = setInterval(() => {
      const remaining = dynamicRouteService.getTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0) {
        navigate('/', { replace: true });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white/80">Validando acceso...</p>
        </motion.div>
      </div>
    );
  }

  if (!isValidRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Acceso Denegado
          </h1>
          
          <p className="text-red-200 mb-6">
            La ruta de acceso ha expirado o no es válida. 
            <br />
            <span className="text-sm opacity-75">
              Usa la secuencia secreta para generar una nueva ruta.
            </span>
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-1 bg-red-500 rounded-full mb-4"
          />

          <p className="text-red-300 text-sm">
            Redirigiendo al inicio en unos segundos...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Barra de tiempo restante */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-red-600 text-white p-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Sesión Administrativa Activa</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm opacity-75">restantes</span>
          </div>
        </div>

        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: timeRemaining / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-yellow-400"
        />
      </motion.div>

      <div className="pt-16">
        <SuperSecretAdminPage />
      </div>
    </div>
  );
};
