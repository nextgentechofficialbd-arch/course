
import Navbar from '@/components/landing/Navbar';
import Courses from '@/components/Courses';
import Footer from '@/components/landing/Footer';

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="pt-24">
        <Courses onNavigate={() => {}} />
      </main>
      <Footer />
    </div>
  );
}
