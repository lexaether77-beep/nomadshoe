"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { initializePayment } from "@/lib/flutterwave";
import { getUsdToNgnRate } from "@/lib/fx";
import { nomadMeta, nomadSizeScale } from "@/lib/specs";
import { colorways } from "@/lib/colorways";

const colorwaySlugs = colorways.map((c) => c.slug) as [string, ...string[]];
const sizeLabels = nomadSizeScale as unknown as [string, ...string[]];

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  addressLine1: z.string().min(4, "Enter your shipping address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state or region"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Enter your country"),
  currency: z.enum(["USD", "NGN"]),
  discountCode: z.string().optional(),
});

const cartItemSchema = z.object({
  colorwaySlug: z.enum(colorwaySlugs),
  size: z.enum(sizeLabels),
  quantity: z.number().int().min(1).max(10),
});

export type CheckoutState = { error: string } | null;

export async function createOrder(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  let cartItems: z.infer<typeof cartItemSchema>[];
  try {
    const itemsRaw = JSON.parse(String(formData.get("cartItems") ?? "[]"));
    cartItems = z.array(cartItemSchema).min(1).parse(itemsRaw);
  } catch {
    return { error: "Your cart is empty. Please add an item before checking out." };
  }

  let unitPriceUSD: number = nomadMeta.priceUSD;
  let redeemedCode: string | null = null;
  const discountCodeRaw = parsed.data.discountCode?.trim().toUpperCase();

  if (discountCodeRaw) {
    // Atomic redemption — only succeeds if usedCount < maxUses, so
    // concurrent checkouts can never push a code past its cap. This is
    // the real enforcement; the cart page's earlier check is just UX.
    const redeemed = await db.$queryRaw<{ priceUSD: number }[]>`
      UPDATE "DiscountCode"
      SET "usedCount" = "usedCount" + 1
      WHERE "code" = ${discountCodeRaw} AND "usedCount" < "maxUses"
      RETURNING "priceUSD"
    `;
    if (redeemed.length === 0) {
      return {
        error: "That discount code is invalid or has expired. Remove it and try again.",
      };
    }
    unitPriceUSD = redeemed[0].priceUSD;
    redeemedCode = discountCodeRaw;
  }

  const amountUSD = cartItems.reduce(
    (sum, item) => sum + item.quantity * unitPriceUSD,
    0
  );

  const { currency } = parsed.data;
  const amount =
    currency === "NGN"
      ? Math.round(amountUSD * (await getUsdToNgnRate()))
      : amountUSD;

  const reference = `KLT-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

  const order = await db.order.create({
    data: {
      reference,
      currency,
      amount,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      postalCode: parsed.data.postalCode || null,
      country: parsed.data.country,
      items: {
        create: cartItems.map((item) => ({
          colorwaySlug: item.colorwaySlug,
          size: item.size,
          quantity: item.quantity,
          unitPriceUSD,
        })),
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  let paymentLink: string;
  try {
    const result = await initializePayment({
      amount,
      currency,
      reference: order.reference,
      redirectUrl: `${siteUrl}/order/${order.reference}`,
      customerEmail: parsed.data.email,
      customerName: parsed.data.fullName,
      customerPhone: parsed.data.phone,
    });
    paymentLink = result.paymentLink;
  } catch {
    await db.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    if (redeemedCode) {
      // Give back the redemption — this attempt never reached Flutterwave,
      // so it shouldn't count against the code's usage cap.
      await db.discountCode.updateMany({
        where: { code: redeemedCode },
        data: { usedCount: { decrement: 1 } },
      });
    }
    return { error: "Could not start payment. Please try again." };
  }

  redirect(paymentLink);
}
