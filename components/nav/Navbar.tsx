"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-black border-b flex items-center px-4 sm:px-6 justify-between z-50 shadow-sm">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="sm:hidden p-2 text-gray-700 dark:text-gray-300"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <span className="font-semibold text-lg tracking-tight">
            CRM Dashboard
          </span>
          <span className="text-xs uppercase text-gray-400">MVP</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/contacts">Contacts</Link>
          <Link href="/leads">Leads</Link>

          {/* Business Tracker Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              Business Tracker
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-md shadow-lg border p-2 flex flex-col z-50">
                <Link
                  href="/opportunities"
                  className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                >
                  Current Opportunities
                </Link>
                <Link
                  href="/opportunities/new"
                  className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                >
                  Create New Opportunity
                </Link>
              </div>
            )}
          </div>

          {/* User Auth */}
          {user ? (
            <>
              <span className="text-gray-400">{user.username}</span>
              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-xs text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-black z-50 transform transition-transform duration-300 sm:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="font-semibold">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-700 dark:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-col px-4 py-4 space-y-3 text-base">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/contacts" onClick={() => setMobileOpen(false)}>
            Contacts
          </Link>
          <Link href="/leads" onClick={() => setMobileOpen(false)}>
            Leads
          </Link>

          {/* Dropdown inside mobile */}
          <div className="flex flex-col">
            <button
              className="flex items-center justify-between px-2 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Business Tracker</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="mt-1 ml-2 flex flex-col gap-2">
                <Link
                  href="/opportunities"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Current Opportunities
                </Link>
                <Link
                  href="/opportunities/new"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Create New Opportunity
                </Link>
              </div>
            )}
          </div>

          {/* Auth buttons */}
          {user ? (
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="mt-4 bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-blue-600 text-white px-3 py-2 rounded-md text-sm text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
