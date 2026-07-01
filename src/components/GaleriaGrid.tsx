"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: string;
  image_url: string;
  alt_text: string | null;
}

export default function GaleriaGrid({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setLightbox(photo)}
            className="block w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02] group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            aria-label={`Ver foto: ${photo.alt_text ?? "Foto do restaurante"}`}
          >
            <Image
              src={photo.image_url}
              alt={photo.alt_text ?? "Foto do restaurante"}
              width={600}
              height={400}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualizar foto"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
          <Image
            src={lightbox.image_url}
            alt={lightbox.alt_text ?? "Foto do restaurante"}
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.alt_text && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-4 py-1.5 rounded-full">
              {lightbox.alt_text}
            </p>
          )}
        </div>
      )}
    </>
  );
}
