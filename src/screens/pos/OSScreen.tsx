// src/screens/pos/POSScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../../store';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart,
  createOrder 
} from '../../store/slices/ordersSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { Product, PaymentMethod, CartItem } from '../../types';

const POSScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading: productsLoading } = useSelector((state: RootState) => state.products);
  const { cart, isLoading: ordersLoading } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      product,
      quantity: 1,
      unit_price: product.price,
      subtotal: product.price,
    };
    dispatch(addToCart(cartItem));
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };

  const handleProcessPayment = async () => {
    if (cart.items.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }

    try {
      const orderData = {
        store_id: '00000000-0000-0000-0000-000000000001', // Default store
        items: cart.items,
        payment_method: selectedPaymentMethod,