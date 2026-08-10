import { Resend } from "resend";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { getColorway } from "@/lib/colorways";

const FROM = "KLΘT <orders@nomad.klotworld.com>";

type OrderWithItems = Order & { items: OrderItem[] };

function itemLines(items: OrderItem[]) {
  return items
    .map((item) => {
      const colorway = getColorway(item.colorwaySlug);
      return `${item.quantity} × KLΘT NOMAD, ${colorway?.name ?? item.colorwaySlug} (EU ${item.size})`;
    })
    .join("\n");
}

export function buildOrderConfirmationEmail(order: OrderWithItems) {
  return {
    subject: `Your KLΘT NOMAD preorder is confirmed — ${order.reference}`,
    body: `Victory Through Harmony, ${order.fullName}.\n\nYour preorder is confirmed:\n\n${itemLines(order.items)}\n\nTotal: ${order.currency} ${order.amount}\nReference: ${order.reference}\n\nWe'll be in touch as the October 2026 release approaches.\n\nKLΘT`,
  };
}

export function buildOrderShippedEmail(order: OrderWithItems) {
  return {
    subject: `Your KLΘT NOMAD has shipped — ${order.reference}`,
    body: `${order.fullName}, your NOMAD is on its way.\n\n${itemLines(order.items)}\n\nShipping to:\n${order.addressLine1}${order.addressLine2 ? `\n${order.addressLine2}` : ""}\n${order.city}, ${order.state}${order.postalCode ? ` ${order.postalCode}` : ""}\n${order.country}\n\nReference: ${order.reference}\n\nVictory Through Harmony.\n\nKLΘT`,
  };
}

async function send(params: { to: string; subject: string; body: string }) {
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

export async function sendOrderConfirmation(
  order: OrderWithItems
): Promise<boolean> {
  const { subject, body } = buildOrderConfirmationEmail(order);
  return send({ to: order.email, subject, body });
}

export async function sendOrderShipped(
  order: OrderWithItems
): Promise<boolean> {
  const { subject, body } = buildOrderShippedEmail(order);
  return send({ to: order.email, subject, body });
}

export async function sendCustomEmail(params: {
  to: string;
  subject: string;
  body: string;
}): Promise<boolean> {
  return send(params);
}
