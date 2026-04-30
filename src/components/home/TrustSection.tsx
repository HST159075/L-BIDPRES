"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const TRUST_ITEMS = [
  "100% Verified Sellers",
  "Escrow Payment Protection",
  "ID Verification Required",
  "24/7 Customer Support",
  "Real-Time Bid Tracking",
  "Secure SSL Encryption",
  "Anti-Fraud System",
  "Money-Back Guarantee",
];

export function TrustSection() {
  return (
    <section className="py-24 bg-[var(--color-muted)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest">
              Trust & Safety
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Your Security Is Our<br />
              <span className="gradient-text">Top Priority</span>
            </h2>
            <p className="text-[var(--color-muted-foreground)] leading-relaxed max-w-md">
              We implement multiple layers of security to ensure every transaction on BidBD is safe, transparent, and fair for both buyers and sellers.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {TRUST_ITEMS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[var(--color-bid-500)]/10 via-transparent to-blue-500/10 border border-[var(--color-border)] rounded-3xl p-8 sm:p-12">
              {/* Shield visual */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 flex items-center justify-center shadow-2xl shadow-[var(--color-bid-500)]/30">
                    <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-[var(--color-background)]">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Platform Verified</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs mx-auto">
                    Every transaction is monitored and protected with bank-level encryption.
                  </p>
                </div>

                {/* Mini stats */}
                <div className="flex gap-6 pt-4 border-t border-[var(--color-border)]">
                  <div className="text-center">
                    <p className="text-2xl font-black text-[var(--color-bid-500)]">99.9%</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-green-500">0</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Data Breaches</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-blue-500">256-bit</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">SSL</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
