import { useQuery } from '@tanstack/react-query';
import { 
  obtenerResumenFinanciero, 
  obtenerEstadisticasPorConcepto, 
  obtenerEstadisticasPorSubcuenta 
} from '../services/analyticsService';
import type { AnalyticsFilters } from '../types/analytics';

export function useResumenFinanciero(filtros?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['resumen_financiero', filtros],
    queryFn: () => obtenerResumenFinanciero(filtros),
    staleTime: 1000 * 20, // 20 segundos
    refetchOnWindowFocus: false,
  });
}

export function useEstadisticasPorConcepto(filtros?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['estadisticas_concepto', filtros],
    queryFn: () => obtenerEstadisticasPorConcepto(filtros),
    staleTime: 1000 * 20,
    refetchOnWindowFocus: false,
  });
}

export function useEstadisticasPorSubcuenta(filtros?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['estadisticas_subcuenta', filtros],
    queryFn: () => obtenerEstadisticasPorSubcuenta(filtros),
    staleTime: 1000 * 20,
    refetchOnWindowFocus: false,
  });
}

export function useAnalyticsDashboard(filtros?: AnalyticsFilters) {
  const resumen = useResumenFinanciero(filtros);
  const porConcepto = useEstadisticasPorConcepto(filtros);
  const porSubcuenta = useEstadisticasPorSubcuenta(filtros);

  return {
    resumen: resumen.data,
    porConcepto: porConcepto.data || [],
    porSubcuenta: porSubcuenta.data || [],
    loading: resumen.isLoading || porConcepto.isLoading || porSubcuenta.isLoading,
    error: resumen.error || porConcepto.error || porSubcuenta.error,
    refetch: () => {
      resumen.refetch();
      porConcepto.refetch();
      porSubcuenta.refetch();
    },
  };
}
