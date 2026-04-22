import { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface BundleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Promotion {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  active?: boolean;
  bundleItems?: BundleItem[];
  discountType?: 'fixed' | 'percent';
  discountValue?: number;
}

interface PromotionsPageProps {
  promotions: Promotion[];
  onSave: (promo: Promotion) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  primaryColor?: string;
}

export const PromotionsPage = ({ promotions, onSave, onDelete, primaryColor = '#f59e0b' }: PromotionsPageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);

  const handleSave = async (formData: FormData) => {
    const promo: Promotion = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      originalPrice: parseFloat(formData.get('originalPrice') as string) || undefined,
      image: formData.get('image') as string || undefined,
      active: true,
      bundleItems: bundleItems.length > 0 ? bundleItems : undefined,
      discountType: (formData.get('discountType') as 'fixed' | 'percent') || undefined,
      discountValue: parseFloat(formData.get('discountValue') as string) || undefined,
    };
    if (editingPromo?.id) {
      promo.id = editingPromo.id;
    }
    await onSave(promo);
    setShowModal(false);
    setEditingPromo(null);
    setBundleItems([]);
  };

  const addBundleItem = () => {
    setBundleItems([...bundleItems, { id: '', name: '', quantity: 1, price: 0 }]);
  };

  const updateBundleItem = (index: number, field: keyof BundleItem, value: string | number) => {
    const updated = [...bundleItems];
    updated[index] = { ...updated[index], [field]: value };
    setBundleItems(updated);
  };

  const removeBundleItem = (index: number) => {
    setBundleItems(bundleItems.filter((_, i) => i !== index));
  };

  const openModal = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setBundleItems(promo.bundleItems || []);
    } else {
      setEditingPromo(null);
      setBundleItems([]);
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bundles / Promociones</h1>
          <p className="text-gray-600">{promotions.length} bundles configurados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-5 h-5" />
          Nuevo Bundle
        </button>
      </div>

      <div className="grid gap-4">
        {promotions.map((promo) => (
          <div key={promo.id || promo.name} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono">
                    {promo.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{promo.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{promo.description}</p>
                {promo.bundleItems && promo.bundleItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Items incluidos:</p>
                    {promo.bundleItems.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        {item.quantity}x {item.name} (${item.price})
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-purple-600 font-black text-xl">${promo.price}</p>
                  {promo.originalPrice && promo.originalPrice > promo.price && (
                    <>
                      <p className="text-gray-400 line-through">${promo.originalPrice}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {promo.discountType === 'percent' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(promo)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => promo.id && onDelete(promo.id)}
                  className="p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay bundles configurados</p>
            <p className="text-sm text-gray-400">Crea uno para empezar</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form action={handleSave}>
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold">
                  {editingPromo ? 'Editar Bundle' : 'Nuevo Bundle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    name="name"
                    defaultValue={editingPromo?.name}
                    required
                    placeholder="Ej: Combo Dulce"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input
                    name="description"
                    defaultValue={editingPromo?.description}
                    placeholder="Ej: 2 pre-rolls + 1 MDMA"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Bundle</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingPromo?.price}
                      required
                      placeholder="299"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
                    <input
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      defaultValue={editingPromo?.originalPrice}
                      placeholder="350"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
                  <input
                    name="image"
                    defaultValue={editingPromo?.image}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Descuento</label>
                    <select
                      name="discountType"
                      defaultValue={editingPromo?.discountType || ''}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin descuento</option>
                      <option value="fixed">Fijo ($)</option>
                      <option value="percent">Porcentaje (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Descuento</label>
                    <input
                      name="discountValue"
                      type="number"
                      step="0.01"
                      defaultValue={editingPromo?.discountValue}
                      placeholder="20"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Items del Bundle</label>
                    <button
                      type="button"
                      onClick={addBundleItem}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Agregar item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {bundleItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="ID"
                          value={item.id}
                          onChange={(e) => updateBundleItem(index, 'id', e.target.value)}
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={item.name}
                          onChange={(e) => updateBundleItem(index, 'name', e.target.value)}
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Cant"
                          value={item.quantity}
                          onChange={(e) => updateBundleItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="$"
                          value={item.price}
                          onChange={(e) => updateBundleItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeBundleItem(index)}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
