import TrustStrip from "@/components/sections/trust-strip";
import HeroSection from "@/components/HeroSection";
import { FinancialAccordion } from "@/components/ui/interactive-image-accordion";
import TestimonialsWithMarquee from "@/components/blocks/testimonials-with-marquee";
import TestimonialList from "@/components/ui/testimonial-list";

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Trust Strip — Industry recognition ── */}
      <TrustStrip />

      {/* ── Financial Foundation Accordion ── */}
      <FinancialAccordion />

      {/* ── Real Client Testimonials (from Google Sheets) ── */}
      <TestimonialList />

      {/* ── Testimonials Marquee ── */}
      <TestimonialsWithMarquee />
    </main>
  );
}