import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductsClientPage from "@/components/ProductsClientPage";
import { getActiveProducts } from "@/lib/actions";

export const metadata: Metadata = {
  title: "RC Toys Nepal — Shop All Products",
  description:
    "Browse Nepal's premier RC toy catalogue — cars, drones, crawlers, boats, parts, and accessories. Traxxas, Arrma, DJI, Axial, and more.",
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Navbar />
      <ProductsClientPage products={products} />
    </>
  );
}
