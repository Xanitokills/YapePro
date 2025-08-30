 
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from 'lib/supabase';
import { useAuth } from 'hooks/useAuth';
import { Store } from 'types';

const SaasAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    if (user?.role === 'saas_admin') {
      supabase
        .from('stores')
        .select('id, name, slug, tenant_id')
        .then(({ data }) => setStores(data || []));
    }
  }, [user]);

  if (user?.role !== 'saas_admin') return <Text className="text-red-500">Acceso denegado</Text>;

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Dashboard SaaS Admin</Text>
      <Text className="mb-2">Gestión global de tiendas y suscripciones</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-2 border-b border-gray-300">
            <Text>{item.name} (Slug: {item.slug})</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SaasAdminDashboard;