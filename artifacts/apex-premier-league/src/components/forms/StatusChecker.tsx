

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";

type StatusResult = {
  player_id: string;
  application_status: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  APPROVED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  REJECTED: "bg-red-500/10 text-red-300 border-red-500/30",
  "UNDER REVIEW": "bg-apl-blue-dim text-apl-blue border-apl-border-accent",
  "PENDING VERIFICATION": "bg-apl-glass text-apl-text-secondary border-apl"
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
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`/api/status?player_id=${encodeURIComponent(normalized)}`, {
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Application not found.");
        return;
      }
      setResult(data);
    } catch {
      setError("Status lookup is taking too long. Please try again.");
    } finally {
      window.clearTimeout(verifyTimer);
      setPhase("idle");
    }
  };

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
          <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-body-md text-apl-text-secondary">
            {error}
          </motion.p>
        )}
        {result && (
          <motion.div key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-lg border border-apl bg-apl-glass p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-label text-apl-text-muted">Player ID</p>
                <p className="mt-1 text-xl text-apl-white">{result.player_id}</p>
              </div>
              <span
                className={`rounded-full border px-4 py-2 text-label ${
                  statusStyles[result.application_status] || statusStyles["UNDER REVIEW"]
                }`}
              >
                {result.application_status || "UNDER REVIEW"}
              </span>
            </div>
            <p className="mt-5 border-t border-apl pt-4 text-body-md text-apl-text-secondary">
              Submitted{" "}
              {new Date(result.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
