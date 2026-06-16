

import { FormEvent, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { CONTACT_PHONE } from "@/lib/apl-constants";

type Phase = "idle" | "loading" | "success" | "error";

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function ContactForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhase("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      subject: form.get("subject"),
      message: form.get("message")
    };

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const res = await fetch("/api/apl/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      const data = await readJsonResponse(res);
      if (!res.ok) {
        setPhase("error");
        setMessage(data.error || "We could not send your message. Please try again or call us directly.");
        return;
      }
      setPhase("success");
      setMessage("Your message has been sent to the APL team. We will respond as soon as possible.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setPhase("error");
      setMessage(
        err instanceof DOMException && err.name === "AbortError"
          ? `The contact request is taking too long. Please call ${CONTACT_PHONE} or email contact@apexpremiereleague.in.`
          : `Network error. Please call ${CONTACT_PHONE} or email contact@apexpremiereleague.in.`
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="form-surface max-w-xl space-y-4">
      {phase === "success" && (
        <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3" role="status">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={20} />
          <div>
            <p className="text-sm font-medium text-emerald-300">Message sent</p>
            <p className="mt-1 text-sm text-apl-text-secondary">{message}</p>
          </div>
        </div>
      )}
      {phase === "error" && (
        <div className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3" role="alert">
          <AlertCircle className="mt-0.5 shrink-0 text-red-400" size={20} />
          <div>
            <p className="text-sm font-medium text-red-300">Could not send</p>
            <p className="mt-1 text-sm text-apl-text-secondary">{message}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-label text-apl-text-muted">Name *</span>
          <input name="name" required className="field" placeholder="Your full name" disabled={phase === "loading"} />
        </label>
        <label className="block">
          <span className="mb-2 block text-label text-apl-text-muted">Email *</span>
          <input
            name="email"
            type="email"
            required
            className="field"
            placeholder="you@email.com"
            disabled={phase === "loading"}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Phone</span>
        <input name="phone" type="tel" className="field" placeholder="+91" disabled={phase === "loading"} />
      </label>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Subject *</span>
        <input name="subject" required className="field" placeholder="Registration, franchise, or general enquiry" disabled={phase === "loading"} />
      </label>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          className="field resize-none"
          placeholder="How can we help?"
          disabled={phase === "loading"}
        />
      </label>
      <button type="submit" disabled={phase === "loading"} className="btn-primary">
        {phase === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
