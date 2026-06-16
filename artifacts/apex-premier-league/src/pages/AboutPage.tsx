
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

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="About" path="/about" />
      <div className="pb-20">
        <PageHeader
          label="ABOUT APL"
          title="THE HOME OF KASHMIRI FOOTBALL"
          description="Apex Premier League is a sports-tech movement at founding stage — built for players, franchises, and the culture of football in the valley."
        />
        <div className="container-apl grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-body-lg text-apl-text-secondary">
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
              <p className="mt-2 text-xs leading-relaxed text-apl-text-muted italic">
                "Apex Premier League was founded in Baramulla with a vision to create a structured football ecosystem that provides opportunity, visibility, and professional competition for footballers across Kashmir."
              </p>
            </div>
          </div>
          <div className="relative w-full overflow-hidden rounded-xl border border-apl">
            <img 
              src="/images/hero-community.png" 
              alt="Young footballers in Kashmir" 
              className="w-full h-full object-cover" 
              style={{ display: "block", aspectRatio: "4/3" }}
              sizes="(max-width: 1024px) 100vw, 50vw" 
            />
          </div>
        </div>
        <div className="container-apl mt-16">
          <h2 className="text-display-md text-apl-white">Founding timeline</h2>
          <ul className="mt-8 space-y-6 border-l border-apl pl-6">
            {timeline.map((item) => (
              <li key={item.year}>
                <p className="text-label text-apl-gold">{item.year}</p>
                <p className="mt-2 text-body-md text-apl-white">{item.title}</p>
                <p className="mt-1 text-body-md text-apl-text-secondary">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
