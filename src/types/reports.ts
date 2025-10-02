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
  respuestaAdmin?: string;
  esSospechoso: boolean;
}

// Interfaces para reportes de usuarios autenticados
export interface UserMetadata {
  email: string;
  nombre: string;
  monedaPreferencia: string;
  fechaRegistro: string;
}

export interface StatusChange {
  estado: ReportStatus;
  fechaCambio: string;
  cambiadoPor: string;
  comentario?: string;
}

export interface UserReport {
  ticketId: string;
  userId: string;
  titulo: string;
  descripcion: string;
  categoria: ReportCategory;
  estado: ReportStatus;
  prioridad: ReportPriority;
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
  
  metadataUsuario: UserMetadata;
  historialEstados: StatusChange[];
  respuestaAdmin?: string;
}

export interface CreateUserReportRequest {
  titulo: string;
  descripcion: string;
  categoria: ReportCategory;
  prioridad: ReportPriority;
}

// Interfaces para administración
export interface UpdateReportStatusRequest {
  ticketId: string;
  nuevoEstado: ReportStatus | WebReportStatus;
  comentario?: string;
  respuestaAdmin?: string;
}

export interface ReportStats {
  totalReportes: number;
  reportesPendientes: number;
  reportesResueltos: number;
  reportesSospechosos: number;
  reportesSpam: number;
  tiempoPromedioRespuesta: number; // en horas
}

export interface SecurityStats {
  reportesTotales: number;
  reportesBloqueados: number;
  ipsConMasReportes: Array<{
    ip: string;
    cantidad: number;
  }>;
  puntuacionRiesgoPromedio: number;
  reportesPorDia: Array<{
    fecha: string;
    cantidad: number;
    sospechosos: number;
  }>;
}

// Interfaces para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
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
  notifications: {
    adminEmail: string;
    slackWebhook?: string;
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