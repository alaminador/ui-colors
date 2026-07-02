import { HarmonyKey, RoleOverrides } from "./palette";

export interface SavedPalette {
  id: string;
  name: string;
  seedHex: string;
  harmony: HarmonyKey;
  overrides: RoleOverrides;
  hasSecondary: boolean;
  hasTertiary?: boolean;
  neutralTint?: number;
  savedAt: number;
}

const STORAGE_KEY = "uicolors.palettes";

export function loadPalettes(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPalette[]) : [];
  } catch {
    return [];
  }
}

export function persistPalettes(palettes: SavedPalette[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}
