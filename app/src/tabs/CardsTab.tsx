import { ArrowRight01Icon, ArrowUpRight01Icon, GlobeIcon, HelpCircleIcon, Home01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { useAccentPlan, useHex } from "../context";
import { Icon } from "../components/Icon";
import { BarChart, Donut, Sparkline } from "../components/charts";
import { contrastText } from "../lib/color";

export function CardsTab() {
  const hex = useHex();
  const plan = useAccentPlan();
  const [chartA, chartB, chartC] = plan.chartRoles;
  const barColors = [hex("primary", 300), hex("primary", 500), hex("primary", 400), hex("primary", 600)];

  return (
    <div className="tab-stack">
      <div className="grid grid-4">
        <article
          className="ex-card photo-card"
          style={{ background: `linear-gradient(160deg, ${hex("primary", 100)}, ${hex("primary", 300)})`, color: hex("primary", 950) }}
        >
          <div className="photo-deco" style={{ background: hex("primary", 400) }} />
          <h3>Track your expenses</h3>
        </article>

        <article className="ex-card dark-card">
          <div className="card-head">
            <span className="card-label">Expenses</span>
            <span className="chip-round" style={{ background: hex("primary", 200), color: hex("primary", 950) }}><Icon icon={ArrowUpRight01Icon} size={14} /></span>
          </div>
          <strong className="card-figure">$12,543</strong>
          <BarChart
            values={[0.5, 0.75, 0.4, 0.85, 0.6, 0.95]}
            colors={barColors}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            height={130}
          />
        </article>

        <article
          className="ex-card photo-card"
          style={{ background: `linear-gradient(150deg, ${hex("primary", 300)}, ${hex("primary", 500)})`, color: contrastText(hex("primary", 400)) }}
        >
          <div className="photo-deco" style={{ background: hex("primary", 200) }} />
          <h3>Gain control</h3>
        </article>

        <article className="ex-card dark-card">
          <span className="card-label">Expenses</span>
          <div className="donut-wrap">
            <Donut
              segments={[
                { color: hex("primary", 300), value: 4973 },
                { color: hex("primary", 500), value: 4973 },
                { color: hex("primary", 700), value: 4973 },
              ]}
              label="$14,919"
            />
          </div>
          <ul className="legend">
            {[
              { name: "Groceries", color: hex("primary", 300) },
              { name: "Household", color: hex("primary", 500) },
              { name: "Travel", color: hex("primary", 700) },
            ].map((item) => (
              <li key={item.name}>
                <span className="legend-dot" style={{ background: item.color }} />
                {item.name}
                <em>$ 4,973</em>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid grid-4">
        <article className="ex-card dark-card">
          <span className="card-label">Blog</span>
          <ul className="blog-list">
            {[
              { title: "Productivity Hacks for Life on the Road", tag: "Work", from: 200, to: 400 },
              { title: "The Ultimate Digital Nomad Toolkit", tag: "Travel", from: 300, to: 500 },
              { title: "Design in Cross-Functional Teams", tag: "Design", from: 400, to: 600 },
            ].map((post) => (
              <li key={post.title}>
                <span
                  className="blog-thumb"
                  style={{ background: `linear-gradient(140deg, ${hex("primary", post.from)}, ${hex("primary", post.to)})` }}
                />
                <div>
                  <p>{post.title}</p>
                  <span className="tag" style={{ background: hex("primary", 200), color: hex("primary", 950) }}>{post.tag}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="ex-card photo-card"
          style={{ background: `linear-gradient(165deg, ${hex("primary", 200)}, ${hex("primary", 400)})`, color: hex("primary", 950) }}
        >
          <div className="photo-deco" style={{ background: hex("primary", 100) }} />
          <h3>Create budgets</h3>
        </article>

        <article className="ex-card dark-card stat-stack">
          {[
            { name: "Income", value: "$15,989", note: "$18,871 last period", stop: 400 },
            { name: "Expenses", value: "$12,543", note: "$10,221 last period", stop: 600 },
            { name: "Savings", value: "$5,210", note: "10,221 last period", stop: 800 },
          ].map((row) => (
            <div key={row.name} className="stat-row">
              <div>
                <span className="card-label">{row.name}</span>
                <strong>{row.value}</strong>
                <em>{row.note}</em>
              </div>
              <div className="stat-spark">
                <Sparkline values={[0.7, 0.5, 0.62, 0.4, 0.55, 0.35, 0.5]} color={hex("primary", row.stop)} />
              </div>
            </div>
          ))}
        </article>

        <article
          className="ex-card product-card"
          style={{ background: `linear-gradient(180deg, ${hex("primary", 100)}, ${hex("primary", 300)})`, color: hex("primary", 950) }}
        >
          <div className="product-visual" style={{ background: hex("neutral", 900) }}>
            <span style={{ background: hex("neutral", 700) }} />
          </div>
          <h3>MacBook Pro 14 inch</h3>
          <button className="btn-dark">Shop now</button>
        </article>
      </div>

      <div className="grid grid-4">
        <article
          className="ex-card metric-card"
          style={{ background: `linear-gradient(150deg, ${hex(plan.accentRole, 800)}, ${hex(plan.accentRole, 950)})`, color: "#ffffff" }}
        >
          <span className="card-label" style={{ color: "rgba(255,255,255,0.72)" }}>Customers</span>
          <strong className="metric-huge">1,553 <Icon icon={ArrowUpRight01Icon} size={26} /></strong>
          <em>New customers in past 30 days</em>
        </article>

        <article
          className="ex-card photo-card"
          style={{ background: `linear-gradient(160deg, ${hex("warning", 200)}, ${hex("warning", 400)})`, color: hex("warning", 950) }}
        >
          <div className="photo-deco" style={{ background: hex("warning", 300) }} />
          <h3>Gain control</h3>
        </article>

        <article className="ex-card dark-card">
          <span className="card-label">Categories</span>
          <ul className="cat-list">
            {[
              { name: "Groceries", note: "9 transactions", icon: ShoppingCart01Icon, role: chartA },
              { name: "Household", note: "12 transactions", icon: Home01Icon, role: chartB },
              { name: "Travel", note: "6 transactions", icon: GlobeIcon, role: chartC },
              { name: "Other", note: "6 transactions", icon: HelpCircleIcon, role: "neutral" as const },
            ].map((cat) => (
              <li key={cat.name}>
                <span className="cat-icon" style={{ background: hex(cat.role, 200), color: hex(cat.role, 900) }}><Icon icon={cat.icon} size={15} /></span>
                <div>
                  <p>{cat.name}</p>
                  <em>{cat.note}</em>
                </div>
                <span className="cat-chevron"><Icon icon={ArrowRight01Icon} size={15} /></span>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="ex-card photo-card"
          style={{ background: `linear-gradient(160deg, ${hex(chartC, 100)}, ${hex(chartC, 300)})`, color: hex(chartC, 950) }}
        >
          <div className="photo-deco" style={{ background: hex(chartC, 400) }} />
          <h3>Create budgets</h3>
        </article>
      </div>
    </div>
  );
}
