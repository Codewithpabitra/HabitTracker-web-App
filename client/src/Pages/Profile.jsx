import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Edit3,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Calendar,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
        <span className="text-2xl font-black text-white tracking-tight">{initials}</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-zinc-950 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, type = "text", editing, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-zinc-900 border border-zinc-700 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
        />
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300">
          {value || <span className="text-zinc-600 italic">—</span>}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", currentPassword: "", newPassword: "" });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/profile");
      const data = res.data?.data;
      setProfile(data);
      setForm((f) => ({ ...f, name: data.name }));
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setForm({ name: profile.name, currentPassword: "", newPassword: "" });
    setShowPasswordSection(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setShowPasswordSection(false);
  };

  const handleSave = async () => {
    const payload = {};
    if (form.name !== profile.name) payload.name = form.name;
    if (form.newPassword) {
      payload.newPassword = form.newPassword;
      payload.currentPassword = form.currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      const res = await API.put("/auth/profile", payload);
      setProfile(res.data?.data);
      toast.success("Profile updated!");
      setEditing(false);
      setShowPasswordSection(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-green-400 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto py-10 px-4"
    >
      {/* Header card */}
      <motion.div
        variants={item}
        className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-5 overflow-hidden"
      >
        {/* subtle green glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-green-500/8 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={profile?.name} />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{profile?.name}</h1>
              <p className="text-sm text-zinc-500">{profile?.email}</p>
              {profile?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                  <ShieldCheck size={11} />
                  Verified
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.button
                key="edit"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleEdit}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 size={14} />
                Edit
              </motion.button>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 text-sm px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X size={14} />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-green-500/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Save
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div
        variants={item}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-5"
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">Personal Info</p>
        <div className="flex flex-col gap-4">
          <Field
            icon={User}
            label="Full Name"
            value={form.name}
            editing={editing}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
          <Field
            icon={Mail}
            label="Email Address"
            value={profile?.email}
            editing={false} /* email not editable */
          />
        </div>
      </motion.div>

      {/* Password section — only visible when editing */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Change Password</p>
                <button
                  onClick={() => setShowPasswordSection((v) => !v)}
                  className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors cursor-pointer"
                >
                  {showPasswordSection ? "Hide" : "Update password →"}
                </button>
              </div>

              <AnimatePresence>
                {showPasswordSection && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-4"
                  >
                    <Field
                      icon={Lock}
                      label="Current Password"
                      type="password"
                      value={form.currentPassword}
                      editing={true}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <Field
                      icon={KeyRound}
                      label="New Password"
                      type="password"
                      value={form.newPassword}
                      editing={true}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="Min. 6 characters"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!showPasswordSection && (
                <p className="text-zinc-600 text-sm">
                  Click <span className="text-zinc-400">"Update password"</span> to change your password.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta card */}
      <motion.div
        variants={item}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">Account Info</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={11} /> Member since
            </span>
            <span className="text-sm text-zinc-300">{formatDate(profile?.createdAt)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 size={11} /> Email status
            </span>
            <span className={`text-sm font-medium ${profile?.isEmailVerified ? "text-emerald-400" : "text-amber-400"}`}>
              {profile?.isEmailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
              <Edit3 size={11} /> Last updated
            </span>
            <span className="text-sm text-zinc-300">{formatDate(profile?.updatedAt)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}