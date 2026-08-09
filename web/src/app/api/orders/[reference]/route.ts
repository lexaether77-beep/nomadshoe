import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/orders/[reference]">
) {
  const { reference } = await ctx.params;
  const order = await db.order.findUnique({
    where: { reference },
    select: { status: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
