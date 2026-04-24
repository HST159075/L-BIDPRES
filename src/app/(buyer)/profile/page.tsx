"use client";

import { useState }              from "react";
import { useForm }               from "react-hook-form";
import { zodResolver }           from "@hookform/resolvers/zod";
import { z }                     from "zod";
import { motion }                from "framer-motion";
import { User, Mail, Phone, Loader, Save } from "lucide-react";
import { Navbar }                from "@/components/layout/Navbar";
import { ScrollReveal }          from "@/components/animations/ScrollReveal";
import { SmoothScroll }          from "@/components/animations/SmoothScroll";
import { useAuth }               from "@/hooks/useAuth";
import { showSuccess, showError } from "@/lib/error-handler";
import api                       from "@/lib/api";

const profileSchema = z.object({
  name:   z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function BuyerProfilePage() {
  const { user, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileForm>({
    resolver:      zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", avatar: "" },
  });

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

          {/* Header */}
          <ScrollReveal className="mt-8 mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">Update your account information</p>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-6">

              {/* Avatar */}
              <div>
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile Picture
                </label>
                {user?.avatar && (
                  <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-3 object-cover" />
                )}
                <input
                  {...form.register("avatar")}
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bid-500"
                />
                {form.formState.errors.avatar && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.avatar.message}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Full Name
                </label>
                <input
                  {...form.register("name")}
                  type="text"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bid-500"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email (Read-only)
                </label>
                <input type="email" value={user?.email || ""} disabled
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed" />
              </div>

              {/* Phone (readonly) */}
              {user?.phone && (
                <div>
                  <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone (Read-only)
                  </label>
                  <input type="tel" value={user.phone} disabled
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed" />
                </div>
              )}

              {/* Account Info */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Role</span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchases</span>
                  <span className="font-medium">{user?.purchaseCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strikes</span>
                  <span className={`font-medium ${(user?.strikeCount || 0) > 0 ? "text-red-500" : "text-green-500"}`}>
                    {user?.strikeCount || 0}/3
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">{new Date(user?.createdAt || "").toLocaleDateString()}</span>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSaving}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 bg-bid-500 hover:bg-bid-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </motion.button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
