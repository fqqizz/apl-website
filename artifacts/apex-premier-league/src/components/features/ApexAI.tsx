

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  "How do I register?",
  "Tell me about franchises",
  "When does Season 1 start?"
];

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Apex AI — your guide to everything APL. Whether you want to know about registrations, franchises, the season format, or what it takes to compete — I've got you. What would you like to know?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleChipClick = (chipText: string) => {
    setInput(chipText);
    setTimeout(() => {
      const form = document.getElementById("apex-ai-form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
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
      const response = await fetch("/api/apl/apex-ai", {
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
      <button
        type="button"
        className="apex-ai-fab !fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-full p-2"
        style={{ width: "56px", height: "56px", minHeight: "56px" }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Apex AI"
      >
        <img
          src="/live-chat.png"
          alt="Apex AI"
          width={36}
          height={36}
          className="h-9 w-9 object-contain filter invert"
        />
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
            {/* Header with Glass Gradient Accent */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-gradient-to-r from-apl-navy to-apl-navy-mid">
              <div className="relative">
                <img
                  src="/live-chat.png"
                  alt="Apex AI"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain filter invert"
                />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-apl-navy animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white">APEX AI</p>
                  <Sparkles className="h-3 w-3 text-apl-blue" />
                </div>
                <p className="text-[11px] text-apl-text-secondary">Powered by APL Intelligence</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-apl-text-secondary hover:text-white transition-colors"
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
                  className="apex-ai-bubble-assistant max-w-[80%] rounded-2xl px-3.5 py-2.5 flex items-center gap-2"
                >
                  <span className="text-xs text-apl-text-secondary font-medium">Apex is thinking</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-blue/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-blue/40 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-apl-blue/40 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
                  </span>
                </motion.div>
              )}
            </div>

            <div className="bg-apl-navy/95 px-4 pb-2 pt-1 flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="text-[11px] font-medium text-apl-text-secondary hover:text-white bg-white/5 hover:bg-apl-blue/20 border border-white/10 rounded-full px-2.5 py-1 transition-all duration-200"
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
                  className="flex-1 min-h-[44px] text-sm bg-white/5 border border-white/10 rounded-lg px-3 text-white placeholder-apl-text-secondary/50 focus:outline-none focus:border-apl-blue transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[44px] px-3 bg-apl-blue hover:bg-apl-blue-bright text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
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
