import { useHex } from "../context";
import { contrastText } from "../lib/color";

export function ComponentsTab() {
  const hex = useHex();
  const p500 = hex("primary", 500);
  const p600 = hex("primary", 600);
  const onPrimary = contrastText(p500);

  return (
    <div className="tab-stack components">
      <section className="comp-section">
        <h3>Buttons</h3>
        <div className="comp-row">
          <button className="btn-md" style={{ background: p500, color: onPrimary }}>Primary</button>
          <button className="btn-md" style={{ background: hex("primary", 100), color: hex("primary", 900) }}>Soft</button>
          <button className="btn-md" style={{ background: "transparent", color: p500, border: `1px solid ${p500}` }}>Outline</button>
          <button className="btn-md" style={{ background: "transparent", color: hex("primary", 300) }}>Ghost</button>
          <button className="btn-md" style={{ background: hex("error", 600), color: "#fff" }}>Destructive</button>
          <button className="btn-md" style={{ background: p600, color: onPrimary, opacity: 0.5 }} disabled>Disabled</button>
          <button className="btn-sm" style={{ background: p500, color: onPrimary }}>Small</button>
          <button className="btn-lg" style={{ background: p500, color: onPrimary }}>Large</button>
        </div>
      </section>

      <section className="comp-section">
        <h3>Badges</h3>
        <div className="comp-row">
          {(["primary", "secondary", "tertiary", "success", "warning", "error"] as const).map((role) => (
            <span key={role} className="badge" style={{ background: hex(role, 100), color: hex(role, 800) }}>
              {role}
            </span>
          ))}
          {(["primary", "secondary", "success", "error"] as const).map((role) => (
            <span key={`solid-${role}`} className="badge" style={{ background: hex(role, 600), color: "#fff" }}>
              {role}
            </span>
          ))}
        </div>
      </section>

      <section className="comp-section">
        <h3>Inputs</h3>
        <div className="comp-row comp-inputs">
          <input className="input" placeholder="Email address" style={{ borderColor: hex("neutral", 300) }} />
          <input className="input is-focus" placeholder="Focused input" style={{ borderColor: p500, boxShadow: `0 0 0 3px ${hex("primary", 200)}` }} />
          <input className="input is-error" placeholder="Invalid value" style={{ borderColor: hex("error", 500), boxShadow: `0 0 0 3px ${hex("error", 100)}` }} />
          <div className="select" style={{ borderColor: hex("neutral", 300) }}>Monthly <span>▾</span></div>
        </div>
      </section>

      <section className="comp-section">
        <h3>Selection controls</h3>
        <div className="comp-row">
          <label className="control"><span className="checkbox is-checked" style={{ background: p500, borderColor: p500 }}>✓</span> Checked</label>
          <label className="control"><span className="checkbox" style={{ borderColor: hex("neutral", 400) }} /> Unchecked</label>
          <label className="control"><span className="radio is-checked" style={{ borderColor: p500 }}><i style={{ background: p500 }} /></span> Selected</label>
          <label className="control"><span className="radio" style={{ borderColor: hex("neutral", 400) }} /> Option</label>
          <span className="switch is-on" style={{ background: p500 }}><i /></span>
          <span className="switch" style={{ background: hex("neutral", 300) }}><i /></span>
          <div className="slider" style={{ background: hex("neutral", 200) }}>
            <span className="slider-fill" style={{ background: p500 }} />
            <span className="slider-thumb" style={{ borderColor: p500 }} />
          </div>
        </div>
      </section>

      <section className="comp-section">
        <h3>Alerts</h3>
        <div className="alert-stack">
          {(
            [
              { role: "primary", icon: "ℹ", title: "Heads up", body: "A new version of the design tokens is available." },
              { role: "success", icon: "✓", title: "Payment complete", body: "Your invoice was paid successfully." },
              { role: "warning", icon: "⚠", title: "Storage almost full", body: "You have used 92% of the included storage." },
              { role: "error", icon: "✕", title: "Connection failed", body: "We could not reach the sync server. Retry in a moment." },
            ] as const
          ).map((alert) => (
            <div key={alert.role} className="alert" style={{ background: hex(alert.role, 50), borderColor: hex(alert.role, 200), color: hex(alert.role, 900) }}>
              <span className="alert-icon" style={{ background: hex(alert.role, 600), color: "#fff" }}>{alert.icon}</span>
              <div>
                <strong>{alert.title}</strong>
                <p style={{ color: hex(alert.role, 800) }}>{alert.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="comp-section">
        <h3>Progress &amp; avatars</h3>
        <div className="comp-row">
          <div className="progress" style={{ background: hex("neutral", 200) }}>
            <span style={{ width: "68%", background: p500 }} />
          </div>
          <div className="progress" style={{ background: hex("neutral", 200) }}>
            <span style={{ width: "34%", background: hex("secondary", 500) }} />
          </div>
          <div className="avatar-stack">
            {[300, 400, 500, 600, 700].map((stop) => (
              <span key={stop} style={{ background: `linear-gradient(140deg, ${hex("primary", stop)}, ${hex("secondary", stop)})` }} />
            ))}
            <span className="avatar-more" style={{ background: hex("neutral", 200), color: hex("neutral", 700) }}>+3</span>
          </div>
        </div>
      </section>

      <section className="comp-section">
        <h3>Navigation</h3>
        <div className="comp-row">
          <div className="seg" style={{ background: hex("neutral", 100) }}>
            <button className="is-active" style={{ background: "#fff", color: hex("neutral", 900) }}>Overview</button>
            <button style={{ color: hex("neutral", 500) }}>Analytics</button>
            <button style={{ color: hex("neutral", 500) }}>Reports</button>
          </div>
          <div className="pagination">
            {["‹", "1", "2", "3", "…", "12", "›"].map((page, index) => (
              <button
                key={index}
                style={
                  page === "2"
                    ? { background: p500, color: onPrimary }
                    : { background: "transparent", color: hex("neutral", 600) }
                }
              >
                {page}
              </button>
            ))}
          </div>
          <span className="breadcrumbs" style={{ color: hex("neutral", 500) }}>
            Home <em>/</em> Library <em>/</em> <strong style={{ color: hex("primary", 700) }}>Palettes</strong>
          </span>
        </div>
      </section>
    </div>
  );
}
