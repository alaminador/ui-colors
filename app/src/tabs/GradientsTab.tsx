import { useState } from "react";
import { useAccentPlan, useApp, useHex } from "../context";
import { GradientEditor, GradientStop, GradientType } from "../components/controls/GradientEditor";

export function GradientsTab() {
  const hex = useHex();
  const { copy } = useApp();
  const plan = useAccentPlan();
  const [chartA, chartB, chartC] = plan.chartRoles;
  const roleLabel = { primary: "Primary", secondary: "Secondary", tertiary: "Tertiary" } as const;

  // Interactive builder state — seeded from the current scale so it always
  // opens on a valid, on-brand gradient.
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(140);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: "a", color: hex("primary", 300), pos: 0 },
    { id: "b", color: hex("primary", 700), pos: 100 },
  ]);

  // Palette swatches offered for recoloring stops — deduped so a harmony where
  // the accent role collapses onto primary doesn't show the same chip twice.
  const swatchStops = [200, 400, 600, 800];
  const swatches = Array.from(
    new Set([
      ...swatchStops.map((s) => hex("primary", s)),
      ...swatchStops.map((s) => hex(plan.accentRole, s)),
      hex("neutral", 200),
      hex("neutral", 700),
    ])
  );

  const gradients = [
    { name: "Soft rise", css: `linear-gradient(140deg, ${hex("primary", 100)}, ${hex("primary", 400)})`, text: hex("primary", 950) },
    { name: "Core", css: `linear-gradient(140deg, ${hex("primary", 400)}, ${hex("primary", 700)})`, text: "#fff" },
    { name: "Deep dive", css: `linear-gradient(160deg, ${hex("primary", 700)}, ${hex("primary", 950)})`, text: "#fff" },
    plan.spread === "tight"
      ? { name: "Tonal blend", css: `linear-gradient(120deg, ${hex(chartA, 300)}, ${hex(chartB, 600)})`, text: "#fff" }
      : {
          name: `${roleLabel[chartA as "primary" | "secondary" | "tertiary"]} → ${roleLabel[chartB as "primary" | "secondary" | "tertiary"]}`,
          css: `linear-gradient(120deg, ${hex(chartA, 400)}, ${hex(chartB, 500)})`,
          text: "#fff",
        },
    plan.spread === "tight"
      ? { name: "Deep tonal blend", css: `linear-gradient(120deg, ${hex(chartB, 500)}, ${hex(chartC, 800)})`, text: "#fff" }
      : {
          name: `${roleLabel[chartB as "primary" | "secondary" | "tertiary"]} → ${roleLabel[chartC as "primary" | "secondary" | "tertiary"]}`,
          css: `linear-gradient(120deg, ${hex(chartB, 400)}, ${hex(chartC, 400)})`,
          text: "#fff",
        },
    {
      name: plan.spread === "tight" ? "Tonal sweep" : "Tri-role sweep",
      css: `linear-gradient(120deg, ${hex(chartA, 300)}, ${hex(chartB, 500)}, ${hex(chartC, 800)})`,
      text: "#fff",
    },
    { name: "Radial glow", css: `radial-gradient(circle at 30% 25%, ${hex("primary", 300)}, ${hex("primary", 800)})`, text: "#fff" },
    {
      name: "Conic wheel",
      css: `conic-gradient(from 210deg, ${hex(chartA, 400)}, ${hex(chartB, 600)}, ${hex(chartC, 800)}, ${hex(chartA, 400)})`,
      text: "#fff",
    },
    { name: "Dawn mist", css: `linear-gradient(180deg, ${hex("primary", 50)}, ${hex(plan.accentRole, 200)})`, text: hex("primary", 950) },
    { name: "Success fade", css: `linear-gradient(140deg, ${hex("success", 300)}, ${hex("success", 700)})`, text: "#fff" },
    { name: "Heat warning", css: `linear-gradient(140deg, ${hex("warning", 300)}, ${hex("error", 600)})`, text: "#fff" },
    { name: "Night neutral", css: `linear-gradient(160deg, ${hex("neutral", 700)}, ${hex("neutral", 950)})`, text: "#fff" },
  ];

  return (
    <div className="tab-stack">
      <section className="ge-panel">
        <div className="ge-panel-head">
          <h3>Gradient builder</h3>
          <span>Drag stops, pick palette colors, copy the CSS.</span>
        </div>
        <GradientEditor
          stops={stops}
          type={type}
          angle={angle}
          swatches={swatches}
          onChange={(next) => {
            setStops(next.stops);
            setType(next.type);
            setAngle(next.angle);
          }}
          onCopy={(text) => copy(text, "Gradient CSS copied")}
        />
      </section>

      <p className="tab-note">Presets — click any tile to copy its CSS.</p>
      <div className="grid grid-3">
        {gradients.map((gradient) => (
          <button
            key={gradient.name}
            className="gradient-tile"
            style={{ background: gradient.css, color: gradient.text }}
            onClick={() => copy(`background: ${gradient.css};`, "Gradient CSS copied")}
          >
            <strong>{gradient.name}</strong>
            <em style={{ color: gradient.text, opacity: 0.75 }}>copy css</em>
          </button>
        ))}
      </div>
    </div>
  );
}
