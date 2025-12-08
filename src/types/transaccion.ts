// 💸 Tipos para Transacciones - LitFinance

export interface Transaccion {
  id?: string;
  _id?: string;
  transaccionId?: string;
  concepto: string;
  motivo?: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  moneda: string;
  cuentaId?: string;
  subCuentaId?: string;
  afectaCuenta?: boolean;
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearTransaccionRequest {
  tipo: 'ingreso' | 'egreso';
  monto: number;
  concepto: string;
  motivo?: string;
  moneda: string;
  cuentaId: string;
  afectaCuenta: boolean;
  subCuentaId?: string;
}

export interface CrearTransaccionResponse {
  message: string;
  transaccion: Transaccion;
}

export interface EditarTransaccionRequest {
  concepto?: string;
  monto?: number;
  motivo?: string;
}

export interface EditarTransaccionResponse {
  message: string;
  transaccion: Transaccion;
}

export interface ListarTransaccionesResponse {
  transacciones: Transaccion[];
  total?: number;
}

export interface ListarTransaccionesParams {
  rango?: 'hoy' | 'semana' | 'mes' | 'anio';
}

export interface BuscarTransaccionesParams {
  concepto?: string;
  monto?: number;
}

export interface BuscarTransaccionesResponse {
  transacciones: Transaccion[];
}
