"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Copy, Eye, EyeOff, Trash2, GripVertical } from "lucide-react";
import { deleteDailyMenuSection, duplicateDailyMenuSection, reorderDailyMenuSections, updateDailyMenuSection } from "@/actions/actions";
import { useToast } from "@/components/ui/ToastProvider";
import EditSectionModal from "./EditSectionModal";

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
  is_active: boolean;
  is_new?: boolean;
  is_unavailable?: boolean;
}

interface Props {
  sections: DailyMenuSection[];
}

export default function DailyMenuSectionsList({ sections }: Props) {
  const [sectionsList, setSectionsList] = useState(sections);
  const [editingSection, setEditingSection] = useState<DailyMenuSection | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar seção "${name}"? Seus pratos serão movidos para a seção geral.`)) return;
    try {
      await deleteDailyMenuSection(id);
      setSectionsList(sectionsList.filter(s => s.id !== id));
      toast(`"${name}" deletada com sucesso.`);
    } catch (error) {
      toast("Erro ao deletar seção.");
    }
  }

  async function handleDuplicate(section: DailyMenuSection) {
    try {
      const newSection = await duplicateDailyMenuSection(section.id);
      if (newSection) {
        setSectionsList([...sectionsList, newSection]);
        toast(`"${section.name}" duplicada com sucesso.`);
      }
    } catch (error) {
      toast("Erro ao duplicar seção.");
    }
  }

  async function handleToggleActive(id: string, current: boolean, name: string) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("isActive", (!current).toString());
      await updateDailyMenuSection(id, formData);
      setSectionsList(
        sectionsList.map(s =>
          s.id === id ? { ...s, isActive: !current } : s
        )
      );
      toast(current ? "Seção oculta." : "Seção visível.");
    } catch (error) {
      toast("Erro ao atualizar seção.");
    }
  }

  function handleDragStart(id: string) {
    setDraggedSection(id);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(targetId: string) {
    if (!draggedSection || draggedSection === targetId) return;

    const draggedIdx = sectionsList.findIndex(s => s.id === draggedSection);
    const targetIdx = sectionsList.findIndex(s => s.id === targetId);

    const newList = [...sectionsList];
    [newList[draggedIdx], newList[targetIdx]] = [newList[targetIdx], newList[draggedIdx]];

    setSectionsList(newList);
    
    const reorderData = newList.map((s, i) => ({ id: s.id, order: i }));
    try {
      await reorderDailyMenuSections(reorderData);
      toast("Seções reordenadas.");
    } catch (error) {
      toast("Erro ao reordenar seções.");
    }

    setDraggedSection(null);
  }

  return (
    <>
      {editingSection && (
        <EditSectionModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSuccess={(updated) => {
            setSectionsList(sectionsList.map(s => s.id === updated.id ? updated : s));
            setEditingSection(null);
          }}
        />
      )}

      <div className="space-y-2">
        {sectionsList.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhuma seção criada ainda.</p>
          </div>
        ) : (
          sectionsList.map((section) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(section.id)}
              className="border border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white"
            >
              <div className="flex items-center gap-3 p-4">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />

                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="flex-1 flex items-center gap-3 hover:bg-gray-50 -mx-4 px-4 py-4 rounded transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSection === section.id ? "" : "-rotate-90"
                    }`}
                  />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    <p className="text-xs text-gray-500">{section.items?.length || 0} pratos</p>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(section.id, section.isActive, section.name)}
                    title={section.isActive ? "Ocultar" : "Exibir"}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    {section.isActive ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDuplicate(section)}
                    title="Duplicar"
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </button>

                  <button
                    onClick={() => setEditingSection(section)}
                    title="Editar"
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-400 hover:text-orange-500" />
                  </button>

                  <button
                    onClick={() => handleDelete(section.id, section.name)}
                    title="Deletar"
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </div>

              {expandedSection === section.id && section.items && section.items.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:border-orange-300">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.is_new && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Novidade</span>}
                        {item.is_unavailable && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Indisponível</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
