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
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { register, state } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (!acceptTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      });
      
      // Navigation will be handled by the auth context
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la cuenta');
    }
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
                  onPress={handleLogin}
                >
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F9FA']}
                    style={styles.logo}
                  >
                    <Text style={styles.logoText}>Y</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete a YapePro hoy</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Name Row */}
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        placeholderTextColor="#8E8E93"
                        value={formData.firstName}
                        onChangeText={(text) => updateFormData('firstName', text)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Apellido"
                        placeholderTextColor="#8E8E93"
                        value={formData.lastName}
                        onChangeText={(text) => updateFormData('lastName', text)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Correo electrónico"
                      placeholderTextColor="#8E8E93"
                      value={formData.email}
                      onChangeText={(text) => updateFormData('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Teléfono (opcional)"
                      placeholderTextColor="#8E8E93"
                      value={formData.phone}
                      onChangeText={(text) => updateFormData('phone', text)}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Contraseña"
                      placeholderTextColor="#8E8E93"
                      value={formData.password}
                      onChangeText={(text) => updateFormData('password', text)}
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

                {/* Confirm Password */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Confirmar contraseña"
                      placeholderTextColor="#8E8E93"
                      value={formData.confirmPassword}
                      onChangeText={(text) => updateFormData('confirmPassword', text)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#8E8E93" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Terms and Conditions */}
                <TouchableOpacity 
                  style={styles.termsContainer}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && (
                      <Ionicons name="checkmark" size={16} color="#6C5CE7" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    Acepto los{' '}
                    <Text style={styles.termsLink}>términos y condiciones</Text>
                    {' '}y la{' '}
                    <Text style={styles.termsLink}>política de privacidad</Text>
                  </Text>
                </TouchableOpacity>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={[styles.signUpButton, state.isLoading && styles.signUpButtonDisabled]}
                  onPress={handleSignUp}
                  disabled={state.isLoading}
                >
                  <LinearGradient
                    colors={state.isLoading ? ['#BDC3C7', '#95A5A6'] : ['#FFFFFF', '#F8F9FA']}
                    style={styles.signUpButtonGradient}
                  >
                    <Text style={styles.signUpButtonText}>
                      {state.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o regístrate con</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons */}
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
                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginText}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  title: {
    fontSize: 28,
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
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  termsText: {
    flex: 1,
    color: '#E8E8E8',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
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
    marginTop: 20,
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
});

export default SignUpScreen;