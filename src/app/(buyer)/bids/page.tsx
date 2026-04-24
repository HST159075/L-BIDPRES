"use client";

import { useEffect, useState }   from "react";
import { motion }                from "framer-motion";
import { Gavel, Clock, TrendingUp } from "lucide-react";
import { Navbar }                from "@/components/layout/Navbar";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";
import { SmoothScroll }          from "@/components/animations/SmoothScroll";
import { useRequireAuth }        from "@/hooks/useAuth";
import { bidService }            from "@/services/bid.service";
import { formatPriceEn, formatTimeAgo, getBidStatusColor } from "@/lib/utils";

interface Bid {
  id:        string;
  amount:    number;
  status:    string;
  isAutoBid: boolean;
  createdAt: string;
  auction?:  { listing?: { title?: string } };
}

export default function BidHistoryPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [bids, setBids]          = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [page, setPage]          = useState(1);

  useEffect(() => {
    bidService.getMyBids(page, 20)
      .then((res) => setBids((res.data as { data: Bid[] }).data || []))
      .catch(() => setBids([]))
      .finally(() => setBidsLoading(false));
  }, [page]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Bids",   value: bids.length, icon: Gavel },
    { label: "Active",       value: bids.filter(b => b.status === "active").length, icon: TrendingUp },
    { label: "Won",          value: bids.filter(b => b.status === "won").length, icon: Gavel },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">My Bids</h1>
            <p className="text-muted-foreground mt-1">View all your auction bids and history</p>
          </ScrollReveal>

          {/* Stats */}
          <StaggerChildren className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Bids List */}
          <ScrollReveal>
            {bidsLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading bids...</div>
            ) : bids.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No bids yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid, i) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl border transition-all ${getBidStatusColor(bid.status)} bg-card border-border`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold">{bid.auction?.listing?.title || "Auction"}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {formatTimeAgo(bid.createdAt)}
                          </span>
                          {bid.isAutoBid && (
                            <span className="flex items-center gap-1 text-bid-500">
                              <TrendingUp className="w-3.5 h-3.5" /> Auto-bid
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-bid-500">{formatPriceEn(bid.amount)}</p>
                        <p className="text-xs capitalize font-medium mt-1">{bid.status}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Pagination */}
          {bids.length > 0 && (
            <ScrollReveal className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 text-sm font-medium"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm font-medium"
              >
                Next
              </button>
            </ScrollReveal>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}
