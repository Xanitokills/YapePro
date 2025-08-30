// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SocialLoginProvider
} from '../types/auth';
import AuthService from '../services/authService';

// Action types
type AuthAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_TOKEN'; payload: { user: User; token: string } };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'LOADING_END':
      return {
        ...state,
        isLoading: false,
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    default:
      return state;
  }
};

// Context type
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<void>;
  socialLogin: (provider: SocialLoginProvider) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication state on app start
  useEffect(() => {
    restoreAuthState();
  }, []);

  const restoreAuthState = async () => {
    try {
      dispatch({ type: 'LOADING_START' });
      
      const token = await AuthService.getStoredToken();
      
      if (token) {
        // Validate token and get user info
        const user = await AuthService.getCurrentUser();
        dispatch({ 
          type: 'RESTORE_TOKEN', 
          payload: { user, token } 
        });
      }
    } catch (error) {
      // Token is invalid, clear it
      await AuthService.logout();
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOADING_START' });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await AuthService.login(credentials);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }
      });
    } catch (error: any) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Error al iniciar sesión'
      });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'LOADING_START' });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await AuthService.register(credentials);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }
      });
    } catch (error: any) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Error al registrarse'
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'LOADING_START' });
      
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      dispatch({ type: 'LOADING_START' });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await AuthService.forgotPassword(request);
    } catch (error: any) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Error al enviar email de recuperación'
      });
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      dispatch({ type: 'LOADING_START' });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await AuthService.resetPassword(request);
    } catch (error: any) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Error al restablecer contraseña'
      });
      throw error;
    } finally {
      dispatch({ type: 'LOADING_END' });
    }
  };

  const socialLogin = async (provider: SocialLoginProvider) => {
    try {
      dispatch({ type: 'LOADING_START' });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await AuthService.socialLogin(provider);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }
      });
    } catch (error: any) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Error en login social'
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    socialLogin,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { state } = useAuth();
    
    if (!state.isAuthenticated) {
      // Redirect to login or show login screen
      return null; // or return <LoginScreen />
    }
    
    return <Component {...props} />;
  };
};