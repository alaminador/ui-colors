import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { contrastText } from "../lib/color";
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
        {palette.colors.map(({ stop, hex }) => (
          <button
            key={stop}
            className="swatch"
            style={{ background: hex, color: contrastText(hex) }}
            onClick={() => onCopy(hex, `${hex.toUpperCase()} copied`)}
            title={`Copy ${hex}`}
          >
            {stop === palette.anchor && <span className="swatch-anchor" />}
            <span className="swatch-stop">{stop}</span>
            <span className="swatch-hex">{hex.replace("#", "").toUpperCase()}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
