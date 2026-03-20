import TrustStrip from "@/components/sections/trust-strip";
import HeroSection from "@/components/HeroSection";
import { FinancialAccordion } from "@/components/ui/interactive-image-accordion";
import TestimonialsWithMarquee from "@/components/blocks/testimonials-with-marquee";

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Trust Strip — Industry recognition ── */}
      <TrustStrip />

      {/* ── Financial Foundation Accordion ── */}
      <FinancialAccordion />

      {/* ── Testimonials Marquee ── */}
      <TestimonialsWithMarquee />
    </main>
  );
}