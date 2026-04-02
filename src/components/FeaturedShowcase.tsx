"use client";

import { useRouter } from "next/navigation";
import { FEATURED_PRODUCTS } from "@/lib/products";
import VoidShowcase from "@/components/VoidShowcase";

export default function FeaturedShowcase() {
  const router = useRouter();

  return (
    <section id="featured-collection" className="relative w-full h-screen z-10">
      <VoidShowcase
        products={FEATURED_PRODUCTS}
        showCTA={true}
        onViewAll={() => router.push("/products")}
      />
    </section>
  );
}
