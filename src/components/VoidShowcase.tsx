"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { RCProduct } from "@/lib/products";
import { formatPrice } from "@/lib/products";

const StarField = dynamic(() => import("./StarField"), { ssr: false });
const AmbientFragments = dynamic(() => import("./AmbientFragments"), { ssr: false });

// ── PRODUCT CANVAS RENDERER ──────────────────────────────
// Draws the product as a photorealistic 3D-style illustration
// Since we don't have real product photos with transparent backgrounds,
// this renders a stylized product card composited into the void
function ProductRenderer({ product, isHovered }: { product: RCProduct; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const productImgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);

  // Load real product image whenever imageSrc changes
  useEffect(() => {
    imgLoadedRef.current = false;
    productImgRef.current = null;

    const src = product.imageSrc;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      productImgRef.current = img;
      imgLoadedRef.current = true;
    };
    img.onerror = () => {
      imgLoadedRef.current = false;
      productImgRef.current = null;
    };
    img.src = src;
  }, [product.imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 520;

    const tint = product.ambientTint;

    const drawFrame = () => {
      tRef.current += 0.02;
      const t = tRef.current;
      const floatY = Math.sin(t * 0.8) * (isHovered ? 6 : 3);
      const hoverTiltX = isHovered ? Math.sin(t * 0.3) * 3 : 0; // subtle X oscillation on hover

      ctx.clearRect(0, 0, 600, 520);

      // Draw a stylized product silhouette based on category
      const cx = 300;
      const cy = 240 + floatY;

      // Ambient halo on hover
      if (isHovered) {
        const halo = ctx.createRadialGradient(cx, cy, 60, cx, cy, 220);
        halo.addColorStop(0, `${tint}18`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, 600, 520);
      }

      // Product body — real image if available, else category illustration
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((hoverTiltX * Math.PI) / 180);

      if (imgLoadedRef.current && productImgRef.current) {
        const img = productImgRef.current;
        const maxW = 390;
        const maxH = 310;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let drawW = maxW;
        let drawH = maxW / imgAspect;
        if (drawH > maxH) {
          drawH = maxH;
          drawW = maxH * imgAspect;
        }
        const drawX = -drawW / 2;
        const drawY = -drawH / 2;

        // Soft ambient glow behind the photo
        const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, Math.max(drawW, drawH) * 0.75);
        glow.addColorStop(0, `${tint}30`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(drawX - 50, drawY - 50, drawW + 100, drawH + 100);

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        drawProductBody(ctx, product, tint, t);
      }

      ctx.restore();

      // Reflective floor
      drawFloor(ctx, cx, cy + 160, product, tint);

      animRef.current = requestAnimationFrame(drawFrame);
    };

    animRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animRef.current);
  }, [product, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={520}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label={product.name}
    />
  );
}

function drawProductBody(
  ctx: CanvasRenderingContext2D,
  product: RCProduct,
  tint: string,
  t: number
) {
  const cat = product.category;

  if (cat === "Drones") {
    drawDroneBody(ctx, tint, t);
  } else if (cat === "Boats") {
    drawBoatBody(ctx, tint, t);
  } else if (cat === "Trucks & Crawlers") {
    drawCrawlerBody(ctx, tint, t);
  } else {
    drawRCCarBody(ctx, tint, t, cat === "RC Cars" ? product.categoryLabel : "RC CAR");
  }
}

