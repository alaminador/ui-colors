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
  const { palettes, activeRole } = useApp();
  // Examples always lead with the scale selected in the sidebar: the active
  // role is swapped with "primary" so picking Secondary (or Success, etc.)
  // repaints every example with that scale while the rest stay distinct.
  return (role: RoleKey, stop: number): string => {
    const resolved = role === "primary" ? activeRole : role === activeRole ? "primary" : role;
    return palettes[resolved].colors.find((color) => color.stop === stop)?.hex ?? "#000000";
  };
}

// Tells example tabs which roles to lean on so generated examples visibly
// shift with the harmony mode — e.g. monochromatic stays tonal on primary,
// complementary uses the secondary sparingly, triadic spreads across all three.
export function useAccentPlan(): AccentPlan {
  const { palettes, harmony } = useApp();
  return accentPlan(palettes.primary.seedHex, harmony);
}
