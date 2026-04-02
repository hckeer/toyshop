"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ALL_PRODUCTS, PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/products";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const VoidShowcase = dynamic(() => import("@/components/VoidShowcase"), { ssr: false });

function CategoryFilter({
  active,
  onChange,
}: {
  active: ProductCategory;
  onChange: (c: ProductCategory) => void;
}) {
  return (
    <div
      className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-2 py-2"
      role="navigation"
      aria-label="Category filter"
    >
      {PRODUCT_CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="relative font-body text-xs px-4 py-2 rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #FF2D00, #FF8C00)"
                : "rgba(255,255,255,0.06)",
              border: isActive
                ? "1px solid transparent"
                : "1px solid rgba(255,255,255,0.08)",
              color: isActive ? "white" : "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function ProductCounter({
  active,
  total,
  category,
}: {
  active: number;
  total: number;
  category: ProductCategory;
}) {
  return (
    <div
      className="absolute top-20 right-6 z-30 text-right"
      aria-live="polite"
    >
      <p
        className="font-body text-xs"
        style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}
      >
        {category === "All"
          ? `${active + 1} / ${total} products`
          : `Showing ${category} · ${total} products`}
      </p>
    </div>
  );
}

export default function ProductsClientPage() {
  const [category, setCategory] = useState<ProductCategory>("All");
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const filtered = useMemo(() => {
    if (category === "All") return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  const handleCategoryChange = useCallback((cat: ProductCategory) => {
    setCategory(cat);
    setActiveProductIndex(0);
  }, []);

  return (
    <div className="relative w-full" style={{ height: "100vh", background: "#06080F" }}>
      {/* Category filter — floats below navbar */}
      <CategoryFilter active={category} onChange={handleCategoryChange} />

      {/* Counter — top right */}
      <ProductCounter
        active={activeProductIndex}
        total={filtered.length}
        category={category}
      />

      {/* Void showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <VoidShowcase products={filtered} showCTA={false} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
