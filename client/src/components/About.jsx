import React from "react";
import InsightCard from "./InsightCard";
import { MdArrowOutward, MdOutlineInsights } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { BsStopwatch } from "react-icons/bs";
import WorkCard from "./WorkCard";

import { GrStatusGood } from "react-icons/gr";
import { GiProgression } from "react-icons/gi";
import { SiPagespeedinsights } from "react-icons/si";

const About = () => {
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
        <p className="text-center text-3xl ">
          Track your habits, write daily journals, and gain AI powered insights
          to improve productivity and build a more consistent routine
        </p>
      </div>

      <div className="mt-40 flex flex-col gap-10 ">
        <div className="mx-auto flex flex-col gap-2">
          <h1 className="text-3xl text-center">Why Choose HabitMind?</h1>
          <p className=" text-center max-w-md text-zinc-400">
            Benefits designed to provide a seamless, important, and insightful
            experience for to track your habits.
          </p>
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
          <h3 className="text-white text-2xl font-semibold">How It Works</h3>
          <p className="text-zinc-400 max-w-sm ">
            A simple, personalized, and insightful platform to improve your
            habits in just a few steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
            {works.map((item, index) => (
              <WorkCard title={item.title} icon={item.icon} desc={item.desc} />
            ))}
          </div>
        </div>
      </div>

      {/* Ready to Start */}
      <div className="mt-30 flex flex-col justify-center items-center gap-10 py-10 ">
            <div className="flex flex-col justify-center items-center gap-2 ">
                <h3 className="text-5xl text-center">Ready to take control <br /> of your habits?</h3>
            <p className="max-w-md text-center ">Join thousands of users who trust HabitMind for simple, seamless, and personalized insights of habits.</p>
            </div>
            <div>
                <button className='px-5 py-3 bg-primary text-black rounded-full flex justify-center items-center gap-1 font-semibold cursor-pointer text-sm'>Get started now<MdArrowOutward size={20} /></button>
            </div>
      </div>
    </div>
  );
};

export default About;
