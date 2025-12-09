// 🌐 Context de Autenticación - LitFinance
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterRequest } from '../types/auth';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cuentaPrincipal, setCuentaPrincipal] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario y token al iniciar
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          // Obtener perfil del usuario
          const profile = await authService.getProfile();
          setUser(profile);
          // Obtener cuenta principal
          try {
            const cuentaResp = await import('../services/cuentaService').then(m => m.obtenerCuentaPrincipal());
            const cuenta = typeof cuentaResp === 'object' && 'cuenta' in cuentaResp ? cuentaResp.cuenta : cuentaResp;
            setCuentaPrincipal(cuenta);
            localStorage.setItem('cuentaPrincipal', JSON.stringify(cuenta));
          } catch (e) {
            setCuentaPrincipal(null);
            localStorage.removeItem('cuentaPrincipal');
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          authService.logout();
          setToken(null);
          setUser(null);
          setCuentaPrincipal(null);
          localStorage.removeItem('cuentaPrincipal');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  /**
   * 🔑 Iniciar sesión
   */
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const token = response.accessToken || response.token;
    const user = response.user;
    const rol = response.rol || user.rol;
    setToken(token || '');
    setUser(user);
    localStorage.setItem('authToken', token || '');
    localStorage.setItem('user', JSON.stringify(user));
    if (rol) localStorage.setItem('rol', rol);
    // Obtener cuenta principal al hacer login
    try {
      const cuentaResp = await import('../services/cuentaService').then(m => m.obtenerCuentaPrincipal());
      const cuenta = typeof cuentaResp === 'object' && 'cuenta' in cuentaResp ? cuentaResp.cuenta : cuentaResp;
      setCuentaPrincipal(cuenta);
      localStorage.setItem('cuentaPrincipal', JSON.stringify(cuenta));
    } catch (e) {
      setCuentaPrincipal(null);
      localStorage.removeItem('cuentaPrincipal');
    }
  };

  /**
   * 📝 Registrar nuevo usuario
   */
  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    
    // Si el registro retorna token, iniciar sesión automáticamente
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  };

  /**
   * 🚪 Cerrar sesión
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setCuentaPrincipal(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cuentaPrincipal');
  };

  /**
   * 👤 Actualizar usuario
   */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    cuentaPrincipal,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
