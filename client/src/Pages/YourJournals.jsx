import { useEffect, useState } from "react";
import { Trash2, Pencil, NotebookPen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getJournals,
  updateJournal,
  deleteJournal,
} from "../services/journal.service";

export default function YourJournals() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });

  const moodStyles = {
    happy: "bg-green-500/20 text-green-400 border-green-500/30",
    neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    sad: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    productive: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    stressed: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const moodEmoji = {
    happy: "😊",
    neutral: "😐",
    sad: "😔",
    productive: "🚀",
    stressed: "😵",
  };

  const loadJournals = async () => {
    try {
      setAiLoading(true);
      const res = await getJournals();
      setJournals(res.data.data);
    } catch (err) {
      toast.error("Failed to load journals");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJournal(id);
      toast.success("Journal deleted");
      loadJournals();
    } catch (err) {
      toast.error("Failed to delete journal");
    }
  };

  const openEdit = (journal) => {
    setEditing(journal._id);
    setForm({
      title: journal.title || "",
      content: journal.content || "",
      mood: journal.mood || "neutral",
    });
  };

  const closeModal = () => setEditing(null);

  const handleUpdate = async () => {
    if (!form.content.trim()) return toast.error("Content cannot be empty");

    try {
      setLoading(true);
      await updateJournal(editing, form);
      toast.success("Journal updated");

      setEditing(null);
      loadJournals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-white">Your Journals</h2>

      {journals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-zinc-400">
          <NotebookPen size={48} className="mb-4 opacity-70" />
          <h3 className="text-lg font-semibold text-zinc-300">
            You Have No Journals Yet
          </h3>
          <p className="text-sm mt-1 text-zinc-500">
            Create your first one to start reflecting on your day.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {journals.map((j) => (
            <div
              key={j._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow hover:border-zinc-700 transition"
            >
              {j.title && (
                <h3 className="text-lg font-semibold text-white mb-1">
                  {j.title}
                </h3>
              )}

              <p className="text-zinc-300 whitespace-pre-wrap">{j.content}</p>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full border font-medium capitalize ${moodStyles[j.mood]}`}
                >
                  {moodEmoji[j.mood]} {j.mood}
                </span>

                <div className="flex items-center gap-3">
                  {/* Edit button disabled if AI analysis or completed */}
                  <button
                    onClick={() => openEdit(j)}
                    disabled={loading || j.aiInsights?.sentiment === "Positive"} // example: lock edit if sentiment analyzed
                    className={`${
                      loading || j.aiInsights?.sentiment
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-blue-400 cursor-pointer"
                    } text-zinc-400 transition`}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(j._id)}
                    className="text-zinc-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* AI Insights */}
              {aiLoading ? (
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Analyzing...</span>
                </div>
              ) : (
                j.aiInsights && (
                  <div className="mt-2 text-sm text-zinc-400">
                    <div>Sentiment: {j.aiInsights.sentiment}</div>
                    {j.aiInsights.themes?.length > 0 && (
                      <div>Themes: {j.aiInsights.themes.join(", ")}</div>
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">
              Edit Journal
            </h3>

            {/* TITLE */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm text-zinc-400">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </div>

            {/* MOOD */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm text-zinc-400">Mood</label>
              <select
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                <option value="happy" className="text-black">
                  😊 Happy
                </option>
                <option value="neutral" className="text-black">
                  😐 Neutral
                </option>
                <option value="sad" className="text-black">
                  😔 Sad
                </option>
                <option value="productive" className="text-black">
                  🚀 Productive
                </option>
                <option value="stressed" className="text-black">
                  😵 Stressed
                </option>
              </select>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-2 mb-5">
              <label className="text-sm text-zinc-400">Content</label>
              <textarea
                rows="4"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-primary text-black font-medium hover:bg-primary/80 cursor-pointer"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}