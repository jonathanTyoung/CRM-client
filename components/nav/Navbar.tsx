"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-black/80 text-white fixed w-full top-0 border-b border-white/10 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg tracking-tight">CRM Dashboard</span>
        <span className="text-xs uppercase text-gray-400">MVP</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/">Home</Link>
        <Link href="/contacts">Contacts</Link>
        <Link href="/leads">Leads</Link>
        <Link href="/opportunities">Business Tracker</Link>
        {user ? (
          <>
            <span className="text-gray-400 hidden sm:inline">
              {user.username ?? `User #${user.user_id}`}
            </span>
            <button
              onClick={logout}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-xs"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link href="/register" className="text-gray-300 hover:text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
