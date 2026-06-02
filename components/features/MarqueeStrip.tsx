const ITEMS = [
  "BARAMULLA",
  "KASHMIR",
  "FIRST DIVISION",
  "2025",
  "OFFICIAL FRANCHISES",
  "FOUNDING PLAYERS",
  "APEX PREMIER LEAGUE"
];

export default function MarqueeStrip() {
  const track = [...ITEMS, ...ITEMS, "·"];

  return (
    <div className="overflow-hidden border-t border-apl py-4 opacity-60">
      <div className="marquee-track text-label text-apl-text-secondary">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="whitespace-nowrap">
            {item} ·
          </span>
        ))}
      </div>
    </div>
  );
}
