"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Simulate submission
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1200);
  };

  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="relative bg-gradient-to-br from-[var(--color-bid-500)]/10 via-[var(--color-bid-500)]/5 to-transparent border border-[var(--color-bid-500)]/20 rounded-3xl p-10 sm:p-14 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-bid-500)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
              Stay Updated
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Never Miss an Auction
            </h2>
            <p className="text-[var(--color-muted-foreground)] mb-8 max-w-md mx-auto">
              Subscribe to get notified about trending auctions, exclusive deals, and new listings tailored to your interests.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-5 py-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] focus:border-transparent transition-all"
                />
              </div>
              <motion.button
                type="submit"
                disabled={status !== "idle"}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-2xl transition-all disabled:opacity-70 shadow-lg shadow-[var(--color-bid-500)]/25"
              >
                {status === "loading" ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Subscribing...</>
                ) : status === "success" ? (
                  <><CheckCircle className="w-4 h-4" /> Subscribed!</>
                ) : (
                  <><Send className="w-4 h-4" /> Subscribe</>
                )}
              </motion.button>
            </form>

            <p className="text-xs text-[var(--color-muted-foreground)] mt-4">
              No spam, unsubscribe anytime. By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
