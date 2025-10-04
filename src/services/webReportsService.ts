// 📋 Servicio de Reportes Web - LitFinance
import type {
  CreateWebReportRequest,
  WebReport,
  WebReportStatusResponse,
  ApiResponse,
  PaginatedResponse,
  SecurityStats,
  WebReportStatus
} from '../types/reports';
import { API_ENDPOINTS } from '../constants/reports';
import { SecurityValidator, RateLimiter } from './securityService';
import { authService } from './authService';

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

  // ===========================================
  // MÉTODOS DE ADMINISTRACIÓN (requieren auth)
  // ===========================================

  /**
   * Obtiene todos los reportes web (solo para administradores) - MOCK VERSION
   */
  public async getAdminReports(
    filters: {
      estado?: WebReportStatus;
      pagina?: number;
      limite?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<WebReport>>> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'Acceso no autorizado',
          timestamp: new Date().toISOString()
        };
      }

      // Obtener reportes mock del localStorage
      const rawReports = JSON.parse(localStorage.getItem('litfinance_mock_reports') || '[]');
      const mockReports: WebReport[] = rawReports.map((report: Record<string, unknown>) => ({
        ...report,
        validacionesContenido: report.securityValidations || {
          contieneLinksExternos: false,
          puntuacionSpam: 0,
          palabrasProhibidas: [],
          esSospechoso: false,
          puntuacionRiesgo: 0
        },
        historialAcciones: [
          {
            accion: 'Reporte creado',
            fecha: report.fechaCreacion,
            realizadaPor: 'Sistema',
            detalles: 'Reporte creado por el usuario'
          }
        ]
      }));

      // Aplicar filtros
      let filteredReports = mockReports;
      if (filters.estado) {
        filteredReports = mockReports.filter(report => report.estado === filters.estado);
      }

      // Paginación
      const pagina = filters.pagina || 1;
      const limite = filters.limite || 10;
      const inicio = (pagina - 1) * limite;
      const fin = inicio + limite;
      
      const paginatedReports = filteredReports.slice(inicio, fin);
      const totalPaginas = Math.ceil(filteredReports.length / limite);

      return {
        success: true,
        data: {
          data: paginatedReports,
          total: filteredReports.length,
          pagina,
          limite,
          totalPaginas
        },
        message: 'Reportes obtenidos exitosamente',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo reportes de admin:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Marca un reporte como spam (solo para administradores)
   */
  public async markReportAsSpam(ticketId: string): Promise<ApiResponse<null>> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'Acceso no autorizado',
          timestamp: new Date().toISOString()
        };
      }

      const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.REPORTS.WEB.MARK_SPAM(ticketId)}`;
      
      const response = await authService.authenticatedRequest<ApiResponse<null>>(url, {
        method: 'PATCH'
      });

      return response;
    } catch (error) {
      console.error('Error marcando reporte como spam:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Obtiene estadísticas de seguridad (solo para administradores) - MOCK VERSION
   */
  public async getSecurityStats(): Promise<ApiResponse<SecurityStats>> {
    try {
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          message: 'Acceso no autorizado',
          timestamp: new Date().toISOString()
        };
      }

      // Generar estadísticas mock
      const rawReports = JSON.parse(localStorage.getItem('litfinance_mock_reports') || '[]');
      const reportesSospechosos = rawReports.filter((r: Record<string, unknown>) => 
        r.securityValidations && (r.securityValidations as Record<string, unknown>).esSospechoso
      ).length;

      const mockStats: SecurityStats = {
        reportesTotales: rawReports.length,
        reportesBloqueados: Math.floor(rawReports.length * 0.1), // 10% bloqueados simulado
        ipsConMasReportes: [
          { ip: '192.168.1.100', cantidad: Math.max(1, Math.floor(rawReports.length * 0.3)) },
          { ip: '10.0.0.50', cantidad: Math.max(1, Math.floor(rawReports.length * 0.2)) },
          { ip: '172.16.0.25', cantidad: Math.max(1, Math.floor(rawReports.length * 0.1)) }
        ],
        puntuacionRiesgoPromedio: rawReports.length > 0 
          ? rawReports.reduce((acc: number, r: Record<string, unknown>) => {
              const validation = r.securityValidations as Record<string, unknown>;
              return acc + (validation?.puntuacionRiesgo as number || 0);
            }, 0) / rawReports.length
          : 0,
        reportesPorDia: [
          { fecha: new Date().toISOString().split('T')[0], cantidad: rawReports.length, sospechosos: reportesSospechosos }
        ]
      };

      return {
        success: true,
        data: mockStats,
        message: 'Estadísticas obtenidas exitosamente',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de seguridad:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const webReportsService = WebReportsService.getInstance();