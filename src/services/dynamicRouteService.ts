// 🔐 Servicio de Rutas Dinámicas - Sistema de Acceso Secreto
import { nanoid } from 'nanoid';

interface SecretRoute {
  path: string;
  createdAt: number;
  expiresAt: number;
}

class DynamicRouteService {
  private static instance: DynamicRouteService;
  private readonly ROUTE_EXPIRY = 5 * 60 * 1000; // 5 minutos
  private readonly STORAGE_KEY = 'litfinance_secret_route';

  constructor() {
    if (DynamicRouteService.instance) {
      return DynamicRouteService.instance;
    }
    DynamicRouteService.instance = this;
  }

  /**
   * Genera una nueva ruta secreta y elimina la anterior
   */
  generateSecretRoute(): string {
    const routeId = nanoid(16); // Genera ID único de 16 caracteres
    const now = Date.now();
    
    const secretRoute: SecretRoute = {
      path: `/secret-${routeId}-admin`,
      createdAt: now,
      expiresAt: now + this.ROUTE_EXPIRY
    };

    // Guardar la nueva ruta
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(secretRoute));
    
    console.log('🔐 Nueva ruta secreta generada:', secretRoute.path);
    return secretRoute.path;
  }

  /**
   * Obtiene la ruta secreta actual si es válida
   */
  getCurrentSecretRoute(): string | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const secretRoute: SecretRoute = JSON.parse(stored);
      const now = Date.now();

      // Verificar si la ruta ha expirado
      if (now > secretRoute.expiresAt) {
        this.clearSecretRoute();
        return null;
      }

      return secretRoute.path;
    } catch (error) {
      console.error('Error obteniendo ruta secreta:', error);
      return null;
    }
  }

  /**
   * Verifica si una ruta es la ruta secreta actual
   */
  isValidSecretRoute(path: string): boolean {
    const currentRoute = this.getCurrentSecretRoute();
    return currentRoute === path;
  }

  /**
   * Limpia la ruta secreta actual
   */
  clearSecretRoute(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Obtiene el tiempo restante de la ruta actual en milisegundos
   */
  getTimeRemaining(): number {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return 0;

      const secretRoute: SecretRoute = JSON.parse(stored);
      const now = Date.now();

      return Math.max(0, secretRoute.expiresAt - now);
    } catch {
      return 0;
    }
  }

  /**
   * Extiende el tiempo de vida de la ruta actual
   */
  extendCurrentRoute(): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return false;

      const secretRoute: SecretRoute = JSON.parse(stored);
      const now = Date.now();

      // Solo extender si la ruta aún es válida
      if (now <= secretRoute.expiresAt) {
        secretRoute.expiresAt = now + this.ROUTE_EXPIRY;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(secretRoute));
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const dynamicRouteService = new DynamicRouteService();