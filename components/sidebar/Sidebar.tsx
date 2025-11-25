"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contacts", label: "Contacts" },
  { href: "/leads", label: "Leads" },
  { href: "/opportunities", label: "Opportunities" },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // NEW LOGOUT HANDLER
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 p-4 border-r dark:border-zinc-800">
      <h2 className="text-xl font-bold mb-6">The Gomes Agency</h2>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-3 py-2 rounded text-sm font-medium transition",
              isActive(item.href)
                ? "bg-blue-600 text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500 mb-2">
          Logged in as <span className="font-medium">{user.username}</span>
        </p>

        <button
          onClick={handleLogout}
          className="w-full text-left text-red-500 hover:underline text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
