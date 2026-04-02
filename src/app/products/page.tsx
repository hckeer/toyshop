import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductsClientPage from "@/components/ProductsClientPage";

export const metadata: Metadata = {
  title: "RC Toys Nepal — Shop All Products",
  description:
    "Browse Nepal's premier RC toy catalogue — cars, drones, crawlers, boats, parts, and accessories. Traxxas, Arrma, DJI, Axial, and more.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <ProductsClientPage />
    </>
  );
}
