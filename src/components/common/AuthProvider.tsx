"use client";

import { useEffect }   from "react";
import { useAuthStore } from "@/store/authStore";
import { authService }  from "@/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setUser, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;
    setLoading(true);
    authService.getMe()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [isInitialized, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}
