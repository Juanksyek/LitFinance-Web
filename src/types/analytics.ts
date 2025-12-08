// 📈 Tipos para Analytics - LitFinance

export interface AnalyticsFilters {
  rangoTiempo?: 'dia' | 'semana' | 'mes' | 'anio';
  tipoTransaccion?: 'ingreso' | 'egreso' | 'ambos';
  fechaInicio?: string;
  fechaFin?: string;
  subcuentaIds?: string[];
  conceptoIds?: string[];
}

export interface DesglosePorMoneda {
  moneda: string;
  monto: number;
  simbolo: string;
}

export interface MontoConDesglose {
  monto: number;
  moneda: string;
  desglosePorMoneda: DesglosePorMoneda[];
}

export interface DesglosePorSubcuenta {
  subcuentaId: string;
  nombre: string;
  monto: number;
  moneda: string;
}

export interface Balance {
  monto: number;
  moneda: string;
  esPositivo: boolean;
}

export interface PeriodoAnalytics {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

export interface ResumenFinanciero {
  ingresos: number;
  gastos: number;
  totalIngresado: MontoConDesglose;
  totalGastado: MontoConDesglose;
  balance: Balance;
  totalEnSubcuentas?: MontoConDesglose & {
    desglosePorSubcuenta: DesglosePorSubcuenta[];
  };
  totalMovimientos: number;
  periodo: PeriodoAnalytics;
}

export interface ConceptoInfo {
  id: string;
  nombre: string;
  color: string;
  icono?: string;
}

export interface EstadisticasPorConcepto {
  concepto: ConceptoInfo;
  totalIngreso: number;
  totalGasto: number;
  cantidadMovimientos: number;
  montoPromedio: number;
  participacionPorcentual: number;
}

export interface EstadisticasPorSubcuenta {
  subcuenta: {
    id: string;
    nombre: string;
    color: string;
  };
  totalIngreso: number;
  totalGasto: number;
  saldoActual: number;
  cantidadMovimientos: number;
  participacionPorcentual: number;
}

export interface EstadisticasPorRecurrente {
  recurrente: {
    id: string;
    nombre: string;
    plataforma: {
      nombre: string;
      color: string;
    };
  };
  montoMensual: number;
  totalPagado: number;
  cantidadPagos: number;
  proximoPago?: string;
}

export interface AnalisisTemporal {
  periodo: string;
  ingresos: number;
  gastos: number;
  balance: number;
  cantidadMovimientos: number;
}
