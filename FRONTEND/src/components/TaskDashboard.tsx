import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  LogOut,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ListTodo,
  Sparkles,
  LayoutGrid,
  XCircle,
} from 'lucide-react';
import { Task, User, TaskPriority, TaskCategory } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

interface TaskDashboardProps {
  user: User;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId' | 'isCompleted'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onLogout: () => void;
}

export default function TaskDashboard({
  user,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onLogout,
}: TaskDashboardProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TaskCategory>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Statistics calculation for the current user
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  const overdueTasks = tasks.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.isCompleted) ||
      (statusFilter === 'pending' && !task.isCompleted);

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleSaveTask = (taskData: any) => {
    if (taskData.id) {
      // Editing existing task
      const existingTask = tasks.find((t) => t.id === taskData.id);
      if (existingTask) {
        onUpdateTask({
          ...existingTask,
          ...taskData,
        });
      }
    } else {
      // Creating new task
      onAddTask(taskData);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-16 text-dark-text">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-dark-sidebar/90 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-dark-accent text-white shadow-sm">
              <ListTodo className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-dark-text tracking-tight">TaskFlow</h1>
              <p className="text-xs text-dark-text-dim font-medium hidden sm:block">Atur prioritas dan selesaikan pekerjaan Anda</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-dark-text">{user.name}</p>
              <p className="text-xs text-dark-text-dim">{user.email}</p>
            </div>
            <div className="h-8 w-px bg-dark-border hidden sm:block"></div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-dark-border hover:border-rose-500/50 text-dark-text-dim hover:text-rose-400 rounded-xl text-sm font-semibold transition-all hover:bg-rose-950/20 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-dark-border">
          <div className="relative z-10 space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-dark-accent/20 border border-dark-accent/30 text-purple-300">
              <Sparkles className="h-3 w-3" /> Produktivitas Harian
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Halo, {user.name}! 👋</h2>
            <p className="text-dark-text-dim text-sm sm:text-base leading-relaxed">
              {totalTasks === 0
                ? 'Anda belum memiliki tugas saat ini. Mari buat tugas pertama Anda untuk mulai mengelola hari Anda dengan lebih terstruktur!'
                : `Anda memiliki ${pendingTasks} tugas tertunda. Tetap fokus dan selesaikan tugas-tugas penting hari ini!`}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,var(--color-dark-accent),transparent)] pointer-events-none"></div>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-dark-bg flex items-center justify-center text-dark-text-dim shrink-0">
              <LayoutGrid className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-dark-text-dim uppercase tracking-wider">Total Tugas</p>
              <p className="text-2xl font-extrabold text-dark-text mt-0.5">{totalTasks}</p>
            </div>
          </div>

          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-950/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-900/20">
              <CheckCircle className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-dark-text-dim uppercase tracking-wider">Selesai</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">{completedTasks}</p>
            </div>
          </div>

          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-950/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-900/20">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-dark-text-dim uppercase tracking-wider">Tertunda</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-0.5">{pendingTasks}</p>
            </div>
          </div>

          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-rose-950/20 flex items-center justify-center text-rose-400 shrink-0 border border-rose-900/20">
              <AlertCircle className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-dark-text-dim uppercase tracking-wider">Terlambat</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-0.5">{overdueTasks}</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-md space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-text-dim">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau deskripsi tugas..."
                className="w-full pl-10 pr-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent text-sm transition-all text-dark-text placeholder-dark-text-dim/40"
              />
            </div>

            {/* Actions: Add task and filter summary */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-md cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Tambah Tugas</span>
              </button>
            </div>
          </div>

          {/* Filter options bar */}
          <div className="pt-4 border-t border-dark-border flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-dark-text-dim font-semibold shrink-0">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-dark-text-dim/60 mr-1">Status:</span>
              {(['all', 'pending', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-dark-accent/15 border-dark-accent/30 text-purple-300'
                      : 'bg-dark-bg/60 border-dark-border text-dark-text-dim hover:bg-dark-bg'
                  }`}
                >
                  {status === 'all' ? 'Semua' : status === 'completed' ? 'Selesai' : 'Tertunda'}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-dark-text-dim/60 mr-1">Prioritas:</span>
              {(['all', 'high', 'medium', 'low'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setPriorityFilter(pri)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    priorityFilter === pri
                      ? 'bg-dark-accent/15 border-dark-accent/30 text-purple-300'
                      : 'bg-dark-bg/60 border-dark-border text-dark-text-dim hover:bg-dark-bg'
                  }`}
                >
                  {pri === 'all' ? 'Semua' : pri === 'high' ? 'Tinggi' : pri === 'medium' ? 'Sedang' : 'Rendah'}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-dark-text-dim/60 mr-1">Kategori:</span>
              {(['all', 'Work', 'Personal', 'Shopping', 'Learning', 'Others'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-dark-accent/15 border-dark-accent/30 text-purple-300'
                      : 'bg-dark-bg/60 border-dark-border text-dark-text-dim hover:bg-dark-bg'
                  }`}
                >
                  {cat === 'all' ? 'Semua' :
                   cat === 'Work' ? '💼 Kerja' :
                   cat === 'Personal' ? '🏠 Pribadi' :
                   cat === 'Shopping' ? '🛒 Belanja' :
                   cat === 'Learning' ? '📚 Belajar' : '🏷️ Lainnya'}
                </button>
              ))}
            </div>

            {/* Reset Filters button */}
            {(search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer ml-auto flex items-center gap-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                Hapus Filter
              </button>
            )}
          </div>
        </div>

        {/* Task List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
              Daftar Tugas Anda
              <span className="text-xs font-bold bg-dark-card text-dark-text-dim border border-dark-border px-2.5 py-0.5 rounded-full">
                {filteredTasks.length}
              </span>
            </h3>
            {filteredTasks.length > 0 && (
              <p className="text-xs text-dark-text-dim font-medium">Menampilkan hasil sesuai filter</p>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={handleEditClick}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-dark-card rounded-2xl border border-dark-border p-12 text-center shadow-md"
                >
                  <div className="h-12 w-12 rounded-xl bg-dark-bg flex items-center justify-center text-dark-text-dim mx-auto mb-4 border border-dark-border/40">
                    <ListTodo className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-dark-text">Tidak ada tugas ditemukan</h4>
                  <p className="text-sm text-dark-text-dim mt-1 max-w-sm mx-auto">
                    {tasks.length === 0
                      ? 'Mulai perjalanan Anda dengan menambahkan tugas pertama menggunakan tombol di atas.'
                      : 'Coba ubah kata kunci pencarian atau bersihkan filter untuk menemukan tugas.'}
                  </p>
                  {tasks.length > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-dark-bg hover:bg-dark-bg/80 border border-dark-border text-dark-text text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Hapus Semua Filter
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Task Form Modal overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
