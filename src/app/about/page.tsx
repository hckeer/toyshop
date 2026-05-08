import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us — RC Toys Nepal",
  description:
    "Kathmandu's home of Radio Control since day one. Learn about RC Toys Nepal — our story, location at Lazimpad Pizza Inn Building, and how to reach us.",
};

export default function AboutPage() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />

      <main
        style={{
          background: "linear-gradient(180deg, #06080F 0%, #08090C 100%)",
          minHeight: "100vh",
          paddingTop: "96px",
        }}
      >
        {/* ── HERO SECTION ── */}
        <section
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "80px 40px 60px",
          }}
        >
          {/* Eyebrow */}
          <p
            className="font-body"
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#FF2D00",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Our Story
          </p>

          {/* Main heading */}
          <h1
            className="font-heading"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "40px",
            }}
          >
            <span style={{ color: "#FF2D00" }}>RC</span> TOYS
            <br />
            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              NEPAL
            </span>
          </h1>

          {/* Description */}
          <p
            className="font-body"
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              maxWidth: "680px",
              marginBottom: "60px",
            }}
          >
            Kathmandu&rsquo;s home of Radio Control since day one. Cars, drones,
            trucks, and pro-grade builds. We started with a passion for
            precision engineering and remote-controlled machines — and we never
            looked back. From entry-level hobbyists to professional racers, RC
            Toys Nepal is your one-stop destination for everything RC.
          </p>

          {/* Divider glow */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(255,45,0,0.6), rgba(255,140,0,0.3), transparent)",
              marginBottom: "80px",
            }}
          />

          {/* ── DETAILS GRID ── */}
          <div
            className="about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "start",
            }}
          >
            {/* Contact Card */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,45,0,0.06), rgba(255,140,0,0.03))",
                border: "1px solid rgba(255,45,0,0.18)",
                borderRadius: "20px",
                padding: "40px",
              }}
            >
              <p
                className="font-body"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#FF2D00",
                  fontWeight: 700,
                  marginBottom: "28px",
                }}
              >
                Contact Us
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "22px" }}
              >
                {/* Phone 1 */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ fontSize: "20px", marginTop: "2px" }}>📞</span>
                  <div>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      PHONE
                    </p>
                    <a
                      href="tel:+9779841194605"
                      className="font-body contact-link"
                      style={{
                        display: "block",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.88)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        marginBottom: "4px",
                      }}
                    >
                      9841194605
                    </a>
                    <a
                      href="tel:+9779851196739"
                      className="font-body contact-link"
                      style={{
                        display: "block",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.88)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      9851196739
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ fontSize: "20px", marginTop: "2px" }}>✉️</span>
                  <div>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      EMAIL
                    </p>
                    <a
                      href="mailto:rctoysnepal@gmail.com"
                      className="font-body contact-link"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.88)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      rctoysnepal@gmail.com
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ fontSize: "20px", marginTop: "2px" }}>🌐</span>
                  <div>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      WEBSITE
                    </p>
                    <a
                      href="https://rctoysnepal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body contact-link"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.88)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      rctoysnepal.com
                    </a>
                  </div>
                </div>

                {/* Google Review */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ fontSize: "20px", marginTop: "2px" }}>⭐</span>
                  <div>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      REVIEWS
                    </p>
                    <a
                      href="https://share.google/hsMFkrt5mAXNIEqx4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body contact-link"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.88)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      Leave us a Google Review →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Location info */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px",
                  padding: "40px",
                }}
              >
                <p
                  className="font-body"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#FF2D00",
                    fontWeight: 700,
                    marginBottom: "20px",
                  }}
                >
                  Find Us
                </p>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}
                >
                  <span style={{ fontSize: "24px", marginTop: "2px" }}>📍</span>
                  <div>
                    <p
                      className="font-heading"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.92)",
                        lineHeight: 1.3,
                        marginBottom: "8px",
                      }}
                    >
                      Lazimpad
                    </p>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "0.95rem",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.6,
                        marginBottom: "20px",
                      }}
                    >
                      Pizza Inn Building, Lazimpad
                      <br />
                      Kathmandu, Nepal
                    </p>
                    <a
                      href="https://maps.app.goo.gl/YdbK77CGk1Q5PB9v7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body map-link"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#FF8C00",
                        textDecoration: "none",
                        border: "1px solid rgba(255,140,0,0.35)",
                        borderRadius: "999px",
                        padding: "8px 18px",
                        transition: "all 0.2s",
                      }}
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              {/* What we offer */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "20px",
                  padding: "32px 40px",
                }}
              >
                <p
                  className="font-body"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#FF2D00",
                    fontWeight: 700,
                    marginBottom: "18px",
                  }}
                >
                  What We Offer
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    "🏎️  RC Cars — hobby & pro grade",
                    "🚁  RC Drones — photography & racing",
                    "🚛  RC Trucks & Crawlers",
                    "⚙️  Spare parts & accessories",
                    "🔋  Batteries, chargers & electronics",
                    "🛠️  Pro-grade custom builds",
                  ].map((item) => (
                    <li
                      key={item}
                      className="font-body"
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive grid and hover effects */}
      <style>{`
        .contact-link:hover {
          color: #FF8C00 !important;
        }
        .map-link:hover {
          background: rgba(255,140,0,0.1) !important;
          border-color: rgba(255,140,0,0.7) !important;
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
