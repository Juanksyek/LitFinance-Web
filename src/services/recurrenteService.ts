// 🔄 Servicio de Recurrentes - LitFinance API
import type {
  Recurrente,
  CrearRecurrenteRequest,
  CrearRecurrenteResponse,
  ListarRecurrentesResponse,
  ListarRecurrentesParams,
  EditarRecurrenteRequest,
  EditarRecurrenteResponse,
  PlataformaRecurrente,
  ListarPlataformasResponse,
  EditarPlataformaRequest,
  EditarPlataformaResponse,
} from '../types/recurrente';

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
 * ➕ Crear nuevo pago recurrente
 */
export async function crearRecurrente(
  data: CrearRecurrenteRequest
): Promise<Recurrente> {
  const response = await apiRequest<CrearRecurrenteResponse>('/recurrentes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.recurrente;
}

/**
 * 📋 Consultar recurrentes del usuario con paginación y búsqueda
 * @param userId - ID del usuario
 * @param params - Parámetros opcionales de paginación y búsqueda
 */
export async function listarRecurrentes(
  userId: string,
  params?: ListarRecurrentesParams
): Promise<ListarRecurrentesResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const query = queryParams.toString();
  const endpoint = `/recurrentes${query ? `?${query}` : ''}`;

  return apiRequest<ListarRecurrentesResponse>(endpoint);
}

/**
 * 🔍 Obtener un recurrente por ID
 */
export async function obtenerRecurrente(recurrenteId: string): Promise<Recurrente> {
  return apiRequest<Recurrente>(`/recurrentes/${recurrenteId}`);
}

/**
 * ✏️ Actualizar recurrente
 */
export async function actualizarRecurrente(
  recurrenteId: string,
  data: EditarRecurrenteRequest
): Promise<Recurrente> {
  const response = await apiRequest<EditarRecurrenteResponse>(
    `/recurrentes/${recurrenteId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return response.recurrente;
}

/**
 * 🗑️ Eliminar recurrente
 */
export async function eliminarRecurrente(recurrenteId: string): Promise<void> {
  await apiRequest(`/recurrentes/${recurrenteId}`, {
    method: 'DELETE',
  });
}

/**
 * ⏸️ Pausar recurrente
 */
export async function pausarRecurrente(recurrenteId: string): Promise<Recurrente> {
  const response = await apiRequest<EditarRecurrenteResponse>(
    `/recurrentes/${recurrenteId}/pausar`,
    { method: 'PUT' }
  );
  return response.recurrente;
}

/**
 * ▶️ Reanudar recurrente
 */
export async function reanudarRecurrente(recurrenteId: string): Promise<Recurrente> {
  const response = await apiRequest<EditarRecurrenteResponse>(
    `/recurrentes/${recurrenteId}/reanudar`,
    { method: 'PUT' }
  );
  return response.recurrente;
}

// ====== PLATAFORMAS RECURRENTES ======

/**
 * 📋 Listar todas las plataformas disponibles
 */
export async function listarPlataformas(): Promise<PlataformaRecurrente[]> {
  const response = await apiRequest<ListarPlataformasResponse>('/plataformas-recurrentes');
  return response.plataformas;
}

/**
 * ✏️ Editar plataforma recurrente
 */
export async function editarPlataforma(
  plataformaId: string,
  data: EditarPlataformaRequest
): Promise<PlataformaRecurrente> {
  const response = await apiRequest<EditarPlataformaResponse>(
    `/plataformas-recurrentes/${plataformaId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.plataforma;
}

/**
 * 🗑️ Eliminar plataforma recurrente
 */
export async function eliminarPlataforma(plataformaId: string): Promise<void> {
  await apiRequest(`/plataformas-recurrentes/${plataformaId}`, {
    method: 'DELETE',
  });
}
