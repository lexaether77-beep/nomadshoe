const FLUTTERWAVE_API = "https://api.flutterwave.com/v3";

type InitializePaymentParams = {
  amount: number;
  currency: "USD" | "NGN";
  reference: string;
  redirectUrl: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
};

type FlutterwaveInitResponse = {
  status: string;
  message: string;
  data?: { link: string };
};

export async function initializePayment(
  params: InitializePaymentParams
): Promise<{ paymentLink: string }> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const res = await fetch(`${FLUTTERWAVE_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.reference,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: {
        email: params.customerEmail,
        name: params.customerName,
        phonenumber: params.customerPhone,
      },
      customizations: {
        title: "KLΘT NOMAD Preorder",
        description: "Victory Through Harmony",
      },
    }),
  });

  const body = (await res.json()) as FlutterwaveInitResponse;

  if (!res.ok || body.status !== "success" || !body.data?.link) {
    throw new Error(body.message || "Failed to initialize Flutterwave payment");
  }

  return { paymentLink: body.data.link };
}

type FlutterwaveVerifyResponse = {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    status: "successful" | "failed" | string;
    amount: number;
    currency: string;
  };
};

export async function verifyTransaction(transactionId: string | number) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `${FLUTTERWAVE_API}/transactions/${transactionId}/verify`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );

  const body = (await res.json()) as FlutterwaveVerifyResponse;

  if (!res.ok || body.status !== "success" || !body.data) {
    throw new Error(body.message || "Failed to verify Flutterwave transaction");
  }

  return body.data;
}

/**
 * Look up a transaction by OUR tx_ref rather than Flutterwave's internal
 * numeric id — needed for recovery when an order never got a
 * flutterwaveTxId recorded (e.g. the webhook never fired or failed).
 */
export async function verifyTransactionByReference(txRef: string) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `${FLUTTERWAVE_API}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );

  const body = (await res.json()) as FlutterwaveVerifyResponse;

  if (!res.ok || body.status !== "success" || !body.data) {
    throw new Error(body.message || "No matching Flutterwave transaction found for this reference");
  }

  return body.data;
}
