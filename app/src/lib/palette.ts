import {
  Oklch,
  clamp,
  fitToSrgb,
  hexToRgb,
  hueDistance,
  isNeutral,
  normalizeHue,
  oklabDistance,
  rgbToHex,
  rgbToHsl,
  rgbToOklch,
  signedHueShift,
  formatHsl,
  formatOklch,
  formatRgb,
  apcaLc,
  wcagRatio,
} from "./color";
import { stops, tailwindReference } from "./reference";
import { generateUiColorsScale } from "./uicolors";

export type HarmonyKey =
  | "auto"
  | "analogous"
  | "complementary"
  | "split"
  | "triadic"
  | "tetradic"
  | "square"
  | "monochrome";

export type RoleKey =
  | "primary"
  | "secondary"
  | "tertiary"
  | "neutral"
  | "success"
  | "warning"
  | "error";

interface HarmonyShift {
  hueShift: number;
  chroma: number;
  lightness: number;
}

interface HarmonyMode {
  label: string;
  description: string;
  secondary?: HarmonyShift;
  tertiary?: HarmonyShift;
}

export const harmonyModes: Record<HarmonyKey, HarmonyMode> = {
  auto: {
    label: "Auto",
    description: "Randomly selects a color harmony scheme for the generated secondary and tertiary roles.",
  },
  analogous: {
    label: "Analogous",
    description: "Uses colors that sit next to each other on the color wheel, creating a harmonious and natural look.",
    secondary: { hueShift: 28, chroma: 0.94, lightness: 0.01 },
    tertiary: { hueShift: -28, chroma: 0.82, lightness: 0.02 },
  },
  split: {
    label: "Split-complementary",
    description: "Uses a base color and two neighbors of its opposite for contrast with less tension.",
    secondary: { hueShift: 150, chroma: 0.96, lightness: 0.01 },
    tertiary: { hueShift: -150, chroma: 0.9, lightness: 0.02 },
  },
  complementary: {
    label: "Complementary",
    description: "Uses colors opposite each other on the color wheel to create bold contrast and energy.",
    secondary: { hueShift: 180, chroma: 0.88, lightness: 0.02 },
    tertiary: { hueShift: 180, chroma: 0.48, lightness: 0.08 },
  },
  triadic: {
    label: "Triadic",
    description: "Uses three evenly spaced colors on the color wheel for a vibrant and balanced mix.",
    secondary: { hueShift: 120, chroma: 0.94, lightness: 0.01 },
    tertiary: { hueShift: -120, chroma: 0.9, lightness: 0.01 },
  },
  tetradic: {
    label: "Tetradic",
    description: "Uses two pairs of opposite colors for rich contrast and color variety in designs.",
    secondary: { hueShift: 90, chroma: 0.9, lightness: 0.02 },
    tertiary: { hueShift: 180, chroma: 0.72, lightness: 0.06 },
  },
  square: {
    label: "Square",
    description: "Uses four evenly spaced colors on the wheel for a bold and dynamic palette.",
    secondary: { hueShift: 90, chroma: 0.84, lightness: 0.02 },
    tertiary: { hueShift: -90, chroma: 0.84, lightness: 0.02 },
  },
  monochrome: {
    label: "Monochrome",
    description: "Keeps the same hue and varies saturation and lightness for a tighter, quieter system.",
    secondary: { hueShift: 0, chroma: 0.7, lightness: 0.05 },
    tertiary: { hueShift: 0, chroma: 1.06, lightness: -0.04 },
  },
};

export const selectableHarmonyKeys: HarmonyKey[] = [
  "analogous",
  "complementary",
  "split",
  "triadic",
  "tetradic",
  "square",
  "monochrome",
];

export const harmonyRenderOrder: HarmonyKey[] = [
  "auto",
  "analogous",
  "complementary",
  "split",
  "triadic",
  "tetradic",
  "square",
  "monochrome",
];

interface RoleConfigEntry {
  label: string;
  mode: "seed" | "harmony" | "neutral" | "fixed";
  slot?: "secondary" | "tertiary";
  seed?: string;
  kind: string;
}

