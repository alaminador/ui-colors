import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "./context";
import { contrastText, normalizeHex, randomHex } from "./lib/color";
import { ExportMeta, HarmonyKey, RoleKey, RoleOverrides, generateRolePalettes, roleKeys } from "./lib/palette";
import { TopNav, View } from "./components/TopNav";
import { Sidebar, SideTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MyPalettesPage } from "./pages/MyPalettesPage";
import { TailwindColorsPage } from "./pages/TailwindColorsPage";
import { SavedPalette, loadPalettes, persistPalettes } from "./lib/storage";
import { MatrixModal } from "./components/MatrixModal";
import { InfoModal } from "./components/InfoModal";
import { ExportModal } from "./components/ExportModal";
import { CardsTab } from "./tabs/CardsTab";
import { WebsiteTab } from "./tabs/WebsiteTab";
import { BrandingTab } from "./tabs/BrandingTab";
import { DashboardTab } from "./tabs/DashboardTab";
import { ComponentsTab } from "./tabs/ComponentsTab";
import { ShadcnTab } from "./tabs/ShadcnTab";
import { AppsTab } from "./tabs/AppsTab";
import { ChartsTab } from "./tabs/ChartsTab";
import { GradientsTab } from "./tabs/GradientsTab";
import { LogosTab } from "./tabs/LogosTab";
import { HeadingsTab } from "./tabs/HeadingsTab";

export type TabKey =
  | "cards"
  | "website"
  | "branding"
  | "dashboard"
  | "components"
  | "shadcn"
  | "apps"
  | "charts"
  | "gradients"
  | "logos"
  | "headings";

export const tabs: { key: TabKey; label: string }[] = [
  { key: "cards", label: "Cards" },
  { key: "website", label: "Website" },
  { key: "branding", label: "Branding" },
  { key: "dashboard", label: "Dashboard" },
  { key: "components", label: "Components" },
  { key: "shadcn", label: "Shadcn/ui" },
  { key: "apps", label: "Apps" },
  { key: "charts", label: "Charts" },
  { key: "gradients", label: "Gradients" },
  { key: "logos", label: "Logos" },
  { key: "headings", label: "Headings" },
];

export type ModalKey = "matrix" | "info" | "export" | null;

