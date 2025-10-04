// 🛡️ Sistema de Seguridad para Reportes - LitFinance
import { SECURITY_CONFIG } from '../constants/reports';
import type { WebReportValidations } from '../types/reports';

export class SecurityValidator {
  /**
   * Valida el contenido de un reporte y calcula la puntuación de riesgo
   */
  public static validateContent(
    email: string,
    asunto: string,
    descripcion: string,
    userAgent?: string
  ): WebReportValidations {
    const content = `${email} ${asunto} ${descripcion}`.toLowerCase();
    
    const validations: WebReportValidations = {
      contieneLinksExternos: this.detectExternalLinks(content),
      puntuacionSpam: this.calculateSpamScore(content),
      palabrasProhibidas: this.detectForbiddenWords(content),
      esSospechoso: false,
      puntuacionRiesgo: 0
    };

    // Calcular puntuación de riesgo total
    let riskScore = 0;

    // Factor 1: Puntuación de spam (0-30 puntos)
    riskScore += Math.min(validations.puntuacionSpam, 30);

    // Factor 2: Links externos (0-15 puntos)
    if (validations.contieneLinksExternos) {
      riskScore += 15;
    }

    // Factor 3: Palabras prohibidas (5 puntos por palabra)
    riskScore += validations.palabrasProhibidas.length * 5;

    // Factor 4: Patrones maliciosos (30-50 puntos)
    const maliciousScore = this.detectMaliciousPatterns(content);
    riskScore += maliciousScore;

    // Factor 5: Email sospechoso (0-20 puntos)
    riskScore += this.validateEmail(email);

    // Factor 6: User Agent sospechoso (0-10 puntos)
    if (userAgent) {
      riskScore += this.validateUserAgent(userAgent);
    }

    // Factor 7: Contenido muy corto o muy largo (0-10 puntos)
    riskScore += this.validateContentLength(asunto, descripcion);

    validations.puntuacionRiesgo = Math.min(riskScore, 100);
    validations.esSospechoso = validations.puntuacionRiesgo > SECURITY_CONFIG.RISK_SCORE_THRESHOLDS.SUSPICIOUS;

    return validations;
  }

  /**
   * Detecta enlaces externos en el contenido
   */
  private static detectExternalLinks(content: string): boolean {
    const linkPatterns = [
      /https?:\/\//i,
      /www\./i,
      /\.com|\.org|\.net|\.edu|\.gov|\.mil/i,
      /bit\.ly|tinyurl|t\.co|short\.link/i
    ];

    return linkPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Calcula la puntuación de spam basada en palabras clave
   */
  private static calculateSpamScore(content: string): number {
    let score = 0;
    const spamKeywords = SECURITY_CONFIG.SPAM_KEYWORDS;

    spamKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length * 2; // 2 puntos por cada coincidencia
      }
    });

    // Penalizar contenido con muchas mayúsculas
    const uppercaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (uppercaseRatio > 0.3) {
      score += 10;
    }

    // Penalizar muchos signos de exclamación
    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      score += exclamationCount * 2;
    }

    return Math.min(score, 50);
  }

  /**
   * Detecta palabras prohibidas en el contenido
   */
  private static detectForbiddenWords(content: string): string[] {
    const forbiddenWords: string[] = [];
    const spamKeywords = SECURITY_CONFIG.SPAM_KEYWORDS;

    spamKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        forbiddenWords.push(keyword);
      }
    });

    return forbiddenWords;
  }

  /**
   * Detecta patrones maliciosos (SQL injection, XSS, etc.)
   */
  private static detectMaliciousPatterns(content: string): number {
    let score = 0;
    const patterns = SECURITY_CONFIG.MALICIOUS_PATTERNS;

    // SQL Injection
    patterns.SQL_INJECTION.forEach(pattern => {
      if (pattern.test(content)) {
        score += 40; // Alto riesgo
      }
    });

    // XSS
    patterns.XSS.forEach(pattern => {
      if (pattern.test(content)) {
        score += 50; // Muy alto riesgo
      }
    });

    // Command Injection
    patterns.COMMAND_INJECTION.forEach(pattern => {
      if (pattern.test(content)) {
        score += 30; // Alto riesgo
      }
    });

    return Math.min(score, 60);
  }

  /**
   * Valida el formato y sospecha del email
   */
  private static validateEmail(email: string): number {
    let score = 0;

    // Email inválido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      score += 20;
    }

    // Dominios sospechosos
    const suspiciousDomains = [
      '10minutemail.com', 'guerrillamail.com', 'tempmail.org',
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && suspiciousDomains.includes(domain)) {
      score += 15;
    }

    // Muchos números en el email
    const numberCount = (email.match(/\d/g) || []).length;
    if (numberCount > 5) {
      score += 5;
    }

    return Math.min(score, 20);
  }

  /**
   * Valida el User Agent del navegador
   */
  private static validateUserAgent(userAgent: string): number {
    let score = 0;

    // User Agent muy corto o vacío
    if (!userAgent || userAgent.length < 20) {
      score += 8;
    }

    // Patrones de bots conocidos
    const botPatterns = [
      /bot|crawler|spider|scraper/i,
      /curl|wget|python|java/i,
      /automated|script|tool/i
    ];

    if (botPatterns.some(pattern => pattern.test(userAgent))) {
      score += 10;
    }

    return Math.min(score, 10);
  }

  /**
   * Valida la longitud del contenido
   */
  private static validateContentLength(asunto: string, descripcion: string): number {
    let score = 0;

    // Asunto muy corto o muy largo
    if (asunto.length < 5 || asunto.length > 200) {
      score += 3;
    }

    // Descripción muy corta o muy larga
    if (descripcion.length < 10) {
      score += 5;
    } else if (descripcion.length > 5000) {
      score += 7;
    }

    return score;
  }

  /**
   * Determina si un reporte debe ser bloqueado automáticamente
   */
  public static shouldBlockReport(validations: WebReportValidations): boolean {
    return validations.puntuacionRiesgo >= SECURITY_CONFIG.RISK_SCORE_THRESHOLDS.BLOCKED;
  }

  /**
   * Determina si un reporte debe marcarse como spam automáticamente
   */
  public static shouldMarkAsSpam(validations: WebReportValidations): boolean {
    return validations.puntuacionRiesgo >= SECURITY_CONFIG.RISK_SCORE_THRESHOLDS.VERY_SUSPICIOUS;
  }

  /**
   * Genera un reporte de seguridad legible
   */
  public static generateSecurityReport(validations: WebReportValidations): string {
    const issues: string[] = [];

    if (validations.contieneLinksExternos) {
      issues.push('Contiene enlaces externos');
    }

    if (validations.palabrasProhibidas.length > 0) {
      issues.push(`Palabras prohibidas detectadas: ${validations.palabrasProhibidas.join(', ')}`);
    }

    if (validations.puntuacionSpam > 20) {
      issues.push(`Alta puntuación de spam: ${validations.puntuacionSpam}`);
    }

    if (validations.puntuacionRiesgo > SECURITY_CONFIG.RISK_SCORE_THRESHOLDS.HIGH_SUSPICION) {
      issues.push('Patrones maliciosos detectados');
    }

    return issues.length > 0 
      ? `Problemas de seguridad detectados: ${issues.join('; ')}`
      : 'Contenido seguro';
  }
}

