import { DollarSign, ShoppingCart, TrendingUp, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, changeType = 'neutral', icon }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className={`text-sm mt-1 ${
          changeType === 'positive' ? 'text-green-600' :
          changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {change}
        </p>
      )}
    </div>
  </div>
);

interface DashboardPageProps {
  orders?: any[];
  currency?: string;
}

export const DashboardPage = ({ orders = [], currency = 'MXN' }: DashboardPageProps) => {
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.timestamp);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
  const pendingOrders = orders.filter(o => o.status !== 'entregado').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de actividad de hoy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas de Hoy"
          value={`$${todayRevenue.toFixed(2)}`}
          change="+12% vs ayer"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Órdenes de Hoy"
          value={todayOrders.length.toString()}
          change={`${pendingOrders} pendientes`}
          changeType="neutral"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatCard
          title="Ticket Promedio"
          value={`$${avgOrderValue.toFixed(2)}`}
          change="+5% vs ayer"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Tiempo Promedio"
          value="25 min"
          change="3 min más rápido"
          changeType="positive"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Órdenes Recientes</h3>
          <div className="space-y-4">
            {todayOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">#{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'entregado' ? 'bg-green-100 text-green-700' :
                    order.status === 'preparando' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {todayOrders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay órdenes hoy</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">
              Los datos se actualizarán con las próximas órdenes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
