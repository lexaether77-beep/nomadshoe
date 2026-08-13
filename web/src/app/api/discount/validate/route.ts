import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const rawCode = typeof body.code === "string" ? body.code : "";
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, error: "Enter a code." });
  }

  const entry = await db.discountCode.findUnique({ where: { code } });
  if (!entry) {
    return NextResponse.json({ valid: false, error: "Invalid code." });
  }
  if (entry.usedCount >= entry.maxUses) {
    return NextResponse.json({ valid: false, error: "This code has expired." });
  }

  return NextResponse.json({
    valid: true,
    code: entry.code,
    priceUSD: entry.priceUSD,
  });
}
