import { Resend } from "resend";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { getColorway } from "@/lib/colorways";

const FROM = "KLΘT <orders@nomad.klotworld.com>";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomad.klotworld.com";
}

function unsubscribeFooter(token: string) {
  return `\n\n—\nDon't want these emails? Unsubscribe: ${siteUrl()}/api/waitlist/unsubscribe?token=${token}`;
}

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

export function buildOrderDeliveredEmail(order: OrderWithItems) {
  return {
    subject: `How's your KLΘT NOMAD? We'd love to hear from you — ${order.reference}`,
    body: `${order.fullName}, we hope your NOMAD feels as good as it looks.\n\nWe're a small, independent brand, and every bit of feedback helps us improve future runs. If you have a minute, just reply to this email and tell us what you think — how the fit feels, what you'd change, anything. A photo of you wearing them would mean even more.\n\nReference: ${order.reference}\n\nVictory Through Harmony.\n\nKLΘT`,
  };
}

// --- Waitlist drip (3-email sequence for non-converting visitors) ---

export function buildWaitlistWelcomeEmail(unsubscribeToken: string) {
  return {
    subject: "You're on the list — KLΘT NOMAD",
    body: `Victory Through Harmony.\n\nYou're on the list for the KLΘT NOMAD — a zero-drop, five-toe barefoot shoe designed in Lagos, etched with Nsibidi symbols reading "Time is the Spirit of God."\n\nWe'll email you with production updates, and again as we get close to shipping. If you'd rather not wait, NOMAD is open for preorder right now.\n\nPreorder: ${siteUrl()}/nomad\nRead the story: ${siteUrl()}/nsibidi-story\n\nKLΘT${unsubscribeFooter(unsubscribeToken)}`,
  };
}

/**
 * PLACEHOLDER copy — generic on purpose. Swap for a real production
 * update (photos, milestones, timeline) before this has been live long
 * enough to actually send (it only fires 28 days after signup).
 */
export function buildWaitlistProgressEmail(unsubscribeToken: string) {
  return {
    subject: "KLΘT NOMAD — a production update",
    body: `Quick update on the NOMAD: production is moving forward in Lagos.\n\nWe'll be back in your inbox as we get closer to shipping.\n\nKLΘT${unsubscribeFooter(unsubscribeToken)}`,
  };
}

export function buildWaitlistLaunchEmail(unsubscribeToken: string) {
  return {
    subject: "KLΘT NOMAD — ships soon",
    body: `The wait's almost over — NOMAD ships soon.\n\nIf you haven't preordered yet, now's the time — the first production run is limited.\n\nPreorder: ${siteUrl()}/nomad\n\nKLΘT${unsubscribeFooter(unsubscribeToken)}`,
  };
}

async function send(params: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    text: params.body,
    ...(params.replyTo ? { replyTo: params.replyTo } : {}),
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

export async function sendOrderDelivered(
  order: OrderWithItems
): Promise<boolean> {
  const { subject, body } = buildOrderDeliveredEmail(order);
  return send({
    to: order.email,
    subject,
    body,
    replyTo: "hello@klotworld.com",
  });
}

export async function sendCustomEmail(params: {
  to: string;
  subject: string;
  body: string;
}): Promise<boolean> {
  return send(params);
}

export async function sendWaitlistWelcome(
  to: string,
  unsubscribeToken: string
): Promise<boolean> {
  const { subject, body } = buildWaitlistWelcomeEmail(unsubscribeToken);
  return send({ to, subject, body });
}

export async function sendWaitlistProgress(
  to: string,
  unsubscribeToken: string
): Promise<boolean> {
  const { subject, body } = buildWaitlistProgressEmail(unsubscribeToken);
  return send({ to, subject, body });
}

export async function sendWaitlistLaunch(
  to: string,
  unsubscribeToken: string
): Promise<boolean> {
  const { subject, body } = buildWaitlistLaunchEmail(unsubscribeToken);
  return send({ to, subject, body });
}
