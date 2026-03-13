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
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

const About = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const insights = [
    {
      title: "AI Habit Insights",
      icon: <MdOutlineInsights size={20} />,
    },
    {
      title: "Daily Journaling",
      icon: <FaPen size={20} />,
    },
    {
      title: "Streak Tracking",
      icon: <BsStopwatch size={20} />,
    },
    // {
    //     title : "Weekly Reflection",
    //     icon : <MdOutlineInsights size={20} />
    // }
  ];

  const works = [
    {
      title: "Create your habits.",
      desc: "Easily define and customize daily and weekly habits in a guided setup flow.",
      icon: <GrStatusGood size={20} />,
    },
    {
      title: "Track daily progress.",
      desc: "Visually tick off habits each day and record personal journal entries in one place.",
      icon: <GiProgression size={20} />,
    },
    {
      title: "Get AI-powered insights.",
      desc: "Receive actionable feedback, trend analysis, and motivational prompts powered by AI.",
      icon: <SiPagespeedinsights size={20} />,
    },
  ];

  return (
    <div className="mt-30 ">
      <div className="max-w-2xl mx-auto">
        <motion.p
          className="text-center text-3xl flex flex-wrap justify-center gap-2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} // triggers when 50% visible
        >
          {words.map((word, index) => (
            <motion.span key={index} className="inline-block" variants={child}>
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>

      <div className="mt-40 flex flex-col gap-10 ">
        <div className="mx-auto flex flex-col gap-2">
          <motion.h1
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.6,
            }}
            className="text-3xl text-center"
          >
            Why Choose HabitMind?
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
            }}
            className=" text-center max-w-md text-zinc-400"
          >
            Benefits designed to provide a seamless, important, and insightful
            experience for to track your habits.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {insights.map((item, index) => (
            <InsightCard key={index} icon={item.icon} title={item.title} />
          ))}
        </div>
      </div>

      {/* How It works  */}
      <div className="mt-30 h-auto py-10 relative ">
        {/* Grid background */}
        <div
          className="absolute inset-0
    bg-[linear-gradient(to_right,var(--color-zinc-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-zinc-800)_1px,transparent_1px)]
    bg-size-[40px_40px]
    mask-[radial-gradient(ellipse_at_center,white,transparent_90%)]"
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.6,
            }}
            className="text-white text-2xl font-semibold"
          >
            How It Works
          </motion.h3>
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
            }}
            className="text-zinc-400 max-w-sm "
          >
            A simple, personalized, and insightful platform to improve your
            habits in just a few steps.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
            {works.map((item, index) => (
              <WorkCard
                key={index}
                title={item.title}
                icon={item.icon}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ready to Start */}
      <div className="mt-30 flex flex-col justify-center items-center gap-10 py-10 ">
        <div className="flex flex-col justify-center items-center gap-2 ">
          <motion.h3
            initial={{
              y: 10,
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.6,
            }}
            className="text-5xl text-center"
          >
            Ready to take control <br /> of your habits?
          </motion.h3>
          <motion.p
          initial={{
              y: 10,
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
            }}
          className="max-w-md text-center ">
            Join thousands of users who trust HabitMind for simple, seamless,
            and personalized insights of habits.
          </motion.p>
        </div>
        <div>
          <motion.button
          initial={{
              y: 10,
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 1,
            }}
            onClick={() =>
              token ? navigate("/dashboard") : navigate("/login")
            }
            className="px-5 py-3 bg-primary text-black rounded-full flex justify-center items-center gap-1 font-semibold cursor-pointer text-sm"
          >
            {token ? "Dashboard" : "Get started now"}
            <MdArrowOutward size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default About;
