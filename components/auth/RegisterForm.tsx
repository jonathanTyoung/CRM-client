"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Registration failed. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        name="first_name"
        placeholder="First name"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="last_name"
        placeholder="Last name"
        className="w-full border px-3 py-2 rounded"
        required
      />

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
        Register
      </button>
    </form>
  );
}
