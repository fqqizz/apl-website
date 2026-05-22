import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, name } = body;
    const amount = "249";

    // Validate required fields
    if (!email || !phone || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `APL_${Date.now()}_${uuidv4().split("-")[0]}`;

    // Prepare Cashfree request
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
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment-callback`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/webhook`,
      },
      settlements: {
        beneficiary_name: "Apex Premier League",
      },
    };

    // Create request signature for Cashfree
    const signatureString = `${orderId}${amount}INR${process.env.CASHFREE_APP_SECRET}`;
    const signature = crypto
      .createHash("sha256")
      .update(signatureString)
      .digest("hex");

    // Call Cashfree API
    const cashfreeResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "TEST" ? "sandbox" : "api"}.cashfree.com/pg/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID || "",
          "x-client-secret": process.env.CASHFREE_APP_SECRET || "",
        },
        body: JSON.stringify(cashfreePayload),
      }
    );

    const responseData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree Error:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Failed to create payment order" },
        { status: cashfreeResponse.status }
      );
    }

    return NextResponse.json({
      orderId,
      paymentSessionId: responseData.payment_session_id || responseData.order_id,
      redirectUrl: responseData.redirect_url,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
