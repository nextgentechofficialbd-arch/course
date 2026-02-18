import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import IPTracker from '@/components/IPTracker';

/**
 * Public layout wrapper.
 * Includes Navbar, Footer, and a background IP tracker for analytics.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      {/* Background IP Tracking for visitor analytics */}
      <IPTracker page="landing" />
      
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}