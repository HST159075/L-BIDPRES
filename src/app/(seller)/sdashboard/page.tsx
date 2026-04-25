"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Gavel,
  Plus,
  BarChart3,
  Package,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useRequireAuth } from "@/hooks/useAuth";
import { getMyListingsAction } from "@/actions/seller.actions";
import { formatPriceEn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";

interface Listing {
  id: string;
  title: string;
  status: string;
  photos: string[];
  auction?: { currentPrice: number; status: string; endTime: string };
}

export default function SellerDashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth("seller");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyListingsAction(1, 50)
      .then((res) => {
        // API response থেকে সঠিকভাবে array extract করা
        const rawData = res.data?.data || res.data || [];
        setListings(Array.isArray(rawData) ? rawData : []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Stats Calculation
  const activeCount = listings.filter((l) => l.auction?.status === "live").length;
  const totalCount = listings.length;
  const endedCount = listings.filter((l) => l.auction?.status === "ended").length;
  
  // ক্যালকুলেটেড রেভিনিউ (যদি ইনভয়েস বা সোল্ড ডেটা থাকে, নাহলে ডিফল্ট ০)
  const totalRevenue = 0; 

  const stats = [
    {
      label: "Total Listings",
      value: totalCount,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Live Auctions",
      value: activeCount,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Ended Auctions",
      value: endedCount,
      icon: BarChart3,
      color: "text-amber-500",
    },
    { 
      label: "Total Revenue", 
      value: formatPriceEn(totalRevenue), 
      icon: Gavel, 
      color: "text-[var(--color-bid-500)]" 
    },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal className="mt-8 mb-8 flex items-start justify-between">
            <div>
              <p className="text-[var(--color-muted-foreground)] text-sm font-medium">
                Seller Control Center
              </p>
              <h1 className="text-3xl font-bold mt-1 text-[var(--color-foreground)]">
                Welcome, {user?.name.split(' ')[0]}!
              </h1>
            </div>
            <Link
              href={ROUTES.sellerNewListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </ScrollReveal>

          {/* Stats Grid */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-muted)] ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-foreground)]">{stat.value}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Recent Listings Section */}
          <ScrollReveal>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-[var(--color-foreground)]">Recent Activity</h2>
                <Link
                  href={ROUTES.sellerListings}
                  className="flex items-center gap-1 text-sm font-semibold text-[var(--color-bid-500)] hover:text-[var(--color-bid-600)] transition-colors"
                >
                  Manage all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-[var(--color-muted)] rounded-xl animate-pulse opacity-50"
                    />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[var(--color-border)] rounded-2xl">
                  <Gavel className="w-12 h-12 mx-auto mb-3 text-[var(--color-muted-foreground)] opacity-20" />
                  <p className="font-medium text-[var(--color-muted-foreground)]">
                    You havent listed any items yet
                  </p>
                  <Link
                    href={ROUTES.sellerNewListing}
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Start Selling
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {listings.slice(0, 5).map((listing, i) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-bid-500)]/30 transition-all group"
                    >
                      {listing.photos?.[0] ? (
                        <img
                          src={listing.photos[0]}
                          alt={listing.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[var(--color-muted)] flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-[var(--color-muted-foreground)] opacity-20" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--color-foreground)] truncate group-hover:text-[var(--color-bid-500)] transition-colors">
                          {listing.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
                              listing.auction?.status === "live"
                                ? "bg-green-500/10 text-green-500"
                                : listing.auction?.status === "scheduled"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                            }`}
                          >
                            {listing.auction?.status || listing.status}
                          </span>
                          {listing.auction?.currentPrice && (
                            <span className="text-xs font-semibold text-[var(--color-foreground)]">
                              {formatPriceEn(Number(listing.auction.currentPrice))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ✅ Path Fixed: slistings/[id]/edit */}
                      <Link
                        href={`/slistings/${listing.id}/edit`}
                        className="shrink-0 px-4 py-2 text-xs font-bold border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-all"
                      >
                        Edit
                      </Link>
                    </motion.div>
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