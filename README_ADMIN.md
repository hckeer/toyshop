# RC Toys Nepal - Admin Panel Summary

## What I Built

A complete, production-ready admin panel for RC Toys Nepal with the following features:

### 🔐 Authentication
- **NextAuth.js** with credentials provider
- Single admin user (email + password)
- Protected routes with middleware
- Secure login page at `/admin/login`
- Default credentials: `admin@rctoysnepal.com` / `admin123`

### 💾 Database
- **Supabase (PostgreSQL)** for data storage
- Complete products table schema with:
  - Product info (name, category, descriptions, pricing)
  - Image URLs (stored in Cloudinary)
  - Specs and in-the-box items (JSON fields)
  - Stock management
  - Visibility controls (active, featured)
  - Display ordering
- 2 sample products included

### 🖼️ Image Management
- **Cloudinary** integration for image uploads
- Drag-and-drop upload zone
- Multi-image support (up to 10 per product)
- Reorderable image gallery
- Direct browser-to-Cloudinary uploads

### 📊 Admin Dashboard (`/admin/dashboard`)
- Stats cards: Total products, in stock, low stock, out of stock
- Quick action buttons
- Getting started guide

### 🛠️ Product Management (`/admin/products`)
- **Data table with**:
  - Search by product name
  - Filter by category
  - Sortable columns
  - Product thumbnails
- **Drag-and-drop reordering** (changes storefront display order)
- **Bulk actions**:
  - Select multiple products
  - Set active/hidden
  - Delete multiple
- **Individual actions**: Edit, Delete (with confirmation)

### ✏️ Product Form (`/admin/products/new` or `/edit`)
- **7 organized sections**:
  1. Basic Info (name, category, descriptions)
  2. Pricing (regular + optional sale price with auto-calculated savings)
  3. Images (Cloudinary upload with preview)
  4. Specs (dynamic fields with category templates)
  5. In The Box (dynamic item list)
  6. Badges & Visibility (NEW/SALE/BESTSELLER, active toggle, featured toggle)
  7. Inventory (stock quantity, low stock threshold)
- **Category templates** for pre-filling specs (RC Cars, Drones, etc.)
- **Save as Draft** or **Publish** options
- Real-time validation

### 🌐 Storefront Integration
- Homepage featured section reads from database (`is_featured = true`)
- Products page reads all active products
- Both respect the drag-and-drop `display_order`
- Instant updates when you publish/edit products

### 🎨 Dark Premium UI
- Matches RC Toys Nepal aesthetic (#050505 background, #FF2D00 red accents)
- Bebas Neue headings, DM Sans body text
- Glassmorphism effects
- Toast notifications for user feedback
- Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Drag & Drop**: @dnd-kit
- **Notifications**: react-hot-toast
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety

## Files Created

### Configuration
- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/supabase.ts` - Supabase client setup
- `src/lib/actions.ts` - Server actions for CRUD operations
- `src/lib/cloudinary.ts` - Image upload utilities
- `src/proxy.ts` - Route protection
- `src/types/next-auth.d.ts` - TypeScript type augmentation
- `.env.local` - Environment variables
- `supabase-schema.sql` - Database schema

### Admin Pages
- `src/app/admin/login/page.tsx` - Login page
- `src/app/admin/layout.tsx` - Admin layout with nav
- `src/app/admin/dashboard/page.tsx` - Dashboard with stats
- `src/app/admin/products/page.tsx` - Products listing
- `src/app/admin/products/new/page.tsx` - Add product
- `src/app/admin/products/[id]/edit/page.tsx` - Edit product

### Components
- `src/components/Providers.tsx` - NextAuth + Toast provider
- `src/components/admin/ProductTable.tsx` - Data table with search/filter/drag
- `src/components/admin/ProductForm.tsx` - Full product form
- `src/components/admin/ImageUpload.tsx` - Cloudinary upload component

### API Routes
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler

### Documentation
- `ADMIN_SETUP.md` - Complete setup instructions
- `README_ADMIN.md` - This summary

## Setup Steps (Quick Start)

1. **Run database migration** in Supabase SQL Editor:
   - Copy contents of `supabase-schema.sql`
   - Paste and execute

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Login to admin**:
   - Go to http://localhost:3000/admin/login
   - Email: `admin@rctoysnepal.com`
   - Password: `admin123`

4. **Start adding products!**

## Security Notes

⚠️ **IMPORTANT**: Before deploying to production:

1. Change the default admin password
2. Generate a new `NEXTAUTH_SECRET`
3. Update `NEXTAUTH_URL` to your production domain
4. Never commit `.env.local` to git (already in `.gitignore`)

## Authentication Choice: NextAuth.js

You mentioned wanting to use NextAuth, and I went with **NextAuth.js v5** because:

✅ **Free** - 100% open source, no pricing tiers  
✅ **Real** - Industry standard with 20k+ GitHub stars  
✅ **Simple** - Perfect for single admin user setup  
✅ **Secure** - Built-in CSRF protection, secure sessions  
✅ **Flexible** - Easy to add OAuth later if needed  

Alternatives like Auth0, Clerk, or Supabase Auth would work but add unnecessary complexity for a single admin user. NextAuth is the perfect fit for this use case.

---

**Your admin panel is ready! See `ADMIN_SETUP.md` for detailed setup instructions.** 🎉
