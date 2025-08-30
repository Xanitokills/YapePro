 
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
        .select('id, name, phone, email, segment, store_id, tenant_id, phone_variations, name_variations, yape_historical_names, created_at, updated_at')
        .eq('store_id', user.store_id)
        .then(({ data }) => setCustomers(data || []));
    }
  }, [user]);

  if (user?.role !== 'store_admin') return <Text style={{ color: 'red' }}>Acceso denegado</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini CRM para Admin de Tienda</Text>
      <Text style={styles.subtitle}>Gestión de clientes, inventario y reportes</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} ({item.segment}) - {item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 8,
  },
  listItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', // border-gray-300
  },
});

export default StoreAdminMiniCrm;