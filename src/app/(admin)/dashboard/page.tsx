"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, DollarSign, AlertCircle, CheckCircle, Gavel, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useRequireAuth } from "@/hooks/useAuth";
import { getAnalyticsAction } from "@/actions/admin.actions";
import { formatPriceEn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";


interface Analytics {
  totalUsers: number;
  totalSellers: number;
  totalListings: number;
  activeAuctions: number;
  totalRevenue: number;
  pendingApps: number;
  totalStrikes: number;
  bannedUsers: number;
  wonAuctions: number;
  completedPayments: number;
}

interface ActionCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth("admin");
  const [analytics, setAnalytics] = useState<Partial<Analytics>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      getAnalyticsAction()
        .then((res) => setAnalytics(res.data?.data || {}))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-bid-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats: StatItem[] = [
    { label: "Total Users", value: analytics.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Sellers", value: analytics.totalSellers || 0, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Live Auctions", value: analytics.activeAuctions || 0, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Listings", value: analytics.totalListings || 0, icon: Gavel, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Won Auctions", value: analytics.wonAuctions || 0, icon: CheckCircle, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Completed Payments", value: analytics.completedPayments || 0, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Platform Revenue", value: formatPriceEn(Number(analytics.totalRevenue) || 0), icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pending Apps", value: analytics.pendingApps || 0, icon: CheckCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Strikes", value: analytics.totalStrikes || 0, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Banned Users", value: analytics.bannedUsers || 0, icon: Users, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar />
        <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="mb-10">
            <p className="text-[var(--color-muted-foreground)] text-sm font-medium uppercase tracking-wider">Admin Panel</p>
            <h1 className="text-4xl font-bold mt-1 tracking-tight">Platform Analytics</h1>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {loading ? <span className="animate-pulse bg-[var(--color-muted)] rounded w-16 h-8 block" /> : stat.value}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{stat.label}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <ScrollReveal delay={0.1}>
              <AnalyticsCharts 
                title="Revenue Overview" 
                type="area" 
                data={[
                  { name: "Jan", value: 4000 },
                  { name: "Feb", value: 3000 },
                  { name: "Mar", value: 5000 },
                  { name: "Apr", value: 4500 },
                  { name: "May", value: 6000 },
                  { name: "Jun", value: 5500 },
                ]} 
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <AnalyticsCharts 
                title="User Growth" 
                type="bar" 
                data={[
                  { name: "Mon", value: 120 },
                  { name: "Tue", value: 150 },
                  { name: "Wed", value: 180 },
                  { name: "Thu", value: 220 },
                  { name: "Fri", value: 190 },
                  { name: "Sat", value: 250 },
                  { name: "Sun", value: 310 },
                ]} 
              />
            </ScrollReveal>
          </div>

          <ScrollReveal>

            <h2 className="font-bold text-xl mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ActionCard href={ROUTES.adminUsers} icon={Users} title="Manage Users" description="Strike, ban, or unban users" />
              <ActionCard href={ROUTES.adminApplications} icon={CheckCircle} title="Review Applications" description="Approve or reject seller applications" />
              <ActionCard href={ROUTES.auctions} icon={Gavel} title="Browse Auctions" description="View all live auctions" />
            </div>
          </ScrollReveal>

          {/* ✅ pendingApps ব্যবহার করুন */}
          {!loading && (analytics.pendingApps ?? 0) > 0 && (
            <ScrollReveal className="mt-8">
              <div className="flex items-center justify-between p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium">
                    {analytics.pendingApps} seller application{(analytics.pendingApps ?? 0) > 1 ? "s" : ""} waiting for review
                  </p>
                </div>
                <Link href={ROUTES.adminApplications} className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all">
                  Review Now
                </Link>
              </div>
            </ScrollReveal>
          )}
        </main>
      </div>
    </SmoothScroll>
  );
}

function ActionCard({ href, icon: Icon, title, description }: ActionCardProps) {
  return (
    <Link href={href}>
      <motion.div whileHover={{ y: -4 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-bid-500)]/50 transition-all group shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-bid-500)]/10 flex items-center justify-center group-hover:bg-[var(--color-bid-500)]/20 transition-colors">
            <Icon className="w-6 h-6 text-[var(--color-bid-500)]" />
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-bid-500)] group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="font-bold text-base mb-1">{title}</h3>
        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">{description}</p>
      </motion.div>
    </Link>
  );
}