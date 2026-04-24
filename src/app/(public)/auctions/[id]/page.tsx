import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { MapPin, Package, Tag, Truck, User, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BidBox } from "@/components/auction/BidBox";
import { BidHistoryClient } from "@/components/auction/BidHistoryClient";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ImageGallery } from "@/components/auction/ImageGallery";
import { getAuctionAction } from "@/actions/auction.actions";
import { formatPriceEn, formatDate } from "@/lib/utils";
import { CATEGORIES, CONDITIONS } from "@/config/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auction = await getAuctionAction(id);
  if (!auction?.listing) return { title: "Auction Not Found" };
  return {
    title: auction.listing.title,
    description: auction.listing.description.slice(0, 160),
    openGraph: { images: [auction.listing.photos[0]] },
  };
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await getAuctionAction(id);

  if (!auction || !auction.listing) notFound();

  const listing = auction.listing;
  const isLive = auction.status === "live";
  const category = CATEGORIES.find((c) => c.value === listing.category);
  const condition = CONDITIONS.find((c) => c.value === listing.condition);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_400px] gap-10 mt-8">
              {/* Left — Listing details */}
              <div className="space-y-6">
                {/* Image gallery */}
                <ScrollReveal>
                  <ImageGallery images={listing.photos} title={listing.title} />
                </ScrollReveal>

                {/* Title & info */}
                <ScrollReveal delay={0.1}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {listing.title}
                      </h1>
                      {listing.condition && (
                        <span className="shrink-0 px-3 py-1 rounded-full text-sm font-medium bg-muted border border-border capitalize">
                          {condition?.labelEn || listing.condition}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        {category?.labelEn || listing.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4" />
                        {listing.shippingCost === 0
                          ? "Free shipping"
                          : `Shipping: ${formatPriceEn(listing.shippingCost)}`}
                      </span>
                      {listing.brand && (
                        <span className="flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          {listing.brand}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal delay={0.2}>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Auction info */}
                <ScrollReveal delay={0.3}>
                  <div className="bg-card border border-border rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Starting Price
                      </p>
                      <p className="font-bold text-lg">
                        {formatPriceEn(auction.startingPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Bid Increment
                      </p>
                      <p className="font-bold text-lg">
                        {formatPriceEn(auction.bidIncrement)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Auction Start
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(auction.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Auction End
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(auction.endTime)}
                      </p>
                    </div>
                    {listing.seller && (
                      <div className="sm:col-span-2 flex items-center gap-2 pt-2 border-t border-border">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Seller:
                        </span>
                        <span className="text-sm font-medium">
                          {listing.seller.name}
                        </span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Bid history — client component for real-time */}
                <ScrollReveal delay={0.4}>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-semibold mb-4">Bid History</h2>
                    <BidHistoryClient
                      auctionId={auction.id}
                      initialBids={auction.bids || []}
                      winnerId={auction.winnerId}
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right — Bid box (sticky) */}
              <div>
                <div className="sticky top-24 space-y-4">
                  <ScrollReveal direction="left">
                    {/* Current price + timer */}
                    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Current Bid
                        </p>
                        <p className="text-4xl font-black text-bid-500">
                          {formatPriceEn(auction.currentPrice)}
                        </p>
                      </div>
                      {(isLive || auction.status === "scheduled") && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                          <CountdownTimer endTime={auction.endTime} size="md" />
                        </div>
                      )}
                      {auction.status === "ended" && auction.winnerId && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 rounded-xl p-3">
                          <span className="text-sm font-medium">
                            Sold for{" "}
                            {formatPriceEn(
                              auction.finalPrice || auction.currentPrice,
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bid box */}
                    <BidBox
                      auctionId={auction.id}
                      currentPrice={Number(auction.currentPrice)}
                      bidIncrement={Number(auction.bidIncrement)}
                      status={auction.status}
                      sellerId={listing.sellerId}
                    />
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
