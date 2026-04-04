# OpenCode Autonomous Build Prompt — Full-Stack Next.js E-Commerce + Admin Panel
# Model: Claude Sonnet 4.5
# Usage: Paste this entire file as your first message in OpenCode.
#        The agent will build the complete project without further input.

---

## ROLE & OBJECTIVE

You are a senior full-stack engineer. Your task is to build a complete, production-ready
e-commerce website with a public storefront and a private admin panel — from scratch,
autonomously, with zero clarifying questions.

You will make every architectural and design decision yourself based on the specifications
below. When a decision is not specified, choose the most robust, secure, and maintainable
option. Do not stop to ask. Do not produce partial work. Complete every file fully.

---

## BUSINESS CONTEXT (Adapt This for Any Business)

Build a storefront for a retail shop. The example used here is "RC Toys Nepal" — a
radio-control hobby shop in Kathmandu. When building for a different business:
- Replace all product categories with the appropriate ones
- Replace all brand/business names
- Adjust the color palette (the accent color here is #FF2D00 red)
- Keep ALL architectural patterns exactly as described

---

## TECH STACK — EXACT VERSIONS

Install these exact packages. Do not substitute alternatives.

```
npx create-next-app@latest [project-name] --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Then install:
```
npm install @supabase/supabase-js@^2 next-auth@^4 bcryptjs cloudinary@^2 framer-motion@^12 react-hot-toast@^2 @dnd-kit/core@^6 @dnd-kit/sortable@^10 @dnd-kit/utilities@^3
npm install -D @types/bcryptjs @tailwindcss/postcss
```

Final `package.json` dependencies must include:
- `next`: 16+ (App Router)
- `react` / `react-dom`: 19+
- `next-auth`: ^4.24 (NOT next-auth v5 — use v4)
- `@supabase/supabase-js`: ^2
- `bcryptjs`: ^3
- `cloudinary`: ^2
- `framer-motion`: ^12
- `react-hot-toast`: ^2
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `tailwindcss`: ^4 (use PostCSS plugin, NOT v3 Tailwind config)

---

## PROJECT STRUCTURE — BUILD EVERY FILE LISTED

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx                          ← Root layout, fonts, metadata, Providers
│   ├── page.tsx                            ← Homepage (Server Component, fetches featured products)
│   ├── admin/
│   │   ├── layout.tsx                      ← Admin shell nav ('use client', useSession)
│   │   ├── login/
│   │   │   └── page.tsx                    ← Login form ('use client', signIn)
│   │   ├── dashboard/
│   │   │   └── page.tsx                    ← Stats dashboard (Server Component)
│   │   └── products/
│   │       ├── page.tsx                    ← Product list (Server Component)
│   │       ├── new/
│   │       │   └── page.tsx                ← New product page
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx            ← Edit product page (await params)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts               ← NextAuth catch-all handler
│   └── products/
│       └── page.tsx                        ← Public product catalogue (Server Component)
├── components/
│   ├── Providers.tsx                       ← 'use client' — SessionProvider + Toaster
│   ├── Navbar.tsx                          ← Fixed nav with logo and links
│   ├── Footer.tsx                          ← Footer with business info
│   ├── ScrollStory.tsx                     ← Scroll-driven hero animation section
│   ├── FeaturedShowcase.tsx                ← Homepage featured products (bridges DB → VoidShowcase)
│   ├── ProductsClientPage.tsx              ← /products client page with category filter
│   ├── VoidShowcase.tsx                    ← Immersive full-screen product viewer (canvas)
│   ├── StarField.tsx                       ← Animated star background (canvas, ssr:false)
│   ├── AmbientFragments.tsx                ← Floating RC-part silhouettes (canvas, ssr:false)
│   └── admin/
│       ├── ProductForm.tsx                 ← Full product create/edit form ('use client')
│       ├── ProductTable.tsx                ← Sortable product table with DnD ('use client')
│       └── ImageUpload.tsx                 ← Drag-and-drop image uploader ('use client')
├── lib/
│   ├── supabase.ts                         ← Two Supabase clients + Product type
│   ├── auth.ts                             ← NextAuth options (CredentialsProvider + bcrypt)
│   ├── actions.ts                          ← 'use server' — all DB operations
│   └── cloudinary.ts                       ← Client-side direct upload helpers
├── types/
│   └── next-auth.d.ts                      ← Augment Session/JWT with user.id
└── middleware.ts                           ← Protect /admin/* except /admin/login
```

---

## ENVIRONMENT VARIABLES

Create `.env.local` with these keys. Add ALL of them to `.gitignore` via `.env*`:

```env
# Next.js / NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                        # generate: openssl rand -base64 32

# Single admin user — NO database table
ADMIN_EMAIL=admin@yourbusiness.com
ADMIN_PASSWORD_HASH=                    # bcrypt hash: node -e "require('bcryptjs').hash('yourpass',10,(e,h)=>console.log(h))"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # from Supabase dashboard → Settings → API
SUPABASE_SERVICE_ROLE_KEY=              # NEVER expose to browser — server only

# Cloudinary (direct unsigned browser uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=      # your Cloudinary cloud name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=   # must be set to "Unsigned" in Cloudinary dashboard
```

CRITICAL RULES FOR ENV VARS:
- `NEXT_PUBLIC_*` = safe for browser (put in this prefix only non-secret values)
- Everything else = server only, never imported in 'use client' files
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in any client component
- Never hardcode real values in any `.md` file or any committed file
- `ADMIN_SETUP.md` must be in `.gitignore` if it exists

---

## DATABASE SCHEMA (Supabase PostgreSQL)

Create `supabase-schema.sql` in the project root with this exact schema:

```sql
-- Enums
CREATE TYPE product_category AS ENUM (
  'RC Cars', 'RC Trucks & Crawlers', 'RC Drones', 'RC Boats',
  'Spare Parts', 'Accessories', 'Batteries & Chargers'
);

CREATE TYPE product_badge AS ENUM (
  'none', 'new', 'sale', 'bestseller', 'soldout'
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  category            product_category NOT NULL,
  short_descriptor    TEXT,
  full_description    TEXT,
  regular_price       INTEGER NOT NULL,
  sale_price          INTEGER,
  images              JSONB DEFAULT '[]'::jsonb,
  specs               JSONB DEFAULT '[]'::jsonb,
  in_the_box          JSONB DEFAULT '[]'::jsonb,
  badge               product_badge DEFAULT 'none',
  is_active           BOOLEAN DEFAULT true,
  is_featured         BOOLEAN DEFAULT false,
  stock_quantity      INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 3,
  display_order       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX idx_products_active        ON products(is_active);
CREATE INDEX idx_products_featured      ON products(is_featured);
CREATE INDEX idx_products_slug          ON products(slug);
CREATE INDEX idx_products_display_order ON products(display_order);
CREATE INDEX idx_products_category      ON products(category);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

SCHEMA DECISIONS (do not change):
- Prices stored as INTEGER (whole currency, no decimals)
- `images`, `specs`, `in_the_box` stored as JSONB — not normalized sub-tables
- `slug` is UNIQUE and always auto-generated from `name` in application code
- `display_order` is an integer updated individually per product during reorder
- `updated_at` is maintained by a DB trigger, not application code

---

## TYPESCRIPT TYPES

### `src/lib/supabase.ts` — Product type mirrors schema exactly:

```typescript
export type Product = {
  id: string
  name: string
  slug: string
  category: 'RC Cars' | 'RC Trucks & Crawlers' | 'RC Drones' | 'RC Boats'
           | 'Spare Parts' | 'Accessories' | 'Batteries & Chargers'
  short_descriptor: string | null
  full_description: string | null
  regular_price: number
  sale_price: number | null
  images: string[]
  specs: { name: string; value: string }[]
  in_the_box: string[]
  badge: 'none' | 'new' | 'sale' | 'bestseller' | 'soldout'
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  low_stock_threshold: number
  display_order: number
  created_at: string
  updated_at: string
}
```

### `src/types/next-auth.d.ts` — Module augmentation:

```typescript
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string; email: string; name?: string | null }
  }
  interface User {
    id: string; email: string; name?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT { id: string }
}
```

---

## IMPLEMENTATION SPECIFICATIONS

### 1. `src/lib/supabase.ts`

Create TWO Supabase clients:

```typescript
import { createClient } from '@supabase/supabase-js'

