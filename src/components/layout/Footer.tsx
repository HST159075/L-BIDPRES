import Link from "next/link";
import { Gavel, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { ROUTES } from "@/config/constants";

interface FooterLink {
  label: string;
  href: string;
}
interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections: FooterSection[] = [
    {
      title: "Platform",
      links: [
        { label: "Browse Auctions", href: ROUTES.auctions },
        { label: "Become a Seller", href: ROUTES.sellerApply },
        { label: "Create Account", href: ROUTES.register },
        { label: "How It Works", href: `${ROUTES.home}#how-it-works` },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Login", href: ROUTES.login },
        { label: "Dashboard", href: ROUTES.buyerDashboard },
        { label: "Profile", href: ROUTES.buyerProfile },
        { label: "My Bids", href: ROUTES.buyerBids },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: ROUTES.about },
        { label: "Contact", href: ROUTES.contact },
        { label: "Blog", href: ROUTES.blog },
        { label: "Help Center", href: ROUTES.help },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: ROUTES.terms },
        { label: "Privacy Policy", href: ROUTES.privacy },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com/bidbd",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      href: "https://twitter.com/bidbd",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://instagram.com/bidbd",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@bidbd",
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon
            points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-bid-500)]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-5">
            <Link
              href={ROUTES.home}
              className="group flex items-center gap-2.5 w-fit"
            >
              <div className="relative w-10 h-10 bg-[var(--color-bid-500)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-bid-500)]/30 group-hover:shadow-[var(--color-bid-500)]/50 transition-shadow">
                <Gavel className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-black text-xl tracking-tight">
                Bid<span className="text-[var(--color-bid-500)]">BD</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              বাংলাদেশের প্রথম রিয়েল-টাইম অনলাইন অকশন প্ল্যাটফর্ম। Buy and sell
              products & real estate through exciting live auctions.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <a
                href="mailto:hsttasin90@gmail.com"
                className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-bid-500)] transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                hsttasin90@gmail.com
              </a>
              <a
                href="tel:+8801887238025"
                className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-bid-500)] transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                +880 1887-238025
              </a>
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <MapPin className="w-4 h-4 shrink-0" />
                Dhaka, Bangladesh
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-[var(--color-muted)] hover:bg-[var(--color-bid-500)]/10 flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-bid-500)] transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>

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
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.terms}
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              Terms
            </Link>
            <Link
              href={ROUTES.privacy}
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              Privacy
            </Link>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-500 animate-pulse">❤</span> in
              Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
