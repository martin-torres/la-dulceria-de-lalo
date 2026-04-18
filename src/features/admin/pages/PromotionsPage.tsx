import { useState } from 'react';
import { Plus, Edit, Trash2, Clock, Percent, Gift } from 'lucide-react';

interface Promotion {
  id?: string;
  code: string;
  description: string;
  conditions: {
    orderBeforeHour?: number;
    orderAfterHour?: number;
    minOrderAmount?: number;
    daysOfWeek?: number[];
  };
  action: {
    type: 'free_item' | 'discount_percent' | 'discount_fixed';
    itemCode?: string;
    value?: number;
  };
  active?: boolean;
}

interface PromotionsPageProps {
  promotions: Promotion[];
  onSave: (promo: Promotion) => Promise<void>;
  onDelete: (code: string) => Promise<void>;
  primaryColor?: string;
}

export const PromotionsPage = ({ promotions, onSave, onDelete, primaryColor = '#f59e0b' }: PromotionsPageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const handleSave = async (formData: FormData) => {
    const promo: Promotion = {
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      conditions: {
        orderBeforeHour: formData.get('orderBeforeHour') ? parseInt(formData.get('orderBeforeHour') as string) : undefined,
        orderAfterHour: formData.get('orderAfterHour') ? parseInt(formData.get('orderAfterHour') as string) : undefined,
        minOrderAmount: formData.get('minOrderAmount') ? parseFloat(formData.get('minOrderAmount') as string) : undefined,
      },
      action: {
        type: formData.get('actionType') as Promotion['action']['type'],
        itemCode: formData.get('itemCode') as string || undefined,
        value: formData.get('actionValue') ? parseFloat(formData.get('actionValue') as string) : undefined,
      },
      active: true,
    };
    if (editingPromo?.id) {
      promo.id = editingPromo.id;
    }
    await onSave(promo);
    setShowModal(false);
    setEditingPromo(null);
  };

  const getActionLabel = (action: Promotion['action']) => {
    switch (action.type) {
      case 'free_item': return `Gratis: ${action.itemCode}`;
      case 'discount_percent': return `${action.value}% descuento`;
      case 'discount_fixed': return `$${action.value} descuento`;
    }
  };

  const getConditionLabel = (conditions: Promotion['conditions']) => {
    const parts: string[] = [];
    if (conditions.orderBeforeHour) parts.push(`Antes de ${conditions.orderBeforeHour}:00`);
    if (conditions.orderAfterHour) parts.push(`Después de ${conditions.orderAfterHour}:00`);
    if (conditions.minOrderAmount) parts.push(`Mínimo $${conditions.minOrderAmount}`);
    return parts.join(' • ') || 'Sin condiciones';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="text-gray-600">{promotions.length} promociones configuradas</p>
        </div>
        <button
          onClick={() => { setEditingPromo(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-5 h-5" />
          Nueva Promoción
        </button>
      </div>

      <div className="grid gap-4">
        {promotions.map((promo) => (
          <div key={promo.id || promo.code} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono">
                    {promo.code}
                  </span>
                  {promo.action.type === 'free_item' && <Gift className="w-5 h-5 text-purple-600" />}
                  {promo.action.type === 'discount_percent' && <Percent className="w-5 h-5 text-purple-600" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{promo.description}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getConditionLabel(promo.conditions)}
                  </span>
                </div>
                <p className="text-purple-600 font-medium mt-2">
                  Acción: {getActionLabel(promo.action)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPromo(promo); setShowModal(true); }}
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
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay promociones configuradas</p>
            <p className="text-sm text-gray-400">Crea una para empezar</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form action={handleSave}>
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold">
                  {editingPromo ? 'Editar Promoción' : 'Nueva Promoción'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                      name="code"
                      defaultValue={editingPromo?.code}
                      required
                      placeholder="EJ: COKE_FREE"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Acción</label>
                    <select
                      name="actionType"
                      defaultValue={editingPromo?.action.type || 'free_item'}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free_item">Producto Gratis</option>
                      <option value="discount_percent">Descuento %</option>
                      <option value="discount_fixed">Descuento Fijo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input
                    name="description"
                    defaultValue={editingPromo?.description}
                    required
                    placeholder="Ej: ¡Coca-Cola GRATIS antes del mediodía!"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Antes de hora</label>
                    <input
                      name="orderBeforeHour"
                      type="number"
                      min="0"
                      max="23"
                      defaultValue={editingPromo?.conditions.orderBeforeHour}
                      placeholder="12"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto mínimo</label>
                    <input
                      name="minOrderAmount"
                      type="number"
                      step="0.01"
                      defaultValue={editingPromo?.conditions.minOrderAmount}
                      placeholder="100"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item gratis (código)</label>
                    <input
                      name="itemCode"
                      defaultValue={editingPromo?.action.itemCode}
                      placeholder="cocacola_350ml"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor (descuento)</label>
                    <input
                      name="actionValue"
                      type="number"
                      step="0.01"
                      defaultValue={editingPromo?.action.value}
                      placeholder="10"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
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
