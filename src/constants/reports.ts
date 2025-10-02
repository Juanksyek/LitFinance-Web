// 📋 Constantes para el Sistema de Reportes - LitFinance
import type { ReportCategory, ReportPriority, ReportStatus, WebReportStatus } from '../types/reports';

export const REPORT_CATEGORIES: Record<string, ReportCategory> = {
  FUNCIONALIDAD: 'funcionalidad',
  ERROR: 'error',
  MEJORA: 'mejora',
  SOLICITUD: 'solicitud',
  CONSULTA: 'consulta'
} as const;

export const REPORT_PRIORITIES: Record<string, ReportPriority> = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica'
} as const;

export const REPORT_STATUSES: Record<string, ReportStatus> = {
  ABIERTO: 'abierto',
  EN_PROGRESO: 'en_progreso',
  PAUSADO: 'pausado',
  RESUELTO: 'resuelto',
  RECHAZADO: 'rechazado',
  CERRADO: 'cerrado'
} as const;

export const WEB_REPORT_STATUSES: Record<string, WebReportStatus> = {
  PENDIENTE: 'pendiente',
  REVISADO: 'revisado',
  RESPONDIDO: 'respondido',
  CERRADO: 'cerrado',
  SPAM: 'spam'
} as const;

// Configuración de seguridad
export const SECURITY_CONFIG = {
  RISK_SCORE_THRESHOLDS: {
    SAFE: 30,
    SUSPICIOUS: 50,
    HIGH_SUSPICION: 70,
    VERY_SUSPICIOUS: 80,
    BLOCKED: 100
  },
  RATE_LIMITS: {
    WEB_REPORTS_HOUR: 2,
    WEB_REPORTS_DAY: 5,
    USER_REPORTS_MAX_OPEN: 5
  },
  SPAM_KEYWORDS: [
    'viagra', 'casino', 'lottery', 'winner', 'congratulations',
    'click here', 'free money', 'get rich', 'make money fast',
    'crypto investment', 'guaranteed profit', 'act now',
    'limited time', 'exclusive offer', 'no risk'
  ],
  MALICIOUS_PATTERNS: {
    SQL_INJECTION: [
      /(\bSELECT\b.*\bFROM\b)/i,
      /(\bINSERT\b.*\bINTO\b)/i,
      /(\bUPDATE\b.*\bSET\b)/i,
      /(\bDELETE\b.*\bFROM\b)/i,
      /(\bDROP\b.*\bTABLE\b)/i,
      /(\bUNION\b.*\bSELECT\b)/i,
      /('.*\bOR\b.*')/i,
      /(".*\bOR\b.*")/i
    ],
    XSS: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<img[^>]*src\s*=\s*["']javascript:/i,
      /<svg[^>]*onload\s*=/i
    ],
    COMMAND_INJECTION: [
      /(\||\||;|&|`|\$\()/,
      /(rm\s+-rf|del\s+\/|format\s+c:)/i,
      /(wget|curl|nc|telnet|ssh)\s+/i,
      /(\.\.\/)|(\.\.\\)/
    ]
  }
} as const;

// Labels amigables para la UI
export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  funcionalidad: '🔧 Funcionalidad',
  error: '🐛 Error',
  mejora: '💡 Mejora',
  solicitud: '📝 Solicitud',
  consulta: '❓ Consulta'
};

export const PRIORITY_LABELS: Record<ReportPriority, string> = {
  baja: '🟢 Baja',
  media: '🟡 Media',
  alta: '🟠 Alta',
  critica: '🔴 Crítica'
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  abierto: '📋 Abierto',
  en_progreso: '⚙️ En Progreso',
  pausado: '⏸️ Pausado',
  resuelto: '✅ Resuelto',
  rechazado: '❌ Rechazado',
  cerrado: '📁 Cerrado'
};

export const WEB_STATUS_LABELS: Record<WebReportStatus, string> = {
  pendiente: '⏳ Pendiente',
  revisado: '👀 Revisado',
  respondido: '💬 Respondido',
  cerrado: '📁 Cerrado',
  spam: '🚫 Spam'
};

// Colores para la UI
export const STATUS_COLORS: Record<ReportStatus | WebReportStatus, string> = {
  abierto: '#3b82f6',
  en_progreso: '#f59e0b',
  pausado: '#6b7280',
  resuelto: '#10b981',
  rechazado: '#ef4444',
  cerrado: '#6b7280',
  pendiente: '#3b82f6',
  revisado: '#8b5cf6',
  respondido: '#10b981',
  spam: '#ef4444'
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://litfinance-api-production.up.railway.app',
  AUTH: {
    LOGIN: '/auth/login'
  },
  REPORTS: {
    WEB: {
      CREATE: '/reports/web',
      STATUS: (ticketId: string) => `/reports/web/status/${ticketId}`,
      ADMIN_LIST: '/reports/web/admin',
      MARK_SPAM: (ticketId: string) => `/reports/web/admin/mark-spam/${ticketId}`,
      SECURITY_STATS: '/reports/web/admin/security-stats'
    },
    USER: {
      CREATE: '/reports/user',
      MY_REPORTS: '/reports/user/mis-reportes',
      GET_TICKET: (ticketId: string) => `/reports/user/ticket/${ticketId}`,
      SUMMARY: '/reports/user/resumen'
    },
    ADMIN: {
      USER_REPORTS: '/reports/admin/user-reports',
      UPDATE_STATUS: '/reports/admin/user-reports/status'
    }
  }
} as const;