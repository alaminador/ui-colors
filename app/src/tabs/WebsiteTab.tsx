import { useHex } from "../context";
import { BarChart, Donut } from "../components/charts";
import { contrastText } from "../lib/color";

const faqs = [
  "What is Forward?",
  "How does Forward work?",
  "What is the difference between Forward and other tools?",
  "How can I get started?",
  "Can I cancel my subscription at any time?",
];

export function WebsiteTab() {
  const hex = useHex();
  const primaryBtnText = contrastText(hex("primary", 500));

  return (
    <div className="website" style={{ background: hex("neutral", 950), color: "#ffffff" }}>
      <nav className="site-nav">
        <Wordmark color={hex("primary", 400)} />
        <div className="nav-links">
          {["Product", "Pricing", "Docs", "Blog", "Support"].map((link) => (
            <span key={link}>{link}</span>
          ))}
        </div>
        <div className="nav-actions">
          <span>Sign in</span>
          <button className="btn-sm" style={{ background: hex("primary", 500), color: primaryBtnText }}>Get started</button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>Smarter Budgets.<br />Better Decisions.</h1>
          <p>
            Track every dollar you spend, understand your habits, and see exactly where your money goes.
            With clear insights, you'll make smarter choices every day.
          </p>
          <div className="hero-actions">
            <button className="btn-md" style={{ background: hex("primary", 500), color: primaryBtnText }}>Get started</button>
            <button className="btn-md btn-outline-light">Learn more</button>
          </div>
        </div>
        <div className="hero-visual" style={{ background: `linear-gradient(150deg, ${hex("primary", 800)}, ${hex("primary", 950)})` }}>
          <div className="hero-widget" style={{ background: hex("neutral", 900) }}>
            <span className="card-label">Expenses</span>
            <Donut
              segments={[
                { color: hex("primary", 300), value: 4973 },
                { color: hex("primary", 500), value: 4973 },
                { color: hex("secondary", 400), value: 4973 },
              ]}
              label="$ 14,919"
              size={130}
            />
            <ul className="legend">
              <li><span className="legend-dot" style={{ background: hex("primary", 300) }} />Groceries<em>$4,973</em></li>
              <li><span className="legend-dot" style={{ background: hex("primary", 500) }} />Household<em>$4,973</em></li>
              <li><span className="legend-dot" style={{ background: hex("secondary", 400) }} />Travel<em>$4,973</em></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="logo-strip" style={{ color: hex("neutral", 400) }}>
        {["✳ Octopus", "❋ BERRY", "✺ Clarify", "↗ Rise", "∿ Linky", "▶▶ Forward"].map((logo) => (
          <span key={logo}>{logo}</span>
        ))}
      </section>

      <section className="features">
        <span className="pill-tag" style={{ background: hex("primary", 900), color: hex("primary", 200) }}>Features</span>
        <h2>Power Up Your<br />Financial Control</h2>
        <p className="section-sub">Take charge with practical tools that help you categorize and track your way to better financial decisions.</p>
        <div className="grid grid-3">
          <div className="feature-card" style={{ background: hex("neutral", 900) }}>
            <div className="feature-visual">
              {["Groceries", "Household", "Travel"].map((row, index) => (
                <div key={row} className="feature-row" style={{ background: hex("primary", 800 - index * 100), color: "#fff" }}>
                  {row}
                  <em>{9 + index * 3} transactions</em>
                </div>
              ))}
            </div>
            <h3>Categorize transactions</h3>
            <p>Categorize every transaction seamlessly, giving you immediate clarity on where your money is flowing.</p>
          </div>
          <div className="feature-card" style={{ background: hex("primary", 600), color: contrastText(hex("primary", 600)) }}>
            <div className="feature-visual chat-visual">
              <div className="chat-bubble" style={{ background: hex("primary", 200), color: hex("primary", 950) }}>
                Hi John, thanks for reaching out. How can we help you today?
              </div>
              <div className="chat-input-fake" style={{ background: "rgba(255,255,255,0.9)", color: hex("neutral", 600) }}>
                Type your message… <span style={{ background: hex("primary", 900), color: "#fff" }}>→</span>
              </div>
            </div>
            <h3>24/7 Chat Support</h3>
            <p>Get instant answers and help anytime with 24/7 chat support right at your fingertips.</p>
          </div>
          <div className="feature-card" style={{ background: hex("neutral", 900) }}>
            <div className="feature-visual">
              <div className="mini-stat" style={{ background: hex("neutral", 800) }}>
                Expenses <strong>$15,989</strong>
                <span className="mini-bar" style={{ background: hex("primary", 400) }} />
              </div>
              <div className="mini-stat" style={{ background: hex("neutral", 800) }}>
                Savings <strong>$12,543</strong>
                <span className="mini-bar" style={{ background: hex("secondary", 400), width: "42%" }} />
              </div>
            </div>
            <h3>Track Spending &amp; Savings</h3>
            <p>Visualize your spending and savings trends with intuitive graphs, making it easy to track progress over time.</p>
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div
          className="testimonial-avatar"
          style={{ background: `linear-gradient(140deg, ${hex("primary", 300)}, ${hex("primary", 600)})` }}
        />
        <blockquote>
          <span style={{ color: hex("primary", 400), fontSize: 34, lineHeight: 1 }}>"</span>
          I had no idea how scattered my spending was until I started categorizing every transaction here.
          Seeing my patterns laid out in simple charts gave me the clarity I needed. Now I've cut unnecessary
          expenses and saved more in the past three months than I did all last year.
          <footer>
            <strong>David Williams</strong>
            <span>New York, USA</span>
          </footer>
        </blockquote>
      </section>

      <section className="faq">
        <h2>Your questions answered</h2>
        <div className="faq-list">
          {faqs.map((question) => (
            <div key={question} className="faq-row" style={{ background: hex("neutral", 900) }}>
              {question}
              <span style={{ color: hex("primary", 400) }}>+</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="insights"
        style={{ background: `linear-gradient(170deg, ${hex("primary", 900)}, ${hex("primary", 950)})` }}
      >
        <span className="pill-tag" style={{ background: hex("primary", 800), color: hex("primary", 100) }}>Insights</span>
        <h2>Income, Spending and Savings Trends</h2>
        <p className="section-sub" style={{ color: hex("primary", 200) }}>
          See how your finances evolve month by month. Compare your income, spending, and savings to track your financial progress.
        </p>
        <BarChart
          values={[0.45, 0.7, 0.35, 0.8, 0.55, 0.9, 0.4, 0.65, 0.75, 0.5, 0.85, 0.6, 0.7, 0.45, 0.95, 0.55, 0.65, 0.8, 0.5, 0.7, 0.6, 0.85, 0.4, 0.75]}
          colors={[hex("primary", 200), hex("primary", 400), hex("primary", 300)]}
          height={120}
          gap={5}
          radius={2}
        />
      </section>

      <section className="team">
        <h2>You're in good hands</h2>
        <div className="grid grid-4">
          {[
            { name: "Alice", role: "Founder", from: 200, to: 400 },
            { name: "Michael", role: "Customer Success", from: 300, to: 600 },
            { name: "Lynn", role: "Product", from: 400, to: 700 },
            { name: "Sarah", role: "Marketing", from: 500, to: 800 },
          ].map((member) => (
            <div key={member.name} className="team-card">
              <div
                className="team-photo"
                style={{ background: `linear-gradient(150deg, ${hex("primary", member.from)}, ${hex("primary", member.to)})` }}
              >
                <span className="team-arrow" style={{ background: "#ffffff", color: hex("primary", 900) }}>→</span>
              </div>
              <strong>{member.name}</strong>
              <em>{member.role}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="cta" style={{ background: hex("primary", 100), color: hex("primary", 950) }}>
        <h2>Take control of your finances</h2>
        <p>Sign up now and start making smarter financial decisions in minutes.</p>
        <button className="btn-md" style={{ background: hex("primary", 600), color: contrastText(hex("primary", 600)) }}>Get started</button>
      </section>

      <footer className="site-footer-mock" style={{ borderColor: hex("neutral", 800) }}>
        <Wordmark color={hex("primary", 400)} />
        <div className="footer-cols">
          {[
            { title: "Features", links: ["Expense Categorization", "Savings Insights", "Income Tracking", "Real-Time Reports"] },
            { title: "Resources", links: ["Help Center", "Budgeting Tips", "User Guides", "FAQ"] },
            { title: "Company", links: ["About Us", "Careers", "Press", "Privacy Policy"] },
          ].map((column) => (
            <div key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export function Wordmark({ color, dark }: { color: string; dark?: boolean }) {
  return (
    <span className="wordmark" style={{ color: dark ? "#111" : "#fff" }}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M3 4 L11 12 L3 20 Z" fill={color} />
        <path d="M12 4 L20 12 L12 20 Z" fill={color} />
      </svg>
      Forward
    </span>
  );
}
