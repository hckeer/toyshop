"use client";

// Footer component — premium layout with generous spacing
export default function Footer() {
  const navLinks: [string, string][][] = [
    [
      ["Overview", "#overview"],
    ],
    [
      ["All Products", "/products"],
      ["Catalogue", "/products"],
      ["Accessories", "/products"],
    ],
    [
      ["rctoysnepal.com", "https://rctoysnepal.com"],
      ["9841194605", "tel:+9779841194605"],
      ["9851196739", "tel:+9779851196739"],
      ["rctoysnepal@gmail.com", "mailto:rctoysnepal@gmail.com"],
      ["Google Review", "https://share.google/hsMFkrt5mAXNIEqx4"],
    ],
  ];

  const headings = ["Explore", "Shop", "Contact"];

  return (
    <footer
      style={{
        background: "#08090C",
        borderTop: "1px solid rgba(255, 45, 0, 0.2)",
        position: "relative",
        zIndex: 20,
        minHeight: "320px",
      }}
    >
      {/* Glow line at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,45,0,0.8), rgba(255,140,0,0.6), transparent)",
          boxShadow: "0 0 20px rgba(255,45,0,0.5)",
        }}
      />

      {/* Outer wrapper */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "80px",
          paddingBottom: "48px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        {/* Main grid: brand + 3 link columns */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Brand block */}
          <div
            style={{
              paddingRight: "60px",
              maxWidth: "280px",
            }}
          >
            <span
              className="font-heading"
              style={{
                fontSize: "2rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                display: "block",
              }}
            >
              <span style={{ color: "#FF2D00" }}>RC</span>
              <span style={{ color: "#fff" }}> TOYS</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}> NEPAL</span>
            </span>

            <p
              className="font-body"
              style={{
                marginTop: "12px",
                color: "rgba(255,255,255,0.6)",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              Kathmandu&rsquo;s home of Radio Control since day one. Cars,
              drones, trucks, and pro-grade builds.
            </p>
          </div>

          {/* Link columns */}
          {headings.map((heading, colIdx) => (
            <div key={heading}>
              <span
                className="font-body"
                style={{
                  display: "block",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#FF2D00",
                }}
              >
                {heading}
              </span>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {navLinks[colIdx].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="footer-link font-body"
                    style={{
                      display: "block",
                      marginBottom: "14px",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "14px",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#ffffff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.55)")
                    }
                  >
                    {label}
                  </a>
                ))}

                {/* Extra location line under Contact */}
                {colIdx === 2 && (
                  <a
                    href="https://maps.app.goo.gl/YdbK77CGk1Q5PB9v7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body"
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.3)",
                      lineHeight: 1.6,
                      display: "block",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.6)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.3)")
                    }
                  >
                    📍 Lazimpad, Pizza Inn Building
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p
            className="font-body"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}
          >
            &copy; {new Date().getFullYear()} RC Toys Nepal. All rights
            reserved.
          </p>
          <p
            className="font-body"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}
          >
            Made with precision in Nepal 🇳🇵
          </p>
        </div>
      </div>

      {/* Responsive overrides via a style tag */}
      <style>{`
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
            max-width: 100% !important;
            padding-right: 0 !important;
            margin-bottom: 32px;
          }
        }
        @media (max-width: 639px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid > div {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
