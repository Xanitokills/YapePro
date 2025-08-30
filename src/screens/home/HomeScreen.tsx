import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const { width } = Dimensions.get('window');

import { ColorValue } from 'react-native';

interface DashboardCard {
  id: string;
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: ColorValue[];
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: ColorValue[];
  onPress: () => void;
}

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state: authState, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardCard[]>([
    {
      id: '1',
      title: 'Ventas Hoy',
      value: 'S/ 2,450.00',
      icon: 'trending-up',
      color: ['#00B894', '#00A085'],
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      id: '2',
      title: 'Órdenes',
      value: '47',
      icon: 'receipt',
      color: ['#6C5CE7', '#A29BFE'],
      change: '+8',
      changeType: 'positive',
    },
    {
      id: '3',
      title: 'Productos',
      value: '234',
      icon: 'cube',
      color: ['#FD79A8', '#E84393'],
      change: '-2',
      changeType: 'negative',
    },
    {
      id: '4',
      title: 'Efectivo',
      value: 'S/ 1,250.00',
      icon: 'wallet',
      color: ['#FDCB6E', '#E17055'],
      change: '+5.2%',
      changeType: 'positive',
    },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Nueva Venta',
      icon: 'add-circle',
      color: ['#6C5CE7', '#A29BFE'],
      onPress: () => navigation.navigate('POS'),
    },
    {
      id: '2',
      title: 'Ver Órdenes',
      icon: 'list',
      color: ['#00B894', '#00A085'],
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: '3',
      title: 'Inventario',
      icon: 'cube-outline',
      color: ['#FD79A8', '#E84393'],
      onPress: () => navigation.navigate('Inventory'),
    },
    {
      id: '4',
      title: 'Yape/Plin',
      icon: 'phone-portrait',
      color: ['#FDCB6E', '#E17055'],
      onPress: () => navigation.navigate('Yape'),
    },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Aquí cargarías los datos reales desde tu API
      // const response = await apiService.getDashboardData();
      // setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const renderDashboardCard = (card: DashboardCard) => (
    <TouchableOpacity key={card.id} style={styles.cardContainer}>
      <LinearGradient
        colors={[card.color[0], card.color[1]] as [ColorValue, ColorValue]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Ionicons name={card.icon} size={24} color="#FFFFFF" />
          {card.change && (
            <View style={[
              styles.changeContainer,
              { backgroundColor: card.changeType === 'positive' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)' }
            ]}>
              <Ionicons 
                name={card.changeType === 'positive' ? 'arrow-up' : 'arrow-down'} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.changeText}>{card.change}</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardValue}>{card.value}</Text>
        <Text style={styles.cardTitle}>{card.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity 
      key={action.id} 
      style={styles.actionContainer}
      onPress={action.onPress}
    >
      <LinearGradient
        colors={action.color as [ColorValue, ColorValue]}
        style={styles.actionButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={action.icon} size={32} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.userName}>
              {authState.user?.firstName || 'Usuario'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => {/* Handle notifications */}}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8F9FA']}
                style={styles.profileIcon}
              >
                <Ionicons name="person" size={20} color="#6C5CE7" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Hoy</Text>
          <View style={styles.cardsGrid}>
            {dashboardData.map(renderDashboardCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            <TouchableOpacity style={styles.activityItem}>
              <LinearGradient
                colors={['#00B894', '#00A085']}
                style={styles.activityIcon}
              >
                <Ionicons name="card" size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Venta #001234</Text>
                <Text style={styles.activitySubtitle}>Hace 5 minutos</Text>
              </View>
              <Text style={styles.activityAmount}>+S/ 45.50</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.activityItem}>
              <LinearGradient
                colors={['#FDCB6E', '#E17055']}
                style={styles.activityIcon}
              >
                <Ionicons name="phone-portrait" size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Pago Yape recibido</Text>
                <Text style={styles.activitySubtitle}>Hace 12 minutos</Text>
              </View>
              <Text style={styles.activityAmount}>+S/ 120.00</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.activityItem}>
              <LinearGradient
                colors={['#FD79A8', '#E84393']}
                style={styles.activityIcon}
              >
                <Ionicons name="cube" size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Stock actualizado</Text>
                <Text style={styles.activitySubtitle}>Hace 1 hora</Text>
              </View>
              <Text style={styles.activityInfo}>15 productos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#74B9FF', '#0984E3']}
              style={styles.statsCard}
            >
              <Text style={styles.statsTitle}>Esta Semana</Text>
              <Text style={styles.statsValue}>S/ 12,450.00</Text>
              <Text style={styles.statsChange}>+18.2% vs semana anterior</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Logout FAB */}
      <TouchableOpacity 
        style={styles.logoutFab}
        onPress={handleLogout}
      >
        <LinearGradient
          colors={['#E17055', '#D63031']}
          style={styles.fabGradient}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {},
  greeting: {
    fontSize: 16,
    color: '#E8E8E8',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E17055',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#6C5CE7',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardContainer: {
    width: (width - 52) / 2,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    color: '#E8E8E8',
    opacity: 0.9,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionContainer: {
    alignItems: 'center',
    width: (width - 68) / 4,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '500',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#636E72',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00B894',
  },
  activityInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#636E72',
  },
  statsContainer: {
    marginTop: 0,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 14,
    color: '#E8E8E8',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsChange: {
    fontSize: 12,
    color: '#E8E8E8',
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 100,
  },
  logoutFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;