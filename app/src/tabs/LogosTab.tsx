import { ArcMark, BerryMark, ForwardMark, GridMark, HexMark } from "../components/marks";
import { useAccentPlan, useHex } from "../context";
import { contrastText } from "../lib/color";

function Mark({ kind, color }: { kind: string; color: string }) {
  if (kind === "chevrons") return <ForwardMark color={color} size={34} />;
  if (kind === "flower") return <BerryMark color={color} size={34} />;
  if (kind === "arc") return <ArcMark color={color} />;
  if (kind === "hex") return <HexMark color={color} />;
  return <GridMark color={color} />;
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