export default function App() {
  const [seedHex, setSeedHex] = useState("#4fbda1");
  const [overrides, setOverrides] = useState<RoleOverrides>({});
  const [hasSecondary, setHasSecondary] = useState(false);
  const [hasTertiary, setHasTertiary] = useState(false);
  const [neutralTint, setNeutralTint] = useState(0.5);
  const [harmony, setHarmony] = useState<HarmonyKey>("auto");
  const [activeRole, setActiveRole] = useState<RoleKey>("primary");
  const [sideTab, setSideTab] = useState<SideTab>("brand");
  const [tab, setTab] = useState<TabKey>("cards");
  const [modal, setModal] = useState<ModalKey>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [view, setView] = useState<View>("generate");
  const [saved, setSaved] = useState<SavedPalette[]>(() => loadPalettes());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  useEffect(() => {
    persistPalettes(saved);
  }, [saved]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const palettes = useMemo(
    () => generateRolePalettes(seedHex, harmony, overrides, neutralTint),
    [seedHex, harmony, overrides, neutralTint]
  );

  const exportMeta: ExportMeta = useMemo(
    () => ({ harmony, lockedRoles: Object.keys(overrides) as RoleKey[] }),
    [harmony, overrides]
  );

  const copy = useCallback(async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(label);
    } catch {
      setToast("Copy blocked");
    }
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1400);
  }, []);

  const setSeed = useCallback((role: RoleKey, value: string) => {
    const clean = normalizeHex(value);
    if (!clean) return;
    if (role === "primary") {
      setSeedHex(clean);
    } else {
      setOverrides((current) => ({ ...current, [role]: clean }));
    }
  }, []);

  const savePalette = useCallback(() => {
    const entry: SavedPalette = {
      id: crypto.randomUUID(),
      name: palettes.primary.familyName,
      seedHex,
      harmony,
      overrides,
      hasSecondary,
      hasTertiary,
      neutralTint,
      savedAt: Date.now(),
    };
    setSaved((current) => [entry, ...current]);
    setToast("Saved to My palettes");
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1400);
  }, [palettes, seedHex, harmony, overrides, hasSecondary, hasTertiary, neutralTint]);

  const loadSaved = useCallback((item: SavedPalette) => {
    setSeedHex(item.seedHex);
    setHarmony(item.harmony);
    setOverrides(item.overrides);
    setHasSecondary(item.hasSecondary);
    setHasTertiary(item.hasTertiary ?? false);
    setNeutralTint(item.neutralTint ?? 0.5);
    setActiveRole("primary");
    setSideTab("brand");
    setView("generate");
  }, []);

  // Locked (manually overridden) roles are intentionally preserved across a
  // randomize — that's the point of locking a role to a manual color. Any
  // role without an override simply recomputes from the new seed + harmony.
  const randomize = useCallback(() => {
    setSeedHex(randomHex());
  }, []);

  const resetRole = useCallback((role: RoleKey) => {
    setOverrides((current) => {
      const next = { ...current };
      delete next[role];
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement.style;
    roleKeys.forEach((roleKey) => {
      palettes[roleKey].colors.forEach(({ stop, hex }) => {
        root.setProperty(`--${roleKey}-${stop}`, hex);
      });
    });
    palettes[activeRole].colors.forEach(({ stop, hex }) => {
      root.setProperty(`--scale-${stop}`, hex);
    });
    root.setProperty("--seed", seedHex);
    root.setProperty("--primary-contrast", contrastText(palettes.primary.colors[5].hex));
    root.setProperty("--scale-contrast", contrastText(palettes[activeRole].colors[5].hex));
  }, [palettes, activeRole, seedHex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        return;
      }
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (event.code === "Space" && !typing && modal === null) {
        event.preventDefault();
        randomize();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, randomize]);

  return (
    <AppContext.Provider value={{ palettes, activeRole, harmony, copy }}>
      <TopNav
        view={view}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onNavigate={setView}
      />
      {view === "palettes" && (
        <MyPalettesPage
          saved={saved}
          onLoad={loadSaved}
          onDelete={(id) => setSaved((current) => current.filter((item) => item.id !== id))}
        />
      )}
      {view === "tailwind" && <TailwindColorsPage />}
      <div className="app-frame" style={{ display: view === "generate" ? undefined : "none" }}>
        <Sidebar
          palettes={palettes}
          overrides={overrides}
          activeRole={activeRole}
          sideTab={sideTab}
          harmony={harmony}
          hasSecondary={hasSecondary}
          hasTertiary={hasTertiary}
          neutralTint={neutralTint}
          onSideTab={setSideTab}
          onSelectRole={setActiveRole}
          onSetSeed={setSeed}
          onAddSecondary={() => {
            setHasSecondary(true);
            setActiveRole("secondary");
          }}
          onRemoveSecondary={() => {
            setHasSecondary(false);
            setOverrides((current) => {
              const next = { ...current };
              delete next.secondary;
              return next;
            });
            setActiveRole("primary");
          }}
          onAddTertiary={() => {
            setHasTertiary(true);
            setActiveRole("tertiary");
          }}
          onRemoveTertiary={() => {
            setHasTertiary(false);
            setOverrides((current) => {
              const next = { ...current };
              delete next.tertiary;
              return next;
            });
            setActiveRole("primary");
          }}
          onResetRole={resetRole}
          onNeutralTint={setNeutralTint}
          onRandom={randomize}
          onHarmony={setHarmony}
        />
        <main className="main-area">
          <Header palettes={palettes} activeRole={activeRole} onOpenModal={setModal} onCopy={copy} onSave={savePalette} />
          <nav className="tab-nav">
            {tabs.map((item) => (
              <button
                key={item.key}
                className={`tab-link ${tab === item.key ? "is-active" : ""}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="tab-body">
            {tab === "cards" && <CardsTab />}
            {tab === "website" && <WebsiteTab />}
            {tab === "branding" && <BrandingTab />}
            {tab === "dashboard" && <DashboardTab />}
            {tab === "components" && <ComponentsTab />}
            {tab === "shadcn" && <ShadcnTab />}
            {tab === "apps" && <AppsTab />}
            {tab === "charts" && <ChartsTab />}
            {tab === "gradients" && <GradientsTab />}
            {tab === "logos" && <LogosTab />}
            {tab === "headings" && <HeadingsTab />}
          </div>
          <footer className="site-footer">
            <span>Perceptual Palette Lab — uicolors engine</span>
            <span>chroma-js deltaE · Tailwind reference families · APCA + WCAG</span>
          </footer>
        </main>
      </div>
      {modal === "matrix" && <MatrixModal palette={palettes[activeRole]} onClose={() => setModal(null)} onCopy={copy} />}
      {modal === "info" && <InfoModal palette={palettes[activeRole]} onClose={() => setModal(null)} onCopy={copy} />}
      {modal === "export" && (
        <ExportModal
          palettes={palettes}
          palette={palettes[activeRole]}
          exportMeta={exportMeta}
          onClose={() => setModal(null)}
          onCopy={copy}
        />
      )}
      <div className="toast" data-show={toast ? "true" : "false"}>
        {toast ?? "Copied"}
      </div>
    </AppContext.Provider>
  );
}
