"use client";

import { motion } from "framer-motion";

// Footer component with updated spacing
export default function Footer() {
  return (
    <footer
      className="relative py-48 pt-56 px-8 md:px-16 z-20"
      style={{
        background: "#08090C",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Glow line at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "40%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,45,0,0.8), rgba(255,140,0,0.6), transparent)",
          boxShadow: "0 0 20px rgba(255,45,0,0.5)",
        }}
      />

      <div className="w-full px-8 md:px-12 lg:px-16">
        <div className="flex justify-between items-start mb-32 mt-24">
          {/* Brand - Left Side */}
          <div className="flex flex-col gap-6 max-w-sm mt-20 ml-4">
            <span
              className="font-heading text-4xl font-semibold"
              style={{ letterSpacing: "0.06em" }}
            >
              <span style={{ color: "#FF2D00" }}>RC</span>
              <span className="text-white"> TOYS</span>
              <span className="text-white/50"> NEPAL</span>
            </span>
            <p
              className="font-body text-lg"
              style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}
            >
              Kathmandu&rsquo;s home of Radio Control since day one. Cars,
              drones, trucks, and pro-grade builds.
            </p>
          </div>

          {/* Links Section - Right Most Edge with spacing above */}
          <div className="pt-20 pr-14 mr-14 mt-16">
            <div className="grid grid-cols-3 gap-12 sm:gap-16 lg:gap-24">
              {/* Explore Links */}
              <div className="flex flex-col gap-5">
                <span
                  className="font-body text-base uppercase tracking-widest font-semibold mb-1"
                  style={{ color: "rgba(255,140,0,0.9)" }}
                >
                  Explore
                </span>
                {[
                  ["Overview", "#overview"],
                  ["Technology", "#technology"],
                  ["Specs", "#power"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="font-body text-lg transition-colors"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,1)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")
                    }
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* Shop Links */}
              <div className="flex flex-col gap-5">
                <span
                  className="font-body text-base uppercase tracking-widest font-semibold mb-1"
                  style={{ color: "rgba(255,140,0,0.9)" }}
                >
                  Shop
                </span>
                {[
                  ["All Products", "/products"],
                  ["Catalogue", "/products"],
                  ["Accessories", "/products"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="font-body text-lg transition-colors"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,1)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")
                    }
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-5">
                <span
                  className="font-body text-base uppercase tracking-widest font-semibold mb-1"
                  style={{ color: "rgba(255,140,0,0.9)" }}
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
                    className="font-body text-lg transition-colors"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,1)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")
                    }
                  >
                    {text}
                  </a>
                ))}
                <p
                  className="font-body text-base mt-2 whitespace-nowrap"
                  style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}
                >
                  Kathmandu &amp; Lalitpur
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="max-w-7xl mx-auto px-4"
          style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "3rem" }}
        />

        {/* Bottom row */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 pb-8">
          <p
            className="font-body text-sm"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            &copy; {new Date().getFullYear()} RC Toys Nepal. All rights reserved.
          </p>
          <p
            className="font-body text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Made with precision in Nepal 🇳🇵
          </p>
        </div>
      </div>
    </footer>
  );
}
