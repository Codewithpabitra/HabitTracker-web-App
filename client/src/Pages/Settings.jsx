import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Trash2,
  Loader2,
  Check,
  CalendarDays,
  Bot,
  AlertTriangle,
  X,
  ChevronRight,
  Flame,
  Minus,
  Zap,
} from "lucide-react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ── animation variants ─────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 22 } },
};

/* ── OptionPill ─────────────────────────────────────────────────── */
function OptionPill({ label, sublabel, selected, onClick, icon: Icon, accent }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer
        ${selected
          ? `bg-green-500/10 border-green-500/50 shadow-sm shadow-green-500/10`
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
        }`}
    >
      {Icon && (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 ${selected ? accent : "bg-zinc-800 text-zinc-500"}`}>
          <Icon size={14} strokeWidth={2.5} />
        </div>
      )}
      <p className={`text-sm font-semibold ${selected ? "text-white" : "text-zinc-400"}`}>{label}</p>
      {sublabel && <p className="text-[11px] text-zinc-600 leading-snug">{sublabel}</p>}
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={9} strokeWidth={3} className="text-black" />
        </span>
      )}
    </motion.button>
  );
}

/* ── SectionCard ────────────────────────────────────────────────── */
function SectionCard({ title, description, children }) {
  return (
    <motion.div variants={item} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="mb-5">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      </div>
      {children}
    </motion.div>
  );
}

/* ── Delete Confirm Modal ───────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.7)" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="bg-zinc-900 border border-red-500/20 rounded-3xl p-7 w-full max-w-sm shadow-2xl shadow-red-500/10"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h2 className="text-lg font-black text-white mb-2">Delete Account</h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          This will permanently delete your account, all habits, journal entries, and AI data.
          <span className="text-red-400 font-semibold"> This cannot be undone.</span>
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function Settings() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({ weekStartDay: "monday", coachTone: "motivational" });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/settings");
      setSettings(res.data?.data ?? { weekStartDay: "monday", coachTone: "motivational" });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put("/settings", settings);
      toast.success("Settings saved");
      setDirty(false);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const res  = await API.get("/settings/export");
      const d    = res.data;

      const lines = [
        "╔══════════════════════════════════════╗",
        "         YOUR HABITMIND DATA EXPORT      ",
        "╚══════════════════════════════════════╝",
        "",
        `Exported on   : ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`,
        `Name          : ${d.account.name}`,
        `Email         : ${d.account.email}`,
        `Member since  : ${new Date(d.account.memberSince).toLocaleDateString("en-US", { dateStyle: "long" })}`,
        "",
        "──────────────────────────────────────",
        " PREFERENCES",
        "──────────────────────────────────────",
        `Week starts on : ${d.account.settings?.weekStartDay ?? "Monday"}`,
        `Coach tone     : ${d.account.settings?.coachTone ?? "Motivational"}`,
        "",
        "──────────────────────────────────────",
        ` HABITS  (${d.summary.totalHabits} total)`,
        "──────────────────────────────────────",
        ...d.habits.flatMap((h, i) => [
          `${i + 1}. ${h.name}`,
          h.description ? `   Description  : ${h.description}` : null,
          `   Current streak : ${h.currentStreak} day${h.currentStreak !== 1 ? "s" : ""}`,
          `   Longest streak : ${h.longestStreak} day${h.longestStreak !== 1 ? "s" : ""}`,
          `   Proof required : ${h.proofRequired ? "Yes" : "No"}`,
          `   Created        : ${new Date(h.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}`,
          "",
        ]).filter(Boolean),
        "──────────────────────────────────────",
        ` JOURNAL ENTRIES  (${d.summary.totalJournalEntries} total)`,
        "──────────────────────────────────────",
        ...d.journals.flatMap((j, i) => [
          `Entry ${i + 1}  —  ${new Date(j.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}`,
          j.sentiment ? `Mood    : ${j.sentiment}` : null,
          j.themes?.length ? `Themes  : ${j.themes.join(", ")}` : null,
          "",
          j.content,
          "",
          "- - - - - - - - - - - - - - - - - -",
          "",
        ]).filter(Boolean),
        "══════════════════════════════════════",
        "  End of export — HabitMind",
        "══════════════════════════════════════",
      ];

      const text = lines.join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `habitmind-export-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await API.delete("/settings/account");
      setToken(null);
      localStorage.removeItem("token");
      toast.success("Account deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
        <p className="text-zinc-500 text-xs tracking-widest uppercase">Loading…</p>
      </div>
    </div>
  );

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto py-8 px-4">

        {/* Page header */}
        <motion.div variants={item} className="mb-7">
          <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your preferences and account data.</p>
        </motion.div>

        <div className="space-y-4">

          {/* ── Week Start Day ──────────────────────────────────── */}
          <SectionCard
            title="Week Start Day"
            description="Affects how streaks and your habit calendar are calculated."
          >
            <div className="flex gap-3">
              <OptionPill
                label="Monday"
                sublabel="ISO standard"
                icon={CalendarDays}
                accent="bg-blue-500/15 text-blue-400"
                selected={settings.weekStartDay === "monday"}
                onClick={() => update("weekStartDay", "monday")}
              />
              <OptionPill
                label="Sunday"
                sublabel="US / traditional"
                icon={CalendarDays}
                accent="bg-purple-500/15 text-purple-400"
                selected={settings.weekStartDay === "sunday"}
                onClick={() => update("weekStartDay", "sunday")}
              />
            </div>
          </SectionCard>

          {/* ── Coach Tone ──────────────────────────────────────── */}
          <SectionCard
            title="Accountability Coach Tone"
            description="How the AI coach communicates when you miss habits."
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <OptionPill
                label="Motivational"
                sublabel="Encouraging and positive"
                icon={Flame}
                accent="bg-orange-500/15 text-orange-400"
                selected={settings.coachTone === "motivational"}
                onClick={() => update("coachTone", "motivational")}
              />
              <OptionPill
                label="Neutral"
                sublabel="Factual and direct"
                icon={Minus}
                accent="bg-zinc-600/40 text-zinc-400"
                selected={settings.coachTone === "neutral"}
                onClick={() => update("coachTone", "neutral")}
              />
              <OptionPill
                label="Ruthless"
                sublabel="No mercy, no excuses"
                icon={Zap}
                accent="bg-red-500/15 text-red-400"
                selected={settings.coachTone === "ruthless"}
                onClick={() => update("coachTone", "ruthless")}
              />
            </div>
          </SectionCard>

          {/* ── Save button ─────────────────────────────────────── */}
          <AnimatePresence>
            {dirty && (
              <motion.div
                key="save-bar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-green-500/20 cursor-pointer disabled:opacity-60 transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Save Changes
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Export Data ─────────────────────────────────────── */}
          <SectionCard
            title="Export Your Data"
            description="Download all your habits, journal entries, and AI mood data as a text file."
          >
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {exporting
                ? <Loader2 size={15} className="animate-spin" />
                : <Download size={15} />
              }
              {exporting ? "Exporting…" : "Download My Data"}
              <ChevronRight size={13} className="ml-auto text-zinc-600" />
            </motion.button>
          </SectionCard>

          {/* ── Danger Zone ─────────────────────────────────────── */}
          <motion.div
            variants={item}
            className="bg-zinc-900 border border-red-500/15 rounded-3xl p-6"
          >
            <div className="mb-5">
              <p className="text-sm font-bold text-red-400">Danger Zone</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Permanent actions that cannot be reversed.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Delete Account</p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Removes your account, habits, journals, and all AI data permanently.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Trash2 size={14} />
                Delete Account
              </motion.button>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}