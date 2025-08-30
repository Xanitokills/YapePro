
export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// src/store/slices/ordersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderForm, OrderWithPaymentStatus } from '../../types';
import { ordersAPI } from '../../services/api';

interface OrdersState {
  orders: OrderWithPaymentStatus[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  cart: {
    items: any[];
    total: number;
  };
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  cart: {
    items: [],
    total: 0,
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params?: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar órdenes');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: OrderForm, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear orden');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar orden');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.items.find(i => i.product.id === item.product.id);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
      } else {
        state.cart.items.push({
          ...item,
          subtotal: item.quantity * item.unit_price,
        });
      }
      
      state.cart.total = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    },
    removeFromCart: (state, action) => {
      state.cart.items = state.cart.items.filter(item => item.product.id !== action.payload);
      state.cart.total = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.items.find(i => i.product.id === productId);
      
      if (item) {
        item.quantity = quantity;
        item.subtotal = quantity * item.unit_price;
        state.cart.total = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
      }
    },
    clearCart: (state) => {
      state.cart.items = [];
      state.cart.total = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.cart = { items: [], total: 0 };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart, 
  clearError 
} = ordersSlice.actions;
export default ordersSlice.reducer;