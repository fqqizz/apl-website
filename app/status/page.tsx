"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

type StatusResult = {
  player_id: string;
  application_status: string;
  created_at: string;
};

const statusTone: Record<string, string> = {
  "UNDER REVIEW": "bg-ink text-white",
  APPROVED: "bg-apex text-white",
  REJECTED: "bg-white text-ink border border-ink/12",
  "PENDING VERIFICATION": "bg-white text-apex border border-apex/20"
};

export default function StatusPage() {
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
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-6 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-xl flex-col justify-center">
        <Link href="/" className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-medium text-ink/62 backdrop-blur-xl">
          <ArrowLeft size={15} />
          Home
        </Link>

        <section className="rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-[0_30px_90px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
          <p className="eyebrow">Application Status</p>
          <h1 className="display mt-5 text-[clamp(3rem,12vw,5.8rem)]">Check your APL application.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-ink/58">
            Enter your Player ID to view only your status, submission date, and official application reference.
          </p>

          <form onSubmit={checkStatus} className="mt-8 grid gap-3">
            <input
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="APL-4821"
              value={playerId}
              onChange={(event) => setPlayerId(event.target.value.toUpperCase())}
              className="field bg-white"
            />
            <button
              disabled={loading}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:bg-apex disabled:pointer-events-none disabled:opacity-60"
            >
              <Search size={16} />
              {phase === "checking" ? "Checking Status..." : phase === "verifying" ? "Verifying Application..." : "Check Status"}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 rounded-[1.5rem] border border-apex/15 bg-white/85 p-5 text-sm leading-7 text-ink/64"
              >
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 rounded-[1.75rem] border border-ink/10 bg-white/85 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/42">Player ID</p>
                    <p className="mt-2 text-2xl font-medium">{result.player_id}</p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] ${statusTone[result.application_status] || statusTone["UNDER REVIEW"]}`}>
                    {result.application_status}
                  </span>
                </div>
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/42">Submission Date</p>
                  <p className="mt-2 text-base text-ink/70">
                    {new Date(result.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
