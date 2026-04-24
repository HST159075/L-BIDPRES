"use client";

import { useState, useEffect }    from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image                       from "next/image";
import { CheckCircle, XCircle }    from "lucide-react";
import { Navbar }                  from "@/components/layout/Navbar";
import { ScrollReveal }            from "@/components/animations/ScrollReveal";
import { SmoothScroll }            from "@/components/animations/SmoothScroll";
import { useRequireAuth }          from "@/hooks/useAuth";
import { getPendingApplicationsAction, approveApplicationAction, rejectApplicationAction } from "@/actions/admin.actions";
import { showSuccess, showError }  from "@/lib/error-handler";

interface SellerApp {
  id:              string;
  userId:          string;
  status:          string;
  idCardUrl:       string;
  profilePhotoUrl: string;
  user?: { name: string; email: string };
  createdAt:       string;
}

export default function AdminApplicationsPage() {
  const { user: adminUser, isLoading: authLoading } = useRequireAuth("admin");
  const [apps, setApps]           = useState<SellerApp[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [selectedId, setSelectedId]   = useState<string | null>(null);

  useEffect(() => {
    getPendingApplicationsAction(1)
      .then((res) => setApps((res.data as { data: SellerApp[] }).data || []))
      .catch(() => setApps([]))
      .finally(() => setAppsLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveApplicationAction(id);
      showSuccess("Application approved!");
      setApps(apps.filter(a => a.id !== id));
      setSelectedId(null);
    } catch (err) {
      showError(err);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectApplicationAction(id, reason);
      showSuccess("Application rejected!");
      setApps(apps.filter(a => a.id !== id));
      setSelectedId(null);
    } catch (err) {
      showError(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selected = apps.find(a => a.id === selectedId);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <ScrollReveal className="mt-8 mb-6">
            <h1 className="text-3xl font-bold">Seller Applications</h1>
            <p className="text-muted-foreground mt-1">Review pending seller applications</p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-[400px_1fr] gap-6">

            {/* List */}
            <ScrollReveal direction="left" className="lg:sticky lg:top-24 lg:h-fit">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {appsLoading ? (
                  <div className="p-6 text-center text-muted-foreground">Loading...</div>
                ) : apps.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No pending applications
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {apps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedId(app.id)}
                        className={`w-full p-4 text-left border-b border-border transition-colors ${
                          selectedId === app.id
                            ? "bg-bid-500/10 border-l-4 border-l-bid-500"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <p className="font-semibold text-sm">{app.user?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Detail */}
            <ScrollReveal direction="right">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-card border border-border rounded-2xl p-6 space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold">{selected.user?.name}</h2>
                      <p className="text-sm text-muted-foreground">{selected.user?.email}</p>
                    </div>

                    {/* ID Card */}
                    <div>
                      <p className="text-sm font-semibold mb-3">ID Card / Passport</p>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                        <Image
                          src={selected.idCardUrl}
                          alt="ID Card"
                          fill
                          className="object-cover"
                          sizes="500px"
                        />
                      </div>
                    </div>

                    {/* Profile Photo */}
                    <div>
                      <p className="text-sm font-semibold mb-3">Profile Photo</p>
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-muted mx-auto">
                        <Image
                          src={selected.profilePhotoUrl}
                          alt="Profile"
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => handleApprove(selected.id)}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(selected.id)}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-muted/50 rounded-2xl p-12 text-center text-muted-foreground"
                  >
                    <p>Select an application to review</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
