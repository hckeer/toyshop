// RC Toys Nepal — Product Data
// Used by both the home-page featured showcase and the /products catalogue

export type ProductBadge = "NEW" | "BESTSELLER" | "SALE" | "LIMITED";
export type ProductCategory =
  | "All"
  | "RC Cars"
  | "Trucks & Crawlers"
  | "Drones"
  | "Boats"
  | "Parts"
  | "Accessories";

export interface RCProduct {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string; // short label for the UI, e.g. "RC CAR"
  descriptor: string;
  priceNPR: number;
  salePriceNPR?: number; // original price if on sale
  badge?: ProductBadge;
  specs: string; // e.g. "Brushless · 60km/h · 2.4GHz"
  stock: "In Stock" | "Last 3 left" | "Last 5 left" | "Out of Stock";
  // Ambient fragment theme colors
  ambientTint: string; // CSS color for ambient object tinting
  // Image path (will fall back to a placeholder canvas render)
  imageSrc?: string;
  // Which type of ambient objects float in the periphery
  ambientObjects: Array<"tire" | "gear" | "chassis" | "pcb" | "rim" | "body" | "prop" | "link" | "wing" | "blade">;
}

export const FEATURED_PRODUCTS: RCProduct[] = [
  {
    id: "traxxas-slash-4x4",
    name: "Traxxas Slash 4×4",
    category: "RC Cars",
    categoryLabel: "RC CAR",
    descriptor:
      "The most popular RC short course truck on the planet. Brushless power, 60km/h, built for any terrain.",
    priceNPR: 28500,
    badge: "NEW",
    specs: "Brushless · 60km/h · 2.4GHz · 1:10",
    stock: "In Stock",
    ambientTint: "#FF2D00",
    ambientObjects: ["body", "tire", "chassis", "rim"],
  },
  {
    id: "dji-mini-4-pro",
    name: "DJI Mini 4 Pro",
    category: "Drones",
    categoryLabel: "DRONE",
    descriptor:
      "4K/60fps, 34-minute flight time, obstacle avoidance in all directions. The sky is yours.",
    priceNPR: 95000,
    badge: "NEW",
    specs: "4K/60fps · 34min · 0–100m/s",
    stock: "Last 3 left",
    ambientTint: "#4A90D9",
    ambientObjects: ["prop", "pcb", "blade"],
  },
  {
    id: "axial-scx10-iii",
    name: "Axial SCX10 III Jeep JL",
    category: "Trucks & Crawlers",
    categoryLabel: "CRAWLER",
    descriptor:
      "Scale-accurate Jeep Wrangler body, portal axles, and a 3-link suspension set-up that conquers any rock.",
    priceNPR: 34000,
    badge: "BESTSELLER",
    specs: "Brushed · Portals · 1:10 Scale",
    stock: "In Stock",
    ambientTint: "#6B7C3A",
    ambientObjects: ["tire", "link", "chassis", "body"],
  },
  {
    id: "arrma-typhon-4x4",
    name: "Arrma Typhon 4×4 Mega",
    category: "RC Cars",
    categoryLabel: "RC BUGGY",
    descriptor:
      "1:8 scale, brushless fury hitting 80km/h, and a chassis engineered to take abuse and beg for more.",
    priceNPR: 38000,
    salePriceNPR: 42000,
    badge: "SALE",
    specs: "Brushless · 80km/h · 2.4GHz · 1:8",
    stock: "Last 5 left",
    ambientTint: "#FF6B00",
    ambientObjects: ["body", "tire", "wing", "rim"],
  },
  {
    id: "wltoys-144001",
    name: "WLtoys 144001",
    category: "RC Cars",
    categoryLabel: "RC CAR",
    descriptor:
      "Nepal's best-selling RC car. 60km/h, full 4WD drivetrain, and ready to run straight out of the box.",
    priceNPR: 5500,
    badge: "BESTSELLER",
    specs: "Brushed · 60km/h · 4WD · 1:14",
    stock: "In Stock",
    ambientTint: "#FF2D00",
    ambientObjects: ["body", "tire", "gear", "chassis"],
  },
];

