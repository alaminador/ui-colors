import { Add01Icon, ArrowDown01Icon, ArrowUp01Icon, Briefcase01Icon, MetroIcon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { useHex } from "../context";
import { Icon } from "../components/Icon";
import { BarChart, Sparkline } from "../components/charts";
import { contrastText } from "../lib/color";

export function AppsTab() {
  const hex = useHex();
  const accent = hex("primary", 500);
  const onAccent = contrastText(accent);

  return (
    <div className="apps-grid">
      <div className="phone-frame">
        <div
          className="phone-view"
          style={{ background: `linear-gradient(170deg, ${hex("primary", 100)}, ${hex("primary", 300)})`, color: hex("primary", 950) }}
        >
          <div className="phone-status">9:41 <span>●●●</span></div>
          <div className="onboard">
            <span className="pill-tag" style={{ background: hex("primary", 500), color: onAccent }}>New</span>
            <h3>Money, made calm.</h3>
            <p>Budgets, insights and savings that adapt to how you actually spend.</p>
            <div className="onboard-shapes">
              <span style={{ background: hex("primary", 400) }} />
              <span style={{ background: hex("primary", 600) }} />
              <span style={{ background: hex("secondary", 400) }} />
            </div>
            <button style={{ background: hex("primary", 950), color: "#fff" }}>Get started</button>
            <em>Already have an account? <strong>Sign in</strong></em>
          </div>
        </div>
        <span className="phone-caption">Onboarding</span>
      </div>

      <div className="phone-frame">
        <div className="phone-view" style={{ background: hex("neutral", 950), color: "#fff" }}>
          <div className="phone-status">9:41 <span>●●●</span></div>
          <div className="wallet">
            <em>Total balance</em>
            <strong>$8,214.90</strong>
            <div className="wallet-card" style={{ background: `linear-gradient(140deg, ${hex("primary", 500)}, ${hex("primary", 800)})`, color: "#fff" }}>
              <span>Forward Card</span>
              <b>•••• 4821</b>
            </div>
            <div className="wallet-actions">
              {[
                { label: "Send", icon: ArrowUp01Icon },
                { label: "Request", icon: ArrowDown01Icon },
                { label: "Top up", icon: Add01Icon },
              ].map((action, index) => (
                <span
                  key={action.label}
                  style={
                    index === 0
                      ? { background: accent, color: onAccent }
                      : { background: "rgba(255,255,255,0.08)" }
                  }
                >
                  <Icon icon={action.icon} size={12} /> {action.label}
                </span>
              ))}
            </div>
            <em>Today</em>
            <ul className="wallet-list">
              {[
                { name: "Whole Foods", amount: "-$64.20", role: "primary" as const, icon: ShoppingCart01Icon },
                { name: "Salary", amount: "+$3,200", role: "success" as const, icon: Briefcase01Icon },
                { name: "Metro card", amount: "-$32.00", role: "secondary" as const, icon: MetroIcon },
              ].map((row) => (
                <li key={row.name}>
                  <span className="cat-icon" style={{ background: hex(row.role, 200), color: hex(row.role, 900) }}><Icon icon={row.icon} size={13} /></span>
                  <p>{row.name}</p>
                  <b style={{ color: row.amount.startsWith("+") ? hex("success", 400) : "#fff" }}>{row.amount}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className="phone-caption">Wallet</span>
      </div>

      <div className="phone-frame">
        <div className="phone-view" style={{ background: "#ffffff", color: hex("neutral", 900) }}>
          <div className="phone-status" style={{ color: hex("neutral", 500) }}>9:41 <span>●●●</span></div>
          <div className="stats-screen">
            <em style={{ color: hex("neutral", 500) }}>June spending</em>
            <strong>$2,830</strong>
            <span className="delta" style={{ background: hex("success", 100), color: hex("success", 700) }}>▼ 12% vs May</span>
            <BarChart
              values={[0.45, 0.7, 0.5, 0.85, 0.6, 0.4, 0.75]}
              colors={[hex("primary", 500), hex("primary", 300)]}
              labels={["M", "T", "W", "T", "F", "S", "S"]}
              labelColor={hex("neutral", 400)}
              height={110}
            />
            <div className="stats-cats">
              {[
                { name: "Food", value: "$820", role: "primary" as const },
                { name: "Transport", value: "$310", role: "secondary" as const },
                { name: "Fun", value: "$275", role: "tertiary" as const },
              ].map((cat) => (
                <div key={cat.name} style={{ background: hex(cat.role, 50), color: hex(cat.role, 900) }}>
                  <em>{cat.name}</em>
                  <b>{cat.value}</b>
                  <Sparkline values={[0.4, 0.6, 0.35, 0.7, 0.5]} color={hex(cat.role, 500)} height={28} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="phone-caption">Insights</span>
      </div>
    </div>
  );
}
