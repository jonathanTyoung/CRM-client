"use client";

export default function LoginForm() {
  return (
    <form
      method="POST"
      action="/internal/login"
      className="flex flex-col gap-4 w-80"
    >
      <h1 className="text-2xl font-semibold">Login</h1>

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

      <button className="btn-primary">Login</button>
    </form>
  );
}
