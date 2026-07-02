import { Mail01Icon, Search01Icon, SmileIcon } from "@hugeicons/core-free-icons";
import { Icon } from "../components/Icon";
import { useHex } from "../context";
import { contrastText } from "../lib/color";

function BerryMark({ color, size = 26 }: { color: string; size?: number }) {
  const positions = [
    [12, 4], [19, 8], [19, 16], [12, 20], [5, 16], [5, 8],
  ];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {positions.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="3.4" fill={color} />
      ))}
      <circle cx="12" cy="12" r="3.4" fill={color} />
    </svg>
  );
}

function ForwardMark({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M3 4 L11 12 L3 20 Z" fill={color} />
      <path d="M12 4 L20 12 L12 20 Z" fill={color} />
    </svg>
  );
}

export function BrandingTab() {
  const hex = useHex();

  return (
    <div className="tab-stack">
      <div className="brand-grid">
        <article className="brand-tile" style={{ background: hex("primary", 100), color: hex("primary", 950) }}>
          <span className="price-tag" style={{ background: hex("primary", 500), color: contrastText(hex("primary", 500)) }}>$599</span>
          <div className="city-block">
            <h3>New York</h3>
            <div className="city-shapes">
              <span style={{ background: hex("primary", 300) }} />
              <span style={{ background: hex("primary", 500) }} />
              <span style={{ background: hex("primary", 700) }} />
            </div>
          </div>
        </article>

        <article className="brand-tile brand-wordmark" style={{ background: hex("primary", 400), color: contrastText(hex("primary", 400)) }}>
          <ForwardMark color={contrastText(hex("primary", 400))} size={34} />
          <strong>Forward</strong>
        </article>

        <article
          className="brand-tile phone-tile"
          style={{ background: `linear-gradient(160deg, ${hex("primary", 200)}, ${hex("primary", 400)})` }}
        >
          <div className="phone-shell">
            <div className="phone-screen" style={{ background: "#ffffff", color: hex("neutral", 900) }}>
              <div className="phone-search" style={{ background: hex("neutral", 100) }}><Icon icon={Search01Icon} size={10} /> United States</div>
              <div className="phone-map" style={{ background: hex("primary", 100) }}>
                {[
                  ["18%", "22%"], ["58%", "14%"], ["36%", "48%"], ["70%", "56%"],
                ].map(([left, top], index) => (
                  <span key={index} className="map-pin" style={{ left, top, background: hex("primary", 600), color: "#fff" }}>
                    ${(index + 3) * 105}
                  </span>
                ))}
              </div>
              <strong style={{ fontSize: 11 }}>Explore destinations</strong>
              <div className="phone-row" style={{ background: hex("neutral", 100) }} />
              <div className="phone-row" style={{ background: hex("neutral", 100) }} />
            </div>
          </div>
        </article>

        <article className="brand-tile card-tile" style={{ background: hex("primary", 200) }}>
          <div className="credit-card" style={{ background: `linear-gradient(140deg, ${hex("primary", 600)}, ${hex("primary", 800)})`, color: "#fff" }}>
            <ForwardMark color="#ffffff" size={20} />
            <strong>Forward</strong>
          </div>
        </article>

        <article className="brand-tile tee-tile" style={{ background: hex("neutral", 200) }}>
          <div className="tee" style={{ background: hex("neutral", 900) }}>
            <ForwardMark color={hex("primary", 400)} size={22} />
          </div>
        </article>

        <article className="brand-tile arches-tile" style={{ background: hex("primary", 200) }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index} className="arch" style={{ background: index % 2 ? hex("primary", 400) : hex("primary", 600) }} />
          ))}
        </article>
      </div>

      <div className="brand-grid">
        <article
          className="brand-tile poster-tile"
          style={{ background: hex("secondary", 100), color: hex("secondary", 950) }}
        >
          <span className="poster-brand"><BerryMark color={hex("secondary", 700)} size={18} /> BERRY</span>
          <h3>Launch Your Dream Store in Minutes</h3>
          <div className="poster-waves">
            <span style={{ background: hex("secondary", 200) }} />
            <span style={{ background: hex("secondary", 300) }} />
          </div>
        </article>

        <article className="brand-tile brand-wordmark" style={{ background: hex("secondary", 950), color: "#ffffff" }}>
          <BerryMark color={hex("secondary", 300)} size={34} />
          <strong>BERRY</strong>
        </article>

        <article
          className="brand-tile ui-peek-tile"
          style={{ background: `linear-gradient(150deg, ${hex("secondary", 200)}, ${hex("secondary", 400)})` }}
        >
          <div className="ui-peek" style={{ background: hex("neutral", 950), color: "#fff" }}>
            <div className="ui-peek-side" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <span><BerryMark color={hex("secondary", 400)} size={13} /> Berry</span>
              <em>Products</em>
              <em style={{ color: "#fff" }}>Orders</em>
              <em>Customers</em>
            </div>
            <div className="ui-peek-main">
              <strong>Orders</strong>
              <div className="ui-peek-stat" style={{ background: "rgba(255,255,255,0.06)" }}>
                Orders <b>420</b>
              </div>
            </div>
          </div>
        </article>

        <article className="brand-tile icons-tile" style={{ background: `linear-gradient(150deg, ${hex("secondary", 800)}, ${hex("secondary", 950)})` }}>
          <div className="app-dock" style={{ background: "rgba(255,255,255,0.14)" }}>
            <span style={{ background: "#ffffff", color: "#14161c" }}><Icon icon={SmileIcon} size={22} /></span>
            <span style={{ background: hex("secondary", 300) }}><BerryMark color={hex("secondary", 800)} size={20} /></span>
            <span style={{ background: hex("primary", 400), color: "#ffffff" }}><Icon icon={Mail01Icon} size={22} /></span>
          </div>
        </article>

        <article className="brand-tile tote-tile" style={{ background: hex("neutral", 100) }}>
          <div className="tote" style={{ background: hex("secondary", 700) }}>
            <BerryMark color="#ffffff" size={30} />
          </div>
        </article>

        <article
          className="brand-tile billboard-tile"
          style={{ background: `linear-gradient(160deg, ${hex("secondary", 900)}, ${hex("secondary", 950)})`, color: "#fff" }}
        >
          <h3>Launch Your Dream Store in Minutes</h3>
          <div className="avatar-row">
            {[200, 300, 400, 500].map((stop) => (
              <span key={stop} style={{ background: `linear-gradient(140deg, ${hex("primary", stop)}, ${hex("secondary", stop)})` }} />
            ))}
          </div>
          <span className="poster-brand" style={{ color: hex("secondary", 200) }}>
            <BerryMark color={hex("secondary", 200)} size={14} /> BERRY
          </span>
        </article>
      </div>
    </div>
  );
}
