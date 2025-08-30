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
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica de autenticación real
      console.log('Login attempt:', { email, password });
      
      // Navegar al dashboard
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

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
            {/* Logo/Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>Y</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>YapePro</Text>
              <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
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
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Contraseña"
                    placeholderTextColor="#8E8E93"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#8E8E93" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#BDC3C7', '#95A5A6'] : ['#FFFFFF', '#F8F9FA']}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continúa con</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Regístrate</Text>
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
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
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
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    fontWeight: '400',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#E8E8E8',
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  signUpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;