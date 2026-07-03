import { motion } from 'motion/react';
import { Edit2, Trash2, Calendar, Check, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  key?: string;
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  // Check if task is overdue
  const isOverdue = () => {
    if (task.isCompleted || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPriorityConfig = (p: string) => {
    switch (p) {
      case 'high':
        return { label: 'Tinggi', classes: 'bg-rose-950/40 text-rose-400 border-rose-900/50' };
      case 'medium':
        return { label: 'Sedang', classes: 'bg-amber-950/40 text-amber-400 border-amber-900/50' };
      case 'low':
      default:
        return { label: 'Rendah', classes: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' };
    }
  };

  const getCategoryBadge = (c: string) => {
    switch (c) {
      case 'Work':
        return { label: 'Pekerjaan', emoji: '💼', bg: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/50' };
      case 'Personal':
        return { label: 'Pribadi', emoji: '🏠', bg: 'bg-sky-950/40 text-sky-400 border-sky-900/50' };
      case 'Shopping':
        return { label: 'Belanja', emoji: '🛒', bg: 'bg-pink-950/40 text-pink-400 border-pink-900/50' };
      case 'Learning':
        return { label: 'Belajar', emoji: '📚', bg: 'bg-violet-950/40 text-violet-400 border-violet-900/50' };
      case 'Others':
      default:
        return { label: 'Lainnya', emoji: '🏷️', bg: 'bg-dark-bg text-dark-text-dim border-dark-border' };
    }
  };

  const priority = getPriorityConfig(task.priority);
  const category = getCategoryBadge(task.category);
  const overdue = isOverdue();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-dark-card rounded-2xl border transition-all hover:shadow-sm gap-4 ${
        task.isCompleted
          ? 'border-dark-border/40 bg-dark-bg/45 opacity-60'
          : overdue
          ? 'border-rose-900/40 bg-rose-950/5'
          : 'border-dark-border hover:border-dark-text-dim/40'
      }`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Custom Interactive Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 h-5.5 w-5.5 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
            task.isCompleted
              ? 'bg-dark-accent border-dark-accent text-white'
              : overdue
              ? 'border-rose-900/70 hover:bg-rose-950/30'
              : 'border-dark-border hover:border-dark-accent hover:bg-dark-accent/15'
          }`}
        >
          {task.isCompleted && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
        </button>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-semibold text-sm sm:text-base leading-tight break-words pr-2 ${
                task.isCompleted ? 'line-through text-dark-text-dim/60' : 'text-dark-text'
              }`}
            >
              {task.title}
            </span>

            {/* Category Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border ${category.bg}`}>
              <span className="mr-1 text-xs">{category.emoji}</span>
              {category.label}
            </span>

            {/* Priority Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border ${priority.classes}`}>
              {priority.label}
            </span>
          </div>

          {task.description && (
            <p className={`text-xs sm:text-sm whitespace-pre-wrap ${task.isCompleted ? 'text-dark-text-dim/50' : 'text-dark-text-dim'}`}>
              {task.description}
            </p>
          )}

          {/* Date & Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.2 text-xs font-medium ${
                  overdue
                    ? 'text-rose-400 font-semibold'
                    : task.isCompleted
                    ? 'text-dark-text-dim/40'
                    : 'text-dark-text-dim'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Tenggat: {formatDate(task.dueDate)}</span>
                {overdue && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-rose-950/35 text-rose-400 px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider ml-1 border border-rose-900/30">
                    <AlertCircle className="h-2.5 w-2.5" /> Overdue
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1.5 sm:self-center border-t border-dark-border/60 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-dark-text-dim hover:text-dark-text hover:bg-dark-bg rounded-xl transition-all cursor-pointer"
          title="Edit Tugas"
        >
          <Edit2 className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-dark-text-dim hover:text-rose-400 hover:bg-rose-950/35 rounded-xl transition-all cursor-pointer"
          title="Hapus Tugas"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </motion.div>
  );
}
