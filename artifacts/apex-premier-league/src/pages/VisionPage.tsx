
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Target, TrendingUp, Globe, Zap } from "lucide-react";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const roadmap = [
  {
    phase: "Season One",
    title: "The Foundation",
    detail: "Launch structured league play, founding player registry, official franchises, and the first-ever draft system in North Kashmir football.",
    image: "/images/vision-card-1.jpg",
    icon: Zap,
    color: "border-apl-gold/40",
    glow: "bg-apl-gold/8",
    accentText: "text-apl-gold",
    current: true,
  },
  {
    phase: "Media Era",
    title: "Building Culture",
    detail: "Match coverage, player stories, and digital culture around Kashmiri football. Broadcast partnerships, social media reach, and grassroots storytelling.",
    image: "/images/vision-card-2.jpg",
    icon: TrendingUp,
    color: "border-apl-blue/30",
    glow: "bg-apl-blue/6",
    accentText: "text-apl-blue-bright",
    current: false,
  },
  {
    phase: "Expansion",
    title: "Global Ambition",
    detail: "Deeper talent pathways, youth integration, women's league, regional infrastructure partnerships, and talent export to national and international circuits.",
    image: "/images/vision-card-3.jpg",
    icon: Globe,
    color: "border-emerald-500/20",
    glow: "bg-emerald-500/5",
    accentText: "text-emerald-400",
    current: false,
  }
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function VisionPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <>
      <BreadcrumbJsonLd pageName="Vision" path="/vision" />
      <div className="pb-24 pt-[72px]">
        {/* Cinematic hero */}
        <div ref={heroRef} className="relative overflow-hidden rounded-b-2xl" style={{ height: "clamp(360px, 55vh, 560px)" }}>
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="/images/vision-hero.jpg"
              alt="Football vision for Kashmir"
              className="w-full h-[120%] object-cover"
              style={{ objectPosition: "center 35%" }}
              fetchPriority="high"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111D]/25 via-[#07111D]/55 to-[#07111D]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111D]/30 to-transparent" />
          
          <div className="absolute inset-0 flex items-end">
            <div className="container-apl pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="flex items-center gap-2"
              >
                <Target size={14} className="text-apl-gold" />
                <span className="text-label text-apl-gold">VISION & ROADMAP</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="mt-4 text-display-lg text-apl-white max-w-3xl"
              >
                WHAT KASHMIR FOOTBALL BECOMES
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease }}
                className="mt-4 max-w-lg text-body-lg text-apl-text-secondary"
              >
                APL is not a tournament. It is infrastructure, identity, and a long-term competitive ecosystem.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Manifesto breakout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="container-apl mt-20 md:mt-28"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="accent-line mx-auto" />
            <p className="mt-6 text-display-md text-apl-white" style={{ lineHeight: 1.1 }}>
              Professional standards. Local soul. Global ambition.
            </p>
            <p className="mt-5 text-body-lg text-apl-text-secondary max-w-xl mx-auto">
              Every phase of APL is designed to build permanent infrastructure for Kashmir's football talent — not temporary events, but lasting systems.
            </p>
          </div>
        </motion.div>

        {/* Roadmap cards */}
        <div className="container-apl mt-20 md:mt-28">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-label text-apl-text-muted"
          >
            THE ROADMAP
          </motion.h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {roadmap.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.12, duration: 0.6, ease }}
                  className={`group relative overflow-hidden rounded-2xl border ${item.color} bg-apl-glass transition-all duration-500 hover:border-opacity-60`}
                  style={{
                    boxShadow: item.current
                      ? "0 8px 32px rgba(212, 175, 55, 0.08), 0 2px 8px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Card image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111D] via-[#07111D]/50 to-transparent" />
                    
                    {/* Phase badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border ${item.color} ${item.glow} px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${item.accentText} backdrop-blur-sm`}>
                        <Icon size={11} />
                        {item.phase}
                      </span>
                    </div>

                    {/* Current indicator */}
                    {item.current && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-apl-gold/20 border border-apl-gold/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-apl-gold">
                          <span className="w-1.5 h-1.5 rounded-full bg-apl-gold animate-pulse" />
                          Current
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="p-6 pt-5">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-apl-text-secondary">{item.detail}</p>
                  </div>

                  {/* Bottom glow */}
                  <div className={`absolute bottom-0 left-0 right-0 h-20 ${item.glow} blur-2xl pointer-events-none`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container-apl mt-24 md:mt-32"
        >
          <div className="grid gap-px md:grid-cols-3 rounded-2xl overflow-hidden border border-apl-border">
            {[
              { title: "Structure", desc: "Real leagues need real systems — registrations, IDs, fixtures, and accountability." },
              { title: "Visibility", desc: "Every player deserves to be seen. APL builds the stage, the media, and the audience." },
              { title: "Legacy", desc: "Season One is not the end goal. It is the first chapter of something permanent." },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease }}
                className="p-8 bg-apl-glass text-center"
              >
                <p className="text-sm font-semibold tracking-wider text-apl-gold uppercase">{value.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-apl-text-secondary">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
