// 🔐 Tipos de Autenticación - LitFinance
export interface User {
  id: string;
  email: string;
  nombre?: string; // Para login
  nombreCompleto?: string; // Para registro o compatibilidad
  edad?: number;
  telefono?: string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  ocupacion?: string;
  bio?: string;
  rol?: string;
  cuentaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  user: User;
  rol?: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  nombreCompleto: string;
  edad: number;
  ocupacion: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateProfileRequest {
  nombreCompleto?: string;
  edad?: number;
  telefono?: string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  ocupacion?: string;
  bio?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  cuentaPrincipal: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
