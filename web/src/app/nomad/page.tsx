import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductView } from "@/components/ProductView";
import { colorways, getColorway } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";

type NomadPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: NomadPageProps): Promise<Metadata> {
  const params = await searchParams;
  const requested = typeof params.color === "string" ? params.color : undefined;
  const initial = (requested && getColorway(requested)) || colorways[0];

  const title = `${initial.name} — KLΘT NOMAD, $${nomadMeta.priceUSD}`;
  const description = `Preorder the KLΘT NOMAD in ${initial.name} (${initial.tagline}). Zero-drop, five-toe barefoot shoe, Nsibidi-etched. $${nomadMeta.priceUSD} USD, shipping included. Ships October 2026.`;
  const ogImage = `/images/og/${initial.slug}.jpg`;

  return {
    title,
    description,
    alternates: { canonical: "/nomad" },
    openGraph: {
      title,
      description,
      url: `/nomad${requested ? `?color=${initial.slug}` : ""}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `KLΘT NOMAD, ${initial.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NomadPage({ searchParams }: NomadPageProps) {
  const params = await searchParams;
  const requested = typeof params.color === "string" ? params.color : undefined;
  const initial = (requested && getColorway(requested)) || colorways[0];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomad.klotworld.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${nomadMeta.brand} ${nomadMeta.model}`,
    description:
      "Zero-drop, five-toe barefoot shoe etched with Nsibidi symbols. Designed in Lagos.",
    sku: nomadMeta.sku,
    brand: { "@type": "Brand", name: nomadMeta.brand },
    image: colorways.map((cw) => `${siteUrl}${cw.images.sideA}`),
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/nomad`,
      priceCurrency: "USD",
      price: nomadMeta.priceUSD,
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="flex flex-1 flex-col pt-24">
        <ProductView initialColorwaySlug={initial.slug} />
      </main>
      <Footer />
    </>
  );
}
