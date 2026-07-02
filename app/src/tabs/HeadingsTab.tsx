import { useAccentPlan, useHex } from "../context";
import { contrastText } from "../lib/color";

export function HeadingsTab() {
  const hex = useHex();
  const plan = useAccentPlan();

  return (
    <div className="tab-stack">
      <div className="grid grid-2">
        <article className="type-card" style={{ background: "#ffffff", color: hex("neutral", 950) }}>
          <em className="type-meta" style={{ color: hex("neutral", 500) }}>Display / 64 / 950 on white</em>
          <h2 style={{ fontSize: 56, color: hex("primary", 950) }}>Color that feels designed.</h2>
          <p style={{ color: hex("neutral", 600) }}>Body text stays on the neutral ramp so the brand hue is reserved for meaning, not decoration.</p>
        </article>

        <article className="type-card" style={{ background: hex("primary", 950), color: "#fff" }}>
          <em className="type-meta" style={{ color: hex("primary", 300) }}>Display / 64 / 100 on 950</em>
          <h2 style={{ fontSize: 56, color: hex("primary", 100) }}>Dark mode, same system.</h2>
          <p style={{ color: hex("primary", 200) }}>Inverted pairings come straight from the scale — 100 and 200 on 950 keep APCA comfortable.</p>
        </article>
      </div>

      <div className="grid grid-2">
        <article className="type-card" style={{ background: hex("primary", 50), color: hex("primary", 950) }}>
          <em className="type-meta" style={{ color: hex("primary", 600) }}>H2 / 40 / accent word</em>
          <h2 style={{ fontSize: 38 }}>
            Make every launch <span style={{ color: hex("primary", 600) }}>unmissable</span>.
          </h2>
          <p style={{ color: hex("primary", 800) }}>A single accent word in 600 carries the brand without tinting the whole paragraph.</p>
        </article>

        <article className="type-card" style={{ background: hex("neutral", 950), color: "#fff" }}>
          <em className="type-meta" style={{ color: hex("neutral", 400) }}>H2 / 40 / gradient text</em>
          <h2
            style={{
              fontSize: 38,
              background: `linear-gradient(90deg, ${hex("primary", 300)}, ${hex(plan.accentRole, 400)})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Gradient headlines, tastefully.
          </h2>
          <p style={{ color: hex("neutral", 400) }}>Primary 300 into {plan.accentRole} 400 — both light enough to hold contrast on near-black.</p>
        </article>
      </div>

      <div className="grid grid-2">
        <article className="type-card" style={{ background: "#ffffff", color: hex("neutral", 900) }}>
          <em className="type-meta" style={{ color: hex("neutral", 500) }}>Eyebrow + H3 + body</em>
          <span className="pill-tag" style={{ background: hex("primary", 100), color: hex("primary", 800) }}>Changelog</span>
          <h3 style={{ fontSize: 26, marginTop: 10 }}>Perceptual scales ship today</h3>
          <p style={{ color: hex("neutral", 600) }}>
            Eyebrow chips use 100/800 from the same family, so the lockup survives any seed color you throw at it.
          </p>
        </article>

        <article className="type-card" style={{ background: "#ffffff", color: hex("neutral", 900) }}>
          <em className="type-meta" style={{ color: hex("neutral", 500) }}>Pull quote / border 500</em>
          <blockquote className="type-quote" style={{ borderColor: hex("primary", 500) }}>
            "The scale did in one afternoon what our brand team debated for a quarter."
            <footer style={{ color: hex("primary", 700) }}>— Head of Design, Forward</footer>
          </blockquote>
        </article>
      </div>

      <article className="type-card" style={{ background: hex("neutral", 50), color: hex("neutral", 950) }}>
        <em className="type-meta" style={{ color: hex("neutral", 500) }}>Hierarchy ladder</em>
        <div className="type-ladder">
          <h1 style={{ fontSize: 44, color: hex("primary", 950) }}>Heading 1 — 44px / 950</h1>
          <h2 style={{ fontSize: 34, color: hex("primary", 900) }}>Heading 2 — 34px / 900</h2>
          <h3 style={{ fontSize: 26, color: hex("primary", 800) }}>Heading 3 — 26px / 800</h3>
          <h4 style={{ fontSize: 20, color: hex("primary", 700) }}>Heading 4 — 20px / 700</h4>
          <p style={{ color: hex("neutral", 700) }}>Body — 15px / neutral 700. {contrastText(hex("neutral", 50)) === "#12161d" ? "Light surface" : "Dark surface"} pairing checked automatically.</p>
          <em style={{ color: hex("neutral", 500) }}>Caption — 13px / neutral 500</em>
        </div>
      </article>
    </div>
  );
}
