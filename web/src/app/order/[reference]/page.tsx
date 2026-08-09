import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { db } from "@/lib/db";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const order = await db.order.findUnique({
    where: { reference },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <>
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <OrderConfirmation
          reference={order.reference}
          initialStatus={order.status}
          items={order.items.map((item) => ({
            colorwaySlug: item.colorwaySlug,
            size: item.size,
            quantity: item.quantity,
          }))}
          currency={order.currency}
          amount={Number(order.amount)}
          fullName={order.fullName}
        />
      </main>
      <Footer />
    </>
  );
}
