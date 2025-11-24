"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

import {
  Menu,
  X,
  Home,
  Users,
  PhoneCall,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  Workflow,
  Mail,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false); // Business Tracker
  const [collapsed, setCollapsed] = useState(false); // COLLAPSE STATE

  const isActive = (path: string) =>
    pathname.startsWith(path)
      ? "bg-blue-100 text-blue-700 dark:bg-zinc-700 dark:text-white"
      : "text-gray-700 dark:text-gray-300";

  const mainNav = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Contacts", href: "/contacts", icon: Users },
    { label: "Leads", href: "/leads", icon: PhoneCall },
  ];

  const btNav = [
    { label: "Current Opportunities", href: "/opportunities" },
    { label: "Create Opportunity", href: "/opportunities/new" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">

      {/* TOP SECTION */}
      <div className={`px-6 mb-6 flex items-center justify-between ${collapsed ? "px-4" : ""}`}>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-semibold whitespace-nowrap">
              CRM Dashboard
            </h1>
            <p className="text-xs uppercase text-gray-400">MVP</p>
          </div>
        )}

        {/* Collapse Button (Desktop Only) */}
        <button
          className="hidden sm:flex p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* MAIN SECTION */}
      <div className="px-2">
        {!collapsed && (
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Main
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {mainNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition group relative ${isActive(
                href
              )}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />

              {/* Label Hidden In Collapsed Mode */}
              {!collapsed && <span>{label}</span>}

              {collapsed && (
                <span className="absolute left-14 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* OPPORTUNITIES SECTION */}
      <div className="mt-6">
        {!collapsed && (
          <p className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Opportunities
          </p>
        )}

        <button
          onClick={() => setBtOpen(!btOpen)}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex items-center gap-3">
            <Briefcase size={18} />
            {!collapsed && "Business Tracker"}
          </span>

          {!collapsed && (
            <ChevronDown
              size={16}
              className={`transition ${btOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {/* Submenu (only visible when expanded) */}
        {!collapsed && btOpen && (
          <div className="ml-10 mt-2 flex flex-col gap-1">
            {btNav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-md text-sm transition hover:bg-gray-200 dark:hover:bg-zinc-800 ${isActive(
                  href
                )}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* TOOLS SECTION */}
      {!collapsed && (
        <div className="px-2 mt-6">
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Tools
          </p>

          <Link
            href="/email"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <Mail size={18} />
            Email Marketing (future)
          </Link>

          <Link
            href="/automations"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <Workflow size={18} />
            Automations (future)
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      )}

      {/* LOGOUT (bottom) */}
      <div className="mt-auto px-4">
        {user && (
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-4 py-2 mb-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden sm:flex flex-col border-r h-screen bg-white dark:bg-zinc-900 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white dark:bg-black p-2 rounded-md border shadow"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r z-50 transform transition-transform duration-300 sm:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
