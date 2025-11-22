// 📋 Servicio de Reportes Web - LitFinance
import type {
  CreateWebReportRequest,
  WebReportStatusResponse,
  ApiResponse
} from '../types/reports';
import { API_ENDPOINTS } from '../constants/reports';

// Interfaces para validación de seguridad
interface SecurityValidation {
  contieneLinksExternos: boolean;
  puntuacionSpam: number;
  palabrasProhibidas: string[];
  esSospechoso: boolean;
  puntuacionRiesgo: number;
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

// Validación de seguridad básica
class SecurityValidator {
  static validateContent(
    _email: string,
    _asunto: string,
    descripcion: string,
    _userAgent?: string
  ): SecurityValidation {
    const validation: SecurityValidation = {
      contieneLinksExternos: false,
      puntuacionSpam: 0,
      palabrasProhibidas: [],
      esSospechoso: false,
      puntuacionRiesgo: 0
    };

    // Detectar links externos
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    validation.contieneLinksExternos = urlPattern.test(descripcion);

    // Palabras prohibidas básicas
    const bannedWords = ['spam', 'viagra', 'casino', 'bitcoin'];
    const lowerDesc = descripcion.toLowerCase();
    validation.palabrasProhibidas = bannedWords.filter(word => lowerDesc.includes(word));

    // Calcular puntuación de spam
    if (validation.contieneLinksExternos) validation.puntuacionSpam += 30;
    validation.puntuacionSpam += validation.palabrasProhibidas.length * 20;

    // Marcar como sospechoso
    validation.esSospechoso = validation.puntuacionSpam > 50;
    validation.puntuacionRiesgo = validation.puntuacionSpam;

    return validation;
  }

  static shouldBlockReport(validation: SecurityValidation): boolean {
    return validation.puntuacionRiesgo > 80;
  }
}

// Rate Limiter básico
class RateLimiter {
  private static reportCounts = new Map<string, { count: number; resetTime: number }>();

  static canCreateReport(clientId: string): RateLimitResult {
    const now = Date.now();
    const record = this.reportCounts.get(clientId);

    if (!record || now > record.resetTime) {
      return { allowed: true };
    }

    if (record.count >= 5) {
      return { allowed: false, reason: 'Has alcanzado el límite de reportes por hora' };
    }

    return { allowed: true };
  }

  static recordReport(clientId: string): void {
    const now = Date.now();
    const resetTime = now + 3600000; // 1 hora
    const record = this.reportCounts.get(clientId);

    if (!record || now > record.resetTime) {
      this.reportCounts.set(clientId, { count: 1, resetTime });
    } else {
      record.count++;
    }
  }

  static getRateLimitInfo(clientId: string): {
    hourRemaining: number;
    dayRemaining: number;
    resetTimeHour: number;
    resetTimeDay: number;
  } {
    const record = this.reportCounts.get(clientId);
    const now = Date.now();

    if (!record || now > record.resetTime) {
      return {
        hourRemaining: 5,
        dayRemaining: 20,
        resetTimeHour: now + 3600000,
        resetTimeDay: now + 86400000
      };
    }

    return {
      hourRemaining: Math.max(0, 5 - record.count),
      dayRemaining: 20,
      resetTimeHour: record.resetTime,
      resetTimeDay: now + 86400000
    };
  }
}

export class WebReportsService {
  private static instance: WebReportsService;

  private constructor() {}

  public static getInstance(): WebReportsService {
    if (!WebReportsService.instance) {
      WebReportsService.instance = new WebReportsService();
    }
    return WebReportsService.instance;
  }

  /**
   * Crea un nuevo reporte web público
   */
  public async createReport(
    reportData: CreateWebReportRequest,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<ApiResponse<{ ticketId: string }>> {
    try {
      // Validar datos básicos
      const validation = this.validateReportData(reportData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message,
          timestamp: new Date().toISOString()
        };
      }

      // Obtener IP del cliente (simulado para el frontend)
      const clientIP = clientInfo?.ipAddress || this.getClientIP();
      
      // Verificar rate limiting
      const rateLimitCheck = RateLimiter.canCreateReport(clientIP);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          message: rateLimitCheck.reason || 'Límite de reportes alcanzado',
          timestamp: new Date().toISOString()
        };
      }

      // Validar contenido por seguridad
      const securityValidations = SecurityValidator.validateContent(
        reportData.email,
        reportData.asunto,
        reportData.descripcion,
        clientInfo?.userAgent
      );

      // Bloquear si es muy sospechoso
      if (SecurityValidator.shouldBlockReport(securityValidations)) {
        // Registrar intento de reporte malicioso
        console.warn('Reporte bloqueado por seguridad:', {
          email: reportData.email,
          riskScore: securityValidations.puntuacionRiesgo,
          ip: clientIP,
          timestamp: new Date().toISOString()
        });

        return {
          success: false,
          message: 'No se pudo procesar tu solicitud. Por favor, revisa el contenido e intenta nuevamente.',
          timestamp: new Date().toISOString()
        };
      }

