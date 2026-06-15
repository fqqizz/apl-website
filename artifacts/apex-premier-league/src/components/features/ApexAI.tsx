import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  "How do I register?",
  "Tell me about franchises",
  "What awards are there?"
];

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Apex AI — your guide to everything APL. Ask me about registrations, franchises, the season format, awards, or anything about the league."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleChipClick = (chipText: string) => {
    setInput(chipText);
    setTimeout(() => {
      const form = document.getElementById("apex-ai-form") as HTMLFormElement;
      if (form) form.requestSubmit();
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
        "I can help with APL registration, Player IDs, the 16 franchises, 288 player slots, and Season One format. Call +91 8491900407 for account-specific help.";
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Connection issue right now. APL is a 16-franchise football league — register at /register/player or call +91 8491900407."
        }
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() =>
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
      );
    }
  };

  return (
    <>
      <button
        type="button"
        className="apex-ai-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Apex AI"
      >
        <img
          src="/live-chat.png"
          alt="Apex AI"
          width={26}
          height={26}
          className="h-[26px] w-[26px] object-contain filter invert"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="apex-ai-panel fixed bottom-[84px] right-4 z-[9998] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl md:right-6"
            style={{ height: 520 }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="relative">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <img
                    src="/live-chat.png"
                    alt="Apex AI"
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain filter invert"
                  />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
                  style={{ background: "#22c55e", borderColor: "var(--apl-navy)" }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white tracking-wide">Apex AI</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  APL's official assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={`${msg.role}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
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
                  className="apex-ai-bubble-assistant max-w-[80%] rounded-2xl px-3.5 py-3 flex items-center gap-1.5"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full animate-bounce"
                      style={{
                        background: "rgba(255,255,255,0.35)",
                        animationDelay: `${delay}ms`,
                        animationDuration: "0.9s"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            <div
              className="px-4 pt-2 pb-1.5 flex flex-wrap gap-1.5"
              style={{ background: "var(--apl-navy)" }}
            >
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="text-[11px] font-medium rounded-full px-2.5 py-1 transition-all duration-200"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              id="apex-ai-form"
              onSubmit={sendMessage}
              className="p-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--apl-navy)" }}
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about APL…"
                  className="flex-1 min-h-[40px] text-sm rounded-lg px-3 text-white placeholder-white/25 focus:outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)"
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(212,175,55,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[40px] px-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ background: "white", color: "var(--apl-navy)" }}
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
