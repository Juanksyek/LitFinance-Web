export interface HistorialUnificadoItem {
  id?: string;
  tipo: 'recurrente' | 'transaccion';
  descripcion: string;
  monto: number;
  fecha: string;
  subcuentaId?: string;
  metadata?: {
    accion?: string;
    recurrenteId?: string;
    moneda?: string;
    [key: string]: any;
  };
}

export interface HistorialUnificadoResponse {
  items: HistorialUnificadoItem[];
  total: number;
  page: number;
  hasNextPage: boolean;
}
