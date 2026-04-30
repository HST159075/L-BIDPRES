import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, ROUTES } from "@/config/constants";
import { Calendar, Clock, User, ArrowLeft, Share2, Link2 } from "lucide-react";

interface PostPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.id === params.id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: PostPageProps) {
  const post = BLOG_POSTS.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back button */}
          <Link href={ROUTES.blog} className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-bid-500)] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          {/* Header */}
          <header className="space-y-6 mb-10">
            <div className="flex items-center gap-3">
              <span className="bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 py-4 border-y border-[var(--color-border)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bid-500)] flex items-center justify-center text-white font-bold">
                B
              </div>
              <div>
                <p className="text-sm font-bold">{post.author}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">Official BidBD Contributor</p>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-[var(--color-foreground)] leading-relaxed">
            <p className="text-xl font-medium text-[var(--color-muted-foreground)] italic border-l-4 border-[var(--color-bid-500)] pl-6 py-2">
              {post.excerpt}
            </p>
            
            <p>
              Online auctions are rapidly becoming the preferred way for millions of Bangladeshis to buy and sell products. 
              The excitement of a live bid, combined with the transparency of real-time pricing, makes it an unparalleled experience. 
              In this guide, we dive deep into the strategies that separate winners from participants.
            </p>

            <h3 className="text-2xl font-bold pt-4">The Psychology of Bidding</h3>
            <p>
              Success in auctions isn't just about having the most money; it's about strategy. Many users fall into the trap 
              of emotional bidding, where they exceed their budget in the heat of the moment. To avoid this, we recommend 
              using our auto-bid feature, which allows you to set a maximum limit and let our system handle the incremental bids.
            </p>

            <div className="bg-[var(--color-muted)] p-8 rounded-2xl border border-[var(--color-border)] my-10">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-6 bg-[var(--color-bid-500)] rounded-full"></span> Key Takeaway
              </h4>
              <p className="text-sm m-0">
                Always research the market value of an item before the auction starts. Knowing the price ceiling 
                gives you the confidence to stop when the bid exceeds reasonable limits.
              </p>
            </div>

            <p>
              Another crucial factor is timing. While many wait until the last few seconds (a tactic known as "sniping"), 
              BidBD's real-time sync ensures that every bid is captured. Our platform extensions prevent last-second sniping 
              by adding a small amount of time if a bid is placed in the final minute, ensuring a fair chance for everyone.
            </p>
          </div>

          {/* Footer / Share */}
          <footer className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Share:</span>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>
                <button className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="p-2.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-bid-500)] hover:text-white transition-all"><Link2 className="w-4 h-4" /></button>
              </div>
            </div>
            <Link href={ROUTES.auctions} className="px-6 py-3 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-xl transition-all shadow-lg shadow-[var(--color-bid-500)]/20">
              Start Bidding Now
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
