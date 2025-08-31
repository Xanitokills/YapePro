import React, { useState } from "react";
import "../styles/tailwind.css";
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
  BarChart3,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Truck,
} from "lucide-react";

/* =========================
   Tipos de datos
   ========================= */
type Plan = "FREE" | "PRO";
type OrderStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";
type PaymentMethod = "YAPE" | "CASH" | "CARD" | "TRANSFER";
type Role = "OWNER" | "ADMIN" | "STAFF" | "OBSERVER";
type Shift = "MORNING" | "AFTERNOON" | "NIGHT" | "FULL_TIME";
type CurrentView =
  | "dashboard"
  | "sales"
  | "inventory"
  | "stores"
  | "employees"
  | "customers"
  | "suppliers"
  | "reports";

interface Tenant {
  id: string;
  name: string;
  plan: Plan;
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
  status: OrderStatus;
  paymentMethod: PaymentMethod;
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

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  storeId: string;
  storeName: string;
  role: Role;
  shift: Shift;
  salary: number;
  hireDate: string;
  isActive: boolean;
}

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  description: string;
  openingHours: string;
  maxEmployees: number;
  currentEmployees: number;
  isActive: boolean;
  createdAt: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  totalPurchases: number;
  isActive: boolean;
}

/* =========================
   Componente principal
   ========================= */
