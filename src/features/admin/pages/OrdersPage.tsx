import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, Clock, Truck } from 'lucide-react';
import type { OrderStatus } from '../../../core/types';

interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  timestamp: number;
}

interface OrdersPageProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  currency?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  recibido: { label: 'Recibido', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-4 h-4" /> },
  preparando: { label: 'Preparando', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> },
  empaquetando: { label: 'Empaquetando', color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-4 h-4" /> },
  listo: { label: 'Listo', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  en_camino: { label: 'En Camino', color: 'bg-purple-100 text-purple-700', icon: <Truck className="w-4 h-4" /> },
  entregado: { label: 'Entregado', color: 'bg-gray-100 text-gray-700', icon: <CheckCircle className="w-4 h-4" /> },
  pendiente_pago: { label: 'Pendiente Pago', color: 'bg-red-100 text-red-700', icon: <Clock className="w-4 h-4" /> },
};

const statusFlow: OrderStatus[] = ['recibido', 'preparando', 'empaquetando', 'listo', 'en_camino', 'entregado'];

export const OrdersPage = ({ orders, onUpdateStatus, currency = 'MXN' }: OrdersPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'active' && order.status !== 'entregado') ||
                          statusFilter === order.status;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
  };

  const handleAdvanceStatus = async (order: Order) => {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      await onUpdateStatus(order.id, statusFlow[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-gray-600">{orders.filter(o => o.status !== 'entregado').length} órdenes activas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Activas</option>
          <option value="all">Todas</option>
          <option value="recibido">Recibidas</option>
          <option value="preparando">Preparando</option>
          <option value="listo">Listas</option>
          <option value="en_camino">En Camino</option>
          <option value="entregado">Entregadas</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">#{order.id.slice(-6)}</span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerAddress}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(order.timestamp)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-bold">{formatMoney(order.total)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    {order.status !== 'entregado' && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Avanzar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">No se encontraron órdenes</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Orden #{selectedOrder.id.slice(-6)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pago</p>
                  <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Productos</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">{formatMoney(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t mt-2 font-bold">
                    <span>Total</span>
                    <span>{formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
