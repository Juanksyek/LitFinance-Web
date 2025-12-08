// 💸 Servicio de Transacciones - LitFinance API
import type {
  Transaccion,
  CrearTransaccionRequest,
  CrearTransaccionResponse,
  EditarTransaccionRequest,
  EditarTransaccionResponse,
  ListarTransaccionesResponse,
  ListarTransaccionesParams,
} from '../types/transaccion';

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
 * ➕ Crear nueva transacción (ingreso o egreso)
 */
export async function crearTransaccion(
  data: CrearTransaccionRequest
): Promise<Transaccion> {
  const response = await apiRequest<CrearTransaccionResponse>('/transacciones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.transaccion;
}

/**
 * ✏️ Editar transacción existente
 */
export async function editarTransaccion(
  transaccionId: string,
  data: EditarTransaccionRequest
): Promise<Transaccion> {
  const response = await apiRequest<EditarTransaccionResponse>(
    `/transacciones/${transaccionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.transaccion;
}

/**
 * 📋 Consultar todas las transacciones (ingresos y egresos)
 * @param params - Parámetros opcionales para filtrar por rango
 */
export async function listarTransacciones(
  params?: ListarTransaccionesParams
): Promise<ListarTransaccionesResponse> {
  const queryParams = new URLSearchParams();
  if (params?.rango) queryParams.append('rango', params.rango);

  const query = queryParams.toString();
  const endpoint = `/transacciones${query ? `?${query}` : ''}`;

  return apiRequest<ListarTransaccionesResponse>(endpoint);
}

/**
 * 🔎 Obtener una transacción por ID
 */
export async function obtenerTransaccion(transaccionId: string): Promise<Transaccion> {
  return apiRequest<Transaccion>(`/transacciones/${transaccionId}`);
}

/**
 * 🗑️ Eliminar una transacción
 */
export async function eliminarTransaccion(transaccionId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/transacciones/${transaccionId}`, {
    method: 'DELETE',
  });
}
