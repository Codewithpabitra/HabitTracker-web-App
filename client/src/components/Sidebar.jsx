import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  NotebookPen,
  Settings,
  User,
  CheckSquare,
  BarChart2,
} from "lucide-react";
import { LuPanelLeftClose } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import Logo from "../assets/Logo.png"

export default function Sidebar({ open, setOpen }) {
  const isMobile = () => window.innerWidth < 1024;

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-md font-medium mt-1
     ${isActive
       ? "bg-green-500/20 text-green-400"
       : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
     }`;

  const navItems = [
    { to: "/dashboard",                     end: true, icon: <LayoutDashboard size={18} />, label: "Dashboard"      },
    { to: "/dashboard/habits",                         icon: <CheckSquare size={18} />,     label: "Track Habits"   },
    { to: "/dashboard/journals",                       icon: <NotebookPen size={18} />,     label: "Write Journals" },
    { to: "/dashboard/your-journals",                  icon: <BookOpen size={18} />,        label: "Your Journals"  },
    { to: "/dashboard/emotional-dashboard",            icon: <BarChart2 size={18} />,       label: "Mood Insights"  },
  ];

  const accountItems = [
    { to: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" },
    { to: "/dashboard/profile",  icon: <User size={18} />,     label: "Profile"  },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && isMobile() && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: -272, opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -272, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed left-0 top-0 z-30 w-64 h-screen bg-zinc-900 flex flex-col border-r border-zinc-800 shadow-2xl shadow-black/50"
          >
            {/* Logo row */}
            <div className="flex items-center justify-between px-5 h-[60px] border-b border-zinc-800 shrink-0">
              <Link to="/" className="text-xl font-semibold tracking-tight text-white flex justify-center items-center gap-1">
                <img className="w-10 h-10" src={Logo}/>
                HabitMind
              </Link>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <LuPanelLeftClose size={18} />
              </motion.button>
            </div>

            {/* Main nav */}
            <nav className="flex flex-col gap-0.5 px-3 pt-5 flex-1">
              <p className="text-[12px] uppercase tracking-widest text-zinc-600 font-semibold px-3 mb-2">
                Menu
              </p>
              {navItems.map(({ to, end, icon, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 28 }}
                >
                  <NavLink
                    to={to}
                    end={end}
                    className={navStyle}
                    onClick={() => isMobile() && setOpen(false)}
                  >
                    <span className="shrink-0">{icon}</span>
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Bottom account section */}
            <div className="px-3 pb-4 pt-3 border-t border-zinc-800">
              <p className="text-[12px] uppercase tracking-widest text-zinc-600 font-semibold px-3 mb-2">
                Account
              </p>
              {accountItems.map(({ to, icon, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 28 }}
                >
                  <NavLink
                    to={to}
                    className={navStyle}
                    onClick={() => isMobile() && setOpen(false)}
                  >
                    <span className="shrink-0">{icon}</span>
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}