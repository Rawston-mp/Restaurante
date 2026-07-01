"use client";

import { loginAction } from "@/actions/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Utensils, Lock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-linear-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const result = await loginAction(formData);
    if (result && !result.success) {
      setError(result.message ?? "Erro ao fazer login.");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Meu Restaurante</h1>
          <p className="mt-2 text-gray-500">Área Administrativa</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-gray-400" />
            <h2 className="font-bold text-gray-700">Acesso restrito</h2>
          </div>

          <form action={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                placeholder="admin@restaurante.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <SubmitButton />
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          Esta área é exclusiva para administradores do restaurante.
        </p>
      </div>
    </div>
  );
}
