"use client";

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function GlassCard({
  children,
  className = "",
  hover = true
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover ? MOTION.cardHover : {};

  return (
    <Comp className={`glass-card p-6 md:p-8 ${className}`} {...motionProps}>
      {children}
    </Comp>
  );
}
