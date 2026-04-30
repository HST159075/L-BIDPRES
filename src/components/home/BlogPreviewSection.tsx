"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS, ROUTES } from "@/config/constants";

export function BlogPreviewSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
              From Our Blog
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">Latest Articles</h2>
            <p className="text-[var(--color-muted-foreground)] mt-2 max-w-md">
              Auction tips, seller guides, and market insights to help you succeed.
            </p>
          </div>
          <Link
            href={ROUTES.blog}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Link href={`${ROUTES.blog}/${post.id}`}>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-bid-500)]/30 transition-all hover:shadow-lg">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted)]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[var(--color-bid-500)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-snug group-hover:text-[var(--color-bid-500)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-bid-500)] pt-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href={ROUTES.blog}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-bid-500)]"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
