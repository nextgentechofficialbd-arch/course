# ✅ Deployment Checklist

Run through this list before announcing your platform to students.

### 1. Database & Auth
- [ ] `seed.sql` executed successfully.
- [ ] Email auth enabled in Supabase.
- [ ] Storage bucket `payment-screenshots` is created and public.

### 2. Branding & Payments
- [ ] `NEXT_PUBLIC_BKASH_NUMBER` is correct.
- [ ] `NEXT_PUBLIC_NAGAD_NUMBER` is correct.
- [ ] Agency logo/name set in environment variables.

### 3. Email System
- [ ] Resend API Key is active.
- [ ] Test email sent successfully.
- [ ] Access link in email points to the correct production URL.

### 4. Content Protection
- [ ] Video right-click is disabled.
- [ ] Video overlay is active.
- [ ] Google Drive files set to "Anyone with link can view".

### 5. Mobile Experience
- [ ] Course player sidebar collapses on mobile.
- [ ] Navbar menu works on mobile.
- [ ] Payment form is easy to fill on a phone.

### 6. Admin Setup
- [ ] First admin account promoted to `super_admin` in Supabase.
- [ ] Admin can see the "Enrollments" badge count.