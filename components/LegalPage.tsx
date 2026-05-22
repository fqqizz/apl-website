import Link from "next/link";

type LegalSection = {
  title: string;
  body: string;
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="grain" />
      <header className="fixed left-0 right-0 top-4 z-20 px-4">
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-full border border-ink/10 bg-white/78 px-4 py-2.5 shadow-glass backdrop-blur-xl">
          <Link href="/" aria-label="APEX PREMIERE LEAGUE home" className="flex items-center gap-2 rounded-full px-1">
            <img src="/apl-logo.png" alt="APL logo" className="h-8 w-auto" />
          </Link>
          <Link href="/" className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
            Home
          </Link>
        </nav>
      </header>

      <article className="legal relative z-10 mx-auto w-full max-w-4xl px-5 pb-24 pt-36 md:px-8 md:pt-44">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-6 text-[clamp(4rem,15vw,9.5rem)]">{title}</h1>
        <p className="mt-8 max-w-2xl text-xl leading-8 text-ink/70">{intro}</p>

        <div className="mt-16 border-t border-ink/10">
          {sections.map((section) => (
            <section key={section.title} className="border-b border-ink/10 py-10">
              <h2>{section.title}</h2>
              <p className="mt-5">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
