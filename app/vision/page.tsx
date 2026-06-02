import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.vision);

const roadmap = [
  { phase: "Season One", detail: "Launch structured league play, founding player registry, and official franchises." },
  { phase: "Media Era", detail: "Match coverage, player stories, and digital culture around Kashmiri football." },
  { phase: "Expansion", detail: "Deeper talent pathways, youth integration, and regional football infrastructure." }
];

export default function VisionPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Vision" path="/vision" />
      <div className="pb-20">
        <PageHeader
          label="VISION"
          title="WHAT KASHMIR FOOTBALL BECOMES"
          description="APL is not a tournament. It is infrastructure, identity, and a long-term competitive ecosystem."
          gold
        />
        <div className="container-apl space-y-16">
          <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-apl md:min-h-[420px]">
            <Image src="/images/editorial-kick.png" alt="Football action" fill className="object-cover" sizes="100vw" />
            <div className="hero-gradient absolute inset-0" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="max-w-2xl text-display-md text-apl-white">Professional standards. Local soul. Global ambition.</p>
            </div>
          </div>
          {roadmap.map((item) => (
            <div key={item.phase} className="border-t border-apl pt-8">
              <p className="text-label text-apl-blue">{item.phase}</p>
              <p className="mt-3 max-w-3xl text-body-xl text-apl-text-secondary">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
