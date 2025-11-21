"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import jwtDecode, { JwtPayload } from "jwt-decode";
import api, { TokenBundle } from "../lib/api";

interface DecodedToken extends JwtPayload {
  user_id?: number;
  username?: string;
}

interface AuthContextValue {
  user: DecodedToken | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("crm_token");
    if (!raw) return;

    try {
      const tokenData: TokenBundle = JSON.parse(raw);
      if (tokenData?.access) {
        const decoded = jwtDecode<DecodedToken>(tokenData.access);
        setUser(decoded);
      }
    } catch (e) {
      console.warn("Error decoding stored token:", e);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Your Django custom login endpoint: /api/login/
    const res = await api.post<TokenBundle & { user: unknown }>("/api/login/", {
      username,
      password,
    });

    if (typeof window !== "undefined") {
      window.localStorage.setItem("crm_token", JSON.stringify({
        access: res.data.access,
        refresh: res.data.refresh,
      }));
    }

    const decoded = jwtDecode<DecodedToken>(res.data.access);
    setUser(decoded);
    router.push("/");
  };

  const register = async (data: RegisterPayload) => {
    await api.post("/api/register/", data);
    await login(data.username, data.password);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("crm_token");
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
