// 🔄 Tipos para Recurrentes - LitFinance

export interface Plataforma {
  plataformaId?: string;
  _id?: string;
  nombre: string;
  color: string;
  categoria?: string;
}

export interface Recurrente {
  id?: string;
  _id?: string;
  recurrenteId?: string;
  nombre: string;
  plataforma: Plataforma;
  frecuenciaTipo: 'dia_mes' | 'dia_semana' | 'fecha_fija';
  frecuenciaValor: string;
  moneda: string;
  monto: number;
  afectaCuentaPrincipal?: boolean;
  afectaSubcuenta?: boolean;
  cuentaId?: string;
  subcuentaId?: string | null;
  recordatorios?: number[];
  pausado?: boolean;
  estado?: 'activo' | 'pausado';
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearRecurrenteRequest {
  nombre: string;
  plataforma: {
    plataformaId?: string;
    nombre: string;
    color: string;
  };
  frecuenciaTipo: 'dia_mes' | 'dia_semana' | 'fecha_fija';
  frecuenciaValor: string;
  moneda: string;
  monto: number;
  cuentaId: string;
  subcuentaId?: string | null;
  afectaCuentaPrincipal: boolean;
  afectaSubcuenta: boolean;
  recordatorios?: number[];
}

export interface CrearRecurrenteResponse {
  message: string;
  recurrente: Recurrente;
}

export interface ListarRecurrentesResponse {
  items?: Recurrente[];
  recurrentes?: Recurrente[];
  total?: number;
  page?: number;
  hasNextPage?: boolean;
}

export interface ListarRecurrentesParams {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface EditarRecurrenteRequest {
  monto?: number;
  nombre?: string;
  plataforma?: string;
  frecuenciaDias?: number;
}

export interface EditarRecurrenteResponse {
  message: string;
  recurrente: Recurrente;
}

export interface PlataformaRecurrente {
  id: string;
  nombre: string;
  categoria: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListarPlataformasResponse {
  plataformas: PlataformaRecurrente[];
}

export interface EditarPlataformaRequest {
  nombre?: string;
  categoria?: string;
  color?: string;
}

export interface EditarPlataformaResponse {
  message: string;
  plataforma: PlataformaRecurrente;
}
