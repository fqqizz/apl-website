import { env, methodNotAllowed, sendJson } from "../../_utils/http";

function cashfreeHost() {
  const mode = (env("CASHFREE_ENVIRONMENT") || "PRODUCTION").toUpperCase();
  return mode === "TEST" || mode === "SANDBOX" ? "sandbox" : "api";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  const orderId = String(req.query.order_id || "").trim();
  if (!orderId) return sendJson(res, 400, { error: "Missing order_id." });

  const appId = env("CASHFREE_APP_ID");
  const secret = env("CASHFREE_SECRET_KEY");
  if (!appId || !secret) return sendJson(res, 500, { error: "Payment gateway not configured." });

  try {
    const response = await fetch(`https://${cashfreeHost()}.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`, {
      headers: {
        accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": appId,
        "x-client-secret": secret,
      },
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    return sendJson(res, response.status, data);
  } catch {
    return sendJson(res, 500, { error: "Unable to verify payment. Please try again." });
  }
}

