import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono }       from "next/font/google";
import { NextIntlClientProvider }  from "next-intl";
import { getLocale, getMessages }  from "next-intl/server";
import { ThemeProvider }           from "next-themes";
import { Toaster }                 from "react-hot-toast";
import { QueryProvider }           from "@/components/common/QueryProvider";
import { AuthProvider }            from "@/components/common/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
  display:  "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
});

export const metadata: Metadata = {
  title:       { default: "BidBD — Bangladesh Auction Platform", template: "%s | BidBD" },
  description: "Real-time product & real estate auctions in Bangladesh. Bid, win, and own.",
  keywords:    ["auction", "bangladesh", "bid", "real estate", "online auction", "নিলাম"],
  authors:     [{ name: "BidBD" }],
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         process.env.NEXT_PUBLIC_APP_URL,
    siteName:    "BidBD",
    title:       "BidBD — Bangladesh Auction Platform",
    description: "Real-time product & real estate auctions in Bangladesh.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale   = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <AuthProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "hsl(var(--card))",
                      color:      "hsl(var(--card-foreground))",
                      border:     "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    },
                  }}
                />
              </AuthProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
