import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertTriangle, TrendingUp, X, Flame, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import API from "../services/api";
import AuthLayout from "./AuthLayout";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function AccountabilityPopup({ data, onContinue }) {
  const score = data?.score ?? data?.accountability_score ?? null;
  const message = data?.message ?? data?.summary ?? "";
  const insights = data?.insights ?? data?.tips ?? data?.suggestions ?? [];
  const streak = data?.streak ?? null;
  const status = data?.status ?? (score >= 70 ? "great" : score >= 40 ? "okay" : "needs_work");

  const statusConfig = {
    great: {
      color: "from-emerald-400 to-green-500",
      glow: "shadow-emerald-500/30",
      icon: <Flame className="w-7 h-7" />,
      label: "On Fire 🔥",
      ring: "ring-emerald-500/30",
    },
    okay: {
      color: "from-amber-400 to-orange-500",
      glow: "shadow-amber-500/30",
      icon: <TrendingUp className="w-7 h-7" />,
      label: "Building Momentum",
      ring: "ring-amber-500/30",
    },
    needs_work: {
      color: "from-green-400 to-emerald-600",
      glow: "shadow-green-500/30",
      icon: <AlertTriangle className="w-7 h-7" />,
      label: "Time to Refocus",
      ring: "ring-green-500/30",
    },
  };

  const cfg = statusConfig[status] || statusConfig.okay;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.7)" }}
    >
      {/* Ambient glow behind card */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 0.15 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className={`relative w-full max-w-md bg-[#0e1117] border border-green-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-green-500/20 ring-1 ring-green-500/25`}
      >
        {/* Top gradient bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.color}`} />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Accountability Check</p>
              <h2 className="text-white text-2xl font-bold leading-tight">Your Daily Pulse</h2>
            </div>
            <div className={`flex items-center gap-2 bg-gradient-to-br ${cfg.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
              {cfg.icon}
              <span>{cfg.label}</span>
            </div>
          </div>

          {/* Score ring */}
          {score !== null && (
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="white" strokeOpacity="0.05" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="50" cy="50" r="40"
                    stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - score / 100) }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-3xl font-black text-white"
                  >
                    {score}
                  </motion.span>
                  <span className="text-white/30 text-xs font-medium">/ 100</span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/8 rounded-2xl p-4 mb-5 text-center"
            >
              <p className="text-white/80 text-sm leading-relaxed font-light">{message}</p>
            </motion.div>
          )}

          {/* Stats row */}
          <div className="flex gap-3 mb-5">
            {streak !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex-1 bg-white/5 border border-white/8 rounded-2xl p-3 flex flex-col items-center gap-1"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-white font-bold text-lg">{streak}</span>
                <span className="text-white/30 text-xs">day streak</span>
              </motion.div>
            )}
            {data?.habits_completed !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex-1 bg-white/5 border border-white/8 rounded-2xl p-3 flex flex-col items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-white font-bold text-lg">{data.habits_completed}</span>
                <span className="text-white/30 text-xs">completed</span>
              </motion.div>
            )}
            {data?.habits_pending !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex-1 bg-white/5 border border-white/8 rounded-2xl p-3 flex flex-col items-center gap-1"
              >
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-lg">{data.habits_pending}</span>
                <span className="text-white/30 text-xs">pending</span>
              </motion.div>
            )}
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6 space-y-2"
            >
              {insights.slice(0, 3).map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 bg-white/3 border border-white/6 rounded-xl px-3 py-2.5"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-white/60 text-xs leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Let's Go
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountabilityData, setAccountabilityData] = useState(null);
  const { setToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/login", form);
      const token = response.data?.data?.token;
      setToken(token);
      localStorage.setItem("token", token);
      toast.success("Login successfully");

      // Call accountability check after login
      try {
        const checkRes = await API.get("/agents/accountability-check");
        const checkData = checkRes.data?.data ?? checkRes.data;
        if (checkData) {
          setAccountabilityData(checkData);
          return; // Don't navigate yet — popup will handle it
        }
      } catch (checkErr) {
        console.warn("Accountability check failed:", checkErr);
        // Non-blocking — still navigate to dashboard
      }

      navigate("/dashboard");
    } catch (err) {
      console.log("Error : ", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePopupContinue = () => {
    setAccountabilityData(null);
    navigate("/dashboard");
  };

  return (
    <>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to track your habits with HabitMind now."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
              <input
                type="email"
                placeholder="johnDoe@gmail.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Password (min 6 characters)
              </label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-green-400 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          <p className="text-center text-white/40 text-sm font-light">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-semibold hover:text-green-400 transition-colors"
            >
              Create One
            </Link>
          </p>
        </form>
      </AuthLayout>

      <AnimatePresence>
        {accountabilityData && (
          <AccountabilityPopup
            data={accountabilityData}
            onContinue={handlePopupContinue}
          />
        )}
      </AnimatePresence>
    </>
  );
}