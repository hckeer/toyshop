"use client";

import { useEffect, useRef } from "react";

// SVG-based RC component fragments rendered as canvas shapes
// Each fragment type has a distinct visual geometry

type FragmentType = "tire" | "gear" | "chassis" | "pcb" | "rim" | "body" | "prop" | "link" | "wing" | "blade";

interface Fragment {
  id: number;
  type: FragmentType;
  x: number; // vw %
  y: number; // vh %
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  dRotX: number;
  dRotY: number;
  dRotZ: number;
  opacity: number;
  blur: number;
  tint: string;
  // For scatter animation
  scatterVx?: number;
  scatterVy?: number;
  isScattering?: boolean;
  returnProgress?: number;
}

interface AmbientFragmentsProps {
  tint: string;
  isTransitioning: boolean;
  fragmentTypes: FragmentType[];
}

const CORNER_POSITIONS = [
  { x: 8, y: 15 },   // top-left
  { x: 85, y: 12 },  // top-right
  { x: 6, y: 72 },   // bottom-left
  { x: 88, y: 75 },  // bottom-right
  { x: 10, y: 44 },  // mid-left
  { x: 88, y: 44 },  // mid-right
  { x: 35, y: 8 },   // top-center-left
  { x: 65, y: 85 },  // bottom-center-right
];

