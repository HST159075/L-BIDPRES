import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BidBD Privacy Policy — How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium mb-6">
              Legal
            </div>
            <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
            <p className="text-[var(--color-muted-foreground)]">Last updated: April 30, 2026</p>
          </div>

          <div className="prose-custom space-y-8">
            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">1. Information We Collect</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                We collect information you provide directly, including your name, email address, phone number, 
                and government-issued ID (for seller verification). We also automatically collect device information, 
                IP addresses, browser type, and usage data to improve our services.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                Your information is used to provide and improve our auction platform, process transactions, 
                verify seller identities, send notifications about your bids and auctions, provide customer support, 
                and ensure platform security and fraud prevention.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">3. Payment Security</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                All payment processing is handled through secure third-party providers (SSLCommerz and bKash). 
                We do not store your credit card or banking information on our servers. All transactions use 
                256-bit SSL encryption.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">4. Data Sharing</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                We do not sell your personal data to third parties. We may share limited information with 
                payment processors, delivery partners, and law enforcement when legally required. Seller profiles 
                are visible to potential buyers as part of the auction process.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">5. Cookies & Tracking</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                We use essential cookies for authentication and session management. Analytics cookies help us 
                understand how users interact with our platform. You can manage cookie preferences through your 
                browser settings.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">6. Your Rights</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                You have the right to access, update, or delete your personal information at any time through 
                your profile settings. You can request a complete data export or account deletion by contacting 
                our support team at support@bidbd.com.
              </p>
            </section>

            <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">7. Contact Us</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at support@bidbd.com or 
                call +880 1700-000000. Our data protection team will respond within 48 hours.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
