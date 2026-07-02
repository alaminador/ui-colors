import { useApp, useHex } from "../context";
import { contrastText } from "../lib/color";

export function GradientsTab() {
  const hex = useHex();
  const { copy } = useApp();

  const gradients = [
    { name: "Soft rise", css: `linear-gradient(140deg, ${hex("primary", 100)}, ${hex("primary", 400)})`, text: hex("primary", 950) },
    { name: "Core", css: `linear-gradient(140deg, ${hex("primary", 400)}, ${hex("primary", 700)})`, text: "#fff" },
    { name: "Deep dive", css: `linear-gradient(160deg, ${hex("primary", 700)}, ${hex("primary", 950)})`, text: "#fff" },
    { name: "Primary → Secondary", css: `linear-gradient(120deg, ${hex("primary", 400)}, ${hex("secondary", 500)})`, text: "#fff" },
    { name: "Secondary → Tertiary", css: `linear-gradient(120deg, ${hex("secondary", 400)}, ${hex("tertiary", 400)})`, text: "#fff" },
    { name: "Tri-role sweep", css: `linear-gradient(120deg, ${hex("primary", 400)}, ${hex("secondary", 400)}, ${hex("tertiary", 400)})`, text: "#fff" },
    { name: "Radial glow", css: `radial-gradient(circle at 30% 25%, ${hex("primary", 300)}, ${hex("primary", 800)})`, text: "#fff" },
    { name: "Conic wheel", css: `conic-gradient(from 210deg, ${hex("primary", 500)}, ${hex("secondary", 500)}, ${hex("tertiary", 500)}, ${hex("primary", 500)})`, text: "#fff" },
    { name: "Dawn mist", css: `linear-gradient(180deg, ${hex("primary", 50)}, ${hex("secondary", 200)})`, text: hex("primary", 950) },
    { name: "Success fade", css: `linear-gradient(140deg, ${hex("success", 300)}, ${hex("success", 700)})`, text: "#fff" },
    { name: "Heat warning", css: `linear-gradient(140deg, ${hex("warning", 300)}, ${hex("error", 600)})`, text: "#fff" },
    { name: "Night neutral", css: `linear-gradient(160deg, ${hex("neutral", 700)}, ${hex("neutral", 950)})`, text: "#fff" },
  ];

  return (
    <div className="tab-stack">
      <p className="tab-note">Click any tile to copy its CSS.</p>
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

export function contrastFor(hexValue: string): string {
  return contrastText(hexValue);
}
