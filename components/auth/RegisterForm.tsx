"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      console.error(err);
      setError("Unable to register. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 max-w-sm mx-auto mt-28 bg-gray-900/80 rounded-xl border border-white/10"
    >
      <h1 className="text-2xl font-bold">Register</h1>
      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          className="p-2 rounded bg-gray-800 border border-gray-700"
          placeholder={key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          name={key}
          value={value}
          onChange={handleChange}
          type={key === "password" ? "password" : "text"}
        />
      ))}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 p-2 rounded font-medium"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
