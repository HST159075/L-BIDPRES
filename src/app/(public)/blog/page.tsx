import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS, ROUTES } from "../../../config/constants";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | BidBD",
  description: "Auction tips, seller guides, and market insights from BidBD.",
};

const ALL_POSTS = [
  ...BLOG_POSTS,
  {
    id: "4",
    title: "Understanding Auto-Bid: Your Secret Weapon",
    excerpt: "Master the auto-bid feature to win more auctions without constantly monitoring. Set it and forget it with smart bidding strategies.",
    category: "Tips & Tricks",
    author: "BidBD Team",
    date: "2026-04-10",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium mb-6">
              Our Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              Insights & <span className="gradient-text">Guides</span>
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              Tips, strategies, and market insights to help you succeed in online auctions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_POSTS.map((post) => (
              <Link key={post.id} href={`${ROUTES.blog}/${post.id}`} className="group">
                <article className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-bid-500)]/30 transition-all hover:shadow-lg h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-base group-hover:text-[var(--color-bid-500)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-bid-500)] pt-1">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
