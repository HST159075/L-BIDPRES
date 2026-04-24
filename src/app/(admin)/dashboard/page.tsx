"use client";

import { useEffect, useState }  from "react";
import { motion }               from "framer-motion";
import { BarChart3, Users, TrendingUp, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { Navbar }               from "@/components/layout/Navbar";
import { ScrollReveal }         from "@/components/animations/ScrollReveal";
import { SmoothScroll }         from "@/components/animations/SmoothScroll";
import { useRequireAuth }       from "@/hooks/useAuth";
import { getAnalyticsAction }   from "@/actions/admin.actions";

interface Analytics {
  totalUsers?:           number;
  totalAuctions?:        number;
  totalRevenue?:         number;
  platformCommission?:   number;
  activeAuctions?:       number;
  pendingApplications?:  number;
  totalStrikes?:         number;
  bannedUsers?:          number;
}

export default function AdminDashboardPage() {
  const { user, isLoading } = useRequireAuth("admin");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsAction()
      .then((res) => setAnalytics(res.data as Analytics || {}))
      .catch(() => setAnalytics({}))
      .finally(() => setAnalyticsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Users",         value: analytics?.totalUsers || 0,          icon: Users,        color: "text-blue-500" },
    { label: "Live Auctions",       value: analytics?.activeAuctions || 0,      icon: TrendingUp,   color: "text-green-500" },
    { label: "Platform Revenue",    value: `৳${(analytics?.platformCommission || 0).toLocaleString()}`, icon: DollarSign, color: "text-amber-500" },
    { label: "Strikes Issued",      value: analytics?.totalStrikes || 0,        icon: AlertCircle,  color: "text-red-500" },
    { label: "Pending Apps",        value: analytics?.pendingApplications || 0, icon: CheckCircle,  color: "text-purple-500" },
    { label: "Banned Users",        value: analytics?.bannedUsers || 0,         icon: BarChart3,    color: "text-destructive" },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <ScrollReveal className="mt-8 mb-10">
            <div>
              <p className="text-muted-foreground text-sm">Welcome back, admin</p>
              <h1 className="text-3xl font-bold mt-1">{user?.name}</h1>
              <p className="text-muted-foreground text-sm mt-2">Platform analytics and management</p>
            </div>
          </ScrollReveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.05}>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Quick Actions */}
          <ScrollReveal className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a href="/admin/users" className="block p-3 bg-muted rounded-xl hover:bg-accent transition-colors text-sm font-medium">
                  👥 Manage Users
                </a>
                <a href="/admin/applications" className="block p-3 bg-muted rounded-xl hover:bg-accent transition-colors text-sm font-medium">
                  📋 Review Applications
                </a>
                <a href="/admin/users" className="block p-3 bg-muted rounded-xl hover:bg-accent transition-colors text-sm font-medium">
                  ⚠️ Manage Strikes & Bans
                </a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Database</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> Connected</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Redis</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> Connected</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Socket.io</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> Active</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
