// 🪝 Hook de Autenticación - LitFinance
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextDefinition';

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
