import Link from "next/link";
import { Gavel, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/config/constants";

interface FooterLink { label: string; href: string; }
interface FooterSection { title: string; links: FooterLink[]; }

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections: FooterSection[] = [
    {
      title: "Platform",
      links: [
        { label: "Browse Auctions", href: ROUTES.auctions },
        { label: "Become a Seller", href: ROUTES.sellerApply },
        { label: "Create Account", href: ROUTES.register },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Login", href: ROUTES.login },
        { label: "Dashboard", href: ROUTES.buyerDashboard },
        { label: "Profile", href: ROUTES.buyerProfile },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-bid-500)]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link href={ROUTES.home} className="group flex items-center gap-2.5 w-fit">
              <div className="relative w-10 h-10 bg-[var(--color-bid-500)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-bid-500)]/30 group-hover:shadow-[var(--color-bid-500)]/50 transition-shadow">
                <Gavel className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-black text-xl tracking-tight">
                Bid<span className="text-[var(--color-bid-500)]">BD</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              বাংলাদেশের প্রথম রিয়েল-টাইম অনলাইন অকশন প্ল্যাটফর্ম।
            </p>
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live auctions running
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-foreground)]">
                {section.title}
              </h4>
              <nav className="flex flex-col space-y-2.5">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-bid-500)] transition-colors w-fit"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider with gradient */}
        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Bottom */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-muted-foreground)]">
          <p>© {currentYear} BidBD. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-red-500 animate-pulse">❤</span> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}