// 🔐 Hook Simple para Acceso al Dashboard de Reportes
import { useEffect, useState } from 'react';

const SECRET_SEQUENCE = 'admin2025litfinance';

export const useAdminAccess = () => {
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    let sequenceBuffer = '';
    const handleKeyPress = (event: KeyboardEvent) => {
      const char = event.key.toLowerCase();
      sequenceBuffer = (sequenceBuffer + char).slice(-SECRET_SEQUENCE.length);
      
      if (sequenceBuffer === SECRET_SEQUENCE) {
        setShowAdminAccess(true);
        setAccessGranted(true);
        
        // Auto-ocultar después de 30 segundos
        setTimeout(() => {
          setShowAdminAccess(false);
        }, 30000);
        
        // Reset del buffer
        sequenceBuffer = '';
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const closeAdminAccess = () => {
    setShowAdminAccess(false);
    setAccessGranted(false);
  };

  const generateDynamicRoute = () => {
    // Generar una ruta única temporal
    const routeId = Math.random().toString(36).substr(2, 12);
    const timestamp = Date.now();
    return `/admin-${routeId}-${timestamp}`;
  };

  return {
    showAdminAccess,
    accessGranted,
    closeAdminAccess,
    generateDynamicRoute
  };
};