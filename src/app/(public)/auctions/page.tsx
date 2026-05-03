"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

import { AuctionCard } from "@/components/auction/AuctionCard";
import { AuctionGridSkeleton } from "@/components/common/Skeleton";
import { auctionService } from "@/services/auction.service";
import { API_URL } from "@/config/constants";

import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import type { Auction, AuctionFilter } from "@/types";

export default function AuctionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 12;

  const debouncedSearch = useDebounce(search, 400);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const filter: any = {
        search: debouncedSearch || undefined,
        category: category || undefined,
        condition: condition || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sort, // সরাসরি সর্ট ভ্যালু পাঠানো (newest, price_low, etc.)
        page,
        limit,
      };
      
      // /auctions এর বদলে /listings এন্ডপয়েন্ট ইউজ করা হচ্ছে ফিল্টারিং এর জন্য
      const res = await auctionService.getListings(filter);
      
      // ডাটা ট্রান্সফর্ম করা হচ্ছে যাতে AuctionCard ঠিকমতো কাজ করে
      const transformedData = res.data.map((item: any) => ({
        ...item.auction,
        id: item.auction?.id || item.id, // Auction ID অথবা Listing ID
        listingId: item.id,
        listing: {
          ...item,
          auction: undefined // সার্কুলার রেফারেন্স এড়াতে
        }
      }));

      setAuctions(transformedData as any);
      setTotal(res.total);
    } catch (err) {
      console.error("Fetch error:", err);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, condition, minPrice, maxPrice, page, sort]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  useEffect(() => {
    if (debouncedSearch.length > 1) {
      axios.get(`${API_URL}/ai/suggestions?q=${debouncedSearch}`)
        .then(res => {
          setSuggestions(res.data?.data || []);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  const auctionsToDisplay = auctions;

  const totalPages = Math.ceil(total / limit) || 1;
  const hasActiveFilters = !!(category || condition || minPrice || maxPrice);

  const clearFilters = () => {
    setCategory("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Browse Auctions</h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">Discover and bid on live auctions</p>
          </div>

          {/* Search & Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search auctions..."
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] transition-all"
                />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSearch(s.title);
                            setShowSuggestions(false);
                            setPage(1);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between"
                        >
                          <span>{s.title}</span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {s.category}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-9 pr-8 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] appearance-none cursor-pointer min-w-[180px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[var(--color-bid-500)] rounded-full" />
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className={`lg:w-64 shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-5 sticky top-24">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm uppercase tracking-widest text-[var(--color-muted-foreground)]">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-[var(--color-bid-500)] hover:underline flex items-center gap-1">
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)]"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.labelEn}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => { setCondition(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)]"
                  >
                    <option value="">All Conditions</option>
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.labelEn}</option>
                    ))}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">
                    Price Range (৳)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                      placeholder="Min"
                      className="w-full px-3 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)]"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                      placeholder="Max"
                      className="w-full px-3 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)]"
                    />
                  </div>
                </div>

                {/* Results count */}
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {loading ? "Loading..." : `${total} auction${total !== 1 ? "s" : ""} found`}
                  </p>
                </div>
              </div>
            </div>

            {/* Auction grid */}
            <div className="flex-1">
              {loading ? (
                <AuctionGridSkeleton count={12} />
              ) : auctionsToDisplay.length === 0 ? (
                <div className="text-center py-20 text-[var(--color-muted-foreground)]">
                  <p className="text-lg font-medium">No auctions found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-[var(--color-bid-500)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-bid-600)] transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {auctionsToDisplay.map((auction, i) => (
                      <AuctionCard key={auction.id} auction={auction} index={i} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                              page === pageNum
                                ? "bg-[var(--color-bid-500)] text-white shadow-lg shadow-[var(--color-bid-500)]/25"
                                : "border border-[var(--color-border)] hover:bg-[var(--color-accent)]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
