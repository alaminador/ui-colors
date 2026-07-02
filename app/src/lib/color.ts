export type Oklch = { L: number; C: number; h: number };
export type Rgb = [number, number, number];
export type Hsl = { h: number; s: number; l: number };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHex(value: string): string | null {
  const clean = value.trim().replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    return "#" + clean.split("").map((char) => char + char).join("").toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(clean)) {
    return "#" + clean.toLowerCase();
  }
  return null;
}

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ];
}

function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value: number): number {
  return value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);
  let l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  let m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  let s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  l = Math.cbrt(l);
  m = Math.cbrt(m);
  s = Math.cbrt(s);

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const C = Math.sqrt(a * a + b2 * b2);
  let h = (Math.atan2(b2, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
    if (max === g) hue = (b - r) / delta + 2;
    if (max === b) hue = (r - g) / delta + 4;
    hue *= 60;
  }

  return { h: hue, s: saturation, l: lightness };
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

export function oklchToRgb({ L, C, h }: Oklch): Rgb {
  const angle = (h * Math.PI) / 180;
  const a = Math.cos(angle) * C;
  const b = Math.sin(angle) * C;
  const lPrime = L + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = L - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [
    linearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

export function rgbToHex(rgb: Rgb): string {
  return (
    "#" +
    rgb
      .map((value) => {
        const channel = Math.round(clamp(value, 0, 1) * 255);
        return channel.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

export function fitToSrgb(color: Oklch): Rgb {
  const direct = oklchToRgb(color);
  if (direct.every((channel) => channel >= 0 && channel <= 1)) return direct;

  let low = 0;
  let high = color.C;
  let fitted = direct;
  for (let i = 0; i < 24; i += 1) {
    const C = (low + high) / 2;
    const candidate = oklchToRgb({ ...color, C });
    if (candidate.every((channel) => channel >= 0 && channel <= 1)) {
      low = C;
      fitted = candidate;
    } else {
      high = C;
    }
  }
  return fitted.map((channel) => clamp(channel, 0, 1)) as Rgb;
}

export function hexToRgb255(hex: string): number[] {
  return hexToRgb(hex).map((value) => Math.round(value * 255));
}

export function formatRgb(hex: string): string {
  return `rgb(${hexToRgb255(hex).join(", ")})`;
}

export function formatHsl(hex: string): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
}

export function formatOklch(hex: string): string {
  const oklch = rgbToOklch(hexToRgb(hex));
  return `oklch(${oklch.L.toFixed(3)} ${oklch.C.toFixed(3)} ${Math.round(oklch.h)})`;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((value) => {
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function wcagRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function apcaLc(fg: string, bg: string): number {
  const text = relativeLuminance(fg);
  const background = relativeLuminance(bg);
  const polarity = background > text ? 1 : -1;
  const contrast = Math.abs(Math.pow(background, 0.56) - Math.pow(text, 0.57)) * 132;
  return polarity * contrast;
}

export function contrastText(hex: string): string {
  return relativeLuminance(hex) > 0.58 ? "#12161d" : "#f8fafd";
}

export function oklabDistance(a: Oklch, b: Oklch): number {
  const chromaWeight = 0.72;
  const hueA = (a.h * Math.PI) / 180;
  const hueB = (b.h * Math.PI) / 180;
  const ax = Math.cos(hueA) * a.C * chromaWeight;
  const ay = Math.sin(hueA) * a.C * chromaWeight;
  const bx = Math.cos(hueB) * b.C * chromaWeight;
  const by = Math.sin(hueB) * b.C * chromaWeight;
  return Math.hypot((a.L - b.L) * 1.35, ax - bx, ay - by);
}

export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

export function signedHueShift(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

export function isNeutral(color: Oklch): boolean {
  return color.C < 0.035;
}

export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

export function hueOf(hex: string): number {
  return rgbToOklch(hexToRgb(hex)).h;
}

export function randomHex(): string {
  const hue = Math.floor(Math.random() * 360);
  const chroma = 0.12 + Math.random() * 0.18;
  const lightness = 0.58 + Math.random() * 0.14;
  return rgbToHex(fitToSrgb({ L: lightness, C: chroma, h: hue }));
}
