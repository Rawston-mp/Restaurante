import { getAllSettings } from "@/actions/actions";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminConfiguracoesPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Edite as informações de contato, horários e localização</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
