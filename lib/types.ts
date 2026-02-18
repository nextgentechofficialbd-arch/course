export type UserRole = 'student' | 'admin' | 'super_admin';
export type EnrollmentStatus = 'pending' | 'confirmed' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  price: number;
  thumbnail_url?: string;
  category?: string;
  is_active: boolean;
  order_index: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  google_drive_file_id: string;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: EnrollmentStatus;
  payment_number: string;
  transaction_id: string;
  amount_paid: number;
  access_token: string;
  enrolled_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: any; Update: any };
      courses: { Row: Course; Insert: any; Update: any };
      lessons: { Row: Lesson; Insert: any; Update: any };
      enrollments: { Row: Enrollment; Insert: any; Update: any };
      promo_codes: { Row: any; Insert: any; Update: any };
      ip_logs: { Row: any; Insert: any; Update: any };
    };
  };
}