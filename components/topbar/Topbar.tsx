"use client";

import { usePathname } from "next/navigation";
import SidebarLogoutButton from "../sidebar/SidebarLogoutButton";

export default function Topbar({ user }: { user: any }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = segments[segments.length - 1] || "Dashboard";

  return (
    <header className="h-16 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between px-6">
      
      {/* Title */}
      <h1 className="capitalize text-lg font-semibold dark:text-white">
        {pageTitle.replace("-", " ")}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          {user.username}
        </span>

        {/* REUSABLE LOGOUT BUTTON */}
        <SidebarLogoutButton />
      </div>
    </header>
  );
}
