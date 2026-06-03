"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import ApexMascot from "@/components/features/ApexMascot";

type Message = { role: "user" | "assistant"; content: string };

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Apex, your APL assistant. Ask me about registration, Player IDs, franchises, fees, or Season One."
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
      const reply =
        data.reply ||
        "I can help with APL registration (₹249), Player IDs, 16 franchises, 288 players, and Season One. Call +91 8491900407 for account-specific help.";
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Connection issue. APL is a 16-franchise league with 288 player slots — register at /register/player. For urgent help call +91 8491900407."
        }
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <>
      <button type="button" className="apex-ai-fab" onClick={() => setOpen((o) => !o)} aria-label="Open Apex AI">
        <ApexMascot className="h-7 w-7" />
        <span className="font-medium">Apex AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="apex-ai-panel fixed bottom-24 right-4 z-[9998] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl md:right-6"
            style={{ height: 500 }}
          >
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
              <ApexMascot className="h-9 w-9" />
              <div className="flex-1">
                <p className="text-sm font-medium text-apl-navy">Apex</p>
                <p className="text-xs text-apl-text-muted">Official APL assistant</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-apl-text-muted hover:text-apl-navy">
                <X size={18} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fafbfc] p-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={`${msg.role}-${i}`}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user" ? "apex-ai-bubble-user ml-auto" : "apex-ai-bubble-assistant"
                    }`}
                  >
                    {msg.content}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="apex-ai-bubble-assistant max-w-[80%] rounded-2xl px-3.5 py-2.5 flex items-center gap-2"
                >
                  <span className="text-xs text-apl-text-muted font-medium">Apex is thinking</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-navy/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-navy/40 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-navy/40 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
                  </span>
                </motion.div>
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-black/5 bg-white p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about APL..."
                  className="admin-field flex-1 !min-h-[44px] text-sm"
                />
                <button type="submit" disabled={loading} className="admin-btn-primary !min-h-[44px] !px-3" aria-label="Send">
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
