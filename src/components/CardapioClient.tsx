"use client";

import { useState } from "react";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CardapioClient({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const filtered =
    activeCategory === "todos"
      ? categories.filter((c) => c.items.length > 0)
      : categories.filter((c) => c.id === activeCategory && c.items.length > 0);

  return (
    <div>
      {/* Filtros / Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("todos")}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeCategory === "todos"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          Todos
        </button>
        {categories
          .filter((c) => c.items.length > 0)
          .map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* Grid de pratos */}
      <div className="space-y-14">
        {filtered.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">{cat.name}</h2>
              <div className="flex-1 h-px bg-linear-to-r from-orange-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-purple-100 overflow-hidden"
                >
                  <div className="relative h-48 bg-linear-to-br from-red-50 to-orange-50 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-gray-500 flex-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs font-medium bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-gray-500">Nenhum item disponível nessa categoria.</p>
        </div>
      )}
    </div>
  );
}
