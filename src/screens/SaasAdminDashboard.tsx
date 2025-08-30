 
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
        .select('id, name, slug, tenant_id, created_at')
        .then(({ data }) => setStores(data || []));
    }
  }, [user]);

  if (user?.role !== 'saas_admin') return <Text style={{ color: 'red' }}>Acceso denegado</Text>;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f3f4f6' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Dashboard SaaS Admin</Text>
      <Text style={{ marginBottom: 8 }}>Gestión global de tiendas y suscripciones</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db' }}>
            <Text>{item.name} (Slug: {item.slug})</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SaasAdminDashboard;