// 🌐 Sistema de Internacionalización - LitFinance
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { es, type Translations } from '../locales/es';
import { en } from '../locales/en';
import { I18nContext, type I18nContextType } from './I18nContextDefinition';

type Language = 'es' | 'en';

const translations: Record<Language, Translations> = {
  es,
  en,
};

// Helper para acceder a valores anidados con string path
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown) as string || path;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Intentar obtener idioma guardado
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
    
    // Detectar idioma del navegador
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    return 'es'; // Español por defecto
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Función helper para obtener traducciones
  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    translations: translations[language],
    t,
    setLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
