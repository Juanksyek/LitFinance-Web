// 🌐 Utilidades de API para el Sistema de Reportes - LitFinance
import type {
  CreateWebReportRequest,
  WebReportStatusResponse,
  ApiResponse
} from '../types/reports';
import { API_ENDPOINTS } from '../constants/reports';

/**
 * Cliente API base para el sistema de reportes
 */
class ReportsApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_ENDPOINTS.BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Hace una petición HTTP con manejo de errores
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Operación exitosa',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error en petición API:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ========================================
  // ENDPOINTS DE REPORTES WEB PÚBLICOS
  // ========================================

  /**
   * Crea un nuevo reporte web público
   */
  async createWebReport(
    reportData: CreateWebReportRequest,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<ApiResponse<{ ticketId: string }>> {
    return this.request<{ ticketId: string }>(
      API_ENDPOINTS.REPORTS.WEB.CREATE,
      {
        method: 'POST',
        body: JSON.stringify({
          ...reportData,
          clientInfo
        })
      }
    );
  }

  /**
   * Consulta el estado de un reporte web por su ID
   */
  async getWebReportStatus(ticketId: string): Promise<ApiResponse<WebReportStatusResponse>> {
    return this.request<WebReportStatusResponse>(
      API_ENDPOINTS.REPORTS.WEB.STATUS(ticketId)
    );
  }

  // ========================================
  // UTILIDADES
  // ========================================

  /**
   * Verifica la conectividad con el servidor
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información del servidor
   */
  async getServerInfo(): Promise<ApiResponse<{
    version: string;
    uptime: number;
    environment: string;
  }>> {
    return this.request('/info');
  }
}

// Instancia singleton del cliente API
export const reportsApiClient = new ReportsApiClient();

// ========================================
// FUNCIONES HELPER PARA VALIDACIONES
// ========================================

/**
 * Valida el formato de un ticket ID
 */
export const isValidTicketId = (ticketId: string): boolean => {
  const pattern = /^WEB-\d{13}-[A-F0-9]{8}$/i;
  return pattern.test(ticketId);
};

/**
 * Valida el formato de un email
 */
export const isValidEmail = (email: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Formatea una fecha para mostrar en la interfaz
 */
export const formatDate = (dateString: string, locale: string = 'es-ES'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Calcula el tiempo transcurrido desde una fecha
 */
export const getTimeAgo = (dateString: string, locale: string = 'es-ES'): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    if (days < 30) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
    
    return formatDate(dateString, locale);
  } catch {
    return dateString;
  }
};

/**
 * Trunca texto a un número específico de caracteres
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Genera un color basado en la puntuación de riesgo
 */
export const getRiskScoreColor = (score: number): {
  color: string;
  backgroundColor: string;
  label: string;
} => {
  if (score < 30) {
    return {
      color: '#10b981',
      backgroundColor: '#d1fae5',
      label: 'Seguro'
    };
  } else if (score < 50) {
    return {
      color: '#f59e0b',
      backgroundColor: '#fef3c7',
      label: 'Moderado'
    };
  } else if (score < 70) {
    return {
      color: '#f97316',
      backgroundColor: '#fed7aa',
      label: 'Alto'
    };
  } else {
    return {
      color: '#ef4444',
      backgroundColor: '#fecaca',
      label: 'Crítico'
    };
  }
};

/**
 * Extrae información útil de errores de API
 */
export const parseApiError = (error: unknown): {
  message: string;
  code?: string;
  details?: unknown;
} => {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack
    };
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return {
      message: (errorObj.message as string) || 'Error desconocido',
      code: errorObj.code as string,
      details: errorObj.details || errorObj
    };
  }

  return {
    message: typeof error === 'string' ? error : 'Error desconocido'
  };
};

/**
 * Genera un ID único para elementos de la interfaz
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function para optimizar búsquedas
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ========================================
// CONSTANTES ÚTILES
// ========================================

export const REPORT_LIMITS = {
  EMAIL_MAX_LENGTH: 254,
  SUBJECT_MIN_LENGTH: 5,
  SUBJECT_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 5000
} as const;

export const RATE_LIMITS = {
  WEB_REPORTS_PER_HOUR: 2,
  WEB_REPORTS_PER_DAY: 5
} as const;

export const RISK_THRESHOLDS = {
  SAFE: 30,
  MODERATE: 50,
  HIGH: 70,
  CRITICAL: 100
} as const;