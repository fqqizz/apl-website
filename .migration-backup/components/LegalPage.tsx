import PageHeader from "@/components/layout/PageHeader";

type LegalSection = { title: string; body: string };

export default function LegalPage({
  label,
  title,
  intro,
  sections
}: {
  label: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="pb-20">
      <PageHeader label={label} title={title} description={intro} />
      <article className="legal-content container-apl max-w-3xl">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
