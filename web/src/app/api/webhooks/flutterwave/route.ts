import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/flutterwave";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash");
  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;

  if (!expected || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await request.json();
  const transactionId = payload?.data?.id;
  const txRef = payload?.data?.tx_ref;

  if (!transactionId || !txRef) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { reference: txRef } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ status: "already processed" });
  }

  // Never trust the webhook body for the charge outcome — re-verify
  // server-side against Flutterwave's API before marking an order paid.
  const verified = await verifyTransaction(transactionId);

  const amountMatches =
    Math.round(verified.amount) >= Math.round(Number(order.amount));
  const currencyMatches = verified.currency === order.currency;

  if (verified.status === "successful" && amountMatches && currencyMatches) {
    const updated = await db.order.update({
      where: { id: order.id },
      data: { status: "PAID", flutterwaveTxId: String(transactionId) },
      include: { items: true },
    });
    const sent = await sendOrderConfirmation(updated);
    await db.message.create({
      data: {
        orderId: updated.id,
        kind: "ORDER_CONFIRMED",
        toEmail: updated.email,
        subject: `Your KLΘT NOMAD preorder is confirmed — ${updated.reference}`,
        body: "(order confirmation)",
        delivered: sent,
      },
    });
  } else {
    await db.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ status: "ok" });
}
