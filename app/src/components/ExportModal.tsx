import { Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";
import { useState } from "react";
import { ExportFormat, Palettes, RolePalette, exportFormats, exportText } from "../lib/palette";

interface ExportModalProps {
  palettes: Palettes;
  palette: RolePalette;
  onClose: () => void;
  onCopy: (text: string, label?: string) => void;
}

const fileMeta: Partial<Record<ExportFormat, { name: string; mime: string }>> = {
  Figma: { name: "palette.tokens.json", mime: "application/json" },
  CSS: { name: "palette.css", mime: "text/css" },
  Tailwind: { name: "tailwind-colors.txt", mime: "text/plain" },
};

export function ExportModal({ palettes, palette, onClose, onCopy }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("CSS");
  const text = exportText(palettes, palette, format);
  const meta = fileMeta[format];

  const download = () => {
    if (!meta) return;
    const blob = new Blob([text], { type: meta.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = meta.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-header">
        <div className="modal-title">
          Export · <span>{palette.roleLabel} · {palette.familyName}</span>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Close export"><Icon icon={Cancel01Icon} size={18} /></button>
      </div>
      <div className="modal-body info-body">
        <div className="info-toolbar">
          {exportFormats.map((item) => (
            <button
              key={item}
              className={`format-button ${item === format ? "is-active" : ""}`}
              onClick={() => setFormat(item)}
            >
              {item === "Figma" ? "Figma variables" : item}
            </button>
          ))}
          <button className="btn btn-primary" onClick={() => onCopy(text, `${format} copied`)}>
            Copy
          </button>
          {meta && (
            <button className="btn btn-ghost" onClick={download}>
              <Icon icon={Download01Icon} size={15} /> Download {meta.name}
            </button>
          )}
        </div>
        {format === "Figma" && (
          <p className="export-hint">
            Import in Figma via <strong>Variables → ⋯ → Import variables</strong>. Every role scale becomes a variable group
            (Primary/50…950, Secondary, Neutral, Success…), matching Figma's native .tokens.json export format.
          </p>
        )}
        <pre className="export-box" onClick={() => onCopy(text, `${format} copied`)} title="Click to copy">
          {text}
        </pre>
      </div>
    </div>
  );
}
