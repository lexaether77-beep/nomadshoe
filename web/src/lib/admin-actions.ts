"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { verifyTransactionByReference } from "@/lib/flutterwave";
import {
  sendOrderShipped,
  sendOrderDelivered,
  sendCustomEmail,
  sendOrderConfirmation,
  buildOrderConfirmationEmail,
  buildOrderShippedEmail,
  buildOrderDeliveredEmail,
} from "@/lib/email";

/**
 * Manual recovery/diagnostic path for orders stuck on PENDING — re-runs
 * the exact same verification the webhook does (never trust anything
 * but a live Flutterwave lookup), but triggered by an admin instead of
 * Flutterwave's callback. Useful both to unblock a real stuck order and
 * to diagnose *why* the webhook didn't do this automatically: the
 * returned message says exactly what Flutterwave reported.
 */
export async function recheckOrderPayment(orderId: string) {
  await requireAdmin();

  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: true },
  });

  if (order.status === "PAID") {
    return { ok: true, message: "Already marked PAID." };
  }

  let verified;
  try {
    verified = await verifyTransactionByReference(order.reference);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Lookup failed";
    return { ok: false, message: `Flutterwave lookup failed: ${msg}` };
  }

  const amountMatches =
    Math.round(verified.amount) >= Math.round(Number(order.amount));
  const currencyMatches = verified.currency === order.currency;

  if (verified.status !== "successful") {
    return {
      ok: false,
      message: `Flutterwave reports this transaction as "${verified.status}", not successful.`,
    };
  }
  if (!currencyMatches) {
    return {
      ok: false,
      message: `Currency mismatch: Flutterwave shows ${verified.currency}, order expects ${order.currency}.`,
    };
  }
  if (!amountMatches) {
    return {
      ok: false,
      message: `Amount mismatch: Flutterwave shows ${verified.amount} ${verified.currency}, order expects ${order.amount}.`,
    };
  }

  const updated = await db.order.update({
    where: { id: order.id },
    data: { status: "PAID", flutterwaveTxId: String(verified.id) },
    include: { items: true },
  });
  const { subject, body } = buildOrderConfirmationEmail(updated);
  const sent = await sendOrderConfirmation(updated);
  await db.message.create({
    data: {
      orderId: updated.id,
      kind: "ORDER_CONFIRMED",
      toEmail: updated.email,
      subject,
      body,
      delivered: sent,
    },
  });

  revalidatePath("/admin");
  return {
    ok: true,
    message: `Confirmed PAID (Flutterwave tx ${verified.id}). Confirmation email ${sent ? "sent" : "logged but not sent"}.`,
  };
}

export async function markOrderShipped(orderId: string) {
  await requireAdmin();

  const order = await db.order.update({
    where: { id: orderId },
    data: { shippedAt: new Date() },
    include: { items: true },
  });

  const { subject, body } = buildOrderShippedEmail(order);
  const sent = await sendOrderShipped(order);

  await db.message.create({
    data: {
      orderId: order.id,
      kind: "ORDER_SHIPPED",
      toEmail: order.email,
      subject,
      body,
      delivered: sent,
    },
  });

  revalidatePath("/admin");
}

export async function markOrderDelivered(orderId: string) {
  await requireAdmin();

  const order = await db.order.update({
    where: { id: orderId },
    data: { deliveredAt: new Date() },
    include: { items: true },
  });

  const { subject, body } = buildOrderDeliveredEmail(order);
  const sent = await sendOrderDelivered(order);

  await db.message.create({
    data: {
      orderId: order.id,
      kind: "ORDER_DELIVERED",
      toEmail: order.email,
      subject,
      body,
      delivered: sent,
    },
  });

  revalidatePath("/admin");
}

export async function sendCustomMessage(
  orderId: string,
  toEmail: string,
  subject: string,
  body: string
) {
  await requireAdmin();

  if (!subject.trim() || !body.trim()) {
    throw new Error("Subject and message body are required");
  }

  const sent = await sendCustomEmail({ to: toEmail, subject, body });

  await db.message.create({
    data: {
      orderId: orderId || null,
      kind: "CUSTOM",
      toEmail,
      subject,
      body,
      delivered: sent,
    },
  });

  revalidatePath("/admin");
  return { sent };
}

export async function getMessageTemplate(
  orderId: string,
  template: "ORDER_CONFIRMED" | "ORDER_SHIPPED" | "ORDER_DELIVERED"
) {
  await requireAdmin();

  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: true },
  });

  if (template === "ORDER_CONFIRMED") return buildOrderConfirmationEmail(order);
  if (template === "ORDER_SHIPPED") return buildOrderShippedEmail(order);
  return buildOrderDeliveredEmail(order);
}
