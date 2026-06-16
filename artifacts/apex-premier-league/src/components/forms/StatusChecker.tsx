

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Shield, CreditCard, MapPin, Calendar, User, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

type StatusResult = {
  player_id: string;
  full_name: string;
  application_status: string;
  payment_status: string;
  position: string;
  area: string;
  age: number;
  photo_url: string | null;
  created_at: string;
};

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  APPROVED: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    label: "Approved"
  },
  REJECTED: {
    bg: "bg-red-500/10",
    text: "text-red-300",
    border: "border-red-500/30",
    label: "Rejected"
  },
  "UNDER REVIEW": {
    bg: "bg-apl-blue/10",
    text: "text-apl-blue-bright",
    border: "border-apl-blue/30",
    label: "Under Review"
  },
  "PENDING VERIFICATION": {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/30",
    label: "Pending Verification"
  }
};

const paymentStatusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: "text-emerald-400", label: "₹249 Paid ✓" },
  pending: { color: "text-amber-400", label: "Pending" },
  failed: { color: "text-red-400", label: "Failed" },
};

export default function StatusChecker() {
  const [playerId, setPlayerId] = useState("");
  const [phase, setPhase] = useState<"idle" | "checking" | "verifying">("idle");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState("");
  const loading = phase !== "idle";

  const checkStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const normalized = playerId.trim().toUpperCase();
    setError("");
    setResult(null);

    if (!/^APL-\d{4,5}$/.test(normalized)) {
      setError("Enter a valid Player ID, for example APL-4821.");
      return;
    }

    setPhase("checking");
    const verifyTimer = window.setTimeout(() => setPhase("verifying"), 650);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch(`/api/apl/status?player_id=${encodeURIComponent(normalized)}`, {
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = await readJsonResponse(response);

      if (!response.ok) {
        setError(data.error || "We could not verify that Player ID right now. Please try again.");
        return;
      }
      setResult(data);
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "Status lookup is taking too long. Please try again."
          : "Network error. Please check your connection and try again."
      );
    } finally {
      window.clearTimeout(verifyTimer);
      setPhase("idle");
    }
  };

  const appStatus = result ? (statusConfig[result.application_status] || statusConfig["UNDER REVIEW"]) : null;
  const payStatus = result ? (paymentStatusConfig[result.payment_status] || paymentStatusConfig.pending) : null;

  return (
    <div className="glass-card p-6 md:p-8">
      <form onSubmit={checkStatus} className="grid gap-4">
        <label className="block">
          <span className="mb-2 block text-label text-apl-text-muted">Player ID</span>
          <input
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value.toUpperCase())}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="APL-4821"
            className="field"
          />
        </label>
        <Button type="submit" disabled={loading} className="w-full justify-center">
          <Search size={16} />
          {phase === "checking" ? "Checking..." : phase === "verifying" ? "Verifying..." : "Check Status"}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-5 text-body-md text-red-400">
            {error}
          </motion.p>
        )}
        {result && appStatus && payStatus && (
          <motion.div 
            key="res" 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-xl border border-apl-border-accent bg-gradient-to-b from-apl-navy-light/80 to-apl-glass overflow-hidden"
          >
            {/* Player header with photo */}
            <div className="p-5 pb-4 flex items-center gap-4 border-b border-apl-border">
              {result.photo_url ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-apl-border-accent shrink-0 shadow-lg"
                >
                  <img src={result.photo_url} alt={result.full_name} className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-apl-glass border-2 border-apl-border flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-apl-text-muted" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white truncate">{result.full_name}</h3>
                <p className="text-sm font-mono text-apl-blue-bright">{result.player_id}</p>
              </div>
              <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${appStatus.bg} ${appStatus.text} ${appStatus.border}`}>
                {appStatus.label}
              </span>
            </div>

            {/* Details grid */}
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <CreditCard size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Payment</span>
                </div>
                <p className={`text-sm font-semibold ${payStatus.color}`}>{payStatus.label}</p>
              </div>
              
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <Shield size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Position</span>
                </div>
                <p className="text-sm font-medium text-white">{result.position}</p>
              </div>
              
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <MapPin size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Area</span>
                </div>
                <p className="text-sm font-medium text-white truncate">{result.area}</p>
              </div>
              
              <div className="rounded-lg bg-apl-glass border border-apl-border p-3">
                <div className="flex items-center gap-1.5 text-apl-text-muted mb-1">
                  <Calendar size={11} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Registered</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {new Date(result.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Application status note */}
            {result.application_status === "UNDER REVIEW" && (
              <div className="mx-5 mb-5 p-3 rounded-lg bg-apl-blue/5 border border-apl-blue/15 flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-apl-blue mt-0.5 shrink-0" />
                <p className="text-xs text-apl-text-secondary leading-relaxed">
                  Your application is being reviewed by the APL committee. You will be notified via email once a decision has been made.
                </p>
              </div>
            )}
            {result.application_status === "APPROVED" && (
              <div className="mx-5 mb-5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Congratulations! Your registration has been approved. Check your email for Season One details and squad draft information.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
