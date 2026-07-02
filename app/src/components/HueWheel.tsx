export interface HueWheelDot {
  key: string;
  hue: number;
  color: string;
}

export function HueWheel({ dots, size = 96 }: { dots: HueWheelDot[]; size?: number }) {
  const radius = size / 2 - 9;
  const center = size / 2;

  return (
    <div className="hue-wheel" style={{ width: size, height: size }}>
      <div className="hue-wheel-ring" />
      {dots.map((dot) => {
        const angle = ((dot.hue - 90) * Math.PI) / 180;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <span
            key={dot.key}
            className="hue-wheel-dot"
            style={{ left: x, top: y, background: dot.color }}
            title={dot.key}
          />
        );
      })}
    </div>
  );
}
