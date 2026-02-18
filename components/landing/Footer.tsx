
import React from 'react';
import Link from 'next/link';
import { Facebook, MessageCircle, Rocket } from 'lucide-react';
import { AGENCY_NAME, AGENCY_TAGLINE } from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-base italic group-hover:rotate-12 transition-transform">
                E
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">{AGENCY_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {AGENCY_TAGLINE} <br />
              Building the next generation of digital leaders in Bangladesh and beyond.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link href="/#home" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/#programs" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Programs</Link>
              <Link href="/#about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link href="/#contact" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Social Connect</h4>
            <div className="flex gap-4">
              <a 
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || '#'} 
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} 
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-green-600 hover:text-white transition-all"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Newsletter</h4>
            <p className="text-xs text-muted-foreground font-medium">Get the latest course updates and career tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-muted border-border border rounded-xl px-4 py-2 text-xs w-full outline-none focus:border-primary" 
              />
              <button className="bg-primary p-2.5 rounded-xl text-primary-foreground">
                <Rocket size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} {AGENCY_NAME}. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
