import { useQuery } from '@tanstack/react-query';
import { listarTransacciones } from '../services/transaccionService';

interface FiltrosTransacciones {
  rango?: 'mes' | 'anio' | 'hoy' | 'semana';
  tipo?: 'ingreso' | 'egreso';
  descripcion?: string;
}

export function useTransacciones(filtros: FiltrosTransacciones = {}) {
  return useQuery({
    queryKey: ['transacciones', filtros],
    queryFn: () => listarTransacciones(filtros),
    staleTime: 1000 * 15, // 15 segundos
    refetchOnWindowFocus: false,
    select: (data) => data.transacciones || [],
  });
}
