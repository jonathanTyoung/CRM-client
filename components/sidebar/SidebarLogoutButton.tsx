"use client";

export default function SidebarLogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
      }}
      className="text-red-500 hover:underline text-sm"
    >
      Logout
    </button>
  );
}
