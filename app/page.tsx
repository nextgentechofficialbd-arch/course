import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProgramsSection from '@/components/landing/ProgramsSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';
import { Course } from '@/types';

export default async function RootPage() {
  const supabase = createClient();
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching courses:', error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main>
        <HeroSection />
        <ProgramsSection courses={(courses as Course[]) || []} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}