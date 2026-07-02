import { useApp } from "../context";
import { contrastText } from "../lib/color";
import { stops, tailwindReference } from "../lib/reference";

const tailwindOrder = [
  "Slate", "Gray", "Zinc", "Neutral", "Stone",
  "Red", "Orange", "Amber", "Yellow", "Lime",
  "Green", "Emerald", "Teal", "Cyan", "Sky",
  "Blue", "Indigo", "Violet", "Purple", "Fuchsia",
  "Pink", "Rose",
];

export function TailwindColorsPage() {
  const { copy } = useApp();

  return (
    <div className="page">
      <div className="page-intro">
        <h1>Tailwind CSS Colors</h1>
        <p>
          The default Tailwind color palette — these are the reference families the generator matches your
          seed against. Click any shade to copy its hex code.
        </p>
      </div>
      <div className="tw-list">
        {tailwindOrder.map((name) => [name, tailwindReference[name]] as const).map(([name, shades]) => (
          <section key={name} className="tw-family">
            <h2>{name}</h2>
            <div className="swatch-strip">
              {shades.map((hex, index) => (
                <button
                  key={hex + index}
                  className="swatch"
                  style={{ background: hex, color: contrastText(hex) }}
                  onClick={() => copy(hex, `${hex.toUpperCase()} copied`)}
                  title={`Copy ${hex}`}
                >
                  <span className="swatch-stop">{stops[index]}</span>
                  <span className="swatch-hex">{hex.replace("#", "").toUpperCase()}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
