"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ListingForm } from "@/components/seller/ListingForm";
import type { ListingFormData } from "@/components/seller/ListingForm";
import { useRequireAuth } from "@/hooks/useAuth";
import { getListingAction } from "@/actions/auction.actions";
import { updateListingAction } from "@/actions/seller.actions";
import { showSuccess, showError } from "@/lib/error-handler";
import { ROUTES } from "@/config/constants";
import type { Listing } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useRequireAuth("seller");
  const [listing, setListing] = useState<Listing | null>(null);
  const [fetching, setFetching] = useState(true);
  const [listingId, setListingId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setListingId(id);
      getListingAction(id)
        .then((data) => setListing(data))
        .catch(() => showError({ message: "Listing not found" }))
        .finally(() => setFetching(false));
    });
  }, [params]);

const handleSubmit = async (data: ListingFormData) => {
  try {
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      videoUrl: data.videoUrl?.trim() || undefined,
    };
    await updateListingAction(listingId, payload as Record<string, unknown>);
    showSuccess("Listing updated!");
    router.push(ROUTES.sellerListings);
  } catch (err) {
    showError(err);
    throw err;
  }
};

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Listing not found</p>
          <button
            onClick={() => router.back()}
            className="mt-3 text-sm text-bid-500 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const defaultValues: Partial<ListingFormData> = {
    title: listing.title,
    description: listing.description,
    category: listing.category,
    condition: listing.condition,
    brand: listing.brand,
    location: listing.location,
    shippingCost: listing.shippingCost,
    photos: listing.photos,
    videoUrl: listing.videoUrl,
    startingPrice: listing.auction?.startingPrice,
    bidIncrement: listing.auction?.bidIncrement,
    startTime: listing.auction?.startTime
      ? new Date(listing.auction.startTime).toISOString().slice(0, 16)
      : undefined,
    endTime: listing.auction?.endTime
      ? new Date(listing.auction.endTime).toISOString().slice(0, 16)
      : undefined,
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground mt-1">{listing.title}</p>
          </ScrollReveal>

          <ScrollReveal>
            <ListingForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