export const roleConfig: Record<RoleKey, RoleConfigEntry> = {
  primary: { label: "Primary", mode: "seed", kind: "Seed" },
  secondary: { label: "Secondary", mode: "harmony", slot: "secondary", kind: "Generated" },
  tertiary: { label: "Tertiary", mode: "harmony", slot: "tertiary", kind: "Generated" },
  neutral: { label: "Neutral", mode: "neutral", kind: "Support" },
  success: { label: "Success", mode: "fixed", seed: "#16a34a", kind: "Semantic" },
  warning: { label: "Warning", mode: "fixed", seed: "#f59e0b", kind: "Semantic" },
  error: { label: "Error", mode: "fixed", seed: "#dc2626", kind: "Semantic" },
};

export const roleKeys = Object.keys(roleConfig) as RoleKey[];

export interface Shade {
  stop: number;
  hex: string;
}

export interface RolePalette {
  roleKey: RoleKey;
  roleLabel: string;
  roleKind: string;
  seedHex: string;
  familyName: string;
  anchor: number;
  colors: Shade[];
}

export type Palettes = Record<RoleKey, RolePalette>;

interface FamilyShade {
  number: number;
  hex: string;
  oklch: Oklch;
  hsl: { h: number; s: number; l: number };
}

interface Family {
  name: string;
  isGray: boolean;
  shades: FamilyShade[];
}

const tailwindFamilies: Family[] = Object.entries(tailwindReference).map(([name, values]) => ({
  name,
  isGray: ["Slate", "Gray", "Zinc", "Neutral", "Stone"].includes(name),
  shades: stops.map((number, index) => {
    const hex = values[index];
    const rgb = hexToRgb(hex);
    return { number, hex, oklch: rgbToOklch(rgb), hsl: rgbToHsl(rgb) };
  }),
}));

interface Blend {
  family: Family;
  anchor: FamilyShade;
  score: number;
  weight: number;
}

function findFamilyAndAnchor(seed: Oklch) {
  const candidates = tailwindFamilies.filter((family) => (isNeutral(seed) ? family.isGray : !family.isGray));
  const seedHsl = rgbToHsl(hexToRgb(rgbToHex(fitToSrgb(seed))));
  const exactShade = { family: candidates[0], shade: candidates[0].shades[0] };
  let bestDistance = Infinity;

  candidates.forEach((family) => {
    family.shades.forEach((shade) => {
      const distance = oklabDistance(seed, shade.oklch);
      if (distance < bestDistance) {
        bestDistance = distance;
        exactShade.family = family;
        exactShade.shade = shade;
      }
    });
  });

  if (bestDistance < 0.0001) {
    return { family: exactShade.family, anchor: exactShade.shade, exactMatch: true, blends: [] as Blend[] };
  }

  const options = candidates.map((family) => {
    let anchor = family.shades[0];
    let bestAnchorScore = Infinity;
    family.shades.forEach((shade) => {
      const lightnessDiff = Math.abs(shade.hsl.l - seedHsl.l);
      const huePenalty = isNeutral(seed) ? 0 : hueDistance(seed.h, shade.oklch.h) / 640;
      const chromaPenalty = Math.abs(seed.C - shade.oklch.C) * 0.42;
      const score = lightnessDiff + huePenalty + chromaPenalty;
      if (score < bestAnchorScore) {
        bestAnchorScore = score;
        anchor = shade;
      }
    });

    const anchorDistance = oklabDistance(seed, anchor.oklch);
    const closestDistance = Math.min(...family.shades.map((shade) => oklabDistance(seed, shade.oklch)));
    const score = anchorDistance + closestDistance * 0.45 + bestAnchorScore * 0.25;
    return { family, anchor, score };
  });

  options.sort((a, b) => a.score - b.score);
  const selected = options.slice(0, isNeutral(seed) ? 2 : 4);
  const sharpness = 2.35;
  const weights = selected.map((option) => 1 / Math.pow(option.score + 0.0001, sharpness));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const blends: Blend[] = selected.map((option, index) => ({ ...option, weight: weights[index] / totalWeight }));

  return { family: selected[0].family, anchor: selected[0].anchor, exactMatch: false, blends };
}

