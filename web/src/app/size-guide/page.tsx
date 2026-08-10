import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Size Guide — KLΘT NOMAD",
  description:
    "Find your KLΘT NOMAD size — measurement instructions and a US/UK/EU/Asia conversion chart.",
};

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-28 pb-24"
      >
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Guide
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Size Guide
        </h1>
        <p className="mt-4 max-w-lg text-muted leading-relaxed">
          NOMAD runs on a two-size scale &mdash; each mold covers two
          consecutive EU sizes for the best balance of fit and comfort.
          Measure your foot length and match it against the chart below. If
          you fall between sizes, we recommend sizing up.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-line">
          <Image
            src="/images/guides/size-chart.jpg"
            alt="KLΘT NOMAD size chart: EU sizes 35–46 paired in a two-size scale (35/36 through 45/46), with US Men, US Women, UK, and Asia (cm) equivalents. Measure foot length from heel to the tip of the longest toe."
            width={1080}
            height={720}
            className="w-full h-auto"
          />
        </div>

        <p className="mt-8 text-sm text-muted leading-relaxed">
          Still unsure? Email{" "}
          <a
            href="mailto:hello@klotworld.com"
            className="text-gold-ink hover:underline"
          >
            hello@klotworld.com
          </a>{" "}
          with your foot length and we&rsquo;ll help you find your size
          before you order.
        </p>
      </main>
      <Footer />
    </>
  );
}
