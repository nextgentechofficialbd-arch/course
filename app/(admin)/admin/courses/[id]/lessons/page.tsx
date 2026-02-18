
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  Video,
  PlayCircle,
  Clock,
  Loader2,
  X,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function CourseLessonsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    google_drive_file_id: '',
    duration_minutes: 0,
    order_index: 0,
    is_free_preview: false
  });

  const fetchData = async () => {
    setLoading(true);
    const [courseRes, lessonsRes] = await Promise.all([
      supabase.from('courses').select('title').eq('id', params.id).single(),
      supabase.from('lessons').select('*').eq('course_id', params.id).order('order_index', { ascending: true })
    ]);
    setCourse(courseRes.data);
    setLessons(lessonsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleOpenModal = (lesson?: any) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        google_drive_file_id: lesson.google_drive_file_id,
        duration_minutes: lesson.duration_minutes,
        order_index: lesson.order_index,
        is_free_preview: lesson.is_free_preview
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        google_drive_file_id: '',
        duration_minutes: 0,
        order_index: (lessons[lessons.length - 1]?.order_index || 0) + 1,
        is_free_preview: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([{ ...formData, course_id: params.id }]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) alert("Error deleting");
    else fetchData();
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/courses" 
            className="p-3 bg-white dark:bg-slate-900 border border-border rounded-2xl hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black dark:text-white">Curriculum Manager</h1>
            <p className="text-slate-500 font-medium">{course?.title}</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} />
          Add Lesson
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <Video className="text-primary" />
            <h3 className="text-xl font-black dark:text-white">Lesson Structure</h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{lessons.length} Modules Total</span>
        </div>

        {loading && lessons.length === 0 ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading lessons...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="group flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                <div className="flex items-center gap-8">
                  <div className="text-slate-200 group-hover:text-primary transition-colors cursor-grab">
                    <GripVertical size={24} />
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center font-black text-sm text-slate-500">
                    {lesson.order_index}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-lg dark:text-white flex items-center gap-3">
                      {lesson.title}
                      {lesson.is_free_preview && (
                        <span className="bg-green-100 text-green-600 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-500/20">Free Preview</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {lesson.duration_minutes}m</span>
                      <span className="flex items-center gap-1.5"><PlayCircle size={12} /> {lesson.google_drive_file_id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleOpenModal(lesson)}
                    className="p-3 bg-muted/50 rounded-2xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(lesson.id)}
                    className="p-3 bg-muted/50 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <div className="p-32 text-center text-slate-400">
                <p className="text-xl font-black mb-2 italic">Curriculum is Empty</p>
                <p className="text-xs font-bold uppercase tracking-widest">Add your first lesson above to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-primary transition-all">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black mb-8 dark:text-white">
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Lesson Title</label>
                <input 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Setting up Environment" 
                  className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Google Drive File ID</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    value={formData.google_drive_file_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, google_drive_file_id: e.target.value }))}
                    placeholder="1BxiMVs0XRA5..." 
                    className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider ml-1">The ID is from drive.google.com/file/d/<span className="text-primary">[THIS_PART]</span>/view</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Duration (Min)</label>
                  <input 
                    required 
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Order Index</label>
                  <input 
                    required 
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
              </div>

              <label className="flex items-center gap-4 p-5 bg-muted/30 border border-border rounded-2xl cursor-pointer hover:border-primary transition-all group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.is_free_preview ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-slate-400'}`}>
                  {formData.is_free_preview ? <PlayCircle size={20} /> : <Lock size={20} />}
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Free Preview</p>
                  <p className="text-xs font-medium text-slate-500">Allow non-enrolled users to watch this video.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.is_free_preview}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_free_preview: e.target.checked }))}
                  className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary" 
                />
              </label>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : editingLesson ? 'Update Module' : 'Add Module'}
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
