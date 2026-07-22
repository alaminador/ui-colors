import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Moon02Icon, Redo02Icon, Sun02Icon, Undo02Icon } from "@hugeicons/core-free-icons";
import { AppContext } from "./context";
import { Icon } from "./components/Icon";
import { contrastText, normalizeHex, randomHex } from "./lib/color";
import { ExportMeta, HarmonyKey, Palettes, RoleKey, RoleOverrides, generateRolePalettes, roleKeys } from "./lib/palette";
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

type CvdKey = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const cvdOptions: { key: CvdKey; label: string }[] = [
  { key: "none", label: "Normal vision" },
  { key: "protanopia", label: "Protanopia" },
  { key: "deuteranopia", label: "Deuteranopia" },
  { key: "tritanopia", label: "Tritanopia" },
  { key: "achromatopsia", label: "Grayscale" },
];

// feColorMatrix values simulating dichromatic color vision (Brettel/Viénot).
const cvdMatrices: Record<Exclude<CvdKey, "none">, string> = {
  protanopia: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
  deuteranopia: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
  tritanopia: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
  achromatopsia: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0",
};

interface HistorySnapshot {
  seedHex: string;
  overrides: RoleOverrides;
  hasSecondary: boolean;
  hasTertiary: boolean;
  harmony: HarmonyKey;
  neutralTint: number;
}

