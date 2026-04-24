"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { loadStoredToken } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setUser, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;

    // Load token first before any API call
    const token = loadStoredToken();

    setLoading(true);

    if (!token) {
      // No token — skip getMe call
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    authService
      .getMe()
      .then((user) => setUser(user))
      .catch(() => {
        setUser(null);
        // Clear invalid token
        import("@/lib/api").then((m) => m.setAuthToken(null));
      })
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
