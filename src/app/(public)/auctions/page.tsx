import { Suspense }           from "react";
import { getTranslations }    from "next-intl/server";
import { Navbar }             from "@/components/layout/Navbar";
import { AuctionCard }        from "@/components/auction/AuctionCard";
import { AuctionGridSkeleton } from "@/components/common/Skeleton";
import { ScrollReveal }       from "@/components/animations/ScrollReveal";
import { SmoothScroll }       from "@/components/animations/SmoothScroll";
import { getAuctionsAction }  from "@/actions/auction.actions";
import { CATEGORIES, CONDITIONS } from "@/config/constants";
import type { AuctionFilter } from "@/types";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export const metadata = {
  title: "Browse Auctions",
  description: "Explore live product and real estate auctions in Bangladesh.",
};

async function AuctionGrid({ filter }: { filter: AuctionFilter }) {
  const { data: auctions } = await getAuctionsAction(filter);

  if (!auctions.length) {
    return (
      <div className="col-span-full text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No auctions found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {auctions.map((auction, i) => (
        <AuctionCard key={auction.id} auction={auction} index={i} />
      ))}
    </div>
  );
}

export default async function AuctionsPage({ searchParams }: PageProps) {
  const t      = await getTranslations();
  const params = await searchParams;

  const filter: AuctionFilter = {
    category:  params.category,
    condition: params.condition,
    search:    params.search,
    location:  params.location,
    minPrice:  params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice:  params.maxPrice ? Number(params.maxPrice) : undefined,
    page:      params.page ? Number(params.page) : 1,
    limit:     18,
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <ScrollReveal className="mb-8">
              <h1 className="text-3xl font-bold">{t("nav.auctions")}</h1>
              <p className="text-muted-foreground mt-1">Browse and bid on live auctions</p>
            </ScrollReveal>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters sidebar */}
              <ScrollReveal direction="left" className="lg:w-64 shrink-0">
                <form className="bg-card border border-border rounded-2xl p-5 space-y-5 sticky top-24">
                  <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
                    {t("common.filter")}
                  </h2>

                  {/* Search */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t("common.search")}
                    </label>
                    <input
                      name="search"
                      type="search"
                      defaultValue={params.search}
                      placeholder="Search auctions..."
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t("auction.category")}
                    </label>
                    <select
                      name="category"
                      defaultValue={params.category || ""}
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500"
                    >
                      <option value="">{t("common.all")}</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.labelEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t("auction.condition")}
                    </label>
                    <select
                      name="condition"
                      defaultValue={params.condition || ""}
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500"
                    >
                      <option value="">{t("common.all")}</option>
                      {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.labelEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price range */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Price Range (৳)
                    </label>
                    <div className="flex gap-2">
                      <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="Min"
                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500" />
                      <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="Max"
                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500" />
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-2.5 bg-bid-500 hover:bg-bid-600 text-white text-sm font-semibold rounded-xl transition-colors">
                    Apply Filters
                  </button>
                </form>
              </ScrollReveal>

              {/* Auction grid */}
              <div className="flex-1">
                <Suspense fallback={<AuctionGridSkeleton count={9} />}>
                  <AuctionGrid filter={filter} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
