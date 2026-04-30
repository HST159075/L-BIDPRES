"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, CheckCircle, Gavel, BarChart3,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";

const ADMIN_MENU = [
  { href: ROUTES.adminDashboard, icon: LayoutDashboard, label: "Overview" },
  { href: ROUTES.adminUsers, icon: Users, label: "Users" },
  { href: ROUTES.adminApplications, icon: CheckCircle, label: "Applications" },
  { href: ROUTES.auctions, icon: Gavel, label: "Auctions" },
  { href: ROUTES.adminDashboard, icon: BarChart3, label: "Reports" },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="hidden lg:flex flex-col bg-[var(--color-card)] border-r border-[var(--color-border)] h-screen sticky top-0 z-40 shrink-0"
    >
      {/* Logo */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-bid-500)] flex items-center justify-center shrink-0">
          <Gavel className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="font-black text-sm">Admin Panel</p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">BidBD Platform</p>
          </motion.div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_MENU.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                isActive
                  ? "bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-bid-500)] rounded-r-full"
                />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-[var(--color-accent)] text-[var(--color-muted-foreground)] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
