// 💰 Tipos para Cuentas Principales - LitFinance

export interface CuentaPrincipal {
  id: string;
  userId: string;
  nombre: string;
  cantidad: number;
  moneda: string;
  simbolo: string;
  color?: string;
  isPrincipal?: boolean;
  updatedAt?: string;
  _id?: string;
}

export interface ObtenerCuentaPrincipalResponse {
  cuenta: CuentaPrincipal;
}

export interface EditarCuentaPrincipalRequest {
  moneda: string;
}

export interface EditarCuentaPrincipalResponse {
  message: string;
  cuenta: CuentaPrincipal;
}
