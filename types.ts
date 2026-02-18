
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

// Added rating property to the Course interface to fix TS errors in components
export interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  price: number; // in BDT
  thumbnail_url: string;
  is_active: boolean;
  category: string;
  bengali_title?: string;
  rating: number;
}

export type Route = 'home' | 'programs' | 'about' | 'contact' | 'auth' | 'program-detail';
