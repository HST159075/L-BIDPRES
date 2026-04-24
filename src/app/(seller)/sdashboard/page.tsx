"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Gavel, Plus, BarChart3 } from "lucide-react";
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
}

export default function SellerDashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth("seller");
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    getMyListingsAction(1, 10)
      .then((res) => setListings((res.data as { data: Listing[] }).data || []))
      .catch(() => setListings([]))
      .finally(() => setListingsLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeListings = listings.filter((l) => l.status === "active").length;
  const totalRevenue = 0; // Would come from backend

  const stats = [
    { label: "Active Listings", value: activeListings, icon: Gavel },
    { label: "Total Listings", value: listings.length, icon: BarChart3 },
    {
      label: "Total Revenue",
      value: `৳${formatPriceEn(totalRevenue)}`,
      icon: TrendingUp,
    },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal className="mt-8 mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your listings and track sales
              </p>
            </div>
            <Link
              href={ROUTES.sellerNewListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-bid-500 text-white text-sm font-semibold rounded-xl hover:bg-bid-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </ScrollReveal>

          {/* Stats */}
          <StaggerChildren className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bid-500/10">
                      <stat.icon className="w-5 h-5 text-bid-500" />
                    </div>
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

          {/* Listings */}
          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Your Listings</h2>
              {listingsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No listings yet</p>
                  <Link
                    href={ROUTES.sellerNewListing}
                    className="text-sm text-bid-500 hover:underline mt-2 block"
                  >
                    Create your first listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.map((listing, i) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-bid-500/30 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{listing.title}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {listing.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={ROUTES.sellerListings}
                          className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
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
