
import React from 'react';
import { Users, BarChart3, ShieldCheck, Zap, BookOpen, Target, Award } from 'lucide-react';
import { Course } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Full Stack Web Development',
    slug: 'full-stack-web-dev',
    bengali_title: 'ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট',
    short_description: 'Master MERN stack and build production-ready applications from scratch.',
    price: 15000,
    thumbnail_url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'Programming',
    is_active: true,
    rating: 4.9
  },
  {
    id: '2',
    title: 'Digital Marketing Excellence',
    slug: 'digital-marketing-pro',
    bengali_title: 'ডিজিটাল মার্কেটিং এক্সিলেন্স',
    short_description: 'Learn SEO, SMM, and Email marketing to grow any business exponentially.',
    price: 8000,
    thumbnail_url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'Marketing',
    is_active: true,
    rating: 4.7
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    slug: 'ui-ux-design',
    bengali_title: 'ইউআই/ইউএক্স ডিজাইন মাস্টারক্লাস',
    short_description: 'Design beautiful, user-centric interfaces using Figma and Adobe XD.',
    price: 12000,
    thumbnail_url: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    category: 'Design',
    is_active: true,
    rating: 4.8
  }
];

export const FEATURES = [
  {
    title: 'Industry Expert Mentors',
    description: 'Learn from professionals currently working in top tech companies.',
    icon: <Users className="w-6 h-6" />
  },
  {
    title: 'Hands-on Projects',
    description: 'Build a solid portfolio with real-world industry-grade projects.',
    icon: <Target className="w-6 h-6" />
  },
  {
    title: '1-on-1 Support',
    description: 'Dedicated support sessions to clear your doubts immediately.',
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: 'Certification',
    description: 'Earn a verified certificate upon successful course completion.',
    icon: <Award className="w-6 h-6" />
  }
];
