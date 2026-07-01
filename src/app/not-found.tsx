import Link from "next/link";
import { Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <Utensils className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h1 className="text-8xl font-extrabold text-gray-100">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Página não encontrada</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          A página que você está procurando não existe ou foi removida.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-linear-to-r from-red-500 to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all hover:scale-105"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
