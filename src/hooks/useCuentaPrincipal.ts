import { useQuery } from '@tanstack/react-query';
import { obtenerCuentaPrincipal } from '../services/cuentaService';
import { useCuentaStore } from '../stores/cuentaStore';

export function useCuentaPrincipal() {
  const { setCuenta, setError } = useCuentaStore();

  const query = useQuery({
    queryKey: ['cuenta_principal'],
    queryFn: async () => {
      const cuenta = await obtenerCuentaPrincipal();
      setCuenta(cuenta);
      return cuenta;
    },
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    cuenta: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isStale: query.isStale,
  };
}
