import { useQuery } from '@tanstack/react-query';
import { obtenerHistorialCuenta } from '../services/cuentaHistorialService';
import type { HistorialMovimiento } from '../services/cuentaHistorialService';

export function useCuentaHistorial(cuentaId?: string, page: number = 1, limit: number = 10, search: string = '') {
  return useQuery<HistorialMovimiento[], Error>({
    queryKey: ['cuenta_historial', cuentaId, page, limit, search],
    queryFn: async () => {
      if (!cuentaId) throw new Error('No hay cuentaId');
      console.log('[useCuentaHistorial] Fetching con:', { cuentaId, page, limit, search });
      const res = await obtenerHistorialCuenta(cuentaId, page, limit, search);
      console.log('[useCuentaHistorial] Datos recibidos:', res.data);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!cuentaId,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}
