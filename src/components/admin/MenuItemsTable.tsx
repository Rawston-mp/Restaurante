"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, Truck } from "lucide-react";
import { deleteMenuItem, updateMenuItemActive } from "@/actions/actions";
import EditMenuItemModal from "./EditMenuItemModal";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  is_delivery?: boolean;
  categoryId: string;
  category: Category;
}

interface Props {
  items: MenuItem[];
  categories: Category[];
}

export default function MenuItemsTable({ items, categories }: Props) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir "${name}"?`)) return;
    await deleteMenuItem(id);
    toast(`"${name}" removido com sucesso.`);
  }

  async function handleToggle(id: string, current: boolean) {
    await updateMenuItemActive(id, !current);
    toast(current ? "Prato ocultado do cardápio." : "Prato exibido no cardápio.");
  }

  return (
    <>
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
        />
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p>Nenhum prato cadastrado ainda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Prato</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Delivery</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">🍽️</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-400 truncate max-w-40">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {item.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, item.is_active)}
                      title={item.is_active ? "Ocultar" : "Exibir"}
                      className="inline-flex items-center justify-center"
                    >
                      {item.is_active ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.is_delivery ? (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Sim
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                        aria-label={`Editar ${item.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label={`Excluir ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
