// 🏷️ Servicio de Conceptos Personalizados - LitFinance API
import type {
  Concepto,
  CrearConceptoRequest,
  CrearConceptoResponse,
  ListarConceptosParams,
  ListarConceptosResponse,
  EditarConceptoRequest,
  EditarConceptoResponse,
} from '../types/concepto';

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
 * ➕ Crear nuevo concepto personalizado
 */
export async function crearConcepto(data: CrearConceptoRequest): Promise<Concepto> {
  const response = await apiRequest<CrearConceptoResponse>('/conceptos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.concepto;
}

/**
 * 📋 Listar conceptos personalizados del usuario
 */
export async function listarConceptos(
  params?: ListarConceptosParams
): Promise<ListarConceptosResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const query = queryParams.toString();
  const endpoint = `/conceptos${query ? `?${query}` : ''}`;

  return apiRequest<ListarConceptosResponse>(endpoint);
}

/**
 * ✏️ Editar concepto personalizado
 */
export async function editarConcepto(
  conceptoId: string,
  data: EditarConceptoRequest
): Promise<Concepto> {
  const response = await apiRequest<EditarConceptoResponse>(
    `/conceptos/${conceptoId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.concepto;
}

/**
 * 🗑️ Eliminar concepto personalizado
 */
export async function eliminarConcepto(conceptoId: string): Promise<void> {
  await apiRequest(`/conceptos/${conceptoId}`, {
    method: 'DELETE',
  });
}
