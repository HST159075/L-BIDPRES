"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";

const TOKEN_KEY = "bid_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setUser, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;
    setLoading(true);
    // Read token directly from localStorage
    let token: string | null = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
    } catch {
      token = null;
    }
    if (!token) {
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    // Set token in axios headers before getMe call
    import("@/lib/api").then(({ default: api }) => {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      authService
        .getMe()
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          // Token invalid — clear it
          setUser(null);
          try {
            localStorage.removeItem(TOKEN_KEY);
          } catch {}
          delete api.defaults.headers.common["Authorization"];
        })
        .finally(() => {
          setLoading(false);
          setInitialized(true);
        });
    });
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
