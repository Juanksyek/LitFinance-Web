// 🌐 Definición del Context de I18n - LitFinance
import { createContext } from 'react';
import type { Translations } from '../locales/es';

type Language = 'es' | 'en';

export interface I18nContextType {
  language: Language;
  translations: Translations;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);