      // Generar ticket ID mock para desarrollo local
      const timestamp = Date.now();
      const uuid = Math.random().toString(36).substr(2, 8).toUpperCase();
      const ticketId = `WEB-${timestamp}-${uuid}`;

      // Simular guardado local del reporte
      const mockReport = {
        ticketId,
        ...reportData,
        clientInfo: {
          ipAddress: clientIP,
          userAgent: clientInfo?.userAgent || navigator.userAgent,
        },
        securityValidations,
        fechaCreacion: new Date().toISOString(),
        estado: 'pendiente'
      };

      // Guardar en localStorage para simular persistencia
      const existingReports = JSON.parse(localStorage.getItem('litfinance_mock_reports') || '[]');
      existingReports.push(mockReport);
      localStorage.setItem('litfinance_mock_reports', JSON.stringify(existingReports));

      // Registrar el reporte en el rate limiter
      RateLimiter.recordReport(clientIP);

      return {
        success: true,
        data: { ticketId },
        message: 'Reporte creado exitosamente. Recibirás una respuesta pronto.',
        timestamp: new Date().toISOString()
      };

      // NOTA: Integración real con API (deshabilitada por CORS en desarrollo)
      /*
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REPORTS.WEB.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reportData,
          clientInfo: {
            ipAddress: clientIP,
            userAgent: clientInfo?.userAgent || navigator.userAgent,
          },
          securityValidations
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        RateLimiter.recordReport(clientIP);

        return {
          success: true,
          data: responseData.data,
          message: 'Reporte creado exitosamente. Recibirás una respuesta pronto.',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: responseData.message || 'Error al crear el reporte',
          timestamp: new Date().toISOString()
        };
      }
      */
    } catch (error) {
      console.error('Error creando reporte:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intenta más tarde.',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Consulta el estado de un reporte por su ID
   */
  public async getReportStatus(ticketId: string): Promise<ApiResponse<WebReportStatusResponse>> {
    try {
      if (!ticketId || !this.isValidTicketId(ticketId)) {
        return {
          success: false,
          message: 'ID de ticket inválido',
          timestamp: new Date().toISOString()
        };
      }

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REPORTS.WEB.STATUS(ticketId)}`
      );

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData.data,
          message: 'Estado del reporte obtenido exitosamente',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: responseData.message || 'Reporte no encontrado',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error obteniendo estado del reporte:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intenta más tarde.',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Obtiene la información de rate limiting para el cliente actual
   */
  public getRateLimitInfo(): {
    hourRemaining: number;
    dayRemaining: number;
    resetTimeHour: Date;
    resetTimeDay: Date;
  } {
    const clientIP = this.getClientIP();
    const info = RateLimiter.getRateLimitInfo(clientIP);
    
    return {
      hourRemaining: info.hourRemaining,
      dayRemaining: info.dayRemaining,
      resetTimeHour: new Date(info.resetTimeHour),
      resetTimeDay: new Date(info.resetTimeDay)
    };
  }

  /**
   * Valida los datos del reporte antes de enviarlo
   */
  private validateReportData(data: CreateWebReportRequest): { isValid: boolean; message: string } {
    if (!data.email?.trim()) {
      return { isValid: false, message: 'El email es requerido' };
    }

    if (!data.asunto?.trim()) {
      return { isValid: false, message: 'El asunto es requerido' };
    }

    if (!data.descripcion?.trim()) {
      return { isValid: false, message: 'La descripción es requerida' };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, message: 'El formato del email no es válido' };
    }

    // Validar longitudes
    if (data.asunto.length < 5) {
      return { isValid: false, message: 'El asunto debe tener al menos 5 caracteres' };
    }

    if (data.asunto.length > 200) {
      return { isValid: false, message: 'El asunto no puede tener más de 200 caracteres' };
    }

    if (data.descripcion.length < 10) {
      return { isValid: false, message: 'La descripción debe tener al menos 10 caracteres' };
    }

    if (data.descripcion.length > 5000) {
      return { isValid: false, message: 'La descripción no puede tener más de 5000 caracteres' };
    }

    return { isValid: true, message: 'Válido' };
  }

  /**
   * Valida el formato de un ticket ID
   */
  private isValidTicketId(ticketId: string): boolean {
    // Formato esperado: WEB-{timestamp}-{uuid}
    const pattern = /^WEB-\d{13}-[A-F0-9]{8}$/i;
    return pattern.test(ticketId);
  }

  /**
   * Obtiene la IP del cliente (simulado para el frontend)
   */
  private getClientIP(): string {
    // En un entorno real, esto sería manejado por el backend
    // Aquí generamos un identificador único por sesión
    let sessionId = sessionStorage.getItem('litfinance_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('litfinance_session_id', sessionId);
    }
    return sessionId;
  }
}

export const webReportsService = WebReportsService.getInstance();