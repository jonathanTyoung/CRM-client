"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      setError("Invalid login");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-80">
      <h1 className="text-2xl font-semibold">Login</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="border px-3 py-2 rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}
