import React, { useState, useEffect } from 'react';
import './../styles/tailwind.css'; 
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Bell,
  Settings,
  Home,
  CreditCard,
  Truck,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

// Tipos de datos
interface Tenant {
  id: string;
  name: string;
  plan: 'FREE' | 'PRO';
}

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  sku: string;
}

interface Order {
  id: string;
  referenceCode: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentMethod: 'YAPE' | 'CASH' | 'CARD' | 'TRANSFER';
  createdAt: string;
  customerName?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

const PymeYapeProCRM = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para datos
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Laptop HP Pavilion',
      category: 'Electrónicos',
      price: 2500.00,
      stock: 5,
      minStock: 2,
      sku: 'HP-PAV-001'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico',
      category: 'Accesorios',
      price: 45.00,
      stock: 15,
      minStock: 10,
      sku: 'MS-WRL-002'
    },
    {
      id: '3',
      name: 'Teclado Mecánico',
      category: 'Accesorios',
      price: 180.00,
      stock: 1,
      minStock: 5,
      sku: 'KB-MEC-003'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      referenceCode: 'ORD-20250830-001',
      total: 2500.00,
      status: 'PAID',
      paymentMethod: 'YAPE',
      createdAt: '2025-08-30T10:30:00',
      customerName: 'Ana García'
    },
    {
      id: '2',
      referenceCode: 'ORD-20250830-002',
      total: 225.00,
      status: 'PENDING',
      paymentMethod: 'YAPE',
      createdAt: '2025-08-30T11:15:00',
      customerName: 'Carlos Mendoza'
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      phone: '+51 987 654 321',
      totalOrders: 3,
      totalSpent: 4200.00
    },
    {
      id: '2',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      phone: '+51 912 345 678',
      totalOrders: 1,
      totalSpent: 225.00
    }
  ]);

  // Cálculos para dashboard
  const totalRevenue = orders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  // Componente de navegación lateral
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <div className="flex items-center mb-8">
        <CreditCard className="w-8 h-8 text-yellow-400 mr-3" />
        <h1 className="text-xl font-bold">PymeYapePro</h1>
      </div>
      
      <nav className="space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'sales', label: 'Ventas (POS)', icon: ShoppingCart },
          { id: 'inventory', label: 'Inventario', icon: Package },
          { id: 'customers', label: 'Clientes', icon: Users },
          { id: 'suppliers', label: 'Proveedores', icon: Truck },
          { id: 'reports', label: 'Reportes', icon: BarChart3 },
          { id: 'settings', label: 'Configuración', icon: Settings }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-yellow-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-gray-600" />
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('es-PE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">S/ {totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes Totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <CreditCard className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Alertas de Stock</h3>
          </div>
          <div className="mt-2">
            {lowStockProducts.map(product => (
              <p key={product.id} className="text-red-700">
                {product.name}: {product.stock} unidades (mínimo: {product.minStock})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Órdenes recientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Órdenes Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Código</th>
                <th className="text-left py-2">Cliente</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Estado</th>
                <th className="text-left py-2">Método</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{order.referenceCode}</td>
                  <td className="py-3">{order.customerName || 'Cliente general'}</td>
                  <td className="py-3">S/ {order.total.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">{order.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Vista de Ventas (POS)
  const SalesView = () => {
    const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
    const [customer, setCustomer] = useState('');

    const addToCart = (product: Product) => {
      const existing = cart.find(item => item.product.id === product.id);
      if (existing) {
        setCart(cart.map(item => 
          item.product.id === product.id 
            ? {...item, quantity: item.quantity + 1}
            : item
        ));
      } else {
        setCart([...cart, {product, quantity: 1}]);
      }
    };

    const removeFromCart = (productId: string) => {
      setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart(cart.map(item => 
        item.product.id === productId 
          ? {...item, quantity}
          : item
      ));
    };

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleCheckout = () => {
      // Aquí conectarías con tu API de Supabase
      alert(`Orden creada por S/ ${total.toFixed(2)}`);
      setCart([]);
      setCustomer('');
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos disponibles */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Punto de Venta</h2>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={searchTerm}
                onChange={e => setSearchTerm((e.target as HTMLInputElement).value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="text-sm text-gray-500">{product.sku}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-yellow-600">S/ {product.price.toFixed(2)}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.stock <= product.minStock 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4">Carrito de Compras</h3>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre del cliente (opcional)"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              value={customer}
              onChange={e => setCustomer((e.target as HTMLInputElement).value)}
            />
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-600">S/ {item.product.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Carrito vacío</p>
          ) : (
            <>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700"
                >
                  Procesar con Yape
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Efectivo/Tarjeta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Vista de Inventario
  const InventoryView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.sku}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">S/ {product.price.toFixed(2)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock <= product.minStock 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock <= product.minStock ? 'Stock Bajo' : 'Disponible'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Vista de Clientes
  const CustomersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Teléfono</th>
                <th className="text-left p-4">Órdenes</th>
                <th className="text-left p-4">Total Gastado</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{customer.name}</td>
                  <td className="p-4 text-gray-600">{customer.email}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">{customer.totalOrders}</td>
                  <td className="p-4">S/ {customer.totalSpent.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Función para renderizar la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'customers':
        return <CustomersView />;
      case 'suppliers':
        return (
          <div className="text-center py-20">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Gestión de Proveedores</h3>
            <p className="text-gray-500">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Reportes y Análisis</h3>
            <p className="text-gray-500">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Configuración</h3>
            <p className="text-gray-500">Funcionalidad en desarrollo</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default PymeYapeProCRM;

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}
