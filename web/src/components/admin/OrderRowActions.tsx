"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markOrderShipped, sendCustomMessage } from "@/lib/admin-actions";

type MessageSummary = {
  id: string;
  kind: string;
  subject: string;
  sentAt: string;
  delivered: boolean;
};

const KIND_LABEL: Record<string, string> = {
  CUSTOM: "Custom",
  ORDER_CONFIRMED: "Order confirmed",
  ORDER_SHIPPED: "Order shipped",
};

export function OrderRowActions({
  orderId,
  email,
  isPaid,
  shippedAt,
  messages,
}: {
  orderId: string;
  email: string;
  isPaid: boolean;
  shippedAt: string | null;
  messages: MessageSummary[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showCompose, setShowCompose] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function handleShip() {
    startTransition(async () => {
      await markOrderShipped(orderId);
      router.refresh();
    });
  }

  function handleSend() {
    startTransition(async () => {
      const result = await sendCustomMessage(orderId, email, subject, body);
      setStatus(
        result.sent
          ? "Sent."
          : "RESEND_API_KEY isn't configured — message logged but not sent."
      );
      setSubject("");
      setBody("");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {isPaid && !shippedAt && (
          <button
            type="button"
            onClick={handleShip}
            disabled={isPending}
            className="rounded-full bg-gold px-3 py-1 font-technical text-xs font-medium text-void disabled:opacity-60"
          >
            Mark Shipped
          </button>
        )}
        {shippedAt && (
          <span className="font-technical text-xs text-muted">
            Shipped {new Date(shippedAt).toLocaleDateString()}
          </span>
        )}
        <button
          type="button"
          onClick={() => setShowCompose((v) => !v)}
          className="rounded-full px-3 py-1 font-technical text-xs ring-1 ring-line hover:ring-muted"
        >
          Message
        </button>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="font-technical text-xs text-muted underline decoration-dotted hover:text-foreground"
          >
            {messages.length} sent
          </button>
        )}
      </div>

      {showHistory && messages.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg bg-void p-3 ring-1 ring-line">
          {messages.map((m) => (
            <div key={m.id} className="font-technical text-xs">
              <span className="text-muted">
                {new Date(m.sentAt).toLocaleDateString()} &middot;{" "}
                {KIND_LABEL[m.kind] ?? m.kind} &middot;{" "}
                {m.delivered ? "delivered" : "not delivered"} &middot;{" "}
              </span>
              {m.subject}
            </div>
          ))}
        </div>
      )}

      {showCompose && (
        <div className="flex flex-col gap-2 rounded-lg bg-void p-3 ring-1 ring-line">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="rounded bg-surface px-2 py-1.5 text-xs ring-1 ring-line focus:outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message"
            rows={3}
            className="rounded bg-surface px-2 py-1.5 text-xs ring-1 ring-line focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending || !subject.trim() || !body.trim()}
            className="self-start rounded-full bg-foreground px-3 py-1 font-technical text-xs font-medium text-void disabled:opacity-60"
          >
            Send to {email}
          </button>
          {status && (
            <p className="font-technical text-xs text-muted">{status}</p>
          )}
        </div>
      )}
    </div>
  );
}
