"use client";

import { useEffect, useRef, useCallback } from "react";

const TOTAL_FRAMES = 240;

// Pad frame number to 3 digits
function frameSrc(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
}

interface CanvasSequenceProps {
  scrollProgress: number; // 0–1 representing scroll within sticky section
}

export default function CanvasSequence({ scrollProgress }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const loadingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(-1);

  // Preload images in batches for performance
  const preloadImages = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const loaded: boolean[] = new Array(TOTAL_FRAMES).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;

    // Load frame 0 first (hero frame), then batch load the rest
    const loadFrame = (i: number) => {
      const img = new Image();
      img.src = frameSrc(i + 1);
      img.onload = () => {
        loaded[i] = true;
        // Draw frame 0 as soon as it's ready
        if (i === 0) drawFrame(0);
      };
      images[i] = img;
    };

    // Load first frame immediately
    loadFrame(0);

    // Stagger the rest to not block main thread
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const idx = i;
      setTimeout(() => loadFrame(idx), Math.floor(idx / 20) * 16);
    }
  }, []);

  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !loadedRef.current[frameIdx]) return;

    const { width, height } = canvas;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient to match image (the images have dark grey vignette background)
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width * 0.7
    );
    grad.addColorStop(0, "#111114");
    grad.addColorStop(1, "#050505");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw image centered and cover
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW, drawH, drawX, drawY;
    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = imgAspect * height;
      drawX = (width - drawW) / 2;
      drawY = 0;
    } else {
      drawW = width;
      drawH = width / imgAspect;
      drawX = 0;
      drawY = (height - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Vignette overlay to blend edges perfectly
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.25,
      width / 2, height / 2, height * 0.75
    );
    vignette.addColorStop(0, "rgba(5,5,5,0)");
    vignette.addColorStop(1, "rgba(5,5,5,0.7)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Resize canvas to fill window
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current frame after resize
    const frameIdx = Math.round(scrollProgress * (TOTAL_FRAMES - 1));
    drawFrame(Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIdx)));
  }, [scrollProgress, drawFrame]);

  useEffect(() => {
    preloadImages();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [preloadImages, resizeCanvas]);

  // Animate to target frame on scroll
  useEffect(() => {
    const targetFrame = Math.round(scrollProgress * (TOTAL_FRAMES - 1));
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame));

    if (clamped === lastFrameRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      // If target frame isn't loaded, find nearest loaded frame
      let frameToShow = clamped;
      if (!loadedRef.current[clamped]) {
        // Search backward for nearest loaded frame
        for (let i = clamped - 1; i >= 0; i--) {
          if (loadedRef.current[i]) {
            frameToShow = i;
            break;
          }
        }
      }
      drawFrame(frameToShow);
      lastFrameRef.current = clamped;
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollProgress, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