// Public client — respects RLS, safe to use in browser contexts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client — bypasses RLS, SERVER ONLY, never import in 'use client' files
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

Then export the `Product` type (full definition above).

---

### 2. `src/lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.email !== process.env.ADMIN_EMAIL) return null
        const valid = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH!
        )
        if (!valid) return null
        return { id: '1', email: process.env.ADMIN_EMAIL!, name: 'Admin' }
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

---

### 3. `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

### 4. `src/middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/admin/login' },
})

export const config = {
  matcher: ['/admin/((?!login).*)'],
}
```

This single file protects EVERY `/admin/*` route except `/admin/login`.
The negative-lookahead regex `(?!login)` is critical — do not simplify it.

---

### 5. `src/lib/actions.ts` — All Server Actions

```typescript
'use server'

import { supabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').order('display_order', { ascending: true })
  if (error) { console.error('getProducts:', error); return [] }
  return data as Product[]
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*')
    .eq('is_active', true).order('display_order', { ascending: true })
  if (error) { console.error('getActiveProducts:', error); return [] }
  return data as Product[]
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*')
    .eq('is_featured', true).eq('is_active', true)
    .order('display_order', { ascending: true }).limit(5)
  if (error) { console.error('getFeaturedProducts:', error); return [] }
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('slug', slug).single()
  if (error) return null
  return data as Product
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('id', id).single()
  if (error) return null
  return data as Product
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> {
  const slug = generateSlug(productData.name)
  const { data: maxOrder } = await supabaseAdmin
    .from('products').select('display_order')
    .order('display_order', { ascending: false }).limit(1).single()
  const display_order = (maxOrder?.display_order ?? 0) + 1
  const { data, error } = await supabaseAdmin
    .from('products').insert({ ...productData, slug, display_order }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return data as Product
}

export async function updateProduct(
  id: string, productData: Partial<Product>
): Promise<Product> {
  if (productData.name) productData.slug = generateSlug(productData.name)
  const { data, error } = await supabaseAdmin
    .from('products').update(productData).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return data as Product
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProducts(ids: string[]): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin.from('products').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return { success: true }
}

export async function reorderProducts(productIds: string[]): Promise<{ success: boolean }> {
  const updates = productIds.map((id, index) =>
    supabaseAdmin.from('products').update({ display_order: index }).eq('id', id)
  )
  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)
  if (errors.length > 0) throw new Error('Failed to reorder products')
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return { success: true }
}

export async function bulkUpdateProducts(
  ids: string[], updates: Partial<Product>
): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('products').update(updates).in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  return { success: true }
}
```

CRITICAL: `revalidatePath` must be called after EVERY mutation on all three paths.
CRITICAL: Always use `supabaseAdmin` (service role), never the anon `supabase` client here.

---

### 6. `src/lib/cloudinary.ts`

```typescript
export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!response.ok) throw new Error('Failed to upload image')
  const data: CloudinaryUploadResult = await response.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => uploadToCloudinary(file)))
}
```

This uploads DIRECTLY from the browser to Cloudinary.
The upload preset MUST be configured as "Unsigned" in the Cloudinary dashboard.
Only `secure_url` is returned and stored — Cloudinary handles storage.

---

### 7. `src/components/Providers.tsx`

```typescript
'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0D0D10',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: { iconTheme: { primary: '#FF2D00', secondary: '#fff' } },
        }}
      />
    </SessionProvider>
  )
}
```

This component MUST be 'use client'. It is placed in root `layout.tsx` to allow
`layout.tsx` itself to remain a Server Component. This is the "Provider Aggregator" pattern.

---

### 8. `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Barlow_Condensed, Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Business — Tagline Here',
  description: 'Your business description here.',
  openGraph: {
    title: 'Your Business',
    description: 'Your business description.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

Fonts are injected as CSS custom properties and referenced in components as:
- `font-[family-name:var(--font-bebas)]` — Tailwind v4 arbitrary value syntax
- `font-[family-name:var(--font-heading)]`
- `font-[family-name:var(--font-body)]`

---

### 9. `src/app/globals.css`

Include at minimum:

```css
@import "tailwindcss";

:root {
  --bg-primary: #050505;
  --bg-secondary: #0a0a0c;
  --accent-red: #ff2d00;
  --accent-amber: #ff8c00;
  --text-heading: rgba(255, 255, 255, 0.92);
  --text-body: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);
}

/* Noise texture overlay for depth */
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #ff2d00, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #050505; }
::-webkit-scrollbar-thumb { background: #ff2d00; border-radius: 2px; }

/* Selection highlight */
::selection { background: rgba(255, 45, 0, 0.3); }
```

NOTE: Tailwind v4 uses `@import "tailwindcss"` — NOT `@tailwind base/components/utilities`.

---

### 10. `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
```

---

### 11. `src/app/admin/login/page.tsx`

Build a `'use client'` login page with these exact behaviors:

- Form has `email` and `password` inputs
- On submit: calls `signIn('credentials', { email, password, redirect: false })`
- On error: sets an error message state AND triggers a CSS `shake` animation
- On success: reads `?callbackUrl` query param (from `useSearchParams`), falls back to `/admin/dashboard`
- Loading state: disables all inputs, shows "Signing in..." in button
- The inner form component using `useSearchParams` MUST be wrapped in `<Suspense>` at the page level — this is required by Next.js App Router

```typescript
// Outer component provides Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
```

Design: centered card on dark background, red accent, brand name at top.

---

### 12. `src/app/admin/dashboard/page.tsx`

Async Server Component. No `'use client'` directive.

```typescript
import { supabaseAdmin } from '@/lib/supabase'

async function getStats() {
  const { data: products } = await supabaseAdmin
    .from('products').select('stock_quantity, low_stock_threshold')
  const total = products?.length ?? 0
  const inStock = products?.filter(p => p.stock_quantity > 0).length ?? 0
  const lowStock = products?.filter(
    p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  ).length ?? 0
  const outOfStock = products?.filter(p => p.stock_quantity === 0).length ?? 0
  return { total, inStock, lowStock, outOfStock }
}
```

Renders:
1. 4 stat cards: Total Products (red), In Stock (green), Low Stock (amber), Out of Stock (red)
2. Quick action buttons: "Add New Product" and "Manage Products"
3. A tips/getting-started list

---

### 13. `src/app/admin/products/page.tsx`

```typescript
import { getProducts } from '@/lib/actions'
import ProductTable from '@/components/admin/ProductTable'

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-[family-name:var(--font-bebas)] tracking-wide mb-2">
          Manage Products
        </h1>
        <p className="text-gray-400">Add, edit, and organize your product catalog</p>
      </div>
      <ProductTable initialProducts={products} />
    </div>
  )
}
```

---

### 14. `src/app/admin/products/[id]/edit/page.tsx`

```typescript
import { getProductById } from '@/lib/actions'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  return <ProductForm product={product} />
}
```

CRITICAL: `params` must be typed as `Promise<{ id: string }>` and awaited.
This is the Next.js 15+ async params pattern.

---

### 15. `src/app/page.tsx` — Homepage

```typescript
import Navbar from '@/components/Navbar'
import ScrollStory from '@/components/ScrollStory'
import FeaturedShowcase from '@/components/FeaturedShowcase'
import Footer from '@/components/Footer'
import { getFeaturedProducts } from '@/lib/actions'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <ScrollStory />
      </main>
      <FeaturedShowcase products={featuredProducts} />
      <div className="w-full h-32 md:h-48" style={{ background: '#06080F' }} />
      <Footer />
    </>
  )
}
```

---

### 16. `src/app/products/page.tsx`

```typescript
import Navbar from '@/components/Navbar'
import ProductsClientPage from '@/components/ProductsClientPage'
import { getActiveProducts } from '@/lib/actions'

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse the full product catalogue.',
}

