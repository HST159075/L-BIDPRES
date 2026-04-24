"use client";

import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasMore:    boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore, onLoadMore, threshold = 300,
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false);
  const sentinelRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          onLoadMore();
          setIsFetching(false);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching, onLoadMore, threshold]);

  return { sentinelRef, isFetching };
}
