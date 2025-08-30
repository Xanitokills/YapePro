import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

interface OrdersScreenProps {
  navigation: any;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'Juan Pérez',
      items: [
        { id: '1', productName: 'Coca Cola 500ml', quantity: 2, price: 3.50, subtotal: 7.00 },
        { id: '2', productName: 'Pan Frances', quantity: 3, price: 0.50, subtotal: 1.50 },
      ],
      total: 8.50,
      status: 'pending',
      paymentMethod: 'Efectivo',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'María García',
      items: [
        { id: '1', productName: 'Leche Gloria 1L', quantity: 1, price: 4.20, subtotal: 4.20 },
        { id: '2', productName: 'Arroz Superior 1kg', quantity: 2, price: 3.80, subtotal: 7.60 },
      ],
      total: 11.80,
      status: 'preparing',
      paymentMethod: 'Yape',
      createdAt: '2024-01-15T11:15:00Z',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      items: [
        { id: '1', productName: 'Aceite Primor 1L', quantity: 1, price: 8.90, subtotal: 8.90 },
      ],
      total: 8.90,
      status: 'ready',
      paymentMethod: 'Visa',
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      customerName: 'Carlos López',
      items: [
        { id: '1', productName: 'Coca Cola 500ml', quantity: 1, price: 3.50, subtotal: 3.50 },
        { id: '2', productName: 'Pan Frances', quantity: 2, price: 0.50, subtotal: 1.00 },
      ],
      total: 4.50,
      status: 'completed',
      paymentMethod: 'Plin',
      createdAt: '2024-01-15T09:45:00Z',
      completedAt: '2024-01-15T10:00:00Z',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const statusConfig = {
    pending: { 
      label: 'Pendiente', 
      color: ['#FDCB6E', '#E17055'], 
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      textColor: '#E17055'
    },
    preparing: { 
      label: 'Preparando', 
      color: ['#74B9FF', '#0984E3'], 
      icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
      textColor: '#0984E3'
    },
    ready: { 
      label: 'Listo', 
      color: ['#00B894', '#00A085'], 
      icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
      textColor: '#00A085'
    },
    completed: { 
      label: 'Completado', 
      color: ['#A29BFE', '#6C5CE7'], 
      icon: 'checkmark-done-outline' as keyof typeof Ionicons.glyphMap,
      textColor: '#6C5CE7'
    },
    cancelled: { 
      label: 'Cancelado', 
      color: ['#FD79A8', '#E84393'], 
      icon: 'close-circle-outline' as keyof typeof Ionicons.glyphMap,
      textColor: '#E84393'
    },
  };

