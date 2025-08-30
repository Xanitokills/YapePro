// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SocialLoginProvider,
  ApiError
} from '../types/auth';

const API_BASE_URL = 'https://your-api-url.com/api'; // Cambiar por tu URL de API

class AuthService {
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.createApiError(data as AuthResponse, response.status);
      }

      // Guardar tokens en storage
      const authData = data as AuthResponse;
      await this.storeTokens(authData.token, authData.refreshToken);
      this.token = authData.token;

      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      // Guardar tokens en storage
      const authData = data as AuthResponse;
      await this.storeTokens(authData.token, authData.refreshToken);
      this.token = authData.token;

      return authData;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout si existe
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar tokens del storage
      await this.clearTokens();
      this.token = null;
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json() as { message: string };

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json() as { message: string };

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async socialLogin(provider: SocialLoginProvider): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(provider),
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      // Guardar tokens en storage
      await this.storeTokens(data.token, data.refreshToken);
      this.token = data.token;

      return data;
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      // Actualizar tokens
      await this.storeTokens(data.token, data.refreshToken);
      this.token = data.token;

      return data.token;
    } catch (error) {
      console.error('Refresh token error:', error);
      // Si falla el refresh, logout automático
      await this.logout();
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const token = await this.getStoredToken();
      
      if (!token) {
        throw new Error('No token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.createApiError(data, response.status);
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getStoredToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  private async storeTokens(token: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['refreshToken', refreshToken],
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  private createApiError(data: any, statusCode: number): ApiError {
    return {
      message: data.message || 'Error desconocido',
      statusCode,
      errors: data.errors || [],
    };
  }

  // Método para hacer requests autenticados
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let token = this.token || await this.getStoredToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Si el token ha expirado, intentar refrescar
    if (response.status === 401) {
      try {
        token = await this.refreshToken();
        // Reintentar la request con el nuevo token
        return await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
      } catch (refreshError) {
        // Si falla el refresh, redirect a login
        throw new Error('Session expired');
      }
    }

    return response;
  }
}

export default new AuthService();