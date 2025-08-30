import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  barcode?: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: readonly [string, string];
}

interface POSScreenProps {
  navigation: any;
}

const POSScreen: React.FC<POSScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Coca Cola 500ml', price: 3.50, category: 'Bebidas', stock: 25 },
    { id: '2', name: 'Pan Frances', price: 0.50, category: 'Panadería', stock: 50 },
    { id: '3', name: 'Leche Gloria 1L', price: 4.20, category: 'Lácteos', stock: 15 },
    { id: '4', name: 'Arroz Superior 1kg', price: 3.80, category: 'Abarrotes', stock: 30 },
    { id: '5', name: 'Aceite Primor 1L', price: 8.90, category: 'Abarrotes', stock: 12 },
  ]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const categories = ['Todos', 'Bebidas', 'Panadería', 'Lácteos', 'Abarrotes'];
  
  const paymentMethods: PaymentMethod[] = [
    { id: 'efectivo', name: 'Efectivo', icon: 'cash', color: ['#00B894', '#00A085'] },
    { id: 'yape', name: 'Yape', icon: 'phone-portrait', color: ['#6C5CE7', '#A29BFE'] },
    { id: 'plin', name: 'Plin', icon: 'card', color: ['#FD79A8', '#E84393'] },
    { id: 'visa', name: 'Visa', icon: 'card-outline', color: ['#74B9FF', '#0984E3'] },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode?.includes(searchQuery);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        Alert.alert('Stock insuficiente', `Solo quedan ${product.stock} unidades disponibles`);
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      Alert.alert('Stock insuficiente', `Solo quedan ${product.stock} unidades disponibles`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    Alert.alert(
      'Limpiar Carrito',
      '¿Estás seguro de que deseas limpiar el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpiar', style: 'destructive', onPress: () => setCart([]) },
      ]
    );
  };

  const processPayment = () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de procesar el pago');
      return;
    }
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Selecciona un método de pago');
      return;
    }

    const total = getTotalAmount();
    const payment = parseFloat(paymentAmount);

    if (selectedPaymentMethod === 'efectivo' && payment < total) {
      Alert.alert('Error', 'El monto ingresado es menor al total');
      return;
    }

    // Simular procesamiento de pago
    Alert.alert(
      'Pago Procesado',
      `Venta completada por S/ ${total.toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCart([]);
            setShowPaymentModal(false);
            setPaymentAmount('');
            setSelectedPaymentMethod('');
            // Aquí podrías navegar a una pantalla de recibo
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => addToCart(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>S/ {item.price.toFixed(2)}</Text>
        <Text style={[
          styles.productStock,
          { color: item.stock < 10 ? '#E17055' : '#636E72' }
        ]}>
          Stock: {item.stock}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>S/ {item.price.toFixed(2)} c/u</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color="#6C5CE7" />
        </TouchableOpacity>
      </View>
      <View style={styles.cartItemRight}>
        <Text style={styles.subtotal}>S/ {item.subtotal.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#E17055" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <LinearGradient
        colors={method.color}
        style={styles.paymentIcon}
      >
        <Ionicons name={method.icon} size={24} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.paymentMethodName}>{method.name}</Text>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Punto de Venta</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => {/* Implementar scanner de código de barras */}}
          >
            <Ionicons name="scan" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.mainContent}>
          {/* Products List */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Productos</Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderProduct}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color="#DDD6FE" />
                  <Text style={styles.emptyText}>No se encontraron productos</Text>
                </View>
              }
            />
          </View>

          {/* Cart */}
          <View style={styles.cartSection}>
            <View style={styles.cartHeader}>
              <Text style={styles.sectionTitle}>
                Carrito ({getTotalItems()})
              </Text>
              {cart.length > 0 && (
                <TouchableOpacity onPress={clearCart}>
                  <Ionicons name="trash-outline" size={20} color="#E17055" />
                </TouchableOpacity>
              )}
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="bag-outline" size={48} color="#DDD6FE" />
                <Text style={styles.emptyCartText}>Carrito vacío</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCartItem}
                  style={styles.cartList}
                />

                {/* Total and Checkout */}
                <View style={styles.totalSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>
                      S/ {getTotalAmount().toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.checkoutButton}
                    onPress={processPayment}
                  >
                    <LinearGradient
                      colors={['#00B894', '#00A085']}
                      style={styles.checkoutGradient}
                    >
                      <Ionicons name="card" size={20} color="#FFFFFF" />
                      <Text style={styles.checkoutText}>Procesar Pago</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Procesar Pago</Text>
              <TouchableOpacity 
                onPress={() => setShowPaymentModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#636E72" />
              </TouchableOpacity>
            </View>

            <Text style={styles.totalToPay}>
              Total a pagar: S/ {getTotalAmount().toFixed(2)}
            </Text>

            <Text style={styles.paymentSectionTitle}>Método de Pago</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map(renderPaymentMethod)}
            </View>

            {selectedPaymentMethod === 'efectivo' && (
              <View style={styles.paymentAmountSection}>
                <Text style={styles.paymentLabel}>Monto recibido:</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                />
                {paymentAmount && (
                  <Text style={styles.changeAmount}>
                    Cambio: S/ {(parseFloat(paymentAmount) - getTotalAmount()).toFixed(2)}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmPayment}
              >
                <LinearGradient
                  colors={['#00B894', '#00A085']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scanButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  selectedCategory: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  categoryText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  productsSection: {
    flex: 2,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width * 0.6 - 32) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B894',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  addButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSection: {
    flex: 1.5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartList: {
    flex: 1,
    maxHeight: height * 0.4,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#636E72',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemRight: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00B894',
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#F8F9FA',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  checkoutButton: {
    borderRadius: 12,
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 12,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    padding: 4,
  },
  totalToPay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B894',
    textAlign: 'center',
    marginBottom: 24,
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  paymentMethod: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: '#F8F9FA',
    width: (width - 88) / 2,
  },
  selectedPaymentMethod: {
    borderColor: '#6C5CE7',
    backgroundColor: '#F4F3FF',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  paymentAmountSection: {
    marginBottom: 24,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
  },
  changeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B894',
    textAlign: 'center',
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
  },
  confirmGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default POSScreen;