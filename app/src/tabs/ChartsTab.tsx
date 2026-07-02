import { useAccentPlan, useHex } from "../context";
import { BarChart, Donut, LineChart, Sparkline } from "../components/charts";

export function ChartsTab() {
  const hex = useHex();
  const plan = useAccentPlan();
  const [chartA, chartB, chartC] = plan.chartRoles;

  return (
    <div className="tab-stack">
      <div className="grid grid-2">
        <article className="ex-card dark-card">
          <span className="card-label">Bar · primary scale</span>
          <BarChart
            values={[0.4, 0.65, 0.5, 0.8, 0.6, 0.9, 0.45, 0.7]}
            colors={[hex(chartA, 300), hex(chartA, 400), hex(chartA, 500), hex(chartA, 600)]}
            labels={["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"]}
            height={170}
          />
        </article>
        <article className="ex-card dark-card">
          <span className="card-label">Line · {plan.spread === "tight" ? "tonal range" : "three roles"}</span>
          <LineChart
            series={[
              { color: hex(chartA, 400), values: [0.3, 0.5, 0.42, 0.68, 0.55, 0.8, 0.7, 0.92], fill: true },
              { color: hex(chartB, plan.spread === "tight" ? 600 : 400), values: [0.2, 0.35, 0.3, 0.5, 0.44, 0.6, 0.52, 0.7] },
              { color: hex(chartC, plan.spread === "tight" ? 800 : 400), values: [0.12, 0.25, 0.18, 0.36, 0.3, 0.44, 0.38, 0.52] },
            ]}
            height={170}
          />
        </article>
      </div>

      <div className="grid grid-3">
        <article className="ex-card dark-card">
          <span className="card-label">Donut · role split</span>
          <div className="donut-wrap">
            <Donut
              segments={[
                { color: hex(chartA, 400), value: 44 },
                { color: hex(chartB, plan.spread === "tight" ? 600 : 400), value: 28 },
                { color: hex(chartC, plan.spread === "tight" ? 800 : 400), value: 18 },
                { color: hex("neutral", 500), value: 10 },
              ]}
              label="44%"
              sublabel="primary share"
            />
          </div>
        </article>
        <article className="ex-card dark-card">
          <span className="card-label">Radial · progress</span>
          <div className="donut-wrap">
            <Donut
              segments={[
                { color: hex("success", 500), value: 72 },
                { color: "rgba(255,255,255,0.08)", value: 28 },
              ]}
              label="72%"
              sublabel="goal reached"
              thickness={12}
            />
          </div>
        </article>
        <article className="ex-card dark-card">
          <span className="card-label">Semantic states</span>
          <div className="state-bars">
            {(
              [
                { role: "success", label: "Passed", width: "78%" },
                { role: "warning", label: "Flaky", width: "34%" },
                { role: "error", label: "Failed", width: "16%" },
                { role: "neutral", label: "Skipped", width: "24%" },
              ] as const
            ).map((row) => (
              <div key={row.role} className="state-bar">
                <em>{row.label}</em>
                <div style={{ background: "rgba(255,255,255,0.07)" }}>
                  <span style={{ width: row.width, background: hex(row.role, 500) }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid grid-4">
        {(
          [
            { role: "primary", label: "Revenue", value: "$42.8k" },
            { role: "secondary", label: "Sessions", value: "128k" },
            { role: "tertiary", label: "Signups", value: "3,204" },
            { role: "success", label: "Retention", value: "94.2%" },
          ] as const
        ).map((card) => (
          <article key={card.role} className="ex-card dark-card spark-card">
            <em>{card.label}</em>
            <strong>{card.value}</strong>
            <Sparkline values={[0.35, 0.55, 0.4, 0.7, 0.5, 0.82, 0.66]} color={hex(card.role, 400)} />
          </article>
        ))}
      </div>

      <article className="ex-card dark-card">
        <span className="card-label">Stacked · monthly mix</span>
        <div className="stacked">
          {[0.9, 0.7, 0.85, 0.6, 0.95, 0.75, 0.8, 0.65, 0.9, 0.7, 0.85, 0.78].map((total, index) => (
            <div key={index} className="stack-col" style={{ height: `${total * 100}%` }}>
              <span style={{ flex: 5, background: hex(chartA, 500) }} />
              <span style={{ flex: 3, background: hex(chartB, plan.spread === "tight" ? 700 : 400) }} />
              <span style={{ flex: 2, background: hex(chartC, plan.spread === "tight" ? 300 : 300) }} />
            </div>
          ))}
        </div>
        <div className="legend-row">
          <span><i style={{ background: hex(chartA, 500) }} />Product</span>
          <span><i style={{ background: hex(chartB, plan.spread === "tight" ? 700 : 400) }} />Services</span>
          <span><i style={{ background: hex(chartC, 300) }} />Other</span>
        </div>
      </article>
    </div>
  );
}
