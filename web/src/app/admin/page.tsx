import { db } from "@/lib/db";
import { getColorway } from "@/lib/colorways";
import { OrderRowActions } from "@/components/admin/OrderRowActions";

const STATUS_COLOR: Record<string, string> = {
  PAID: "text-gold",
  PENDING: "text-muted",
  FAILED: "text-solar",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const orders = await db.order.findMany({
    include: { items: true, messages: true },
    orderBy: { createdAt: "desc" },
  });

  const paidTotals = orders
    .filter((o) => o.status === "PAID")
    .reduce<Record<string, number>>((totals, o) => {
      totals[o.currency] = (totals[o.currency] ?? 0) + Number(o.amount);
      return totals;
    }, {});

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold">KLΘT Orders</h1>
        <div className="flex items-center gap-4">
          <p className="font-technical text-sm text-muted">
            {orders.length} orders &middot; {orders.filter((o) => o.status === "PAID").length} paid
          </p>
          <a
            href="/admin/export"
            className="rounded-full bg-foreground px-4 py-2 font-technical text-xs font-medium text-void hover:scale-105"
          >
            Download CSV
          </a>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-line">
        <table className="w-full min-w-[1400px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line font-technical text-xs tracking-wide text-muted uppercase">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line align-top last:border-none">
                <td className="px-4 py-3 font-technical">{order.reference}</td>
                <td className={`px-4 py-3 font-technical ${STATUS_COLOR[order.status] ?? ""}`}>
                  {order.status}
                </td>
                <td className="px-4 py-3">
                  <div>{order.fullName}</div>
                  <div className="text-xs text-muted">{order.email}</div>
                  <div className="text-xs text-muted">{order.phone}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div>{order.addressLine1}</div>
                  {order.addressLine2 && <div>{order.addressLine2}</div>}
                  <div>
                    {order.city}, {order.state}
                    {order.postalCode ? ` ${order.postalCode}` : ""}
                  </div>
                  <div>{order.country}</div>
                </td>
                <td className="px-4 py-3">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.quantity} &times;{" "}
                      {getColorway(item.colorwaySlug)?.name ?? item.colorwaySlug} (EU{" "}
                      {item.size})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 font-technical">
                  {order.currency} {order.amount.toString()}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {order.createdAt.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <OrderRowActions
                    orderId={order.id}
                    email={order.email}
                    isPaid={order.status === "PAID"}
                    shippedAt={order.shippedAt?.toISOString() ?? null}
                    messages={order.messages.map((m) => ({
                      id: m.id,
                      kind: m.kind,
                      subject: m.subject,
                      sentAt: m.sentAt.toISOString(),
                      delivered: m.delivered,
                    }))}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 font-technical text-sm text-muted">
        Confirmed revenue:{" "}
        {Object.keys(paidTotals).length === 0
          ? "none yet"
          : Object.entries(paidTotals)
              .map(([currency, total]) => `${currency} ${total.toFixed(2)}`)
              .join(" + ")}
      </p>
    </main>
  );
}
