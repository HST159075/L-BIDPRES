"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/config/constants";

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
            Trusted by Thousands
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">What Our Users Say</h2>
          <p className="text-[var(--color-muted-foreground)] mt-3 max-w-xl mx-auto">
            Real feedback from verified buyers and sellers across Bangladesh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 relative group hover:border-[var(--color-bid-500)]/30 transition-all"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-[var(--color-bid-500)]" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s < testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-[var(--color-muted-foreground)]/30"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-5">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                    <span>{testimonial.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
