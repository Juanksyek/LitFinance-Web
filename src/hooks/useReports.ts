// 🪝 Hook personalizado para el Sistema de Reportes - LitFinance
import { useState, useEffect, useCallback } from 'react';
import type { 
  WebReport,
  SecurityStats,
  CreateWebReportRequest,
  WebReportStatus
} from '../types/reports';
import { webReportsService } from '../services/webReportsService';
import { authService } from '../services/authService';

// Hook para manejar reportes web públicos
export const useWebReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReport = useCallback(async (reportData: CreateWebReportRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await webReportsService.createReport(reportData, {
        userAgent: navigator.userAgent
      });
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const getReportStatus = useCallback(async (ticketId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await webReportsService.getReportStatus(ticketId);
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const getRateLimitInfo = useCallback(() => {
    return webReportsService.getRateLimitInfo();
  }, []);

  return {
    loading,
    error,
    createReport,
    getReportStatus,
    getRateLimitInfo,
    clearError: () => setError(null)
  };
};

// Hook para manejar la autenticación administrativa
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        setError(response.message);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const checkConnection = useCallback(async () => {
    return await authService.checkConnection();
  }, []);

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkConnection,
    clearError: () => setError(null)
  };
};

// Hook para manejar la administración de reportes
export const useAdminReports = () => {
  const [reports, setReports] = useState<WebReport[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadReports = useCallback(async (
    filters: {
      estado?: WebReportStatus;
      pagina?: number;
      limite?: number;
    } = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await webReportsService.getAdminReports(filters);
      
      if (response.success && response.data) {
        setReports(response.data.data);
        setTotalPages(response.data.totalPaginas);
        if (filters.pagina) {
          setCurrentPage(filters.pagina);
        }
      } else {
        setError(response.message);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando reportes';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const loadSecurityStats = useCallback(async () => {
    try {
      const response = await webReportsService.getSecurityStats();
      
      if (response.success && response.data) {
        setSecurityStats(response.data);
      }
      
      return response;
    } catch (err) {
      console.warn('Error cargando estadísticas de seguridad:', err);
    }
  }, []);

  const markReportAsSpam = useCallback(async (ticketId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await webReportsService.markReportAsSpam(ticketId);
      
      if (response.success) {
        // Actualizar la lista de reportes después de marcar como spam
        await loadReports({ pagina: currentPage });
      } else {
        setError(response.message);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error marcando como spam';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [loadReports, currentPage]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      loadReports({ pagina: currentPage }),
      loadSecurityStats()
    ]);
  }, [loadReports, loadSecurityStats, currentPage]);

  return {
    reports,
    securityStats,
    loading,
    error,
    totalPages,
    currentPage,
    loadReports,
    loadSecurityStats,
    markReportAsSpam,
    refreshData,
    setCurrentPage,
    clearError: () => setError(null)
  };
};

// Hook para manejar notificaciones y mensajes
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
    autoClose?: boolean;
  }>>([]);

  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    autoClose: boolean = true
  ) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setNotifications(prev => [...prev, {
      id,
      type,
      message,
      timestamp: Date.now(),
      autoClose
    }]);

    // Auto-remove después de 5 segundos si autoClose es true
    if (autoClose) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((message: string, autoClose?: boolean) => {
    return addNotification('success', message, autoClose);
  }, [addNotification]);

  const showError = useCallback((message: string, autoClose?: boolean) => {
    return addNotification('error', message, autoClose);
  }, [addNotification]);

  const showWarning = useCallback((message: string, autoClose?: boolean) => {
    return addNotification('warning', message, autoClose);
  }, [addNotification]);

  const showInfo = useCallback((message: string, autoClose?: boolean) => {
    return addNotification('info', message, autoClose);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Hook para validaciones de formulario
export const useFormValidation = () => {
  const validateEmail = useCallback((email: string): { isValid: boolean; message: string } => {
    if (!email.trim()) {
      return { isValid: false, message: 'El email es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'El formato del email no es válido' };
    }

    return { isValid: true, message: '' };
  }, []);

  const validateReportForm = useCallback((data: CreateWebReportRequest): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};

    // Validar email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    // Validar asunto
    if (!data.asunto?.trim()) {
      errors.asunto = 'El asunto es requerido';
    } else if (data.asunto.length < 5) {
      errors.asunto = 'El asunto debe tener al menos 5 caracteres';
    } else if (data.asunto.length > 200) {
      errors.asunto = 'El asunto no puede tener más de 200 caracteres';
    }

    // Validar descripción
    if (!data.descripcion?.trim()) {
      errors.descripcion = 'La descripción es requerida';
    } else if (data.descripcion.length < 10) {
      errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (data.descripcion.length > 5000) {
      errors.descripcion = 'La descripción no puede tener más de 5000 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [validateEmail]);

  const validateTicketId = useCallback((ticketId: string): { isValid: boolean; message: string } => {
    if (!ticketId.trim()) {
      return { isValid: false, message: 'El ID de ticket es requerido' };
    }

    // Formato esperado: WEB-{timestamp}-{uuid}
    const pattern = /^WEB-\d{13}-[A-F0-9]{8}$/i;
    if (!pattern.test(ticketId)) {
      return { isValid: false, message: 'El formato del ID de ticket no es válido' };
    }

    return { isValid: true, message: '' };
  }, []);

  return {
    validateEmail,
    validateReportForm,
    validateTicketId
  };
};