import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from 'hooks/useAuth';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Credenciales inválidas');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Iniciar Sesión en Yape Pro</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;