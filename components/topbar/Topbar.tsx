"use client";

import { usePathname } from "next/navigation";

export default function Topbar({ user }: { user: any }) {
  const pathname = usePathname();

  // Derive page title from pathname (optional)
  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = segments[segments.length - 1] || "Dashboard";

  return (
    <header className="h-16 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between px-6">
      {/* Page title or breadcrumbs */}
      <h1 className="capitalize text-lg font-semibold dark:text-white">
        {pageTitle.replace("-", " ")}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Optional search */}
        {/* <input className="hidden md:block px-3 py-1 rounded border text-sm" placeholder="Search..." /> */}

        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          {user.username}
        </span>

        <button
          onClick={() => {
            fetch("/api/logout", { method: "POST" }).then(
              () => (window.location.href = "/login")
            );
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
