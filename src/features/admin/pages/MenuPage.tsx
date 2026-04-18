import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Image, X, GripVertical } from 'lucide-react';

interface ItemOption {
  id: string;
  label: string;
  price: number;
  quantity?: number;
  unit?: string;
  dosage?: string;
  weight?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
  options?: ItemOption[];
}

interface MenuPageProps {
  menuItems: MenuItem[];
  categories: Array<{ code: string; displayName: string }>;
  onSave: (item: Partial<MenuItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  primaryColor?: string;
}

export const MenuPage = ({ menuItems, categories, onSave, onDelete, primaryColor = '#f59e0b' }: MenuPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setItemOptions(item.options || []);
    setShowModal(true);
  };

  const handleAddOption = () => {
    const newOption: ItemOption = {
      id: Date.now().toString(),
      label: '',
      price: 0,
    };
    setItemOptions([...itemOptions, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    setItemOptions(itemOptions.filter(o => o.id !== id));
  };

  const handleOptionChange = (id: string, field: keyof ItemOption, value: any) => {
    setItemOptions(itemOptions.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (formData: FormData) => {
    const item: Partial<MenuItem> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      active: formData.get('active') === 'true',
      options: itemOptions.filter(o => o.label && o.price > 0),
    };
    if (editingItem) item.id = editingItem.id;
    await onSave(item);
    setShowModal(false);
    setEditingItem(null);
    setItemOptions([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setItemOptions([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Menú</h1>
          <p className="text-gray-600">{menuItems.length} productos en el menú</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.code} value={cat.code}>{cat.displayName}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {categories.find(c => c.code === item.category)?.displayName || item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">${item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <form action={handleSave}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                  {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    name="name"
                    defaultValue={editingItem?.name}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingItem?.price}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || categories[0]?.code}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.code} value={cat.code}>{cat.displayName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      name="active"
                      type="checkbox"
                      defaultChecked={editingItem?.active ?? true}
                      value="true"
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Activo</span>
                  </label>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Opciones del producto</label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                      style={{ color: primaryColor }}
                    >
                      <Plus className="w-3 h-3" />
                      Agregar opción
                    </button>
                  </div>
                  {itemOptions.length > 0 && (
                    <div className="space-y-2">
                      {itemOptions.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <input
                            placeholder="Nombre (ej: 10 gummies 25mg)"
                            value={option.label}
                            onChange={(e) => handleOptionChange(option.id, 'label', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border rounded"
                          />
                          <input
                            placeholder="Precio"
                            type="number"
                            value={option.price}
                            onChange={(e) => handleOptionChange(option.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-sm border rounded"
                          />
                          <input
                            placeholder="Cantidad"
                            value={option.quantity || ''}
                            onChange={(e) => handleOptionChange(option.id, 'quantity', parseInt(e.target.value) || undefined)}
                            className="w-16 px-2 py-1 text-sm border rounded"
                          />
                          <input
                            placeholder="Unidad (g, ml, pzs)"
                            value={option.unit || ''}
                            onChange={(e) => handleOptionChange(option.id, 'unit', e.target.value)}
                            className="w-20 px-2 py-1 text-sm border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
