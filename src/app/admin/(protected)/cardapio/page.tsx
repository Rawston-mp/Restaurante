import {
  getMenuItems,
  getCategories,
} from "@/actions/actions";
import MenuItemsTable from "@/components/admin/MenuItemsTable";
import MenuItemCreateForm from "@/components/admin/MenuItemCreateForm";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCardapioPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Gerenciar Cardápio</h1>
        <p className="text-gray-500 mt-1">Adicione, edite ou remova pratos do cardápio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulários à esquerda */}
        <div className="lg:col-span-1 space-y-4">
          <CategoryManager categories={categories} />
          <MenuItemCreateForm categories={categories} />
        </div>

        {/* Tabela à direita */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Todos os Pratos ({items.length})</h2>
          </div>
          <MenuItemsTable items={items} categories={categories} />
        </div>
      </div>
    </div>
  );
}
