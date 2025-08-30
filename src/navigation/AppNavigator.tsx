// navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/auth';

// Import screens
// Temporary placeholders to avoid "Cannot find module" errors — replace these with the real imports
const LoginScreen: React.FC = () => null;
const SignUpScreen: React.FC = () => null;
const ForgotPasswordScreen: React.FC = () => null;
const ResetPasswordScreen: React.FC = () => null;
const EmailVerificationScreen: React.FC = () => null;

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;