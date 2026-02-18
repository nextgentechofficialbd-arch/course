
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-base italic">
              E
            </div>
            <span className="text-xl font-black tracking-tighter dark:text-white">EduAgency</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
              <button key={item} className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                {item}
              </button>
            ))}
          </div>

          <div className="text-sm font-bold text-slate-500">
            &copy; {new Date().getFullYear()} EduAgency. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
