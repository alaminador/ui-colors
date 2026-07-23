import { Slider } from "./Slider";

export type FontCase = "none" | "uppercase" | "capitalize";

export interface FontSettings {
  family: string;
  weight: number;
  size: number;
  tracking: number; // letter-spacing in em ×100 (e.g. -2 => -0.02em)
  textCase: FontCase;
  color: string;
}

// Web-safe / system font stacks so the preview renders without loading anything.
export const fontFamilies: { label: string; stack: string }[] = [
  { label: "Inter", stack: "'Inter', system-ui, sans-serif" },
  { label: "System", stack: "system-ui, -apple-system, sans-serif" },
  { label: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { label: "Playfair", stack: "'Playfair Display', Georgia, serif" },
  { label: "Mono", stack: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace" },
];

const weights = [300, 400, 500, 600, 700, 800];
const cases: { key: FontCase; label: string }[] = [
  { key: "none", label: "As typed" },
  { key: "capitalize", label: "Title" },
  { key: "uppercase", label: "Upper" },
];

interface FontPickerProps {
  value: FontSettings;
  /** Palette swatches offered for the text color. */
  swatches: string[];
  onChange: (next: FontSettings) => void;
}

export function FontPicker({ value, swatches, onChange }: FontPickerProps) {
  const set = (patch: Partial<FontSettings>) => onChange({ ...value, ...patch });

  return (
    <div className="fp">
      <label className="fp-field">
        <span>Font</span>
        <select value={value.family} onChange={(event) => set({ family: event.target.value })}>
          {fontFamilies.map((font) => (
            <option key={font.label} value={font.stack}>
              {font.label}
            </option>
          ))}
        </select>
      </label>

      <label className="fp-field">
        <span>Weight</span>
        <select value={value.weight} onChange={(event) => set({ weight: Number(event.target.value) })}>
          {weights.map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </label>

      <Slider label="Size" value={value.size} min={24} max={96} step={1} format={(v) => `${v}px`} onChange={(size) => set({ size })} />
      <Slider
        label="Letter spacing"
        value={value.tracking}
        min={-5}
        max={12}
        step={0.5}
        format={(v) => `${(v / 100).toFixed(3)}em`}
        onChange={(tracking) => set({ tracking })}
      />

      <div className="fp-field">
        <span>Case</span>
        <div className="fp-seg">
          {cases.map((item) => (
            <button
              key={item.key}
              className={value.textCase === item.key ? "is-active" : ""}
              onClick={() => set({ textCase: item.key })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fp-field">
        <span>Color</span>
        <div className="fp-swatches">
          {swatches.map((color, index) => (
            <button
              key={`${color}-${index}`}
              className={`fp-swatch ${value.color.toLowerCase() === color.toLowerCase() ? "is-active" : ""}`}
              style={{ background: color }}
              onClick={() => set({ color })}
              aria-label={`Text color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