export const ALL_PRODUCTS: RCProduct[] = [
  ...FEATURED_PRODUCTS,
  // RC Cars
  {
    id: "traxxas-rustler-4x4",
    name: "Traxxas Rustler 4×4",
    category: "RC Cars",
    categoryLabel: "RC STADIUM TRUCK",
    descriptor: "360° flips, wheelies, and full 4WD traction. Stadium-class, trail-capable.",
    priceNPR: 24000,
    specs: "Brushed · 50km/h · 2.4GHz · 1:10",
    stock: "In Stock",
    ambientTint: "#FF2D00",
    ambientObjects: ["tire", "body", "chassis"],
  },
  {
    id: "zd-racing-dbx-10",
    name: "ZD Racing DBX-10",
    category: "RC Cars",
    categoryLabel: "RC DESERT BUGGY",
    descriptor: "Full aluminium chassis, oil-filled shocks, waterproof electronics — built for the mountains.",
    priceNPR: 18000,
    specs: "Brushless · 75km/h · 1:10",
    stock: "In Stock",
    ambientTint: "#E07B00",
    ambientObjects: ["body", "tire", "wing", "chassis"],
  },
  {
    id: "hsp-94107",
    name: "HSP Nitro Buggy",
    category: "RC Cars",
    categoryLabel: "NITRO RC",
    descriptor: "Real nitro engine, pull-start, and the sound of raw horsepower. Nothing else comes close.",
    priceNPR: 16500,
    specs: "Nitro 18 Engine · 50km/h · 2CH",
    stock: "Last 3 left",
    ambientTint: "#CC4400",
    ambientObjects: ["gear", "chassis", "body", "tire"],
  },
  {
    id: "wltoys-12428",
    name: "WLtoys 12428 Crawler",
    category: "Trucks & Crawlers",
    categoryLabel: "RC SUV",
    descriptor: "Short wheelbase, high clearance, 4WD. Goes anywhere you aim it.",
    priceNPR: 4500,
    specs: "Brushed · 40km/h · 4WD · 1:12",
    stock: "In Stock",
    ambientTint: "#3A7A3A",
    ambientObjects: ["tire", "link", "body"],
  },
  // Trucks & Crawlers
  {
    id: "traxxas-trx4",
    name: "Traxxas TRX-4 Defender",
    category: "Trucks & Crawlers",
    categoryLabel: "TRAIL TRUCK",
    descriptor: "Dual-speed transmission, locking differentials, and a Land Rover Defender body. Scale perfection.",
    priceNPR: 52000,
    badge: "NEW",
    specs: "Brushed · Portal Axles · Dual-Speed",
    stock: "In Stock",
    ambientTint: "#4A7A4A",
    ambientObjects: ["link", "tire", "chassis", "body"],
  },
  {
    id: "rc4wd-gelande-ii",
    name: "RC4WD Gelände II",
    category: "Trucks & Crawlers",
    categoryLabel: "SCALE CRAWLER",
    descriptor: "The gold standard of 1:10 scale crawling. Leaf springs, coilovers, and obsessive scale detail.",
    priceNPR: 45000,
    specs: "Brushed · 1:10 · Leaf Spring",
    stock: "Last 5 left",
    ambientTint: "#5A6A3A",
    ambientObjects: ["link", "tire", "chassis"],
  },
  // Drones
  {
    id: "dji-air-3",
    name: "DJI Air 3",
    category: "Drones",
    categoryLabel: "DRONE",
    descriptor: "Dual cameras, 46-minute flight time, and HDR video that rivals cinema-grade equipment.",
    priceNPR: 145000,
    specs: "4K HDR · 46min · Omnidirectional",
    stock: "In Stock",
    ambientTint: "#3A5A9A",
    ambientObjects: ["prop", "pcb", "blade"],
  },
  {
    id: "syma-x500-pro",
    name: "Syma X500 Pro",
    category: "Drones",
    categoryLabel: "BEGINNER DRONE",
    descriptor: "4K EIS, GPS return-to-home, and one-key landing. Your first professional-grade flight.",
    priceNPR: 18500,
    specs: "4K EIS · GPS · 25min",
    stock: "In Stock",
    ambientTint: "#2A4A8A",
    ambientObjects: ["prop", "pcb", "blade"],
  },
  {
    id: "dji-fpv-combo",
    name: "DJI FPV Combo",
    category: "Drones",
    categoryLabel: "FPV DRONE",
    descriptor: "140km/h, 0–100 in 2 seconds. The most immersive flying experience you can buy.",
    priceNPR: 125000,
    badge: "LIMITED",
    specs: "140km/h · 0–100 in 2s · 1080P/60fps",
    stock: "Last 3 left",
    ambientTint: "#6A3ACA",
    ambientObjects: ["prop", "blade", "pcb"],
  },
  // Boats
  {
    id: "feilun-ft011",
    name: "Feilun FT011 Speedboat",
    category: "Boats",
    categoryLabel: "RC BOAT",
    descriptor: "65cm hull, brushless motor, water-cooled. Dominates any lake surface at 55km/h.",
    priceNPR: 12500,
    specs: "Brushless · 55km/h · 2.4GHz",
    stock: "In Stock",
    ambientTint: "#1A6A9A",
    ambientObjects: ["gear", "pcb", "chassis"],
  },
  {
    id: "pro-boat-zelos-48",
    name: "Pro Boat Zelos 48 Catamaran",
    category: "Boats",
    categoryLabel: "CATAMARAN",
    descriptor: "Twin brushless motors, self-righting hull. 80km/h of pure waterspeed aggression.",
    priceNPR: 42000,
    badge: "NEW",
    specs: "Twin Brushless · 80km/h · Self-Righting",
    stock: "In Stock",
    ambientTint: "#0A5A8A",
    ambientObjects: ["gear", "pcb", "rim"],
  },
  // Parts
  {
    id: "hobbywing-ezrun-max3",
    name: "Hobbywing EZRun Max3",
    category: "Parts",
    categoryLabel: "ESC + MOTOR COMBO",
    descriptor: "3300kV sensored brushless system. A drop-in upgrade for any 1:10 vehicle that demands more.",
    priceNPR: 8500,
    specs: "3300kV · 2–3S LiPo · Sensored",
    stock: "In Stock",
    ambientTint: "#8A3A0A",
    ambientObjects: ["gear", "pcb", "chassis"],
  },
  {
    id: "gens-ace-5000mah",
    name: "Gens Ace 5000mAh 3S LiPo",
    category: "Parts",
    categoryLabel: "LIPO BATTERY",
    descriptor: "5000mAh, 50C continuous discharge, EC5 connector. Run longer, push harder.",
    priceNPR: 5500,
    specs: "5000mAh · 50C · 3S · EC5",
    stock: "In Stock",
    ambientTint: "#0A8A3A",
    ambientObjects: ["pcb", "chassis"],
  },
  {
    id: "sanwa-mt44",
    name: "Sanwa MT-44 Transmitter",
    category: "Parts",
    categoryLabel: "RADIO SYSTEM",
    descriptor: "14-channel FHSS-4 radio system used by World Champions. Precision at your fingertips.",
    priceNPR: 38000,
    badge: "LIMITED",
    specs: "14CH · FHSS-4 · Telemetry",
    stock: "Last 3 left",
    ambientTint: "#4A3A8A",
    ambientObjects: ["pcb", "gear"],
  },
  // Accessories
  {
    id: "rc-car-bag-large",
    name: "RC Transport Bag — XL",
    category: "Accessories",
    categoryLabel: "CARRY BAG",
    descriptor: "Hard-shell base, padded foam interior, fits 1:8 and most 1:10 vehicles plus charger.",
    priceNPR: 3500,
    specs: "60×40×30cm · Waterproof Shell",
    stock: "In Stock",
    ambientTint: "#4A4A4A",
    ambientObjects: ["chassis"],
  },
  {
    id: "sky-rc-q200-charger",
    name: "SkyRC Q200neo Charger",
    category: "Accessories",
    categoryLabel: "AC/DC CHARGER",
    descriptor: "200W quad-channel charger. Four batteries simultaneously. Zero waiting.",
    priceNPR: 14500,
    specs: "200W · 4-Port · LiPo/NiMH/Life",
    stock: "In Stock",
    ambientTint: "#3A6A4A",
    ambientObjects: ["pcb", "gear", "chassis"],
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "All",
  "RC Cars",
  "Trucks & Crawlers",
  "Drones",
  "Boats",
  "Parts",
  "Accessories",
];

export function formatPrice(npr: number): string {
  return `NPR ${npr.toLocaleString("en-NP")}`;
}
