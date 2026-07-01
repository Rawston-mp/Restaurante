import { getActiveMenuGrouped } from "@/actions/actions";
import CardapioClient from "@/components/CardapioClient";

export const metadata = {
  title: "Cardapio | Meu Restaurante",
  description: "Veja nosso cardapio completo com entradas, pratos principais, sobremesas e bebidas.",
};

export default async function CardapioPage() {
  const categories = await getActiveMenuGrouped();
  const hasItems = categories.some((c) => c.items.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-linear-to-r from-red-600 via-orange-500 to-orange-400 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cardapio
          </h1>
          <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
            Pratos preparados com carinho e ingredientes frescos selecionados.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasItems ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">prato</p>
            <p className="text-gray-500 text-lg">Nosso cardapio esta sendo atualizado. Volte em breve!</p>
          </div>
        ) : (
          <CardapioClient categories={categories} />
        )}
      </section>
    </div>
  );
}
