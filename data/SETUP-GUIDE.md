# 🚀 Quick Setup Guide

## ⚠️ IMPORTANT: Run This First!

You're seeing an error because the `users` table doesn't exist in your Supabase database yet.

## Step-by-Step Setup

### 1️⃣ Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `stfrwzveehgxhwwqfbtt`
3. Click on **SQL Editor** in the left sidebar

### 2️⃣ Create the Users Table

1. Click **New Query** button
2. Copy **ALL** the contents from: `data/create-users-table.sql`
3. Paste into the SQL editor
4. Click **Run** (or press Ctrl+Enter)

You should see: ✅ Success. No rows returned

### 3️⃣ Verify Table Creation

Run this query to verify:

```sql
SELECT * FROM users;
```

You should see 2 users:
- `admin` (admin@malit.dev)
- `mowlid` (malitmohamud@gmail.com)

### 4️⃣ Test Login

1. Go to: http://localhost:5174/admin
2. Try logging in with:
   - **Username:** `mowlid`
   - **Password:** `Myadmin2025@?`

OR

   - **Username:** `admin`
   - **Password:** `admin123`

## 🔍 Troubleshooting

### Error: "relation 'users' does not exist"
**Solution:** You haven't run the SQL file yet. Go back to Step 2.

### Error: "Cannot coerce the result to a single JSON object"
**Solution:** The table exists but has no users. Run the INSERT statements from `create-users-table.sql`

### Error: "Invalid username or password"
**Possible causes:**
1. Table exists but users weren't inserted
2. Wrong username/password
3. User is not active

**Check with:**
```sql
SELECT username, email, is_active FROM users;
```

### Can't access Supabase Dashboard
**Solution:** Make sure you're logged in to Supabase with the account that owns this project.

## 📋 What Gets Created

Running `create-users-table.sql` will create:

1. **`users` table** - Stores admin accounts
2. **`password_history` table** - Tracks password changes
3. **2 admin users** - Default admin + Your account (mowlid)
4. **Security policies** - Row Level Security enabled
5. **Triggers** - Auto-update timestamps

## ✅ Success Checklist

- [ ] Opened Supabase Dashboard
- [ ] Ran `create-users-table.sql` in SQL Editor
- [ ] Verified 2 users exist in the table
- [ ] Successfully logged in with username `mowlid`
- [ ] Changed password in Settings tab
- [ ] Password saved to database

## 🆘 Still Having Issues?

1. **Check your .env.local file:**
   ```env
   VITE_SUPABASE_URL=https://stfrwzveehgxhwwqfbtt.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **Check browser console** for detailed error messages

3. **Verify Supabase connection:**
   - Go to Supabase Dashboard → Settings → API
   - Make sure URL and anon key match your .env.local

4. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload the page

## 📞 Need Help?

If you're still stuck:
1. Check the error message in browser console (F12)
2. Verify the table exists: `SELECT * FROM users;`
3. Check if RLS is blocking access (it shouldn't with anon key)

---

**Next Steps After Setup:**
1. ✅ Login with your credentials
2. ✅ Go to Settings tab
3. ✅ Test password change
4. ✅ Verify password history tracking
5. ✅ Test breach detection with a weak password
