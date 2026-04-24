"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Zap } from "lucide-react"; // Removed title from icon call
import { formatPriceEn, formatTimeAgo, getInitials } from "@/lib/utils";
import type { Bid } from "@/types";

interface BidHistoryProps {
  bids: Bid[];
  winnerId?: string | null;
}

export function BidHistory({ bids, winnerId }: BidHistoryProps) {
  if (!bids.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gavel className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No bids yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {bids.map((bid, i) => (
          <motion.div
            key={bid.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              i === 0
                ? "border-bid-500/30 bg-bid-500/5"
                : "border-border bg-muted/30"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                i === 0
                  ? "bg-bid-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {getInitials(bid.bidder.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate">
                  {bid.bidder.name}
                </p>

                {/* FIXED: Title moved to span wrapper */}
                {bid.isAutoBid && (
                  <span title="Auto bid" className="flex items-center">
                    <Zap className="w-3 h-3 text-bid-500 shrink-0" />
                  </span>
                )}

                {bid.bidderId === winnerId && (
                  <span className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                    Winner
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(bid.createdAt)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p
                className={`font-bold ${i === 0 ? "text-bid-500 text-base" : "text-foreground text-sm"}`}
              >
                {formatPriceEn(bid.amount)}
              </p>
              {i === 0 && (
                <p className="text-xs text-bid-500 font-medium">Highest</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
