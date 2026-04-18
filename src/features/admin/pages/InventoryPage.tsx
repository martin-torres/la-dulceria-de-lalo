import { useState } from 'react';
import { Package, AlertTriangle, Search, ToggleLeft, ToggleRight } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  active: boolean;
  stock?: number;
  lowStockThreshold?: number;
}

interface InventoryPageProps {
  items: InventoryItem[];
  categories: Array<{ code: string; displayName: string }>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onUpdateStock: (id: string, stock: number) => Promise<void>;
}

export const InventoryPage = ({ items, categories, onToggleActive, onUpdateStock }: InventoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyInactive, setShowOnlyInactive] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = showOnlyInactive ? !item.active : true;
    return matchesSearch && matchesFilter;
  });

  const inactiveCount = items.filter(i => !i.active).length;
  const lowStockCount = items.filter(i => i.stock !== undefined && i.stock <= (i.lowStockThreshold || 5)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <p className="text-gray-600">Controla la disponibilidad de productos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ToggleLeft className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold">{inactiveCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={showOnlyInactive}
            onChange={(e) => setShowOnlyInactive(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Mostrar solo inactivos</span>
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Disponibilidad</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                    {categories.find(c => c.code === item.category)?.displayName || item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleActive(item.id, !item.active)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.active ? (
                      <><ToggleRight className="w-4 h-4" /> Disponible</>
                    ) : (
                      <><ToggleLeft className="w-4 h-4" /> No disponible</>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <input
                    type="number"
                    min="0"
                    value={item.stock ?? ''}
                    onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value) || 0)}
                    placeholder="--"
                    className="w-20 px-2 py-1 border rounded text-right focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};
