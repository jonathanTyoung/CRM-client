"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Redirect after login
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-80 flex flex-col gap-5 rounded-xl border border-neutral-300 dark:border-neutral-700 p-6 shadow-sm bg-white dark:bg-neutral-900"
    >
      {/* <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Login
      </h1> */}

      {error && (
        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="border border-neutral-300 dark:border-neutral-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="border border-neutral-300 dark:border-neutral-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
