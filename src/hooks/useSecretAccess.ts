// 🔐 Hook para Manejo de Secuencia Secreta y Rutas Dinámicas
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dynamicRouteService } from '../services/dynamicRouteService';

const SECRET_SEQUENCE = 'admin2025litfinance';

interface SecretAccessState {
  showAdminButton: boolean;
  currentSecretRoute: string | null;
  timeRemaining: number;
}

export const useSecretAccess = () => {
  const navigate = useNavigate();
  const [secretState, setSecretState] = useState<SecretAccessState>({
    showAdminButton: false,
    currentSecretRoute: null,
    timeRemaining: 0
  });

  const [sequenceBuffer, setSequenceBuffer] = useState('');
  const [showingButton, setShowingButton] = useState(false);

  // Actualizar el tiempo restante de la ruta
  useEffect(() => {
    const updateTimeRemaining = () => {
      const remaining = dynamicRouteService.getTimeRemaining();
      const currentRoute = dynamicRouteService.getCurrentSecretRoute();
      
      setSecretState(prev => ({
        ...prev,
        timeRemaining: remaining,
        currentSecretRoute: currentRoute
      }));

      // Si la ruta expiró, ocultar el botón
      if (remaining === 0 && showingButton) {
        setShowingButton(false);
        setSecretState(prev => ({ ...prev, showAdminButton: false }));
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [showingButton]);

  // Manejar la secuencia de teclas
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const char = event.key.toLowerCase();
    
    setSequenceBuffer(prev => {
      const newBuffer = (prev + char).slice(-SECRET_SEQUENCE.length);
      
      if (newBuffer === SECRET_SEQUENCE) {
        // ¡Secuencia completada!
        const newRoute = dynamicRouteService.generateSecretRoute();
        
        setSecretState(prev => ({
          ...prev,
          showAdminButton: true,
          currentSecretRoute: newRoute,
          timeRemaining: 5 * 60 * 1000 // 5 minutos
        }));
        
        setShowingButton(true);
        
        // Limpiar el buffer
        setTimeout(() => setSequenceBuffer(''), 100);
        
        // Auto-ocultar el botón después de 5 minutos
        setTimeout(() => {
          setShowingButton(false);
          setSecretState(prev => ({ ...prev, showAdminButton: false }));
        }, 5 * 60 * 1000);

        return '';
      }
      
      return newBuffer;
    });
  }, []);

  // Registrar el event listener para las teclas
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Navegar al panel de admin
  const navigateToAdmin = () => {
    const currentRoute = dynamicRouteService.getCurrentSecretRoute();
    if (currentRoute) {
      // Extender el tiempo de vida de la ruta
      dynamicRouteService.extendCurrentRoute();
      navigate(currentRoute);
    }
  };

  // Cerrar acceso secreto
  const closeSecretAccess = () => {
    dynamicRouteService.clearSecretRoute();
    setShowingButton(false);
    setSecretState({
      showAdminButton: false,
      currentSecretRoute: null,
      timeRemaining: 0
    });
  };

  return {
    ...secretState,
    navigateToAdmin,
    closeSecretAccess,
    isSequenceActive: sequenceBuffer.length > 0
  };
};