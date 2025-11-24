import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    redirect("/login");
  }

  return (
    <main>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-lg">You are logged in to your CRM dashboard.</p>
    </main>
  );
}
