"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/config/constants";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    if (!user) {
      router.replace(ROUTES.login);
      return;
    }
    // ✅ sapply page-এ থাকলে redirect করবে না
    if (pathname === "/sapply") return;
    
    if (user.role !== "seller" && user.role !== "admin") {
      router.replace(ROUTES.sellerApply);
    }
  }, [user, isInitialized, isLoading, router, pathname]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ sapply page সবার জন্য দেখাবে
  if (pathname === "/sapply") return <>{children}</>;

  if (!user || (user.role !== "seller" && user.role !== "admin")) return null;
  return <>{children}</>;
}