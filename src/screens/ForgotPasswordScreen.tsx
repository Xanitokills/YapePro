import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { forgotPassword, state } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    try {
      await forgotPassword({ email });
      setEmailSent(true);
      
      // Show success message
      Alert.alert(
        'Email Enviado',
        'Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y spam.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al enviar el email de recuperación');
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const handleResendEmail = async () => {
    try {
      await forgotPassword({ email });
      Alert.alert('Email Reenviado', 'Se ha reenviado el enlace de recuperación');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al reenviar el email');
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
        
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE', '#74B9FF']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Success State */}
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.successIcon}
                >
                  <Ionicons name="mail-outline" size={48} color="#6C5CE7" />
                </LinearGradient>
              </View>
              
              <Text style={styles.successTitle}>¡Email Enviado!</Text>
              <Text style={styles.successMessage}>
                Se ha enviado un enlace de recuperación a{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
              <Text style={styles.instructionsText}>
                Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
              </Text>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendEmail}
                disabled={state.isLoading}
              >
                <Text style={styles.resendButtonText}>
                  {state.isLoading ? 'Reenviando...' : 'Reenviar Email'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={handleBackToLogin}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.backToLoginGradient}
                >
                  <Text style={styles.backToLoginText}>Volver al Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE', '#74B9FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackToLogin}
              >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.headerIcon}
                >
                  <Ionicons name="lock-closed-outline" size={36} color="#6C5CE7" />
                </LinearGradient>
              </View>
              
              <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.subtitle}>
                No te preocupes, te ayudaremos a recuperarla
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.instructionText}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#8E8E93"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={true}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.sendButton, state.isLoading && styles.sendButtonDisabled]}
                onPress={handleSendResetEmail}
                disabled={state.isLoading}
              >
                <LinearGradient
                  colors={state.isLoading ? ['#BDC3C7', '#95A5A6'] : ['#FFFFFF', '#F8F9FA']}
                  style={styles.sendButtonGradient}
                >
                  {state.isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.sendButtonText}>Enviando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.sendButtonText}>Enviar Enlace</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Additional Help */}
              <View style={styles.helpSection}>
                <Text style={styles.helpTitle}>¿Necesitas más ayuda?</Text>
                <TouchableOpacity style={styles.helpOption}>
                  <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.helpText}>Contactar Soporte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.helpOption}>
                  <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.helpText}>Centro de Ayuda</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Recordaste tu contraseña? </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.loginText}>Inicia Sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    padding: 8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2D3436',
  },
  sendButton: {
    marginBottom: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpSection: {
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 8,
    minWidth: 200,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    color: '#E8E8E8',
    fontSize: 16,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Success state styles
  successContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionsText: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backToLoginGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
});

export default ForgotPasswordScreen;