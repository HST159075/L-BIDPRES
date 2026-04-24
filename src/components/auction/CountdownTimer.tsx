"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { formatCountdown, getSecondsLeft } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endTime: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CountdownTimer({
  endTime,
  className,
  size = "md",
}: CountdownTimerProps) {
  // Start as null to avoid SSR/client mismatch
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calc = () => {
      const left = getSecondsLeft(endTime);
      setSeconds(left);
      if (left <= 0) setIsEnded(true);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  // Don't render until client-side (avoids hydration mismatch)
  if (seconds === null) return null;

  if (isEnded) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 text-muted-foreground",
          className,
        )}
      >
        <Clock className="w-3 h-3" />
        <span className="text-sm font-medium">Auction Ended</span>
      </div>
    );
  }

  const formatted = formatCountdown(seconds);
  const [hh, mm, ss] = formatted.split(":");
  const isUrgent = seconds > 0 && seconds <= 300;

  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-xl gap-2",
    lg: "text-4xl gap-3",
  };
  const digitClasses = {
    sm: "text-xs px-1.5 py-0.5 rounded",
    md: "text-lg px-2 py-1 rounded-md min-w-[2rem]",
    lg: "text-3xl px-4 py-2 rounded-xl min-w-[3.5rem]",
  };

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <Clock
        className={cn(
          "shrink-0",
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6",
          isUrgent ? "text-red-500 animate-pulse" : "text-muted-foreground",
        )}
      />
      {[hh, mm, ss].map((unit, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            suppressHydrationWarning
            className={cn(
              "font-mono font-bold tabular-nums text-center",
              digitClasses[size],
              isUrgent
                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                : "bg-muted text-foreground",
            )}
          >
            {unit}
          </div>
          {i < 2 && (
            <span
              className={cn(
                "font-bold",
                isUrgent ? "text-red-500" : "text-muted-foreground",
              )}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