export default async function ProductsPage() {
  const products = await getActiveProducts()
  return (
    <>
      <Navbar />
      <ProductsClientPage products={products} />
    </>
  )
}
```

---

### 17. `src/components/admin/ImageUpload.tsx`

Build a full drag-and-drop image upload component with:

Props:
```typescript
interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number  // default 10
}
```

Features to implement:
- Drag zone: handles `dragenter`, `dragover`, `dragleave`, `drop` events
- Click-to-upload: `<input type="file" multiple accept="image/*">` overlays the zone
- Upload logic: `Promise.all(files.map(uploadToCloudinary))` — parallel uploads
- Respects `maxImages`: slices files array if needed, shows toast if limit hit
- Upload state: `uploading` boolean that adds overlay and disables interaction
- Preview grid: 2 cols mobile / 4 cols desktop, square aspect ratio
- Per-image controls (visible on hover): move left ←, delete (red), move right →
- First image gets a "Main" badge overlay
- Toast on success (count) and error

---

### 18. `src/components/admin/ProductForm.tsx`

Build the full product form with these exact sections and all state:

```typescript
'use client'

const CATEGORIES = [
  'RC Cars', 'RC Trucks & Crawlers', 'RC Drones', 'RC Boats',
  'Spare Parts', 'Accessories', 'Batteries & Chargers',
] as const