/**
 * Rate Limiter para controlar la frecuencia de reportes
 */
export class RateLimiter {
  private static reportCounts = new Map<string, { hour: number[], day: number[] }>();

  /**
   * Verifica si una IP puede crear un nuevo reporte
   */
  public static canCreateReport(ipAddress: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    // Obtener o crear contadores para esta IP
    if (!this.reportCounts.has(ipAddress)) {
      this.reportCounts.set(ipAddress, { hour: [], day: [] });
    }

    const counts = this.reportCounts.get(ipAddress)!;

    // Limpiar contadores antiguos
    counts.hour = counts.hour.filter(timestamp => now - timestamp < oneHour);
    counts.day = counts.day.filter(timestamp => now - timestamp < oneDay);

    // Verificar límites
    const { WEB_REPORTS_HOUR, WEB_REPORTS_DAY } = SECURITY_CONFIG.RATE_LIMITS;

    if (counts.hour.length >= WEB_REPORTS_HOUR) {
      return {
        allowed: false,
        reason: `Límite alcanzado: máximo ${WEB_REPORTS_HOUR} reportes por hora`
      };
    }

    if (counts.day.length >= WEB_REPORTS_DAY) {
      return {
        allowed: false,
        reason: `Límite alcanzado: máximo ${WEB_REPORTS_DAY} reportes por día`
      };
    }

    return { allowed: true };
  }

  /**
   * Registra un nuevo reporte para una IP
   */
  public static recordReport(ipAddress: string): void {
    const now = Date.now();
    
    if (!this.reportCounts.has(ipAddress)) {
      this.reportCounts.set(ipAddress, { hour: [], day: [] });
    }

    const counts = this.reportCounts.get(ipAddress)!;
    counts.hour.push(now);
    counts.day.push(now);
  }

  /**
   * Obtiene información sobre los límites restantes para una IP
   */
  public static getRateLimitInfo(ipAddress: string): {
    hourRemaining: number;
    dayRemaining: number;
    resetTimeHour: number;
    resetTimeDay: number;
  } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    const counts = this.reportCounts.get(ipAddress) || { hour: [], day: [] };
    
    // Limpiar contadores antiguos
    const recentHour = counts.hour.filter(timestamp => now - timestamp < oneHour);
    const recentDay = counts.day.filter(timestamp => now - timestamp < oneDay);

    const { WEB_REPORTS_HOUR, WEB_REPORTS_DAY } = SECURITY_CONFIG.RATE_LIMITS;

    return {
      hourRemaining: Math.max(0, WEB_REPORTS_HOUR - recentHour.length),
      dayRemaining: Math.max(0, WEB_REPORTS_DAY - recentDay.length),
      resetTimeHour: recentHour.length > 0 ? Math.min(...recentHour) + oneHour : now,
      resetTimeDay: recentDay.length > 0 ? Math.min(...recentDay) + oneDay : now
    };
  }
}