export function generateScale(seedHex: string) {
  const seed = rgbToOklch(hexToRgb(seedHex));
  const { family, anchor, exactMatch, blends } = findFamilyAndAnchor(seed);
  const anchorIndex = family.shades.findIndex((shade) => shade.number === anchor.number);
  const neutralSeed = isNeutral(seed);

  const colors: Shade[] = family.shades.map((shade, index) => {
    const stop = shade.number;
    if (exactMatch) return { stop, hex: shade.hex };
    if (index === anchorIndex) return { stop, hex: seedHex };

    let deltaL = 0;
    let chromaRatio = 0;
    let deltaH = 0;

    blends.forEach((blend) => {
      const blendAnchorIndex = blend.family.shades.findIndex((item) => item.number === blend.anchor.number);
      const blendShade = blend.family.shades[index];
      const shadeDistance = Math.abs(index - blendAnchorIndex);
      const lightnessDamping = Math.max(0.82, 1 - shadeDistance * 0.018);
      const anchorC = Math.max(blend.anchor.oklch.C, 0.012);
      deltaL += (blendShade.oklch.L - blend.anchor.oklch.L) * lightnessDamping * blend.weight;
      chromaRatio += (blendShade.oklch.C / anchorC) * blend.weight;
      deltaH += signedHueShift(blend.anchor.oklch.h, blendShade.oklch.h) * blend.weight;
    });

    const farFromAnchor = Math.abs(index - anchorIndex);
    const endpointSoftening = farFromAnchor > 4 ? 1 - (farFromAnchor - 4) * 0.025 : 1;
    const L = clamp(seed.L + deltaL, 0.08, 0.995);
    const C = clamp(seed.C * chromaRatio * endpointSoftening, 0.004, neutralSeed ? 0.045 : 0.34);
    const h = (seed.h + deltaH + 360) % 360;
    return { stop, hex: rgbToHex(fitToSrgb({ L, C, h })) };
  });

  return { colors, anchor: anchor.number, family };
}

export function effectiveHarmonyKey(seedHex: string, active: HarmonyKey): HarmonyKey {
  if (active !== "auto") return active;
  const clean = seedHex.replace("#", "");
  const index = parseInt(clean, 16) % selectableHarmonyKeys.length;
  return selectableHarmonyKeys[index];
}

function shiftSeedHex(seedHex: string, options: HarmonyShift): string {
  const seed = rgbToOklch(hexToRgb(seedHex));
  const derived: Oklch = {
    L: clamp(seed.L + (options.lightness || 0), 0.08, 0.96),
    C: clamp(seed.C * (options.chroma || 1), 0.02, 0.34),
    h: normalizeHue(seed.h + (options.hueShift || 0)),
  };
  return rgbToHex(fitToSrgb(derived));
}

function neutralSeedHex(seedHex: string): string {
  const seed = rgbToOklch(hexToRgb(seedHex));
  const neutral: Oklch = {
    L: clamp(0.72 + (seed.L - 0.65) * 0.08, 0.62, 0.8),
    C: clamp(seed.C * 0.08, 0.008, 0.028),
    h: seed.h,
  };
  return rgbToHex(fitToSrgb(neutral));
}

function roleSeedHex(primaryHex: string, roleKey: RoleKey, harmony: HarmonyKey): string {
  const config = roleConfig[roleKey];
  if (config.mode === "seed") return primaryHex;
  if (config.mode === "fixed") return config.seed!;
  if (config.mode === "neutral") return neutralSeedHex(primaryHex);
  const mode = harmonyModes[effectiveHarmonyKey(primaryHex, harmony)];
  return shiftSeedHex(primaryHex, mode[config.slot!]!);
}

export type RoleOverrides = Partial<Record<RoleKey, string>>;

export function generateRolePalettes(primaryHex: string, harmony: HarmonyKey, overrides: RoleOverrides = {}): Palettes {
  return roleKeys.reduce((accumulator, roleKey) => {
    const config = roleConfig[roleKey];
    const seedHex = overrides[roleKey] ?? roleSeedHex(primaryHex, roleKey, harmony);
    const generated = generateUiColorsScale(seedHex);
    accumulator[roleKey] = {
      roleKey,
      roleLabel: config.label,
      roleKind: config.kind,
      seedHex,
      familyName: generated.name,
      anchor: generated.anchor,
      colors: generated.colors,
    };
    return accumulator;
  }, {} as Palettes);
}

export interface InfoRow extends Shade {
  rgb: string;
  hsl: string;
  oklch: string;
  apcaWhite: number;
  apcaBlack: number;
  wcagWhite: string;
  wcagBlack: string;
}

