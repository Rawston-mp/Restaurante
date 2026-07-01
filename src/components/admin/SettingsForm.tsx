"use client";

import { upsertSettings } from "@/actions/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { FormEvent, useTransition } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface SettingsData {
  [key: string]: string | null;
}

export default function SettingsForm({ settings }: { settings: SettingsData }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await upsertSettings(formData);
      toast("Configurações salvas com sucesso!");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telefone
          </label>
          <input
            type="text"
            name="telefone"
            defaultValue={settings.telefone ?? ""}
            placeholder="(11) 9 9999-9999"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            WhatsApp
          </label>
          <input
            type="text"
            name="whatsapp"
            defaultValue={settings.whatsapp ?? ""}
            placeholder="(11) 9 9999-9999"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Instagram
        </label>
        <input
          type="text"
          name="instagram"
          defaultValue={settings.instagram ?? ""}
          placeholder="@meurestaurante"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Endereço
        </label>
        <input
          type="text"
          name="endereco"
          defaultValue={settings.endereco ?? ""}
          placeholder="Rua Exemplo, 123 – Bairro – Cidade/UF"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Horários de Funcionamento
        </label>
        <textarea
          name="horarios"
          rows={3}
          defaultValue={settings.horarios ?? ""}
          placeholder={"Ter–Sex: 11h – 22h\nSáb: 11h – 23h\nDom: 11h – 21h\nSeg: Fechado"}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Foto do Estabelecimento (hero da home)
        </label>
        <ImageUpload name="foto_estabelecimento" label="Foto" />
        <p className="mt-1.5 text-xs text-gray-400">
          Esta foto será exibida no topo da página inicial. Recomendado: mínimo 1200x600px.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          URL do Google Maps (iframe embed)
        </label>
        <input
          type="url"
          name="maps_url"
          defaultValue={settings.maps_url ?? ""}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          No Google Maps, clique em Compartilhar → Incorporar um mapa e copie a URL do src do iframe.
        </p>
      </div>

      <div className="pt-2">
        <SubmitButton
          label="Salvar Configurações"
          pendingLabel="Salvando..."
          className="bg-linear-to-r from-red-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl shadow hover:shadow-md transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:scale-100"
        />
      </div>
    </form>
  );
}
