"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedClient({ children }) {
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/current_user", {
        cache: "no-store",
        credentials: "include",  // <-- REQUIRED
      });

      const data = await res.json();

      if (!data.authenticated) {
        router.replace("/login");
      }
    }

    verify();
  }, [router]);

  return <>{children}</>;
}
