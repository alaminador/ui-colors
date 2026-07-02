import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";
import { RolePalette, paletteInfoRows } from "../lib/palette";

interface InfoModalProps {
  palette: RolePalette;
  onClose: () => void;
  onCopy: (text: string, label?: string) => void;
}

export function InfoModal({ palette, onClose, onCopy }: InfoModalProps) {
  const rows = paletteInfoRows(palette);
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-header">
        <div className="modal-title">
          Color info · <span>{palette.roleLabel} · {palette.familyName}</span>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Close color info"><Icon icon={Cancel01Icon} size={18} /></button>
      </div>
      <div className="modal-body info-body">
        <div className="info-table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>#</th>
                <th>APCA on white</th>
                <th>APCA on black</th>
                <th>WCAG on white</th>
                <th>WCAG on black</th>
                <th>OKLCH</th>
                <th>Hexcode</th>
                <th>HSL</th>
                <th>RGB</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.stop}>
                  <td>
                    <span className="shade-chip">
                      <span className="shade-dot" style={{ background: row.hex }} />
                      {row.stop}
                    </span>
                  </td>
                  <td className="copyable" onClick={() => onCopy(String(row.apcaWhite))}>{row.apcaWhite}</td>
                  <td className="copyable" onClick={() => onCopy(String(row.apcaBlack))}>{row.apcaBlack}</td>
                  <td className="copyable" onClick={() => onCopy(`${row.wcagWhite}:1`)}>{row.wcagWhite}:1</td>
                  <td className="copyable" onClick={() => onCopy(`${row.wcagBlack}:1`)}>{row.wcagBlack}:1</td>
                  <td className="copyable" onClick={() => onCopy(row.oklch)}>{row.oklch}</td>
                  <td className="copyable" onClick={() => onCopy(row.hex)}>{row.hex}</td>
                  <td className="copyable" onClick={() => onCopy(row.hsl)}>{row.hsl}</td>
                  <td className="copyable" onClick={() => onCopy(row.rgb)}>{row.rgb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
