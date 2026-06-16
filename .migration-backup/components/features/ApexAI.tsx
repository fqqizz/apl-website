"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  "How do I register?",
  "Tell me about franchises",
  "How many matches are there?",
  "What awards are available?",
  "What is the prize pool?",
  "What is the season format?",
  "How many players participate?",
  "How do franchises work?",
  "Who can join?",
  "What is APL's vision?"
];

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Apex AI. Ask me about registration, franchises, awards, the season format, player IDs, or APL's long-term vision."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [chipOffset, setChipOffset] = useState(0);
  const [usedChips, setUsedChips] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const orderedChips = CHIPS.filter((chip) => !usedChips.includes(chip)).concat(
    CHIPS.filter((chip) => usedChips.includes(chip))
  );
  const visibleChips = [...orderedChips, ...orderedChips].slice(chipOffset, chipOffset + 3);

  const handleChipClick = (chipText: string) => {
    setInput(chipText);
    setUsedChips((chips) => [...chips.filter((chip) => chip !== chipText), chipText]);
    setChipOffset((offset) => (offset + 1) % Math.max(CHIPS.length - 2, 1));
    setTimeout(() => {
      const form = document.getElementById("apex-ai-form") as HTMLFormElement | null;
      form?.requestSubmit();
    }, 50);
  };

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
        "I can help with APL registration (INR 249), Player IDs, 16 franchises, 288 players, and Season One. Call +91 8491900407 for account-specific help.";
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Connection issue. APL is a 16-franchise league with 288 player slots. Register at /register/player, or call +91 8491900407 for urgent help."
        }
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <>
      <button
        type="button"
        className="apex-ai-fab !fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-full p-2"
        style={{ width: "56px", height: "56px", minHeight: "56px" }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Apex AI"
      >
        <Image src="/live-chat.png" alt="Apex AI" width={36} height={36} className="h-9 w-9 object-contain invert" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="apex-ai-panel fixed bottom-24 right-4 z-[9998] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl md:right-6"
            style={{ height: 520 }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 bg-apl-navy px-4 py-3">
              <div className="relative">
                <Image src="/live-chat.png" alt="Apex AI" width={36} height={36} className="h-9 w-9 object-contain invert" />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-apl-navy bg-apl-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white">APEX AI</p>
                  <Sparkles className="h-3 w-3 text-apl-gold" />
                </div>
                <p className="text-[11px] text-apl-text-secondary">Official league assistant</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-apl-text-secondary transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-apl-navy/95 p-4">
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
                  className="apex-ai-bubble-assistant flex max-w-[80%] items-center gap-2 rounded-2xl px-3.5 py-2.5"
                >
                  <span className="text-xs font-medium text-apl-text-secondary">Apex is checking the league book</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-apl-gold/60 [animation-duration:0.8s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-apl-gold/60 [animation-delay:150ms] [animation-duration:0.8s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-apl-gold/60 [animation-delay:300ms] [animation-duration:0.8s]" />
                  </span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 bg-apl-navy/95 px-4 pb-2 pt-1">
              {visibleChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-apl-text-secondary transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form id="apex-ai-form" onSubmit={sendMessage} className="border-t border-white/10 bg-apl-navy-mid/90 p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Apex AI anything about APL..."
                  className="min-h-[44px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-apl-text-secondary/50 transition-colors focus:border-apl-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-h-[44px] items-center justify-center rounded-lg bg-apl-gold px-3 text-apl-navy transition-colors hover:bg-white disabled:opacity-50"
                  aria-label="Send"
                >
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
