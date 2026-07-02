import { useAccentPlan, useHex } from "../context";
import { contrastText } from "../lib/color";

function Mark({ kind, color }: { kind: string; color: string }) {
  if (kind === "chevrons") {
    return (
      <svg viewBox="0 0 24 24" width="34" height="34">
        <path d="M3 4 L11 12 L3 20 Z" fill={color} />
        <path d="M12 4 L20 12 L12 20 Z" fill={color} />
      </svg>
    );
  }
  if (kind === "flower") {
    return (
      <svg viewBox="0 0 24 24" width="34" height="34">
        {[[12, 4], [19, 8], [19, 16], [12, 20], [5, 16], [5, 8], [12, 12]].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r="3.2" fill={color} />
        ))}
      </svg>
    );
  }
  if (kind === "arc") {
    return (
      <svg viewBox="0 0 24 24" width="34" height="34">
        <path d="M4 20 A8 8 0 0 1 20 20" fill="none" stroke={color} strokeWidth="4.4" strokeLinecap="round" />
        <circle cx="12" cy="7" r="3.2" fill={color} />
      </svg>
    );
  }
  if (kind === "hex") {
    return (
      <svg viewBox="0 0 24 24" width="34" height="34">
        <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" fill={color} />
        <circle cx="12" cy="12" r="3.4" fill="rgba(255,255,255,0.85)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="34" height="34">
      <rect x="3" y="3" width="8.5" height="8.5" rx="2.4" fill={color} />
      <rect x="12.5" y="3" width="8.5" height="8.5" rx="2.4" fill={color} opacity="0.62" />
      <rect x="3" y="12.5" width="8.5" height="8.5" rx="2.4" fill={color} opacity="0.62" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="2.4" fill={color} />
    </svg>
  );
}

export function LogosTab() {
  const hex = useHex();
  const plan = useAccentPlan();
  const [, chartB, chartC] = plan.chartRoles;

  const tiles = [
    { kind: "chevrons", name: "Forward", bg: "#ffffff", color: hex("primary", 600), text: hex("neutral", 900) },
    { kind: "chevrons", name: "Forward", bg: hex("primary", 600), color: "#ffffff", text: "#ffffff" },
    { kind: "flower", name: "BERRY", bg: hex("neutral", 950), color: hex("primary", 400), text: "#ffffff" },
    { kind: "flower", name: "BERRY", bg: hex("primary", 100), color: hex("primary", 700), text: hex("primary", 950) },
    { kind: "arc", name: "Rise", bg: "#ffffff", color: hex(chartB, 500), text: hex("neutral", 900) },
    { kind: "arc", name: "Rise", bg: hex(chartB, 800), color: hex(chartB, 200), text: "#ffffff" },
    { kind: "hex", name: "Clarify", bg: hex(chartC, 100), color: hex(chartC, 600), text: hex(chartC, 950) },
    { kind: "grid", name: "Linky", bg: hex("neutral", 950), color: hex(chartC, 400), text: "#ffffff" },
  ];

  return (
    <div className="tab-stack">
      <div className="grid grid-4">
        {tiles.map((tile, index) => (
          <article key={index} className="logo-tile" style={{ background: tile.bg, color: tile.text }}>
            <Mark kind={tile.kind} color={tile.color} />
            <strong>{tile.name}</strong>
          </article>
        ))}
      </div>
      <div className="grid grid-2">
        <article
          className="logo-banner"
          style={{ background: `linear-gradient(130deg, ${hex("primary", 500)}, ${hex("primary", 800)})`, color: "#fff" }}
        >
          <Mark kind="chevrons" color="#ffffff" />
          <div>
            <strong>Forward</strong>
            <em>Wordmark on brand gradient · primary 500 → 800</em>
          </div>
        </article>
        <article className="logo-banner" style={{ background: hex("neutral", 100), color: hex("neutral", 900) }}>
          <Mark kind="flower" color={hex("primary", 600)} />
          <div>
            <strong style={{ color: contrastText(hex("neutral", 100)) }}>BERRY</strong>
            <em>Mark on neutral surface · neutral 100</em>
          </div>
        </article>
      </div>
    </div>
  );
}
