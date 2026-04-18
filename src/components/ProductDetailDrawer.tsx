"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { RCProduct } from "@/lib/products";
import { formatPrice } from "@/lib/products";

interface ProductDetailDrawerProps {
  product: RCProduct & {
    id: string;
    fullDescription?: string;
    inTheBox?: string[];
    allImages?: string[];
    productId?: string;
    rawSpecs?: { name: string; value: string }[];
  };
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}

export default function ProductDetailDrawer({
  product,
  isOpen,
  onClose,
  onBuyNow,
}: ProductDetailDrawerProps) {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.allImages?.length ? product.allImages : product.imageSrc ? [product.imageSrc] : [];

  // Reset image when product changes
  useEffect(() => {
    setActiveImg(0);
  }, [product.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Parse specsString back into pairs if needed, or use rawSpecs
  const specPairs: { name: string; value: string }[] =
    product.rawSpecs ||
    (product.specs
      ? product.specs
          .split(" · ")
          .map((s, i) => ({ name: `Spec ${i + 1}`, value: s }))
      : []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(6,8,15,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 8000,
            }}
          />

          {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(520px, 100vw)",
              background:
                "linear-gradient(175deg, rgba(14,16,28,0.99), rgba(8,9,18,1))",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              zIndex: 8001,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            role="complementary"
            aria-label={`Details for ${product.name}`}
          >
            {/* ── TOP BAR ── */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "rgba(8,9,18,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                className="font-body"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,45,0,0.75)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {product.categoryLabel}
              </p>
              <button
                onClick={onClose}
                aria-label="Close details"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* ── IMAGE GALLERY ── */}
            <div style={{ padding: "1.25rem 1.5rem 0" }}>
              {/* Main image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                  marginBottom: "0.75rem",
                }}
              >
                {images[activeImg] ? (
                  <Image
                    src={images[activeImg]}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain", padding: "0.5rem" }}
                    unoptimized
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.8rem" }}>
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    overflowX: "auto",
                    paddingBottom: "0.25rem",
                  }}
                >
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{
                        flexShrink: 0,
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.04)",
                        border: `2px solid ${i === activeImg ? "rgba(255,140,0,0.6)" : "rgba(255,255,255,0.08)"}`,
                        cursor: "pointer",
                        position: "relative",
                        transition: "border-color 0.2s",
                        padding: 0,
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── PRODUCT INFO ── */}
            <div style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
              {/* Name + Badge */}
              <div style={{ marginBottom: "0.5rem" }}>
                {product.badge && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.6rem",
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 4,
                      marginBottom: "0.4rem",
                      background: `${
                        product.badge === "NEW"
                          ? "rgba(0,196,255,0.12)"
                          : product.badge === "SALE"
                          ? "rgba(255,45,0,0.12)"
                          : product.badge === "BESTSELLER"
                          ? "rgba(255,140,0,0.12)"
                          : "rgba(170,68,255,0.12)"
                      }`,
                      border: `1px solid ${
                        product.badge === "NEW"
                          ? "rgba(0,196,255,0.35)"
                          : product.badge === "SALE"
                          ? "rgba(255,45,0,0.35)"
                          : product.badge === "BESTSELLER"
                          ? "rgba(255,140,0,0.35)"
                          : "rgba(170,68,255,0.35)"
                      }`,
                      color:
                        product.badge === "NEW"
                          ? "#00C4FF"
                          : product.badge === "SALE"
                          ? "#FF2D00"
                          : product.badge === "BESTSELLER"
                          ? "#FF8C00"
                          : "#AA44FF",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                <h2
                  className="font-heading"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.95)",
                    lineHeight: 1.1,
                    textTransform: "uppercase",
                  }}
                >
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  className="font-heading"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {formatPrice(product.priceNPR)}
                </span>
                {product.salePriceNPR && (
                  <span
                    className="font-body"
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(255,45,0,0.5)",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.salePriceNPR)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.fullDescription && (
                <p
                  className="font-body"
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.48)",
                    lineHeight: 1.75,
                    marginBottom: "1.5rem",
                  }}
                >
                  {product.fullDescription}
                </p>
              )}

              {/* Specs */}
              {specPairs.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.3)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Specifications
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    {specPairs.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 8,
                          padding: "0.6rem 0.85rem",
                        }}
                      >
                        <p
                          className="font-body"
                          style={{
                            fontSize: "0.65rem",
                            color: "rgba(255,255,255,0.3)",
                            letterSpacing: "0.07em",
                            marginBottom: "0.15rem",
                          }}
                        >
                          {s.name}
                        </p>
                        <p
                          className="font-body"
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.8)",
                            fontWeight: 600,
                          }}
                        >
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In The Box */}
              {product.inTheBox?.length ? (
                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.3)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                    }}
                  >
                    In The Box
                  </p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {product.inTheBox.map((item, i) => (
                      <li
                        key={i}
                        className="font-body"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          style={{ flexShrink: 0 }}
                        >
                          <circle
                            cx="6"
                            cy="6"
                            r="5"
                            stroke="rgba(255,140,0,0.45)"
                            strokeWidth="1"
                          />
                          <path
                            d="M3.5 6L5.5 8L8.5 4.5"
                            stroke="rgba(255,140,0,0.8)"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Stock */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <motion.div
                  animate={
                    product.stock !== "Out of Stock"
                      ? { scale: [1, 1.4, 1] }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      product.stock === "In Stock"
                        ? "#00C853"
                        : product.stock === "Out of Stock"
                        ? "rgba(255,45,0,0.6)"
                        : "#FF8C00",
                  }}
                />
                <span
                  className="font-body"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color:
                      product.stock === "In Stock"
                        ? "rgba(0,200,83,0.8)"
                        : product.stock === "Out of Stock"
                        ? "rgba(255,45,0,0.7)"
                        : "rgba(255,140,0,0.8)",
                  }}
                >
                  {product.stock}
                </span>
              </div>
            </div>

            {/* ── STICKY BUY BUTTON ── */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "rgba(8,9,18,0.97)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "1rem 1.5rem",
              }}
            >
              <button
                id="drawer-buy-now-btn"
                onClick={onBuyNow}
                className="font-body"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #FF2D00, #FF8C00)",
                  border: "none",
                  borderRadius: 999,
                  padding: "0.9rem",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(255,45,0,0.3)",
                  transition: "opacity 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                BUY NOW
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
