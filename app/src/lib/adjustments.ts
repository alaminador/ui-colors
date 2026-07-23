// Brand-scale fine-tuning — a post-process transform applied to the generated
// primary/secondary/tertiary scales. This layer never touches the generation
// engine (uicolors.ts / findFamilyAndAnchor), so tuning stays fully reversible
// and can't destabilise family matching. Neutral and semantic roles are left
// untouched: neutral has its own tint control and shifting a semantic hue would
// break its meaning (a "success" that isn't green).
import { Oklch, clamp, fitToSrgb, hexToRgb, normalizeHue, rgbToHex, rgbToOklch } from "./color";
import type { Palettes, RoleKey } from "./palette";

export interface Adjustments {
  hueShift: number; // degrees, -30..30
  chroma: number; // multiplier, 0.4..1.6
  lightMin: number; // 0..0.35 — lightness floor (darkest stops)
  lightMax: number; // 0.65..1 — lightness ceiling (lightest stops)
  curveX: number; // tone-curve control-point X, 0..1
  curveY: number; // tone-curve control-point Y, 0..1
}

export const defaultAdjustments: Adjustments = {
  hueShift: 0,
  chroma: 1,
  lightMin: 0,
  lightMax: 1,
  curveX: 0.5,
  curveY: 0.5,
};

// Brand roles are the only scales the fine-tune layer reshapes.
export const brandRoles: RoleKey[] = ["primary", "secondary", "tertiary"];

export function adjustmentsActive(a: Adjustments): boolean {
  return (
    a.hueShift !== 0 ||
    a.chroma !== 1 ||
    a.lightMin !== 0 ||
    a.lightMax !== 1 ||
    a.curveX !== 0.5 ||
    a.curveY !== 0.5
  );
}

// Quadratic Bézier tone curve through (0,0), (curveX,curveY), (1,1). At the
// default control point (0.5, 0.5) this is exactly the identity diagonal, so a
// neutral curve is a true no-op. Input is a normalised tone value (0 = darkest,
// 1 = lightest); output is the remapped tone.
export function toneCurve(t: number, cx: number, cy: number): number {
  const input = clamp(t, 0, 1);
  // Solve Bx(s) = input for s, where Bx(s) = s²(1-2cx) + 2cx·s.
  const a = 1 - 2 * cx;
  const b = 2 * cx;
  let s: number;
  if (Math.abs(a) < 1e-6) {
    s = input / (b || 1);
  } else {
    const disc = Math.max(0, b * b + 4 * a * input);
    s = (-b + Math.sqrt(disc)) / (2 * a);
    if (s < 0 || s > 1) s = (-b - Math.sqrt(disc)) / (2 * a);
  }
  s = clamp(s, 0, 1);
  return clamp(s * s * (1 - 2 * cy) + 2 * cy * s, 0, 1);
}

function transformHex(hex: string, a: Adjustments): string {
  const { L, C, h } = rgbToOklch(hexToRgb(hex));
  const curved = toneCurve(L, a.curveX, a.curveY);
  const next: Oklch = {
    L: clamp(a.lightMin + curved * (a.lightMax - a.lightMin), 0.02, 0.995),
    C: clamp(C * a.chroma, 0, 0.4),
    h: normalizeHue(h + a.hueShift),
  };
  return rgbToHex(fitToSrgb(next));
}

// Returns a new Palettes with the brand scales reshaped by the adjustments.
// A no-op adjustment set returns the input untouched (referentially) to keep
// downstream memoisation cheap.
export function applyAdjustments(palettes: Palettes, a: Adjustments): Palettes {
  if (!adjustmentsActive(a)) return palettes;
  const next: Palettes = { ...palettes };
  brandRoles.forEach((role) => {
    const palette = palettes[role];
    if (!palette) return;
    next[role] = {
      ...palette,
      colors: palette.colors.map((color) => ({ stop: color.stop, hex: transformHex(color.hex, a) })),
    };
  });
  return next;
}
