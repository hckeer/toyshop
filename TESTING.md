# Testing Checklist

After clearing the `.next` cache and restarting, test these:

## 1. Homepage
- [ ] Visit http://localhost:3000
- [ ] Should load without errors
- [ ] May show empty featured section (no featured products in DB yet)

## 2. Admin Login
- [ ] Visit http://localhost:3000/admin/login  
- [ ] Should see dark login form with "RC TOYS NEPAL" logo
- [ ] Try logging in with: `admin@rctoysnepal.com` / `admin123`

## 3. If Login Works
- [ ] Should redirect to /admin/dashboard
- [ ] See stats cards (may all be 0)
- [ ] Click "Manage Products"
- [ ] Try adding a test product

## Common Issues

### Chunk Loading Error
If you still get chunk errors:
1. Kill the server: `Ctrl+C`
2. Clear cache: `rm -rf .next`  
3. Restart: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R`

### Supabase Connection Error
- Check `.env.local` line 11 for correct Supabase URL
- Verify you ran the SQL migration in Supabase dashboard

### NextAuth Error
- Make sure `NEXTAUTH_URL=http://localhost:3000`
- Restart server after changing `.env.local`

---

**Try restarting the server now:**
```bash
npm run dev
```

Then visit http://localhost:3000/admin/login
