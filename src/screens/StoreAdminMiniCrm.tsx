 
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from 'lib/supabase';
import { useAuth } from 'hooks/useAuth';
import { Customer } from 'types';

const StoreAdminMiniCrm: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (user?.role === 'store_admin' && user.store_id) {
      supabase
        .from('customers')
        .select('id, name, phone, email, segment, store_id, tenant_id')
        .eq('store_id', user.store_id)
        .then(({ data }) => setCustomers(data || []));
    }
  }, [user]);

  if (user?.role !== 'store_admin') return <Text className="text-red-500">Acceso denegado</Text>;

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Mini CRM para Admin de Tienda</Text>
      <Text className="mb-2">Gestión de clientes, inventario y reportes</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-2 border-b border-gray-300">
            <Text>{item.name} ({item.segment}) - {item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StoreAdminMiniCrm;