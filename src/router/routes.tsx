// 🛤️ Configuración de Rutas - LitFinance Web
import React from 'react';
import { ReportsPage } from '../pages/Reports';
import Home from '../pages/Home';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  description: string;
  requiresAuth?: boolean;
  isPublic?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
    title: 'LitFinance - Inicio',
    description: 'Plataforma financiera personal inteligente',
    isPublic: true
  },
  {
    path: '/reports',
    component: ReportsPage,
    title: 'LitFinance - Sistema de Reportes',
    description: 'Centro de reportes y soporte técnico',
    isPublic: true
  }
];

// Ruta secreta para acceso directo al sistema de reportes con parámetros específicos
export const SECRET_ROUTES = {
  ADMIN_REPORTS: '/admin/reports/secure',
  SYSTEM_HEALTH: '/system/health/check'
} as const;

/**
 * Hook para navegación programática
 */
export const useNavigation = () => {
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const isCurrentPath = (path: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === path;
    }
    return false;
  };

  const getCurrentRoute = (): RouteConfig | undefined => {
    if (typeof window !== 'undefined') {
      return routes.find(route => route.path === window.location.pathname);
    }
    return undefined;
  };

  return {
    navigateTo,
    isCurrentPath,
    getCurrentRoute,
    routes
  };
};

/**
 * Metadata para SEO y Open Graph
 */
export const getRouteMetadata = (path: string) => {
  const route = routes.find(r => r.path === path);
  
  if (!route) {
    return {
      title: 'LitFinance - Página no encontrada',
      description: 'La página que buscas no existe.',
      ogTitle: 'LitFinance - Error 404',
      ogDescription: 'Página no encontrada en LitFinance',
      ogType: 'website'
    };
  }

  return {
    title: route.title,
    description: route.description,
    ogTitle: route.title,
    ogDescription: route.description,
    ogType: 'website',
    ogUrl: `https://litfinance.com${route.path}`,
    ogImage: 'https://litfinance.com/images/LitFinance-vector.png'
  };
};

/**
 * Breadcrumbs para navegación
 */
export const getBreadcrumbs = (path: string): Array<{ label: string; path: string; isActive: boolean }> => {
  const breadcrumbs = [
    { label: 'Inicio', path: '/', isActive: false }
  ];

  if (path === '/') {
    breadcrumbs[0].isActive = true;
    return breadcrumbs;
  }

  if (path === '/reports') {
    breadcrumbs.push({ label: 'Reportes', path: '/reports', isActive: true });
  }

  return breadcrumbs;
};

/**
 * Enlaces de navegación para el header
 */
export const getNavigationLinks = (includeAdmin: boolean = false) => {
  const links = [
    { label: '🏠 Inicio', path: '/', icon: '🏠' },
    { label: '📋 Reportes', path: '/reports', icon: '📋' },
    { label: '📱 Descargar App', path: '/#download', icon: '📱' },
    { label: 'ℹ️ Acerca de', path: '/#about', icon: 'ℹ️' }
  ];

  if (includeAdmin) {
    links.push({
      label: '🛡️ Admin',
      path: SECRET_ROUTES.ADMIN_REPORTS,
      icon: '🛡️'
    });
  }

  return links;
};