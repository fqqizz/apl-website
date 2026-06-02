"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I'm Apex AI — ask me about player registration, franchises, Season One, or your application status."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/apex-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply || data.error || "Please try again or call +91 8491900407." }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Connection issue. Call +91 8491900407 for immediate help." }
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <>
      <button type="button" className="apex-ai-fab" onClick={() => setOpen((o) => !o)} aria-label="Open Apex AI">
        <Sparkles size={16} className="text-apl-blue" />
        Apex AI
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-[9998] flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-apl-accent bg-apl-navy/95 shadow-2xl backdrop-blur-xl md:bottom-24 md:right-6"
            style={{ height: 480 }}
          >
            <div className="flex items-center justify-between border-b border-apl px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles size={14} className="text-apl-blue" />
                Apex AI
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="text-apl-text-muted hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto bg-apl-blue text-white"
                      : "bg-apl-glass text-apl-text-secondary"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-apl-glass" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-apl-glass" />
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-apl p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about APL..."
                  className="field flex-1 !min-h-[44px] !py-2 text-sm"
                />
                <button type="submit" disabled={loading} className="btn-primary !min-h-[44px] !px-3" aria-label="Send">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
