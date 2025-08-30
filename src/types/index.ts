// src/types/index.ts

// Enums
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VIEWER = 'VIEWER'
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  TRIALING = 'TRIALING'
}

export enum MovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER'
}

export enum YapeTransactionStatus {
  PENDING_PARSE = 'PENDING_PARSE',
  PARSED = 'PARSED',
  PENDING_MATCH = 'PENDING_MATCH',
  MATCHED = 'MATCHED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  YAPE = 'YAPE',
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum PurchaseStatus {
  DRAFT = 'DRAFT',
  ORDERED = 'ORDERED',
  RECEIVED = 'RECEIVED',
  CANCELED = 'CANCELED'
}

export enum PriceRuleType {
  PERCENT_OFF = 'PERCENT_OFF',
  FIXED_DISCOUNT = 'FIXED_DISCOUNT'
}

// Interfaces principales
export interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  price_month: number;
  entitlements: {
    max_stores?: number;
    max_employees?: number;
    features?: {
      yape?: boolean;
      promos?: boolean;
      [key: string]: any;
    };
  };
  created_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end?: string;
  cancel_at?: string;
  meta?: any;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  address?: string;
  created_at: string;
}

export interface TenantUser {
  tenant_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  tenant_id: string;
  user_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  store_id?: string;
  name: string;
  phone?: string;
  email?: string;
  segment: string;
  phone_variations: string[];
  name_variations: string[];
  yape_historical_names: string[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  sku: string;
  name: string;
  category?: string;
  price: number;
  cost?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceRule {
  id: string;
  tenant_id: string;
  rule_type: PriceRuleType;
  percent_off?: number;
  fixed_off?: number;
  product_id?: string;
  category?: string;
  starts_at?: string;
  ends_at?: string;
  active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  store_id?: string;
  customer_id?: string;
  employee_id?: string;
  total: number;
  paid_status: PaymentStatus;
  reference_code?: string;
  expected_payment_concept?: string;
  payment_window_expires_at?: string;
  payment_method?: PaymentMethod;
  auto_match_enabled: boolean;
  manual_review_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  qty: number;
  unit_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  order_id?: string;
  purchase_id?: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  received_at: string;
  yape_transaction_ref?: string;
  notes?: string;
  created_at: string;
}

export interface YapeTransaction {
  id: string;
  tenant_id: string;
  raw_notification: any;
  notification_timestamp: string;
  amount?: number;
  sender_name?: string;
  sender_phone?: string;
  concept?: string;
  yape_transaction_id?: string;
  status: YapeTransactionStatus;
  matched_order_id?: string;
  match_confidence?: number;
  parsing_errors: any[];
  matching_attempts: number;
  last_matching_attempt?: string;
  created_at: string;
  updated_at: string;
}

export interface StockLevel {
  id: string;
  tenant_id: string;
  store_id: string;
  product_id: string;
  qty: number;
  min_qty: number;
  last_movement_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  tenant_id: string;
  store_id?: string;
  product_id?: string;
  movement_type: MovementType;
  qty: number;
  unit_cost?: number;
  reason?: string;
  ref_id?: string;
  ref_type?: string;
  employee_id?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  active: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  tenant_id: string;
  store_id: string;
  supplier_id?: string;
  status: PurchaseStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  ordered_at?: string;
  received_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  qty: number;
  unit_cost: number;
  created_at: string;
}

// Interfaces para vistas
export interface OrderWithPaymentStatus extends Order {
  customer_name?: string;
  customer_phone?: string;
  payment_status_display: string;
  matched_yape_transaction_id?: string;
  match_confidence?: number;
}

export interface UnmatchedYapeTransaction extends YapeTransaction {
  hours_since_received: number;
}

// Interfaces para formularios y UI
export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderForm {
  customer_id?: string;
  store_id: string;
  items: CartItem[];
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface CustomerForm {
  name: string;
  phone?: string;
  email?: string;
  segment: string;
}

export interface ProductForm {
  sku: string;
  name: string;
  category?: string;
  price: number;
  cost?: number;
  initial_stock?: number;
}

// Interfaces para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Interfaces para autenticación
export interface AuthUser {
  id: string;
  email: string;
  tenant_id: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Estados de la aplicación
export interface AppState {
  auth: AuthState;
  orders: {
    orders: Order[];
    currentOrder?: Order;
    isLoading: boolean;
    error: string | null;
  };
  products: {
    products: Product[];
    isLoading: boolean;
    error: string | null;
  };
  inventory: {
    stockLevels: StockLevel[];
    movements: InventoryMovement[];
    isLoading: boolean;
    error: string | null;
  };
  yape: {
    transactions: YapeTransaction[];
    unmatchedTransactions: UnmatchedYapeTransaction[];
    isLoading: boolean;
    error: string | null;
  };
}

// Configuraciones
export interface AppConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableDebug: boolean;
}

// Notificaciones
export interface Notification {
  id: string;
  tenant_id: string;
  type: string;
  payload: any;
  seen: boolean;
  created_at: string;
}