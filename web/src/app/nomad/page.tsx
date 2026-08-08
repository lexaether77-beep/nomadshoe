import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductView } from "@/components/ProductView";
import { colorways, getColorway } from "@/lib/colorways";

export default async function NomadPage(props: PageProps<"/nomad">) {
  const params = await props.searchParams;
  const requested = typeof params.color === "string" ? params.color : undefined;
  const initial = (requested && getColorway(requested)) || colorways[0];

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pt-24">
        <ProductView initialColorwaySlug={initial.slug} />
      </main>
      <Footer />
    </>
  );
}
