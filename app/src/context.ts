import { createContext, useContext } from "react";
import { AccentPlan, HarmonyKey, Palettes, RoleKey, accentPlan } from "./lib/palette";

export interface AppContextValue {
  palettes: Palettes;
  activeRole: RoleKey;
  harmony: HarmonyKey;
  copy: (text: string, label?: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppContext missing");
  return value;
}

export function useHex() {
  const { palettes } = useApp();
  return (role: RoleKey, stop: number): string =>
    palettes[role].colors.find((color) => color.stop === stop)?.hex ?? "#000000";
}

// Tells example tabs which roles to lean on so generated examples visibly
// shift with the harmony mode — e.g. monochromatic stays tonal on primary,
// complementary uses the secondary sparingly, triadic spreads across all three.
export function useAccentPlan(): AccentPlan {
  const { palettes, harmony } = useApp();
  return accentPlan(palettes.primary.seedHex, harmony);
}
