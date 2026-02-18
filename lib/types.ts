export type UserRole = 'student' | 'admin' | 'super_admin';
export type EnrollmentStatus = 'pending' | 'confirmed' | 'rejected';
export type PaymentMethod = 'bkash' | 'nagad';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  bengali_title?: string;
  short_description: string;
  full_description?: string;
  price: number;
  thumbnail_url?: string;
  category?: string;
  is_active: boolean;
  rating: number;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  google_drive_file_id: string;
  duration_minutes: number;
  is_free_preview: boolean;
  order_index: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: EnrollmentStatus;
  payment_method: PaymentMethod;
  payment_number: string;
  transaction_id: string;
  payment_screenshot_url?: string;
  amount_paid: number;
  rejection_reason?: string;
  promo_code_used?: string;
  access_token: string;
  token_used: boolean;
  enrolled_at: string;
  confirmed_at?: string;
  confirmed_by?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface IPLog {
  id: string;
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  page_visited: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'created_at'>>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at'>;
        Update: Partial<Omit<Course, 'id' | 'created_at'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id' | 'enrolled_at'>;
        Update: Partial<Omit<Enrollment, 'id' | 'enrolled_at'>>;
      };
      // Add other tables similarly as needed by Supabase TS generation
    };
  };
}