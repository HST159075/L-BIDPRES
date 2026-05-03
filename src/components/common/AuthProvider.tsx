"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import api, { loadStoredToken } from "@/lib/api";

const TOKEN_KEY = "bid_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setUser, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    // Jodi agei initialize hoye thake, tobe r fetch korar dorkar nai
    if (isInitialized) return;

    const bootstrapAuth = async () => {
      setLoading(true);

      try {
        // 1. Storage theke token load kora ebong axios-e set kora
        loadStoredToken();

        // 2. User profile fetch kora (HttpOnly cookie thakle eta kaaj korbe)
        try {
          const user = await authService.getMe();
          setUser(user);
        } catch (err) {
          // Profile fetch fail hole user null set kora
          setUser(null);
        }

      } catch (error) {
        // 3. Token invalid hole shob clear kora
        console.error("Auth initialization failed:", error);
        setUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
          delete api.defaults.headers.common["Authorization"];
        } catch (e) {
          // localStorage access error handle
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    bootstrapAuth();
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
