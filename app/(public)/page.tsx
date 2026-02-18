import React from 'react';
import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/landing/HeroSection';
import ProgramsSection from '@/components/landing/ProgramsSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import { Course } from '@/lib/types';

/**
 * The main landing page.
 * Fetches all active courses from Supabase server-side.
 */
export default async function HomePage() {
  const supabase = createClient();
  
  // Fetch active courses ordered by their sequence
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching courses for landing page:', error);
  }

  return (
    <>
      <HeroSection />
      
      <div id="programs">
        <ProgramsSection courses={(courses as Course[]) || []} />
      </div>
      
      <div id="about">
        <AboutSection />
      </div>
      
      <div id="contact">
        <ContactSection />
      </div>
    </>
  );
}