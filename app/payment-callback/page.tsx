"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { insertPlayer, getPlayerByOrderId } from "@/lib/database";
import type { Database } from "@/lib/database.types";
import { deletePendingPlayerRegistration, getPendingPlayerRegistration } from "@/lib/pendingRegistration";
import { uploadPlayerID, uploadPlayerPhoto } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type PaymentResult = {
  order_status?: string;
  message?: string;
  error?: string;
};

function PaymentCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const orderId = searchParams.get("order_id");

    if (!orderId) {
      setStatus("error");
      setMessage("Missing order ID. Please return to the registration form and try again.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        const response = await fetch(`/api/payments/verify?order_id=${encodeURIComponent(orderId)}`, {
          signal: controller.signal
        });
        window.clearTimeout(timeout);
        const data: PaymentResult = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage("Unable to verify payment. Please return to the registration form and try again.");
          return;
        }

        const statusValue = data.order_status?.toUpperCase() || "";

        if (statusValue === "PAID") {
          setMessage("Payment verified. Finalizing registration and generating your Player ID...");

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
          } catch {
            // Continue to attempt save; duplicate protection remains on order_id.
          }

          const pending = await getPendingPlayerRegistration(orderId);
          if (!pending) {
            setStatus("error");
            setMessage("Payment verified, but your registration files were not found on this device. Contact support with your order ID.");
            return;
          }

          setMessage("Payment verified. Uploading your documents securely...");

          const photoFile = pending.photoFile instanceof File
            ? pending.photoFile
            : new File([pending.photoFile], pending.photoName, { type: pending.photoType });
          const idFile = pending.idFile instanceof File
            ? pending.idFile
            : new File([pending.idFile], pending.idName, { type: pending.idType });

          const [photoUpload, idUpload] = await Promise.all([
            uploadPlayerPhoto(photoFile),
            uploadPlayerID(idFile)
          ]);

          if (!photoUpload.success || !idUpload.success) {
            setStatus("error");
            setMessage("Payment verified, but file upload failed. Please contact support so we can complete your registration.");
            return;
          }

          setMessage("Files uploaded. Generating your official Player ID...");

          const insertPayload: Omit<Database["public"]["Tables"]["players"]["Insert"], "id"> = {
            full_name: pending.fullName,
            age: pending.age,
            position: pending.position,
            preferred_foot: pending.preferredFoot,
            contact_number: pending.contactNumber,
            email: pending.email,
            instagram: pending.instagram || null,
            area: pending.area,
            photo_url: photoUpload.url || null,
            id_url: idUpload.url || null,
            payment_status: "completed",
            order_id: orderId,
            application_status: "UNDER REVIEW",
          };

          const insertResult = await insertPlayer(insertPayload);
          if (!insertResult.success) {
            setStatus("error");
            setMessage("Payment verified but we couldn't save your registration. Contact support.");
            return;
          }

          const emailData = {
            playerName: pending.fullName,
            playerId: insertResult.data?.playerId || "",
            email: pending.email,
            paymentStatus: "completed"
          };

          void fetch("/api/send-confirmation-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData)
          }).catch(() => undefined);

          await deletePendingPlayerRegistration(orderId).catch(() => undefined);
          sessionStorage.removeItem("pendingPlayerRegistration");
          setPlayerId(insertResult.data?.playerId || null);
          setStatus("success");
        } else {
          setStatus("cancelled");
          setMessage(
            "Your payment was cancelled or not completed. Please return to the registration form to try again."
          );
        }
      } catch {
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
              className="btn btn-primary"
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
              className="btn btn-secondary"
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
          <Link href="/" className="btn btn-primary mt-8">
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
          <Link href="/" className="btn btn-primary mt-8">
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
