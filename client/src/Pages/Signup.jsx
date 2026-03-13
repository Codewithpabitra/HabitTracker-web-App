import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import API from '../services/api';
import AuthLayout from './AuthLayout';

import {toast} from "react-hot-toast"

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      toast.success("registered successfully");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Join HabitMind" 
      subtitle="Start tracking your habits with today."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 ">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
            <input 
              type="text" 
              placeholder="John Doe" 
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
            <input 
              type="email" 
              placeholder="johnDoe@gmail.com" 
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Password (min 6 characters)</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit" 
          className="w-full bg-linear-to-r from-green-500 to-blue-500 text-white py-3 rounded-2xl font-bold text-md shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>

        <p className="text-center text-white/40 text-sm font-light">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-green-400 transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}