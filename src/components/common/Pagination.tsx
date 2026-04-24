"use client";

import { motion }  from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn }      from "@/lib/utils";

interface PaginationProps {
  page:        number;
  totalPages:  number;
  onPageChange: (page: number) => void;
  className?:  string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3)          pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
              p === page
                ? "bg-bid-500 text-white"
                : "border border-border hover:bg-accent"
            )}
          >
            {p}
          </motion.button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
