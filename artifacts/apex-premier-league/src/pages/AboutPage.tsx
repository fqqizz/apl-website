
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const timeline = [
  {
    year: "2025",
    title: "Concept & Planning",
    detail: "League structure, systems, branding, and digital infrastructure developed."
  },
  {
    year: "2026",
    title: "Applications Open",
    detail: "Player registrations and franchise ownership applications launched publicly."
  },
  {
    year: "Season One",
    title: "The Beginning",
    detail: "The beginning of Kashmir's first franchise-based football movement."
  },
  {
    year: "Future",
    title: "What's Next",
    detail: "Expansion, partnerships, media growth, and a stronger football ecosystem."
  }
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <>
      <BreadcrumbJsonLd pageName="About" path="/about" />
      <div className="pb-20">
        {/* Cinematic hero banner */}
        <div ref={heroRef} className="relative overflow-hidden" style={{ height: "clamp(320px, 50vh, 520px)" }}>
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="/images/about-football-2.jpg"
              alt="Football culture in Kashmir"
              className="w-full h-[120%] object-cover"
              style={{ objectPosition: "center 40%" }}
              fetchPriority="high"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111D]/30 via-[#07111D]/60 to-[#07111D]" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-apl pb-10 md:pb-14">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="text-label text-apl-gold"
              >
                ABOUT APL
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="mt-3 text-display-lg text-apl-white max-w-2xl"
              >
                THE HOME OF KASHMIRI FOOTBALL
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Story section — magazine split */}
        <div className="container-apl mt-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="space-y-6 text-body-lg text-apl-text-secondary"
            >
              <p>
                APL exists because Kashmir never lacked talent — only structure. We are building the league the valley
                deserved: official franchises, registered players, competitive fixtures, and a platform that treats football
                as culture, not a side event.
              </p>
              <p>
                From Baramulla to every district that believes in the game, Season One is the founding era. The players and
                owners who join now are not filling a form — they are making history.
              </p>
              
              {/* Founder Story Block */}
              <div className="pt-6 border-t border-apl-border">
                <h3 className="text-sm font-semibold tracking-wider text-apl-gold uppercase">Founded in Baramulla</h3>
                <p className="mt-3 text-sm leading-relaxed text-apl-text-muted italic">
                  "Apex Premier League was founded in Baramulla with a vision to create a structured football ecosystem that provides opportunity, visibility, and professional competition for footballers across Kashmir."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="relative"
            >
              <div className="relative w-full overflow-hidden rounded-2xl border border-apl-border-accent shadow-2xl shadow-black/30">
                <img
                  src="/images/about-football-1.jpg"
                  alt="Young footballers in Kashmir"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/5", display: "block" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111D]/40 to-transparent" />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-apl-gold/10 blur-2xl pointer-events-none" />
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-apl-blue/8 blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </div>

        {/* Full-width breakout quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="mt-20 py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-apl-navy-light via-apl-navy-mid to-apl-navy-light" />
          <div className="absolute inset-0 opacity-5">
            <img src="/images/about-football-2.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container-apl relative z-10 text-center max-w-3xl mx-auto">
            <div className="accent-line mx-auto" />
            <p className="mt-6 text-display-md text-apl-white leading-tight">
              "The valley's talent deserves a stage. We're building it."
            </p>
            <p className="mt-4 text-label text-apl-gold">APL FOUNDING VISION</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="container-apl mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display-md text-apl-white"
          >
            Founding Timeline
          </motion.h2>
          <div className="mt-10 relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-apl-gold/40 via-apl-border to-transparent" />
            
            <ul className="space-y-10 pl-10">
              {timeline.map((item, idx) => (
                <motion.li
                  key={item.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-1.5 w-[22px] h-[22px] rounded-full border-2 border-apl-gold/50 bg-apl-navy flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-apl-gold" />
                  </div>
                  <p className="text-label text-apl-gold">{item.year}</p>
                  <p className="mt-2 text-body-lg text-apl-white font-medium">{item.title}</p>
                  <p className="mt-1 text-body-md text-apl-text-secondary max-w-lg">{item.detail}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
