import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await request.json().catch(() => null);
    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "received" }, { status: 200 });
  }
}
