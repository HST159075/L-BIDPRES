"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-bid-500)]/30 bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)] text-sm font-medium mb-6">
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6">Contact Us</h1>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We&apos;d love to hear from you. Our team typically responds within 2-4 hours.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
                <h2 className="font-bold text-lg">Contact Information</h2>
                <div className="space-y-4">
                  <a href="mailto:hsttasin90@gmail.com" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-bid-500)]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[var(--color-bid-500)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-[var(--color-bid-500)] transition-colors">Email</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">hsttasin90@gmail.com</p>
                    </div>
                  </a>
                  <a href="tel:+8801887238025" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-green-500 transition-colors">Phone</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">+880 1887-238025</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Address</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Business Hours</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">24/7 Online Support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick help */}
              <div className="bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent border border-[var(--color-bid-500)]/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-5 h-5 text-[var(--color-bid-500)]" />
                  <h3 className="font-bold text-sm">Need instant help?</h3>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Try our AI chatbot for quick answers to common questions about bidding, selling, and payments.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="font-bold text-lg mb-2">Send us a Message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us more about your question..."
                    className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] resize-none transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status !== "idle"}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <><Loader className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : status === "success" ? (
                    <><CheckCircle className="w-4 h-4" /> Message Sent!</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
