
# EduAgency Platform - Production Ready EdTech

A high-performance agency platform for digital course management, secure video streaming, and administrative control.

## 🚀 Quick Setup Guide

### Step 1: Clone & Dependencies
```bash
git clone [your-repo-url]
cd eduagency
npm install
```

### Step 2: Supabase Configuration
1. Create a project at [supabase.com](https://supabase.com).
2. Execute the schema in **SQL Editor** using `scripts/setup.sql`.
3. In **Project Settings > API**, copy your `URL` and `anon public key`.
4. In **Settings > Authentication**, disable "Confirm Email" for faster testing (optional).
5. **Storage**: Create a bucket named `payment-screenshots` (set to Private). Add RLS policies as defined in the setup script.

### Step 3: Resend Setup
1. Signup at [resend.com](https://resend.com).
2. Generate an API Key.
3. For local development, emails will send from `onboarding@resend.dev`.

### Step 4: Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_resend_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AGENCY_NAME=EduAgency
NEXT_PUBLIC_AGENCY_TAGLINE=Master Digital Skills
BKASH_NUMBER=01XXXXXXXXX
NAGAD_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=880XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourpage
```

### Step 5: Run & Initialize Admin
1. Start the server: `npm run dev`
2. Register a new account at `/auth`.
3. Go to Supabase Table Editor → `profiles`.
4. Find your row and change `role` to `super_admin`.
5. Access your dashboard at `/admin`.

---

## 📹 How to Add Course Content
1. **Host Video**: Upload to Google Drive.
2. **Share**: Set permission to "Anyone with the link can view".
3. **Extract ID**: In the share link `drive.google.com/file/d/[ID_HERE]/view`, copy only the ID.
4. **Publish**: In the Admin Panel, click "Manage Lessons" on a course and paste the ID.

## 🛡 Security Features
- **Middleware-based IP Blocking**: Malicious IPs can be blacklisted instantly.
- **Secure Stream Wrapper**: Prevents right-clicking and basic inspector interaction on video modules.
- **Signed Storage URLs**: Student payment proofs are only accessible by administrators.
