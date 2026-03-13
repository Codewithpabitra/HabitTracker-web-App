import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Flame,
  NotebookPen,
  Activity
} from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getHabits } from "../services/habit.service";
import { getJournals } from "../services/journal.service";

export default function Dashboard() {

  const [habits, setHabits] = useState([]);
  const [journals, setJournals] = useState([]);

  const isCompletedToday = (dates = []) => {
    const today = new Date().toDateString();
    return dates.some((d) => new Date(d).toDateString() === today);
  };

  const loadHabits = async () => {
    const res = await getHabits();
    setHabits(res.data.data);
  };

  const loadJournals = async () => {
    const res = await getJournals();
    setJournals(res.data.data);
  };

  useEffect(() => {
    loadHabits();
    loadJournals();
  }, []);

  const completedToday = habits.filter((h) =>
    isCompletedToday(h.completedDates)
  ).length;

  const totalStreak = habits.reduce(
    (acc, h) => acc + h.currentStreak,
    0
  );

  const heatmapData = habits.flatMap((habit) =>
    habit.completedDates.map((date) => ({
      date,
      count: 1
    }))
  );

  const cards = [
    {
      title: "Completed Today",
      value: completedToday,
      icon: CheckCircle2,
      desc: "Habits finished today",
      color: "text-green-400"
    },
    {
      title: "Active Habits",
      value: habits.length,
      icon: Activity,
      desc: "Habits you're tracking",
      color: "text-blue-400"
    },
    {
      title: "Total Streak",
      value: totalStreak,
      icon: Flame,
      desc: "Days of consistency",
      color: "text-orange-400"
    },
    {
      title: "Journal Entries",
      value: journals.length,
      icon: NotebookPen,
      desc: "Reflect your thoughts",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="flex flex-col gap-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">
          Track your progress and build powerful habits.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-zinc-400 text-sm">
                  {card.title}
                </div>
                <Icon className={card.color} size={22} />
              </div>
              <div className="text-3xl font-bold text-white">
                {card.value}
              </div>
              <p className="text-xs text-zinc-500">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* HABIT INSIGHT TABLE */}
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-5">
          Habit Insights
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-zinc-300">
            <thead className="text-zinc-400 text-sm">
              <tr>
                <th className="py-3">Habit</th>
                <th>Current Streak</th>
                <th>Best Streak</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr
  key={h._id}
  className="hover:bg-zinc-800/40 transition rounded-lg cursor-pointer"
>
  <td className="py-3 rounded-l-xl">
    <div className="px-4 font-medium">{h.title}</div>
  </td>
  <td className="py-3">
    <div className="px-4 text-orange-400">🔥 {h.currentStreak}</div>
  </td>
  <td className="py-3">
    <div className="px-4">🏆 {h.longestStreak}</div>
  </td>
  <td className="py-3">
    <div className="px-4 capitalize">{h.frequency}</div>
  </td>
  <td className="py-3 rounded-r-xl">
    <div className="px-4 capitalize">{h.priority}</div>
  </td>
</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HABIT HEATMAP */}
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">
          Habit Completion Heatmap
        </h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return "color-empty";
              return "color-scale-4";
            }}
          />
        </div>
      </div>
    </div>
  );
}