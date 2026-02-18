
import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { Route } from '../types';
import { FEATURES, MOCK_COURSES } from '../constants';

interface HomeProps {
  onNavigate: (route: Route) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Transform Your Career with <span className="text-primary italic">EduAgency</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
              Learn the most in-demand skills from world-class experts. Join thousands of students already learning on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => onNavigate('courses')}
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                Become an Instructor
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4 justify-center md:justify-start text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white dark:border-slate-900 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/seed/edu/800/600" 
                alt="Education" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Students', value: '15,000+' },
            { label: 'Expert Mentors', value: '120+' },
            { label: 'Total Courses', value: '300+' },
            { label: 'Placement Rate', value: '94%' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We provide the tools and content you need to succeed in the digital economy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Courses</h2>
              <p className="text-slate-600 dark:text-slate-400">Our most popular programs this month.</p>
            </div>
            <button 
              onClick={() => onNavigate('courses')}
              className="text-primary font-bold flex items-center gap-2 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_COURSES.map((course) => (
              <div key={course.id} className="group cursor-pointer" onClick={() => onNavigate('courses')}>
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {course.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                {/* Changed description to short_description to fix TS error */}
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.short_description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-extrabold text-lg">${course.price}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span className="text-sm font-bold">{course.rating}</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-primary p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold">Ready to start learning?</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Get unlimited access to over 300+ high-quality courses with our pro subscription. Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Start Free Trial
              </button>
              <button className="bg-primary-foreground/10 border border-primary-foreground/20 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-foreground/20 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
