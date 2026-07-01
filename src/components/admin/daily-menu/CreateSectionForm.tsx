"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createDailyMenuSection } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface Props {
  onSuccess?: () => void;
}

export default function CreateSectionForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("isActive", isActive.toString());

      await createDailyMenuSection(formData);
      
      toast("Seção criada com sucesso.");
      setName("");
      setIsActive(true);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast("Erro ao criar seção.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
      >
        <Plus className="w-5 h-5" />
        Adicionar Seção
      </button>
    );
  }

  return (
    <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
      <form onSubmit={handleSubmit} className="space-y-3">
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
            autoFocus
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="newIsActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded accent-orange-500"
          />
          <label htmlFor="newIsActive" className="text-sm text-gray-700">
            Seção visível no cardápio
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
}
