import { PointerEvent as ReactPointerEvent, useCallback, useRef } from "react";

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function quantize(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(6))));
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Formats the numeric badge; defaults to the raw value. */
  format?: (value: number) => string;
  /** Optional CSS background painted on the track (e.g. a hue or tone ramp). */
  trackFill?: string;
  onChange: (value: number) => void;
}

// Precise design-tool slider: a thin track with a value-badge readout, driven by
// pointer events so drags stay smooth and clicks jump-to-position.
export function Slider({ label, value, min, max, step = 1, format, trackFill, onChange }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = clamp01((value - min) / (max - min));

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = clamp01((clientX - rect.left) / rect.width);
      onChange(quantize(min + ratio * (max - min), min, max, step));
    },
    [min, max, step, onChange]
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setFromClientX(event.clientX);
    },
    [setFromClientX]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromClientX(event.clientX);
    },
    [setFromClientX]
  );

  return (
    <div className="tc-slider">
      <div className="tc-slider-head">
        <span className="tc-slider-label">{label}</span>
        <span className="tc-slider-value">{format ? format(value) : value}</span>
      </div>
      <div
        ref={trackRef}
        className="tc-slider-track"
        style={trackFill ? { background: trackFill } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
      >
        <span className="tc-slider-fill" style={{ width: `${pct * 100}%` }} />
        <span className="tc-slider-thumb" style={{ left: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

interface RangeSliderProps {
  label: string;
  low: number;
  high: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  trackFill?: string;
  onChange: (low: number, high: number) => void;
}

// Dual-handle range slider (e.g. an input range or a lightness band). Either
// handle can be dragged; they can't cross.
export function RangeSlider({ label, low, high, min, max, step = 1, format, trackFill, onChange }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeHandle = useRef<"low" | "high" | null>(null);
  const lowPct = clamp01((low - min) / (max - min));
  const highPct = clamp01((high - min) / (max - min));

  const valueAt = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const ratio = clamp01((clientX - rect.left) / rect.width);
      return quantize(min + ratio * (max - min), min, max, step);
    },
    [min, max, step]
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const v = valueAt(event.clientX);
      activeHandle.current = Math.abs(v - low) <= Math.abs(v - high) ? "low" : "high";
      if (activeHandle.current === "low") onChange(Math.min(v, high), high);
      else onChange(low, Math.max(v, low));
    },
    [valueAt, low, high, onChange]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId) || !activeHandle.current) return;
      const v = valueAt(event.clientX);
      if (activeHandle.current === "low") onChange(Math.min(v, high), high);
      else onChange(low, Math.max(v, low));
    },
    [valueAt, low, high, onChange]
  );

  const onPointerUp = useCallback(() => {
    activeHandle.current = null;
  }, []);

  return (
    <div className="tc-slider">
      <div className="tc-slider-head">
        <span className="tc-slider-label">{label}</span>
        <span className="tc-slider-value">
          {format ? format(low) : low} – {format ? format(high) : high}
        </span>
      </div>
      <div
        ref={trackRef}
        className="tc-slider-track"
        style={trackFill ? { background: trackFill } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="tc-slider-fill" style={{ left: `${lowPct * 100}%`, width: `${(highPct - lowPct) * 100}%` }} />
        <span className="tc-slider-thumb" style={{ left: `${lowPct * 100}%` }} />
        <span className="tc-slider-thumb" style={{ left: `${highPct * 100}%` }} />
      </div>
    </div>
  );
}
