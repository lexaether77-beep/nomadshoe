import { Resend } from "resend";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { getColorway } from "@/lib/colorways";

const FROM = "KLΘT <preorders@klotworld.com>";

function itemLines(items: OrderItem[]) {
  return items
    .map((item) => {
      const colorway = getColorway(item.colorwaySlug);
      return `${item.quantity} × KLΘT NOMAD, ${colorway?.name ?? item.colorwaySlug} (EU ${item.size})`;
    })
    .join("\n");
}

export async function sendOrderConfirmation(
  order: Order & { items: OrderItem[] }
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Your KLΘT NOMAD preorder is confirmed — ${order.reference}`,
    text: `Victory Through Harmony, ${order.fullName}.\n\nYour preorder is confirmed:\n\n${itemLines(order.items)}\n\nTotal: ${order.currency} ${order.amount}\nReference: ${order.reference}\n\nWe'll be in touch as the October 2026 release approaches.\n\nKLΘT — Lagos, Nigeria`,
  });

  return true;
}

export async function sendOrderShipped(
  order: Order & { items: OrderItem[] }
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Your KLΘT NOMAD has shipped — ${order.reference}`,
    text: `${order.fullName}, your NOMAD is on its way.\n\n${itemLines(order.items)}\n\nReference: ${order.reference}\n\nVictory Through Harmony.\n\nKLΘT — Lagos, Nigeria`,
  });

  return true;
}

export async function sendCustomEmail(params: {
  to: string;
  subject: string;
  body: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    text: params.body,
  });

  return true;
}
