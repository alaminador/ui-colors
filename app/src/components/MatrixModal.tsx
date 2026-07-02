import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";
import { useState } from "react";
import { RolePalette, isPassingPair, matrixFilterOptions } from "../lib/palette";
import { apcaLc, wcagRatio, contrastText } from "../lib/color";

interface MatrixModalProps {
  palette: RolePalette;
  onClose: () => void;
  onCopy: (text: string, label?: string) => void;
}

export function MatrixModal({ palette, onClose, onCopy }: MatrixModalProps) {
  const [filter, setFilter] = useState("apca60");
  const activeOption = matrixFilterOptions.find((option) => option.id === filter);

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-header">
        <div className="modal-title">
          Contrast matrix · <span>{palette.roleLabel} · {palette.familyName}</span>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Close contrast matrix"><Icon icon={Cancel01Icon} size={18} /></button>
      </div>
      <div className="modal-body matrix-body">
        <aside className="matrix-sidebar">
          <h3>Guidelines</h3>
          <div className="filter-list">
            {matrixFilterOptions.map((option) => (
              <button
                key={option.id}
                className={`filter-button ${option.id === filter ? "is-active" : ""}`}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="filter-note">{activeOption?.note} Click any cell to copy the pairing.</p>
        </aside>
        <div className="matrix-panel">
          <div className="matrix-grid">
            <div className="matrix-label">fg/bg</div>
            {palette.colors.map((color) => (
              <div key={`h-${color.stop}`} className="matrix-label">{color.stop}</div>
            ))}
            {palette.colors.map((fg) => (
              <MatrixRow key={fg.stop} fg={fg} palette={palette} filter={filter} onCopy={onCopy} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixRow({
  fg,
  palette,
  filter,
  onCopy,
}: {
  fg: { stop: number; hex: string };
  palette: RolePalette;
  filter: string;
  onCopy: (text: string, label?: string) => void;
}) {
  return (
    <>
      <div className="matrix-label">{fg.stop}</div>
      {palette.colors.map((bg) => {
        const apca = apcaLc(fg.hex, bg.hex);
        const ratio = wcagRatio(fg.hex, bg.hex);
        const pass = isPassingPair(fg.hex, bg.hex, filter);
        return (
          <button
            key={bg.stop}
            className={`matrix-cell ${pass ? "is-pass" : ""}`}
            style={{ background: bg.hex, color: fg.hex, outlineColor: contrastText(bg.hex) }}
            onClick={() =>
              onCopy(
                `${fg.stop} ${fg.hex} on ${bg.stop} ${bg.hex} | APCA ${Math.round(apca)} | WCAG ${ratio.toFixed(2)}:1`,
                "Pairing copied"
              )
            }
          >
            <span className="matrix-score">{Math.round(Math.abs(apca))}</span>
            <span className="matrix-ratio">{ratio.toFixed(1)}:1</span>
          </button>
        );
      })}
    </>
  );
}
