# 📚 RC Toys Nepal — Complete Knowledge Guide
### From Fundamentals → Advanced → Production Deployment (Free)

> **Written for you personally.** This document explains every technology, every pattern, and every decision made in this website — so you can rebuild it from scratch next time without needing AI help. Read it top to bottom at least once.

---

## 🗺️ Table of Contents

1. [The Big Picture — What Did We Build?](#1-the-big-picture)
2. [Technology Stack — Why Each Tool Was Chosen](#2-technology-stack)
3. [Frontend Fundamentals — React & Next.js](#3-frontend-fundamentals)
4. [TypeScript — The Language We Write In](#4-typescript)
5. [Styling — Tailwind CSS v4](#5-tailwind-css-v4)
6. [Animations — Framer Motion](#6-framer-motion)
7. [Backend — How Data Flows](#7-backend-data-flow)
8. [Database — Supabase & PostgreSQL](#8-database-supabase)
9. [Authentication — NextAuth.js](#9-authentication-nextauth)
10. [File/Image Storage — Cloudinary](#10-image-storage-cloudinary)
11. [Advanced Concepts Used In This Project](#11-advanced-concepts)
12. [Security — What Protects Your Site](#12-security)
13. [Environment Variables — The Secrets System](#13-environment-variables)
14. [File & Folder Structure Explained](#14-file-folder-structure)
15. [How to Go to Production — Complete Free Guide](#15-production-deployment)
16. [Post-Deploy Checklist](#16-post-deploy-checklist)
17. [Learning Roadmap — What to Study Next](#17-learning-roadmap)

---

## 1. The Big Picture

### What is this website?

**RC Toys Nepal** is a full-stack e-commerce web application for a radio-control toy store. It has:

- A **public storefront** — customers browse products, see prices, and submit orders
- An **admin panel** — protected by password, lets the store owner add/edit products and manage orders
- A **database** — stores all products and orders
- **Image storage** — all product photos are stored in the cloud (not on the server)

### How does a request travel? (The Request Lifecycle)

```
User's Browser
     │
     ▼
  Vercel CDN (serves the page files fast)
     │
     ▼
  Next.js App (running on Vercel's servers)
     │                │
     ▼                ▼
  Supabase DB    Cloudinary
  (products,     (product images)
   orders)
```

When a user visits `rctoysnepal.com`:
1. Their browser asks Vercel for the page
2. Vercel runs our Next.js code on the server
3. Next.js fetches products from Supabase database
4. Next.js sends the complete HTML page back to the browser
5. The browser loads the JavaScript and the page becomes interactive

---

## 2. Technology Stack

| Layer | Tool | Why We Chose It | Free Tier? |
|-------|------|-----------------|------------|
| Framework | **Next.js 16** | Full-stack: handles both frontend UI and backend API in one project | ✅ Yes |
| Language | **TypeScript** | Catches bugs before they happen with type safety | ✅ Yes |
| Styling | **Tailwind CSS v4** | Utility-first CSS, fast to write, no custom CSS files needed | ✅ Yes |
| Animations | **Framer Motion** | Smooth, professional animations with minimal code | ✅ Yes |
| Database | **Supabase** | Postgres database with a free tier and easy JavaScript SDK | ✅ Yes (500MB) |
| Auth | **NextAuth.js** | Handles login sessions, JWT tokens, password hashing | ✅ Yes |
| Images | **Cloudinary** | Stores and optimizes images in the cloud | ✅ Yes (25GB) |
| Hosting | **Vercel** | Made by the creators of Next.js, free tier is generous | ✅ Yes |
| Fonts | **Google Fonts** (via next/font) | Bebas Neue, Barlow Condensed, Inter — loaded optimally | ✅ Yes |

---

## 3. Frontend Fundamentals

### 3.1 React — The UI Library

React is the foundation. Everything in this website is built from **React Components** — small, reusable pieces of UI.

**Core concept: A Component is just a function that returns HTML-like code (JSX):**

```tsx
// This is a React component
function ProductCard({ name, price }: { name: string; price: number }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h2>{name}</h2>
      <p>NPR {price.toLocaleString()}</p>
    </div>
  );
}
```

**Key React concepts used in this project:**

| Concept | What It Does | Where Used in Our Code |
|---------|-------------|----------------------|
| `useState` | Stores data that can change | OrderModal.tsx — stores form input values |
| `useEffect` | Runs code when component loads/updates | StarField.tsx — starts canvas animation on load |
| `useRef` | Gets a direct reference to a DOM element | CanvasSequence.tsx — controls the `<canvas>` element |
| `props` | Passes data from parent to child component | Every component receives data from its parent |
| `children` prop | Passes JSX inside a component | Providers.tsx wraps everything in session context |
| Conditional rendering | Show/hide parts of UI | OrderModal.tsx — shows success message after order |

### 3.2 Next.js 16 — The Framework

Next.js sits on top of React and adds:

**App Router** (the modern way, used in this project):
- Every folder inside `src/app/` becomes a page route
- `src/app/page.tsx` → `yoursite.com/`
- `src/app/products/page.tsx` → `yoursite.com/products`
- `src/app/admin/dashboard/page.tsx` → `yoursite.com/admin/dashboard`

**Two types of components in Next.js:**

```
Server Components (default)         Client Components ('use client')
────────────────────────────────    ────────────────────────────────
• Run on the SERVER                 • Run in the BROWSER
• Can fetch data directly           • Can use useState, useEffect
• Faster (user gets HTML)           • Can handle user interactions
• Cannot use browser APIs           • Can access mouse events, etc.
• Cannot use useState               
                                    
Example: src/app/page.tsx          Example: src/components/OrderModal.tsx
(fetches products from DB          (handles form submit button click)
 before sending page to browser)
```

**In our `src/app/page.tsx`:**
```tsx
// This is a Server Component — no 'use client' at the top
export default async function HomePage() {
  // This runs on the SERVER — it talks directly to the database!
  const featuredProducts = await getFeaturedProducts();
  
  return (
    <>
      <Navbar />
      <ScrollStory />
      <FeaturedShowcase products={featuredProducts} /> {/* passes data down */}
      <Footer />
    </>
  );
}
```

### 3.3 The Layout System

**`src/app/layout.tsx`** — The root layout that wraps EVERY page:
- Sets up global fonts (Bebas Neue, Barlow Condensed, Inter)
- Sets background color on `<body>`
- Wraps everything in `<Providers>` (which enables session/auth across the whole site)
- Sets `<title>` and meta tags for SEO

**`src/app/admin/layout.tsx`** — Wraps only admin pages:
- Shows the admin navigation bar
- Hides nav on the login page using `usePathname()`

### 3.4 Key Components Explained

#### `ScrollStory.tsx` — The Hero Section
The cinematic scrolling intro on the homepage. Uses:
- `useRef` to track the scroll container
- `useState` to track which "scene" the user is on
- `framer-motion` for smooth text/image animations
- Canvas API for the animated background

#### `VoidShowcase.tsx` — The 3D Product Showcase
The dark void product viewer. Uses:
- `useRef` for the canvas element
- `requestAnimationFrame` loop for smooth 60fps rendering
- HTML5 Canvas 2D API to draw spotlights, stars, and fragments
- Keyboard/mouse events for navigation

#### `OrderModal.tsx` — The Order Form
The slide-in panel when a customer clicks "Order Now". Uses:
- `useState` for form field values
- `async/await` to call the `submitOrder` server action
- `react-hot-toast` for success/error notifications
- Framer Motion for slide-in animation

#### `AmbientFragments.tsx` — Floating RC Parts
Uses HTML5 Canvas to draw floating tire/gear/propeller shapes around products. Pure math/canvas — no library.

---

## 4. TypeScript

TypeScript is JavaScript with **type checking**. It prevents bugs like passing the wrong type of data to a function.

### Why we use it:

```ts
// WITHOUT TypeScript — JavaScript
function formatPrice(price) {
  return `NPR ${price.toLocaleString()}`;
}
formatPrice("hello"); // ❌ No error shown, but crashes at runtime!

// WITH TypeScript
function formatPrice(price: number): string {
  return `NPR ${price.toLocaleString()}`;
}
formatPrice("hello"); // ✅ Error shown IMMEDIATELY in your editor!
```

### Key TypeScript patterns used in this project:

**Interfaces** — describing the shape of an object:
```ts
// From src/lib/supabase.ts
export type Product = {
  id: string
  name: string
  slug: string
  category: 'RC Cars' | 'RC Trucks & Crawlers' | 'RC Drones'
  regular_price: number
  sale_price: number | null   // null means "no sale price"
  images: string[]            // array of image URL strings
  is_active: boolean
}
```

**Union types** — a value can be one of several options:
```ts
badge: 'none' | 'new' | 'sale' | 'bestseller' | 'soldout'
status: 'pending' | 'processing' | 'completed' | 'cancelled'
```

**Generic utility types:**
```ts
Omit<Product, 'id' | 'created_at'>  // Product type but without id and created_at
Partial<Product>                     // All fields of Product become optional
```

---

## 5. Tailwind CSS v4

Tailwind is a **utility-first CSS framework**. Instead of writing CSS files, you apply small utility classes directly in your HTML/JSX.

> ⚠️ **This project uses Tailwind CSS v4**, which has breaking changes from v3. Always check `node_modules/next/dist/docs/` before writing code.

### How it works:

```html
<!-- Traditional CSS approach -->
<div class="product-card">...</div>
/* CSS file: */
.product-card { background: #111; border-radius: 12px; padding: 16px; }

<!-- Tailwind approach (what we use) -->
<div class="bg-[#111] rounded-xl p-4">...</div>
```

### Common patterns in our code:

```tsx
// Arbitrary values with square brackets (for exact values)
className="bg-[#050505]"         // exact background color
className="text-[#FF2D00]"       // exact text color
className="h-[600px]"            // exact height

// Responsive prefixes
className="text-sm md:text-base lg:text-xl"   // changes with screen size
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Hover states
className="opacity-70 hover:opacity-100 transition-opacity"

// Group hover (hover parent → style child)
<div className="group">
  <span className="opacity-0 group-hover:opacity-100">Revealed on parent hover</span>
</div>
```

### Tailwind v4 specific changes:
- Configuration is now in CSS with `@import "tailwindcss"` instead of `tailwind.config.js`
- Uses CSS custom properties by default
- PostCSS plugin is `@tailwindcss/postcss`

---

## 6. Framer Motion

Framer Motion is the animation library. It makes components animate smoothly.

### Core API:

```tsx
import { motion } from 'framer-motion'

// Basic: a div that fades in
<motion.div
  initial={{ opacity: 0, y: 20 }}   // starts invisible, 20px below
  animate={{ opacity: 1, y: 0 }}    // animates to visible, original position
  transition={{ duration: 0.4 }}    // takes 0.4 seconds
>
  Content here
</motion.div>

// Triggered by state (used in OrderModal)
<motion.div
  animate={{ x: isOpen ? 0 : '100%' }}  // slides in/out
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>
```

### `AnimatePresence` — for mounting/unmounting animations:
```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}    // plays when removed from DOM
    />
  )}
</AnimatePresence>
```

Used in our `OrderModal.tsx` and `ProductDetailDrawer.tsx` for the slide-in panels.

---

## 7. Backend Data Flow

### How the backend works in Next.js (No separate server needed!)

Traditional web development requires a separate backend server (Node.js, Django, etc.). Next.js merges frontend and backend into one project.

**Two backend patterns we use:**

#### Pattern 1: Server Actions (`'use server'`)
Functions that run on the server, called directly from React components.

```ts
// src/lib/actions.ts
'use server'  // This tells Next.js: "Run this on the server"

export async function getProducts() {
  // Runs on SERVER — can access database directly
  const { data, error } = await supabaseAdmin.from('products').select('*')
  return data
}
```

```tsx
// src/app/page.tsx (Server Component)
import { getFeaturedProducts } from "@/lib/actions";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(); // calls server function directly!
  return <FeaturedShowcase products={featuredProducts} />;
}
```

#### Pattern 2: API Routes (for external calls and auth)
Files inside `src/app/api/` become HTTP endpoints.

```
src/app/api/auth/[...nextauth]/route.ts  →  POST /api/auth/signin
```

NextAuth uses API routes internally to handle the sign-in/sign-out HTTP requests.

### Data flow for "Submit Order" button:

```
Customer clicks "Order Now"
         │
         ▼
OrderModal.tsx (Client Component)
  - collects form data (name, phone, location)
         │
         ▼  calls server action
submitOrder(formData)  ← src/lib/orders.ts ('use server')
         │
         ▼  inserts into database
supabaseAdmin.from('orders').insert(...)
         │
         ▼
Supabase Database (PostgreSQL)
  orders table gets new row
         │
         ▼  Next.js revalidates cache
revalidatePath('/admin/orders')
         │
         ▼
Admin panel shows new order instantly
```

### `revalidatePath` — The Cache System

Next.js caches pages for speed. When an order is submitted, we need to tell Next.js:
> "Hey, the `/admin/orders` page has new data, rebuild it from scratch next time someone visits."

That's exactly what `revalidatePath('/admin/orders')` does. Without it, the admin might see stale data.

---

## 8. Database — Supabase

### What is Supabase?

Supabase is a hosted **PostgreSQL database** with a nice dashboard and JavaScript SDK. PostgreSQL is the most powerful open-source relational database.

### Two database clients (very important to understand):

```ts
// src/lib/supabase.ts

// 1. PUBLIC CLIENT — safe to use in the browser
// Uses the ANON key — limited by Row Level Security policies
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. ADMIN CLIENT — server-side ONLY, never expose to browser!
// Uses the SERVICE ROLE key — bypasses all security rules
// Only use this in Server Actions ('use server') or API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})
```

> ⚠️ **CRITICAL**: The SERVICE_ROLE_KEY is a master key. If exposed in browser code, anyone can read/delete your entire database. Always use it only in server-side code.

### Our Database Schema (what tables exist):

#### `products` table:
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- unique ID, auto-generated
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,                        -- URL-friendly name, e.g. "traxxas-slash-4x4"
  category product_category NOT NULL,
  short_descriptor TEXT,
  full_description TEXT,
  regular_price INTEGER NOT NULL,                  -- stored in NPR (paise not used)
  sale_price INTEGER,                              -- NULL means no sale
  images JSONB DEFAULT '[]',                       -- array of image URLs stored as JSON
  specs JSONB DEFAULT '[]',                        -- [{name: "Speed", value: "60km/h"}]
  in_the_box JSONB DEFAULT '[]',                   -- ["1x Vehicle", "1x Controller"]
  badge product_badge DEFAULT 'none',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `orders` table (in `orders-migration.sql`):
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',  -- pending | processing | completed | cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### SQL Concepts Used:

| Concept | Example | What it Does |
|---------|---------|-------------|
| ENUM type | `product_badge AS ENUM ('new', 'sale')` | Restricts column to specific values |
| JSONB | `images JSONB` | Stores JSON data (arrays, objects) in a column |
| INDEX | `CREATE INDEX idx_products_slug ON products(slug)` | Makes queries on that column fast |
| TRIGGER | Auto-update `updated_at` | Runs automatically when a row is changed |
| UUID | `gen_random_uuid()` | Generates a random unique ID |

### Common Supabase SDK patterns:

```ts
// SELECT — get all active products
const { data, error } = await supabaseAdmin
  .from('products')
  .select('*')
  .eq('is_active', true)           // WHERE is_active = true
  .order('display_order', { ascending: true })  // ORDER BY
  .limit(5)                         // LIMIT

// INSERT — create new order
await supabaseAdmin.from('orders').insert({ product_name: 'Traxxas', status: 'pending' })

// UPDATE — change order status
await supabaseAdmin.from('orders').update({ status: 'completed' }).eq('id', orderId)

// DELETE
await supabaseAdmin.from('orders').delete().eq('id', orderId)

// DELETE multiple
await supabaseAdmin.from('products').delete().in('id', ['id1', 'id2', 'id3'])
```

---

## 9. Authentication — NextAuth.js

### What is Authentication vs Authorization?

- **Authentication** = "Who are you?" (Login — prove your identity)
- **Authorization** = "What can you do?" (Are you allowed to access /admin?)

### How our auth works:

**Step 1: Admin tries to log in** → POSTs email + password to `/api/auth/signin`

**Step 2: NextAuth calls our `authorize()` function:**
```ts
// src/lib/auth.ts
async authorize(credentials) {
  // Compare submitted email to ADMIN_EMAIL env var
  if (credentials.email !== process.env.ADMIN_EMAIL) return null;
  
  // Compare password to stored bcrypt hash
  const valid = await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) return null;
  
  // Return user object — NextAuth creates a session
  return { id: '1', email: adminEmail, name: 'Admin' };
}
```

**Step 3: NextAuth creates a JWT token** and stores it in a cookie in the browser.

**Step 4: Every time admin visits `/admin/*`**, the middleware checks the JWT:
```ts
// src/middleware.ts
export default withAuth({
  pages: { signIn: '/admin/login' }
})

export const config = {
  matcher: ['/admin/((?!login).*)']  // protect ALL /admin/* EXCEPT /admin/login
}
```

### Password Hashing with bcrypt:

**Never store plain text passwords!** We hash them:
```
Plain password: "admin123"
                    │
               bcrypt.hash()
                    │
Stored hash:  "$2b$10$v1rqPgVupB43Z0eHXoIb6udd0nPar5rKS/miOiLnstWm.4S4zlJ/m"
```

The hash is one-way. You cannot reverse it to get "admin123". To verify, you use `bcrypt.compare(plainPassword, hash)` which returns `true` or `false`.

### JWT (JSON Web Token):

After login, NextAuth creates a JWT — a signed string that contains who you are. It looks like:
```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQC4uLiJ9.SIGNATURE
```

The signature is created using `NEXTAUTH_SECRET`. This ensures nobody can fake a JWT without knowing the secret.

### Session callbacks:

```ts
// src/lib/auth.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) token.id = user.id;   // store user.id in the JWT
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id;     // make user.id available on client
    return session;
  }
}
```

---

## 10. Image Storage — Cloudinary

### Why not store images on the server?

If you store images on your server's filesystem:
- ❌ When you redeploy, the images are deleted
- ❌ The server runs out of disk space
- ❌ Images load slowly for users far from your server
- ❌ Vercel (our host) doesn't support persistent file storage

Cloudinary solves all of this:
- ✅ Images stored permanently in the cloud
- ✅ Global CDN delivers images fast worldwide
- ✅ Automatic image optimization (WebP, compression)
- ✅ Free tier: 25GB storage + 25GB monthly bandwidth

### How we upload images:

```ts
// src/lib/cloudinary.ts
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
  // This POST request goes DIRECTLY from browser → Cloudinary
  // No need to route through our server!
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // e.g., "https://res.cloudinary.com/dgjnew6rc/image/upload/v1/rc-toys/product.jpg"
}
```

**Upload preset** is configured in your Cloudinary dashboard:
- Go to Settings → Upload → Upload Presets
- Create an "Unsigned" preset (allows direct browser uploads without server)
- Set your folder, allowed formats, max file size, etc.

### `next/image` and Cloudinary:

In `next.config.ts`, we whitelist Cloudinary's domain:
```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }]
}
```

This allows the `<Image>` component from Next.js to optimize Cloudinary images further.

---

## 11. Advanced Concepts

### 11.1 HTML5 Canvas

The starfield, void showcase, and ambient fragments are all drawn using the Canvas API — no library, just math and JavaScript.

```ts
// Basic canvas setup (from StarField.tsx pattern)
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');  // 2D rendering context

// Drawing loop using requestAnimationFrame
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear previous frame
  
  // Draw a circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.fill();
  
  requestAnimationFrame(render);  // schedule next frame (~60fps)
}
requestAnimationFrame(render);
```

**Key Canvas concepts:**
- `ctx.beginPath()` → starts a new drawing path
- `ctx.arc(x, y, r, startAngle, endAngle)` → draws a circle
- `ctx.fillRect(x, y, w, h)` → draws a rectangle
- `ctx.fillStyle` → sets fill color
- `ctx.strokeStyle` → sets border color
- `ctx.save()` / `ctx.restore()` → saves/restores transformation state
- `ctx.translate(x, y)` → moves origin point
- `ctx.rotate(angle)` → rotates subsequent drawings

### 11.2 Server Actions vs Client-Side Fetch

| Server Actions | Client-Side fetch() |
|---------------|---------------------|
| `'use server'` directive | Runs in browser |
| Called like normal functions | Makes HTTP request |
| Zero network boilerplate | Manually handle errors |
| Auto-typed by TypeScript | Manual JSON parsing |
| Works in Server Components | Only in Client Components |

**When to use each:**
- Use **Server Actions** for: form submissions, database writes, admin operations
- Use **client-side fetch** for: real-time updates, third-party APIs (like Cloudinary)

### 11.3 `revalidatePath` — Incremental Static Regeneration

Next.js caches pages statically for speed. When data changes, we tell it to regenerate:

```ts
import { revalidatePath } from 'next/cache'

// After updating a product:
revalidatePath('/admin/products')  // admin list page
revalidatePath('/products')        // public catalog page
revalidatePath('/')                // homepage (featured products changed)
```

Without this, changes wouldn't appear until the next full deployment.

### 11.4 DnD Kit — Drag and Drop Reordering

In the admin `ProductTable.tsx`, products can be dragged to reorder them. This uses `@dnd-kit`:

```tsx
import { DndContext, SortableContext, useSortable } from '@dnd-kit/sortable'

// The container that enables drag and drop
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={products.map(p => p.id)}>
    {products.map(product => <SortableRow key={product.id} product={product} />)}
  </SortableContext>
</DndContext>

// Each draggable row
function SortableRow({ product }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: product.id });
  // ... apply transform styles and drag handle
}
```

When drag ends, we call `reorderProducts(newOrderOfIds)` which updates `display_order` in the database.

### 11.5 Middleware — Edge Security

`src/middleware.ts` runs on **Vercel's Edge Network** — before the page even loads:

```ts
// Runs on every request to /admin/* (except /admin/login)
export default withAuth({
  pages: { signIn: '/admin/login' }
})
```

If the user has no valid JWT cookie, they are immediately redirected to `/admin/login`. This is the most efficient place to check authentication — nothing else loads first.

### 11.6 Slug Generation

A **slug** is a URL-friendly version of a product name:
```
"Traxxas Slash 4×4" → "traxxas-slash-4x4"
```

```ts
function generateSlug(name: string): string {
  return name
    .toLowerCase()               // "traxxas slash 4×4"
    .replace(/[^a-z0-9]+/g, '-') // "traxxas-slash-4-4"
    .replace(/^-+|-+$/g, '')     // remove leading/trailing dashes
}
```

Slugs are indexed in the database for fast lookups: `CREATE INDEX idx_products_slug ON products(slug)`.

### 11.7 JSONB in PostgreSQL

Our `specs` and `images` columns store arrays/objects inside a database column using JSONB:

```sql
-- images column stores an array of URLs
images: ["https://cloudinary.com/.../img1.jpg", "https://cloudinary.com/.../img2.jpg"]

-- specs column stores array of objects
specs: [{"name": "Top Speed", "value": "60km/h"}, {"name": "Scale", "value": "1:10"}]
```

JSONB is binary-optimized JSON — Postgres can query inside it efficiently.

---

## 12. Security

### What protects this website?

| Threat | Our Protection |
|--------|---------------|
| Admin impersonation | Bcrypt-hashed password + JWT session |
| Stolen JWT | Secret key to sign JWT (`NEXTAUTH_SECRET`) |
| Unauthenticated admin access | Middleware blocks `/admin/*` without valid JWT |
| Database dumps by attackers | Service role key is server-only (never in browser code) |
| Image hotlinking / CORS | Cloudinary upload preset restricts who can upload |
| XSS (script injection) | React escapes all output by default |
| Exposed secrets in Git | `.gitignore` excludes `.env.local` |

### Things to fix before production:

1. **Change the admin password** — currently `admin123`
   ```bash
   # Generate a new bcrypt hash
   node -e "const b=require('bcryptjs'); b.hash('yourNewPassword', 10).then(console.log)"
   # Copy the output into ADMIN_PASSWORD_HASH in your production env
   ```

2. **Rotate the NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

3. **Add Supabase Row Level Security (RLS)** — so even anon key is restricted:
   ```sql
   -- Only allow reading active products (public)
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public read active" ON products FOR SELECT USING (is_active = true);
   
   -- Orders: only server (service role) can insert
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
   -- No public policies = only service role can access
   ```

---

## 13. Environment Variables

### What are environment variables?

They are configuration values stored **outside** your code. This is critical for security — you don't want your database password in your GitHub repository.

### Our `.env.local` file:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000        # Your site's URL
NEXTAUTH_SECRET=<random 32-char string>   # Signs JWTs — keep secret!

# Admin credentials
ADMIN_EMAIL=admin@rctoysnepal.com
ADMIN_PASSWORD_HASH=$2b$10$...           # bcrypt hash of your password

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co    # Public — safe in browser
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...    # Public — safe in browser
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...             # SECRET — server only!

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgjnew6rc         # Public — in browser
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=visitmeet_auto # Public — in browser
CLOUDINARY_API_KEY=...                              # SECRET — server only
CLOUDINARY_API_SECRET=...                           # SECRET — server only
```

### The `NEXT_PUBLIC_` prefix rule:

- Variables **with** `NEXT_PUBLIC_` prefix → available in browser code (exposed to users!)
- Variables **without** prefix → only available in server code

> ⚠️ NEVER put `SUPABASE_SERVICE_ROLE_KEY` or `NEXTAUTH_SECRET` in a `NEXT_PUBLIC_` variable!

### `.gitignore` — never commit secrets:

```
# .gitignore already includes:
.env
.env.local
.env.*.local
```

This ensures your secrets never get pushed to GitHub.

---

## 14. File & Folder Structure

```
toywebsite/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (fonts, global styles, providers)
│   │   ├── page.tsx                  # Homepage: /
│   │   ├── globals.css               # Global CSS variables, base styles
│   │   ├── products/
│   │   │   └── page.tsx              # Products catalog: /products
│   │   └── admin/
│   │       ├── layout.tsx            # Admin navigation wrapper
│   │       ├── login/page.tsx        # Login form: /admin/login
│   │       ├── dashboard/page.tsx    # Stats overview: /admin/dashboard
│   │       ├── products/page.tsx     # Product CRUD: /admin/products
│   │       └── orders/page.tsx       # Order management: /admin/orders
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   ├── Footer.tsx                # Site footer
│   │   ├── ScrollStory.tsx           # Hero scroll animation
│   │   ├── VoidShowcase.tsx          # 3D void product viewer
│   │   ├── FeaturedShowcase.tsx      # Featured products section
│   │   ├── StarField.tsx             # Canvas starfield background
│   │   ├── AmbientFragments.tsx      # Floating RC parts canvas
│   │   ├── CanvasSequence.tsx        # Image sequence on canvas
│   │   ├── OrderModal.tsx            # Customer order slide-in panel
│   │   ├── ProductDetailDrawer.tsx   # Product detail slide-in panel
│   │   ├── ProductsClientPage.tsx    # Client wrapper for /products
│   │   ├── Providers.tsx             # NextAuth SessionProvider wrapper
│   │   └── admin/
│   │       ├── ProductForm.tsx       # Add/Edit product form
│   │       ├── ProductTable.tsx      # Products list with drag-drop
│   │       ├── ImageUpload.tsx       # Cloudinary image uploader
│   │       └── OrdersClientPage.tsx  # Orders list with status updates
│   │
│   ├── lib/                          # Server-side logic and utilities
│   │   ├── supabase.ts               # Database clients + Product type
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── cloudinary.ts             # Image upload helpers
│   │   ├── actions.ts                # Product server actions (CRUD)
│   │   ├── orders.ts                 # Order server actions (CRUD)
│   │   └── products.ts               # Static product data (fallback)
│   │
│   ├── middleware.ts                 # Auth guard for /admin/* routes
│   └── types/                        # Shared TypeScript type definitions
│
├── public/                           # Static files (served as-is)
│   └── ...                           # Images, icons, etc.
│
├── supabase-schema.sql               # Database table definitions
├── orders-migration.sql              # Orders table migration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── .env.local                        # LOCAL secrets (never commit!)
└── .gitignore                        # Files excluded from git
```

---

## 15. Production Deployment — Complete Free Guide

> **Goal**: Deploy RC Toys Nepal to the internet, for free, with a real domain, using Vercel + Supabase + Cloudinary.

### Architecture Overview

```
Internet → Vercel (hosts Next.js) → Supabase (database) → Cloudinary (images)
```

All three services have **forever-free tiers** sufficient for a small e-commerce site.

---

### Step 1: Prepare Your Code for Production

#### 1a. Check for console.log secrets
Search and remove any `console.log` statements that print passwords, keys, or user data:
```bash
grep -r "console.log" src/ --include="*.ts" --include="*.tsx"
```

#### 1b. Change the admin password
```bash
# In your terminal:
node -e "const b=require('bcryptjs'); b.hash('YourNewStrongPassword123!', 10).then(console.log)"
```
Copy the output — you'll need it in Step 4.

#### 1c. Build and test locally first
```bash
npm run build
# Must complete with 0 errors!
npm start
# Visit http://localhost:3000 and test everything
```
Fix any build errors before pushing to GitHub.

---

### Step 2: Push Code to GitHub

#### 2a. Create a GitHub account (free)
→ [github.com](https://github.com)

#### 2b. Initialize git and push:
```bash
cd /home/hckeer/work/toywebsite

# Initialize git (if not already done)
git init

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/rc-toys-nepal.git

# Stage all files
git add .

# IMPORTANT: verify .env.local is NOT included
git status
# You should NOT see .env.local in the list

# Commit
git commit -m "Initial production-ready commit"

# Push
git push -u origin main
```

> ⚠️ If `.env.local` appears in `git status`, stop immediately and check your `.gitignore`.

---

### Step 3: Set Up Supabase (Database)

Your Supabase project is already created. For production:

#### 3a. Enable Row Level Security (Recommended)
Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active products (public storefront)
CREATE POLICY "Allow public read of active products" ON products
  FOR SELECT USING (is_active = true);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- No public policies on orders means:
-- Only the service role (server) can read/write orders
```

#### 3b. Check your connection limits
Free Supabase tier allows **50 concurrent connections**. For a small store, this is more than enough.

#### 3c. Get your production keys
Go to Supabase Dashboard → Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 4: Deploy to Vercel

#### 4a. Create a Vercel account
→ [vercel.com](https://vercel.com) — Sign up with your GitHub account

#### 4b. Import your project
1. Click **"Add New... → Project"**
2. Select your `rc-toys-nepal` GitHub repository
3. Click **Import**

#### 4c. Configure Environment Variables
**This is the most important step!**

In Vercel project settings → Environment Variables, add ALL of these:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-vercel-domain.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` | All |
| `ADMIN_EMAIL` | `admin@rctoysnepal.com` | All |
| `ADMIN_PASSWORD_HASH` | Output from bcrypt step above | All |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | All |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dgjnew6rc` | All |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `visitmeet_auto` | All |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | All |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | All |

#### 4d. Deploy
1. Click **Deploy**
2. Wait 2–3 minutes for the build
3. Visit your site at `your-project.vercel.app`

---

### Step 5: Get a Free Custom Domain

You qualify for a free `.com.np` (Nepal) domain if you are a Nepalese citizen:

**Option A: `.com.np` domain (Free for Nepali citizens)**
1. Go to [register.com.np](https://register.com.np)
2. Register your domain: `rctoysnepal.com.np`
3. Documents needed: citizenship or company registration

**Option B: Freenom (.tk, .ml, .ga) — Completely free but less professional**
1. Go to [freenom.com](https://freenom.com)
2. Search for `rctoysnepal.tk` or `.ml`

**Option C: Buy a .com (most professional — ~$10/year on Namecheap)**
1. [namecheap.com](https://namecheap.com) — search for `rctoysnepal.com`
2. ~NPR 1,400/year

#### Connect your domain to Vercel:
1. Vercel Project → Settings → Domains → Add domain
2. Follow Vercel's DNS instructions (update DNS records at your registrar)
3. Vercel automatically provisions an SSL/HTTPS certificate (free via Let's Encrypt)

#### Update NEXTAUTH_URL:
After adding your domain, update the environment variable:
```
NEXTAUTH_URL=https://rctoysnepal.com.np
```
Then redeploy.

---

### Step 6: Verify Everything Works

Test these flows in order:

**Storefront:**
- [ ] Homepage loads with featured products from database
- [ ] Products page shows all products
- [ ] Click a product → detail drawer opens
- [ ] Click "Order Now" → modal opens with product pre-filled
- [ ] Submit an order → success toast appears

**Admin:**
- [ ] Visit `/admin` → redirected to `/admin/login`
- [ ] Login with your new password
- [ ] Dashboard shows order and product counts
- [ ] Add a new product with images → appears on storefront
- [ ] Edit a product → changes appear
- [ ] View/update order status
- [ ] Sign out → redirected to login

---

### Step 7: Ongoing Deployment

Every time you push to GitHub `main` branch, Vercel automatically redeploys. Zero downtime.

```bash
# Make a change to your code
git add .
git commit -m "Updated product descriptions"
git push origin main
# Vercel deploys automatically in ~2 minutes
```

---

### Free Tier Limits Summary

| Service | Free Tier Limit | RC Toys Nepal Usage |
|---------|----------------|---------------------|
| Vercel | 100GB bandwidth/month, unlimited deployments | Well within limits |
| Supabase | 500MB database, 2GB file storage, 50k monthly active users | Easily sufficient |
| Cloudinary | 25GB storage, 25GB bandwidth/month | Fine for product images |
| GitHub | Unlimited public repos | ✅ |

You can run this website completely free until you become a major e-commerce platform.

---

## 16. Post-Deploy Checklist

### Security
- [ ] Admin password changed from `admin123` to a strong password
- [ ] `NEXTAUTH_SECRET` is a random 32-character string (not the development one)
- [ ] `.env.local` is in `.gitignore` and never pushed to GitHub
- [ ] Supabase Row Level Security is enabled
- [ ] Cloudinary upload preset restrictions are configured

### Performance
- [ ] All product images are uploaded to Cloudinary (not referenced from local)
- [ ] `npm run build` completes with no errors or warnings
- [ ] Run Lighthouse audit: Chrome DevTools → Lighthouse tab (aim for 90+ scores)
- [ ] Test on mobile device (Chrome DevTools → Toggle Device Toolbar)

### SEO
- [ ] `<title>` and `<meta description>` are set in `layout.tsx`
- [ ] Open Graph tags are set for social sharing
- [ ] All products have descriptive slugs
- [ ] Images have meaningful filenames (uploaded to Cloudinary this way)

### Functionality
- [ ] Order submission works and appears in admin
- [ ] Admin can change order status
- [ ] New products added in admin appear on storefront
- [ ] Images load correctly on all pages
- [ ] Mobile menu works

### Domain & SSL
- [ ] Custom domain is connected
- [ ] SSL certificate is active (https:// with padlock icon)
- [ ] `NEXTAUTH_URL` matches your production domain exactly

---

## 17. Learning Roadmap

Now that you understand this project, here is the order in which to study to deeply understand everything:

### Phase 1: Foundations (1–2 months)
1. **HTML & CSS** — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn)
2. **JavaScript** — [javascript.info](https://javascript.info) — the best JS guide
3. **Git & GitHub** — [git-scm.com/book](https://git-scm.com/book)

### Phase 2: React (1 month)
4. **React** — [react.dev](https://react.dev) — Official docs, very well written
5. **TypeScript** — [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) — start with "TypeScript for JavaScript Programmers"

### Phase 3: Full-Stack Next.js (1–2 months)
6. **Next.js** — [nextjs.org/learn](https://nextjs.org/learn) — Official tutorial
7. Practice: Build a simple blog with Next.js + markdown files
8. Practice: Add a Supabase database to store posts

### Phase 4: Databases (3–4 weeks)
9. **SQL** — [sqlbolt.com](https://sqlbolt.com) — Interactive SQL lessons
10. **PostgreSQL** — [postgresql.org/docs](https://www.postgresql.org/docs/)
11. **Supabase** — [supabase.com/docs](https://supabase.com/docs)

### Phase 5: Auth, APIs, Security (2–3 weeks)
12. **HTTP & REST APIs** — understand how the web works
13. **NextAuth.js** — [next-auth.js.org](https://next-auth.js.org)
14. **Web Security** — OWASP Top 10 (free guide)

### Phase 6: Advanced UI (ongoing)
15. **Framer Motion** — [framer.com/motion](https://www.framer.com/motion/)
16. **HTML5 Canvas** — [developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Resources to Bookmark
- [MDN Web Docs](https://developer.mozilla.org) — the bible of web development
- [javascript.info](https://javascript.info) — best JavaScript tutorial
- [react.dev](https://react.dev) — best React tutorial
- [nextjs.org/docs](https://nextjs.org/docs) — Next.js documentation
- [supabase.com/docs](https://supabase.com/docs) — Supabase docs
- [tailwindcss.com/docs](https://tailwindcss.com/docs) — Tailwind docs

---

## Quick Reference — Commands

```bash
# Development
npm run dev              # Start local server at http://localhost:3000

# Production test
npm run build            # Build for production (must succeed before deploying)
npm start                # Run the production build locally

# Generate a bcrypt hash (for admin password)
node -e "const b=require('bcryptjs'); b.hash('YourPassword', 10).then(console.log)"

# Generate a random secret (for NEXTAUTH_SECRET)
openssl rand -base64 32

# Install dependencies
npm install

# Check for security vulnerabilities in dependencies
npm audit

# Check TypeScript errors
npx tsc --noEmit
```

---

*This document was written specifically for the RC Toys Nepal codebase. Every example is from your actual code. Keep this file in your project and update it as your site grows.*
