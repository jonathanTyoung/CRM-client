"use client";

import { User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center justify-end px-6 shadow-sm">
      {user && (
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <User size={18} />
            {user.username}
          </div>

          <button
            onClick={logout}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            <LogOut size={16} />
          </button>

        </div>
      )}
    </header>
  );
}
