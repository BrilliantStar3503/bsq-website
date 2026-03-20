import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BsqHeader } from "@/components/ui/bsq-header";
import BsqFooter from "@/components/ui/bsq-footer";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BsqHeader />
        {children}
        <BsqFooter />
      </body>
    </html>
  );
}
