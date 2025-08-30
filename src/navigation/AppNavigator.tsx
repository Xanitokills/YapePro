 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from 'hooks/useAuth';
import LoginScreen from 'screens/LoginScreen';
import SaasAdminDashboard from 'screens/SaasAdminDashboard';
import StoreAdminMiniCrm from 'screens/StoreAdminMiniCrm';
import CashierView from 'screens/CashierView';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {user.role === 'saas_admin' && <Stack.Screen name="SaasAdminDashboard" component={SaasAdminDashboard} />}
            {user.role === 'store_admin' && <Stack.Screen name="StoreAdminMiniCrm" component={StoreAdminMiniCrm} />}
            {user.role === 'cashier' && <Stack.Screen name="CashierView" component={CashierView} />}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;