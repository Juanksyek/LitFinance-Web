// 💱 Servicio de Monedas - LitFinance API
import type {
  Moneda,
  ListarMonedasResponse,
  IntercambiarDivisasParams,
  IntercambiarDivisasResponse,
  TasaCambioParams,
  TasaCambioResponse,
} from '../types/moneda';

const API_BASE_URL = 'https://litfinance-api-production.up.railway.app';

export async function apiRequest<T>(
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
 * 📋 Obtener lista de monedas disponibles
 */
export async function listarMonedas(): Promise<Moneda[]> {
  const response = await apiRequest<ListarMonedasResponse>('/monedas');
  return response.monedas;
}

/**
 * 💱 Intercambiar divisas (convertir de una moneda a otra)
 */
export async function intercambiarDivisas(
  params: IntercambiarDivisasParams
): Promise<IntercambiarDivisasResponse> {
  const queryParams = new URLSearchParams({
    monto: params.monto.toString(),
    base: params.base,
    destino: params.destino,
  });

  return apiRequest<IntercambiarDivisasResponse>(
    `/monedas/intercambiar?${queryParams.toString()}`
  );
}

/**
 * 📊 Obtener tasa de cambio entre dos monedas
 */
export async function obtenerTasaCambio(
  params: TasaCambioParams
): Promise<TasaCambioResponse> {
  const queryParams = new URLSearchParams({
    base: params.base,
    destino: params.destino,
  });

  return apiRequest<TasaCambioResponse>(
    `/monedas/tasa-cambio?${queryParams.toString()}`
  );
}
