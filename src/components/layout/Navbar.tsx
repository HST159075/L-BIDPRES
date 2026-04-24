"use client";

import Link             from "next/link";
import { usePathname }  from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState }     from "react";
import { useTheme }     from "next-themes";
import {
  Gavel, Menu, X, Sun, Moon, Globe,
  User, LayoutDashboard, LogOut, ChevronDown,
} from "lucide-react";
import { NotificationBell } from "@/components/common/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { authService }  from "@/services/auth.service";
import { showError }    from "@/lib/error-handler";
import { ROUTES }       from "@/config/constants";
import { cn }           from "@/lib/utils";

export function Navbar() {
  const t        = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout }              = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      window.location.href = ROUTES.login;
    } catch (err) {
      showError(err);
    }
  };

  const navLinks = [
    { href: ROUTES.home,     label: t("home") },
    { href: ROUTES.auctions, label: t("auctions") },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-8 h-8 rounded-lg bg-bid-500 flex items-center justify-center"
            >
              <Gavel className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight">
              Bid<span className="text-bid-500">BD</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {theme === "dark"
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </motion.button>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* User menu */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-bid-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={cn("w-3 h-3 transition-transform", userMenuOpen && "rotate-180")} />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-2 border-b border-border">
                          <p className="text-sm font-medium px-2">{user.name}</p>
                          <p className="text-xs text-muted-foreground px-2">{user.email || user.phone}</p>
                        </div>
                        <div className="p-1">
                          <Link href={ROUTES.buyerDashboard} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link href={ROUTES.buyerProfile} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          {(user.role === "seller" || user.role === "admin") && (
                            <Link href={ROUTES.sellerDashboard} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                              <Gavel className="w-4 h-4" /> Seller Panel
                            </Link>
                          )}
                          {user.role === "admin" && (
                            <Link href={ROUTES.adminDashboard} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className="p-1 border-t border-border">
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href={ROUTES.login}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("login")}
                </Link>
                <Link href={ROUTES.register}
                  className="px-4 py-2 text-sm font-medium bg-bid-500 text-white rounded-lg hover:bg-bid-600 transition-colors">
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden border-t border-border bg-background/95 glass"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-2 space-y-2">
                  <Link href={ROUTES.login} onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg text-sm font-medium border border-border hover:bg-accent text-center transition-colors">
                    {t("login")}
                  </Link>
                  <Link href={ROUTES.register} onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg text-sm font-medium bg-bid-500 text-white hover:bg-bid-600 text-center transition-colors">
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
