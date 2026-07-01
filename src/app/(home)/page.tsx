import Link from "next/link";
import { getActiveMenuGrouped, getGallery, getAllSettings } from "@/actions/actions";
import { Clock, MapPin, Phone, ChevronRight, Utensils, Camera } from "lucide-react";

export default async function HomePage() {
  const [categories, gallery, settings] = await Promise.all([
    getActiveMenuGrouped(),
    getGallery(),
    getAllSettings(),
  ]);

  const featuredItems = categories
    .flatMap((c) => c.items)
    .filter((i) => i.is_active)
    .slice(0, 6);

  const previewPhotos = gallery.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-red-600 via-orange-500 to-orange-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {settings.foto_estabelecimento && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={settings.foto_estabelecimento}
              alt="Foto do estabelecimento"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="flex justify-center mb-6">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
              🍽️ Bem-vindo!
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Meu Restaurante
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Sabores autênticos preparados com ingredientes frescos e muito carinho. Venha nos visitar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-orange-50 transition-all hover:scale-105"
            >
              <Utensils className="w-5 h-5" />
              Ver Cardápio
            </Link>
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full border border-white/40 hover:bg-white/30 transition-all"
            >
              <Clock className="w-5 h-5" />
              Horários
            </Link>
          </div>
        </div>
      </section>

      {featuredItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Nossos <span className="text-red-600">Destaques</span>
              </h2>
              <p className="mt-3 text-gray-500">Os pratos favoritos dos nossos clientes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-purple-100 overflow-hidden"
                >
                  <div className="h-48 bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl">🍽️</span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item.name}</h3>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-gray-500 flex-1 line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-4">
                      <span className="text-xl font-bold text-purple-600">
                        {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/cardapio" className="inline-flex items-center gap-2 bg-linear-to-r from-red-500 to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all hover:scale-105">
                Ver Cardápio Completo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {previewPhotos.length > 0 && (
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Nossa <span className="text-red-600">Galeria</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02] group">
                  <img src={photo.image_url} alt={photo.alt_text ?? "Foto do restaurante"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/fotos" className="inline-flex items-center gap-2 border-2 border-red-500 text-red-600 font-bold px-8 py-3 rounded-full hover:bg-red-50 transition-all">
                <Camera className="w-4 h-4" /> Ver Todas as Fotos
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-red-50">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900">Horários</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{settings.horarios ?? "Consulte nossa página de horários"}</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-orange-50">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">Contato</h3>
              <p className="text-sm text-gray-600">{settings.telefone ?? "Entre em contato"}</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-purple-50">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Localização</h3>
              <p className="text-sm text-gray-600">{settings.endereco ?? "Veja nossa localização"}</p>
            </div>
          </div>
        </div>
      </section>

      {settings.whatsapp && (
        <a
          href={`https://wa.me/55${settings.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          aria-label="Falar no WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.537 4.09 1.562 5.857L0 24l6.29-1.546A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.386l-.36-.214-3.734.917.947-3.64-.236-.375A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
        </a>
      )}
    </div>
  );
}
