// 📊 Tipos para Subcuentas - LitFinance

export interface Subcuenta {
  id?: string;
  _id?: string;
  subCuentaId?: string;
  nombre: string;
  cantidad: number;
  moneda: string;
  simbolo: string;
  color?: string;
  activa: boolean;
  cuentaPrincipalId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearSubcuentaRequest {
  nombre: string;
  cantidad: number;
  moneda: string;
  simbolo: string;
  color?: string;
  afectaCuenta: boolean;
  cuentaPrincipalId: string;
}

export interface CrearSubcuentaResponse {
  message: string;
  subcuenta: Subcuenta;
}

export interface ListarSubcuentasResponse {
  subcuentas: Subcuenta[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ListarSubcuentasParams {
  soloActivas?: boolean;
  page?: number;
  limit?: number;
}

export interface ActualizarSubcuentaRequest {
  nombre?: string;
  cantidad?: number;
}

export interface ActualizarSubcuentaResponse {
  message: string;
  subcuenta: Subcuenta;
}

export interface HistorialSubcuenta {
  id: string;
  tipo: 'creacion' | 'modificacion' | 'eliminacion';
  cambios: Record<string, unknown>;
  fecha: string;
  subcuentaId: string;
}

export interface HistorialSubcuentaResponse {
  historial: HistorialSubcuenta[];
}

export interface ParticipacionSubcuenta {
  subcuentaId: string;
  nombre: string;
  monto: number;
  porcentaje: number;
}

export interface ParticipacionResponse {
  participaciones: ParticipacionSubcuenta[];
}
