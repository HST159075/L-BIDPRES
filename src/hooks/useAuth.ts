"use client";

import { useEffect } from "react";
import { useRouter }  from "next/navigation";
import { useAuthStore, selectIsAdmin, selectIsSeller } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { ROUTES }      from "@/config/constants";
import type { UserRole } from "@/types";

export function useAuth() {
  const { user, isLoading, isInitialized, setUser, setLoading, setInitialized, logout } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;
    setLoading(true);
    authService.getMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => { setLoading(false); setInitialized(true); });
  }, [isInitialized, setUser, setLoading, setInitialized]);

  const isLoggedIn = !!user;
  const isAdmin    = useAuthStore(selectIsAdmin);
  const isSeller   = useAuthStore(selectIsSeller);

  return { user, isLoggedIn, isLoading, isAdmin, isSeller, logout };
}

/** Redirect if not authenticated */
export function useRequireAuth(role?: UserRole) {
  const router = useRouter();
  const { user, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    if (!user) { router.replace(ROUTES.login); return; }
    if (role === "seller" && user.role !== "seller" && user.role !== "admin") {
      router.replace(ROUTES.home);
    }
    if (role === "admin" && user.role !== "admin") {
      router.replace(ROUTES.home);
    }
  }, [user, isLoading, isInitialized, role, router]);

  return { user, isLoading };
}
