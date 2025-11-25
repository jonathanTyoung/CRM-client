// "use client";

// import { createContext, useContext, ReactNode, useTransition } from "react";

// interface AuthContextValue {
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isPending, startTransition] = useTransition();

//   const logout = () => {
//     startTransition(async () => {
//       await fetch("/api/logout", { method: "POST" });
//       window.location.href = "/login";
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ logout, loading: isPending }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuthContext() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuthContext must be used within AuthProvider");
//   }
//   return ctx;
// }
