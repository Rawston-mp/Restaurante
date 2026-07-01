"use client";

import { createGalleryItem } from "@/actions/actions";
import { Plus } from "lucide-react";
import SubmitButton from "@/components/ui/SubmitButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/ToastProvider";
import { FormEvent, useTransition } from "react";

export default function GalleryUploadForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createGalleryItem(formData);
      toast("Foto adicionada com sucesso!");
      (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4 text-orange-500" /> Adicionar Nova Foto
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-1">
          <ImageUpload name="image_url" label="Foto" />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Descrição (opcional)
          </label>
          <input
            type="text"
            name="alt_text"
            placeholder="Ex: Frango grelhado especial"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-red-500 to-orange-500 text-white font-bold px-6 py-2.5 rounded-xl shadow hover:shadow-md transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
          >
            {isPending ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
