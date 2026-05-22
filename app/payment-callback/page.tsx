"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function PaymentCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("order_status");

    if (paymentStatus === "PAID") {
      setStatus("success");
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-apex/20 border-t-apex rounded-full"></div>
          <p className="mt-6 text-lg text-ink/58">Processing your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-3 text-ink/58">Your registration has been submitted successfully.</p>
          <p className="mt-2 text-sm text-ink/48">You will receive an email once your registration is reviewed by the APL Committee.</p>
          <Link href="/" className="mt-8 inline-block bg-ink text-white px-6 py-3 rounded-full hover:bg-apex transition">
            Back to Home
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Payment Failed</h1>
          <p className="mt-3 text-ink/58">Your payment could not be processed.</p>
          <p className="mt-2 text-sm text-ink/48">Please try again or contact support.</p>
          <Link href="/#players" className="mt-8 inline-block bg-ink text-white px-6 py-3 rounded-full hover:bg-apex transition">
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-center"><p className="text-ink/58">Loading...</p></div>}>
        <PaymentCallbackContent />
      </Suspense>
    </main>
  );
}
