"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

type Phase = "idle" | "loading" | "success" | "error";

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setPhase("error");
        setMessage(data.error || "Failed to send.");
        return;
      }
      setPhase("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setPhase("error");
      setMessage("Network error. Call +91 8491900407.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form-surface max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-label text-apl-text-muted">Name *</span>
          <input name="name" required className="field" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-label text-apl-text-muted">Email *</span>
          <input name="email" type="email" required className="field" placeholder="you@email.com" />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Phone</span>
        <input name="phone" type="tel" className="field" placeholder="+91" />
      </label>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Subject *</span>
        <input name="subject" required className="field" placeholder="How can we help?" />
      </label>
      <label className="block">
        <span className="mb-2 block text-label text-apl-text-muted">Message *</span>
        <textarea name="message" required rows={5} className="field resize-none" placeholder="Your message" />
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
      {phase === "success" && <p className="text-sm text-emerald-400">Message sent. The APL team will respond shortly.</p>}
      {phase === "error" && <p className="text-sm text-red-400">{message}</p>}
    </form>
  );
}
