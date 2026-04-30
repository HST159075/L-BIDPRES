import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "BidBD Terms of Service — Rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium mb-6">
              Legal
            </div>
            <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
            <p className="text-[var(--color-muted-foreground)]">Last updated: April 30, 2026</p>
          </div>

          <div className="space-y-8">
            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                By accessing and using BidBD, you agree to be bound by these Terms of Service. If you do not agree 
                to these terms, please do not use our platform. We reserve the right to modify these terms at any time.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">2. User Accounts</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                You must provide accurate and complete information when creating an account. You are responsible for 
                maintaining the security of your account credentials. Each person may only maintain one account. 
                Duplicate accounts will be terminated.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">3. Bidding Rules</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                All bids are binding commitments to purchase. Once placed, bids cannot be retracted. Winners must 
                complete payment within 48 hours. Failure to pay results in a strike on your account. Three strikes 
                may result in permanent account suspension.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">4. Seller Requirements</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                Sellers must complete identity verification before listing items. All listed items must be accurately 
                described with genuine photos. Sellers must ship items within 3 business days of payment confirmation. 
                Counterfeit or prohibited items will result in immediate account termination.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">5. Payments & Fees</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                BidBD charges a 15% platform commission on successful auction sales. Payments are processed securely 
                through SSLCommerz and bKash. Funds are held in escrow until the buyer confirms delivery. Refunds are 
                processed within 7-14 business days.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">6. Prohibited Conduct</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                Users may not engage in shill bidding, bid manipulation, fraud, harassment, or any activity that 
                undermines the integrity of the platform. Violation of these rules may result in immediate account 
                termination and legal action.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">7. Limitation of Liability</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                BidBD acts as a marketplace facilitator and is not responsible for the quality, safety, or legality 
                of items listed by sellers. We provide dispute resolution assistance but are not liable for 
                transactions between users. Use the platform at your own risk.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">8. Contact</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                For questions regarding these Terms of Service, please contact us at support@bidbd.com or 
                call +880 1700-000000.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
