// 🔐 Servicio de Autenticación - LitFinance API
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  User,
  ApiError,
} from '../types/auth';

// Base URL de la API
const API_BASE_URL = 'https://litfinance-api-production.up.railway.app';

/**
 * Función helper para realizar peticiones a la API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'Error en la petición',
        statusCode: response.status,
        error: data.error,
      };
      throw error;
    }

    return data;
  } catch (error) {
    if ((error as ApiError).message) {
      throw error;
    }
    throw {
      message: 'Error de conexión. Verifica tu internet.',
      statusCode: 0,
    } as ApiError;
  }
}

/**
 * 📝 Registrar nuevo usuario
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 🔑 Iniciar sesión
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Guardar token en localStorage
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }

  return response;
}

/**
 * 🚪 Cerrar sesión
 */
export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

/**
 * 📧 Olvidé mi contraseña - Enviar código
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 🔄 Resetear contraseña con código
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 🔐 Cambiar contraseña (usuario autenticado)
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  return apiRequest<ChangePasswordResponse>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 👤 Obtener perfil de usuario
 */
export async function getProfile(): Promise<User> {
  return apiRequest<User>('/user/profile', {
    method: 'GET',
  });
}

/**
 * ✏️ Actualizar perfil de usuario
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>('/user/update', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * ✅ Verificar si hay un token válido
 */
export function hasValidToken(): boolean {
  const token = localStorage.getItem('authToken');
  return !!token;
}

/**
 * 🎫 Obtener token actual
 */
export function getToken(): string | null {
  return localStorage.getItem('authToken');
}
