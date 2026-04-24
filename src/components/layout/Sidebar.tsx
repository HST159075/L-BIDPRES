"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gavel,
  User,
  ShoppingBag,
  ListChecks,
  PlusCircle,
  Users,
  FileText,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/config/constants";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.buyerDashboard,
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["buyer", "seller", "admin"],
  },
  {
    href: ROUTES.buyerBids,
    label: "My Bids",
    icon: Gavel,
    roles: ["buyer", "seller", "admin"],
  },
  {
    href: "/purchases",
    label: "Purchases",
    icon: ShoppingBag,
    roles: ["buyer", "seller", "admin"],
  },
  {
    href: ROUTES.buyerProfile,
    label: "Profile",
    icon: User,
    roles: ["buyer", "seller", "admin"],
  },
  {
    href: ROUTES.sellerDashboard,
    label: "Seller Dashboard",
    icon: BarChart3,
    roles: ["seller", "admin"],
  },
  {
    href: ROUTES.sellerListings,
    label: "My Listings",
    icon: ListChecks,
    roles: ["seller", "admin"],
  },
  {
    href: ROUTES.sellerNewListing,
    label: "New Listing",
    icon: PlusCircle,
    roles: ["seller", "admin"],
  },
  {
    href: ROUTES.adminDashboard,
    label: "Analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  { href: ROUTES.adminUsers, label: "Users", icon: Users, roles: ["admin"] },
  {
    href: ROUTES.adminApplications,
    label: "Applications",
    icon: FileText,
    roles: ["admin"],
  },
];

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
        {title}
      </p>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const buyerItems = NAV_ITEMS.filter(
    (i) => i.roles.includes(user.role) && i.roles.includes("buyer"),
  ).slice(0, 4);
  const sellerItems = NAV_ITEMS.filter(
    (i) => i.roles.includes(user.role) && i.roles[0] === "seller",
  );
  const adminItems = NAV_ITEMS.filter(
    (i) => i.roles.includes(user.role) && i.roles[0] === "admin",
  );

  return (
    <aside className={cn("w-60 shrink-0 space-y-6", className)}>
      {/* User info */}
      <div className="flex items-center gap-3 px-3 py-3 bg-muted/50 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-[var(--color-bid-500)] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role}
          </p>
        </div>
      </div>

      <nav className="space-y-5">
        <NavGroup title="Account" items={buyerItems} pathname={pathname} />
        <NavGroup title="Seller" items={sellerItems} pathname={pathname} />
        <NavGroup title="Admin" items={adminItems} pathname={pathname} />
      </nav>
    </aside>
  );
}
