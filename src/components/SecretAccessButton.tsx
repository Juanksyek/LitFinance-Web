import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, X } from 'lucide-react';

interface SecretAccessButtonProps {
  show: boolean;
  timeRemaining: number;
  onAccess: () => void;
  onClose: () => void;
}

export const SecretAccessButton: React.FC<SecretAccessButtonProps> = ({
  show,
  timeRemaining,
  onAccess,
  onClose
}) => {
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 shadow-2xl border-2 border-red-500/30 backdrop-blur-sm">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-700 hover:bg-red-800 rounded-full flex items-center justify-center text-white text-xs transition-colors"
            >
              <X size={12} />
            </button>

            {/* Contenido principal */}
            <div className="flex flex-col items-center space-y-3">
              {/* Icono y título */}
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">
                  Acceso Secreto Activado
                </span>
              </div>

              {/* Temporizador */}
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-1">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 font-mono text-sm">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Botón de acceso */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccess}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-white/30 backdrop-blur-sm"
              >
                🔓 Acceder al Panel
              </motion.button>

              {/* Mensaje de advertencia */}
              <p className="text-white/80 text-xs text-center max-w-40">
                Ruta temporal generada. Expira automáticamente.
              </p>
            </div>

            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// commit
