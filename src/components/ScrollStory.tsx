"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

const CanvasSequence = dynamic(() => import("./CanvasSequence"), { ssr: false });

// Story beat configuration
const BEATS = [
  { id: "overview", start: 0, end: 0.15 },
  { id: "engineering", start: 0.15, end: 0.4 },
  { id: "technology", start: 0.4, end: 0.65 },
  { id: "power", start: 0.65, end: 0.85 },
  { id: "cta", start: 0.85, end: 1.0 },
];

function useBeatProgress(globalProgress: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (globalProgress - start) / (end - start)));
}

// ── HERO SECTION (0–15%) ──────────────────────────────────
function HeroBeat({ progress }: { progress: number }) {
  const visible = progress >= 0 && progress < 1;
  const fadeOut = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      style={{ opacity: visible ? 1 - fadeOut : 0, pointerEvents: "none" }}
      id="overview"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,45,0,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Brand line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: progress >= 0 ? 1 : 0, y: progress >= 0 ? 0 : 20 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="section-label mb-6"
      >
        Nepal&rsquo;s Pioneer in Radio Control
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: progress >= 0 ? 1 : 0, y: progress >= 0 ? 0 : 40 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-heading"
        style={{
          fontSize: "clamp(3.5rem, 12vw, 9rem)",
          fontWeight: 900,
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
          color: "rgba(255,255,255,0.93)",
          textTransform: "uppercase",
        }}
      >
        RC Toys
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #FF2D00 10%, #FF8C00 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Nepal
        </span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: progress >= 0 ? 1 : 0, y: progress >= 0 ? 0 : 24 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-heading mt-4"
        style={{
          fontSize: "clamp(1.6rem, 4vw, 3rem)",
          fontWeight: 300,
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
        }}
      >
        Built for Speed. Engineered for Thrill.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: progress >= 0 ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-body mt-5 max-w-md"
        style={{
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          letterSpacing: "0.01em",
        }}
      >
        Nepal&rsquo;s pioneer in Radio Control — cars, drones, and beyond.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-body text-xs tracking-widest text-white/30 uppercase">
          Scroll to explore
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <motion.rect
            x="6.5" y="4" width="3" height="5" rx="1.5"
            fill="#FF2D00"
            animate={{ y: [4, 12, 4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── ENGINEERING SECTION (15–40%) ─────────────────────────
function EngineeringBeat({ progress }: { progress: number }) {
  const show = progress > 0 && progress < 1;
  const fadeIn = Math.min(progress / 0.3, 1);
  const fadeOut = progress > 0.75 ? (progress - 0.75) / 0.25 : 0;
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none"
      style={{ opacity, transition: "opacity 0.1s" }}
      id="engineering"
    >
      <div className="px-8 md:px-16 lg:px-24 max-w-xl">
        <div className="section-label mb-4">Engineering</div>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.93)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          Precision-Built
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            for Performance.
          </span>
        </h2>
        <div className="divider mt-5 mb-5" />
        <p
          className="font-body mb-3"
          style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}
        >
          High-torque motors, aircraft-grade chassis, and precision servo
          systems — every component tuned for control and speed.
        </p>
        <p
          className="font-body"
          style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
        >
          From starter kits to pro-grade builds, engineered for every skill
          level.
        </p>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-2 mt-6">
          {["High-Torque Motor", "Aircraft Chassis", "Precision Servo", "Oil Shocks"].map(
            (spec) => (
              <span
                key={spec}
                className="font-body text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,45,0,0.08)",
                  border: "1px solid rgba(255,45,0,0.2)",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.05em",
                }}
              >
                {spec}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── TECHNOLOGY SECTION (40–65%) ──────────────────────────
function TechnologyBeat({ progress }: { progress: number }) {
  const fadeIn = Math.min(progress / 0.25, 1);
  const fadeOut = progress > 0.75 ? (progress - 0.75) / 0.25 : 0;
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div
      className="absolute inset-0 flex items-center justify-end pointer-events-none"
      style={{ opacity }}
      id="technology"
    >
      <div className="px-8 md:px-16 lg:px-24 max-w-xl text-right">
        <div className="section-label justify-end mb-4" style={{ flexDirection: "row-reverse" }}>
          Control Technology
        </div>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.93)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          Full Control.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Total Response.
          </span>
        </h2>

        <div
          className="mt-5 mb-5 ml-auto"
          style={{
            width: 48,
            height: 2,
            background: "linear-gradient(90deg, #FF8C00, #FF2D00)",
            borderRadius: 2,
          }}
        />

        <p
          className="font-body mb-3"
          style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}
        >
          2.4GHz interference-free signal, every time.
          <br />
          Real-time throttle response from 0 to full speed.
        </p>
        <p
          className="font-body"
          style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
        >
          Compatible with top global RC brands — Traxxas, HPI, Tamiya, and
          more.
        </p>

        {/* Brand badges */}
        <div className="flex flex-wrap gap-2 mt-6 justify-end">
          {["Traxxas", "HPI Racing", "Tamiya", "Arrma", "Kyosho"].map((brand) => (
            <span
              key={brand}
              className="font-body text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,140,0,0.06)",
                border: "1px solid rgba(255,140,0,0.18)",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.05em",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── POWER SECTION (65–85%) ────────────────────────────────
function PowerBeat({ progress }: { progress: number }) {
  const fadeIn = Math.min(progress / 0.25, 1);
  const fadeOut = progress > 0.75 ? (progress - 0.75) / 0.25 : 0;
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none"
      style={{ opacity }}
      id="power"
    >
      <div className="px-8 md:px-16 lg:px-24 max-w-xl">
        <div className="section-label mb-4">Power & Range</div>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.93)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          More Power.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Longer Runs.
          </span>
        </h2>

        <div className="divider mt-5 mb-5" />

        <p
          className="font-body mb-3"
          style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}
        >
          High-capacity LiPo packs deliver runtime that keeps up with your
          sessions.
        </p>
        <p
          className="font-body"
          style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
        >
          From brushed to brushless — we stock the performance upgrades you
          need.
        </p>

        {/* Power stats */}
        <div className="flex gap-8 mt-8">
          {[
            { value: "100+", label: "KM/H Top Speed" },
            { value: "2.4G", label: "Hz Signal" },
            { value: "500m", label: "Range" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                className="font-heading"
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </span>
              <span
                className="font-body"
                style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CTA SECTION (85–100%) ─────────────────────────────────
function CTABeat({ progress }: { progress: number }) {
  const fadeIn = Math.min(progress / 0.3, 1);
  const opacity = fadeIn;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      style={{ opacity }}
      id="cta"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,45,0,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="section-label mb-6">Kathmandu &bull; Lalitpur</div>

      <h2
        className="font-heading"
        style={{
          fontSize: "clamp(3rem, 9vw, 7.5rem)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.93)",
          textTransform: "uppercase",
        }}
      >
        Built for Nepal.
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Ready for Anywhere.
        </span>
      </h2>

      <p
        className="font-body mt-5 max-w-md"
        style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}
      >
        RC Toys Nepal — Kathmandu&rsquo;s home of Radio Control since day one.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10 items-center pointer-events-auto">
        {/* Primary CTA */}
        <a
          href="#"
          className="font-body font-semibold px-8 py-4 rounded-full text-white text-sm tracking-wide transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
            boxShadow: "0 8px 32px rgba(255,45,0,0.35)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 12px 48px rgba(255,45,0,0.55), 0 0 0 1px rgba(255,140,0,0.4)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 8px 32px rgba(255,45,0,0.35)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          Shop the Collection
        </a>

        {/* Secondary CTA */}
        <a
          href="#"
          className="font-body text-sm px-8 py-4 rounded-full transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.95)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
          }}
        >
          View Full Catalogue
        </a>
      </div>

      {/* Micro-copy */}
      <p
        className="font-body mt-8"
        style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.8, letterSpacing: "0.04em" }}
      >
        Visit us in Kathmandu &amp; Lalitpur &nbsp;&middot;&nbsp; rctoysnepal.com &nbsp;&middot;&nbsp; 9841194605 &nbsp;&middot;&nbsp; rctoysnepal@gmail.com
      </p>
    </div>
  );
}

// ── MAIN SCROLL ORCHESTRATOR ─────────────────────────────
export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    return smoothProgress.on("change", (v) => setScrollProgress(v));
  }, [smoothProgress]);

  // Progress for each beat
  const heroProg = useBeatProgress(scrollProgress, BEATS[0].start, BEATS[0].end);
  const engProg = useBeatProgress(scrollProgress, BEATS[1].start, BEATS[1].end);
  const techProg = useBeatProgress(scrollProgress, BEATS[2].start, BEATS[2].end);
  const powProg = useBeatProgress(scrollProgress, BEATS[3].start, BEATS[3].end);
  const ctaProg = useBeatProgress(scrollProgress, BEATS[4].start, BEATS[4].end);

  return (
    // Tall container — scroll distance = 400vh
    <div ref={containerRef} style={{ height: "500vh" }}>
      {/* Sticky fullscreen canvas + overlay */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        {/* Canvas */}
        <CanvasSequence scrollProgress={scrollProgress} />

        {/* Story beat overlays */}
        <div className="absolute inset-0" style={{ isolation: "isolate" }}>
          <HeroBeat progress={heroProg} />
          <EngineeringBeat progress={engProg} />
          <TechnologyBeat progress={techProg} />
          <PowerBeat progress={powProg} />
          <CTABeat progress={ctaProg} />
        </div>

        {/* Progress indicator — thin line at bottom */}
        <div
          className="absolute bottom-0 left-0 h-0.5"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #FF2D00, #FF8C00)",
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}
