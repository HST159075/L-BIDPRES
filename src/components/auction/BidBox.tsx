"use client";

import { useState }          from "react";
import { useForm }           from "react-hook-form";
import { zodResolver }       from "@hookform/resolvers/zod";
import { z }                 from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Zap, X, CreditCard, Smartphone } from "lucide-react";
import { useBid }            from "@/hooks/useBid";
import { useAuthStore }      from "@/store/authStore";
import { formatPriceEn }     from "@/lib/utils";
import { cn }                from "@/lib/utils";
import Link                  from "next/link";
import { ROUTES }            from "@/config/constants";

interface BidBoxProps {
  auctionId:    string;
  currentPrice: number;
  bidIncrement: number;
  status:       string;
  sellerId:     string;
}

export function BidBox({ auctionId, currentPrice, bidIncrement, status, sellerId }: BidBoxProps) {
  const user                              = useAuthStore((s) => s.user);
  const [mode, setMode]                   = useState<"manual" | "auto">("manual");
  const [gateway, setGateway]             = useState<"sslcommerz" | "bkash">("sslcommerz");
  const [justBid, setJustBid]             = useState(false);
  // Ensure numbers — Prisma Decimal comes as string from JSON
  const price     = Number(currentPrice);
  const increment = Number(bidIncrement);
  const { placeBid, setAutoBid, isLoading, minBid } = useBid(auctionId, price, increment);

  const manualSchema = z.object({
    amount: z.number().min(minBid, `Minimum bid is ${formatPriceEn(minBid)}`),
  });
  const autoSchema = z.object({
    maxAmount: z.number().min(currentPrice + 1, "Must exceed current price"),
  });

  const manualForm = useForm<{ amount: number }>({
    resolver: zodResolver(manualSchema),
    defaultValues: { amount: Number(currentPrice) + Number(bidIncrement) },
  });
  const autoForm = useForm<{ maxAmount: number }>({
    resolver: zodResolver(autoSchema),
    defaultValues: { maxAmount: Number(currentPrice) + Number(bidIncrement) * 5 },
  });

  const handleManualBid = async (data: { amount: number }) => {
    const ok = await placeBid(data.amount, gateway);
    if (ok) {
      setJustBid(true);
      setTimeout(() => setJustBid(false), 2000);
      manualForm.setValue("amount", currentPrice + bidIncrement * 2);
    }
  };

  const handleAutoBid = async (data: { maxAmount: number }) => {
    await setAutoBid(data.maxAmount, gateway);
  };

  if (!user) {
    return (
      <div className="bg-muted/50 border border-border rounded-2xl p-6 text-center space-y-3">
        <Gavel className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Login to place a bid</p>
        <div className="flex gap-2">
          <Link href={ROUTES.login} className="flex-1 px-4 py-2.5 bg-bid-500 text-white text-sm font-medium rounded-xl hover:bg-bid-600 transition-colors text-center">
            Login
          </Link>
          <Link href={ROUTES.register} className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-accent transition-colors text-center">
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (user.id === sellerId) {
    return (
      <div className="bg-muted/50 border border-border rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground">This is your listing</p>
      </div>
    );
  }

  if (status !== "live") {
    return (
      <div className="bg-muted/50 border border-border rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {status === "ended" ? "Auction has ended" : "Auction not started yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      {/* Current price */}
      <div>
        <p className="text-xs text-muted-foreground">Current bid</p>
        <motion.p
          key={currentPrice}
          initial={{ scale: 1.1, color: "#F97316" }}
          animate={{ scale: 1,   color: "inherit" }}
          className="text-3xl font-bold"
        >
          {formatPriceEn(currentPrice)}
        </motion.p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Min next bid: <span className="text-foreground font-medium">{formatPriceEn(minBid)}</span>
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-muted rounded-xl p-1 gap-1">
        {(["manual", "auto"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
              mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            {m === "manual" ? <Gavel className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            {m === "manual" ? "Manual" : "Auto-bid"}
          </button>
        ))}
      </div>

      {/* Gateway selection */}
      <div className="flex gap-2">
        {(["sslcommerz", "bkash"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGateway(g)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all",
              gateway === g ? "border-bid-500 bg-bid-500/10 text-bid-500" : "border-border text-muted-foreground hover:border-border/80"
            )}
          >
            {g === "sslcommerz" ? <CreditCard className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            {g === "sslcommerz" ? "Card/Bank" : "bKash"}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {mode === "manual" ? (
          <motion.form
            key="manual"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={manualForm.handleSubmit(handleManualBid)}
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Bid Amount (৳)</label>
              <input
                type="number"
                step={bidIncrement}
                min={minBid}
                {...manualForm.register("amount", { valueAsNumber: true })}
                className="w-full mt-1 px-4 py-3 bg-muted border border-border rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-bid-500 focus:border-transparent"
              />
              {manualForm.formState.errors.amount && (
                <p className="text-xs text-destructive mt-1">{manualForm.formState.errors.amount.message}</p>
              )}
            </div>

            {/* Quick bid buttons */}
            <div className="flex gap-2">
              {[1, 2, 5].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => manualForm.setValue("amount", currentPrice + bidIncrement * mult)}
                  className="flex-1 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  +{mult === 1 ? formatPriceEn(bidIncrement) : `${mult}x`}
                </button>
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                justBid
                  ? "bg-green-500"
                  : "bg-bid-500 hover:bg-bid-600 active:bg-bid-700",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              <Gavel className="w-4 h-4" />
              {isLoading ? "Placing bid..." : justBid ? "Bid Placed!" : "Place Bid"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            key="auto"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={autoForm.handleSubmit(handleAutoBid)}
            className="space-y-3"
          >
            <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 inline mr-1 text-bid-500" />
              Set your maximum — system bids automatically at the lowest possible amount.
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Maximum Amount (৳)</label>
              <input
                type="number"
                step={bidIncrement}
                {...autoForm.register("maxAmount", { valueAsNumber: true })}
                className="w-full mt-1 px-4 py-3 bg-muted border border-border rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-bid-500 focus:border-transparent"
              />
              {autoForm.formState.errors.maxAmount && (
                <p className="text-xs text-destructive mt-1">{autoForm.formState.errors.maxAmount.message}</p>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-bid-500 hover:bg-bid-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Zap className="w-4 h-4" />
              {isLoading ? "Setting..." : "Enable Auto-Bid"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