const CATEGORY_TEMPLATES: Record<string, { name: string; value: string }[]> = {
  'RC Cars': [
    { name: 'Motor Type', value: 'Brushless' },
    { name: 'Top Speed', value: '60 km/h' },
    { name: 'Scale', value: '1/10' },
    { name: 'Drive Type', value: '4WD' },
    { name: 'Control Frequency', value: '2.4GHz' },
    { name: 'Battery', value: 'LiPo 2S' },
    { name: 'Runtime', value: '20-30 min' },
  ],
  'RC Drones': [
    { name: 'Camera', value: '4K' },
    { name: 'Flight Time', value: '30 minutes' },
    { name: 'Weight', value: '<249g' },
    { name: 'Max Range', value: '10 km' },
    { name: 'Obstacle Sensing', value: 'Yes' },
    { name: 'Wind Resistance', value: 'Level 5' },
  ],
  // Add templates for other categories as appropriate
}
```

State variables (all via `useState`):
- `saving: boolean`
- `name: string`
- `category: typeof CATEGORIES[number]`
- `shortDescriptor: string`
- `fullDescription: string`
- `regularPrice: number`
- `salePrice: number | ''`
- `images: string[]`
- `specs: { name: string; value: string }[]`
- `inTheBox: string[]`
- `badge: Product['badge']`
- `isActive: boolean`
- `isFeatured: boolean`
- `stockQuantity: number`
- `lowStockThreshold: number`

Form sections (must all be present):
1. **Basic Info** — name (required), category dropdown (required), short descriptor, full description
2. **Pricing** — regular price with "NPR" prefix, sale price (optional), live savings display
3. **Product Images** — `<ImageUpload>` component (required — validate min 1 image before submit)
4. **Key Specs** — dynamic key-value pairs with "Use Template" button per category
5. **What's In The Box** — dynamic string list
6. **Badges & Visibility** — badge pill selector, isActive toggle, isFeatured toggle
7. **Inventory** — stock quantity, low stock threshold

`handleSubmit(isDraft: boolean)`:
- Validates: name, category, price > 0, images.length > 0
- Assembles `productData` object
- If `isDraft`: force `is_active: false`
- Calls `createProduct` or `updateProduct` based on `isEditing` flag
- Shows `toast.success` or `toast.error`
- On success: `router.push('/admin/products')` + `router.refresh()`

Action buttons at bottom:
- "Cancel" → `router.back()`
- "Save as Draft" → `handleSubmit(true)`
- "Publish Product" / "Update Product" → `handleSubmit(false)`

---

### 19. `src/components/admin/ProductTable.tsx`

Build a full interactive product table. Client Component.

Props: `{ initialProducts: Product[] }`

State:
- `products: Product[]` — local copy, mutated optimistically
- `search: string`
- `categoryFilter: string`
- `selectedIds: string[]`
- `isDragging: boolean`

Features:
- Search: real-time `useMemo` filter on product name
- Category filter: `<select>` with all 7 categories + "All"
- Columns: Drag handle | Checkbox | Image | Name + Category | Price | Badge | Status | Stock | Actions
- Drag-and-drop reorder using `@dnd-kit`:
  ```typescript
  import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensors, useSensor } from '@dnd-kit/core'
  import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
  import { CSS } from '@dnd-kit/utilities'
  ```
  On `onDragEnd`: call `arrayMove`, update local state, call `reorderProducts(newOrder.map(p => p.id))`
- Checkbox: individual + select-all header checkbox
- Bulk actions bar (visible when items selected): "Set Active", "Set Hidden", "Delete Selected"
- Per-row actions: Edit button (→ `/admin/products/${product.id}/edit`) and Delete button
- Delete confirms with `window.confirm()`
- Optimistic updates: mutate local state first, then call server action, revert on error
- Stock color: red (0), amber (≤ threshold), green (> threshold)
- Add Product button → `/admin/products/new`

---

### 20. `src/components/FeaturedShowcase.tsx`

```typescript
'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import VoidShowcase from '@/components/VoidShowcase'
import type { Product } from '@/lib/supabase'

