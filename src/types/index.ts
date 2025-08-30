 
export interface User {
  id: string;
  email?: string;
  role: 'saas_admin' | 'store_admin' | 'cashier';
  store_id?: string;
  tenant_id?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  tenant_id: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  segment?: string;
  store_id: string;
  tenant_id: string;
}

export interface Transaction {
  id: string;
  store_id: string;
  tenant_id: string;
  amount: number;
  payer_name?: string;
  status: 'pending' | 'confirmed';
  created_at: string;
  notified: boolean;
}