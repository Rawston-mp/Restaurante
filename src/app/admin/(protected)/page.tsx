import { getDashboardStats } from "@/actions/actions";
import { UtensilsCrossed, Camera, Tag } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Itens no Cardápio", value: stats.menuCount, icon: UtensilsCrossed, color: "text-red-600 bg-red-100" },
    { label: "Categorias", value: stats.categoryCount, icon: Tag, color: "text-orange-600 bg-orange-100" },
    { label: "Fotos na Galeria", value: stats.galleryCount, icon: Camera, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu restaurante</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 p-6">
        <h2 className="font-bold text-gray-800 mb-3">Acesso Rápido</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/cardapio" className="bg-white border border-orange-200 text-orange-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all hover:scale-[1.02] text-sm">
            + Adicionar Prato
          </a>
          <a href="/admin/fotos" className="bg-white border border-purple-200 text-purple-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all hover:scale-[1.02] text-sm">
            + Adicionar Foto
          </a>
          <a href="/admin/configuracoes" className="bg-white border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all hover:scale-[1.02] text-sm">
            Editar Configurações
          </a>
        </div>
      </div>
    </div>
  );
}
