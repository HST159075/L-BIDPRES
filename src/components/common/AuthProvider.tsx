"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import api, { loadStoredToken } from "@/lib/api";

const TOKEN_KEY = "bid_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setUser, setLoading, setInitialized } = useAuthStore();

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (isInitialized) return;

    const bootstrapAuth = async () => {
      setLoading(true);

      try {
        loadStoredToken();

          try {
            const user = await authService.getMe();
            
            // Middleware-er jonno role cookie sync kora
            const { setAuthToken } = await import("@/lib/api");
            const token = localStorage.getItem("bid_auth_token");
            
            // Jodi token thake tobe full sync, na thakle sudhu role set kora
            if (token) {
              setAuthToken(token, user.role);
            } else {
              // Google login-er jonno sudhu role cookie set kora
              import("js-cookie").then((Cookies) => {
                Cookies.default.set("user-role", user.role, { expires: 7, path: '/' });
              });
            }

            setUser(user);
          } catch (err) {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    bootstrapAuth();
  }, [isInitialized, setUser, setLoading, setInitialized, pathname]);

  return <>{children}</>;
}
