interface BarChartProps {
  values: number[];
  colors: string[];
  height?: number;
  gap?: number;
  radius?: number;
  labels?: string[];
  labelColor?: string;
}

export function BarChart({ values, colors, height = 140, gap = 10, radius = 4, labels, labelColor = "var(--ex-muted)" }: BarChartProps) {
  const width = 320;
  const labelSpace = labels ? 18 : 0;
  const chartHeight = height - labelSpace;
  const barWidth = (width - gap * (values.length - 1)) / values.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {values.map((value, index) => (
        <rect
          key={index}
          x={index * (barWidth + gap)}
          y={chartHeight - value * chartHeight}
          width={barWidth}
          height={value * chartHeight}
          rx={radius}
          fill={colors[index % colors.length]}
        />
      ))}
      {labels &&
        labels.map((label, index) => (
          <text
            key={label + index}
            x={index * (barWidth + gap) + barWidth / 2}
            y={height - 4}
            textAnchor="middle"
            fontSize="9"
            fill={labelColor}
          >
            {label}
          </text>
        ))}
    </svg>
  );
}

interface LineChartProps {
  series: { color: string; values: number[]; fill?: boolean }[];
  height?: number;
  strokeWidth?: number;
}

export function LineChart({ series, height = 150, strokeWidth = 2.5 }: LineChartProps) {
  const width = 320;
  const points = (values: number[]) =>
    values.map((value, index) => [
      (index / (values.length - 1)) * width,
      height - 8 - value * (height - 20),
    ]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {series.map((line, index) => {
        const pts = points(line.values);
        const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
        return (
          <g key={index}>
            {line.fill && (
              <path
                d={`${path} L${width},${height} L0,${height} Z`}
                fill={line.color}
                opacity="0.14"
              />
            )}
            <path d={path} fill="none" stroke={line.color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

interface DonutProps {
  segments: { color: string; value: number }[];
  size?: number;
  thickness?: number;
  label?: string;
  labelColor?: string;
  sublabel?: string;
}

export function Donut({ segments, size = 150, thickness = 16, label, labelColor = "var(--ex-ink)", sublabel }: DonutProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, height: "auto", display: "block" }}>
      {segments.map((segment, index) => {
        const fraction = segment.value / total;
        const dash = fraction * circumference;
        const element = (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash - 3} ${circumference - dash + 3}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return element;
      })}
      {label && (
        <text x={size / 2} y={sublabel ? size / 2 : size / 2 + 6} textAnchor="middle" fontSize="19" fontWeight="700" fill={labelColor}>
          {label}
        </text>
      )}
      {sublabel && (
        <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize="9" fill={labelColor} opacity="0.6">
          {sublabel}
        </text>
      )}
    </svg>
  );
}

export function Sparkline({ values, color, height = 44 }: { values: number[]; color: string; height?: number }) {
  const width = 120;
  const pts = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    height - 4 - value * (height - 8),
  ]);
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <path d={`${path} L${width},${height} L0,${height} Z`} fill={color} opacity="0.18" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
