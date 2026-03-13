import { useEffect, useRef, useState } from "react";
import { Trash2, Flame, Pencil, UploadCloud, X, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  getHabits,
  createHabit,
  deleteHabit,
  updateHabit,
  verifyHabitProof,
} from "../services/habit.service";

// ─── Proof Upload Modal ───────────────────────────────────────────────────────

function ProofModal({ habit, onClose, onVerified }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | failure
  const [verdict, setVerdict] = useState(null); // raw backend response data

  const handleFilePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setStatus("idle");
    setVerdict(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
    setStatus("idle");
    setVerdict(null);
  };

  const handleVerify = async () => {
    if (!file) return toast.error("Please upload an image first");

    setStatus("loading");
    setVerdict(null);

    try {
      const res = await verifyHabitProof(habit._id, file);
      const data = res.data;
      // Backend always returns 200. Check data.verified to know pass/fail.
      setVerdict(data);
      if (data.verified) {
        setStatus("success");
        onVerified(); // refresh habit list in parent
      } else {
        setStatus("failure");
      }
    } catch (err) {
      // Actual HTTP errors (400 bad file type, 404 not found, 500 crash)
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setVerdict({ comment: errMsg });
      setStatus("failure");
    }
  };

  const resetForRetry = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setVerdict(null);
    // Clear the file input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-400" />
            <h2 className="text-white font-semibold text-lg">Verify Proof</h2>
          </div>
          <button
            onClick={onClose}
            disabled={status === "loading"}
            className="text-zinc-500 hover:text-white transition cursor-pointer disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-zinc-400 text-sm">
            Upload a photo proving you completed{" "}
            <span className="text-white font-medium">"{habit.title}"</span>.
            Our AI will verify it before marking it complete.
          </p>

          {/* Drop zone — only shown while idle or loading */}
          {(status === "idle" || status === "loading") && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => status !== "loading" && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-colors
                ${
                  status === "loading"
                    ? "border-zinc-700 cursor-not-allowed opacity-60"
                    : "border-zinc-700 hover:border-green-500/60 cursor-pointer group"
                }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="proof preview"
                  className="w-full max-h-52 object-cover rounded-lg"
                />
              ) : (
                <>
                  <UploadCloud
                    size={36}
                    className="text-zinc-600 group-hover:text-green-400 transition"
                  />
                  <p className="text-zinc-400 text-sm text-center">
                    Drag & drop or{" "}
                    <span className="text-green-400">browse</span> to upload
                  </p>
                  <p className="text-zinc-600 text-xs">JPEG, PNG, or WEBP</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFilePick}
              />
            </div>
          )}

          {/* ── Success state ── */}
          {status === "success" && verdict && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle size={36} className="text-green-400" />
              </div>
              <p className="text-green-400 font-semibold text-base">
                Habit Verified! 🎉
              </p>
              {verdict.comment && (
                <p className="text-zinc-300 text-sm italic">"{verdict.comment}"</p>
              )}
              {verdict.currentStreak !== undefined && (
                <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
                  <Flame size={16} />
                  {verdict.currentStreak} day streak
                  {verdict.longestStreak !== undefined && (
                    <span className="text-zinc-400 font-normal ml-1">
                      · Best: {verdict.longestStreak}
                    </span>
                  )}
                </div>
              )}
              {verdict.confidence !== undefined && (
                <p className="text-zinc-500 text-xs">
                  Confidence: {Math.round(verdict.confidence * 100)}%
                </p>
              )}
            </div>
          )}

          {/* ── Failure state ── */}
          {status === "failure" && verdict && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center">
                <XCircle size={36} className="text-red-400" />
              </div>
              <p className="text-red-400 font-semibold text-base">
                Proof Rejected
              </p>
              {verdict.comment && (
                <p className="text-zinc-300 text-sm italic">"{verdict.comment}"</p>
              )}
              {verdict.confidence !== undefined && (
                <p className="text-zinc-500 text-xs">
                  Confidence: {Math.round(verdict.confidence * 100)}%
                </p>
              )}
              <button
                onClick={resetForRetry}
                className="mt-1 text-sm text-zinc-400 hover:text-white underline underline-offset-2 cursor-pointer transition"
              >
                Try with a different image
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-3 px-6 pb-5">
          {status === "success" ? (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-green-500 hover:bg-green-400 text-black rounded-xl font-medium transition cursor-pointer"
            >
              Done
            </button>
          ) : status === "failure" ? (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-700 rounded-xl text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={status === "loading"}
                className="px-4 py-2 border border-zinc-700 rounded-xl text-zinc-300 hover:bg-zinc-800 transition cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={!file || status === "loading"}
                className="px-5 py-2 bg-primary hover:bg-primary/80 text-black rounded-xl font-medium transition cursor-pointer disabled:opacity-40 flex items-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify & Complete"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Habits Component ────────────────────────────────────────────────────

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "daily",
    priority: "medium",
  });

  const [editingHabit, setEditingHabit] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    frequency: "daily",
    priority: "medium",
  });

  const [proofHabit, setProofHabit] = useState(null);

  const isCompletedToday = (dates = []) => {
    const today = new Date().toDateString();
    return dates.some((date) => new Date(date).toDateString() === today);
  };

  const loadHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data.data);
    } catch {
      toast.error("Failed to load habits");
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error("Habit title is required");
    try {
      setLoading(true);
      await createHabit(form);
      toast.success("Habit created 🎉");
      setForm({ title: "", description: "", frequency: "daily", priority: "medium" });
      loadHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  // Clicking the checkbox opens the proof modal instead of completing directly
  const handleCheckboxClick = (habit) => {
    if (isCompletedToday(habit.completedDates)) {
      toast("Already completed today!", { icon: "✅" });
      return;
    }
    setProofHabit(habit);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      toast.success("Habit deleted");
      loadHabits();
    } catch {
      toast.error("Failed to delete habit");
    }
  };

  const openEdit = (habit) => {
    setEditingHabit(habit._id);
    setEditForm({
      title: habit.title,
      description: habit.description || "",
      frequency: habit.frequency,
      priority: habit.priority,
    });
  };

  const handleUpdateHabit = async () => {
    if (!editForm.title.trim()) return toast.error("Habit title is required");
    try {
      setLoading(true);
      await updateHabit(editingHabit, editForm);
      toast.success("Habit updated successfully");
      setEditingHabit(null);
      loadHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">

      {/* CREATE HABIT FORM */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Create a new habit</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Read 10 pages"
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Frequency</label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
            >
              <option value="daily" className="text-black">Daily</option>
              <option value="weekly" className="text-black">Weekly</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
            >
              <option value="low" className="text-black">Low</option>
              <option value="medium" className="text-black">Medium</option>
              <option value="high" className="text-black">High</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            rows="2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description..."
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-5 bg-primary hover:bg-primary/80 cursor-pointer transition px-6 py-2 rounded-xl text-black font-medium"
        >
          Add Habit
        </button>
      </div>

      {/* HABITS LIST */}
      <div className="grid gap-4">
        {habits.map((habit) => {
          const completedToday = isCompletedToday(habit.completedDates);

          return (
            <div
              key={habit._id}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition shadow-lg"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={completedToday}
                  onChange={() => handleCheckboxClick(habit)}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />

                <div className="flex flex-col">
                  <h3
                    className={`font-semibold text-white text-lg ${
                      completedToday ? "line-through opacity-50" : ""
                    }`}
                  >
                    {habit.title}
                  </h3>

                  {habit.description && (
                    <p className="text-sm text-zinc-400">{habit.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Flame size={16} className="text-orange-500" />
                      {habit.currentStreak} day streak
                    </div>
                    <div>🏆 Best: {habit.longestStreak}</div>
                    <div className="capitalize">📅 {habit.frequency}</div>
                    <div className="capitalize">⚡ {habit.priority}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {!completedToday && (
                  <button
                    onClick={() => openEdit(habit)}
                    className="text-zinc-500 hover:text-blue-400 transition cursor-pointer"
                  >
                    <Pencil size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(habit._id)}
                  className="text-zinc-500 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROOF UPLOAD MODAL */}
      {proofHabit && (
        <ProofModal
          habit={proofHabit}
          onClose={() => setProofHabit(null)}
          onVerified={loadHabits}
        />
      )}

      {/* EDIT MODAL */}
      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Habit</h2>

            <div className="flex flex-col gap-4">
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Habit title"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <textarea
                rows="2"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <select
                value={editForm.frequency}
                onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="daily" className="text-black">Daily</option>
                <option value="weekly" className="text-black">Weekly</option>
              </select>
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="low" className="text-black">Low</option>
                <option value="medium" className="text-black">Medium</option>
                <option value="high" className="text-black">High</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingHabit(null)}
                className="px-4 py-2 border border-zinc-700 rounded-xl text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateHabit}
                className="px-5 py-2 bg-primary text-black rounded-xl font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}