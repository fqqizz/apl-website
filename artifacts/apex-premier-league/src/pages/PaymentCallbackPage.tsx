

import { Suspense, useEffect, useRef, useState } from "react";
import { Link, useSearch } from 'wouter';
import { motion, AnimatePresence } from "framer-motion";
import { Check, XCircle, AlertTriangle, ArrowRight, Home, Download, Share2, Shield, Clock, CreditCard, MapPin, User } from "lucide-react";
import { insertPlayer, getPlayerByOrderId } from "@/lib/database";
import type { Database } from "@/lib/database.types";
import { deletePendingPlayerRegistration, getPendingPlayerRegistration, type PendingPlayerRegistration } from "@/lib/pendingRegistration";
import { uploadPlayerID, uploadPlayerPhoto } from "@/lib/uploads";

type PaymentResult = {
  order_status?: string;
  message?: string;
  error?: string;
};

type SuccessData = {
  playerName: string;
  playerId: string;
  orderId: string;
  position: string;
  area: string;
  email: string;
  timestamp: string;
  photoUrl: string | null;
  localPhotoUrl: string | null;
};

const REGISTRATION_FEE = 249;

async function readJsonResponse(response: Response): Promise<PaymentResult> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/** Retry a function up to maxAttempts with exponential backoff */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

/** Generate a downloadable receipt image using Canvas */
function generateReceipt(data: SuccessData): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const w = 800;
    const h = 1100;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#07111D");
    bg.addColorStop(0.4, "#0c1e34");
    bg.addColorStop(1, "#07111D");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Gold accent line at top
    const goldGrad = ctx.createLinearGradient(0, 0, w, 0);
    goldGrad.addColorStop(0, "#D4AF37");
    goldGrad.addColorStop(0.5, "#e8c84a");
    goldGrad.addColorStop(1, "#D4AF37");
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, 4);

    // Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px 'Bebas Neue', Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("APEX PREMIER LEAGUE", w / 2, 80);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "14px 'DM Sans', sans-serif";
    ctx.fillText("OFFICIAL REGISTRATION RECEIPT", w / 2, 110);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 140);
    ctx.lineTo(w - 60, 140);
    ctx.stroke();

    // Success badge
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(w / 2, 200, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("✓", w / 2, 214);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px 'DM Sans', sans-serif";
    ctx.fillText("PAYMENT SUCCESSFUL", w / 2, 268);

    // Player ID box
    ctx.fillStyle = "rgba(26, 107, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(100, 310, w - 200, 100, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(26, 107, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, 310, w - 200, 100, 16);
    ctx.stroke();

    ctx.fillStyle = "#D4AF37";
    ctx.font = "12px 'DM Sans', sans-serif";
    ctx.fillText("OFFICIAL PLAYER ID", w / 2, 345);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'DM Sans', monospace";
    ctx.fillText(data.playerId || "PENDING", w / 2, 390);

    // Details section
    const details = [
      ["Player Name", data.playerName],
      ["Position", data.position],
      ["Area / District", data.area],
      ["Email", data.email],
      ["Amount Paid", `₹${REGISTRATION_FEE}`],
      ["Payment Status", "Completed"],
      ["Application Status", "UNDER REVIEW"],
      ["Order Reference", data.orderId],
      ["Registration Date", new Date(data.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
    ];

    let y = 470;
    ctx.textAlign = "left";

    for (const [label, value] of details) {
      ctx.fillStyle = "#5a6a7e";
      ctx.font = "12px 'DM Sans', sans-serif";
      ctx.fillText(label, 100, y);
      ctx.fillStyle = "#ffffff";
      ctx.font = "15px 'DM Sans', sans-serif";
      ctx.fillText(String(value), 100, y + 22);
      
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(100, y + 36);
      ctx.lineTo(w - 100, y + 36);
      ctx.stroke();
      
      y += 52;
    }

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillText("This is an official registration receipt from Apex Premier League.", w / 2, h - 60);
    ctx.fillText("For queries: contact@apexpremiereleague.in | +91 8491900407", w / 2, h - 40);

    // Gold line at bottom
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, h - 4, w, 4);

    canvas.toBlob((blob) => resolve(blob!), "image/png", 1);
  });
}

function SuccessConfetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: "-10px",
            backgroundColor: ["#D4AF37", "#1a6bff", "#10b981", "#ffffff", "#e8c84a"][i % 5],
          }}
          initial={{ y: -20, opacity: 1, scale: 0 }}
          animate={{
            y: [0, 300 + Math.random() * 200],
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

function PaymentCallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
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
          setMessage("Payment verified. Finalizing registration...");

          // Check if already saved (idempotency)
          try {
            const existing = await getPlayerByOrderId(orderId);
            if (existing.success && existing.data) {
              setSuccessData({
                playerName: existing.data.fullName,
                playerId: existing.data.playerId || "",
                orderId,
                position: existing.data.position,
                area: existing.data.area,
                email: existing.data.email,
                timestamp: existing.data.createdAt,
                photoUrl: existing.data.photoUrl || null,
                localPhotoUrl: null,
              });
              setStatus("success");
              sessionStorage.removeItem("pendingPlayerRegistration");
              return;
            }
          } catch {
            // Continue to attempt save
          }

          const pending = await getPendingPlayerRegistration(orderId);
          if (!pending) {
            setStatus("error");
            setMessage("Payment verified, but your registration data was not found on this device. Please contact support with your order ID: " + orderId);
            return;
          }

          // Create a local blob URL for displaying the photo
          let localPhotoUrl: string | null = null;
          try {
            const photoBlob = pending.photoFile instanceof File ? pending.photoFile : new Blob([pending.photoFile], { type: pending.photoType });
            localPhotoUrl = URL.createObjectURL(photoBlob);
          } catch {
            // Non-critical
          }

          setMessage("Uploading your documents securely...");

          // Upload files with retry logic
          const photoFile = pending.photoFile instanceof File
            ? pending.photoFile
            : new File([pending.photoFile], pending.photoName, { type: pending.photoType });
          const idFile = pending.idFile instanceof File
            ? pending.idFile
            : new File([pending.idFile], pending.idName, { type: pending.idType });

          let photoUrl: string | null = null;
          let idUrl: string | null = null;
          let uploadFailed = false;

          try {
            const [photoUpload, idUpload] = await Promise.all([
              withRetry(() => uploadPlayerPhoto(photoFile), 3, 1000),
              withRetry(() => uploadPlayerID(idFile), 3, 1000),
            ]);
            if (photoUpload.success) photoUrl = photoUpload.url || null;
            if (idUpload.success) idUrl = idUpload.url || null;
            if (!photoUpload.success || !idUpload.success) uploadFailed = true;
          } catch {
            uploadFailed = true;
          }

          setMessage("Generating your official Player ID...");

          // CRITICAL: Always save the player record, even if uploads failed.
          // A paid registration must NEVER be lost.
          const insertPayload: Omit<Database["public"]["Tables"]["players"]["Insert"], "id"> = {
            full_name: pending.fullName,
            age: pending.age,
            position: pending.position,
            preferred_foot: pending.preferredFoot,
            contact_number: pending.contactNumber,
            email: pending.email,
            instagram: pending.instagram || null,
            area: pending.area,
            photo_url: photoUrl,
            id_url: idUrl,
            payment_status: "completed",
            order_id: orderId,
            application_status: uploadFailed ? "PENDING VERIFICATION" : "UNDER REVIEW",
          };

          const insertResult = await insertPlayer(insertPayload);
          if (!insertResult.success) {
            // Last resort: still show success with order ID as reference
            setSuccessData({
              playerName: pending.fullName,
              playerId: "",
              orderId,
              position: pending.position,
              area: pending.area,
              email: pending.email,
              timestamp: new Date().toISOString(),
              photoUrl: null,
              localPhotoUrl,
            });
            setStatus("success");
            return;
          }

          // Send confirmation email (fire and forget)
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

          setSuccessData({
            playerName: pending.fullName,
            playerId: insertResult.data?.playerId || "",
            orderId,
            position: pending.position,
            area: pending.area,
            email: pending.email,
            timestamp: insertResult.data?.createdAt || new Date().toISOString(),
            photoUrl: photoUrl || null,
            localPhotoUrl,
          });
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
    if (!message) return 0;
    if (message.includes("Uploading")) return 1;
    if (message.includes("Player ID") || message.includes("Generating")) return 2;
    return 3;
  };

  const steps = [
    "Processing Payment",
    "Uploading Documents",
    "Generating Player ID",
    "Finalizing Registration"
  ];

  const currentStep = getActiveStep();

  const handleDownloadReceipt = async () => {
    if (!successData || downloadingReceipt) return;
    setDownloadingReceipt(true);
    try {
      const blob = await generateReceipt(successData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `APL-Receipt-${successData.playerId || successData.orderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: do nothing
    }
    setDownloadingReceipt(false);
  };

  const handleShare = async () => {
    if (!successData) return;
    const shareData = {
      title: "APL Registration Confirmed",
      text: `I've officially registered for Apex Premier League Season One! Player ID: ${successData.playerId}`,
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("Copied to clipboard!");
      }
    } catch {
      // User cancelled or share failed
    }
  };

  const photoDisplay = successData?.localPhotoUrl || successData?.photoUrl;

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

      {status === "success" && successData && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card border border-apl-border-accent relative overflow-hidden"
        >
          <SuccessConfetti />
          
          {/* Success header gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/8 via-apl-blue/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {/* Player Photo + Badge */}
            <div className="relative px-8 pt-8 pb-4 text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="relative inline-block"
              >
                {photoDisplay ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/40 mx-auto shadow-lg shadow-emerald-500/10">
                    <img src={photoDisplay} alt={successData.playerName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-apl-navy-light border-2 border-emerald-500/40 mx-auto flex items-center justify-center">
                    <User className="w-10 h-10 text-apl-text-muted" />
                  </div>
                )}
                {/* Success checkmark overlay */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0c1e34] shadow-lg"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">{successData.playerName}</h1>
                <p className="mt-1 text-sm text-emerald-400 font-medium">Registration Successful ✓</p>
              </motion.div>
            </div>

            {/* Player ID Card */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.45 }}
              className="mx-6 p-5 rounded-xl border border-apl-border-accent bg-apl-navy-light/60 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-apl-blue/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-apl-gold/5 rounded-full blur-xl pointer-events-none" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-apl-gold font-semibold">Official Player ID</p>
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="mt-2 text-3xl font-bold tracking-wider text-white font-mono"
              >
                {successData.playerId || "Generating..."}
              </motion.p>
              {/* Shimmer effect on player ID */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Details Grid */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.55 }}
              className="mx-6 mt-5 grid grid-cols-2 gap-3"
            >
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <CreditCard size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Payment</span>
                </div>
                <p className="text-sm font-semibold text-emerald-400">₹{REGISTRATION_FEE} Paid ✓</p>
              </div>
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <Shield size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Status</span>
                </div>
                <p className="text-sm font-semibold text-apl-gold">Under Review</p>
              </div>
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <MapPin size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Area</span>
                </div>
                <p className="text-sm font-medium text-white truncate">{successData.area}</p>
              </div>
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <Clock size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Registered</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {new Date(successData.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </motion.div>

            {/* Application reference */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mx-6 mt-4 p-3 rounded-lg border border-apl-border bg-apl-glass"
            >
              <p className="text-[10px] uppercase tracking-wider text-apl-text-muted font-medium">Application Reference</p>
              <p className="mt-1 text-xs font-mono text-apl-text-secondary break-all">{successData.orderId}</p>
            </motion.div>

            {/* Next steps */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.7 }}
              className="mx-6 mt-5 text-left border-t border-apl-border pt-5"
            >
              <h3 className="text-sm font-semibold text-white">What happens next?</h3>
              <ul className="mt-2.5 space-y-2 text-xs text-apl-text-secondary list-none">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-apl-blue/15 border border-apl-blue/30 flex items-center justify-center text-[8px] text-apl-blue font-bold shrink-0">1</span>
                  Committee reviews your documents (24-48 hours)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-apl-blue/15 border border-apl-blue/30 flex items-center justify-center text-[8px] text-apl-blue font-bold shrink-0">2</span>
                  Confirmation email with official APL guidelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-apl-blue/15 border border-apl-blue/30 flex items-center justify-center text-[8px] text-apl-blue font-bold shrink-0">3</span>
                  Squad Draft selection for Season One
                </li>
              </ul>
            </motion.div>

            {/* Action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8 }}
              className="p-6 space-y-3"
            >
              <button
                onClick={handleDownloadReceipt}
                disabled={downloadingReceipt}
                className="btn-primary w-full justify-center text-sm"
              >
                <Download size={15} />
                {downloadingReceipt ? "Generating Receipt..." : "Download Receipt"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleShare} className="btn-secondary w-full justify-center text-xs">
                  <Share2 size={14} />
                  Share
                </button>
                <Link href="/status" className="btn-secondary w-full justify-center text-xs">
                  Check Status <ArrowRight size={14} />
                </Link>
              </div>
              <Link href="/" className="btn-ghost w-full justify-center text-xs !min-h-[38px]">
                <Home size={14} /> Return Home
              </Link>
            </motion.div>
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
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={<div className="text-center"><p className="text-apl-text-secondary">Loading payment status...</p></div>}>
        <PaymentCallbackContent />
      </Suspense>
    </main>
  );
}
