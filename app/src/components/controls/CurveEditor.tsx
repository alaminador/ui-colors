import { PointerEvent as ReactPointerEvent, useCallback, useMemo, useRef } from "react";
import { toneCurve } from "../../lib/adjustments";

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

interface CurveEditorProps {
  /** Control-point position, 0..1 in curve space (0.5,0.5 = linear). */
  cx: number;
  cy: number;
  /** Optional ramp painted behind the grid to preview the tone the curve maps. */
  rampFill?: string;
  onChange: (cx: number, cy: number) => void;
  onCommit?: () => void;
}

const SIZE = 100; // SVG user-units; the box is square and scales to its container.

// A single-control-point tone curve. The X axis is tone-in (dark→light), the Y
// axis is tone-out; dragging the handle bows the response, exactly like the
// Curves panel in an image editor. Output is sampled through the same
// `toneCurve` the palette engine uses, so the drawn curve matches the result.
export function CurveEditor({ cx, cy, rampFill, onChange, onCommit }: CurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const path = useMemo(() => {
    const steps = 24;
    const points: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const y = toneCurve(t, cx, cy);
      points.push(`${(t * SIZE).toFixed(2)},${((1 - y) * SIZE).toFixed(2)}`);
    }
    return `M ${points.join(" L ")}`;
  }, [cx, cy]);

  const setFromEvent = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const el = svgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = clamp01((event.clientX - rect.left) / rect.width);
      const ny = clamp01(1 - (event.clientY - rect.top) / rect.height);
      onChange(Number(nx.toFixed(3)), Number(ny.toFixed(3)));
    },
    [onChange]
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragging.current = true;
      setFromEvent(event);
    },
    [setFromEvent]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (dragging.current) setFromEvent(event);
    },
    [setFromEvent]
  );

  const onPointerUp = useCallback(() => {
    if (dragging.current) onCommit?.();
    dragging.current = false;
  }, [onCommit]);

  const hx = cx * SIZE;
  const hy = (1 - cy) * SIZE;

  return (
    <svg
      ref={svgRef}
      className="tc-curve"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      preserveAspectRatio="none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="application"
      aria-label="Tone curve"
    >
      {rampFill && <rect x={0} y={0} width={SIZE} height={SIZE} fill={rampFill} opacity={0.16} />}
      {[25, 50, 75].map((g) => (
        <g key={g} className="tc-curve-grid">
          <line x1={g} y1={0} x2={g} y2={SIZE} />
          <line x1={0} y1={g} x2={SIZE} y2={g} />
        </g>
      ))}
      <line className="tc-curve-diagonal" x1={0} y1={SIZE} x2={SIZE} y2={0} />
      <path className="tc-curve-path" d={path} />
      <line className="tc-curve-arm" x1={hx} y1={hy} x2={hx} y2={hy} />
      <circle className="tc-curve-handle" cx={hx} cy={hy} r={5.5} />
    </svg>
  );
}
