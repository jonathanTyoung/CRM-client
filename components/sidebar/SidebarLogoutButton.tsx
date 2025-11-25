"use client";

export function LogoutButton() {
  const onLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={onLogout}
      className="w-full text-left text-red-500 hover:underline text-sm"
    >
      Logout
    </button>
  );
}
