"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, Shield } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { PLATFORM_STATS } from "@/config/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Users,
  ShoppingBag,
  Shield,
};

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[var(--color-bid-600)] via-[var(--color-bid-500)] to-orange-500 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {PLATFORM_STATS.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon] || TrendingUp;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-white/80 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
