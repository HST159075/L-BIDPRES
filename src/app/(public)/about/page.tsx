import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ROUTES } from "@/config/constants";
import { Users, Target, Globe, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about BidBD — Bangladesh's premier real-time online auction platform.",
};

const TEAM = [
  { name: "BidBD Team", role: "Platform Development", avatar: "B" },
  { name: "Support Team", role: "Customer Success", avatar: "S" },
  { name: "Trust & Safety", role: "Verification", avatar: "T" },
  { name: "Engineering", role: "Technology", avatar: "E" },
];

const VALUES = [
  { icon: Users, title: "Community First", desc: "We build for our users. Every feature is designed with buyer and seller needs in mind." },
  { icon: Target, title: "Transparency", desc: "Open and fair auctions with real-time bidding and clear pricing for everyone." },
  { icon: Globe, title: "Made in Bangladesh", desc: "Built by Bangladeshis, for Bangladeshis. Supporting local commerce and entrepreneurship." },
  { icon: Award, title: "Trust & Safety", desc: "Verified sellers, escrow payments, and a dedicated team ensuring safe transactions." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium mb-6">
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            Revolutionizing Auctions in{" "}
            <span className="gradient-text">Bangladesh</span>
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            BidBD is Bangladesh&apos;s first real-time online auction platform, connecting buyers and sellers 
            through exciting, transparent, and secure live auctions. From electronics to real estate, 
            we&apos;re making auctions accessible to everyone.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-[var(--color-muted)]/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  We believe everyone deserves a fair chance to buy and sell. Our mission is to democratize 
                  commerce in Bangladesh through technology, making auctions transparent, accessible, and exciting 
                  for millions of people.
                </p>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  Since our launch, we&apos;ve facilitated over 9,800 successful transactions, served 18,000+ 
                  active users, and maintained a 99.9% platform uptime — all while ensuring every transaction 
                  is secure and fair.
                </p>
                <Link href={ROUTES.register} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-semibold rounded-2xl transition-all">
                  Join Our Community <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-[var(--color-bid-500)]">2,400+</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Live Auctions</p>
                </div>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-green-500">18,000+</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Active Users</p>
                </div>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-blue-500">9,800+</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Items Sold</p>
                </div>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-purple-500">1,200+</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Verified Sellers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-[var(--color-muted-foreground)] mt-3">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-bid-500)]/30 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-bid-500)]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[var(--color-bid-500)]" />
                </div>
                <h3 className="font-bold text-base mb-2">{value.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-[var(--color-muted)]/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold">Our Team</h2>
              <p className="text-[var(--color-muted-foreground)] mt-3">The people behind BidBD.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
