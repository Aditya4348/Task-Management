import React, { useState, useEffect } from 'react';
import { User, Task } from './types';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Authenticate and restore user session from localStorage
  useEffect(() => {
    const storedUserSession = localStorage.getItem('task_manager_current_user');
    if (storedUserSession) {
      try {
        const parsedUser = JSON.parse(storedUserSession);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('Error parsing stored session', e);
        localStorage.removeItem('task_manager_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Load and initialize tasks when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    const storedTasks = localStorage.getItem('task_manager_tasks');
    let parsedTasks: Task[] = [];

    if (storedTasks) {
      try {
        parsedTasks = JSON.parse(storedTasks);
      } catch (e) {
        console.error('Error parsing stored tasks', e);
      }
    }

    // Filter tasks belonging only to the current user
    const userTasks = parsedTasks.filter((t) => t.userId === currentUser.id);

    // If this specific user has no tasks yet, seed with initial welcome state as requested!
    if (userTasks.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const afterThreeDays = new Date();
      afterThreeDays.setDate(afterThreeDays.getDate() + 3);
      const afterThreeDaysStr = afterThreeDays.toISOString().split('T')[0];

      const initialSeedTasks: Task[] = [
        {
          id: `seed-1-${currentUser.id}`,
          title: 'Mempelajari Fitur Aplikasi Task Management',
          description: 'Cobalah fitur menambah tugas baru, mencentang tugas selesai, mengedit tugas, serta menghapus tugas ini.',
          isCompleted: false,
          priority: 'high',
          category: 'Learning',
          dueDate: tomorrowStr,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
        },
        {
          id: `seed-2-${currentUser.id}`,
          title: 'Belanja Kebutuhan Mingguan',
          description: 'Membeli buah apel, susu oat, sayuran segar, dan roti gandum.',
          isCompleted: false,
          priority: 'low',
          category: 'Shopping',
          dueDate: afterThreeDaysStr,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
        },
        {
          id: `seed-3-${currentUser.id}`,
          title: 'Menyelesaikan Laporan Pekerjaan Utama',
          description: 'Kirim draf proposal proyek ke tim manajer untuk direview bersama.',
          isCompleted: true,
          priority: 'medium',
          category: 'Work',
          dueDate: tomorrowStr,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
        },
      ];

      // Save to main tasks list (retaining other users' tasks!)
      const allTasks = [...parsedTasks, ...initialSeedTasks];
      localStorage.setItem('task_manager_tasks', JSON.stringify(allTasks));
      setTasks(initialSeedTasks);
    } else {
      setTasks(userTasks);
    }
  }, [currentUser]);

  // 3. Sync local state with global localStorage on any local task modifications
  const saveTasksToLocalStorage = (updatedUserTasks: Task[]) => {
    if (!currentUser) return;

    try {
      const allTasksRaw = localStorage.getItem('task_manager_tasks');
      let allTasks: Task[] = allTasksRaw ? JSON.parse(allTasksRaw) : [];

      // Remove current user's existing tasks from all tasks and replace with updated ones
      allTasks = allTasks.filter((t) => t.userId !== currentUser.id);
      const mergedTasks = [...allTasks, ...updatedUserTasks];

      localStorage.setItem('task_manager_tasks', JSON.stringify(mergedTasks));
      setTasks(updatedUserTasks);
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  };

  // --- CRUD ACTIONS ---

  // CREATE
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'isCompleted'>) => {
    if (!currentUser) return;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
    };

    const updatedTasks = [newTask, ...tasks];
    saveTasksToLocalStorage(updatedTasks);
  };

  // UPDATE
  const handleUpdateTask = (updatedTask: Task) => {
    if (!currentUser) return;

    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    saveTasksToLocalStorage(updatedTasks);
  };

  // TOGGLE COMPLETE STATUS
  const handleToggleComplete = (id: string) => {
    if (!currentUser) return;

    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    saveTasksToLocalStorage(updatedTasks);
  };

  // DELETE
  const handleDeleteTask = (id: string) => {
    if (!currentUser) return;

    const updatedTasks = tasks.filter((t) => t.id !== id);
    saveTasksToLocalStorage(updatedTasks);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('task_manager_current_user');
    setCurrentUser(null);
    setTasks([]);
  };

  // LOGIN SUCCESS
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Memuat Aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {currentUser ? (
        <TaskDashboard
          user={currentUser}
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onLogout={handleLogout}
        />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
