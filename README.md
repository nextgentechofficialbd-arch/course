# EduAgency Platform - Setup & Deployment Guide

Welcome to the **EduAgency** deployment guide. Follow these steps to get your premium EdTech agency live.

## 🚀 Step 1: Local Setup
1. Clone the repository: `git clone <your-repo-url>`
2. Install dependencies: `npm install`
3. Initialize shadcn/ui: `npx shadcn-ui@latest init`

## 🛠 Step 2: Supabase Configuration
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the contents of `scripts/seed.sql`.
3. Go to **Project Settings > API** and copy `URL` and `Anon Key`.
4. Enable **Storage**: Create a bucket named `payment-screenshots` and set it to public.

## 📧 Step 3: Resend Configuration
1. Create an account at [resend.com](https://resend.com).
2. Get your `RESEND_API_KEY`.
3. Verify your domain (e.g., `eduagency.io`) in the Resend dashboard to send emails from `no-reply@yourdomain.com`.

## 📄 Step 4: Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AGENCY_NAME=EduAgency
NEXT_PUBLIC_BKASH_NUMBER=017xx-xxxxxx
NEXT_PUBLIC_NAGAD_NUMBER=018xx-xxxxxx
```

## 🌍 Step 5: Vercel Deployment
1. Connect your GitHub repo to Vercel.
2. Select **Next.js** framework.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

## 🔐 Step 6: Setting the first Admin
To access `/admin`, your user profile must have the `role` set to `super_admin`.
1. Sign up on your site normally.
2. Go to Supabase Dashboard > Table Editor > `profiles`.
3. Change the `role` column for your user ID to `super_admin`.

---

## 📽 Adding Course Content
1. Go to your Admin Panel.
2. Create a **New Course**.
3. To add lessons, you need the **Google Drive File ID**:
   - Upload video to Drive.
   - Right-click > Share > "Anyone with the link can view".
   - Copy link: `https://drive.google.com/file/d/1ABC_123_XYZ/view?usp=sharing`
   - The File ID is: `1ABC_123_XYZ`
   - Paste this ID into the Lesson Manager.