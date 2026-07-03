import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, CheckSquare, Tag, AlignLeft } from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '../types';

interface TaskFormProps {
  task?: Task | null; // If provided, we are in edit mode
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'isCompleted'> & { id?: string }) => void;
  onClose: () => void;
}

export default function TaskForm({ task, onSave, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
    } else {
      // Set tomorrow as default due date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tugas tidak boleh kosong!');
      return;
    }

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
    });
  };

  const categories: TaskCategory[] = ['Work', 'Personal', 'Shopping', 'Learning', 'Others'];
  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Rendah', color: 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' },
    { value: 'medium', label: 'Sedang', color: 'bg-amber-950/30 text-amber-400 border-amber-900/50' },
    { value: 'high', label: 'Tinggi', color: 'bg-rose-950/30 text-rose-400 border-rose-900/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/65 backdrop-blur-sm p-4">
      <div className="bg-dark-card rounded-2xl w-full max-w-lg shadow-xl border border-dark-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-dark-accent" />
            {task ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-text-dim hover:bg-dark-bg hover:text-dark-text transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-dark-text-dim mb-1">
              Judul Tugas <span className="text-rose-400">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Contoh: Menyelesaikan laporan bulanan"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent text-sm transition-all text-dark-text placeholder-dark-text-dim/40 font-medium"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider text-dark-text-dim mb-1">
              Deskripsi
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-dark-text-dim">
                <AlignLeft className="h-4 w-4" />
              </div>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tambahkan detail tugas di sini..."
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent text-sm transition-all text-dark-text placeholder-dark-text-dim/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-due" className="block text-xs font-semibold uppercase tracking-wider text-dark-text-dim mb-1">
                Tenggat Waktu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-text-dim">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-dark-bg border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent text-sm transition-all text-dark-text"
                />
              </div>
            </div>

            <div>
              <label htmlFor="task-category" className="block text-xs font-semibold uppercase tracking-wider text-dark-text-dim mb-1">
                Kategori
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-text-dim">
                  <Tag className="h-4 w-4" />
                </div>
                <select
                  id="task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full pl-10 pr-3 py-2.5 bg-dark-bg border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent text-sm transition-all text-dark-text appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-card text-dark-text">
                      {cat === 'Work' ? '💼 Pekerjaan' :
                       cat === 'Personal' ? '🏠 Pribadi' :
                       cat === 'Shopping' ? '🛒 Belanja' :
                       cat === 'Learning' ? '📚 Pembelajaran' : '🏷️ Lainnya'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-dark-text-dim mb-2">
              Prioritas Tugas
            </span>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? p.value === 'high'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : p.value === 'medium'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-dark-bg text-dark-text-dim border-dark-border hover:bg-dark-bg/80'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-dark-text-dim hover:bg-dark-bg rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-dark-accent hover:bg-dark-accent-hover rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
