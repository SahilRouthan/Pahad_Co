# PAHAD.co — Production-Ready Event Management & Destination Weddings

> *“You Dream It, We Make It Extraordinary.”*  
> *“We don’t just plan events, we create moments that last forever.”*

PAHAD.co is an event planning and management business based in Dehradun, Uttarakhand, India. We organize memorable events ranging from intimate celebrations to large-scale corporate functions and destination weddings amidst the Himalayan mountains.

---

## 🏔️ Architecture & Production Backend

PAHAD.co is engineered with a **production-ready Supabase backend**:
- **PostgreSQL Database**: Scalable, relational database with strict constraints and indexes.
- **Supabase Authentication**: Secure session persistence, email/password verification, and JWTs.
- **Supabase Storage (`gallery-images`)**: Cloud image storage with public read and admin-only upload/delete permissions.
- **Row Level Security (RLS)**: Enforced at the database level on every table.
- **Role-Based Access Control**: PostgreSQL `is_admin()` security definer function protecting administrative tables and actions.
- **Automated Verification Suite**: `npm run test:supabase` for end-to-end database, RLS, and storage testing.
- **Graceful Dual-Mode Support**: Connects directly to Supabase when credentials are configured, with local fallback for offline development.

---

## 🗄️ Database Tables & Schema

All tables and policies are located in [`supabase/schema.sql`](file:///c:/Users/sahil/OneDrive/Desktop/The_Pahad_co/supabase/schema.sql):

### 1. `inquiries`
Client event inquiries and consultation bookings.
- `id` (UUID, Primary Key)
- `customer_name` (Text, Not Null)
- `email` (Text, Not Null)
- `phone` (Text, Not Null)
- `event_type` (Text, Not Null)
- `event_date` (Text, Not Null)
- `event_location` (Text, Not Null)
- `budget` (Text)
- `message` (Text, Not Null)
- `status` (`new`, `contacted`, `in_progress`, `completed`, `rejected`)
- `admin_notes` (Text)
- `created_at` (Timestamp with timezone)
- **RLS**: Public can INSERT (status forced to `'new'`). Only authenticated admins can SELECT, UPDATE, DELETE.

### 2. `reviews`
Client testimonials and event ratings.
- `id` (UUID, Primary Key)
- `customer_name` (Text, Not Null)
- `rating` (Integer, 1–5)
- `review_text` (Text, Not Null)
- `event_type` (Text)
- `event_location` (Text)
- `approval_status` (`pending`, `approved`, `rejected`)
- `approved_at` (Timestamp with timezone)
- `created_at` (Timestamp with timezone)
- **RLS**: Public can INSERT with `'pending'`. Public can SELECT only `'approved'` reviews. Admins have full moderation rights.

### 3. `gallery`
Dynamic photography portfolio connected to Supabase Storage.
- `id` (UUID, Primary Key)
- `image_url` (Text, Not Null)
- `title` (Text, Not Null)
- `description` (Text)
- `category` (Text, Not Null)
- `display_order` (Integer, Default 0)
- `storage_path` (Text, Bucket object path)
- `created_at` (Timestamp with timezone)
- **RLS**: Public can SELECT all items. Admins can INSERT, UPDATE, DELETE. Deleting an item removes the file from the Storage bucket.

### 4. `feedback`
Client service quality feedback and suggestions.
- `id` (UUID, Primary Key)
- `customer_name` (Text, Not Null)
- `email` (Text, Not Null)
- `feedback_type` (Text, Not Null)
- `rating` (Integer, 1–5)
- `message` (Text, Not Null)
- `status` (`new`, `reviewed`, `archived`)
- `admin_notes` (Text)
- `created_at` (Timestamp with timezone)
- **RLS**: Public can INSERT. Only admins can SELECT, UPDATE, DELETE.

### 5. `admin_users`
Admin roles tied directly to Supabase `auth.users(id)`.
- `id` (UUID, references `auth.users(id)`)
- `email` (Text, Unique)
- `role` (`admin`, `super_admin`)
- `full_name` (Text)
- `created_at` (Timestamp with timezone)

---

## ⚡ Quick Supabase Setup in 3 Steps

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/) and click **New Project**.
2. Name the project `PAHAD-co` and choose your preferred region (e.g. Mumbai / South Asia).

### Step 2: Run SQL Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Copy and paste the contents of [`supabase/schema.sql`](file:///c:/Users/sahil/OneDrive/Desktop/The_Pahad_co/supabase/schema.sql) and click **Run**.
3. (Optional) Run [`supabase/seed.sql`](file:///c:/Users/sahil/OneDrive/Desktop/The_Pahad_co/supabase/seed.sql) to populate curated Himalayan wedding gallery images and initial testimonials.
4. Run [`supabase/create_admin.sql`](file:///c:/Users/sahil/OneDrive/Desktop/The_Pahad_co/supabase/create_admin.sql) to enable automatic admin role assignment.

### Step 3: Create an Admin Account
1. In Supabase Dashboard, go to **Authentication** -> **Users** -> **Add user** -> **Create user**.
2. Enter email: `admin@pahad.co` (or your preferred admin email).
3. Set a strong password and check **Auto Confirm User**.
4. Copy the User UUID and link it in the SQL Editor:
   ```sql
   INSERT INTO public.admin_users (id, email, role, full_name)
   VALUES ('<YOUR_USER_UUID>', 'admin@pahad.co', 'admin', 'Lead Event Producer')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
# Supabase Production Backend
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-public-anon-key...
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key...

# Local Dev Settings
PORT=5000
NODE_ENV=production
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🧪 Testing & Verification

Run the automated test suite to verify your Supabase database, RLS policies, and storage bucket:

```bash
npm run test:supabase
```

This verifies:
- PostgreSQL connection & latency.
- Public inquiry submission (`inquiries` table).
- RLS read security (ensuring public/anon cannot read customer inquiries).
- Customer review submission with forced `pending` approval status.
- Storage bucket availability (`gallery-images`).

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open in browser:
   - **Public Website**: [http://localhost:5173](http://localhost:5173)
   - **Full Gallery**: [http://localhost:5173/#gallery-page](http://localhost:5173/#gallery-page)
   - **Admin Management Portal**: [http://localhost:5173/#admin](http://localhost:5173/#admin)

4. Production Build:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚀 Live Production Deployment

### Option A: Vercel / Netlify / Cloudflare Pages (Frontend SPA)
1. Push your repository to GitHub.
2. Link the repository in **Vercel** or **Netlify**.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy! Custom domain (`pahad.co`) and SSL/HTTPS are provisioned automatically.

### Option B: Node.js Server (Render / Railway / VPS)
1. Deploy using `npm run build && npm run start`.
2. Set `NODE_ENV=production`, `PORT=5000`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.

---

## 🔒 Security Best Practices Implemented

- **Row Level Security (RLS)**: Enforced on 100% of tables. Anon users cannot query private inquiries or pending reviews.
- **Client & Server Validation**: Full format checking for emails, Indian/international phone numbers, and content length.
- **Least-Privilege Keys**: Only the `anon` public key is bundled in frontend code. The `service-role` key is never exposed to the client.
- **Spam Protection**: Rate limiting and status-locking (inquiries and reviews can only be submitted in initial pending/new states).
- **Safe File Handling**: MIME type filtering (JPEG, PNG, WebP) and size limits enforced both in Supabase Storage and client UI.
