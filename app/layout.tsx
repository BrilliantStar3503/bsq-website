import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import HeaderWrapper from "@/components/ui/HeaderWrapper";
import BsqFooter from "@/components/ui/bsq-footer";
import UtmCapture from "@/components/ui/utm-capture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UtmCapture />
        <HeaderWrapper />
        {children}
        <BsqFooter />
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
