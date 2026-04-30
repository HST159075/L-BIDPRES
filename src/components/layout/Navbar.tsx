"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Gavel, Menu, X, Sun, Moon,
  User, LayoutDashboard, LogOut, ChevronDown,
  Heart, HelpCircle, FileText, Info,
  ShoppingBag, Settings,
} from "lucide-react";
import { NotificationBell } from "@/components/common/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { showError } from "@/lib/error-handler";
import { ROUTES } from "@/config/constants";
import { cn } from "@/lib/utils";
import { setAuthToken } from "@/lib/api";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout().catch(() => {});
      setAuthToken(null);
      logout();
      window.location.href = ROUTES.login;
    } catch (err) {
      showError(err);
    }
  };

  // Logged-out nav: 4+ routes
  const publicNavLinks = [
    { href: ROUTES.home, label: t("home") },
    { href: ROUTES.auctions, label: t("auctions") },
    { href: ROUTES.about, label: "About" },
    { href: ROUTES.contact, label: "Contact" },
  ];

  // Explore dropdown items
  const exploreItems = [
    { href: ROUTES.blog, label: "Blog", icon: FileText, desc: "Tips & guides" },
    { href: ROUTES.help, label: "Help Center", icon: HelpCircle, desc: "FAQs & support" },
    { href: ROUTES.about, label: "About Us", icon: Info, desc: "Our story" },
  ];

  // Logged-in nav: 6+ routes (Home, Auctions, Dashboard, My Bids, Explore dropdown, + user menu items)
  const loggedInNavLinks = [
    { href: ROUTES.home, label: t("home") },
    { href: ROUTES.auctions, label: t("auctions") },
    { href: ROUTES.buyerDashboard, label: "Dashboard" },
    { href: ROUTES.buyerBids, label: "My Bids" },
  ];

  const navLinks = user ? loggedInNavLinks : publicNavLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-[var(--color-border)]/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-9 h-9 rounded-xl bg-[var(--color-bid-500)] flex items-center justify-center shadow-lg shadow-[var(--color-bid-500)]/30"
            >
              <Gavel className="w-4.5 h-4.5 text-white" />
              {/* Ping effect */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--color-background)]">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              </span>
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight">
                Bid<span className="text-[var(--color-bid-500)]">BD</span>
              </span>
              <span className="text-[9px] text-[var(--color-muted-foreground)] uppercase tracking-[0.2em] font-medium">
                Live Auctions
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[var(--color-muted)]/50 backdrop-blur">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                )}
              >
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-[var(--color-background)] shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}

            {/* Explore dropdown */}
            <div ref={exploreRef} className="relative">
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className={cn(
                  "flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                )}
              >
                Explore
                <motion.div animate={{ rotate: exploreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden z-30"
                  >
                    <div className="p-2 space-y-0.5">
                      {exploreItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-accent)] transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[var(--color-bid-500)]/10 flex items-center justify-center group-hover:bg-[var(--color-bid-500)]/20 transition-colors">
                            <item.icon className="w-4 h-4 text-[var(--color-bid-500)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">

            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-[var(--color-accent)] transition-colors text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {user ? (
              <>
                <NotificationBell />

                {/* User menu */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-[var(--color-accent)] transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name[0].toUpperCase()
                      )}
                      {/* Online dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border-2 border-[var(--color-background)]" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden z-20"
                        >
                          {/* User info header */}
                          <div className="p-4 bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent border-b border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 flex items-center justify-center text-white font-bold">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  user.name[0].toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-[var(--color-muted-foreground)] truncate">{user.email || user.phone}</p>
                                <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] capitalize">
                                  {user.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="p-2 space-y-0.5">
                            {[
                              { href: ROUTES.buyerDashboard, icon: LayoutDashboard, label: "Dashboard" },
                              { href: ROUTES.buyerProfile, icon: User, label: "Profile" },
                              { href: ROUTES.buyerBids, icon: ShoppingBag, label: "My Bids" },
                              ...(user.role === "seller" || user.role === "admin"
                                ? [{ href: ROUTES.sellerDashboard, icon: Gavel, label: "Seller Panel" }]
                                : []),
                              ...(user.role === "admin"
                                ? [{ href: ROUTES.adminDashboard, icon: Settings, label: "Admin Panel" }]
                                : []),
                              { href: ROUTES.help, icon: HelpCircle, label: "Help Center" },
                            ].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--color-accent)] transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                                {item.label}
                              </Link>
                            ))}
                          </div>

                          <div className="p-2 border-t border-[var(--color-border)]">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={ROUTES.login}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href={ROUTES.register}
                  className="px-4 py-2 text-sm font-medium bg-[var(--color-bid-500)] text-white rounded-xl hover:bg-[var(--color-bid-600)] transition-colors shadow-lg shadow-[var(--color-bid-500)]/25"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-accent)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-xl"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)]"
                      : "hover:bg-[var(--color-accent)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Explore links in mobile */}
              <div className="pt-2 border-t border-[var(--color-border)] mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Explore</p>
                {exploreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--color-accent)] transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="pt-3 space-y-2 border-t border-[var(--color-border)]">
                  <Link
                    href={ROUTES.login}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-3 rounded-xl text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-accent)] text-center transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={ROUTES.register}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-3 rounded-xl text-sm font-medium bg-[var(--color-bid-500)] text-white hover:bg-[var(--color-bid-600)] text-center transition-colors"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}