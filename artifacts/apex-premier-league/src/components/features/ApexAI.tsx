import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const ALL_CHIP_POOL = [
  "How do I register?",
  "Tell me about franchises",
  "What awards are there?",
  "How many matches?",
  "What is the prize pool?",
  "What is the season format?",
  "How many players?",
  "Who can join APL?",
  "What is APL's vision?",
  "What is the refund policy?",
  "How do I check my status?",
  "Where is APL based?"
];

const APL_KB: Array<{ tags: string[]; answer: string }> = [
  {
    tags: ["register", "registration", "sign up", "apply", "join", "how do i register", "how to register", "how do i"],
    answer: "To register as a founding player, visit /register/player — the registration fee is ₹249. After verification, you receive a unique APL Player ID. For franchise ownership (very limited spots), visit /register/franchise. Both registrations are reviewed by the APL team."
  },
  {
    tags: ["fee", "cost", "price", "pay", "payment", "₹249", "₹", "rupee", "how much", "charge"],
    answer: "Player registration is ₹249. This secures your founding player spot and gets you an official APL Player ID. Franchise ownership fees are separate — visit /register/franchise for full pricing details."
  },
  {
    tags: ["franchise", "franchises", "owner", "ownership", "club", "team owner", "own a team", "franchise owner"],
    answer: "APL has 16 franchise teams in Season One. Each franchise operates independently with its own squad, identity, and matchday experience. Founding franchise spots are extremely limited with exclusive early benefits. Register at /register/franchise."
  },
  {
    tags: ["award", "awards", "trophy", "win", "winning", "golden boot", "golden glove", "player of the tournament", "best player"],
    answer: "Season One has 14 individual awards: Champions Trophy, Runner-Up Trophy, Golden Boot (top scorer), Golden Glove (best goalkeeper), Player of the Tournament, Young Player Award, Best Defender, Best Midfielder, Best Forward, Best Coach, Goal of the Season, Fans' Player, Fair Play Award, and Most Improved Player. Plus Man of the Match in every match — 83 awards total."
  },
  {
    tags: ["prize pool", "prize", "prize money", "₹5", "lakh", "winnings", "money", "cash"],
    answer: "The Season One prize pool is ₹5 Lakh, distributed across the champion franchise and individual award recipients."
  },
  {
    tags: ["season", "format", "structure", "stages", "phases", "how does it work", "competition format", "how it works"],
    answer: "Season One runs for 12 weeks across 4 stages: Group Stage (round-robin) → Elite League Phase (points table) → Playoffs (knockout) → Grand Final. All 16 franchises compete from day one, with 83 total scheduled matches."
  },
  {
    tags: ["players", "how many players", "squad size", "player count", "288", "total players", "how many"],
    answer: "Season One has 288 registered players across 16 franchises — 18 players per franchise. Every player receives a unique APL Player ID and becomes a permanent founding member of the league."
  },
  {
    tags: ["matches", "games", "fixtures", "how many matches", "83 matches", "schedule"],
    answer: "There are 83 scheduled matches in Season One — across Group Stage, Elite League Phase, Playoffs, and the Grand Final. Every single match has a Man of the Match award."
  },
  {
    tags: ["who can join", "eligibility", "age", "criteria", "requirements", "qualify", "am i eligible"],
    answer: "APL is open to football players from North Kashmir and the surrounding region. If you have the passion and skill, register at /register/player (₹249 fee) and the APL team will review your application."
  },
  {
    tags: ["vision", "mission", "why apl", "purpose", "goal", "what is apl", "about apl", "story"],
    answer: "APL exists to build what Kashmir's football talent has always deserved — a structured, long-term professional league. The vision: connect players, franchises, communities, and businesses under one professional ecosystem. Season One is just the beginning."
  },
  {
    tags: ["refund", "refund policy", "cancellation", "money back", "return"],
    answer: "APL's full refund policy is available at /refund-policy on the website. For specific queries, contact the team directly at +91 8491900407."
  },
  {
    tags: ["contact", "phone", "number", "call", "email", "reach out", "whatsapp", "help", "support"],
    answer: "Reach APL at: +91 8491900407 (Phone/WhatsApp). Official Instagram: @apexpremiereleague. You can also join the WhatsApp community or check /contact on the website."
  },
  {
    tags: ["sponsor", "partners", "sponsorship", "brand partner", "investment", "partnership"],
    answer: "APL has official partners and sponsors for Season One. For partnership or sponsorship opportunities, contact +91 8491900407 or visit /partners."
  },
  {
    tags: ["player id", "player number", "id card", "unique id", "identity", "player card"],
    answer: "Every verified APL player receives a unique Player ID — your official league identity for all matches, selections, and records. Register at /register/player to claim yours."
  },
  {
    tags: ["status", "application status", "check", "my application", "where is my registration", "application"],
    answer: "Check your registration status at /status on the website. Enter your details to see your application state. For urgent help, call +91 8491900407."
  },
  {
    tags: ["kashmir", "baramulla", "north kashmir", "where", "location", "based", "region"],
    answer: "APL is based in North Kashmir, centered around the Baramulla region. This is Kashmir's first professional franchise football league — built to elevate the valley's football culture."
  },
  {
    tags: ["season 1", "season one", "when", "start", "launch", "begin", "date", "2026", "when does it start"],
    answer: "APL Season One launches in 2026. Founding registrations are open now — both player and franchise spots are limited, so the earlier you register, the better your standing in APL history."
  },
  {
    tags: ["rules", "rulebook", "regulation", "official rules", "download", "pdf", "rule book"],
    answer: "The official APL Season One rulebook covers competition format, player eligibility, franchise standards, and all regulations. Download it from the website's Standards section."
  }
];

