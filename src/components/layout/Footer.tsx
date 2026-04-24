import Link        from "next/link";
import { Gavel }   from "lucide-react";
import { ROUTES }  from "@/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bid-500 rounded-lg flex items-center justify-center">
                <Gavel className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Bid<span className="text-bid-500">BD</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bangladesh&apos;s premier real-time auction platform for products and real estate.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href={ROUTES.auctions} className="block hover:text-foreground transition-colors">Browse Auctions</Link>
              <Link href={ROUTES.sellerApply} className="block hover:text-foreground transition-colors">Become a Seller</Link>
              <Link href={ROUTES.register} className="block hover:text-foreground transition-colors">Create Account</Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Account</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href={ROUTES.login} className="block hover:text-foreground transition-colors">Login</Link>
              <Link href={ROUTES.buyerDashboard} className="block hover:text-foreground transition-colors">Dashboard</Link>
              <Link href={ROUTES.buyerProfile} className="block hover:text-foreground transition-colors">Profile</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">Terms of Service</span>
              <span className="block">Privacy Policy</span>
              <span className="block">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BidBD. All rights reserved.</p>
          <p>Made with ❤️ in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
