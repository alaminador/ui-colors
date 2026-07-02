import { useState } from "react";
import { Add01Icon, ArrowDataTransferVerticalIcon, RefreshIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HarmonyKey, RoleKey, Palettes, harmonyModes, harmonyRenderOrder } from "../lib/palette";
import { ColorField, ColorFormat, colorFormats } from "./ColorField";
import { Icon } from "./Icon";

export type SideTab = "brand" | "neutral" | "status";

interface SidebarProps {
  palettes: Palettes;
  activeRole: RoleKey;
  sideTab: SideTab;
  harmony: HarmonyKey;
  hasSecondary: boolean;
  onSideTab: (tab: SideTab) => void;
  onSelectRole: (role: RoleKey) => void;
  onSetSeed: (role: RoleKey, hex: string) => void;
  onAddSecondary: () => void;
  onRemoveSecondary: () => void;
  onRandom: () => void;
  onHarmony: (key: HarmonyKey) => void;
}

export function Sidebar({
  palettes,
  activeRole,
  sideTab,
  harmony,
  hasSecondary,
  onSideTab,
  onSelectRole,
  onSetSeed,
  onAddSecondary,
  onRemoveSecondary,
  onRandom,
  onHarmony,
}: SidebarProps) {
  const [harmonyOpen, setHarmonyOpen] = useState(false);
  const [format, setFormat] = useState<ColorFormat>("HEX");

  const cycleFormat = () => {
    const index = colorFormats.indexOf(format);
    setFormat(colorFormats[(index + 1) % colorFormats.length]);
  };

  const formatToggle = (
    <span className="side-label-meta">
      <button className="format-cycle" onClick={cycleFormat} title="Switch color format">
        {format} <Icon icon={ArrowDataTransferVerticalIcon} size={13} />
      </button>
      <button className="icon-btn" title="Settings" aria-label="Scale settings">
        <Icon icon={Settings01Icon} size={15} />
      </button>
    </span>
  );

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Tailwind CSS Color Generator</h1>
      <p className="sidebar-sub">
        Create and visualize <a>Tailwind colors</a> on all sorts of components and designs.
      </p>

      <div className="side-tabs">
        <button className={sideTab === "brand" ? "is-active" : ""} onClick={() => { onSideTab("brand"); onSelectRole("primary"); }}>Brand</button>
        <button className={sideTab === "neutral" ? "is-active" : ""} onClick={() => { onSideTab("neutral"); onSelectRole("neutral"); }}>Neutral</button>
        <button className={sideTab === "status" ? "is-active" : ""} onClick={() => { onSideTab("status"); onSelectRole("success"); }}>Status</button>
      </div>

      {sideTab === "brand" && (
        <div className="side-section">
          <div className="side-label-row">
            <span className="side-label">Primary</span>
            {formatToggle}
          </div>
          <ColorField
            role="primary"
            hex={palettes.primary.seedHex}
            active={activeRole === "primary"}
            format={format}
            locked
            onSelect={() => onSelectRole("primary")}
            onChange={(hex) => onSetSeed("primary", hex)}
          />

          {hasSecondary ? (
            <>
              <div className="side-label-row">
                <span className="side-label">Secondary</span>
              </div>
              <ColorField
                role="secondary"
                hex={palettes.secondary.seedHex}
                active={activeRole === "secondary"}
                format={format}
                onSelect={() => onSelectRole("secondary")}
                onChange={(hex) => onSetSeed("secondary", hex)}
                onRemove={onRemoveSecondary}
              />
            </>
          ) : (
            <button className="wide-pill" onClick={onAddSecondary}>
              <span className="wide-pill-icon"><Icon icon={Add01Icon} size={17} /></span> Add secondary color scale
            </button>
          )}

          <button className="wide-pill" onClick={onRandom}>
            <span className="wide-pill-icon"><Icon icon={RefreshIcon} size={16} /></span> Random colors
            <span className="key-chip">Spacebar</span>
          </button>

          <button className="harmony-trigger-row" onClick={() => setHarmonyOpen((open) => !open)}>
            Color harmony settings <strong>{harmonyModes[harmony].label.toLowerCase()}</strong>
          </button>
          {harmonyOpen && (
            <div className="harmony-chips">
              {harmonyRenderOrder.map((key) => (
                <button
                  key={key}
                  className={`chip ${key === harmony ? "is-active" : ""}`}
                  title={harmonyModes[key].description}
                  onClick={() => onHarmony(key)}
                >
                  {harmonyModes[key].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {sideTab === "neutral" && (
        <div className="side-section">
          <div className="side-label-row">
            <span className="side-label">Neutral</span>
            {formatToggle}
          </div>
          <ColorField
            role="neutral"
            hex={palettes.neutral.seedHex}
            active={activeRole === "neutral"}
            format={format}
            onSelect={() => onSelectRole("neutral")}
            onChange={(hex) => onSetSeed("neutral", hex)}
          />
          <p className="side-note">Auto-tinted from your primary. Edit to lock a custom neutral.</p>
        </div>
      )}

      {sideTab === "status" && (
        <div className="side-section">
          <div className="side-label-row">
            <span className="side-label">Status colors</span>
            {formatToggle}
          </div>
          {(["success", "warning", "error"] as RoleKey[]).map((role) => (
            <div key={role} className="side-status-block">
              <div className="side-label-row">
                <span className="side-label side-label-sm">{palettes[role].roleLabel}</span>
              </div>
              <ColorField
                role={role}
                hex={palettes[role].seedHex}
                active={activeRole === role}
                format={format}
                onSelect={() => onSelectRole(role)}
                onChange={(hex) => onSetSeed(role, hex)}
              />
            </div>
          ))}
        </div>
      )}

    </aside>
  );
}
