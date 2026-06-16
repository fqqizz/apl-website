import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, name } = body;
    const amount = 249;

    if (!email || !phone || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `APL_${Date.now()}_${uuidv4().split("-")[0]}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://apexpremiereleague.in";
    const cashfreeEnvironment = (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || process.env.CASHFREE_ENVIRONMENT || "PRODUCTION").toUpperCase();
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

    const cashfreePayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: uuidv4(),
        customer_email: email,
        customer_phone: phone,
        customer_name: name,
      },
      order_meta: {
        return_url: `${baseUrl}/payment-callback?order_id={order_id}`,
        notify_url: `${baseUrl}/api/payments/webhook`,
      },
      settlements: {
        beneficiary_name: "Apex Premiere League",
      },
    };

    const cashfreeResponse = await fetch(
      `https://${cashfreeHost}.cashfree.com/pg/orders`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecret,
        },
        body: JSON.stringify(cashfreePayload),
        signal: AbortSignal.timeout(15000),
      }
    );

    const responseText = await cashfreeResponse.text();
    let responseData: any;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { error: responseText };
    }

    if (!cashfreeResponse.ok) {
      return new Response(responseText, {
        status: cashfreeResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }


    return NextResponse.json({
      orderId,
      ...responseData,
      paymentSessionId: responseData.payment_session_id || responseData.order_id,
      paymentLink: responseData.payment_link || responseData.paymentLink || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
