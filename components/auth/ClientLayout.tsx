"use client";

import { AuthProvider } from "../../context/AuthContext";
import Navbar from "../nav/Navbar";



export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="pt-20 px-6 pb-10 max-w-6xl mx-auto">{children}</main>
    </AuthProvider>
  );
}
