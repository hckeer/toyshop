/**
 * RC Toys Nepal -- Product Seeder
 * Uploads images from DataForProductswithImages/ to Cloudinary,
 * then upserts all 12 real products into Supabase.
 *
 * Usage: node scripts/seed-products.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'DataForProductswithImages');

// ── ENV (read .env.local manually since this is a plain Node script) ──
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '').replace(/\\\$/g, '$');
    process.env[key] = val;
  }
}
loadEnv();

// ── CLOUDINARY ──
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── SUPABASE ──
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── HELPER: upload a file to Cloudinary ──
async function uploadImage(filePath, folder = 'rc-toys/products') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      overwrite: false,
      use_filename: true,
      unique_filename: true,
    });
    console.log(`  ✓ Uploaded: ${path.basename(filePath)} → ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Failed to upload ${filePath}:`, err.message);
    return null;
  }
}

// ── HELPER: get sorted image files from a product folder ──
function getImageFiles(folderPath) {
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  try {
    return fs
      .readdirSync(folderPath)
      .filter((f) => exts.includes(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => path.join(folderPath, f));
  } catch {
    return [];
  }
}

// ── PRODUCT DEFINITIONS ──
// Main image = WhatsApp Image (used as hero), rest are detail screenshots
const PRODUCTS = [
  {
    slug: 'wltoys-12429',
    name: 'WLtoys 12429',
    category: 'RC Cars',
    short_descriptor: '1:12 Scale 4WD Climbing RC Car -- 40km/h, 100m Range',
    full_description:
      'The WLtoys 12429 is a powerful 1:12 scale 4WD off-road climber with a brushed motor and razor-sharp 2.4GHz response. Built for both smooth tarmac and rough terrain, it packs high-brightness LED headlights, a metal-reinforced chassis, and a 7.4V 1500mAh battery for 15 minutes of adrenaline-fuelled runtime. Beginner-friendly yet fast enough to impress experienced enthusiasts.',
    regular_price: 7500,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:12' },
      { name: 'Top Speed', value: '40 km/h' },
      { name: 'Drive', value: '4WD' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Battery', value: '7.4V 1500mAh' },
      { name: 'Runtime', value: '~15 min' },
      { name: 'Range', value: '>100m' },
    ],
    in_the_box: ['1x WLtoys 12429 RC Car', '1x 7.4V 1500mAh Battery', '1x Transmitter', '1x USB Charging Cable', '1x Manual'],
    badge: 'new',
    is_active: true,
    is_featured: true,
    stock_quantity: 8,
    display_order: 1,
    folder: '12429',
  },
  {
    slug: 'cessna-182-rc-glider',
    name: 'Cessna 182 RC Glider',
    category: 'RC Cars', // closest available -- will map to Special in UI
    short_descriptor: '2CH RTF EPP Foam Glider -- Ready to Fly Straight Out of the Box',
    full_description:
      "The Cessna 182 RC Glider is the perfect first fixed-wing aircraft. Built from lightweight EPP foam with a stable 31cm wingspan and intuitive 2-channel 2.4GHz control, it is virtually unbreakable and extremely easy to fly. Whether you are indoors or outdoors, this glider delivers a relaxing, elegant flight experience that scales from beginners to casual enthusiasts.",
    regular_price: 4500,
    sale_price: null,
    specs: [
      { name: 'Wingspan', value: '31 cm' },
      { name: 'Length', value: '38.5 cm' },
      { name: 'Channels', value: '2CH' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Material', value: 'EPP Foam' },
      { name: 'State', value: 'Ready-to-Go' },
    ],
    in_the_box: ['1x Cessna 182 Glider', '1x 2.4GHz Remote Controller', '1x Battery', '1x USB Charger', '1x Manual'],
    badge: 'new',
    is_active: true,
    is_featured: false,
    stock_quantity: 12,
    display_order: 2,
    folder: 'cessna 182',
  },
  {
    slug: 'wltoys-144002',
    name: 'WLtoys 144002',
    category: 'RC Cars',
    short_descriptor: '1:14 Alloy 4WD Racing RC Car -- 50km/h with LED Lights',
    full_description:
      'The WLtoys 144002 takes the legendary 144001 platform and upgrades it with a full alloy metal chassis, drift-ready suspension, and searing 50km/h top speed. The carbon brush 550 motor paired with a 7.4V 1500mAh LiPo battery delivers raw, relentless acceleration. Includes LED headlights and taillights for low-light bashes. An outstanding value in the 1:14 class.',
    regular_price: 8500,
    sale_price: 9500,
    specs: [
      { name: 'Scale', value: '1:14' },
      { name: 'Top Speed', value: '50 km/h' },
      { name: 'Drive', value: '4WD' },
      { name: 'Motor', value: '550 Carbon Brush' },
      { name: 'Battery', value: '7.4V 1500mAh LiPo' },
      { name: 'Charge Time', value: '~3 hrs' },
      { name: 'Runtime', value: '~7 min' },
      { name: 'Range', value: '~100m' },
    ],
    in_the_box: ['1x WLtoys 144002 RC Car', '1x 7.4V 1500mAh Battery', '1x 2.4GHz Transmitter', '1x USB Charger', '1x Manual'],
    badge: 'bestseller',
    is_active: true,
    is_featured: true,
    stock_quantity: 15,
    display_order: 3,
    folder: 'wltoys 144002',
  },
  {
    slug: 'mn82-h1-crawler',
    name: 'MN82 H1 RC Crawler',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:12 App-Controlled Off-Road Climbing Vehicle',
    full_description:
      'The MN82 H1 is a scale-detailed 1:12 remote control climbing vehicle inspired by the legendary Hummer H1. With app-controlled functionality, simulated independent suspension, and a high-torque motor, it conquers rocks, gravel, and steep inclines with ease. The realistic body panels, working lights, and 2.4GHz radio make this a collector-grade crawler at an accessible price.',
    regular_price: 9500,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:12' },
      { name: 'Drive', value: '4WD Crawler' },
      { name: 'Control', value: 'App + 2.4GHz Remote' },
      { name: 'Battery', value: '7.4V 650mAh' },
      { name: 'Runtime', value: '~15 min' },
      { name: 'Charge Time', value: '120 min' },
      { name: 'Range', value: '~100m' },
    ],
    in_the_box: ['1x MN82 H1 RC Crawler', '1x 7.4V Battery', '1x 2.4GHz Controller', '1x USB Charger', '1x Manual'],
    badge: 'new',
    is_active: true,
    is_featured: true,
    stock_quantity: 6,
    display_order: 4,
    folder: 'mn82',
  },
  {
    slug: 'mn99s-rc-truck',
    name: 'MN99S RC Truck',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:12 Scale 4WD High-Speed Rock Crawler -- 100m Range',
    full_description:
      'The MN99S blends the rugged character of a military truck with high-performance RC engineering. Its 1:12 scale body sits atop a fully independent suspension system and a high-torque 4WD drivetrain that takes on any surface. At 100m range and 2.4GHz precision, you are always in full command. Includes a 7.4V 1200mAh battery for sustained off-road sessions.',
    regular_price: 8800,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:12' },
      { name: 'Drive', value: '4WD' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Battery', value: '7.4V 1200mAh' },
      { name: 'Runtime', value: '~15 min' },
      { name: 'Range', value: '100m' },
    ],
    in_the_box: ['1x MN99S RC Truck', '1x 7.4V 1200mAh Battery', '1x 2.4GHz Controller', '1x USB Charger', '1x Manual'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 9,
    display_order: 5,
    folder: 'mn99s',
  },
  {
    slug: 'jjrc-q105-buggy',
    name: 'JJRC Q105 Buggy',
    category: 'RC Cars',
    short_descriptor: '1:18 Double Motor Climbing Racing Buggy -- 15km/h Drift & Stunt',
    full_description:
      'The JJRC Q105 is a fearless 1:18 scale double-motor buggy designed for stunts, climbing walls, and high-speed drifting. Two independent motors give it exceptional torque and the ability to tackle obstacles that stop conventional RC cars. With a 3.7V 500mAh battery, 40m range, and ready-to-go assembly, it is the perfect entry-level thrill machine for all ages.',
    regular_price: 3500,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:18' },
      { name: 'Top Speed', value: '15 km/h' },
      { name: 'Motors', value: 'Double Independent' },
      { name: 'Battery', value: '3.7V 500mAh' },
      { name: 'Runtime', value: '~15 min' },
      { name: 'Range', value: '40m' },
      { name: 'Channels', value: '4CH' },
    ],
    in_the_box: ['1x JJRC Q105 Buggy', '1x 3.7V Battery', '1x Remote Controller', '1x USB Charger', '1x Manual'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 20,
    display_order: 6,
    folder: 'jjrc 105',
  },
  {
    slug: 'jjrc-q116-gt',
    name: 'JJRC Q116 Super GT',
    category: 'RC Cars',
    short_descriptor: '1:16 Dodge-Style GT Drift Car -- Includes Extra Drift Tyres',
    full_description:
      'The JJRC Q116 Super GT is a 1:16 scale replica of the iconic Dodge muscle car, built for pure drift dominance. The kit includes two sets of tyres -- grip rubber for racing and hard plastic rings for effortless drift mode. With 2.4GHz precision and a sleek low-profile body, it is an ideal gift for boys and RC enthusiasts of all ages.',
    regular_price: 4200,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:16' },
      { name: 'Style', value: 'Dodge GT Drift Car' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Extra Tyres', value: 'Yes (Drift + Grip)' },
      { name: 'Model Size', value: '27x12x10 cm' },
    ],
    in_the_box: ['1x JJRC Q116 GT Car', '1x Remote Controller', '1x Drift Tyre Set', '1x Battery', '1x USB Charger', '1x Manual'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 14,
    display_order: 7,
    folder: 'jjrc q116',
  },
  {
    slug: 'mn128-rc-truck',
    name: 'MN128 RC Truck',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:12 Scale High-Detail RC Military Truck',
    full_description:
      'The MN128 is a full-detail 1:12 scale RC military-style truck with a realistic cab and truck bed, independent suspension, and a rugged 4WD drivetrain. Perfect for collectors and off-road hobbyists, this truck handles gravel, dirt, sand, and rocky terrain with authority. The 2.4GHz radio system ensures crisp, lag-free control at full range.',
    regular_price: 11000,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:12' },
      { name: 'Drive', value: '4WD' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Battery', value: '7.4V LiPo' },
      { name: 'Runtime', value: '~15 min' },
    ],
    in_the_box: ['1x MN128 RC Truck', '1x 7.4V Battery', '1x 2.4GHz Controller', '1x USB Charger', '1x Manual'],
    badge: 'new',
    is_active: true,
    is_featured: false,
    stock_quantity: 5,
    display_order: 8,
    folder: 'mn128',
  },
  {
    slug: 'rc-farming-tractor',
    name: 'RC Farming Tractor',
    category: 'RC Cars',
    short_descriptor: '1:24 Scale 6CH John Deere Style RC Tractor with Working Lights',
    full_description:
      'This 1:24 scale RC Farming Tractor brings the iconic John Deere aesthetic to life with 6-channel control, bright working LED lights, and a realistic seeder attachment. The 2.4GHz radio allows full forward, reverse, and turning control, while the included light system adds a stunning nighttime farming experience. An extraordinary gift for young RC enthusiasts and farming fans.',
    regular_price: 3800,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:24' },
      { name: 'Channels', value: '6CH' },
      { name: 'Frequency', value: '2.4GHz' },
      { name: 'Lights', value: 'Yes (LED)' },
      { name: 'Range', value: '15-25m' },
      { name: 'Battery', value: '2x1.5V AAA' },
    ],
    in_the_box: ['1x RC Farming Tractor', '1x Remote Controller', '1x Operating Instructions', '1x USB Cable'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 10,
    display_order: 9,
    folder: 'farming tractor',
  },
  {
    slug: 'remo-1631-monster-truck',
    name: 'REMO 1631 Monster Truck',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:16 Brushed 4WD Off-Road Monster Truck -- 40km/h, 80m Range',
    full_description:
      'The REMO 1631 is a battle-hardened 1:16 scale 4WD monster truck ready for any terrain you throw at it. Powered by a high-torque brushed motor and a 7.4V 1500mAh LiPo battery, it rips through mud, gravel, and grass at up to 40km/h. With app control, 80m range, and 25 minutes of runtime, this is one of the most capable trucks in its class.',
    regular_price: 9800,
    sale_price: 11500,
    specs: [
      { name: 'Scale', value: '1:16' },
      { name: 'Top Speed', value: '30-40 km/h' },
      { name: 'Drive', value: '4WD' },
      { name: 'Battery', value: '7.4V 1500mAh LiPo' },
      { name: 'Runtime', value: '~25 min' },
      { name: 'Range', value: '80m' },
      { name: 'Charge Time', value: '90 min' },
    ],
    in_the_box: ['1x REMO 1631 Monster Truck', '1x 7.4V 1500mAh Battery', '1x 2.4GHz Controller', '1x Charger', '1x Manual'],
    badge: 'sale',
    is_active: true,
    is_featured: true,
    stock_quantity: 7,
    display_order: 10,
    folder: 'smax 2',
  },
  {
    slug: 'double-e-wheel-loader',
    name: 'Double E E519 Wheel Loader',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:20 Scale RC Construction Wheel Loader -- Moveable Shovel',
    full_description:
      'The Double E E519 RC Wheel Loader is a premium 1:20 scale construction vehicle with a fully functional shovel that moves up, down, forward, and back. Realistic proportions, smooth controls, and sturdy build quality make this an exceptional display piece and play vehicle. Kids and collectors alike love its detailed body and satisfying shovel mechanics. USB rechargeable and ready for the job site.',
    regular_price: 6500,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:20' },
      { name: 'Model', value: 'E519-003' },
      { name: 'Functions', value: 'Drive + Shovel Up/Down/Fwd/Back' },
      { name: 'Battery', value: 'Ni-Cd 4.8V 400mAh' },
      { name: 'Charge Time', value: '180 min' },
      { name: 'Runtime', value: '~15 min' },
      { name: 'Range', value: '~20m' },
      { name: 'Charge Port', value: 'USB' },
    ],
    in_the_box: ['1x Double E E519 Wheel Loader', '1x Remote Controller', '1x USB Charging Cable', '1x Manual'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 8,
    display_order: 11,
    folder: 'Double EE Wheel Loader',
  },
  {
    slug: 'double-e-steam-roller',
    name: 'Double E Steam Roller',
    category: 'RC Trucks & Crawlers',
    short_descriptor: '1:20 Scale RC Steam Roller with Demo Mode & Sound',
    full_description:
      'The Double E RC Steam Roller is a superbly detailed 1:20 scale radio-controlled construction roller with forward, reverse, left and right turns, a demo mode, and authentic construction sounds. It supports Triband frequency, allowing up to 3 units to be driven simultaneously without interference. Built-in rechargeable batteries and a USB charger make it maintenance-free. An unmissable gift for RC vehicle fans.',
    regular_price: 5800,
    sale_price: null,
    specs: [
      { name: 'Scale', value: '1:20' },
      { name: 'Dimensions', value: '18"L x 9"W x 6"H' },
      { name: 'Channels', value: 'Multiband (up to 3 simultaneous)' },
      { name: 'Sound', value: 'Yes' },
      { name: 'Battery', value: 'Rechargeable built-in' },
      { name: 'Functions', value: 'Fwd/Rev, Left/Right, Demo Mode' },
    ],
    in_the_box: ['1x Double E Steam Roller', '1x Remote Controller', '1x USB Charger', '1x Manual'],
    badge: 'none',
    is_active: true,
    is_featured: false,
    stock_quantity: 6,
    display_order: 12,
    folder: 'Double EE roller',
  },
];

// ── MAIN ──
async function main() {
  console.log('🚀 RC Toys Nepal Product Seeder\n');

  for (const product of PRODUCTS) {
    const folderPath = path.join(dataDir, product.folder);
    console.log(`\n📦 Processing: ${product.name} (${product.folder})`);

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id, images')
      .eq('slug', product.slug)
      .maybeSingle();

    let imageUrls = [];

    if (existing && existing.images && existing.images.length > 0) {
      console.log(`  → Already has ${existing.images.length} images in DB, reusing...`);
      imageUrls = existing.images;
    } else {
      // Upload images
      const imageFiles = getImageFiles(folderPath);
      console.log(`  → Found ${imageFiles.length} image files`);

      for (const imgPath of imageFiles) {
        const url = await uploadImage(imgPath);
        if (url) imageUrls.push(url);
      }
    }

    if (imageUrls.length === 0) {
      console.warn(`  ⚠ No images for ${product.name}, using placeholder`);
    }

    // Upsert product
    const { folder: _folder, ...productData } = product;
    const { error } = await supabase.from('products').upsert(
      {
        ...productData,
        images: imageUrls,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`  ✗ DB error for ${product.name}:`, error.message);
    } else {
      console.log(`  ✓ Upserted ${product.name} with ${imageUrls.length} images`);
    }
  }

  console.log('\n✅ Seeding complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
