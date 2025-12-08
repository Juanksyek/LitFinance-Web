// 💱 Tipos para Monedas - LitFinance

export interface Moneda {
  id: string;
  codigo: string;
  nombre: string;
  simbolo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListarMonedasResponse {
  monedas: Moneda[];
}

export interface IntercambiarDivisasParams {
  monto: number;
  base: string;
  destino: string;
}

export interface IntercambiarDivisasResponse {
  montoOriginal: number;
  monedaBase: string;
  montoConvertido: number;
  monedaDestino: string;
  tasaCambio: number;
}

export interface TasaCambioParams {
  base: string;
  destino: string;
}

export interface TasaCambioResponse {
  monedaBase: string;
  monedaDestino: string;
  tasa: number;
}
