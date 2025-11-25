"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarLinks } from "./sidebar-links";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const [open, setOpen] = useState<Record<string, boolean>>({});

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 p-4 border-r dark:border-zinc-800 flex flex-col">
      <h2 className="text-xl font-bold mb-6">The Gomes Agency</h2>

      <nav className="flex flex-col gap-4 flex-1">
        {sidebarLinks.map((section, idx) => {
          // Hide Admin section for non-admins
          if (section.adminOnly && !user.is_admin) return null;

          return (
            <div key={idx}>
              {/* Section Title */}
              <h3 className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-2 tracking-wide">
                {section.section}
              </h3>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const hasChildren = Array.isArray(item.children);

                  // Special case: Logout
                  if (item.isLogout) {
                    return (
                      <button
                        key={item.href}
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded text-sm font-medium text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Logout
                      </button>
                    );
                  }

                  // Simple link
                  if (!hasChildren) {
                    return (
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
                    );
                  }

                  // Collapsible link group
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() =>
                          setOpen((prev) => ({
                            ...prev,
                            [item.href]: !prev[item.href],
                          }))
                        }
                        className={clsx(
                          "w-full text-left px-3 py-2 rounded text-sm font-medium transition",
                          isActive(item.href)
                            ? "bg-blue-600 text-white"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        )}
                      >
                        {item.label}
                      </button>

                      {open[item.href] && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={clsx(
                                "px-3 py-1.5 rounded text-sm transition",
                                isActive(child.href)
                                  ? "bg-blue-500 text-white"
                                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
        Logged in as <span className="font-medium">{user.username}</span>
      </div>
    </aside>
  );
}
