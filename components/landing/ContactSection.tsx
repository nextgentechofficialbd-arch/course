
'use client';

import React, { useState } from 'react';
import { Send, Facebook, MessageCircle, Clock } from 'lucide-react';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Dark mode only section background effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9]">
              যোগাযোগ করুন <br />
              <span className="text-muted-foreground text-3xl md:text-5xl">Let's Build Your Future.</span>
            </h2>
            <p className="text-slate-400 mb-12 max-w-md font-medium">
              Have questions about our programs or need career advice? Reach out to our team anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a 
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || '#'} 
                target="_blank" 
                className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-primary transition-all group"
              >
                <Facebook className="w-10 h-10 text-primary group-hover:text-white mb-4" />
                <div className="font-black text-lg">Facebook Page</div>
                <div className="text-xs text-slate-400 group-hover:text-white/80">Message for quick response</div>
              </a>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} 
                target="_blank" 
                className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-green-600 transition-all group"
              >
                <MessageCircle className="w-10 h-10 text-green-500 group-hover:text-white mb-4" />
                <div className="font-black text-lg">WhatsApp Support</div>
                <div className="text-xs text-slate-400 group-hover:text-white/80">Active 10AM - 10PM</div>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-widest">
              <Clock size={16} />
              Response within 24 hours
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mb-6">
                  <Send size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
                <p className="text-slate-400">Thanks! We'll contact you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Message</label>
                  <textarea 
                    required 
                    placeholder="How can we help you?" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-700 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Message'}
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
