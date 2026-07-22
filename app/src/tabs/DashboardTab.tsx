import { Package01Icon, Search01Icon, Settings01Icon, ShoppingBasket01Icon, Tag01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { useAccentPlan, useHex } from "../context";
import { Icon } from "../components/Icon";
import { BarChart, LineChart } from "../components/charts";
import { ForwardMark } from "../components/marks";

const orders = [
  { id: "#29788", date: "Today at 4:19 a.m.", status: "Shipped", customer: "Lucas Johnson", total: "$250.94" },
  { id: "#29787", date: "Yesterday at 10:52 p.m.", status: "Shipped", customer: "Ava Martinez", total: "$17.02" },
  { id: "#29786", date: "Yesterday at 5:25 p.m.", status: "Pending", customer: "Liam Brown", total: "$135.49" },
  { id: "#29785", date: "Yesterday at 11:58 a.m.", status: "Pending", customer: "Sofia Taylor", total: "$157.01" },
  { id: "#29784", date: "Yesterday at 6:31 a.m.", status: "Pending", customer: "Ethan Anderson", total: "$119.49" },
  { id: "#29783", date: "Yesterday at 1:04 a.m.", status: "Pending", customer: "Emma Thomas", total: "$166.62" },
  { id: "#29782", date: "Jun 30 at 7:37 p.m.", status: "Pending", customer: "Mason Jackson", total: "$34.35" },
  { id: "#29781", date: "Jun 30 at 2:10 p.m.", status: "Pending", customer: "Mia White", total: "$153.36" },
  { id: "#29780", date: "Jun 30 at 8:43 a.m.", status: "Cancelled", customer: "Noah Lee", total: "$209.01" },
  { id: "#29779", date: "Jun 30 at 3:16 a.m.", status: "Pending", customer: "Olivia Smith", total: "$207.35" },
];

export function DashboardTab() {
  const hex = useHex();
  const plan = useAccentPlan();
  const [chartA, chartB, chartC] = plan.chartRoles;

  return (
    <div className="dashboard" style={{ background: "var(--ex-bg)", color: "var(--ex-ink)" }}>
      <aside className="dash-side" style={{ borderColor: "var(--ex-line)" }}>
        <div className="dash-brand">
          <ForwardMark color={hex("primary", 400)} size={18} />
          <div>
            <strong>Forward</strong>
            <em>Premium</em>
          </div>
        </div>
        <nav className="dash-nav">
          <span><Icon icon={ShoppingBasket01Icon} size={15} /> Products</span>
          <span className="is-open"><Icon icon={Package01Icon} size={15} /> Orders</span>
          <span className="dash-sub is-active" style={{ background: "var(--ex-soft)" }}>All</span>
          <span className="dash-sub">Drafts</span>
          <span className="dash-sub">Archived</span>
          <span><Icon icon={UserMultipleIcon} size={15} /> Customers</span>
          <span><Icon icon={Tag01Icon} size={15} /> Discounts</span>
          <span><Icon icon={Settings01Icon} size={15} /> Settings</span>
        </nav>
      </aside>

      <div className="dash-main">
        <div className="dash-breadcrumb">Orders <em>›</em> All</div>
        <div className="dash-title-row">
          <h2>Orders</h2>
          <div>
            <button className="btn-sm btn-outline-light">Export</button>
            <button className="btn-sm" style={{ background: hex(plan.ctaRole, 500), color: "#fff" }}>+ Create</button>
          </div>
        </div>

        <div className="grid grid-4 dash-stats">
          {[
            { label: "Orders", value: "420" },
            { label: "Revenue", value: "$23,522.92" },
            { label: "Products sold", value: "632" },
            { label: "New customers", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="dash-stat" style={{ background: "var(--ex-card)" }}>
              <em>{stat.label}</em>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="grid grid-2">
          <div className="dash-chart" style={{ background: "var(--ex-card)" }}>
            <em>Orders</em>
            <BarChart
              values={[0.55, 0.35, 0.7, 0.45, 0.85, 0.5, 0.65, 0.9]}
              colors={[hex(chartA, 500), hex(chartB, plan.spread === "tight" ? 600 : 400), hex(chartA, 300), hex(chartC, plan.spread === "tight" ? 800 : 400)]}
              labels={["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7", "Jan 8"]}
              height={150}
            />
          </div>
          <div className="dash-chart" style={{ background: "var(--ex-card)" }}>
            <em>Orders</em>
            <LineChart
              series={[
                { color: hex(chartA, 400), values: [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.72, 0.9], fill: true },
                { color: hex(chartB, plan.spread === "tight" ? 600 : 400), values: [0.3, 0.42, 0.35, 0.52, 0.48, 0.6, 0.55, 0.68] },
                { color: hex(chartC, plan.spread === "tight" ? 800 : 400), values: [0.15, 0.28, 0.2, 0.38, 0.3, 0.45, 0.4, 0.55] },
              ]}
              height={150}
            />
          </div>
        </div>

        <div className="dash-table" style={{ background: "var(--ex-card)" }}>
          <div className="dash-search" style={{ background: "var(--ex-soft)" }}><Icon icon={Search01Icon} size={14} /> Search orders…</div>
          <table>
            <thead>
              <tr>
                <th>Order</th><th>Date</th><th>Status</th><th>Customer</th><th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusRole = order.status === "Shipped" ? "success" : order.status === "Cancelled" ? "error" : "neutral";
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td className="dim">{order.date}</td>
                    <td>
                      <span className="status-chip" style={{ background: hex(statusRole, 900), color: hex(statusRole, 300) }}>
                        {order.status === "Shipped" ? "✓" : "◷"} {order.status}
                      </span>
                    </td>
                    <td>{order.customer}</td>
                    <td className="num">{order.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="dash-pagination">
            <button className="btn-sm btn-outline-light">Previous</button>
            <button className="btn-sm btn-outline-light">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
