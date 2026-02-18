
import React from 'react';
import { GraduationCap, Infinity, Award, Users } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      title: 'Expert Instructors',
      bnTitle: 'দক্ষ ইন্সট্রাক্টর',
      icon: GraduationCap,
      description: 'Learn from industry veterans with years of practical professional experience.'
    },
    {
      title: 'Lifetime Access',
      bnTitle: 'লাইফটাইম অ্যাক্সেস',
      icon: Infinity,
      description: 'Enroll once and access course updates and materials forever at no extra cost.'
    },
    {
      title: 'Verified Certificate',
      bnTitle: 'ভেরিফাইড সার্টিফিকেট',
      icon: Award,
      description: 'Receive a professional certificate recognized by top digital agencies.'
    },
    {
      title: 'Community Support',
      bnTitle: 'কমিউনিটি সাপোর্ট',
      icon: Users,
      description: 'Join a thriving community of learners and mentors for constant guidance.'
    }
  ];

  return (
    <section id="about" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs">
              Why Choose Us?
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[0.95]">
              কেন আমাদের <br /> বেছে নেবেন?
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg font-medium max-w-lg">
              <p>
                We bridge the gap between academic learning and industry demands. Our practical curriculum is built to help you land your dream job.
              </p>
              <p className="border-l-4 border-primary pl-6 py-2 italic text-foreground">
                "আমরা শুধুমাত্র শিক্ষা দেই না, আমরা দক্ষ জনবল তৈরি করি।"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-muted/50 p-8 rounded-[2.5rem] border border-border group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black mb-1 text-foreground">{feature.title}</h3>
                <h4 className="font-bengali text-sm text-primary font-bold mb-3">{feature.bnTitle}</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
