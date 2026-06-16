import { createTimeout, env, methodNotAllowed, readJson, sendJson, serverFetch } from "../../_utils/http";

const PLAYER_REGISTRATION_FEE = 249;

function cashfreeHost() {
  const mode = (env("CASHFREE_ENVIRONMENT") || "PRODUCTION").toUpperCase();
  return mode === "TEST" || mode === "SANDBOX" ? "sandbox" : "api";
}

function cashfreeClientMode() {
  return cashfreeHost() === "sandbox" ? "sandbox" : "production";
}

function cashfreeCredentials() {
  return {
    appId: env("CASHFREE_APP_ID") || env("CASHFREE_CLIENT_ID"),
    secret: env("CASHFREE_SECRET_KEY") || env("CASHFREE_CLIENT_SECRET") || env("CASHFREE_SECRET"),
  };
}

function createRuntimeId() {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${Date.now()}_${randomPart}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { email, phone, name } = await readJson(req);
    if (!email || !phone || !name) return sendJson(res, 400, { error: "Missing required fields." });

    const { appId, secret } = cashfreeCredentials();
    if (!appId || !secret) return sendJson(res, 500, { error: "Payment gateway not configured." });

    const orderId = `APL_${createRuntimeId()}`;
    const baseUrl = (env("APP_URL") || env("NEXT_PUBLIC_BASE_URL") || "https://apexpremiereleague.in").replace(/\/$/, "");
    const timeout = createTimeout(15000);
    const response = await serverFetch(`https://${cashfreeHost()}.cashfree.com/pg/orders`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": appId,
        "x-client-secret": secret,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: PLAYER_REGISTRATION_FEE,
        order_currency: "INR",
        customer_details: {
          customer_id: `APL_CUSTOMER_${createRuntimeId()}`,
          customer_email: String(email),
          customer_phone: String(phone),
          customer_name: String(name),
        },
        order_meta: {
          return_url: `${baseUrl}/payment-callback?order_id={order_id}`,
          notify_url: `${baseUrl}/api/apl/payments/webhook`,
        },
      }),
      signal: timeout.signal,
    });
    timeout.clear();
    const data = await response.json();
    if (!response.ok) return sendJson(res, response.status, data);

    return sendJson(res, 200, {
      orderId,
      ...data,
      paymentSessionId: data.payment_session_id || data.order_id,
      paymentLink: data.payment_link || null,
      cashfreeMode: cashfreeClientMode(),
    });
  } catch {
    return sendJson(res, 500, { error: "Unable to create payment order. Please try again." });
  }
}
