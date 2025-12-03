import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { auth } from "../../lib/auth/auth";
import ProtectedClient from "./ProtectedClient";


export default async function DashboardLayout({ children }) {
  // SSR: get user (may be null briefly — that’s fine)
  const user = await auth.getUser();

  return (
    <ProtectedClient>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-zinc-900">
        
        {/* Sidebar and Topbar are null-safe */}
        <Sidebar user={user} />
        
        <div className="flex flex-col flex-1">
          <Topbar user={user} />
          <main className="p-6">{children}</main>
        </div>

      </div>
    </ProtectedClient>
  );
}
