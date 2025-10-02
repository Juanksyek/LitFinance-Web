// 🔐 Servicio de Autenticación para Sistema de Reportes - LitFinance
import type { AuthCredentials, AuthResponse } from '../types/reports';
import { API_ENDPOINTS } from '../constants/reports';

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private readonly ADMIN_CREDENTIALS = {
    email: 'elgalleto12393@gmail.com',
    password: 'Admin123'
  };

  private constructor() {
    // Cargar token del localStorage si existe
    this.loadTokenFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Autentica al usuario con las credenciales secretas (Mock Authentication)
   */
  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Validar credenciales localmente (ruta secreta)
      if (!this.validateSecretCredentials(credentials)) {
        return {
          success: false,
          message: 'Credenciales inválidas. Acceso denegado.'
        };
      }

      // Crear token mock para evitar problemas de CORS
      const mockToken = btoa(JSON.stringify({
        email: credentials.email,
        role: 'admin',
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }));

      this.token = mockToken;
      this.saveTokenToStorage(mockToken);
      
      return {
        success: true,
        token: mockToken,
        message: 'Autenticación exitosa'
      };

      // NOTA: La autenticación real con el servidor se hará cuando sea necesario
      // Para desarrollo local, usamos mock authentication para evitar CORS
      /*
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        this.token = data.token;
        this.saveTokenToStorage(data.token);
        
        return {
          success: true,
          token: data.token,
          message: 'Autenticación exitosa'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Error de autenticación'
        };
      }
      */
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intenta más tarde.'
      };
    }
  }

  /**
   * Valida las credenciales contra las credenciales secretas
   */
  private validateSecretCredentials(credentials: AuthCredentials): boolean {
    return (
      credentials.email === this.ADMIN_CREDENTIALS.email &&
      credentials.password === this.ADMIN_CREDENTIALS.password
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    this.token = null;
    this.removeTokenFromStorage();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    return !!this.token && this.isTokenValid();
  }

  /**
   * Obtiene el token de autenticación
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Obtiene los headers de autorización para las peticiones API
   */
  public getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Verifica si el token es válido (no expirado)
   */
  private isTokenValid(): boolean {
    if (!this.token) return false;

    try {
      // Decodificar el token JWT para verificar expiración
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  /**
   * Guarda el token en localStorage
   */
  private saveTokenToStorage(token: string): void {
    try {
      localStorage.setItem('litfinance_admin_token', token);
    } catch (error) {
      console.warn('No se pudo guardar el token en localStorage:', error);
    }
  }

  /**
   * Carga el token desde localStorage
   */
  private loadTokenFromStorage(): void {
    try {
      const storedToken = localStorage.getItem('litfinance_admin_token');
      if (storedToken && this.isTokenValidFormat(storedToken)) {
        this.token = storedToken;
        
        // Verificar si el token sigue siendo válido
        if (!this.isTokenValid()) {
          this.removeTokenFromStorage();
        }
      }
    } catch (error) {
      console.warn('Error cargando token desde localStorage:', error);
    }
  }

  /**
   * Elimina el token del localStorage
   */
  private removeTokenFromStorage(): void {
    try {
      localStorage.removeItem('litfinance_admin_token');
    } catch (error) {
      console.warn('Error eliminando token del localStorage:', error);
    }
  }

  /**
   * Verifica si el token tiene el formato correcto (JWT)
   */
  private isTokenValidFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Hace una petición autenticada a la API
   */
  public async authenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si el token expiró, hacer logout automático
    if (response.status === 401) {
      this.logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Verifica el estado de la conexión con el servidor
   */
  public async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error verificando conexión:', error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();