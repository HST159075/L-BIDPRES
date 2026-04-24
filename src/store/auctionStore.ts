import { create } from "zustand";
import type { Bid, Auction } from "@/types";

interface AuctionState {
  liveAuctions:    Record<string, Auction>;
  liveBids:        Record<string, Bid[]>;
  currentPrices:   Record<string, number>;
  countdowns:      Record<string, number>;
  updatePrice:     (auctionId: string, price: number) => void;
  addBid:          (auctionId: string, bid: Bid) => void;
  setCountdown:    (auctionId: string, seconds: number) => void;
  setAuction:      (auction: Auction) => void;
  markEnded:       (auctionId: string, winnerId: string | null, finalPrice: number) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  liveAuctions:  {},
  liveBids:      {},
  currentPrices: {},
  countdowns:    {},

  updatePrice: (auctionId, price) =>
    set((s) => ({
      currentPrices: { ...s.currentPrices, [auctionId]: price },
      liveAuctions: s.liveAuctions[auctionId]
        ? { ...s.liveAuctions, [auctionId]: { ...s.liveAuctions[auctionId], currentPrice: price } }
        : s.liveAuctions,
    })),

  addBid: (auctionId, bid) =>
    set((s) => ({
      liveBids: {
        ...s.liveBids,
        [auctionId]: [bid, ...(s.liveBids[auctionId] || [])].slice(0, 50),
      },
    })),

  setCountdown: (auctionId, seconds) =>
    set((s) => ({ countdowns: { ...s.countdowns, [auctionId]: seconds } })),

  setAuction: (auction) =>
    set((s) => ({
      liveAuctions:  { ...s.liveAuctions, [auction.id]: auction },
      currentPrices: { ...s.currentPrices, [auction.id]: auction.currentPrice },
    })),

  markEnded: (auctionId, winnerId, finalPrice) =>
    set((s) => ({
      liveAuctions: s.liveAuctions[auctionId]
        ? { ...s.liveAuctions, [auctionId]: { ...s.liveAuctions[auctionId], status: "ended", winnerId, finalPrice } }
        : s.liveAuctions,
    })),
}));
