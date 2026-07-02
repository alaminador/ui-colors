import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";

export type View = "generate" | "palettes" | "tailwind";

interface TopNavProps {
  view: View;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onNavigate: (view: View) => void;
}

export function TopNav({ view, theme, onToggleTheme, onNavigate }: TopNavProps) {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="brand-home" onClick={() => onNavigate("generate")}>
          <span className="brand-mark">UI</span>
          <span className="brand-name">Colors</span>
        </button>
        <nav className="topnav-links">
          <a className={view === "generate" ? "is-active" : ""} onClick={() => onNavigate("generate")}>Generate</a>
          <a className={view === "palettes" ? "is-active" : ""} onClick={() => onNavigate("palettes")}>My palettes</a>
          <a className={view === "tailwind" ? "is-active" : ""} onClick={() => onNavigate("tailwind")}>Tailwind Colors</a>
        </nav>
      </div>
      <div className="topnav-right">
        <button className="icon-btn" title="Toggle theme" aria-label="Toggle theme" onClick={onToggleTheme}>
          <Icon icon={theme === "dark" ? Sun01Icon : Moon02Icon} size={17} />
        </button>
      </div>
    </header>
  );
}
