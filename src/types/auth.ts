// types/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface SocialLoginProvider {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
}

// Navigation types for auth stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  EmailVerification: { email: string };
};

// API Error types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}