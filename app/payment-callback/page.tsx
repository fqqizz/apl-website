"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { insertPlayer, getPlayerByOrderId } from "@/lib/database";
import type { Database } from "@/lib/database.types";

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
  const [playerId, setPlayerId] = useState<string | null>(null);
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
          // Ensure we haven't already saved this order
          try {
            const existing = await getPlayerByOrderId(orderId);
            if (existing.success && existing.data) {
              setPlayerId(existing.data.playerId || null);
              setStatus("success");
              // Cleanup any leftover session data
              sessionStorage.removeItem("pendingPlayerRegistration");
              return;
            }
          } catch (e) {
            // ignore and continue to attempt save
          }

          // Retrieve pending registration data saved before checkout
          const pending = sessionStorage.getItem("pendingPlayerRegistration");
          if (!pending) {
            // No local data to save, still show success
            setStatus("success");
            return;
          }

          const parsed = JSON.parse(pending) as {
            fullName: string;
            age: number;
            position: string;
            preferredFoot?: string;
            foot?: string;
            contactNumber: string;
            email: string;
            instagram?: string | null;
            area: string;
            photoUrl?: string | null;
            idUrl?: string | null;
          };

          const insertPayload: Omit<Database["public"]["Tables"]["players"]["Insert"], "id"> = {
            full_name: parsed.fullName,
            age: parsed.age,
            position: parsed.position,
            preferred_foot: parsed.preferredFoot || parsed.foot || "",
            contact_number: parsed.contactNumber,
            email: parsed.email,
            instagram: parsed.instagram || null,
            area: parsed.area,
            photo_url: parsed.photoUrl || null,
            id_url: parsed.idUrl || null,
            payment_status: "completed",
            order_id: orderId,
          };

          const insertResult = await insertPlayer(insertPayload);
          if (!insertResult.success) {
            console.error("Failed to save player after payment:", insertResult.error);
            setStatus("error");
            setMessage("Payment verified but we couldn't save your registration. Contact support.");
            return;
          }

          // Success: cleanup and show success UI
          sessionStorage.removeItem("pendingPlayerRegistration");
          setPlayerId(insertResult.data?.playerId || null);
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
        <div className="rounded-[2rem] border border-ink/10 bg-white/95 p-8 shadow-[0_30px_90px_rgba(17,17,17,0.12)] backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-ink mx-auto">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-ink">Registration Successful</h1>
          <p className="mt-3 text-center text-sm leading-6 text-ink/60">
            Your registration has been successfully submitted.
          </p>

          {playerId ? (
            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-5 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-ink/60">Your Player ID</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{playerId}</p>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-5 text-center">
              <p className="text-sm text-ink/60">Your Player ID will be shared shortly.</p>
            </div>
          )}

          <p className="mt-6 text-center text-sm leading-6 text-ink/60">
            You will receive further updates from the APL Committee after review and verification.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => window.location.assign("/")}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Return Home
            </button>
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.assign("/");
                }
              }}
              className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-slate-400"
            >
              Close
            </button>
          </div>
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
