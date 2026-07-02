import {
  Add01Icon,
  Alert01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CommandIcon,
  GithubIcon,
  InformationCircleIcon,
  Loading03Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  SentIcon,
  StarIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "../components/Icon";
import { useAccentPlan, useHex } from "../context";
import { Donut } from "../components/charts";
import { contrastText } from "../lib/color";

const calendarDays = [
  "", "", "", "1", "2", "3", "4",
  "5", "6", "7", "8", "9", "10", "11",
  "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30", "31", "",
];

const invoices = [
  { id: "INV-042", status: "Paid", amount: "$1,250" },
  { id: "INV-041", status: "Pending", amount: "$840" },
  { id: "INV-040", status: "Paid", amount: "$2,100" },
  { id: "INV-039", status: "Failed", amount: "$310" },
];

export function ShadcnTab() {
  const hex = useHex();
  const plan = useAccentPlan();
  const [chartA, chartB, chartC] = plan.chartRoles;
  const accent = hex(plan.ctaRole, 500);
  const onAccent = contrastText(accent);

  return (
    <div className="shadcn" style={{ background: "var(--ex-bg)", color: "var(--ex-ink)" }}>
      <div className="shadcn-cols">
        <div className="shadcn-col">
          <div className="sh-card sh-hero">
            <span className="sh-badge" style={{ background: `color-mix(in srgb, ${accent}, transparent 84%)`, color: hex(plan.ctaRole, 300) }}>
              <Icon icon={StarIcon} size={12} /> New components
            </span>
            <h2>Build your design system in minutes</h2>
            <em>Hundreds of blocks, one palette. Every element below is painted from your scales.</em>
            <div className="sh-actions">
              <button style={{ background: accent, color: onAccent }}>Get started <Icon icon={ArrowRight01Icon} size={13} /></button>
              <button className="sh-outline"><Icon icon={GithubIcon} size={14} /> Star on GitHub</button>
            </div>
          </div>

          <div className="sh-card">
            <strong>Create an account</strong>
            <em>Enter your email below to create your account</em>
            <button className="sh-outline sh-block-btn"><Icon icon={GithubIcon} size={14} /> Continue with GitHub</button>
            <div className="sh-divider"><span>or continue with</span></div>
            <label>Email<input placeholder="name@example.com" /></label>
            <label>Password<input type="password" placeholder="••••••••" /></label>
            <button style={{ background: accent, color: onAccent }}>Create account</button>
            <p className="sh-hint">By clicking continue, you agree to our Terms of Service.</p>
          </div>

          <div className="sh-card">
            <strong>Payment Method</strong>
            <em>All transactions are secure and encrypted</em>
            <div className="sh-grid2">
              <label>Card Number<input placeholder="1234 5678 9012 3456" /></label>
              <label>CVV<input placeholder="123" /></label>
            </div>
            <div className="sh-grid2">
              <label>Month<div className="sh-select">MM <span>▾</span></div></label>
              <label>Year<div className="sh-select">YYYY <span>▾</span></div></label>
            </div>
            <label className="sh-check">
              <span style={{ background: accent, borderColor: accent, color: onAccent }}><Icon icon={Tick02Icon} size={12} /></span>
              Same as shipping address
            </label>
            <div className="sh-actions">
              <button style={{ background: accent, color: onAccent }}>Submit</button>
              <button className="sh-outline">Cancel</button>
            </div>
          </div>

          <div className="sh-card">
            <strong>Frequently asked questions</strong>
            <div className="sh-faq">
              <div className="sh-faq-row is-open" style={{ borderColor: `color-mix(in srgb, ${accent}, transparent 60%)` }}>
                <div className="sh-faq-q">Is it accessible? <Icon icon={MinusSignIcon} size={13} /></div>
                <p>Yes. It adheres to the WAI-ARIA design pattern and every pairing is APCA-checked against your palette.</p>
              </div>
              <div className="sh-faq-row">
                <div className="sh-faq-q">Is it styled? <Icon icon={PlusSignIcon} size={13} /></div>
              </div>
              <div className="sh-faq-row">
                <div className="sh-faq-q">Can I use my own colors? <Icon icon={PlusSignIcon} size={13} /></div>
              </div>
            </div>
          </div>

          <div className="sh-card sh-quote">
            <div className="sh-avatar" style={{ background: `linear-gradient(140deg, ${hex(chartA, 400)}, ${hex(chartB, 600)})` }} />
            <p>"We swapped our hand-rolled tokens for this palette and shipped dark mode in a day."</p>
            <em>Sofia Davis · Design Engineer, Forward</em>
          </div>

          <div
            className="sh-card sh-cta"
            style={{ background: `linear-gradient(140deg, ${hex(plan.ctaRole, 600)}, ${hex(plan.ctaRole, 800)})` }}
          >
            <strong>Ready to ship?</strong>
            <em style={{ color: "rgba(255,255,255,0.75)" }}>Export this palette as CSS, Tailwind, or Figma variables.</em>
            <button style={{ background: "#ffffff", color: hex(plan.ctaRole, 800) }}>Export palette</button>
          </div>
        </div>

        <div className="shadcn-col">
          <div className="sh-card">
            <strong>This month</strong>
            <div className="sh-stat-grid">
              {[
                { label: "Revenue", value: "$45,231", note: "+20.1%", role: chartA },
                { label: "Subscriptions", value: "+2,350", note: "+180.1%", role: chartB },
                { label: "Sales", value: "+12,234", note: "+19%", role: chartC },
                { label: "Active now", value: "+573", note: "+201", role: chartA },
              ].map((stat) => (
                <div key={stat.label} className="sh-stat">
                  <em>{stat.label}</em>
                  <strong>{stat.value}</strong>
                  <span style={{ color: hex(stat.role, 400) }}>{stat.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sh-card sh-center">
            <div className="avatar-stack">
              {[300, 500, 700].map((stop) => (
                <span key={stop} style={{ background: `linear-gradient(140deg, ${hex(chartA, stop)}, ${hex(chartB, stop)})` }} />
              ))}
            </div>
            <strong>No Team Members</strong>
            <em>Invite your team to collaborate on this project.</em>
            <button style={{ background: accent, color: onAccent }}>+ Invite Members</button>
          </div>

          <div className="sh-chip-row">
            {["Syncing", "Updating", "Loading"].map((chip, index) => (
              <span
                key={chip}
                style={
                  index === 0
                    ? { background: accent, color: onAccent }
                    : { border: "1px solid var(--ex-line-strong)" }
                }
              >
                <Icon icon={Loading03Icon} size={13} /> {chip}
              </span>
            ))}
          </div>

          <div className="sh-input-row">
            <span className="sh-round"><Icon icon={Add01Icon} size={15} /></span>
            <div className="sh-message">Send a message… <em><Icon icon={SentIcon} size={14} /></em></div>
          </div>

          <div className="sh-card">
            <strong>Orders by channel</strong>
            <em>1 Jan, 2026 - 7 Jan, 2026</em>
            <div className="donut-wrap">
              <Donut
                segments={[
                  { color: hex(chartA, 400), value: 55 },
                  { color: hex(chartB, plan.spread === "tight" ? 600 : 400), value: 30 },
                  { color: hex(chartC, plan.spread === "tight" ? 800 : 300), value: 15 },
                ]}
                size={140}
              />
            </div>
          </div>

          <div className="sh-card">
            <strong>January 2026</strong>
            <div className="sh-cal">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="sh-cal-head">{day}</span>
              ))}
              {calendarDays.map((day, index) => (
                <span
                  key={index}
                  className="sh-cal-day"
                  style={
                    day === "14"
                      ? { background: accent, color: onAccent }
                      : day === "15" || day === "16"
                        ? { background: `color-mix(in srgb, ${accent}, transparent 82%)` }
                        : undefined
                  }
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="sh-card sh-cmd">
            <div className="sh-cmd-search"><Icon icon={Search01Icon} size={14} /> Type a command or search…</div>
            {[
              { icon: CommandIcon, label: "Command palette", kbd: "⌘K" },
              { icon: Search01Icon, label: "Search palettes", kbd: "⌘P" },
              { icon: Add01Icon, label: "New color scale", kbd: "⌘N" },
            ].map((row, index) => (
              <div
                key={row.label}
                className="sh-cmd-row"
                style={index === 0 ? { background: `color-mix(in srgb, ${accent}, transparent 85%)` } : undefined}
              >
                <Icon icon={row.icon} size={14} /> {row.label}
                <kbd>{row.kbd}</kbd>
              </div>
            ))}
          </div>

          <div className="sh-card">
            <strong>Price Range</strong>
            <em>Set your budget range ($ 200 - 800).</em>
            <div className="sh-slider">
              <span className="sh-track" />
              <span className="sh-fill" style={{ background: accent, left: "28%", right: "22%" }} />
              <span className="sh-thumb" style={{ borderColor: accent, left: "28%" }} />
              <span className="sh-thumb" style={{ borderColor: accent, left: "78%" }} />
            </div>
          </div>

          <label className="sh-terms" style={{ borderColor: accent }}>
            <span style={{ background: accent, borderColor: accent, color: onAccent }}><Icon icon={Tick02Icon} size={12} /></span>
            I agree to the terms and conditions
          </label>

          <div className="sh-btn-group">
            <button className="sh-round"><Icon icon={ArrowLeft01Icon} size={15} /></button>
            <div>
              <button>Archive</button>
              <button>Report</button>
              <button>Snooze</button>
              <button><Icon icon={MoreHorizontalIcon} size={15} /></button>
            </div>
          </div>
        </div>

        <div className="shadcn-col">
          <div className="sh-card sh-pricing" style={{ borderColor: `color-mix(in srgb, ${accent}, transparent 45%)` }}>
            <div className="sh-price-head">
              <strong>Pro</strong>
              <span className="sh-badge" style={{ background: accent, color: onAccent }}>Popular</span>
            </div>
            <div className="sh-price-figure">$19<em>/month</em></div>
            <ul className="sh-feature-list">
              {["Unlimited palettes", "Figma variables export", "APCA contrast matrix", "Priority support"].map((feature) => (
                <li key={feature}>
                  <span style={{ color: hex(plan.ctaRole, 400) }}><Icon icon={CheckmarkCircle01Icon} size={14} /></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button style={{ background: accent, color: onAccent }}>Upgrade to Pro</button>
          </div>

          <div className="sh-card">
            <div className="sh-tabs">
              <button className="is-active" style={{ background: "rgba(255,255,255,0.09)" }}>Account</button>
              <button>Password</button>
              <button>Team</button>
            </div>
            <label>Name<input placeholder="Sofia Davis" /></label>
            <label>Username<input placeholder="@sofia" /></label>
            <button style={{ background: accent, color: onAccent }}>Save changes</button>
          </div>

          <div className="sh-card">
            <strong>Recent invoices</strong>
            <table className="sh-table">
              <thead>
                <tr><th>Invoice</th><th>Status</th><th className="num">Amount</th></tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const statusRole = invoice.status === "Paid" ? "success" : invoice.status === "Failed" ? "error" : "warning";
                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>
                        <span className="sh-badge" style={{ background: `color-mix(in srgb, ${hex(statusRole, 500)}, transparent 82%)`, color: hex(statusRole, 300) }}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="num">{invoice.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sh-input-row">
            <div className="sh-message"><Icon icon={InformationCircleIcon} size={14} /> https:// <em style={{ marginLeft: "auto" }}><Icon icon={StarIcon} size={14} /></em></div>
          </div>

          <div className="sh-card sh-row-card">
            <span>Two-factor authentication</span>
            <button style={{ background: accent, color: onAccent }}>Enable</button>
          </div>

          <div className="sh-alert" style={{ background: `color-mix(in srgb, ${hex("success", 500)}, transparent 86%)`, color: hex("success", 300) }}>
            <Icon icon={CheckmarkCircle01Icon} size={15} /> Your profile has been verified.
          </div>
          <div className="sh-alert" style={{ background: `color-mix(in srgb, ${hex("error", 500)}, transparent 86%)`, color: hex("error", 300) }}>
            <Icon icon={Alert01Icon} size={15} /> Your subscription expires in 3 days.
          </div>

          <div className="sh-divider"><span>Appearance Settings</span></div>

          <div className="sh-card">
            <strong>Compute Environment</strong>
            <em>Select the compute environment for your cluster.</em>
            <div className="sh-radio-card is-active" style={{ borderColor: accent, background: `color-mix(in srgb, ${accent}, transparent 88%)` }}>
              <div>
                <strong>Kubernetes</strong>
                <em>Run GPU workloads on a K8s configured cluster. This is the default.</em>
              </div>
              <span className="radio is-checked" style={{ borderColor: accent }}><i style={{ background: accent }} /></span>
            </div>
            <div className="sh-radio-card">
              <div>
                <strong>Virtual Machine</strong>
                <em>Access a VM configured cluster to run workloads. (Coming soon)</em>
              </div>
              <span className="radio" style={{ borderColor: "var(--ex-line-strong)" }} />
            </div>
          </div>

          <div className="sh-card sh-row-card">
            <div>
              <strong>Number of GPUs</strong>
              <em>You can add more later.</em>
            </div>
            <div className="sh-stepper">
              <span>8</span>
              <button><Icon icon={MinusSignIcon} size={13} /></button>
              <button><Icon icon={PlusSignIcon} size={13} /></button>
            </div>
          </div>

          <div className="sh-card sh-row-card">
            <div>
              <strong>Wallpaper Tinting</strong>
              <em>Allow the wallpaper to be tinted.</em>
            </div>
            <span className="switch is-on" style={{ background: accent }}><i /></span>
          </div>

          <div className="sh-card">
            <div className="sh-skel-row">
              <span className="sh-skel sh-skel-avatar" />
              <div>
                <span className="sh-skel" style={{ width: "70%" }} />
                <span className="sh-skel" style={{ width: "45%" }} />
              </div>
            </div>
            <span className="sh-skel" style={{ width: "100%", height: 68, borderRadius: 10 }} />
          </div>

          <div className="sh-page">
            <button><Icon icon={ArrowLeft01Icon} size={13} /></button>
            {["1", "2", "3"].map((page) => (
              <button key={page} style={page === "2" ? { background: accent, color: onAccent } : undefined}>{page}</button>
            ))}
            <span>…</span>
            <button>12</button>
            <button><Icon icon={ArrowRight01Icon} size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
