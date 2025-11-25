"use client";

import { AuthProvider } from "../../context/AuthContext";
import Navbar from "../navbar/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-12 pb-10 mx-auto w-full max-w-6xl">
        {children}
      </main>
    </AuthProvider>
  );
}