// Draws a single RC fragment type on a 2D canvas context
function drawFragment(
  ctx: CanvasRenderingContext2D,
  type: FragmentType,
  size: number,
  tint: string,
  rotZ: number,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.rotate(rotZ);

  const s = size;

  switch (type) {
    case "tire": {
      // Cross-section of a knobby tire — concentric circles with radial knobs
      const grad = ctx.createRadialGradient(0, 0, s * 0.25, 0, 0, s * 0.5);
      grad.addColorStop(0, "rgba(40,40,40,0.9)");
      grad.addColorStop(0.7, "rgba(25,25,25,0.95)");
      grad.addColorStop(1, "rgba(10,10,10,0.8)");
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(60,60,65,0.8)";
      ctx.fill();
      // Knobs
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(50,50,52,0.9)`;
        ctx.fillRect(-s * 0.04, s * 0.3, s * 0.08, s * 0.14);
        ctx.restore();
      }
      break;
    }
    case "gear": {
      // Hex gear — circle with teeth
      const gGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.45);
      gGrad.addColorStop(0, "rgba(140,145,155,0.9)");
      gGrad.addColorStop(1, "rgba(80,85,90,0.95)");
      ctx.beginPath();
      // Gear body
      const teeth = 8;
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (i / (teeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? s * 0.45 : s * 0.33;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = gGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30,30,32,0.95)";
      ctx.fill();
      break;
    }
    case "chassis": {
      // Angular chassis rail — elongated rectangle with holes
      ctx.fillStyle = "rgba(90,95,100,0.85)";
      ctx.fillRect(-s * 0.5, -s * 0.14, s, s * 0.28);
      // Lightening holes
      for (let i = 0; i < 3; i++) {
        ctx.clearRect(-s * 0.35 + i * s * 0.28, -s * 0.08, s * 0.14, s * 0.16);
      }
      // Edge highlight
      ctx.strokeStyle = "rgba(160,165,170,0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-s * 0.5, -s * 0.14, s, s * 0.28);
      break;
    }
    case "pcb": {
      // Circuit board fragment — green slab with trace lines
      ctx.fillStyle = "rgba(20,60,30,0.9)";
      ctx.fillRect(-s * 0.4, -s * 0.3, s * 0.8, s * 0.6);
      // Traces
      ctx.strokeStyle = "rgba(180,220,100,0.5)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s * 0.2 + i * s * 0.12);
        ctx.lineTo(s * 0.1, -s * 0.2 + i * s * 0.12);
        ctx.lineTo(s * 0.1, -s * 0.05 + i * s * 0.12);
        ctx.lineTo(s * 0.35, -s * 0.05 + i * s * 0.12);
        ctx.stroke();
      }
      // Solder pads
      ctx.fillStyle = "rgba(200,180,50,0.7)";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(s * 0.28, -s * 0.22 + i * s * 0.18, s * 0.06, s * 0.06);
      }
      break;
    }
    case "rim": {
      // Wheel rim cross-section — spokes
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180,185,195,0.85)";
      ctx.fill();
      // Spokes
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = "rgba(60,65,70,0.9)";
        ctx.fillRect(-s * 0.04, s * 0.12, s * 0.08, s * 0.3);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30,35,40,0.95)";
      ctx.fill();
      break;
    }
    case "body": {
      // Body panel shard — curved trapezoidal painted fragment
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, s * 0.2);
      ctx.lineTo(-s * 0.2, -s * 0.35);
      ctx.lineTo(s * 0.4, -s * 0.3);
      ctx.lineTo(s * 0.45, s * 0.15);
      ctx.closePath();
      const bGrad = ctx.createLinearGradient(-s * 0.4, -s * 0.3, s * 0.4, s * 0.2);
      bGrad.addColorStop(0, tint.replace(")", ",0.85)").replace("rgb", "rgba") || "rgba(200,40,10,0.85)");
      bGrad.addColorStop(0.4, "rgba(20,20,22,0.9)");
      bGrad.addColorStop(1, tint.replace(")", ",0.6)").replace("rgb", "rgba") || "rgba(180,30,5,0.6)");
      ctx.fillStyle = bGrad;
      ctx.fill();
      // Shine
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.25);
      ctx.lineTo(s * 0.1, -s * 0.28);
      ctx.lineTo(s * 0.08, -s * 0.1);
      ctx.lineTo(-s * 0.3, -s * 0.08);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fill();
      break;
    }
    case "prop": {
      // Drone propeller arc — two curved blades
      for (let b = 0; b < 2; b++) {
        ctx.save();
        ctx.rotate(b * Math.PI);
        ctx.beginPath();
        ctx.ellipse(s * 0.2, 0, s * 0.35, s * 0.1, 0.2, 0, Math.PI * 2);
        const pGrad = ctx.createLinearGradient(0, 0, s * 0.5, 0);
        pGrad.addColorStop(0, "rgba(40,40,44,0.95)");
        pGrad.addColorStop(1, "rgba(80,85,92,0.7)");
        ctx.fillStyle = pGrad;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150,155,165,0.9)";
      ctx.fill();
      break;
    }
    case "link": {
      // Suspension link — cylindrical rod
      ctx.fillStyle = "rgba(100,105,112,0.9)";
      ctx.fillRect(-s * 0.5, -s * 0.1, s, s * 0.2);
      // End caps
      ctx.beginPath();
      ctx.arc(-s * 0.5, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(60,65,70,0.95)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s * 0.5, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(60,65,70,0.95)";
      ctx.fill();
      break;
    }
    case "wing": {
      // RC buggy wing section
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.12);
      ctx.lineTo(-s * 0.5, -s * 0.02);
      ctx.lineTo(s * 0.5, -s * 0.18);
      ctx.lineTo(s * 0.5, s * 0.02);
      ctx.closePath();
      const wGrad = ctx.createLinearGradient(-s * 0.5, 0, s * 0.5, 0);
      wGrad.addColorStop(0, tint.replace(")", ",0.9)").replace("rgb", "rgba") || "rgba(200,80,0,0.9)");
      wGrad.addColorStop(1, "rgba(20,20,22,0.85)");
      ctx.fillStyle = wGrad;
      ctx.fill();
      // End plate
      ctx.fillStyle = "rgba(30,30,32,0.95)";
      ctx.fillRect(s * 0.45, -s * 0.2, s * 0.06, s * 0.26);
      break;
    }
    case "blade": {
      // Drone arm fragment with motor
      ctx.fillStyle = "rgba(30,30,32,0.95)";
      ctx.fillRect(-s * 0.45, -s * 0.06, s * 0.9, s * 0.12);
      ctx.beginPath();
      ctx.arc(s * 0.42, 0, s * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70,75,82,0.95)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s * 0.42, 0, s * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(140,145,155,0.9)";
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

// Offscreen canvas for each fragment for performance
function createFragmentCanvas(
  type: FragmentType,
  size: number,
  tint: string
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size * 2 + 20;
  c.height = size * 2 + 20;
  const ctx = c.getContext("2d")!;
  ctx.translate(size + 10, size + 10);
  drawFragment(ctx, type, size, tint, 0, 1);
  return c;
}

export default function AmbientFragments({
  tint,
  isTransitioning,
  fragmentTypes,
}: AmbientFragmentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<
    Array<{
      el: HTMLDivElement;
      rotX: number;
      rotY: number;
      rotZ: number;
      dRotX: number;
      dRotY: number;
      dRotZ: number;
      baseX: number;
      baseY: number;
      floatPhase: number;
      floatSpeed: number;
    }>
  >([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous fragments
    container.innerHTML = "";
    fragmentsRef.current = [];

    const count = Math.min(fragmentTypes.length * 2, 8);
    const positions = CORNER_POSITIONS.slice(0, count);

    positions.forEach((pos, i) => {
      const type = fragmentTypes[i % fragmentTypes.length];
      const size = 24 + Math.random() * 28;

      // Create canvas for fragment
      const offscreen = createFragmentCanvas(type, size, tint);

      // Create div wrapper with CSS 3D
      const div = document.createElement("div");
      div.style.cssText = `
        position: absolute;
        left: ${pos.x}%;
        top: ${pos.y}%;
        width: ${size * 2 + 20}px;
        height: ${size * 2 + 20}px;
        transform-style: preserve-3d;
        will-change: transform, opacity;
        filter: blur(${0.5 + Math.random() * 1.5}px);
        opacity: ${0.35 + Math.random() * 0.25};
        pointer-events: none;
      `;

      const img = document.createElement("img");
      img.src = offscreen.toDataURL();
      img.style.cssText = "width:100%;height:100%;";
      div.appendChild(img);
      container.appendChild(div);

      fragmentsRef.current.push({
        el: div,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
        rotZ: Math.random() * 360,
        dRotX: (Math.random() - 0.5) * 0.3,
        dRotY: (Math.random() - 0.5) * 0.4,
        dRotZ: (Math.random() - 0.5) * 0.25,
        baseX: pos.x,
        baseY: pos.y,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.003 + Math.random() * 0.004,
      });
    });

    const animate = () => {
      tRef.current += 1;
      fragmentsRef.current.forEach((f) => {
        f.rotX += f.dRotX;
        f.rotY += f.dRotY;
        f.rotZ += f.dRotZ;
        f.floatPhase += f.floatSpeed;

        const floatY = Math.sin(f.floatPhase) * 8;
        const floatX = Math.cos(f.floatPhase * 0.7) * 4;

        f.el.style.transform = `
          translate(${floatX}px, ${floatY}px)
          rotateX(${f.rotX}deg)
          rotateY(${f.rotY}deg)
          rotateZ(${f.rotZ}deg)
        `;
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [tint, fragmentTypes]);

  // Scatter on transition
  useEffect(() => {
    if (!isTransitioning) return;
    fragmentsRef.current.forEach((f) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 200;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      f.el.style.transition = "transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease";
      f.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg) scale(0.3)`;
      f.el.style.opacity = "0";
    });

    const timer = setTimeout(() => {
      fragmentsRef.current.forEach((f) => {
        f.el.style.transition = "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease";
        f.el.style.opacity = `${0.35 + Math.random() * 0.25}`;
      });
    }, 550);

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      aria-hidden="true"
    />
  );
}
