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
  Clock,
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
    getMyListingsAction(1, 20)
      .then((res) => setListings((res.data as { data: Listing[] }).data || []))
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

  const active = listings.filter((l) => l.auction?.status === "live").length;
  const total = listings.length;
  const ended = listings.filter((l) => l.auction?.status === "ended").length;

  const stats = [
    {
      label: "Total Listings",
      value: total,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Live Auctions",
      value: active,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Ended Auctions",
      value: ended,
      icon: BarChart3,
      color: "text-amber-500",
    },
    { label: "Total Revenue", value: "৳0", icon: Gavel, color: "text-bid-500" },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal className="mt-8 mb-8 flex items-start justify-between">
            <div>
              <p className="text-[var(--color-muted-foreground)] text-sm">
                Seller Panel
              </p>
              <h1 className="text-3xl font-bold mt-1">{user?.name}</h1>
            </div>
            <Link
              href={ROUTES.sellerNewListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </ScrollReveal>

          {/* Stats */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-muted)] ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Listings */}
          <ScrollReveal>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Your Listings</h2>
                <Link
                  href={ROUTES.sellerListings}
                  className="flex items-center gap-1 text-sm text-[var(--color-bid-500)] hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-[var(--color-muted)] rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-[var(--color-muted-foreground)]">
                    No listings yet
                  </p>
                  <Link
                    href={ROUTES.sellerNewListing}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create First Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.slice(0, 5).map((listing, i) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-[var(--color-muted)]/30 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-bid-500)]/30 transition-colors"
                    >
                      {/* Photo */}
                      {listing.photos?.[0] && (
                        <img
                          src={listing.photos[0]}
                          alt={listing.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {listing.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              listing.auction?.status === "live"
                                ? "bg-green-500/10 text-green-600"
                                : listing.auction?.status === "scheduled"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                            }`}
                          >
                            {listing.auction?.status || listing.status}
                          </span>
                          {listing.auction?.currentPrice && (
                            <span className="text-xs text-[var(--color-muted-foreground)]">
                              Current:{" "}
                              {formatPriceEn(
                                Number(listing.auction.currentPrice),
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/seller/listings/${listing.id}/edit`}
                        className="shrink-0 px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] transition-colors"
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
