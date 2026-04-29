"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Camera, Save, Loader, ShieldCheck, ShoppingBag, AlertTriangle, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useAuth } from "@/hooks/useAuth";
import { uploadService } from "@/services/upload.service";
import { showSuccess, showError } from "@/lib/error-handler";
import api from "@/lib/api";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function BuyerProfilePage() {
  const { user, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", avatar: user?.avatar || "" },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.upload(file, "image");
      form.setValue("avatar", res.url, { shouldValidate: true });
      setAvatarPreview(res.url);
    } catch {
      showError({ message: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    try {
      await api.put("/users/profile", data);
      showSuccess("Profile updated!");
    } catch (err) {
      showError(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { icon: ShoppingBag, label: "Purchases", value: user?.purchaseCount || 0, color: "text-green-500", bg: "bg-green-500/10" },
    { icon: AlertTriangle, label: "Strikes", value: `${user?.strikeCount || 0}/3`, color: "text-red-500", bg: "bg-red-500/10" },
    { icon: ShieldCheck, label: "Role", value: user?.role || "buyer", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Calendar, label: "Joined", value: new Date(user?.createdAt || "").toLocaleDateString("en-GB", { month: "short", year: "numeric" }), color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-2xl mx-auto px-4 sm:px-6">

          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">Manage your account</p>
          </ScrollReveal>

          {/* Avatar section */}
          <ScrollReveal className="mb-6">
            <div className="relative flex flex-col items-center py-10 bg-gradient-to-b from-[var(--color-bid-500)]/10 to-transparent border border-[var(--color-border)] rounded-2xl">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-bid-500)]/30 shadow-xl">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-bid-500)]/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[var(--color-bid-500)]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-bid-500)] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[var(--color-bid-600)] transition-colors">
                  {uploading ? (
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
              <p className="mt-3 font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{user?.email || user?.phone}</p>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal className="mb-6">
            <div className="grid grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-sm capitalize">{stat.value}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
              
              <div>
                <label className="text-sm font-semibold mb-2 block">Full Name</label>
                <input
                  {...form.register("name")}
                  className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] transition-all"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email readonly */}
              {user?.email && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-[var(--color-muted-foreground)]">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-xl text-[var(--color-muted-foreground)] cursor-not-allowed"
                  />
                </div>
              )}

              {/* Phone readonly */}
              {user?.phone && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-[var(--color-muted-foreground)]">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-xl text-[var(--color-muted-foreground)] cursor-not-allowed"
                  />
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSaving || uploading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </motion.button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}