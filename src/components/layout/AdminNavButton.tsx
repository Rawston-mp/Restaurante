"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { isUserLoggedIn } from "@/actions/actions";

export default function AdminNavButton({ initiallyLoggedIn = false }: { initiallyLoggedIn?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initiallyLoggedIn);
  const [isLoading, setIsLoading] = useState(!initiallyLoggedIn);

  useEffect(() => {
    if (initiallyLoggedIn) {
      return;
    }

    const checkSession = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setIsLoggedIn(loggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [initiallyLoggedIn]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 text-gray-700 font-medium text-sm hover:from-red-100 hover:to-orange-100 transition-all group"
      title="Área administrativa"
    >
      <Settings className="w-4 h-4 group-hover:text-orange-600 transition-colors" />
      <span className="hidden sm:inline group-hover:text-orange-600 transition-colors">
        Admin
      </span>
    </Link>
  );
}
