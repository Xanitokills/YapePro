 
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from 'hooks/useAuth';
import { subscribeToYapeTransactions, sendYapeNotification } from 'lib/notifications';

const CashierView: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'cashier' && user.store_id) {
      const subscription = subscribeToYapeTransactions(user.store_id, (transaction) => {
        sendYapeNotification(transaction);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  if (user?.role !== 'cashier') return <Text className="text-red-500">Acceso denegado</Text>;

  return (
    <View className="flex-1 p-4 bg-gray-100 justify-center">
      <Text className="text-2xl font-bold mb-4">Vista para Tenderos/Cajeros</Text>
      <Text className="mb-4">Esperando notificaciones de Yape...</Text>
      <Button
        title="Registrar Venta Manual"
        onPress={() => {
          console.log('Venta registrada manualmente');
        }}
      />
    </View>
  );
};

export default CashierView;