interface FeaturedShowcaseProps { products: Product[] }

// Category → ambient tint color mapping
const AMBIENT_TINTS: Record<string, string> = {
  'RC Cars': '#FF2D00',
  'RC Trucks & Crawlers': '#6B7C3A',
  'RC Drones': '#4A90D9',
  'RC Boats': '#2D9CDB',
  'Spare Parts': '#95A5A6',
  'Accessories': '#FF6B00',
  'Batteries & Chargers': '#F39C12',
}

// Category → floating RC-part fragment types
const AMBIENT_OBJECTS: Record<string, string[]> = {
  'RC Cars': ['body', 'tire', 'chassis', 'rim'],
  'RC Trucks & Crawlers': ['tire', 'link', 'chassis', 'body'],
  'RC Drones': ['prop', 'pcb', 'blade'],
  'RC Boats': ['body', 'gear'],
  'Spare Parts': ['gear', 'tire', 'pcb'],
  'Accessories': ['gear', 'chassis'],
  'Batteries & Chargers': ['pcb', 'gear'],
}

export default function FeaturedShowcase({ products }: FeaturedShowcaseProps) {
  const router = useRouter()

  const converted = useMemo(() => products.map(p => {
    const stockLabel =
      p.stock_quantity === 0 ? 'Out of Stock' :
      p.stock_quantity <= 3 ? `Last ${p.stock_quantity} left` :
      p.stock_quantity <= 5 ? `Last ${p.stock_quantity} left` :
      'In Stock'

    return {
      id: p.slug,
      name: p.name,
      category: p.category,
      categoryLabel: p.category,
      descriptor: p.short_descriptor ?? '',
      priceNPR: p.sale_price ?? p.regular_price,
      salePriceNPR: p.sale_price ? p.regular_price : undefined,
      imageSrc: p.images[0] ?? '',
      stock: stockLabel,
      badge: p.badge !== 'none' ? p.badge.toUpperCase() : undefined,
      specs: p.specs.map(s => s.value).join(' · '),
      ambientTint: AMBIENT_TINTS[p.category] ?? '#FF2D00',
      ambientObjects: AMBIENT_OBJECTS[p.category] ?? ['gear', 'tire'],
    }
  }), [products])

  return (
    <section id="featured-collection" className="relative w-full h-screen z-10">
      <VoidShowcase products={converted as any} showCTA={true} onViewAll={() => router.push('/products')} />
    </section>
  )
}
```

---

### 21. `src/components/VoidShowcase.tsx` — Immersive Product Viewer

This is the largest and most complex component. Build it completely.

It is a full-screen product viewer with:
- Dark void background (#06080F)
- Animated star field background (StarField component)
- God-ray spotlight effect from top center
- Floating ambient RC-part silhouettes (AmbientFragments component)
- Central product display area with animated canvas
- Left/right navigation arrows
- Bottom-left product information panel
- Diamond-dot navigation indicators
- Intro overlay that fades out after first interaction
- Keyboard navigation (ArrowLeft / ArrowRight)
- Touch swipe support (50px threshold)

Props:
```typescript
interface VoidShowcaseProps {
  products: RCProduct[]
  showCTA?: boolean
  onViewAll?: () => void
}
```

Product type used internally:
```typescript
interface RCProduct {
  id: string
  name: string
  category: string
  categoryLabel: string
  descriptor: string
  priceNPR: number
  salePriceNPR?: number
  badge?: string
  specs: string
  stock: string
  ambientTint: string
  imageSrc?: string
  ambientObjects: Array<'tire' | 'gear' | 'chassis' | 'pcb' | 'rim' | 'body' | 'prop' | 'link' | 'wing' | 'blade'>
}
```

#### ProductRenderer sub-component (CRITICAL):

This renders the product in the center. It uses a Canvas element and MUST:
1. First check if `product.imageSrc` exists and load it with `new Image()`
2. If the real image is loaded: draw it on canvas (letterboxed, max 390×310, centered)
3. If no image: draw a category-specific illustration as fallback
4. Apply floating animation (`Math.sin(t * 0.8) * amplitude`) on every frame
5. Apply subtle tilt oscillation on hover
6. Draw a soft ambient glow behind the product (radial gradient using `ambientTint`)
7. Draw a reflective floor below the product

```typescript
function ProductRenderer({ product, isHovered }: { product: RCProduct; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const tRef = useRef(0)
  const productImgRef = useRef<HTMLImageElement | null>(null)
  const imgLoadedRef = useRef(false)

  // Load real product image when imageSrc changes
  useEffect(() => {
    imgLoadedRef.current = false
    productImgRef.current = null
    const src = product.imageSrc
    if (!src) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { productImgRef.current = img; imgLoadedRef.current = true }
    img.onerror = () => { imgLoadedRef.current = false; productImgRef.current = null }
    img.src = src
  }, [product.imageSrc])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 600
    canvas.height = 520
    const tint = product.ambientTint

    const drawFrame = () => {
      tRef.current += 0.02
      const t = tRef.current
      const floatY = Math.sin(t * 0.8) * (isHovered ? 6 : 3)
      const hoverTiltX = isHovered ? Math.sin(t * 0.3) * 3 : 0
      ctx.clearRect(0, 0, 600, 520)
      const cx = 300
      const cy = 240 + floatY

      // Ambient halo on hover
      if (isHovered) {
        const halo = ctx.createRadialGradient(cx, cy, 60, cx, cy, 220)
        halo.addColorStop(0, `${tint}18`)
        halo.addColorStop(1, 'transparent')
        ctx.fillStyle = halo
        ctx.fillRect(0, 0, 600, 520)
      }

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((hoverTiltX * Math.PI) / 180)

      if (imgLoadedRef.current && productImgRef.current) {
        const img = productImgRef.current
        const maxW = 390, maxH = 310
        const imgAspect = img.naturalWidth / img.naturalHeight
        let drawW = maxW, drawH = maxW / imgAspect
        if (drawH > maxH) { drawH = maxH; drawW = maxH * imgAspect }
        const drawX = -drawW / 2, drawY = -drawH / 2

        // Soft glow behind photo
        const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, Math.max(drawW, drawH) * 0.75)
        glow.addColorStop(0, `${tint}30`)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(drawX - 50, drawY - 50, drawW + 100, drawH + 100)

        ctx.drawImage(img, drawX, drawY, drawW, drawH)
      } else {
        drawProductBody(ctx, product, tint, t)
      }

      ctx.restore()
      drawFloor(ctx, cx, cy + 160, product, tint)
      animRef.current = requestAnimationFrame(drawFrame)
    }

    animRef.current = requestAnimationFrame(drawFrame)
    return () => cancelAnimationFrame(animRef.current)
  }, [product, isHovered])

  return (
    <canvas ref={canvasRef} width={600} height={520}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-label={product.name} />
  )
}
```

The canvas illustration fallback functions (`drawProductBody`, `drawRCCarBody`,
`drawDroneBody`, `drawBoatBody`, `drawCrawlerBody`, `drawFloor`) should draw
stylized category-specific silhouettes using canvas 2D API with gradients and geometry.

#### Navigation and state:

```typescript
const [activeIndex, setActiveIndex] = useState(0)
const [direction, setDirection] = useState<'left' | 'right'>('right')
const [isTransitioning, setIsTransitioning] = useState(false)
const [showIntro, setShowIntro] = useState(true)
const [isHovered, setIsHovered] = useState(false)
```

Navigation `navigate(dir)`:
- Guards against transitioning while already transitioning
- Sets direction, hides copy, waits 550ms, updates index, shows copy, waits 700ms, clears transitioning

#### Animations:
- Use `framer-motion` `AnimatePresence` + `motion.div` for product transitions
- Products enter from opposite side of navigation direction
- Copy block (name, price, specs) uses staggered fade-in with `AnimatePresence`

#### Product info panel (bottom-left):
Shows: category label, product name, price (with sale price if applicable), specs string,
stock status, and a CTA button ("View All Products") if `showCTA` is true.

---

### 22. `src/components/StarField.tsx`

Canvas-based animated star field. Dynamic import with `ssr: false`.
- Generates ~150 stars at random positions
- Each star has random size (0.5–2px), opacity (0.1–0.8), and twinkle speed
- Uses `requestAnimationFrame` for animation
- Resizes with window

---

### 23. `src/components/AmbientFragments.tsx`

Canvas-based floating RC-part silhouettes. Dynamic import with `ssr: false`.
- Renders 8–12 abstract geometric shapes in the peripheral areas
- Shape types correspond to RC part names: tire (circle), gear (circle with notches),
  chassis (rectangle), pcb (small rectangle), prop (lines), blade (curves), etc.
- All shapes tinted to `ambientTint` at ~8–15% opacity
- Shapes float slowly (different speeds, sine wave vertical oscillation)
- `isTransitioning` prop makes them fade to lower opacity during product switches

---

### 24. `src/components/ScrollStory.tsx`

A scroll-driven hero section. Client Component.
- Uses a sticky container with `height: 500vh` to create scroll travel
- Inside: a sticky inner panel that stays fixed while user scrolls
- `scrollProgress` (0–1) computed from scroll position within the sticky zone
- Passes `scrollProgress` to `CanvasSequence` component (frame-based animation)
- Displays overlay text that transitions through headline phrases as user scrolls
- Text reveals: brand name → product categories → CTA
- Uses `Intersection Observer` or `scroll` event for progress tracking

---

### 25. `src/components/Navbar.tsx`

Fixed top navigation bar. Client Component.
- Logo: brand name on the left, uses Bebas Neue font
- Navigation links: "Products", "About", "Contact" (or business-appropriate links)
- Links to `/products`
- Becomes slightly more opaque on scroll (track `scrollY > 20`)
- On mobile: hamburger menu (optional, can be simplified)
- Dark background with subtle bottom border

---

### 26. `src/components/Footer.tsx`

Simple footer with:
- Brand name and tagline
- Navigation links
- Business info (location, contact)
- Copyright notice
- Dark background matching the overall theme

---

### 27. `src/app/admin/layout.tsx`

```typescript
'use client'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0D0D10]/90 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide">
            YOUR BRAND — <span className="text-[#FF2D00]">ADMIN</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors">
              View Site ↗
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 text-sm border border-gray-700 hover:border-[#FF2D00] text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-[1920px] mx-auto p-6">{children}</main>
    </div>
  )
}
```

---

## DESIGN SYSTEM — APPLY CONSISTENTLY

### Color Palette
```
Background primary:   #050505  (near black)
Background card:      #0D0D10  (dark card)
Background elevated:  #0a0a0c  (slightly lighter)
Accent red:           #FF2D00  (primary CTA, badges, highlights)
Accent amber:         #FF6B00  (gradient end, secondary accent)
Border default:       rgba(255,255,255,0.05)  (subtle border)
Border hover:         rgba(255,45,0,0.3)  (red-tinted on hover)
Text heading:         rgba(255,255,255,0.92)
Text body:            rgba(255,255,255,0.6)
Text muted:           rgba(255,255,255,0.35)
```

### Gradient Pattern
- Primary gradient: `from-[#FF2D00] to-[#FF6B00]` (red → amber, 135deg)
- Used on: primary buttons, active states, badges, stat numbers

### Font Usage
- Bebas Neue (`var(--font-bebas)`): page titles, section headers, large numbers
- Barlow Condensed (`var(--font-heading)`): subheadings, labels, nav items
- Inter (`var(--font-body)`): body copy, form fields, small text

### Tailwind v4 Font Reference
Always reference custom fonts as: `font-[family-name:var(--font-bebas)]`

---

## CRITICAL ARCHITECTURAL RULES

These rules MUST be followed exactly. Violating any of them will break the system.

### Rule 1: Server vs Client Components
- Default is Server Component — no directive needed
- Add `'use client'` ONLY when you need: `useState`, `useEffect`, event handlers,
  `useRouter`, `usePathname`, `useSearchParams`, `useSession`, or browser APIs
- NEVER add `'use client'` to `layout.tsx` (root) or page files that can be Server Components

### Rule 2: Server Actions are the ONLY backend
- ALL database operations go through `src/lib/actions.ts` with `'use server'`
- NEVER create additional API routes for CRUD operations
- NEVER call `supabaseAdmin` from a `'use client'` component — it would leak the service key
- The correct pattern: Client Component → calls Server Action → Server Action calls supabaseAdmin

### Rule 3: revalidatePath after every mutation
- Every function in `actions.ts` that writes to the database MUST call:
  ```typescript
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  ```
- Without this, users see stale cached data after mutations

### Rule 4: Two Supabase clients, strict separation
- `supabase` (anon key): for hypothetical public operations (not used in this project currently)
- `supabaseAdmin` (service role key): for ALL actual operations in actions.ts
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in or be imported by any `'use client'` file

### Rule 5: Middleware is the auth guard
- `middleware.ts` is the ONLY place auth is checked for route access
- Individual pages do NOT check for session
- The matcher regex `'/admin/((?!login).*)'` must not be changed or simplified

### Rule 6: Environment variable naming
- `NEXT_PUBLIC_*` = exposed to browser (only non-secret values)
- No prefix = server-only (never accessible in client bundle)
- If you expose a non-NEXT_PUBLIC_ variable to a client component, it will be `undefined`

### Rule 7: Image handling
- Images are uploaded directly browser → Cloudinary using unsigned preset
- Only the resulting `secure_url` string is stored in Supabase (in the `images` JSONB array)
- The `ProductRenderer` in VoidShowcase loads images using `new Image()` in a useEffect
- `img.crossOrigin = 'anonymous'` is required for canvas drawing of Cloudinary images

### Rule 8: Async params in App Router
- Dynamic route pages use `params: Promise<{ id: string }>` and `await params`
- This is the Next.js 15+ API — do not use the old synchronous params pattern

### Rule 9: Slug generation
- Slugs are always auto-generated in `actions.ts`, never manually entered by the admin
- On `createProduct`: generate from name
- On `updateProduct`: regenerate if name is changing

### Rule 10: No secrets in committed files
- `.env*` is in `.gitignore` — never commit real credentials
- Never put real API keys, passwords, or hashes in any `.md` file or documentation
- Any setup documentation that references real values must also be in `.gitignore`

---

## BUILD ORDER — EXECUTE IN THIS SEQUENCE

Follow this order to avoid import errors. Each step must be fully complete before the next.

```
Phase 1 — Foundation
  1.  Create Next.js project with create-next-app
  2.  Install all dependencies
  3.  Create .env.local with all keys (use placeholder values initially)
  4.  Write next.config.ts (Cloudinary remote pattern)
  5.  Write globals.css (design tokens + utilities)
  6.  Write supabase-schema.sql

Phase 2 — Type System & Library Layer
  7.  Write src/types/next-auth.d.ts
  8.  Write src/lib/supabase.ts (clients + Product type)
  9.  Write src/lib/auth.ts
  10. Write src/lib/cloudinary.ts
  11. Write src/lib/actions.ts (all 10 server actions)
  12. Write src/app/api/auth/[...nextauth]/route.ts
  13. Write src/middleware.ts

Phase 3 — Root Layout & Providers
  14. Write src/components/Providers.tsx
  15. Write src/app/layout.tsx

Phase 4 — Admin Panel
  16. Write src/app/admin/layout.tsx
  17. Write src/app/admin/login/page.tsx
  18. Write src/app/admin/dashboard/page.tsx
  19. Write src/components/admin/ImageUpload.tsx
  20. Write src/components/admin/ProductForm.tsx
  21. Write src/components/admin/ProductTable.tsx
  22. Write src/app/admin/products/page.tsx
  23. Write src/app/admin/products/new/page.tsx
  24. Write src/app/admin/products/[id]/edit/page.tsx

Phase 5 — Public Storefront
  25. Write src/components/Navbar.tsx
  26. Write src/components/Footer.tsx
  27. Write src/components/StarField.tsx
  28. Write src/components/AmbientFragments.tsx
  29. Write src/components/VoidShowcase.tsx
  30. Write src/components/ScrollStory.tsx
  31. Write src/components/FeaturedShowcase.tsx
  32. Write src/components/ProductsClientPage.tsx
  33. Write src/app/page.tsx
  34. Write src/app/products/page.tsx

Phase 6 — Verification
  35. Run: npm run build
  36. Fix all TypeScript errors
  37. Run: npm run dev
  38. Test admin login flow
  39. Test product creation
  40. Test product display on homepage
```

---

## POST-BUILD CHECKLIST

Before declaring the project complete, verify every item:

### Authentication
- [ ] `/admin/login` loads without errors
- [ ] Wrong password shows error + shake animation
- [ ] Correct credentials redirect to `/admin/dashboard`
- [ ] Directly visiting `/admin/dashboard` without login redirects to `/admin/login`
- [ ] Sign out returns to `/admin/login`

### Admin CRUD
- [ ] Dashboard stats cards show numbers from Supabase
- [ ] Products table loads all products
- [ ] Add new product — all 7 form sections present
- [ ] Image upload works (uploads to Cloudinary, shows preview)
- [ ] Saving a product redirects to `/admin/products`
- [ ] New product appears in the table
- [ ] Edit product pre-fills all form fields
- [ ] Delete product removes it from the table
- [ ] Drag-and-drop reorder works and persists
- [ ] Bulk select + bulk delete works

### Public Storefront
- [ ] Homepage loads — scroll story hero visible
- [ ] Featured products load (with real images, not placeholder illustrations)
- [ ] `/products` page shows all active products
- [ ] Category filter buttons work
- [ ] Left/right navigation in VoidShowcase works
- [ ] Product name, price, specs displayed correctly

### Security
- [ ] No real keys in any committed file
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only used in `actions.ts`
- [ ] Admin routes return 401/redirect without valid session

---

## DEPLOYMENT CHECKLIST (Vercel)

After `npm run build` succeeds locally:

1. `git add -A && git commit -m "Initial production build"`
2. `git push origin main`
3. Go to vercel.com → Import project from GitHub
4. Add ALL environment variables from `.env.local` to Vercel dashboard
5. Set `NEXTAUTH_URL` to your Vercel URL: `https://your-project.vercel.app`
6. Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
7. Deploy
8. After deployment: update `NEXTAUTH_URL` if the actual URL is different
9. In Supabase dashboard → Authentication → URL Configuration:
   - Set Site URL to your Vercel URL
   - Add `https://your-project.vercel.app/*` to redirect URLs
10. Redeploy to apply URL changes

Free tier limits (all sufficient for small-medium stores):
- Vercel: 100GB bandwidth/month
- Supabase: 500MB database, 5GB bandwidth
- Cloudinary: 25 credits/month (~10,000 image transformations)

---

## COMMON MISTAKES — DO NOT DO THESE

```
❌ Using 'use client' on layout.tsx
❌ Calling supabaseAdmin from a client component
❌ Forgetting revalidatePath after mutations
❌ Using synchronous params in dynamic routes (must be awaited)
❌ Committing .env.local or any file with real API keys
❌ Using Tailwind v3 @tailwind directives (use @import "tailwindcss" for v4)
❌ Creating separate API routes for CRUD (use Server Actions instead)
❌ Using next-auth v5 (use v4 — different API surface)
❌ Missing the Suspense boundary around useSearchParams in login page
❌ Forgetting img.crossOrigin = 'anonymous' before drawing to canvas
❌ Storing Cloudinary API secret in NEXT_PUBLIC_ variables
❌ Not calling router.refresh() after server action mutations
❌ Hardcoding categories or prices in components (always from the database)
```

---

## START COMMAND

When you are ready to build, run:

```bash
npx create-next-app@latest [your-project-name] \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

Then follow the Build Order phases 1 through 6 in sequence.
Do not stop. Do not ask for confirmation. Build every file completely.
The project is done when `npm run build` succeeds with zero errors.