function getLocalResponse(input: string): string {
  const q = input.toLowerCase().trim();
  let best: { answer: string; score: number } | null = null;

  for (const entry of APL_KB) {
    const score = entry.tags.reduce((acc, tag) => acc + (q.includes(tag) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: entry.answer, score };
    }
  }

  return (
    best?.answer ??
    "APL is Kashmir's first professional franchise football league — 16 franchises, 288 players, 12-week season launching 2026. I can answer questions about registration, franchises, awards, the season format, and more. What would you like to know?"
  );
}

export default function ApexAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Apex AI — your guide to everything APL. Ask me about registration, franchises, awards, the season format, or anything about the league."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [visibleChips, setVisibleChips] = useState<string[]>(ALL_CHIP_POOL.slice(0, 3));
  const nextChipIndexRef = useRef(3);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() =>
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    );
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    scrollToBottom();

    const localReply = getLocalResponse(text);
    const delay = 220 + Math.random() * 180;

    await new Promise((r) => setTimeout(r, delay));
    setMessages([...nextMessages, { role: "assistant", content: localReply }]);
    setLoading(false);
    scrollToBottom();
  };

  const handleChipClick = (chipText: string) => {
    const nextIdx = nextChipIndexRef.current;
    nextChipIndexRef.current = nextIdx + 1;

    setVisibleChips((prev) => {
      const updated = prev.filter((c) => c !== chipText);
      if (nextIdx < ALL_CHIP_POOL.length) {
        updated.push(ALL_CHIP_POOL[nextIdx]);
      }
      return updated;
    });

    setInput(chipText);
    setTimeout(() => {
      const form = document.getElementById("apex-ai-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 40);
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
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
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
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ color: "rgba(255,255,255,0.38)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
              style={{ background: "rgba(0,0,0,0.18)" }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={`${msg.role}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.215, 0.61, 0.355, 1] }}
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "apex-ai-bubble-user ml-auto"
                        : "apex-ai-bubble-assistant"
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
                  className="apex-ai-bubble-assistant max-w-[80%] rounded-2xl px-3.5 py-3 flex items-center gap-1.5"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full animate-bounce"
                      style={{
                        background: "rgba(255,255,255,0.32)",
                        animationDelay: `${delay}ms`,
                        animationDuration: "0.9s"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            <div
              className="px-4 pt-2 pb-1.5"
              style={{ background: "var(--apl-navy)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              <AnimatePresence mode="popLayout">
                <div className="flex flex-wrap gap-1.5">
                  {visibleChips.map((chip) => (
                    <motion.button
                      key={chip}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="text-[11px] font-medium rounded-full px-2.5 py-1 transition-colors duration-200"
                      style={{
                        color: "rgba(255,255,255,0.48)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.48)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            <form
              id="apex-ai-form"
              onSubmit={sendMessage}
              className="p-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "var(--apl-navy)"
              }}
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
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(212,175,55,0.45)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.09)")
                  }
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="min-h-[40px] px-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-35"
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
