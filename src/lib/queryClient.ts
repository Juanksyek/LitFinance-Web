import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 segundos de cache
      gcTime: 1000 * 60 * 5, // 5 minutos en cache antes de limpiar
      refetchOnWindowFocus: false, // No refetch al cambiar de ventana
      refetchOnMount: false, // No refetch al montar si hay cache válido
      retry: 1, // Solo 1 reintento en caso de error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
