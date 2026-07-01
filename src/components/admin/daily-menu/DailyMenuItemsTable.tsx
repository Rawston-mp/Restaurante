"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, Truck, Star } from "lucide-react";
import { deleteMenuItem, updateMenuItemActive } from "@/actions/actions";
import EditMenuItemModal from "../EditMenuItemModal";
import { useToast } from "@/components/ui/ToastProvider";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  is_delivery?: boolean;
  is_new?: boolean;
  is_unavailable?: boolean;
  category?: { name: string };
  order?: number;
}

interface Props {
  items: MenuItem[];
  sectionName?: string;
}

export default function DailyMenuItemsTable({ items, sectionName }: Props) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar "${name}"?`)) return;
    try {
      await deleteMenuItem(id);
      toast(`"${name}" deletado com sucesso.`);
    } catch (error) {
      toast("Erro ao deletar prato.");
    }
  }

  async function handleToggleActive(id: string, current: boolean, name: string) {
    try {
      await updateMenuItemActive(id, !current);
      toast(current ? "Prato oculto." : "Prato visível.");
    } catch (error) {
      toast("Erro ao atualizar prato.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-gray-400">
        <p>Nenhum prato nesta seção</p>
      </div>
    );
  }

  return (
    <>
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">PRATO</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">PREÇO</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600">NOVO</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600">INDISPONÍVEL</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600">DELIVERY</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600">STATUS</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  R$ {item.price.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.is_new ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      Sim
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.is_unavailable ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      Sim
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.is_delivery ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Truck className="w-3 h-3" />
                      Sim
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.is_active ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Eye className="w-3 h-3" />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <EyeOff className="w-3 h-3" />
                      Oculto
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right space-x-1">
                  <button
                    onClick={() => handleToggleActive(item.id, item.is_active, item.name)}
                    className="inline-p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    title={item.is_active ? "Ocultar" : "Mostrar"}
                  >
                    {item.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="inline-p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="inline-p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
