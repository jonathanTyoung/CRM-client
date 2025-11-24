"use client";

import { createContext, useContext, ReactNode } from "react";

interface AuthContextValue {
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const logout = () => {
    // use logout route handler
    fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
