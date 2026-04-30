"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_DATA } from "@/config/constants";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[var(--color-muted)]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
            Got Questions?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-[var(--color-muted-foreground)] mt-3 max-w-xl mx-auto">
            Everything you need to know about bidding, selling, and winning on BidBD.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <span className="font-semibold text-sm pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-bid-500)] transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
