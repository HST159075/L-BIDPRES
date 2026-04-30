"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES, ROUTES } from "@/config/constants";

export function CategoriesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
            Browse by Category
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Explore Categories</h2>
          <p className="text-[var(--color-muted-foreground)] mt-3 max-w-xl mx-auto">
            Find exactly what you&apos;re looking for across our wide range of auction categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link
                href={`${ROUTES.auctions}?category=${cat.value}`}
                className="flex flex-col items-center gap-3 p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/40 hover:shadow-xl hover:shadow-[var(--color-bid-500)]/5 transition-all group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-center group-hover:text-[var(--color-bid-500)] transition-colors">
                  {cat.labelEn}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
