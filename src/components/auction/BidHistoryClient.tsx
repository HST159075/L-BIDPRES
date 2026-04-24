"use client";

import { useMemo, useState } from "react";
import { useAuction } from "@/hooks/useAuction";
import { BidHistory } from "./BidHistory";
import type { Auction, Bid } from "@/types";

interface Props {
  auctionId: string;
  initialBids: Bid[];
  winnerId?: string | null;
}

function BidHistoryClientInner({
  auction,
  winnerId,
}: {
  auction: Auction;
  winnerId?: string | null;
}) {
  const { bids } = useAuction(auction);
  return <BidHistory bids={bids} winnerId={winnerId} />;
}

export function BidHistoryClient({ auctionId, initialBids, winnerId }: Props) {
  // 1. Initialize the end time once using a lazy initializer function.
  // This satisfies the purity rule because the state remains stable after the first call.
  const [stableEndTime] = useState<string>(() =>
    new Date(Date.now() + 86400000).toISOString(),
  );

  const auction = useMemo<Auction>(
    () => ({
      id: auctionId,
      listingId: "",
      status: "live",
      startingPrice: 0,
      bidIncrement: 0,
      currentPrice: 0,
      startTime: new Date(0).toISOString(),
      endTime: stableEndTime, // Use the stable value from state
      bids: initialBids,
      createdAt: new Date(0).toISOString(),
    }),
    [auctionId, initialBids, stableEndTime],
  );

  return <BidHistoryClientInner auction={auction} winnerId={winnerId} />;
}
