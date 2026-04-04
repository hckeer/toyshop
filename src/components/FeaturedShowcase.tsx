"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import VoidShowcase from "@/components/VoidShowcase";
import type { Product } from "@/lib/supabase";
import type { ProductCategory as VoidProductCategory } from "@/lib/products";

interface FeaturedShowcaseProps {
  products: Product[]
}

export default function FeaturedShowcase({ products }: FeaturedShowcaseProps) {
  const router = useRouter();

  // Convert database products to VoidShowcase format
  const convertedProducts = useMemo(() => {
    return products.map(p => {
      const stockLabel = 
        p.stock_quantity === 0 ? "Out of Stock" :
        p.stock_quantity <= 3 ? `Last ${p.stock_quantity} left` :
        p.stock_quantity <= 5 ? `Last ${p.stock_quantity} left` :
        "In Stock";

      const specsString = p.specs.map(s => s.value).join(' · ');

      const ambientTints: Record<string, string> = {
        'RC Cars': '#FF2D00',
        'RC Trucks & Crawlers': '#6B7C3A',
        'RC Drones': '#4A90D9',
        'RC Boats': '#2D9CDB',
        'Spare Parts': '#95A5A6',
        'Accessories': '#FF6B00',
        'Batteries & Chargers': '#F39C12',
      };

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

  return (
    <section id="featured-collection" className="relative w-full h-screen z-10">
      <VoidShowcase
        products={convertedProducts as any}
        showCTA={true}
        onViewAll={() => router.push("/products")}
      />
    </section>
  );
}
