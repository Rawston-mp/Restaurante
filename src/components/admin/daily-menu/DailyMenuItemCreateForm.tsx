"use client";

import { useState } from "react";
import { createMenuItem } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  sectionId?: string;
  sectionName?: string;
}

export default function DailyMenuItemCreateForm({
  categories,
  sectionId,
  sectionName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createMenuItem(formData);
      toast("Prato adicionado com sucesso.");

      // Reset form
      const form = document.querySelector("form") as HTMLFormElement;
      form?.reset();
    } catch (error) {
      toast("Erro ao adicionar prato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-800 mb-4">
        Novo Prato {sectionName && `em ${sectionName}`}
      </h3>

      <form action={handleSubmit} className="space-y-4">
        {/* Hidden sectionId */}
        {sectionId && <input type="hidden" name="sectionId" value={sectionId} />}
        
        {/* Hidden is_active - Mark as active by default */}
        <input type="hidden" name="is_active" value="on" />

        {/* Nome */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ex: Frango à Parmegiana"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            placeholder="Descrição breve do prato..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Preço e Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              placeholder="0.00"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              name="categoryId"
              required
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Imagem */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Imagem do Prato
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Clique para enviar (JPG, PNG, WEBP — máx 5MB)
            </p>
            <input
              type="text"
              name="image_url"
              placeholder="Ou cole uma URL de imagem..."
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_new"
              className="w-4 h-4 rounded accent-orange-500"
            />
            <span className="text-sm text-gray-700">Marcar como Novidade</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_unavailable"
              className="w-4 h-4 rounded accent-orange-500"
            />
            <span className="text-sm text-gray-700">Indisponível</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_delivery"
              className="w-4 h-4 rounded accent-orange-500"
            />
            <span className="text-sm text-gray-700">Disponível para Delivery</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !sectionId}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adicionando..." : "Adicionar Prato"}
        </button>

        {!sectionId && (
          <p className="text-xs text-gray-500 text-center">
            Selecione uma seção para adicionar pratos
          </p>
        )}
      </form>
    </div>
  );
}
