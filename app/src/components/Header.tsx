import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { apcaLc, contrastText } from "../lib/color";
import { Palettes, RoleKey } from "../lib/palette";
import { ModalKey } from "../App";
import { Icon } from "./Icon";

interface HeaderProps {
  palettes: Palettes;
  activeRole: RoleKey;
  onOpenModal: (modal: ModalKey) => void;
  onCopy: (text: string, label?: string) => void;
  onSave: () => void;
}

export function Header({ palettes, activeRole, onOpenModal, onCopy, onSave }: HeaderProps) {
  const palette = palettes[activeRole];
  return (
    <header className="site-header">
      <div className="header-row">
        <span className="palette-eyebrow">Palette 1</span>
        <button className="btn btn-ghost" onClick={onSave}>
          <Icon icon={FavouriteIcon} size={15} /> Save
        </button>
      </div>
      <div className="header-row">
        <div className="palette-title">
          <h1>{palette.familyName}</h1>
          <span className="role-badge">{palette.roleLabel}</span>
        </div>
        <div className="header-actions">
          <button className="text-action" onClick={() => onOpenModal("matrix")}>Contrast matrix</button>
          <button className="text-action" onClick={() => onOpenModal("info")}>Color info</button>
          <button className="text-action" onClick={() => onOpenModal("export")}>Export</button>
        </div>
      </div>
      <div className="swatch-strip">
        {palette.colors.map(({ stop, hex }) => {
          const lcWhite = Math.round(Math.abs(apcaLc("#ffffff", hex)));
          const lcBlack = Math.round(Math.abs(apcaLc("#000000", hex)));
          return (
            <button
              key={stop}
              className="swatch"
              style={{ background: hex, color: contrastText(hex) }}
              onClick={() => onCopy(hex, `${hex.toUpperCase()} copied`)}
              title={`Copy ${hex} · APCA white text ${lcWhite}, black text ${lcBlack} (60+ = body text)`}
            >
              {stop === palette.anchor && <span className="swatch-anchor" />}
              <span className="swatch-stop">{stop}</span>
              <span className="swatch-hex">{hex.replace("#", "").toUpperCase()}</span>
              <span className="swatch-apca">
                <i style={{ background: "#ffffff", opacity: lcWhite >= 60 ? 1 : 0.22 }} />
                <i style={{ background: "#000000", opacity: lcBlack >= 60 ? 1 : 0.22 }} />
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
