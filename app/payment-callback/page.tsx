"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

type PaymentResult = {
  order_status?: string;
  message?: string;
  error?: string;
};

function PaymentCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      setStatus("error");
      setMessage("Missing order ID. Please return to the registration form and try again.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payments/verify?order_id=${encodeURIComponent(orderId)}`);
        const data: PaymentResult = await response.json();

        if (!response.ok) {
          console.error("Payment verify failed", response.status, data);
          setStatus("error");
          setMessage("Unable to verify payment. Please return to the registration form and try again.");
          return;
        }

        const statusValue = data.order_status?.toUpperCase() || "";
        setOrderStatus(statusValue);

        if (statusValue === "PAID") {
          const playerDataRaw = typeof window !== "undefined" ? localStorage.getItem("aplPlayerRegistration") : null;

          if (playerDataRaw) {
            try {
              const playerData = JSON.parse(playerDataRaw);

              if (!supabase) {
                console.warn("Supabase is not configured. Skipping player registration save.");
              } else {
                const { error: insertError } = await supabase.from("players").insert([
                  {
                    full_name: playerData.fullName,
                    age: playerData.age,
                    phone: playerData.phone,
                    email: playerData.email,
                    position: playerData.position,
                    district: playerData.district || playerData.area,
                    instagram: playerData.instagram,
                    photo_url: playerData.photoUrl,
                    id_url: playerData.idUrl,
                    payment_status: "PAID",
                    payment_id: orderId,
                  },
                ]);

                if (insertError) {
                  console.error("Supabase insert error:", insertError);
                  setSaveError(insertError.message);
                } else {
                  localStorage.removeItem("aplPlayerRegistration");
                }
              }
            } catch (storageError) {
              console.error("Player registration storage read error:", storageError);
            }
          }

          setStatus("success");
        } else {
          setStatus("cancelled");
          setMessage(
            "Your payment was cancelled or not completed. Please return to the registration form to try again."
          );
        }
      } catch (error) {
        console.error("Payment verify exception", error);
        setStatus("error");
        setMessage("Unable to verify payment. Please try again later.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="max-w-md w-full">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-apex/20 border-t-apex rounded-full"></div>
          <p className="mt-6 text-lg text-ink/58">Verifying your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Registration Successful</h1>
          <p className="mt-4 text-ink/58">Your application has been submitted successfully.</p>
          <p className="mt-2 text-sm text-ink/48">
            You will receive an email once your registration has been reviewed and approved by the APL Committee.
          </p>
          {saveError && (
            <p className="mt-4 text-sm text-red-600">Registration saved, but Supabase update failed: {saveError}</p>
          )}
          <Link href="/" className="mt-8 inline-block bg-ink text-white px-6 py-3 rounded-full hover:bg-apex transition">
            Return Home
          </Link>
        </div>
      )}

      {status === "cancelled" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Payment Cancelled</h1>
          <p className="mt-4 text-ink/58">Your payment was cancelled or incomplete.</p>
          <p className="mt-2 text-sm text-ink/48">Please try again to complete your registration.</p>
          <Link href="/" className="mt-8 inline-block bg-ink text-white px-6 py-3 rounded-full hover:bg-apex transition">
            Back to Registration
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Unable to Verify Payment</h1>
          <p className="mt-4 text-ink/58">{message || "We could not verify your payment."}</p>
          <Link href="/" className="mt-8 inline-block bg-ink text-white px-6 py-3 rounded-full hover:bg-apex transition">
            Return to Registration
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-10">
      <Suspense fallback={<div className="text-center"><p className="text-ink/58">Loading payment status...</p></div>}>
        <PaymentCallbackContent />
      </Suspense>
    </main>
  );
}
