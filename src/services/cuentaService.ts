// 💰 Servicio de Cuentas Principales - LitFinance API
import type {
  CuentaPrincipal,
  EditarCuentaPrincipalRequest,
  EditarCuentaPrincipalResponse,
} from '../types/cuenta';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app';

/**
 * Función helper para realizar peticiones a la API
 */
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
 * 📊 Obtener cuenta principal del usuario autenticado
 */
export async function obtenerCuentaPrincipal(): Promise<CuentaPrincipal> {
  const response = await apiRequest<CuentaPrincipal>('/cuenta/principal');
  console.log('Respuesta cruda /cuenta/principal:', response);
  return response;
}

/**
 * ✏️ Editar cuenta principal (cambiar moneda base)
 */
export async function editarCuentaPrincipal(
  data: EditarCuentaPrincipalRequest
): Promise<CuentaPrincipal> {
  const response = await apiRequest<EditarCuentaPrincipalResponse>(
    '/cuenta/editar-principal',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.cuenta;
}
