"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Products", href: "/products" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(5,5,5,0.72)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Name */}
        <a href="/" className="flex items-center gap-2 group" aria-label="RC Toys Nepal Home">
          <span
            className="font-heading text-xl font-semibold tracking-wide"
            style={{ letterSpacing: "0.06em" }}
          >
            <span style={{ color: "#FF2D00" }}>RC</span>
            <span className="text-white/90"> TOYS</span>
            <span className="text-white/40 font-light"> NEPAL</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm text-white/50 hover:text-white/90 transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side Items (CTA + Mobile Menu + Logo) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="/products"
              className="relative inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium font-body tracking-wide text-white/90 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,45,0,0.12), rgba(255,140,0,0.08))",
                boxShadow: scrolled
                  ? "0 0 0 1px rgba(255,45,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 0 0 1px rgba(255,45,0,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 0 1px rgba(255,45,0,0.7), 0 0 24px rgba(255,45,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = scrolled
                  ? "0 0 0 1px rgba(255,45,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 0 0 1px rgba(255,45,0,0.25)";
              }}
            >
              Shop Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-white/70 transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden"
        style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-base text-white/70 hover:text-white transition-colors py-1 border-b border-white/5"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/products"
            className="mt-2 text-center py-3 rounded-full font-medium text-white/90 font-body text-sm"
            style={{
              background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Shop Now
          </a>
        </div>
      </motion.div>

      {/* Floating Logo touching the absolute top right edge */}
      <a 
        href="/" 
        className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full p-[3px] group z-[60] shadow-[0_0_20px_rgba(255,45,0,0.5)] transition-transform duration-300 hover:scale-105" 
        aria-label="Home"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2D00] via-[#FF8C00] to-[#FF2D00] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2D00] to-[#FF8C00] rounded-full blur-[10px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative w-full h-full bg-[#06080F] rounded-full overflow-hidden flex items-center justify-center p-1">
          <img 
            src="/logo.png" 
            alt="RC Toys Nepal Logo" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </a>
    </motion.header>
  );
}
