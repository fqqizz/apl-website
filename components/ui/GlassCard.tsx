"use client";

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  variant = "default"
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "accent";
}) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover ? MOTION.cardHover : {};
  const baseClass = variant === "accent" ? "glass-card-accent" : "glass-card";

  return (
    <Comp className={`${baseClass} p-6 md:p-8 ${className}`} {...motionProps}>
      {children}
    </Comp>
  );
}
