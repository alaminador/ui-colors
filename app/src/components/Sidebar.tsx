import { useState } from "react";
import {
  Add01Icon,
  ArrowDataTransferVerticalIcon,
  Link01Icon,
  RefreshIcon,
  Settings01Icon,
  SquareLock02Icon,
} from "@hugeicons/core-free-icons";
import { HarmonyKey, RoleKey, Palettes, RoleOverrides, harmonyModes, harmonyRenderOrder } from "../lib/palette";
import { hueOf } from "../lib/color";
import { ColorField, ColorFormat, colorFormats } from "./ColorField";
import { HueWheel } from "./HueWheel";
import { Icon } from "./Icon";

export type SideTab = "brand" | "neutral" | "status";

interface SidebarProps {
  palettes: Palettes;
  overrides: RoleOverrides;
  activeRole: RoleKey;
  sideTab: SideTab;
  harmony: HarmonyKey;
  hasSecondary: boolean;
  hasTertiary: boolean;
  neutralTint: number;
  onSideTab: (tab: SideTab) => void;
  onSelectRole: (role: RoleKey) => void;
  onSetSeed: (role: RoleKey, hex: string) => void;
  onAddSecondary: () => void;
  onRemoveSecondary: () => void;
  onAddTertiary: () => void;
  onRemoveTertiary: () => void;
  onResetRole: (role: RoleKey) => void;
  onNeutralTint: (value: number) => void;
  onRandom: () => void;
  onHarmony: (key: HarmonyKey) => void;
}

function LockBadge({ locked, onReset }: { locked: boolean; onReset: () => void }) {
  if (!locked) {
    return (
      <span className="lock-badge is-auto" title="Follows the selected color harmony">
        <Icon icon={Link01Icon} size={11} /> Auto
      </span>
    );
  }
  return (
    <button className="lock-badge is-locked" onClick={onReset} title="Manually set — click to reset to harmony">
      <Icon icon={SquareLock02Icon} size={11} /> Manual
    </button>
  );
}

export function Sidebar({
  palettes,
  overrides,
  activeRole,
  sideTab,
  harmony,
  hasSecondary,
  hasTertiary,
  neutralTint,
  onSideTab,
  onSelectRole,
  onSetSeed,
  onAddSecondary,
  onRemoveSecondary,
  onAddTertiary,
  onRemoveTertiary,
  onResetRole,
  onNeutralTint,
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

  const wheelDots = [
    { key: "Primary", hue: hueOf(palettes.primary.seedHex), color: palettes.primary.seedHex },
    ...(hasSecondary ? [{ key: "Secondary", hue: hueOf(palettes.secondary.seedHex), color: palettes.secondary.seedHex }] : []),
    ...(hasTertiary ? [{ key: "Tertiary", hue: hueOf(palettes.tertiary.seedHex), color: palettes.tertiary.seedHex }] : []),
  ];

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
                <LockBadge locked={Boolean(overrides.secondary)} onReset={() => onResetRole("secondary")} />
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

          {hasTertiary ? (
            <>
              <div className="side-label-row">
                <span className="side-label">Tertiary</span>
                <LockBadge locked={Boolean(overrides.tertiary)} onReset={() => onResetRole("tertiary")} />
              </div>
              <ColorField
                role="tertiary"
                hex={palettes.tertiary.seedHex}
                active={activeRole === "tertiary"}
                format={format}
                onSelect={() => onSelectRole("tertiary")}
                onChange={(hex) => onSetSeed("tertiary", hex)}
                onRemove={onRemoveTertiary}
              />
            </>
          ) : (
            <button className="wide-pill" onClick={onAddTertiary}>
              <span className="wide-pill-icon"><Icon icon={Add01Icon} size={17} /></span> Add tertiary color scale
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
            <div className="harmony-panel">
              <HueWheel dots={wheelDots} />
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
              <p className="side-note">
                Unlocked roles (marked <strong>Auto</strong>) recompute from this harmony whenever the primary or mode
                changes. Edit a color directly to lock it — click <strong>Manual</strong> to release it back to harmony.
              </p>
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
          <LockBadge locked={Boolean(overrides.neutral)} onReset={() => onResetRole("neutral")} />
          {!overrides.neutral && (
            <div className="side-tint-row">
              <span className="side-label side-label-sm">Tint strength</span>
              <input
                type="range"
                className="cf-slider"
                min={0}
                max={100}
                value={Math.round(neutralTint * 100)}
                onChange={(event) => onNeutralTint(Number(event.target.value) / 100)}
              />
            </div>
          )}
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
                <LockBadge locked={Boolean(overrides[role])} onReset={() => onResetRole(role)} />
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
          <p className="side-note">
            Status hues stay in their green / amber / red families but inherit your brand's chroma and lightness, with
            contrast auto-checked against white and black text.
          </p>
        </div>
      )}

    </aside>
  );
}
