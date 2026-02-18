
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CreditCard, 
  BookOpen, 
  Users, 
  Tag, 
  History, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Enrollments', href: '/admin/enrollments', icon: CreditCard, badge: true },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Promo Codes', href: '/admin/promo', icon: Tag },
  { name: 'IP Logs', href: '/admin/logs', icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic">
          E
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight dark:text-white">Admin Panel</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">EduAgency CMS</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {item.badge && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-destructive font-bold text-sm transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
