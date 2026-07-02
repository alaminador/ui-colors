import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";

interface IconProps {
  icon: IconSvgElement;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ icon, size = 18, strokeWidth = 1.8, className }: IconProps) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={`hg-icon ${className ?? ""}`} />;
}
