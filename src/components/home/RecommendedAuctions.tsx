"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";
import { AuctionGridSkeleton } from "@/components/common/Skeleton";
import axios from "axios";
import { API_URL, ROUTES } from "@/config/constants";
import { useAuthStore } from "@/store/authStore";

export function RecommendedAuctions() {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_URL}/ai/recommendations`, {
          withCredentials: true
        });
        setRecommendations(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-bid-500)]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bid-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-bid-500" />
              </div>
              <div>
                <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-1">
                  AI Powered
                </p>
                <h2 className="text-3xl font-bold">Recommended for You</h2>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <AuctionGridSkeleton count={4} />
        ) : (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item, i) => (
              <StaggerItem key={item.id}>
                {/* Check if item is auction or listing */}
                <AuctionCard 
                  auction={item.auction ? item : { ...item, auction: item.auction }} 
                  index={i} 
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  );
}
