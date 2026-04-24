import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { AuctionCard } from "@/components/auction/AuctionCard";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { HeroSceneWrapper } from "@/components/animations/HeroSceneWrapper";
import { AuctionGridSkeleton } from "@/components/common/Skeleton";
import { getAuctionsAction } from "@/actions/auction.actions";
import { ROUTES } from "@/config/constants";

const STATS = [
  { key: "auctions", value: "2,400+", icon: TrendingUp },
  { key: "users", value: "18,000+", icon: Users },
  { key: "sold", value: "9,800+", icon: Shield },
  { key: "sellers", value: "1,200+", icon: Zap },
];

export default async function HomePage() {
  const t = await getTranslations();
  const { data: auctions } = await getAuctionsAction({ limit: 6 });

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bid-950)]/20 via-transparent to-transparent" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[var(--color-bid-500)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-8 z-10">
                <ScrollReveal delay={0.1}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium">
                    <span className="w-2 h-2 bg-[var(--color-bid-500)] rounded-full live-dot" />
                    {t("home.hero.badge")}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                    <span className="gradient-text">
                      {t("home.hero.title")}
                    </span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <p className="text-lg text-[var(--color-muted-foreground)] max-w-md">
                    {t("home.hero.subtitle")}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={ROUTES.auctions}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      {t("home.hero.cta")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={ROUTES.sellerApply}
                      className="inline-flex items-center gap-2 px-6 py-3.5 border border-[var(--color-border)] hover:bg-[var(--color-accent)] font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      {t("home.hero.ctaSell")}
                    </Link>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.5}>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {STATS.map((stat) => (
                      <div key={stat.key} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-bid-500)]/10 flex items-center justify-center shrink-0">
                          <stat.icon className="w-5 h-5 text-[var(--color-bid-500)]" />
                        </div>
                        <div>
                          <p className="text-xl font-bold">{stat.value}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            {t(`home.stats.${stat.key}`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Right — 3D Scene (Client Component) */}
              <ScrollReveal delay={0.3} direction="left">
                <div className="relative h-[500px] lg:h-[600px]">
                  <HeroSceneWrapper />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Featured Auctions ───────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
                  Live Now
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {t("home.featured")}
                </h2>
              </div>
              <Link
                href={ROUTES.auctions}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors group"
              >
                {t("home.viewAll")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <Suspense fallback={<AuctionGridSkeleton count={6} />}>
            {auctions.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction, i) => (
                  <StaggerItem key={auction.id}>
                    <AuctionCard auction={auction} index={i} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : (
              <ScrollReveal>
                <div className="text-center py-20 text-[var(--color-muted-foreground)]">
                  <p className="text-lg">No live auctions right now.</p>
                  <p className="text-sm mt-1">Check back soon!</p>
                </div>
              </ScrollReveal>
            )}
          </Suspense>
        </section>

        {/* ── How it works ────────────────────────────────── */}
        <section className="py-24 bg-[var(--color-muted)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
              <p className="text-[var(--color-bid-500)] text-sm font-semibold uppercase tracking-widest mb-2">
                Simple Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            </ScrollReveal>
            <StaggerChildren className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Browse Auctions",
                  desc: "Explore hundreds of live product and real estate auctions.",
                },
                {
                  step: "02",
                  title: "Place Your Bid",
                  desc: "Bid manually or set up auto-bid. Secure payment via SSLCommerz or bKash.",
                },
                {
                  step: "03",
                  title: "Win & Own",
                  desc: "Win the auction, confirm delivery, and the item is yours!",
                },
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <div className="relative p-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/30 transition-colors group">
                    <span className="text-6xl font-black text-[var(--color-bid-500)]/10 group-hover:text-[var(--color-bid-500)]/20 transition-colors absolute top-4 right-4">
                      {item.step}
                    </span>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-[var(--color-muted-foreground)] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent border border-[var(--color-bid-500)]/20 rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to start bidding?
              </h2>
              <p className="text-[var(--color-muted-foreground)]">
                Join thousands of buyers and sellers on Bangladeshs premier
                auction platform.
              </p>
              <Link
                href={ROUTES.register}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </SmoothScroll>
  );
}
