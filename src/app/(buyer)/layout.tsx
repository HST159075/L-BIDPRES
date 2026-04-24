"use client";

import { useEffect }    from "react";
import { useRouter }    from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROUTES }       from "@/config/constants";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const router              = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) router.replace(`${ROUTES.login}?from=/dashboard`);
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