function drawShadow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createRadialGradient(0, h / 2, 0, 0, h / 2, w / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.5)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.ellipse(0, h / 2 + 10, w * 0.55, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRCCarBody(ctx: CanvasRenderingContext2D, tint: string, t: number, label: string) {
  // Body shell
  const bodyGrad = ctx.createLinearGradient(-130, -80, 130, 80);
  bodyGrad.addColorStop(0, tint + "FF");
  bodyGrad.addColorStop(0.5, tint + "CC");
  bodyGrad.addColorStop(1, "rgba(15,15,18,0.95)");

  // Chassis base
  ctx.fillStyle = "rgba(30,32,36,0.95)";
  ctx.fillRect(-150, 40, 300, 35);

  // Body shell
  ctx.beginPath();
  ctx.moveTo(-155, 50);
  ctx.lineTo(-145, -20);
  ctx.lineTo(-90, -70);
  ctx.lineTo(-20, -95);
  ctx.lineTo(60, -90);
  ctx.lineTo(140, -55);
  ctx.lineTo(158, 10);
  ctx.lineTo(155, 50);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Windshield
  ctx.beginPath();
  ctx.moveTo(-30, -90);
  ctx.lineTo(55, -88);
  ctx.lineTo(110, -40);
  ctx.lineTo(60, -42);
  ctx.lineTo(-10, -44);
  ctx.closePath();
  ctx.fillStyle = "rgba(120,180,220,0.35)";
  ctx.fill();
  ctx.strokeStyle = "rgba(200,220,255,0.15)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Racing stripe
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-155, 50);
  ctx.lineTo(-145, -20);
  ctx.lineTo(158, -20);
  ctx.lineTo(155, 50);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(-160, -5, 330, 25);
  ctx.restore();

  // Number/logo on body
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "bold 28px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("105", -55, -35);

  // Wheels — 4 wheels
  [[-120, 20], [-120, 55], [110, 20], [110, 55]].forEach(([wx, wy], i) => {
    const r = i < 2 ? 42 : 40;
    // Tire
    ctx.beginPath();
    ctx.arc(wx, wy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18,18,20,0.98)";
    ctx.fill();
    // Rim
    ctx.beginPath();
    ctx.arc(wx, wy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(150,155,165,0.9)";
    ctx.fill();
    // Spokes
    for (let s = 0; s < 5; s++) {
      const sa = (s / 5) * Math.PI * 2 + t * 0.5;
      ctx.beginPath();
      ctx.moveTo(wx + Math.cos(sa) * r * 0.15, wy + Math.sin(sa) * r * 0.15);
      ctx.lineTo(wx + Math.cos(sa) * r * 0.5, wy + Math.sin(sa) * r * 0.5);
      ctx.strokeStyle = "rgba(40,42,46,0.95)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    // Hub
    ctx.beginPath();
    ctx.arc(wx, wy, r * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200,205,215,0.9)";
    ctx.fill();
    // Tread knobs
    for (let k = 0; k < 12; k++) {
      const ka = (k / 12) * Math.PI * 2 + t * 0.3;
      ctx.save();
      ctx.translate(wx + Math.cos(ka) * r * 0.88, wy + Math.sin(ka) * r * 0.88);
      ctx.rotate(ka);
      ctx.fillStyle = "rgba(30,30,32,0.95)";
      ctx.fillRect(-2, -4, 4, 8);
      ctx.restore();
    }
  });

  // Spoiler
  ctx.fillStyle = "rgba(25,25,28,0.95)";
  ctx.fillRect(110, -110, 45, 10);
  ctx.fillRect(132, -110, 4, 45);
  ctx.fillRect(110, -70, 45, 6);
}

function drawCrawlerBody(ctx: CanvasRenderingContext2D, tint: string, t: number) {
  // Boxy Jeep-style crawler
  const bodyGrad = ctx.createLinearGradient(-140, -90, 140, 60);
  bodyGrad.addColorStop(0, tint + "DD");
  bodyGrad.addColorStop(1, "rgba(20,22,18,0.95)");

  // Chassis
  ctx.fillStyle = "rgba(25,28,22,0.95)";
  ctx.fillRect(-145, 45, 290, 30);

  // Body — boxy Jeep shape
  ctx.beginPath();
  ctx.moveTo(-145, 50);
  ctx.lineTo(-140, -80);
  ctx.lineTo(-120, -100);
  ctx.lineTo(110, -100);
  ctx.lineTo(135, -80);
  ctx.lineTo(145, 50);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Windows
  [[-110, -95, 70, 55], [15, -95, 70, 55]].forEach(([wx, wy, ww, wh]) => {
    ctx.fillStyle = "rgba(80,120,100,0.3)";
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = "rgba(60,80,60,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(wx, wy, ww, wh);
  });

  // Snorkel
  ctx.fillStyle = "rgba(20,22,18,0.9)";
  ctx.fillRect(128, -100, 8, 80);

  // Rock rails
  ctx.fillStyle = "rgba(80,82,80,0.9)";
  ctx.fillRect(-150, 15, 300, 8);

  // Big crawler wheels
  [[-110, 30], [110, 30]].forEach(([wx, wy], i) => {
    const r = 55;
    ctx.beginPath();
    ctx.arc(wx, wy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18,20,14,0.98)";
    ctx.fill();
    // Deep lugs
    for (let k = 0; k < 10; k++) {
      const ka = (k / 10) * Math.PI * 2 + t * 0.2;
      ctx.save();
      ctx.translate(wx + Math.cos(ka) * r * 0.85, wy + Math.sin(ka) * r * 0.85);
      ctx.rotate(ka);
      ctx.fillStyle = "rgba(30,32,25,0.95)";
      ctx.fillRect(-3, -6, 6, 12);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(wx, wy, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(60,65,55,0.95)";
    ctx.fill();
  });
}

function drawDroneBody(ctx: CanvasRenderingContext2D, tint: string, t: number) {
  // Quadcopter top-angle perspective

  // Central body hub
  const grad = ctx.createRadialGradient(0, -10, 0, 0, -10, 80);
  grad.addColorStop(0, "rgba(50,55,62,0.98)");
  grad.addColorStop(1, "rgba(20,22,26,0.95)");

  ctx.beginPath();
  ctx.roundRect(-55, -45, 110, 70, 12);
  ctx.fillStyle = grad;
  ctx.fill();

  // Camera gimbal
  ctx.beginPath();
  ctx.arc(-10, 25, 22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,32,36,0.98)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-10, 25, 13, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(5,5,8,0.99)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-10, 25, 8, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80,90,120,0.5)";
  ctx.fill();

  // Arms — 4 directions
  const armAngles = [-45, 45, 135, -135];
  armAngles.forEach((ang) => {
    const rad = (ang * Math.PI) / 180;
    const ax = Math.cos(rad) * 140;
    const ay = Math.sin(rad) * 90;

    // Arm
    ctx.save();
    ctx.translate(ax * 0.5, ay * 0.5);
    ctx.rotate(rad);
    ctx.fillStyle = "rgba(30,32,36,0.95)";
    ctx.fillRect(-70, -5, 140, 10);
    ctx.restore();

    // Motor hub at end
    ctx.beginPath();
    ctx.arc(ax, ay, 18, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(50,52,58,0.98)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax, ay, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(80,85,95,0.95)";
    ctx.fill();

    // Spinning props
    const propRot = t * 8 + ang;
    for (let p = 0; p < 2; p++) {
      const pr = (p / 2) * Math.PI + propRot;
      const pGrad = ctx.createLinearGradient(
        ax + Math.cos(pr) * 50, ay + Math.sin(pr) * 20,
        ax - Math.cos(pr) * 50, ay - Math.sin(pr) * 20
      );
      pGrad.addColorStop(0, "rgba(40,42,48,0.92)");
      pGrad.addColorStop(1, "rgba(60,65,72,0.6)");
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(pr);
      ctx.beginPath();
      ctx.ellipse(30, 0, 48, 7, 0.15, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  });

  // LED strips
  ctx.fillStyle = tint + "BB";
  ctx.fillRect(-50, -44, 100, 3);
}

function drawBoatBody(ctx: CanvasRenderingContext2D, tint: string, t: number) {
  // Speedboat hull side view
  const hullGrad = ctx.createLinearGradient(-180, -40, 180, 60);
  hullGrad.addColorStop(0, tint + "EE");
  hullGrad.addColorStop(0.6, tint + "99");
  hullGrad.addColorStop(1, "rgba(15,15,18,0.98)");

  // Hull
  ctx.beginPath();
  ctx.moveTo(-190, 20);
  ctx.lineTo(-150, -50);
  ctx.lineTo(80, -55);
  ctx.lineTo(200, -10);
  ctx.lineTo(190, 40);
  ctx.lineTo(-170, 40);
  ctx.closePath();
  ctx.fillStyle = hullGrad;
  ctx.fill();

  // Deck
  ctx.beginPath();
  ctx.moveTo(-145, -48);
  ctx.lineTo(78, -53);
  ctx.lineTo(195, -8);
  ctx.lineTo(-150, -48);
  ctx.fillStyle = "rgba(240,240,255,0.06)";
  ctx.fill();

  // Cockpit
  ctx.fillStyle = "rgba(20,22,26,0.92)";
  ctx.fillRect(-80, -55, 120, 25);
  ctx.fillStyle = "rgba(80,130,200,0.25)";
  ctx.fillRect(-70, -52, 100, 20);

  // Wake/water effect
  const wakeOff = Math.sin(t * 2) * 3;
  for (let w = 0; w < 4; w++) {
    ctx.beginPath();
    ctx.moveTo(180 + w * 10, 35 + wakeOff);
    ctx.lineTo(240 + w * 15, 35 + wakeOff + w * 2);
    ctx.strokeStyle = `rgba(120,180,220,${0.15 - w * 0.03})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawFloor(
  ctx: CanvasRenderingContext2D,
  cx: number,
  fy: number,
  product: RCProduct,
  tint: string
) {
  // Reflective floor — scaleY(-1) perspective illusion using gradient
  ctx.save();
  ctx.translate(cx, fy);

  // Floor plane
  const floorGrad = ctx.createLinearGradient(0, 0, 0, 80);
  floorGrad.addColorStop(0, `${tint}08`);
  floorGrad.addColorStop(0.5, "rgba(6,8,15,0.04)");
  floorGrad.addColorStop(1, "rgba(6,8,15,0)");

  ctx.beginPath();
  ctx.ellipse(0, 0, 180, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = floorGrad;
  ctx.fill();

  // Reflection — blurred product outline
  ctx.save();
  ctx.scale(1, -0.15);
  ctx.translate(0, 40);
  ctx.globalAlpha = 0.12;
  ctx.filter = "blur(4px)";

  // Simple silhouette
  const cat = product.category;
  if (cat === "Boats") {
    ctx.beginPath();
    ctx.ellipse(0, 0, 160, 25, 0, 0, Math.PI);
    ctx.fillStyle = tint || "#FF2D00";
    ctx.fill();
  } else if (cat === "Drones") {
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(50,55,65,0.8)";
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 0, 150, 35, 0, 0, Math.PI);
    ctx.fillStyle = tint || "#FF2D00";
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
}

// ── BADGE ──────────────────────────────────────────────
function Badge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    NEW: "#00C4FF",
    BESTSELLER: "#FF8C00",
    SALE: "#FF2D00",
    LIMITED: "#AA44FF",
  };
  return (
    <span
      className="font-body text-xs px-2.5 py-1 rounded-sm font-semibold tracking-widest"
      style={{
        background: `${colors[type]}22`,
        border: `1px solid ${colors[type]}55`,
        color: colors[type],
        letterSpacing: "0.2em",
        fontSize: "0.6rem",
      }}
    >
      {type}
    </span>
  );
}

// ── DIAMOND DOT NAV ─────────────────────────────────────
function DiamondNav({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-0" role="tablist" aria-label="Product navigation">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && (
            <div
              style={{
                width: 28,
                height: 1,
                background:
                  i <= active
                    ? "linear-gradient(90deg, rgba(255,45,0,0.5), rgba(255,140,0,0.3))"
                    : "rgba(255,255,255,0.12)",
              }}
            />
          )}
          <button
            role="tab"
            aria-selected={i === active}
            aria-label={`Product ${i + 1}`}
            onClick={() => onSelect(i)}
            className="relative flex items-center justify-center transition-all duration-300 focus:outline-none"
            style={{ width: 20, height: 20, padding: 4 }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              style={{
                transform: `scale(${i === active ? 1.3 : 1})`,
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <rect
                x="1"
                y="1"
                width="8"
                height="8"
                rx="1"
                transform="rotate(45 5 5)"
                fill={i === active ? "white" : "none"}
                stroke={i === active ? "white" : "rgba(255,255,255,0.35)"}
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── COPY BLOCK ──────────────────────────────────────────
function CopyBlock({ product, visible }: { product: RCProduct; visible: boolean }) {
  const copyVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: delay * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={product.id}
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Category */}
          <motion.div custom={0} variants={copyVariants} className="flex items-center gap-3">
            {product.badge && <Badge type={product.badge} />}
            <span
              className="font-body text-xs tracking-widest uppercase font-semibold"
              style={{ color: "rgba(255,45,0,0.75)", letterSpacing: "0.2em" }}
            >
              {product.categoryLabel}
            </span>
          </motion.div>

          {/* Product name */}
          <motion.h2
            custom={1}
            variants={copyVariants}
            className="font-heading"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.94)",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </motion.h2>

          {/* Descriptor */}
          <motion.p
            custom={2}
            variants={copyVariants}
            className="font-body max-w-xs"
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.7,
            }}
          >
            {product.descriptor}
          </motion.p>

          {/* Price */}
          <motion.div custom={3} variants={copyVariants} className="flex items-baseline gap-3 mt-1">
            <span
              className="font-heading"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatPrice(product.priceNPR)}
            </span>
            {product.salePriceNPR && (
              <span
                className="font-heading"
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,45,0,0.5)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.salePriceNPR)}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── PRODUCT STAGE ────────────────────────────────────────
// Entry / exit animation for the main product
const productVariants = {
  enterLeft: {
    initial: { x: -200, rotateY: -25, opacity: 0, scale: 1.1 },
    animate: {
      x: 0, rotateY: 0, opacity: 1, scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      x: 200, rotateY: 20, opacity: 0, scale: 0.9,
      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
    },
  },
  enterRight: {
    initial: { x: 200, rotateY: 25, opacity: 0, scale: 1.1 },
    animate: {
      x: 0, rotateY: 0, opacity: 1, scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      x: -200, rotateY: -20, opacity: 0, scale: 0.9,
      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
    },
  },
};

// ── INTRO OVERLAY ────────────────────────────────────────
function IntroOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(2px)" }}
    >
      {/* Brand eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
        className="font-body text-xs font-semibold tracking-widest mb-6"
        style={{ color: "rgba(255,45,0,0.8)", letterSpacing: "0.25em" }}
      >
        RC TOYS NEPAL
      </motion.div>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
        className="font-heading"
        style={{
          fontSize: "clamp(4rem, 14vw, 11rem)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 0.88,
          color: "rgba(255,255,255,0.95)",
          textTransform: "uppercase",
        }}
      >
        THE
        <br />
        COLLECTION
      </motion.h1>

      {/* Navigation hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.5 } }}
        className="flex items-center gap-3 mt-8 mb-2"
      >
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
          <path d="M4 8H2M30 8H28M8 8h16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="10" y="2" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.9, duration: 0.5 } }}
        className="font-body text-xs tracking-widest mb-8"
        style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}
      >
        SCROLL TO EXPLORE
      </motion.p>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.5 } }}
        onClick={onDismiss}
        className="font-body text-sm tracking-widest px-10 py-4 uppercase transition-all duration-300 focus:outline-none"
        style={{
          border: "1px solid rgba(255,255,255,0.3)",
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.2em",
          background: "transparent",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
        }}
      >
        EXPLORE NOW
      </motion.button>
    </motion.div>
  );
}

// ── SPOTLIGHT ────────────────────────────────────────────
function GodRaySpotlight({ dimmed }: { dimmed: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 35% 55% at 50% 0%, rgba(255,255,255,${dimmed ? 0.03 : 0.07}) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,140,0,${dimmed ? 0.01 : 0.025}) 0%, transparent 65%)
        `,
        transition: "all 0.5s ease",
      }}
      aria-hidden="true"
    />
  );
}

// ── EDGE ARROWS ──────────────────────────────────────────
function EdgeArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-300 focus:outline-none"
      style={{
        [direction]: "1.5rem",
        opacity: hovered ? 0.75 : 0.15,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "1rem",
      }}
      aria-label={direction === "left" ? "Previous product" : "Next product"}
    >
      <svg width="28" height="48" viewBox="0 0 28 48" fill="none">
        <path
          d={direction === "left" ? "M20 4L4 24L20 44" : "M8 4L24 24L8 44"}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ── MAIN VOID SHOWCASE ───────────────────────────────────
interface VoidShowcaseProps {
  products: RCProduct[];
  showCTA?: boolean; // home page shows CTA, products page doesn't
  onViewAll?: () => void;
}

type Direction = "left" | "right";

export default function VoidShowcase({ products, showCTA = false, onViewAll }: VoidShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("right");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [productsSeen, setProductsSeen] = useState(0);
  const [copyVisible, setCopyVisible] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const navigate = useCallback(
    (dir: Direction) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setDirection(dir);
      setCopyVisible(false);

      setTimeout(() => {
        setActiveIndex((prev) => {
          const next =
            dir === "right"
              ? (prev + 1) % products.length
              : (prev - 1 + products.length) % products.length;
          setProductsSeen((s) => Math.max(s, next + 1));
          return next;
        });
        setCopyVisible(true);
        setTimeout(() => setIsTransitioning(false), 700);
      }, 550);
    },
    [isTransitioning, products.length]
  );

  const goToIndex = useCallback(
    (i: number) => {
      if (i === activeIndex || isTransitioning) return;
      setDirection(i > activeIndex ? "right" : "left");
      setIsTransitioning(true);
      setCopyVisible(false);
      setTimeout(() => {
        setActiveIndex(i);
        setProductsSeen((s) => Math.max(s, i + 1));
        setCopyVisible(true);
        setTimeout(() => setIsTransitioning(false), 700);
      }, 550);
    },
    [activeIndex, isTransitioning]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate("right");
      if (e.key === "ArrowLeft") navigate("left");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? "right" : "left");
    touchStartX.current = null;
  };

  const product = products[activeIndex];
  const vars = direction === "right" ? productVariants.enterLeft : productVariants.enterRight;

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "100vh",
        background: "#06080F",
        cursor: isHovered ? "none" : "default",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stars */}
      <StarField />

      {/* God-ray spotlight */}
      <GodRaySpotlight dimmed={isTransitioning} />

      {/* Ambient RC fragments */}
      <AmbientFragments
        tint={product.ambientTint}
        isTransitioning={isTransitioning}
        fragmentTypes={product.ambientObjects}
      />

      {/* Edge arrows */}
      {!showIntro && (
        <>
          <EdgeArrow direction="left" onClick={() => navigate("left")} />
          <EdgeArrow direction="right" onClick={() => navigate("right")} />
        </>
      )}

      {/* ── PRODUCT CANVAS CENTER ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative"
          style={{
            width: "min(52vw, 600px)",
            height: "min(48vh, 520px)",
            marginTop: "-4vh",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={product.id}
              custom={direction}
              initial={vars.initial}
              animate={vars.animate}
              exit={vars.exit}
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              <ProductRenderer product={product} isHovered={isHovered} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM-LEFT COPY BLOCK ── */}
      {!showIntro && (
        <div
          className="absolute bottom-0 left-0 z-20 p-8 md:p-12"
          style={{ maxWidth: "min(480px, 45vw)" }}
        >
          <CopyBlock product={product} visible={copyVisible} />
          {/* CTA (home page only, shown after 2+ products seen) */}
          {showCTA && productsSeen >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2 mt-5"
            >
              <a
                href="#"
                className="font-body inline-flex items-center justify-center w-fit px-6 py-3 text-sm font-medium tracking-wide text-white rounded-full transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
                  boxShadow: "0 6px 24px rgba(255,45,0,0.3)",
                  letterSpacing: "0.04em",
                }}
              >
                Shop Now
              </a>
              {onViewAll && (
                <button
                  onClick={onViewAll}
                  className="font-body text-xs text-left transition-colors pt-1"
                  style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  View Full Collection →
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* ── BOTTOM-RIGHT SPECS & STOCK ── */}
      {!showIntro && (
        <motion.div
          key={product.id + "-specs"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="absolute bottom-0 right-0 z-20 p-8 md:p-12 text-right"
        >
          <p
            className="font-body text-xs tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em" }}
          >
            {product.specs}
          </p>
          <div className="flex items-center justify-end gap-2">
            {product.stock !== "Out of Stock" && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    product.stock === "In Stock"
                      ? "#00C853"
                      : "#FF8C00",
                }}
              />
            )}
            <span
              className="font-body text-xs"
              style={{
                color:
                  product.stock === "In Stock"
                    ? "rgba(0,200,83,0.7)"
                    : product.stock === "Out of Stock"
                    ? "rgba(255,45,0,0.6)"
                    : "rgba(255,140,0,0.7)",
                letterSpacing: "0.08em",
              }}
            >
              {product.stock}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── BOTTOM-CENTER DOT NAV ── */}
      {!showIntro && (
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
          <DiamondNav
            count={products.length}
            active={activeIndex}
            onSelect={goToIndex}
          />
        </div>
      )}

      {/* ── INTRO OVERLAY ── */}
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay onDismiss={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none h-48"
        style={{
          background: "linear-gradient(to top, rgba(6,8,15,0.8), transparent)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
