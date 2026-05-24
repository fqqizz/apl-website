import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order_id query parameter" },
        { status: 400 }
      );
    }

    const cashfreeEnvironment = (
      process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
      process.env.CASHFREE_ENVIRONMENT ||
      "PRODUCTION"
    ).toUpperCase();
    const isSandbox = cashfreeEnvironment === "TEST" || cashfreeEnvironment === "SANDBOX";
    const cashfreeHost = isSandbox ? "sandbox" : "api";
    const cashfreeAppId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || process.env.CASHFREE_APP_ID || "";
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_APP_SECRET || process.env.CASHFREE_SECRET || "";

    if (!cashfreeAppId || !cashfreeSecret) {
      return NextResponse.json(
        { error: "Cashfree credentials are not configured properly" },
        { status: 500 }
      );
    }

    const cashfreeResponse = await fetch(
      `https://${cashfreeHost}.cashfree.com/pg/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecret,
        },
        signal: AbortSignal.timeout(15000),
      }
    );

    const responseData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      return new Response(JSON.stringify(responseData), {
        status: cashfreeResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.json(responseData);
  } catch {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
