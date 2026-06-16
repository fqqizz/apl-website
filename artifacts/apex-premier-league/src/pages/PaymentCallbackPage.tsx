

import { Suspense, useEffect, useRef, useState } from "react";

import { Link, useSearch } from 'wouter';
import { motion } from "framer-motion";
import { Check, XCircle, AlertTriangle, ArrowRight, Home, CheckCircle2, ShieldAlert } from "lucide-react";
import { insertPlayer, getPlayerByOrderId } from "@/lib/database";
import type { Database } from "@/lib/database.types";
import { deletePendingPlayerRegistration, getPendingPlayerRegistration } from "@/lib/pendingRegistration";
import { uploadPlayerID, uploadPlayerPhoto } from "@/lib/uploads";

type PaymentResult = {
  order_status?: string;
  message?: string;
  error?: string;
};

async function readJsonResponse(response: Response): Promise<PaymentResult> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function PaymentCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const searchStr = useSearch();
  const searchParams = new URLSearchParams(searchStr);
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
        const response = await fetch(`/api/apl/payments/verify?order_id=${encodeURIComponent(orderId)}`, {
          signal: controller.signal
        });
        window.clearTimeout(timeout);
        const data = await readJsonResponse(response);

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || data.message || "Unable to verify payment. Please return to the registration form and try again.");
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

          void fetch("/api/apl/send-confirmation-email", {
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
  }, [searchStr]);

  const getActiveStep = () => {
    if (!message) return 0; // Processing
    if (message.includes("Uploading")) return 1; // Verifying & Uploading
    if (message.includes("official Player ID") || message.includes("Generating")) return 2; // Generating ID
    return 3; // Finalizing
  };

  const steps = [
    "Processing Payment",
    "Verifying & Uploading Documents",
    "Generating Player ID",
    "Finalizing Registration"
  ];

  const currentStep = getActiveStep();

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {status === "loading" && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass-card p-8 text-center border border-apl-border-accent relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-apl-blue/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="animate-spin inline-block w-12 h-12 border-2 border-apl-blue-bright/20 border-t-apl-blue-bright rounded-full"></div>
            <h2 className="mt-6 text-xl font-semibold text-white tracking-wide">Processing Registration</h2>
            <p className="mt-2 text-sm text-apl-text-secondary min-h-[40px] italic">
              {message || "Connecting to payment gateway..."}
            </p>
            
            {/* Progress steps */}
            <div className="mt-8 space-y-3.5 text-left border-t border-apl-border pt-6">
              {steps.map((stepText, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                    idx < currentStep 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : idx === currentStep 
                        ? "bg-apl-blue/20 border-apl-blue text-apl-blue-bright animate-pulse" 
                        : "bg-transparent border-apl-border text-apl-text-muted"
                  }`}>
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>
                  <span className={`text-sm ${
                    idx <= currentStep ? "text-apl-text-primary font-medium" : "text-apl-text-muted"
                  }`}>
                    {stepText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 border border-apl-border-accent relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-apl-blue/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
              <Check className="h-8 w-8" />
            </div>
            
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">Registration Successful</h1>
            <p className="mt-2.5 text-sm text-apl-text-secondary">
              Your application has been received and is officially logged into the APL database.
            </p>

            {/* Player ID Highlight */}
            {playerId ? (
              <div className="mt-8 p-5 rounded-xl border border-apl-border-accent bg-apl-navy-light/60 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-apl-blue/10 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs uppercase tracking-[0.2em] text-apl-gold font-semibold">Official Player ID Generated</p>
                <p className="mt-2.5 text-3xl font-bold tracking-wider text-white font-mono">{playerId}</p>
                <p className="mt-2 text-[11px] text-apl-text-muted">Take a screenshot of this page or check your email for confirmation.</p>
              </div>
            ) : (
              <div className="mt-8 p-5 rounded-xl border border-apl-border bg-apl-glass text-center">
                <p className="text-sm text-apl-text-secondary font-medium">Your Player ID will be generated and emailed shortly.</p>
              </div>
            )}

            {/* Application status explanation & next steps */}
            <div className="mt-8 text-left border-t border-apl-border pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Application Status: <span className="text-apl-gold">UNDER REVIEW</span></h3>
                <p className="mt-1 text-xs leading-relaxed text-apl-text-secondary">
                  The APL Committee is reviewing your documents (ID & Photo) to verify eligibility. You can use your email/phone to check real-time status updates.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Next Steps</h3>
                <ul className="mt-2 space-y-2 text-xs text-apl-text-secondary list-disc pl-4">
                  <li>Committee documents review and validation (24-48 hours).</li>
                  <li>Receipt of confirmation email containing official APL guidelines.</li>
                  <li>Squad Draft selection notification for Season One.</li>
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/status" className="btn-primary w-full justify-center text-xs">
                Check Status <ArrowRight size={14} />
              </Link>
              <Link href="/" className="btn-secondary w-full justify-center text-xs">
                <Home size={14} /> Return Home
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {status === "cancelled" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="glass-card p-8 text-center border border-red-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
              <XCircle className="w-8 h-8" />
            </div>
            
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Payment Cancelled</h1>
            <p className="mt-3 text-sm text-apl-text-secondary max-w-xs mx-auto">
              Your payment transaction was cancelled or not completed by the payment gateway.
            </p>
            
            <div className="mt-6 p-4 rounded-lg bg-apl-glass border border-apl-border text-xs text-apl-text-muted text-left space-y-2">
              <p className="font-semibold text-apl-text-secondary">Need Help?</p>
              <p>Common failure reasons include network timeouts, user cancellation, or insufficient bank limits.</p>
              <p>For support, contact us at <span className="text-white">+91 8491900407</span> or email <span className="text-white">contact@apexpremiereleague.in</span>.</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register/player" className="btn-primary justify-center text-xs px-6">
                Try Registration Again
              </Link>
              <Link href="/" className="btn-secondary justify-center text-xs px-6">
                Return Home
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="glass-card p-8 text-center border border-yellow-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto text-yellow-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Unable to Verify Payment</h1>
            <p className="mt-3 text-sm text-apl-text-secondary max-w-sm mx-auto">
              {message || "We encountered an issue while verifying your transaction status."}
            </p>

            <div className="mt-6 p-4 rounded-lg bg-apl-glass border border-apl-border text-xs text-apl-text-muted text-left space-y-2">
              <p className="font-semibold text-apl-text-secondary">Important Note</p>
              <p>If money was deducted from your account, please do not register again. We will reconcile your payment details and finalize your registration manually.</p>
              <p>Contact support with your transaction reference or name: <span className="text-white">+91 8491900407</span>.</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register/player" className="btn-primary justify-center text-xs px-6">
                Return to Registration
              </Link>
              <Link href="/" className="btn-secondary justify-center text-xs px-6">
                Go to Home
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <main className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-apl-navy-mid via-apl-navy to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apl-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <Suspense fallback={<div className="text-center"><p className="text-apl-text-secondary">Loading payment status...</p></div>}>
        <PaymentCallbackContent />
      </Suspense>
    </main>
  );
}
