"use client";

import { createCategory, deleteCategory } from "@/actions/actions";
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useTransition } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface Category {
  id: string;
  name: string;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleAddCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createCategory(formData);
      toast("Categoria adicionada com sucesso!");
      (e.target as HTMLFormElement).reset();
    });
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Remover categoria "${name}"?`)) return;

    startTransition(async () => {
      await deleteCategory(id);
      toast("Categoria removida com sucesso!");
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-800 mb-4">Categorias</h2>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Ex: Entradas"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-500 text-white px-3 py-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Adicionar categoria"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma categoria criada ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1 rounded-full border border-orange-100 group"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                aria-label={`Remover categoria ${cat.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
