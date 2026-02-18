-- EDUAGENCY CORE SCHEMA & SEED DATA --

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bengali_title TEXT,
  short_description TEXT,
  full_description TEXT,
  price INTEGER NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL DEFAULT 4.5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  google_drive_file_id TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  course_id UUID REFERENCES public.courses(id),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'rejected')),
  payment_method TEXT,
  payment_number TEXT,
  transaction_id TEXT,
  payment_screenshot_url TEXT,
  amount_paid INTEGER,
  rejection_reason TEXT,
  promo_code_used TEXT,
  access_token UUID DEFAULT gen_random_uuid(),
  token_used BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES public.profiles(id)
);

-- 5. Promo Codes Table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IP Logs Table
CREATE TABLE IF NOT EXISTS public.ip_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  page_visited TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  course_id UUID REFERENCES public.courses(id),
  lesson_id UUID REFERENCES public.lessons(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- SEED DATA --

-- Sample Courses
INSERT INTO public.courses (title, slug, bengali_title, short_description, price, category, thumbnail_url, rating, order_index)
VALUES 
('Mastering AI with Gemini', 'ai-mastery', 'জেমিয়াই দিয়ে এআই মাস্টারি', 'Learn to build production-grade AI apps.', 12000, 'Artificial Intelligence', 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', 4.9, 1),
('Professional Video Editing', 'video-editing-pro', 'প্রফেশনাল ভিডিও এডিটিং', 'Edit cinematic videos like a pro.', 8000, 'Creative Arts', 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', 4.8, 2);

-- Sample Promo Codes
INSERT INTO public.promo_codes (code, discount_percent, max_uses)
VALUES ('WELCOME20', 20, 500), ('LAUNCH50', 50, 100);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_logs ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Admin can see all, students see their own)
CREATE POLICY "Public courses are viewable by everyone" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Students see their own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
