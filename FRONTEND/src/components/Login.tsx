import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prepopulate local storage with a default user if none exists
  useEffect(() => {
    const existingUsers = localStorage.getItem('task_manager_users');
    if (!existingUsers) {
      const defaultUsers = [
        { id: '1', name: 'Budi Santoso', email: 'user@example.com', password: 'password123' },
        { id: '2', name: 'Adit Alvisa', email: 'adit@gmail.com', password: 'password123' }
      ];
      localStorage.setItem('task_manager_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Semua kolom wajib diisi!');
      return;
    }

    if (!isLogin && !name) {
      setError('Nama wajib diisi untuk pendaftaran!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('task_manager_users') || '[]');

    if (isLogin) {
      // Login flow
      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userSession: UserType = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
        localStorage.setItem('task_manager_current_user', JSON.stringify(userSession));
        onLoginSuccess(userSession);
      } else {
        setError('Email atau password salah!');
      }
    } else {
      // Sign up flow
      const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('Email sudah terdaftar!');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password,
      };

      users.push(newUser);
      localStorage.setItem('task_manager_users', JSON.stringify(users));
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setIsLogin(true);
      // Clear sign-up specific fields
      setName('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8" style={{ background: 'radial-gradient(circle at top right, #1a1425, var(--color-dark-bg))' }}>
      <div className="max-w-md w-full space-y-8 bg-dark-card p-8 rounded-2xl shadow-xl border border-dark-border">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-dark-accent text-white shadow-sm"
          >
            <CheckCircle className="h-6 w-6" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-dark-text tracking-tight">
            {isLogin ? 'Welcome back' : 'Daftar Akun Baru'}
          </h2>
          <p className="mt-2 text-sm text-dark-text-dim">
            {isLogin
              ? 'Log in to manage your daily workspace.'
              : 'Mulai kelola tugas dan tingkatkan produktivitas'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-950/40 text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-900/50"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-950/40 text-emerald-400 rounded-lg text-sm flex items-center gap-2 border border-emerald-900/50"
          >
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            {!isLogin && (
              <div>
                <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-dark-text-dim mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-text-dim">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-dark-bg border border-dark-border rounded-xl placeholder-dark-text-dim/50 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all text-sm"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-dark-text-dim mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-text-dim">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-dark-bg border border-dark-border rounded-xl placeholder-dark-text-dim/50 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all text-sm"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-bold uppercase tracking-wider text-dark-text-dim mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-text-dim">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-dark-bg border border-dark-border rounded-xl placeholder-dark-text-dim/50 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-dark-accent hover:bg-dark-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-accent transition-colors shadow-lg cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLogin ? (
                  <LogIn className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                ) : (
                  <UserPlus className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                )}
              </span>
              {isLogin ? 'Sign In' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-sm font-semibold text-dark-accent hover:text-indigo-400 cursor-pointer"
          >
            {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-6 pt-6 border-t border-dark-border text-xs text-dark-text-dim text-center">
            <p className="font-semibold text-dark-text-dim/80 mb-1.5">Akun Percobaan (Demo Account):</p>
            <p className="flex justify-center items-center gap-1.5">
              <span>Email:</span>
              <span className="font-mono bg-dark-bg px-2 py-0.5 rounded text-dark-text border border-dark-border/40">user@example.com</span>
            </p>
            <p className="mt-1.5 flex justify-center items-center gap-1.5">
              <span>Password:</span>
              <span className="font-mono bg-dark-bg px-2 py-0.5 rounded text-dark-text border border-dark-border/40">password123</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
