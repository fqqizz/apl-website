import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, order_status, payment_method } = body;

    console.log("Webhook received:", {
      orderId: order_id,
      status: order_status,
      method: payment_method,
    });

    // Store payment record in database (implement as needed)
    // Example: Save to database
    // await db.payments.create({
    //   orderId: order_id,
    //   status: order_status,
    //   paymentMethod: payment_method,
    //   timestamp: new Date(),
    // });

    // Always return 200 OK to Cashfree
    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "received" }, { status: 200 });
  }
}
