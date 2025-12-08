// 📈 Servicio de Analytics - LitFinance API
import type {
  AnalyticsFilters,
  ResumenFinanciero,
  EstadisticasPorConcepto,
  EstadisticasPorSubcuenta,
  EstadisticasPorRecurrente,
  AnalisisTemporal,
} from '../types/analytics';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}

/**
 * Construye query params desde filtros de analytics
 */
function buildQueryParams(filters: AnalyticsFilters = {}): string {
  const params = new URLSearchParams();
  
  if (filters.rangoTiempo) params.append('rangoTiempo', filters.rangoTiempo);
  if (filters.tipoTransaccion) params.append('tipoTransaccion', filters.tipoTransaccion);
  if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
  if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
  if (filters.subcuentaIds) {
    filters.subcuentaIds.forEach(id => params.append('subcuentaIds[]', id));
  }
  if (filters.conceptoIds) {
    filters.conceptoIds.forEach(id => params.append('conceptoIds[]', id));
  }

  return params.toString();
}

/**
 * 📊 Obtener resumen financiero general
 */
export async function obtenerResumenFinanciero(
  filters?: AnalyticsFilters
): Promise<ResumenFinanciero> {
  const query = buildQueryParams(filters);
  const endpoint = `/analytics/resumen-financiero${query ? `?${query}` : ''}`;
  return apiRequest<ResumenFinanciero>(endpoint);
}

/**
 * 🏷️ Obtener estadísticas por concepto
 */
export async function obtenerEstadisticasPorConcepto(
  filters?: AnalyticsFilters
): Promise<EstadisticasPorConcepto[]> {
  const query = buildQueryParams(filters);
  const endpoint = `/analytics/por-concepto${query ? `?${query}` : ''}`;
  return apiRequest<EstadisticasPorConcepto[]>(endpoint);
}

/**
 * 📁 Obtener estadísticas por subcuenta
 */
export async function obtenerEstadisticasPorSubcuenta(
  filters?: AnalyticsFilters
): Promise<EstadisticasPorSubcuenta[]> {
  const query = buildQueryParams(filters);
  const endpoint = `/analytics/por-subcuenta${query ? `?${query}` : ''}`;
  return apiRequest<EstadisticasPorSubcuenta[]>(endpoint);
}

/**
 * 🔄 Obtener estadísticas por recurrente
 */
export async function obtenerEstadisticasPorRecurrente(
  filters?: AnalyticsFilters
): Promise<EstadisticasPorRecurrente[]> {
  const query = buildQueryParams(filters);
  const endpoint = `/analytics/por-recurrente${query ? `?${query}` : ''}`;
  return apiRequest<EstadisticasPorRecurrente[]>(endpoint);
}

/**
 * 📅 Obtener análisis temporal (evolución en el tiempo)
 */
export async function obtenerAnalisisTemporal(
  filters?: AnalyticsFilters
): Promise<AnalisisTemporal[]> {
  const query = buildQueryParams(filters);
  const endpoint = `/analytics/temporal${query ? `?${query}` : ''}`;
  return apiRequest<AnalisisTemporal[]>(endpoint);
}
