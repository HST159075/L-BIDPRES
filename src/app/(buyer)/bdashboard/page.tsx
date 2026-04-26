"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gavel,
  ShoppingBag,
  TrendingUp,
  Bell,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useRequireAuth } from "@/hooks/useAuth";
import { bidService } from "@/services/bid.service";
import { paymentService } from "@/services/payment.service";
import { showError } from "@/lib/error-handler";
import { formatPriceEn, formatTimeAgo } from "@/lib/utils";
import { ROUTES } from "@/config/constants";
import { useRouter } from "next/navigation";

interface Bid {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  auction?: { listing?: { title?: string } };
}

export default function BuyerDashboardPage() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [payingBidId, setPayingBidId] = useState<string | null>(null);

  // ✅ একটাই useEffect
  useEffect(() => {
    bidService
      .getMyBids()
      .then((res) => {
        const list = res.data?.data ?? [];
        setBids(Array.isArray(list) ? list : []);
      })
      .catch(() => setBids([]))
      .finally(() => setBidsLoading(false));
  }, []);

 const handlePayment = async (bidId: string, gateway: "sslcommerz" | "bkash") => {
  setPayingBidId(bidId);
  try {
    const res = await paymentService.initiate({ bidId, gateway });
    const { paymentUrl } = res.data.data;
    router.push(paymentUrl);
  } catch (err) {
    showError(err);
  } finally {
    setPayingBidId(null);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Bids",
      value: bids.length,
      icon: Gavel,
      color: "text-bid-500",
    },
    {
      label: "Purchases",
      value: user?.purchaseCount || 0,
      icon: ShoppingBag,
      color: "text-green-500",
    },
    {
      label: "Active Bids",
      value: bids.filter((b) => b.status === "active").length,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      label: "Strikes",
      value: user?.strikeCount || 0,
      icon: Bell,
      color: "text-red-500",
    },
  ];

  const canApplyForSeller =
    (user?.purchaseCount || 0) >= 5 && user?.role === "buyer";

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mt-8 mb-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Welcome back</p>
                <h1 className="text-3xl font-bold mt-1">{user?.name}</h1>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-bid-500/10 text-bid-500 capitalize">
                  {user?.role}
                </span>
              </div>
              {canApplyForSeller && (
                <Link
                  href={ROUTES.sellerApply}
                  className="flex items-center gap-2 px-4 py-2.5 bg-bid-500 text-white text-sm font-semibold rounded-xl hover:bg-bid-600 transition-colors"
                >
                  Become a Seller <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-muted ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {user?.role === "buyer" && (
            <ScrollReveal className="mb-10">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Seller Progress</h2>
                  <span className="text-sm text-muted-foreground">
                    {user.purchaseCount}/5 purchases
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((user.purchaseCount / 5) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-bid-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {user.purchaseCount >= 5
                    ? "You can now apply for a seller account!"
                    : `${5 - user.purchaseCount} more purchase(s) to unlock seller.`}
                </p>
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg">Recent Bids</h2>
                <Link
                  href={ROUTES.buyerBids}
                  className="text-sm text-bid-500 hover:underline"
                >
                  View all
                </Link>
              </div>
              {bidsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : bids.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Gavel className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No bids yet</p>
                  <Link
                    href={ROUTES.auctions}
                    className="text-sm text-bid-500 hover:underline mt-1 block"
                  >
                    Browse auctions
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bids.slice(0, 5).map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          bid.status === "active"
                            ? "bg-green-500"
                            : bid.status === "won"
                              ? "bg-blue-500"
                              : bid.status === "outbid"
                                ? "bg-red-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {bid.auction?.listing?.title || "Auction"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {formatTimeAgo(bid.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm">
                          {formatPriceEn(bid.amount)}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {bid.status}
                        </p>
                        {/* ✅ Won হলে Pay Now */}
                        {bid.status === "won" && (
  <div className="mt-1 flex gap-1">
    <button
      onClick={() => handlePayment(bid.id, "sslcommerz")}
      disabled={payingBidId === bid.id}
      className="px-2 py-1 bg-bid-500 hover:bg-bid-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
    >
      {payingBidId === bid.id ? "..." : "SSLCommerz"}
    </button>
    <button
      onClick={() => handlePayment(bid.id, "bkash")}
      disabled={payingBidId === bid.id}
      className="px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
    >
      {payingBidId === bid.id ? "..." : "bKash"}
    </button>
  </div>
)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
