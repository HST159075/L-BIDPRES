"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { User, UserRole } from "@/types"; 
import { ROUTES } from "@/config/constants";

export default function CallbackPage() {
  const router = useRouter();
  const { setUser, setInitialized } = useAuthStore();
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const handleCallback = async () => {
      try {
        const session = await authClient.getSession();

        if (session?.data?.user) {
          const raw = session.data.user;
          const mappedUser: User = {
            id: raw.id,
            name: raw.name ?? "Unknown",
            email: raw.email ?? "",
            phone: (raw as typeof raw & { phone?: string }).phone ?? null,
            emailVerified: !!raw.emailVerified,
            phoneVerified: !!(raw as typeof raw & { phoneVerified?: boolean }).phoneVerified,
            role: ((raw as typeof raw & { role?: UserRole }).role) ?? "buyer",
            avatar: raw.image ?? null,
            purchaseCount: Number((raw as typeof raw & { purchaseCount?: number }).purchaseCount ?? 0),
            strikeCount: Number((raw as typeof raw & { strikeCount?: number }).strikeCount ?? 0),
            isBanned: Boolean((raw as typeof raw & { isBanned?: boolean }).isBanned),
            createdAt: raw.createdAt instanceof Date 
              ? raw.createdAt.toISOString() 
              : String(raw.createdAt ?? new Date().toISOString()),
          };

          setUser(mappedUser);
          setInitialized(true);

          // রোল অনুযায়ী রিডাইরেক্ট
          const redirects: Record<UserRole, string> = {
            admin: ROUTES.adminDashboard,
            seller: ROUTES.sellerDashboard,
            buyer: ROUTES.buyerDashboard,
          };

          router.replace(redirects[mappedUser.role] || ROUTES.buyerDashboard);
        } else {
          router.replace(`${ROUTES.login}?error=no_session`);
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.replace(`${ROUTES.login}?error=callback_failed`);
      }
    };

    handleCallback();
  }, [router, setUser, setInitialized]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--color-muted-foreground)] font-medium">
          আপনার প্রোফাইল প্রস্তুত হচ্ছে...
        </p>
      </div>
    </div>
  );
}