import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS, ROUTES } from "@/config/constants";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
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
  {
    id: "5",
    title: "Top 10 Most Popular Auction Categories in 2026",
    excerpt: "Discover which categories are trending on BidBD this year. From electronics to collectibles, see what buyers are bidding on most.",
    category: "Market Insights",
    author: "BidBD Team",
    date: "2026-04-05",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Secure Your Transactions: Payment Safety Guide",
    excerpt: "Learn how BidBD protects your payments with escrow systems, SSL encryption, and verified seller programs for worry-free bidding.",
    category: "Safety",
    author: "BidBD Team",
    date: "2026-03-28",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-24 pb-16">
        {/* Hero */}
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

          {/* Featured post */}
          <Link href={`${ROUTES.blog}/${ALL_POSTS[0].id}`} className="group block mb-16">
            <div className="grid lg:grid-cols-2 gap-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden hover:border-[var(--color-bid-500)]/30 transition-all hover:shadow-xl">
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <Image
                  src={ALL_POSTS[0].image}
                  alt={ALL_POSTS[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--color-bid-500)] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center space-y-4">
                <span className="text-xs font-semibold text-[var(--color-bid-500)] uppercase tracking-widest">
                  {ALL_POSTS[0].category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold group-hover:text-[var(--color-bid-500)] transition-colors">
                  {ALL_POSTS[0].title}
                </h2>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  {ALL_POSTS[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(ALL_POSTS[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{ALL_POSTS[0].readTime}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-bid-500)] group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* All posts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_POSTS.slice(1).map((post) => (
              <Link key={post.id} href={`${ROUTES.blog}/${post.id}`} className="group">
                <article className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-bid-500)]/30 transition-all hover:shadow-lg h-full flex flex-col">
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
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-snug group-hover:text-[var(--color-bid-500)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-bid-500)] pt-1 group-hover:gap-2 transition-all">
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
