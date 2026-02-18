import React from 'react';
import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/landing/HeroSection';
import ProgramsSection from '@/components/landing/ProgramsSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import { Course } from '@/lib/types';

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  return (
    <>
      <HeroSection />
      <ProgramsSection courses={(courses as Course[]) || []} />
      <AboutSection />
      <ContactSection />
    </>
  );
}