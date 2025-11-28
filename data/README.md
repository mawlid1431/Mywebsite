# Database Setup Instructions

This folder contains SQL files for setting up your Supabase database.

## Files

- `create-users-table.sql` - Creates users and password_history tables for admin authentication
- `create-testimonials-trusted.sql` - Creates testimonials and trusted_companies tables for portfolio content

## How to Apply SQL Files

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `create-users-table.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the SQL file
supabase db push
```

## Tables Created

### `users` Table
Stores admin user information for authentication.

**Columns:**
- `id` - Primary key (auto-increment)
- `username` - Unique username for login
- `email` - Unique email address
- `name` - Full name of the user
- `password` - Password (should be hashed in production)
- `role` - User role (default: 'admin')
- `is_active` - Account status (default: true)
- `last_login` - Timestamp of last successful login
- `password_changed_at` - Timestamp of last password change
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### `password_history` Table
Tracks password history to prevent password reuse.

**Columns:**
- `id` - Primary key (auto-increment)
- `user_id` - Foreign key to users table
- `password_hash` - SHA-256 hash of the password
- `created_at` - Timestamp when password was set

## Default Admin Users

After running the SQL file, two admin users will be created:

### User 1 (Default Admin)
- **Username:** `admin`
- **Email:** `admin@malit.dev`
- **Password:** `admin123`
- **Role:** `admin`

### User 2 (Primary Admin)
- **Username:** `mowlid`
- **Email:** `malitmohamud@gmail.com`
- **Name:** `Mowlid Haibe`
- **Password:** `Myadmin2025@?`
- **Role:** `admin`

⚠️ **IMPORTANT:** These credentials are also stored in `.env.local` for reference.

## Security Notes

1. **Password Hashing:** In production, passwords should be properly hashed using bcrypt or similar
2. **Row Level Security (RLS):** The tables have RLS enabled for security
3. **Password History:** System tracks last 5 passwords to prevent reuse
4. **Breach Detection:** Integrated with Have I Been Pwned API to check for compromised passwords

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Error: "relation 'users' already exists"
The table already exists. You can either:
- Drop the existing table: `DROP TABLE users CASCADE;`
- Or skip this error if the table structure is correct

### Error: "permission denied"
Make sure you're running the SQL as a database owner or have sufficient privileges.

### Can't login after setup
1. Verify the user was created: `SELECT * FROM users;`
2. Check if the user is active: `SELECT is_active FROM users WHERE username = 'admin';`
3. Verify your credentials match the database

## Testimonials & Trusted Companies Setup

### `create-testimonials-trusted.sql`

This file creates two new tables for managing portfolio content:

#### `testimonials` Table
Stores customer testimonials and reviews.

**Columns:**
- `id` - Primary key (auto-increment)
- `name` - Person's full name
- `role` - Job title and company (e.g., "CEO at TechCorp")
- `rating` - Star rating (1-5)
- `feedback` - Testimonial text
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### `trusted_companies` Table
Stores logos of trusted companies/clients.

**Columns:**
- `id` - Primary key (auto-increment)
- `name` - Company name
- `logo_url` - URL to company logo image
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Features:**
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access (anyone can view)
- ✅ Authenticated write access (only admins can modify)
- ✅ Auto-update triggers for timestamps
- ✅ Performance indexes
- ✅ Sample data included for testing

**How to Apply:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `create-testimonials-trusted.sql`
3. Paste and click "Run"
4. Tables will be created with sample data
5. Access via Admin Dashboard → Testimonials/Trusted tabs

## Additional SQL Files

As you add more features, additional SQL files will be saved here:
- Migration files
- Seed data
- Schema updates
- Custom functions and triggers
