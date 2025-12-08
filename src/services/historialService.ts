// 📜 Servicio de Historial de Cuenta - LitFinance API
import type {
  BuscarHistorialResponse,
} from '../types/historial';

const API_BASE_URL = 'https://litfinance-api-production.up.railway.app';

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
 * 📜 Buscar historial de cuenta principal
 */
export async function buscarHistorial(cuentaId: string): Promise<BuscarHistorialResponse> {
  return apiRequest<BuscarHistorialResponse>(`/cuenta-historial?cuentaId=${cuentaId}`);
}
