export interface HistorialMovimiento {
  id: string;
  descripcion: string;
  monto: number;
  tipo: string;
  fecha: string;
  cuentaId: string;
  subcuentaId?: string;
  detalles?: {
    origen?: string;
    etiqueta?: string;
    resumen?: string;
    conceptoNombre?: string;
    [key: string]: any;
  };
  motivo?: string;
  concepto?: string;
  conceptoId?: string;
}

export interface CuentaHistorialResponse {
  data: HistorialMovimiento[];
  total?: number;
  page?: number;
  limit?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://litfinance-api-production.up.railway.app';

export async function obtenerHistorialCuenta(
  cuentaId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<CuentaHistorialResponse> {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  const url = `${API_BASE_URL}/cuenta-historial?cuentaId=${cuentaId}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  console.log('[obtenerHistorialCuenta] URL:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  const data = await response.json();
  console.log('[obtenerHistorialCuenta] Response:', data);
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener historial de cuenta');
  }
  
  return data;
}
