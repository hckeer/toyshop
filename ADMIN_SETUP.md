# RC Toys Nepal - Admin Panel Setup Guide

## Overview

Your RC Toys Nepal website now has a complete production-ready admin panel with:
- **Authentication**: Secure single-user login with NextAuth.js
- **Database**: PostgreSQL via Supabase for real-time product management
- **Image Storage**: Cloudinary for optimized image delivery
- **Admin Features**: Full CRUD operations, drag-and-drop reordering, bulk actions, and more

---

## Step 1: Set Up Supabase Database

1. **Go to your Supabase project** at [https://supabase.com](https://supabase.com)

2. **Run the database migration**:
   - Click on the **SQL Editor** in the left sidebar
   - Click **New Query**
   - Copy the entire contents of `supabase-schema.sql` (in your project root)
   - Paste it into the SQL editor
   - Click **Run** to execute

3. **Verify the setup**:
   - Click on **Table Editor** in the left sidebar
   - You should see a `products` table with sample data (2 products)
   - Verify the columns match the schema

---

## Step 2: Configure Environment Variables

All your environment variables are already set in `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here-generate-with-openssl-rand-base64-32

# Admin Credentials
ADMIN_EMAIL=admin@rctoysnepal.com
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here-see-changing-admin-password-section-below
# Default password is: admin123 (CHANGE THIS!)

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**IMPORTANT**: For production deployment, you MUST:
1. Change the admin password (see "Changing Admin Password" below)
2. Update `NEXTAUTH_URL` to your production domain
3. Generate a new `NEXTAUTH_SECRET` for production

---

## Step 3: Start the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see your storefront (now reading from the database!)

---

## Step 4: Access the Admin Panel

1. **Navigate to the login page**: http://localhost:3000/admin/login

2. **Login with default credentials**:
   - Email: `admin@rctoysnepal.com`
   - Password: `admin123`

3. **You'll be redirected to**: http://localhost:3000/admin/dashboard

---

## Admin Panel Features

### Dashboard (`/admin/dashboard`)
- **Stats Cards**: Total products, in stock, low stock, out of stock
- **Quick Actions**: Add new product, manage products
- **Getting Started Tips**: Best practices for managing your catalog

### Products Management (`/admin/products`)
- **Search & Filter**: Real-time search by name, filter by category
- **Sortable Table**: Drag and drop rows to reorder products
- **Bulk Actions**: 
  - Select multiple products with checkboxes
  - Set active/hidden status in bulk
  - Delete multiple products at once
- **Individual Actions**: Edit or delete each product

### Add/Edit Product (`/admin/products/new` or `/admin/products/[id]/edit`)

**Section 1 - Basic Info**:
- Product name (required)
- Category dropdown (required)
- Short descriptor (one-line tagline)
- Full description (detailed product info)

**Section 2 - Pricing**:
- Regular price in NPR (required)
- Optional sale price
- Auto-calculated savings display

**Section 3 - Images** (required):
- Drag-and-drop upload zone
- Direct upload to Cloudinary
- Reorderable image gallery
- First image = main product image

**Section 4 - Specs**:
- Dynamic spec fields (name + value)
- Category-specific templates (e.g., "Use RC Car Template")
- Add/remove specs as needed

**Section 5 - In The Box**:
- Dynamic list of included items
- Add/remove items as needed

**Section 6 - Badges & Visibility**:
- Badge selector: None, NEW, SALE, BESTSELLER, SOLD OUT
- Active toggle (show/hide on storefront)
- Featured toggle (show in homepage featured section)

**Section 7 - Inventory**:
- Stock quantity
- Low stock alert threshold

**Form Actions**:
- Save as Draft (hidden from storefront)
- Publish Product (visible on storefront)

---

## How Data Flows to the Storefront

### Homepage Featured Section
- Reads products where `is_featured = true`
- Ordered by `display_order`
- Limited to 5 products
- Updates instantly when you change featured status

### Products Page (`/products`)
- Reads all products where `is_active = true`
- Ordered by `display_order`
- Respects your drag-and-drop order from admin

### Product Detail Pages
- Fetches by product `slug` (auto-generated from name)
- Shows all product data, specs, images, and in-the-box items

---

## Changing the Admin Password

### Option 1: Generate a new hash (Recommended)

1. **In your terminal**, run:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourNewPassword', 10, (err, hash) => console.log(hash))"
```

2. **Copy the generated hash** (looks like `$2b$10$...`)

3. **Update `.env.local`**:
```env
ADMIN_EMAIL=admin@rctoysnepal.com  # or change to your email
ADMIN_PASSWORD_HASH=<paste the new hash here>
```

4. **Restart the dev server**

### Option 2: Change the email and password

Simply update both `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` in `.env.local`, then generate a new hash for your password.

---

## Deploying to Production

### 1. Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### 2. Set Environment Variables in Vercel Dashboard

Go to your project settings → Environment Variables and add:

- `NEXTAUTH_URL` → Your production URL (e.g., `https://rctoysnepal.com`)
- `NEXTAUTH_SECRET` → Generate a new one: `openssl rand -base64 32`
- `ADMIN_EMAIL` → Your admin email
- `ADMIN_PASSWORD_HASH` → Hash of your secure password
- All Supabase and Cloudinary variables (same as `.env.local`)

### 3. Update Supabase URL Pattern (if needed)

If your Supabase URL looks different, update it in:
- `NEXT_PUBLIC_SUPABASE_URL`

### 4. Deploy!

```bash
vercel --prod
```

---

## Troubleshooting

### "Invalid credentials" when logging in
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` match in `.env.local`
- Verify you're using the correct password (default: `admin123`)
- Restart the dev server after changing `.env.local`

### Images not uploading
- Verify your Cloudinary credentials in `.env.local`
- Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are correct
- Test upload directly in Cloudinary dashboard

### Products not appearing on storefront
- Verify the product `is_active` is set to `true`
- Check the database in Supabase Table Editor
- Clear browser cache or open in incognito mode

### Database connection errors
- Verify Supabase credentials are correct
- Check that the `products` table exists (run `supabase-schema.sql` again)
- Ensure your Supabase project is active

---

## Next Steps

1. **Delete sample products** and add your real RC Toys Nepal inventory
2. **Upload high-quality product images** via the admin panel
3. **Set up featured products** for your homepage showcase
4. **Test the reordering** to control product display order
5. **Change the default admin password** before going live!

---

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the terminal where `npm run dev` is running
3. Verify all environment variables are set correctly
4. Ensure the Supabase database schema was created successfully

---

## Security Best Practices

✅ **Change the default password immediately**  
✅ **Use a strong, unique password for production**  
✅ **Never commit `.env.local` to version control** (already in `.gitignore`)  
✅ **Rotate your `NEXTAUTH_SECRET` for production**  
✅ **Keep your Supabase service role key private**

---

**Your RC Toys Nepal admin panel is now live and ready to manage your inventory!** 🚀
