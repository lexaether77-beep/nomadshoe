import { Resend } from "resend";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { getColorway } from "@/lib/colorways";

export async function sendOrderConfirmation(
  order: Order & { items: OrderItem[] }
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  const lines = order.items
    .map((item) => {
      const colorway = getColorway(item.colorwaySlug);
      return `${item.quantity} × KLΘT NOMAD, ${colorway?.name ?? item.colorwaySlug} (EU ${item.size})`;
    })
    .join("\n");

  await resend.emails.send({
    from: "KLΘT <preorders@klotworld.com>",
    to: order.email,
    subject: `Your KLΘT NOMAD preorder is confirmed — ${order.reference}`,
    text: `Victory Through Harmony, ${order.fullName}.\n\nYour preorder is confirmed:\n\n${lines}\n\nTotal: ${order.currency} ${order.amount}\nReference: ${order.reference}\n\nWe'll be in touch as the October 2026 release approaches.\n\nKLΘT — Lagos, Nigeria`,
  });
}
