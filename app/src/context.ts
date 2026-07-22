import { createContext, useContext } from "react";
import { AccentPlan, HarmonyKey, Palettes, RoleKey, accentPlan } from "./lib/palette";

export interface AppContextValue {
  palettes: Palettes;
  activeRole: RoleKey;
  harmony: HarmonyKey;
  hasSecondary: boolean;
  hasTertiary: boolean;
  copy: (text: string, label?: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppContext missing");
  return value;
}

export function useHex() {
  const { palettes, activeRole, hasSecondary, hasTertiary } = useApp();
  // Examples always lead with the scale selected in the sidebar: the active
  // role is swapped with "primary" so picking Secondary (or Success, etc.)
  // repaints every example with that scale while the rest stay distinct.
  // Scales the user hasn't added fall back to primary, so examples only ever
  // showcase colors that actually exist in the palette.
  return (role: RoleKey, stop: number): string => {
    let requested = role;
    if ((requested === "secondary" && !hasSecondary) || (requested === "tertiary" && !hasTertiary)) {
      requested = "primary";
    }
    const resolved = requested === "primary" ? activeRole : requested === activeRole ? "primary" : requested;
    return palettes[resolved].colors.find((color) => color.stop === stop)?.hex ?? "#000000";
  };
}

// Tells example tabs which roles to lean on so generated examples visibly
// shift with the harmony mode — e.g. monochromatic stays tonal on primary,
// complementary uses the secondary sparingly, triadic spreads across all three.
export function useAccentPlan(): AccentPlan {
  const { palettes, harmony, hasSecondary, hasTertiary } = useApp();
  return accentPlan(palettes.primary.seedHex, harmony, hasSecondary, hasTertiary);
}
