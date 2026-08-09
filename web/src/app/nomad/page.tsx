import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductView } from "@/components/ProductView";
import { colorways, getColorway } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";

export default async function NomadPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
