const ITEMS = [
  "BARAMULLA",
  "KASHMIR",
  "FIRST DIVISION",
  "2026",
  "OFFICIAL FRANCHISES",
  "FOUNDING PLAYERS",
  "APEX PREMIER LEAGUE"
];

export default function MarqueeStrip() {
  // Triple the list to ensure there is plenty of content to the track without wrapping gaps
  const track = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-t border-apl py-4 opacity-60">
      <div className="marquee-track text-label text-apl-text-secondary flex gap-8">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="whitespace-nowrap flex-shrink-0">
            {item} ·
          </span>
        ))}
      </div>
    </div>
  );
}
