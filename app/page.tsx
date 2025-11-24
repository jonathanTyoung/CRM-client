import { cookies } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (access) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-semibold">Welcome back 👋</h1>
        <p className="mt-2 text-zinc-600">You are logged in to the CRM.</p>

        <div className="mt-6 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-600 px-5 py-2 text-white"
          >
            Go to Dashboard
          </Link>

          <form action="/api/logout" method="post">
            <button className="rounded-md border px-5 py-2">Logout</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold">The Gomes Agency CRM</h1>

      <p className="mt-3 max-w-md text-center text-lg text-zinc-600">
        Manage your contacts, leads, and deals effortlessly.
      </p>

      <div className="mt-8 flex gap-4">
        <Link href="/login" className="rounded-md bg-blue-600 px-5 py-2 text-white">
          Login
        </Link>

        <Link href="/register" className="rounded-md border px-5 py-2">
          Register
        </Link>
      </div>
    </main>
  );
}
