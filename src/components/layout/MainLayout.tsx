"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Utensils } from "lucide-react";
import AdminNavButton from "./AdminNavButton";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cardápio", href: "/cardapio" },
  { label: "Fotos", href: "/fotos" },
  { label: "Horários", href: "/horarios" },
];

export default function MainLayout({
  children,
  isLoggedIn = false,
}: {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-red-600 font-bold text-xl hover:text-orange-500 transition-colors"
            >
              <Utensils className="w-6 h-6" />
              <span>Meu Restaurante</span>
            </Link>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-full text-gray-700 font-medium hover:text-orange-500 hover:bg-purple-50 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <li className="ml-2 pl-2 border-l border-purple-200">
                  <AdminNavButton initiallyLoggedIn={true} />
                </li>
              )}
            </ul>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md text-red-600 hover:bg-purple-50 transition-colors"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 border-t border-purple-100 mt-1">
              <ul className="flex flex-col gap-1 pt-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-gray-700 font-medium hover:text-orange-500 hover:bg-purple-50 transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {isLoggedIn && (
                  <li className="pt-2 mt-2 border-t border-purple-100">
                    <AdminNavButton initiallyLoggedIn={true} />
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-purple-50 border-t border-purple-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-red-600">
              <Utensils className="w-5 h-5" />
              <span className="font-bold text-lg">Meu Restaurante</span>
            </div>

            <div className="flex gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/admin"
              className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
              aria-label="Área administrativa"
            >
              Admin
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-100 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Meu Restaurante. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
