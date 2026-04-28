import Link from "next/link";
import { Gavel } from "lucide-react";
import { ROUTES } from "@/config/constants";

// লিংকের জন্য ইন্টারফেস
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

  // লিংকের ডাটাগুলো আলাদা করে নেওয়া যাতে কোড হিজিবিজি না হয়
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
        { label: "Terms of Service", href: "#" }, // আপাতত হ্যাশ দেওয়া
        { label: "Privacy Policy", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href={ROUTES.home} className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 bg-bid-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Bid<span className="text-bid-500">BD</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              বাংলাদেশের প্রথম রিয়েল-টাইম অনলাইন অকশন প্ল্যাটফর্ম পণ্য এবং রিয়েল এস্টেটের জন্য।
            </p>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {section.title}
              </h4>
              <nav className="flex flex-col space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-bid-500 transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
            <p>© {currentYear} BidBD. All rights reserved.</p>
            <span className="hidden sm:inline text-border">|</span>
            <p>Built for the future of auctions.</p>
          </div>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}