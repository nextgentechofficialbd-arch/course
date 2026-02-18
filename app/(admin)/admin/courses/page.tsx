
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  List, 
  Eye, 
  EyeOff, 
  Search,
  BookOpen,
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    price: 0,
    original_price: 0,
    thumbnail_url: '',
    category: '',
    is_active: true
  });

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*, lessons(id)')
      .order('order_index', { ascending: true });
    setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course?: any) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        slug: course.slug,
        short_description: course.short_description || '',
        full_description: course.full_description || '',
        price: course.price,
        original_price: course.original_price || 0,
        thumbnail_url: course.thumbnail_url || '',
        category: course.category || '',
        is_active: course.is_active
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        price: 0,
        original_price: 0,
        thumbnail_url: '',
        category: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    
    if (error) alert("Failed to toggle status");
    else fetchCourses();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all lessons and data for this course.")) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert("Error deleting course");
    else fetchCourses();
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Course Manager</h1>
          <p className="text-slate-500 font-medium">Create and publish educational content.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} />
          New Course
        </button>
      </header>

      {loading && courses.length === 0 ? (
        <div className="p-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300">
              <div className="h-44 relative bg-muted overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <BookOpen size={40} className="text-primary/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${course.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {course.is_active ? 'Public' : 'Hidden'}
                  </span>
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">
                    {course.category || 'General'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={() => handleToggleStatus(course.id, course.is_active)} className="p-3 bg-white text-primary rounded-xl shadow-xl hover:scale-110 transition-transform">
                     {course.is_active ? <EyeOff size={20} /> : <Eye size={20} />}
                   </button>
                   <button onClick={() => handleOpenModal(course)} className="p-3 bg-white text-primary rounded-xl shadow-xl hover:scale-110 transition-transform">
                     <Edit size={20} />
                   </button>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-black dark:text-white leading-tight line-clamp-2">{course.title}</h3>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">৳{course.price.toLocaleString()}</p>
                    {course.original_price > 0 && <p className="text-[10px] text-slate-400 line-through">৳{course.original_price.toLocaleString()}</p>}
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 font-medium line-clamp-2">{course.short_description}</p>
                
                <div className="pt-6 mt-auto border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <List size={14} />
                    {course.lessons?.length || 0} Lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/courses/${course.id}/lessons`}
                      className="p-2.5 rounded-xl bg-muted/50 text-slate-500 hover:bg-primary hover:text-white transition-all"
                      title="Curriculum"
                    >
                      <List size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="p-2.5 rounded-xl bg-muted/50 text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300 my-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-primary transition-all"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-black mb-8 dark:text-white">
              {editingCourse ? 'Edit Program' : 'New Program'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Program Title</label>
                  <input 
                    required 
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, title: val, slug: editingCourse ? prev.slug : generateSlug(val) }));
                    }}
                    placeholder="e.g. Master React in 30 Days" 
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL Slug</label>
                  <input 
                    required 
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    placeholder="react-30-days" 
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Price (BDT)</label>
                  <input 
                    required 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                  <input 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Development, Design..." 
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thumbnail Image URL</label>
                <input 
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  placeholder="https://..." 
                  className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Short Description (Cards)</label>
                <textarea 
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  rows={2}
                  className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-medium resize-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Description (Course Page)</label>
                <textarea 
                  value={formData.full_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                  rows={4}
                  className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-medium" 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : editingCourse ? 'Update Program' : 'Publish Program'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-border py-5 rounded-2xl font-black text-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
