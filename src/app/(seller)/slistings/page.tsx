"use client";

import { useEffect, useState }   from "react";
import Link                       from "next/link";
import { motion }                 from "framer-motion";
import { Edit2, Trash2, Plus }    from "lucide-react";
import { Navbar }                 from "@/components/layout/Navbar";
import { ScrollReveal }           from "@/components/animations/ScrollReveal";
import { SmoothScroll }           from "@/components/animations/SmoothScroll";
import { useRequireAuth }         from "@/hooks/useAuth";
import { getMyListingsAction, deleteListingAction } from "@/actions/seller.actions";
import { showSuccess, showError } from "@/lib/error-handler";
import { ROUTES }                 from "@/config/constants";

interface Listing {
  id:    string;
  title: string;
  status: string;
}

export default function SellerListingsPage() {
  const { user, isLoading: authLoading } = useRequireAuth("seller");
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await getMyListingsAction(1, 50);
      setListings((res.data as { data: Listing[] }).data || []);
    } catch (err) {
      setListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeleting(id);
    try {
      await deleteListingAction(id);
      showSuccess("Listing deleted");
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      showError(err);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <ScrollReveal className="mt-8 mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Listings</h1>
              <p className="text-muted-foreground mt-1">Create and manage your auction listings</p>
            </div>
            <Link href={ROUTES.sellerNewListing}
              className="flex items-center gap-2 px-4 py-2.5 bg-bid-500 text-white text-sm font-semibold rounded-xl hover:bg-bid-600 transition-colors">
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </ScrollReveal>

          {/* Listings */}
          <ScrollReveal>
            {listingsLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <p className="font-medium mb-3">No listings yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first listing to start selling</p>
                <Link href={ROUTES.sellerNewListing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-bid-500 text-white text-sm font-semibold rounded-xl hover:bg-bid-600">
                  <Plus className="w-4 h-4" /> Create Listing
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-bid-500/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{listing.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className={`capitalize px-2 py-1 rounded-full ${
                          listing.status === "active"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        className="p-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
                        title="Edit listing"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={deleting === listing.id}
                        className="p-2 rounded-lg border border-destructive/30 hover:bg-destructive/10 transition-colors text-sm text-destructive disabled:opacity-50"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
