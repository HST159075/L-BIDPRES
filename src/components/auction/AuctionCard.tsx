"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Eye } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { cn, formatPriceEn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";
import type { Auction } from "@/types";

interface AuctionCardProps {
  auction: Auction;
  index?: number;
  className?: string;
}

export function AuctionCard({
  auction,
  index = 0,
  className,
}: AuctionCardProps) {
  const listing = auction.listing;
  const currentPrice = Number(auction.currentPrice);
  const isLive = auction.status === "live";
  const isScheduled = auction.status === "scheduled";

  if (!listing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={cn("group", className)}
    >
      <Link href={ROUTES.auction(auction.id)}>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-bid-500/30 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={listing.photos[0] || "/placeholder.jpg"}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Status badge */}
            <div className="absolute top-3 left-3">
              {isLive && (
                <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                  LIVE
                </div>
              )}
              {isScheduled && (
                <div className="flex items-center gap-1.5 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Upcoming
                </div>
              )}
              {auction.status === "ended" && (
                <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                  Ended
                </div>
              )}
            </div>

            {/* Category */}
            <div className="absolute top-3 right-3">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full capitalize backdrop-blur-sm">
                {listing.category}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="flex items-center gap-1.5 text-white text-sm font-medium">
                <Eye className="w-4 h-4" /> View Auction
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-bid-500 transition-colors">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{listing.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current bid</p>
                <p className="text-lg font-bold text-bid-500">
                  {formatPriceEn(currentPrice)}
                </p>
              </div>
              {isLive && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{formatPriceEn(Number(auction.bidIncrement))}</span>
                </div>
              )}
            </div>

            {/* Timer */}
            {(isLive || isScheduled) && (
              <div className="pt-2 border-t border-border">
                <CountdownTimer endTime={auction.endTime} size="sm" />
              </div>
            )}

            {/* View Details Button */}
            <div className="pt-2">
              <button className="w-full py-2.5 bg-muted hover:bg-bid-500 hover:text-white text-foreground text-sm font-bold rounded-xl transition-all duration-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
