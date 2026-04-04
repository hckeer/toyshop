# ✅ Quick Start Checklist

## Before You Start

- [ ] Have Supabase account ready
- [ ] Have Cloudinary account with credentials
- [ ] Have the codebase with all new files

---

## Setup Steps (5 minutes)

### 1️⃣ Configure Supabase URL

Open `.env.local` and update line 11:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
```

**How to find your project reference:**
1. Go to your Supabase dashboard
2. Click **Settings** → **API**
3. Look for **Project URL** (e.g., `https://abcdefgh.supabase.co`)
4. Copy the part before `.supabase.co` (e.g., `abcdefgh`)
5. Update the URL in `.env.local`

---

### 2️⃣ Create the Database

1. Open Supabase dashboard
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Open `supabase-schema.sql` from your project
5. Copy entire contents
6. Paste into SQL Editor
7. Click **Run** (green play button)

**Verify it worked:**
- Click **Table Editor** in left sidebar
- You should see `products` table
- Should have 2 sample products

---

### 3️⃣ Start the Server

```bash
npm run dev
```

Wait for it to compile...

---

### 4️⃣ Test the Storefront

Open: http://localhost:3000

You should see:
- Homepage with featured products section showing 2 sample products from database
- Products page shows the same 2 products

---

### 5️⃣ Login to Admin

1. Go to: http://localhost:3000/admin/login
2. Email: `admin@rctoysnepal.com`
3. Password: `admin123`
4. Click **Sign In**

You should be redirected to the dashboard!

---

## What to Do Next

### Immediate (Before Adding Real Products)

- [ ] **Change admin password** (see `ADMIN_SETUP.md` → "Changing the Admin Password")
- [ ] **Delete sample products** in admin panel
- [ ] **Test adding a product** with your RC toy images

### Optional but Recommended

- [ ] Update admin email in `.env.local`
- [ ] Test Cloudinary upload (add a product with images)
- [ ] Test product reordering (drag & drop in products table)
- [ ] Test featured toggle (mark products as featured, check homepage)

---

## Troubleshooting Quick Fixes

### "Invalid credentials" on login
→ Restart dev server: `Ctrl+C` then `npm run dev`

### Database errors
→ Re-run the SQL in Supabase (step 2)

### No products on homepage
→ Check Supabase Table Editor, verify products exist and `is_featured = true`

### Images not uploading
→ Verify Cloudinary credentials in `.env.local`

---

## Need Help?

See the full documentation in:
- **`ADMIN_SETUP.md`** - Complete setup guide
- **`README_ADMIN.md`** - Feature overview and architecture

---

**Once you complete these steps, you're ready to manage your RC Toys Nepal inventory!** 🚀
