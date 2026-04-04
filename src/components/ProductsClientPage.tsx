"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/supabase";
import type { ProductCategory as VoidProductCategory } from "@/lib/products";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const VoidShowcase = dynamic(() => import("@/components/VoidShowcase"), { ssr: false });

type ProductCategory = 'All' | 'RC Cars' | 'RC Trucks & Crawlers' | 'RC Drones' | 'RC Boats' | 'Spare Parts' | 'Accessories' | 'Batteries & Chargers';

interface ProductsClientPageProps {
  products: Product[]
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'All',
  'RC Cars',
  'RC Trucks & Crawlers',
  'RC Drones',
  'RC Boats',
  'Spare Parts',
  'Accessories',
  'Batteries & Chargers',
];

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

export default function ProductsClientPage({ products }: ProductsClientPageProps) {
  const [category, setCategory] = useState<ProductCategory>("All");
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  // Convert database products to VoidShowcase format
  const convertedProducts = useMemo(() => {
    return products.map(p => {
      // Get stock label
      const stockLabel = 
        p.stock_quantity === 0 ? "Out of Stock" :
        p.stock_quantity <= 3 ? `Last ${p.stock_quantity} left` :
        p.stock_quantity <= 5 ? `Last ${p.stock_quantity} left` :
        "In Stock";

      // Format specs from array to string
      const specsString = p.specs.map(s => s.value).join(' · ');

      // Get ambient tint based on category
      const ambientTints: Record<string, string> = {
        'RC Cars': '#FF2D00',
        'RC Trucks & Crawlers': '#6B7C3A',
        'RC Drones': '#4A90D9',
        'RC Boats': '#2D9CDB',
        'Spare Parts': '#95A5A6',
        'Accessories': '#FF6B00',
        'Batteries & Chargers': '#F39C12',
      };

      // Get ambient objects based on category
      const ambientObjectsMap: Record<string, Array<"tire" | "gear" | "chassis" | "pcb" | "rim" | "body" | "prop" | "link" | "wing" | "blade">> = {
        'RC Cars': ['body', 'tire', 'chassis', 'rim'],
        'RC Trucks & Crawlers': ['tire', 'link', 'chassis', 'body'],
        'RC Drones': ['prop', 'pcb', 'blade'],
        'RC Boats': ['body', 'gear'],
        'Spare Parts': ['gear', 'tire', 'pcb'],
        'Accessories': ['gear', 'chassis'],
        'Batteries & Chargers': ['pcb', 'gear'],
      };

      return {
        id: p.slug,
        name: p.name,
        category: (p.category === 'RC Trucks & Crawlers' ? 'Trucks & Crawlers' : 
                  p.category === 'RC Drones' ? 'Drones' :
                  p.category === 'RC Boats' ? 'Boats' : 
                  p.category === 'Spare Parts' ? 'Parts' :  
                  p.category === 'Accessories' ? 'Accessories' :
                  p.category) as VoidProductCategory,
        categoryLabel: p.category,
        descriptor: p.short_descriptor || '',
        priceNPR: p.sale_price || p.regular_price,
        salePriceNPR: p.sale_price ? p.regular_price : undefined,
        image: p.images[0] || '',
        imageSrc: p.images[0] || '',
        stock: stockLabel as any,
        badge: p.badge !== 'none' ? p.badge.toUpperCase() as any : undefined,
        specs: specsString,
        ambientTint: ambientTints[p.category] || '#FF2D00',
        ambientObjects: ambientObjectsMap[p.category] || ['gear', 'tire'],
      };
    });
  }, [products]);

  const filtered = useMemo(() => {
    if (category === "All") return convertedProducts;
    return convertedProducts.filter((p) => p.categoryLabel === category);
  }, [category, convertedProducts]);

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
