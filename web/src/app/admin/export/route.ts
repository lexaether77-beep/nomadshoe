import { db } from "@/lib/db";
import { getColorway } from "@/lib/colorways";

function csvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const HEADERS = [
  "Reference",
  "Status",
  "Placed",
  "Full Name",
  "Email",
  "Phone",
  "Address Line 1",
  "Address Line 2",
  "City",
  "State",
  "Postal Code",
  "Country",
  "Items",
  "Currency",
  "Amount",
  "Shipped",
];

export async function GET() {
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((order) => {
    const items = order.items
      .map(
        (item) =>
          `${item.quantity} x ${getColorway(item.colorwaySlug)?.name ?? item.colorwaySlug} (EU ${item.size})`
      )
      .join("; ");

    return [
      order.reference,
      order.status,
      order.createdAt.toISOString(),
      order.fullName,
      order.email,
      order.phone,
      order.addressLine1,
      order.addressLine2 ?? "",
      order.city,
      order.state,
      order.postalCode ?? "",
      order.country,
      items,
      order.currency,
      order.amount.toString(),
      order.shippedAt ? order.shippedAt.toISOString() : "",
    ]
      .map(csvCell)
      .join(",");
  });

  const csv = [HEADERS.join(","), ...rows].join("\r\n");
  const filename = `klot-orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
