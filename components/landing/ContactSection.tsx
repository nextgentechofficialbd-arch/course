
import React from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Github, Linkedin } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9]">
              Let's Build Your <br /> Future Together.
            </h2>
            <p className="text-slate-400 mb-12 max-w-md font-medium">
              Have questions about our programs or need career advice? Reach out to our team anytime.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Email Us</div>
                  <div className="text-lg font-bold">hello@eduagency.io</div>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Call Us</div>
                  <div className="text-lg font-bold">+880 1234 567 890</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[Facebook, Github, Linkedin].map((Icon, idx) => (
                <button key={idx} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-600" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Message</label>
                <textarea placeholder="How can we help you?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-white placeholder:text-slate-600 resize-none"></textarea>
              </div>
              <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all group">
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
