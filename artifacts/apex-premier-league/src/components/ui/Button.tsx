"use client";

import { Link } from 'wouter';
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost"
};

type ButtonProps = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
  type = "button",
  disabled
}: ButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  if (href) {
    return (
      <motion.div {...MOTION.buttonPress} className="inline-flex">
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...MOTION.buttonPress}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </motion.button>
  );
}
