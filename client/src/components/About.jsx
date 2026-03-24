import React, { useContext } from "react";
import InsightCard from "./InsightCard";
import { MdArrowOutward, MdOutlineInsights } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { BsStopwatch } from "react-icons/bs";
import WorkCard from "./WorkCard";
import { GrStatusGood } from "react-icons/gr";
import { GiProgression } from "react-icons/gi";
import { SiPagespeedinsights } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "motion/react";

const text =
  "Track your habits, write daily journals, and gain AI powered insights to improve productivity and build a more consistent routine";
const words = text.split(" ");

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const child = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

const About = () => {
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();

  const insights = [
    { title: "AI Habit Insights", icon: <MdOutlineInsights size={20} /> },
    { title: "Daily Journaling",  icon: <FaPen size={20} /> },
    { title: "Streak Tracking",   icon: <BsStopwatch size={20} /> },
  ];

  const works = [
    { title: "Create your habits.",      desc: "Easily define and customize daily and weekly habits in a guided setup flow.",                  icon: <GrStatusGood size={20} /> },
    { title: "Track daily progress.",    desc: "Visually tick off habits each day and record personal journal entries in one place.",          icon: <GiProgression size={20} /> },
    { title: "Get AI-powered insights.", desc: "Receive actionable feedback, trend analysis, and motivational prompts powered by AI.",        icon: <SiPagespeedinsights size={20} /> },
  ];

  return (
    <div className="mt-20 sm:mt-28 md:mt-30 px-4 sm:px-6 lg:px-8">

      {/* ── Animated tagline ──────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto">
        <motion.p
          className="text-center text-xl sm:text-2xl md:text-3xl flex flex-wrap justify-center gap-1.5 sm:gap-2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {words.map((word, index) => (
            <motion.span key={index} className="inline-block" variants={child}>
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>

      {/* ── Why Choose HabitMind ──────────────────────────────────── */}
      <div id="features" className="mt-24 sm:mt-32 md:mt-40 flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl"
          >
            Why Choose HabitMind?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-sm sm:text-base text-zinc-400 max-w-xs sm:max-w-md mx-auto"
          >
            Benefits designed to provide a seamless, important, and insightful
            experience for to track your habits.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 md:gap-10 justify-items-center">
          {insights.map((item, index) => (
            <InsightCard key={index} icon={item.icon} title={item.title} />
          ))}
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <div id="how-it-works" className="mt-20 sm:mt-24 md:mt-30 py-8 sm:py-10 relative">
        <div
          className="absolute inset-0
            bg-[linear-gradient(to_right,var(--color-zinc-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-zinc-800)_1px,transparent_1px)]
            bg-size-[40px_40px]
            mask-[radial-gradient(ellipse_at_center,white,transparent_90%)]"
        />

        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-white text-xl sm:text-2xl font-semibold"
          >
            How It Works
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-zinc-400 text-sm sm:text-base max-w-xs sm:max-w-sm mt-1"
          >
            A simple, personalized, and insightful platform to improve your
            habits in just a few steps.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 md:gap-10 mt-5 sm:mt-6">
            {works.map((item, index) => (
              <WorkCard key={index} index={index} title={item.title} icon={item.icon} desc={item.desc} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Ready to Start ───────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 md:mt-30 flex flex-col justify-center items-center gap-8 sm:gap-10 py-8 sm:py-10">
        <div className="flex flex-col items-center gap-3 text-center px-2">
          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl"
          >
            Ready to take control{" "}
            <br className="hidden sm:block" />
            of your habits?
          </motion.h3>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-sm sm:text-base max-w-xs sm:max-w-md text-zinc-400"
          >
            Join thousands of users who trust HabitMind for simple, seamless,
            and personalized insights of habits.
          </motion.p>
        </div>

        <motion.button
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => token ? navigate("/dashboard") : navigate("/login")}
          className="px-6 py-3 bg-primary text-black rounded-full flex items-center gap-1.5 font-semibold cursor-pointer text-sm shadow-[0_0_15px_var(--color-primary)] transition-all duration-200"
        >
          {token ? "Dashboard" : "Get started now"}
          <MdArrowOutward size={18} />
        </motion.button>
      </div>

    </div>
  );
};

export default About;