  const filterButtons = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'preparing', label: 'Preparando' },
    { key: 'ready', label: 'Listos' },
    { key: 'completed', label: 'Completados' },
  ];

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'all' || order.status === selectedFilter
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : order.completedAt
          }
        : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ 
        ...selectedOrder, 
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : selectedOrder.completedAt
      });
    }
  };

  const cancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancelar Orden',
      '¿Estás seguro de que deseas cancelar esta orden?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => updateOrderStatus(orderId, 'cancelled')
        },
      ]
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-PE'),
      time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getOrderDuration = (order: Order) => {
    const start = new Date(order.createdAt);
    const end = order.completedAt ? new Date(order.completedAt) : new Date();
    const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return diffInMinutes;
  };

  const renderOrderStatusActions = (order: Order) => {
    const actions = [];

    if (order.status === 'pending') {
      actions.push(
        <TouchableOpacity
          key="start"
          style={[styles.actionButton, { backgroundColor: '#74B9FF' }]}
          onPress={() => updateOrderStatus(order.id, 'preparing')}
        >
          <Text style={styles.actionButtonText}>Iniciar</Text>
        </TouchableOpacity>
      );
    }

    if (order.status === 'preparing') {
      actions.push(
        <TouchableOpacity
          key="ready"
          style={[styles.actionButton, { backgroundColor: '#00B894' }]}
          onPress={() => updateOrderStatus(order.id, 'ready')}
        >
          <Text style={styles.actionButtonText}>Marcar Listo</Text>
        </TouchableOpacity>
      );
    }

    if (order.status === 'ready') {
      actions.push(
        <TouchableOpacity
          key="complete"
          style={[styles.actionButton, { backgroundColor: '#6C5CE7' }]}
          onPress={() => updateOrderStatus(order.id, 'completed')}
        >
          <Text style={styles.actionButtonText}>Completar</Text>
        </TouchableOpacity>
      );
    }

    if (['pending', 'preparing'].includes(order.status)) {
      actions.push(
        <TouchableOpacity
          key="cancel"
          style={[styles.actionButton, { backgroundColor: '#E84393' }]}
          onPress={() => cancelOrder(order.id)}
        >
          <Text style={styles.actionButtonText}>Cancelar</Text>
        </TouchableOpacity>
      );
    }

    return actions;
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const config = statusConfig[item.status];
    const { date, time } = formatDateTime(item.createdAt);
    const duration = getOrderDuration(item);

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => {
          setSelectedOrder(item);
          setShowOrderModal(true);
        }}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            {item.customerName && (
              <Text style={styles.customerName}>{item.customerName}</Text>
            )}
          </View>
          
          <View style={styles.orderStatus}>
            <View style={[styles.statusBadge, { backgroundColor: config.textColor + '20' }]}>
              <Ionicons name={config.icon} size={16} color={config.textColor} />
              <Text style={[styles.statusText, { color: config.textColor }]}>
                {config.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.itemCount}>
            {item.items.length} producto{item.items.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.orderTotal}>S/ {item.total.toFixed(2)}</Text>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color="#636E72" />
            <Text style={styles.timeText}>{time} • {duration} min</Text>
          </View>
          <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        </View>

        {['pending', 'preparing', 'ready'].includes(item.status) && (
          <View style={styles.orderActions}>
            {renderOrderStatusActions(item)}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderOrderModal = () => {
    if (!selectedOrder) return null;

    const config = statusConfig[selectedOrder.status];
    const { date, time } = formatDateTime(selectedOrder.createdAt);
    const duration = getOrderDuration(selectedOrder);

    return (
      <Modal
        visible={showOrderModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles de Orden</Text>
              <TouchableOpacity 
                onPress={() => setShowOrderModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#636E72" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Order Info */}
              <View style={styles.modalSection}>
                <View style={styles.orderModalHeader}>
                  <View>
                    <Text style={styles.modalOrderNumber}>{selectedOrder.orderNumber}</Text>
                    {selectedOrder.customerName && (
                      <Text style={styles.modalCustomerName}>{selectedOrder.customerName}</Text>
                    )}
                  </View>
                  <View style={[styles.modalStatusBadge, { backgroundColor: config.textColor + '20' }]}>
                    <Ionicons name={config.icon} size={18} color={config.textColor} />
                    <Text style={[styles.modalStatusText, { color: config.textColor }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderMetaInfo}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#636E72" />
                    <Text style={styles.metaText}>{date} a las {time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#636E72" />
                    <Text style={styles.metaText}>Duración: {duration} minutos</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="card-outline" size={16} color="#636E72" />
                    <Text style={styles.metaText}>{selectedOrder.paymentMethod}</Text>
                  </View>
                </View>
              </View>

              {/* Items */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Productos</Text>
                {selectedOrder.items.map((item) => (
                  <View key={item.id} style={styles.modalItem}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemPrice}>S/ {item.price.toFixed(2)} c/u</Text>
                    </View>
                    <View style={styles.itemQuantity}>
                      <Text style={styles.quantityText}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemSubtotal}>S/ {item.subtotal.toFixed(2)}</Text>
                  </View>
                ))}
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>S/ {selectedOrder.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Actions */}
              {['pending', 'preparing', 'ready'].includes(selectedOrder.status) && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Acciones</Text>
                  <View style={styles.modalActions}>
                    {renderOrderStatusActions(selectedOrder)}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Órdenes</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('POS')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filterButtons}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.key && styles.selectedFilter
              ]}
              onPress={() => setSelectedFilter(item.key as any)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === item.key && styles.selectedFilterText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Orders List */}
      <View style={styles.content}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#DDD6FE" />
            <Text style={styles.emptyTitle}>No hay órdenes</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? 'Aún no tienes órdenes registradas'
                : `No hay órdenes ${filterButtons.find(f => f.key === selectedFilter)?.label.toLowerCase()}`
              }
            </Text>
            {selectedFilter === 'all' && (
              <TouchableOpacity 
                style={styles.createOrderButton}
                onPress={() => navigation.navigate('POS')}
              >
                <LinearGradient
                  colors={['#6C5CE7', '#A29BFE']}
                  style={styles.createOrderGradient}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.createOrderText}>Crear Primera Orden</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrder}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Order Detail Modal */}
      {renderOrderModal()}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  filtersContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  selectedFilter: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  filterText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {},
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    color: '#636E72',
  },
  orderStatus: {},
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 14,
    color: '#636E72',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B894',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#636E72',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createOrderButton: {
    borderRadius: 12,
  },
  createOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  orderModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalOrderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  modalCustomerName: {
    fontSize: 16,
    color: '#636E72',
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderMetaInfo: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#636E72',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#636E72',
  },
  itemQuantity: {
    marginHorizontal: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B894',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#F8F9FA',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00B894',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default OrdersScreen;