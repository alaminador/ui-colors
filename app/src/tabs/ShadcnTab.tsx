import { Add01Icon, ArrowLeft01Icon, ArrowRight01Icon, InformationCircleIcon, Loading03Icon, MinusSignIcon, MoreHorizontalIcon, PlusSignIcon, SentIcon, StarIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "../components/Icon";
import { useHex } from "../context";
import { Donut } from "../components/charts";
import { contrastText } from "../lib/color";

export function ShadcnTab() {
  const hex = useHex();
  const accent = hex("primary", 500);
  const onAccent = contrastText(accent);

  return (
    <div className="shadcn" style={{ background: hex("neutral", 950), color: "#fff" }}>
      <div className="shadcn-cols">
        <div className="shadcn-col">
          <div className="sh-card">
            <strong>Payment Method</strong>
            <em>All transactions are secure and encrypted</em>
            <div className="sh-grid2">
              <label>Card Number<input placeholder="1234 5678 9012 3456" /></label>
              <label>CVV<input placeholder="123" /></label>
            </div>
            <p className="sh-hint">Enter your 16-digit number.</p>
            <div className="sh-grid2">
              <label>Month<div className="sh-select">MM <span>▾</span></div></label>
              <label>Year<div className="sh-select">YYYY <span>▾</span></div></label>
            </div>
            <strong className="sh-sub">Billing Address</strong>
            <em>The billing address associated with your payment method</em>
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
            <strong>How did you hear about us?</strong>
            <em>Select the option that best describes how you heard…</em>
            <div className="sh-chips">
              {["Social Media", "Search Engine", "Referral", "Other"].map((chip, index) => (
                <span
                  key={chip}
                  style={
                    index === 0
                      ? { background: accent, color: onAccent }
                      : { border: "1px solid rgba(255,255,255,0.16)" }
                  }
                >
                  {index === 0 && <Icon icon={Tick02Icon} size={13} />} {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shadcn-col">
          <div className="sh-card sh-center">
            <div className="avatar-stack">
              {[300, 500, 700].map((stop) => (
                <span key={stop} style={{ background: `linear-gradient(140deg, ${hex("primary", stop)}, ${hex("secondary", stop)})` }} />
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
                    : { border: "1px solid rgba(255,255,255,0.16)" }
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
                  { color: hex("primary", 400), value: 55 },
                  { color: hex("secondary", 400), value: 30 },
                  { color: hex("tertiary", 300), value: 15 },
                ]}
                size={140}
              />
            </div>
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
          <div className="sh-input-row">
            <div className="sh-message"><Icon icon={InformationCircleIcon} size={14} /> https:// <em style={{ marginLeft: "auto" }}><Icon icon={StarIcon} size={14} /></em></div>
          </div>

          <div className="sh-card sh-row-card">
            <span>Two-factor authentication</span>
            <button style={{ background: accent, color: onAccent }}>Enable</button>
          </div>

          <div className="sh-card sh-row-card">
            <span><Icon icon={Tick02Icon} size={13} /> Your profile has been verified.</span>
            <em><Icon icon={ArrowRight01Icon} size={14} /></em>
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
              <span className="radio" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
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
        </div>
      </div>
    </div>
  );
}
