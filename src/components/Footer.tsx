"use client";

export default function Footer() {
  return (
    <footer
      className="relative py-16 px-6"
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Glow line at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "30%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,45,0,0.5), rgba(255,140,0,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span
              className="font-heading text-2xl font-semibold"
              style={{ letterSpacing: "0.06em" }}
            >
              <span style={{ color: "#FF2D00" }}>RC</span>
              <span className="text-white/90"> TOYS</span>
              <span className="text-white/35"> NEPAL</span>
            </span>
            <p
              className="font-body"
              style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
            >
              Kathmandu&rsquo;s home of Radio Control since day one. Cars,
              drones, trucks, and pro-grade builds.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            {[
              ["Overview", "#overview"],
              ["Products", "#engineering"],
              ["Technology", "#technology"],
              ["Specs", "#power"],
              ["Shop Now", "#cta"],
              ["Catalogue", "#cta"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-body text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span
              className="font-body text-xs uppercase tracking-widest"
              style={{ color: "rgba(255,140,0,0.7)" }}
            >
              Contact
            </span>
            {[
              ["rctoysnepal.com", "https://rctoysnepal.com"],
              ["9841194605", "tel:+9779841194605"],
              ["rctoysnepal@gmail.com", "mailto:rctoysnepal@gmail.com"],
            ].map(([text, href]) => (
              <a
                key={text}
                href={href}
                className="font-body text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)")
                }
              >
                {text}
              </a>
            ))}
            <p
              className="font-body text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}
            >
              Kathmandu &amp; Lalitpur, Nepal
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "2rem" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="font-body text-xs"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            &copy; {new Date().getFullYear()} RC Toys Nepal. All rights reserved.
          </p>
          <p
            className="font-body text-xs"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Made with precision in Nepal 🇳🇵
          </p>
        </div>
      </div>
    </footer>
  );
}
