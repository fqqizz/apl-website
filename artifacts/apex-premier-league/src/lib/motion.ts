export const MOTION = {
  sectionEnter: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  },
  staggerContainer: {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.08 } },
    viewport: { once: true }
  },
  staggerChild: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  },
  heroReveal: {
    initial: { opacity: 0, y: 60, skewY: 2 },
    animate: { opacity: 1, y: 0, skewY: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }
  },
  cardHover: {
    whileHover: { y: -4, transition: { duration: 0.25, ease: "easeOut" as const } }
  },
  buttonPress: {
    whileTap: { scale: 0.97 },
    transition: { duration: 0.1 }
  }
};

export const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
};
