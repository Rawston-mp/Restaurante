import { redirect } from "next/navigation";
import { getSession } from "@/actions/actions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — oculto em mobile, visível em md+ */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Nav mobile */}
          <nav className="flex md:hidden gap-1 overflow-x-auto">
            <a href="/admin" className="text-xs font-medium text-gray-600 hover:text-orange-500 px-2 py-1 rounded-lg hover:bg-orange-50 whitespace-nowrap transition-colors">Dashboard</a>
            <a href="/admin/cardapio" className="text-xs font-medium text-gray-600 hover:text-orange-500 px-2 py-1 rounded-lg hover:bg-orange-50 whitespace-nowrap transition-colors">Cardápio</a>
            <a href="/admin/fotos" className="text-xs font-medium text-gray-600 hover:text-orange-500 px-2 py-1 rounded-lg hover:bg-orange-50 whitespace-nowrap transition-colors">Fotos</a>
            <a href="/admin/configuracoes" className="text-xs font-medium text-gray-600 hover:text-orange-500 px-2 py-1 rounded-lg hover:bg-orange-50 whitespace-nowrap transition-colors">Config.</a>
            <a href="/admin/senha" className="text-xs font-medium text-gray-600 hover:text-orange-500 px-2 py-1 rounded-lg hover:bg-orange-50 whitespace-nowrap transition-colors">Senha</a>
          </nav>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="hidden sm:block text-sm text-gray-600 font-medium">{session.email}</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
