import type {
  Subcuenta,
  CrearSubcuentaRequest,
  CrearSubcuentaResponse,
  ListarSubcuentasResponse,
  ListarSubcuentasParams,
  ActualizarSubcuentaRequest,
  ActualizarSubcuentaResponse,
  HistorialSubcuentaResponse,
  ParticipacionResponse,
} from '../types/subcuenta';

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
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    console.error('[apiRequest] Error parsing JSON:', e);
  }
  if (!response.ok) {
    console.error('[apiRequest] Error:', data?.message || 'Error en la petición');
    throw new Error(data?.message || 'Error en la petición');
  }
  return data;
}

/**
 * ➕ Crear una nueva subcuenta
 */
export async function crearSubcuenta(
  data: CrearSubcuentaRequest
): Promise<Subcuenta> {
  const response = await apiRequest<CrearSubcuentaResponse>('/subcuenta', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.subcuenta;
}

/**
 * 📋 Listar subcuentas del usuario autenticado
 * @param userId - ID del usuario (se obtiene del token)
 * @param params - Parámetros opcionales de filtrado y paginación
 */
export async function listarSubcuentas(
  userId: string,
  params?: ListarSubcuentasParams
): Promise<ListarSubcuentasResponse> {
  const queryParams = new URLSearchParams();
  if (params?.soloActivas !== undefined) {
    queryParams.append('soloActivas', params.soloActivas.toString());
  }
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = `/subcuenta/${userId}${query ? `?${query}` : ''}`;

  return apiRequest<ListarSubcuentasResponse>(endpoint);
}

/**
 * 🔍 Obtener subcuenta por ID
 */
export async function obtenerSubcuenta(subcuentaId: string): Promise<Subcuenta> {
  return apiRequest<Subcuenta>(`/subcuenta/buscar/${subcuentaId}`);
}

/**
 * ✏️ Editar subcuenta
 */
export async function editarSubcuenta(
  subcuentaId: string,
  data: ActualizarSubcuentaRequest
): Promise<Subcuenta> {
  const response = await apiRequest<ActualizarSubcuentaResponse>(
    `/subcuenta/${subcuentaId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return response.subcuenta;
}

/**
 * 🗑️ Eliminar subcuenta
 */
export async function eliminarSubcuenta(subcuentaId: string): Promise<void> {
  await apiRequest(`/subcuenta/${subcuentaId}`, {
    method: 'DELETE',
  });
}

/**
 * 📜 Obtener historial de una subcuenta
 */
export async function historialSubcuenta(
  subcuentaId: string,
  params?: { desde?: string; hasta?: string; tipo?: string }
): Promise<HistorialSubcuentaResponse> {
  const queryParams = new URLSearchParams();
  if (params?.desde) queryParams.append('desde', params.desde);
  if (params?.hasta) queryParams.append('hasta', params.hasta);
  if (params?.tipo) queryParams.append('tipo', params.tipo);

  const query = queryParams.toString();
  const endpoint = `/subcuenta/${subcuentaId}/historial${query ? `?${query}` : ''}`;

  return apiRequest<HistorialSubcuentaResponse>(endpoint);
}

/**
 * ⏸️ Desactivar subcuenta
 */
export async function desactivarSubcuenta(subcuentaId: string): Promise<Subcuenta> {
  const response = await apiRequest<ActualizarSubcuentaResponse>(
    `/subcuenta/${subcuentaId}/desactivar`,
    { method: 'PATCH' }
  );
  return response.subcuenta;
}

/**
 * ▶️ Activar subcuenta
 */
export async function activarSubcuenta(subcuentaId: string): Promise<Subcuenta> {
  const response = await apiRequest<ActualizarSubcuentaResponse>(
    `/subcuenta/${subcuentaId}/activar`,
    { method: 'PATCH' }
  );
  return response.subcuenta;
}

/**
 * 📊 Calcular porcentajes de participación de subcuentas
 */
export async function calcularParticipacion(
  cuentaId: string
): Promise<ParticipacionResponse> {
  return apiRequest<ParticipacionResponse>(`/subcuenta/participacion/${cuentaId}`);
}
