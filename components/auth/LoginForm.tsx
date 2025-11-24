"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
