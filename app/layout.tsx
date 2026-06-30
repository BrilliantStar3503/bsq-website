import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import HeaderWrapper from "@/components/ui/HeaderWrapper";
import FooterWrapper from "@/components/ui/FooterWrapper";
import UtmCapture from "@/components/ui/utm-capture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif — major headlines only (hero, section titles).
// Body copy and card text stay on Geist sans. See PRUBSQ_WEBSITE.md for
// the design-system note on where each font is used.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brilliant Star Quartz — Financial Assessment",
  description: "AI-powered financial assessment system to identify your protection gaps and connect you with the right financial solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Calendly popup widget styles */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <UtmCapture />
        <HeaderWrapper />
        {children}
        <FooterWrapper />
        <Analytics />
        {/* Calendly popup widget script — loads after page is interactive */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
