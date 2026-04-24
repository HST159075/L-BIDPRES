import Link from "next/link";
import { Check } from "lucide-react";
import { ROUTES } from "@/config/constants";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground">
          Your bid has been placed. You&apos;ll be notified if you win.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href={ROUTES.buyerDashboard}
            className="px-6 py-3 bg-bid-500 hover:bg-bid-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href={ROUTES.auctions}
            className="px-6 py-3 border border-border hover:bg-accent font-semibold rounded-xl transition-colors"
          >
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}
