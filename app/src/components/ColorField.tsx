import { useEffect, useRef, useState } from "react";
import { Cancel01Icon, SquareUnlock02Icon } from "@hugeicons/core-free-icons";
import { clamp, fitToSrgb, hexToRgb, hslToRgb, normalizeHex, rgbToHex, rgbToHsl, rgbToOklch } from "../lib/color";
import { RoleKey } from "../lib/palette";
import { Icon } from "./Icon";
import { Slider } from "./controls/Slider";

export type ColorFormat = "HEX" | "HSL" | "OKLCH";
export const colorFormats: ColorFormat[] = ["HEX", "HSL", "OKLCH"];

interface ColorFieldProps {
  role: RoleKey;
  hex: string;
  active: boolean;
  format: ColorFormat;
  locked?: boolean;
  onSelect: () => void;
  onChange: (hex: string) => void;
  onRemove?: () => void;
}

function Segment({
  letter,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
}: {
  letter: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="cf-seg">
      <span className="cf-letter">{letter}</span>
      <input
        className="cf-num"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (!Number.isNaN(parsed)) onChange(clamp(parsed, min, max));
        }}
      />
      <span className="cf-unit">{unit}</span>
    </div>
  );
}

const hueRainbow = `linear-gradient(to right, ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]
  .map((h) => `hsl(${h}, 88%, 55%)`)
  .join(", ")})`;

const oklchRainbow = `linear-gradient(to right, ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]
  .map((h) => `oklch(70% 0.16 ${h})`)
  .join(", ")})`;

