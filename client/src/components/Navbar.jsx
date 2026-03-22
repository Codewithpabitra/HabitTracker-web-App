import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features",     href: "#features"   },
  { label: "AI",           href: "#ai"          },
  { label: "How It Works", href: "#how-it-works"},
];

const Navbar = () => {
  const { token }   = useContext(AuthContext);
  const navigate    = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCTA = () => {
    setOpen(false);
    token ? navigate("/dashboard") : navigate("/login");
  };

  return (
    <header className="w-full px-4 sm:px-6 py-4 fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-transparent">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-black tracking-tight text-primary">
          HabitMind
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={handleCTA}
            className="px-5 py-2 bg-primary text-black rounded-full font-semibold cursor-pointer text-sm shadow-[0_0_15px_var(--color-primary)] hover:scale-105 hover:shadow-[0_0_25px_var(--color-primary)] transition-all duration-300"
          >
            Explore Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {navLinks.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              {/* divider */}
              <div className="my-1 border-t border-zinc-800" />

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <button
                  onClick={handleCTA}
                  className="w-full px-4 py-2.5 bg-primary text-black rounded-xl font-semibold text-sm cursor-pointer shadow-[0_0_12px_var(--color-primary)] hover:opacity-90 transition-all duration-200"
                >
                  Explore Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;