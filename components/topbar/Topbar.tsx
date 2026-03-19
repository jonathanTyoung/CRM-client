"use client";

import { usePathname } from "next/navigation";
import SidebarLogoutButton from "../sidebar/SidebarLogoutButton";

export default function Topbar({ user }: { user: any }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const meaningful = segments.filter((s) => !/^\d+$/.test(s));
  const pageTitle = meaningful[meaningful.length - 1] || "Dashboard";

  // ---------------------------------------------------------
  // ⭐ Null-safe loading state
  // When user hasn't loaded yet (SSR), show a placeholder.
  // ---------------------------------------------------------
  if (!user) {
    return (
      <header className="h-16 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between px-6 animate-pulse">
        <h1 className="text-lg font-semibold text-zinc-400 dark:text-zinc-600">
          Loading…
        </h1>

        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </header>
    );
  }

  // ---------------------------------------------------------
  // ⭐ Real Topbar once user is available
  // ---------------------------------------------------------
  return (
    <header className="h-16 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between px-6">
      
      {/* Title */}
      <h1 className="capitalize text-lg font-semibold dark:text-white">
        {pageTitle.replace("-", " ")}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          {user.first_name || user.username || user.email}
        </span>

        <SidebarLogoutButton />
      </div>
    </header>
  );
}
