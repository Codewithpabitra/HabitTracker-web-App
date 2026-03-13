import { useEffect, useState } from "react";
import { Trash2, Flame, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import {
  getHabits,
  createHabit,
  deleteHabit,
  completeHabit,
  updateHabit,
} from "../services/habit.service";

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

  const isCompletedToday = (dates = []) => {
    const today = new Date().toDateString();

    return dates.some((date) => {
      return new Date(date).toDateString() === today;
    });
  };

  const loadHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data.data);
    } catch (err) {
      toast.error("Failed to load habits");
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleCreate = async () => {

    if (!form.title.trim()) {
      return toast.error("Habit title is required");
    }

    try {
      setLoading(true);

      await createHabit(form);

      toast.success("Habit created 🎉");

      setForm({
        title: "",
        description: "",
        frequency: "daily",
        priority: "medium",
      });

      loadHabits();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (habit) => {

    if (isCompletedToday(habit.completedDates)) {
      toast.error("Habit already completed today");
      return;
    }

    try {
      await completeHabit(habit._id);

      toast.success("Habit completed 🎉");

      loadHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete habit");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);

      toast.success("Habit deleted");

      loadHabits();
    } catch (err) {
      toast.error("Failed to delete habit");
    }
  };

  const openEdit = (habit) => {

    if (isCompletedToday(habit.completedDates)) return;

    setEditingHabit(habit._id);

    setEditForm({
      title: habit.title,
      description: habit.description || "",
      frequency: habit.frequency,
      priority: habit.priority,
    });
  };

  const closeEdit = () => {
    setEditingHabit(null);
  };

  const handleUpdateHabit = async () => {

    if (!editForm.title.trim()) {
      return toast.error("Habit title is required");
    }

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

        <h2 className="text-xl font-semibold text-white mb-4">
          Create a new habit
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Title *</label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Read 10 pages"
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Frequency</label>

            <select
              value={form.frequency}
              onChange={(e) =>
                setForm({ ...form, frequency: e.target.value })
              }
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
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
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
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
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
                  onChange={() => handleComplete(habit)}
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
                    <p className="text-sm text-zinc-400">
                      {habit.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">

                    <div className="flex items-center gap-1">
                      <Flame size={16} className="text-orange-500" />
                      {habit.currentStreak} day streak
                    </div>

                    <div>
                      🏆 Best: {habit.longestStreak}
                    </div>

                    <div className="capitalize">
                      📅 {habit.frequency}
                    </div>

                    <div className="capitalize">
                      ⚡ {habit.priority}
                    </div>

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

      {/* EDIT MODAL */}

      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-lg">

            <h2 className="text-xl font-semibold text-white mb-4">
              Edit Habit
            </h2>

            <div className="flex flex-col gap-4">

              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Habit title"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              />

              <textarea
                rows="2"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
              />

              <select
                value={editForm.frequency}
                onChange={(e) =>
                  setEditForm({ ...editForm, frequency: e.target.value })
                }
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="daily" className="text-black">Daily</option>
                <option value="weekly" className="text-black">Weekly</option>
              </select>

              <select
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="low" className="text-black">Low</option>
                <option value="medium" className="text-black">Medium</option>
                <option value="high" className="text-black">High</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={closeEdit}
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