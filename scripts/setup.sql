
-- ============================================
-- EDUAGENCY CORE DATABASE SETUP
-- ============================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 1: TABLES
-- ============================================

-- 1. Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  what_you_learn TEXT[], -- Array of bullet points
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  google_drive_file_id TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Promo Codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  max_uses INTEGER NOT NULL DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'rejected')),
  payment_method TEXT CHECK (payment_method IN ('bkash', 'nagad')),
  payment_number TEXT,
  transaction_id TEXT,
  payment_screenshot_url TEXT,
  amount_paid INTEGER DEFAULT 0,
  promo_code_used TEXT,
  discount_amount INTEGER DEFAULT 0,
  access_token UUID UNIQUE DEFAULT gen_random_uuid(),
  token_used BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  UNIQUE(user_id, course_id)
);

-- 6. Progress
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 7. IP Logs
CREATE TABLE IF NOT EXISTS public.ip_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  page_visited TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Blocked IPs
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT UNIQUE NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES auth.users(id),
  blocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 2: TRIGGERS + FUNCTIONS
-- ============================================

-- 1. Helper: Update Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Helper: Handle New User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Helper: Enrollment Confirmation Logic
CREATE OR REPLACE FUNCTION public.handle_enrollment_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.payment_status = 'confirmed' AND OLD.payment_status != 'confirmed') THEN
        NEW.confirmed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APPLY TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP TRIGGER IF EXISTS trigger_update_course_timestamp ON public.courses;
CREATE TRIGGER trigger_update_course_timestamp
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_enrollment_confirmation ON public.enrollments;
CREATE TRIGGER trigger_enrollment_confirmation
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_enrollment_confirmation();

-- ============================================
-- PART 3: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles self select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins select all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Courses Policies
CREATE POLICY "Public select active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full course access" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Lessons Policies
CREATE POLICY "Select free preview lessons" ON public.lessons FOR SELECT USING (is_free_preview = true);
CREATE POLICY "Select enrolled lessons" ON public.lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollments 
    WHERE user_id = auth.uid() 
    AND course_id = public.lessons.course_id 
    AND payment_status = 'confirmed'
  )
);
CREATE POLICY "Admins full lesson access" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Enrollments Policies
CREATE POLICY "Select own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own enrollment" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins full enrollment access" ON public.enrollments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Progress Policies
CREATE POLICY "Users manage own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- Promo Codes Policies
CREATE POLICY "Select active promos" ON public.promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage promos" ON public.promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Logs Policies
CREATE POLICY "Admins select logs" ON public.ip_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- PART 4: STORAGE
-- ============================================

-- Bucket for payment proof
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Authenticated upload screenshot"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Admins view screenshot"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- PART 5: SEED DATA
-- ============================================

-- Courses
INSERT INTO public.courses (title, slug, short_description, price, original_price, category, is_featured, what_you_learn)
VALUES 
('AI Mastery Course', 'ai-mastery', 'Master Gemini and other LLMs for productivity and dev.', 2999, 5000, 'Artificial Intelligence', true, ARRAY['Gemini API Integration', 'Prompt Engineering', 'AI App Deployment']),
('Web Development Bootcamp', 'web-development', 'Full stack development with Next.js 14 and Supabase.', 4999, 10000, 'Programming', true, ARRAY['React & Next.js', 'PostgreSQL & Supabase', 'Vercel Deployment']),
('Video Editing Pro', 'video-editing', 'Edit cinematic videos like a professional agency.', 1999, 4000, 'Creative Arts', false, ARRAY['Premiere Pro Basics', 'Color Grading', 'Sound Design']);

-- Lessons (Placeholders)
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Welcome to the Course', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 10, 1, true FROM public.courses WHERE slug = 'ai-mastery';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Setting up Environment', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 25, 2, false FROM public.courses WHERE slug = 'ai-mastery';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Advanced Module 1', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 45, 3, false FROM public.courses WHERE slug = 'ai-mastery';

INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Course Overview', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 12, 1, true FROM public.courses WHERE slug = 'web-development';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'HTML & CSS', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 60, 2, false FROM public.courses WHERE slug = 'web-development';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'JavaScript Basics', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 90, 3, false FROM public.courses WHERE slug = 'web-development';

INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Intro to Premiere', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 15, 1, true FROM public.courses WHERE slug = 'video-editing';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Cutting Techniques', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 40, 2, false FROM public.courses WHERE slug = 'video-editing';
INSERT INTO public.lessons (course_id, title, google_drive_file_id, duration_minutes, order_index, is_free_preview)
SELECT id, 'Audio Sweetening', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 30, 3, false FROM public.courses WHERE slug = 'video-editing';

-- Promo Codes
INSERT INTO public.promo_codes (code, discount_percent, max_uses, is_active)
VALUES ('WELCOME20', 20, 100, true), ('LAUNCH50', 50, 50, true);
