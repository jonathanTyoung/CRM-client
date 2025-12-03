"use client";

export default function SidebarLogoutButton() {
  async function handleLogout() {
    // Call logout route
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    // Client redirect
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded text-sm font-medium text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
    >
      Logout
    </button>
  );
}
