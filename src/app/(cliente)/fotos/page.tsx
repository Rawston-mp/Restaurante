import { getGallery } from "@/actions/actions";
import GaleriaGrid from "@/components/GaleriaGrid";

export const metadata = {
  title: "Galeria de Fotos | Meu Restaurante",
  description: "Veja fotos do ambiente e dos pratos do Meu Restaurante.",
};

export default async function FotosPage() {
  const photos = await getGallery();

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-linear-to-r from-red-600 via-orange-500 to-orange-400 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Galeria de Fotos
          </h1>
          <p className="mt-3 text-lg text-white/90">
            Conheça nosso ambiente e nossos pratos
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-gray-500 text-lg">
              Nossas fotos estão chegando. Volte em breve!
            </p>
          </div>
        ) : (
          <GaleriaGrid photos={photos} />
        )}
      </section>
    </div>
  );
}