export function paletteInfoRows(palette: RolePalette): InfoRow[] {
  return palette.colors.map((color) => ({
    ...color,
    rgb: formatRgb(color.hex),
    hsl: formatHsl(color.hex),
    oklch: formatOklch(color.hex),
    apcaWhite: Math.round(apcaLc(color.hex, "#ffffff")),
    apcaBlack: Math.round(apcaLc(color.hex, "#000000")),
    wcagWhite: wcagRatio(color.hex, "#ffffff").toFixed(2),
    wcagBlack: wcagRatio(color.hex, "#000000").toFixed(2),
  }));
}

export type ExportFormat = "CSS" | "Tailwind" | "Figma" | "Hex" | "OKLCH" | "HSL" | "RGB";
export const exportFormats: ExportFormat[] = ["CSS", "Tailwind", "Figma", "Hex", "OKLCH", "HSL", "RGB"];

// Figma variables export — matches Figma's native .tokens.json variable export
// (W3C design tokens draft: srgb components + alpha + hex, com.figma extensions).
export function figmaTokens(palettes: Palettes, modeName = "Default"): string {
  const toToken = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return {
      $type: "color",
      $value: {
        colorSpace: "srgb",
        components: [r, g, b],
        alpha: 1,
        hex: hex.toUpperCase(),
      },
      $extensions: {
        "com.figma.scopes": ["ALL_SCOPES"],
      },
    };
  };

  const doc: Record<string, unknown> = {
    Mode: {
      $type: "string",
      $value: modeName,
      $extensions: { "com.figma.type": "string" },
    },
  };
  Object.values(palettes).forEach((palette) => {
    const group: Record<string, unknown> = {};
    palette.colors.forEach(({ stop, hex }) => {
      group[String(stop)] = toToken(hex);
    });
    doc[palette.roleLabel] = group;
  });
  doc["$extensions"] = { "com.figma.modeName": modeName };
  return JSON.stringify(doc, null, 2);
}

export function exportText(palettes: Palettes, current: RolePalette, format: ExportFormat): string {
  const allPalettes = Object.values(palettes);
  const rows = paletteInfoRows(current);
  if (format === "Figma") {
    return figmaTokens(palettes);
  }
  if (format === "CSS") {
    return `:root {\n${allPalettes
      .map((palette) => palette.colors.map((color) => `  --color-${palette.roleKey}-${color.stop}: ${color.hex};`).join("\n"))
      .join("\n")}\n}`;
  }
  if (format === "Tailwind") {
    return allPalettes
      .map((palette) => `${palette.roleKey}: {\n${palette.colors.map((color) => `  ${color.stop}: "${color.hex}",`).join("\n")}\n}`)
      .join("\n\n");
  }
  if (format === "Hex") {
    return allPalettes
      .map((palette) => `${palette.roleLabel}\n${palette.colors.map((color) => `${color.stop} ${color.hex}`).join("\n")}`)
      .join("\n\n");
  }
  if (format === "OKLCH") {
    return rows.map((color) => `${color.stop} ${color.oklch}`).join("\n");
  }
  if (format === "HSL") {
    return rows.map((color) => `${color.stop} ${color.hsl}`).join("\n");
  }
  return rows.map((color) => `${color.stop} ${color.rgb}`).join("\n");
}

export interface MatrixFilterOption {
  id: string;
  label: string;
  note: string;
}

export const matrixFilterOptions: MatrixFilterOption[] = [
  { id: "all", label: "All", note: "All shade pairings are shown." },
  { id: "wcag2", label: "WCAG 2", note: "Highlights pairings at 4.5:1 or higher." },
  { id: "apca45", label: "APCA 45+", note: "Highlights practical large-text and strong UI pairings." },
  { id: "apca60", label: "APCA 60+", note: "Highlights small text and non-body UI pairings." },
  { id: "apca75", label: "APCA 75+", note: "Highlights stronger body text pairings." },
  { id: "apca90", label: "APCA 90+", note: "Highlights very high contrast pairings." },
];

export function isPassingPair(fg: string, bg: string, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "wcag2") return wcagRatio(fg, bg) >= 4.5;
  const threshold = Number(filter.replace("apca", ""));
  return Math.abs(apcaLc(fg, bg)) >= threshold;
}
