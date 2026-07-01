"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateDailyMenuSection } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface DailyMenuSection {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface Props {
  section: DailyMenuSection;
  onClose: () => void;
  onSuccess: (updated: DailyMenuSection) => void;
}

export default function EditSectionModal({ section, onClose, onSuccess }: Props) {
  const [name, setName] = useState(section.name);
  const [isActive, setIsActive] = useState(section.isActive);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("isActive", isActive.toString());
      formData.append("order", section.order.toString());

      await updateDailyMenuSection(section.id, formData);
      
      onSuccess({
        ...section,
        name,
        isActive,
      });
      
      toast("Seção atualizada com sucesso.");
      onClose();
    } catch (error) {
      toast("Erro ao atualizar seção.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Editar Seção</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Seção *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carnes, Frutos do Mar, Sobremesas"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Seção visível no cardápio
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
