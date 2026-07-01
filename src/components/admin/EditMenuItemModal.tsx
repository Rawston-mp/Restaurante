"use client";

import { useEffect, useRef, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { updateMenuItem } from "@/actions/actions";
import ImageUpload from "@/components/ui/ImageUpload";
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
  item: MenuItem;
  categories: Category[];
  onClose: () => void;
}

export default function EditMenuItemModal({ item, categories, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => dialogRef.current?.close();
  }, []);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateMenuItem(item.id, formData);
      toast("Prato atualizado com sucesso!");
      onClose();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
      className="w-full max-w-lg rounded-2xl shadow-2xl p-0 backdrop:bg-black/60 border-0 outline-none"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg">Editar Prato</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={item.name}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
          <textarea
            name="description"
            rows={2}
            defaultValue={item.description ?? ""}
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
              defaultValue={item.price}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Categoria *</label>
            <select
              name="categoryId"
              required
              defaultValue={item.categoryId}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <ImageUpload name="image_url" defaultValue={item.image_url} label="Imagem do Prato" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              id="edit_is_active"
              defaultChecked={item.is_active}
              className="rounded accent-orange-500"
            />
            <label htmlFor="edit_is_active" className="text-sm text-gray-600">
              Visível no cardápio
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_delivery"
              id="edit_is_delivery"
              defaultChecked={item.is_delivery ?? false}
              className="rounded accent-orange-500"
            />
            <label htmlFor="edit_is_delivery" className="text-sm text-gray-600">
              Disponível para Delivery
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-linear-to-r from-red-500 to-orange-500 text-white font-bold py-2.5 rounded-xl shadow hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
