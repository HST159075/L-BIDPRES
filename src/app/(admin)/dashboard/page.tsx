"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Gavel,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useRequireAuth } from "@/hooks/useAuth";
import { getAnalyticsAction } from "@/actions/admin.actions";
import { formatPriceEn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";

interface Analytics {
  totalUsers?: number;
  totalAuctions?: number;
  totalRevenue?: number;
  platformCommission?: number;
  activeAuctions?: number;
  pendingApplications?: number;
  totalStrikes?: number;
  bannedUsers?: number;
}

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth("admin");
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsAction()
      .then((res) => setAnalytics((res.data as Analytics) || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: analytics.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Live Auctions",
      value: analytics.activeAuctions || 0,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Platform Revenue",
      value: formatPriceEn(analytics.platformCommission || 0),
      icon: DollarSign,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Pending Apps",
      value: analytics.pendingApplications || 0,
      icon: CheckCircle,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Strikes",
      value: analytics.totalStrikes || 0,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Banned Users",
      value: analytics.bannedUsers || 0,
      icon: Users,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      href: ROUTES.adminUsers,
      icon: Users,
      desc: "Strike, ban, or unban users",
    },
    {
      label: "Review Applications",
      href: ROUTES.adminApplications,
      icon: CheckCircle,
      desc: "Approve or reject seller applications",
    },
    {
      label: "Browse Auctions",
      href: ROUTES.auctions,
      icon: Gavel,
      desc: "View all live auctions",
    },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mt-8 mb-10">
            <p className="text-[var(--color-muted-foreground)] text-sm">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold mt-1">Platform Analytics</h1>
          </ScrollReveal>

          {/* Stats Grid */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? (
                        <span className="animate-pulse bg-[var(--color-muted)] rounded w-12 h-6 inline-block" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Quick Actions */}
          <ScrollReveal>
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-bid-500)]/40 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bid-500)]/10 flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-[var(--color-bid-500)]" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-bid-500)] group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                      {action.desc}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Pending applications alert */}
          {(analytics.pendingApplications || 0) > 0 && (
            <ScrollReveal className="mt-6">
              <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <p className="text-sm font-medium">
                    {analytics.pendingApplications} seller application
                    {(analytics.pendingApplications || 0) > 1 ? "s" : ""}{" "}
                    waiting for review
                  </p>
                </div>
                <Link
                  href={ROUTES.adminApplications}
                  className="px-3 py-1.5 text-xs bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Review Now
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}
