"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { handleLogin } from "./handleLogin";

export default function LoginForm() {
  const [error, setError] = useState("");
  const { pending } = useFormStatus();

  return (
    <form
      action={async (formData) => {
        const result = await handleLogin(formData);

        if (result?.error) {
          setError(result.error);
        }
      }}
      className="flex flex-col gap-4 w-80"
    >
      <h1 className="text-2xl font-semibold">Login</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 rounded"
        required
      />

      <button disabled={pending} className="btn-primary">
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
