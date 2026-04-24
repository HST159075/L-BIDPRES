"use client";

import { useState, useCallback } from "react";
import { bidService } from "@/services/bid.service";
import { showError, showSuccess } from "@/lib/error-handler";

export function useBid(
  auctionId: string,
  currentPrice: number,
  bidIncrement: number,
) {
  const [isLoading, setIsLoading] = useState(false);

  // Ensure numbers — Prisma Decimal comes as string from JSON
  const price = Number(currentPrice);
  const increment = Number(bidIncrement);
  const minBid = price + increment;

  const placeBid = useCallback(
    async (amount: number, gateway: "sslcommerz" | "bkash" = "sslcommerz") => {
      const numAmount = Number(amount);
      if (numAmount < minBid) {
        showError({ message: `Minimum bid is ৳${minBid.toLocaleString()}` });
        return false;
      }
      setIsLoading(true);
      try {
        await bidService.placeBid({ auctionId, amount: numAmount, gateway });
        showSuccess("Bid placed successfully!");
        return true;
      } catch (err) {
        showError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [auctionId, minBid],
  );

  const setAutoBid = useCallback(
    async (
      maxAmount: number,
      gateway: "sslcommerz" | "bkash" = "sslcommerz",
    ) => {
      const numMax = Number(maxAmount);
      if (numMax <= price) {
        showError({
          message: `Max amount must exceed current price ৳${price.toLocaleString()}`,
        });
        return false;
      }
      setIsLoading(true);
      try {
        await bidService.setAutoBid({ auctionId, maxAmount: numMax, gateway });
        showSuccess("Auto-bid configured!");
        return true;
      } catch (err) {
        showError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [auctionId, price],
  );

  const cancelAutoBid = useCallback(async () => {
    setIsLoading(true);
    try {
      await bidService.cancelAutoBid(auctionId);
      showSuccess("Auto-bid cancelled.");
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [auctionId]);

  return { placeBid, setAutoBid, cancelAutoBid, isLoading, minBid };
}
