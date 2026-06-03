"use client";

import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { Handshake, Target, Users, Flame, Share2, Award, ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function PartnersPage() {
  const sections = [
    {
      title: "Audience Reach",
      desc: "Connect with thousands of passionate football fans, players, and local communities across Kashmir, building deep and resonant brand affinity.",
      icon: Users
    },
    {
      title: "Brand Visibility",
      desc: "Gain premium visibility with high-impact logo placements, digital integrations, media coverage, and live stream features during all matchdays.",
      icon: Target
    },
    {
      title: "Community Impact",
      desc: "Empower grassroots football and support the Baramulla sports ecosystem, providing valuable resources and platforms for local youth athletes.",
      icon: Award
    },
    {
      title: "Digital Exposure",
      desc: "Leverage high social media engagement and official APL website features, positioning your brand at the center of the regional sports dialogue.",
      icon: Share2
    },
    {
      title: "League Presence",
      desc: "Command physical brand presence through on-field banners, jersey placements, venue branding, and exclusive VIP experience activations.",
      icon: Flame
    }
  ];

  return (
    <div className="pb-24 bg-[#0a1628] text-white min-h-screen">
      <PageHeader
        label="PARTNERSHIPS"
        title="PARTNER WITH APL"
        description="Align your brand with the premier sports movement in the region. Drive community impact and premium brand visibility."
      />

      <div className="container-apl mt-12 max-w-5xl px-4">
        {/* Why Partner Section */}
        <section className="glass-card p-8 md:p-12 border border-apl-border bg-gradient-to-br from-apl-navy-mid to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-apl-blue/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Why Partner With APL?</h2>
            <p className="mt-4 text-sm leading-relaxed text-apl-text-secondary">
              Apex Premier League (APL) is more than just a football tournament; it's Kashmir's premier sports ecosystem. Built from Baramulla, APL unites a 16-franchise league with 288 players in a professionally structured season, commanding unparalleled engagement both on the pitch and across digital platforms.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold tracking-wider text-apl-gold uppercase mb-6">Partnership Verticals</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="glass-card p-6 border border-apl-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-apl-blue/15 border border-apl-blue-bright/20 flex items-center justify-center text-apl-blue-bright mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{sec.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-apl-text-secondary">{sec.desc}</p>
                </motion.div>
              );
            })}

            {/* Sponsorship Deck Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-card p-6 border border-apl-gold-dim bg-gradient-to-br from-apl-gold-dim/10 to-transparent flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-apl-gold-dim border border-apl-gold/20 flex items-center justify-center text-apl-gold mb-4">
                  <Download size={20} />
                </div>
                <h3 className="text-base font-semibold text-apl-gold">Sponsorship Deck</h3>
                <p className="mt-2 text-xs leading-relaxed text-apl-text-secondary">
                  Download our official sponsorship deck detailing comprehensive tier packages, audience metrics, and brand deliverables.
                </p>
                <p className="mt-3 text-[10px] text-apl-text-muted italic">Note: The pitch deck file will be uploaded shortly.</p>
              </div>
              <div className="mt-5">
                <button disabled className="btn-secondary !border-apl-gold-dim !text-apl-gold !opacity-60 cursor-not-allowed text-xs py-2 w-full justify-center">
                  Deck Pending Upload
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="mt-16 text-center border-t border-apl-border pt-12 max-w-xl mx-auto">
          <Handshake className="mx-auto text-apl-blue-bright mb-4" size={36} />
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Start a Conversation</h2>
          <p className="mt-3 text-sm text-apl-text-secondary">
            Interested in exploring customized brand integrations or securing key title placements? Reach out to our sponsorship team.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="btn-primary text-xs px-6 py-2.5">
              Contact Sponsorship Team <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
