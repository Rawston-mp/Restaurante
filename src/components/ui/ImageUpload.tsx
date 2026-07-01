"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  name: string;
  defaultValue?: string | null;
  label?: string;
}

export default function ImageUpload({ name, defaultValue, label = "Imagem" }: Props) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [urlValue, setUrlValue] = useState<string>(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar imagem.");
        return;
      }

      setPreview(data.url);
      setUrlValue(data.url);
    } catch {
      setError("Erro de rede ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    setPreview(null);
    setUrlValue("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>

      {/* Campo oculto que vai no form */}
      <input type="hidden" name={name} value={urlValue} />

      {preview ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            aria-label="Remover imagem"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
              <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors">
                Clique para enviar (JPG, PNG, WEBP — max 5MB)
              </span>
            </>
          )}
        </label>
      )}

      {/* Campo de URL manual como alternativa */}
      {!preview && (
        <div className="mt-2">
          <input
            type="url"
            placeholder="Ou cole uma URL de imagem..."
            value={urlValue}
            onChange={(e) => {
              setUrlValue(e.target.value);
              setPreview(e.target.value || null);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
