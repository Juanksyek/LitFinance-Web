import { create } from 'zustand';
import type { CuentaPrincipal } from '../types/cuenta';

interface CuentaState {
  cuenta: CuentaPrincipal | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  setCuenta: (cuenta: CuentaPrincipal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  shouldRefetch: () => boolean;
  updateLastFetch: () => void;
  reset: () => void;
}

const CACHE_DURATION = 30000; // 30 segundos

export const useCuentaStore = create<CuentaState>((set, get) => ({
  cuenta: null,
  loading: false,
  error: null,
  lastFetch: null,

  setCuenta: (cuenta) => set({ cuenta, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  shouldRefetch: () => {
    const { lastFetch } = get();
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  },
  
  updateLastFetch: () => set({ lastFetch: Date.now() }),
  
  reset: () => set({ cuenta: null, loading: false, error: null, lastFetch: null }),
}));
