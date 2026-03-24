import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import API from '../services/api';
import AuthLayout from './AuthLayout';
import { toast } from 'react-hot-toast';

/* ── Schema ──────────────────────────────────────────────────────── */
const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3,  "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6,  "Password must be at least 6 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

/* get the first error message for a single field */
const getFieldError = (field, value) => {
  const result = signupSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0].message;
};

/* ── FieldHint — always visible until field is valid ─────────────── */
function FieldHint({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] text-red-400/80 ml-1 mt-1 flex items-center gap-1"
        >
          <span className="inline-block w-1 h-1 rounded-full bg-red-400/80 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function Signup() {
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ name: '', email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  /* always-on field errors — re-computed on every keystroke */
  const fieldErrors = useMemo(() => ({
    name:     getFieldError("name",     form.name),
    email:    getFieldError("email",    form.email),
    password: getFieldError("password", form.password),
  }), [form]);

  /* form is valid when no field has an error */
  const isFormValid = !fieldErrors.name && !fieldErrors.email && !fieldErrors.password;
  const isDisabled  = !isFormValid || loading;

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!isFormValid) return;

    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (err) {
      console.error("Signup error:", err);
      const serverErrors = err.response?.data?.errors;
      if (!serverErrors?.length) {
        setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",     label: "Full Name",                   type: "text",     placeholder: "John Doe",          icon: User },
    { key: "email",    label: "Email Address",               type: "email",    placeholder: "johnDoe@gmail.com", icon: Mail },
    { key: "password", label: "Password (min 6 characters)", type: "password", placeholder: "••••••••",          icon: Lock },
  ];

  return (
    <AuthLayout title="Join HabitMind" subtitle="Start tracking your habits today.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center"
            >
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">
              {label}
            </label>
            <div className="relative group">
              <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors
                ${fieldErrors[key]
                  ? "text-white/20 group-focus-within:text-red-400"
                  : "text-white/20 group-focus-within:text-green-400"
                }`}
              />
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full bg-white/5 border rounded-2xl py-3 pl-12 pr-4 focus:outline-none transition-all text-white placeholder:text-white/20
                  ${form[key] && fieldErrors[key]
                    ? "border-red-500/40 focus:ring-1 focus:ring-red-500/25"
                    : form[key] && !fieldErrors[key]
                      ? "border-green-500/40 focus:ring-1 focus:ring-green-500/40"
                      : "border-white/10 focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50"
                  }`}
              />
            </div>
            {/* always show the requirement until the field is valid */}
            <FieldHint message={fieldErrors[key]} />
          </div>
        ))}

        <motion.button
          whileHover={isDisabled ? {} : { scale: 1.02 }}
          whileTap={isDisabled  ? {} : { scale: 0.98 }}
          disabled={isDisabled}
          type="submit"
          className={`w-full py-3 rounded-2xl font-bold text-md flex items-center justify-center gap-2 group transition-all mt-1
            ${isDisabled
              ? "bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-60"
              : "bg-linear-to-r from-green-500 to-blue-500 text-white cursor-pointer shadow-xl shadow-indigo-500/20"
            }`}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className={`w-5 h-5 transition-transform ${!isDisabled && "group-hover:translate-x-1"}`} />
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