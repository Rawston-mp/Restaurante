"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminSenhaPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (result.success) {
        toast(result.message ?? "Senha alterada!", "success");
        (document.getElementById("senha-form") as HTMLFormElement)?.reset();
      } else {
        toast(result.message ?? "Erro.", "error");
      }
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Alterar Senha</h1>
        <p className="text-gray-500 mt-1">Mantenha sua conta segura com uma senha forte</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Segurança da conta</p>
            <p className="text-xs text-gray-400">Mínimo de 8 caracteres</p>
          </div>
        </div>

        <form id="senha-form" action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Senha atual
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="current_password"
                required
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Mostrar/ocultar"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nova senha
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="new_password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Mostrar/ocultar"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Mostrar/ocultar"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow hover:shadow-md transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center justify-center gap-2 mt-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Salvando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
