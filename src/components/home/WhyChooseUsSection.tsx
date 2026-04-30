"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Eye, Headphones, CreditCard, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Real-Time Bidding",
    description: "Experience the thrill of live auctions with instant bid updates powered by WebSocket technology.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your money is protected with escrow-based payment through SSLCommerz and bKash integration.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Eye,
    title: "Verified Sellers",
    description: "Every seller goes through a thorough verification process with ID verification and background checks.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help with any questions or issues you may have.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CreditCard,
    title: "Auto-Bid System",
    description: "Set your maximum bid and let our intelligent system bid on your behalf automatically.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Users,
    title: "Growing Community",
    description: "Join 18,000+ active bidders and 1,200+ verified sellers in Bangladesh's largest auction community.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
            Why BidBD?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Us</h2>
          <p className="text-[var(--color-muted-foreground)] mt-3 max-w-xl mx-auto">
            The most trusted auction platform in Bangladesh with features designed for both buyers and sellers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/30 transition-all group hover:shadow-lg"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
