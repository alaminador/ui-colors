import { PointerEvent as ReactPointerEvent, useCallback, useMemo, useRef, useState } from "react";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "../Icon";
import { Slider } from "./Slider";

export type GradientType = "linear" | "radial" | "conic";

export interface GradientStop {
  id: string;
  color: string;
  /** Position along the gradient, 0..100. */
  pos: number;
}

const gradientTypes: GradientType[] = ["linear", "radial", "conic"];

export function gradientCss(type: GradientType, angle: number, stops: GradientStop[]): string {
  const ordered = [...stops].sort((a, b) => a.pos - b.pos);
  const list = ordered.map((s) => `${s.color} ${Math.round(s.pos)}%`).join(", ");
  if (type === "radial") return `radial-gradient(circle at 30% 30%, ${list})`;
  if (type === "conic") return `conic-gradient(from ${angle}deg at 50% 50%, ${list})`;
  return `linear-gradient(${angle}deg, ${list})`;
}

interface GradientEditorProps {
  stops: GradientStop[];
  type: GradientType;
  angle: number;
  /** Swatches the user can click to recolor the selected stop. */
  swatches: string[];
  onChange: (next: { stops: GradientStop[]; type: GradientType; angle: number }) => void;
  onCopy: (css: string) => void;
}

// Interactive gradient builder: drag stops along the bar, click the bar to add a
// stop, recolor the selected stop from the palette swatches, and tune the type
// and angle. Emits ready-to-paste CSS.
export function GradientEditor({ stops, type, angle, swatches, onChange, onCopy }: GradientEditorProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);
  const [selected, setSelected] = useState<string>(stops[0]?.id ?? "");

  const css = useMemo(() => gradientCss(type, angle, stops), [type, angle, stops]);
  const barCss = useMemo(() => gradientCss("linear", 90, stops), [stops]);

  const posFromClientX = useCallback((clientX: number): number => {
    const el = barRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const update = (next: Partial<{ stops: GradientStop[]; type: GradientType; angle: number }>) =>
    onChange({ stops, type, angle, ...next });

  const onStopDown = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragId.current = id;
    setSelected(id);
  };

  const onStopMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragId.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) {
      const pos = posFromClientX(event.clientX);
      update({ stops: stops.map((s) => (s.id === dragId.current ? { ...s, pos } : s)) });
    }
  };

  const onStopUp = () => {
    dragId.current = null;
  };

  const addStop = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pos = posFromClientX(event.clientX);
    const ordered = [...stops].sort((a, b) => a.pos - b.pos);
    const left = [...ordered].reverse().find((s) => s.pos <= pos) ?? ordered[0];
    const id = `stop-${Date.now()}`;
    update({ stops: [...stops, { id, color: left?.color ?? "#888888", pos }] });
    setSelected(id);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    update({ stops: stops.filter((s) => s.id !== id) });
    setSelected((current) => (current === id ? stops.find((s) => s.id !== id)!.id : current));
  };

  const recolor = (color: string) => {
    if (!selected) return;
    update({ stops: stops.map((s) => (s.id === selected ? { ...s, color } : s)) });
  };

  return (
    <div className="ge">
      <div className="ge-preview" style={{ background: css }} />

      <div className="ge-bar-row">
        <div ref={barRef} className="ge-bar" style={{ background: barCss }} onPointerDown={addStop}>
          {stops.map((stop) => (
            <button
              key={stop.id}
              className={`ge-stop ${stop.id === selected ? "is-active" : ""}`}
              style={{ left: `${stop.pos}%`, background: stop.color }}
              onPointerDown={(event) => onStopDown(event, stop.id)}
              onPointerMove={onStopMove}
              onPointerUp={onStopUp}
              onDoubleClick={() => removeStop(stop.id)}
              aria-label={`Stop at ${Math.round(stop.pos)}%`}
            />
          ))}
        </div>
      </div>
      <p className="ge-hint">Click the bar to add a stop · drag to move · double-click a stop to remove</p>

      <div className="ge-swatches">
        {swatches.map((color, index) => (
          <button
            key={`${color}-${index}`}
            className="ge-swatch"
            style={{ background: color }}
            onClick={() => recolor(color)}
            aria-label={`Set stop to ${color}`}
          />
        ))}
      </div>

      <div className="ge-controls">
        <div className="ge-types">
          {gradientTypes.map((item) => (
            <button
              key={item}
              className={`ge-type ${item === type ? "is-active" : ""}`}
              onClick={() => update({ type: item })}
            >
              {item}
            </button>
          ))}
        </div>
        {type !== "radial" && (
          <Slider
            label="Angle"
            value={angle}
            min={0}
            max={360}
            step={1}
            format={(v) => `${v}°`}
            onChange={(next) => update({ angle: next })}
          />
        )}
      </div>

      <div className="ge-actions">
        <button
          className="ge-add"
          onClick={() => {
            const id = `stop-${Date.now()}`;
            update({ stops: [...stops, { id, color: swatches[0] ?? "#888888", pos: 50 }] });
            setSelected(id);
          }}
        >
          <Icon icon={Add01Icon} size={14} /> Add stop
        </button>
        <button className="btn btn-primary ge-copy" onClick={() => onCopy(`background: ${css};`)}>
          Copy CSS
        </button>
      </div>

      <div className="ge-stop-list">
        {[...stops]
          .sort((a, b) => a.pos - b.pos)
          .map((stop) => (
            <div key={stop.id} className={`ge-stop-item ${stop.id === selected ? "is-active" : ""}`} onClick={() => setSelected(stop.id)}>
              <span className="ge-stop-chip" style={{ background: stop.color }} />
              <code>{stop.color}</code>
              <span className="ge-stop-pos">{Math.round(stop.pos)}%</span>
              {stops.length > 2 && (
                <button className="ge-stop-remove" onClick={(event) => { event.stopPropagation(); removeStop(stop.id); }} aria-label="Remove stop">
                  <Icon icon={Cancel01Icon} size={12} />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
