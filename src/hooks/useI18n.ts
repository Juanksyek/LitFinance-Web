// 🪝 Hook de Internacionalización - LitFinance
import { useContext } from 'react';
import { I18nContext } from '../contexts/I18nContextDefinition';

/**
 * Hook para usar el contexto de internacionalización
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n debe ser usado dentro de un I18nProvider');
  }
  return context;
}
