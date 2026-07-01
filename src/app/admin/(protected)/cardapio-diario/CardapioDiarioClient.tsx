"use client";

import { useState } from "react";
import { getDailyMenuSections } from "@/actions/actions";
import DailyMenuSectionManager from "@/components/admin/daily-menu/DailyMenuSectionManager";
import DailyMenuItemsTable from "@/components/admin/daily-menu/DailyMenuItemsTable";
import DailyMenuItemCreateForm from "@/components/admin/daily-menu/DailyMenuItemCreateForm";

interface DailyMenuSection {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
  items?: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  is_delivery?: boolean;
  is_new?: boolean;
  is_unavailable?: boolean;
  category?: { name: string };
  order?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  sections: DailyMenuSection[];
  categories: Category[];
}

export default function CardapioDiarioClient({ sections: initialSections, categories }: Props) {
  const [sections, setSections] = useState(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sections[0]?.id || null
  );

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const itemsInSection = selectedSection?.items || [];

  const handleSectionCreated = async () => {
    // Refresh sections from server
    const updated = await getDailyMenuSections();
    setSections(updated);
    if (updated.length > 0 && !selectedSectionId) {
      setSelectedSectionId(updated[updated.length - 1].id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Cardápio Diário</h1>
        <p className="text-gray-500 mt-1">
          Organize seus pratos por seções do cardápio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Seções e Novo Prato */}
        <div className="lg:col-span-1 space-y-4">
          <DailyMenuSectionManager
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onSectionCreated={handleSectionCreated}
          />

          <DailyMenuItemCreateForm
            categories={categories}
            sectionId={selectedSectionId || undefined}
            sectionName={selectedSection?.name}
          />
        </div>

        {/* Tabela - Pratos da Seção */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">
              {selectedSection
                ? `${selectedSection.name} (${itemsInSection.length})`
                : "Selecione uma seção"}
            </h2>
          </div>

          {selectedSection ? (
            <DailyMenuItemsTable
              items={itemsInSection}
              sectionName={selectedSection.name}
            />
          ) : (
            <div className="px-5 py-12 text-center text-gray-400">
              <p>Nenhuma seção selecionada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
