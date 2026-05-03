"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES, FAQ_DATA } from "@/config/constants";
import {
  Search,
  ChevronDown,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Shield,
  Users,
  Gavel,
  Mail,
} from "lucide-react";

const HELP_CATEGORIES = [
  {
    icon: ShoppingBag,
    title: "Buying",
    desc: "How to bid, win, and receive items",
    count: 12,
  },
  {
    icon: Gavel,
    title: "Selling",
    desc: "Listing items and managing auctions",
    count: 8,
  },
  {
    icon: CreditCard,
    title: "Payments",
    desc: "Payment methods, refunds, and fees",
    count: 10,
  },
  {
    icon: Users,
    title: "Account",
    desc: "Registration, profile, and settings",
    count: 6,
  },
  {
    icon: Shield,
    title: "Safety",
    desc: "Fraud prevention and dispute resolution",
    count: 5,
  },
  {
    icon: HelpCircle,
    title: "General",
    desc: "Platform rules and other topics",
    count: 7,
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQ = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-24 pb-16">
        {/* Hero with search */}
        <section className="bg-gradient-to-b from-[var(--color-bid-500)]/10 to-transparent py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              How can we <span className="gradient-text">help</span>?
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
              Search our knowledge base or browse categories below.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-foreground)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] shadow-lg transition-all"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((cat) => (
              <motion.div
                key={cat.title}
                whileHover={{ y: -2 }}
                className="flex items-start gap-4 p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/30 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--color-bid-500)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-bid-500)]/20 transition-colors">
                  <cat.icon className="w-5 h-5 text-[var(--color-bid-500)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-0.5 group-hover:text-[var(--color-bid-500)] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {cat.desc}
                  </p>
                  <p className="text-xs text-[var(--color-bid-500)] mt-1 font-medium">
                    {cat.count} articles
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {filteredFAQ.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className="font-semibold text-sm pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {filteredFAQ.length === 0 && (
              <div className="text-center py-10 text-[var(--color-muted-foreground)]">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent border border-[var(--color-bid-500)]/20 rounded-3xl p-8 text-center">
            <Mail className="w-10 h-10 text-[var(--color-bid-500)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <Link
              href={ROUTES.contact}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-semibold rounded-2xl transition-all"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
