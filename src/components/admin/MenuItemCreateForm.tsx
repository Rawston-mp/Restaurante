"use client";

import { createMenuItem } from "@/actions/actions";
import { FormEvent, useTransition } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  id: string;
  name: string;
}

export default function MenuItemCreateForm({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createMenuItem(formData);
      toast("Prato adicionado com sucesso!");
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <h2 className="font-bold text-gray-800 mb-4">Novo Prato</h2>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Ex: Frango à Parmegiana"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
        <textarea
          name="description"
          rows={2}
          placeholder="Descrição breve do prato..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Preço (R$) *</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Categoria *</label>
          <select
            name="categoryId"
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
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

      <ImageUpload name="image_url" label="Imagem do Prato" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            defaultChecked
            className="rounded accent-orange-500"
          />
          <label htmlFor="is_active" className="text-sm text-gray-600">
            Visível no cardápio
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_delivery"
            id="is_delivery"
            className="rounded accent-orange-500"
          />
          <label htmlFor="is_delivery" className="text-sm text-gray-600">
            Disponível para Delivery
          </label>
        </div>
      </div>

      <SubmitButton label="Adicionar Prato" pendingLabel="Adicionando..." />
    </form>
  );
}
