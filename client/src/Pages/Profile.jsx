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
  Clock,
} from "lucide-react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 22 } },
};

/* ── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <div className="relative shrink-0">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-green-500/30">
        <span className="text-3xl font-black text-white tracking-tighter leading-none">{initials}</span>
      </div>
      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-zinc-900 block" />
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────── */
function Field({ icon: Icon, label, value, type = "text", editing, onChange, placeholder, locked }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        <Icon size={10} strokeWidth={2.5} />
        {label}
        {locked && (
          <span className="ml-auto text-[9px] font-semibold bg-zinc-800 text-zinc-600 px-2 py-0.5 rounded-full tracking-wide normal-case">
            locked
          </span>
        )}
      </label>
      {editing && !locked ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-600 focus:border-green-500/70 focus:ring-2 focus:ring-green-500/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-150"
        />
      ) : (
        <div className={`rounded-xl px-4 py-2.5 text-sm transition-colors ${locked ? "bg-zinc-950/60 border border-zinc-800/50 text-zinc-600 cursor-not-allowed" : "bg-zinc-950/70 border border-zinc-800 text-zinc-300"}`}>
          {value || <span className="text-zinc-600 italic text-xs">Not set</span>}
        </div>
      )}
    </div>
  );
}

/* ── StatChip ───────────────────────────────────────────────────── */
function StatChip({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex flex-col gap-3 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={16} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm]       = useState({ name: "", currentPassword: "", newPassword: "" });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res  = await API.get("/auth/profile");
      const data = res.data?.data;
      setProfile(data);
      setForm((f) => ({ ...f, name: data.name }));
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit   = () => { setForm({ name: profile.name, currentPassword: "", newPassword: "" }); setShowPasswordSection(false); setEditing(true); };
  const handleCancel = () => { setEditing(false); setShowPasswordSection(false); };

  const handleSave = async () => {
    const payload = {};
    if (form.name !== profile.name) payload.name = form.name;
    if (form.newPassword) { payload.newPassword = form.newPassword; payload.currentPassword = form.currentPassword; }
    if (!Object.keys(payload).length) { setEditing(false); return; }
    try {
      setSaving(true);
      const res = await API.put("/auth/profile", payload);
      setProfile(res.data?.data);
      toast.success("Profile updated!");
      setEditing(false);
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
        <p className="text-zinc-500 text-xs tracking-widest uppercase">Loading…</p>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto py-8 px-4"
    >

      {/* ── ROW 1: Hero banner — full width ────────────────────────── */}
      <motion.div variants={item} className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-4">
        <div className="h-28 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-zinc-900" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-40 h-40 bg-teal-500/6 rounded-full blur-2xl pointer-events-none" />

        <div className="px-8 pb-6 -mt-10 flex items-end justify-between gap-4 flex-wrap">
          {/* left: avatar + identity */}
          <div className="flex items-end gap-4">
            <Avatar name={profile?.name} />
            <div className="pb-1">
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{profile?.name}</h1>
              <p className="text-sm text-zinc-500 mt-0.5">{profile?.email}</p>
              {profile?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <ShieldCheck size={10} strokeWidth={2.5} /> Verified
                </span>
              )}
            </div>
          </div>

          {/* right: action buttons */}
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.button
                key="edit-btn"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer mb-1"
              >
                <Edit3 size={13} strokeWidth={2.5} /> Edit Profile
              </motion.button>
            ) : (
              <motion.div key="save-btns" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="flex gap-2 mb-1">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} disabled={saving}
                  className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50 transition-colors">
                  <X size={13} /> Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/25 cursor-pointer disabled:opacity-60 transition-all">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  Save Changes
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── ROW 2: 2-column grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* Personal Info */}
        <motion.div variants={item} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">Personal Info</p>
          <Field
            icon={User} label="Full Name"
            value={form.name} editing={editing}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
          />
          <Field icon={Mail} label="Email Address" value={profile?.email} editing={false} locked />
        </motion.div>

        {/* Account stats */}
        <motion.div variants={item} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">Account</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 flex-1">
            <StatChip icon={Calendar}     label="Member since" value={fmt(profile?.createdAt)}  accent="bg-blue-500/15 text-blue-400" />
            <StatChip
              icon={CheckCircle2}
              label="Email status"
              value={profile?.isEmailVerified ? "Verified" : "Unverified"}
              accent={profile?.isEmailVerified ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}
            />
            <StatChip icon={Clock} label="Last updated" value={fmt(profile?.updatedAt)} accent="bg-zinc-700/60 text-zinc-400" />
          </div>
        </motion.div>

      </div>

      {/* ── ROW 3: Security — slides in only when editing ──────────── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            key="pw-card"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">Security</p>
                <button
                  onClick={() => setShowPasswordSection((v) => !v)}
                  className="text-[11px] font-semibold text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                >
                  {showPasswordSection ? "← Hide" : "Change password →"}
                </button>
              </div>

              <AnimatePresence>
                {!showPasswordSection && (
                  <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-zinc-600 mt-3">
                    Click <span className="text-zinc-500 font-medium">"Change password"</span> to update your credentials.
                  </motion.p>
                )}
                {showPasswordSection && (
                  <motion.div
                    key="pw-fields"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <Field icon={Lock}     label="Current Password" type="password" value={form.currentPassword} editing onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="••••••••" />
                    <Field icon={KeyRound} label="New Password"     type="password" value={form.newPassword}     editing onChange={(e) => setForm({ ...form, newPassword: e.target.value })}     placeholder="Min. 6 characters" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}