const PymeYapeProCRM: React.FC = () => {
  const [currentView, setCurrentView] = useState<CurrentView>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // ------- Datos mock -------
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Laptop HP Pavilion",
      category: "Electrónicos",
      price: 2500.0,
      stock: 5,
      minStock: 2,
      sku: "HP-PAV-001",
    },
    {
      id: "2",
      name: "Mouse Inalámbrico",
      category: "Accesorios",
      price: 45.0,
      stock: 15,
      minStock: 10,
      sku: "MS-WRL-002",
    },
    {
      id: "3",
      name: "Teclado Mecánico",
      category: "Accesorios",
      price: 180.0,
      stock: 1,
      minStock: 5,
      sku: "KB-MEC-003",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      referenceCode: "ORD-20250830-001",
      total: 2500.0,
      status: "PAID",
      paymentMethod: "YAPE",
      createdAt: "2025-08-30T10:30:00",
      customerName: "Ana García",
    },
    {
      id: "2",
      referenceCode: "ORD-20250830-002",
      total: 225.0,
      status: "PENDING",
      paymentMethod: "YAPE",
      createdAt: "2025-08-30T11:15:00",
      customerName: "Carlos Mendoza",
    },
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "Ana García",
      email: "ana.garcia@email.com",
      phone: "+51 987 654 321",
      totalOrders: 3,
      totalSpent: 4200.0,
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      phone: "+51 912 345 678",
      totalOrders: 1,
      totalSpent: 225.0,
    },
  ]);

  const [stores] = useState<StoreInfo[]>([
    {
      id: "1",
      name: "TechStore Lima Centro",
      address: "Av. Javier Prado 1234, San Isidro",
      phone: "+51 01 234 5678",
      email: "limacentro@techstore.pe",
      manager: "María González",
      description: "Tienda principal especializada en tecnología y electrónicos",
      openingHours: "9:00 AM - 8:00 PM",
      maxEmployees: 10,
      currentEmployees: 6,
      isActive: true,
      createdAt: "2025-01-15T09:00:00",
    },
    {
      id: "2",
      name: "TechStore Miraflores",
      address: "Av. Larco 567, Miraflores",
      phone: "+51 01 345 6789",
      email: "miraflores@techstore.pe",
      manager: "Carlos Ruiz",
      description: "Sucursal enfocada en accesorios y dispositivos móviles",
      openingHours: "10:00 AM - 9:00 PM",
      maxEmployees: 8,
      currentEmployees: 4,
      isActive: true,
      createdAt: "2025-02-20T10:00:00",
    },
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@techstore.pe",
      phone: "+51 987 123 456",
      position: "Gerente de Tienda",
      storeId: "1",
      storeName: "TechStore Lima Centro",
      role: "ADMIN",
      shift: "FULL_TIME",
      salary: 3500.0,
      hireDate: "2025-01-15",
      isActive: true,
    },
    {
      id: "2",
      name: "Carlos Ruiz",
      email: "carlos.ruiz@techstore.pe",
      phone: "+51 987 234 567",
      position: "Gerente de Tienda",
      storeId: "2",
      storeName: "TechStore Miraflores",
      role: "ADMIN",
      shift: "FULL_TIME",
      salary: 3200.0,
      hireDate: "2025-02-20",
      isActive: true,
    },
    {
      id: "3",
      name: "Ana López",
      email: "ana.lopez@techstore.pe",
      phone: "+51 987 345 678",
      position: "Cajera",
      storeId: "1",
      storeName: "TechStore Lima Centro",
      role: "STAFF",
      shift: "MORNING",
      salary: 1800.0,
      hireDate: "2025-03-01",
      isActive: true,
    },
    {
      id: "4",
      name: "Pedro Morales",
      email: "pedro.morales@techstore.pe",
      phone: "+51 987 456 789",
      position: "Vendedor",
      storeId: "1",
      storeName: "TechStore Lima Centro",
      role: "STAFF",
      shift: "AFTERNOON",
      salary: 1600.0,
      hireDate: "2025-03-10",
      isActive: true,
    },
    {
      id: "5",
      name: "Lucía Fernández",
      email: "lucia.fernandez@techstore.pe",
      phone: "+51 987 567 890",
      position: "Supervisora",
      storeId: "2",
      storeName: "TechStore Miraflores",
      role: "STAFF",
      shift: "FULL_TIME",
      salary: 2200.0,
      hireDate: "2025-03-15",
      isActive: true,
    },
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "TechWorld Distribuidores",
      email: "ventas@techworld.pe",
      phone: "+51 01 555 0123",
      address: "Av. Industrial 456, Callao",
      category: "Electrónicos",
      totalPurchases: 125000.0,
      isActive: true,
    },
    {
      id: "2",
      name: "Accesorios Plus SAC",
      email: "contacto@accesoriosplus.pe",
      phone: "+51 01 555 0456",
      address: "Jr. Comercio 789, Lima",
      category: "Accesorios",
      totalPurchases: 45000.0,
      isActive: true,
    },
  ]);

  // ------- KPIs para dashboard -------
  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  /* =========================
     Componentes internos
     ========================= */

  const Sidebar: React.FC = () => (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center mb-8">
        <CreditCard className="w-8 h-8 text-yellow-400 mr-3" />
        <h1 className="text-xl font-bold">PymeYapePro</h1>
      </div>

      <nav className="space-y-2">
        {[
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "sales", label: "Ventas (POS)", icon: ShoppingCart },
          { id: "inventory", label: "Inventario", icon: Package },
          { id: "stores", label: "Tiendas", icon: Settings },
          { id: "employees", label: "Empleados", icon: Users },
          { id: "customers", label: "Clientes", icon: Users },
          { id: "suppliers", label: "Proveedores", icon: Truck },
          { id: "reports", label: "Reportes", icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const id = item.id as CurrentView;
          return (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentView === id
                  ? "bg-yellow-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
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

  const Dashboard: React.FC = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-gray-600" />
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("es-PE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
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
              <p className="text-2xl font-bold text-gray-900">
                S/ {totalRevenue.toFixed(2)}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {pendingOrders}
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockProducts.length}
              </p>
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
            <h3 className="text-lg font-medium text-red-800">
              Alertas de Stock
            </h3>
          </div>
          <div className="mt-2">
            {lowStockProducts.map((product) => (
              <p key={product.id} className="text-red-700">
                {product.name}: {product.stock} unidades (mínimo:{" "}
                {product.minStock})
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{order.referenceCode}</td>
                  <td className="py-3">
                    {order.customerName || "Cliente general"}
                  </td>
                  <td className="py-3">S/ {order.total.toFixed(2)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
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

  const SalesView: React.FC = () => {
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
      []
    );
    const [customer, setCustomer] = useState("");

    const addToCart = (product: Product) => {
      const existing = cart.find((item) => item.product.id === product.id);
      if (existing) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { product, quantity: 1 }]);
      }
    };

    const removeFromCart = (productId: string) => {
      setCart(cart.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    };

    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const handleCheckout = () => {
      const newOrder: Order = {
        id: (orders.length + 1).toString(),
        referenceCode: `ORD-${new Date()
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "")}-${String(orders.length + 1).padStart(3, "0")}`,
        total,
        status: "PENDING",
        paymentMethod: "YAPE",
        createdAt: new Date().toISOString(),
        customerName: customer || undefined,
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setCustomer("");
      // Reemplaza alert por tu sistema de notificaciones preferido
      alert(
        `Orden creada: ${newOrder.referenceCode} por S/ ${total.toFixed(2)}`
      );
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
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <span className="text-sm text-gray-500">{product.sku}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-yellow-600">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        product.stock <= product.minStock
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
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
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-600">
                    S/ {item.product.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
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

  const InventoryView: React.FC = () => (
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
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.sku}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">S/ {product.price.toFixed(2)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.stock <= product.minStock
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.stock <= product.minStock
                        ? "Stock Bajo"
                        : "Disponible"}
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

  // -------- Vistas placeholder para evitar errores al cambiar de sección --------
  const Placeholder: React.FC<{ icon: React.ElementType; title: string; subtitle?: string }> = ({
    icon: Icon,
    title,
    subtitle,
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-10 border text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );

  const StoresView = () => (
    <Placeholder
      icon={Settings}
      title="Gestión de Tiendas"
      subtitle={`Tiendas registradas: ${stores.length}`}
    />
  );
  const EmployeesView = () => (
    <Placeholder
      icon={Users}
      title="Gestión de Empleados"
      subtitle={`Empleados activos: ${employees.filter((e) => e.isActive).length}`}
    />
  );
  const CustomersView = () => (
    <Placeholder
      icon={Users}
      title="Clientes"
      subtitle={`Clientes registrados: ${customers.length}`}
    />
  );
  const SuppliersView = () => (
    <Placeholder
      icon={Truck}
      title="Proveedores"
      subtitle={`Proveedores activos: ${suppliers.filter((s) => s.isActive).length}`}
    />
  );
  const ReportsView = () => (
    <Placeholder
      icon={BarChart3}
      title="Reportes"
      subtitle="Próximamente: ventas por período, productos más vendidos, etc."
    />
  );

  // -------- Render principal --------
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-0 md:ml-64 p-4 md:p-8">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "sales" && <SalesView />}
        {currentView === "inventory" && <InventoryView />}
        {currentView === "stores" && <StoresView />}
        {currentView === "employees" && <EmployeesView />}
        {currentView === "customers" && <CustomersView />}
        {currentView === "suppliers" && <SuppliersView />}
        {currentView === "reports" && <ReportsView />}
      </main>
    </div>
  );
};

export default PymeYapeProCRM;
