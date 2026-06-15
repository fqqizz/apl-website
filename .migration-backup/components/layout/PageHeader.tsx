import SectionLabel from "@/components/ui/SectionLabel";

export default function PageHeader({
  label,
  title,
  description,
  gold = false
}: {
  label: string;
  title: string;
  description?: string;
  gold?: boolean;
}) {
  return (
    <header className="container-apl pt-28 pb-10 md:pt-32">
      <SectionLabel gold={gold}>{label}</SectionLabel>
      <h1 className="text-display-lg mt-6 max-w-4xl text-apl-white">{title}</h1>
      {description && <p className="mt-5 max-w-2xl text-body-lg text-apl-text-secondary">{description}</p>}
    </header>
  );
}
