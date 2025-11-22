// 📋 Tipos para el Sistema de Reportes - LitFinance

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message: string;
}

// Tipos para estados y categorías
export type ReportCategory = 
  | 'funcionalidad'
  | 'error'
  | 'mejora'
  | 'solicitud'
  | 'consulta';

export type ReportPriority = 
  | 'baja'
  | 'media'
  | 'alta'
  | 'critica';

export type ReportStatus = 
  | 'abierto'
  | 'en_progreso'
  | 'pausado'
  | 'resuelto'
  | 'rechazado'
  | 'cerrado';

export type WebReportStatus = 
  | 'pendiente'
  | 'revisado'
  | 'respondido'
  | 'cerrado'
  | 'spam';

// Interfaces para reportes web públicos
export interface CreateWebReportRequest {
  email: string;
  asunto: string;
  descripcion: string;
}

export interface WebReportValidations {
  contieneLinksExternos: boolean;
  puntuacionSpam: number;
  palabrasProhibidas: string[];
  esSospechoso: boolean;
  puntuacionRiesgo: number;
}

export interface WebReportAction {
  accion: string;
  fecha: string;
  realizadaPor: string;
  detalles?: string;
}

export interface WebReport {
  ticketId: string;
  email: string;
  asunto: string;
  descripcion: string;
  estado: WebReportStatus;
  fechaCreacion: string;
  
  // Metadata de seguridad
  ipAddress?: string;
  userAgent?: string;
  esSospechoso: boolean;
  puntuacionRiesgo: number;
  
  validacionesContenido: WebReportValidations;
  historialAcciones: WebReportAction[];
}

export interface WebReportStatusResponse {
  ticketId: string;
  estado: WebReportStatus;
  fechaCreacion: string;
  fechaUltimaActualizacion?: string;
  esSospechoso: boolean;
}

// Interfaces básicas de respuesta
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  timestamp: string;
}

// Configuración del sistema
export interface ReportsConfig {
  rateLimit: {
    hour: number;
    day: number;
  };
  security: {
    maxRiskScore: number;
    autoSpamScore: number;
  };
}

// Rate limiting
export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
}

export interface RateLimitResponse extends ApiResponse<null> {
  rateLimitInfo: RateLimitInfo;
}