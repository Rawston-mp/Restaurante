"use client";

import { useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { createDailyMenuSection } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface DailyMenuSection {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface Props {
  sections: DailyMenuSection[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onSectionCreated?: () => void;
}

export default function DailyMenuSectionManager({
  sections,
  selectedSectionId,
  onSelectSection,
  onSectionCreated,
}: Props) {
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

  const filteredSections = sections.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreateSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("isActive", "true");
      await createDailyMenuSection(formData);
      setNewName("");
      setIsCreating(false);
      toast("Seção criada com sucesso.");
      onSectionCreated?.();
    } catch (error) {
      toast("Erro ao criar seção.");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">Seções</h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar seções..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredSections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`w-full px-5 py-3 text-left text-sm font-medium transition-colors ${
              selectedSectionId === section.id
                ? "bg-orange-50 text-orange-700 border-l-2 border-orange-500"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{section.name}</span>
              {!section.isActive && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Oculta
                </span>
              )}
            </div>
          </button>
        ))}

        {filteredSections.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            {search ? "Nenhuma seção encontrada" : "Nenhuma seção criada"}
          </div>
        )}
      </div>

      {/* Create Section */}
      <div className="border-t border-gray-100 p-4">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Seção
          </button>
        ) : (
          <form onSubmit={handleCreateSection} className="space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome da seção"
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewName("");
                }}
                className="flex-1 px-3 py-1.5 text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="flex-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
