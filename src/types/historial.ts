// 📜 Tipos para Historial de Cuenta - LitFinance

export interface HistorialCuenta {
  id: string;
  accion: string;
  descripcion: string;
  saldoAnterior: number;
  saldoNuevo: number;
  cuentaId: string;
  fecha: string;
  createdAt?: string;
}

export interface BuscarHistorialResponse {
  historial: HistorialCuenta[];
  total: number;
}
