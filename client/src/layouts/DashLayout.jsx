import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuPanelLeftClose } from "react-icons/lu";
import Sidebar from "../components/Sidebar";
import DashNavbar from "../components/DashNavbar";
import { Outlet } from "react-router-dom";

export default function DashLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen">

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Floating open button — always mounted, only visible when sidebar is closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            key="open-btn"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xl"
            aria-label="Open sidebar"
          >
            <LuPanelLeftClose size={20} className="rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main content — shifts right when sidebar is open on desktop */}
      <motion.div
        animate={{ marginLeft: sidebarOpen && window.innerWidth >= 1024 ? 256 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="flex flex-col min-h-screen text-neutral-300"
      >
        <DashNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </motion.div>

    </div>
  );
}