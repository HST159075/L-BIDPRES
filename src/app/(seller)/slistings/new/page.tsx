"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ListingForm } from "@/components/seller/ListingForm";
import type { ListingFormData } from "@/components/seller/ListingForm";
import { useRequireAuth } from "@/hooks/useAuth";
import { sellerService } from "@/services/seller.service";
import { showSuccess, showError } from "@/lib/error-handler";
import { ROUTES } from "@/config/constants";

export default function NewListingPage() {
  const router = useRouter();
  useRequireAuth("seller");

 const handleSubmit = async (data: ListingFormData) => {
    try {
      const payload = {
        ...data,
        // datetime-local → ISO string
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        // empty string হলে videoUrl পাঠাবে না
        videoUrl: data.videoUrl?.trim() || undefined,
      };

      await sellerService.createListing(payload as Record<string, unknown>);
      showSuccess("Listing created successfully!");
      router.push(ROUTES.sellerListings);
    } catch (err) {
      showError(err);
      throw err;
    }
  };


  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">Create New Listing</h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Add a product for auction
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <ListingForm onSubmit={handleSubmit} submitLabel="Create Listing" />
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}