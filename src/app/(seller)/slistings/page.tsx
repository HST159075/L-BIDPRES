"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  getMyListingsAction,
  deleteListingAction,
} from "@/actions/seller.actions";
import { showSuccess, showError } from "@/lib/error-handler";
import { formatPriceEn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";

interface Listing {
  id: string;
  title: string;
  status: string;
  photos: string[];
  auction?: { currentPrice: number; status: string };
}

export default function SellerListingsPage() {
  const { user, isLoading: authLoading } = useRequireAuth("seller");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Derived State: Filtered listings based on search
  const filteredListings = useMemo(() => {
    return listings.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [listings, search]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await getMyListingsAction(1, 50);
        const dataArray = res.data?.data ?? [];
        setListings(Array.isArray(dataArray) ? dataArray : []);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [refreshKey]);

  // Auto-refresh every 3 seconds to show newly created listings
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (): Promise<void> => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteListingAction(deleteId);
      if (result?.error) throw new Error(result.error);

      showSuccess("Listing deleted");
      setListings((prev) => prev.filter((l) => l.id !== deleteId));
    } catch (err) {
      showError(err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mt-8 mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
                My Listings
              </h1>
              <p className="text-[var(--color-muted-foreground)] mt-1">
                {listings.length} total listings
              </p>
            </div>
            <Link
              href={ROUTES.sellerNewListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </ScrollReveal>

          {/* Search Box */}
          <ScrollReveal className="mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] text-[var(--color-foreground)]"
              />
            </div>
          </ScrollReveal>

          {/* Listings List */}
          <ScrollReveal>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-16 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
                <p className="font-medium text-[var(--color-muted-foreground)]">
                  {search
                    ? "No listings found matching your search"
                    : "No listings yet"}
                </p>
                {!search && (
                  <Link
                    href={ROUTES.sellerNewListing}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--color-bid-500)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create First Listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/30 transition-shadow hover:shadow-sm"
                  >
                    {listing.photos?.[0] ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[var(--color-muted)] flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6 text-[var(--color-muted-foreground)] opacity-20" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--color-foreground)] truncate">
                        {listing.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
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
                          <span className="text-xs font-medium text-[var(--color-foreground)]">
                            {formatPriceEn(
                              Number(listing.auction.currentPrice),
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* ✅ Path fixed to match your structure: slistings/[id]/edit */}
                      <Link
                        href={`/slistings/${listing.id}/edit`}
                        className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(listing.id)}
                        className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Listing"
        description="This action will permanently remove this item from the auction platform."
        variant="danger"
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleting}
      />
    </SmoothScroll>
  );
}
