import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  NotebookPen,
  Settings,
  User,
  CheckSquare
} from "lucide-react";

export default function Sidebar() {
  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded transition
     ${
       isActive
         ? "bg-green-500/20 text-green-400"
         : "hover:bg-zinc-800 text-zinc-300"
     }`;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-zinc-900 text-white flex flex-col border-r border-zinc-800">

      {/* LOGO */}
      <Link to="/" className="px-6 py-5 text-xl text-primary font-bold">
        HabitMind
      </Link>

      {/* MENU */}
      <div className="flex flex-col gap-2 p-6">

        {/* Dashboard */}
        <NavLink to="/dashboard" end className={navStyle}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {/* Track Habits */}
        <NavLink to="/dashboard/habits" className={navStyle}>
          <CheckSquare size={18} />
          Track Habits
        </NavLink>

        {/* Write Journals */}
        <NavLink to="/dashboard/journals" className={navStyle}>
          <NotebookPen size={18} />
          Write Journals
        </NavLink>

        {/* Your Journals */}
        <NavLink to="/dashboard/your-journals" className={navStyle}>
          <BookOpen size={18} />
          Your Journals
        </NavLink>

      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-auto px-6 py-3 flex flex-col gap-2 border-t border-zinc-800">

        <button className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 text-zinc-300 transition">
          <Settings size={18} />
          Settings
        </button>

        <button className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 text-zinc-300 transition">
          <User size={18} />
          Profile
        </button>

      </div>

    </div>
  );
}