export function ColorField({ role, hex, active, format, locked, onSelect, onChange, onRemove }: ColorFieldProps) {
  const [draft, setDraft] = useState(hex);
  const [hsl, setHsl] = useState(() => rgbToHsl(hexToRgb(hex)));
  const [ok, setOk] = useState(() => rgbToOklch(hexToRgb(hex)));
  const lastEmitted = useRef(hex);

  useEffect(() => {
    if (hex !== lastEmitted.current) {
      lastEmitted.current = hex;
      setDraft(hex);
      setHsl(rgbToHsl(hexToRgb(hex)));
      setOk(rgbToOklch(hexToRgb(hex)));
    }
  }, [hex]);

  const emit = (nextHex: string) => {
    lastEmitted.current = nextHex;
    setDraft(nextHex);
    onChange(nextHex);
  };

  const setHslValue = (patch: Partial<{ h: number; s: number; l: number }>) => {
    const next = { ...hsl, ...patch };
    setHsl(next);
    const nextHex = rgbToHex(hslToRgb(next.h, next.s, next.l));
    setOk(rgbToOklch(hexToRgb(nextHex)));
    emit(nextHex);
  };

  const setOkValue = (patch: Partial<{ L: number; C: number; h: number }>) => {
    const next = { ...ok, ...patch };
    setOk(next);
    const nextHex = rgbToHex(fitToSrgb(next));
    setHsl(rgbToHsl(hexToRgb(nextHex)));
    emit(nextHex);
  };

  const h = Math.round(hsl.h);
  const s = Math.round(hsl.s * 100);
  const l = Math.round(hsl.l * 100);
  const okL = Math.round(ok.L * 100);
  const okC = Math.round(ok.C * 100) / 100;
  const okH = Math.round(ok.h);

  const removeButton = onRemove && (
    <button
      className="color-input-remove"
      title="Remove scale"
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
    >
      <Icon icon={Cancel01Icon} size={15} />
    </button>
  );

  return (
    <div className="cf-wrap" onClick={onSelect}>
      {format === "HEX" ? (
        <div className={`color-input ${active ? "is-active" : ""}`}>
          <label className="color-input-swatch" style={{ background: hex }}>
            <input
              type="color"
              value={normalizeHex(hex) ?? "#000000"}
              onChange={(event) => emit(event.target.value)}
              aria-label={`Choose ${role} color`}
            />
          </label>
          <input
            className="color-input-text"
            type="text"
            value={draft}
            spellCheck={false}
            onFocus={onSelect}
            onChange={(event) => {
              setDraft(event.target.value);
              const clean = normalizeHex(event.target.value);
              if (clean) {
                lastEmitted.current = clean;
                setHsl(rgbToHsl(hexToRgb(clean)));
                setOk(rgbToOklch(hexToRgb(clean)));
                onChange(clean);
              }
            }}
            aria-label={`${role} hex color`}
          />
          {locked && <span className="color-input-lock" title="Locked to seed"><Icon icon={SquareUnlock02Icon} size={15} /></span>}
          {removeButton}
        </div>
      ) : (
        <div className={`color-input color-field ${active ? "is-active" : ""}`}>
          <label className="color-input-swatch" style={{ background: hex }}>
            <input
              type="color"
              value={normalizeHex(hex) ?? "#000000"}
              onChange={(event) => emit(event.target.value)}
              aria-label={`Choose ${role} color`}
            />
          </label>
          {format === "HSL" ? (
            <>
              <Segment letter="H" value={h} unit="°" min={0} max={360} onChange={(value) => setHslValue({ h: value })} />
              <Segment letter="S" value={s} unit="%" min={0} max={100} onChange={(value) => setHslValue({ s: value / 100 })} />
              <Segment letter="L" value={l} unit="%" min={0} max={100} onChange={(value) => setHslValue({ l: value / 100 })} />
            </>
          ) : (
            <>
              <Segment letter="L" value={okL} unit="%" min={0} max={100} onChange={(value) => setOkValue({ L: value / 100 })} />
              <Segment letter="C" value={okC} unit="" min={0} max={0.4} step={0.01} onChange={(value) => setOkValue({ C: value })} />
              <Segment letter="H" value={okH} unit="°" min={0} max={360} onChange={(value) => setOkValue({ h: value })} />
            </>
          )}
          {locked && <span className="color-input-lock" title="Locked to seed"><Icon icon={SquareUnlock02Icon} size={15} /></span>}
          {removeButton}
        </div>
      )}

      {format === "HSL" && (
        <div className="cf-sliders">
          <Slider
            label="Hue"
            value={h}
            min={0}
            max={360}
            format={(v) => `${v}°`}
            trackFill={hueRainbow}
            onChange={(value) => setHslValue({ h: value })}
          />
          <Slider
            label="Saturation"
            value={s}
            min={0}
            max={100}
            format={(v) => `${v}%`}
            trackFill={`linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`}
            onChange={(value) => setHslValue({ s: value / 100 })}
          />
          <Slider
            label="Lightness"
            value={l}
            min={0}
            max={100}
            format={(v) => `${v}%`}
            trackFill={`linear-gradient(to right, #000000, hsl(${h}, ${s}%, 50%), #ffffff)`}
            onChange={(value) => setHslValue({ l: value / 100 })}
          />
        </div>
      )}

      {format === "OKLCH" && (
        <div className="cf-sliders">
          <Slider
            label="Lightness"
            value={okL}
            min={0}
            max={100}
            format={(v) => `${v}%`}
            trackFill={`linear-gradient(to right, oklch(5% ${okC} ${okH}), oklch(55% ${okC} ${okH}), oklch(98% ${okC} ${okH}))`}
            onChange={(value) => setOkValue({ L: value / 100 })}
          />
          <Slider
            label="Chroma"
            value={okC}
            min={0}
            max={0.4}
            step={0.005}
            format={(v) => v.toFixed(3)}
            trackFill={`linear-gradient(to right, oklch(${okL}% 0 ${okH}), oklch(${okL}% 0.37 ${okH}))`}
            onChange={(value) => setOkValue({ C: value })}
          />
          <Slider
            label="Hue"
            value={okH}
            min={0}
            max={360}
            format={(v) => `${v}°`}
            trackFill={oklchRainbow}
            onChange={(value) => setOkValue({ h: value })}
          />
        </div>
      )}
    </div>
  );
}
