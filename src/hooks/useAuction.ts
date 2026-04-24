"use client";

import { useEffect } from "react";
import { useAuctionStore } from "@/store/auctionStore";
import { useAuthStore } from "@/store/authStore";
import {
  joinAuction,
  leaveAuction,
  onBidNew,
  onBidOutbid,
  onAuctionEnded,
  onAuctionCountdown,
  getSocket,
} from "@/lib/socket";
import toast from "react-hot-toast";
import type { Auction, Bid } from "@/types";

export function useAuction(auction: Auction) {
  const { updatePrice, addBid, setCountdown, setAuction, markEnded } =
    useAuctionStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setAuction(auction);
  }, [auction, setAuction]);

  useEffect(() => {
    if (auction.status !== "live") return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();
    joinAuction(auction.id);

    const offBidNew = onBidNew((data) => {
      updatePrice(auction.id, Number(data.amount));
      const bid: Bid = {
        id: crypto.randomUUID(),
        auctionId: auction.id,
        bidderId: data.bidderId,
        bidder: { name: "Bidder", avatar: null },
        status: "active",
        amount: Number(data.amount),
        isAutoBid: false,
        createdAt: data.time,
      };
      addBid(auction.id, bid);
      if (data.bidderId !== user?.id) {
        toast(`New bid: ৳${Number(data.amount).toLocaleString()}`, {
          icon: "🔨",
        });
      }
    });

    const offOutbid = onBidOutbid((data) => {
      if (data.auctionId === auction.id) {
        toast.error(
          `You've been outbid! New price: ৳${Number(data.newAmount).toLocaleString()}`,
        );
      }
    });

    const offEnded = onAuctionEnded((data) => {
      markEnded(auction.id, data.winnerId, Number(data.finalPrice));
      if (data.winnerId === user?.id) {
        toast.success("🎉 Congratulations! You won the auction!");
      } else {
        toast("Auction ended", { icon: "🏁" });
      }
    });

    const offCountdown = onAuctionCountdown((data) => {
      setCountdown(auction.id, data.secondsLeft);
      if (data.secondsLeft === 60) {
        toast("⏰ 1 minute remaining!", { duration: 3000 });
      }
    });

    return () => {
      leaveAuction(auction.id);
      offBidNew();
      offOutbid();
      offEnded();
      offCountdown();
    };
  }, [
    auction.id,
    auction.status,
    user?.id,
    updatePrice,
    addBid,
    setCountdown,
    markEnded,
  ]);

  const currentPrice = useAuctionStore((s) =>
    Number(s.currentPrices[auction.id] ?? auction.currentPrice),
  );
  const bids = useAuctionStore(
    (s) => s.liveBids[auction.id] ?? auction.bids ?? [],
  );
  const countdownSecs = useAuctionStore((s) => s.countdowns[auction.id]);
  const liveAuction = useAuctionStore(
    (s) => s.liveAuctions[auction.id] ?? auction,
  );

  return { currentPrice, bids, countdownSecs, liveAuction };
}
