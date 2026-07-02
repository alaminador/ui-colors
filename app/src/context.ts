import { createContext, useContext } from "react";
import { Palettes, RoleKey } from "./lib/palette";

export interface AppContextValue {
  palettes: Palettes;
  activeRole: RoleKey;
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
