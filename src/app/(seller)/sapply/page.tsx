"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useAuth } from "@/hooks/useAuth";
import { showSuccess, showError } from "@/lib/error-handler";
import { sellerService } from "@/services/seller.service";
import { uploadService } from "@/services/upload.service";

const applySchema = z.object({
  idCardUrl: z.string().url("Valid image URL required"),
  profilePhotoUrl: z.string().url("Valid image URL required"),
});
type ApplyForm = z.infer<typeof applySchema>;

export default function SellerApplyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [appStatus, setAppStatus] = useState<{
    status?: string;
    id?: string;
  } | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
    defaultValues: { idCardUrl: "", profilePhotoUrl: "" },
  });

  const isSeller = user?.role === "seller" || user?.role === "admin";
  const displayAppStatus = isSeller ? { status: "approved" } : appStatus;

  useEffect(() => {
    if (!user || isSeller) return;
    sellerService
      .getApplicationStatus()
      .then((data) => setAppStatus(data || null))
      .catch(() => setAppStatus(null));
  }, [user, isSeller]);

  const canApply = (user?.purchaseCount || 0) >= 1;

  const handleFileUpload = async (
    file: File,
    field: "idCardUrl" | "profilePhotoUrl",
  ) => {
    setUploading(true);
    try {
      const res = await uploadService.upload(file, "image");
      form.setValue(field, res.url, { shouldValidate: true });
    } catch {
      showError({ message: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ApplyForm) => {
    if (!canApply) {
      showError({ message: "You need at least 1 purchase to apply" });
      return;
    }
    setIsApplying(true);
    try {
      await sellerService.apply(data);
      showSuccess("Application submitted! We'll review it shortly.");
      setAppStatus({ status: "pending", id: "new" });
      form.reset();
    } catch (err) {
      showError(err);
    } finally {
      setIsApplying(false);
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
        <div className="pt-20 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">Become a Seller</h1>
            <p className="text-muted-foreground mt-1">
              Start selling items on BidBD
            </p>
          </ScrollReveal>

          {displayAppStatus?.status === "approved" ? (
            <ScrollReveal className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl flex gap-3 items-start">
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-700">
                  Youre a verified seller!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  You can now create listings and start selling.
                </p>
              </div>
            </ScrollReveal>
          ) : displayAppStatus?.status === "pending" ? (
            <ScrollReveal className="mb-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex gap-3 items-start">
              <Clock className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-700">
                  Application under review
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Well notify you once reviewed.
                </p>
              </div>
            </ScrollReveal>
          ) : displayAppStatus?.status === "rejected" ? (
            <ScrollReveal className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex gap-3 items-start">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">
                  Application rejected
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Please contact support for more details.
                </p>
              </div>
            </ScrollReveal>
          ) : null}

          {displayAppStatus?.status !== "approved" && (
            <ScrollReveal className="mb-8">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Requirements</h2>
                <div className="space-y-3">
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg ${(user?.purchaseCount || 0) >= 1 ? "bg-green-500/10" : "bg-yellow-500/10"}`}
                  >
                    {(user?.purchaseCount || 0) >= 1 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <p className="font-medium">Minimum 1 purchase</p>
                      <p className="text-muted-foreground">
                        You have {user?.purchaseCount || 0}/1
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Valid ID Card or Passport</p>
                      <p className="text-muted-foreground">
                        Clear photos required
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Profile photo</p>
                      <p className="text-muted-foreground">
                        Professional or clear selfie
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {displayAppStatus?.status === "pending" ? (
            <ScrollReveal className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Your application is being reviewed. Please wait...</p>
            </ScrollReveal>
          ) : displayAppStatus?.status === "approved" ? null : (
            <ScrollReveal>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-card border border-border rounded-2xl p-6 space-y-6"
              >
                {/* ID Card Upload */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">
                    <Upload className="w-4 h-4 inline mr-2" />
                    ID Card / Passport
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "idCardUrl");
                    }}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-bid-500 file:text-white file:text-xs file:font-semibold"
                  />
                  {form.watch("idCardUrl") && (
                    <img
                      src={form.watch("idCardUrl")}
                      className="mt-2 h-24 rounded-lg object-cover"
                      alt="ID Card"
                    />
                  )}
                  {form.formState.errors.idCardUrl && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.idCardUrl.message}
                    </p>
                  )}
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "profilePhotoUrl");
                    }}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-bid-500 file:text-white file:text-xs file:font-semibold"
                  />
                  {form.watch("profilePhotoUrl") && (
                    <img
                      src={form.watch("profilePhotoUrl")}
                      className="mt-2 h-24 w-24 rounded-lg object-cover"
                      alt="Profile"
                    />
                  )}
                  {form.formState.errors.profilePhotoUrl && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.profilePhotoUrl.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isApplying || !canApply || uploading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 bg-bid-500 hover:bg-bid-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading
                    ? "Uploading..."
                    : isApplying
                      ? "Submitting..."
                      : "Submit Application"}
                </motion.button>

                {!canApply && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-700">
                    ⚠️ You need at least 1 purchase to apply. Keep bidding!
                  </div>
                )}
              </form>
            </ScrollReveal>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}
