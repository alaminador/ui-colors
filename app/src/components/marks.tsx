// Shared fictional brand marks used across the example tabs.

interface MarkProps {
  color: string;
  size?: number;
}

export function ForwardMark({ color, size = 26 }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M3 4 L11 12 L3 20 Z" fill={color} />
      <path d="M12 4 L20 12 L12 20 Z" fill={color} />
    </svg>
  );
}

export function BerryMark({ color, size = 26 }: MarkProps) {
  const positions = [
    [12, 4], [19, 8], [19, 16], [12, 20], [5, 16], [5, 8], [12, 12],
  ];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {positions.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="3.4" fill={color} />
      ))}
    </svg>
  );
}

export function ArcMark({ color, size = 34 }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M4 20 A8 8 0 0 1 20 20" fill="none" stroke={color} strokeWidth="4.4" strokeLinecap="round" />
      <circle cx="12" cy="7" r="3.2" fill={color} />
    </svg>
  );
}

export function HexMark({ color, size = 34 }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" fill={color} />
      <circle cx="12" cy="12" r="3.4" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

export function GridMark({ color, size = 34 }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="3" width="8.5" height="8.5" rx="2.4" fill={color} />
      <rect x="12.5" y="3" width="8.5" height="8.5" rx="2.4" fill={color} opacity="0.62" />
      <rect x="3" y="12.5" width="8.5" height="8.5" rx="2.4" fill={color} opacity="0.62" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="2.4" fill={color} />
    </svg>
  );
}

export function Wordmark({ color, dark }: { color: string; dark?: boolean }) {
  return (
    <span className="wordmark" style={{ color: dark ? "#111" : "#fff" }}>
      <ForwardMark color={color} size={20} />
      Forward
    </span>
  );
}
