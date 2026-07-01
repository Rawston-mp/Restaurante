import { getAllSettings } from "@/actions/actions";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Horários & Contato | Meu Restaurante",
  description: "Confira os horários de funcionamento, endereço e contato do Meu Restaurante.",
};

export default async function HorariosPage() {
  const settings = await getAllSettings();

  const defaultHours = [
    { day: "Segunda-feira", hours: "Fechado" },
    { day: "Terça-feira", hours: "11h00 – 22h00" },
    { day: "Quarta-feira", hours: "11h00 – 22h00" },
    { day: "Quinta-feira", hours: "11h00 – 22h00" },
    { day: "Sexta-feira", hours: "11h00 – 23h00" },
    { day: "Sábado", hours: "11h00 – 23h00" },
    { day: "Domingo", hours: "11h00 – 21h00" },
  ];

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-linear-to-r from-red-600 via-orange-500 to-orange-400 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Horários & Contato
          </h1>
          <p className="mt-3 text-lg text-white/90">
            Planeje sua visita — estamos esperando por você!
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Horários */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Horários de Atendimento</h2>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 shadow-md overflow-hidden">
            {defaultHours.map((item, idx) => {
              const isToday = item.day.toLowerCase().startsWith(todayCapitalized.toLowerCase().slice(0, 5));
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    idx !== defaultHours.length - 1 ? "border-b border-purple-50" : ""
                  } ${isToday ? "bg-orange-50" : ""}`}
                >
                  <span className={`font-medium ${isToday ? "text-orange-600 font-bold" : "text-gray-700"}`}>
                    {item.day}
                    {isToday && (
                      <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        Hoje
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      item.hours === "Fechado" ? "text-red-400" : "text-gray-900"
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              );
            })}
          </div>

          {settings.horarios && (
            <p className="mt-4 text-sm text-gray-500 bg-purple-50 rounded-xl px-4 py-3 border border-purple-100">
              ℹ️ {settings.horarios}
            </p>
          )}
        </div>

        {/* Contato */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Contato</h2>
          </div>

          <div className="space-y-4">
            {settings.telefone && (
              <a
                href={`tel:${settings.telefone.replace(/\D/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Telefone</p>
                  <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {settings.telefone}
                  </p>
                </div>
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={`https://wa.me/55${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">WhatsApp</p>
                  <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {settings.whatsapp}
                  </p>
                </div>
              </a>
            )}

            {settings.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">@</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Instagram</p>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {settings.instagram}
                  </p>
                </div>
              </a>
            )}

            {settings.endereco && (
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Endereço</p>
                  <p className="font-semibold text-gray-900">{settings.endereco}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mapa */}
          {settings.maps_url && (
            <div className="rounded-2xl overflow-hidden shadow-md border border-purple-100 mt-6">
              <iframe
                src={settings.maps_url}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do restaurante"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
