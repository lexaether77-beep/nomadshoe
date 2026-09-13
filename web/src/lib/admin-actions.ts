"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  sendOrderShipped,
  sendOrderDelivered,
  sendCustomEmail,
  buildOrderConfirmationEmail,
  buildOrderShippedEmail,
  buildOrderDeliveredEmail,
} from "@/lib/email";

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
