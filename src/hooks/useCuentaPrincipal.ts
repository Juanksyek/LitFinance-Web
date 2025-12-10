import { useQuery } from '@tanstack/react-query';
import { obtenerCuentaPrincipal } from '../services/cuentaService';
import { useCuentaStore } from '../stores/cuentaStore';

export function useCuentaPrincipal() {
  const { setCuenta, setError } = useCuentaStore();

  const query = useQuery({
    queryKey: ['cuenta_principal'],
    queryFn: async () => {
      try {
        console.log('[useCuentaPrincipal] Fetching cuenta principal...');
        const cuenta = await obtenerCuentaPrincipal();
        console.log('[useCuentaPrincipal] Cuenta recibida:', cuenta);
        setCuenta(cuenta);
        setError(null);
        return cuenta;
      } catch (error) {
        console.error('[useCuentaPrincipal] Error:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        throw error;
      }
    },
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    cuenta: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isStale: query.isStale,
  };
}
