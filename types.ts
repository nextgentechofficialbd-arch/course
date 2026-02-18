

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

// Added rating and description properties to the Course interface to fix TS errors in components
export interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  description?: string; // Compatibility field
  price: number; // in BDT
  thumbnail_url: string;
  is_active: boolean;
  category: string;
  bengali_title?: string;
  rating: number;
}

// Added Lesson interface to resolve import errors in components referencing @/types
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

// Updated Route type to include 'courses', 'admin', and 'course-view'
export type Route = 'home' | 'programs' | 'about' | 'contact' | 'auth' | 'program-detail' | 'courses' | 'admin' | 'course-view';