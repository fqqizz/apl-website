"use client";

import { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBar() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/announcement")
      .then((r) => r.json())
      .then((data) => {
        if (data.announcement && data.announcement.is_active) {
          setText(data.announcement.text);
          setVisible(true);
        }
      })
      .catch(() => undefined);
  }, []);

  if (!visible || !text) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 w-full bg-gradient-to-r from-apl-blue via-apl-blue-bright to-apl-blue border-b border-apl-blue-bright/20 px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white flex items-center justify-center gap-2"
        >
          <Megaphone size={14} className="shrink-0 text-white/90 animate-pulse" />
          <span>{text}</span>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition"
            aria-label="Close Announcement"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
