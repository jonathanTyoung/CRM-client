"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarLinks } from "./sidebar-links";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  // ⛔ Null-safe loading state
  if (!user) {
    return (
      <aside className="w-64 p-4 border-r dark:border-zinc-800 animate-pulse">
        <div className="h-5 bg-zinc-300 dark:bg-zinc-700 rounded w-32 mb-6"></div>
        <div className="space-y-3">
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // ⭐ Recursive Renderer for Children + Grandchildren
  // -------------------------------------------------------------
  const renderChildren = (children: any[], level = 1) => {
    return (
      <div className={`ml-${level * 4} mt-1 flex flex-col gap-1`}>
        {children.map((child) => {
          const hasNested = Array.isArray(child.children);
          const isChildOpen =
            open[child.href] ?? pathname.startsWith(child.href);

          if (hasNested) {
            return (
              <div key={child.href}>
                <button
                  onClick={() =>
                    setOpen((prev) => ({
                      ...prev,
                      [child.href]: !prev[child.href],
                    }))
                  }
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded text-sm transition",
                    isActive(child.href)
                      ? "bg-blue-600 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  )}
                >
                  <span>{child.label}</span>
                  {isChildOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isChildOpen && renderChildren(child.children, level + 1)}
              </div>
            );
          }

          // Regular child link
          return (
            <Link
              key={child.href}
              href={child.href}
              className={clsx(
                "px-3 py-1.5 rounded text-sm transition",
                pathname === child.href
                  ? "bg-blue-500 text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              )}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    );
  };

  // -------------------------------------------------------------
  // ⭐ MAIN SIDEBAR WITH COLLAPSE BUTTON
  // -------------------------------------------------------------
  return (
    <aside
      className={clsx(
        "border-r dark:border-zinc-800 flex flex-col transition-all duration-300",
        collapsed ? "w-16 p-2" : "w-64 p-4"
      )}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold whitespace-nowrap">
            The Gomes Agency
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-6 flex-1 overflow-auto">
        {sidebarLinks.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <h3 className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-1 tracking-wide">
                {section.section}
              </h3>
            )}

            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const hasChildren = Array.isArray(item.children);

                // Logout button
                if (item.isLogout) {
                  return (
                    <button
                      key={item.label}
                      onClick={handleLogout}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded text-sm font-medium text-red-500 transition",
                        collapsed && "px-2 text-center"
                      )}
                    >
                      {collapsed ? "🚪" : "Logout"}
                    </button>
                  );
                }

                // Simple link (no children)
                if (!hasChildren) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "px-3 py-2 rounded text-sm font-medium transition",
                        isActive(item.href)
                          ? "bg-blue-600 text-white"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800",
                        collapsed && "text-center px-0"
                      )}
                    >
                      {collapsed ? item.label[0] : item.label}
                    </Link>
                  );
                }

                // Collapsible parent
                const isOpen = open[item.href] ?? isActive(item.href);

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
                        "w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition",
                        isActive(item.href)
                          ? "bg-blue-600 text-white"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      {collapsed ? item.label[0] : item.label}

                      {!collapsed &&
                        (isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                    </button>

                    {!collapsed && isOpen && renderChildren(item.children)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      {!collapsed && (
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          Logged in as{" "}
          <span className="font-medium">
            {user.email || user.first_name || "Agent"}
          </span>
        </div>
      )}
    </aside>
  );
}
