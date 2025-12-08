// 🏷️ Tipos para Conceptos Personalizados - LitFinance

export interface Concepto {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  usuarioId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearConceptoRequest {
  nombre: string;
  color: string;
  icono: string;
}

export interface CrearConceptoResponse {
  message: string;
  concepto: Concepto;
}

export interface ListarConceptosParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ListarConceptosResponse {
  conceptos: Concepto[];
  total: number;
  page: number;
  limit: number;
}

export interface EditarConceptoRequest {
  nombre?: string;
  color?: string;
  icono?: string;
}

export interface EditarConceptoResponse {
  message: string;
  concepto: Concepto;
}
