import { useState } from "react";
import toast from "react-hot-toast";
import { createJournal } from "../services/journal.service";

export default function Journals() {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });

  const create = async () => {

    if (!form.content.trim()) {
      return toast.error("Journal content is required");
    }

    if (form.content.length < 10) {
      return toast.error("Journal must be at least 10 characters");
    }

    try {

      setLoading(true);

      await createJournal(form);

      toast.success("Journal saved ✨");

      setForm({
        title: "",
        content: "",
        mood: "neutral",
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Failed to create journal entry"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 ">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">

        <h2 className="text-2xl font-semibold text-white mb-4">
          Write Journal
        </h2>

        {/* TITLE */}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-zinc-400">
            Title (optional)
          </label>

          <input
            value={form.title}
            maxLength={120}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Today was a productive day..."
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* MOOD */}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-zinc-400">
            Mood
          </label>

          <select
            value={form.mood}
            onChange={(e) =>
              setForm({ ...form, mood: e.target.value })
            }
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
          >
            <option value="happy" className="text-black">😊 Happy</option>
            <option value="neutral"  className="text-black">😐 Neutral</option>
            <option value="sad"  className="text-black">😔 Sad</option>
            <option value="productive"  className="text-black">🚀 Productive</option>
            <option value="stressed"  className="text-black">😵 Stressed</option>
          </select>
        </div>

        {/* CONTENT */}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-zinc-400">
            Journal Entry *
          </label>

          <textarea
            rows="6"
            maxLength={5000}
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="Write your thoughts..."
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={create}
          disabled={loading}
          className="bg-primary hover:bg-primary/80 cursor-pointer transition px-6 py-2 rounded-xl text-black font-medium"
        >
          {loading ? "Saving..." : "Save Entry"}
        </button>

      </div>

    </div>
  );
}