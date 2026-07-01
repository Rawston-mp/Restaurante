"use client";

import { deleteGalleryItem } from "@/actions/actions";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface Photo {
  id: string;
  image_url: string;
  alt_text: string | null;
}

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const { toast } = useToast();

  async function handleDelete(id: string) {
    if (!confirm("Remover esta foto?")) return;
    await deleteGalleryItem(id);
    toast("Foto removida com sucesso!");
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <p className="text-5xl mb-3">📷</p>
        <p className="text-gray-400">Nenhuma foto cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100"
        >
          <img
            src={photo.image_url}
            alt={photo.alt_text ?? "Foto do restaurante"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={() => handleDelete(photo.id)}
              className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Remover foto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {photo.alt_text && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate">{photo.alt_text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