export default function App() {
  const [seedHex, setSeedHex] = useState("#4fbda1");
  const [overrides, setOverrides] = useState<RoleOverrides>({});
  const [hasSecondary, setHasSecondary] = useState(false);
  const [hasTertiary, setHasTertiary] = useState(false);
  const [neutralTint, setNeutralTint] = useState(0.5);
  const [harmony, setHarmony] = useState<HarmonyKey>("auto");
  const [exTheme, setExTheme] = useState<"dark" | "light">("dark");
  const [cvd, setCvd] = useState<CvdKey>("none");
  const [activeRole, setActiveRole] = useState<RoleKey>("primary");
  const [sideTab, setSideTab] = useState<SideTab>("brand");
  const [tab, setTab] = useState<TabKey>("cards");
  const [modal, setModal] = useState<ModalKey>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [view, setView] = useState<View>("generate");
  const [saved, setSaved] = useState<SavedPalette[]>(() => loadPalettes());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  // --- undo/redo history over the palette-defining state ---
  const stateRef = useRef<HistorySnapshot>({ seedHex, overrides, hasSecondary, hasTertiary, harmony, neutralTint });
  stateRef.current = { seedHex, overrides, hasSecondary, hasTertiary, harmony, neutralTint };
  const historyRef = useRef<{ past: HistorySnapshot[]; future: HistorySnapshot[] }>({ past: [], future: [] });
  const lastPush = useRef(0);

  // Coalesces slider drags / rapid typing into one history entry per gesture.
  const pushHistory = useCallback(() => {
    const now = Date.now();
    if (now - lastPush.current < 600) return;
    lastPush.current = now;
    historyRef.current.past.push(stateRef.current);
    if (historyRef.current.past.length > 60) historyRef.current.past.shift();
    historyRef.current.future = [];
  }, []);

  const applySnapshot = useCallback((snapshot: HistorySnapshot) => {
    setSeedHex(snapshot.seedHex);
    setOverrides(snapshot.overrides);
    setHasSecondary(snapshot.hasSecondary);
    setHasTertiary(snapshot.hasTertiary);
    setHarmony(snapshot.harmony);
    setNeutralTint(snapshot.neutralTint);
  }, []);

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

  // Export only the roles the user actually added — secondary/tertiary stay
  // out of every export format until their toggle is on.
  const exportPalettes = useMemo(() => {
    const next: Partial<Palettes> = { ...palettes };
    if (!hasSecondary) delete next.secondary;
    if (!hasTertiary) delete next.tertiary;
    return next;
  }, [palettes, hasSecondary, hasTertiary]);

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
    pushHistory();
    if (role === "primary") {
      setSeedHex(clean);
    } else {
      setOverrides((current) => ({ ...current, [role]: clean }));
    }
  }, [pushHistory]);

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
    pushHistory();
    setSeedHex(item.seedHex);
    setHarmony(item.harmony);
    setOverrides(item.overrides);
    setHasSecondary(item.hasSecondary);
    setHasTertiary(item.hasTertiary ?? false);
    setNeutralTint(item.neutralTint ?? 0.5);
    setActiveRole("primary");
    setSideTab("brand");
    setView("generate");
  }, [pushHistory]);

  // Locked (manually overridden) roles are intentionally preserved across a
  // randomize — that's the point of locking a role to a manual color. Any
  // role without an override simply recomputes from the new seed + harmony.
  const randomize = useCallback(() => {
    lastPush.current = 0;
    pushHistory();
    setSeedHex(randomHex());
  }, [pushHistory]);

  const resetRole = useCallback((role: RoleKey) => {
    pushHistory();
    setOverrides((current) => {
      const next = { ...current };
      delete next[role];
      return next;
    });
  }, [pushHistory]);

  const showToast = useCallback((label: string) => {
    setToast(label);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1400);
  }, []);

  const undo = useCallback(() => {
    const previous = historyRef.current.past.pop();
    if (!previous) {
      showToast("Nothing to undo");
      return;
    }
    historyRef.current.future.push(stateRef.current);
    applySnapshot(previous);
    showToast("Undone");
  }, [applySnapshot, showToast]);

  const redo = useCallback(() => {
    const next = historyRef.current.future.pop();
    if (!next) {
      showToast("Nothing to redo");
      return;
    }
    historyRef.current.past.push(stateRef.current);
    applySnapshot(next);
    showToast("Redone");
  }, [applySnapshot, showToast]);

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

    // Example-surface tokens: neutral-tinted, flipped by the example theme toggle.
    const neutral = (stop: number) => palettes.neutral.colors.find((color) => color.stop === stop)!.hex;
    const exTokens: Record<string, string> =
      exTheme === "dark"
        ? {
            "--ex-bg": neutral(950),
            "--ex-panel": neutral(900),
            "--ex-panel-2": neutral(800),
            "--ex-ink": "#ffffff",
            "--ex-ink-soft": "rgba(255, 255, 255, 0.78)",
            "--ex-muted": "rgba(255, 255, 255, 0.52)",
            "--ex-card": "rgba(255, 255, 255, 0.04)",
            "--ex-soft": "rgba(255, 255, 255, 0.07)",
            "--ex-line": "rgba(255, 255, 255, 0.1)",
            "--ex-line-strong": "rgba(255, 255, 255, 0.17)",
          }
        : {
            "--ex-bg": neutral(50),
            "--ex-panel": "#ffffff",
            "--ex-panel-2": neutral(100),
            "--ex-ink": neutral(950),
            "--ex-ink-soft": "rgba(15, 18, 24, 0.78)",
            "--ex-muted": "rgba(15, 18, 24, 0.55)",
            "--ex-card": "rgba(15, 18, 24, 0.045)",
            "--ex-soft": "rgba(15, 18, 24, 0.07)",
            "--ex-line": "rgba(15, 18, 24, 0.12)",
            "--ex-line-strong": "rgba(15, 18, 24, 0.22)",
          };
    Object.entries(exTokens).forEach(([name, value]) => root.setProperty(name, value));
  }, [palettes, activeRole, seedHex, exTheme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
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
  }, [modal, randomize, undo, redo]);

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
            pushHistory();
            setHasSecondary(true);
            setActiveRole("secondary");
          }}
          onRemoveSecondary={() => {
            pushHistory();
            setHasSecondary(false);
            setOverrides((current) => {
              const next = { ...current };
              delete next.secondary;
              return next;
            });
            setActiveRole("primary");
          }}
          onAddTertiary={() => {
            pushHistory();
            setHasTertiary(true);
            setActiveRole("tertiary");
          }}
          onRemoveTertiary={() => {
            pushHistory();
            setHasTertiary(false);
            setOverrides((current) => {
              const next = { ...current };
              delete next.tertiary;
              return next;
            });
            setActiveRole("primary");
          }}
          onResetRole={resetRole}
          onNeutralTint={(value) => {
            pushHistory();
            setNeutralTint(value);
          }}
          onRandom={randomize}
          onHarmony={(key) => {
            pushHistory();
            setHarmony(key);
          }}
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
            <div className="tab-tools">
              <button className="icon-btn" title="Undo (⌘Z)" aria-label="Undo" onClick={undo}>
                <Icon icon={Undo02Icon} size={15} />
              </button>
              <button className="icon-btn" title="Redo (⇧⌘Z)" aria-label="Redo" onClick={redo}>
                <Icon icon={Redo02Icon} size={15} />
              </button>
              <button
                className="icon-btn"
                title={exTheme === "dark" ? "Preview examples on light surfaces" : "Preview examples on dark surfaces"}
                aria-label="Toggle example theme"
                onClick={() => setExTheme((t) => (t === "dark" ? "light" : "dark"))}
              >
                <Icon icon={exTheme === "dark" ? Sun02Icon : Moon02Icon} size={15} />
              </button>
              <select
                className="cvd-select"
                value={cvd}
                aria-label="Color vision simulation"
                onChange={(event) => setCvd(event.target.value as CvdKey)}
              >
                {cvdOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>
          </nav>
          <div className="tab-body" style={{ filter: cvd === "none" ? undefined : `url(#cvd-${cvd})` }}>
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
          palettes={exportPalettes}
          palette={palettes[activeRole]}
          exportMeta={exportMeta}
          onClose={() => setModal(null)}
          onCopy={copy}
        />
      )}
      <div className="toast" data-show={toast ? "true" : "false"}>
        {toast ?? "Copied"}
      </div>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          {(Object.entries(cvdMatrices) as [string, string][]).map(([key, matrix]) => (
            <filter key={key} id={`cvd-${key}`} colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values={matrix} />
            </filter>
          ))}
        </defs>
      </svg>
    </AppContext.Provider>
  );
}
